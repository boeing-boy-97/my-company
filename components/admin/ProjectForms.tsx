'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createProjectAction, upsertMilestoneAction, sendStudioMessage, updateProjectAction, uploadProjectFile, publishProjectUpdateAction, setActionRequiredAction } from '@/lib/actions';
import { PROJECT_STATUSES, friendlyProjectStatus } from '@/lib/utils';
import type { Client, Project, Milestone } from '@/lib/store';

export function CreateProjectForm({ clients }: { clients: Client[] }) {
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await createProjectAction({ clientId, name, summary });
      if (res.ok && res.id) {
        router.push(`/admin/projects/${res.id}`);
        router.refresh();
      } else setError(res.ok ? 'Something went wrong.' : res.error);
    });
  };

  if (clients.length === 0) {
    return <p className="text-[13.5px] text-soft">Create a <a className="link-underline text-accentdeep" href="/admin/clients?new=1">client record</a> first — projects belong to clients.</p>;
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="np-client" className="mb-1.5 block text-[12.5px] font-medium text-soft">Client *</label>
        <select id="np-client" value={clientId} onChange={(e) => setClientId(e.target.value)} className="field w-full">
          {clients.map((c) => <option key={c.id} value={c.id}>{c.company}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="np-name" className="mb-1.5 block text-[12.5px] font-medium text-soft">Project name *</label>
        <input id="np-name" required value={name} onChange={(e) => setName(e.target.value)} className="field w-full" placeholder="e.g. Aurora CRM — Phase 2" />
      </div>
      <div>
        <label htmlFor="np-summary" className="mb-1.5 block text-[12.5px] font-medium text-soft">Summary</label>
        <textarea id="np-summary" rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} className="field w-full resize-y" placeholder="What this project delivers, in one or two sentences." />
      </div>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">{error}</p>}
      <button type="submit" disabled={isPending} className="rounded-full bg-ink px-6 py-3 text-[13.5px] font-medium text-paper transition-colors hover:bg-coal disabled:opacity-50">
        {isPending ? 'Creating…' : 'Create project'}
      </button>
      <p className="text-[12px] text-faint">Seven standard milestones (discovery → support) are scaffolded automatically.</p>
    </form>
  );
}

