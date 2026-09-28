import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { listProjects, listClients, getClient } from '@/lib/store';
import AdminShell from '@/components/admin/AdminShell';
import { CreateProjectForm } from '@/components/admin/ProjectForms';
import { EmptyState } from '@/components/ui/primitives';
import { formatDate } from '@/lib/utils';
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

  const rows = await Promise.all(projects.map(async (p) => ({ ...p, client: await clientName(p.clientId) })));

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
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-line">
                {['Project', 'Client', 'Status', 'Progress', 'Milestones', 'Next', 'Started'].map((h) => (
                  <th key={h} className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-tech text-faint">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const done = p.milestones.filter((m) => m.status === 'complete').length;
                return (
                  <tr key={p.id} className="border-b border-line last:border-0 hover:bg-paper">
                    <td className="px-5 py-4">
                      <Link href={`/admin/projects/${p.id}`} className="link-underline text-[13.5px] font-medium text-ink">{p.name}</Link>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-soft">{p.client}</td>
                    <td className="px-5 py-4"><span className="rounded-full border border-line px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-wide text-soft">{p.status}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-[4px] w-20 overflow-hidden rounded-full bg-line">
                          <div className="h-full rounded-full bg-accent" style={{ width: `${p.progress}%` }} />
                        </div>
                        <span className="font-mono text-[10.5px] text-faint">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-[11.5px] text-soft">{done}/{p.milestones.length}</td>
                    <td className="max-w-[180px] truncate px-5 py-4 text-[12.5px] text-soft">{p.nextMilestone}</td>
                    <td className="px-5 py-4 font-mono text-[10.5px] text-faint">{formatDate(p.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
