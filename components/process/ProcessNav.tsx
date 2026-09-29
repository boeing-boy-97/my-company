'use client';

import { useEffect, useState } from 'react';

/**
 * Sticky stage index for /process (desktop). Tracks which stage is in view
 * while scrolling, shows progress, and jumps between stages on click.
 * Hidden on mobile — there the stages read as a vertical timeline.
 */
export default function ProcessNav({ stages }: { stages: { num: string; name: string }[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = stages
      .map((s) => document.getElementById(`stage-${s.num}`))
      .filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          const idx = els.indexOf(visible[0].target as HTMLElement);
          if (idx >= 0) setActive(idx);
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: 0 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [stages]);

  const goTo = (num: string) => {
    const el = document.getElementById(`stage-${num}`);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const pct = ((active + 1) / stages.length) * 100;

  return (
    <nav aria-label="Process stages" className="sticky top-28 hidden self-start md:block">
      <p className="label-tech">
        Stage <span className="text-ink">{stages[active].num}</span> / {String(stages.length).padStart(2, '0')}
      </p>
      <div
        className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={stages.length}
        aria-valuenow={active + 1}
        aria-label="Process progress"
      >
        <div
          className="h-full w-full origin-left bg-accent transition-transform duration-300 ease-out"
          style={{ transform: `scaleX(${pct / 100})` }}
        />
      </div>
      <ol className="mt-7 space-y-0.5">
        {stages.map((s, i) => {
          const on = i === active;
          return (
            <li key={s.num}>
              <button
                type="button"
                onClick={() => goTo(s.num)}
                aria-current={on ? 'step' : undefined}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-[7px] text-left text-[13.5px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  on ? 'bg-accenthalo font-medium text-ink' : 'text-soft hover:text-ink'
                }`}
              >
                <span className={`font-mono text-[10.5px] tabular-nums transition-colors ${on ? 'text-accentdeep' : 'text-faint group-hover:text-soft'}`}>
                  {s.num}
                </span>
                <span className="truncate">{s.name}</span>
                <span
                  aria-hidden
                  className={`ml-auto h-1 w-1 shrink-0 rounded-full transition-opacity duration-200 ${on ? 'bg-accent opacity-100' : 'opacity-0'}`}
                />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
