import { useEffect, useRef, useState } from 'react';

// Adsterra Approved Ad Units for zyvokio.vercel.app
const AD_UNITS = {
  // Desktop Side Rails (Left & Right 160x600 Skyscrapers)
  sidebar: {
    key: 'd10c0e6836c5978e4d89d5c181f50769',
    width: 160,
    height: 600,
    src: 'https://bauval.org/22/d10c0e6836c5978e4d89d5c181f50769'
  },
  // In-Content Desktop Leaderboard (728x90)
  leaderboard: {
    key: '42dc86d446dbee5162993c1e77a6a19f',
    width: 728,
    height: 90,
    src: 'https://bauval.org/22/42dc86d446dbee5162993c1e77a6a19f'
  },
  // In-Content Mobile Rectangle (300x250)
  rectangle: {
    key: '218db45a87a820418cff772cc3f27ccc',
    width: 300,
    height: 250,
    src: 'https://bauval.org/22/218db45a87a820418cff772cc3f27ccc'
  }
};

/**
 * <AdContainer /> — High-Reliability Adsterra Ad Unit for React
 *
 * Uses an isolated sandboxed iframe to guarantee document.write & Adsterra script
 * executes cleanly without React state conflicts, ad-block collisions, or re-render issues.
 */
export default function AdContainer({
  slotType = 'banner', // 'banner' | 'sidebar'
  label = 'Advertisement',
  className = ''
}) {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Determine active unit based on slotType and screen size
  const activeUnit =
    slotType === 'sidebar'
      ? (isMobile ? AD_UNITS.rectangle : AD_UNITS.sidebar)
      : isMobile
      ? AD_UNITS.rectangle
      : AD_UNITS.leaderboard;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !activeUnit) return;

    container.innerHTML = '';

    // Create an isolated iframe for reliable execution
    const iframe = document.createElement('iframe');
    iframe.width = `${activeUnit.width}px`;
    iframe.height = `${activeUnit.height}px`;
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.display = 'block';
    iframe.style.margin = '0 auto';
    iframe.scrolling = 'no';
    iframe.title = label;

    container.appendChild(iframe);

    try {
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <base target="_blank">
            <style>
              html, body {
                margin: 0;
                padding: 0;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                background: transparent;
                width: 100%;
                height: 100%;
              }
            </style>
          </head>
          <body>
            <script type="text/javascript">
              atOptions = {
                'key' : '${activeUnit.key}',
                'format' : 'iframe',
                'height' : ${activeUnit.height},
                'width' : ${activeUnit.width},
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="${activeUnit.src}"></script>
          </body>
        </html>
      `);
      doc.close();
    } catch (err) {
      console.warn('Adsterra frame execution error:', err);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [activeUnit, label]);

  return (
    <div
      className={`adsterra-wrapper adsterra-${slotType} ${className}`}
      aria-label="Sponsored Content"
    >
      <div
        className="adsterra-slot-box"
        style={{
          minHeight: `${activeUnit.height}px`,
          minWidth: `${Math.min(activeUnit.width, 300)}px`
        }}
      >
        <div ref={containerRef} className="adsterra-mount-target" />
      </div>
    </div>
  );
}
