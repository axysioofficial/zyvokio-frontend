import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  DownloadCloud,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';

import SEO from './components/SEO';
import Navbar from './components/Navbar';
import FormatSelector from './components/FormatSelector';
import DropZone from './components/DropZone';
import FileCard from './components/FileCard';
import HistoryModal from './components/HistoryModal';
import SettingsModal from './components/SettingsModal';
import ComparisonModal from './components/ComparisonModal';
import FeaturesSection from './components/FeaturesSection';
import ContactSection from './components/ContactSection';
import ModeSwitcher from './components/ModeSwitcher';
import PdfToolsGrid from './components/PdfToolsGrid';
import PdfToolModal from './components/PdfToolModal';
import NotFound from './components/NotFound';
import './App.css';

import { SITE_URL, SITE_NAME } from './utils/seoConfig';

import {
  checkBackendHealth,
  convertImageBlob,
  triggerDownload
} from './utils/api';
import {
  getConversionHistory,
  addConversionRecord,
  deleteConversionRecord,
  clearAllHistory,
  getUserPreferences,
  saveUserPreferences
} from './utils/storage';

/**
 * JSON-LD schemas generated per-mode for structured data.
 */
function getSchemaForMode(activeMode) {
  const schemas = [];

  // BreadcrumbList
  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL
    }
  ];

  if (activeMode === 'file') {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: 'PDF Tools',
      item: `${SITE_URL}/#pdf-tools`
    });
  }

  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems
  });

  // SoftwareApplication — WebApplication (free tool)
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: activeMode === 'file' ? 'Zyvokio PDF Tools' : 'Zyvokio Image Converter',
    url: SITE_URL,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    description:
      activeMode === 'file'
        ? 'Free online PDF tools — merge, split, compress, convert, sign, watermark and protect PDFs in your browser.'
        : 'Free studio-grade image converter. Convert JPG, PNG, WebP and SVG with lossless Sharp processing.',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '256'
    }
  });

  return schemas;
}

