import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { getLead } from '@/lib/store';
import AdminShell from '@/components/admin/AdminShell';
import { StatusControl, NotesEditor, OwnerControl } from '@/components/admin/LeadActions';
import { Badge } from '@/components/ui/primitives';
import { formatDate } from '@/lib/utils';
import { pageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Lead', description: 'Lead detail.', path: '/admin' }), robots: { index: false } };

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid gap-1 px-5 py-3.5 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="font-mono text-[10px] uppercase tracking-tech text-faint sm:pt-0.5">{label}</dt>
      <dd className="whitespace-pre-line text-[14px] leading-relaxed text-ink">{value && value.trim() ? value : <span className="text-faint">—</span>}</dd>
    </div>
  );
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'admin') redirect('/admin/login');

  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  const utm = [lead.utm?.source, lead.utm?.medium, lead.utm?.campaign].filter(Boolean).join(' / ');

  return (
    <AdminShell email={session.email} pathname="/admin/leads">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/leads" className="link-underline text-[13px] font-medium text-soft hover:text-ink">← All leads</Link>
          <h1 className="display-tight mt-3 font-display text-[clamp(1.6rem,3.4vw,2.4rem)] font-semibold text-ink">
            {lead.companyName || lead.contactName || lead.reference}
          </h1>
          <p className="mt-1.5 text-[13.5px] text-faint">
            {lead.kind === 'consultant' ? 'Captured by AI consultant' : 'Project brief'} · received {formatDate(lead.createdAt)} · source: {lead.source}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[13px] font-semibold text-accentdeep">{lead.reference}</span>
          <Badge tone={lead.status === 'new' ? 'accent' : lead.status === 'won' ? 'ok' : 'neutral'}>{lead.status}</Badge>
        </div>
      </div>

      <div className="mt-9 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        {/* brief */}
        <div>
          <dl className="divide-y divide-linedark rounded-2xl border border-line bg-surface">
            <Row label="Project types" value={lead.projectTypes.join(', ')} />
            <Row label="Objective" value={lead.objective} />
            <Row label="Existing assets" value={lead.existingAssets.join(', ')} />
            <Row label="Timeline" value={lead.timeline} />
            <Row label="Budget" value={lead.budgetRange + (lead.currency && lead.budgetRange !== 'Not sure' && lead.budgetRange !== 'Not shared yet' ? ` (${lead.currency})` : '')} />
            <Row label="Company" value={[lead.companyName, lead.website, lead.industry, lead.country].filter(Boolean).join(' · ')} />
            <Row label="Contact" value={[lead.contactName, lead.email, lead.phone, lead.whatsapp].filter(Boolean).join('\n')} />
            <Row label="Preferred channel" value={lead.preferredChannel} />
            <Row label="Source URL" value={lead.sourceUrl} />
            <Row label="UTM" value={utm} />
            {lead.consultantLog && lead.consultantLog.length > 0 && (
              <Row label="Consultant log" value={lead.consultantLog.map((l) => `${l.role === 'user' ? 'User' : 'Assistant'}: ${l.text}`).join('\n')} />
            )}
          </dl>

          {/* activity timeline */}
          <h2 className="mt-9 font-display text-[16px] font-semibold text-ink">Activity</h2>
          <ol className="mt-4 space-y-0 border-l border-line pl-5">
            {lead.activity.length === 0 && <li className="py-2 text-[13px] text-faint">No activity recorded.</li>}
            {lead.activity.map((a) => (
              <li key={a.id} className="relative pb-5">
                <span className="absolute -left-[23.5px] top-1.5 h-2 w-2 rounded-full bg-accent" aria-hidden />
                <p className="text-[13.5px] text-ink">{a.note}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-faint">{a.type} · {formatDate(a.at)}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* actions */}
        <div className="space-y-7">
          <div className="rounded-2xl border border-line bg-surface p-7">
            <StatusControl leadId={lead.id} current={lead.status} />
          </div>
          <div className="rounded-2xl border border-line bg-surface p-7">
            <OwnerControl leadId={lead.id} current={lead.owner || 'Unassigned'} />
          </div>
          <div className="rounded-2xl border border-line bg-surface p-7">
            <NotesEditor leadId={lead.id} initial={lead.notes} />
          </div>
          <div className="rounded-2xl border border-line bg-surface p-7">
            <p className="label-tech">Quick contact</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {lead.email && lead.email !== 'pending' && (
                <a href={`mailto:${lead.email}`} className="rounded-full border border-line px-4 py-2 text-[12.5px] font-medium text-soft transition-colors hover:border-ink/30 hover:text-ink">
                  Email {lead.email}
                </a>
              )}
              {lead.phone && (
                <a href={`tel:${lead.phone}`} className="rounded-full border border-line px-4 py-2 text-[12.5px] font-medium text-soft transition-colors hover:border-ink/30 hover:text-ink">
                  Call {lead.phone}
                </a>
              )}
              {lead.whatsapp && (
                <a href={`https://wa.me/${lead.whatsapp.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-4 py-2 text-[12.5px] font-medium text-soft transition-colors hover:border-ink/30 hover:text-ink">
                  WhatsApp
                </a>
              )}
            </div>
          </div>
          {lead.status === 'won' && (
            <div className="rounded-2xl border border-ok/30 bg-ok/5 p-6">
              <p className="font-display text-[15px] font-semibold text-ink">Won — next steps</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-soft">Create the client record and open their project workspace.</p>
              <Link href={`/admin/clients?fromLead=${lead.id}`} className="mt-3 inline-block rounded-full bg-ink px-5 py-2.5 text-[12.5px] font-medium text-paper hover:bg-coal">
                Onboard this client →
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
