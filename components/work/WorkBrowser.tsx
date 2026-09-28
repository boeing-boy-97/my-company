'use client';
import { useState } from 'react';
import Link from 'next/link';
import CaseVisual from './CaseVisual';
import { workFilters, type CaseStudy } from '@/content/caseStudies';
import { EmptyState } from '@/components/ui/primitives';

export default function WorkBrowser({ cases }: { cases: CaseStudy[] }) {
  const [filter, setFilter] = useState('All');
  const visible = filter === 'All' ? cases : cases.filter((c) => c.category === filter);

  return (
    <div>
      {/* filters */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter work by category">
        {workFilters.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-250 ${
                active ? 'border-ink bg-ink text-paper' : 'border-line bg-surface text-soft hover:border-ink/30 hover:text-ink'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* grid */}
      {visible.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title="Nothing in this category yet"
            body="We publish work as projects complete and clients approve. Check back soon — or ask us directly about experience in this area."
          />
        </div>
      ) : (
        <div key={filter} className="mt-12 grid gap-10 md:grid-cols-2">
          {visible.map((cs, i) => (
            <Link
              key={cs.slug}
              href={`/work/${cs.slug}`}
              className={`group animate-fadeswap ${i % 2 === 1 ? 'md:translate-y-10' : ''}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <CaseVisual variant={cs.visual} className="transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_30px_60px_-30px_rgba(13,14,17,0.5)]" />
              <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-tech text-faint">
                    <span className="text-accent">{cs.category}</span>
                    <span>{cs.industry}</span>
                    <span>{cs.year}</span>
                  </div>
                  <h2 className="display-tight mt-2.5 font-display text-[clamp(1.3rem,2.4vw,1.7rem)] font-semibold tracking-tight text-ink transition-colors group-hover:text-accentdeep">{cs.title}</h2>
                  <p className="mt-2 line-clamp-2 max-w-[440px] text-[14px] leading-relaxed text-soft">{cs.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {cs.services.map((sv) => (
                      <span key={sv} className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[10.5px] text-soft">
                        {sv}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-soft transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden className="-rotate-45 transition-transform duration-300 group-hover:rotate-0">
                    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
