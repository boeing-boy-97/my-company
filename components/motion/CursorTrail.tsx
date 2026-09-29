'use client';

import { useEffect, useRef } from 'react';
import { subscribePointer, type PointerState } from '@/lib/motion/engine';

/**
 * Velocity-aware architectural trail (§8–§10 refinement): fixed pool, zero
 * allocation per frame. Fast movement → denser spawn, slightly longer life;
 * slow → short and quiet; still → everything fades out on its own. Particles
 * are mostly micro-dots, with occasional line fragments (drawn along the
 * travel vector) and rare rectangular ticks — drafting marks, not a
 * particle soup. mix-blend-difference keeps it neutral on every surface.
 * Pool shrinks on low-core devices; mobile/reduced never init.
 */
interface P { x: number; y: number; px: number; py: number; life: number; size: number; shape: number; }

export default function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine) and (hover: hover)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cores = navigator.hardwareConcurrency ?? 8;
    const lowPower = cores <= 4;
    const N = lowPower ? 14 : 24;
    const dpr = Math.min(lowPower ? 1.25 : 1.6, window.devicePixelRatio || 1);

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const pool: P[] = Array.from({ length: N }, () => ({ x: 0, y: 0, px: 0, py: 0, life: 0, size: 1, shape: 0 }));
    let head = 0;
    let lastX = -100;
    let lastY = -100;
    let spawnCount = 0;
    let raf = 0;
    let running = false;

    const LIFE = 15;

    const loop = () => {
      raf = 0;
      if (document.hidden) { running = false; return; }
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = 0;
      for (let i = 0; i < N; i++) {
        const p = pool[i]!;
        if (p.life <= 0) continue;
        p.life -= 1 / LIFE;
        const a = p.life;
        alive++;
        if (p.shape === 1) {
          ctx.strokeStyle = `rgba(255,255,255,${(a * 0.3).toFixed(3)})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        } else if (p.shape === 2) {
          ctx.fillStyle = `rgba(255,255,255,${(a * 0.26).toFixed(3)})`;
          const s = p.size * (1 + a);
          ctx.fillRect(p.x - s / 2, p.y - 0.5, s, 1); // flat tick — architectural
        } else {
          ctx.fillStyle = `rgba(255,255,255,${(a * 0.22).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.4, p.size * a), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (alive > 0) raf = requestAnimationFrame(loop);
      else running = false;
    };
    const wake = () => { if (!running) { running = true; raf = requestAnimationFrame(loop); } };

    const unsub = subscribePointer((s: PointerState) => {
      const dx = s.x - lastX;
      const dy = s.y - lastY;
      const dist = Math.hypot(dx, dy);
      // faster → spawn sooner (shorter gap); still → nothing spawns, trail dies out
      const gap = Math.max(3.2, (lowPower ? 8 : 6.2) - s.speed * 0.16);
      if (dist < gap) return;
      lastX = s.x;
      lastY = s.y;
      spawnCount++;
      const p = pool[head]!;
      p.px = lastX - dx * 0.65;
      p.py = lastY - dy * 0.65;
      p.x = s.x;
      p.y = s.y;
      // life grows slightly with speed — "length increases when moving fast"
      p.life = Math.min(1.35, 0.8 + s.speed * 0.02);
      p.size = (lowPower ? 0.9 : 1.05) + Math.min(1.6, s.speed * 0.05);
      p.shape = s.speed > 10 && spawnCount % 3 === 0 ? 1 : spawnCount % 11 === 0 ? 2 : 0;
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

  return <canvas ref={ref} aria-hidden className="kiln-trail" />;
}
