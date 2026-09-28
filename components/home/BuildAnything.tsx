'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { trackAction } from '@/lib/actions';

const EXAMPLES = [
  'An AI receptionist for my clinic…',
  'Automate our WhatsApp enquiries…',
  'Build a CRM for our sales team…',
  'Create a mobile app for our field staff…',
  'I have a SaaS idea I want to validate…',
];

export default function BuildAnything() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [placeholder, setPlaceholder] = useState(EXAMPLES[0]);
  const [focused, setFocused] = useState(false);
  const idx = useRef(0);

  // Gentle placeholder rotation — full example prompts, no typewriter.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (focused) return;
    const timer = setInterval(() => {
      idx.current = (idx.current + 1) % EXAMPLES.length;
      setPlaceholder(EXAMPLES[idx.current]);
    }, 3600);
    return () => clearInterval(timer);
  }, [focused]);

  const go = () => {
    trackAction('build_anything_submitted');
    router.push(value.trim() ? `/start-project?idea=${encodeURIComponent(value.trim())}` : '/start-project');
  };

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="rounded-2xl border border-line bg-surface p-2.5 shadow-[0_24px_70px_-35px_rgba(23,25,30,0.4)] transition-shadow focus-within:shadow-[0_24px_70px_-28px_rgba(23,25,30,0.5)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-3 px-3.5">
            <span className="font-mono text-[13px] text-accent" aria-hidden>
              ›
            </span>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => e.key === 'Enter' && go()}
              placeholder={placeholder}
              aria-label="What are you trying to build?"
              className="w-full bg-transparent py-3.5 text-[15.5px] text-ink outline-none placeholder:text-faint"
            />
          </div>
          <button onClick={go} className="group m-1 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-[14px] font-medium text-paper transition-all duration-300 hover:bg-coal active:scale-[0.98]">
            Turn This Into a Project
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {EXAMPLES.slice(0, 3).map((ex) => (
          <button key={ex} onClick={() => setValue(ex.replace('…', ''))} className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-[12.5px] text-soft transition-all duration-200 hover:border-ink/30 hover:text-ink">
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
