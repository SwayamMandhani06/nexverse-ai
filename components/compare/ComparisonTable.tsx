'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { PRODUCTS } from '@/lib/productCatalog';
import { useCurrentMood } from '@/store/useMoodStore';
import { MOOD_CONFIG } from '@/lib/moodConfig';

const COMPARISON_ROWS = [
  { label: 'Price',             key: 'price',     format: (v: unknown) => `$${v}` },
  { label: 'Driver Type',       key: 'driver',    format: (v: unknown) => String(v) },
  { label: 'Battery Life',      key: 'battery',   format: (v: unknown) => String(v) },
  { label: 'ANC Level',         key: 'ancLevel',  format: (v: unknown) => (v as string).toUpperCase() },
  { label: 'Water Resistance',  key: 'ipx',       format: (v: unknown) => String(v) },
  { label: 'Type',              key: 'type',      format: (v: unknown) => String(v) },
];

export default function ComparisonTable() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const mood = useCurrentMood();
  const config = MOOD_CONFIG[mood];

  return (
    <section
      ref={ref}
      id="comparison"
      className="py-32 px-6"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            className="text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: 'var(--accent)' }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
          >
            Compare
          </motion.p>
          <motion.h2
            className="text-4xl md:text-6xl font-bold gradient-text mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            Side by side
          </motion.h2>
        </div>

        <motion.div
          className="rounded-3xl overflow-hidden"
          style={{ border: '1px solid var(--border)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          {/* Header row */}
          <div
            className="grid grid-cols-4 gap-0"
            style={{ backgroundColor: 'var(--surface-1)' }}
          >
            <div className="p-5 border-b border-r" style={{ borderColor: 'var(--border)' }} />
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                className={`p-5 border-b border-r text-center ${
                  product.id === config.recommendedProduct ? 'glow-accent' : ''
                }`}
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: product.id === config.recommendedProduct
                    ? 'color-mix(in srgb, var(--accent) 10%, transparent)'
                    : 'transparent',
                }}
              >
                {product.id === config.recommendedProduct && (
                  <span
                    className="block text-xs font-bold mb-1"
                    style={{ color: 'var(--accent-glow)' }}
                  >
                    ★ Best for you
                  </span>
                )}
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {product.name}
                </span>
              </div>
            ))}
          </div>

          {/* Data rows */}
          {COMPARISON_ROWS.map((row, rowIdx) => (
            <div
              key={row.key}
              className="grid grid-cols-4 transition-colors hover:bg-surface-1"
              style={{
                backgroundColor: rowIdx % 2 === 0 ? 'transparent' : 'var(--surface-1)',
              }}
            >
              <div
                className="p-4 border-r flex items-center font-medium text-sm"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                {row.label}
              </div>
              {PRODUCTS.map((product) => (
                <div
                  key={product.id}
                  className="p-4 border-r text-center flex items-center justify-center text-sm font-semibold"
                  style={{
                    borderColor: 'var(--border)',
                    color: product.id === config.recommendedProduct
                      ? 'var(--accent-glow)'
                      : 'var(--text-primary)',
                  }}
                >
                  {row.format(product[row.key as keyof typeof product])}
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
