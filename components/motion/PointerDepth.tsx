'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { subscribePointer, sinceScroll, sinceMove } from '@/lib/motion/engine';

/**
 * Pointer-reactive depth (§22/§31/§32/§33 refinement):
 *  - target drift is DAMPED to 30% while the user is actively scrolling,
 *    so pointer motion and scroll never fight;
 *  - optional `ambient` px: when the pointer has been still 2.4s+, the
 *    visual breathes with a slow ±amp drift (imperceptible, no floating
 *    cycle if amp is 0 — only the hero opts in);
 *  - fine pointers + full motion only; transform only; clean unmount.
 */
export default function PointerDepth({
  children,
  shift = 6,
  ambient = 0,
  className = '',
}: {
  children: ReactNode;
  shift?: number;
  ambient?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine) and (hover: hover)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;

    let tx = 0, ty = 0, cx = 0, cy = 0;
    let raf = 0;
    let t0 = performance.now();

    const loop = () => {
      raf = 0;
      const now = performance.now();
      const damp = sinceScroll() < 150 ? 0.3 : 1;
      let ax = 0, ay = 0;
      if (ambient > 0 && now - sinceMove() > 2400) {
        const s = (now - t0) * 0.00045;
        ax = Math.sin(s) * ambient;
        ay = Math.sin(s * 0.73 + 1.3) * ambient * 0.6;
      }
      const gx = tx * damp + ax;
      const gy = ty * damp + ay;
      cx += (gx - cx) * 0.1;
      cy += (gy - cy) * 0.1;
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      const moving = Math.abs(gx - cx) > 0.05 || Math.abs(gy - cy) > 0.05;
      if (moving || ambient > 0) raf = requestAnimationFrame(loop);
    };

    const unsub = subscribePointer((s) => {
      tx = ((s.x / window.innerWidth) - 0.5) * 2 * shift;
      ty = ((s.y / window.innerHeight) - 0.5) * 2 * shift;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    if (ambient > 0 && !raf) raf = requestAnimationFrame(loop);

    return () => {
      unsub();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [shift, ambient]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
