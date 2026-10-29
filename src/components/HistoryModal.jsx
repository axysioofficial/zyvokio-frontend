import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Trash2, 
  HardDrive, 
  FileSpreadsheet, 
  Clock, 
  Layers, 
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { formatBytes } from '../utils/storage';

export default function HistoryModal({ 
  isOpen, 
  onClose, 
  history, 
  onDeleteRecord, 
  onClearAll 
}) {
  const [confirmClear, setConfirmClear] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Close on Escape key and lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow || '';
      document.body.classList.remove('modal-open');
    };
  }, [isOpen, onClose]);

  // Filter history
  const filteredHistory = useMemo(() => {
    if (!searchTerm.trim()) return history;
    const term = searchTerm.toLowerCase();
    return history.filter(item => 
      (item.originalName && item.originalName.toLowerCase().includes(term)) ||
      (item.convertedName && item.convertedName.toLowerCase().includes(term)) ||
      (item.fromFormat && item.fromFormat.toLowerCase().includes(term)) ||
      (item.toFormat && item.toFormat.toLowerCase().includes(term))
    );
  }, [history, searchTerm]);

  if (!isOpen) return null;

  const totalOriginalBytes = history.reduce((acc, cur) => acc + (cur.originalSize || 0), 0);
  const totalConvertedBytes = history.reduce((acc, cur) => acc + (cur.convertedSize || 0), 0);

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `picmorph_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="modal-backdrop fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-container glass-panel history-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <HardDrive size={20} className="text-cyan" />
            </div>
            <div>
              <h2 className="modal-title">Conversion History</h2>
              <p className="modal-subtitle">
                Zero database • Securely persisted in browser <strong>LocalStorage</strong>
              </p>
            </div>
          </div>
          <button 
            type="button"
            className="btn-icon close-modal-btn" 
            onClick={onClose}
            title="Close (Esc)"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stats banner */}
        <div className="history-stats-banner">
          <div className="stat-card">
            <span className="stat-label">Conversions</span>
            <span className="stat-value">{history.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Original Data</span>
            <span className="stat-value">{formatBytes(totalOriginalBytes)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Converted Output</span>
            <span className="stat-value">{formatBytes(totalConvertedBytes)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Storage Engine</span>
            <span className="stat-value text-emerald">Browser LocalStorage</span>
          </div>
        </div>

        {/* Search bar */}
        {history.length > 0 && (
          <div className="history-search-bar">
            <div className="search-input-wrapper">
              <Search size={15} className="search-icon" />
              <input 
                type="text" 
                className="search-input"
                placeholder="Search history by filename or format..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  type="button" 
                  className="btn-icon-clear" 
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* List Content */}
        <div className="history-content-area">
          {history.length === 0 ? (
            <div className="empty-history-state">
              <Layers size={44} className="empty-icon" />
              <h3>No conversion records found</h3>
              <p>Images converted with PicMorph are logged here automatically in your browser's private LocalStorage.</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="empty-history-state">
              <Search size={36} className="empty-icon" />
              <h3>No matching files found</h3>
              <p>No conversion matches your search "{searchTerm}".</p>
            </div>
          ) : (
            <div className="history-items-list">
              {filteredHistory.map((item) => {
                const fromFmt = (item.fromFormat || 'jpg').toLowerCase();
                const toFmt = (item.toFormat || 'png').toLowerCase();
                return (
                  <div key={item.id} className="history-item-row">
                    <div className="history-item-main">
                      <div className="history-item-names">
                        <div className="name-orig">
                          <span className={`format-badge ${fromFmt}`}>
                            {fromFmt.toUpperCase()}
                          </span>
                          <span className="name-text" title={item.originalName}>{item.originalName}</span>
                        </div>
                        <span className="arrow-sep">→</span>
                        <div className="name-conv">
                          <span className={`format-badge ${toFmt}`}>
                            {toFmt.toUpperCase()}
                          </span>
                          <span className="name-text font-bold" title={item.convertedName}>{item.convertedName}</span>
                        </div>
                      </div>

                      <div className="history-item-meta">
                        <span>{formatBytes(item.originalSize)} → {formatBytes(item.convertedSize)}</span>
                        {item.width && item.height && (
                          <span>• {item.width}×{item.height}px</span>
                        )}
                        {item.durationMs && (
                          <span>• {item.durationMs}ms</span>
                        )}
                        <span>• <Clock size={11} className="inline-icon" /> {new Date(item.convertedAt).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="history-item-actions">
                      <button 
                        type="button"
                        className="btn-icon text-rose hover-rose" 
                        onClick={() => onDeleteRecord(item.id)}
                        title="Delete record from LocalStorage"
                        aria-label="Delete item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="modal-footer">
            <div className="footer-left">
              <button type="button" className="btn-secondary btn-sm" onClick={handleExportJson}>
                <FileSpreadsheet size={15} />
                <span>Export JSON</span>
              </button>
            </div>

            <div className="footer-right">
              {confirmClear ? (
                <div className="confirm-clear-group">
                  <span className="confirm-text">Clear all {history.length} items?</span>
                  <button 
                    type="button"
                    className="btn-danger btn-sm"
                    onClick={() => {
                      onClearAll();
                      setConfirmClear(false);
                    }}
                  >
                    Yes, Clear All
                  </button>
                  <button 
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => setConfirmClear(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  className="btn-secondary btn-sm text-rose"
                  onClick={() => setConfirmClear(true)}
                >
                  <Trash2 size={15} />
                  <span>Clear All History</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
