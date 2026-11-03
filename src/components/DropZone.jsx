import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Sparkles, ClipboardCheck, FileType, FolderOpen } from 'lucide-react';

const FORMAT_CONFIG = {
  jpg: {
    extensions: ['jpg', 'jpeg'],
    mimes: ['image/jpeg', 'image/jpg', 'image/pjpeg'],
    acceptAttr: '.jpg,.jpeg,image/jpeg',
    label: 'JPG / JPEG',
    badge: 'JPG'
  },
  png: {
    extensions: ['png'],
    mimes: ['image/png'],
    acceptAttr: '.png,image/png',
    label: 'PNG',
    badge: 'PNG'
  },
  webp: {
    extensions: ['webp'],
    mimes: ['image/webp'],
    acceptAttr: '.webp,image/webp',
    label: 'WebP',
    badge: 'WEBP'
  },
  svg: {
    extensions: ['svg'],
    mimes: ['image/svg+xml'],
    acceptAttr: '.svg,image/svg+xml',
    label: 'SVG Vector',
    badge: 'SVG'
  }
};

export default function DropZone({ 
  fromFormat = 'jpg', 
  toFormat = 'png', 
  onFilesSelected, 
  onError 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [pasteNotice, setPasteNotice] = useState(false);
  const fileInputRef = useRef(null);

  const activeConfig = FORMAT_CONFIG[fromFormat] || FORMAT_CONFIG.jpg;

  // Strict format validation based on selected fromFormat
  const processFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const validFiles = [];
    const invalidFiles = [];

    Array.from(fileList).forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const isExtMatch = activeConfig.extensions.includes(ext);
      const isMimeMatch = activeConfig.mimes.includes(file.type.toLowerCase());

      if (isExtMatch || isMimeMatch) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0 && onError) {
      onError(
        `Upload blocked! You selected "${activeConfig.label}" mode. Non-${fromFormat.toUpperCase()} files rejected: ${invalidFiles.join(', ')}`
      );
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  // Drag handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  // Clipboard paste listener (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const ext = activeConfig.extensions[0];
            const renamed = new File([blob], `pasted_image_${Date.now()}.${ext}`, {
              type: activeConfig.mimes[0]
            });
            pastedFiles.push(renamed);
          }
        }
      }

      if (pastedFiles.length > 0) {
        setPasteNotice(true);
        setTimeout(() => setPasteNotice(false), 2500);
        processFiles(pastedFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [fromFormat, activeConfig]);

  return (
    <div 
      id="dropzone-container"
      className={`dropzone-wrap ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          fileInputRef.current?.click();
        }
      }}
      aria-label={`Dropzone: upload ${activeConfig.label} files`}
    >
      <input 
        ref={fileInputRef}
        type="file"
        id="file-upload-input"
        accept={activeConfig.acceptAttr}
        multiple
        style={{ display: 'none' }}
        onChange={handleInputChange}
        aria-label={`Upload ${activeConfig.label} files`}
      />

      <div className="dropzone-glow-layer" />

      <div className="dropzone-inner">
        <div className="dropzone-icon-sphere">
          <UploadCloud size={38} className="dropzone-upload-icon" />
        </div>

        <div className="dropzone-text-block">
          <h2 className="dropzone-heading">
            Drop your <span className="gradient-text">{activeConfig.label}</span> files here
          </h2>
          <p className="dropzone-subheading">
            Converting to <strong>{toFormat.toUpperCase()}</strong> • or paste with <kbd className="kbd-shortcut">Ctrl+V</kbd>
          </p>
        </div>

        <div className="dropzone-action-btn-wrap">
          <button 
            type="button" 
            className="btn-primary browse-cta-btn"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <FolderOpen size={16} />
            <span>Browse {activeConfig.badge} Files</span>
          </button>
        </div>

        <div className="dropzone-badges">
          <span className="badge badge-primary">
            <FileType size={12} /> {fromFormat.toUpperCase()} → {toFormat.toUpperCase()}
          </span>
          <span className="badge badge-cyan">
            <Sparkles size={12} /> Lossless Sharp Engine
          </span>
          <span className="badge badge-success">
            Max 25MB per file
          </span>
        </div>

        {pasteNotice && (
          <div className="paste-toast fade-in">
            <ClipboardCheck size={16} /> Image pasted from clipboard!
          </div>
        )}
      </div>
    </div>
  );
}
