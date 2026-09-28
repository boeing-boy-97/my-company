import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { listAudit } from '@/lib/store';
import AdminShell from '@/components/admin/AdminShell';
import { EmptyState } from '@/components/ui/primitives';
import { formatDate } from '@/lib/utils';
import { pageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Admin — Audit log', description: 'Change history.', path: '/admin' }), robots: { index: false } };

function when(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default async function AuditPage() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'admin') redirect('/admin/login');

  const entries = await listAudit();

  return (
    <AdminShell email={session.email} pathname="/admin/audit">
      <p className="label-tech">Accountability</p>
      <h1 className="display-tight mt-2 font-display text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold text-ink">Audit log</h1>
      <p className="mt-2 max-w-[560px] text-[13.5px] leading-relaxed text-faint">
        Who did what, and when — status changes, project events, invites and publishes. Newest first.
      </p>

      {entries.length === 0 ? (
        <div className="mt-9">
          <EmptyState title="Nothing logged yet" body="Actions like status changes, project creation and client invites will appear here." />
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-line">
                {['When', 'Actor', 'Action', 'Resource', 'Change'].map((h) => (
                  <th key={h} className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-tech text-faint">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b border-line last:border-0 hover:bg-paper">
                  <td className="whitespace-nowrap px-5 py-3.5 font-mono text-[11px] text-faint">{when(e.at)}</td>
                  <td className="px-5 py-3.5 text-[12.5px] text-soft">{e.actor}</td>
                  <td className="px-5 py-3.5 font-mono text-[11.5px] text-ink">{e.action}</td>
                  <td className="max-w-[220px] truncate px-5 py-3.5 text-[12.5px] text-soft">{e.resource}</td>
                  <td className="max-w-[260px] truncate px-5 py-3.5 text-[12.5px] text-soft">
                    {e.before || e.after ? [e.before, e.after].filter(Boolean).join(' → ') : <span className="text-faint">—</span>}
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
