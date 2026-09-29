import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import Reveal from '@/components/ui/Reveal';
import CTASection from '@/components/ui/CTASection';
import ProcessNav from '@/components/process/ProcessNav';
import { PROCESS_STAGES as STAGES } from '@/content/process-stages';
import { pageSeo } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageSeo({
    title: 'Process — From problem to production',
    description: 'Eight stages from discovery to support, each with real deliverables and a decision gate. See exactly how a project moves from a described problem to a running system.',
    path: '/process',
  }),
};

export default function ProcessPage() {
  return (
    <main>
      <PageHero
        label="Process"
        title="From problem to production, in eight honest stages."
        lede="Every engagement — automation, agent, or full product — moves through this sequence. Each stage produces something you can see, question and approve before the next one starts."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Process' }]}
      />

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-shell gap-16 px-6 py-20 md:grid-cols-[190px_minmax(0,1fr)] md:gap-14 md:py-28 lg:gap-20">
          <ProcessNav stages={STAGES.map(({ num, name }) => ({ num, name }))} />
          <ol className="space-y-16 md:space-y-24">
            {STAGES.map((stage, i) => (
              <Reveal key={stage.num} as="li">
                <div id={`stage-${stage.num}`} className="grid scroll-mt-28 gap-8 md:grid-cols-2 md:gap-16">                  <div>
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface font-mono text-[13px] text-accent shadow-[0_10px_30px_-16px_rgba(23,25,30,0.3)]">
                        {stage.num}
                      </span>
                      <h2 className="display-tight font-display text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-tight text-ink">{stage.name}</h2>
                    </div>
                    <p className="mt-5 font-display text-[17px] font-medium leading-snug text-ink">{stage.headline}</p>
                    <p className="mt-3 max-w-[480px] text-[15px] leading-[1.7] text-soft">{stage.body}</p>
                  </div>
                  <div>
                    <div className="rounded-2xl border border-line bg-surface p-7">
                      <p className="label-tech">You receive</p>
                      <ul className="mt-4 space-y-3">
                        {stage.deliverables.map((d) => (
                          <li key={d} className="flex items-start gap-3 text-[14.5px] leading-relaxed text-ink">
                            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden className="mt-[5px] shrink-0 text-ok">
                              <path d="M2 7.4 5.2 10.5 12 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {d}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
                        <div className="bg-paper px-4 py-3">
                          <p className="font-mono text-[9.5px] uppercase tracking-tech text-faint">Input</p>
                          <p className="mt-1 text-[12.5px] leading-relaxed text-soft">{stage.input}</p>
                        </div>
                        <div className="bg-paper px-4 py-3">
                          <p className="font-mono text-[9.5px] uppercase tracking-tech text-accentdeep">Output</p>
                          <p className="mt-1 text-[12.5px] leading-relaxed text-soft">{stage.output}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-start gap-3 rounded-xl border border-accent/25 bg-accenthalo px-4 py-3">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden className="mt-[3px] shrink-0 text-accentdeep">
                          <path d="M6 4v16M6 12h9m-9 0 3-3m-3 3 3 3M18 7v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-[12.5px] leading-relaxed text-soft"><span className="font-mono text-[9.5px] uppercase tracking-tech text-accentdeep">Decision gate · </span>{stage.gate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-shell px-6 py-20 md:py-24">
          <div className="rounded-2xl border border-line bg-paper px-8 py-10 md:px-12">
            <p className="label-tech">The principle</p>
            <p className="display-tight mt-4 max-w-[760px] font-display text-[clamp(1.4rem,2.8vw,2.1rem)] font-semibold leading-[1.25] text-ink">
              Problem → understand → design → build → automate → integrate → deploy → support. If a step doesn’t produce something you can inspect, we don’t call it done.
            </p>
          </div>
        </div>
      </section>

      <CTASection title="Start at the beginning." text="Discovery costs little and prevents the expensive kind of surprise. Tell us the problem — we’ll tell you what we’d do about it." />
    </main>
  );
}
