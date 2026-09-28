import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import { site } from '@/lib/site';
import { pageSeo } from '@/lib/seo';

export const metadata: Metadata = pageSeo({ title: 'Terms of Service', description: 'The ground rules for working together.', path: '/terms' });

export default function TermsPage() {
  return (
    <main>
      <PageHero label="Legal" title="Terms of Service" lede="Last updated: September 2026" crumbs={[{ label: 'Home', href: '/' }, { label: 'Terms' }]} />
      <article className="mx-auto max-w-editorial px-6 pb-24 pt-4">
        {[
          { h: 'The short version', body: [
            'This site introduces our services and lets you contact us. Engagements themselves are governed by a written agreement or statement of work — never by this page.',
            'Nothing on this website is a quote, a guarantee of outcome, or a commitment to deliver at a stated price. Scope and investment are always agreed in writing after discovery.',
          ]},
          { h: 'Use of the site', body: [
            'Use the site for its intended purposes: learning about services, submitting enquiries and managing projects through the client portal. Don’t probe, scrape or abuse the forms; submissions are rate-limited and validated.',
          ]},
          { h: 'Intellectual property', body: [
            `Content on this site belongs to ${site.legalName} unless stated otherwise. Deliverables created for clients are governed by the applicable engagement agreement, which defines ownership and licensing explicitly.`,
          ]},
          { h: 'Client portal & accounts', body: [
            'You are responsible for keeping your credentials confidential. Portal access is provided for your projects; we may suspend access if misuse is detected. Demo workspaces are illustrative.',
          ]},
          { h: 'Liability', body: [
            'The site is provided “as is.” To the maximum extent permitted by law, we are not liable for indirect or consequential losses arising from use of the website. Nothing here limits liability that cannot lawfully be limited.',
          ]},
          { h: 'Changes', body: [
            'We may update these terms; the date above reflects the latest revision. Material changes to how we run engagements are always agreed with the client directly.',
          ]},
        ].map((s) => (
          <section key={s.h} className="border-b border-linedark py-8 last:border-b-0">
            <h2 className="display-tight font-display text-[22px] font-semibold text-ink">{s.h}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-4 text-[15.5px] leading-[1.75] text-soft">{p}</p>
            ))}
          </section>
        ))}
      </article>
    </main>
  );
}
