'use client';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { requestPasswordReset, resetPassword } from '@/lib/actions';

export function ForgotForm() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await requestPasswordReset(email);
      if (res.ok) setDone(true);
      else setError(res.error);
    });
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-ok/30 bg-ok/5 p-6 text-center">
        <p className="font-display text-[17px] font-semibold text-ink">Check your inbox</p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-soft">If an account exists for that address, a reset link is on its way. It stays valid for one hour.</p>
        <Link href="/portal/login" className="mt-5 inline-block rounded-full bg-ink px-6 py-2.5 text-[13px] font-medium text-paper hover:bg-coal">Back to sign in</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="reset-email" className="mb-1.5 block text-[12.5px] font-medium text-soft">Account email</label>
        <input id="reset-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field w-full" placeholder="you@company.com" />
      </div>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">{error}</p>}
      <button type="submit" disabled={isPending} className="w-full rounded-full bg-ink px-6 py-3 text-[13.5px] font-medium text-paper transition-colors hover:bg-coal disabled:opacity-50">
        {isPending ? 'Sending…' : 'Send reset link'}
      </button>
      <Link href="/portal/login" className="link-underline block text-center text-[12.5px] text-faint hover:text-ink">Back to sign in</Link>
    </form>
  );
}

export function ResetForm({ token }: { token: string }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwords don’t match.');
      return;
    }
    startTransition(async () => {
      const res = await resetPassword(token, password);
      if (res.ok) setDone(true);
      else setError(res.error);
    });
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-ok/30 bg-ok/5 p-6 text-center">
        <p className="font-display text-[17px] font-semibold text-ink">Password updated</p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-soft">You can now sign in with your new password.</p>
        <Link href="/portal/login" className="mt-5 inline-block rounded-full bg-ink px-6 py-2.5 text-[13px] font-medium text-paper hover:bg-coal">Sign in</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="new-password" className="mb-1.5 block text-[12.5px] font-medium text-soft">New password</label>
        <input id="new-password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="field w-full" placeholder="At least 8 characters" />
      </div>
      <div>
        <label htmlFor="confirm-password" className="mb-1.5 block text-[12.5px] font-medium text-soft">Confirm password</label>
        <input id="confirm-password" type="password" required minLength={8} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="field w-full" placeholder="Repeat it" />
      </div>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">{error}</p>}
      <button type="submit" disabled={isPending} className="w-full rounded-full bg-ink px-6 py-3 text-[13.5px] font-medium text-paper transition-colors hover:bg-coal disabled:opacity-50">
        {isPending ? 'Saving…' : 'Set new password'}
      </button>
    </form>
  );
}
