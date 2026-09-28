'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { postCategories, type Post } from '@/content/posts';
import { EmptyState } from '@/components/ui/primitives';
import { formatDate, readingTime } from '@/lib/utils';

function postWords(p: Post) {
  return p.sections.reduce((acc, s) => acc + s.paragraphs.join(' ').split(/\s+/).length, 0);
}

export default function InsightsBrowser({ posts }: { posts: Post[] }) {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const catOk = category === 'All' || p.category === category;
      const qOk = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.sections.some((s) => s.heading.toLowerCase().includes(q));
      return catOk && qOk;
    });
  }, [posts, category, query]);

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter articles by category">
          {postCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-250 ${
                category === c ? 'border-ink bg-ink text-paper' : 'border-line bg-surface text-soft hover:border-ink/30 hover:text-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-[280px]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="field !py-2.5 pl-10 text-[14px]"
          />
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
            <path d="m13.5 13.5 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="mt-12">
          <EmptyState title="No articles match" body="Try a different search term or category — or check back soon, we publish regularly." />
        </div>
      ) : (
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <Link key={p.slug} href={`/insights/${p.slug}`} className="group flex h-full flex-col bg-surface p-8 transition-colors duration-300 hover:bg-paper animate-fadeswap" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-accent/25 bg-accenthalo px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-accentdeep">{p.category}</span>
                <span className="font-mono text-[10.5px] text-faint">{readingTime(postWords(p))} min read</span>
              </div>
              <h2 className="display-tight mt-5 font-display text-[20px] font-semibold leading-[1.25] tracking-tight text-ink transition-colors group-hover:text-accentdeep">{p.title}</h2>
              <p className="mt-3 flex-1 text-[14px] leading-relaxed text-soft">{p.excerpt}</p>
              <div className="mt-6 flex items-center justify-between border-t border-linedark pt-4 text-[12px] text-faint">
                <span>{p.author}</span>
                <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
