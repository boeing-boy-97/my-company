import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { listContacts } from '@/lib/store';
import AdminShell from '@/components/admin/AdminShell';
import { EmptyState, Badge } from '@/components/ui/primitives';
import { formatDate } from '@/lib/utils';
import { pageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Admin — Inbox', description: 'Contact messages.', path: '/admin/inbox' }), robots: { index: false } };

export default async function AdminInboxPage() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'admin') redirect('/admin/login');

  const contacts = await listContacts();
  const recent = [...contacts].reverse();

  return (
    <AdminShell email={session.email} pathname="/admin/inbox">
      <p className="label-tech">Inbox</p>
      <h1 className="display-tight mt-2 font-display text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold text-ink">Contact messages</h1>
      <p className="mt-2 max-w-[560px] text-[14px] leading-relaxed text-soft">
        Every message sent through the public contact form, newest first. {contacts.length} total.
      </p>
      <div className="mt-8 space-y-4">
      {recent.length === 0 ? (
        <EmptyState
          title="No messages yet"
          body="Messages sent through the public contact form land here, newest first. Nothing is deleted automatically."
        />
      ) : (
        <div className="space-y-4">
          {recent.map((c) => (
            <article key={c.id} className="rounded-2xl border border-line bg-surface p-5 md:p-6">
              <header className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-[15.5px] font-semibold text-ink">
                    {c.name}
                    {c.company ? <span className="font-normal text-soft"> · {c.company}</span> : null}
                  </h2>
                  <p className="mt-0.5 text-[13px] text-soft">
                    <a href={`mailto:${c.email}`} className="link-underline font-medium text-ink">{c.email}</a>
                    {c.website ? (
                      <>
                        {' · '}
                        <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`} target="_blank" rel="noopener noreferrer" className="link-underline font-medium text-ink">
                          {c.website.replace(/^https?:\/\//, '')}
                        </a>
                      </>
                    ) : null}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{c.topic}</Badge>
                  <time className="font-mono text-[11px] text-faint">{formatDate(c.createdAt)}</time>
                </div>
              </header>
              <p className="mt-3 max-w-[70ch] text-[13.5px] leading-relaxed whitespace-pre-line text-soft">{c.message}</p>
              {(c.budget || c.timeline || c.context) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.budget ? <span className="rounded-full border border-line bg-paper px-3 py-1 font-mono text-[10px] uppercase tracking-tech text-soft">Budget · {c.budget}</span> : null}
                  {c.timeline ? <span className="rounded-full border border-line bg-paper px-3 py-1 font-mono text-[10px] uppercase tracking-tech text-soft">When · {c.timeline}</span> : null}
                  {c.context ? <span className="rounded-full border border-line bg-paper px-3 py-1 font-mono text-[10px] uppercase tracking-tech text-soft">{c.context}</span> : null}
                </div>
              )}
              <footer className="mt-4 border-t border-linedark pt-3">
                <Link href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.topic)} — Kiln`} className="link-underline text-[12.5px] font-medium text-accent transition-colors hover:text-accentdeep">
                  Reply by email →
                </Link>
              </footer>
            </article>
          ))}
        </div>
      )}
      </div>
    </AdminShell>
  );
}