export function MilestoneEditor({ projectId, milestones }: { projectId: string; milestones: Milestone[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<{ title: string; detail: string; status: string; progress: string; due: string }>({ title: '', detail: '', status: 'upcoming', progress: '0', due: '' });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const open = (m: Milestone) => {
    setEditingId(m.id);
    setAdding(false);
    setForm({ title: m.title, detail: m.detail, status: m.status, progress: String(m.progress), due: m.due ? m.due.slice(0, 10) : '' });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await upsertMilestoneAction(projectId, {
        ...(editingId ? { id: editingId } : {}),
        title: form.title,
        detail: form.detail,
        status: form.status as Milestone['status'],
        progress: Number(form.progress) || 0,
        due: form.due ? new Date(form.due).toISOString() : '',
      });
      if (res.ok) {
        setEditingId(null);
        setAdding(false);
        router.refresh();
      } else setError(res.error);
    });
  };

  const editing = adding || editingId !== null;

  return (
    <div>
      {editing ? (
        <form onSubmit={submit} className="mb-5 space-y-3 rounded-2xl border border-accent/30 bg-surface p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="ms-title" className="mb-1 block text-[12px] font-medium text-soft">Title *</label>
              <input id="ms-title" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="field w-full text-[13.5px]" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="ms-detail" className="mb-1 block text-[12px] font-medium text-soft">Detail</label>
              <input id="ms-detail" value={form.detail} onChange={(e) => setForm((f) => ({ ...f, detail: e.target.value }))} className="field w-full text-[13.5px]" />
            </div>
            <div>
              <label htmlFor="ms-status" className="mb-1 block text-[12px] font-medium text-soft">Status</label>
              <select id="ms-status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="field w-full text-[13.5px]">
                <option value="upcoming">Upcoming</option>
                <option value="in_progress">In progress</option>
                <option value="blocked">Blocked</option>
                <option value="complete">Complete</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="ms-progress" className="mb-1 block text-[12px] font-medium text-soft">Progress %</label>
                <input id="ms-progress" type="number" min={0} max={100} value={form.progress} onChange={(e) => setForm((f) => ({ ...f, progress: e.target.value }))} className="field w-full text-[13.5px]" />
              </div>
              <div>
                <label htmlFor="ms-due" className="mb-1 block text-[12px] font-medium text-soft">Due date</label>
                <input id="ms-due" type="date" value={form.due} onChange={(e) => setForm((f) => ({ ...f, due: e.target.value }))} className="field w-full text-[13.5px]" />
              </div>
            </div>
          </div>
          {error && <p role="alert" className="text-[12.5px] text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={isPending} className="rounded-full bg-ink px-5 py-2.5 text-[12.5px] font-medium text-paper hover:bg-coal disabled:opacity-50">
              {isPending ? 'Saving…' : 'Save milestone'}
            </button>
            <button type="button" onClick={() => { setEditingId(null); setAdding(false); }} className="rounded-full border border-line px-5 py-2.5 text-[12.5px] font-medium text-soft hover:text-ink">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => { setAdding(true); setEditingId(null); setForm({ title: '', detail: '', status: 'upcoming', progress: '0', due: '' }); }} className="mb-5 rounded-full border border-line bg-surface px-4 py-2 text-[12.5px] font-medium text-ink transition-colors hover:border-accent/50">
          + Add milestone
        </button>
      )}

      <ol className="space-y-3">
        {milestones.map((m) => (
          <li key={m.id} className="rounded-xl border border-line bg-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[14px] font-semibold text-ink">{m.title}</p>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-wide ${m.status === 'complete' ? 'bg-ok/10 text-ok' : m.status === 'in_progress' ? 'bg-accenthalo text-accentdeep' : m.status === 'blocked' ? 'bg-red-50 text-red-600' : 'bg-line text-faint'}`}>
                  {m.status.replace('_', ' ')}
                </span>
                <button onClick={() => open(m)} className="rounded-full border border-line px-3 py-1 font-mono text-[9.5px] uppercase tracking-wide text-soft hover:border-accent/50 hover:text-ink">
                  Edit
                </button>
              </div>
            </div>
            {m.detail && <p className="mt-1.5 text-[12.5px] text-soft">{m.detail}</p>}
            <div className="mt-3 flex items-center gap-3">
              <div className="h-[4px] flex-1 overflow-hidden rounded-full bg-line">
                <div className="h-full rounded-full bg-accent" style={{ width: `${m.progress}%` }} />
              </div>
              <span className="font-mono text-[10px] text-faint">{m.progress}%</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function StudioMessageForm({ projectId }: { projectId: string }) {
  const [body, setBody] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await sendStudioMessage(projectId, body);
      if (res.ok) {
        setBody('');
        router.refresh();
      } else setError(res.error);
    });
  };

  return (
    <form onSubmit={submit} className="space-y-2.5">
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Write an update or answer for the client…" aria-label="Message to client" className="field w-full resize-y text-[13.5px]" />
      {error && <p role="alert" className="text-[12.5px] text-red-600">{error}</p>}
      <button type="submit" disabled={isPending || !body.trim()} className="rounded-full bg-ink px-5 py-2.5 text-[12.5px] font-medium text-paper hover:bg-coal disabled:opacity-50">
        {isPending ? 'Sending…' : 'Send to client'}
      </button>
    </form>
  );
}

export function UpdateNoteForm({ projectId, current }: { projectId: string; current: string }) {
  const [note, setNote] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    startTransition(async () => {
      const res = await updateProjectAction(projectId, { note });
      if (res.ok) {
        setNote('');
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={submit} className="space-y-2.5">
      <p className="text-[12.5px] text-soft">Current: <span className="text-ink">{current}</span></p>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Post a new latest update — clients see this on their dashboard and get a notification." aria-label="Latest update note" className="field w-full resize-y text-[13.5px]" />
      <button type="submit" disabled={isPending || !note.trim()} className="rounded-full bg-ink px-5 py-2.5 text-[12.5px] font-medium text-paper hover:bg-coal disabled:opacity-50">
        {isPending ? 'Posting…' : 'Post update'}
      </button>
    </form>
  );
}

export function ProjectStatusForm({ projectId, project }: { projectId: string; project: Pick<Project, 'status' | 'progress' | 'nextMilestone'> }) {
  const [status, setStatus] = useState(project.status);
  const [progress, setProgress] = useState(String(project.progress));
  const [nextMilestone, setNextMilestone] = useState(project.nextMilestone);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await updateProjectAction(projectId, { status, nextMilestone, progress: Number(progress) || 0 });
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="ps-status" className="mb-1 block text-[12px] font-medium text-soft">Status</label>
          <select id="ps-status" value={status} onChange={(e) => setStatus(e.target.value)} className="field w-full text-[13.5px]">
            {PROJECT_STATUSES.map((st) => <option key={st} value={st}>{friendlyProjectStatus(st)}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="ps-progress" className="mb-1 block text-[12px] font-medium text-soft">Progress %</label>
          <input id="ps-progress" type="number" min={0} max={100} value={progress} onChange={(e) => setProgress(e.target.value)} className="field w-full text-[13.5px]" />
        </div>
      </div>
      <div>
        <label htmlFor="ps-next" className="mb-1 block text-[12px] font-medium text-soft">Next milestone label</label>
        <input id="ps-next" value={nextMilestone} onChange={(e) => setNextMilestone(e.target.value)} className="field w-full text-[13.5px]" />
      </div>
      <button type="submit" disabled={isPending} className="rounded-full bg-ink px-5 py-2.5 text-[12.5px] font-medium text-paper hover:bg-coal disabled:opacity-50">
        {isPending ? 'Saving…' : 'Save project settings'}
      </button>
    </form>
  );
}

export function AdminFileUpload({ projectId }: { projectId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set('projectId', projectId);
      fd.set('file', file);
      const res = await uploadProjectFile(fd);
      if (res.ok) router.refresh();
      else setError(res.error);
      e.target.value = '';
    });
  };

  return (
    <div>
      <label className="cursor-pointer rounded-full border border-line bg-surface px-4 py-2 text-[12.5px] font-medium text-ink transition-colors hover:border-accent/50">
        {isPending ? 'Uploading…' : 'Upload file to project'}
        <input type="file" onChange={onFile} className="sr-only" aria-label="Upload a file to this project" />
      </label>
      {error && <p role="alert" className="mt-2 text-[12.5px] text-red-600">{error}</p>}
    </div>
  );
}


export function PublishUpdateForm({ projectId }: { projectId: string }) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      const res = await publishProjectUpdateAction(projectId, title, note);
      if (res.ok) {
        setTitle('');
        setNote('');
        router.refresh();
      } else setError(res.error || 'Could not publish');
    });
  };

  return (
    <form onSubmit={submit} className="space-y-2.5">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Update title — e.g. “Payments integration passed QA”" aria-label="Update title" className="field w-full text-[13.5px]" />
      <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="What changed and what it means for the client. Shows in their Updates tab." aria-label="Update detail" className="field w-full resize-y text-[13.5px]" />
      {error && <p role="alert" className="text-[12px] text-red-600">{error}</p>}
      <button type="submit" disabled={isPending || !title.trim() || !note.trim()} className="rounded-full bg-ink px-5 py-2.5 text-[12.5px] font-medium text-paper hover:bg-coal disabled:opacity-50">
        {isPending ? 'Publishing…' : 'Publish to client'}
      </button>
    </form>
  );
}

export function ActionRequiredControl({ projectId, current }: { projectId: string; current: { text: string; at: string } | null }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const set = (value: string | null) => {
    setError('');
    startTransition(async () => {
      const res = await setActionRequiredAction(projectId, value);
      if (res.ok) {
        setText('');
        router.refresh();
      } else setError(res.error || 'Could not update');
    });
  };

  return (
    <div className="space-y-2.5">
      {current ? (
        <div className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-3">
          <p className="text-[13px] font-medium text-ink">{current.text}</p>
          <p className="mt-1 font-mono text-[9.5px] uppercase tracking-wide text-faint">Flagged {new Date(current.at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
        </div>
      ) : (
        <p className="text-[12.5px] text-faint">Nothing is currently flagged for the client.</p>
      )}
      {current ? (
        <button onClick={() => set(null)} disabled={isPending} className="rounded-full border border-line px-5 py-2.5 text-[12.5px] font-medium text-soft hover:border-ink/30 hover:text-ink disabled:opacity-50">
          Clear flag
        </button>
      ) : (
        <>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} placeholder="What do you need from the client? They see a prominent banner with an approve button." aria-label="Action required text" className="field w-full resize-y text-[13.5px]" />
          {error && <p role="alert" className="text-[12px] text-red-600">{error}</p>}
          <button onClick={() => set(text)} disabled={isPending || !text.trim()} className="rounded-full bg-accent px-5 py-2.5 text-[12.5px] font-semibold text-white hover:bg-accentdeep disabled:opacity-50">
            {isPending ? 'Setting…' : 'Flag action required'}
          </button>
        </>
      )}
    </div>
  );
}
