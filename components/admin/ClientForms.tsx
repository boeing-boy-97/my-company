'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClientAction, updateClientAction } from '@/lib/actions';
import type { Client } from '@/lib/store';

export function ClientForm({ client, defaultCompany }: { client?: Client; defaultCompany?: string }) {
  const [form, setForm] = useState({
    company: client?.company || defaultCompany || '',
    contactName: client?.contactName || '',
    email: client?.email || '',
    phone: client?.phone || '',
    country: client?.country || '',
    currency: client?.currency || 'USD',
    notes: client?.notes || '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = client ? await updateClientAction(client.id, form) : await createClientAction(form);
      if (res.ok) {
        router.push('/admin/clients');
        router.refresh();
      } else setError(res.error);
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="cf-company" className="mb-1.5 block text-[12.5px] font-medium text-soft">Company *</label>
          <input id="cf-company" required value={form.company} onChange={set('company')} className="field w-full" placeholder="Aurora Retail Group" />
        </div>
        <div>
          <label htmlFor="cf-contact" className="mb-1.5 block text-[12.5px] font-medium text-soft">Contact name</label>
          <input id="cf-contact" value={form.contactName} onChange={set('contactName')} className="field w-full" />
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-[12.5px] font-medium text-soft">Email</label>
          <input id="cf-email" type="email" value={form.email} onChange={set('email')} className="field w-full" />
        </div>
        <div>
          <label htmlFor="cf-phone" className="mb-1.5 block text-[12.5px] font-medium text-soft">Phone</label>
          <input id="cf-phone" value={form.phone} onChange={set('phone')} className="field w-full" />
        </div>
        <div>
          <label htmlFor="cf-country" className="mb-1.5 block text-[12.5px] font-medium text-soft">Country</label>
          <input id="cf-country" value={form.country} onChange={set('country')} className="field w-full" />
        </div>
        <div>
          <label htmlFor="cf-currency" className="mb-1.5 block text-[12.5px] font-medium text-soft">Billing currency</label>
          <select id="cf-currency" value={form.currency} onChange={set('currency')} className="field w-full">
            {['USD', 'INR', 'EUR', 'GBP', 'AED'].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cf-notes" className="mb-1.5 block text-[12.5px] font-medium text-soft">Notes</label>
          <textarea id="cf-notes" rows={3} value={form.notes} onChange={set('notes')} className="field w-full resize-y" />
        </div>
      </div>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">{error}</p>}
      <button type="submit" disabled={isPending} className="rounded-full bg-ink px-6 py-3 text-[13.5px] font-medium text-paper transition-colors hover:bg-coal disabled:opacity-50">
        {isPending ? 'Saving…' : client ? 'Save changes' : 'Create client'}
      </button>
    </form>
  );
}

export function ArchiveClientButton({ clientId }: { clientId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (!window.confirm('Archive this client? Their projects remain, but they will no longer appear in the active list.')) return;
        startTransition(async () => {
          await updateClientAction(clientId, { status: 'archived' });
          router.push('/admin/clients');
          router.refresh();
        });
      }}
      className="rounded-full border border-red-200 px-4 py-2 text-[12.5px] font-medium text-red-600 transition-colors hover:border-red-400 disabled:opacity-50"
    >
      Archive client
    </button>
  );
}
