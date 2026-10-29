import React from 'react';
import { History, Sliders, CheckCircle2, Mail } from 'lucide-react';

export default function Navbar({ 
  activeMode = 'img',
  onSelectMode,
  fromFormat = 'jpg',
  toFormat = 'png',
  backendStatus, 
  historyCount, 
  onOpenHistory, 
  onOpenSettings 
}) {
  const isHealthy = backendStatus.healthy;

  return (
    <header className="navbar-container" role="banner">
      <div className="navbar-content">
        {/* Brand */}
        <div className="brand-group">
          <div className="brand-logo-glow">
            <div className="brand-logo-icon" aria-hidden="true">
              <img src="/01_transparent_logo.png" alt="Zyvokio Logo" className="brand-logo-img" />
            </div>
          </div>

          <div className="brand-text-block">
            <div className="brand-title-wrap">
              <span className="brand-title">Zyvokio</span>
              {activeMode === 'img' ? (
                <span className="badge badge-primary nav-pipeline-badge" title="Active Conversion Pipeline">
                  {fromFormat.toUpperCase()} → {toFormat.toUpperCase()}
                </span>
              ) : (
                <span className="badge nav-pdf-suite-badge" title="PDF Suite Mode">
                  PDF Suite • 29 Tools
                </span>
              )}
            </div>
            <p className="brand-subtitle">Studio-Grade Image & PDF Converter</p>
          </div>
        </div>

        {/* Central Quick Mode Switcher */}
        {onSelectMode && (
          <div className="nav-mode-selector-pill" role="navigation" aria-label="Mode Navigation">
            <button
              type="button"
              className={`nav-mode-btn ${activeMode === 'img' ? 'active' : ''}`}
              onClick={() => onSelectMode('img')}
              id="nav-btn-img-mode"
            >
              Image Converter
            </button>
            <button
              type="button"
              className={`nav-mode-btn ${activeMode === 'file' ? 'active' : ''}`}
              onClick={() => onSelectMode('file')}
              id="nav-btn-file-mode"
            >
              File Converter
            </button>
          </div>
        )}

        {/* Right Action Controls */}
        <div className="nav-actions">
          {/* Live Backend Status */}
          <div 
            className="status-pill"
            role="status"
            aria-live="polite"
            title={
              isHealthy 
                ? `Connected to Backend API on Port 5000 (Uptime: ${backendStatus.data?.uptimeSeconds || 0}s)` 
                : 'Backend API disconnected. Ensure server is running on port 5000'
            }
          >
            <span className={`pulse-dot ${isHealthy ? 'online' : 'offline'}`} />
            <span className="status-text-full">
              {isHealthy ? 'Backend Active' : 'Disconnected'}
            </span>
            <span className="status-text-compact">
              {isHealthy ? 'Live' : 'Offline'}
            </span>
          </div>

          {/* Contact Support Link */}
          <a
            id="nav-contact-btn"
            href="#contact-section"
            className="nav-action-btn"
            title="Contact Support & Engineering Desk"
            aria-label="Contact Support"
          >
            <Mail size={16} />
            <span className="btn-label-text">Contact</span>
          </a>

          {/* Settings Button */}
          <button 
            id="nav-settings-btn"
            type="button"
            className="nav-action-btn"
            onClick={onOpenSettings}
            title="Conversion Settings (Quality, Compression)"
            aria-label="Open Conversion Settings"
          >
            <Sliders size={16} />
            <span className="btn-label-text">Settings</span>
          </button>

          {/* Local Storage History Button */}
          <button 
            id="nav-history-btn"
            type="button"
            className="nav-action-btn history-action-btn"
            onClick={onOpenHistory}
            title="View Conversion History (Stored in LocalStorage)"
            aria-label={`View Conversion History (${historyCount} items)`}
          >
            <History size={16} />
            <span className="btn-label-text">History</span>
            {historyCount > 0 && (
              <span className="history-count-badge" aria-label={`${historyCount} conversions in history`}>
                {historyCount > 99 ? '99+' : historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
