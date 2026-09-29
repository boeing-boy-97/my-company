import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import CTASection from '@/components/ui/CTASection';
import { TechLabel } from '@/components/ui/SectionHeader';
import { realTeamMembers } from '@/content/team';
import { techStack } from '@/content/tech';
import { services } from '@/content/services';
import { pageSeo } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageSeo({
    title: 'About — A technology studio built around problems',
    description: 'Who we are, what we believe and how we work. A compact engineering studio solving business problems with software, automation and AI.',
    path: '/studio',
  }),
};

const BELIEFS = [
  { t: 'Technology should solve real problems.', d: 'Not showcase problems, not portfolio problems. The kind that cost a business hours, customers or money every week.' },
  { t: 'The problem comes before the stack.', d: 'We choose tools after we understand the job. Loyalty belongs to outcomes, not frameworks.' },
  { t: 'Working software is the unit of progress.', d: 'Documents describe; systems prove. Every phase of our process produces something that runs.' },
  { t: 'Automation should be supervised.', d: 'Machines move the work; people own the judgment. We design the handoff between them deliberately.' },
  { t: 'Say the honest thing.', d: 'If a project is a bad idea, mispriced, or better solved with a simpler tool — that’s what you’ll hear from us.' },
];

const HOW_WE_WORK = [
  { t: 'Small senior team', d: 'You work with the people who build, not an account layer that forwards messages.' },
  { t: 'Weekly visible progress', d: 'A demo every week. Direction changes cost days, not months.' },
  { t: 'Async across time zones', d: 'Written updates, recorded walkthroughs, and overlap hours scheduled around you.' },
  { t: 'Everything documented', d: 'Decisions, credentials handover, runbooks — the system survives without tribal knowledge.' },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        label="Studio"
        title="A technology studio built around problems, not products."
        lede="We exist because businesses don’t need more software for software’s sake. They need someone who can hear a problem, design the right system, and be accountable for it running."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Studio' }]}
      />

      {/* who we are */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-shell gap-12 px-6 py-20 md:py-28 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <SectionHeader label="Who we are" title="Compact by design." />
          </div>
          <div className="space-y-5">
            <Reveal>
              <p className="text-[16.5px] leading-[1.75] text-ink">
                Kiln is an engineering studio — deliberately small, deliberately senior. Strategy, design, development, AI and infrastructure sit at one table, which means nothing gets lost between departments that don’t exist.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-[16px] leading-[1.75] text-soft">
                We work with startups that need their first product, SMBs drowning in manual work, and enterprise teams modernizing systems that quietly run the business. The engagement sizes differ; the standard doesn’t.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-[16px] leading-[1.75] text-soft">
                We won’t quote you team-size statistics or invented client lists. The proof is in the work we show, the process we run, and the references we’ll gladly arrange.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* beliefs */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-shell px-6 py-20 md:py-28">
          <SectionHeader label="What we believe" title="Five positions we don’t move from." />
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
            {BELIEFS.map((b, i) => (
              <Reveal key={b.t} delay={(i % 3) * 80}>
                <div className={`h-full bg-surface p-8 ${i === 0 ? 'bg-coal text-paper' : ''}`}>
                  <span className={`font-mono text-[11px] ${i === 0 ? 'text-accent' : 'text-accentdeep'}`}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className={`display-tight mt-3 font-display text-[18.5px] font-semibold tracking-tight ${i === 0 ? 'text-paper' : 'text-ink'}`}>{b.t}</h3>
                  <p className={`mt-3 text-[14px] leading-[1.65] ${i === 0 ? 'text-paper/60' : 'text-soft'}`}>{b.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* how we work */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-shell gap-12 px-6 py-20 md:py-28 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <SectionHeader label="How we work" title="The operating habits." />
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {HOW_WE_WORK.map((h, i) => (
              <Reveal key={h.t} delay={i * 70}>
                <div className="h-full bg-surface p-7">
                  <h3 className="font-display text-[16.5px] font-semibold text-ink">{h.t}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-soft">{h.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* capabilities */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-shell px-6 py-20 md:py-28">
          <SectionHeader label="Our capabilities" title="One studio, six practices." lede="Every practice below is something we deliver end to end — strategy included, maintenance included." />
          <div className="mt-10 flex flex-wrap gap-2.5">
            {services.map((s) => (
              <span key={s.slug} className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-5 py-3 text-[14px] font-medium text-ink">
                <span className="font-mono text-[10px] text-accent">{s.num}</span>
                {s.title}
              </span>
            ))}
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {techStack.map((cat) => (
              <div key={cat.name} className="bg-surface p-6">
                <p className="label-tech">{cat.code}</p>
                <p className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-[13px] text-soft">
                  {cat.items.join(' · ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* team */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-shell px-6 py-20 md:py-28">
          <SectionHeader label="Our team" title="The people behind the systems." />
          <div className="mt-10">
            {realTeamMembers.length > 0 ? (
              <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                {realTeamMembers.map((m) => (
                  <div key={m.name} className="bg-surface p-8">
                    <p className="font-display text-[18px] font-semibold text-ink">{m.name}</p>
                    <p className="mt-1 text-[13px] text-faint">{m.role}</p>
                    <p className="mt-3 text-[14px] leading-relaxed text-soft">{m.bio}</p>
                  </div>
                ))}
              </div>
            ) : (
              <Reveal>
                <div className="rounded-2xl border border-dashed border-ink/20 bg-paper px-8 py-12 text-center">
                  <p className="font-display text-[18px] font-semibold text-ink">Team profiles appear here as the studio grows.</p>
                  <p className="mx-auto mt-2 max-w-[480px] text-[14px] leading-relaxed text-soft">
                    Today, Kiln runs as a core engineering group with trusted specialist partners brought in per project — sized to the work, never padded. We’d rather tell you that plainly than fill this section with stock headshots.
                  </p>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* mission */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-shell px-6 py-20 md:py-28">
          <div className="relative overflow-hidden rounded-3xl bg-coal px-8 py-16 text-center md:px-16 md:py-24">
            <div className="pointer-events-none absolute inset-0 gridlines opacity-[0.12]" aria-hidden />
            <div className="relative">
              <Reveal>
                <TechLabel className="justify-center text-paper/45">Our mission</TechLabel>
              </Reveal>
              <Reveal delay={90}>
                <p className="display-tight mx-auto mt-6 max-w-[720px] font-display text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.15] text-paper">
                  Make serious technology accessible to every ambitious business — <span className="text-accent">not just the ones with engineering teams.</span>
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <CTASection title="Meet the studio." text="The best first conversation isn’t a pitch — it’s you describing the problem and us telling you what we’d do about it. If we’re not the right fit, we’ll say so and point you somewhere better." primaryLabel="Book a conversation" primaryHref="/contact" secondaryLabel="Start a project brief" secondaryHref="/start-project" />
    </main>
  );
}
