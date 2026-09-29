import Link from 'next/link';
import { cn } from '@/lib/utils';
import HoverSwap from '@/components/motion/HoverSwap';

export function ArrowLink({ href, children, className, small }: { href: string; children: React.ReactNode; className?: string; small?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'group/link inline-flex items-center gap-2 font-medium text-ink transition-colors hover:text-accent',
        small ? 'text-[13.5px]' : 'text-[15px]',
        className
      )}
    >
      <span className="link-underline">{typeof children === 'string' ? <HoverSwap label={children} /> : children}</span>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-300 group-hover/link:translate-x-1">
        <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

export function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'accent' | 'ok' | 'warn' }) {
  const tones = {
    neutral: 'border-line text-soft',
    accent: 'border-accent/30 bg-accenthalo text-accentdeep',
    ok: 'border-ok/25 bg-ok/5 text-ok',
    warn: 'border-warn/25 bg-warn/5 text-warn',
  };
  return <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em]', tones[tone])}>{children}</span>;
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-ink/15 bg-surface/60 px-8 py-14 text-center">
      <p className="font-display text-[19px] font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-[420px] text-[14.5px] leading-relaxed text-soft">{body}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export function Divider() {
  return <div className="mx-auto h-px max-w-shell bg-line" aria-hidden />;
}

export function StatusDot({ tone = 'live' }: { tone?: 'live' | 'idle' }) {
  return <span className={cn('status-dot', tone === 'live' ? 'status-dot-live' : 'bg-faint')} aria-hidden />;
}