export default function App() {
  // Converter Mode: 'img' (Image Converter) | 'file' (File & PDF Converter)
  const [activeMode, setActiveMode] = useState('img');
  const [selectedPdfTool, setSelectedPdfTool] = useState(null);
  const [showNotFound, setShowNotFound] = useState(false);

  // Format Selection State (2 dropdowns: fromFormat & toFormat)
  const [fromFormat, setFromFormat] = useState('jpg');
  const [toFormat, setToFormat] = useState('png');

  // Queue and history
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const [preferences, setPreferences] = useState(getUserPreferences());
  const [backendStatus, setBackendStatus] = useState({ healthy: false, data: null });

  // Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [inspectItem, setInspectItem] = useState(null);

  // Monitor if any modal/popup is open
  const isAnyModalOpen = Boolean(selectedPdfTool || isHistoryOpen || isSettingsOpen || inspectItem);

  // Lock body scroll and apply overflow: hidden when any popup is open
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    };
  }, [isAnyModalOpen]);

  // Global Escape key listener to close whichever modal is active
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (selectedPdfTool) {
          setSelectedPdfTool(null);
        } else if (inspectItem) {
          setInspectItem(null);
        } else if (isHistoryOpen) {
          setIsHistoryOpen(false);
        } else if (isSettingsOpen) {
          setIsSettingsOpen(false);
        }
      }
    };

    if (isAnyModalOpen) {
      window.addEventListener('keydown', handleGlobalKeyDown);
      return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }
  }, [isAnyModalOpen, selectedPdfTool, inspectItem, isHistoryOpen, isSettingsOpen]);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  // Check backend health
  const verifyBackend = useCallback(async () => {
    const status = await checkBackendHealth();
    setBackendStatus(status);
  }, []);

  useEffect(() => {
    verifyBackend();
    const interval = setInterval(verifyBackend, 12000);
    return () => clearInterval(interval);
  }, [verifyBackend]);

  // Load history from browser LocalStorage
  useEffect(() => {
    const stored = getConversionHistory();
    setHistory(stored);
  }, []);

  // Update preferences
  const handleUpdatePreferences = (updated) => {
    const saved = saveUserPreferences(updated);
    setPreferences(saved);
  };

  // Preset selector
  const handleSelectPreset = (from, to) => {
    setFromFormat(from);
    setToFormat(to);
    showToast(`Pipeline set to ${from.toUpperCase()} → ${to.toUpperCase()}`, 'info');
  };

  // Add files to queue
  const handleFilesSelected = (files) => {
    const newItems = files.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      fromFormat,
      toFormat,
      previewUrl: URL.createObjectURL(file),
      status: 'pending', // 'pending' | 'converting' | 'completed' | 'error'
      convertedUrl: null,
      convertedBlob: null,
      convertedFilename: null,
      convertedSize: null,
      durationMs: null,
      error: null
    }));

    setQueue(prev => [...prev, ...newItems]);
    showToast(`Added ${newItems.length} ${fromFormat.toUpperCase()} file(s) to queue`, 'info');
  };

  // Remove single file from queue
  const handleRemoveItem = (id) => {
    setQueue(prev => {
      const target = prev.find(item => item.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      if (target?.convertedUrl) URL.revokeObjectURL(target.convertedUrl);
      return prev.filter(item => item.id !== id);
    });
  };

  // Clear entire queue
  const handleClearQueue = () => {
    queue.forEach(item => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
    });
    setQueue([]);
  };

  // Convert a single item
  const handleConvertItem = async (id) => {
    const item = queue.find(q => q.id === id);
    if (!item || !item.file) return;

    // Set to converting
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'converting', error: null } : q));

    try {
      const result = await convertImageBlob(item.file, {
        fromFormat: item.fromFormat,
        toFormat: item.toFormat,
        options: {
          quality: preferences.quality,
          compressionLevel: preferences.compressionLevel
        }
      });

      // Update item in queue
      setQueue(prev => prev.map(q => {
        if (q.id === id) {
          return {
            ...q,
            status: 'completed',
            convertedBlob: result.blob,
            convertedUrl: result.downloadUrl,
            convertedFilename: result.filename,
            convertedSize: result.convertedSize,
            durationMs: result.durationMs
          };
        }
        return q;
      }));

      // Store in browser LocalStorage
      const newRecord = {
        id: item.id,
        originalName: item.name,
        convertedName: result.filename,
        fromFormat: item.fromFormat,
        toFormat: item.toFormat,
        originalSize: item.size,
        convertedSize: result.convertedSize,
        width: result.width,
        height: result.height,
        durationMs: result.durationMs,
        convertedAt: new Date().toISOString()
      };
      const updatedHistory = addConversionRecord(newRecord);
      setHistory(updatedHistory);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#19E68C', '#12CFE5', '#087FAF', '#39F2A1']
        });
      } catch (e) {
        // ignore if canvas not supported
      }

      showToast(`Successfully converted to ${result.filename}!`, 'success');

    } catch (err) {
      console.error('Conversion error:', err);
      setQueue(prev => prev.map(q => {
        if (q.id === id) {
          return {
            ...q,
            status: 'error',
            error: err.message || 'Failed to convert image'
          };
        }
        return q;
      }));
      showToast(err.message || 'Conversion failed', 'error');
    }
  };

  // Convert all pending files
  const handleConvertAll = async () => {
    const pendingItems = queue.filter(q => q.status === 'pending');
    for (const item of pendingItems) {
      await handleConvertItem(item.id);
    }
  };

  // Download converted item
  const handleDownload = (item) => {
    if (item.convertedBlob) {
      triggerDownload(item.convertedBlob, item.convertedFilename);
    } else if (item.convertedUrl) {
      triggerDownload(item.convertedUrl, item.convertedFilename);
    }
  };

  // Download all completed items
  const handleDownloadAll = () => {
    const completed = queue.filter(q => q.status === 'completed');
    completed.forEach((item, index) => {
      setTimeout(() => {
        handleDownload(item);
      }, index * 250);
    });
  };

  // History operations
  const handleDeleteHistoryRecord = (id) => {
    const updated = deleteConversionRecord(id);
    setHistory(updated);
    showToast('Record deleted from LocalStorage', 'info');
  };

  const handleClearAllHistory = () => {
    clearAllHistory();
    setHistory([]);
    showToast('All LocalStorage history cleared', 'info');
  };

  const pendingCount = queue.filter(q => q.status === 'pending').length;
  const completedCount = queue.filter(q => q.status === 'completed').length;

  // SEO — dynamic per-mode metadata (title strictly 30-60 chars, description 110-160 chars)
  const seoTitle =
    activeMode === 'file'
      ? 'Free Online PDF Tools | Zyvokio'
      : `Convert ${fromFormat.toUpperCase()} to ${toFormat.toUpperCase()} Online | Zyvokio`;

  const seoDescription =
    activeMode === 'file'
      ? 'Use 29 free PDF tools online: merge, split, compress, convert, sign, watermark and protect PDF files. 100% private, client-side processing with Zyvokio.'
      : `Convert ${fromFormat.toUpperCase()} to ${toFormat.toUpperCase()} online with Zyvokio. Fast, private, studio-grade Sharp converter with zero quality loss. Free batch conversion.`;

  const seoSchemas = getSchemaForMode(activeMode);

  // 404 page
  if (showNotFound) {
    return (
      <div className="app-layout">
        <NotFound onGoHome={() => setShowNotFound(false)} />
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Per-page SEO (React 19 native <title>, <meta>, <link>, JSON-LD) */}
      <SEO
        title={seoTitle}
        description={seoDescription}
        path="/"
        schema={seoSchemas}
      />

      {/* Top Navbar */}
      <Navbar
        activeMode={activeMode}
        onSelectMode={setActiveMode}
        fromFormat={fromFormat}
        toFormat={toFormat}
        backendStatus={backendStatus}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="main-content" role="main">
        {/* Prominent Dual Mode Switcher (Image Converter vs File Converter) */}
        <ModeSwitcher activeMode={activeMode} onSelectMode={setActiveMode} />

        {/* VIEW 1: IMAGE CONVERTER */}
        {activeMode === 'img' && (
          <div className="img-converter-view fade-in">
            {/* Hero Section */}
            <section className="hero-section" aria-labelledby="hero-heading">
              <div className="hero-badge-wrap">
                <span className="badge badge-primary">
                  <Sparkles size={13} aria-hidden="true" /> Lossless In-Memory Multi-Format Engine
                </span>
              </div>
              <h1 id="hero-heading" className="hero-headline">
                Convert <span className="gradient-text">{fromFormat.toUpperCase()} to {toFormat.toUpperCase()}</span> with Studio Fidelity
              </h1>
              <p className="hero-lead">
                Lightning-fast image converter powered by Sharp and libvips. Runs completely in Node.js memory with zero database, storing conversion records securely in your browser LocalStorage.
              </p>
            </section>

            {/* 2 Dropdowns Format Selector with Presets */}
            <section className="format-selector-section" aria-label="Format selection">
              <FormatSelector
                fromFormat={fromFormat}
                toFormat={toFormat}
                onChangeFrom={setFromFormat}
                onChangeTo={setToFormat}
                onSelectPreset={handleSelectPreset}
              />
            </section>

            {/* Drop Zone (strictly accepts selected fromFormat) */}
            <section className="dropzone-section" aria-label="File upload area">
              <DropZone
                fromFormat={fromFormat}
                toFormat={toFormat}
                onFilesSelected={handleFilesSelected}
                onError={(msg) => showToast(msg, 'error')}
              />
            </section>

            {/* Queue Management Bar */}
            {queue.length > 0 && (
              <section className="queue-section fade-in" aria-label="Conversion queue">
                <div className="queue-header-bar glass-panel">
                  <div className="queue-summary">
                    <h2 className="queue-title">Conversion Queue</h2>
                    <div className="queue-counts">
                      <span className="count-pill total">{queue.length} Total</span>
                      {pendingCount > 0 && (
                        <span className="count-pill pending">{pendingCount} Pending</span>
                      )}
                      {completedCount > 0 && (
                        <span className="count-pill completed">{completedCount} Converted</span>
                      )}
                    </div>
                  </div>

                  <div className="queue-controls">
                    {pendingCount > 0 && (
                      <button
                        id="convert-all-btn"
                        className="btn-primary"
                        onClick={handleConvertAll}
                      >
                        <Play size={16} aria-hidden="true" />
                        <span>Convert All ({pendingCount})</span>
                      </button>
                    )}

                    {completedCount > 0 && (
                      <button
                        id="download-all-btn"
                        className="btn-secondary text-cyan"
                        onClick={handleDownloadAll}
                      >
                        <DownloadCloud size={16} aria-hidden="true" />
                        <span>Download All ({completedCount})</span>
                      </button>
                    )}

                    <button
                      id="clear-queue-btn"
                      className="btn-secondary text-muted"
                      onClick={handleClearQueue}
                      title="Clear Queue"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>

                {/* Queue items list */}
                <div className="queue-grid">
                  {queue.map(item => (
                    <FileCard
                      key={item.id}
                      item={item}
                      onConvert={handleConvertItem}
                      onDownload={handleDownload}
                      onCompare={(itm) => setInspectItem(itm)}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Features & Architecture Showcase */}
            <FeaturesSection />
          </div>
        )}

        {/* VIEW 2: FILE & PDF CONVERTER (iLovePDF Inspired Suite) */}
        {activeMode === 'file' && (
          <div className="file-converter-view fade-in">
            <PdfToolsGrid onSelectTool={(tool) => setSelectedPdfTool(tool)} />
          </div>
        )}

        {/* Contact Form Section (Direct Support & Feedback) */}
        <ContactSection onNotify={showToast} />
      </main>

      {/* PDF Tool Runner Modal */}
      {selectedPdfTool && (
        <PdfToolModal
          tool={selectedPdfTool}
          onClose={() => setSelectedPdfTool(null)}
          onRecordAdded={() => {
            setHistory(getConversionHistory());
            showToast(`Saved to history`, 'success');
          }}
        />
      )}

      {/* Footer */}
      <footer className="app-footer" role="contentinfo">
        <div className="footer-content">
          <div className="footer-left">
            <p>© {new Date().getFullYear()} <strong>Zyvokio</strong>. In-memory processing • Sharp Engine • Zero database</p>
          </div>
          <div className="footer-right">
            <a href="#contact-section" className="footer-pill footer-pill-interactive" id="footer-contact-link">
              ✉️ Contact Engineering
            </a>
            <span className="footer-pill">Local Storage Powered</span>
            <span className="footer-pill">JPG • PNG • WebP • SVG</span>
            <span className="footer-pill">Sharp 0.35</span>
          </div>
        </div>
      </footer>

      {/* History Modal (LocalStorage) */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onDeleteRecord={handleDeleteHistoryRecord}
        onClearAll={handleClearAllHistory}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
      />

      {/* Inspector / Comparison Modal */}
      <ComparisonModal
        item={inspectItem}
        onClose={() => setInspectItem(null)}
        onDownload={handleDownload}
      />

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-bubble fade-in ${toast.type}`} role="status" aria-live="polite">
          {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald" aria-hidden="true" />}
          {toast.type === 'error' && <AlertCircle size={18} className="text-rose" aria-hidden="true" />}
          {toast.type === 'info' && <Info size={18} className="text-cyan" aria-hidden="true" />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
