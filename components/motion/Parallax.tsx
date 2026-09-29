'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Controlled vertical drift for a visual as it crosses the viewport —
 * the kind of depth Active Theory build on, kept to a whisper: max ±shift
 * pixels, transform only, never on text, disabled on touch + reduced motion.
 */
export default function Parallax({ children, shift = 16, className = '' }: { children: ReactNode; shift?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -100 || r.top > vh + 100) return;
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1..1
      el.style.transform = `translate3d(0, ${(-p * shift).toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [shift]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
