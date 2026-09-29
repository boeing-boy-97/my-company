'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { archiveLeadAction } from '@/lib/actions';
import { StatusControl, NotesEditor, OwnerControl } from '@/components/admin/LeadActions';
import { formatDate } from '@/lib/utils';

interface TabDef { id: string; label: string }

const TABS: TabDef[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'brief', label: 'Brief' },
  { id: 'activity', label: 'Activity' },
  { id: 'messages', label: 'Messages' },
  { id: 'notes', label: 'Notes' },
  { id: 'client', label: 'Client' },
  { id: 'project', label: 'Related project' },
];

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid gap-1 px-5 py-3.5 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="font-mono text-[10px] uppercase tracking-tech text-faint sm:pt-0.5">{label}</dt>
      <dd className="whitespace-pre-line text-[14px] leading-relaxed text-ink">{value && value.trim() ? value : <span className="text-faint">—</span>}</dd>
    </div>
  );
}

export interface LeadView {
  id: string;
  reference: string;
  kind: string;
  source: string;
  status: string;
  archived?: boolean;
  owner?: string;
  notes: string;
  createdAt: string;
  projectTypes: string[];
  objective: string;
  existingAssets: string[];
  currentTech?: string;
  users?: string;
  success?: string;
  timeline: string;
  budgetRange: string;
  currency?: string;
  companyName?: string;
  website?: string;
  industry?: string;
  country?: string;
  contactName: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  preferredChannel: string;
  sourceUrl?: string;
  utm?: { source: string; medium: string; campaign: string };
  consultantLog?: Array<{ role: string; text: string }>;
  activity: Array<{ id: string; type: string; note: string; at: string }>;
}

