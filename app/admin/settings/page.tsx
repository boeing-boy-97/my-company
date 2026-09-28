import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { getSettings, storageMode } from '@/lib/store';
import { site } from '@/lib/site';
import AdminShell from '@/components/admin/AdminShell';
import SettingsForm from '@/components/admin/SettingsForm';
import { pageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Admin — Settings', description: 'Site settings.', path: '/admin' }), robots: { index: false } };

export default async function AdminSettingsPage() {
  const session = await getCurrentSession();
  if (!session || session.role !== 'admin') redirect('/admin/login');

  const [s, mode] = await Promise.all([getSettings(), storageMode()]);
  const initial = {
    contactEmail: s.contactEmail ?? site.contact.email,
    phone: s.phone ?? site.contact.phone,
    whatsapp: s.whatsapp ?? site.contact.whatsapp,
    hours: s.hours ?? site.contact.hours,
  };

  return (
    <AdminShell email={session.email} pathname="/admin/settings">
      <div className="max-w-[720px]">
        <p className="label-tech">Settings</p>
        <h1 className="display-tight mt-2 font-display text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold text-ink">Site settings</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-soft">
          Overrides for contact details shown in the footer and on the contact page. Leave a field as-is to keep the site default.
        </p>
        <div className="mt-8 rounded-2xl border border-line bg-surface p-7">
          <SettingsForm initial={initial} />
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-line p-6">
          <p className="font-mono text-[10px] uppercase tracking-tech text-faint">Environment</p>
          <ul className="mt-3 space-y-1.5 text-[13px] text-soft">
            <li>· Storage: {mode === 'disk' ? 'local disk (data/)' : 'memory — this platform has a read-only filesystem; connect a database for durable data'}</li>
            <li>· Footer, contact page and emails read these settings</li>
            <li>· JSON-LD organization schema uses the defaults in code</li>
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}
