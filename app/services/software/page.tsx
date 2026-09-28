import type { Metadata } from 'next';
import ServiceDetail from '@/components/services/ServiceDetail';
import ArchDiagram from '@/components/services/ArchDiagram';
import { serviceBySlug } from '@/content/services';
import { pageSeo, serviceJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageSeo({
    title: 'Custom Software Development',
    description: 'Business platforms, internal tools, CRM and ERP systems, SaaS applications, dashboards, API and database systems — built for production.',
    path: '/services/software',
  }),
};

const BUILDS = ['SaaS products', 'Web applications', 'Internal tools', 'CRM systems', 'ERP systems', 'Dashboards', 'Business platforms', 'API systems', 'Database systems', 'Cloud infrastructure'];

export default function SoftwarePage() {
  const service = serviceBySlug('software')!;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd('Custom Software Development', service.short, '/services/software')) }} />
      <ServiceDetail
        service={service}
        heroLede="Software shaped around how your business actually runs. | Off-the-shelf tools make you adapt to them. Custom software adapts to you — when that’s the right trade, we build it properly."
        intro={[
          'We build the systems businesses run on: the internal platform that replaces six spreadsheets, the CRM your sales team will actually use, the dashboard that finally makes the numbers agree.',
          'Our default position is boring on purpose — proven frameworks, typed code, sensible architecture, automated testing. Excitement belongs in the product, not in the risk.',
          'And because we also run automation and AI practices, the software we build isn’t a silo: it becomes the backbone your automations and agents plug into.',
        ]}
        signature={<ArchDiagram />}
        signatureCaption="How the systems we ship are structured"
        ctaTitle="What system is your business missing?"
        ctaLabel="Start a Project"
        additional={
          <section className="border-t border-line bg-paper">
            <div className="mx-auto max-w-shell px-6 py-20 md:py-28">
              <span className="label-tech">Systems we build</span>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {BUILDS.map((b) => (
                  <span key={b} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-[14px] text-soft transition-colors duration-200 hover:border-accent/40 hover:text-ink">
                    <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </section>
        }
      />
    </>
  );
}
