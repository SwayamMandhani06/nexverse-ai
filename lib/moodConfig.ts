import type { Mood } from '@/lib/mood';

export interface ParticleConfig {
  speed: number;
  count: number;
  color: string;
  size: number;
  opacity: number;
}

export interface MoodColors {
  bg: string;
  accent: string;
  glow: string;
  text: string;
}

export interface MoodConfigEntry {
  label: string;
  description: string;
  emoji: string;
  colors: MoodColors;
  animationClass: string;
  particleConfig: ParticleConfig;
  fontWeight: string;
  borderRadius: string;
  recommendedProduct: string;
}

export const MOOD_CONFIG: Record<Mood, MoodConfigEntry> = {
  energetic: {
    label: 'Energetic',
    description: 'Power through with bass-forward soundscapes and vibrant energy.',
    emoji: '⚡',
    colors: {
      bg: '#0A0A0F',
      accent: '#7C3AED',
      glow: '#A78BFA',
      text: '#F9FAFB',
    },
    animationClass: 'animate-pulse-glow',
    particleConfig: {
      speed: 2.5,
      count: 120,
      color: '#7C3AED',
      size: 1.5,
      opacity: 0.8,
    },
    fontWeight: '700',
    borderRadius: '8px',
    recommendedProduct: 'x1-max',
  },
  calm: {
    label: 'Calm',
    description: 'Let ocean-deep tones wash over you. Breathe. Be still.',
    emoji: '🌊',
    colors: {
      bg: '#0B1120',
      accent: '#3B82F6',
      glow: '#93C5FD',
      text: '#F0F4FF',
    },
    animationClass: 'animate-float',
    particleConfig: {
      speed: 0.6,
      count: 60,
      color: '#3B82F6',
      size: 1.2,
      opacity: 0.5,
    },
    fontWeight: '300',
    borderRadius: '24px',
    recommendedProduct: 'x1-pro',
  },
  focused: {
    label: 'Focused',
    description: 'Crisp, neutral audio. No distractions. Just deep work.',
    emoji: '🎯',
    colors: {
      bg: '#111111',
      accent: '#6B7280',
      glow: '#D1D5DB',
      text: '#FFFFFF',
    },
    animationClass: 'animate-none',
    particleConfig: {
      speed: 0.4,
      count: 30,
      color: '#6B7280',
      size: 0.8,
      opacity: 0.3,
    },
    fontWeight: '500',
    borderRadius: '4px',
    recommendedProduct: 'x1-pro',
  },
  happy: {
    label: 'Happy',
    description: 'Warm, bright, joyful sound that matches your golden mood.',
    emoji: '✨',
    colors: {
      bg: '#1A0E00',
      accent: '#F59E0B',
      glow: '#FCD34D',
      text: '#FFFBEB',
    },
    animationClass: 'animate-waveform',
    particleConfig: {
      speed: 1.8,
      count: 90,
      color: '#F59E0B',
      size: 1.8,
      opacity: 0.7,
    },
    fontWeight: '600',
    borderRadius: '16px',
    recommendedProduct: 'x1',
  },
  tired: {
    label: 'Tired',
    description: 'Soothing teal frequencies to gently restore your energy.',
    emoji: '🌙',
    colors: {
      bg: '#071015',
      accent: '#0D9488',
      glow: '#5EEAD4',
      text: '#ECFDF5',
    },
    animationClass: 'animate-particle-drift',
    particleConfig: {
      speed: 0.3,
      count: 40,
      color: '#0D9488',
      size: 1.0,
      opacity: 0.4,
    },
    fontWeight: '300',
    borderRadius: '20px',
    recommendedProduct: 'x1',
  },
};
