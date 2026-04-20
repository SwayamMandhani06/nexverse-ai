'use client';

import { useEffect } from 'react';
import { applyMoodToDocument } from '@/lib/mood';
import { useCurrentMood, useRehydrateMood } from '@/store/useMoodStore';
import ScrollProgress from '@/components/ui/ScrollProgress';
import CustomCursor from '@/components/hero/CustomCursor';
import LenisProvider from '@/components/layout/LenisProvider';
import AmbientBackground from '@/components/mood/AmbientBackground';

function MoodProvider({ children }: { children: React.ReactNode }) {
  const mood = useCurrentMood();
  const rehydrate = useRehydrateMood();

  useEffect(() => {
    // Rehydrate from localStorage on first mount
    rehydrate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Always sync data-mood on html whenever store mood changes
    applyMoodToDocument(mood);
  }, [mood]);

  return <>{children}</>;
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <MoodProvider>
        <AmbientBackground />
        <ScrollProgress />
        <CustomCursor />
        {children}
      </MoodProvider>
    </LenisProvider>
  );
}
