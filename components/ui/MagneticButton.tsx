'use client';

import { useRef, useCallback, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function MagneticButton({
  children,
  variant = 'primary',
  onClick,
  className = '',
  type = 'button',
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rippleId = useRef(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  const MAX_PX = 12;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = ((e.clientX - cx) / (rect.width / 2)) * MAX_PX;
    const dy = ((e.clientY - cy) / (rect.height / 2)) * MAX_PX;
    x.set(Math.max(-MAX_PX, Math.min(MAX_PX, dx)));
    y.set(Math.max(-MAX_PX, Math.min(MAX_PX, dy)));
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const rx = e.clientX - rect.left;
    const ry = e.clientY - rect.top;
    const id = ++rippleId.current;
    setRipples((prev) => [...prev, { id, x: rx, y: ry }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
    onClick?.();
  }, [onClick]);

  const isPrimary = variant === 'primary';

  const baseStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '9999px',
    padding: '14px 32px',
    fontSize: '16px',
    fontWeight: 500,
    cursor: 'none',
    border: isPrimary ? 'none' : `1px solid var(--accent)`,
    backgroundColor: isPrimary ? 'var(--accent)' : 'transparent',
    color: isPrimary ? '#fff' : 'var(--accent)',
    boxShadow: isPrimary
      ? '0 0 0 0 transparent'
      : 'none',
    transition: 'box-shadow 0.3s ease, background-color 0.3s ease',
    outline: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.01em',
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      data-cursor="magnetic"
      style={{ x: springX, y: springY, ...baseStyle }}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileHover={{
        boxShadow: isPrimary
          ? '0 0 24px color-mix(in srgb, var(--accent-glow) 60%, transparent), 0 0 60px color-mix(in srgb, var(--accent) 25%, transparent)'
          : '0 0 16px color-mix(in srgb, var(--accent) 30%, transparent)',
        scale: 1.02,
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {children}

      {/* Ripple effects */}
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y,
            width: 0,
            height: 0,
            borderRadius: '50%',
            background: isPrimary
              ? 'rgba(255,255,255,0.35)'
              : 'color-mix(in srgb, var(--accent) 35%, transparent)',
            transform: 'translate(-50%, -50%)',
            animation: 'magnetic-ripple 0.6s ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      ))}
    </motion.button>
  );
}
