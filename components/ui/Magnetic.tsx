'use client';
import { useRef, useCallback, useEffect, type ReactNode } from 'react';
import { subscribePointer } from '@/lib/motion/engine';

/** Magnetic hover — element drifts gently toward the cursor.
 *  Desktop pointers only; no-op with reduced motion. */
export default function Magnetic({ children, strength = 0.22, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const offRef = useRef<(() => void) | null>(null);
  const active = useCallback(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !window.matchMedia('(pointer: coarse)').matches, []);

  const onEnter = () => {
    if (!active() || offRef.current) return;
    offRef.current = subscribePointer((x, y) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = (x - r.left - r.width / 2) * strength;
      const dy = (y - r.top - r.height / 2) * strength;
      // clamp pull to 8px — buttons drift, never lurch
      const c = (v: number) => Math.max(-8, Math.min(8, v));
      el.style.transform = `translate3d(${c(dx).toFixed(1)}px, ${c(dy).toFixed(1)}px, 0)`;
    });
  };

  const onLeave = () => {
    offRef.current?.();
    offRef.current = null;
    const el = ref.current;
    if (el) el.style.transform = 'translate3d(0,0,0)';
  };

  useEffect(() => () => { offRef.current?.(); offRef.current = null; }, []);

  return (
    <div ref={ref} onMouseEnter={onEnter} onMouseLeave={onLeave} className={`transition-transform duration-300 ease-out will-change-transform ${className}`}>
      {children}
    </div>
  );
}
