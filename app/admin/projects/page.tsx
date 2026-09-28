import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { listProjects, listClients, getClient, friendlyProjectStatus, PROJECT_STATUSES } from '@/lib/store';
import AdminShell from '@/components/admin/AdminShell';
import { CreateProjectForm } from '@/components/admin/ProjectForms';
import ProjectsTable from '@/components/admin/ProjectsTable';
import { EmptyState } from '@/components/ui/primitives';
import { pageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Admin — Projects', description: 'Project delivery.', path: '/admin' }), robots: { index: false } };

export default async function AdminProjectsPage({ searchParams }: { searchParams: Promise<{ new?: string }> }) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'admin') redirect('/admin/login');

  const { new: isNew } = await searchParams;
  const [projects, clients] = await Promise.all([listProjects(), listClients()]);
  const clientName = async (id: string) => (await getClient(id))?.company || '—';

  if (isNew) {
    return (
      <AdminShell email={session.email} pathname="/admin/projects">
        <div className="max-w-[640px]">
          <Link href="/admin/projects" className="link-underline text-[13px] font-medium text-soft hover:text-ink">← All projects</Link>
          <h1 className="display-tight mt-3 font-display text-[clamp(1.6rem,3.4vw,2.3rem)] font-semibold text-ink">New project</h1>
          <div className="mt-7 rounded-2xl border border-line bg-surface p-7">
            <CreateProjectForm clients={clients} />
          </div>
        </div>
      </AdminShell>
    );
  }

  const rows = await Promise.all(projects.map(async (p) => ({
    id: p.id,
    name: p.name,
    client: await clientName(p.clientId),
    status: p.status,
    friendlyStatus: friendlyProjectStatus(p.status),
    progress: p.progress,
    milestonesDone: p.milestones.filter((m) => m.status === 'complete').length,
    milestonesTotal: p.milestones.length,
    nextMilestone: p.nextMilestone,
    createdAt: p.createdAt,
  })));
  const statuses = PROJECT_STATUSES.map((s) => ({ value: s, label: friendlyProjectStatus(s) }));

  return (
    <AdminShell email={session.email} pathname="/admin/projects">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-tech">Delivery</p>
          <h1 className="display-tight mt-2 font-display text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold text-ink">Projects</h1>
        </div>
        <Link href="/admin/projects?new=1" className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-coal">+ New project</Link>
      </div>

      {rows.length === 0 ? (
        <div className="mt-9">
          <EmptyState title="No projects yet" body="Create a project for a client — seven standard milestones are scaffolded automatically." />
        </div>
      ) : (
        <ProjectsTable rows={rows} statuses={statuses} />
      )}
    </AdminShell>
  );
}
