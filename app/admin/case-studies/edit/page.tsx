import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { cmsGet, type CaseStudyRecord } from '@/lib/store';
import AdminShell from '@/components/admin/AdminShell';
import { CmsEditorForm } from '@/components/admin/CmsComponents';
import { blankRecord, recordToForm } from '@/lib/cmsFields';
import { pageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Admin — Case study', description: 'Content editor.', path: '/admin' }), robots: { index: false } };

export default async function AdminEditPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const session = await getCurrentSession();
  if (!session || session.role !== 'admin') redirect('/admin/login');

  const { id } = await searchParams;
  const record = id ? await cmsGet<CaseStudyRecord>('caseStudies', id) : undefined;
  if (id && !record) redirect('/admin/case-studies');

  const base = record ? (record as unknown as Record<string, unknown>) : blankRecord('caseStudies');
  const form = recordToForm('caseStudies', base);

  return (
    <AdminShell email={session.email} pathname="/admin/case-studies">
      <div className="max-w-[900px]">
        <p className="label-tech">Content editor</p>
        <h1 className="display-tight mt-2 font-display text-[clamp(1.6rem,3.4vw,2.3rem)] font-semibold text-ink">
          {record ? 'Edit case study' : 'New case study'}
        </h1>
        {record?.sample && (
          <p className="mt-2 rounded-xl border border-warn/30 bg-warn/5 px-4 py-2.5 text-[12.5px] text-warn">
            This is example content seeded for demonstration. Edit it freely or replace it with real material before launch.
          </p>
        )}
        <div className="mt-7 rounded-2xl border border-line bg-surface p-7">
          <CmsEditorForm kind="caseStudies" initial={form} recordId={record?.id} backHref="/admin/case-studies" />
        </div>
      </div>
    </AdminShell>
  );
}
