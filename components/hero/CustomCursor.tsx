'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from 'framer-motion';

type CursorState = 'default' | 'text' | 'magnetic' | '3d' | 'drag';

const SPRING_CFG = { stiffness: 400, damping: 28 };
const LERP_CFG   = { stiffness: 120, damping: 20 };

/* Size + shape per cursor state */
const STATES: Record<CursorState, {
  ring: number;   // diameter px
  dot:  number;   // diameter px
  rx:   string;   // border-radius
  opacity: number;
  borderStyle: 'solid' | 'dashed';
  rotate: number;
  filled: boolean; // whether ring has a fill
}> = {
  default:  { ring: 40, dot: 8,  rx: '50%',    opacity: 0.5, borderStyle: 'solid',  rotate: 0,  filled: false },
  text:     { ring: 2,  dot: 2,  rx: '2px',    opacity: 0.9, borderStyle: 'solid',  rotate: 0,  filled: true  },
  magnetic: { ring: 60, dot: 8,  rx: '50%',    opacity: 0.8, borderStyle: 'solid',  rotate: 0,  filled: true  },
  '3d':     { ring: 48, dot: 6,  rx: '50%',    opacity: 0.6, borderStyle: 'dashed', rotate: 45, filled: false },
  drag:     { ring: 60, dot: 8,  rx: '9999px', opacity: 0.6, borderStyle: 'solid',  rotate: 0,  filled: false },
};

export default function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -200, y: -200 });
  const rafId    = useRef<number>(0);

  // Ring uses Framer Motion spring for lerp — avoids RAF setState flood
  const ringX = useMotionValue(-200);
  const ringY = useMotionValue(-200);
  const springX = useSpring(ringX, LERP_CFG);
  const springY = useSpring(ringY, LERP_CFG);

  const [state, setState]     = useState<CursorState>('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Touch devices: no custom cursor
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: MouseEvent) => {
      if (!visible) setVisible(true);
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Dot: instant position via direct DOM
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
      }

      // Update ring motion values (Framer spring handles lerp smoothly)
      ringX.set(e.clientX);
      ringY.set(e.clientY);

      // Detect cursor state from data-cursor attribute
      const el = (e.target as HTMLElement).closest('[data-cursor]') as HTMLElement | null;
      const next = (el?.dataset.cursor as CursorState | undefined) ?? 'default';
      setState((prev) => (prev !== next ? next : prev));
    };

    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);

    // Stamp data-cursor="text" onto all text elements
    const stamp = () => {
      document.querySelectorAll<HTMLElement>('h1,h2,h3,h4,h5,h6,p').forEach((el) => {
        if (!el.dataset.cursor) el.dataset.cursor = 'text';
      });
    };
    stamp();
    const obs = new MutationObserver(stamp);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      obs.disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const s = STATES[state];

  /* Computed ring styles (non-animated via CSS, morphed via Framer) */
  const ringBg = state === 'magnetic'
    ? 'color-mix(in srgb, var(--accent) 20%, transparent)'
    : state === 'text'
    ? 'var(--accent)'
    : 'transparent';

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Inner dot — instant follow, no React re-render needed */}
          <div
            ref={dotRef}
            aria-hidden="true"
            style={{
              position:        'fixed',
              top:             0,
              left:            0,
              zIndex:          9999,
              pointerEvents:   'none',
              width:           s.dot,
              height:          s.dot,
              borderRadius:    '50%',
              backgroundColor: 'var(--accent-glow)',
              boxShadow:       '0 0 6px var(--accent-glow)',
              willChange:      'transform',
              transition:      'width 0.1s, height 0.1s',
            }}
          />

          {/* Outer ring — spring-lerp position + Framer morph */}
          <motion.div
            aria-hidden="true"
            style={{
              position:      'fixed',
              top:           0,
              left:          0,
              zIndex:        9998,
              pointerEvents: 'none',
              x:             springX,
              y:             springY,
              translateX:    '-50%',
              translateY:    '-50%',
              willChange:    'transform',
            }}
          >
            <motion.div
              animate={{
                width:        s.ring,
                height:       s.ring,
                borderRadius: s.rx,
                rotate:       s.rotate,
                opacity:      s.opacity,
              }}
              transition={{ type: 'spring', ...SPRING_CFG }}
              style={{
                border:          `1.5px ${s.borderStyle} var(--accent)`,
                backgroundColor: ringBg,
                willChange:      'width, height, border-radius',
                transition:      'background-color 0.25s ease, border-style 0.15s',
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
