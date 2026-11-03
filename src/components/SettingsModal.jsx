import React from 'react';
import { X, Sliders, CheckCircle, RotateCcw } from 'lucide-react';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  preferences, 
  onUpdatePreferences 
}) {
  // Close on Escape key and lock body scroll
  React.useEffect(() => {
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

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    onUpdatePreferences({ [key]: value });
  };

  const handleReset = () => {
    onUpdatePreferences({
      compressionLevel: 8,
      quality: 100,
      autoDownload: false
    });
  };

  return (
    <div className="modal-backdrop fade-in" onClick={onClose}>
      <div 
        className="modal-container glass-panel settings-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <Sliders size={20} className="text-cyan" />
            </div>
            <div>
              <h2 className="modal-title">Converter Settings</h2>
              <p className="modal-subtitle">Customize Sharp backend encoder parameters</p>
            </div>
          </div>
          <button className="btn-icon close-modal-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="settings-body">
          {/* Compression Level */}
          <div className="setting-group">
            <div className="setting-label-row">
              <div>
                <label htmlFor="png-compression-level" className="setting-title">PNG Compression Level</label>
                <p className="setting-desc">Level 0 (no compression, fastest) to 9 (maximum compression, smaller file)</p>
              </div>
              <span className="setting-val-badge">Level {preferences.compressionLevel}</span>
            </div>
            <input 
              id="png-compression-level"
              type="range"
              min="0"
              max="9"
              step="1"
              value={preferences.compressionLevel}
              onChange={(e) => handleChange('compressionLevel', parseInt(e.target.value, 10))}
              className="range-slider"
              aria-label="PNG Compression Level"
            />
            <div className="slider-markers">
              <span>0 (Fast)</span>
              <span>5 (Balanced)</span>
              <span>9 (Max PNG)</span>
            </div>
          </div>

          {/* Quality Slider */}
          <div className="setting-group">
            <div className="setting-label-row">
              <div>
                <label htmlFor="png-render-quality" className="setting-title">PNG Render Quality</label>
                <p className="setting-desc">Controls palette quantization and color fidelity</p>
              </div>
              <span className="setting-val-badge">{preferences.quality}%</span>
            </div>
            <input 
              id="png-render-quality"
              type="range"
              min="75"
              max="100"
              step="1"
              value={preferences.quality}
              onChange={(e) => handleChange('quality', parseInt(e.target.value, 10))}
              className="range-slider"
              aria-label="PNG Render Quality"
            />
            <div className="slider-markers">
              <span>75%</span>
              <span>90%</span>
              <span>100% (Lossless Studio)</span>
            </div>
          </div>

          {/* Auto Download Toggle */}
          <div className="setting-group-toggle">
            <div>
              <label htmlFor="auto-download-toggle" className="setting-title">Auto-Download Converted PNG</label>
              <p className="setting-desc">Automatically trigger browser file download upon conversion completion</p>
            </div>
            <label className="toggle-switch" htmlFor="auto-download-toggle">
              <input 
                id="auto-download-toggle"
                type="checkbox" 
                checked={preferences.autoDownload}
                onChange={(e) => handleChange('autoDownload', e.target.checked)}
                aria-label="Auto-Download Converted PNG"
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary btn-sm" onClick={handleReset}>
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>
          <button className="btn-primary btn-sm" onClick={onClose}>
            <CheckCircle size={14} />
            <span>Save & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
