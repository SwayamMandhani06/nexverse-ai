'use client';

import { create } from 'zustand';

interface VoiceState {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  setTranscript: (t: string) => void;
}

export const useVoiceStore = create<VoiceState>((set) => ({
  isListening: false,
  transcript: '',
  isSupported:
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),

  startListening: () => set({ isListening: true, transcript: '' }),
  stopListening: () => set({ isListening: false }),
  setTranscript: (t: string) => set({ transcript: t }),
}));
