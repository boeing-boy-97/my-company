import Link from 'next/link';
import Button from '@/components/ui/Button';
import Magnetic from '@/components/ui/Magnetic';
import Reveal from '@/components/ui/Reveal';
import SectionHeader, { TechLabel } from '@/components/ui/SectionHeader';
import CTASection from '@/components/ui/CTASection';
import { ArrowLink } from '@/components/ui/primitives';
import KilnSystemCanvas from '@/components/home/KilnSystemCanvas';
import Parallax from '@/components/motion/Parallax';
import TransformThesis from '@/components/home/TransformThesis';
import CapabilityMap from '@/components/services/CapabilityMap';
import ProblemSolution from '@/components/home/ProblemSolution';
import BuildAnything from '@/components/home/BuildAnything';
import WorldClock from '@/components/home/WorldClock';
import HomeProcess from '@/components/home/HomeProcess';
import CaseVisual from '@/components/work/CaseVisual';
import { services } from '@/content/services';
import { techStack } from '@/content/tech';
import { cmsPublished, type CaseStudyRecord, type TestimonialRecord } from '@/lib/store';
import HeroChoreography from '@/components/home/HeroChoreography';

import { pageSeo } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata = pageSeo({
  title: `${site.name} — Technology for ambitious businesses`,
  description:
    'We design, build and automate digital systems that help businesses move faster — from AI agents and workflow automation to custom software and complete digital products.',
  path: '/',
});

