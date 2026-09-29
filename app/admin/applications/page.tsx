import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { listApplications } from '@/lib/store';
import AdminShell from '@/components/admin/AdminShell';
import { EmptyState, Badge } from '@/components/ui/primitives';
import { formatDate } from '@/lib/utils';
import { pageSeo } from '@/lib/seo';
import { jobs } from '@/content/jobs';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Admin — Applicants', description: 'Career applications.', path: '/admin/applications' }), robots: { index: false } };

export default async function AdminApplicationsPage() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'admin') redirect('/admin/login');

  const apps = await listApplications();
  const recent = [...apps].reverse();
  const titleFor = (jobId: string) => jobs.find((j) => j.slug === jobId)?.title ?? (jobId || '—');

  return (
    <AdminShell email={session.email} pathname="/admin/applications">
      <p className="label-tech">Recruiting</p>
      <h1 className="display-tight mt-2 font-display text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold text-ink">Applications</h1>
      <p className="mt-2 max-w-[560px] text-[14px] leading-relaxed text-soft">
        Submissions from the careers page, newest first. {apps.length} total.
      </p>
      <div className="mt-8">
        {recent.length === 0 ? (
          <EmptyState
            title="No applications yet"
            body="Candidates who apply through an open role land here with their message and resume."
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-surface">
                  {['Applicant', 'Role', 'Links', 'Resume', 'Received', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 font-mono text-[10px] uppercase tracking-tech text-faint">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-linedark">
                {recent.map((a) => (
                  <tr key={a.id} className="align-top transition-colors hover:bg-paper/60">
                    <td className="px-4 py-3">
                      <p className="text-[13px] font-medium text-ink">{a.name}</p>
                      <a href={`mailto:${a.email}`} className="link-underline text-[12px] text-soft">{a.email}</a>
                      {a.message ? <p className="mt-1.5 max-w-[420px] text-[12px] leading-relaxed text-faint">{a.message.slice(0, 180)}{a.message.length > 180 ? '…' : ''}</p> : null}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-soft">{titleFor(a.jobId)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px]">
                        {a.portfolio ? <a className="link-underline text-soft hover:text-ink" target="_blank" rel="noopener noreferrer" href={a.portfolio}>Portfolio</a> : null}
                        {a.github ? <a className="link-underline text-soft hover:text-ink" target="_blank" rel="noopener noreferrer" href={a.github}>GitHub</a> : null}
                        {a.linkedin ? <a className="link-underline text-soft hover:text-ink" target="_blank" rel="noopener noreferrer" href={a.linkedin}>LinkedIn</a> : null}
                        {!a.portfolio && !a.github && !a.linkedin ? <span className="text-faint">—</span> : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px]">
                      {a.resumeKey ? (
                        <Link href={`/api/files/${a.resumeKey}`} className="link-underline font-medium text-accent hover:text-accentdeep">Download</Link>
                      ) : (
                        <span className="text-faint">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11.5px] text-faint">{formatDate(a.createdAt)}</td>
                    <td className="px-4 py-3"><Badge tone={a.status === 'new' ? 'accent' : 'neutral'}>{a.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
