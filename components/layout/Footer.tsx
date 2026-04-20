'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      className="border-t py-16 px-6"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <p className="text-2xl font-bold gradient-text mb-3">NexVerse AI</p>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'var(--text-secondary)' }}>
              Emotion-adaptive audio discovery. We match premium sound to how you actually feel.
            </p>
          </div>

          {/* Products */}
          <div>
            <p className="text-xs tracking-widest uppercase mb-4 font-semibold" style={{ color: 'var(--accent-glow)' }}>
              Products
            </p>
            {['X1', 'X1 Pro', 'X1 Max'].map((p) => (
              <a
                key={p}
                href="#story"
                data-cursor-hover
                className="block text-sm mb-2 transition-colors hover:text-accent-glow"
                style={{ color: 'var(--text-secondary)' }}
              >
                {p}
              </a>
            ))}
          </div>

          {/* Company */}
          <div>
            <p className="text-xs tracking-widest uppercase mb-4 font-semibold" style={{ color: 'var(--accent-glow)' }}>
              Company
            </p>
            {['About', 'Blog', 'Careers', 'Privacy'].map((l) => (
              <a
                key={l}
                href="#"
                data-cursor-hover
                className="block text-sm mb-2 transition-colors hover:text-accent-glow"
                style={{ color: 'var(--text-secondary)' }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>

        <div
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            © {new Date().getFullYear()} NexVerse AI. All rights reserved.
          </p>
          <p className="text-xs font-mono" style={{ color: 'var(--accent)' }}>
            Made with ♥ for audio enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
}
