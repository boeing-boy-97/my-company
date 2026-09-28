import type { Metadata } from 'next';
import ServiceDetail from '@/components/services/ServiceDetail';
import Reveal from '@/components/ui/Reveal';
import { serviceBySlug } from '@/content/services';
import { pageSeo, serviceJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageSeo({
    title: 'AI Product Development — Idea to Production',
    description: 'Turn an idea into a production-ready AI product: LLM systems, RAG, AI assistants, vision, speech, recommendation systems and AI analytics.',
    path: '/services/ai-products',
  }),
};

const PIPELINE = ['Idea', 'Validation', 'Prototype', 'AI architecture', 'MVP', 'Production', 'Scale'];

const CAPABILITIES = ['LLM systems', 'RAG knowledge systems', 'AI assistants & copilots', 'Computer vision', 'Speech & voice', 'Recommendation systems', 'AI analytics', 'Document intelligence'];

function PipelineVisual() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 md:p-7" role="img" aria-label="Product pipeline from idea through validation, prototype, architecture, MVP, production and scale">
      <div className="flex items-center justify-between">
        <span className="label-tech">From idea to scale</span>
        <span className="font-mono text-[10px] uppercase tracking-wide text-faint">7 stages</span>
      </div>
      <ol className="mt-6">
        {PIPELINE.map((stage, i) => (
          <Reveal key={stage} delay={i * 80} as="li">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <span className={`flex h-9 w-9 items-center justify-center rounded-full border font-mono text-[10.5px] ${i < 2 ? 'border-ok/40 bg-ok/5 text-ok' : i === 2 ? 'border-accent/50 bg-accenthalo text-accent' : 'border-line bg-paper text-faint'}`}>
                  {i < 2 ? '✓' : String(i + 1).padStart(2, '0')}
                </span>
                {i < PIPELINE.length - 1 && <span className={`my-1 h-5 w-px ${i < 2 ? 'bg-ok/40' : 'bg-line'}`} aria-hidden />}
              </div>
              <p className={`font-display text-[16px] font-semibold tracking-tight ${i <= 2 ? 'text-ink' : 'text-soft'}`}>{stage}</p>
            </div>
          </Reveal>
        ))}
      </ol>
      <p className="mt-5 border-t border-linedark pt-4 text-[12px] leading-relaxed text-faint">
        Stages 1–2 usually take days, not months. If validation says “don’t build,” that finding is worth more than the product would have been.
      </p>
    </div>
  );
}

export default function AiProductsPage() {
  const service = serviceBySlug('ai-products')!;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd('AI Product Development', service.short, '/services/ai-products')) }} />
      <ServiceDetail
        service={service}
        heroLede="From idea to production AI product. | We take AI ideas through validation, prototype and MVP to a system that survives real users — then help you scale it."
        intro={[
          'Most AI products fail in one of two ways: a demo that never survives contact with real data, or a build that ships before anyone validated the idea. Our process is designed against both.',
          'We start by pressure-testing the concept — what would users do, what would they pay, what is the riskiest assumption? Only then do we prototype, and we prototype the risky part first.',
          'The result is a production AI system with evaluation and monitoring built in — so quality is measured, not assumed.',
        ]}
        signature={<PipelineVisual />}
        signatureCaption="The AI product pipeline, stage by stage"
        ctaTitle="What should your AI product do?"
        ctaLabel="Start a Project"
        additional={
          <section className="border-t border-line bg-paper">
            <div className="mx-auto max-w-shell px-6 py-20 md:py-28">
              <span className="label-tech">AI capabilities we productize</span>
              <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
                {CAPABILITIES.map((c, i) => (
                  <Reveal key={c} delay={(i % 4) * 70}>
                    <div className="flex items-center gap-3 bg-surface px-6 py-5 text-[14.5px] font-medium text-ink transition-colors duration-300 hover:bg-paper">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                      {c}
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
