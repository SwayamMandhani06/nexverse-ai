export const MOODS = ['energetic', 'calm', 'focused', 'happy', 'tired'] as const;

export type Mood = (typeof MOODS)[number];

export const DEFAULT_MOOD: Mood = 'energetic';

export const LS_MOOD_KEY = 'nexverse_mood_selected';
export const LS_MOOD_VALUE_KEY = 'nexverse_mood';

const MOOD_SET = new Set<Mood>(MOODS);

export function isMood(value: string | null | undefined): value is Mood {
  return !!value && MOOD_SET.has(value as Mood);
}

export function getStoredMood(rawMood: string | null): Mood {
  return isMood(rawMood) ? rawMood : DEFAULT_MOOD;
}

export function applyMoodToDocument(mood: Mood): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-mood', mood);
}

export function emitMoodChange(mood: Mood): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('moodchange', { detail: { mood } }));
}
