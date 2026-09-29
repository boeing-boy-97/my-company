'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Industry } from '@/content/industries';

/**
 * Industry selector (§28) — a vertical index on the left, a changing
 * dossier on the right. Tap/select driven, never hover-gated, so the
 * same composition works one-handed on mobile (list above panel).
 */
export default function IndustryExplorer({ industries }: { industries: Industry[] }) {
  const [active, setActive] = useState(0);
  const ind = industries[active];

  return (
    <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-14">
      {/* vertical selector */}
      <nav aria-label="Industries" role="tablist" aria-orientation="vertical" className="lg:sticky lg:top-28 lg:self-start">
        <p className="label-tech hidden lg:block">Select an industry</p>
        <ul className={`flex gap-1.5 overflow-x-auto pb-2 lg:mt-4 lg:block lg:space-y-0.5 lg:overflow-visible lg:pb-0 ${active >= 6 ? 'lg:border-l-0' : ''}`}>
          {industries.map((item, i) => {
            const on = i === active;
            return (
              <li key={item.slug} className="shrink-0">
                <button
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className={`group flex w-full items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-left text-[13.5px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    on ? 'bg-accenthalo font-medium text-ink' : 'text-soft hover:text-ink'
                  }`}
                >
                  <span className={`font-mono text-[9.5px] tabular-nums transition-colors ${on ? 'text-accentdeep' : 'text-faint'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* dossier */}
      <article key={ind.slug} className="animate-fadeswap overflow-hidden rounded-2xl border border-line bg-surface">
        <header className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line px-6 py-5 md:px-8">
          <div>
            <h3 className="display-tight font-display text-[clamp(1.4rem,2.6vw,1.9rem)] font-semibold tracking-tight text-ink">{ind.name}</h3>
            <p className="mt-1 text-[13.5px] text-faint">{ind.tagline}</p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-tech text-faint">
            Pattern sheet · {String(active + 1).padStart(2, '0')}/{String(industries.length).padStart(2, '0')}
          </span>
        </header>

        <div className="grid gap-px bg-line md:grid-cols-2">
          <section className="bg-surface px-6 py-6 md:px-8">
            <p className="font-mono text-[9.5px] uppercase tracking-tech text-accentdeep">What goes wrong here</p>
            <ul className="mt-3.5 space-y-2.5">
              {ind.problems.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-soft">
                  <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-accent/70" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </section>
          <section className="bg-surface px-6 py-6 md:px-8">
            <p className="font-mono text-[9.5px] uppercase tracking-tech text-ok">What tends to fix it</p>
            <ul className="mt-3.5 space-y-2.5">
              {ind.solutions.map((sv) => (
                <li key={sv} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-soft">
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none" aria-hidden className="mt-[6px] shrink-0 text-ok">
                    <path d="M2 7.4 5.2 10.5 12 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {sv}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-6 py-5 md:px-8">
          <ul className="flex flex-wrap gap-2" aria-label="Systems this industry runs">
            {ind.systems.map((sys) => (
              <li key={sys} className="rounded-full border border-line bg-paper px-3 py-1 font-mono text-[10px] uppercase tracking-tech text-faint">
                {sys}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-5">
            <Link href={`/industries/${ind.slug}`} className="link-underline text-[13px] font-medium text-soft transition-colors hover:text-ink">
              Industry detail
            </Link>
            <Link
              href="/start-project"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-transform duration-200 hover:-translate-y-px"
            >
              Explore a solution
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
