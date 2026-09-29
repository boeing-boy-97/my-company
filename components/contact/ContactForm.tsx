'use client';
import { useState, useTransition } from 'react';
import { TextField, TextAreaField, SelectField } from '@/components/ui/Fields';
import Honeypot, { HONEYPOT_FIELD } from '@/components/ui/Honeypot';
import { submitContact } from '@/lib/actions';

// Per-topic follow-up: one contextual question, so the first message is already useful.
const CONTEXT_BY_TOPIC: Record<string, { q: string; h: string }> = {
    'A project': { q: 'What are you trying to build or fix?', h: 'One sentence about the system or problem helps us route you to the right person.' },
    'Partnership': { q: 'What would partnering look like?', h: 'Complementary capability, region, or client overlap — whatever you have in mind.' },
    'Careers': { q: 'Which role, and why now?', h: 'Paste a role title from the careers page if there’s one open.' },
    'Press': { q: 'Outlet and deadline', h: 'Topic, format and timing so we can respond usefully.' },
    'Something else': { q: 'Best-effort context', h: 'Anything that helps the right person reply.' },
};

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('A project');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [context, setContext] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const honeypot = String(new FormData(e.currentTarget).get(HONEYPOT_FIELD) || '');
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Your name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) errs.email = 'Enter a valid email address';
    if (message.trim().length < 10) errs.message = 'Add a little more detail';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    startTransition(async () => {
      const res = await submitContact({ name, email, topic, message, company, website, budget, timeline, context, honeypot });
      if (res.ok) setDone(true);
      else {
        setServerError(res.error || 'Something went wrong — please try again.');
        if (res.errors) setErrors(res.errors);
      }
    });
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-10 text-center animate-fadeswap">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ok/10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className="text-ok">
            <path d="M4 12.5 9.5 18 20 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="display-tight mt-5 font-display text-[22px] font-semibold text-ink">Message received.</p>
        <p className="mx-auto mt-2 max-w-[380px] text-[14.5px] leading-relaxed text-soft">We’ll get back to you within one business day. A confirmation has been sent to {email}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-2xl border border-line bg-surface p-7 md:p-9">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="c-name" label="Your name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} required autoComplete="name" />
        <TextField id="c-email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} required autoComplete="email" />
      </div>
      <div className="mt-5">
        <TextField id="c-company" label="Company" optional value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Where you work" autoComplete="organization" />
        <TextField id="c-website" label="Company website" optional value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="yourcompany.com" error={errors.website} />
        <SelectField
          id="c-topic"
          label="What do you need?"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          options={['General enquiry', 'A project', 'Partnership', 'Careers', 'Press', 'Something else'].map((t) => ({ value: t, label: t }))}
        />
      </div>
      {CONTEXT_BY_TOPIC[topic] && (
        <div className="mt-5 rounded-xl border border-line bg-paper px-4 py-4 animate-fadeswap">
          <p className="font-mono text-[9.5px] uppercase tracking-tech text-accentdeep">One useful detail</p>
          <p className="mt-1 text-[13px] text-soft">{CONTEXT_BY_TOPIC[topic].h}</p>
          <div className="mt-3">
            <TextField id="c-context" label={CONTEXT_BY_TOPIC[topic].q} optional value={context} onChange={(e) => setContext(e.target.value)} />
          </div>
        </div>
      )}
      {(topic === 'A project' || topic === 'General enquiry') && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <SelectField id="c-budget" label="Budget range (rough)" value={budget} onChange={(e) => setBudget(e.target.value)}
            options={[{ value: '', label: 'No preference' }, ...['Under $10k', '$10k – $30k', '$30k – $75k', '$75k+', 'Not sure yet'].map((t) => ({ value: t, label: t }))]} />
          <SelectField id="c-timeline" label="Timeline (rough)" value={timeline} onChange={(e) => setTimeline(e.target.value)}
            options={[{ value: '', label: 'No preference' }, ...['ASAP', 'This quarter', 'Next quarter', 'Exploring'].map((t) => ({ value: t, label: t }))]} />
        </div>
      )}
      <div className="mt-5">
        <TextAreaField id="c-message" label="Message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} error={errors.message} required placeholder="What can we help with?" />
      </div>
      {serverError && (
        <p role="alert" className="mt-4 rounded-lg border border-[#C0392B]/30 bg-[#C0392B]/5 px-4 py-3 text-[13.5px] text-[#a53223]">
          {serverError}
        </p>
      )}
      <button type="submit" disabled={isPending} className="group mt-7 inline-flex items-center gap-2.5 rounded-full bg-ink px-8 py-3.5 text-[15px] font-medium text-paper transition-all duration-300 hover:bg-coal active:scale-[0.985] disabled:opacity-60">
        {isPending ? 'Sending…' : 'Send Message'}
        {!isPending && (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </form>
  );
}
