'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { subscribePointer } from '@/lib/motion/engine';

/**
 * Pointer-reactive depth: a visual drifts a few pixels against the pointer
 * position (background 1–2px, feature visuals up to ~8px). Transform only,
 * fine pointers only, off under reduced motion, subscription-scoped cleanup.
 */
export default function PointerDepth({ children, shift = 6, className = '' }: { children: ReactNode; shift?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;

    const settle = () => {
      raf = 0;
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      if (Math.abs(tx - cx) > 0.15 || Math.abs(ty - cy) > 0.15) raf = requestAnimationFrame(settle);
    };

    const unsub = subscribePointer((x, y) => {
      tx = ((x / window.innerWidth) - 0.5) * 2 * shift;
      ty = ((y / window.innerHeight) - 0.5) * 2 * shift;
      if (!raf) raf = requestAnimationFrame(settle);
    });
    return () => { unsub(); if (raf) cancelAnimationFrame(raf); };
  }, [shift]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
