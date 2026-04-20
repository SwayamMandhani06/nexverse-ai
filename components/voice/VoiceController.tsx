'use client';

import { useEffect, useCallback } from 'react';
import { useVoiceStore } from '@/store/useVoiceStore';
import { useSetMood } from '@/store/useMoodStore';
import { useAudioStore } from '@/store/useAudioStore';
import { useAssistantStore } from '@/store/useAssistantStore';
import { matchVoiceCommand } from '@/lib/voiceCommands';

type SpeechRecognitionEvent = {
  results: SpeechRecognitionResultList;
  resultIndex: number;
};

type SpeechRecognitionErrorEvent = {
  error: string;
};

export default function VoiceController() {
  const { isListening, isSupported, setTranscript, stopListening } = useVoiceStore();
  const setMood = useSetMood();
  const { setMode } = useAudioStore();
  const { toggleOpen } = useAssistantStore();

  const handleTranscript = useCallback(
    (transcript: string) => {
      setTranscript(transcript);
      const cmd = matchVoiceCommand(transcript);
      if (!cmd) return;

      switch (cmd.action) {
        case 'SET_MOOD_ENERGETIC': setMood('energetic'); break;
        case 'SET_MOOD_CALM':      setMood('calm');      break;
        case 'SET_MOOD_FOCUSED':   setMood('focused');   break;
        case 'SET_MOOD_HAPPY':     setMood('happy');     break;
        case 'SET_MOOD_TIRED':     setMood('tired');     break;
        case 'SET_AUDIO_BASS':    setMode('bass');    break;
        case 'SET_AUDIO_SPATIAL': setMode('spatial'); break;
        case 'SET_AUDIO_ANC':     setMode('anc');     break;
        case 'SET_AUDIO_STUDIO':  setMode('studio');  break;
        case 'OPEN_ASSISTANT':
        case 'CLOSE_ASSISTANT':   toggleOpen();       break;
        case 'SCROLL_TO_COMPARISON':
          document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'SCROLL_TO_TOP':
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        case 'SHOW_PRODUCT_X1':
        case 'SHOW_PRODUCT_X1_PRO':
        case 'SHOW_PRODUCT_X1_MAX':
          document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
          break;
      }
    },
    [setMood, setMode, toggleOpen, setTranscript]
  );

  useEffect(() => {
    if (!isSupported || !isListening) return;

    const SpeechRecognition =
      (window as unknown as Record<string, unknown>).SpeechRecognition as
        (new () => { 
          continuous: boolean; 
          interimResults: boolean; 
          lang: string;
          onresult: ((e: SpeechRecognitionEvent) => void) | null;
          onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
          onend: (() => void) | null;
          start: () => void;
          stop: () => void;
        }) ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition as
        (new () => {
          continuous: boolean;
          interimResults: boolean;
          lang: string;
          onresult: ((e: SpeechRecognitionEvent) => void) | null;
          onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
          onend: (() => void) | null;
          start: () => void;
          stop: () => void;
        });

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[e.resultIndex][0].transcript;
      handleTranscript(transcript);
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      console.warn('[VoiceController] Speech recognition error:', e.error);
      stopListening();
    };

    recognition.onend = () => {
      stopListening();
    };

    recognition.start();

    return () => {
      try { recognition.stop(); } catch { /* ignore */ }
    };
  }, [isListening, isSupported, handleTranscript, stopListening]);

  // No UI — logic only
  return null;
}
