'use client';

/**
 * Central pointer/scroll engine (one listener set for the whole motion layer).
 * Components subscribe instead of attaching their own mousemove/scroll
 * handlers. A single rAF loop wakes only while something is dirty and
 * pauses automatically when the tab is hidden — no idle RAF, no leaks:
 * every subscribe returns an unsubscribe.
 */
export type PointerCb = (x: number, y: number) => void;
export type ScrollCb = (progress: number) => void;

interface Engine {
  x: number; y: number;
  pointerDirty: boolean; scrollDirty: boolean;
  subP: Set<PointerCb>; subS: Set<ScrollCb>;
  raf: number; running: boolean;
  wake: () => void;
}

let engine: Engine | null = null;

export function motionEngine(): Engine | null {
  if (typeof window === 'undefined') return null;
  if (engine) return engine;

  const e: Engine = {
    x: -100, y: -100,
    pointerDirty: false, scrollDirty: true,
    subP: new Set(), subS: new Set(),
    raf: 0, running: false,
    wake: () => { if (!e.running && (e.subP.size || e.subS.size)) { e.running = true; e.raf = requestAnimationFrame(step); } },
  };

  const step = () => {
    e.raf = 0;
    if (document.hidden) { e.running = false; return; } // resume via visibilitychange
    if (e.pointerDirty) {
      e.pointerDirty = false;
      e.subP.forEach((cb) => cb(e.x, e.y));
    }
    if (e.scrollDirty) {
      e.scrollDirty = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      e.subS.forEach((cb) => cb(p));
    }
    if (e.pointerDirty || e.scrollDirty || e.subP.size || e.subS.size) {
      // keep looping only while there is still pending work or active drag-like motion
      if (e.pointerDirty || e.scrollDirty) { e.raf = requestAnimationFrame(step); }
      else e.running = false;
    } else {
      e.running = false;
    }
  };

  const onMove = (ev: PointerEvent) => { e.x = ev.clientX; e.y = ev.clientY; e.pointerDirty = true; e.wake(); };
  const onScroll = () => { e.scrollDirty = true; e.wake(); };
  const onResize = () => { e.scrollDirty = true; e.wake(); };
  const onVis = () => { if (!document.hidden) { e.scrollDirty = true; e.wake(); } };

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVis);

  engine = e;
  return e;
}

export function subscribePointer(cb: PointerCb): () => void {
  const e = motionEngine();
  if (!e) return () => {};
  e.subP.add(cb);
  e.wake();
  return () => { e.subP.delete(cb); };
}

export function subscribeScroll(cb: ScrollCb): () => void {
  const e = motionEngine();
  if (!e) return () => {};
  e.subS.add(cb);
  e.scrollDirty = true;
  e.wake();
  return () => { e.subS.delete(cb); };
}
