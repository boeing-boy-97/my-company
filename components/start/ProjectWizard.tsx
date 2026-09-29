'use client';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { OptionChip, TextAreaField, TextField, FieldLabel, FieldError, SelectField } from '@/components/ui/Fields';
import { submitProjectBrief, trackAction, type ProjectBriefInput } from '@/lib/actions';
import { HONEYPOT_FIELD } from '@/components/ui/Honeypot';

const PROJECT_TYPES = ['Build something new', 'Automate a business process', 'Build an AI agent', 'Improve existing software', 'Build a website', 'Build a mobile application', 'Build a SaaS product', 'Integrate systems', 'Other'];
const ASSETS = ['Idea', 'Requirements', 'Design', 'Existing website', 'Existing application', 'Existing backend', 'Existing automation', 'Nothing yet'];
const TIMELINES = ['ASAP', '1 month', '1–3 months', '3–6 months', 'Flexible'];
const BUDGETS = ['Under $1,000', '$1,000–$5,000', '$5,000–$10,000', '$10,000–$25,000', '$25,000+', 'Not sure'];
const CHANNELS = ['Email', 'Phone', 'WhatsApp'];
const CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'AED'] as const;
const CURRENCY_LABELS: Record<(typeof CURRENCIES)[number], string> = { USD: '$ USD', INR: '₹ INR', EUR: '€ EUR', GBP: '£ GBP', AED: 'AED' };

const STEPS = ['What', 'Problem', 'Assets', 'Current', 'Timeline', 'Budget', 'Company', 'Contact', 'Review'];

// Session persistence — progress survives refresh/back within the browser session.
const STORAGE_KEY = 'kiln-wizard-v1';

interface SavedWizard {
  v: number;
  step: number;
  projectTypes: string[];
  objective: string;
  assets: string[];
  currentTech: string;
  timeline: string;
  budget: string;
  currency: string;
  companyName: string;
  website: string;
  industry: string;
  country: string;
  contactName: string;
  email: string;
  phone: string;
  whatsapp: string;
  channel: string;
}

function loadSaved(): SavedWizard | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedWizard;
    if (parsed.v !== 2) return null;
    return parsed;
  } catch {
    return null;
  }
}

const EXAMPLE_PROBLEMS = [
  '“We receive 200+ WhatsApp enquiries daily and respond manually — leads slip away.”',
  '“Our staff re-key invoice data from email into the accounting system every day.”',
  '“We have an idea for a booking platform but nothing built yet.”',
];

interface WizardProps {
  initialIdea?: string;
  initialType?: string;
}

