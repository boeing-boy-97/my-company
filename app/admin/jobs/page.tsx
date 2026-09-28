import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { cmsList, type JobRecord } from '@/lib/store';
import { cmsStatusAction } from '@/lib/actions';
import AdminShell from '@/components/admin/AdminShell';
import { DeleteCmsButton } from '@/components/admin/CmsComponents';
import { formatDate } from '@/lib/utils';
import { pageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Admin — Jobs', description: 'Content management.', path: '/admin' }), robots: { index: false } };

function titleOf(r: JobRecord): string {
  return r.title || 'Untitled';
}

export default async function AdminListPage() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'admin') redirect('/admin/login');

  const records = await cmsList<JobRecord>('jobs');

  return (
    <AdminShell email={session.email} pathname="/admin/jobs">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-tech">Content</p>
          <h1 className="display-tight mt-2 font-display text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold text-ink">Jobs</h1>
        </div>
        <Link href="/admin/jobs/edit" className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-coal">+ New job</Link>
      </div>

      {records.length === 0 ? (
        <p className="mt-10 text-[14px] text-faint">Nothing here yet — create the first job.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-line">
                {['Title', 'Status', 'Sample', 'Updated', ''].map((h, i) => (
                  <th key={i} className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-tech text-faint">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0 hover:bg-paper">
                  <td className="max-w-[340px] px-5 py-4">
                    <Link href={`/admin/jobs/edit?id=${r.id}`} className="link-underline line-clamp-1 text-[13.5px] font-medium text-ink">{titleOf(r)}</Link>
                    {'slug' in r && <p className="font-mono text-[10px] text-faint">/{(r as { slug?: string }).slug}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full border px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-wide ${r.status === 'published' ? 'border-ok/30 bg-ok/5 text-ok' : r.status === 'archived' ? 'border-line text-faint' : 'border-warn/30 bg-warn/5 text-warn'}`}>{r.status}</span>
                  </td>
                  <td className="px-5 py-4 font-mono text-[10.5px] text-faint">{r.sample ? 'example' : '—'}</td>
                  <td className="px-5 py-4 font-mono text-[10.5px] text-faint">{formatDate(r.updatedAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/jobs/edit?id=${r.id}`} className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[9.5px] uppercase tracking-wide text-soft transition-colors hover:border-accent/50 hover:text-ink">Edit</Link>
                      <form action={async () => { 'use server'; await cmsStatusAction('jobs', r.id, r.status === 'published' ? 'draft' : 'published'); }}>
                        <button type="submit" className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[9.5px] uppercase tracking-wide text-soft transition-colors hover:border-accent/50 hover:text-ink">
                          {r.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                      </form>
                      <DeleteCmsButton kind="jobs" id={r.id} label={titleOf(r)} />
                    </div>
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
