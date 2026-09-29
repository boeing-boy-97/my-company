'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * Buttery inertial wheel scrolling via Lenis — the Active Theory feel,
 * without hijacking the page: native scrollbar, keyboard and touch are
 * untouched; wheel/trackpad momentum gets a light ease. Disabled entirely
 * for reduced-motion users and coarse pointers.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const lenis = new Lenis({
      lerp: 0.115,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      smoothWheel: true,
    });
    (window as unknown as { __kilnLenis?: Lenis }).__kilnLenis = lenis;

    // In-page anchors should glide too.
    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute('href')!.slice(1);
      const el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -96, duration: 1.1 });
    };
    document.addEventListener('click', onAnchor);

    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onAnchor);
      delete (window as unknown as { __kilnLenis?: Lenis }).__kilnLenis;
      lenis.destroy();
    };
  }, []);

  return null;
}
