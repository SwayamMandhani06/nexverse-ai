'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, type Variants } from 'framer-motion';
import dynamic from 'next/dynamic';
import ParticleField from './ParticleField';
import MagneticButton from '@/components/ui/MagneticButton';
import { useCurrentMood } from '@/store/useMoodStore';

/* Lazy-load Three.js model (no SSR) */
const EarphoneModel = dynamic(() => import('./EarphoneModel'), { ssr: false });

/* ── Word-by-word stagger helper ── */
const HEADLINE = "Don't just hear it. Feel it.";
const words = HEADLINE.split(' ');

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.6 + i * 0.08, type: 'spring' as const, stiffness: 120, damping: 20 },
  }),
};

const eyebrowVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.4 } },
};

const subVariants: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { delay: 1.0, duration: 0.4 } },
};

const ctaVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: 1.2 + i * 0.1, type: 'spring' as const, stiffness: 300, damping: 22 },
  }),
};

const BEZIER: [number, number, number, number] = [0.22, 1, 0.36, 1];
const modelVariants: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.8, ease: BEZIER } },
};

const scrollVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 1.6, duration: 0.5 } },
};

const particleVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.2 } },
};

/* ─────────────────────────────────────────── */
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mood       = useCurrentMood();
  const [hasScrolled, setHasScrolled] = useState(false);

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ['start start', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const fadeOut   = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  /* Hide scroll indicator after first scroll */
  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 40) setHasScrolled(true); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-cursor="default"
      style={{
        position:   'relative',
        width:      '100%',
        height:     '100vh',
        overflow:   'hidden',
        display:    'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      {/* ── Layer 0: Particle field ── */}
      <motion.div
        className="absolute inset-0"
        style={{ zIndex: 0 }}
        variants={particleVariants}
        initial="hidden"
        animate="visible"
      >
        <ParticleField />
      </motion.div>

      {/* ── Ambient radial glow ── */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: `radial-gradient(ellipse 70% 55% at 50% 38%,
            color-mix(in srgb, var(--accent) 16%, transparent) 0%,
            transparent 68%)`,
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Layer 1: 3D Model canvas ── */}
      <motion.div
        aria-hidden="true"
        data-cursor="3d"
        style={{
          position:  'absolute',
          right:     'clamp(24px, 4vw, 80px)',
          top:       '50%',
          transform: 'translateY(-50%)',
          width:     'clamp(240px, 38vw, 480px)',
          height:    'clamp(240px, 38vw, 480px)',
          zIndex:    1,
          overflow:  'visible',
        }}
        variants={modelVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Ambient glow halo */}
        <motion.div
          aria-hidden="true"
          style={{
            position:     'absolute',
            inset:        '-18%',
            borderRadius: '50%',
            background:   'radial-gradient(circle, color-mix(in srgb, var(--accent) 28%, transparent) 0%, transparent 70%)',
            filter:       'blur(44px)',
            zIndex:       0,
            pointerEvents:'none',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.55, 0.95, 0.55] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
          <EarphoneModel />
        </div>
      </motion.div>


      {/* ── Layer 2: Content ── */}
      <motion.div
        style={{ y: parallaxY, opacity: fadeOut, position: 'relative', zIndex: 2 }}
      >
        <div
          style={{
            position: 'relative',
            zIndex:   2,
            maxWidth: '700px',
            padding:  '0 32px',
            textAlign: 'left',
            marginLeft: 'clamp(32px, 8vw, 140px)',
          }}
        >
          {/* Eyebrow */}
          <motion.p
            data-cursor="text"
            variants={eyebrowVariants}
            initial="hidden"
            animate="visible"
            style={{
              fontSize:      '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontVariant:   'small-caps',
              color:         'var(--accent)',
              marginBottom:  '24px',
              display:       'flex',
              alignItems:    'center',
              gap:           '10px',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width:   '6px',
                height:  '6px',
                borderRadius: '50%',
                background:   'var(--accent)',
                boxShadow:    '0 0 10px var(--accent-glow)',
                animation:    'pulse 2s ease-in-out infinite',
              }}
            />
            NexVerse&nbsp;AI
          </motion.p>

          {/* Headline — word by word */}
          <h1
            data-cursor="text"
            style={{
              fontSize:    'clamp(48px, 6.5vw, 88px)',
              fontWeight:  700,
              lineHeight:  1.05,
              margin:      '0 0 28px',
              color:       'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'inline-block', marginRight: '0.28em' }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subheadline */}
          <motion.p
            data-cursor="text"
            variants={subVariants}
            initial="hidden"
            animate="visible"
            style={{
              fontSize:    '18px',
              lineHeight:  1.65,
              color:       'var(--text-secondary)',
              marginBottom: '44px',
              maxWidth:    '520px',
            }}
          >
            Adaptive audio.&nbsp; Emotion-driven experience.&nbsp; AI-guided discovery.
          </motion.p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {(['Experience Now', 'Explore Sound'] as const).map((label, i) => (
              <motion.div
                key={label}
                custom={i}
                variants={ctaVariants}
                initial="hidden"
                animate="visible"
              >
                <MagneticButton
                  variant={i === 0 ? 'primary' : 'ghost'}
                  onClick={() => {
                    const target = document.getElementById(i === 0 ? 'story' : 'comparison');
                    target?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {label}
                  {i === 0 && (
                    <svg
                      width="16" height="16" viewBox="0 0 16 16"
                      fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ flexShrink: 0 }}
                    >
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  )}
                </MagneticButton>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <AnimatePresence>
        {!hasScrolled && (
          <motion.div
            variants={scrollVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            aria-hidden="true"
            style={{
              position:  'absolute',
              bottom:    '36px',
              left:      '50%',
              translateX: '-50%',
              display:   'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap:        '6px',
              zIndex:     3,
            }}
          >
            <span
              style={{
                fontSize:      '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color:         'var(--text-secondary)',
                opacity:       0.6,
              }}
            >
              Scroll
            </span>
            {/* animated chevron */}
            <svg
              width="20" height="28" viewBox="0 0 20 28"
              fill="none"
              style={{ animation: 'hero-bounce 1.4s ease-in-out infinite', color: 'var(--accent)' }}
            >
              <path d="M10 4 L10 20 M4 14 L10 20 L16 14"
                stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
