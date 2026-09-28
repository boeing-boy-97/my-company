'use client';
// Subtle scroll choreography for the hero: the content settles back with a
// gentle scale-down and fade as the visitor scrolls. Transform + opacity
// only, disabled for prefers-reduced-motion, no scroll hijacking.
import { useEffect, useRef } from 'react';

export default function HeroChoreography({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 600);
        const t = y / 600; // 0 → 1 over the first 600px
        el.style.transform = `scale(${1 - t * 0.035}) translateY(${t * 14}px)`;
        el.style.opacity = String(1 - t * 0.55);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="will-change-transform">
      {children}
    </div>
  );
}
