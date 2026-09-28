import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import { Badge } from '@/components/ui/primitives';
import ApplicationForm from '@/components/careers/ApplicationForm';
import { cmsGet, type JobRecord } from '@/lib/store';
import { pageSeo, breadcrumbJsonLd } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = await cmsGet<JobRecord>('jobs', slug);
  if (!job || job.status !== 'published') notFound();
  return pageSeo({
    title: `${job.title} — Careers`,
    description: job.summary,
    path: `/careers/${job.slug}`,
  });
}

function List({ title, items, tone }: { title: string; items: string[]; tone: 'accent' | 'ok' | 'neutral' }) {
  return (
    <div>
      <p className="label-tech">{title}</p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#3c414b]">
            {tone === 'ok' ? (
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden className="mt-[6px] shrink-0 text-ok">
                <path d="M2 7.4 5.2 10.5 12 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span className={`mt-[9px] h-[4px] w-[4px] shrink-0 ${tone === 'accent' ? 'rotate-45 bg-accent' : 'rounded-full bg-soft'}`} aria-hidden />
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await cmsGet<JobRecord>('jobs', slug);
  if (!job || job.status !== 'published') notFound();

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Careers', path: '/careers' }, { name: job.title, path: `/careers/${job.slug}` }])) }} />

      <header className="toplight relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 gridlines gridlines-fade" aria-hidden />
        <div className="relative mx-auto max-w-shell px-6 pb-14 pt-36 md:pt-44">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-tech text-faint">
              <li><Link href="/" className="hover:text-ink">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/careers" className="hover:text-ink">Careers</Link></li>
              <li aria-hidden>/</li>
              <li className="text-soft">{job.title}</li>
            </ol>
          </nav>
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="accent">Open role</Badge>
              <span className="font-mono text-[11px] uppercase tracking-tech text-faint">{job.location} · {job.type}</span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="display-tight mt-5 font-display text-[clamp(2.2rem,5.4vw,4rem)] font-semibold leading-[1.04] text-ink">{job.title}</h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-6 max-w-[620px] text-[17px] leading-[1.65] text-soft">{job.summary}</p>
          </Reveal>
          <Reveal delay={220}>
            <a href="#apply" className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-paper transition-all duration-300 hover:bg-coal active:scale-[0.985]">
              Apply for this role
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M12 4v10M12 14l4-4M12 14 8 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 12 9)" />
              </svg>
            </a>
          </Reveal>
        </div>
      </header>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-shell gap-12 px-6 py-16 md:py-24 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
          <div className="space-y-12">
            <List title="What you’ll do" items={job.responsibilities} tone="accent" />
            <List title="What we’re looking for" items={job.requirements} tone="neutral" />
            <List title="What you get" items={job.perks} tone="ok" />
          </div>
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <ApplicationForm jobId={job.slug} jobTitle={job.title} />
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
