'use client';

import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';
import { MOODS, type Mood } from '@/lib/mood';
import { MOOD_CONFIG } from '@/lib/moodConfig';
import {
  useConfirmMoodSelected,
  useHasSelectedMood,
  useSetMood,
} from '@/store/useMoodStore';

/* ─── Card gradient map ─── */
const CARD_GRADIENTS: Record<Mood, string> = {
  energetic: 'linear-gradient(135deg, #1a0533 0%, #2d0a5e 40%, #0a0014 100%)',
  calm:      'linear-gradient(180deg, #0b1a3d 0%, #061228 60%, #020812 100%)',
  focused:   'linear-gradient(160deg, #111111 0%, #1a1a1a 50%, #0a0a0a 100%)',
  happy:     'linear-gradient(135deg, #2d1a00 0%, #1a0e00 60%, #0d0500 100%)',
  tired:     'linear-gradient(180deg, #071a20 0%, #041015 60%, #020809 100%)',
};

/* ─── Animation variants ─── */
const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
  exit: { opacity: 0, transition: { duration: 0.5, delay: 0.2 } },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const subtextVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] } },
};

const cardContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.55 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
};

/* ── Calm: ripple ── */
function CalmBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            width: `${i * 28}%`,
            height: `${i * 28}%`,
            borderColor: 'rgba(59,130,246,0.18)',
            animation: `mood-ripple ${2.8 + i * 0.7}s ease-in-out ${i * 0.5}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Energetic: neon particle burst ── */
function EnergeticBg() {
  const particles = Array.from({ length: 18 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 120%, rgba(124,58,237,0.35) 0%, transparent 70%)',
        }}
      />
      {particles.map((_, i) => {
        const angle = (i / particles.length) * 360;
        const dist = 25 + (i % 3) * 15;
        const size = 2 + (i % 4);
        return (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{
              width: size,
              height: size,
              background: i % 2 === 0 ? '#A78BFA' : '#7C3AED',
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${dist}px)`,
              animation: `mood-energetic-particle ${1.2 + (i % 5) * 0.3}s ease-in-out ${(i % 7) * 0.2}s infinite alternate`,
              boxShadow: `0 0 6px #A78BFA`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Focused: scan line grid ── */
function FocusedBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(107,114,128,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(107,114,128,0.4) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />
      <div
        className="absolute left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(209,213,219,0.8), transparent)',
          animation: 'mood-scan-line 2.8s linear infinite',
        }}
      />
    </div>
  );
}

/* ── Happy: floating shapes + amber light leak ── */
function HappyBg() {
  const shapes = [
    { x: '10%', y: '20%', size: 18, delay: 0 },
    { x: '80%', y: '15%', size: 12, delay: 0.4 },
    { x: '30%', y: '70%', size: 22, delay: 0.8 },
    { x: '65%', y: '60%', size: 14, delay: 0.2 },
    { x: '50%', y: '30%', size: 10, delay: 1.1 },
    { x: '20%', y: '50%', size: 16, delay: 0.6 },
    { x: '70%', y: '80%', size: 8,  delay: 1.4 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Amber light leak at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1/3"
        style={{
          background: 'linear-gradient(180deg, rgba(245,158,11,0.22) 0%, transparent 100%)',
        }}
      />
      {shapes.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-amber-400/30"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            background: 'rgba(245,158,11,0.15)',
            animation: `mood-happy-float ${2.5 + (i % 3) * 0.8}s ease-in-out ${s.delay}s infinite alternate`,
            boxShadow: '0 0 8px rgba(252,211,77,0.25)',
          }}
        />
      ))}
    </div>
  );
}

/* ── Tired: breathing fog gradient ── */
function TiredBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background: 'linear-gradient(0deg, rgba(13,148,136,0.18) 0%, rgba(13,148,136,0.06) 60%, transparent 100%)',
          animation: 'mood-tired-fog 6s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: 'linear-gradient(0deg, rgba(94,234,212,0.10) 0%, transparent 100%)',
          animation: 'mood-tired-fog 9s ease-in-out 1s infinite alternate-reverse',
        }}
      />
    </div>
  );
}

const BG_MAP: Record<Mood, React.ComponentType> = {
  calm:      CalmBg,
  energetic: EnergeticBg,
  focused:   FocusedBg,
  happy:     HappyBg,
  tired:     TiredBg,
};

/* ─── Individual Mood Card ─── */
interface MoodCardProps {
  mood: Mood;
  onSelect: (mood: Mood) => void;
  isExpanding: boolean;
  isSelected: boolean;
}

function MoodCard({ mood, onSelect, isExpanding, isSelected }: MoodCardProps) {
  const config = MOOD_CONFIG[mood];
  const BgComponent = BG_MAP[mood];
  const idleBorder = `${config.colors.accent}30`;
  const activeBorder = `${config.colors.accent}80`;
  const glowShadow = `0 0 32px ${config.colors.glow}55, 0 0 64px ${config.colors.accent}22`;

  return (
    <motion.div
      layoutId={`mood-card-${mood}`}
      variants={cardVariants}
      animate={{
        boxShadow: isSelected ? glowShadow : 'none',
        borderColor: isSelected ? activeBorder : idleBorder,
      }}
      whileHover={isExpanding ? {} : { scale: 1.04, y: -6, boxShadow: glowShadow, borderColor: activeBorder }}
      whileTap={isExpanding ? {} : { scale: 0.97 }}
      onClick={() => !isExpanding && onSelect(mood)}
      data-cursor-hover
      className="relative overflow-hidden rounded-2xl cursor-pointer select-none"
      style={{
        background: CARD_GRADIENTS[mood],
        border: `1px solid ${idleBorder}`,
        minHeight: 200,
      }}
      transition={{ boxShadow: { duration: 0.35 }, borderColor: { duration: 0.35 } }}
      aria-label={`Select ${config.label} mood: ${config.description}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && !isExpanding && onSelect(mood)}
    >
      {/* Animated background element */}
      <BgComponent />

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full justify-end" style={{ minHeight: 200 }}>
        <div className="mt-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{config.emoji}</span>
            <h3
              className="text-xl font-bold tracking-tight"
              style={{ color: config.colors.text }}
            >
              {config.label}
            </h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: `${config.colors.text}99` }}>
            {config.description}
          </p>
        </div>

        {/* Glow accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${config.colors.accent}, ${config.colors.glow}, ${config.colors.accent}, transparent)`,
            opacity: isSelected ? 1 : 0.4,
          }}
        />
      </div>
    </motion.div>
  );
}

