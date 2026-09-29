'use client';

import { useEffect, useRef } from 'react';
import { subscribePointer, subscribeHover, subscribePress } from '@/lib/motion/engine';

/**
 * Single cursor-follow preview card (§24/§25 refinement). All input comes
 * from the shared engine — one hover channel, no own listeners. Springs at
 * 0.18 so it visibly lags the pointer by a breath, settles when the pointer
 * stops, flips horizontally at the viewport edge, clamps vertically — never
 * overflows. Hides on leave AND on press, so it can never sit over a click.
 * Touch / reduced motion: never mounts.
 */
const W = 244;
const H = 176;

export default function HoverPreview() {
  const root = useRef<HTMLDivElement>(null);
  const letter = useRef<HTMLSpanElement>(null);
  const title = useRef<HTMLParagraphElement>(null);
  const kind = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine) and (hover: hover)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = root.current;
    if (!el) return;

    let visible = false;
    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    let cx = px, cy = py;
    let raf = 0;

    const place = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let x = cx + 22;
      if (x + W > vw - 12) x = Math.max(12, cx - W - 22);
      let y = cy - H / 2;
      y = Math.max(12, Math.min(y, vh - H - 12));
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    };
    const step = () => {
      raf = 0;
      const dx = px - cx;
      const dy = py - cy;
      cx += dx * 0.18;
      cy += dy * 0.18;
      place();
      if (Math.abs(dx) > 0.4 || Math.abs(dy) > 0.4 || visible) raf = requestAnimationFrame(step);
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(step); };

    const show = (t: HTMLElement) => {
      if (letter.current) letter.current.textContent = (t.dataset.previewTitle || '?').trim().charAt(0).toUpperCase();
      if (title.current) title.current.textContent = t.dataset.previewTitle || '';
      if (kind.current) kind.current.textContent = [t.dataset.previewKind, 'View case'].filter(Boolean).join(' · ');
      visible = true;
      el.classList.add('is-on');
      wake();
    };
    const hide = () => {
      if (!visible) return;
      visible = false;
      el.classList.remove('is-on');
      wake();
    };

    const unsubHover = subscribeHover((node) => {
      const t = (node as HTMLElement | null)?.closest?.('[data-preview-title]') as HTMLElement | null;
      if (t) show(t);
      else hide();
    });
    const unsubPress = subscribePress((down) => { if (down) hide(); });
    const unsubPointer = subscribePointer((s) => { px = s.x; py = s.y; wake(); });

    return () => {
      unsubHover();
      unsubPress();
      unsubPointer();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root} aria-hidden className="kiln-preview">
      <div className="w-[244px] overflow-hidden rounded-xl border border-line bg-surface shadow-[0_24px_60px_-24px_rgba(13,14,17,0.45)]">
        <div className="relative flex h-[118px] items-center justify-center overflow-hidden bg-coal">
          <span ref={letter} className="font-display text-[44px] font-semibold leading-none text-paper/15">·</span>
          <span className="absolute bottom-2.5 left-3 h-[2px] w-6 bg-accent" />
        </div>
        <div className="px-3.5 py-2.5">
          <p ref={title} className="truncate font-display text-[13px] font-semibold text-ink">Title</p>
          <p ref={kind} className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-faint">Kind</p>
        </div>
      </div>
    </div>
  );
}
