import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { getProject, getProjectMessages, markProjectMessagesRead, listFiles, friendlyProjectStatus } from '@/lib/store';
import ProjectTabs from '@/components/portal/ProjectTabs';
import { Badge } from '@/components/ui/primitives';
import { pageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Project', description: 'Project workspace.', path: '/portal' }), robots: { index: false } };

export default async function PortalProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'client') redirect('/portal/login');

  const { id } = await params;
  const project = await getProject(id);
  // Server-side ownership check — the URL alone grants no access.
  if (!project || (session.clientId && project.clientId !== session.clientId)) notFound();

  const [messages, files] = await Promise.all([getProjectMessages(project.id), listFiles(project.id)]);
  await markProjectMessagesRead(project.id, 'client');

  return (
    <main className="min-h-screen bg-paper">
      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-shell items-center justify-between px-6 py-5">
          <Link href="/portal/projects" className="link-underline text-[13.5px] font-medium text-soft hover:text-ink">
            ← All projects
          </Link>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-tech text-faint">
              <span className="status-dot status-dot-live" /> {project.deployment.env} · {project.deployment.status}
            </span>
            <Badge tone="accent">{friendlyProjectStatus(project.status)}</Badge>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-shell px-6 py-12 md:py-16">
        <h1 className="display-tight font-display text-[clamp(1.8rem,4vw,2.8rem)] font-semibold text-ink">{project.name}</h1>
        <p className="mt-3 max-w-[680px] text-[15.5px] leading-[1.7] text-soft">{project.summary}</p>
        <div className="mt-10">
          <ProjectTabs project={project} messages={messages} files={files} />
        </div>
      </div>
    </main>
  );
}
