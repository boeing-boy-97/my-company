import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { listLeads, leadCounts } from '@/lib/store';
import AdminShell from '@/components/admin/AdminShell';
import LeadsManager from '@/components/admin/LeadsManager';
import { pageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Admin — Leads', description: 'Pipeline.', path: '/admin' }), robots: { index: false } };

export default async function AdminLeadsPage() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'admin') redirect('/admin/login');

  const [leads, counts] = await Promise.all([listLeads(), leadCounts()]);

  return (
    <AdminShell email={session.email} pathname="/admin/leads">
      <p className="label-tech">Pipeline</p>
      <h1 className="display-tight mt-2 font-display text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold text-ink">Leads</h1>
      <p className="mt-2 max-w-[560px] text-[14px] leading-relaxed text-soft">Every enquiry from the website form, the AI consultant and the contact page — tracked through eight stages.</p>
      <div className="mt-8">
        <LeadsManager leads={leads} counts={counts} />
      </div>
    </AdminShell>
  );
}
