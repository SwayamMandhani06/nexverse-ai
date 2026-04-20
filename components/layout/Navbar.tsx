'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import MoodPill from '@/components/mood/MoodPill';
import { useAssistantStore } from '@/store/useAssistantStore';

const navLinks = [
  { href: '#hero',       label: 'Home' },
  { href: '#story',      label: 'Products' },
  { href: '#audio',      label: 'Audio' },
  { href: '#comparison', label: 'Compare' },
];

export default function Navbar() {
  const { toggleOpen } = useAssistantStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 inset-x-0 z-[900] transition-all duration-500 ${
        scrolled ? 'glass py-3' : 'py-5'
      }`}
      style={{ backgroundColor: scrolled ? 'var(--bg-secondary)' : 'transparent' }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg" data-cursor-hover>
          <span className="gradient-text text-glow">NexVerse</span>
          <span
            className="text-xs font-mono px-2 py-0.5 rounded glass"
            style={{ color: 'var(--accent-glow)' }}
          >
            AI
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-cursor-hover
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--accent-glow)'; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text-secondary)'; }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side: Mood Pill + AI button */}
        <div className="flex items-center gap-3">
          {/* MoodPill — shows after mood selection, re-opens modal on click */}
          <MoodPill />

          {/* AI assistant toggle */}
          <button
            onClick={toggleOpen}
            data-cursor-hover
            className="text-sm font-semibold glass px-4 py-1.5 rounded-full transition-all hover:glow-accent"
            style={{ color: 'var(--accent-glow)', border: '1px solid var(--border)' }}
            aria-label="Open AI Assistant"
          >
            AI
          </button>
        </div>
      </div>
    </motion.header>
  );
}
