import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  HelpCircle,
  FolderKanban,
  FileText,
  Image as ImageIcon,
  Minimize2,
  Maximize2,
  Layers,
  ArrowLeft
} from 'lucide-react';

import SEO from './SEO';
import DropZone from './DropZone';
import FileCard from './FileCard';
import ImageCompressorTool from './ImageCompressorTool';
import ImageResizerTool from './ImageResizerTool';
import { SITE_URL } from '../utils/seoConfig';
import { getSeoToolBySlug } from '../data/seoPagesData';
import { PDF_TOOLS } from '../data/toolsData';

export default function ToolPage({
  toolData,
  queue,
  onFilesSelected,
  onConvertItem,
  onDownload,
  onCompare,
  onRemoveItem,
  handleConvertAll,
  handleDownloadAll,
  handleClearQueue,
  pendingCount,
  completedCount,
  onOpenPdfTool,
  onNavigate,
  onNotify
}) {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  if (!toolData) return null;

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  // Generate Google Schema JSON-LD
  const schemas = [];

  // 1. Breadcrumbs Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: `${SITE_URL}/#tools`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: toolData.name,
        item: `${SITE_URL}/${toolData.slug}`
      }
    ]
  });

  // 2. WebApplication Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${toolData.name} — Zyvokio`,
    url: `${SITE_URL}/${toolData.slug}`,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    description: toolData.metaDescription,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '342'
    }
  });

  // 3. HowTo Schema (Rich Snippet for Google Search)
  if (toolData.howTo && toolData.howTo.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to use ${toolData.name}`,
      description: toolData.lead,
      step: toolData.howTo.map((st, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: st.title,
        text: st.desc
      }))
    });
  }

  // 4. FAQPage Schema (Rich FAQ Accordion in Google Search)
  if (toolData.faqs && toolData.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: toolData.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a
        }
      }))
    });
  }

  // Find PDF Tool definition if this is a PDF tool
  const matchedPdfTool = toolData.pdfToolId
    ? PDF_TOOLS.find(t => t.id === toolData.pdfToolId)
    : null;

  return (
    <div className="seo-tool-page-view fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '36px', width: '100%' }}>
      {/* Dynamic SEO Meta Header */}
      <SEO
        title={toolData.metaTitle}
        description={toolData.metaDescription}
        path={`/${toolData.slug}`}
        schema={schemas}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="breadcrumbs-wrap" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <button
          type="button"
          onClick={() => onNavigate('/')}
          style={{ background: 'none', border: 'none', padding: 0, color: 'var(--zyvokio-deep-teal)', cursor: 'pointer', fontWeight: 600 }}
        >
          Home
        </button>
        <ChevronRight size={14} />
        <span>Tools</span>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--zyvokio-text-black)', fontWeight: 600 }}>{toolData.name}</span>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" aria-labelledby="tool-hero-heading" style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        <div className="hero-badge-wrap">
          <span className="badge badge-primary">
            <Sparkles size={13} aria-hidden="true" /> {toolData.badge || 'Studio Fidelity'}
          </span>
        </div>
        <h1 id="tool-hero-heading" className="hero-headline" style={{ fontSize: 'clamp(2.1rem, 4.5vw, 3.2rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.035em', margin: 0, color: 'var(--zyvokio-text-black)' }}>
          {toolData.h1}
        </h1>
        <p className="hero-lead" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          {toolData.lead}
        </p>
      </section>

      {/* Main Interactive Tool Workspace */}
      <section className="tool-main-workspace-section" aria-label="Interactive Tool">
        {toolData.type === 'image-compress' ? (
          <ImageCompressorTool onNotify={onNotify} />
        ) : toolData.type === 'image-resizer' ? (
          <ImageResizerTool onNotify={onNotify} />
        ) : toolData.type === 'pdf-tool' ? (
          <div className="pdf-tool-trigger-box glass-panel" style={{ padding: '40px 24px', textAlign: 'center', borderRadius: 'var(--radius-xl)', border: '2px dashed var(--zyvokio-aqua)', background: 'rgba(8, 127, 175, 0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div className="pulse-icon-box" style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-lg)', background: 'rgba(18, 207, 229, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--zyvokio-deep-teal)' }}>
              <Layers size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--zyvokio-text-black)' }}>
              Launch {toolData.name}
            </h3>
            <p style={{ maxWidth: '520px', color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
              {toolData.metaDescription}
            </p>
            <button
              type="button"
              className="btn-primary"
              style={{ padding: '14px 32px', fontSize: '1rem', marginTop: '8px' }}
              onClick={() => onOpenPdfTool(matchedPdfTool || { id: toolData.pdfToolId, name: toolData.name, actionLabel: toolData.name })}
            >
              <Zap size={18} />
              <span>Open {toolData.name} Workspace</span>
            </button>
          </div>
        ) : (
          /* Default Image Conversion Dropzone & Queue */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <DropZone
              fromFormat={toolData.fromFormat || 'jpg'}
              toFormat={toolData.toFormat || 'png'}
              onFilesSelected={onFilesSelected}
              onError={(msg) => onNotify?.(msg, 'error')}
            />

            {/* Queue Management Bar if files selected */}
            {queue.length > 0 && (
              <section className="queue-section fade-in" aria-label="Conversion queue">
                <div className="queue-header-bar glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderRadius: 'var(--radius-lg)' }}>
                  <div className="queue-summary" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h2 className="queue-title" style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Queue</h2>
                    <span className="count-pill total">{queue.length} Files</span>
                  </div>
                  <div className="queue-controls" style={{ display: 'flex', gap: '10px' }}>
                    {pendingCount > 0 && (
                      <button className="btn-primary" onClick={handleConvertAll}>
                        <span>Convert All ({pendingCount})</span>
                      </button>
                    )}
                    {completedCount > 0 && (
                      <button className="btn-secondary text-cyan" onClick={handleDownloadAll}>
                        <span>Download All ({completedCount})</span>
                      </button>
                    )}
                    <button className="btn-secondary text-muted" onClick={handleClearQueue}>
                      <span>Clear</span>
                    </button>
                  </div>
                </div>

                <div className="queue-grid" style={{ marginTop: '16px' }}>
                  {queue.map(item => (
                    <FileCard
                      key={item.id}
                      item={item}
                      onConvert={onConvertItem}
                      onDownload={onDownload}
                      onCompare={onCompare}
                      onRemove={onRemoveItem}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </section>

      {/* Step-by-Step "How to" Section */}
      {toolData.howTo && toolData.howTo.length > 0 && (
        <section className="tool-how-to-section" aria-label="Step by step guide" style={{ marginTop: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--zyvokio-text-black)', marginBottom: '8px' }}>
              How to Use {toolData.name} in 3 Easy Steps
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Fast, simple, and runs completely in your browser memory.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {toolData.howTo.map((st) => (
              <div
                key={st.step}
                className="step-card glass-panel"
                style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(18, 207, 229, 0.15)', color: 'var(--zyvokio-deep-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                  {st.step}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--zyvokio-text-black)' }}>
                  {st.title}
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features & Advantages Grid */}
      {toolData.features && toolData.features.length > 0 && (
        <section className="tool-features-section" style={{ marginTop: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--zyvokio-text-black)', marginBottom: '8px' }}>
              Why Choose Zyvokio for {toolData.name}?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Engineered with studio-grade reliability, strict privacy, and zero file restrictions.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {toolData.features.map((feat, idx) => (
              <div
                key={idx}
                className="feature-card glass-panel"
                style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '22px', display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={20} className="text-cyan" />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--zyvokio-text-black)' }}>
                    {feat.title}
                  </h4>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.87rem', lineHeight: 1.55 }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* In-Depth SEO Informational Articles */}
      {toolData.infoSections && toolData.infoSections.length > 0 && (
        <section className="tool-info-article-section glass-panel" style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '36px 30px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {toolData.infoSections.map((sec, idx) => (
            <article key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--zyvokio-text-black)', margin: 0 }}>
                {sec.heading}
              </h3>
              <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                {sec.text}
              </p>
            </article>
          ))}
        </section>
      )}

      {/* Interactive FAQ Accordion (matches FAQPage Schema) */}
      {toolData.faqs && toolData.faqs.length > 0 && (
        <section className="tool-faq-section" aria-label="Frequently Asked Questions" style={{ marginTop: '10px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--zyvokio-text-black)', marginBottom: '8px' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Everything you need to know about {toolData.name}.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '820px', margin: '0 auto' }}>
            {toolData.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="faq-accordion-item"
                  style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', transition: 'all 0.2s ease' }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    style={{ width: '100%', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 700, fontSize: '1rem', color: 'var(--zyvokio-text-black)' }}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0, color: 'var(--zyvokio-deep-teal)' }}
                    />
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 20px 20px', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Related Tools Internal Linking Grid (Essential for Google SEO spider crawling) */}
      {toolData.relatedSlugs && toolData.relatedSlugs.length > 0 && (
        <section className="related-tools-section" style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--zyvokio-text-black)' }}>
                Related Online Tools
              </h3>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Explore other studio-grade utilities for image and PDF processing.
              </p>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onNavigate('/')}
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            >
              <ArrowLeft size={14} />
              <span>All 29+ Tools</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {toolData.relatedSlugs.map((relSlug) => {
              const relTool = getSeoToolBySlug(relSlug);
              if (!relTool) return null;
              return (
                <div
                  key={relSlug}
                  onClick={() => onNavigate(`/${relSlug}`)}
                  className="related-tool-card glass-panel"
                  style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                >
                  <span className="badge" style={{ alignSelf: 'flex-start', fontSize: '0.72rem', background: 'rgba(18, 207, 229, 0.1)', color: 'var(--zyvokio-deep-teal)' }}>
                    {relTool.badge || 'Tool'}
                  </span>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: 'var(--zyvokio-text-black)' }}>
                    {relTool.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {relTool.metaDescription}
                  </p>
                  <span style={{ marginTop: 'auto', fontSize: '0.8rem', color: 'var(--zyvokio-deep-teal)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Open Tool <ArrowRight size={13} />
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
