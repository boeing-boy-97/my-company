'use client';
import { useState, useTransition } from 'react';
import { saveSettingsAction } from '@/lib/actions';

export default function SettingsForm({ initial }: { initial: { contactEmail: string; phone: string; whatsapp: string; hours: string } }) {
  const [form, setForm] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaved(false);
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await saveSettingsAction(form);
      if (res.ok) setSaved(true);
      else setError(res.error);
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="st-email" className="mb-1.5 block text-[12.5px] font-medium text-soft">Contact email</label>
          <input id="st-email" type="email" value={form.contactEmail} onChange={set('contactEmail')} className="field w-full" />
        </div>
        <div>
          <label htmlFor="st-phone" className="mb-1.5 block text-[12.5px] font-medium text-soft">Phone</label>
          <input id="st-phone" value={form.phone} onChange={set('phone')} className="field w-full" />
        </div>
        <div>
          <label htmlFor="st-whatsapp" className="mb-1.5 block text-[12.5px] font-medium text-soft">WhatsApp</label>
          <input id="st-whatsapp" value={form.whatsapp} onChange={set('whatsapp')} className="field w-full" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="st-hours" className="mb-1.5 block text-[12.5px] font-medium text-soft">Business hours</label>
          <input id="st-hours" value={form.hours} onChange={set('hours')} className="field w-full" />
        </div>
      </div>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">{error}</p>}
      {saved && <p role="status" className="rounded-lg border border-ok/30 bg-ok/5 px-4 py-2.5 text-[13px] text-ok">Settings saved ✓ — footer and contact page now use these values.</p>}
      <button type="submit" disabled={isPending} className="rounded-full bg-ink px-6 py-3 text-[13.5px] font-medium text-paper transition-colors hover:bg-coal disabled:opacity-50">
        {isPending ? 'Saving…' : 'Save settings'}
      </button>
    </form>
  );
}
