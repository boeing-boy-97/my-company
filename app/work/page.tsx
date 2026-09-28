import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import CTASection from '@/components/ui/CTASection';
import WorkBrowser from '@/components/work/WorkBrowser';
import { cmsPublished, type CaseStudyRecord } from '@/lib/store';
import { pageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...pageSeo({
    title: 'Work — Systems running in production',
    description: 'Selected work across AI, automation, SaaS, web, mobile and enterprise systems. Client names anonymized where agreements require it.',
    path: '/work',
  }),
};

export default async function WorkPage() {
  const caseStudies = await cmsPublished<CaseStudyRecord>('caseStudies');
  return (
    <main>
      <PageHero
        label="Selected work"
        title="Systems, running."
        lede="A selection of projects across AI, automation and software. Client names are anonymized where agreements require it — the problems, the systems and the outcomes are real."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Work' }]}
      />
      <section className="border-t border-line">
        <div className="mx-auto max-w-shell px-6 py-16 md:py-24">
          <WorkBrowser cases={caseStudies} />
        </div>
      </section>
      <CTASection title="Your project belongs in this list." text="Tell us what you’re trying to improve, automate or build — and let’s make it the next case study." />
    </main>
  );
}
