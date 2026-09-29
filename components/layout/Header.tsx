'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import { navLinks, servicesMenu, site, hasRealWhatsapp } from '@/lib/site';
import HoverSwap from '@/components/motion/HoverSwap';
import { trackAction } from '@/lib/actions';

function CtaButton() {
  return (
    <Link
      href="/start-project"
      onClick={() => trackAction('hero_cta_clicked')}
      className="group/cta relative inline-flex items-center overflow-hidden rounded-full bg-ink px-5 py-2.5 text-[13.5px] font-medium text-paper transition-all duration-300 hover:bg-coal hover:shadow-[0_8px_24px_-10px_rgba(23,25,30,0.5)] active:scale-[0.98]"
    >
      <span className="transition-all duration-300 group-hover/cta:-translate-y-6 group-hover/cta:opacity-0">Start a Project</span>
      <span className="absolute inset-0 flex items-center justify-center gap-1.5 translate-y-6 opacity-0 transition-all duration-300 group-hover/cta:translate-y-0 group-hover/cta:opacity-100">
        Let’s build
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-paper">
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-[var(--announce-h,0px)] z-[100]">
        <div className={`mx-auto flex max-w-shell items-center justify-between px-6 transition-all duration-500 ${scrolled ? 'mt-3' : 'mt-0'}`}>
          <div
            className={`flex w-full items-center justify-between rounded-full border px-5 py-3 transition-all duration-500 ${
              scrolled ? 'border-line bg-paper/85 shadow-[0_12px_40px_-18px_rgba(23,25,30,0.25)] backdrop-blur-md' : 'border-transparent bg-transparent'
            }`}
          >
            <Logo />

            {/* Desktop nav */}
            <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
              {/* Services dropdown */}
              <div className="group relative">
                <button
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
                    isActive('/services') ? 'text-ink' : 'text-soft hover:text-ink'
                  }`}
                  aria-haspopup="true"
                >
                  <HoverSwap label="Services" />
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden className="transition-transform duration-300 group-hover:rotate-180">
                    <path d="M1.5 3.5 5 7l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="pointer-events-none absolute left-1/2 top-full w-[620px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                  <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_60px_-20px_rgba(23,25,30,0.28)]">
                    <div className="grid grid-cols-[210px_minmax(0,1fr)]">
                      {/* left: positioning pane */}
                      <div className="flex flex-col justify-between border-r border-line bg-paper p-5">
                        <div>
                          <p className="label-tech">How we can help</p>
                          <p className="mt-3 text-[13px] leading-relaxed text-soft">Six practices, one team. Pick the closest — we’ll map it to the problem on your call.</p>
                        </div>
                        <Link href="/services" className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-accent transition-colors hover:text-accentdeep">
                          Compare all six
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </Link>
                      </div>
                      {/* right: numbered services */}
                      <div className="p-2">
                        {servicesMenu.map((item) => (
                          <Link key={item.href} href={item.href} className="group/item flex items-center gap-3.5 rounded-xl px-3.5 py-[9px] transition-colors hover:bg-paper">
                            <span className="w-5 shrink-0 font-mono text-[10px] text-faint transition-colors group-hover/item:text-accentdeep">{(item as { num?: string }).num}</span>
                            <span className="flex h-4 w-4 shrink-0 items-end gap-[2px]" aria-hidden>
                              <span className="w-[3px] rounded-sm bg-accent" style={{ height: '10px' }} />
                              <span className="w-[3px] rounded-sm bg-line" style={{ height: '6px', marginLeft: '1.5px' }} />
                              <span className="w-[3px] rounded-sm bg-line" style={{ height: '3px', marginLeft: '1.5px' }} />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[13.5px] font-medium text-ink">{item.label}</span>
                              <span className="mt-0.5 block truncate text-[11.5px] text-soft">{item.note}</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors ${isActive(link.href) ? 'text-ink' : 'text-soft hover:text-ink'}`}
                >
                  <HoverSwap label={link.label} />
                  {isActive(link.href) && <span className="absolute inset-x-3.5 -bottom-px h-[2px] rounded-full bg-accent" aria-hidden />}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <button
                onClick={() => window.dispatchEvent(new Event('kiln:open-search'))}
                aria-label="Search (⌘K or /)"
                title="Search — ⌘K / Ctrl K or /"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-soft transition-colors hover:border-ink/30 hover:text-ink"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="m11 11 3.2 3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
              <Link href="/portal" className="rounded-full border border-line px-4 py-2.5 text-[12.5px] font-medium text-soft transition-colors hover:border-ink/30 hover:text-ink">
                Client Portal
              </Link>
              <CtaButton />
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="relative z-[120] flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
            >
              <span className="relative block h-3.5 w-5">
                <span className={`absolute left-0 top-0 h-[1.8px] w-full bg-ink transition-all duration-300 ${open ? 'top-1/2 -translate-y-1/2 rotate-45' : ''}`} />
                <span className={`absolute left-0 top-1/2 h-[1.8px] w-full -translate-y-1/2 bg-ink transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
                <span className={`absolute bottom-0 left-0 h-[1.8px] w-full bg-ink transition-all duration-300 ${open ? 'bottom-1/2 translate-y-1/2 -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <div
        className={`fixed inset-0 z-[110] bg-paper transition-all duration-500 lg:hidden ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-10 pt-28">
          <nav aria-label="Mobile" className="flex flex-col">
            {[{ label: 'Services', href: '/services' }, ...navLinks].map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                tabIndex={open ? 0 : -1}
                className={`border-b border-line py-5 font-display text-[clamp(1.9rem,7vw,2.6rem)] font-semibold tracking-tight text-ink transition-all duration-500 ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: open ? `${120 + i * 55}ms` : '0ms' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className={`mt-8 transition-all delay-300 duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <button
              onClick={() => {
                setOpen(false);
                window.dispatchEvent(new Event('kiln:open-search'));
              }}
              tabIndex={open ? 0 : -1}
              className="mb-3 inline-flex items-center gap-2 rounded-full border border-line px-7 py-4 text-[15px] font-medium text-ink"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
                <path d="m11 11 3.2 3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Search
            </button>
            <Link href="/start-project" tabIndex={open ? 0 : -1} className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-[15px] font-medium text-paper">
              Start a Project
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/portal" tabIndex={open ? 0 : -1} className="mt-3 inline-flex items-center gap-2 rounded-full border border-line px-7 py-4 text-[15px] font-medium text-ink">
              Client Portal
            </Link>
          </div>
          <div className={`mt-auto pt-12 transition-all delay-500 duration-500 ${open ? 'opacity-100' : 'opacity-0'}`}>
            <p className="label-tech">Contact</p>
            <a href={`mailto:${site.contact.email}`} tabIndex={open ? 0 : -1} className="mt-3 block text-[15px] text-ink underline-offset-4 hover:underline">
              {site.contact.email}
            </a>
            {hasRealWhatsapp && (
              <a href={`https://wa.me/${site.contact.whatsappRaw}`} tabIndex={open ? 0 : -1} target="_blank" rel="noopener noreferrer" className="mt-1.5 block text-[15px] text-soft hover:text-ink">
                WhatsApp — {site.contact.whatsapp}
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
