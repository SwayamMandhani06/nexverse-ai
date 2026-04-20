'use client';

import MoodOnboarding from '@/components/mood/MoodOnboarding';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/hero/HeroSection';
import StorySection from '@/components/story/StorySection';
import AudioSimulator from '@/components/audio/AudioSimulator';
import ComparisonTable from '@/components/compare/ComparisonTable';
import Footer from '@/components/layout/Footer';
import AIAssistant from '@/components/ai/AIAssistant';
import VoiceController from '@/components/voice/VoiceController';

export default function HomePage() {
  return (
    <>
      <MoodOnboarding />
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <StorySection />
        <AudioSimulator />
        <ComparisonTable />
      </main>
      <Footer />
      <AIAssistant />
      <VoiceController />
    </>
  );
}
