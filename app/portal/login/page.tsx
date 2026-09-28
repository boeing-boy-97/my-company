import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import Logo from '@/components/layout/Logo';
import { getCurrentSession, credentialsFor } from '@/lib/auth';
import { pageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { ...pageSeo({ title: 'Client Login', description: 'Sign in to the Kiln client portal.', path: '/portal/login' }), robots: { index: false } };

export default async function PortalLoginPage() {
  const session = await getCurrentSession();
  if (session?.role === 'client') redirect('/portal');
  const creds = credentialsFor('client');

  return (
    <main className="toplight flex min-h-screen flex-col items-center justify-center px-6 py-32">
      <div className="pointer-events-none absolute inset-0 gridlines gridlines-fade" aria-hidden />
      <div className="relative w-full max-w-[420px]">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <LoginForm role="client" title="Client Portal" subtitle="Projects, milestones, messages and files." demoEmail={creds.email} demoPassword={creds.password} />
        <p className="mt-5 text-center">
          <Link href="/portal/forgot" className="link-underline text-[12.5px] text-faint hover:text-ink">Forgot your password?</Link>
        </p>
      </div>
    </main>
  );
}
