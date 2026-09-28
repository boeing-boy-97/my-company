import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { listClients, listProjects, getLead } from '@/lib/store';
import AdminShell from '@/components/admin/AdminShell';
import { ClientForm, ArchiveClientButton } from '@/components/admin/ClientForms';
import { EmptyState } from '@/components/ui/primitives';
import { formatDate } from '@/lib/utils';
import { pageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Admin — Clients', description: 'Client records.', path: '/admin' }), robots: { index: false } };

export default async function AdminClientsPage({ searchParams }: { searchParams: Promise<{ new?: string; edit?: string; fromLead?: string }> }) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'admin') redirect('/admin/login');

  const { new: isNew, edit, fromLead } = await searchParams;
  const clients = await listClients();
  const projects = await listProjects();
  const lead = fromLead ? await getLead(fromLead) : undefined;
  const editing = edit ? clients.find((c) => c.id === edit) : undefined;

  const projectCount = (clientId: string) => projects.filter((p) => p.clientId === clientId).length;

  // create/edit form mode
  if (isNew || editing) {
    return (
      <AdminShell email={session.email} pathname="/admin/clients">
        <div className="max-w-[720px]">
          <Link href="/admin/clients" className="link-underline text-[13px] font-medium text-soft hover:text-ink">← All clients</Link>
          <h1 className="display-tight mt-3 font-display text-[clamp(1.6rem,3.4vw,2.3rem)] font-semibold text-ink">{editing ? `Edit ${editing.company}` : 'New client'}</h1>
          {lead && !editing && (
            <p className="mt-2 rounded-xl border border-ok/30 bg-ok/5 px-4 py-3 text-[13px] text-soft">
              Onboarding from lead <span className="font-mono text-[12px] text-accentdeep">{lead.reference}</span> — {lead.companyName || lead.contactName}. Details pre-filled below where known.
            </p>
          )}
          <div className="mt-7 rounded-2xl border border-line bg-surface p-7">
            <ClientForm client={editing} defaultCompany={lead?.companyName} />
          </div>
          {editing && (
            <div className="mt-6 flex items-center justify-between">
              <p className="font-mono text-[10.5px] uppercase tracking-tech text-faint">Client since {formatDate(editing.createdAt)}</p>
              <ArchiveClientButton clientId={editing.id} />
            </div>
          )}
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell email={session.email} pathname="/admin/clients">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-tech">Clients</p>
          <h1 className="display-tight mt-2 font-display text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold text-ink">Client records</h1>
        </div>
        <Link href="/admin/clients?new=1" className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-coal">+ New client</Link>
      </div>

      {clients.length === 0 ? (
        <div className="mt-9">
          <EmptyState title="No clients yet" body="Create a client record when a lead is won — it becomes the home for their projects and portal access." />
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-line">
                {['Company', 'Contact', 'Email', 'Currency', 'Projects', 'Since', ''].map((h, i) => (
                  <th key={i} className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-tech text-faint">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0 hover:bg-paper">
                  <td className="px-5 py-4">
                    <Link href={`/admin/clients?edit=${c.id}`} className="link-underline text-[13.5px] font-medium text-ink">{c.company}</Link>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-soft">{c.contactName || '—'}</td>
                  <td className="px-5 py-4 text-[13px] text-soft">{c.email || '—'}</td>
                  <td className="px-5 py-4 font-mono text-[12px] text-soft">{c.currency}</td>
                  <td className="px-5 py-4 font-mono text-[12px] text-soft">{projectCount(c.id)}</td>
                  <td className="px-5 py-4 font-mono text-[10.5px] text-faint">{formatDate(c.createdAt)}</td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/admin/clients?edit=${c.id}`} className="rounded-full border border-line px-4 py-1.5 font-mono text-[10px] uppercase tracking-wide text-soft transition-colors hover:border-accent/50 hover:text-ink">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
