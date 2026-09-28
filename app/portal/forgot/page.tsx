import type { Metadata } from 'next';
import Logo from '@/components/layout/Logo';
import { ForgotForm } from '@/components/auth/ResetForms';
import { pageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...pageSeo({ title: 'Reset Password', description: 'Request a password reset link.', path: '/portal/forgot' }), robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <main className="toplight flex min-h-screen flex-col items-center justify-center px-6 py-32">
      <div className="w-full max-w-[400px]">
        <div className="flex justify-center"><Logo /></div>
        <div className="mt-10 rounded-2xl border border-line bg-surface p-8 shadow-[0_24px_60px_-28px_rgba(23,25,30,0.25)]">
          <h1 className="font-display text-[22px] font-semibold text-ink">Forgot your password?</h1>
          <p className="mb-6 mt-2 text-[13px] leading-relaxed text-soft">Enter your account email and we’ll send a reset link.</p>
          <ForgotForm />
        </div>
      </div>
    </main>
  );
}
