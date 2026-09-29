'use client';

import { useState } from 'react';

/**
 * TransformThesis — the homepage's opening argument, §14.
 * "Most businesses don't need more software. They need a better system."
 * A drag-or-tap BEFORE → AFTER reveal over three paired states.
 * The slider is a real input[type=range]: keyboard (arrows), touch-drag and
 * click-to-snap all work; buttons give one-tap states. No hover-only info.
 */

const PAIRS = [
  {
    before: { tag: 'Manual', title: 'People move data by hand', lines: ['Copy from inbox → sheet → ERP', 'Status lives in someone’s memory', 'Friday: four hours reconciling'] },
    after: { tag: 'Connected', title: 'Systems talk on a schedule', lines: ['One capture point, fan-out by event', 'Status is the record, not a guess', 'Reports assemble while you sleep'] },
  },
  {
    before: { tag: 'Fragmented', title: 'Every team keeps a private truth', lines: ['Sales CRM ≠ support tickets ≠ finance ledger', '“Which number is right?” meetings', 'New tools add new silos'] },
    after: { tag: 'Automated', title: 'One flow, many views', lines: ['Shared data model with clear ownership', 'Views generated from the same events', 'New surfaces plug into the same spine'] },
  },
  {
    before: { tag: 'Slow', title: 'Waiting is part of the product', lines: ['Answers in hours, not seconds', 'Approvals stuck in inboxes', 'Customers escalate before they’re helped'] },
    after: { tag: 'Visible', title: 'Work moves at business speed', lines: ['Instant first response, on-channel', 'Approvals queued with context', 'Exceptions surface before they burn in'] },
  },
];

export default function TransformThesis() {
  const [t, setT] = useState(0); // 0 = before … 100 = after
  const pct = Math.max(0, Math.min(100, t));
  const label = pct >= 66 ? 'after' : pct <= 33 ? 'before' : 'transforming';

  return (
    <div>
      {/* controls */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="inline-flex rounded-full border border-line bg-surface p-1" role="group" aria-label="Compare before and after">
          <button
            type="button"
            onClick={() => setT(0)}
            aria-pressed={pct <= 33}
            className={`rounded-full px-4 py-1.5 font-mono text-[10.5px] uppercase tracking-tech transition-colors duration-200 ${pct <= 33 ? 'bg-ink text-paper' : 'text-soft hover:text-ink'}`}
          >
            Before
          </button>
          <button
            type="button"
            onClick={() => setT(100)}
            aria-pressed={pct >= 66}
            className={`rounded-full rounded-l-full px-4 py-1.5 font-mono text-[10.5px] uppercase tracking-tech transition-colors duration-200 ${pct >= 66 ? 'bg-ink text-paper' : 'text-soft hover:text-ink'}`}
          >
            After
          </button>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-tech text-faint" aria-live="polite">
          {label === 'before' ? 'state · as-found' : label === 'after' ? 'state · target system' : 'state · in transformation'}
        </p>
      </div>

      {/* paired panels with clip reveal */}
      <div className="relative mt-8 overflow-hidden rounded-2xl border border-line bg-paper">
        <div className="grid gap-px bg-line lg:grid-cols-3">
          {PAIRS.map((pair, i) => (
            <div key={pair.before.tag} className="relative isolate min-h-[280px] bg-surface">
              {/* AFTER (bottom layer, revealed from left) */}
              <Side variant="after" data={pair.after} idx={i} />
              {/* BEFORE (top layer, clipped away from the left) */}
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 0 0 ${pct}%)`, transition: 'clip-path 160ms cubic-bezier(0.22,0.61,0.21,1)' }}
                aria-hidden={pct >= 66}
              >
                <Side variant="before" data={pair.before} idx={i} />
              </div>
            </div>
          ))}
        </div>

        {/* handle line */}
        <div
          className="pointer-events-none absolute inset-y-0 z-20 w-px bg-accent"
          style={{ left: `${pct}%`, transition: 'left 160ms cubic-bezier(0.22,0.61,0.21,1)' }}
          aria-hidden
        >
          <span className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/50 bg-paper shadow-[0_2px_10px_rgba(23,25,30,0.15)]">
            <svg viewBox="0 0 24 24" fill="none" className="h-full w-full p-1.5 text-accentdeep" aria-hidden>
              <path d="M9 7 5 12l4 5M15 7l4 5-4 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      {/* the actual control — a native range for keyboard + drag */}
      <label className="mt-5 flex items-center gap-4">
        <span className="sr-only">Drag to compare: 0 is the manual before-state, 100 is the automated after-state</span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={pct}
          onChange={(e) => setT(Number(e.target.value))}
          className="h-1.5 w-full cursor-ew-resize appearance-none rounded-full bg-line accent-[#E4572E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        />
        <span className="w-14 shrink-0 text-right font-mono text-[11px] tabular-nums text-faint">{pct}%</span>
      </label>
    </div>
  );
}

function Side({ variant, data, idx }: { variant: 'before' | 'after'; data: { tag: string; title: string; lines: string[] }; idx: number }) {
  const after = variant === 'after';
  return (
    <div className={`flex h-full flex-col p-6 md:p-7 ${after ? 'bg-paper' : 'bg-surface'}`}>
      <div className="flex items-center gap-2.5">
        <span className={`font-mono text-[9.5px] uppercase tracking-tech ${after ? 'text-accentdeep' : 'text-faint'}`}>
          {String(idx + 1).padStart(2, '0')} · {after ? 'after' : 'before'}
        </span>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${after ? 'border-ok/30 text-ok' : 'border-line text-faint'}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${after ? 'bg-ok' : 'bg-ink/25'}`} aria-hidden />
          {data.tag}
        </span>
      </div>
      <p className="mt-4 font-display text-[16.5px] font-semibold leading-snug text-ink">{data.title}</p>
      <ul className="mt-4 space-y-2.5">
        {data.lines.map((l) => (
          <li key={l} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-soft">
            <span aria-hidden className={`mt-[7px] h-px w-3 shrink-0 ${after ? 'bg-accent/60' : 'bg-ink/20'}`} />
            {l}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center gap-2 pt-6 font-mono text-[9.5px] uppercase tracking-tech text-faint">
        <span className={`h-[5px] w-[5px] rounded-full ${after ? 'bg-accent' : 'bg-ink/25'}`} aria-hidden />
        {after ? 'target state' : 'as found'}
      </div>
    </div>
  );
}
