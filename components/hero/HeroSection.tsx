'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useCurrentMood } from '@/store/useMoodStore';
import { MOOD_CONFIG } from '@/lib/moodConfig';
import ParticleField from './ParticleField';

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const mood = useCurrentMood();
  const config = MOOD_CONFIG[mood];

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Particle background */}
      <ParticleField />

      {/* Radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 40%, color-mix(in srgb, var(--accent) 18%, transparent) 0%, transparent 70%)`,
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center max-w-5xl mx-auto px-6 pt-24"
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8 text-xs tracking-widest uppercase"
          style={{ color: 'var(--accent-glow)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: 'var(--active)' }}
          />
          {config.emoji} {config.label} Mode Active
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 100 }}
        >
          <span className="gradient-text text-glow">Sound that</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>feels you.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          className="text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {config.description}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <a
            href="#story"
            data-cursor-hover
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all glow-accent"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            Explore the X1 Max
            <span>→</span>
          </a>
          <a
            href="#comparison"
            data-cursor-hover
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-medium glass transition-all hover:glow-accent"
            style={{ color: 'var(--text-primary)' }}
          >
            Compare Models
          </a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-secondary)' }}>
            Scroll
          </span>
          <motion.div
            className="w-px h-12"
            style={{ background: 'linear-gradient(to bottom, var(--accent), transparent)' }}
            animate={{ scaleY: [0, 1, 0], originY: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
