import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import Reveal from '@/components/ui/Reveal';
import CTASection from '@/components/ui/CTASection';
import { EmptyState, Badge } from '@/components/ui/primitives';
import { cmsPublished, type JobRecord } from '@/lib/store';
import { pageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...pageSeo({
    title: 'Careers — Build systems that run real businesses',
    description: 'Engineering, automation, AI and design roles at a compact technology studio. Real client systems, real ownership, no ticket factory.',
    path: '/careers',
  }),
};

const CULTURE = [
  { t: 'Ship real things', d: 'Client systems running in production — not internal tools nobody uses. Your work has users within weeks.' },
  { t: 'Own the outcome', d: 'Engineers here talk to clients, make architecture calls and watch their systems perform. No ticket-factory roles.' },
  { t: 'Learn across the stack', d: 'A small studio means proximity to every discipline — AI, automation, product, infrastructure.' },
  { t: 'Honest workload', d: 'We scope carefully and say no to bad-fit projects. Sustainable pace is a feature of the business model.' },
];

export default async function CareersPage() {
  const jobs = await cmsPublished<JobRecord>('jobs');
  return (
    <main>
      <PageHero
        label="Careers"
        title="Build systems that run real businesses."
        lede="We’re a compact studio, so every hire changes the shape of the team. We hire deliberately, when the work and the person genuinely fit."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Careers' }]}
      />

      {/* culture */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-shell gap-12 px-6 py-20 md:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <span className="label-tech">Why join us</span>
            <h2 className="display-tight mt-5 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-semibold tracking-tight text-ink">
              The engineering culture, plainly.
            </h2>
            <p className="mt-5 max-w-[460px] text-[15.5px] leading-[1.7] text-soft">
              No inflated titles, no fake urgency. We build the kind of place we wanted to work in: senior people, real problems, visible outcomes, and code we’re not embarrassed to hand over.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {CULTURE.map((c, i) => (
              <Reveal key={c.t} delay={i * 70}>
                <div className="h-full bg-surface p-7">
                  <h3 className="font-display text-[16.5px] font-semibold text-ink">{c.t}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-soft">{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* open roles */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-shell px-6 py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="label-tech">Open positions</span>
              <h2 className="display-tight mt-4 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-semibold tracking-tight text-ink">Roles we’re hiring for.</h2>
            </div>
            <p className="max-w-[380px] text-[13.5px] leading-relaxed text-faint">
              Don’t see an exact match? Internships and general applications are welcome via any listing’s form — tell us what you’d like to do.
            </p>
          </div>

          {jobs.length === 0 ? (
            <div className="mt-10">
              <EmptyState title="No open roles right now" body="We publish roles here the moment they open. Check back soon, or introduce yourself anyway — good people change our plans." />
            </div>
          ) : (
            <div className="mt-10 space-y-3">
              {jobs.map((job, i) => (
                <Reveal key={job.slug} delay={i * 60}>
                  <Link href={`/careers/${job.slug}`} className="group grid gap-4 rounded-2xl border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_20px_44px_-26px_rgba(23,25,30,0.4)] md:grid-cols-[1fr_auto] md:items-center md:gap-8 md:p-8">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="display-tight font-display text-[21px] font-semibold tracking-tight text-ink transition-colors group-hover:text-accentdeep">{job.title}</h3>
                        <Badge tone="accent">Open</Badge>
                      </div>
                      <p className="mt-2 max-w-[600px] text-[14px] leading-relaxed text-soft">{job.summary}</p>
                      <p className="mt-3 font-mono text-[11px] uppercase tracking-tech text-faint">{job.location} · {job.type}</p>
                    </div>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-soft transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden className="-rotate-45 transition-transform duration-300 group-hover:rotate-0">
                        <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection title="Not ready to apply?" text="Questions about the studio, the work or the roles — ask us anything. We answer like humans." primaryLabel="Contact Us" primaryHref="/contact" secondaryLabel="See Our Work" secondaryHref="/work" />
    </main>
  );
}
