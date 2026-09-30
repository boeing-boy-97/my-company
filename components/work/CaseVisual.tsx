import { cn } from '@/lib/utils';

type Variant = 'workflow' | 'agent' | 'dashboard' | 'mobile' | 'documents' | 'platform';

/** Concept UI studies; explicitly illustrative, never presented as client telemetry. */
export default function CaseVisual({ variant, className }: { variant: Variant; className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl border border-line bg-coal', className)}>
      <div className="pointer-events-none absolute inset-0 gridlines opacity-[0.16]" aria-hidden />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(420px 260px at 72% 20%, rgba(228,87,46,0.16), transparent 65%)' }} aria-hidden />
      <div className="relative flex h-full min-h-[300px] items-center justify-center px-8 pb-14 pt-8">{artifacts[variant]}</div>
      <p className="absolute bottom-4 left-5 font-mono text-[8px] uppercase tracking-[0.16em] text-paper/45">Illustrative interface · not live data</p>
    </div>
  );
}

const windowChrome = (title: string, children: React.ReactNode, dark = false) => (
  <div className={cn('w-full max-w-[400px] overflow-hidden rounded-xl border', dark ? 'border-paper/15 bg-ink text-paper' : 'border-line bg-surface text-ink')}>
    <div className={cn('flex items-center gap-1.5 border-b px-4 py-2.5', dark ? 'border-paper/10' : 'border-linedark')}>
      <span className="h-2 w-2 rounded-full bg-accent/80" />
      <span className={cn('h-2 w-2 rounded-full', dark ? 'bg-paper/20' : 'bg-ink/15')} />
      <span className={cn('h-2 w-2 rounded-full', dark ? 'bg-paper/20' : 'bg-ink/15')} />
      <span className={cn('ml-3 font-mono text-[9px] uppercase tracking-tech', dark ? 'text-paper/40' : 'text-faint')}>{title}</span>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const artifacts: Record<Variant, React.ReactNode> = {
  dashboard: windowChrome(
    'Operations · Interface study',
    <div>
      <div className="grid grid-cols-3 gap-2">
        {['Intake', 'In progress', 'Exceptions'].map((v, i) => (
          <div key={v} className="border-l-2 border-line px-2.5 py-2 first:border-accent">
            <p className="font-mono text-[8px] uppercase tracking-wide text-faint">{String(i + 1).padStart(2, '0')}</p>
            <p className="mt-1 text-[10px] font-medium text-ink">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex h-[74px] items-end gap-1.5 border-y border-linedark px-3 py-3" aria-hidden>
        {[38, 52, 44, 66, 58, 74, 62, 85, 71, 92, 80, 96].map((h, i) => (
          <span key={i} className={cn('flex-1', i === 11 ? 'bg-accent' : 'bg-ink/20')} style={{ height: `${h}%` }} />
        ))}
      </div>
      <p className="mt-2 font-mono text-[8px] uppercase tracking-wide text-faint">Queue view · sample composition</p>
    </div>
  ),
  agent: windowChrome(
    'Agent · Example exchange',
    <div className="space-y-2.5">
      <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-ink px-3.5 py-2 text-[11px] text-paper">Can you check a shipment status?</div>
      <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-linedark bg-paper px-3.5 py-2 text-[11px] leading-relaxed text-ink">
        The assistant looks up the order in the connected logistics system, then replies with the latest available update.
      </div>
      <div className="border-t border-paper/10 pt-2 font-mono text-[8px] uppercase tracking-wide text-paper/40">Handoff rules · set by the team</div>
    </div>,
    true
  ),
  workflow: (
    <div className="w-full max-w-[400px]">
      <p className="mb-4 font-mono text-[9px] uppercase tracking-tech text-paper/45">Enquiry routing · system sequence</p>
      {['Message received', 'Intent and details read', 'Record updated', 'Reply or human handoff'].map((step, i) => (
        <div key={step} className="flex items-center gap-3">
          <div className="flex w-7 shrink-0 flex-col items-center">
            <span className={cn('flex h-7 w-7 items-center justify-center border font-mono text-[9px]', i === 3 ? 'border-accent/50 text-accent' : 'border-paper/20 text-paper/65')}>{String(i + 1).padStart(2, '0')}</span>
            {i < 3 && <span className="h-5 w-px bg-paper/15" />}
          </div>
          <span className={cn('border-b border-paper/10 py-2 text-[11.5px]', i === 3 ? 'text-paper' : 'text-paper/65')}>{step}</span>
        </div>
      ))}
    </div>
  ),
  documents: (
    <div className="w-full max-w-[400px] space-y-2">
      {[
        { name: 'Document A', field: 'Name · date of birth · identifier', state: 'FIELDS' },
        { name: 'Document B', field: 'Balance · transactions', state: 'FIELDS' },
        { name: 'Document C', field: 'Parties · terms · date', state: 'REVIEW' },
      ].map((d) => (
        <div key={d.name} className="flex items-center justify-between gap-3 border-b border-linedark bg-surface px-4 py-3 last:border-0">
          <div>
            <p className="text-[11.5px] font-medium text-ink">{d.name}</p>
            <p className="mt-0.5 font-mono text-[8.5px] uppercase tracking-wide text-faint">{d.field}</p>
          </div>
          <span className="font-mono text-[8px] uppercase tracking-wide text-accentdeep">{d.state}</span>
        </div>
      ))}
    </div>
  ),
  mobile: (
    <div className="flex items-center gap-5">
      <div className="w-[150px] overflow-hidden rounded-[26px] border-[3px] border-paper/20 bg-ink p-3">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-paper/25" />
        <div className="space-y-2">
          <div className="border-b border-paper/10 px-2.5 pb-2.5">
            <p className="font-mono text-[7px] uppercase tracking-wide text-paper/40">Field workflow</p>
            <p className="mt-1 text-[12px] font-medium text-paper">Route plan</p>
          </div>
          {['Job details', 'Photo evidence', 'Visit notes'].map((label, i) => (
            <div key={label} className="flex items-center gap-2 border-b border-paper/[0.08] px-2 py-2 last:border-0">
              <span className="font-mono text-[7px] text-accent">0{i + 1}</span>
              <span className="h-[5px] flex-1 bg-paper/25" />
            </div>
          ))}
          <div className="bg-accent p-2 text-center font-mono text-[8px] uppercase tracking-wide text-white">Open route</div>
        </div>
      </div>
      <div className="hidden space-y-3 sm:block">
        {['Capture', 'Sync', 'Report'].map((f, i) => (
          <p key={f} className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-wide text-paper/60">
            <span className="text-accent">0{i + 1}</span>{f}
          </p>
        ))}
      </div>
    </div>
  ),
  platform: windowChrome(
    'Product · Workspace study',
    <div className="flex gap-3">
      <div className="w-[34%] space-y-1.5 border-r border-linedark pr-3">
        {['Overview', 'Pipeline', 'Automations', 'Records', 'Settings'].map((n, i) => (
          <p key={n} className={cn('px-2 py-1.5 text-[10px]', i === 1 ? 'border-l-2 border-accent bg-paper text-ink' : 'text-soft')}>
            {n}
          </p>
        ))}
      </div>
      <div className="flex-1 space-y-2">
        {[
          { n: 'Source', v: 'Enquiry' },
          { n: 'Rule', v: 'Route by intent' },
          { n: 'Next step', v: 'Assign owner' },
        ].map((r) => (
          <div key={r.n} className="border-b border-linedark bg-paper px-3 py-2 last:border-0">
            <span className="block font-mono text-[8px] uppercase tracking-wide text-faint">{r.n}</span>
            <span className="mt-1 block text-[10px] font-medium text-ink">{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};
