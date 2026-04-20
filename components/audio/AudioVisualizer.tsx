'use client';

import { useEffect, useRef } from 'react';
import type { AudioMode } from '@/store/useAudioStore';

interface AudioVisualizerProps {
  isPlaying: boolean;
  activeMode: AudioMode;
}

const MODE_CONFIG: Record<NonNullable<AudioMode>, { bars: number; height: number; color: string }> = {
  bass:    { bars: 24, height: 1.8, color: 'var(--accent)' },
  studio:  { bars: 32, height: 0.8, color: 'var(--accent-glow)' },
  spatial: { bars: 40, height: 1.2, color: 'var(--active)' },
  anc:     { bars: 16, height: 0.3, color: 'var(--text-secondary)' },
};

export default function AudioVisualizer({ isPlaying, activeMode }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mode = activeMode ? MODE_CONFIG[activeMode] : null;

    const draw = (t: number) => {
      timeRef.current = t;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bars = mode?.bars ?? 32;
      const barWidth = (canvas.width / bars) * 0.7;
      const gap = (canvas.width / bars) * 0.3;
      const maxHeight = canvas.height * 0.8;
      const heightMult = isPlaying ? (mode?.height ?? 0.5) : 0.1;

      for (let i = 0; i < bars; i++) {
        const x = i * (barWidth + gap) + gap / 2;
        const wave = Math.sin(t * 0.002 + i * 0.4) * 0.5 + 0.5;
        const noise = Math.sin(t * 0.005 + i * 0.8) * 0.3;
        const h = maxHeight * heightMult * (wave + noise) * (0.5 + Math.random() * 0.05);

        const grad = ctx.createLinearGradient(0, canvas.height - h, 0, canvas.height);

        const colorStr = mode?.color ?? 'var(--accent)';
        // Use accent fallback colors since canvas can't read CSS vars directly
        const colors: Record<string, [string, string]> = {
          'var(--accent)':        ['#A78BFA', '#7C3AED'],
          'var(--accent-glow)':   ['#DDD6FE', '#A78BFA'],
          'var(--active)':        ['#34D399', '#10B981'],
          'var(--text-secondary)':['#6B7280', '#4B5563'],
        };
        const [c1, c2] = colors[colorStr] ?? ['#A78BFA', '#7C3AED'];

        grad.addColorStop(0, c1 + 'BB');
        grad.addColorStop(1, c2 + '33');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, canvas.height - h, barWidth, h, 3);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, activeMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    return () => ro.disconnect();
  }, []);

  return (
    <div
      className="w-full rounded-3xl glass overflow-hidden"
      style={{ height: '200px', border: '1px solid var(--border)' }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
