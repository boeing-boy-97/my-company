import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { listProjects, unreadMessageCount } from '@/lib/store';
import PortalShell from '@/components/portal/PortalShell';
import { EmptyState } from '@/components/ui/primitives';
import { pageSeo } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Milestones — Client Portal', description: 'Milestones across your projects.', path: '/portal' }), robots: { index: false } };

const LABEL: Record<string, { text: string; cls: string }> = {
  complete: { text: 'Complete', cls: 'bg-ok/10 text-ok' },
  in_progress: { text: 'In progress', cls: 'bg-accenthalo text-accentdeep' },
  blocked: { text: 'Blocked', cls: 'bg-red-50 text-red-600' },
  upcoming: { text: 'Upcoming', cls: 'bg-line text-faint' },
};

export default async function PortalMilestonesPage() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'client') redirect('/portal/login');

  const projects = await listProjects(session.clientId);
  const unread = await unreadMessageCount(session.clientId);
  const rows = projects
    .flatMap((p) => p.milestones.map((m) => ({ ...m, projectId: p.id, projectName: p.name })))
    .sort((a, b) => {
      const order = { blocked: 0, in_progress: 1, upcoming: 2, complete: 3 } as Record<string, number>;
      return (order[a.status] ?? 4) - (order[b.status] ?? 4);
    });

  return (
    <PortalShell session={session} pathname="/portal/milestones" unread={unread}>
      <p className="label-tech">Milestones</p>
      <h1 className="display-tight mt-2 font-display text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold text-ink">Where things stand.</h1>
      <p className="mt-2 max-w-[560px] text-[14px] leading-relaxed text-soft">Every milestone across your projects, sorted so the active work is at the top.</p>

      {rows.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="No milestones yet" body="Milestones appear as soon as a project plan is in place." />
        </div>
      ) : (
        <div className="mt-9 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-line">
                {['Milestone', 'Project', 'Status', 'Progress', 'Due'].map((h) => (
                  <th key={h} className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-tech text-faint">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-4">
                    <Link href={`/portal/projects/${m.projectId}`} className="link-underline text-[13.5px] font-medium text-ink">{m.title}</Link>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-soft">{m.projectName}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-wide ${(LABEL[m.status] || LABEL.upcoming).cls}`}>{(LABEL[m.status] || LABEL.upcoming).text}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-[4px] w-24 overflow-hidden rounded-full bg-line">
                        <div className={`h-full rounded-full ${m.status === 'complete' ? 'bg-ok/70' : m.status === 'blocked' ? 'bg-red-400' : 'bg-accent'}`} style={{ width: `${m.progress}%` }} />
                      </div>
                      <span className="font-mono text-[10.5px] text-faint">{m.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-faint">{m.due ? formatDate(m.due) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PortalShell>
  );
}
