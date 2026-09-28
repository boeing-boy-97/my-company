import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import { site } from '@/lib/site';
import { pageSeo } from '@/lib/seo';

export const metadata: Metadata = pageSeo({ title: 'Privacy Policy', description: 'How we handle data — plainly.', path: '/privacy' });

export default function PrivacyPage() {
  const updated = 'Last updated: September 2026';
  return (
    <main>
      <PageHero label="Legal" title="Privacy Policy" lede={updated} crumbs={[{ label: 'Home', href: '/' }, { label: 'Privacy' }]} />
      <article className="mx-auto max-w-editorial px-6 pb-24 pt-4">
        {[
          { h: 'What we collect', id: 'collect', body: [
            'When you submit a project brief, contact form or job application, we store the details you provide: name, contact information, company details and the content of your message. When you use the AI consultant, the conversation summary is stored so our team can follow up usefully.',
            'We collect analytics events (such as which sections are used) without personal identifiers. We do not use advertising trackers or sell data.',
          ]},
          { h: 'Why we collect it', id: 'why', body: [
            'To respond to your enquiry, scope a project, run an engagement, or process a job application. We also use aggregate information to improve the site.',
          ]},
          { h: 'Cookies', id: 'cookies', body: [
            'We use only essential cookies: a session cookie that keeps you signed in to the client portal or back office. It expires automatically and is not used for tracking.',
          ]},
          { h: 'Data storage & security', id: 'storage', body: [
            'Submissions are stored in our project database with access limited to the team. Uploads (such as resumes) are validated by type and size. In production, infrastructure runs on providers with standard security certifications, and access is role-restricted.',
          ]},
          { h: 'Retention', id: 'retention', body: [
            'Enquiry data is kept while it remains relevant to a potential or active engagement, then deleted on request or after a reasonable period. You may request deletion at any time.',
          ]},
          { h: 'Your rights', id: 'rights', body: [
            `You can ask what we hold about you, request corrections, or request deletion by emailing ${site.contact.email}. We respond within a reasonable time, typically a few business days.`,
          ]},
          { h: 'Contact', id: 'contact', body: [
            `Questions about this policy: ${site.contact.email}.`,
          ]},
        ].map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-32 border-b border-linedark py-8 last:border-b-0">
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