export default function ProjectWizard({ initialIdea, initialType }: WizardProps) {
  const saved = useMemo(loadSaved, []);

  const [step, setStep] = useState(saved?.step || 0);
  const [projectTypes, setProjectTypes] = useState<string[]>(() => {
    if (saved?.projectTypes?.length) return saved.projectTypes;
    if (!initialType) return [];
    const h = initialType.toLowerCase();
    const match =
      (h.includes('automation') && 'Automate a business process') ||
      (h.includes('agent') && 'Build an AI agent') ||
      (h.includes('mobile') && 'Build a mobile application') ||
      (h.includes('saas') && 'Build a SaaS product') ||
      (h.includes('website') && 'Build a website') ||
      (h.includes('integrat') && 'Integrate systems') ||
      (h.includes('software') && 'Build something new') ||
      '';
    return match ? [match] : [];
  });
  const [objective, setObjective] = useState(saved?.objective || initialIdea || '');
  const [assets, setAssets] = useState<string[]>(saved?.assets || []);
  const [currentTech, setCurrentTech] = useState(saved?.currentTech || '');
  const [timeline, setTimeline] = useState(saved?.timeline || '');
  const [budget, setBudget] = useState(saved?.budget || '');
  const [currency, setCurrency] = useState(saved?.currency || 'USD');
  const [companyName, setCompanyName] = useState(saved?.companyName || '');
  const [website, setWebsite] = useState(saved?.website || '');
  const [industry, setIndustry] = useState(saved?.industry || '');
  const [country, setCountry] = useState(saved?.country || '');
  const [contactName, setContactName] = useState(saved?.contactName || '');
  const [email, setEmail] = useState(saved?.email || '');
  const [phone, setPhone] = useState(saved?.phone || '');
  const [whatsapp, setWhatsapp] = useState(saved?.whatsapp || '');
  const [channel, setChannel] = useState(saved?.channel || 'Email');
  const [honeypot, setHoneypot] = useState('');
  const [restored, setRestored] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [submitted, setSubmitted] = useState<{ ref: string; duplicate?: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();
  const startedRef = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackAction('project_form_started');
    }
  }, []);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  // Restore notice — shown briefly when saved progress is picked back up.
  useEffect(() => {
    if (saved) setRestored(true);
    const t = setTimeout(() => setRestored(false), 4000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist every change to sessionStorage so progress is never lost.
  useEffect(() => {
    if (submitted) return;
    try {
      const snapshot: SavedWizard = {
        v: 2, step, projectTypes, objective, assets, currentTech, timeline, budget, currency,
        companyName, website, industry, country, contactName, email, phone, whatsapp, channel,
      };
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      /* storage unavailable — the form still works, it just won't persist */
    }
  }, [step, projectTypes, objective, assets, currentTech, timeline, budget, currency, companyName, website, industry, country, contactName, email, phone, whatsapp, channel, submitted]);

  // Warn before leaving the page with unsaved progress.
  useEffect(() => {
    const hasProgress = step > 0 || objective.trim().length > 0 || projectTypes.length > 0 || contactName.trim().length > 0;
    if (!hasProgress || submitted) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [step, objective, projectTypes, contactName, submitted]);

  // Capture where the visitor came from (source URL + UTM params).
  const utmRef = useRef<{ sourceUrl: string; utm: { source: string; medium: string; campaign: string } } | null>(null);
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      utmRef.current = {
        sourceUrl: window.location.href,
        utm: {
          source: p.get('utm_source') || document.referrer || '',
          medium: p.get('utm_medium') || '',
          campaign: p.get('utm_campaign') || '',
        },
      };
    } catch {
      utmRef.current = null;
    }
  }, []);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) => {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const validateStep = (): boolean => {
    const errs: Record<string, string> = {};
    if (step === 0 && projectTypes.length === 0) errs.types = 'Pick at least one option — “Other” works too.';
    if (step === 1 && objective.trim().length < 12) errs.objective = 'Tell us a little more — one or two sentences is perfect.';
    if (step === 4 && !timeline) errs.timeline = 'Select a timeline — “Flexible” is fine.';
    if (step === 5 && !budget) errs.budget = 'Select a range — “Not sure” is a valid answer.';
    if (step === 7) {
      if (!contactName.trim()) errs.contactName = 'Your name is required';
      if (!email.trim()) errs.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) errs.email = 'Enter a valid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const summary = useMemo(
    () => [
      { label: 'Project type', value: projectTypes.join(', ') || '—' },
      { label: 'Objective', value: objective.trim() || '—' },
      { label: 'Existing assets', value: assets.join(', ') || '—' },
      { label: 'Current tech', value: currentTech.trim() || '—' },
      { label: 'Timeline', value: timeline || '—' },
      { label: 'Budget', value: budget ? `${budget}${budget !== 'Not sure' ? ` (${currency})` : ''}` : '—' },
      { label: 'Company', value: companyName || '—' },
      { label: 'Contact', value: `${contactName} · ${email}` || '—' },
      { label: 'Preferred channel', value: channel },
    ],
    [projectTypes, objective, assets, currentTech, timeline, budget, currency, companyName, contactName, email, channel]
  );

  const submit = () => {
    setServerError('');
    const payload: ProjectBriefInput = {
      projectTypes,
      objective,
      existingAssets: assets,
      currentTech,
      timeline,
      budgetRange: budget,
      currency,
      companyName,
      website,
      industry,
      country,
      contactName,
      email,
      phone,
      whatsapp,
      preferredChannel: channel,
      sourceUrl: utmRef.current?.sourceUrl || '',
      utm: utmRef.current?.utm,
      honeypot,
    };
    startTransition(async () => {
      const res = await submitProjectBrief(payload);
      if (res.ok) {
        try {
          window.sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          /* nothing to clear */
        }
        setSubmitted({ ref: res.ref || '—', duplicate: Boolean(res.duplicate) });
        return;
      }
      setServerError(res.error || 'Something went wrong — please try again.');
      if (res.errors && Object.keys(res.errors).length > 0) {
        setStep(7);
        setErrors(res.errors);
      }
    });
  };

  /* ---------------- success screen ---------------- */
  if (submitted) {
    return (
      <div ref={topRef} className="mx-auto max-w-[680px] scroll-mt-32 animate-fadeswap">
        <div className="rounded-3xl border border-line bg-surface p-8 text-center md:p-14">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ok/10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden className="text-ok">
              <path d="M4 12.5 9.5 18 20 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h2 className="display-tight mt-6 font-display text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold text-ink">Your project brief is with us.</h2>
          <p className="mx-auto mt-3 max-w-[440px] text-[15.5px] leading-relaxed text-soft">
            We’ll reply within one business day with next steps and a few clarifying questions. A confirmation email is on its way to <span className="font-medium text-ink">{email}</span>.
          </p>
          <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-full border border-line bg-paper px-6 py-3">
            <span className="font-mono text-[10.5px] uppercase tracking-tech text-faint">Reference</span>
            <span className="font-mono text-[15px] font-semibold text-accentdeep">{submitted.ref}</span>
          </div>
          {submitted.duplicate && (
            <p className="mx-auto mt-3 max-w-[420px] text-[13px] text-faint">We already had this exact brief from you — no duplicate created, same reference applies.</p>
          )}
          <div className="mt-10 grid gap-3 text-left sm:grid-cols-3">
            {[
              { n: '01', t: 'We review', d: 'Your brief reaches the team today.' },
              { n: '02', t: 'We reply', d: 'Within one business day, with questions.' },
              { n: '03', t: 'We scope', d: 'A short call turns this into a plan.' },
            ].map((s) => (
              <div key={s.n} className="rounded-xl border border-line bg-paper p-4">
                <span className="font-mono text-[10px] text-accent">{s.n}</span>
                <p className="mt-1 text-[13.5px] font-semibold text-ink">{s.t}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-faint">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="inline-flex items-center justify-center rounded-full border border-line px-7 py-3 text-[14px] font-medium text-ink transition-colors hover:border-ink/40">
              Back to home
            </Link>
            <Link href="/work" className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-coal">
              View our work
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- wizard ---------------- */
  return (
    <div ref={topRef} className="mx-auto max-w-[820px] scroll-mt-32">
      <div className="hp-field" aria-hidden="true">
        <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
        <input id={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>
      {/* progress header */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-tech text-soft">
            Step {String(step + 1).padStart(2, '0')} <span className="text-faint">/ {String(STEPS.length).padStart(2, '0')}</span>
          </p>
          <p className="font-mono text-[11px] uppercase tracking-tech text-faint">{STEPS[step]}</p>
        </div>
        <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS.length} aria-label="Form progress">
          <div className="h-full rounded-full bg-accent transition-all duration-500 ease-out" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      {restored && (
        <p role="status" className="mb-5 flex items-center gap-2.5 rounded-xl border border-ok/30 bg-ok/5 px-4 py-3 text-[13px] text-soft">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0 text-ok">
            <path d="M2 7.4 5.2 10.5 12 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Picked up where you left off — your answers from this session are restored.
        </p>
      )}

      <div key={step} className="animate-fadeswap rounded-3xl border border-line bg-surface p-7 md:p-11">
        {/* STEP 0 — type */}
        {step === 0 && (
          <fieldset>
            <legend className="display-tight font-display text-[clamp(1.5rem,3vw,2.1rem)] font-semibold text-ink">What are you looking for?</legend>
            <p className="mt-2 text-[14.5px] text-soft">Pick everything that applies — we’ll narrow it together.</p>
            <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {PROJECT_TYPES.map((t) => (
                <OptionChip key={t} selected={projectTypes.includes(t)} onClick={() => toggle(projectTypes, setProjectTypes, t)}>
                  {t}
                </OptionChip>
              ))}
            </div>
            <FieldError id="types-err" error={errors.types} />
          </fieldset>
        )}

        {/* STEP 1 — problem */}
        {step === 1 && (
          <div>
            <h2 className="display-tight font-display text-[clamp(1.5rem,3vw,2.1rem)] font-semibold text-ink">What problem are you trying to solve?</h2>
            <p className="mt-2 text-[14.5px] text-soft">Plain language is perfect. What’s slow, manual, broken — or unbuilt?</p>
            <div className="mt-6">
              <TextAreaField id="objective" label="The problem, in your words" value={objective} onChange={(e) => setObjective(e.target.value)} rows={6} placeholder="e.g. We receive hundreds of WhatsApp enquiries a day and answer them manually…" error={errors.objective} required />
            </div>
            <div className="mt-4 space-y-1.5">
              {EXAMPLE_PROBLEMS.map((ex) => (
                <button key={ex} type="button" onClick={() => setObjective(ex.replace(/[“”]/g, ''))} className="block w-full rounded-lg border border-linedark bg-paper px-4 py-2.5 text-left text-[13px] text-faint transition-colors hover:border-line hover:text-soft">
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — assets */}
        {step === 2 && (
          <fieldset>
            <legend className="display-tight font-display text-[clamp(1.5rem,3vw,2.1rem)] font-semibold text-ink">What do you already have?</legend>
            <p className="mt-2 text-[14.5px] text-soft">Starting from zero is completely fine.</p>
            <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {ASSETS.map((a) => (
                <OptionChip key={a} selected={assets.includes(a)} onClick={() => toggle(assets, setAssets, a)}>
                  {a}
                </OptionChip>
              ))}
            </div>
          </fieldset>
        )}

        {/* STEP 3 — current technology (optional) */}
        {step === 3 && (
          <div>
            <h2 className="display-tight font-display text-[clamp(1.5rem,3vw,2.1rem)] font-semibold text-ink">What technology are you running today?</h2>
            <p className="mt-2 text-[14.5px] text-soft">Optional — but it helps us understand what has to connect. Spreadsheets count.</p>
            <div className="mt-6">
              <TextAreaField id="currentTech" label="Current systems & tools" hint="Optional — skip if not sure" value={currentTech} onChange={(e) => setCurrentTech(e.target.value)} rows={4} placeholder="e.g. Shopify store, Tally for accounting, enquiries tracked in a Google Sheet, WhatsApp Business…" />
            </div>
          </div>
        )}

        {/* STEP 4 — timeline */}
        {step === 4 && (
          <fieldset>
            <legend className="display-tight font-display text-[clamp(1.5rem,3vw,2.1rem)] font-semibold text-ink">When do you want this running?</legend>
            <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {TIMELINES.map((t) => (
                <OptionChip key={t} selected={timeline === t} onClick={() => setTimeline(t)}>
                  {t}
                </OptionChip>
              ))}
            </div>
            <FieldError id="timeline-err" error={errors.timeline} />
          </fieldset>
        )}

        {/* STEP 5 — budget */}
        {step === 5 && (
          <fieldset>
            <legend className="display-tight font-display text-[clamp(1.5rem,3vw,2.1rem)] font-semibold text-ink">What budget range are you thinking?</legend>
            <p className="mt-2 text-[14.5px] text-soft">A range helps us recommend the right scope. “Not sure” is a perfectly good answer.</p>
            <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {BUDGETS.map((b) => (
                <OptionChip key={b} selected={budget === b} onClick={() => setBudget(b)}>
                  {b}
                </OptionChip>
              ))}
            </div>
            <div className="mt-6 max-w-[240px]">
              <SelectField
                id="currency"
                label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                options={CURRENCIES.map((c) => ({ value: c, label: CURRENCY_LABELS[c] }))}
              />
            </div>
            <FieldError id="budget-err" error={errors.budget} />
          </fieldset>
        )}

        {/* STEP 6 — company */}
        {step === 6 && (
          <div>
            <h2 className="display-tight font-display text-[clamp(1.5rem,3vw,2.1rem)] font-semibold text-ink">Tell us about your company</h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <TextField id="companyName" label="Company name" optional value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="The name you'll be invoiced as" autoComplete="organization" />
              <TextField id="website" label="Website" optional value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="acme.com" error={errors.website} />
              <TextField id="industry" label="Industry" optional value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Logistics" />
              <TextField id="country" label="Country" optional value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. United Arab Emirates" autoComplete="country-name" />
            </div>
          </div>
        )}

        {/* STEP 7 — contact */}
        {step === 7 && (
          <div>
            <h2 className="display-tight font-display text-[clamp(1.5rem,3vw,2.1rem)] font-semibold text-ink">How should we contact you?</h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <TextField id="contactName" label="Your name" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Full name" error={errors.contactName} required autoComplete="name" />
              <TextField id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" error={errors.email} required autoComplete="email" />
              <TextField id="phone" label="Phone" optional type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 …" error={errors.phone} autoComplete="tel" />
              <TextField id="whatsapp" label="WhatsApp" optional type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+91 …" />
            </div>
            <div className="mt-6">
              <FieldLabel>Preferred communication method</FieldLabel>
              <div className="flex flex-wrap gap-2.5">
                {CHANNELS.map((c) => (
                  <button key={c} type="button" onClick={() => setChannel(c)} aria-pressed={channel === c} className={`rounded-full border px-5 py-2.5 text-[13.5px] font-medium transition-all ${channel === c ? 'border-ink bg-ink text-paper' : 'border-line bg-surface text-soft hover:border-ink/30'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 8 — review */}
        {step === 8 && (
          <div>
            <h2 className="display-tight font-display text-[clamp(1.5rem,3vw,2.1rem)] font-semibold text-ink">Your project brief is ready.</h2>
            <p className="mt-2 text-[14.5px] text-soft">One look, then send. You can go back and edit anything.</p>
            <dl className="mt-7 divide-y divide-linedark rounded-2xl border border-line bg-paper">
              {summary.map((row) => (
                <div key={row.label} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[170px_1fr] sm:gap-4">
                  <dt className="font-mono text-[10.5px] uppercase tracking-tech text-faint sm:pt-1">{row.label}</dt>
                  <dd className="text-[14px] leading-relaxed text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
            {serverError && (
              <p role="alert" className="mt-4 rounded-lg border border-[#C0392B]/30 bg-[#C0392B]/5 px-4 py-3 text-[13.5px] text-[#a53223]">
                {serverError}
              </p>
            )}
          </div>
        )}

        {/* nav buttons */}
        <div className="mt-9 hidden items-center justify-between border-t border-linedark pt-6 md:flex">
          <button type="button" onClick={back} disabled={step === 0 || isPending} className="rounded-full px-5 py-2.5 text-[14px] font-medium text-soft transition-colors hover:text-ink disabled:invisible">
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-3 text-[14.5px] font-medium text-paper transition-all duration-300 hover:bg-coal active:scale-[0.985]">
              Continue
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={isPending} className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-8 py-3.5 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-accentdeep active:scale-[0.985] disabled:opacity-60">
              {isPending ? 'Submitting…' : 'Submit Project'}
              {!isPending && (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 pb-24 text-center text-[12.5px] text-faint md:pb-0">
        No spam, no obligation. Your brief goes directly to the team — protected by server-side validation and rate limiting.
      </p>

      {/* sticky mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-line bg-paper/95 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-[820px] items-center justify-between gap-3">
          <button type="button" onClick={back} disabled={step === 0 || isPending} className="rounded-full border border-line px-5 py-2.5 text-[13.5px] font-medium text-soft disabled:opacity-40">
            ← Back
          </button>
          <p className="font-mono text-[10px] uppercase tracking-tech text-faint">
            {String(step + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')} · {STEPS[step]}
          </p>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="rounded-full bg-ink px-6 py-2.5 text-[13.5px] font-medium text-paper active:scale-[0.985]">
              Next →
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={isPending} className="rounded-full bg-accent px-6 py-2.5 text-[13.5px] font-semibold text-white disabled:opacity-60">
              {isPending ? 'Sending…' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
