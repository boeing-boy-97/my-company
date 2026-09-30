'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { subscribeScroll } from '@/lib/motion/engine';

/**
 * WOW04 — the process spine: a hairline runs the eight stages and draws
 * itself in sync with scroll position (transform-only, shared engine, one
 * rect read per scroll frame). Numbers light as their step reveals, so the
 * sequence feels engineered rather than decorated. Reduced motion: line
 * fully drawn, no listeners; touch: works — it's scroll-driven, not hover.
 */
export default function ProcessSpine({ children }: { children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--spine', '1');
      return;
    }
    const unsub = subscribeScroll(() => {
      const r = el.getBoundingClientRect();
      const seen = Math.min(1, Math.max(0, (window.innerHeight * 0.72 - r.top) / Math.max(1, r.height)));
      el.style.setProperty('--spine', seen.toFixed(3));
    });
    return unsub;
  }, []);

  return (
    <div ref={wrap} className="relative">
      <span aria-hidden className="kiln-spine">
        <span className="kiln-spine-fill" />
      </span>
      {children}
    </div>
  );
}
