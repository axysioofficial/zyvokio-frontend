import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Maximize2,
  Download,
  Trash2,
  Lock,
  Unlock,
  Sparkles,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerDownload } from '../utils/api';

export default function ImageResizerTool({ onNotify }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [outputFormat, setOutputFormat] = useState('original');
  const [isDragging, setIsDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setWidth(img.width);
      setHeight(img.height);
    };
    img.src = url;
  };

  const handleWidthChange = (val) => {
    const newW = Math.max(1, parseInt(val, 10) || 1);
    setWidth(newW);
    if (lockAspect && originalWidth > 0) {
      const ratio = originalHeight / originalWidth;
      setHeight(Math.round(newW * ratio));
    }
  };

  const handleHeightChange = (val) => {
    const newH = Math.max(1, parseInt(val, 10) || 1);
    setHeight(newH);
    if (lockAspect && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setWidth(Math.round(newH * ratio));
    }
  };

  const applyScalePercentage = (pct) => {
    if (originalWidth > 0 && originalHeight > 0) {
      const scale = pct / 100;
      setWidth(Math.round(originalWidth * scale));
      setHeight(Math.round(originalHeight * scale));
    }
  };

  const handleResizeAndDownload = async () => {
    if (!selectedFile || width <= 0 || height <= 0) return;
    setResizing(true);

    try {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = previewUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      let targetMime = selectedFile.type || 'image/jpeg';
      let targetExt = 'jpg';

      if (outputFormat === 'png') {
        targetMime = 'image/png';
        targetExt = 'png';
      } else if (outputFormat === 'webp') {
        targetMime = 'image/webp';
        targetExt = 'webp';
      } else if (outputFormat === 'jpg') {
        targetMime = 'image/jpeg';
        targetExt = 'jpg';
      } else {
        targetExt = selectedFile.name.split('.').pop() || 'jpg';
      }

      const blob = await new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b), targetMime, 0.92);
      });

      const downloadUrl = URL.createObjectURL(blob);
      const downloadName = `${selectedFile.name.replace(/\.[^/.]+$/, '')}-${width}x${height}.${targetExt}`;
      triggerDownload(downloadUrl, downloadName);

      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch {}

      if (onNotify) onNotify(`Image resized to ${width}x${height}px!`, 'success');
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
    } catch (err) {
      console.error('Resize error:', err);
      if (onNotify) onNotify('Resize failed: ' + err.message, 'error');
    } finally {
      setResizing(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setWidth(0);
    setHeight(0);
  };

  return (
    <div className="tool-interactive-workspace glass-panel">
      {!selectedFile ? (
        <div
          className={`dropzone-card ${isDragging ? 'drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          style={{ minHeight: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px dashed var(--zyvokio-aqua)', borderRadius: 'var(--radius-xl)', padding: '40px 20px', background: 'rgba(8, 127, 175, 0.03)' }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <div className="dropzone-icon-glow" style={{ marginBottom: '16px' }}>
            <Maximize2 size={48} className="text-cyan" />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px', color: 'var(--zyvokio-text-black)' }}>
            Drop your image here to resize
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '18px' }}>
            Resize JPG, PNG, and WebP to custom dimensions or percentage
          </p>
          <button type="button" className="btn-primary">
            <span>Browse Image File</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Controls Bar */}
          <div style={{ background: 'var(--zyvokio-offwhite)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                {/* Width Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    WIDTH (PX)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    style={{ width: '110px', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: '#FFFFFF', fontWeight: 600 }}
                  />
                </div>

                {/* Aspect ratio lock */}
                <button
                  type="button"
                  onClick={() => setLockAspect(!lockAspect)}
                  title={lockAspect ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
                  style={{ alignSelf: 'flex-end', height: '38px', width: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: lockAspect ? 'rgba(18, 207, 229, 0.15)' : '#FFFFFF', cursor: 'pointer', color: lockAspect ? 'var(--zyvokio-deep-teal)' : 'var(--text-muted)' }}
                >
                  {lockAspect ? <Lock size={16} /> : <Unlock size={16} />}
                </button>

                {/* Height Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    HEIGHT (PX)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    style={{ width: '110px', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: '#FFFFFF', fontWeight: 600 }}
                  />
                </div>

                {/* Format selection */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    EXPORT AS
                  </label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    style={{ height: '38px', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: '#FFFFFF', fontWeight: 600 }}
                  >
                    <option value="original">Original Format</option>
                    <option value="jpg">JPG (Universal)</option>
                    <option value="png">PNG (Lossless)</option>
                    <option value="webp">WebP (Modern)</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="btn-secondary" onClick={handleReset} style={{ padding: '8px 14px' }}>
                  <Trash2 size={16} />
                  <span>Clear</span>
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleResizeAndDownload}
                  disabled={resizing}
                  style={{ padding: '8px 20px' }}
                >
                  <Download size={16} />
                  <span>Resize & Download</span>
                </button>
              </div>
            </div>

            {/* Scale Presets */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Quick Scale:</span>
              {[25, 50, 75, 100, 150, 200].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  className="preset-chip"
                  onClick={() => applyScalePercentage(pct)}
                  style={{ padding: '4px 10px', fontSize: '0.76rem' }}
                >
                  {pct}%
                </button>
              ))}
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                Original: <strong>{originalWidth} × {originalHeight} px</strong>
              </span>
            </div>
          </div>

          {/* Live Preview */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              OUTPUT TARGET: <span style={{ color: 'var(--zyvokio-deep-teal)' }}>{width} × {height} PX</span>
            </div>
            <div style={{ maxWidth: '100%', maxHeight: '380px', overflow: 'hidden', borderRadius: 'var(--radius-md)', background: '#F8FAFC', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}>
              <img
                src={previewUrl}
                alt="Resize preview"
                style={{ maxWidth: '100%', maxHeight: '350px', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
