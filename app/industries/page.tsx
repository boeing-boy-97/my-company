import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import Reveal from '@/components/ui/Reveal';
import CTASection from '@/components/ui/CTASection';
import Button from '@/components/ui/Button';
import { industries } from '@/content/industries';
import { pageSeo } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageSeo({
    title: 'Industries we work with',
    description: 'From healthcare to logistics: the problems we see across industries, and the systems that solve them. No jargon, no claimed specializations we can’t back.',
    path: '/industries',
  }),
};

export default function IndustriesPage() {
  return (
    <main>
      <PageHero
        label="Industries"
        title="Different industries. Familiar problems."
        lede="We don’t claim deep vertical certifications we haven’t earned. What we do have is pattern recognition: the same underlying problems — slow responses, scattered data, manual work — appearing in different uniforms."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Industries' }]}
      />

      <section className="border-t border-line">
        <div className="mx-auto max-w-shell px-6 py-16 md:py-24">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
            {industries.map((ind, i) => (
              <Reveal key={ind.slug} delay={(i % 2) * 80}>
                <article className="group flex h-full flex-col bg-surface p-8 transition-colors duration-300 hover:bg-paper md:p-9">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="display-tight font-display text-[22px] font-semibold tracking-tight text-ink">{ind.name}</h2>
                    <span className="font-mono text-[11px] text-faint">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <p className="mt-1.5 text-[13.5px] text-faint">{ind.tagline}</p>

                  <div className="mt-6 grid flex-1 gap-6 sm:grid-cols-2">
                    <div>
                      <p className="font-mono text-[9.5px] uppercase tracking-tech text-accentdeep">Common problems</p>
                      <ul className="mt-2.5 space-y-2">
                        {ind.problems.map((p) => (
                          <li key={p} className="flex items-start gap-2 text-[13px] leading-relaxed text-soft">
                            <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-accent/70" aria-hidden />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-mono text-[9.5px] uppercase tracking-tech text-ok">Our response</p>
                      <ul className="mt-2.5 space-y-2">
                        {ind.solutions.map((s) => (
                          <li key={s} className="flex items-start gap-2 text-[13px] leading-relaxed text-soft">
                            <svg width="10" height="10" viewBox="0 0 14 14" fill="none" aria-hidden className="mt-[5px] shrink-0 text-ok">
                              <path d="M2 7.4 5.2 10.5 12 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2 border-t border-linedark pt-5">
                    {ind.systems.map((s) => (
                      <span key={s} className="rounded-full border border-line bg-paper px-3 py-1 font-mono text-[10.5px] text-soft">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <Link href={`/industries/${ind.slug}`} className="link-underline text-[13px] font-medium text-accentdeep hover:text-ink">
                      {ind.name} in detail →
                    </Link>
                    <Button href="/start-project" variant="outline" size="md" className="!px-5 !py-2.5 !text-[13px]">
                      Discuss {ind.name}
                    </Button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Don’t see your industry?" text="That’s usually fine — the problem matters more than the sector. Describe what’s slow, manual or broken, and we’ll tell you whether we can help." />
    </main>
  );
}
