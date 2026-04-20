'use client';

import { create } from 'zustand';

export type AudioMode = 'bass' | 'studio' | 'spatial' | 'anc' | null;

interface AudioState {
  activeMode: AudioMode;
  isPlaying: boolean;
  volume: number;
  setMode: (mode: AudioMode) => void;
  togglePlay: () => void;
  setVolume: (v: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  activeMode: null,
  isPlaying: false,
  volume: 0.8,

  setMode: (mode: AudioMode) => set({ activeMode: mode }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (v: number) => set({ volume: Math.max(0, Math.min(1, v)) }),
}));
