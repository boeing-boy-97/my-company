'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { subscribePointer, type PointerState } from '@/lib/motion/engine';

/**
 * Magnetic primary CTAs — refined (§11–§13):
 *  - subscribes once through the shared engine (no per-element listeners);
 *  - proximity field: within ~72px of the edge it leans 1–2px toward the
 *    nearest side; directly over the button, 3–6px toward the pointer;
 *  - hard 8px ceiling — nothing lurches;
 *  - [data-mag-arrow] slides ±5px, [data-mag-text] micro-shifts 1.5px;
 *  - JS-smoothed follow; exit settles with a short ease-out, no overshoot;
 *  - rect is re-measured at most every 300ms, so idle frames cost nothing;
 *  - touch / reduced motion: fully inert.
 */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp8 = (v: number) => Math.max(-8, Math.min(8, v));

export default function Magnetic({ children, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;

    let rect: DOMRect | null = null;
    let lastMeasure = 0;
    let kx = 0, ky = 0, cx = 0, cy = 0;
    let raf = 0;
    let engaged = false;
    let settle: ReturnType<typeof setTimeout> | null = null;

    const measure = (now: number) => {
      if (now - lastMeasure > 300) {
        lastMeasure = now;
        rect = el.getBoundingClientRect();
      }
      return rect;
    };

    const loop = () => {
      raf = 0;
      cx = lerp(cx, kx, 0.25);
      cy = lerp(cy, ky, 0.25);
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      const arrow = el.querySelector<HTMLElement>('[data-mag-arrow]');
      if (arrow) arrow.style.transform = `translate3d(${(cx * 0.6).toFixed(2)}px, ${(cy * 0.35).toFixed(2)}px, 0)`;
      const text = el.querySelector<HTMLElement>('[data-mag-text]');
      if (text) text.style.transform = `translate3d(${(cx * 0.18).toFixed(2)}px, 0, 0)`;
      if (Math.abs(kx - cx) > 0.08 || Math.abs(ky - cy) > 0.08) raf = requestAnimationFrame(loop);
      else if (kx === 0 && ky === 0) {
        // fully home — drop the class so hover states behave normally again
        el.classList.remove('is-mag');
      }
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(loop); };

    const set = (nx: number, ny: number) => {
      const changed = nx !== kx || ny !== ky;
      kx = nx; ky = ny;
      if (changed) {
        if (nx !== 0 || ny !== 0) {
          el.classList.add('is-mag');
          if (settle) { clearTimeout(settle); settle = null; }
          el.classList.remove('is-settle');
        } else if (!settle) {
          el.classList.add('is-settle');
          settle = setTimeout(() => { el.classList.remove('is-settle'); settle = null; }, 420);
        }
        wake();
      }
    };

    const unsub = subscribePointer((s: PointerState) => {
      const r = measure(performance.now());
      if (!r) return;
      const inside = s.x >= r.left && s.x <= r.right && s.y >= r.top && s.y <= r.bottom;
      if (!inside) {
        const ex = Math.max(r.left - s.x, 0, s.x - r.right);
        const ey = Math.max(r.top - s.y, 0, s.y - r.bottom);
        if (ex * ex + ey * ey > 72 * 72) {
          if (engaged) { engaged = false; set(0, 0); }
          return;
        }
      }
      engaged = true;
      const tx = s.x - (r.left + r.width / 2);
      const ty = s.y - (r.top + r.height / 2);
      if (inside) set(clamp8(tx * 0.3), clamp8(ty * 0.3));
      else set(clamp8(tx * 0.028), clamp8(ty * 0.028));
    });

    return () => {
      unsub();
      if (raf) cancelAnimationFrame(raf);
      if (settle) clearTimeout(settle);
      el.style.transform = '';
      el.classList.remove('is-mag', 'is-settle');
      el.querySelector<HTMLElement>('[data-mag-arrow]')?.style.removeProperty('transform');
      el.querySelector<HTMLElement>('[data-mag-text]')?.style.removeProperty('transform');
    };
  }, []);

  return (
    <div ref={ref} className={`magnetic will-change-transform ${className}`}>
      {children}
    </div>
  );
}