/* ─── Expanding Full-Screen Card (selected state) ─── */
function ExpandingCard({ mood, onComplete }: { mood: Mood; onComplete: () => void }) {
  const config = MOOD_CONFIG[mood];
  const BgComponent = BG_MAP[mood];
  const calledRef = useRef(false);

  // Auto-complete after 1s regardless of animation state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!calledRef.current) {
        calledRef.current = true;
        onComplete();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      layoutId={`mood-card-${mood}`}
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{ background: CARD_GRADIENTS[mood] }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 20,
      }}
    >
      <BgComponent />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="text-center"
        >
          <div className="text-7xl mb-4">{config.emoji}</div>
          <h2
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{ color: config.colors.text }}
          >
            {config.label} Mode
          </h2>
          <p className="text-lg max-w-sm mx-auto px-6" style={{ color: `${config.colors.text}99` }}>
            {config.description}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Animated Gradient Mesh Background ─── */
function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
        style={{
          background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
          top: '-20%', left: '-10%',
          animation: 'mesh-drift-1 18s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-15"
        style={{
          background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)',
          bottom: '-15%', right: '-10%',
          animation: 'mesh-drift-2 24s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-10"
        style={{
          background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)',
          top: '40%', left: '40%',
          animation: 'mesh-drift-3 14s ease-in-out 3s infinite alternate',
        }}
      />
    </div>
  );
}

/* ─── Main Component ─── */
export default function MoodOnboarding() {
  const hasSelectedMood = useHasSelectedMood();
  const setMood = useSetMood();
  const confirmMoodSelected = useConfirmMoodSelected();
  const [expandingMood, setExpandingMood] = useState<Mood | null>(null);
  const [visible, setVisible] = useState(true);
  const completedRef = useRef(false);

  const handleSelect = useCallback((mood: Mood) => {
    if (expandingMood || completedRef.current) return;
    setExpandingMood(mood);
    setMood(mood);
  }, [expandingMood, setMood]);

  const handleExpandComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    // Delay overlay unmount so the filled card can be seen briefly
    setTimeout(() => {
      confirmMoodSelected();
      setVisible(false);
    }, 600);
  }, [confirmMoodSelected]);

  // Don't render if mood already selected
  if (hasSelectedMood) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="mood-onboarding-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[9990] overflow-y-auto"
          style={{ backgroundColor: '#06060C' }}
        >
          {/* Gradient Mesh */}
          <GradientMesh />

          {/* Grain texture */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Central content */}
          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
            {/* Heading */}
            <motion.h1
              variants={headingVariants}
              initial="hidden"
              animate="visible"
              className="text-center font-bold text-5xl md:text-6xl lg:text-7xl mb-4 leading-tight"
              style={{
                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.75) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              How are you feeling<br />today?
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={subtextVariants}
              initial="hidden"
              animate="visible"
              className="text-center text-lg md:text-xl mb-14"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              Your experience adapts to your mood
            </motion.p>

            {/* Mood cards grid: 2-2-1 on desktop, 1 col on mobile */}
            <motion.div
              variants={cardContainerVariants}
              initial="hidden"
              animate="visible"
              className="w-full max-w-4xl"
            >
              {/* Desktop: two rows */}
              <div className="hidden md:grid grid-cols-2 gap-4 mb-4">
                {MOODS.slice(0, 2).map((mood) => (
                  <MoodCard
                    key={mood}
                    mood={mood}
                    onSelect={handleSelect}
                    isExpanding={!!expandingMood}
                    isSelected={expandingMood === mood}
                  />
                ))}
              </div>
              <div className="hidden md:grid grid-cols-2 gap-4 mb-4">
                {MOODS.slice(2, 4).map((mood) => (
                  <MoodCard
                    key={mood}
                    mood={mood}
                    onSelect={handleSelect}
                    isExpanding={!!expandingMood}
                    isSelected={expandingMood === mood}
                  />
                ))}
              </div>
              {/* Last card centered on desktop */}
              <div className="hidden md:flex justify-center">
                <div className="w-1/2 max-w-sm">
                  <MoodCard
                    key={MOODS[4]}
                    mood={MOODS[4]}
                    onSelect={handleSelect}
                    isExpanding={!!expandingMood}
                    isSelected={expandingMood === MOODS[4]}
                  />
                </div>
              </div>

              {/* Mobile: single column */}
              <div className="flex flex-col gap-4 md:hidden">
                {MOODS.map((mood) => (
                  <MoodCard
                    key={mood}
                    mood={mood}
                    onSelect={handleSelect}
                    isExpanding={!!expandingMood}
                    isSelected={expandingMood === mood}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Expanding card overlay */}
          <AnimatePresence>
            {expandingMood && (
              <ExpandingCard
                key={`expanding-${expandingMood}`}
                mood={expandingMood}
                onComplete={handleExpandComplete}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
