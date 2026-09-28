import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import ContactForm from '@/components/contact/ContactForm';
import Channels from '@/components/contact/Channels';
import { site } from '@/lib/site';
import { pageSeo } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageSeo({
    title: 'Contact — Talk to our team',
    description: 'Email, phone, WhatsApp or the form — reach the team directly. Business hours, regions served and response times.',
    path: '/contact',
  }),
};

export default function ContactPage() {
  return (
    <main>
      <PageHero
        label="Contact"
        title="Talk to our team."
        lede="A question, an idea, or a problem that’s been sitting there too long — any of them is a good reason to reach out."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-shell gap-12 px-6 py-16 md:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* channels */}
          <div>
            <Channels />

            <Reveal delay={300}>
              <div className="mt-8 rounded-2xl border border-line bg-paper p-7">
                <dl className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <dt className="label-tech">Business hours</dt>
                    <dd className="mt-2 text-[14px] leading-relaxed text-ink">{site.contact.hours}</dd>
                    <dd className="mt-1 text-[12.5px] text-faint">Replies within one business day, usually sooner.</dd>
                  </div>
                  <div>
                    <dt className="label-tech">Regions served</dt>
                    <dd className="mt-2 text-[14px] leading-relaxed text-ink">North America · Europe · Middle East · Asia-Pacific · Australia</dd>
                    <dd className="mt-1 text-[12.5px] text-faint">HQ in {site.location.city}, {site.location.country} — working across time zones.</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>

          {/* form */}
          <Reveal delay={120}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-shell flex-col items-start justify-between gap-6 px-6 py-14 md:flex-row md:items-center">
          <div>
            <p className="font-display text-[22px] font-semibold text-ink">Here with a project in mind?</p>
            <p className="mt-1 text-[14.5px] text-soft">The structured brief gets you a faster, sharper first response.</p>
          </div>
          <Button href="/start-project">Start a Project</Button>
        </div>
      </section>
    </main>
  );
}
