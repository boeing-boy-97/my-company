import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import Reveal from '@/components/ui/Reveal';
import CTASection from '@/components/ui/CTASection';
import InsightsBrowser from '@/components/insights/InsightsBrowser';
import { cmsPublished, type PostRecord } from '@/lib/store';
import { pageSeo } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...pageSeo({
    title: 'Insights — Notes on AI, automation and building software',
    description: 'Practical writing on AI agents, workflow automation, product development and business technology — from a studio that ships these systems.',
    path: '/insights',
  }),
};

export default async function InsightsPage() {
  const posts = await cmsPublished<PostRecord>('posts');
  const featured = posts.find((p) => p.featured) || posts[0];
  if (!featured) {
    return (
      <main>
        <PageHero label="Insights" title="Notes from the build floor." crumbs={[{ label: 'Home', href: '/' }, { label: 'Insights' }]} />
        <section className="mx-auto max-w-shell px-6 py-24 text-center text-soft">Nothing published here yet — check back soon.</section>
        <CTASection title="Reading is free. Building is the point." text="If any of this sounds like your situation, the fastest next step is a short conversation." />
      </main>
    );
  }
  const rest = posts.filter((p) => p.slug !== featured.slug);

  return (
    <main>
      <PageHero
        label="Insights"
        title="Notes from the build floor."
        lede="What we learn shipping AI, automation and software for real businesses — written for operators, not just engineers."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Insights' }]}
      />

      {/* featured */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-shell px-6 py-16 md:py-20">
          <Reveal>
            <Link href={`/insights/${featured.slug}`} className="group block">
              <div className="grid gap-8 rounded-3xl border border-line bg-coal p-8 text-paper transition-all duration-500 group-hover:shadow-[0_40px_80px_-40px_rgba(13,14,17,0.6)] md:p-14 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-16">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-accent px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-white">Featured</span>
                    <span className="font-mono text-[10.5px] uppercase tracking-tech text-paper/45">{featured.category}</span>
                  </div>
                  <h2 className="display-tight mt-5 max-w-[680px] font-display text-[clamp(1.6rem,3.6vw,2.8rem)] font-semibold leading-[1.12] transition-colors group-hover:text-paper/90">
                    {featured.title}
                  </h2>
                  <p className="mt-4 max-w-[560px] text-[15px] leading-relaxed text-paper/55">{featured.excerpt}</p>
                </div>
                <div className="flex items-center justify-between gap-6 lg:flex-col lg:items-end lg:justify-end">
                  <p className="font-mono text-[11px] text-paper/40">
                    {featured.author} · {formatDate(featured.publishedAt)}
                  </p>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-paper/20 transition-all duration-300 group-hover:border-accent group-hover:bg-accent">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="-rotate-45 transition-transform duration-300 group-hover:rotate-0">
                      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* all articles */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-shell px-6 py-16 md:py-24">
          <InsightsBrowser posts={rest} />
        </div>
      </section>

      <CTASection title="Reading is free. Building is the point." text="If any of this sounds like your situation, the fastest next step is a short conversation." />
    </main>
  );
}
