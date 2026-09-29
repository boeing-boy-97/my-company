import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import CaseVisual from '@/components/work/CaseVisual';
import CaseNav from '@/components/work/CaseNav';
import { cmsPublished, cmsGet, cmsList, type CaseStudyRecord } from '@/lib/store';
import { NATURE_LABELS } from '@/content/caseStudies';
import { pageSeo, breadcrumbJsonLd } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = await cmsGet<CaseStudyRecord>('caseStudies', slug);
  // 404 before any streaming starts — unknown slugs must not render.
  if (!cs || cs.status !== 'published') notFound();
  return pageSeo({
    title: cs.seoTitle || `${cs.title} — Case Study`,
    description: cs.seoDescription || cs.summary,
    path: `/work/${cs.slug}`,
    type: 'article',
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = await cmsGet<CaseStudyRecord>('caseStudies', slug);
  if (!cs || cs.status !== 'published') notFound();
  const caseStudies = await cmsPublished<CaseStudyRecord>('caseStudies');

  const meta = [
    { label: 'Client', value: cs.client },
    { label: 'Industry', value: cs.industry },
    { label: 'Category', value: cs.category },
    { label: 'Year', value: cs.year },
    { label: 'Services', value: cs.services.join(' · ') },
  ];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Work', path: '/work' }, { name: cs.title, path: `/work/${cs.slug}` }])) }} />

      {/* header */}
      <header className="toplight relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 gridlines gridlines-fade" aria-hidden />
        <div className="relative mx-auto max-w-shell px-6 pb-14 pt-36 md:pt-44">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-tech text-faint">
              <li><Link href="/" className="hover:text-ink">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/work" className="hover:text-ink">Work</Link></li>
              <li aria-hidden>/</li>
              <li className="text-soft">{cs.title}</li>
            </ol>
          </nav>
          <Reveal>
            <span className="flex flex-wrap items-center gap-3">
              <span className="label-tech">Case study</span>
              <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-tech text-accentdeep">
                {NATURE_LABELS[(cs.nature as keyof typeof NATURE_LABELS) || 'representative'] || 'Representative build'}
              </span>
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="display-tight mt-5 max-w-[880px] font-display text-[clamp(2.2rem,5.6vw,4.2rem)] font-semibold leading-[1.04] text-ink">{cs.title}</h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-6 max-w-[640px] text-[17px] leading-[1.65] text-soft">{cs.summary}</p>
          </Reveal>

          {/* meta strip */}
          <Reveal delay={220}>
            <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
              {meta.map((m) => (
                <div key={m.label} className="bg-surface px-5 py-4">
                  <dt className="font-mono text-[9.5px] uppercase tracking-tech text-faint">{m.label}</dt>
                  <dd className="mt-1.5 text-[13.5px] font-medium text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </header>

      {/* visual */}
      <div className="mx-auto max-w-shell px-6">
        <Reveal>
          <CaseVisual variant={cs.visual} className="min-h-[340px] md:min-h-[420px]" />
        </Reveal>
      </div>

      {/* body with sticky nav */}
      <div className="mx-auto grid max-w-shell gap-12 px-6 py-16 md:py-24 lg:grid-cols-[220px_1fr] lg:gap-16">
        <CaseNav sections={cs.sections.map((s) => ({ id: s.id, label: s.label }))} />

        <article className="max-w-[760px]">
          {cs.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-32 border-b border-linedark py-10 first:pt-0 last:border-b-0">
              <Reveal>
                <h2 className="display-tight font-display text-[clamp(1.4rem,2.6vw,1.9rem)] font-semibold tracking-tight text-ink">{section.label}</h2>
              </Reveal>
              {section.paragraphs.map((p, i) => (
                <Reveal key={i} delay={70 + i * 60}>
                  <p className="mt-5 text-[16px] leading-[1.75] text-soft">{p}</p>
                </Reveal>
              ))}
            </section>
          ))}

          {/* metrics */}
          <Reveal>
            <section aria-label="Results" className="mt-4 rounded-2xl bg-coal p-8 text-paper md:p-10">
              <p className="label-tech text-paper/45">Results</p>
              <div className="mt-6 grid gap-8 sm:grid-cols-3">
                {cs.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="display-tight font-display text-[clamp(1.6rem,3vw,2.2rem)] font-semibold text-accent">{m.value}</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-paper/60">{m.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-8 border-t border-paper/10 pt-5 font-mono text-[10px] uppercase tracking-tech text-paper/35">
                Representative figures · shared with client permission · details available on request
              </p>
            </section>
          </Reveal>

          {/* stack */}
          <section className="mt-12" aria-label="Technology stack">
            <p className="label-tech">Technology stack</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {cs.stack.map((t) => (
                <span key={t} className="rounded-full border border-line bg-surface px-4 py-2 font-mono text-[12px] text-soft">
                  {t}
                </span>
              ))}
            </div>
          </section>

          {/* related case studies */}
          {(() => {
            const others = caseStudies.filter((c) => c.slug !== cs.slug);
            const related = [
              ...others.filter((c) => c.industry === cs.industry),
              ...others.filter((c) => c.industry !== cs.industry && c.category === cs.category),
              ...others,
            ].filter((c, i, arr) => arr.findIndex((x) => x.slug === c.slug) === i).slice(0, 3);
            if (related.length === 0) return null;
            return (
              <section className="mt-12" aria-label="Related case studies">
                <p className="label-tech">Related work</p>
                <ul className="mt-4 divide-y divide-linedark rounded-2xl border border-line bg-surface">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/work/${r.slug}`} className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-paper">
                        <span>
                          <span className="block text-[14px] font-medium text-ink">{r.title}</span>
                          <span className="mt-0.5 block text-[12px] text-faint">{r.industry} · {r.category}</span>
                        </span>
                        <span aria-hidden className="text-faint">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })()}

          <div className="mt-14 flex flex-wrap items-center gap-4">
            <Button href="/start-project">Build something similar</Button>
            <Link href="/work" className="link-underline text-[14.5px] font-medium text-soft hover:text-ink">
              ← All work
            </Link>
          </div>
        </article>
      </div>

      {/* next case */}
      <nav aria-label="Next case study" className="border-t border-line bg-surface">
        {(() => {
          const idx = caseStudies.findIndex((c) => c.slug === cs.slug);
          const next = caseStudies[(idx + 1) % caseStudies.length];
          return (
            <Link href={`/work/${next.slug}`} className="group mx-auto flex max-w-shell items-center justify-between gap-6 px-6 py-14">
              <div>
                <p className="label-tech">Next case</p>
                <p className="display-tight mt-2 font-display text-[clamp(1.4rem,3vw,2.2rem)] font-semibold tracking-tight text-ink transition-colors group-hover:text-accentdeep">{next.title}</p>
                <p className="mt-1 text-[13px] text-faint">{next.industry} · {next.year}</p>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line text-soft transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          );
        })()}
      </nav>
    </main>
  );
}
