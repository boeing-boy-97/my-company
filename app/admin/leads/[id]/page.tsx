import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { getLead, listClients, listProjects } from '@/lib/store';
import AdminShell from '@/components/admin/AdminShell';
import LeadDetailTabs from '@/components/admin/LeadDetailTabs';
import { Badge } from '@/components/ui/primitives';
import { formatDate } from '@/lib/utils';
import { pageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Lead', description: 'Lead detail.', path: '/admin' }), robots: { index: false } };

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'admin') redirect('/admin/login');

  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  // Link client + projects by matching email (honest best-effort association).
  const clients = await listClients();
  const client = lead.email ? clients.find((c) => c.email && c.email.toLowerCase() === lead.email.toLowerCase()) || null : null;
  const projects = client ? (await listProjects(client.id)).map((p) => ({ id: p.id, name: p.name, status: p.status })) : [];

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
            {lead.archived ? ' · archived' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[13px] font-semibold text-accentdeep">{lead.reference}</span>
          <Badge tone={lead.status === 'new' ? 'accent' : lead.status === 'won' ? 'ok' : 'neutral'}>{lead.status}</Badge>
        </div>
      </div>

      <div className="mt-9">
        <LeadDetailTabs
          lead={{
            id: lead.id,
            reference: lead.reference,
            kind: lead.kind,
            source: lead.source,
            status: lead.status,
            archived: lead.archived,
            owner: lead.owner,
            notes: lead.notes,
            createdAt: lead.createdAt,
            projectTypes: lead.projectTypes,
            objective: lead.objective,
            existingAssets: lead.existingAssets,
            currentTech: lead.currentTech,
            timeline: lead.timeline,
            budgetRange: lead.budgetRange,
            currency: lead.currency,
            companyName: lead.companyName,
            website: lead.website,
            industry: lead.industry,
            country: lead.country,
            contactName: lead.contactName,
            email: lead.email,
            phone: lead.phone,
            whatsapp: lead.whatsapp,
            preferredChannel: lead.preferredChannel,
            sourceUrl: lead.sourceUrl,
            utm: lead.utm,
            consultantLog: lead.consultantLog,
            activity: lead.activity,
          }}
          client={client ? { id: client.id, company: client.company, contactName: client.contactName, email: client.email, status: client.status } : null}
          projects={projects}
        />
      </div>
    </AdminShell>
  );
}
