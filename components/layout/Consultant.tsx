'use client';
import { useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { consultMessage } from '@/lib/actions';
import { trackAction } from '@/lib/actions';
import type { ConsultState } from '@/lib/consult';

interface Msg {
  role: 'user' | 'assistant';
  text: string;
}

const OPENERS = [
  'We get 300 WhatsApp enquiries a day and answer them manually',
  'My team re-keys data between three systems',
  'I have a SaaS idea I want to validate and build',
];

const initialState: ConsultState = { phase: 'listen' };

export default function Consultant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [state, setState] = useState<ConsultState>(initialState);
  const [showHandoff, setShowHandoff] = useState(false);
  const [pending, startTransition] = useTransition();
  const listRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, pending, open]);

  const openPanel = () => {
    setOpen(true);
    if (!startedRef.current) {
      startedRef.current = true;
      trackAction('ai_consultant_started');
      setMessages([
        {
          role: 'assistant',
          text: 'Not sure what you need? Describe the problem in plain language — no technical terms required. I’ll point you in the right direction.',
        },
      ]);
      setSuggestions(OPENERS);
    }
  };

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean || pending) return;
    setMessages((m) => [...m, { role: 'user', text: clean }]);
    setInput('');
    setSuggestions([]);
    startTransition(async () => {
      const res = await consultMessage(clean, state);
      setState(res.state);
      setMessages((m) => [...m, { role: 'assistant', text: res.reply }]);
      setSuggestions(res.suggestions || []);
      setShowHandoff(!!res.showHandoff);
    });
  };

  const briefLink = state.problem
    ? `/start-project?idea=${encodeURIComponent(state.problem)}${state.solution ? `&type=${encodeURIComponent(state.solution)}` : ''}`
    : '/start-project';

  return (
    <>
      {/* Launcher */}
      <div className="fixed bottom-5 right-5 z-[90] md:bottom-7 md:right-7">
        {!open && (
          <button
            onClick={openPanel}
            className="group flex items-center gap-3 rounded-full border border-line bg-surface py-2.5 pl-3.5 pr-5 shadow-[0_16px_44px_-16px_rgba(23,25,30,0.35)] transition-all duration-300 hover:border-ink/25 hover:shadow-[0_20px_50px_-16px_rgba(23,25,30,0.45)]"
            aria-label="Open the project consultant"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="19" cy="18" r="2.2" stroke="#E4572E" strokeWidth="1.5" />
              </svg>
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent animate-pulsedot" aria-hidden />
            </span>
            <span className="text-left">
              <span className="block text-[13px] font-semibold leading-tight text-ink">Not sure what you need?</span>
              <span className="block text-[11.5px] text-soft">Describe your problem →</span>
            </span>
          </button>
        )}
      </div>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="AI project consultant"
          className="fixed bottom-5 right-5 z-[95] flex h-[min(600px,calc(100dvh-40px))] w-[min(420px,calc(100vw-40px))] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_32px_80px_-20px_rgba(23,25,30,0.4)] animate-fadeswap md:bottom-7 md:right-7"
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div>
              <p className="font-display text-[15px] font-semibold text-ink">Project Consultant</p>
              <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-tech text-faint">
                <span className="status-dot status-dot-live" aria-hidden /> Guided scoping
              </p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close consultant" className="flex h-8 w-8 items-center justify-center rounded-full text-soft transition-colors hover:bg-paper hover:text-ink">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
                    m.role === 'user' ? 'rounded-br-md bg-ink text-paper' : 'rounded-bl-md border border-line bg-paper text-ink'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {pending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-line bg-paper px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-pulsedot rounded-full bg-soft" />
                  <span className="h-1.5 w-1.5 animate-pulsedot rounded-full bg-soft" style={{ animationDelay: '0.3s' }} />
                  <span className="h-1.5 w-1.5 animate-pulsedot rounded-full bg-soft" style={{ animationDelay: '0.6s' }} />
                </div>
              </div>
            )}
            {suggestions.length > 0 && !pending && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-full border border-line bg-surface px-3.5 py-2 text-left text-[12.5px] text-soft transition-colors hover:border-ink/30 hover:text-ink">
                    {s}
                  </button>
                ))}
              </div>
            )}
            {showHandoff && (
              <div className="space-y-2 pt-1">
                <Link href={briefLink} onClick={() => trackAction('ai_consultant_completed')} className="block rounded-xl bg-ink px-4 py-3 text-center text-[13px] font-medium text-paper transition-colors hover:bg-coal">
                  Continue to Start a Project →
                </Link>
                <Link href="/contact" className="block rounded-xl border border-line px-4 py-3 text-center text-[13px] font-medium text-ink transition-colors hover:border-ink/30">
                  Talk to a Human →
                </Link>
              </div>
            )}
          </div>

          <form
            className="flex items-center gap-2 border-t border-line px-4 py-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={state.phase === 'capture' ? 'Your email address…' : 'Describe the problem…'}
              aria-label="Message the project consultant"
              className="flex-1 rounded-full border border-line bg-paper px-4 py-2.5 text-[13.5px] outline-none transition-colors placeholder:text-faint focus:border-ink"
            />
            <button type="submit" disabled={pending || !input.trim()} aria-label="Send" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-all hover:bg-coal disabled:opacity-40">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
