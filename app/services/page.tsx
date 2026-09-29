import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import ServiceFinder from '@/components/services/ServiceFinder';
import CapabilityMap from '@/components/services/CapabilityMap';
import Reveal from '@/components/ui/Reveal';
import CTASection from '@/components/ui/CTASection';
import { services } from '@/content/services';
import { pageSeo } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageSeo({
    title: 'Services — Software, AI, Automation & Integrations',
    description: 'Four practices, one team: AI & automation, software, digital products and systems & integrations. From idea to production.',
    path: '/services',
  }),
};

// The four practice pillars, grouping the six service pages.
const PILLARS = [
  {
    num: '01',
    name: 'AI & Automation',
    href: '/services/ai-automation',
    statement: 'Remove repetitive work and let your processes run themselves — with humans in charge.',
    slugs: ['ai-automation', 'ai-agents'],
  },
  {
    num: '02',
    name: 'Software',
    href: '/services/custom-software',
    statement: 'The platforms, tools and interfaces your business actually runs on — built for production.',
    slugs: ['custom-software', 'web-mobile'],
  },
  {
    num: '03',
    name: 'Digital Products',
    href: '/services/ai-products',
    statement: 'From validated idea to launched product. Strategy, design and engineering under one roof.',
    slugs: ['ai-products'],
  },
  {
    num: '04',
    name: 'Systems & Integrations',
    href: '/services/system-integration',
    statement: 'Connected systems with a single source of truth — no more manual syncing between tools.',
    slugs: ['system-integration'],
  },
] as const;

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        label="Services"
        title="Four practices. One team. Your problem, solved properly."
        lede="You can come to us with any size of ask — from one automation to a full product team. Each practice below links to exactly what we build, and the problems it solves."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Services' }]}
      />

      {/* Capability map — the interactive practice constellation */}
      <section className="border-t border-line" aria-labelledby="capmap-title">
        <div className="mx-auto max-w-shell px-6 py-16 md:py-20">
          <h2 id="capmap-title" className="sr-only">Kiln capability map</h2>
          <CapabilityMap />
        </div>
      </section>

      {/* which service do I need? */}
      <section className="mx-auto max-w-shell px-6 py-14 md:py-20" aria-labelledby="finder-title">
        <ServiceFinder />
      </section>

      {/* pillar rows */}
      <div className="border-t border-line">
        {PILLARS.map((pillar, idx) => {
          const included = pillar.slugs.map((slug) => services.find((s) => s.slug === slug)!).filter(Boolean);
          const problems = included.flatMap((s) => s.problemsSolved).slice(0, 6);
          return (
            <section key={pillar.num} className={`border-line ${idx > 0 ? 'border-t' : ''} ${idx % 2 === 1 ? 'bg-surface' : ''}`}>
              <div className="mx-auto max-w-shell px-6 py-20 md:py-24">
                <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
                  <div>
                    <Reveal>
                      <span className="font-mono text-[12px] text-accent">{pillar.num} / 04</span>
                      <h2 className="display-tight mt-3 font-display text-[clamp(1.8rem,3.6vw,2.7rem)] font-semibold tracking-tight text-ink">{pillar.name}</h2>
                    </Reveal>
                    <Reveal delay={80}>
                      <p className="mt-5 max-w-[520px] text-[16.5px] leading-[1.7] text-soft">{pillar.statement}</p>
                    </Reveal>
                    <Reveal delay={140}>
                      <div className="mt-9 flex flex-wrap gap-3">
                        {included.map((s) => (
                          <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-paper px-5 py-3 text-[14px] font-medium text-ink transition-all duration-300 hover:border-accent/50 hover:shadow-[0_10px_28px_-14px_rgba(228,87,46,0.45)]"
                          >
                            {s.title}
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden className="text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent">
                              <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    </Reveal>
                  </div>

                  <div>
                    <p className="label-tech">Typical problems this solves</p>
                    <ul className="mt-5 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                      {problems.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-soft">
                          <span className="mt-[7px] h-[4px] w-[4px] shrink-0 rotate-45 bg-accent" aria-hidden />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* engagements strip */}
      <section className="border-t border-line bg-ink text-paper">
        <div className="mx-auto max-w-shell px-6 py-20 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <Reveal>
                <span className="font-mono text-[12px] text-accent">How engagements start</span>
                <h2 className="display-tight mt-3 font-display text-[clamp(1.7rem,3.4vw,2.5rem)] font-semibold tracking-tight">Any size of ask, taken seriously.</h2>
              </Reveal>
              <Reveal delay={90}>
                <p className="mt-5 max-w-[460px] text-[15px] leading-[1.7] text-paper/70">
                  One automation, a single module, a rescue of a stalled project, or a complete product team — every engagement starts the same way: understanding the problem properly.
                </p>
              </Reveal>
            </div>
            <Reveal delay={120}>
              <ul className="grid gap-x-10 gap-y-3.5 sm:grid-cols-2">
                {['A complete product, end to end', 'A specific feature or module', 'Automation of a business process', 'AI inside your existing tools', 'A redesign of what you have', 'Legacy modernization', 'System integrations', 'An ongoing engineering partnership'].map((e) => (
                  <li key={e} className="flex items-start gap-3 text-[14.5px] leading-relaxed text-paper/85">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden className="mt-[6px] shrink-0 text-accent">
                      <path d="M2 7.4 5.2 10.5 12 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {e}
                  </li>
                ))}
              </ul>
              <div className="mt-9">
                <Link href="/start-project" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[14px] font-medium text-white transition-all duration-300 hover:brightness-105 active:scale-[0.98]">
                  Start a Project
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
