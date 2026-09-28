import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { listProjects, listFiles, unreadMessageCount } from '@/lib/store';
import PortalShell from '@/components/portal/PortalShell';
import { EmptyState } from '@/components/ui/primitives';
import { pageSeo } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Files — Client Portal', description: 'Files shared across your projects.', path: '/portal' }), robots: { index: false } };

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

export default async function PortalFilesPage() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'client') redirect('/portal/login');

  const projects = await listProjects(session.clientId);
  const unread = await unreadMessageCount(session.clientId);
  const files = (await listFiles()).filter((f) => projects.some((p) => p.id === f.projectId));
  const nameFor = (id: string) => projects.find((p) => p.id === id)?.name || 'Project';

  return (
    <PortalShell session={session} pathname="/portal/files" unread={unread}>
      <p className="label-tech">Files</p>
      <h1 className="display-tight mt-2 font-display text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold text-ink">Every document, one place.</h1>
      <p className="mt-2 max-w-[560px] text-[14px] leading-relaxed text-soft">Specs, designs, exports and deliverables. Upload new files from inside a project.</p>

      {files.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="No files yet" body="Files shared by either side will appear here, ready to download." />
        </div>
      ) : (
        <div className="mt-9 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[680px] text-left">
            <thead>
              <tr className="border-b border-line">
                {['File', 'Project', 'Uploaded by', 'Date', ''].map((h, i) => (
                  <th key={i} className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-tech text-faint">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {files.map((f) => (
                <tr key={f.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-4">
                    <p className="text-[13.5px] font-medium text-ink">{f.name}</p>
                    <p className="font-mono text-[10px] text-faint">{formatSize(f.size)}</p>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-soft">{nameFor(f.projectId)}</td>
                  <td className="px-5 py-4 text-[13px] text-soft">{f.uploadedBy === 'client' ? 'You' : 'Studio'}</td>
                  <td className="px-5 py-4 font-mono text-[11px] text-faint">{formatDate(f.createdAt)}</td>
                  <td className="px-5 py-4 text-right">
                    <a href={`/api/files/${f.id}`} download={f.name} className="rounded-full border border-line px-4 py-1.5 font-mono text-[10px] uppercase tracking-wide text-soft transition-colors hover:border-accent/50 hover:text-ink">
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PortalShell>
  );
}
