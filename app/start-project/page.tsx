import type { Metadata } from 'next';
import Reveal from '@/components/ui/Reveal';
import { TechLabel } from '@/components/ui/SectionHeader';
import ProjectWizard from '@/components/start/ProjectWizard';
import { pageSeo } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageSeo({
    title: 'Start a Project — Describe the problem',
    description: 'Tell us what you’re trying to improve, automate or build. A structured brief takes two minutes and reaches the team directly.',
    path: '/start-project',
  }),
};

export default async function StartProjectPage({ searchParams }: { searchParams: Promise<{ idea?: string; type?: string }> }) {
  const { idea, type } = await searchParams;

  return (
    <main>
      <section className="toplight relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 gridlines gridlines-fade" aria-hidden />
        <div className="relative mx-auto max-w-shell px-6 pb-12 pt-36 md:pt-44">
          <Reveal>
            <TechLabel>Start a project · 8 quick steps</TechLabel>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="display-tight mt-6 max-w-[820px] font-display text-[clamp(2.2rem,5.4vw,4rem)] font-semibold leading-[1.04] text-ink">
              Bring us the problem.<br />We’ll build the technology.
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-6 max-w-[560px] text-[16.5px] leading-[1.65] text-soft">
              This brief takes about two minutes. The more context you give, the better our first response — but rough is fine. We’ll ask the rest.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-shell px-6 pb-24 pt-4 md:pb-32">
        <Reveal delay={200}>
          <ProjectWizard initialIdea={idea} initialType={type} />
        </Reveal>
      </section>

      {/* reassurance strip */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-shell gap-px overflow-hidden rounded-none border-x-0 border-b-0 bg-line px-6 md:grid-cols-3">
          {[
            { t: 'A human reads every brief', d: 'Your submission lands with the team directly — no automated brush-off, no sales queue.' },
            { t: 'Reply within one business day', d: 'Usually with questions and a first read on approach. If we’re not the right fit, we’ll say so.' },
            { t: 'No invented numbers', d: 'You won’t get an instant fake quote. Real scope comes from discovery — that protects you.' },
          ].map((r) => (
            <div key={r.t} className="bg-surface py-12 pr-8">
              <p className="font-display text-[16.5px] font-semibold text-ink">{r.t}</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-soft">{r.d}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
