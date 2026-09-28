'use client';
import { useEffect, useRef } from 'react';

/** Abstract "technology operating system" composition.
 *  Panels, nodes and data flows; subtle parallax on pointer move. */
export default function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      el.style.setProperty('--mx', x.toFixed(3));
      el.style.setProperty('--my', y.toFixed(3));
    };
    const onLeave = () => {
      el.style.setProperty('--mx', '0');
      el.style.setProperty('--my', '0');
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const depth = (d: number) => ({
    transform: `translate3d(calc(var(--mx, 0) * ${d}px), calc(var(--my, 0) * ${d * 0.7}px), 0)`,
    transition: 'transform 0.6s cubic-bezier(0.22,0.61,0.21,1)',
  });

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[560px]" aria-hidden>
      {/* backdrop grid + glow */}
      <div className="absolute -inset-6 rounded-[32px] bg-surface/70 shadow-[0_30px_80px_-40px_rgba(23,25,30,0.28)] ring-1 ring-line" />
      <div className="absolute -inset-6 gridlines rounded-[32px] opacity-70" style={{ maskImage: 'radial-gradient(closest-side, black, transparent)' }} />

      {/* connection lines */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 560 520" fill="none">
        <path d="M120 130 C 200 130, 200 210, 268 214" stroke="rgba(23,25,30,0.18)" strokeWidth="1.2" className="flowline" />
        <path d="M300 300 C 360 330, 380 350, 420 372" stroke="rgba(23,25,30,0.18)" strokeWidth="1.2" className="flowline" />
        <path d="M470 150 C 430 190, 420 200, 405 228" stroke="rgba(228,87,46,0.45)" strokeWidth="1.2" className="flowline" />
        <circle cx="120" cy="130" r="3.5" fill="#E4572E" />
        <circle cx="470" cy="150" r="3.5" fill="#17191E" />
        <circle cx="420" cy="372" r="3.5" fill="#17191E" />
      </svg>

      {/* Panel: Workflow */}
      <div className="absolute left-[6%] top-[8%] w-[52%]" style={depth(-10)}>
        <div className="rounded-xl border border-line bg-surface p-4 shadow-[0_18px_44px_-24px_rgba(23,25,30,0.35)]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9.5px] uppercase tracking-tech text-faint">Workflow · Enquiries</span>
            <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wide text-ok">
              <span className="status-dot status-dot-live" /> Running
            </span>
          </div>
          <div className="mt-3 space-y-2">
            {[
              { w: 'w-full', tone: 'bg-ink/70' },
              { w: 'w-[82%]', tone: 'bg-ink/45' },
              { w: 'w-[64%]', tone: 'bg-ink/25' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-accent" />
                <span className={`h-[5px] rounded-full ${b.w} ${b.tone}`} />
              </div>
            ))}
          </div>
          <div className="mt-3.5 flex items-center justify-between border-t border-linedark pt-2.5">
            <span className="font-mono text-[9px] text-faint">247 processed</span>
            <span className="font-mono text-[9px] text-accent">3 escalations</span>
          </div>
        </div>
      </div>

      {/* Panel: Agent */}
      <div className="absolute right-[4%] top-[24%] w-[46%]" style={depth(-18)}>
        <div className="rounded-xl border border-line bg-ink p-4 text-paper shadow-[0_24px_54px_-24px_rgba(13,14,17,0.6)]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9.5px] uppercase tracking-tech text-paper/45">Agent · Support</span>
            <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wide text-[#7FCFA8]">
              <span className="status-dot status-dot-live" style={{ background: '#7FCFA8' }} /> Active
            </span>
          </div>
          <div className="mt-3 space-y-2 text-[10px]">
            {[
              { t: 'Checked knowledge base', done: true },
              { t: 'Drafted response', done: true },
              { t: 'Updated CRM record', done: true },
              { t: 'Awaiting human review', done: false },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`flex h-3 w-3 items-center justify-center rounded-full border ${s.done ? 'border-[#7FCFA8]/60 bg-[#7FCFA8]/15' : 'border-paper/25'}`}>
                  {s.done && (
                    <svg width="6" height="6" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4.2 3.3 6 6.5 2.3" stroke="#7FCFA8" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  )}
                </span>
                <span className={s.done ? 'text-paper/75' : 'text-paper/40'}>{s.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel: API */}
      <div className="absolute bottom-[7%] left-[14%] w-[56%]" style={depth(-8)}>
        <div className="rounded-xl border border-line bg-surface p-4 shadow-[0_18px_44px_-24px_rgba(23,25,30,0.35)]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9.5px] uppercase tracking-tech text-faint">API · Integrations</span>
            <span className="font-mono text-[9px] text-faint">8 connected</span>
          </div>
          <div className="mt-3 space-y-1.5 font-mono text-[9.5px]">
            {[
              { ep: '/crm/leads', code: '200', ok: true },
              { ep: '/billing/webhook', code: '200', ok: true },
              { ep: '/whatsapp/send', code: '200', ok: true },
            ].map((r) => (
              <div key={r.ep} className="flex items-center justify-between rounded-md bg-paper px-2.5 py-1.5">
                <span className="text-soft">{r.ep}</span>
                <span className={r.ok ? 'text-ok' : 'text-accent'}>{r.code}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* floating chips */}
      <div className="absolute right-[8%] top-[4%]" style={depth(-26)}>
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 font-mono text-[10px] uppercase tracking-wide text-soft shadow-[0_12px_30px_-14px_rgba(23,25,30,0.3)]">
          <span className="status-dot status-dot-live" /> Automation · live
        </span>
      </div>
      <div className="absolute bottom-[24%] right-[2%]" style={depth(-22)}>
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 font-mono text-[10px] uppercase tracking-wide text-soft shadow-[0_12px_30px_-14px_rgba(23,25,30,0.3)]">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> AI · classifying
        </span>
      </div>
      <div className="absolute bottom-[2%] left-[2%]" style={depth(-30)}>
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 font-mono text-[10px] uppercase tracking-wide text-soft shadow-[0_12px_30px_-14px_rgba(23,25,30,0.3)]">
          Sync · 2s ago
        </span>
      </div>

      {/* spacer defining composition height */}
      <div className="aspect-[13/12] w-full" />
    </div>
  );
}
