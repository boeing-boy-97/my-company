'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { problemSolutions } from '@/content/problems';

const artifactIcons: Record<string, React.ReactNode> = {
  workflow: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2.5" y="4" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="15.5" y="14" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 7h6a3 3 0 0 1 3 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2.6 3" />
    </svg>
  ),
  agent: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  dashboard: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 15v-3M11 15V9M15 15v-5M19 15V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  integration: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  product: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2.5 20 7v10l-8 4.5L4 17V7l8-4.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 11.5 20 7M12 11.5 4 7M12 11.5v10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  app: null,
  document: null,
  mobile: null,
};

export default function ProblemSolution() {
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const userTouched = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer.current = setInterval(() => {
      if (!userTouched.current) setActive((a) => (a + 1) % problemSolutions.length);
    }, 4200);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const select = (i: number) => {
    userTouched.current = true;
    if (timer.current) clearInterval(timer.current);
    setActive(i);
  };

  const current = problemSolutions[active];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
      {/* Problems list */}
      <div role="tablist" aria-label="Common business problems" className="flex flex-col">
        {problemSolutions.map((ps, i) => (
          <button
            key={ps.id}
            role="tab"
            id={`problem-tab-${ps.id}`}
            aria-selected={i === active}
            aria-controls="solution-panel"
            onClick={() => select(i)}
            onFocus={() => select(i)}
            className={`group flex items-center justify-between gap-4 border-b border-line px-1 py-5 text-left transition-all duration-300 md:px-3 ${
              i === active ? 'bg-surface shadow-[0_14px_40px_-24px_rgba(23,25,30,0.3)] ring-1 ring-line' : 'hover:bg-surface/60'
            } ${i === 0 ? 'border-t' : ''}`}
          >
            <span className="flex items-center gap-4">
              <span className={`font-mono text-[11px] ${i === active ? 'text-accent' : 'text-faint'}`}>{String(i + 1).padStart(2, '0')}</span>
              <span className={`font-display text-[clamp(1.05rem,2vw,1.4rem)] font-medium tracking-tight transition-colors ${i === active ? 'text-ink' : 'text-soft group-hover:text-ink'}`}>
                {ps.problem}
              </span>
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
              className={`shrink-0 transition-all duration-300 ${i === active ? 'translate-x-0 text-accent opacity-100' : '-translate-x-1 text-faint opacity-0 group-hover:translate-x-0 group-hover:opacity-60'}`}
            >
              <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>

      {/* Solution panel */}
      <div id="solution-panel" role="tabpanel" aria-labelledby={`problem-tab-${current.id}`} className="lg:sticky lg:top-32 lg:self-start">
        <div key={current.id} className="animate-fadeswap rounded-2xl border border-line bg-coal p-8 text-paper md:p-10">
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-paper/15 bg-paper/[0.06] text-accent">{artifactIcons[current.artifact] || artifactIcons.workflow}</span>
            <span className="font-mono text-[10px] uppercase tracking-tech text-paper/40">System response</span>
          </div>
          <p className="mt-7 font-mono text-[11px] uppercase tracking-tech text-paper/45">The problem</p>
          <p className="mt-1.5 font-display text-[19px] font-medium tracking-tight text-paper/85">“{current.problem}”</p>
          <div className="my-6 flex items-center gap-3" aria-hidden>
            <span className="h-px flex-1 bg-paper/15" />
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 4v16m0 0 5-5m-5 5-5-5" stroke="#E4572E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="h-px flex-1 bg-paper/15" />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-tech text-accent">Our technology response</p>
          <p className="mt-1.5 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-tight">{current.solution}</p>
          <p className="mt-4 text-[15px] leading-[1.7] text-paper/65">{current.detail}</p>
          <Link
            href={current.solutionHref}
            className="group/link mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-paper transition-colors hover:text-accent"
          >
            <span className="link-underline">Explore this solution</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-300 group-hover/link:translate-x-1">
              <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
