'use client';

import { useEffect, useRef } from 'react';
import { subscribePointer } from '@/lib/motion/engine';

/**
 * Active-Theory-style dual cursor, re-imagined for a light editorial site.
 *  - a precise graphite dot that tracks the pointer exactly;
 *  - a trailing ring (lerped) that reacts to context:
 *      interactive  → opens and lifts,
 *      view target  → grows into a “VIEW” lens,
 *      drag target  → stretches into a horizontal lens,
 *      text input   → both elements hide (the caret does the talking).
 * Desktop fine pointers only. Reduced motion → no trailing lag, no scale
 * theatrics, just the ring outline. Never rendered on touch devices, so
 * native behaviour is untouched there.
 */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return; // reduced motion keeps the native cursor

    const d = dot.current!;
    const r = ring.current!;
    document.documentElement.classList.add('kiln-cursor');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;
    let running = true;
    let ringScale = 1;
    let targetScale = 1;
    let mode = '';

    const LABELS: Record<string, string> = { view: 'View', open: 'Open', explore: 'Explore', start: 'Start' };
    const label = r.querySelector<HTMLElement>('.kiln-ring-label');

    const setMode = (next: string) => {
      if (mode === next) return;
      mode = next;
      r.dataset.mode = next || '';
      if (label) label.textContent = LABELS[next] ?? 'View';
      targetScale = LABELS[next] ? 2.05 : next === 'drag' ? 1.5 : next === 'hover' ? 1.55 : 1;
    };

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest?.('[data-cursor], a, button, [role="tab"], [role="radio"], input[type="range"]') as HTMLElement | null;
      if (!t) return setMode('');
      const explicit = t.getAttribute('data-cursor');
      if (explicit === 'hidden' || explicit === 'none') return setMode('');
      if (explicit) return setMode(explicit);
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT') return setMode('');
      setMode('hover');
    };

    const loop = () => {
      rx = lerp(rx, mx, 0.16);
      ry = lerp(ry, my, 0.16);
      ringScale = lerp(ringScale, targetScale, 0.18);
      const sx = mode === 'drag' ? ringScale * 1.6 : ringScale;
      const sy = mode === 'drag' ? ringScale * 0.62 : ringScale;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
      const settled = Math.abs(rx - mx) < 0.4 && Math.abs(ry - my) < 0.4 && Math.abs(ringScale - targetScale) < 0.01;
      if (settled && Math.abs(ringScale - 1) < 0.01 && mode === '') {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const down = () => r.classList.add('is-press');
    const up = () => r.classList.remove('is-press');
    const leave = () => {
      d.style.opacity = '0';
      r.style.opacity = '0';
    };
    const enter = () => {
      d.style.opacity = '1';
      r.style.opacity = '1';
    };

    const onMove = (x: number, y: number) => {
      mx = x;
      my = y;
      d.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);
    const unsubPointer = subscribePointer(onMove);

    return () => {
      cancelAnimationFrame(raf);
      unsubPointer();
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
      document.documentElement.classList.remove('kiln-cursor');
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9998] hidden md:block mix-blend-difference">
      <div
        ref={dot}
        className="fixed left-0 top-0 h-[7px] w-[7px] rounded-full bg-white transition-opacity duration-200"
        style={{ transform: 'translate3d(-100px,-100px,0)' }}
      />
      <div
        ref={ring}
        data-mode=""
        className="kiln-ring fixed left-0 top-0 flex h-[34px] w-[34px] items-center justify-center rounded-full border border-white/60 transition-[opacity,background-color,border-color] duration-200 ease-out will-change-transform"
        style={{ transform: 'translate3d(-100px,-100px,0)' }}
      >
        <span className="kiln-ring-label font-mono text-[8.5px] uppercase tracking-[0.22em] text-black opacity-0 transition-opacity duration-150">
          View
        </span>
      </div>
    </div>
  );
}
