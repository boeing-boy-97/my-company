import { cn } from '@/lib/utils';

type Variant = 'workflow' | 'agent' | 'dashboard' | 'mobile' | 'documents' | 'platform';

/** Stylized product artifacts — intentional abstract UIs instead of stock imagery. */
export default function CaseVisual({ variant, className }: { variant: Variant; className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl border border-line bg-coal', className)}>
      <div className="pointer-events-none absolute inset-0 gridlines opacity-[0.16]" aria-hidden />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(420px 260px at 72% 20%, rgba(228,87,46,0.16), transparent 65%)' }} aria-hidden />
      <div className="relative flex h-full min-h-[300px] items-center justify-center p-8">{artifacts[variant]}</div>
    </div>
  );
}

const windowChrome = (title: string, children: React.ReactNode, dark = false) => (
  <div className={cn('w-full max-w-[400px] overflow-hidden rounded-xl border shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]', dark ? 'border-paper/15 bg-ink text-paper' : 'border-line bg-surface text-ink')}>
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
    'Operations · Live',
    <div>
      <div className="grid grid-cols-3 gap-2">
        {['42.7k', '98.2%', '1,284'].map((v, i) => (
          <div key={i} className="rounded-lg border border-linedark bg-paper p-2.5">
            <p className="font-display text-[13px] font-semibold">{v}</p>
            <p className="mt-0.5 font-mono text-[7.5px] uppercase tracking-wide text-faint">{['Volume', 'Uptime', 'Orders'][i]}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex h-[74px] items-end gap-1.5 rounded-lg border border-linedark bg-paper p-3">
        {[38, 52, 44, 66, 58, 74, 62, 85, 71, 92, 80, 96].map((h, i) => (
          <span key={i} className={cn('flex-1 rounded-sm', i === 11 ? 'bg-accent' : 'bg-ink/25')} style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  ),
  agent: windowChrome(
    'Agent · Conversation',
    <div className="space-y-2.5">
      <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-ink px-3.5 py-2 text-[11px] text-paper">Where is shipment DX-2041?</div>
      <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-linedark bg-paper px-3.5 py-2 text-[11px] text-ink">
        Left the Pune hub at 06:40 — arriving Nagpur depot around 14:00 today. I’ll message you when it’s out for delivery.
      </div>
      <div className="flex items-center gap-2 pt-1 font-mono text-[8.5px] uppercase tracking-wide text-faint">
        <span className="status-dot status-dot-live" /> Resolved · no human needed
      </div>
    </div>,
    true
  ),
  workflow: (
    <div className="w-full max-w-[400px] space-y-0">
      {['Enquiry received', 'AI classifies intent', 'CRM record created', 'Response sent'].map((step, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <span className={cn('flex h-7 w-7 items-center justify-center rounded-full border text-[10px]', i < 3 ? 'border-ok/40 bg-ok/10 text-ok' : 'border-accent/50 bg-accenthalo text-accent')}>
              {i < 3 ? '✓' : '…'}
            </span>
            {i < 3 && <span className="h-5 w-px bg-line" />}
          </div>
          <span className={cn('rounded-lg border border-line bg-surface px-3.5 py-2 text-[11.5px]', i === 3 ? 'text-accentdeep' : 'text-ink')}>{step}</span>
        </div>
      ))}
    </div>
  ),
  documents: (
    <div className="w-full max-w-[400px] space-y-2">
      {[
        { name: 'identity-proof.pdf', field: 'Name · DOB · ID №', ok: '98%' },
        { name: 'bank-statement.pdf', field: 'Balance · Transactions', ok: '96%' },
        { name: 'agreement-signed.pdf', field: 'Parties · Terms · Date', ok: 'review' },
      ].map((d, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg border border-line bg-surface px-4 py-3">
          <div>
            <p className="text-[11.5px] font-medium text-ink">{d.name}</p>
            <p className="mt-0.5 font-mono text-[8.5px] uppercase tracking-wide text-faint">{d.field}</p>
          </div>
          <span className={cn('rounded-full px-2.5 py-1 font-mono text-[9px]', d.ok === 'review' ? 'bg-accenthalo text-accentdeep' : 'bg-ok/10 text-ok')}>{d.ok}</span>
        </div>
      ))}
    </div>
  ),
  mobile: (
    <div className="flex items-center gap-5">
      <div className="w-[150px] overflow-hidden rounded-[26px] border-[3px] border-paper/20 bg-ink p-3 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-paper/25" />
        <div className="space-y-2">
          <div className="rounded-lg bg-paper/10 p-2.5">
            <p className="font-mono text-[7px] uppercase tracking-wide text-paper/40">Today</p>
            <p className="mt-1 font-display text-[15px] font-semibold text-paper">6 visits</p>
          </div>
          {[70, 52, 84].map((w, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-paper/[0.06] p-2">
              <span className="h-5 w-5 rounded-md bg-accent/70" />
              <span className="h-[5px] rounded-full bg-paper/30" style={{ width: `${w}%` }} />
            </div>
          ))}
          <div className="rounded-lg bg-accent p-2 text-center font-mono text-[8px] uppercase tracking-wide text-white">Start route</div>
        </div>
      </div>
      <div className="hidden space-y-2 sm:block">
        {['Offline-first sync', 'Photo evidence capture', 'Auto job reports'].map((f) => (
          <p key={f} className="flex items-center gap-2 text-[11px] text-paper/60">
            <span className="h-1 w-1 rounded-full bg-accent" /> {f}
          </p>
        ))}
      </div>
    </div>
  ),
  platform: windowChrome(
    'SaaS · Workspace',
    <div className="flex gap-3">
      <div className="w-[34%] space-y-1.5 border-r border-linedark pr-3">
        {['Overview', 'Pipeline', 'Automations', 'Billing', 'Settings'].map((n, i) => (
          <p key={n} className={cn('rounded-md px-2 py-1.5 text-[10px]', i === 1 ? 'bg-ink text-paper' : 'text-soft')}>
            {n}
          </p>
        ))}
      </div>
      <div className="flex-1 space-y-2">
        {[
          { n: 'Hot leads', v: '12', tone: 'text-accent' },
          { n: 'Follow-ups due', v: '5', tone: 'text-ink' },
          { n: 'Win rate', v: '31%', tone: 'text-ok' },
        ].map((r) => (
          <div key={r.n} className="flex items-center justify-between rounded-lg border border-linedark bg-paper px-3 py-2">
            <span className="text-[10px] text-soft">{r.n}</span>
            <span className={cn('font-display text-[12px] font-semibold', r.tone)}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};
