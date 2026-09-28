'use client';
import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { sendPortalMessage, uploadProjectFile, approveProjectAction } from '@/lib/actions';
import { friendlyProjectStatus } from '@/lib/utils';
import { EmptyState } from '@/components/ui/primitives';
import { formatDate } from '@/lib/utils';
import type { Project, PortalMessage, PortalFile } from '@/lib/store';

const TABS = ['Overview', 'Updates', 'Milestones', 'Messages', 'Files', 'Invoices'] as const;
type Tab = (typeof TABS)[number];

const MILESTONE_LABEL: Record<string, string> = {
  complete: 'Complete',
  in_progress: 'In progress',
  blocked: 'Blocked',
  upcoming: 'Upcoming',
};

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

export default function ProjectTabs({ project, messages, files }: { project: Project; messages: PortalMessage[]; files: PortalFile[] }) {
  const [tab, setTab] = useState<Tab>('Overview');
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [approvalComment, setApprovalComment] = useState('');
  const [approvalError, setApprovalError] = useState('');

  const approve = (label: string) => {
    setApprovalError('');
    startTransition(async () => {
      const res = await approveProjectAction(project.id, label, approvalComment);
      if (res.ok) {
        setApprovalComment('');
        router.refresh();
      } else {
        setApprovalError(res.error || 'Could not record approval');
      }
    });
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    startTransition(async () => {
      const res = await sendPortalMessage(project.id, message);
      if (res.ok) {
        setMessage('');
        router.refresh();
      }
    });
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set('projectId', project.id);
      fd.set('file', file);
      const res = await uploadProjectFile(fd);
      if (res.ok) router.refresh();
      else setUploadError(res.error);
      if (fileInput.current) fileInput.current.value = '';
    });
  };

  return (
    <div>
      <div role="tablist" aria-label="Project sections" className="flex flex-wrap gap-2 border-b border-line pb-0">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-3 text-[14px] font-medium transition-colors ${tab === t ? 'border-accent text-ink' : 'border-transparent text-faint hover:text-soft'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {project.actionRequired && (
        <div role="status" className="mt-6 rounded-2xl border border-accent/40 bg-accent/10 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-tech text-accentdeep">Action required</p>
              <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink">{project.actionRequired.text}</p>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-tech text-faint">Flagged {formatDate(project.actionRequired.at)}</p>
            </div>
            <button
              onClick={() => approve(project.actionRequired!.text)}
              disabled={isPending}
              className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-coal disabled:opacity-60"
            >
              {isPending ? 'Recording…' : 'Approve / confirm'}
            </button>
          </div>
          {approvalError && <p role="alert" className="mt-3 text-[12.5px] text-[#a53223]">{approvalError}</p>}
        </div>
      )}

      <div className="pt-8">
        {tab === 'Overview' && (
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-line bg-surface p-7">
              <p className="label-tech">Latest update</p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink">{project.latestUpdate.note}</p>
              <p className="mt-3 font-mono text-[10.5px] uppercase tracking-tech text-faint">{formatDate(project.latestUpdate.at)}</p>
              <div className="mt-6 border-t border-linedark pt-5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-soft">Overall progress</span>
                  <span className="font-mono font-semibold text-ink">{project.progress}%</span>
                </div>
                <div className="mt-2 h-[6px] overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${project.progress}%` }} />
                </div>
                <p className="mt-4 text-[13px] text-soft">
                  Next milestone: <span className="font-medium text-ink">{project.nextMilestone}</span>
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-line bg-surface p-6">
                <p className="label-tech">Deployment</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="status-dot status-dot-live" />
                  <span className="text-[14px] font-medium capitalize text-ink">{project.deployment.status}</span>
                  <span className="ml-auto rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase text-faint">{project.deployment.env}</span>
                </div>
                <p className="mt-2 font-mono text-[12px] text-soft">{project.deployment.url || '—'}</p>
                <p className="mt-1 text-[11.5px] text-faint">{project.deployment.lastDeploy ? `Last deploy ${formatDate(project.deployment.lastDeploy)}` : 'Not deployed yet'}</p>
              </div>
              <div className="rounded-2xl border border-line bg-surface p-6">
                <p className="label-tech">Current tasks</p>
                {project.tasks.length ? (
                  <ul className="mt-3 space-y-2.5">
                    {project.tasks.map((t) => (
                      <li key={t.id} className="flex items-center gap-2.5 text-[13.5px] text-ink">
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            t.status === 'done' ? 'border-ok/40 bg-ok/10 text-ok' : t.status === 'in-progress' ? 'border-accent/50 text-accent' : 'border-line text-transparent'
                          }`}
                        >
                          {t.status === 'done' && (
                            <svg width="8" height="8" viewBox="0 0 12 12" fill="none" aria-hidden>
                              <path d="M2 6.4 4.8 9 10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                          {t.status === 'in-progress' && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulsedot" />}
                        </span>
                        <span className={t.status === 'done' ? 'text-faint line-through' : ''}>{t.title}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-[13px] text-faint">No active tasks right now.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'Updates' && (
          <div className="space-y-6">
            {project.updates.length === 0 ? (
              <EmptyState title="No updates published yet" body="The studio publishes progress updates here as work moves forward." />
            ) : (
              <ol className="space-y-4">
                {project.updates.map((u) => (
                  <li key={u.id} className="rounded-2xl border border-line bg-surface p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-[16px] font-semibold text-ink">{u.title}</h3>
                      <p className="font-mono text-[10px] uppercase tracking-tech text-faint">{formatDate(u.at)}</p>
                    </div>
                    <p className="mt-2.5 text-[14px] leading-relaxed text-soft">{u.note}</p>
                  </li>
                ))}
              </ol>
            )}

            {/* approvals */}
            <div className="rounded-2xl border border-line bg-surface p-6">
              <p className="label-tech">Your approvals</p>
              {project.approvals.length === 0 ? (
                <p className="mt-3 text-[13px] text-faint">Nothing approved yet. When you confirm something here, it is recorded with your name and timestamp.</p>
              ) : (
                <ul className="mt-3 divide-y divide-linedark">
                  {project.approvals.map((a) => (
                    <li key={a.id} className="py-3">
                      <p className="text-[13.5px] font-medium text-ink">{a.label}</p>
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-faint">
                        {a.approvedBy} · {formatDate(a.approvedAt)}{a.comment ? ` · “${a.comment}”` : ''}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-5 border-t border-linedark pt-5">
                <label htmlFor="approval-label" className="text-[12.5px] font-medium text-ink">Record a different approval</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  <input
                    id="approval-label"
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    placeholder="e.g. Approved homepage design v2"
                    className="min-w-0 flex-1 rounded-full border border-line bg-paper px-4 py-2.5 text-[13px] text-ink placeholder:text-faint focus:border-accent focus:outline-none"
                  />
                  <button
                    onClick={() => approve(approvalComment)}
                    disabled={isPending || !approvalComment.trim()}
                    className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-coal disabled:opacity-50"
                  >
                    Record approval
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'Milestones' && (
          <ol className="space-y-4">
            {project.milestones.map((m) => (
              <li key={m.id} className="rounded-2xl border border-line bg-surface p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-display text-[16px] font-semibold text-ink">{m.title}</p>
                  <span
                    className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wide ${
                      m.status === 'complete'
                        ? 'bg-ok/10 text-ok'
                        : m.status === 'in_progress'
                          ? 'bg-accenthalo text-accentdeep'
                          : m.status === 'blocked'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-line text-faint'
                    }`}
                  >
                    {MILESTONE_LABEL[m.status] || m.status}
                  </span>
                </div>
                {m.detail && <p className="mt-1.5 text-[13.5px] text-soft">{m.detail}</p>}
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-line">
                    <div className={`h-full rounded-full ${m.status === 'in_progress' ? 'bg-accent' : m.status === 'complete' ? 'bg-ok/70' : m.status === 'blocked' ? 'bg-red-400' : 'bg-line'}`} style={{ width: `${m.progress}%` }} />
                  </div>
                  <span className="font-mono text-[11px] text-faint">{m.progress}%</span>
                </div>
                {m.due && <p className="mt-2 font-mono text-[10.5px] uppercase tracking-wide text-faint">Due {formatDate(m.due)}</p>}
              </li>
            ))}
          </ol>
        )}

        {tab === 'Messages' && (
          <div className="max-w-[680px]">
            <div className="space-y-4">
              {messages.length === 0 && <p className="text-[13.5px] text-faint">No messages yet — write the first one below.</p>}
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.authorRole === 'client' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 ${m.authorRole === 'client' ? 'rounded-br-md bg-ink text-paper' : 'rounded-bl-md border border-line bg-surface text-ink'}`}>
                    <p className="whitespace-pre-wrap text-[14px] leading-relaxed">{m.body}</p>
                    <p className={`mt-1.5 font-mono text-[9.5px] uppercase tracking-wide ${m.authorRole === 'client' ? 'text-paper/40' : 'text-faint'}`}>
                      {m.authorName} · {formatDate(m.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={send} className="mt-6 flex items-center gap-2">
              <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write a message to the studio…" aria-label="Message" className="field flex-1" />
              <button type="submit" disabled={isPending || !message.trim()} className="rounded-full bg-ink px-6 py-3 text-[13.5px] font-medium text-paper transition-all hover:bg-coal disabled:opacity-50">
                {isPending ? 'Sending…' : 'Send'}
              </button>
            </form>
          </div>
        )}

        {tab === 'Files' && (
          <div className="max-w-[680px] space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-soft">Shared files — specs, designs, deliverables. PDF, Office, images, CSV, ZIP up to 10 MB.</p>
              <label className="cursor-pointer rounded-full border border-line bg-surface px-4 py-2 text-[12.5px] font-medium text-ink transition-colors hover:border-accent/50">
                Upload file
                <input ref={fileInput} type="file" onChange={onFile} className="sr-only" aria-label="Upload a file" />
              </label>
            </div>
            {isPending && <p className="text-[12.5px] text-faint">Uploading…</p>}
            {uploadError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">{uploadError}</p>}
            {files.length ? (
              files.map((f) => (
                <div key={f.id} className="flex items-center justify-between rounded-xl border border-line bg-surface px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-paper text-soft">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M6 2.5h8L20 8v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-18a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M14 2.5V8h6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-[14px] font-medium text-ink">{f.name}</p>
                      <p className="font-mono text-[10.5px] text-faint">{formatSize(f.size)} · by {f.uploadedBy === 'client' ? 'you' : 'the studio'} · {formatDate(f.createdAt)}</p>
                    </div>
                  </div>
                  <a href={`/api/files/${f.id}`} download={f.name} className="rounded-full border border-line px-4 py-1.5 font-mono text-[10.5px] uppercase tracking-wide text-soft transition-colors hover:border-accent/50 hover:text-ink">
                    Download
                  </a>
                </div>
              ))
            ) : (
              <EmptyState title="No files yet" body="Specs, designs and deliverables will appear here as the project progresses. You can also upload files for the team." />
            )}
          </div>
        )}

        {tab === 'Invoices' && (
          <div className="max-w-[680px]">
            <EmptyState
              title="Invoices — coming soon"
              body="Billing documents and payment history will be managed here. This module is scaffolded and will activate with your first invoice."
            />
          </div>
        )}
      </div>
    </div>
  );
}
