import React from 'react';
import { Zap, ShieldCheck, DatabaseZap, Sparkles, SlidersHorizontal, Cpu } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Cpu,
      title: 'Sharp Turbo Engine',
      description: 'Powered by libvips and Node Sharp. Converts high-resolution images up to 8x faster than traditional canvas or ImageMagick processors.'
    },
    {
      icon: DatabaseZap,
      title: 'Zero Database Required',
      description: 'Zero data saved on external servers. All session and conversion histories are stored strictly in your browser LocalStorage for privacy.'
    },
    {
      icon: Sparkles,
      title: 'Lossless Studio Quality',
      description: 'Converts JPG/JPEG matrices directly into uncompressed or balanced PNG color spaces without introducing compression artifacts.'
    },
    {
      icon: ShieldCheck,
      title: 'In-Memory Processing',
      description: 'Images are processed directly in Node memory buffers and purged immediately after transmission. No disk leaks or file leftovers.'
    }
  ];

  return (
    <section className="features-section">
      <div className="features-header">
        <h2 className="features-title">
          Engineered for <span className="gradient-text">Speed & Privacy</span>
        </h2>
        <p className="features-subtitle">
          Professional image processing architecture running directly on Node.js and your modern browser.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div key={idx} className="feature-card glass-panel">
              <div className="feature-icon-bubble">
                <Icon size={22} className="feature-icon" />
              </div>
              <h3 className="feature-card-title">{feat.title}</h3>
              <p className="feature-card-desc">{feat.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
