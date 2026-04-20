'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import type { Product } from '@/lib/productCatalog';

interface StoryPanelProps {
  product: Product;
  index: number;
  isRecommended: boolean;
}

export default function StoryPanel({ product, index, isRecommended }: StoryPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const isEven = index % 2 === 0;

  const specs = [
    { label: 'Driver', value: product.driver },
    { label: 'Battery', value: product.battery },
    { label: 'Water Resistance', value: product.ipx },
    { label: 'ANC Level', value: product.ancLevel.toUpperCase() },
  ];

  return (
    <motion.div
      ref={ref}
      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Visual */}
      <div className="flex-1 relative">
        {isRecommended && (
          <div
            className="absolute -top-4 left-4 z-10 text-xs font-semibold px-3 py-1 rounded-full animate-pulse-glow"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            ★ Recommended for you
          </div>
        )}
        <div
          className={`rounded-3xl glass p-12 aspect-square flex items-center justify-center
            ${isRecommended ? 'glow-accent' : ''}`}
          style={{ minHeight: '300px' }}
        >
          <div className="text-center">
            <div className="text-8xl mb-4">🎧</div>
            <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
              {product.name}
            </p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1">
        <motion.p
          className="text-xs tracking-widest uppercase mb-2"
          style={{ color: 'var(--accent)' }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          {product.type}
        </motion.p>
        <motion.h3
          className="text-4xl md:text-5xl font-bold mb-2 gradient-text"
          initial={{ opacity: 0, x: isEven ? -20 : 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.25, type: 'spring', stiffness: 100 }}
        >
          {product.name}
        </motion.h3>
        <p className="text-xl mb-6" style={{ color: 'var(--text-secondary)' }}>
          {product.tagline}
        </p>
        <p className="text-3xl font-bold mb-8" style={{ color: 'var(--accent-glow)' }}>
          ${product.price}
        </p>

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {specs.map((s) => (
            <div key={s.label} className="glass rounded-xl p-3">
              <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Best for */}
        <div className="flex flex-wrap gap-2 mb-8">
          {product.bestFor.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full glass"
              style={{ color: 'var(--accent-glow)' }}
            >
              {tag}
            </span>
          ))}
        </div>

        <a
          href="#comparison"
          data-cursor-hover
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all glow-accent"
          style={{ backgroundColor: 'var(--accent)', color: 'white' }}
        >
          See Full Specs →
        </a>
      </div>
    </motion.div>
  );
}
