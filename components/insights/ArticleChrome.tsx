'use client';
import { useEffect, useState } from 'react';

/** Reading progress bar — fixed to top, transform-based. */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[150] h-[2.5px] bg-transparent" aria-hidden>
      <div className="h-full origin-left bg-accent transition-transform duration-150 ease-out" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}

/** Table of contents with scroll-spy. */
export function ArticleToc({ sections }: { sections: Array<{ id: string; heading: string }> }) {
  const [active, setActive] = useState(sections[0]?.id || '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: '-25% 0px -65% 0px' }
    );
    sections.forEach((s) => {
      const el = document.getElementById(`sec-${s.id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Table of contents" className="sticky top-32 hidden xl:block">
      <p className="label-tech mb-4">In this article</p>
      <ul className="space-y-1 border-l border-line">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#sec-${s.id}`}
              className={`-ml-px block border-l-2 py-1.5 pl-4 text-[12.5px] leading-snug transition-all duration-200 ${
                active === s.id ? 'border-accent font-medium text-ink' : 'border-transparent text-faint hover:text-soft'
              }`}
            >
              {s.heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Share row with copy-to-clipboard feedback. */
export function ShareRow({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const shareLinks = [
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
    { label: 'Email', href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-mono text-[10px] uppercase tracking-tech text-faint">Share</span>
      {shareLinks.map((s) => (
        <a key={s.label} href={s.href} target={s.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer" className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-[12.5px] font-medium text-soft transition-colors hover:border-ink/30 hover:text-ink">
          {s.label}
        </a>
      ))}
      <button onClick={copy} className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-[12.5px] font-medium text-soft transition-colors hover:border-ink/30 hover:text-ink">
        {copied ? 'Copied ✓' : 'Copy link'}
      </button>
    </div>
  );
}
