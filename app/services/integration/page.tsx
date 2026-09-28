import type { Metadata } from 'next';
import ServiceDetail from '@/components/services/ServiceDetail';
import ArchDiagram from '@/components/services/ArchDiagram';
import { serviceBySlug } from '@/content/services';
import { pageSeo, serviceJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageSeo({
    title: 'Systems & Integrations',
    description: 'APIs, CRM, ERP, payments, communication platforms and third-party integrations — connected systems with a single source of truth.',
    path: '/services/integration',
  }),
};

const CONNECTORS = ['CRM & ERP suites', 'Payment & billing', 'WhatsApp / SMS', 'Email platforms', 'Data warehouses', 'Legacy systems', 'E-commerce platforms', 'Identity & SSO', 'Logistics & shipping', 'Accounting software'];

export default function IntegrationPage() {
  const service = serviceBySlug('integration')!;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd('Systems & Integrations', service.short, '/services/integration')) }} />
      <ServiceDetail
        service={service}
        heroLede="Your tools already work. We make them work together. | Every business accumulates systems — CRM, accounting, WhatsApp, spreadsheets, legacy software. We connect them into one coherent flow of data, with retry logic and monitoring, so nothing falls through the cracks."
        intro={[
          'Most operational pain isn’t missing software — it’s disconnected software. Orders re-keyed by hand. Invoices that disagree with the CRM. A WhatsApp conversation nobody can trace back to a customer record.',
          'We map your system landscape, design the integration architecture, and build the connectors properly: typed, monitored, with error handling and retries from day one.',
          'The result is a single source of truth. Data flows automatically between systems, humans stop being the middleware, and every tool starts doing the job you bought it for.',
        ]}
        signature={<ArchDiagram />}
        signatureCaption="How connected systems are structured"
        ctaTitle="Which systems need to talk to each other?"
        ctaLabel="Start a Project"
        additional={
          <section className="border-t border-line bg-paper">
            <div className="mx-auto max-w-shell px-6 py-20 md:py-28">
              <span className="label-tech">Common integrations</span>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {CONNECTORS.map((b) => (
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
