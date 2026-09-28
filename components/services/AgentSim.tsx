'use client';
import { useEffect, useRef, useState } from 'react';

const ACTIONS = [
  { label: 'Checking team calendar', detail: 'Google Calendar · Sales team', ms: 900 },
  { label: 'Finding availability', detail: 'Tuesday 14:00 · Wednesday 10:30 · Wednesday 16:00', ms: 1100 },
  { label: 'Booking the meeting', detail: 'Tuesday 14:00 IST · 30 min · video call', ms: 1000 },
  { label: 'Updating CRM', detail: 'Contact linked · meeting logged · owner notified', ms: 800 },
  { label: 'Sending confirmation', detail: 'Email + calendar invite delivered', ms: 900 },
];

export default function AgentSim() {
  const [step, setStep] = useState(-1);
  const [ran, setRan] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const run = () => {
    setStep(0);
    setRan(true);
    let elapsed = 0;
    ACTIONS.forEach((a, i) => {
      elapsed += a.ms;
      setTimeout(() => setStep(i + 1), elapsed);
    });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(ACTIONS.length);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !ran) run();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const done = step >= ACTIONS.length;

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-line bg-coal text-paper shadow-[0_30px_70px_-30px_rgba(13,14,17,0.55)]">
      <div className="flex items-center justify-between border-b border-paper/10 px-5 py-3.5">
        <span className="font-mono text-[10px] uppercase tracking-tech text-paper/40">Agent simulation · Appointment Agent</span>
        <span className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide ${done ? 'text-[#7FCFA8]' : 'text-paper/40'}`}>
          <span className="status-dot status-dot-live" style={{ background: done ? '#7FCFA8' : '#E4572E' }} /> {done ? 'Complete' : 'Working'}
        </span>
      </div>

      <div className="space-y-4 px-5 py-6 md:px-7">
        {/* user message */}
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-paper/[0.08] px-4 py-3 text-[13.5px] leading-relaxed text-paper/90">
            “Book a meeting with the sales team tomorrow.”
            <p className="mt-1 font-mono text-[9px] uppercase tracking-wide text-paper/35">User · WhatsApp</p>
          </div>
        </div>

        {/* agent actions */}
        <div className="max-w-[92%] rounded-2xl rounded-bl-sm border border-paper/10 bg-paper/[0.04] px-4 py-4">
          <p className="font-mono text-[9px] uppercase tracking-tech text-paper/35">Agent · taking actions</p>
          <ul className="mt-3 space-y-2.5">
            {ACTIONS.map((a, i) => {
              const state = step > i ? 'done' : step === i ? 'active' : 'pending';
              return (
                <li key={a.label} className={`flex items-start gap-3 transition-opacity duration-400 ${state === 'pending' ? 'opacity-30' : 'opacity-100'}`}>
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[9px] ${
                      state === 'done' ? 'border-[#7FCFA8]/50 bg-[#7FCFA8]/10 text-[#7FCFA8]' : state === 'active' ? 'border-accent/60 text-accent' : 'border-paper/20 text-paper/30'
                    }`}
                  >
                    {state === 'done' ? (
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
                        <path d="M2 6.4 4.8 9 10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : state === 'active' ? (
                      <span className="h-1.5 w-1.5 animate-pulsedot rounded-full bg-accent" />
                    ) : (
                      <span className="h-1 w-1 rounded-full bg-current" />
                    )}
                  </span>
                  <span>
                    <span className="block text-[13.5px] font-medium text-paper/90">{a.label}</span>
                    <span className={`block text-[11.5px] text-paper/45 transition-opacity duration-500 ${state === 'pending' ? 'opacity-0' : 'opacity-100'}`}>{a.detail}</span>
                  </span>
                </li>
              );
            })}
          </ul>

          {done && (
            <div className="mt-4 rounded-xl bg-paper/[0.06] px-4 py-3 animate-fadeswap">
              <p className="text-[13px] leading-relaxed text-paper/85">Done — Tuesday 14:00 is booked. I’ve sent the invite and added it to your CRM record. Anything else?</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <button onClick={run} className="rounded-full border border-paper/20 px-4 py-2 font-mono text-[10px] uppercase tracking-wide text-paper/60 transition-colors hover:border-paper/40 hover:text-paper">
            ↻ Replay
          </button>
          <span className="font-mono text-[9.5px] uppercase tracking-tech text-paper/30">0 hallucinated facts · all actions logged</span>
        </div>
      </div>
    </div>
  );
}
