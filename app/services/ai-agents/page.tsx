import type { Metadata } from 'next';
import ServiceDetail from '@/components/services/ServiceDetail';
import AgentSim from '@/components/services/AgentSim';
import Reveal from '@/components/ui/Reveal';
import { serviceBySlug } from '@/content/services';
import { pageSeo, serviceJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageSeo({
    title: 'AI Agents that actually do work',
    description: 'Voice agents, customer support agents, sales agents, receptionist and internal agents — built with guardrails, monitoring and human handoff.',
    path: '/services/ai-agents',
  }),
};

const AGENT_TYPES = [
  { name: 'Sales Agent', note: 'Qualifies leads, follows up, books the next step' },
  { name: 'Support Agent', note: 'Resolves common tickets end to end, escalates the rest' },
  { name: 'Voice Agent', note: 'Answers calls, handles routine conversations, routes exceptions' },
  { name: 'Receptionist Agent', note: 'Greets, informs and schedules — around the clock' },
  { name: 'Research Agent', note: 'Gathers, compares and summarizes information on demand' },
  { name: 'Internal Knowledge Agent', note: 'Your team’s questions answered from your own documents' },
  { name: 'Appointment Agent', note: 'Scheduling without the email ping-pong' },
  { name: 'Operations Agent', note: 'Monitors queues, chases documents, nudges workflows' },
];

export default function AiAgentsPage() {
  const service = serviceBySlug('ai-agents')!;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd('AI Agents', service.short, '/services/ai-agents')) }} />
      <ServiceDetail
        service={service}
        heroLede="AI agents that actually do work. | Not chatbots that answer and stop — agents that check, book, update and confirm. Systems with a job description."
        intro={[
          'Most “AI assistants” talk. The ones we build act — inside clearly defined limits. A support agent doesn’t just reply to a shipping question; it looks up the order, answers accurately, and updates the record. An appointment agent doesn’t suggest times; it books one.',
          'Every agent ships with three things: a knowledge layer grounded in your real data, a permission boundary that defines exactly what it may do, and a human escalation path for everything else.',
          'That combination is what makes agents trustworthy enough to run unattended — and what separates an agent in production from a demo.',
        ]}
        signature={<AgentSim />}
        signatureCaption="Watch an appointment agent handle a real request"
        ctaTitle="What job should your first agent do?"
        ctaLabel="Build an AI Agent"
        additional={
          <section className="border-t border-line bg-paper">
            <div className="mx-auto max-w-shell px-6 py-20 md:py-28">
              <span className="label-tech">Agent types we build</span>
              <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
                {AGENT_TYPES.map((a, i) => (
                  <Reveal key={a.name} delay={(i % 4) * 70}>
                    <div className="group h-full bg-surface p-6 transition-colors duration-300 hover:bg-paper">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-paper text-accent transition-colors duration-300 group-hover:border-accent/40">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <p className="mt-4 font-display text-[16px] font-semibold text-ink">{a.name}</p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-soft">{a.note}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        }
      />
    </>
  );
}
