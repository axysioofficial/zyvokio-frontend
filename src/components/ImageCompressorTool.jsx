import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Sliders,
  Download,
  Trash2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FileImage,
  Layers,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerDownload } from '../utils/api';

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export default function ImageCompressorTool({ onNotify }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [quality, setQuality] = useState(75);
  const [compressing, setCompressing] = useState(false);
  const [compressedResult, setCompressedResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Compress using HTML5 Canvas & Blob
  const processCompression = async (file, qualityVal) => {
    if (!file) return;
    setCompressing(true);

    try {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        reader.readAsDataURL(file);
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Determine MIME type
      let mimeType = file.type || 'image/jpeg';
      if (mimeType !== 'image/png' && mimeType !== 'image/webp' && mimeType !== 'image/jpeg') {
        mimeType = 'image/jpeg';
      }

      // If PNG, compress to webp or high-quality jpeg if user wants dramatic savings, or use canvas
      const outputMime = mimeType === 'image/png' ? 'image/png' : 'image/jpeg';

      const blob = await new Promise((resolve) => {
        canvas.toBlob(
          (b) => resolve(b),
          outputMime === 'image/png' ? 'image/webp' : outputMime,
          qualityVal / 100
        );
      });

      const finalBlob = blob || file;
      const downloadUrl = URL.createObjectURL(finalBlob);
      const savings = Math.max(0, Math.round(((file.size - finalBlob.size) / file.size) * 100));

      setCompressedResult({
        blob: finalBlob,
        url: downloadUrl,
        size: finalBlob.size,
        savings,
        width: img.width,
        height: img.height,
        name: file.name.replace(/\.[^/.]+$/, '') + '-compressed.' + (outputMime === 'image/png' ? 'webp' : 'jpg')
      });

      if (onNotify) {
        onNotify(`Compressed successfully! Saved ${savings}% file size`, 'success');
      }
    } catch (err) {
      console.error('Compression error:', err);
      if (onNotify) onNotify('Compression failed: ' + err.message, 'error');
    } finally {
      setCompressing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      processCompression(file, quality);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      processCompression(file, quality);
    }
  };

  const handleQualityChange = (e) => {
    const newQ = parseInt(e.target.value, 10);
    setQuality(newQ);
  };

  const handleApplyQuality = () => {
    if (selectedFile) {
      processCompression(selectedFile, quality);
    }
  };

  const handleDownload = () => {
    if (!compressedResult) return;
    triggerDownload(compressedResult.url, compressedResult.name);
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // Confetti fallback
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (compressedResult?.url) URL.revokeObjectURL(compressedResult.url);
    setSelectedFile(null);
    setPreviewUrl(null);
    setCompressedResult(null);
  };

  return (
    <div className="tool-interactive-workspace glass-panel">
      {!selectedFile ? (
        <div
          className={`dropzone-card ${isDragging ? 'drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{ minHeight: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px dashed var(--zyvokio-aqua)', borderRadius: 'var(--radius-xl)', padding: '40px 20px', background: 'rgba(8, 127, 175, 0.03)' }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <div className="dropzone-icon-glow" style={{ marginBottom: '16px' }}>
            <UploadCloud size={48} className="text-cyan" />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px', color: 'var(--zyvokio-text-black)' }}>
            Drop your image here to compress
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '18px' }}>
            Supports JPG, JPEG, PNG, and WebP up to 50 MB
          </p>
          <button type="button" className="btn-primary">
            <span>Browse Image File</span>
          </button>
        </div>
      ) : (
        <div className="compressor-active-box" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Controls Bar */}
          <div className="compressor-controls-bar" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', background: 'var(--zyvokio-offwhite)', padding: '16px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 300px' }}>
              <Sliders size={20} className="text-cyan" />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  <span>Compression Quality: <strong>{quality}%</strong></span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {quality > 80 ? 'High Fidelity' : quality > 60 ? 'Optimal Web' : 'Ultra Compact'}
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  value={quality}
                  onChange={handleQualityChange}
                  onMouseUp={handleApplyQuality}
                  onTouchEnd={handleApplyQuality}
                  style={{ width: '100%', accentColor: 'var(--zyvokio-deep-teal)', cursor: 'pointer' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleReset}
                title="Choose different image"
                style={{ padding: '8px 14px' }}
              >
                <Trash2 size={16} />
                <span>Clear</span>
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleDownload}
                disabled={!compressedResult || compressing}
                style={{ padding: '8px 18px' }}
              >
                <Download size={16} />
                <span>Download ({formatBytes(compressedResult?.size)})</span>
              </button>
            </div>
          </div>

          {/* Results Comparison Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {/* Original Card */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>BEFORE</span>
                <span className="badge" style={{ background: 'var(--zyvokio-offwhite)' }}>{formatBytes(selectedFile.size)}</span>
              </div>
              <div style={{ height: '220px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {previewUrl && (
                  <img src={previewUrl} alt="Original input" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                )}
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedFile.name}
              </p>
            </div>

            {/* Compressed Card */}
            <div style={{ background: '#FFFFFF', border: '2px solid rgba(25, 230, 140, 0.4)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--zyvokio-green)' }}>AFTER COMPRESSION</span>
                {compressedResult && (
                  <span className="badge" style={{ background: 'rgba(25, 230, 140, 0.15)', color: '#0A6639', fontWeight: 800 }}>
                    {formatBytes(compressedResult.size)} (-{compressedResult.savings}%)
                  </span>
                )}
              </div>
              <div style={{ height: '220px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {compressedResult?.url ? (
                  <img src={compressedResult.url} alt="Compressed output" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Processing...</div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--zyvokio-deep-teal)', fontWeight: 600 }}>
                  Ready to download
                </span>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleDownload}
                  disabled={!compressedResult}
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  <Download size={14} />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
