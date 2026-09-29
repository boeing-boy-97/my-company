'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * A one-shot hairline sweep along the top edge when the route changes —
 * the page answers instantly, no curtain, no spinner. Reduced-motion users
 * see nothing (content simply changes), which is exactly right.
 */
export default function RouteCue() {
  const pathname = usePathname();
  const [tick, setTick] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) setTick((t) => t + 1);
  }, [pathname, ready]);

  if (!ready || tick === 0) return null;
  return <span key={tick} aria-hidden className="kiln-routecue" />;
}
