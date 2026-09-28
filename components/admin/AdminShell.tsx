import Link from 'next/link';
import { logoutAction } from '@/lib/actions';
import { listNotifications, markNotificationsRead } from '@/lib/store';
import { formatDate } from '@/lib/utils';

const NAV = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Leads', href: '/admin/leads' },
  { label: 'Projects', href: '/admin/projects' },
  { label: 'Clients', href: '/admin/clients' },
];
const CMS_NAV = [
  { label: 'Case studies', href: '/admin/case-studies' },
  { label: 'Insights', href: '/admin/insights' },
  { label: 'Testimonials', href: '/admin/testimonials' },
  { label: 'Team', href: '/admin/team' },
  { label: 'Jobs', href: '/admin/jobs' },
];

export default async function AdminShell({ email, pathname, children }: { email: string; pathname: string; children: React.ReactNode }) {
  const notifications = await listNotifications('admin');
  const unread = notifications.filter((n) => !n.readAt).length;
  if (unread > 0) await markNotificationsRead('admin');
  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(href + '/'));

  return (
    <main className="min-h-screen bg-paper">
      <div className="border-b border-line bg-coal text-paper">
        <div className="mx-auto flex max-w-shell flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div>
            <p className="font-display text-[16px] font-semibold leading-tight">Back Office</p>
            <p className="font-mono text-[9.5px] uppercase tracking-tech text-paper/40">{email}</p>
          </div>
          <nav aria-label="Admin" className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto lg:order-2 lg:w-auto">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${isActive(item.href) ? 'bg-paper text-ink' : 'text-paper/70 hover:bg-paper/10 hover:text-paper'}`}
              >
                {item.label}
              </Link>
            ))}
            <span className="mx-1 self-center border-l border-paper/15" aria-hidden />
            {CMS_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${isActive(item.href) ? 'bg-paper text-ink' : 'text-paper/70 hover:bg-paper/10 hover:text-paper'}`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/admin/settings" className={`shrink-0 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${isActive('/admin/settings') ? 'bg-paper text-ink' : 'text-paper/70 hover:bg-paper/10 hover:text-paper'}`}>
              Settings
            </Link>
          </nav>
          <div className="order-2 flex items-center gap-2.5 lg:order-3">
            <div className="group relative">
              <button aria-label={`Notifications${unread ? ` (${unread} unread)` : ''}`} className="relative flex h-9 w-9 items-center justify-center rounded-full border border-paper/25 transition-colors hover:border-paper/50">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 3a6 6 0 0 0-6 6v3.5L4.5 15v1.5h15V15L18 12.5V9a6 6 0 0 0-6-6zM10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {unread > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[9px] text-white">{unread}</span>}
              </button>
              <div className="pointer-events-none absolute right-0 top-full z-50 w-[340px] pt-2 opacity-0 transition-all duration-200 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100">
                <div className="max-h-[380px] overflow-y-auto rounded-xl border border-line bg-surface p-2 text-ink shadow-[0_24px_60px_-20px_rgba(23,25,30,0.3)]">
                  {notifications.length === 0 ? (
                    <p className="px-3 py-4 text-[12.5px] text-faint">No notifications yet.</p>
                  ) : (
                    notifications.slice(0, 15).map((n) => (
                      <div key={n.id} className="rounded-lg px-3 py-2.5 hover:bg-paper">
                        {n.link ? (
                          <Link href={n.link} className="block text-[12.5px] leading-relaxed text-ink">{n.text}</Link>
                        ) : (
                          <p className="text-[12.5px] leading-relaxed text-ink">{n.text}</p>
                        )}
                        <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wide text-faint">{formatDate(n.createdAt)}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <form action={async () => { 'use server'; await logoutAction('admin'); }}>
              <button type="submit" className="rounded-full border border-paper/25 px-4 py-2 text-[12.5px] font-medium text-paper/80 transition-colors hover:border-paper/50 hover:text-paper">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-shell px-6 py-10 md:py-12">{children}</div>
    </main>
  );
}
