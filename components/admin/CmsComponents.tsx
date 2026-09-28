'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { cmsSaveAction, cmsDeleteAction } from '@/lib/actions';
import { cmsFields, formToRecord, type CmsKind } from '@/lib/cmsFields';

export function DeleteCmsButton({ kind, id, label }: { kind: string; id: string; label: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(`Delete “${label}” permanently? This cannot be undone. Consider archiving instead.`)) return;
        startTransition(async () => {
          await cmsDeleteAction(kind, id);
          router.refresh();
        });
      }}
      className="rounded-full border border-red-200 px-3.5 py-1.5 font-mono text-[9.5px] uppercase tracking-wide text-red-600 transition-colors hover:border-red-400 disabled:opacity-50"
    >
      Delete
    </button>
  );
}

export function CmsEditorForm({ kind, initial, recordId, backHref }: { kind: CmsKind; initial: Record<string, string>; recordId?: string; backHref: string }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setSaved(false);
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const submit = (e: React.FormEvent, publishAfter?: boolean) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const record = formToRecord(kind, form);
      if (publishAfter) record.status = 'published';
      if (recordId) record.id = recordId;
      const res = await cmsSaveAction(kind, record as Record<string, unknown>);
      if (res.ok) {
        setSaved(true);
        router.refresh();
      } else setError(res.error);
    });
  };

  const fields = cmsFields[kind];

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const id = `f-${field.key}`;
          const common = { id, value: form[field.key] ?? '', disabled: isPending };
          if (field.type === 'checkbox') {
            return (
              <label key={field.key} htmlFor={id} className="flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3">
                <input id={id} type="checkbox" checked={(form[field.key] ?? '') === '1'} onChange={(e) => { setSaved(false); setForm((f) => ({ ...f, [field.key]: e.target.checked ? '1' : '' })); }} disabled={isPending} className="h-4 w-4 accent-[#E4572E]" />
                <span className="text-[13px] font-medium text-ink">{field.label}</span>
              </label>
            );
          }
          const wrap = (
            <div key={field.key} className={field.full ? 'sm:col-span-2' : ''}>
              <label htmlFor={id} className="mb-1.5 block text-[12.5px] font-medium text-soft">
                {field.label}
                {field.hint && <span className="ml-2 font-normal text-faint">— {field.hint}</span>}
              </label>
              {field.type === 'textarea' || field.type === 'lines' || field.type === 'sections' || field.type === 'stats' ? (
                <textarea {...common} onChange={set(field.key)} rows={field.type === 'textarea' ? 3 : field.type === 'lines' ? 5 : 9} className="field w-full resize-y text-[13.5px]" />
              ) : field.type === 'select' ? (
                <select {...common} onChange={set(field.key)} className="field w-full text-[13.5px]">
                  {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : field.type === 'date' ? (
                <input {...common} type="date" onChange={set(field.key)} className="field w-full text-[13.5px]" />
              ) : (
                <input {...common} onChange={set(field.key)} className="field w-full text-[13.5px]" />
              )}
            </div>
          );
          return wrap;
        })}
      </div>

      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">{error}</p>}
      {saved && <p role="status" className="rounded-lg border border-ok/30 bg-ok/5 px-4 py-2.5 text-[13px] text-ok">Saved ✓</p>}

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
        <button type="submit" disabled={isPending} className="rounded-full bg-ink px-6 py-3 text-[13px] font-medium text-paper transition-colors hover:bg-coal disabled:opacity-50">
          {isPending ? 'Saving…' : 'Save'}
        </button>
        {form.status !== 'published' && (
          <button type="button" disabled={isPending} onClick={(e) => submit(e as unknown as React.FormEvent, true)} className="rounded-full border border-accent/40 px-6 py-3 text-[13px] font-medium text-accentdeep transition-colors hover:bg-accenthalo disabled:opacity-50">
            Save & publish
          </button>
        )}
        <button type="button" onClick={() => router.push(backHref)} className="rounded-full border border-line px-6 py-3 text-[13px] font-medium text-soft transition-colors hover:text-ink">
          Back to list
        </button>
      </div>
    </form>
  );
}
