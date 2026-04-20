'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { PRODUCTS } from '@/lib/productCatalog';
import { useCurrentMood } from '@/store/useMoodStore';
import { MOOD_CONFIG } from '@/lib/moodConfig';
import StoryPanel from './StoryPanel';

export default function StorySection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const mood = useCurrentMood();
  const config = MOOD_CONFIG[mood];

  return (
    <section
      ref={ref}
      id="story"
      className="relative py-32 px-6"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-20 text-center">
        <motion.p
          className="text-xs tracking-[0.3em] uppercase mb-4"
          style={{ color: 'var(--accent)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          The Collection
        </motion.p>
        <motion.h2
          className="text-4xl md:text-6xl font-bold gradient-text mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Three tiers of excellence
        </motion.h2>
        <motion.p
          className="text-lg max-w-xl mx-auto"
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.25 }}
        >
          Based on your {config.label} mood, we recommend the{' '}
          <span style={{ color: 'var(--accent-glow)', fontWeight: 600 }}>
            {PRODUCTS.find((p) => p.id === config.recommendedProduct)?.name}
          </span>
          .
        </motion.p>
      </div>

      {/* Product panels */}
      <div className="max-w-7xl mx-auto flex flex-col gap-24">
        {PRODUCTS.map((product, index) => (
          <StoryPanel
            key={product.id}
            product={product}
            index={index}
            isRecommended={product.id === config.recommendedProduct}
          />
        ))}
      </div>
    </section>
  );
}
