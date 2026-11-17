import { useEffect, useRef } from 'react';

/**
 * <AdContainer /> — Reusable Adsterra Ad Unit Container
 * 
 * Supports:
 * - In-content banners: 728x90 (Desktop) / 300x250 (Mobile) / 468x60
 * - Side skyscrapers: 160x600 (Desktop sidebars)
 * - Safe dynamic script loading in React
 * - Professional placeholder state when no key is configured
 *
 * Props:
 *   slotType  – 'banner' (default 728x90/300x250) | 'sidebar' (160x600) | 'native'
 *   zoneKey   – Custom Adsterra zone key (or falls back to VITE_ADSTERRA_BANNER_KEY / VITE_ADSTERRA_SIDEBAR_KEY)
 *   width     – Explicit width (default depends on slotType)
 *   height    – Explicit height (default depends on slotType)
 *   label     – Badge text (default "Advertisement")
 *   className – Extra CSS classes
 */
export default function AdContainer({
  slotType = 'banner',
  zoneKey = '',
  width,
  height,
  label = 'Advertisement',
  className = ''
}) {
  const containerRef = useRef(null);

  // Resolve dimensions based on slot type if not explicitly provided
  const isSidebar = slotType === 'sidebar';
  const resolvedWidth = width || (isSidebar ? 160 : 728);
  const resolvedHeight = height || (isSidebar ? 600 : 90);

  // Resolve key from prop, env variable, or default user key 6208066
  const resolvedKey =
    zoneKey ||
    (isSidebar
      ? import.meta.env.VITE_ADSTERRA_SIDEBAR_KEY
      : import.meta.env.VITE_ADSTERRA_BANNER_KEY) ||
    '6208066';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous ad content to prevent duplicates on re-render
    container.innerHTML = '';

    if (!resolvedKey) return;

    try {
      // Create options script
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.text = `
        atOptions = {
          'key' : '${resolvedKey}',
          'format' : 'iframe',
          'height' : ${resolvedHeight},
          'width' : ${resolvedWidth},
          'params' : {}
        };
      `;

      // Create invoke script
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `//www.highperformanceformat.com/${resolvedKey}/invoke.js`;
      invokeScript.async = true;

      container.appendChild(confScript);
      container.appendChild(invokeScript);
    } catch (err) {
      console.warn('Adsterra ad failed to initialize:', err);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [resolvedKey, resolvedWidth, resolvedHeight]);

  return (
    <div
      className={`adsterra-wrapper adsterra-${slotType} ${className}`}
      aria-label="Sponsored Advertisement"
    >
      <div className="adsterra-header">
        <span className="adsterra-badge">{label}</span>
      </div>

      <div
        className="adsterra-slot-box"
        style={{
          minHeight: `${resolvedHeight}px`,
          maxWidth: isSidebar ? `${resolvedWidth}px` : '100%'
        }}
      >
        {/* Dynamic Ad Script Mount Target */}
        <div
          ref={containerRef}
          id={`container-${resolvedKey}`}
          className="adsterra-mount-target"
        />

        {/* Informative placeholder shown when no zone key has been supplied */}
        {!resolvedKey && (
          <div className="adsterra-placeholder">
            <div className="adsterra-placeholder-badge">Adsterra Ad Slot</div>
            <div className="adsterra-placeholder-specs">
              {isSidebar ? '160 × 600 Skyscraper' : '728 × 90 Leaderboard / 300 × 250 Banner'}
            </div>
            <p className="adsterra-placeholder-text">
              Connect your <strong>Adsterra Zone Key</strong> in <code>.env</code> or pass <code>zoneKey</code> to display live ads.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