export default async function HomePage() {
  const [allCases, allTestimonials] = await Promise.all([
    cmsPublished<CaseStudyRecord>('caseStudies'),
    cmsPublished<TestimonialRecord>('testimonials'),
  ]);
  const featured = allCases.filter((c) => c.featured).slice(0, 3);
  const publishedTestimonials = allTestimonials.filter((t) => t.quote.trim().length > 0);

  return (
    <main id="content">
      {/* ============================== HERO ============================== */}
      <section className="toplight relative overflow-hidden" aria-labelledby="hero-title">
        <div className="pointer-events-none absolute inset-0 gridlines gridlines-fade" aria-hidden />
        <div className="relative mx-auto grid max-w-shell items-center gap-14 px-6 pb-20 pt-36 md:pt-44 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28">
          <HeroChoreography>
            <Reveal>
              <TechLabel>Software · AI · Automation Studio</TechLabel>
            </Reveal>
            <Reveal delay={80}>
              <h1 id="hero-title" className="display-tight mt-7 font-display text-[clamp(2.6rem,6.2vw,5rem)] font-semibold leading-[1.02] text-ink">
                We build the systems behind ambitious <span className="italic font-display text-accent">businesses.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-7 max-w-[540px] text-[17.5px] leading-[1.65] text-soft">
                We design, build and automate digital systems that help businesses operate better, move faster and create new products.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Magnetic>
                  <Button href="/start-project" size="lg">
                    Start a Project
                  </Button>
                </Magnetic>
                <Button href="/work" variant="outline" size="lg">
                  Explore Our Work
                </Button>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.22em] text-faint">Software · AI · Automation</p>
            </Reveal>
          </HeroChoreography>
          <Reveal delay={200} variant="wipe" className="mt-4 lg:mt-0">
            <Parallax shift={10}>
              <KilnSystemCanvas />
            </Parallax>
          </Reveal>
        </div>
      </section>

      {/* ============================== TECH ECOSYSTEM ============================== */}
      <section className="border-t border-line" aria-labelledby="tech-title">
        <div className="mx-auto max-w-shell px-6 py-24 md:py-32">
          <SectionHeader
            index="01"
            label="Capability"
            title={<span id="tech-title">One ecosystem. <span className="text-soft">Chosen per problem.</span></span>}
            lede="We are not loyal to a stack — we’re loyal to the outcome. These are the systems we reach for, matched to what the problem actually needs."
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {techStack.map((cat, i) => (
              <Reveal key={cat.name} delay={i * 90} className="h-full">
                <div className="group h-full bg-surface p-8 transition-colors duration-300 hover:bg-paper">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-[18px] font-semibold text-ink">{cat.name}</h3>
                    <span className="font-mono text-[9.5px] uppercase tracking-tech text-faint transition-colors group-hover:text-accent">{cat.code}</span>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-faint">{cat.description}</p>
                  <ul className="mt-6 space-y-2 border-t border-linedark pt-5">
                    {cat.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-[13.5px] text-soft transition-colors duration-200 hover:text-ink">
                        <span className="h-[3px] w-[3px] rounded-full bg-accent/70" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

{/* ============================== THESIS — TRANSFORMATION ============================== */}
      <section className="border-t border-line bg-surface" aria-labelledby="thesis-title">
        <div className="mx-auto max-w-shell px-6 py-24 md:py-32">
          <SectionHeader
            index="02"
            label="The thesis"
            title={<span id="thesis-title">Most businesses don’t need more software. <span className="text-soft">They need a better system.</span></span>}
            lede="Drag the control. On the left is how work runs in most companies today; on the right is what a designed system does with the same people and the same data."
          />
          <div className="mt-12">
            <TransformThesis />
          </div>
        </div>
      </section>

      {/* ============================== PROBLEM → SOLUTION ============================== */}
      <section className="border-t border-line bg-paper" aria-labelledby="problem-title">
        <div className="mx-auto max-w-shell px-6 py-24 md:py-32">
          <SectionHeader
            index="03"
            label="Problem → System → Outcome"
            title={<span id="problem-title">Start with the problem. <span className="text-soft">We’ll match the technology.</span></span>}
            lede="Most businesses don’t need “AI” or “an app” — they need a specific problem solved. Pick the one that sounds familiar."
          />
          <div className="mt-14">
            <ProblemSolution />
          </div>
        </div>
      </section>

      {/* ============================== SERVICES ============================== */}
      <section className="border-t border-line" aria-labelledby="services-title">
        <div className="mx-auto max-w-shell px-6 py-24 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeader index="04" label="What we do" title={<span id="services-title">One capability map. Pick where you are.</span>} />
            <Reveal delay={200}>
              <ArrowLink href="/services">All services</ArrowLink>
            </Reveal>
          </div>

          <div className="mt-12">
            <CapabilityMap />
          </div>
        </div>
      </section>

      {/* ============================== BUILD ANYTHING ============================== */}
      <section className="border-t border-line bg-surface" aria-labelledby="build-title">
        <div className="mx-auto max-w-shell px-6 py-24 md:py-32">
          <div className="mx-auto max-w-[760px] text-center">
            <Reveal>
              <TechLabel className="justify-center">Describe it in plain language</TechLabel>
            </Reveal>
            <Reveal delay={80}>
              <h2 id="build-title" className="display-tight mt-5 font-display text-[clamp(1.9rem,4.2vw,3.4rem)] font-semibold leading-[1.06] text-ink">
                Tell us what you want to build.
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="mx-auto mt-5 max-w-[520px] text-[17px] leading-[1.65] text-soft">
                Already have a specification? Great. Only have an idea? That’s fine too.
              </p>
            </Reveal>
          </div>
          <div className="mt-12">
            <Reveal delay={220}>
              <BuildAnything />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================== CASE STUDIES ============================== */}
      <section className="border-t border-line bg-coal text-paper" aria-labelledby="work-title">
        <div className="mx-auto max-w-shell px-6 py-24 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-[720px]">
              <Reveal>
                <span className="label-tech inline-flex items-center gap-2.5 text-paper/45">
                  <span className="h-[5px] w-[5px] bg-accent" aria-hidden />
                  Selected work <span className="text-paper/25">( 05 )</span>
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h2 id="work-title" className="display-tight mt-5 font-display text-[clamp(1.9rem,4.2vw,3.4rem)] font-semibold leading-[1.06]">
                  Real problems. Working systems.
                </h2>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-4 max-w-[540px] text-[16px] leading-[1.65] text-paper/55">
                  Client names are anonymized where agreements require it. The systems are real — every project below is running in production.
                </p>
              </Reveal>
            </div>
            <Reveal delay={200}>
              <Button href="/work" variant="inverse">
                View All Work
              </Button>
            </Reveal>
          </div>

          <div className="mt-16 space-y-20">
            {featured.map((cs, i) => (
              <Reveal key={cs.slug} variant="wipe">
                <Link data-cursor="view" href={`/work/${cs.slug}`} className={`group grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                  <CaseVisual variant={cs.visual} className="transition-transform duration-500 ease-out group-hover:scale-[1.015]" />
                  <div>
                    <div className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-tech text-paper/40">
                      <span className="text-accent">{cs.category}</span>
                      <span aria-hidden>·</span>
                      <span>{cs.industry}</span>
                      <span aria-hidden>·</span>
                      <span>{cs.year}</span>
                    </div>
                    <h3 className="display-tight mt-4 font-display text-[clamp(1.6rem,3vw,2.5rem)] font-semibold leading-[1.08] text-paper">{cs.title}</h3>
                    <p className="mt-4 max-w-[480px] text-[15.5px] leading-[1.7] text-paper/60">{cs.summary}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {cs.stack.slice(0, 4).map((t) => (
                        <span key={t} className="rounded-full border border-paper/15 px-3 py-1 font-mono text-[10.5px] text-paper/55">
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="mt-8 inline-flex items-center gap-2 text-[14.5px] font-medium text-paper">
                      <span className="link-underline">Read the case study</span>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">
                        <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== PROCESS ============================== */}
      <section className="border-t border-line bg-surface" aria-labelledby="process-title">
        <div className="mx-auto grid max-w-shell gap-14 px-6 py-24 md:py-32 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeader
              index="06"
              label="Process"
              title={<span id="process-title">From problem to production.</span>}
              lede="A single accountable process, whether the deliverable is an automation, an agent or a full product. No phase is skipped, and every phase produces something you can see."
            />
          </div>
          <HomeProcess />
        </div>
      </section>

      {/* ============================== WHY US ============================== */}
      <section className="border-t border-line" aria-labelledby="why-title">
        <div className="mx-auto max-w-shell px-6 py-24 md:py-32">
          <SectionHeader index="07" label="Why clients work with us" title={<span id="why-title">Positions, not promises.</span>} />
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
            {[
              { t: 'Business-first engineering', d: 'We solve the underlying problem, not just the requested feature. Sometimes the right build is smaller than the one you asked for — we’ll tell you.' },
              { t: 'One team from idea to deployment', d: 'Strategy, design, development, AI and infrastructure under one roof. Nothing is handed off into the void between agencies.' },
              { t: 'Built for production', d: 'Security, reliability, scalability and maintainability are considered from day one — not bolted on after launch.' },
              { t: 'Transparent communication', d: 'Clear scope, milestones and deliverables. You always know what is being built, why, and what it costs.' },
              { t: 'Flexible engagement', d: 'One project, a long-term engineering partnership, or ongoing automation support. The relationship fits the work — not the other way around.' },
              { t: 'Measured in outcomes', d: 'Hours returned, response times cut, revenue unlocked. If we can’t define how success will be measured, we define it before building.' },
            ].map((item, i) => (
              <Reveal key={item.t} delay={(i % 2) * 90}>
                <div className="h-full bg-surface p-8 transition-colors duration-300 hover:bg-paper md:p-10">
                  <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="display-tight mt-3 font-display text-[20px] font-semibold tracking-tight text-ink">{item.t}</h3>
                  <p className="mt-3 text-[14.5px] leading-[1.7] text-soft">{item.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== GLOBAL ============================== */}
      <section className="border-t border-line bg-surface" aria-labelledby="global-title">
        <div className="mx-auto max-w-shell px-6 py-24 md:py-32">
          <div className="relative overflow-hidden rounded-3xl border border-line bg-paper px-8 py-14 md:px-14 md:py-20">
            {/* meridian arcs */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.5]" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid slice" aria-hidden>
              {[80, 160, 240, 320].map((y) => (
                <path key={y} d={`M-50 ${y} Q 500 ${y - 60} 1050 ${y}`} stroke="rgba(23,25,30,0.07)" strokeWidth="1" fill="none" />
              ))}
              {[150, 350, 550, 750, 950].map((x) => (
                <path key={x} d={`M${x} -50 Q ${x + 40} 200 ${x} 450`} stroke="rgba(23,25,30,0.05)" strokeWidth="1" fill="none" />
              ))}
              <circle cx="560" cy="170" r="3.5" fill="#E4572E" />
              <circle cx="560" cy="170" r="9" stroke="#E4572E" strokeOpacity="0.35" fill="none" />
            </svg>
            <div className="relative">
              <SectionHeader
                index="08"
                label="Global delivery"
                title={<span id="global-title">Built in India.<br className="md:hidden" /> Built for the world.</span>}
                lede="Working with ambitious teams across borders and time zones. Async by default, available in your working hours, precise about handovers."
              />
              <div className="mt-12">
                <Reveal delay={150}>
                  <WorldClock />
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== TESTIMONIALS ============================== */}
      <section className="border-t border-line" aria-labelledby="voices-title">
        <div className="mx-auto max-w-shell px-6 py-24 md:py-28">
          <SectionHeader index="09" label="Client voices" title={<span id="voices-title">In their words.</span>} />
          <div className="mt-12">
            {publishedTestimonials.length > 0 ? (
              <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
                {publishedTestimonials.map((t) => (
                  <figure key={t.person} className="bg-surface p-8">
                    <blockquote className="text-[15px] leading-[1.7] text-ink">“{t.quote}”</blockquote>
                    <figcaption className="mt-6">
                      <p className="text-[14px] font-semibold text-ink">{t.person}</p>
                      <p className="text-[12.5px] text-faint">{t.role}, {t.company}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <Reveal>
                <figure className="rounded-2xl border border-dashed border-ink/20 bg-surface/70 px-8 py-14 text-center md:px-16">
                  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden className="mx-auto text-faint">
                    <path d="M6 20c0-6 3.5-11 9-13l1 2.2c-3.4 1.6-5.3 4-5.7 6.8H15v9H6v-5zm14 0c0-6 3.5-11 9-13l1 2.2c-3.4 1.6-5.3 4-5.7 6.8H29v9h-9v-5z" fill="currentColor" fillOpacity="0.5" />
                  </svg>
                  <blockquote className="mx-auto mt-6 max-w-[560px] font-display text-[clamp(1.15rem,2.2vw,1.5rem)] font-medium leading-[1.5] text-ink">
                    We publish client feedback here once real engagements are complete. Until then, we’d rather show you the work than invent the praise.
                  </blockquote>
                  <figcaption className="mt-6 text-[13.5px] text-soft">
                    References available on request —{' '}
                    <Link href="/contact" className="link-underline font-medium text-ink">
                      ask us for an introduction
                    </Link>
                    .
                  </figcaption>
                </figure>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
