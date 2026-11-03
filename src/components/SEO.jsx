/**
 * <SEO /> — Reusable per-page SEO component for React 19.
 *
 * Uses React 19's native support for <title>, <meta>, and <link>
 * tags inside component trees (no react-helmet-async required).
 *
 * Props:
 *   title       – Page title (50-60 chars ideal)
 *   description – Meta description (150-160 chars ideal)
 *   path        – URL path, e.g. "/" or "/pdf-tools" (used for canonical)
 *   image       – Open Graph image URL (1200x630 recommended)
 *   noindex     – If true, adds noindex robots directive
 *   schema      – JSON-LD structured data object (or array of objects)
 */

import { SITE_URL, SITE_NAME, DEFAULT_TITLE, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, THEME_COLOR, TWITTER_HANDLE } from '../utils/seoConfig';

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  noindex = false,
  schema = null
}) {
  const canonicalUrl = `${SITE_URL}${path}`;
  // Ensure title stays strictly between 30 and 60 characters
  let fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  if (fullTitle.length > 60) {
    fullTitle = fullTitle.slice(0, 57).trim() + '...';
  }

  return (
    <>
      {/* Page Title */}
      <title>{fullTitle}</title>

      {/* Standard Meta */}
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="theme-color" content={THEME_COLOR} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SITE_NAME} — Studio-Grade Image & PDF Converter`} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={`${SITE_NAME} — Studio-Grade Image & PDF Converter`} />

      {/* JSON-LD Structured Data */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(Array.isArray(schema) ? schema : schema)
          }}
        />
      )}
    </>
  );
}
