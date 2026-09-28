'use client';
// Global search overlay — searches Services, Work, Insights and Industries.
// Open with "/" anywhere, the header search button, or Esc to close. Arrow keys navigate.
import { useEffect, useMemo, useRef, useState } from 'react';

export interface SearchEntry {
  title: string;
  category: 'Services' | 'Work' | 'Insights' | 'Industries' | 'Pages';
  href: string;
  text: string;
}

const MAX_RESULTS = 12;

export default function GlobalSearch({ index }: { index: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // open listeners: "/" key + header button event
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const el = document.activeElement as HTMLElement | null;
        const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
        if (!typing) {
          e.preventDefault();
          setOpen(true);
        }
      }
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('kiln:open-search', onOpenEvent);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('kiln:open-search', onOpenEvent);
    };
  }, []);

  // focus + scroll lock while open
  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(t);
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const tokens = q.split(/\s+/);
    return index
      .map((entry) => {
        const hay = `${entry.title} ${entry.text} ${entry.category}`.toLowerCase();
        const score = tokens.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0);
        return { entry, score, titleHit: entry.title.toLowerCase().includes(tokens[0]) };
      })
      .filter((r) => r.score === tokens.length || (r.score > 0 && r.titleHit))
      .sort((a, b) => b.score - a.score || Number(b.titleHit) - Number(a.titleHit))
      .slice(0, MAX_RESULTS)
      .map((r) => r.entry);
  }, [query, index]);

  useEffect(() => {
    setActive(0);
  }, [results.length, query]);

  // keep the active row in view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const go = (href: string) => {
    setOpen(false);
    window.location.assign(href);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      go(results[active].href);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search the site"
      className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[12vh]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="absolute inset-0 bg-coal/45 backdrop-blur-[2px]" aria-hidden onMouseDown={() => setOpen(false)} />
      <div className="relative w-full max-w-[620px] overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_32px_80px_-24px_rgba(23,25,30,0.45)]">
        <div className="flex items-center gap-3 border-b border-line px-5">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0 text-faint">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
            <path d="m11 11 3.2 3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Search services, work, insights, industries…"
            aria-label="Search"
            className="w-full bg-transparent py-4 text-[15px] text-ink placeholder:text-faint focus:outline-none"
          />
          <button onClick={() => setOpen(false)} aria-label="Close search" className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase text-faint hover:text-ink">
            Esc
          </button>
        </div>

        <div className="max-h-[52vh] overflow-y-auto">
          {query.trim() === '' ? (
            <p className="px-5 py-8 text-center text-[13px] text-faint">
              Type to search — use <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10.5px]">↑</kbd>{' '}
              <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10.5px]">↓</kbd> to move and{' '}
              <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10.5px]">Enter</kbd> to open.
            </p>
          ) : results.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13px] text-faint">
              Nothing matches “{query.trim()}”. Try a broader term, or <a href="/contact" className="text-ink underline-offset-2 hover:underline">ask us directly</a>.
            </p>
          ) : (
            <ul ref={listRef} role="listbox" aria-label="Search results" className="divide-y divide-linedark">
              {results.map((r, i) => (
                <li key={r.href} data-idx={i} role="option" aria-selected={i === active}>
                  <button
                    onClick={() => go(r.href)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-baseline justify-between gap-4 px-5 py-3.5 text-left transition-colors ${i === active ? 'bg-paper' : ''}`}
                  >
                    <span className={`text-[14px] ${i === active ? 'font-medium text-ink' : 'text-soft'}`}>{r.title}</span>
                    <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-tech text-faint">{r.category}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="border-t border-line px-5 py-2.5 font-mono text-[9.5px] uppercase tracking-tech text-faint">
          {results.length > 0 ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Kiln site search'}
        </p>
      </div>
    </div>
  );
}
