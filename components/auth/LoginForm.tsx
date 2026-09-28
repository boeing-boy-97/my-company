'use client';
import { useState, useTransition } from 'react';
import { loginAction } from '@/lib/actions';
import { TextField } from '@/components/ui/Fields';

export default function LoginForm({ role, title, subtitle, demoEmail, demoPassword }: { role: 'admin' | 'client'; title: string; subtitle: string; demoEmail: string; demoPassword: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      const res = await loginAction(role, email, password);
      if (!res.ok) setError(res.error || 'Login failed');
      // On success the server action redirects.
    });
  };

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <form onSubmit={submit} className="rounded-3xl border border-line bg-surface p-8 md:p-10">
        <h1 className="display-tight font-display text-[24px] font-semibold text-ink">{title}</h1>
        <p className="mt-1.5 text-[13.5px] text-soft">{subtitle}</p>

        <div className="mt-7 space-y-5">
          <TextField id="login-email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          <TextField id="login-password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-[#C0392B]/30 bg-[#C0392B]/5 px-4 py-2.5 text-[13px] text-[#a53223]">
            {error}
          </p>
        )}

        <button type="submit" disabled={isPending} className="mt-7 w-full rounded-full bg-ink py-3.5 text-[15px] font-medium text-paper transition-all duration-300 hover:bg-coal active:scale-[0.985] disabled:opacity-60">
          {isPending ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <div className="mt-4 rounded-2xl border border-dashed border-line bg-paper px-6 py-4">
        <p className="font-mono text-[10px] uppercase tracking-tech text-faint">Development demo credentials</p>
        <p className="mt-2 font-mono text-[12px] leading-relaxed text-soft">
          {demoEmail}
          <br />
          {demoPassword}
        </p>
        <button
          type="button"
          onClick={() => {
            setEmail(demoEmail);
            setPassword(demoPassword);
          }}
          className="mt-2 text-[12px] font-medium text-accentdeep underline-offset-2 hover:underline"
        >
          Fill demo credentials
        </button>
      </div>
    </div>
  );
}
