import type { Metadata } from 'next';
import ServiceDetail from '@/components/services/ServiceDetail';
import FlowVisual from '@/components/services/FlowVisual';
import { serviceBySlug } from '@/content/services';
import { pageSeo, serviceJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageSeo({
    title: 'AI Automation — Remove the repetitive work',
    description: 'Workflow automation that removes repetitive business operations: enquiry handling, data entry, document processing, reporting — with humans approving where it matters.',
    path: '/services/ai-automation',
  }),
};

const EXAMPLES = [
  { name: 'Sales automation', note: 'Lead response, qualification, pipeline hygiene' },
  { name: 'Customer support', note: 'Ticket triage, drafts, status answers' },
  { name: 'WhatsApp automation', note: 'Enquiries, confirmations, reminders' },
  { name: 'Email automation', note: 'Parsing, routing, follow-ups' },
  { name: 'Document processing', note: 'Extraction, verification, filing' },
  { name: 'Lead qualification', note: 'Scoring and routing before a human sees it' },
  { name: 'Data entry', note: 'Cross-system record keeping, no re-keying' },
  { name: 'Reporting', note: 'Operational reports assembled automatically' },
  { name: 'Operations', note: 'Approvals, handoffs and escalations that move themselves' },
];

export default function AiAutomationPage() {
  const service = serviceBySlug('ai-automation')!;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd('AI Automation', service.short, '/services/ai-automation')) }} />
      <ServiceDetail
        service={service}
        heroLede="Remove the repetitive work. | Workflow automation takes the tasks your team repeats every day and runs them as supervised systems — fast, consistent, and accountable."
        intro={[
          'Every business runs on dozens of small flows: an enquiry arrives, someone reads it, types it into a system, sends a reply, updates a record. Individually small. Collectively, they consume your best people’s hours.',
          'We map these flows end to end, then automate the parts that don’t need judgment — with AI handling the understanding, workflows handling the movement, and humans approving where it matters.',
          'The result isn’t a chatbot bolted to your inbox. It’s an operating layer: measurable time returned, errors removed, and a business that responds at the speed the market expects.',
        ]}
        signature={<FlowVisual />}
        signatureCaption="A typical enquiry workflow — live simulation"
        ctaTitle="Where is the repetitive work hiding?"
        ctaLabel="Automate My Workflow"
        additional={
          <section className="border-t border-line bg-paper">
            <div className="mx-auto max-w-shell px-6 py-20 md:py-28">
              <span className="label-tech">Common automation projects</span>
              <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                {EXAMPLES.map((ex) => (
                  <div key={ex.name} className="group bg-surface p-7 transition-colors duration-300 hover:bg-paper">
                    <p className="font-display text-[16.5px] font-semibold text-ink">{ex.name}</p>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-soft">{ex.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        }
      />
    </>
  );
}
