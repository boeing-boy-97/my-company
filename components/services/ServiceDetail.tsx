import PageHero from '@/components/ui/PageHero';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import CTASection from '@/components/ui/CTASection';
import Button from '@/components/ui/Button';
import { ArrowLink } from '@/components/ui/primitives';
import type { Service } from '@/content/services';

interface Props {
  service: Service;
  heroLede: string;
  intro: string[];
  signature?: React.ReactNode;
  signatureCaption?: string;
  ctaTitle?: string;
  ctaLabel?: string;
  additional?: React.ReactNode;
}

export default function ServiceDetail({ service, heroLede, intro, signature, signatureCaption, ctaTitle, ctaLabel, additional }: Props) {
  return (
    <main>
      <PageHero
        label={`Service ${service.num} — ${service.title}`}
        title={heroLede.split('|')[0]}
        lede={heroLede.split('|')[1]?.trim()}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: service.title }]}
      >
        <div className="mt-9 flex flex-wrap gap-4">
          <Button href="/start-project">Start a Project</Button>
          <Button href="/work" variant="outline">
            See Related Work
          </Button>
        </div>
      </PageHero>

      {/* intro + signature visual */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-shell gap-12 px-6 py-20 md:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            {intro.map((p, i) => (
              <Reveal key={i} delay={i * 90}>
                <p className={`text-[16.5px] leading-[1.75] ${i === 0 ? 'font-medium text-ink' : 'mt-5 text-soft'}`}>{p}</p>
              </Reveal>
            ))}
            <Reveal delay={intro.length * 90}>
              <div className="mt-8">
                <ArrowLink href="/start-project">Describe your situation</ArrowLink>
              </div>
            </Reveal>
          </div>
          {signature && (
            <Reveal delay={120}>
              {signature}
              {signatureCaption && <p className="mt-3 text-center font-mono text-[10.5px] uppercase tracking-tech text-faint">{signatureCaption}</p>}
            </Reveal>
          )}
        </div>
      </section>

      {/* problems solved / what we build */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-shell px-6 py-20 md:py-28">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
            <div className="bg-surface p-8 md:p-10">
              <Reveal>
                <span className="label-tech">The problems it solves</span>
              </Reveal>
              <ul className="mt-6 space-y-4">
                {service.problemsSolved.map((p, i) => (
                  <Reveal key={p} delay={i * 60} as="li">
                    <span className="flex items-start gap-3.5 text-[15px] leading-relaxed text-ink">
                      <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rotate-45 bg-accent" aria-hidden />
                      {p}
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>
            <div className="bg-coal p-8 text-paper md:p-10">
              <Reveal>
                <span className="label-tech text-paper/45">What we build</span>
              </Reveal>
              <ul className="mt-6 space-y-4">
                {service.whatWeBuild.map((w, i) => (
                  <Reveal key={w} delay={i * 60} as="li">
                    <span className="flex items-start gap-3.5 text-[15px] leading-relaxed text-paper/85">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="mt-1 shrink-0 text-[#7FCFA8]">
                        <path d="M2 7.4 5.2 10.5 12 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {w}
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* how the engagement runs */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-shell px-6 py-20 md:py-28">
          <SectionHeader label="How this engagement runs" title="Four stages. Visible progress at each one." />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
            {service.process.map((step, i) => (
              <Reveal key={step} delay={i * 80} as="li" className="h-full">
                <div className="h-full bg-surface p-7">
                  <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <p className="mt-4 text-[14.5px] font-medium leading-relaxed text-ink">{step}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* deliverables + technologies */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-shell gap-12 px-6 py-20 md:py-28 lg:grid-cols-2">
          <div>
            <SectionHeader label="Typical deliverables" title="What you receive." />
            <ul className="mt-8 space-y-3.5">
              {service.deliverables.map((d, i) => (
                <Reveal key={d} delay={i * 60} as="li">
                  <span className="flex items-center gap-3.5 rounded-xl border border-line bg-surface px-5 py-4 text-[14.5px] text-ink">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-accent">
                      <path d="M9 3v4.5M15 3v4.5M5 9.5h14M6.5 5.5h11A1.5 1.5 0 0 1 19 7v12a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V7a1.5 1.5 0 0 1 1.5-1.5z" stroke="currentColor" strokeWidth="1.5" />
                      <path d="m9.5 14.5 2 2 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {d}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeader label="Technologies" title="Tools chosen for the job." />
            <div className="mt-8 flex flex-wrap gap-2.5">
              {service.technologies.map((t, i) => (
                <Reveal key={t} delay={i * 40}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 font-mono text-[12.5px] text-soft transition-colors duration-200 hover:border-accent/40 hover:text-ink">
                    <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
                    {t}
                  </span>
                </Reveal>
              ))}
            </div>
            <Reveal delay={200}>
              <p className="mt-8 max-w-[440px] text-[14px] leading-relaxed text-faint">
                No stack loyalty, no forced tooling. The technologies are selected during discovery based on your systems, scale and team.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {additional}

      <CTASection title={ctaTitle || 'Bring us the problem.'} text={`${service.short} Tell us where it hurts — we’ll map the shortest path to a working system.`} primaryLabel={ctaLabel || 'Start a Project'} />
    </main>
  );
}
