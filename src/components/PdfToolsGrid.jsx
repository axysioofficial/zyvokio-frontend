import React, { useState, useMemo } from 'react';
import {
  Layers,
  Scissors,
  Trash2,
  ArrowUpDown,
  Camera,
  Minimize2,
  Wrench,
  ScanText,
  Image,
  FileText,
  Presentation,
  Sheet,
  Code,
  Images,
  FileEdit,
  MonitorPlay,
  Table,
  Hash,
  RotateCw,
  ListOrdered,
  Stamp,
  Crop,
  Pencil,
  CheckSquare,
  Unlock,
  Lock,
  PenTool,
  EyeOff,
  Columns2,
  Search,
  Sparkles,
  ArrowRight,
  FolderKanban,
  Zap,
  FileUp,
  FileDown,
  FilePenLine,
  ShieldCheck,
  Filter,
  Check
} from 'lucide-react';
import { TOOL_CATEGORIES, PDF_TOOLS } from '../data/toolsData';

// Map icon strings to Lucide components safely
const ICON_MAP = {
  Layers,
  Scissors,
  Trash2,
  ArrowUpDown,
  Camera,
  Minimize2,
  Wrench,
  ScanText,
  Image,
  FileText,
  Presentation,
  Sheet,
  Code,
  Images,
  FileEdit,
  MonitorPlay,
  Table,
  Hash,
  RotateCw,
  ListOrdered,
  Stamp,
  Crop,
  Pencil,
  CheckSquare,
  Unlock,
  Lock,
  PenTool,
  EyeOff,
  Columns2,
  FolderKanban,
  Zap,
  FileUp,
  FileDown,
  FilePenLine,
  ShieldCheck
};

export default function PdfToolsGrid({ onSelectTool }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tools based on category and search query
  const filteredTools = useMemo(() => {
    let result = PDF_TOOLS;

    if (activeCategory !== 'all') {
      result = result.filter(tool => tool.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(tool => 
        tool.name.toLowerCase().includes(q) ||
        tool.desc.toLowerCase().includes(q) ||
        (tool.keywords && tool.keywords.some(k => k.includes(q)))
      );
    }

    return result;
  }, [activeCategory, searchQuery]);

  return (
    <div className="pdf-tools-suite-container fade-in">
      {/* Hero section */}
      <div className="pdf-tools-hero">
        <div className="pdf-hero-badge">
          <Sparkles size={14} className="text-amber" />
          <span>Every Tool You Need in One Place</span>
        </div>
        <h1 className="pdf-hero-title">
          Every tool you need to work with <span className="gradient-pdf-text">PDFs in one place</span>
        </h1>
        <p className="pdf-hero-subtitle">
          All are 100% free, private, and client-side safe. Merge, split, compress, convert, rotate, watermark, and sign PDFs with instant browser processing.
        </p>

        {/* Search bar */}
        <div className="pdf-search-wrapper">
          <div className="pdf-search-box glass-panel">
            <Search size={18} className="pdf-search-icon search-icon" />
            <input
              type="text"
              id="pdf-tools-search"
              className="pdf-search-input"
              placeholder="Search any tool (e.g., merge, compress, sign, watermark, word to pdf)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search PDF tools"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="pdf-categories-scroll-wrap">
        <div className="pdf-categories-bar" role="tablist" aria-label="PDF Categories">
          {TOOL_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const CategoryIcon = cat.icon ? ICON_MAP[cat.icon] : Filter;

            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`category-pill-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  '--cat-accent': cat.color || '#3B82F6'
                }}
              >
                {CategoryIcon && <CategoryIcon size={15} className="cat-icon" />}
                <span className="cat-label">{cat.label}</span>
                <span className="cat-count-badge">{cat.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="pdf-results-bar">
        <div className="results-count-text">
          Showing <strong>{filteredTools.length}</strong> of {PDF_TOOLS.length} PDF & Document tools
          {searchQuery && <span className="search-query-tag">matching "{searchQuery}"</span>}
        </div>
      </div>

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <div className="pdf-no-results glass-panel">
          <Search size={40} className="text-muted" />
          <h3>No matching PDF tools found</h3>
          <p>Try searching for words like "merge", "convert", "sign", "protect", or "word".</p>
          <button 
            type="button" 
            className="btn btn-secondary mt-3"
            onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="pdf-cards-grid">
          {filteredTools.map((tool) => {
            const Icon = ICON_MAP[tool.icon] || FileText;

            return (
              <div
                key={tool.id}
                id={`card-${tool.id}`}
                className="pdf-tool-card glass-panel"
                onClick={() => onSelectTool(tool)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTool(tool);
                  }
                }}
                style={{
                  '--tool-color': tool.color,
                  '--tool-bg-light': tool.bgLight
                }}
              >
                {/* Tool Card Top Row */}
                <div className="pdf-card-top">
                  <div className="pdf-tool-icon-bubble">
                    <Icon size={24} style={{ color: tool.color }} />
                  </div>
                  <span className="pdf-tool-badge" style={{ borderColor: tool.color, color: tool.color }}>
                    {tool.badge}
                  </span>
                </div>

                {/* Card Info */}
                <div className="pdf-card-body">
                  <h3 className="pdf-tool-title">{tool.name}</h3>
                  <p className="pdf-tool-desc">{tool.desc}</p>
                </div>

                {/* Card Footer */}
                <div className="pdf-card-footer">
                  <span className="launch-text">Launch Tool</span>
                  <div className="arrow-circle">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