export default function LeadDetailTabs({
  lead,
  client,
  projects,
}: {
  lead: LeadView;
  client: { id: string; company: string; contactName?: string; email?: string; status?: string } | null;
  projects: Array<{ id: string; name: string; status: string }>;
}) {
  const router = useRouter();
  const [tab, setTab] = useState('overview');
  const [isPending, startTransition] = useTransition();

  const utm = [lead.utm?.source, lead.utm?.medium, lead.utm?.campaign].filter(Boolean).join(' / ');

  const toggleArchive = () => {
    startTransition(async () => {
      await archiveLeadAction(lead.id);
      router.refresh();
    });
  };

  const brief = (
    <dl className="divide-y divide-linedark rounded-2xl border border-line bg-surface">
      <Row label="Project types" value={lead.projectTypes.join(', ')} />
      <Row label="Objective" value={lead.objective} />
      <Row label="Existing assets" value={lead.existingAssets.join(', ')} />
      <Row label="Current technology" value={lead.currentTech} />
      <Row label="Who uses it" value={lead.users} />
      <Row label="Success looks like" value={lead.success} />
      <Row label="Timeline" value={lead.timeline} />
      <Row label="Budget" value={lead.budgetRange + (lead.currency && lead.budgetRange !== 'Not sure' && lead.budgetRange !== 'Not shared yet' ? ` (${lead.currency})` : '')} />
      <Row label="Company" value={[lead.companyName, lead.website, lead.industry, lead.country].filter(Boolean).join(' · ')} />
      <Row label="Contact" value={[lead.contactName, lead.email, lead.phone, lead.whatsapp].filter(Boolean).join('\n')} />
      <Row label="Preferred channel" value={lead.preferredChannel} />
      <Row label="Source URL" value={lead.sourceUrl} />
      <Row label="UTM" value={utm} />
    </dl>
  );

  return (
    <div>
      {/* tabs */}
      <div role="tablist" aria-label="Lead sections" className="flex flex-wrap gap-1.5 border-b border-line pb-px">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-t-lg px-4 py-2.5 text-[13px] font-medium transition-colors ${
              tab === t.id ? 'border border-b-0 border-line bg-surface text-ink' : 'text-soft hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-7">
        {tab === 'overview' && (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <dl className="divide-y divide-linedark rounded-2xl border border-line bg-surface">
                <Row label="Status" value={lead.status} />
                <Row label="Owner" value={lead.owner || 'Unassigned'} />
                <Row label="Kind" value={lead.kind === 'consultant' ? 'Captured by AI consultant' : lead.kind} />
                <Row label="Source" value={lead.source} />
                <Row label="Received" value={formatDate(lead.createdAt)} />
                <Row label="Objective" value={lead.objective} />
              </dl>
              <div className="rounded-2xl border border-line bg-surface p-7">
                <StatusControl leadId={lead.id} current={lead.status} />
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl border border-line bg-surface p-7">
                <OwnerControl leadId={lead.id} current={lead.owner || 'Unassigned'} />
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
              <button
                onClick={toggleArchive}
                disabled={isPending}
                className="w-full rounded-full border border-line px-5 py-2.5 text-[12.5px] font-medium text-soft transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-50"
              >
                {lead.archived ? 'Unarchive lead' : 'Archive lead'}
              </button>
            </div>
          </div>
        )}

        {tab === 'brief' && brief}

        {tab === 'activity' && (
          <ol className="space-y-0 border-l border-line pl-5">
            {lead.activity.length === 0 && <li className="py-2 text-[13px] text-faint">No activity recorded.</li>}
            {lead.activity.map((a) => (
              <li key={a.id} className="relative pb-5">
                <span className="absolute -left-[23.5px] top-1.5 h-2 w-2 rounded-full bg-accent" aria-hidden />
                <p className="text-[13.5px] text-ink">{a.note}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-faint">{a.type} · {formatDate(a.at)}</p>
              </li>
            ))}
          </ol>
        )}

        {tab === 'messages' && (
          <div>
            {lead.consultantLog && lead.consultantLog.length > 0 ? (
              <dl className="divide-y divide-linedark rounded-2xl border border-line bg-surface">
                <Row label="Consultant conversation" value={lead.consultantLog.map((l) => `${l.role === 'user' ? 'User' : 'Assistant'}: ${l.text}`).join('\n\n')} />
              </dl>
            ) : (
              <p className="rounded-2xl border border-line bg-surface px-6 py-8 text-center text-[13.5px] text-faint">
                No messages captured with this lead. Use the quick-contact links in Overview to reach them directly.
              </p>
            )}
          </div>
        )}

        {tab === 'notes' && (
          <div className="max-w-[640px] rounded-2xl border border-line bg-surface p-7">
            <NotesEditor leadId={lead.id} initial={lead.notes} />
          </div>
        )}

        {tab === 'client' && (
          <div className="max-w-[640px]">
            {client ? (
              <div className="rounded-2xl border border-line bg-surface p-7">
                <p className="label-tech">Linked client</p>
                <p className="mt-3 font-display text-[18px] font-semibold text-ink">{client.company}</p>
                {client.contactName && <p className="mt-1 text-[13.5px] text-soft">{client.contactName}</p>}
                {client.email && <p className="mt-0.5 text-[13px] text-faint">{client.email}</p>}
                <Link href="/admin/clients" className="mt-4 inline-block rounded-full bg-ink px-5 py-2.5 text-[12.5px] font-medium text-paper hover:bg-coal">
                  Open clients →
                </Link>
              </div>
            ) : (
              <p className="rounded-2xl border border-line bg-surface px-6 py-8 text-center text-[13.5px] text-faint">
                No client record matches this lead’s email yet. Mark the lead as won and use “Onboard this client” to create one.
              </p>
            )}
          </div>
        )}

        {tab === 'project' && (
          <div className="max-w-[640px]">
            {projects.length > 0 ? (
              <ul className="divide-y divide-linedark rounded-2xl border border-line bg-surface">
                {projects.map((p) => (
                  <li key={p.id} className="flex items-center justify-between px-5 py-4">
                    <Link href={`/admin/projects/${p.id}`} className="link-underline text-[13.5px] font-medium text-ink">{p.name}</Link>
                    <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-wide text-soft">{p.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-2xl border border-line bg-surface px-6 py-8 text-center text-[13.5px] text-faint">
                No related projects. Projects appear here once a client record exists and a project is opened for them.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
