import type { Metadata } from 'next';
import ServiceDetail from '@/components/services/ServiceDetail';
import Reveal from '@/components/ui/Reveal';
import { serviceBySlug } from '@/content/services';
import { pageSeo, serviceJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageSeo({
    title: 'Web & Mobile Development',
    description: 'High-performance corporate websites, SaaS frontends, customer portals, e-commerce, web applications and mobile applications — designed, built and deployed.',
    path: '/services/web-mobile',
  }),
};

const BUILDS = ['Corporate websites', 'SaaS frontends', 'Customer portals', 'E-commerce', 'Web applications', 'Mobile applications', 'Admin dashboards'];

const JOURNEY = [
  { phase: 'Design', points: ['Goals & success metrics', 'UX flows and wireframes', 'Visual system & components'] },
  { phase: 'Develop', points: ['Component build with performance budgets', 'CMS / backend integration', 'Accessibility & cross-device QA'] },
  { phase: 'Deploy', points: ['Staged rollout & monitoring', 'Analytics & conversion events', 'Iteration from real usage'] },
];

function JourneyVisual() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 md:p-7" role="img" aria-label="Three phase journey from design to development to deployment">
      <div className="flex items-center justify-between">
        <span className="label-tech">The journey</span>
        <span className="font-mono text-[10px] uppercase tracking-wide text-faint">design → develop → deploy</span>
      </div>
      <div className="mt-6 grid gap-3">
        {JOURNEY.map((stage, i) => (
          <Reveal key={stage.phase} delay={i * 120}>
            <div className="relative rounded-xl border border-line bg-paper p-5">
              <div className="flex items-center justify-between">
                <p className="font-display text-[16.5px] font-semibold text-ink">{stage.phase}</p>
                <span className="font-mono text-[10px] text-accent">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {stage.points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-[13px] text-soft">
                    <span className="h-[3px] w-[3px] rounded-full bg-accent/70" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
              {i < JOURNEY.length - 1 && (
                <svg className="absolute -bottom-[13px] left-8 z-10" width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 4v16m0 0 5-5m-5 5-5-5" stroke="#E4572E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function WebMobilePage() {
  const service = serviceBySlug('web-mobile')!;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd('Web & Mobile Development', service.short, '/services/web-mobile')) }} />
      <ServiceDetail
        service={service}
        heroLede="Websites and apps that carry their weight. | Fast, considered, measurable. The kind of web and mobile presence your business quality already implies."
        intro={[
          'A website or app is usually the most direct expression of your business. It should load instantly, explain clearly, and move people to act — and it should be built so your team can change it without calling an engineer every time.',
          'We design and build with performance budgets and real content from the start. No template skins, no page-builder lock-in, no launch-day surprises.',
          'Mobile apps follow the same discipline: offline-tolerant, fast on real devices, designed for thumbs and for the environments your users actually work in.',
        ]}
        signature={<JourneyVisual />}
        signatureCaption="Every web & mobile engagement runs this path"
        ctaTitle="What should your customers experience?"
        ctaLabel="Start a Project"
        additional={
          <section className="border-t border-line bg-paper">
            <div className="mx-auto max-w-shell px-6 py-20 md:py-28">
              <span className="label-tech">What we build</span>
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
