'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOODS, type Mood } from '@/lib/mood';
import { MOOD_CONFIG } from '@/lib/moodConfig';
import {
  useConfirmMoodSelected,
  useCurrentMood,
  useHasSelectedMood,
  useSetMood,
} from '@/store/useMoodStore';

/**
 * MoodPill — floating navbar indicator that shows the current mood.
 * Clicking it reopens the MoodOnboarding in a centered modal overlay.
 */
export default function MoodPill() {
  const mood = useCurrentMood();
  const hasSelectedMood = useHasSelectedMood();
  const [modalOpen, setModalOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const config = MOOD_CONFIG[mood];

  if (!hasSelectedMood) return null;

  return (
    <>
      {/* Floating pill button */}
      <div className="relative inline-flex items-center">
        <AnimatePresence>
          {tooltipVisible && (
            <motion.div
              key="tooltip"
              initial={{ opacity: 0, y: 4, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.92 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
              style={{
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.7)',
                fontSize: 11,
                padding: '4px 10px',
                borderRadius: 99,
                pointerEvents: 'none',
              }}
            >
              Change your mood
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          key={`pill-${mood}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22, delay: 0.1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => setModalOpen(true)}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
          onFocus={() => setTooltipVisible(true)}
          onBlur={() => setTooltipVisible(false)}
          aria-label={`Current mood: ${config.label}. Click to change your mood.`}
          data-cursor-hover
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all"
          style={{
            background: `color-mix(in srgb, ${config.colors.accent} 18%, transparent)`,
            border: `1px solid ${config.colors.accent}55`,
            color: config.colors.text,
            boxShadow: `0 0 14px ${config.colors.glow}44, 0 0 28px ${config.colors.accent}22`,
          }}
        >
          <span className="text-base leading-none">{config.emoji}</span>
          <span className="capitalize hidden sm:inline">{config.label}</span>
        </motion.button>
      </div>

      {/* Re-open modal (centered, not full-screen) */}
      <AnimatePresence>
        {modalOpen && (
          <MoodModal onClose={() => setModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Modal wrapper for re-open flow ─── */
function MoodModal({ onClose }: { onClose: () => void }) {
  const setMood = useSetMood();
  const confirmMoodSelected = useConfirmMoodSelected();

  const handleMoodSelect = (newMood: Mood) => {
    setMood(newMood);
    confirmMoodSelected();
    onClose();
  };

  return (
    <motion.div
      key="mood-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9980] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl"
        style={{
          background: 'rgba(10,10,20,0.95)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          padding: '32px 28px',
        }}
      >
        {/* Close btn */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-white/10"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          aria-label="Close mood selector"
        >
          ✕
        </button>

        <h2
          className="text-2xl font-bold text-center mb-1"
          style={{ color: '#fff' }}
        >
          Switch your mood
        </h2>
        <p className="text-center text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Your experience will adapt instantly
        </p>

        {/* Inline mini onboarding */}
        <MoodOnboardingInline onSelect={handleMoodSelect} />
      </motion.div>
    </motion.div>
  );
}

/* ─── Compact inline version for modal ─── */
function MoodOnboardingInline({ onSelect }: { onSelect: (m: Mood) => void }) {
  const currentMood = useCurrentMood();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {MOODS.map((m) => {
        const cfg = MOOD_CONFIG[m];
        const isActive = m === currentMood;
        return (
          <motion.button
            key={m}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(m)}
            data-cursor-hover
            className="relative overflow-hidden rounded-xl text-left p-4 transition-all"
            style={{
              background: isActive
                ? `color-mix(in srgb, ${cfg.colors.accent} 20%, transparent)`
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isActive ? cfg.colors.accent : 'rgba(255,255,255,0.07)'}`,
              boxShadow: isActive
                ? `0 0 18px ${cfg.colors.glow}44`
                : 'none',
            }}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">{cfg.emoji}</span>
              <span className="font-semibold text-sm" style={{ color: cfg.colors.text }}>
                {cfg.label}
              </span>
              {isActive && (
                <span
                  className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: cfg.colors.accent, color: '#fff' }}
                >
                  Active
                </span>
              )}
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {cfg.description}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}
