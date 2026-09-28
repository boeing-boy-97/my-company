import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { getProject, getClient, getProjectMessages, listFiles, friendlyProjectStatus } from '@/lib/store';
import { deleteProjectFileAction } from '@/lib/actions';
import AdminShell from '@/components/admin/AdminShell';
import { MilestoneEditor, StudioMessageForm, UpdateNoteForm, ProjectStatusForm, AdminFileUpload, PublishUpdateForm, ActionRequiredControl } from '@/components/admin/ProjectForms';
import { Badge } from '@/components/ui/primitives';
import { formatDate } from '@/lib/utils';
import { pageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Admin — Project', description: 'Project delivery.', path: '/admin' }), robots: { index: false } };

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

export default async function AdminProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'admin') redirect('/admin/login');

  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const client = await getClient(project.clientId);
  const [messages, files] = await Promise.all([getProjectMessages(project.id), listFiles(project.id)]);

  return (
    <AdminShell email={session.email} pathname="/admin/projects">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/projects" className="link-underline text-[13px] font-medium text-soft hover:text-ink">← All projects</Link>
          <h1 className="display-tight mt-3 font-display text-[clamp(1.6rem,3.4vw,2.3rem)] font-semibold text-ink">{project.name}</h1>
          <p className="mt-1.5 text-[13.5px] text-faint">
            {client?.company || 'Unknown client'} · started {formatDate(project.createdAt)}
          </p>
        </div>
        <Badge tone="accent">{friendlyProjectStatus(project.status)}</Badge>
      </div>

      <div className="mt-9 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        {/* milestones */}
        <section>
          <h2 className="font-display text-[17px] font-semibold text-ink">Milestones</h2>
          <p className="mb-4 mt-1 text-[12.5px] text-faint">Changes here appear instantly in the client portal, with a notification.</p>
          <MilestoneEditor projectId={project.id} milestones={project.milestones} />
        </section>

        <div className="space-y-8">
          <section className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-[15.5px] font-semibold text-ink">Project settings</h2>
            <div className="mt-4">
              <ProjectStatusForm projectId={project.id} project={project} />
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-[15.5px] font-semibold text-ink">Publish an update</h2>
            <p className="mb-3 mt-1 text-[12px] text-faint">Shows in the client’s Updates tab with a notification.</p>
            <PublishUpdateForm projectId={project.id} />
            {project.updates.length > 0 && (
              <ul className="mt-4 space-y-2 border-t border-line pt-4">
                {project.updates.slice(0, 4).map((u) => (
                  <li key={u.id} className="text-[12.5px] text-soft">
                    <span className="font-medium text-ink">{u.title}</span> · {formatDate(u.at)}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-[15.5px] font-semibold text-ink">Action required</h2>
            <p className="mb-3 mt-1 text-[12px] text-faint">Flag something the client must confirm — they get a banner with an approve button.</p>
            <ActionRequiredControl projectId={project.id} current={project.actionRequired} />
          </section>

          <section className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-[15.5px] font-semibold text-ink">Dashboard “latest update” line</h2>
            <div className="mt-4">
              <UpdateNoteForm projectId={project.id} current={project.latestUpdate.note} />
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-[15.5px] font-semibold text-ink">Message the client</h2>
            <div className="mt-4">
              <StudioMessageForm projectId={project.id} />
            </div>
            <div className="mt-5 space-y-3 border-t border-line pt-5">
              {messages.length === 0 && <p className="text-[12.5px] text-faint">No messages yet.</p>}
              {messages.slice(-6).map((m) => (
                <div key={m.id} className={`rounded-xl px-4 py-3 ${m.authorRole === 'studio' ? 'bg-ink text-paper' : 'border border-line bg-paper text-ink'}`}>
                  <p className="whitespace-pre-wrap text-[13px] leading-relaxed">{m.body}</p>
                  <p className={`mt-1 font-mono text-[9px] uppercase tracking-wide ${m.authorRole === 'studio' ? 'text-paper/40' : 'text-faint'}`}>{m.authorName} · {formatDate(m.createdAt)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-[15.5px] font-semibold text-ink">Files</h2>
              <AdminFileUpload projectId={project.id} />
            </div>
            <ul className="mt-4 space-y-2.5">
              {files.length === 0 && <li className="text-[12.5px] text-faint">No files in this project yet.</li>}
              {files.map((f) => (
                <li key={f.id} className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-ink">{f.name}</p>
                    <p className="font-mono text-[9.5px] text-faint">{formatSize(f.size)} · {f.uploadedBy} · {formatDate(f.createdAt)}</p>
                  </div>
                  <div className="ml-3 flex shrink-0 items-center gap-2">
                    <a href={`/api/files/${f.id}`} download={f.name} className="font-mono text-[9.5px] uppercase tracking-wide text-soft hover:text-ink">↓</a>
                    <form action={async () => { 'use server'; await deleteProjectFileAction(f.id); }}>
                      <button type="submit" className="font-mono text-[9.5px] uppercase tracking-wide text-red-500 hover:text-red-700">✕</button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
