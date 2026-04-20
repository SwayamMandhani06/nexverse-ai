'use client';

import { type Mood } from '@/lib/mood';
import { useCurrentMood } from '@/store/useMoodStore';

/* ─── Calm: Slow radial gradient blob ─── */
function CalmAmbient() {
  return (
    <>
      <div
        className="absolute w-[900px] h-[900px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'ambient-calm-blob 20s ease-in-out infinite alternate',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(147,197,253,0.04) 0%, transparent 70%)',
          bottom: '10%',
          right: '10%',
          animation: 'ambient-calm-blob 28s ease-in-out 4s infinite alternate-reverse',
          filter: 'blur(80px)',
        }}
      />
    </>
  );
}

const ENERGETIC_PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  x: (i * 17) % 100,
  delay: ((i * 13) % 120) / 10,
  dur: 6 + ((i * 11) % 80) / 10,
  size: 1 + ((i * 7) % 30) / 10,
}));

/* ─── Energetic: CSS particle field ─── */
function EnergeticAmbient() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 20% 80%, rgba(124,58,237,0.08) 0%, transparent 60%)',
        }}
      />
      {ENERGETIC_PARTICLES.map((particle, i) => {
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              bottom: '-8px',
              width: particle.size,
              height: particle.size,
              background: i % 3 === 0 ? '#A78BFA' : i % 3 === 1 ? '#7C3AED' : '#C4B5FD',
              opacity: 0,
              animation: `ambient-particle-rise ${particle.dur}s linear ${particle.delay}s infinite`,
              boxShadow: `0 0 ${particle.size * 3}px currentColor`,
            }}
          />
        );
      })}
    </>
  );
}

/* ─── Focused: static dark, no animation ─── */
function FocusedAmbient() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)',
      }}
    />
  );
}

/* ─── Happy: floating warm light orbs ─── */
function HappyAmbient() {
  const orbs = [
    { x: '10%', y: '20%', size: 280, dur: 18 },
    { x: '75%', y: '60%', size: 220, dur: 24, delay: 5 },
    { x: '40%', y: '80%', size: 180, dur: 20, delay: 9 },
    { x: '85%', y: '15%', size: 160, dur: 15, delay: 3 },
  ];
  return (
    <>
      {orbs.map((o, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: o.x,
            top: o.y,
            width: o.size,
            height: o.size,
            background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: `ambient-orb-float ${o.dur}s ease-in-out ${(o as {delay?: number}).delay ?? 0}s infinite alternate`,
          }}
        />
      ))}
      <div
        className="absolute top-0 left-0 right-0 h-64"
        style={{
          background: 'linear-gradient(180deg, rgba(245,158,11,0.05) 0%, transparent 100%)',
        }}
      />
    </>
  );
}

/* ─── Tired: upward drifting fog ─── */
function TiredAmbient() {
  return (
    <>
      <div
        className="absolute inset-x-0 bottom-0 h-3/4"
        style={{
          background: 'linear-gradient(0deg, rgba(13,148,136,0.08) 0%, rgba(13,148,136,0.03) 50%, transparent 100%)',
          animation: 'ambient-tired-fog 12s ease-in-out infinite alternate',
          filter: 'blur(30px)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background: 'linear-gradient(0deg, rgba(94,234,212,0.05) 0%, transparent 100%)',
          animation: 'ambient-tired-fog 18s ease-in-out 3s infinite alternate-reverse',
          filter: 'blur(50px)',
        }}
      />
    </>
  );
}

const AMBIENT_MAP: Record<Mood, React.ComponentType> = {
  calm:      CalmAmbient,
  energetic: EnergeticAmbient,
  focused:   FocusedAmbient,
  happy:     HappyAmbient,
  tired:     TiredAmbient,
};

export default function AmbientBackground() {
  const mood = useCurrentMood();
  const AmbientComponent = AMBIENT_MAP[mood];

  return (
    <div
      aria-hidden
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1 }}
    >
      {/* Base bg from CSS var */}
      <div
        className="absolute inset-0 transition-colors"
        style={{
          backgroundColor: 'var(--bg-primary)',
          transitionDuration: 'var(--dur-page)',
          transitionTimingFunction: 'var(--ease-default)',
        }}
      />
      <AmbientComponent />
    </div>
  );
}
