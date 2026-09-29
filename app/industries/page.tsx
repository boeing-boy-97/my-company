import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import Reveal from '@/components/ui/Reveal';
import CTASection from '@/components/ui/CTASection';
import Button from '@/components/ui/Button';
import { industries } from '@/content/industries';
import IndustryExplorer from '@/components/industries/IndustryExplorer';
import { pageSeo } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageSeo({
    title: 'Industries we work with',
    description: 'From healthcare to logistics: the problems we see across industries, and the systems that solve them. No jargon, no claimed specializations we can’t back.',
    path: '/industries',
  }),
};

export default function IndustriesPage() {
  return (
    <main>
      <PageHero
        label="Industries"
        title="Different industries. Familiar problems."
        lede="We don’t claim deep vertical certifications we haven’t earned. What we do have is pattern recognition: the same underlying problems — slow responses, scattered data, manual work — appearing in different uniforms."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Industries' }]}
      />

      <section className="border-t border-line" aria-label="Industry patterns">
        <div className="mx-auto max-w-shell px-6 py-16 md:py-24">
          <IndustryExplorer industries={industries} />
        </div>
      </section>

      <CTASection title="Don’t see your industry?" text="That’s usually fine — the problem matters more than the sector. Describe what’s slow, manual or broken, and we’ll tell you whether we can help." />
    </main>
  );
}
