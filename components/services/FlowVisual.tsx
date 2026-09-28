'use client';
import { useEffect, useRef, useState } from 'react';

const STEPS = [
  { title: 'Trigger', sub: 'An event arrives — enquiry, payment, deadline, message', tone: 'entry' },
  { title: 'Understand', sub: 'The system interprets intent, urgency and context', tone: 'ai' },
  { title: 'Decide', sub: 'Selects the next action from business rules', tone: 'ai' },
  { title: 'Act', sub: 'Executes — creates records, sends replies, schedules work', tone: 'system' },
  { title: 'Update', sub: 'Every connected system stays in sync', tone: 'system' },
  { title: 'Notify', sub: 'Humans get a short summary, not a firehose', tone: 'system' },
  { title: 'Human escalation', sub: 'Complex cases routed to people with full context', tone: 'human' },
] as const;

export default function FlowVisual() {
  const [activeStep, setActiveStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActiveStep(STEPS.length - 1);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          let i = 0;
          const timer = setInterval(() => {
            i += 1;
            setActiveStep(i);
            if (i >= STEPS.length - 1) clearInterval(timer);
          }, 620);
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="rounded-2xl border border-line bg-surface p-6 md:p-8" role="img" aria-label="Animated diagram of an automated lead-handling workflow, from enquiry to analytics">
      <div className="flex items-center justify-between">
        <span className="label-tech">Workflow · Live simulation</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-ok">
          <span className="status-dot status-dot-live" /> Running
        </span>
      </div>
      <ol className="mt-6">
        {STEPS.map((step, i) => {
          const done = i <= activeStep;
          const current = i === activeStep;
          return (
            <li key={step.title} className="relative flex gap-4 pb-1">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                    done ? (step.tone === 'ai' ? 'border-accent/50 bg-accenthalo text-accent' : step.tone === 'human' ? 'border-ink/40 bg-ink/5 text-ink' : 'border-ok/40 bg-ok/5 text-ok') : 'border-line bg-paper text-faint'
                  }`}
                >
                  {done ? (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path d="M2 6.4 4.8 9 10 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </span>
                {i < STEPS.length - 1 && (
                  <span className={`my-1 w-px flex-1 transition-colors duration-500 ${i < activeStep ? 'bg-accent/60' : 'bg-line'}`} style={{ minHeight: 18 }} aria-hidden />
                )}
              </div>
              <div className={`pb-5 pt-1 transition-opacity duration-500 ${done ? 'opacity-100' : 'opacity-40'}`}>
                <p className={`flex flex-wrap items-center gap-2 text-[15px] font-medium ${current ? 'text-ink' : 'text-ink/80'}`}>
                  {step.title}
                  {current && (
                    <span className="font-mono text-[9px] uppercase tracking-tech text-accent animate-tickerpulse">● processing</span>
                  )}
                </p>
                <p className="mt-0.5 text-[12.5px] text-faint">{step.sub}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 border-t border-line pt-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">
        With retry logic, error handling & monitoring on every step
      </p>
    </div>
  );
}
