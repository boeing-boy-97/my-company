'use client';

import { useEffect, useRef } from 'react';
import { subscribePointer, subscribeHover, subscribePress, motionEngine, type PointerState } from '@/lib/motion/engine';

/**
 * Dual cursor with tuned physics (§3–§5, refinement pass):
 *  - dot tracks exactly;
 *  - ring lerps with SPEED-ADAPTIVE stiffness: slow pointer → ring catches
 *    up; fast pointer → ring trails slightly and stretches along the travel
 *    vector (≤9%, never cartoonish); at rest it settles with no bounce;
 *  - contextual scale ladder: link 1.18 · start 1.3 · drag 1.22 · menu/image
 *    1.55 · project 1.62 — pill states carry a word (VIEW/OPEN/EXPLORE/
 *    START), everything else stays wordless;
 *  - inputs restore the native caret (mode drops to idle);
 *  - press dims + shrinks the ring slightly; leaving the window hides both.
 * Fine pointers only; reduced motion keeps the native cursor entirely.
 */
const SCALE: Record<string, number> = { '': 1, hover: 1.18, start: 1.3, drag: 1.22, open: 1.55, explore: 1.55, view: 1.62 };
const LABELED: Record<string, string> = { view: 'View', open: 'Open', explore: 'Explore', start: 'Start' };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const d = dot.current!;
    const r = ring.current!;
    const label = r.querySelector<HTMLElement>('.kiln-ring-label');
    document.documentElement.classList.add('kiln-cursor');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let stretch = 0;
    let targetStretch = 0;
    let angle = 0;
    let raf = 0;
    let running = true;
    let ringScale = 1;
    let targetScale = 1;
    let mode = '';
    let press = false;
    let inField = false;

    const applyMode = (next: string) => {
      const m = inField ? '' : next;
      if (mode === m) return;
      mode = m;
      r.dataset.mode = mode || '';
      if (label) label.textContent = LABELED[mode] ?? 'View';
      targetScale = SCALE[mode] ?? 1.18;
      wake();
    };

    const wake = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    const onPointer = (s: PointerState) => {
      mx = s.x;
      my = s.y;
      d.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      targetStretch = Math.min(0.09, s.speed * 0.0042);
      if (s.speed > 1) angle = s.angle;
      wake();
    };

    const loop = () => {
      raf = 0;
      // stiffness adapts: fast → softer (more separation), slow → firm catch-up
      const t = Math.max(0.12, Math.min(0.3, 0.3 - targetStretch * 1.9));
      rx = lerp(rx, mx, t);
      ry = lerp(ry, my, t);
      ringScale = lerp(ringScale, targetScale * (press ? 0.9 : 1), 0.2);
      stretch = lerp(stretch, LABELED[mode] === undefined ? targetStretch : 0, 0.25); // pill states stay round
      // Stretch along the travel vector as a rotate→scale→counter-rotate sandwich
      // INSIDE the transform property — never via the standalone `rotate`
      // property, which composes in the wrong order around translate.
      const e = LABELED[mode] === undefined ? stretch : 0;
      const isDrag = mode === 'drag';
      const scalePart = isDrag
        ? `scale(${(ringScale * 1.55).toFixed(3)}, ${(ringScale * 0.72).toFixed(3)})`
        : e > 0.012
          ? `rotate(${angle.toFixed(3)}rad) scale(${(ringScale * (1 + e)).toFixed(3)}, ${(ringScale / (1 + e)).toFixed(3)}) rotate(${(-angle).toFixed(3)}rad)`
          : `scale(${ringScale.toFixed(3)}, ${ringScale.toFixed(3)})`;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) ${scalePart}`;
      const settled =
        Math.abs(rx - mx) < 0.4 && Math.abs(ry - my) < 0.4 &&
        Math.abs(ringScale - targetScale * (press ? 0.9 : 1)) < 0.01 &&
        Math.abs(stretch - (LABELED[mode] === undefined ? 0 : targetStretch)) < 0.004 && targetStretch < 0.01;
      if (settled && Math.abs(ringScale - 1) < 0.01 && mode === '') {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const INTERACTIVE = '[data-cursor], a, button, [role="tab"], [role="radio"], input[type="range"]';
    const unsubHover = subscribeHover((el) => {
      const t = (el as HTMLElement | null)?.closest?.(INTERACTIVE) as HTMLElement | null;
      if (!t) { inField = false; return applyMode(''); }
      const tag = t.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        inField = !(tag === 'INPUT' && (t as HTMLInputElement).type === 'range');
        const explicit = t.getAttribute('data-cursor');
        return applyMode(inField ? '' : explicit || 'hover');
      }
      inField = false;
      const explicit = t.getAttribute('data-cursor');
      if (explicit === 'hidden' || explicit === 'none') return applyMode('');
      applyMode(explicit || 'hover');
    });

    const unsubPress = subscribePress((down) => {
      press = down;
      r.classList.toggle('is-press', down);
      wake();
    });

    const unsubPointer = subscribePointer(onPointer);

    const eng = motionEngine();
    const leave = () => { d.style.opacity = '0'; r.style.opacity = '0'; };
    const enter = () => { d.style.opacity = '1'; r.style.opacity = '1'; };
    document.documentElement.addEventListener('mouseleave', leave);
    document.documentElement.addEventListener('mouseenter', enter);
    void eng;

    return () => {
      cancelAnimationFrame(raf);
      unsubPointer();
      unsubHover();
      unsubPress();
      document.documentElement.removeEventListener('mouseleave', leave);
      document.documentElement.removeEventListener('mouseenter', enter);
      document.documentElement.classList.remove('kiln-cursor');
    };
  }, []);

  return (
    <div aria-hidden className="kiln-cursor-root">
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
