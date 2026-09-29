'use client';

import { useEffect, useRef } from 'react';
import { subscribeScroll } from '@/lib/motion/engine';

/** 2px reading-progress hairline across the top of the viewport, existing
 *  ember accent, transform-only, driven by the shared engine. */
export default function ScrollProgress() {
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const unsub = subscribeScroll((p) => {
      const el = bar.current;
      if (el) el.style.transform = `scaleX(${p.toFixed(4)})`;
    });
    return unsub;
  }, []);

  return (
    <div aria-hidden className="kiln-progress pointer-events-none fixed inset-x-0 top-0 z-[9996] h-[2px]">
      <span ref={bar} className="block h-full w-full origin-left bg-accent" style={{ transform: 'scaleX(0)' }} />
    </div>
  );
}
