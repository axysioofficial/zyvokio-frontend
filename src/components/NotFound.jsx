/**
 * NotFound — 404 error page with noindex SEO.
 *
 * Since this SPA has no router, this component is rendered when
 * the URL hash indicates a missing page or as a standalone fallback.
 */

import React from 'react';
import { AlertCircle, Home } from 'lucide-react';
import SEO from './SEO';

export default function NotFound({ onGoHome }) {
  return (
    <>
      <SEO
        title="Page Not Found — Zyvokio"
        description="The page you are looking for does not exist. Return to Zyvokio to convert images and PDFs for free."
        path="/404"
        noindex={true}
      />

      <main className="not-found-page" role="main">
        <section className="not-found-content" aria-labelledby="not-found-heading">
          <div className="not-found-icon-bubble">
            <AlertCircle size={56} className="text-rose" aria-hidden="true" />
          </div>

          <h1 id="not-found-heading" className="not-found-title">
            404 — Page Not Found
          </h1>

          <p className="not-found-desc">
            Sorry, the page you're looking for doesn't exist or has been moved.
            Head back to Zyvokio to convert images and PDFs with studio-grade quality.
          </p>

          <button
            type="button"
            className="btn-primary not-found-home-btn"
            onClick={onGoHome}
          >
            <Home size={16} />
            <span>Back to Home</span>
          </button>
        </section>
      </main>
    </>
  );
}

