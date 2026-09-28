import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import Reveal from '@/components/ui/Reveal';
import CTASection from '@/components/ui/CTASection';
import { pageSeo } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageSeo({
    title: 'Process — From problem to production',
    description: 'Eight stages from discovery to support, each with real deliverables. See exactly how a project moves from a described problem to a running system.',
    path: '/process',
  }),
};

const STAGES = [
  {
    num: '01',
    name: 'Discovery',
    headline: 'We learn the business problem before we talk solutions.',
    body: 'Interviews with the people who live with the problem, a review of the current tools and flows, and honest questions about what success means. We often find the real problem is adjacent to the one we were called about.',
    deliverables: ['Problem statement in plain language', 'Current-state map of tools & flows', 'Success criteria everyone agrees on'],
    input: 'The problem as you describe it, access to the people who live with it',
    output: 'Agreed problem statement + success criteria',
  },
  {
    num: '02',
    name: 'Strategy',
    headline: 'The problem becomes a plan with a budget and a sequence.',
    body: 'We weigh build vs. buy vs. automate, define the smallest version that proves value, and sequence the work so the riskiest questions get answered first.',
    deliverables: ['Recommended approach & alternatives', 'Scope, phasing and investment range', 'Risk register — what could go wrong, and the mitigation'],
    input: 'Problem statement, constraints, budget appetite',
    output: 'Plan, phasing and investment range you can approve',
  },
  {
    num: '03',
    name: 'UX',
    headline: 'Flows and interfaces designed around real usage.',
    body: 'Whether the surface is a dashboard, a WhatsApp conversation or an agent’s dialogue, we design the experience before engineering it — with states, edge cases and empty screens included.',
    deliverables: ['User flows & wireframes', 'Interface design with component rules', 'Conversation / notification design where relevant'],
    input: 'Approved plan, real usage examples',
    output: 'Flows and interface designs to sign off',
  },
  {
    num: '04',
    name: 'Architecture',
    headline: 'The system is drawn before it is built.',
    body: 'Data model, integration map, permission boundaries for anything automated, and the operational plan: hosting, backups, monitoring. Boring decisions, made deliberately.',
    deliverables: ['Architecture diagram & data model', 'Integration map with failure handling', 'Security & access decisions documented'],
    input: 'Approved designs, existing systems inventory',
    output: 'Architecture and data model with security decisions',
  },
  {
    num: '05',
    name: 'Development',
    headline: 'Weekly iterations you can see and respond to.',
    body: 'The build moves in short cycles with a demo at the end of each. You watch the system take shape against real data, and course corrections cost days instead of months.',
    deliverables: ['Working increments every week', 'Staging environment with real data', 'Automated tests on the critical paths'],
    input: 'Approved architecture, access to needed systems',
    output: 'Weekly working increments on staging',
  },
  {
    num: '06',
    name: 'Testing',
    headline: 'We try to break it before your users do.',
    body: 'Functional, integration and load checks against the scenarios we mapped in discovery — including the awkward ones: dropped connections, duplicate messages, bad data.',
    deliverables: ['Test report against the success criteria', 'Edge-case log and resolutions', 'Performance baseline'],
    input: 'Working increments, success criteria',
    output: 'Test report and resolved edge cases',
  },
  {
    num: '07',
    name: 'Deployment',
    headline: 'Launch is a controlled event, not a leap of faith.',
    body: 'Gradual rollout where possible — shadow mode, staged traffic, or a pilot group first. Monitoring is live before users arrive, and rollback paths exist from minute one.',
    deliverables: ['Deployment runbook', 'Monitoring & alerting in place', 'Training and documentation for your team'],
    input: 'Tested build, your team for training',
    output: 'Live system, runbook and trained users',
  },
  {
    num: '08',
    name: 'Support',
    headline: 'The system keeps improving after launch.',
    body: 'We watch how it performs against the success criteria, fix what surfaces, and evolve it as the business changes. Some clients keep us on retainer; others take the keys. Both are valid exits.',
    deliverables: ['Support & maintenance agreement', 'Monthly health & usage report', 'Improvement backlog, prioritized by value'],
    input: 'Live system, feedback from real use',
    output: 'Health reports and a prioritized improvement backlog',
  },
];

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
        <div className="relative mx-auto max-w-shell px-6 py-20 md:py-28">
          {/* rail */}
          <div className="pointer-events-none absolute bottom-24 left-6 top-24 hidden w-px bg-line md:left-[calc(50%-400px)] md:block lg:left-[calc(50%-480px)]" aria-hidden />
          <ol className="space-y-16 md:space-y-24">
            {STAGES.map((stage, i) => (
              <Reveal key={stage.num} as="li">
                <div className={`grid gap-8 md:grid-cols-2 md:gap-16 ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}>
                  <div className="md:[direction:ltr]">
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface font-mono text-[13px] text-accent shadow-[0_10px_30px_-16px_rgba(23,25,30,0.3)]">
                        {stage.num}
                      </span>
                      <h2 className="display-tight font-display text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-tight text-ink">{stage.name}</h2>
                    </div>
                    <p className="mt-5 font-display text-[17px] font-medium leading-snug text-ink">{stage.headline}</p>
                    <p className="mt-3 max-w-[480px] text-[15px] leading-[1.7] text-soft">{stage.body}</p>
                  </div>
                  <div className="md:[direction:ltr]">
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
