'use client';
import { useState, useTransition } from 'react';
import { updateLeadStatusAction, saveLeadNoteAction, assignLeadOwnerAction } from '@/lib/actions';

const STATUSES = ['new', 'contacted', 'qualified', 'discovery', 'proposal', 'negotiation', 'won', 'lost'];

export function StatusControl({ leadId, current }: { leadId: string; current: string }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const set = (status: string) => {
    setSaved(false);
    startTransition(async () => {
      await updateLeadStatusAction(leadId, status);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    });
  };

  return (
    <div>
      <p className="label-tech mb-3">Pipeline status</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Set lead status">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => set(s)}
            disabled={isPending}
            aria-pressed={current === s}
            className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-wide transition-all disabled:opacity-50 ${
              current === s ? 'border-ink bg-ink text-paper' : 'border-line bg-surface text-soft hover:border-ink/30'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <p aria-live="polite" className={`mt-2 text-[12px] text-ok transition-opacity ${saved ? 'opacity-100' : 'opacity-0'}`}>
        Status saved ✓
      </p>
    </div>
  );
}

export function NotesEditor({ leadId, initial }: { leadId: string; initial: string }) {
  const [note, setNote] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(false);
    startTransition(async () => {
      await saveLeadNoteAction(leadId, note);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor="lead-notes" className="label-tech">
          Internal notes
        </label>
        <span aria-live="polite" className={`text-[12px] text-ok transition-opacity ${saved ? 'opacity-100' : 'opacity-0'}`}>
          Saved ✓
        </span>
      </div>
      <textarea id="lead-notes" value={note} onChange={(e) => setNote(e.target.value)} rows={6} placeholder="Qualification notes, call summaries, next steps…" className="field mt-3 resize-y text-[13.5px]" />
      <button onClick={save} disabled={isPending} className="mt-3 rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-coal disabled:opacity-50">
        {isPending ? 'Saving…' : 'Save Notes'}
      </button>
    </div>
  );
}

export function OwnerControl({ leadId, current }: { leadId: string; current: string }) {
  const [owner, setOwner] = useState(current);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(false);
    startTransition(async () => {
      await assignLeadOwnerAction(leadId, owner);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    });
  };

  return (
    <div>
      <label htmlFor="lead-owner" className="label-tech mb-3 block">Assigned to</label>
      <div className="flex gap-2">
        <input id="lead-owner" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Unassigned" className="field flex-1 text-[13.5px]" />
        <button onClick={save} disabled={isPending} className="rounded-full border border-line px-4 py-2 text-[12.5px] font-medium text-soft transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-50">
          {isPending ? '…' : 'Assign'}
        </button>
      </div>
      <p aria-live="polite" className={`mt-2 text-[12px] text-ok transition-opacity ${saved ? 'opacity-100' : 'opacity-0'}`}>
        Assignment saved ✓
      </p>
    </div>
  );
}
