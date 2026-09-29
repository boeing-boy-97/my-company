'use client';

import { useState } from 'react';
import { services } from '@/content/services';
import Link from 'next/link';

/**
 * Capability map (§16) — KILN at the center of six practices.
 * Selecting a practice re-renders the surrounding panel with its
 * sub-capabilities, the one-sentence definition and a route in.
 * Desktop: radial constellation (SVG rails + node buttons).
 * Mobile: vertical selector list — same data, same interaction.
 * Pure DOM + one SVG; no libraries.
 */
export default CapabilityMapInner;


function CapabilityMapInner() {
  const [active, setActive] = useState(0);
  const svc = services[active];

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="grid lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
        {/* constellation / selector */}
        <div className="relative border-b border-line p-6 lg:border-b-0 lg:border-r lg:p-8">
          <p className="label-tech">The capability map</p>
          <h3 className="mt-2 font-display text-[19px] font-semibold text-ink">Six practices, one team.</h3>

          {/* desktop constellation */}
          <div className="relative mx-auto mt-6 hidden aspect-square w-full max-w-[360px] md:block" role="radiogroup" aria-label="Kiln capabilities">
            <svg viewBox="0 0 360 360" className="absolute inset-0 h-full w-full" aria-hidden>
              {/* concentric guides */}
              <circle cx="180" cy="180" r="128" fill="none" stroke="var(--line, #e7e3db)" strokeWidth="1" strokeDasharray="2 6" />
              <circle cx="180" cy="180" r="64" fill="none" stroke="var(--line, #e7e3db)" strokeWidth="1" />
              {services.map((s, i) => {
                const a = (i / services.length) * Math.PI * 2 - Math.PI / 2;
                const x = 180 + Math.cos(a) * 128;
                const y = 180 + Math.sin(a) * 128;
                const on = i === active;
                return (
                  <line key={s.slug} x1="180" y1="180" x2={x} y2={y} stroke={on ? '#E4572E' : '#e3ded5'} strokeWidth={on ? 1.4 : 1} />
                );
              })}
            </svg>
            {/* center */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="flex h-[74px] w-[74px] items-center justify-center rounded-full border border-ink/12 bg-paper font-display text-[15px] font-bold tracking-[0.18em] text-ink shadow-[0_10px_30px_-18px_rgba(23,25,30,0.4)]">
                KILN
              </span>
            </div>
            {services.map((s, i) => {
              const a = (i / services.length) * Math.PI * 2 - Math.PI / 2;
              const x = 50 + Math.cos(a) * (128 / 3.6); // % positions
              const y = 50 + Math.sin(a) * (128 / 3.6);
              const on = i === active;
              return (
                <button
                  key={s.slug}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  className={`absolute w-[92px] -translate-x-1/2 -translate-y-1/2 rounded-xl border px-2 py-1.5 text-center transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    on ? 'border-accent/50 bg-accenthalo shadow-[0_8px_22px_-14px_rgba(228,87,46,0.55)]' : 'border-line bg-paper hover:border-ink/25'
                  }`}
                >
                  <span className={`block font-mono text-[8.5px] tracking-tech ${on ? 'text-accentdeep' : 'text-faint'}`}>{s.num}</span>
                  <span className={`block text-[10.5px] font-semibold leading-tight ${on ? 'text-ink' : 'text-soft'}`}>
                    {s.title.replace('AI Product Development', 'AI Products').replace('System Integration', 'Systems')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* mobile + tablet selector */}
          <div className="mt-5 grid gap-1.5 md:hidden" role="radiogroup" aria-label="Kiln capabilities">
            {services.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.slug}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors duration-200 ${
                    on ? 'border-accent/45 bg-accenthalo' : 'border-line bg-paper'
                  }`}
                >
                  <span className={`font-mono text-[10px] ${on ? 'text-accentdeep' : 'text-faint'}`}>{s.num}</span>
                  <span className={`text-[13.5px] font-semibold ${on ? 'text-ink' : 'text-soft'}`}>{s.title}</span>
                  <span className={`ml-auto h-1.5 w-1.5 rounded-full ${on ? 'bg-accent' : 'bg-ink/15'}`} aria-hidden />
                </button>
              );
            })}
          </div>
        </div>

        {/* detail panel */}
        <div key={svc.slug} className="animate-fadeswap p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-tech text-accentdeep">Capability {svc.num} / 06</span>
            <span className="h-px flex-1 bg-line" aria-hidden />
          </div>
          <h4 className="display-tight mt-4 font-display text-[clamp(1.35rem,2.4vw,1.9rem)] font-semibold leading-[1.15] text-ink">{svc.title}</h4>
          <p className="mt-3 max-w-[52ch] text-[14.5px] leading-[1.7] text-soft">{svc.short}</p>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label={`What ${svc.title} covers`}>
            {svc.capabilities.map((c) => (
              <li key={c} className="rounded-full border border-line bg-paper px-3 py-1 font-mono text-[10px] uppercase tracking-tech text-soft">
                {c}
              </li>
            ))}
          </ul>

          <div className="mt-7 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
            <div className="bg-paper px-4 py-3.5">
              <p className="font-mono text-[9px] uppercase tracking-tech text-faint">Problem it removes</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink">{svc.problemsSolved[0]}</p>
            </div>
            <div className="bg-paper px-4 py-3.5">
              <p className="font-mono text-[9px] uppercase tracking-tech text-faint">First artifact you receive</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink">{svc.deliverables[0]}</p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-5">
            <Link
              href={`/services/${svc.slug}`}
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13.5px] font-medium text-paper transition-transform duration-200 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Explore {svc.title}
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
                <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/start-project" className="link-underline text-[13.5px] font-medium text-soft transition-colors hover:text-ink">
              Describe your problem instead →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
