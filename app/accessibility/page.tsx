import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import { site } from '@/lib/site';
import { pageSeo } from '@/lib/seo';

export const metadata: Metadata = pageSeo({ title: 'Accessibility Statement', description: 'Our commitment to an accessible experience.', path: '/accessibility' });

export default function AccessibilityPage() {
  return (
    <main>
      <PageHero label="Accessibility" title="Everyone should be able to use this site." crumbs={[{ label: 'Home', href: '/' }, { label: 'Accessibility' }]} />
      <article className="mx-auto max-w-editorial px-6 pb-24 pt-4">
        <p className="text-[16px] leading-[1.8] text-soft">
          We build for keyboard, screen reader and reduced-motion users as first-class citizens — on this site and in the products we ship for clients.
        </p>
        {[
          { h: 'What we implement', items: [
            'Full keyboard navigation with visible focus indicators',
            'Semantic landmarks, headings and labels throughout',
            'Respect for prefers-reduced-motion — animations are disabled and content remains usable',
            'Sufficient color contrast in light and dark surfaces',
            'Form errors that are announced and associated with their fields',
            'No content that depends on animation to be understood',
          ]},
          { h: 'Conformance approach', items: [
            'We target WCAG 2.2 AA as the practical bar for this site and recommend the same in client builds',
            'Interactive components (tabs, dialogs, wizards) are built with proper roles and states',
          ]},
          { h: 'Report a barrier', items: [
            `If anything on this site is hard to use with your tools, tell us: ${site.contact.email}`,
            'We treat accessibility reports as bugs — with a fix, not a workaround',
          ]},
        ].map((s) => (
          <section key={s.h} className="border-b border-linedark py-8 last:border-b-0">
            <h2 className="display-tight font-display text-[22px] font-semibold text-ink">{s.h}</h2>
            <ul className="mt-4 space-y-2.5">
              {s.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15.5px] leading-relaxed text-soft">
                  <span className="mt-[9px] h-[4px] w-[4px] shrink-0 rotate-45 bg-accent" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </article>
    </main>
  );
}
