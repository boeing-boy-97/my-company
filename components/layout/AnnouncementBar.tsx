'use client';
// Subtle, dismissible announcement strip above the header (session-scoped dismissal).
import { useEffect, useState } from 'react';
import { site } from '@/lib/site';

const KEY = 'kiln-announcement-dismissed';

export default function AnnouncementBar() {
  // SSR renders the bar; dismissed-in-this-session users get it removed on hydration.
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(KEY) === '1') setDismissed(true);
    } catch {
      /* storage unavailable — keep the bar */
    }
  }, []);

  // Push fixed elements (header) down by the bar height while it is visible.
  useEffect(() => {
    document.documentElement.style.setProperty('--announce-h', site.announcement && !dismissed ? '28px' : '0px');
    return () => document.documentElement.style.setProperty('--announce-h', '0px');
  }, [dismissed]);

  if (!site.announcement || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(KEY, '1');
    } catch {
      /* storage unavailable — dismissal just won't persist */
    }
  };

  return (
    <div className="fixed inset-x-0 top-0 z-[120] h-7 border-b border-line bg-coal text-paper">
      <div className="mx-auto flex h-full max-w-shell items-center justify-between gap-4 px-6">
        <p className="truncate font-mono text-[10px] uppercase tracking-tech text-paper/70">{site.announcement}</p>
        <button onClick={dismiss} aria-label="Dismiss announcement" className="shrink-0 rounded-full p-1 text-paper/50 transition-colors hover:text-paper">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M1.5 1.5 8.5 8.5M8.5 1.5 1.5 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
