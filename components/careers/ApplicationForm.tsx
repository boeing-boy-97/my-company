'use client';
import { useState, useTransition } from 'react';
import { TextField, TextAreaField, FieldLabel, FieldError } from '@/components/ui/Fields';
import { submitApplication } from '@/lib/actions';

export default function ApplicationForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const errs: Record<string, string> = {};
    if (!name) errs.name = 'Your name is required';
    if (!email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errs.email = 'Enter a valid email address';
    const file = data.get('resume');
    if (file instanceof File && file.size > 5 * 1024 * 1024) errs.resume = 'Resume must be under 5 MB';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    startTransition(async () => {
      const res = await submitApplication(data);
      if (res.ok) setDone(true);
      else {
        setServerError(res.error || 'Something went wrong — please try again.');
        if (res.errors) setErrors(res.errors);
      }
    });
  };

  if (done) {
    return (
      <div id="apply" className="rounded-2xl border border-line bg-surface p-10 text-center animate-fadeswap">
        <p className="display-tight font-display text-[22px] font-semibold text-ink">Application received.</p>
        <p className="mx-auto mt-2 max-w-[400px] text-[14.5px] leading-relaxed text-soft">
          Thanks for applying for <span className="font-medium text-ink">{jobTitle}</span>. We review every application and will reply either way.
        </p>
      </div>
    );
  }

  return (
    <form id="apply" onSubmit={onSubmit} noValidate className="scroll-mt-32 rounded-2xl border border-line bg-surface p-7 md:p-9">
      <h2 className="display-tight font-display text-[22px] font-semibold text-ink">Apply for this role</h2>
      <p className="mt-1.5 text-[13.5px] text-soft">Takes two minutes. A portfolio or GitHub link helps more than a cover letter.</p>
      <input type="hidden" name="jobId" value={jobId} />

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <TextField id="a-name" name="name" label="Full name" error={errors.name} required autoComplete="name" />
        <TextField id="a-email" name="email" label="Email" type="email" error={errors.email} required autoComplete="email" />
      </div>

      <div className="mt-5">
        <FieldLabel htmlFor="a-resume">Resume (PDF or DOC, max 5 MB)</FieldLabel>
        <input id="a-resume" name="resume" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="field file:text-[13px] file:font-medium" />
        <FieldError id="a-resume-err" error={errors.resume} />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <TextField id="a-portfolio" name="portfolio" label="Portfolio" optional placeholder="https://" />
        <TextField id="a-github" name="github" label="GitHub" optional placeholder="github.com/you" />
        <TextField id="a-linkedin" name="linkedin" label="LinkedIn" optional placeholder="linkedin.com/in/you" />
      </div>

      <div className="mt-5">
        <TextAreaField id="a-message" name="message" label="Anything you want us to know?" rows={4} hint="Projects you’re proud of, what you want to work on, notice period — anything relevant." />
      </div>

      {serverError && (
        <p role="alert" className="mt-4 rounded-lg border border-[#C0392B]/30 bg-[#C0392B]/5 px-4 py-3 text-[13.5px] text-[#a53223]">
          {serverError}
        </p>
      )}

      <button type="submit" disabled={isPending} className="group mt-7 inline-flex items-center gap-2.5 rounded-full bg-ink px-8 py-3.5 text-[15px] font-medium text-paper transition-all duration-300 hover:bg-coal active:scale-[0.985] disabled:opacity-60">
        {isPending ? 'Submitting…' : 'Submit Application'}
        {!isPending && (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </form>
  );
}
