import React, { useState, useEffect } from 'react';
import { X, Download, Split, Maximize2, ZoomIn, ZoomOut, Check, Sliders } from 'lucide-react';
import { formatBytes } from '../utils/storage';

export default function ComparisonModal({ item, onClose, onDownload }) {
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'sideBySide'
  const [sliderPos, setSliderPos] = useState(50); // percentage
  const [isCopied, setIsCopied] = useState(false);

  // Close modal on Escape key and lock body scroll
  useEffect(() => {
    if (!item) return;

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
  }, [item, onClose]);

  if (!item) return null;

  const fromFmt = (item.fromFormat || 'JPG').toUpperCase();
  const toFmt = (item.toFormat || 'PNG').toUpperCase();

  const originalSrc = item.previewUrl;
  const convertedSrc = item.convertedUrl || item.previewUrl;

  // Calculate size change
  const origSize = item.size || 0;
  const convSize = item.convertedSize || item.size || 0;
  const sizeDiff = convSize - origSize;
  const percentChange = origSize > 0 ? ((sizeDiff / origSize) * 100).toFixed(1) : 0;
  const isReduced = sizeDiff < 0;

  return (
    <div className="modal-backdrop fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-container glass-panel comparison-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <Sliders size={20} className="text-cyan" />
            </div>
            <div>
              <h2 className="modal-title">Studio Inspector & Comparison</h2>
              <p className="modal-subtitle">
                Compare original <strong>{fromFmt}</strong> vs converted <strong>{toFmt}</strong> in real-time
              </p>
            </div>
          </div>

          <div className="modal-header-actions">
            <div className="view-mode-toggle">
              <button 
                type="button"
                className={`mode-btn ${viewMode === 'split' ? 'active' : ''}`}
                onClick={() => setViewMode('split')}
                title="Interactive Split Slider"
              >
                <Split size={14} />
                <span>Split Slider</span>
              </button>
              <button 
                type="button"
                className={`mode-btn ${viewMode === 'sideBySide' ? 'active' : ''}`}
                onClick={() => setViewMode('sideBySide')}
                title="Side by Side Grid"
              >
                <Maximize2 size={14} />
                <span>Side by Side</span>
              </button>
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
        </div>

        {/* Viewport */}
        <div className="comparison-viewport transparency-grid-bg">
          {viewMode === 'split' ? (
            <div className="split-view-container">
              {/* Converted Image (underneath) */}
              <img 
                src={convertedSrc} 
                alt={`Converted ${toFmt}`} 
                className="split-img-layer converted-layer" 
                draggable="false"
                width="600"
                height="400"
              />
              <div className="split-layer-badge right">
                <span className="badge-dot emerald"></span>
                <span>{toFmt} Output</span>
              </div>

              {/* Original Image (clipped on top) */}
              <div 
                className="split-clipped-wrapper"
                style={{ width: `${sliderPos}%` }}
              >
                <img 
                  src={originalSrc} 
                  alt={`Original ${fromFmt}`} 
                  className="split-img-layer original-layer" 
                  draggable="false"
                  width="600"
                  height="400"
                />
                <div className="split-layer-badge left">
                  <span className="badge-dot amber"></span>
                  <span>{fromFmt} Original</span>
                </div>
              </div>

              {/* Divider Line */}
              <div 
                className="split-slider-line"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="split-slider-handle">
                  <Split size={14} color="#ffffff" />
                  <span className="split-pos-indicator">{sliderPos}%</span>
                </div>
              </div>

              {/* Touch & mouse range slider */}
              <input 
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="split-slider-range-input"
                aria-label="Comparison slider position"
              />
            </div>
          ) : (
            <div className="side-by-side-container">
              {/* Original Box */}
              <div className="side-box">
                <div className="side-box-header">
                  <div className="side-box-title">
                    <span className="badge badge-primary">{fromFmt} Original</span>
                  </div>
                  <span className="side-meta">{formatBytes(origSize)}</span>
                </div>
                <div className="side-box-img-wrap transparency-grid-bg">
                  <img src={originalSrc} alt={`Original ${fromFmt} version of ${item.name}`} loading="lazy" width="600" height="400" />
                </div>
              </div>

              {/* Converted Box */}
              <div className="side-box">
                <div className="side-box-header">
                  <div className="side-box-title">
                    <span className="badge badge-success">{toFmt} Converted</span>
                  </div>
                  <span className="side-meta">{formatBytes(convSize)}</span>
                </div>
                <div className="side-box-img-wrap transparency-grid-bg">
                  <img src={convertedSrc} alt={`Converted ${toFmt} version of ${item.name}`} loading="lazy" width="600" height="400" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="comparison-meta-summary">
            <span className="summary-pill">
              <strong>Filename:</strong> <span className="text-truncate">{item.convertedFilename || item.name}</span>
            </span>
            {item.dimensions && (
              <span className="summary-pill">
                <strong>Resolution:</strong> {item.dimensions.width}×{item.dimensions.height}px
              </span>
            )}
            <span className="summary-pill">
              <strong>Size:</strong> {formatBytes(convSize)}
            </span>
            {item.status === 'completed' && origSize > 0 && (
              <span className={`summary-pill savings ${isReduced ? 'text-emerald' : 'text-cyan'}`}>
                {isReduced ? `Reduced by ${Math.abs(percentChange)}%` : `Size +${percentChange}%`}
              </span>
            )}
          </div>

          <div className="modal-footer-btns">
            <button 
              type="button"
              className="btn-primary"
              onClick={() => onDownload(item)}
            >
              <Download size={16} />
              <span>Download {toFmt}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
