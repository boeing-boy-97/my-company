'use client';
import { useEffect, useRef, type ReactNode, type ElementType } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
  id?: string;
}

/** IntersectionObserver-based scroll reveal. With JS disabled or
 *  reduced motion on, CSS guarantees content stays visible. */
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '', id }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} id={id} className={`reveal ${className}`} style={{ ['--reveal-delay' as string]: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
