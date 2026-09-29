'use client';

import { useEffect, useRef } from 'react';
import { subscribePointer } from '@/lib/motion/engine';

/**
 * Single cursor-follow preview card (§18/§53). One element for the whole
 * page: any [data-preview-title] becomes a trigger via event delegation, so
 * cards never own listeners. Springs after the pointer, clamps to the
 * viewport, never intercepts clicks, one at a time by construction, gone on
 * leave/click. Touch and reduced motion: never mounted.
 */
const W = 244;
const H = 176;

export default function HoverPreview() {
  const root = useRef<HTMLDivElement>(null);
  const letter = useRef<HTMLSpanElement>(null);
  const title = useRef<HTMLParagraphElement>(null);
  const kind = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = root.current;
    if (!el) return;

    let visible = false;
    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    let cx = px, cy = py;
    let raf = 0;

    const clamp = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let x = cx + 22;
      if (x + W > vw - 12) x = cx - W - 22;
      let y = cy - H / 2;
      y = Math.max(12, Math.min(y, vh - H - 12));
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    };
    const follow = (x: number, y: number) => {
      px = x; py = y;
      if (!raf) raf = requestAnimationFrame(step);
    };
    const step = () => {
      raf = 0;
      cx += (px - cx) * 0.18;
      cy += (py - cy) * 0.18;
      clamp();
      if (Math.abs(px - cx) > 0.4 || Math.abs(py - cy) > 0.4 || visible) raf = requestAnimationFrame(step);
    };

    const show = (t: HTMLElement) => {
      if (letter.current) letter.current.textContent = (t.dataset.previewTitle || '?').trim().charAt(0).toUpperCase();
      if (title.current) title.current.textContent = t.dataset.previewTitle || '';
      if (kind.current) kind.current.textContent = [t.dataset.previewKind, 'View case'].filter(Boolean).join(' · ');
      visible = true;
      el.classList.add('is-on');
      if (!raf) raf = requestAnimationFrame(step);
    };
    const hide = () => { visible = false; el.classList.remove('is-on'); };

    const onOver = (ev: PointerEvent) => {
      const t = (ev.target as HTMLElement)?.closest?.('[data-preview-title]') as HTMLElement | null;
      if (!t) return;
      const prev = (ev.relatedTarget as HTMLElement | null)?.closest?.('[data-preview-title]');
      if (prev === t) return;
      show(t);
    };
    const onOut = (ev: PointerEvent) => {
      const t = (ev.target as HTMLElement)?.closest?.('[data-preview-title]') as HTMLElement | null;
      if (!t) return;
      const next = (ev.relatedTarget as HTMLElement | null)?.closest?.('[data-preview-title]');
      if (next !== t) hide();
    };

    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerout', onOut, { passive: true });
    document.addEventListener('click', hide, { capture: true });
    const unsub = subscribePointer(follow);

    return () => {
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      document.removeEventListener('click', hide, { capture: true } as EventListenerOptions);
      unsub();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root} aria-hidden className="kiln-preview pointer-events-none fixed left-0 top-0 z-[9995] hidden md:block">
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
