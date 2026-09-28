import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import Logo from '@/components/layout/Logo';
import { getCurrentSession, credentialsFor } from '@/lib/auth';
import { pageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Admin Login', description: 'Kiln back office.', path: '/admin/login' }), robots: { index: false } };

export default async function AdminLoginPage() {
  const session = await getCurrentSession();
  if (session?.role === 'admin') redirect('/admin');
  const creds = credentialsFor('admin');

  return (
    <main className="toplight relative flex min-h-screen flex-col items-center justify-center px-6 py-32">
      <div className="pointer-events-none absolute inset-0 gridlines gridlines-fade" aria-hidden />
      <div className="relative w-full max-w-[420px]">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <LoginForm role="admin" title="Back Office" subtitle="Leads, projects and content administration." demoEmail={creds.email} demoPassword={creds.password} />
      </div>
    </main>
  );
}
