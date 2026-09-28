import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { listProjects, unreadMessageCount } from '@/lib/store';
import PortalShell from '@/components/portal/PortalShell';
import { Badge, EmptyState } from '@/components/ui/primitives';
import { pageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Projects — Client Portal', description: 'All projects.', path: '/portal' }), robots: { index: false } };

const STATUS_LABEL: Record<string, { label: string; tone: 'accent' | 'ok' | 'neutral' }> = {
  planning: { label: 'Planning', tone: 'neutral' },
  in_progress: { label: 'In progress', tone: 'accent' },
  blocked: { label: 'Waiting on something', tone: 'neutral' },
  in_review: { label: 'In review', tone: 'accent' },
  ready_to_launch: { label: 'Ready to launch', tone: 'accent' },
  live: { label: 'Live', tone: 'ok' },
  completed: { label: 'Completed', tone: 'ok' },
  on_hold: { label: 'On hold', tone: 'neutral' },
  archived: { label: 'Archived', tone: 'neutral' },
};

export default async function PortalProjectsPage() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'client') redirect('/portal/login');

  const projects = await listProjects(session.clientId);
  const unread = await unreadMessageCount(session.clientId);

  return (
    <PortalShell session={session} pathname="/portal/projects" unread={unread}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-tech">Projects</p>
          <h1 className="display-tight mt-2 font-display text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold text-ink">Everything we’re building together.</h1>
        </div>
        <Link href="/start-project" className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-coal">+ Start a new project</Link>
      </div>

      {projects.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="No projects yet" body="Once a project starts, it will appear here with milestones, messages and files." />
        </div>
      ) : (
        <div className="mt-9 grid gap-5 md:grid-cols-2">
          {projects.map((p) => {
            const st = STATUS_LABEL[p.status] || { label: p.status, tone: 'neutral' as const };
            const done = p.milestones.filter((m) => m.status === 'complete').length;
            return (
              <Link key={p.id} href={`/portal/projects/${p.id}`} className="group rounded-2xl border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_20px_44px_-26px_rgba(23,25,30,0.4)]">
                <div className="flex items-center justify-between gap-4">
                  <Badge tone={st.tone}>{st.label}</Badge>
                  <span className="font-mono text-[10.5px] text-faint">{done}/{p.milestones.length} milestones</span>
                </div>
                <h2 className="display-tight mt-4 font-display text-[20px] font-semibold text-ink transition-colors group-hover:text-accentdeep">{p.name}</h2>
                <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-soft">{p.summary}</p>
                <div className="mt-5">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-faint">Progress</span>
                    <span className="font-mono font-semibold text-ink">{p.progress}%</span>
                  </div>
                  <div className="mt-1.5 h-[5px] overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
                <p className="mt-4 border-t border-linedark pt-4 text-[12.5px] text-faint">Next: <span className="text-soft">{p.nextMilestone}</span></p>
              </Link>
            );
          })}
        </div>
      )}
    </PortalShell>
  );
}
