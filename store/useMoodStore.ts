'use client';

import { create } from 'zustand';
import {
  DEFAULT_MOOD,
  LS_MOOD_KEY,
  LS_MOOD_VALUE_KEY,
  applyMoodToDocument,
  emitMoodChange,
  getStoredMood,
  type Mood,
} from '@/lib/mood';

interface MoodState {
  mood: Mood;
  hasSelectedMood: boolean;
  setMood: (mood: Mood) => void;
  confirmMoodSelected: () => void;
  rehydrate: () => void;
}

export const useMoodStore = create<MoodState>((set) => ({
  mood: DEFAULT_MOOD,
  hasSelectedMood: false,

  setMood: (mood: Mood) => {
    set({ mood });
    applyMoodToDocument(mood);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LS_MOOD_VALUE_KEY, mood);
    }
    emitMoodChange(mood);
  },

  confirmMoodSelected: () => {
    set({ hasSelectedMood: true });
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LS_MOOD_KEY, 'true');
    }
  },

  rehydrate: () => {
    if (typeof localStorage === 'undefined') return;
    const selected = localStorage.getItem(LS_MOOD_KEY) === 'true';
    const storedMood = localStorage.getItem(LS_MOOD_VALUE_KEY);
    const mood = getStoredMood(storedMood);
    if (selected) {
      applyMoodToDocument(mood);
      set({ hasSelectedMood: true, mood });
    }
  },
}));

export const useCurrentMood = () => useMoodStore((state) => state.mood);
export const useHasSelectedMood = () => useMoodStore((state) => state.hasSelectedMood);
export const useSetMood = () => useMoodStore((state) => state.setMood);
export const useConfirmMoodSelected = () => useMoodStore((state) => state.confirmMoodSelected);
export const useRehydrateMood = () => useMoodStore((state) => state.rehydrate);

/** Selector: resolves current --accent CSS variable value */
export function useAccentColor(): string {
  useCurrentMood();
  if (typeof window === 'undefined') return '#7C3AED';
  return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7C3AED';
}
