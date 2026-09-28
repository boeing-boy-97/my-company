import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import { pageSeo } from '@/lib/seo';

export const metadata: Metadata = pageSeo({ title: 'Cookie Policy', description: 'The one cookie we use, explained plainly.', path: '/cookies' });

export default function CookiesPage() {
  return (
    <main>
      <PageHero label="Legal" title="Cookie Policy" lede="Last updated: September 2026" crumbs={[{ label: 'Home', href: '/' }, { label: 'Cookies' }]} />
      <article className="mx-auto max-w-editorial px-6 pb-24 pt-4">
        <div className="space-y-8 text-[15.5px] leading-relaxed text-soft">
          <section>
            <h2 className="display-tight font-display text-[20px] font-semibold text-ink">One cookie, essential only</h2>
            <p className="mt-3">
              This site uses a single essential cookie: a session cookie that keeps you signed in to the client portal or the back office. It expires automatically and is never used for tracking or advertising.
            </p>
          </section>
          <section>
            <h2 className="display-tight font-display text-[20px] font-semibold text-ink">No analytics or advertising cookies</h2>
            <p className="mt-3">
              We record anonymous usage events (such as which sections are used) on our own infrastructure, without cookies and without personal identifiers. There are no third-party trackers, no ad networks and no cross-site profiling.
            </p>
          </section>
          <section>
            <h2 className="display-tight font-display text-[20px] font-semibold text-ink">Managing cookies</h2>
            <p className="mt-3">
              If you block or delete cookies in your browser, the site keeps working — you will simply need to sign in again when you use the portal. See our{' '}
              <Link href="/privacy" className="link-underline text-ink">privacy policy</Link> for the full picture.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
