import React from 'react';
import { Image, FileText, Sparkles, Layers } from 'lucide-react';

export default function ModeSwitcher({ activeMode, onSelectMode }) {
  return (
    <div className="mode-switcher-container">
      <div className="mode-switcher-wrapper glass-panel">
        <div className="mode-switcher-intro">
          <span className="mode-switcher-badge">
            <Sparkles size={13} className="text-cyan" />
            <span>Select Workspace</span>
          </span>
          <span className="mode-switcher-label">Choose your converter category:</span>
        </div>

        <div className="mode-tabs-grid" role="tablist" aria-label="Converter Type Switcher">
          {/* Option 1: Image Converter */}
          <button
            type="button"
            role="tab"
            id="tab-img-converter"
            aria-selected={activeMode === 'img'}
            className={`mode-tab-btn ${activeMode === 'img' ? 'active img-tab-active' : ''}`}
            onClick={() => onSelectMode('img')}
          >
            <div className="mode-tab-icon-wrap img-theme">
              <Image size={22} />
            </div>
            <div className="mode-tab-text">
              <div className="mode-tab-title-row">
                <span className="mode-tab-title">Image Converter</span>
                <span className="mode-tab-sub-badge">Zyvokio Studio</span>
              </div>
              <p className="mode-tab-desc">JPG, PNG, WebP, SVG • Lossless Sharp Engine</p>
            </div>
            {activeMode === 'img' && <div className="tab-indicator-bar" />}
          </button>

          {/* Option 2: File & PDF Converter */}
          <button
            type="button"
            role="tab"
            id="tab-file-converter"
            aria-selected={activeMode === 'file'}
            className={`mode-tab-btn ${activeMode === 'file' ? 'active file-tab-active' : ''}`}
            onClick={() => onSelectMode('file')}
          >
            <div className="mode-tab-icon-wrap file-theme">
              <FileText size={22} />
            </div>
            <div className="mode-tab-text">
              <div className="mode-tab-title-row">
                <span className="mode-tab-title">File & PDF Converter</span>
                <span className="mode-tab-sub-badge new-badge">29 Tools</span>
              </div>
              <p className="mode-tab-desc">Merge, Split, Compress, Convert, Sign, Protect & Edit</p>
            </div>
            {activeMode === 'file' && <div className="tab-indicator-bar file-indicator" />}
          </button>
        </div>
      </div>
    </div>
  );
}
