import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { listProjects, recentMessages, listFiles, unreadMessageCount, listNotifications, markNotificationsRead } from '@/lib/store';
import PortalShell from '@/components/portal/PortalShell';
import { Badge, EmptyState } from '@/components/ui/primitives';
import { pageSeo } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Client Portal', description: 'Your projects at a glance.', path: '/portal' }), robots: { index: false } };

function statusLabel(status: string) {
  const map: Record<string, { label: string; tone: 'accent' | 'ok' | 'neutral' }> = {
    discovery: { label: 'Discovery', tone: 'neutral' },
    design: { label: 'Design', tone: 'neutral' },
    build: { label: 'In build', tone: 'accent' },
    qa: { label: 'QA', tone: 'accent' },
    live: { label: 'Live', tone: 'ok' },
    paused: { label: 'Paused', tone: 'neutral' },
    complete: { label: 'Complete', tone: 'ok' },
    support: { label: 'Support', tone: 'ok' },
  };
  return map[status] || { label: status, tone: 'neutral' as const };
}

export default async function PortalPage() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'client') redirect('/portal/login');

  const projects = await listProjects(session.clientId);
  const unread = await unreadMessageCount(session.clientId);
  const messages = await recentMessages(session.clientId, 5);
  const files = (await listFiles()).filter((f) => projects.some((p) => p.id === f.projectId)).slice(0, 5);
  const notifications = await listNotifications('client');
  await markNotificationsRead('client');

  return (
    <PortalShell session={session} pathname="/portal" unread={unread}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display-tight font-display text-[clamp(1.8rem,4vw,2.8rem)] font-semibold text-ink">Good to see you.</h1>
          <p className="mt-2 max-w-[540px] text-[14.5px] leading-relaxed text-soft">Everything about your engagement in one place — progress, milestones, messages and files.</p>
        </div>
        <Link href="/start-project" className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-coal">
          + Start a new project
        </Link>
      </div>

      {/* stat row */}
      <div className="mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Active projects', value: String(projects.length) },
          { label: 'Unread messages', value: String(unread) },
          { label: 'Shared files', value: String(files.length) },
          { label: 'Milestones ahead', value: String(projects.reduce((acc, p) => acc + p.milestones.filter((m) => m.status !== 'complete').length, 0)) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-surface p-5">
            <p className="font-display text-[28px] font-semibold leading-none text-ink">{s.value}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-tech text-faint">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        {/* projects */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[17px] font-semibold text-ink">Your projects</h2>
            <Link href="/portal/projects" className="link-underline text-[12.5px] text-faint hover:text-ink">View all →</Link>
          </div>
          {projects.length === 0 ? (
            <div className="mt-5">
              <EmptyState title="No projects yet" body="When your project begins, you’ll see milestones, messages and files here — everything in one place." />
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {projects.map((p) => {
                const st = statusLabel(p.status);
                return (
                  <Link key={p.id} href={`/portal/projects/${p.id}`} className="group block rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_20px_44px_-26px_rgba(23,25,30,0.4)]">
                    <div className="flex items-center justify-between gap-4">
                      <Badge tone={st.tone}>{st.label}</Badge>
                      <span className="font-mono text-[10.5px] text-faint">{p.id.toUpperCase()}</span>
                    </div>
                    <h3 className="display-tight mt-3 font-display text-[18px] font-semibold text-ink transition-colors group-hover:text-accentdeep">{p.name}</h3>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-faint">Progress</span>
                        <span className="font-mono font-semibold text-ink">{p.progress}%</span>
                      </div>
                      <div className="mt-1.5 h-[5px] overflow-hidden rounded-full bg-line">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                    <p className="mt-3.5 border-t border-linedark pt-3.5 text-[12.5px] text-faint">
                      Next: <span className="text-soft">{p.nextMilestone}</span>
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* activity rail */}
        <div className="space-y-8">
          <section>
            <h2 className="font-display text-[17px] font-semibold text-ink">Recent messages</h2>
            {messages.length === 0 ? (
              <p className="mt-4 text-[13px] text-faint">No messages yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {messages.map((m) => (
                  <li key={m.id}>
                    <Link href={`/portal/projects/${m.projectId}`} className="block rounded-xl border border-line bg-surface p-4 transition-colors hover:border-ink/25">
                      <p className="line-clamp-2 text-[13px] leading-relaxed text-ink">{m.body}</p>
                      <p className="mt-2 font-mono text-[9.5px] uppercase tracking-wide text-faint">{m.authorRole === 'client' ? 'You' : 'Studio'} · {m.projectName} · {formatDate(m.createdAt)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="font-display text-[17px] font-semibold text-ink">Recent files</h2>
            {files.length === 0 ? (
              <p className="mt-4 text-[13px] text-faint">No files shared yet.</p>
            ) : (
              <ul className="mt-4 space-y-2.5">
                {files.map((f) => (
                  <li key={f.id} className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-ink">{f.name}</p>
                      <p className="font-mono text-[9.5px] text-faint">{formatDate(f.createdAt)}</p>
                    </div>
                    <a href={`/api/files/${f.id}`} download={f.name} className="ml-3 shrink-0 font-mono text-[9.5px] uppercase tracking-wide text-soft hover:text-ink">↓</a>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/portal/files" className="link-underline mt-3 inline-block text-[12.5px] text-faint hover:text-ink">All files →</Link>
          </section>

          {notifications.length > 0 && (
            <section>
              <h2 className="font-display text-[17px] font-semibold text-ink">Notices</h2>
              <ul className="mt-4 space-y-2">
                {notifications.slice(0, 5).map((n) => (
                  <li key={n.id} className="rounded-xl border border-line bg-paper px-4 py-3 text-[12.5px] leading-relaxed text-soft">
                    {n.text}
                    <span className="mt-1 block font-mono text-[9px] uppercase tracking-wide text-faint">{formatDate(n.createdAt)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
