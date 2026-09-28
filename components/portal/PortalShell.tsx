import Link from 'next/link';
import { logoutAction } from '@/lib/actions';
import { initials } from '@/lib/utils';
import type { Session } from '@/lib/store';

const NAV = [
  { label: 'Overview', href: '/portal' },
  { label: 'Projects', href: '/portal/projects' },
  { label: 'Milestones', href: '/portal/milestones' },
  { label: 'Messages', href: '/portal/messages' },
  { label: 'Files', href: '/portal/files' },
];

export default async function PortalShell({ session, pathname, unread, children }: { session: Session; pathname: string; unread?: number; children: React.ReactNode }) {
  const isActive = (href: string) => (href === '/portal' ? pathname === '/portal' : pathname === href || pathname.startsWith(href + '/'));
  return (
    <main className="min-h-screen bg-paper">
      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-shell flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-mono text-[12px] text-paper">{initials(session.name || session.email)}</span>
            <div>
              <p className="text-[14.5px] font-semibold leading-tight text-ink">{session.name || session.email}</p>
              <p className="font-mono text-[10px] uppercase tracking-tech text-faint">Client portal</p>
            </div>
          </div>
          <nav aria-label="Portal" className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto md:order-2 md:w-auto">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative shrink-0 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${isActive(item.href) ? 'bg-ink text-paper' : 'text-soft hover:bg-paper hover:text-ink'}`}
              >
                {item.label}
                {item.href === '/portal/messages' && !!unread && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[9px] text-white">{unread}</span>
                )}
              </Link>
            ))}
          </nav>
          <form className="order-2 md:order-3" action={async () => { 'use server'; await logoutAction('client'); }}>
            <button type="submit" className="rounded-full border border-line px-4 py-2 text-[12.5px] font-medium text-soft transition-colors hover:border-ink/30 hover:text-ink">
              Sign out
            </button>
          </form>
        </div>
      </div>
      <div className="mx-auto max-w-shell px-6 py-10 md:py-14">{children}</div>
    </main>
  );
}
