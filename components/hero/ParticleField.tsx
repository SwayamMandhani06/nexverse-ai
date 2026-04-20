'use client';

import { useCallback, useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';
import { useCurrentMood } from '@/store/useMoodStore';
import { MOOD_CONFIG } from '@/lib/moodConfig';
import type { Mood } from '@/lib/mood';

/* ── Per-mood tsParticles config builders ── */
function buildOptions(mood: Mood): ISourceOptions {
  const cfg = MOOD_CONFIG[mood].particleConfig;

  // Focused: blank canvas
  if (mood === 'focused') {
    return {
      fullScreen: { enable: false },
      particles: { number: { value: 0 } },
    };
  }

  return {
    fullScreen: { enable: false },
    fpsLimit: 60,
    background: { color: { value: 'transparent' } },
    particles: {
      number: {
        value: cfg.count,
        density: { enable: true },
      },
      color: { value: cfg.color },
      opacity: {
        value: { min: 0.05, max: Math.min(cfg.opacity, 0.4) },
        animation: {
          enable: true,
          speed: 0.5,
          sync: false,
          startValue: 'random' as const,
        },
      },
      size: {
        value: { min: cfg.size * 0.5, max: cfg.size * 1.5 },
      },
      shape: {
        type: mood === 'happy' ? 'star' : 'circle',
      },
      move: {
        enable: true,
        speed: cfg.speed,
        direction: mood === 'tired' ? ('top' as const) : ('none' as const),
        random: true,
        straight: false,
        outModes: { default: 'out' as const },
      },
      links: {
        enable: mood === 'energetic',
        distance: 120,
        color: cfg.color,
        opacity: 0.2,
        width: 1,
      },
      ...(mood === 'calm' && { size: { value: { min: 2, max: 5 } } }),
    },
    interactivity: {
      events: {
        onHover: { enable: false },
        onClick: { enable: false },
      },
    },
    detectRetina: true,
  };
}

/* ────────────────────────────────────────── */
export default function ParticleField() {
  const mood = useCurrentMood();
  const [engineReady, setEngineReady] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  // Init engine once on mount
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setEngineReady(true);
    });
  }, []);

  // Re-key on mood change to reinitialise particle config
  useEffect(() => {
    if (engineReady) {
      setRenderKey((k) => k + 1);
    }
  }, [mood, engineReady]);

  // Also listen to custom 'moodchange' event
  useEffect(() => {
    const handler = () => setRenderKey((k) => k + 1);
    window.addEventListener('moodchange', handler);
    return () => window.removeEventListener('moodchange', handler);
  }, []);

  const particlesLoaded = useCallback(async () => {
    // no-op — hook required but we don't need it
  }, []);

  if (!engineReady) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <Particles
        key={renderKey}
        id={`nexverse-particles-${renderKey}`}
        options={buildOptions(mood)}
        particlesLoaded={particlesLoaded}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
    </div>
  );
}
