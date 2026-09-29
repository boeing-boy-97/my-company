'use client';

/**
 * Central pointer/scroll engine — one listener set for the whole motion
 * layer (§52/§56 of the refinement pass). Components subscribe; none of
 * them attach their own mousemove/scroll/hover listeners.
 *
 *  - single rAF loop, asleep while nothing is dirty and velocity has decayed;
 *  - pointer velocity (EMA) + travel angle computed once, shared by cursor,
 *    trail, preview;
 *  - shared hover channel: one document pointerover/out pair, deduped per
 *    element change — Cursor and HoverPreview read the same stream;
 *  - shared press channel; scroll recency (for pointer damp while scrolling);
 *  - pauses on hidden tabs; every subscribe returns an unsubscribe.
 */
export interface PointerState {
  x: number; y: number;
  vx: number; vy: number;
  speed: number; // smoothed px/frame
  angle: number; // rad, direction of travel
  moving: boolean;
}

type PointerCb = (s: PointerState) => void;
type ScrollCb = (progress: number) => void;
type HoverCb = (el: Element | null) => void;
type PressCb = (down: boolean) => void;

interface Engine {
  x: number; y: number; px: number; py: number;
  vx: number; vy: number; speed: number; angle: number;
  lastMoveAt: number; lastScrollAt: number;
  pointerDirty: boolean; scrollDirty: boolean;
  hoverEl: Element | null; pressed: boolean;
  subP: Set<PointerCb>; subS: Set<ScrollCb>; subH: Set<HoverCb>; subPr: Set<PressCb>;
  raf: number; running: boolean;
  wake: () => void;
}

let engine: Engine | null = null;

export function motionEngine(): Engine | null {
  if (typeof window === 'undefined') return null;
  if (engine) return engine;

  const e: Engine = {
    x: -100, y: -100, px: -100, py: -100,
    vx: 0, vy: 0, speed: 0, angle: 0,
    lastMoveAt: 0, lastScrollAt: 0,
    pointerDirty: false, scrollDirty: true,
    hoverEl: null, pressed: false,
    subP: new Set(), subS: new Set(), subH: new Set(), subPr: new Set(),
    raf: 0, running: false,
    wake: () => { if (!e.running && (e.subP.size || e.subS.size)) { e.running = true; e.raf = requestAnimationFrame(step); } },
  };

  const step = () => {
    e.raf = 0;
    if (document.hidden) { e.running = false; return; }
    if (e.pointerDirty) {
      e.pointerDirty = false;
      const vx = e.x - e.px;
      const vy = e.y - e.py;
      e.px = e.x; e.py = e.y;
      // EMA — smooth accel/decel, no spikes
      e.vx = e.vx * 0.35 + vx * 0.65;
      e.vy = e.vy * 0.35 + vy * 0.65;
      e.speed = e.speed * 0.4 + Math.hypot(vx, vy) * 0.6;
      if (Math.hypot(vx, vy) > 0.5) e.angle = Math.atan2(vy, vx);
    } else if (e.speed > 0.05) {
      e.vx *= 0.8; e.vy *= 0.8; e.speed *= 0.8; // decay so consumers can settle
    } else {
      e.vx = e.vy = e.speed = 0;
    }
    if (e.scrollDirty) {
      e.scrollDirty = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      e.subS.forEach((cb) => cb(p));
    }
    const busy = e.pointerDirty || e.scrollDirty || e.speed > 0.05;
    if (busy) e.raf = requestAnimationFrame(step);
    else e.running = false;
    // always notify pointer subscribers this frame if we're awake with velocity
    if (e.speed > 0 || e.pointerDirty) e.subP.forEach((cb) => cb({ x: e.x, y: e.y, vx: e.vx, vy: e.vy, speed: e.speed, angle: e.angle, moving: e.speed > 0.3 }));
  };

  const onMove = (ev: PointerEvent) => {
    e.x = ev.clientX; e.y = ev.clientY;
    e.lastMoveAt = performance.now();
    e.pointerDirty = true;
    e.wake();
  };
  const onScroll = () => { e.scrollDirty = true; e.lastScrollAt = performance.now(); e.wake(); };
  const onResize = () => { e.scrollDirty = true; e.wake(); };
  const onOver = (ev: Event) => {
    const t = ev.target as Element | null;
    if (t && t !== e.hoverEl) { e.hoverEl = t; e.subH.forEach((cb) => cb(t)); }
  };
  const onOut = (ev: PointerEvent) => {
    if (!ev.relatedTarget) { e.hoverEl = null; e.subH.forEach((cb) => cb(null)); }
  };
  const onDown = () => { e.pressed = true; e.subPr.forEach((cb) => cb(true)); };
  const onUp = () => { e.pressed = false; e.subPr.forEach((cb) => cb(false)); };
  const onVis = () => { if (!document.hidden) { e.scrollDirty = true; e.wake(); } };

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  window.addEventListener('pointerup', onUp, { passive: true });
  document.addEventListener('pointerover', onOver, { passive: true });
  document.addEventListener('pointerout', onOut, { passive: true });
  document.addEventListener('visibilitychange', onVis);

  engine = e;
  return e;
}

/** Wake the shared loop once so subscribers settle after their own target
 *  changes even when the pointer is idle (e.g. hover-state scale). */
function nudge() {
  const e = motionEngine();
  if (!e) return;
  e.pointerDirty = true;
  e.wake();
  // single guaranteed callback pass
  requestAnimationFrame(() => {
    e.subP.forEach((cb) => cb({ x: e.x, y: e.y, vx: 0, vy: 0, speed: 0, angle: e.angle, moving: false }));
  });
}

export function subscribePointer(cb: PointerCb): () => void {
  const e = motionEngine();
  if (!e) return () => {};
  e.subP.add(cb);
  nudge();
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

export function subscribeHover(cb: HoverCb): () => void {
  const e = motionEngine();
  if (!e) return () => {};
  e.subH.add(cb);
  return () => { e.subH.delete(cb); };
}

export function subscribePress(cb: PressCb): () => void {
  const e = motionEngine();
  if (!e) return () => {};
  e.subPr.add(cb);
  return () => { e.subPr.delete(cb); };
}

/** ms since the last scroll event — consumers damp pointer motion while the
 *  user is scrolling so the two never fight (§33). */
export function sinceScroll(): number {
  const e = motionEngine();
  return e ? performance.now() - e.lastScrollAt : 1e9;
}

export function sinceMove(): number {
  const e = motionEngine();
  return e ? performance.now() - e.lastMoveAt : 1e9;
}

export function isPressed(): boolean {
  const e = motionEngine();
  return !!e && e.pressed;
}
