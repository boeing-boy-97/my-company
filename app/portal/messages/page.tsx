import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { listProjects, recentMessages, unreadMessageCount } from '@/lib/store';
import PortalShell from '@/components/portal/PortalShell';
import { EmptyState } from '@/components/ui/primitives';
import { pageSeo } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Messages — Client Portal', description: 'Conversations across your projects.', path: '/portal' }), robots: { index: false } };

export default async function PortalMessagesPage() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'client') redirect('/portal/login');

  const projects = await listProjects(session.clientId);
  const unread = await unreadMessageCount(session.clientId);
  const messages = await recentMessages(session.clientId, 50);

  return (
    <PortalShell session={session} pathname="/portal/messages" unread={unread}>
      <p className="label-tech">Messages</p>
      <h1 className="display-tight mt-2 font-display text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold text-ink">One conversation per project.</h1>
      <p className="mt-2 max-w-[560px] text-[14px] leading-relaxed text-soft">Open a project to reply. Everything discussed stays attached to the project it belongs to.</p>

      {messages.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="No messages yet" body="Messages exchanged with the studio will appear here." />
        </div>
      ) : (
        <div className="mt-9 max-w-[760px] space-y-3">
          {messages.map((m) => (
            <Link key={m.id} href={`/portal/projects/${m.projectId}`} className="block rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-ink/25">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[9.5px] uppercase tracking-wide text-faint">
                  {m.authorRole === 'client' ? 'You' : 'Kiln Studio'} · {m.projectName}
                </p>
                <span className="font-mono text-[9.5px] text-faint">{formatDate(m.createdAt)}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-ink">{m.body}</p>
            </Link>
          ))}
        </div>
      )}
    </PortalShell>
  );
}
