import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '@/components/layout/Logo';
import { ResetForm } from '@/components/auth/ResetForms';
import { pageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Set New Password', description: 'Choose a new password.', path: '/portal/reset' }), robots: { index: false } };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  return (
    <main className="toplight flex min-h-screen flex-col items-center justify-center px-6 py-32">
      <div className="w-full max-w-[400px]">
        <div className="flex justify-center"><Logo /></div>
        <div className="mt-10 rounded-2xl border border-line bg-surface p-8 shadow-[0_24px_60px_-28px_rgba(23,25,30,0.25)]">
          <h1 className="font-display text-[22px] font-semibold text-ink">Set a new password</h1>
          {token ? (
            <>
              <p className="mb-6 mt-2 text-[13px] leading-relaxed text-soft">Choose a new password for your account.</p>
              <ResetForm token={token} />
            </>
          ) : (
            <div className="mt-3">
              <p className="text-[13.5px] leading-relaxed text-soft">This reset link is missing its token — it may have been copied incorrectly.</p>
              <Link href="/portal/forgot" className="mt-5 inline-block rounded-full bg-ink px-6 py-2.5 text-[13px] font-medium text-paper hover:bg-coal">Request a new link</Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
