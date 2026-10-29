import React, { useEffect, useState } from 'react';
import { 
  Download, 
  Trash2, 
  ArrowRight, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  FileCheck,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { formatBytes } from '../utils/storage';

export default function FileCard({ 
  item, 
  onConvert, 
  onDownload, 
  onCompare, 
  onRemove 
}) {
  const [dimensions, setDimensions] = useState(null);

  // Probe original image dimensions on client
  useEffect(() => {
    if (item.file) {
      const img = new Image();
      img.src = item.previewUrl;
      img.onload = () => {
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
    }
  }, [item.file, item.previewUrl]);

  const fromFmt = (item.fromFormat || 'JPG').toUpperCase();
  const toFmt = (item.toFormat || 'PNG').toUpperCase();

  const origSize = item.size || 0;
  const convSize = item.convertedSize || 0;
  const sizeDiff = convSize - origSize;
  const percentChange = origSize > 0 ? ((sizeDiff / origSize) * 100).toFixed(1) : 0;
  const isReduced = sizeDiff < 0;

  return (
    <div className={`file-card glass-panel fade-in ${item.status}`}>
      {/* Thumbnail and format tag */}
      <div className="file-card-preview-wrap transparency-grid-bg">
        <img 
          src={item.status === 'completed' && item.convertedUrl ? item.convertedUrl : item.previewUrl} 
          alt={item.name} 
          className="file-card-img" 
        />
        <div className="format-tag original">{fromFmt}</div>
        {item.status === 'completed' && (
          <div className="format-tag converted">{toFmt}</div>
        )}
      </div>

      {/* Info details */}
      <div className="file-card-details">
        <div className="file-card-header">
          <h3 className="file-card-name" title={item.name}>
            {item.name}
          </h3>
          <button 
            type="button"
            className="btn-icon remove-btn" 
            onClick={() => onRemove(item.id)} 
            title="Remove file"
            aria-label="Remove file"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Specs & metadata */}
        <div className="file-specs-row">
          <span className="spec-item">
            Size: <strong>{formatBytes(item.size)}</strong>
          </span>
          {dimensions && (
            <span className="spec-item">
              Res: <strong>{dimensions.width}×{dimensions.height}</strong>
            </span>
          )}
          {item.durationMs && (
            <span className="spec-item time">
              ⏱ <strong>{item.durationMs}ms</strong>
            </span>
          )}
        </div>

        {/* Status indicator row */}
        {item.status === 'pending' && (
          <div className="status-row pending">
            <span className="status-badge pending">Ready to convert → {toFmt}</span>
          </div>
        )}

        {item.status === 'converting' && (
          <div className="status-row converting-wrap">
            <div className="converting-info">
              <Loader2 size={15} className="spin text-cyan" />
              <span className="status-text">Encoding to {toFmt} with Sharp...</span>
            </div>
            <div className="converting-progress-track">
              <div className="converting-progress-bar"></div>
            </div>
          </div>
        )}

        {item.status === 'completed' && (
          <div className="conversion-success-bar">
            <div className="success-meta">
              <CheckCircle2 size={15} className="text-emerald" />
              <span>
                {toFmt}: <strong>{formatBytes(item.convertedSize)}</strong>
              </span>
            </div>

            {/* Savings pill */}
            {origSize > 0 && (
              <span className={`savings-pill ${isReduced ? 'reduced' : 'expanded'}`}>
                {isReduced ? (
                  <>
                    <TrendingDown size={12} />
                    <span>Saved {Math.abs(percentChange)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingUp size={12} />
                    <span>+{percentChange}%</span>
                  </>
                )}
              </span>
            )}
          </div>
        )}

        {item.status === 'error' && (
          <div className="status-row error">
            <AlertCircle size={15} className="text-rose" />
            <span className="error-text" title={item.error}>{item.error || 'Conversion failed'}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="file-card-actions">
          {item.status === 'pending' && (
            <button 
              type="button"
              className="btn-primary full-width"
              onClick={() => onConvert(item.id)}
            >
              <span>Convert to {toFmt}</span>
              <ArrowRight size={16} />
            </button>
          )}

          {item.status === 'converting' && (
            <button type="button" className="btn-secondary full-width" disabled>
              <Loader2 size={16} className="spin" />
              <span>Processing...</span>
            </button>
          )}

          {item.status === 'completed' && (
            <div className="completed-actions-group">
              <button 
                type="button"
                className="btn-primary action-grow"
                onClick={() => onDownload(item)}
              >
                <Download size={15} />
                <span>Download {toFmt}</span>
              </button>
              <button 
                type="button"
                className="btn-secondary action-icon"
                onClick={() => onCompare(item)}
                title="Inspect & Compare Before/After"
              >
                <Eye size={15} />
                <span>Inspect</span>
              </button>
            </div>
          )}

          {item.status === 'error' && (
            <button 
              type="button"
              className="btn-secondary full-width"
              onClick={() => onConvert(item.id)}
            >
              <RefreshCw size={15} />
              <span>Retry</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
