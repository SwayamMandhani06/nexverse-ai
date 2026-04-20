'use client';

import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AssistantState {
  isOpen: boolean;
  messages: Message[];
  isStreaming: boolean;
  toggleOpen: () => void;
  addMessage: (msg: Message) => void;
  setStreaming: (bool: boolean) => void;
  clearHistory: () => void;
}

export const useAssistantStore = create<AssistantState>((set) => ({
  isOpen: false,
  messages: [],
  isStreaming: false,

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  addMessage: (msg: Message) =>
    set((state) => ({ messages: [...state.messages, msg] })),
  setStreaming: (bool: boolean) => set({ isStreaming: bool }),
  clearHistory: () => set({ messages: [] }),
}));
