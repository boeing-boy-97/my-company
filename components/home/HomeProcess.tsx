'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLink } from '@/components/ui/primitives';

const steps = [
  { num: '01', title: 'Discover', body: 'Understand the business problem.' },
  { num: '02', title: 'Define', body: 'Convert the problem into a technical specification.' },
  { num: '03', title: 'Design', body: 'Design the product, workflow and user experience.' },
  { num: '04', title: 'Build', body: 'Develop and integrate the system.' },
  { num: '05', title: 'Launch', body: 'Deploy the solution into production.' },
  { num: '06', title: 'Evolve', body: 'Monitor, maintain and improve it.' },
];

export default function HomeProcess() {
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (fillRef.current) fillRef.current.style.height = '100%';
      return;
    }
    const onScroll = () => {
      const track = trackRef.current;
      const fill = fillRef.current;
      if (!track || !fill) return;
      const r = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh * 0.7 - r.top) / (r.height + vh * 0.2)));
      fill.style.height = `${(progress * 100).toFixed(1)}%`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative">
      {/* progress rail */}
      <div ref={trackRef} className="absolute bottom-4 left-[22px] top-4 hidden w-px bg-line md:block" aria-hidden>
        <div ref={fillRef} className="w-full bg-accent transition-[height] duration-200 ease-out" style={{ height: '0%' }} />
      </div>

      <ol className="space-y-0">
        {steps.map((s) => (
          <li key={s.num} className="group relative grid gap-3 border-b border-line py-7 last:border-b-0 md:grid-cols-[64px_200px_1fr] md:items-baseline md:gap-6 md:py-8">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface font-mono text-[12px] text-soft transition-colors duration-300 group-hover:border-accent group-hover:text-accent md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2">
              {s.num}
            </span>
            <h3 className="font-display text-[clamp(1.3rem,2.4vw,1.8rem)] font-semibold tracking-tight text-ink md:pl-16">{s.title}</h3>
            <p className="text-[15.5px] text-soft md:pl-2">{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10">
        <ArrowLink href="/process">See the full process, stage by stage</ArrowLink>
      </div>
    </div>
  );
}
