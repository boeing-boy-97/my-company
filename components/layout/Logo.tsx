import Link from 'next/link';
import { site } from '@/lib/site';

export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
      <rect x="1.5" y="1.5" width="25" height="25" rx="6.5" stroke="currentColor" strokeWidth="2.2" />
      <path d="M14 8.5v11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M9.5 14h9" stroke="#E4572E" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className={`group/logo inline-flex items-center gap-2.5 ${inverted ? 'text-paper' : 'text-ink'}`} aria-label={`${site.name} — home`}>
      <LogoMark />
      <span className="font-display text-[19px] font-semibold tracking-tight">{site.name}</span>
      <span className={`hidden font-mono text-[9.5px] uppercase tracking-tech sm:block ${inverted ? 'text-paper/40' : 'text-faint'}`}>{site.descriptor}</span>
    </Link>
  );
}
