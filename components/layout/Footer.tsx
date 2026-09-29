import Link from 'next/link';
import Logo from './Logo';
import HoverSwap from '@/components/motion/HoverSwap';
import { site, isConfigured, publicSocials } from '@/lib/site';
import { getSiteContact } from '@/lib/siteSettings';

const cols = [
  {
    title: 'Services',
    links: [
      { label: 'AI & Automation', href: '/services/ai-automation' },
      { label: 'AI Agents', href: '/services/ai-agents' },
      { label: 'Software', href: '/services/custom-software' },
      { label: 'Web & Mobile', href: '/services/web-mobile' },
      { label: 'AI Products', href: '/services/ai-products' },
      { label: 'Systems & Integrations', href: '/services/system-integration' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { label: 'All services', href: '/services' },
      { label: 'Work', href: '/work' },
      { label: 'Process', href: '/approach' },
      { label: 'Industries', href: '/industries' },
      { label: 'Insights', href: '/insights' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/studio' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Start a project', href: '/start-project' },
      { label: 'Client portal', href: '/portal/login' },
    ],
  },
];

export default async function Footer() {
  const contact = await getSiteContact();
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-shell px-6 pb-10 pt-16 md:pt-20">
        {/* editorial masthead — the footer should feel like an ending */}
        <div className="flex flex-col gap-4 border-b border-line pb-10 md:flex-row md:items-end md:justify-between">
          <p className="display-tight font-display text-[clamp(3.2rem,9vw,7.5rem)] font-bold leading-[0.9] tracking-[-0.03em] text-ink" aria-hidden>
            {site.name.toUpperCase()}
          </p>
          <p className="max-w-[320px] pb-1 text-[14.5px] leading-relaxed text-soft md:text-right">
            {site.tagline}
          </p>
        </div>
        <div className="mt-12 grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.1fr]">
          <div>
            <Logo />
        <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-tech text-soft">
          {site.acceptingProjects && <span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulsedot" aria-hidden />}
          {site.acceptingProjects ? 'Currently accepting new projects' : 'Project capacity currently full'}
        </p>
            <p className="mt-5 max-w-[280px] text-[14.5px] leading-relaxed text-soft">{site.tagline}</p>
            <p className="mt-3 max-w-[280px] text-[13px] text-faint">{site.altTagline}</p>
          </div>

          {cols.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="label-tech">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="link-underline text-[13.5px] text-soft transition-colors hover:text-ink">
                      <HoverSwap label={l.label} />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="label-tech">Contact</p>
            <ul className="mt-4 space-y-2.5 text-[13.5px]">
              <li>
                <a href={`mailto:${contact.email}`} className="link-underline text-soft hover:text-ink">
                  {contact.email}
                </a>
              </li>
              {isConfigured(contact.phoneRaw) && (
                <li>
                  <a href={`tel:${contact.phoneRaw}`} className="link-underline text-soft hover:text-ink">
                    {contact.phone}
                  </a>
                </li>
              )}
              {isConfigured(contact.whatsappRaw) && (
                <li>
                  <a href={`https://wa.me/${contact.whatsappRaw}`} target="_blank" rel="noopener noreferrer" className="link-underline text-soft hover:text-ink">
                    WhatsApp
                  </a>
                </li>
              )}
              <li className="pt-1 text-[12.5px] leading-relaxed text-faint">
                {contact.hours}
                <br />
                {site.location.city}, {site.location.country} — serving worldwide
              </li>
              <li className="pt-1">
                <Link href="/portal/login" className="link-underline text-[12.5px] text-faint hover:text-ink">
                  Client login →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-line pt-7 md:flex-row md:items-center md:justify-between">
          <p className="text-[12.5px] text-faint">
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="text-[12.5px] text-faint transition-colors hover:text-ink">Privacy</Link>
            <Link href="/terms" className="text-[12.5px] text-faint transition-colors hover:text-ink">Terms</Link>
            <Link href="/cookies" className="text-[12.5px] text-faint transition-colors hover:text-ink">Cookies</Link>
            <Link href="/accessibility" className="text-[12.5px] text-faint transition-colors hover:text-ink">Accessibility</Link>
          </nav>
          {publicSocials.length > 0 && (
            <div className="flex gap-4">
              {publicSocials.map((s) => (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="text-[12.5px] text-faint transition-colors hover:text-ink">
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
