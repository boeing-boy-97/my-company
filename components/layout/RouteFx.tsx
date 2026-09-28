'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/** Subtle, non-blocking fade on route change + scroll restoration. */
export default function RouteFx({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.classList.remove('route-fx');
    void el.offsetWidth; // restart animation
    el.classList.add('route-fx');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return (
    <div ref={ref} id="main" tabIndex={-1} className="outline-none">
      {children}
    </div>
  );
}
