import React from 'react';
import { ArrowRight, ArrowLeftRight, Sparkles, Check, FileType, ChevronDown, RefreshCw } from 'lucide-react';

export const SOURCE_FORMATS = [
  { id: 'jpg', label: 'JPG / JPEG', ext: '.jpg, .jpeg', badge: 'JPG', desc: 'Photos & compressed images' },
  { id: 'png', label: 'PNG', ext: '.png', badge: 'PNG', desc: 'Lossless with transparency' },
  { id: 'webp', label: 'WebP', ext: '.webp', badge: 'WEBP', desc: 'Modern high-efficiency format' },
  { id: 'svg', label: 'SVG Vector', ext: '.svg', badge: 'SVG', desc: 'Scalable vector graphics' }
];

export const TARGET_FORMATS = [
  { id: 'png', label: 'PNG (Lossless Quality)', badge: 'PNG', desc: 'Full alpha transparency support' },
  { id: 'webp', label: 'WebP (Ultra Compact)', badge: 'WEBP', desc: 'Up to 30% smaller than PNG/JPG' },
  { id: 'jpg', label: 'JPG (Universal Photo)', badge: 'JPG', desc: 'Standard photo web compatibility' }
];

export const PRESETS = [
  { from: 'jpg', to: 'png', label: 'JPG → PNG' },
  { from: 'png', to: 'webp', label: 'PNG → WebP' },
  { from: 'webp', to: 'jpg', label: 'WebP → JPG' },
  { from: 'svg', to: 'png', label: 'SVG → PNG' }
];

export default function FormatSelector({ 
  fromFormat, 
  toFormat, 
  onChangeFrom, 
  onChangeTo,
  onSelectPreset 
}) {
  const availableTargets = TARGET_FORMATS.filter(t => t.id !== fromFormat);

  const handleFromChange = (newFrom) => {
    onChangeFrom(newFrom);
    if (toFormat === newFrom) {
      const alternate = TARGET_FORMATS.find(t => t.id !== newFrom);
      if (alternate) onChangeTo(alternate.id);
    }
  };

  const handleSwap = () => {
    if (fromFormat === 'svg') return;
    const oldFrom = fromFormat;
    const oldTo = toFormat;
    onChangeFrom(oldTo);
    onChangeTo(oldFrom);
  };

  const isCurrentPreset = (p) => p.from === fromFormat && p.to === toFormat;
  const currentSourceMeta = SOURCE_FORMATS.find(f => f.id === fromFormat) || SOURCE_FORMATS[0];
  const currentTargetMeta = TARGET_FORMATS.find(f => f.id === toFormat) || TARGET_FORMATS[0];

  return (
    <div className="format-selector-wrap glass-panel fade-in">
      {/* Header & Preset chips */}
      <div className="format-selector-header">
        <div className="format-selector-title-wrap">
          <div className="pulse-icon-box">
            <Sparkles size={18} className="text-cyan" />
          </div>
          <div>
            <h2 className="format-selector-title">Conversion Pipeline</h2>
            <p className="format-selector-desc">
              Select input format and desired output. Upload is strictly locked to <strong>{currentSourceMeta.ext}</strong>.
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="presets-pill-group">
          <span className="presets-label">Popular:</span>
          {PRESETS.map((preset) => {
            const active = isCurrentPreset(preset);
            return (
              <button
                key={`${preset.from}-${preset.to}`}
                type="button"
                className={`preset-chip ${active ? 'active' : ''}`}
                onClick={() => onSelectPreset(preset.from, preset.to)}
              >
                {active && <Check size={12} className="preset-check" />}
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive 2-Dropdown Pipeline */}
      <div className="pipeline-interactive-grid">
        {/* Step 1: FROM Card */}
        <div className="format-card from-card">
          <div className="format-card-header">
            <div className="step-indicator">
              <span className="step-number">1</span>
              <span className="step-text">Convert From</span>
            </div>
            <span className="format-pill-tag from">{currentSourceMeta.badge}</span>
          </div>

          <div className="custom-select-wrapper">
            <select
              id="from-format-select"
              className="styled-native-select"
              value={fromFormat}
              onChange={(e) => handleFromChange(e.target.value)}
              aria-label="Select source image format"
            >
              {SOURCE_FORMATS.map((fmt) => (
                <option key={fmt.id} value={fmt.id}>
                  {fmt.label} ({fmt.ext})
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="select-chevron-icon" />
          </div>

          <div className="format-card-footer">
            <span className="format-subtext">{currentSourceMeta.desc}</span>
            <span className="accepts-badge">Locks upload to {currentSourceMeta.ext}</span>
          </div>
        </div>

        {/* SWAP / ARROW CONNECTOR */}
        <div className="pipeline-connector-cell">
          <button
            type="button"
            className="swap-formats-btn"
            onClick={handleSwap}
            disabled={fromFormat === 'svg'}
            title={fromFormat === 'svg' ? 'SVG cannot be a raster output' : 'Swap Source & Target'}
            aria-label="Swap formats"
          >
            <ArrowLeftRight size={18} />
          </button>
          <div className="connector-line" />
        </div>

        {/* Step 2: TO Card */}
        <div className="format-card to-card">
          <div className="format-card-header">
            <div className="step-indicator">
              <span className="step-number">2</span>
              <span className="step-text">Convert To</span>
            </div>
            <span className="format-pill-tag to">{currentTargetMeta.badge}</span>
          </div>

          <div className="custom-select-wrapper">
            <select
              id="to-format-select"
              className="styled-native-select"
              value={toFormat}
              onChange={(e) => onChangeTo(e.target.value)}
              aria-label="Select target image format"
            >
              {availableTargets.map((fmt) => (
                <option key={fmt.id} value={fmt.id}>
                  {fmt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="select-chevron-icon" />
          </div>

          <div className="format-card-footer">
            <span className="format-subtext">{currentTargetMeta.desc}</span>
            <span className="engine-badge">Sharp In-Memory Encoder</span>
          </div>
        </div>
      </div>

      {/* Dynamic Rule Alert */}
      <div className="format-rule-banner">
        <span className="rule-dot" />
        <span className="rule-text">
          <strong>Active Rule:</strong> You have selected <strong>{currentSourceMeta.label}</strong>. You can only upload files with extension <strong>{currentSourceMeta.ext}</strong>. All other image types are automatically rejected.
        </span>
      </div>
    </div>
  );
}
