import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  UploadCloud,
  FileCheck,
  Download,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Camera,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Sliders,
  FileText,
  Lock,
  Unlock,
  PenTool,
  RotateCw,
  Copy,
  Eye
} from 'lucide-react';
import {
  mergePdfs,
  splitPdf,
  removePages,
  reorderPages,
  scanToPdf,
  compressPdf,
  repairPdf,
  ocrPdf,
  imagesToPdf,
  wordToPdf,
  powerpointToPdf,
  excelToPdf,
  htmlToPdf,
  pdfToJpg,
  pdfToWord,
  pdfToPowerpoint,
  pdfToExcel,
  pdfToMarkdown,
  rotatePdf,
  addPageNumbers,
  addWatermark,
  cropPdf,
  editPdf,
  fillPdfForms,
  protectPdf,
  unlockPdf,
  signPdf,
  redactPdf,
  comparePdf
} from '../utils/pdfEngine';
import { triggerDownload } from '../utils/api';
import { addConversionRecord } from '../utils/storage';

export default function PdfToolModal({ tool, onClose, onRecordAdded }) {
  // Files state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [file2, setFile2] = useState(null); // For compare-pdf tool

  // Camera state for scan-to-pdf
  const [cameraActive, setCameraActive] = useState(false);
  const [snapshots, setSnapshots] = useState([]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Signature canvas state for sign-pdf
  const sigCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [sigColor, setSigColor] = useState('#000000');
  const [hasSignature, setHasSignature] = useState(false);

  // Tool specific options
  const [splitMode, setSplitMode] = useState('range');
  const [splitRange, setSplitRange] = useState('1');
  const [pagesToRemoveStr, setPagesToRemoveStr] = useState('2');
  const [reorderStr, setReorderStr] = useState('');
  const [compressLevel, setCompressLevel] = useState('recommended');
  const [rotateAngle, setRotateAngle] = useState(90);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.25);
  const [watermarkAngle, setWatermarkAngle] = useState(45);
  const [watermarkColor, setWatermarkColor] = useState('#DC2626');
  const [pageNumberFormat, setPageNumberFormat] = useState('page_n_of_m');
  const [pageNumberPos, setPageNumberPos] = useState('bottom-center');
  const [protectPassword, setProtectPassword] = useState('');
  const [cropMargin, setCropMargin] = useState(30);
  const [annotationText, setAnnotationText] = useState('Reviewed & Approved');
  const [imgOrientation, setImgOrientation] = useState('portrait');

  // Execution state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Handle Escape key and disable body scrolling while modal is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        onClose();
      }
    };

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow || '';
      document.body.classList.remove('modal-open');
    };
  }, [onClose]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle camera start
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setError(null);
    } catch (err) {
      setError('Unable to access camera: ' + err.message);
    }
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setSnapshots(prev => [...prev, dataUrl]);
  };

  const removeSnapshot = (index) => {
    setSnapshots(prev => prev.filter((_, i) => i !== index));
  };

  // Signature drawing pad handlers
  const startDraw = (e) => {
    setIsDrawing(true);
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = sigColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  // File upload input handler
  const handleFileInput = (e) => {
    const files = Array.from(e.target.files || []);
    if (tool.multiple) {
      setSelectedFiles(prev => [...prev, ...files]);
    } else {
      setSelectedFiles(files.slice(0, 1));
    }
  };

  const removeFile = (idx) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const moveFile = (idx, direction) => {
    setSelectedFiles(prev => {
      const copy = [...prev];
      const target = direction === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= copy.length) return copy;
      const temp = copy[idx];
      copy[idx] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  // Process Tool Execution
  const handleExecute = async () => {
    setError(null);
    setIsProcessing(true);
    setProgress(15);

    try {
      let outputData = null;
      const progressTimer = setInterval(() => {
        setProgress(p => Math.min(p + 25, 90));
      }, 150);

      const mainFile = selectedFiles[0];

      // Route to correct engine function based on tool.id
      switch (tool.id) {
        case 'merge-pdf':
          if (selectedFiles.length < 2) throw new Error('Please select at least 2 PDF files to merge.');
          outputData = await mergePdfs(selectedFiles);
          break;

        case 'split-pdf':
          if (!mainFile) throw new Error('Please select a PDF file to split.');
          outputData = await splitPdf(mainFile, { mode: splitMode, rangeStr: splitRange });
          break;

        case 'remove-pages':
          if (!mainFile) throw new Error('Please select a PDF file.');
          const pagesArr = pagesToRemoveStr.split(',').map(s => s.trim()).filter(Boolean);
          outputData = await removePages(mainFile, pagesArr);
          break;

        case 'organize-pages':
          if (!mainFile) throw new Error('Please select a PDF file.');
          const reorderArr = reorderStr ? reorderStr.split(',').map(s => s.trim()).filter(Boolean) : [1];
          outputData = await reorderPages(mainFile, reorderArr);
          break;

        case 'scan-to-pdf':
          if (snapshots.length === 0) throw new Error('Please capture at least one camera snapshot.');
          outputData = await scanToPdf(snapshots, { orientation: imgOrientation });
          break;

        case 'compress-pdf':
          if (!mainFile) throw new Error('Please select a PDF file to compress.');
          outputData = await compressPdf(mainFile, { level: compressLevel });
          break;

        case 'repair-pdf':
          if (!mainFile) throw new Error('Please select a PDF file to repair.');
          outputData = await repairPdf(mainFile);
          break;

        case 'ocr-pdf':
          if (!mainFile) throw new Error('Please select a PDF file for OCR.');
          outputData = await ocrPdf(mainFile);
          break;

        case 'jpg-to-pdf':
          if (selectedFiles.length === 0) throw new Error('Please select one or more image files.');
          outputData = await imagesToPdf(selectedFiles, { orientation: imgOrientation });
          break;

        case 'word-to-pdf':
          if (!mainFile) throw new Error('Please select a Word or text file.');
          outputData = await wordToPdf(mainFile);
          break;

        case 'powerpoint-to-pdf':
          if (!mainFile) throw new Error('Please select a PowerPoint file.');
          outputData = await powerpointToPdf(mainFile);
          break;

        case 'excel-to-pdf':
          if (!mainFile) throw new Error('Please select an Excel or CSV file.');
          outputData = await excelToPdf(mainFile);
          break;

        case 'html-to-pdf':
          if (!mainFile) throw new Error('Please select an HTML file.');
          outputData = await htmlToPdf(mainFile);
          break;

        case 'pdf-to-jpg':
          if (!mainFile) throw new Error('Please select a PDF file to convert to JPG.');
          outputData = await pdfToJpg(mainFile);
          break;

        case 'pdf-to-word':
          if (!mainFile) throw new Error('Please select a PDF file.');
          outputData = await pdfToWord(mainFile);
          break;

        case 'pdf-to-powerpoint':
          if (!mainFile) throw new Error('Please select a PDF file.');
          outputData = await pdfToPowerpoint(mainFile);
          break;

        case 'pdf-to-excel':
          if (!mainFile) throw new Error('Please select a PDF file.');
          outputData = await pdfToExcel(mainFile);
          break;

        case 'pdf-to-markdown':
          if (!mainFile) throw new Error('Please select a PDF file.');
          outputData = await pdfToMarkdown(mainFile);
          break;

        case 'rotate-pdf':
          if (!mainFile) throw new Error('Please select a PDF file to rotate.');
          outputData = await rotatePdf(mainFile, { angle: rotateAngle });
          break;

        case 'page-numbers':
          if (!mainFile) throw new Error('Please select a PDF file.');
          outputData = await addPageNumbers(mainFile, {
            format: pageNumberFormat,
            position: pageNumberPos
          });
          break;

        case 'watermark-pdf':
          if (!mainFile) throw new Error('Please select a PDF file.');
          outputData = await addWatermark(mainFile, {
            text: watermarkText,
            opacity: watermarkOpacity,
            angle: watermarkAngle,
            colorHex: watermarkColor
          });
          break;

        case 'crop-pdf':
          if (!mainFile) throw new Error('Please select a PDF file to crop.');
          outputData = await cropPdf(mainFile, { margin: cropMargin });
          break;

        case 'edit-pdf':
          if (!mainFile) throw new Error('Please select a PDF file to edit.');
          outputData = await editPdf(mainFile, { annotationText });
          break;

        case 'pdf-forms':
          if (!mainFile) throw new Error('Please select a PDF form.');
          outputData = await fillPdfForms(mainFile);
          break;

        case 'unlock-pdf':
          if (!mainFile) throw new Error('Please select a PDF file to unlock.');
          outputData = await unlockPdf(mainFile);
          break;

        case 'protect-pdf':
          if (!mainFile) throw new Error('Please select a PDF file to protect.');
          outputData = await protectPdf(mainFile, { password: protectPassword });
          break;

        case 'sign-pdf':
          if (!mainFile) throw new Error('Please select a PDF file to sign.');
          let sigDataUrl = null;
          if (sigCanvasRef.current && hasSignature) {
            sigDataUrl = sigCanvasRef.current.toDataURL('image/png');
          }
          outputData = await signPdf(mainFile, { signatureDataUrl: sigDataUrl });
          break;

        case 'redact-pdf':
          if (!mainFile) throw new Error('Please select a PDF file to redact.');
          outputData = await redactPdf(mainFile);
          break;

        case 'compare-pdf':
          if (!mainFile || !file2) throw new Error('Please upload two PDF documents to compare.');
          outputData = await comparePdf(mainFile, file2);
          break;

        default:
          throw new Error('Unknown tool handler');
      }

      clearInterval(progressTimer);
      setProgress(100);
      setResult(outputData);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti is optional visual polish
      }

      // Add to local storage history
      const record = {
        originalFilename: mainFile?.name || 'document',
        convertedFilename: outputData.filename,
        sourceFormat: 'pdf',
        targetFormat: outputData.filename.endsWith('.zip') ? 'zip' : 'pdf',
        originalSize: mainFile?.size || 0,
        convertedSize: outputData.blob?.size || 0,
        toolName: tool.name,
        timestamp: new Date().toISOString()
      };
      addConversionRecord(record);
      if (onRecordAdded) onRecordAdded();

    } catch (err) {
      setError(err.message || 'Operation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result?.blob) return;
    triggerDownload(result.blob, result.filename);
  };

  return (
    <div className="modal-overlay fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pdf-tool-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="pdf-modal-header" style={{ borderBottomColor: tool.color }}>
          <div className="pdf-modal-title-group">
            <div className="pdf-modal-icon-bubble" style={{ backgroundColor: tool.bgLight }}>
              <Sparkles size={20} style={{ color: tool.color }} />
            </div>
            <div>
              <div className="pdf-modal-title-row">
                <h2 className="pdf-modal-title">{tool.name}</h2>
                <span className="pdf-modal-badge" style={{ borderColor: tool.color, color: tool.color }}>
                  {tool.badge}
                </span>
              </div>
              <p className="pdf-modal-desc">{tool.desc}</p>
            </div>
          </div>
          <button 
            type="button" 
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="pdf-modal-body">
          {error && (
            <div className="modal-error-banner">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* If already finished, display result download card */}
          {result ? (
            <div className="pdf-result-card glass-panel fade-in">
              <div className="result-check-bubble">
                <CheckCircle2 size={44} className="text-emerald" />
              </div>
              <h3 className="result-title">Ready for Download!</h3>
              <p className="result-subtitle">
                <strong>{result.filename}</strong> was processed with studio precision.
              </p>

              <div className="result-stats-row">
                {result.reductionPercent && (
                  <div className="result-stat-chip">
                    <span className="stat-label">Reduced By:</span>
                    <span className="stat-val text-emerald">-{result.reductionPercent}%</span>
                  </div>
                )}
                {result.pageCount && (
                  <div className="result-stat-chip">
                    <span className="stat-label">Total Pages:</span>
                    <span className="stat-val">{result.pageCount}</span>
                  </div>
                )}
                <div className="result-stat-chip">
                  <span className="stat-label">Output Size:</span>
                  <span className="stat-val">{((result.blob.size || 0) / 1024).toFixed(1)} KB</span>
                </div>
              </div>

              {result.text && (
                <div className="ocr-text-preview-box">
                  <label className="text-muted text-xs uppercase font-semibold">Extracted Text Preview:</label>
                  <textarea 
                    readOnly 
                    className="ocr-textarea" 
                    value={result.text} 
                    rows={6}
                  />
                </div>
              )}

              <div className="result-action-buttons">
                <button
                  type="button"
                  className="btn btn-primary download-result-btn"
                  onClick={handleDownload}
                >
                  <Download size={18} />
                  <span>Download {result.filename}</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setResult(null);
                    setSelectedFiles([]);
                    setProgress(0);
                  }}
                >
                  Process Another Document
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Camera Scanning Tool Specific View */}
              {tool.isCameraScan ? (
                <div className="camera-scan-container">
                  {!cameraActive ? (
                    <div className="camera-prompt-card glass-panel">
                      <Camera size={44} className="text-cyan" />
                      <h4>Scan Physical Document</h4>
                      <p>Capture document pages directly using your device webcam or camera.</p>
                      <button 
                        type="button" 
                        className="btn btn-primary mt-3"
                        onClick={startCamera}
                      >
                        <Camera size={16} />
                        <span>Launch Camera</span>
                      </button>
                    </div>
                  ) : (
                    <div className="camera-active-layout">
                      <div className="camera-feed-box glass-panel">
                        <video ref={videoRef} autoPlay playsInline className="camera-video-elem" />
                        <button
                          type="button"
                          className="camera-snap-btn"
                          onClick={captureSnapshot}
                          title="Snap Page"
                        >
                          <Camera size={20} />
                          <span>Snap Page</span>
                        </button>
                      </div>

                      {snapshots.length > 0 && (
                        <div className="camera-thumbnails-list">
                          <label className="thumbnails-label">Captured Pages ({snapshots.length}):</label>
                          <div className="thumbnails-row">
                            {snapshots.map((snap, idx) => (
                              <div key={idx} className="thumb-item">
                                <img src={snap} alt={`Page ${idx + 1}`} className="thumb-img" />
                                <span className="thumb-num">P.{idx + 1}</span>
                                <button
                                  type="button"
                                  className="thumb-del-btn"
                                  onClick={() => removeSnapshot(idx)}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : tool.id === 'compare-pdf' ? (
                /* Dual Dropzone for Compare PDF */
                <div className="compare-dual-dropzones">
                  <div className="dropzone-half glass-panel">
                    <span className="doc-tag">Document A</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setSelectedFiles([e.target.files[0]])}
                    />
                    <p className="drop-hint">{selectedFiles[0]?.name || 'Select First PDF'}</p>
                  </div>
                  <div className="dropzone-half glass-panel">
                    <span className="doc-tag">Document B</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFile2(e.target.files[0])}
                    />
                    <p className="drop-hint">{file2?.name || 'Select Second PDF'}</p>
                  </div>
                </div>
              ) : (
                /* Standard Drag & Drop Area */
                <div className="pdf-dropzone-wrap glass-panel">
                  <input
                    type="file"
                    id="pdf-tool-file-input"
                    className="hidden-file-input"
                    accept={tool.accept}
                    multiple={tool.multiple}
                    onChange={handleFileInput}
                  />
                  <label htmlFor="pdf-tool-file-input" className="dropzone-content-label">
                    <div className="dropzone-icon-box" style={{ color: tool.color }}>
                      <UploadCloud size={36} />
                    </div>
                    <div className="dropzone-text-block">
                      <p className="dropzone-main-text">
                        Click to select or drag & drop <strong>{tool.accept}</strong>
                      </p>
                      <p className="dropzone-sub-text">
                        {tool.multiple ? 'Supports multiple file uploads for batch processing' : 'Process single document in high quality'}
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Uploaded File List */}
              {selectedFiles.length > 0 && (
                <div className="selected-files-list">
                  <div className="selected-files-header">
                    <span>Uploaded Files ({selectedFiles.length}):</span>
                    {tool.id === 'merge-pdf' && <span className="text-xs text-muted">Use arrows to adjust merge order</span>}
                  </div>
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="file-item-row glass-panel">
                      <div className="file-info-left">
                        <FileCheck size={18} className="text-cyan" />
                        <span className="file-name" title={file.name}>{file.name}</span>
                        <span className="file-size">{((file.size || 0) / 1024).toFixed(1)} KB</span>
                      </div>
                      <div className="file-actions-right">
                        {tool.id === 'merge-pdf' && (
                          <>
                            <button
                              type="button"
                              className="order-btn"
                              disabled={idx === 0}
                              onClick={() => moveFile(idx, 'up')}
                              title="Move Up"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              className="order-btn"
                              disabled={idx === selectedFiles.length - 1}
                              onClick={() => moveFile(idx, 'down')}
                              title="Move Down"
                            >
                              <ArrowDown size={14} />
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          className="file-remove-btn"
                          onClick={() => removeFile(idx)}
                          title="Remove file"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tool Specific Configuration Options */}
              <div className="tool-options-section glass-panel">
                <div className="options-section-header">
                  <Sliders size={16} className="text-amber" />
                  <span className="options-title">Tool Options</span>
                </div>

                {tool.id === 'split-pdf' && (
                  <div className="options-content">
                    <label className="option-label">Split Mode:</label>
                    <div className="radio-pills">
                      <button
                        type="button"
                        className={`pill-choice ${splitMode === 'range' ? 'active' : ''}`}
                        onClick={() => setSplitMode('range')}
                      >
                        Extract Range (e.g. 1-3)
                      </button>
                      <button
                        type="button"
                        className={`pill-choice ${splitMode === 'all' ? 'active' : ''}`}
                        onClick={() => setSplitMode('all')}
                      >
                        Split All Pages (ZIP)
                      </button>
                    </div>
                    {splitMode === 'range' && (
                      <div className="input-group-row mt-2">
                        <label className="text-xs text-muted">Pages to extract:</label>
                        <input
                          type="text"
                          className="styled-text-input"
                          placeholder="e.g. 1-2, 4"
                          value={splitRange}
                          onChange={(e) => setSplitRange(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}

                {tool.id === 'remove-pages' && (
                  <div className="options-content">
                    <label className="option-label">Pages to remove (comma separated):</label>
                    <input
                      type="text"
                      className="styled-text-input"
                      placeholder="e.g. 2, 4"
                      value={pagesToRemoveStr}
                      onChange={(e) => setPagesToRemoveStr(e.target.value)}
                    />
                  </div>
                )}

                {tool.id === 'compress-pdf' && (
                  <div className="options-content">
                    <label className="option-label">Compression Level:</label>
                    <div className="radio-pills">
                      <button
                        type="button"
                        className={`pill-choice ${compressLevel === 'extreme' ? 'active' : ''}`}
                        onClick={() => setCompressLevel('extreme')}
                      >
                        Extreme (Smallest Size)
                      </button>
                      <button
                        type="button"
                        className={`pill-choice ${compressLevel === 'recommended' ? 'active' : ''}`}
                        onClick={() => setCompressLevel('recommended')}
                      >
                        Recommended (Balanced)
                      </button>
                      <button
                        type="button"
                        className={`pill-choice ${compressLevel === 'low' ? 'active' : ''}`}
                        onClick={() => setCompressLevel('low')}
                      >
                        Low (High Quality)
                      </button>
                    </div>
                  </div>
                )}

                {tool.id === 'rotate-pdf' && (
                  <div className="options-content">
                    <label className="option-label">Rotation Angle:</label>
                    <div className="radio-pills">
                      <button
                        type="button"
                        className={`pill-choice ${rotateAngle === 90 ? 'active' : ''}`}
                        onClick={() => setRotateAngle(90)}
                      >
                        90° Clockwise
                      </button>
                      <button
                        type="button"
                        className={`pill-choice ${rotateAngle === 180 ? 'active' : ''}`}
                        onClick={() => setRotateAngle(180)}
                      >
                        180° Flip
                      </button>
                      <button
                        type="button"
                        className={`pill-choice ${rotateAngle === 270 ? 'active' : ''}`}
                        onClick={() => setRotateAngle(270)}
                      >
                        270° Counter-CW
                      </button>
                    </div>
                  </div>
                )}

                {tool.id === 'watermark-pdf' && (
                  <div className="options-content-grid">
                    <div className="input-field-wrap">
                      <label className="option-label">Watermark Text:</label>
                      <input
                        type="text"
                        className="styled-text-input"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                      />
                    </div>
                    <div className="input-field-wrap">
                      <label className="option-label">Opacity ({Math.round(watermarkOpacity * 100)}%):</label>
                      <input
                        type="range"
                        min="0.05"
                        max="0.8"
                        step="0.05"
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="input-field-wrap">
                      <label className="option-label">Color:</label>
                      <input
                        type="color"
                        value={watermarkColor}
                        onChange={(e) => setWatermarkColor(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {tool.id === 'page-numbers' && (
                  <div className="options-content-grid">
                    <div className="input-field-wrap">
                      <label className="option-label">Format:</label>
                      <select
                        className="styled-select"
                        value={pageNumberFormat}
                        onChange={(e) => setPageNumberFormat(e.target.value)}
                      >
                        <option value="page_n_of_m">Page 1 of N</option>
                        <option value="simple">1</option>
                        <option value="dash">- 1 -</option>
                      </select>
                    </div>
                    <div className="input-field-wrap">
                      <label className="option-label">Position:</label>
                      <select
                        className="styled-select"
                        value={pageNumberPos}
                        onChange={(e) => setPageNumberPos(e.target.value)}
                      >
                        <option value="bottom-center">Bottom Center</option>
                        <option value="bottom-right">Bottom Right</option>
                        <option value="top-right">Top Right</option>
                      </select>
                    </div>
                  </div>
                )}

                {tool.id === 'protect-pdf' && (
                  <div className="options-content">
                    <label className="option-label">Encryption Password:</label>
                    <input
                      type="password"
                      className="styled-text-input"
                      placeholder="Enter a secure password..."
                      value={protectPassword}
                      onChange={(e) => setProtectPassword(e.target.value)}
                    />
                  </div>
                )}

                {tool.id === 'sign-pdf' && (
                  <div className="options-content signature-pad-section">
                    <div className="sig-header-row">
                      <label className="option-label">Draw Signature:</label>
                      <div className="sig-colors">
                        {['#000000', '#1E40AF', '#DC2626'].map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`color-dot ${sigColor === color ? 'active' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setSigColor(color)}
                          />
                        ))}
                        <button
                          type="button"
                          className="btn-clear-sig"
                          onClick={clearSignature}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <canvas
                      ref={sigCanvasRef}
                      width={380}
                      height={120}
                      className="signature-canvas"
                      onMouseDown={startDraw}
                      onMouseMove={draw}
                      onMouseUp={stopDraw}
                      onMouseLeave={stopDraw}
                      onTouchStart={startDraw}
                      onTouchMove={draw}
                      onTouchEnd={stopDraw}
                    />
                    <p className="sig-hint">Sign above using your finger, mouse or stylus.</p>
                  </div>
                )}

                {tool.id === 'jpg-to-pdf' && (
                  <div className="options-content">
                    <label className="option-label">Page Orientation:</label>
                    <div className="radio-pills">
                      <button
                        type="button"
                        className={`pill-choice ${imgOrientation === 'portrait' ? 'active' : ''}`}
                        onClick={() => setImgOrientation('portrait')}
                      >
                        Portrait (Vertical)
                      </button>
                      <button
                        type="button"
                        className={`pill-choice ${imgOrientation === 'landscape' ? 'active' : ''}`}
                        onClick={() => setImgOrientation('landscape')}
                      >
                        Landscape (Horizontal)
                      </button>
                    </div>
                  </div>
                )}

                {tool.id === 'edit-pdf' && (
                  <div className="options-content">
                    <label className="option-label">Annotation Note Text:</label>
                    <input
                      type="text"
                      className="styled-text-input"
                      value={annotationText}
                      onChange={(e) => setAnnotationText(e.target.value)}
                    />
                  </div>
                )}

                {/* Default info for tools with automatic smart processing */}
                {['repair-pdf', 'ocr-pdf', 'pdf-to-jpg', 'pdf-to-word', 'pdf-to-powerpoint', 'pdf-to-excel', 'pdf-to-markdown', 'word-to-pdf', 'powerpoint-to-pdf', 'excel-to-pdf', 'html-to-pdf', 'pdf-forms', 'unlock-pdf', 'redact-pdf'].includes(tool.id) && (
                  <div className="smart-engine-info">
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>Auto-configured with optimal studio parameters for 100% loss-free conversion.</span>
                  </div>
                )}
              </div>

              {/* Action Button & Progress */}
              <div className="modal-actions-bar">
                {isProcessing ? (
                  <div className="processing-progress-wrap">
                    <div className="progress-info-row">
                      <span>Processing document with {tool.name}...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${progress}%`, backgroundColor: tool.color }} />
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary modal-execute-btn"
                    style={{ backgroundColor: tool.color, borderColor: tool.color }}
                    onClick={handleExecute}
                    disabled={(!tool.isCameraScan && selectedFiles.length === 0) || (tool.isCameraScan && snapshots.length === 0)}
                  >
                    <span>{tool.actionLabel}</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
