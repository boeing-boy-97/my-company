import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { listLeads, leadCounts, listProjects, listClients, unreadMessageCount, listContacts, listApplications } from '@/lib/store';
import AdminShell from '@/components/admin/AdminShell';
import { formatDate } from '@/lib/utils';
import { pageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Admin — Dashboard', description: 'Back office.', path: '/admin' }), robots: { index: false } };

export default async function AdminPage() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'admin') redirect('/admin/login');

  const [leads, counts, projects, clients, unread, contacts, applications] = await Promise.all([
    listLeads(), leadCounts(), listProjects(), listClients(), unreadMessageCount(), listContacts(), listApplications(),
  ]);

  const activeProjects = projects.filter((p) => !['complete', 'paused', 'cancelled'].includes(p.status));
  const upcomingMilestones = projects.flatMap((p) => p.milestones.filter((m) => m.status !== 'complete').map((m) => ({ ...m, projectId: p.id, projectName: p.name })));
  const awaitingReply = leads.filter((l) => ['new', 'contacted', 'qualified'].includes(l.status)).length;

  const stats = [
    { label: 'New leads', value: counts.new || 0, href: '/admin/leads', note: `${leads.length} total` },
    { label: 'Active projects', value: activeProjects.length, href: '/admin/projects', note: `${projects.length} all time` },
    { label: 'Awaiting response', value: awaitingReply, href: '/admin/leads', note: 'leads in early stages' },
    { label: 'Milestones ahead', value: upcomingMilestones.length, href: '/admin/projects', note: 'across all projects' },
    { label: 'Unread messages', value: unread, href: '/admin/projects', note: 'from clients' },
  ];

  const upcoming = upcomingMilestones.sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999')).slice(0, 6);

  return (
    <AdminShell email={session.email} pathname="/admin">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-tech">Dashboard</p>
          <h1 className="display-tight mt-2 font-display text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold text-ink">The state of the studio.</h1>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/admin/clients?new=1" className="rounded-full border border-line bg-surface px-5 py-2.5 text-[13px] font-medium text-ink transition-colors hover:border-accent/50">+ Client</Link>
          <Link href="/admin/projects?new=1" className="rounded-full border border-line bg-surface px-5 py-2.5 text-[13px] font-medium text-ink transition-colors hover:border-accent/50">+ Project</Link>
          <Link href="/start-project" className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-coal">Test intake form</Link>
        </div>
      </div>

      {/* stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group rounded-2xl border border-line bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/25">
            <p className="font-display text-[30px] font-semibold leading-none text-ink">{s.value}</p>
            <p className="mt-2.5 font-mono text-[10px] uppercase tracking-tech text-faint">{s.label}</p>
            <p className="mt-1 text-[11.5px] text-faint">{s.note}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
        {/* latest leads table */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[17px] font-semibold text-ink">Latest leads</h2>
            <Link href="/admin/leads" className="link-underline text-[12.5px] text-faint hover:text-ink">All leads →</Link>
          </div>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-line">
                  {['Ref', 'Contact', 'Company', 'Budget', 'Status', 'Date'].map((h) => (
                    <th key={h} className="px-4 py-3 font-mono text-[10px] uppercase tracking-tech text-faint">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-[13px] text-faint">No leads yet — they’ll appear the moment the intake form is used.</td></tr>
                ) : (
                  leads.slice(0, 8).map((l) => (
                    <tr key={l.id} className="border-b border-line last:border-0 hover:bg-paper">
                      <td className="px-4 py-3">
                        <Link href={`/admin/leads/${l.id}`} className="link-underline font-mono text-[11.5px] text-accentdeep">{l.reference}</Link>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-ink">{l.contactName || '—'}</td>
                      <td className="px-4 py-3 text-[13px] text-soft">{l.companyName || '—'}</td>
                      <td className="px-4 py-3 text-[12.5px] text-soft">{l.budgetRange !== 'Not shared yet' ? `${l.budgetRange} ${l.currency}` : '—'}</td>
                      <td className="px-4 py-3"><span className="rounded-full border border-line px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-wide text-soft">{l.status}</span></td>
                      <td className="px-4 py-3 font-mono text-[10.5px] text-faint">{formatDate(l.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* upcoming milestones */}
          <div className="mt-9 flex items-center justify-between">
            <h2 className="font-display text-[17px] font-semibold text-ink">Upcoming milestones</h2>
            <Link href="/admin/projects" className="link-underline text-[12.5px] text-faint hover:text-ink">Projects →</Link>
          </div>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-line">
                  {['Milestone', 'Project', 'Status', 'Due'].map((h) => (
                    <th key={h} className="px-4 py-3 font-mono text-[10px] uppercase tracking-tech text-faint">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {upcoming.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-[13px] text-faint">No open milestones.</td></tr>
                ) : (
                  upcoming.map((m) => (
                    <tr key={m.id} className="border-b border-line last:border-0 hover:bg-paper">
                      <td className="px-4 py-3">
                        <Link href={`/admin/projects/${m.projectId}`} className="link-underline text-[13px] font-medium text-ink">{m.title}</Link>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-soft">{m.projectName}</td>
                      <td className="px-4 py-3"><span className="rounded-full border border-line px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-wide text-soft">{m.status.replace('_', ' ')}</span></td>
                      <td className="px-4 py-3 font-mono text-[10.5px] text-faint">{m.due ? formatDate(m.due) : '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* rail: inbox + content health */}
        <div className="space-y-8">
          <section className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-[16px] font-semibold text-ink">Inbox</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/admin/inbox" className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3 transition-colors hover:border-ink/25">
                  <span className="text-[13px] text-soft">Contact messages {contacts.length > 0 && <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accentdeep">inbox</span>}</span>
                  <span className="font-mono text-[13px] font-semibold text-ink">{contacts.length} →</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/applications" className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3 transition-colors hover:border-ink/25">
                  <span className="text-[13px] text-soft">Job applications {applications.length > 0 && <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accentdeep">inbox</span>}</span>
                  <span className="font-mono text-[13px] font-semibold text-ink">{applications.length} →</span>
                </Link>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3">
                <span className="text-[13px] text-soft">Clients</span>
                <span className="font-mono text-[13px] font-semibold text-ink">{clients.length}</span>
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-[16px] font-semibold text-ink">Quick actions</h2>
            <div className="mt-4 grid gap-2.5">
              {[
                { label: 'Review pipeline', href: '/admin/leads' },
                { label: 'Manage projects', href: '/admin/projects' },
                { label: 'Add a client', href: '/admin/clients?new=1' },
                { label: 'Edit case studies', href: '/admin/case-studies' },
                { label: 'Publish an insight', href: '/admin/insights' },
                { label: 'Site settings', href: '/admin/settings' },
              ].map((a) => (
                <Link key={a.href + a.label} href={a.href} className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3 text-[13px] font-medium text-ink transition-colors hover:border-accent/40">
                  {a.label}
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden className="text-faint">
                    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-dashed border-line p-6">
            <p className="font-mono text-[10px] uppercase tracking-tech text-faint">Development data</p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-soft">
              The demo project and demo portal account are sample data for evaluating this platform. Replace with real records before going live.
            </p>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
