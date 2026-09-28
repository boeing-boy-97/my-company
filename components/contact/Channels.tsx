'use client';
import Reveal from '@/components/ui/Reveal';
import { trackAction } from '@/lib/actions';
import { site } from '@/lib/site';

const CHANNELS = [
  {
    label: 'Start a Project',
    value: 'The fastest path for new work',
    href: '/start-project',
    event: '',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Email',
    value: site.contact.email,
    href: `mailto:${site.contact.email}`,
    event: 'email_clicked',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Phone',
    value: site.contact.phone,
    href: `tel:${site.contact.phoneRaw}`,
    event: 'calendar_clicked',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M5 4h4l1.5 4.5-2.2 1.6a13 13 0 0 0 5.6 5.6l1.6-2.2L20 15v4a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.6A1.5 1.5 0 0 1 5 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    value: site.contact.whatsapp,
    href: `https://wa.me/${site.contact.whatsappRaw}`,
    external: true,
    event: 'whatsapp_clicked',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.7-2-1-1 1c-1-.5-1.8-1.3-2.3-2.3l1-1-1-2L9 9.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Channels() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {CHANNELS.map((ch, i) => (
        <Reveal key={ch.label} delay={i * 70}>
          <a
            href={ch.href}
            {...(ch.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            onClick={() => ch.event && trackAction(ch.event)}
            className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_18px_40px_-24px_rgba(23,25,30,0.35)]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-paper text-ink transition-colors duration-300 group-hover:border-accent/40 group-hover:text-accent">
              {ch.icon}
            </span>
            <span className="mt-4 font-display text-[16.5px] font-semibold text-ink">{ch.label}</span>
            <span className="mt-1 break-all text-[13.5px] text-soft">{ch.value}</span>
            <span className="mt-3 text-[12px] font-medium text-faint transition-colors group-hover:text-accent">Open →</span>
          </a>
        </Reveal>
      ))}
    </div>
  );
}
