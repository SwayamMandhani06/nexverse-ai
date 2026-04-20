import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import ClientProviders from './ClientProviders';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0A0A0F',
};

export const metadata: Metadata = {
  title: 'NexVerse AI — Emotion-Adaptive Audio Discovery',
  description:
    'Discover premium headphones tailored to your mood. NexVerse AI adapts your audio experience in real time — energetic, calm, focused, happy, or tired.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-mood="energetic"
      className={`${plusJakartaSans.variable} ${jetBrainsMono.variable}`}
    >
      <body className="overflow-x-hidden">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
