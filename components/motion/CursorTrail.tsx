'use client';

import { useEffect, useRef } from 'react';
import { subscribePointer } from '@/lib/motion/engine';

/**
 * A whisper of a trail: a short pool of reused points that fade in ~16
 * frames, drawn on one canvas with mix-blend-difference so it reads as a
 * negative of whatever surface is underneath — light pages, dark sections,
 * no new palette. Fine pointers only, never on reduced motion, paused when
 * the tab is hidden, fully cleaned up on unmount.
 */
const N = 22;
const LIFE = 16;

export default function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(1.75, window.devicePixelRatio || 1);
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const pts = new Float32Array(N * 4); // x, y, life, r
    let head = 0;
    let lastX = -100;
    let lastY = -100;
    let raf = 0;
    let running = false;

    const loop = () => {
      raf = 0;
      if (document.hidden) { running = false; return; }
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = 0;
      for (let i = 0; i < N; i++) {
        const o = i * 4;
        if (pts[o + 2] <= 0) continue;
        pts[o + 2] -= 1 / LIFE;
        const a = pts[o + 2];
        alive++;
        ctx.beginPath();
        ctx.arc(pts[o], pts[o + 1], pts[o + 3] * a, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${(a * 0.24).toFixed(3)})`;
        ctx.fill();
      }
      if (alive > 0) raf = requestAnimationFrame(loop);
      else running = false;
    };
    const wake = () => { if (!running) { running = true; raf = requestAnimationFrame(loop); } };

    const unsub = subscribePointer((x, y) => {
      const dx = x - lastX;
      const dy = y - lastY;
      if (dx * dx + dy * dy < 36) return; // require distance — short trail, no spam
      lastX = x; lastY = y;
      const o = head * 4;
      pts[o] = x; pts[o + 1] = y; pts[o + 2] = 1; pts[o + 3] = 1.1 + Math.random() * 1.3;
      head = (head + 1) % N;
      wake();
    });

    return () => {
      unsub();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="kiln-trail pointer-events-none fixed inset-0 z-[9994] hidden md:block mix-blend-difference"
    />
  );
}
