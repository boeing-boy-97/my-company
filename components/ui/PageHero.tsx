import Link from 'next/link';
import Reveal from './Reveal';
import { TechLabel } from './SectionHeader';

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  label: string;
  title: React.ReactNode;
  lede?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}

export default function PageHero({ label, title, lede, crumbs, children }: Props) {
  return (
    <header className="toplight relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 gridlines gridlines-fade" aria-hidden />
      <div className="relative mx-auto max-w-shell px-6 pb-16 pt-36 md:pb-24 md:pt-44">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-tech text-faint">
              {crumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  {c.href ? (
                    <Link href={c.href} className="transition-colors hover:text-ink">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-soft">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <Reveal>
          <TechLabel>{label}</TechLabel>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="display-tight mt-6 max-w-[880px] font-display text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[1.03] text-ink">{title}</h1>
        </Reveal>
        {lede && (
          <Reveal delay={160}>
            <p className="mt-7 max-w-[640px] text-[17.5px] leading-[1.65] text-soft">{lede}</p>
          </Reveal>
        )}
        {children && <Reveal delay={230}>{children}</Reveal>}
      </div>
    </header>
  );
}
