'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useAudioStore, type AudioMode } from '@/store/useAudioStore';
import AudioVisualizer from './AudioVisualizer';

const AUDIO_MODES: Array<{
  id: AudioMode;
  label: string;
  icon: string;
  description: string;
}> = [
  { id: 'bass',    label: 'Bass Boost', icon: '🔊', description: 'Deep, punchy low-end frequencies that hit your chest.' },
  { id: 'studio',  label: 'Studio',     icon: '🎙️', description: 'Flat, reference-grade sound for accurate mixing.' },
  { id: 'spatial', label: 'Spatial',    icon: '🌐', description: '360° immersive sound field — like being there live.' },
  { id: 'anc',     label: 'ANC',        icon: '🤫', description: 'Active Noise Cancellation — silence on command.' },
];

export default function AudioSimulator() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { activeMode, setMode, isPlaying, togglePlay } = useAudioStore();

  return (
    <section
      ref={ref}
      id="audio"
      className="relative py-32 px-6"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            className="text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: 'var(--accent)' }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
          >
            Audio Experience
          </motion.p>
          <motion.h2
            className="text-4xl md:text-6xl font-bold gradient-text mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            Hear the difference
          </motion.h2>
          <motion.p
            className="text-base"
            style={{ color: 'var(--text-secondary)' }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            Select a sound mode to feel how X1 Max transforms your world.
          </motion.p>
        </div>

        {/* Visualizer */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          <AudioVisualizer isPlaying={isPlaying} activeMode={activeMode} />
        </motion.div>

        {/* Mode selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {AUDIO_MODES.map((mode, i) => (
            <motion.button
              key={mode.id}
              onClick={() => setMode(activeMode === mode.id ? null : mode.id)}
              data-cursor-hover
              className={`rounded-2xl p-4 text-left transition-all ${
                activeMode === mode.id ? 'glow-accent' : 'glass hover:glow-accent'
              }`}
              style={{
                backgroundColor: activeMode === mode.id
                  ? 'color-mix(in srgb, var(--accent) 20%, transparent)'
                  : 'var(--surface-1)',
                border: activeMode === mode.id
                  ? '1px solid var(--accent)'
                  : '1px solid var(--border)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35 + i * 0.07 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="text-2xl mb-2">{mode.icon}</div>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {mode.label}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {mode.description}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Play button */}
        <div className="text-center">
          <motion.button
            onClick={togglePlay}
            data-cursor-hover
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base transition-all glow-accent"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="text-xl">{isPlaying ? '⏸' : '▶'}</span>
            {isPlaying ? 'Pause Preview' : 'Play Preview'}
          </motion.button>
        </div>
      </div>
    </section>
  );
}
