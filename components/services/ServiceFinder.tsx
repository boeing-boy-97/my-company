'use client';
// "Which service do I need?" — a deterministic decision tree. No AI, no guessing:
// every answer maps to a real service page with honest scope guidance.
import Link from 'next/link';
import { useState } from 'react';

interface Option {
  id: string;
  label: string;
  detail: string;
  result: {
    service: string;
    slug: string;
    why: string;
    scope: string;
    next: string;
  };
}

const OPTIONS: Option[] = [
  {
    id: 'manual',
    label: 'Repetitive manual work is eating our time',
    detail: 'Copy-paste, data entry, chasing updates, moving things between tools.',
    result: {
      service: 'AI Automation',
      slug: 'ai-automation',
      why: 'If the work follows rules and repeats, it can be automated — with humans kept in the loop for judgment calls.',
      scope: 'Process audit, automation build, integrations with your current tools, monitoring.',
      next: 'Describe one workflow that hurts most — we’ll map what can be automated.',
    },
  },
  {
    id: 'conversations',
    label: 'Customer enquiries or support don’t scale',
    detail: 'Slow responses, missed messages, the same questions answered daily.',
    result: {
      service: 'AI Agents',
      slug: 'ai-agents',
      why: 'An agent can hold the conversation, look up real data, act on it, and escalate to a human when needed.',
      scope: 'Agent design, knowledge and permissions setup, channel integration (WhatsApp, web, email), escalation rules.',
      next: 'Tell us where the conversations happen and what a good answer looks like.',
    },
  },
  {
    id: 'software',
    label: 'We need software built for how we actually operate',
    detail: 'Internal tools, dashboards, portals — off-the-shelf doesn’t fit.',
    result: {
      service: 'Custom Software',
      slug: 'software',
      why: 'When the process is the differentiator, purpose-built software beats forcing your team into generic tools.',
      scope: 'Discovery, UX, application build, APIs, data model, deployment and handover.',
      next: 'Walk us through the workflow today — spreadsheets and all.',
    },
  },
  {
    id: 'product',
    label: 'We want a customer-facing app or website',
    detail: 'A product, storefront, or platform for our users.',
    result: {
      service: 'Web & Mobile',
      slug: 'web-mobile',
      why: 'Customer-facing surfaces need research, design discipline and performance — not just code.',
      scope: 'Research and UX, design, frontend and backend build, analytics, launch support.',
      next: 'Share who the users are and the one job the product must do well.',
    },
  },
  {
    id: 'ai-idea',
    label: 'We have an AI idea but don’t know if it’s viable',
    detail: 'A concept that needs validation before real investment.',
    result: {
      service: 'AI Product Development',
      slug: 'ai-products',
      why: 'AI ideas need structured validation — prototype, evaluate against real data, then decide — before full build.',
      scope: 'Idea validation, prototype, evaluation framework, MVP, path to production.',
      next: 'Describe the idea and the problem behind it — we’ll tell you honestly what to test first.',
    },
  },
  {
    id: 'integration',
    label: 'Our systems don’t talk to each other',
    detail: 'CRM, ERP, accounting, e-commerce — data lives in silos.',
    result: {
      service: 'System Integration',
      slug: 'integration',
      why: 'Disconnected systems create double entry and blind spots. An integration layer makes them one source of truth.',
      scope: 'Systems audit, integration architecture, API/event build, sync and error handling.',
      next: 'List the systems involved and what data must move between them.',
    },
  },
];

export default function ServiceFinder() {
  const [selected, setSelected] = useState<Option | null>(null);

  return (
    <div className="rounded-3xl border border-line bg-surface p-7 md:p-10">
      <p className="label-tech">Find your starting point</p>
      <h2 className="display-tight mt-3 font-display text-[clamp(1.5rem,3vw,2.1rem)] font-semibold tracking-tight text-ink">
        Which service do I need?
      </h2>
      <p className="mt-2 max-w-[560px] text-[14.5px] leading-relaxed text-soft">
        Pick the situation that sounds most like yours. We’ll point you to the right practice — and what to bring to the first conversation.
      </p>

      <div className="mt-7 grid gap-2.5 sm:grid-cols-2" role="group" aria-label="Choose your situation">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            onClick={() => setSelected(o)}
            aria-pressed={selected?.id === o.id}
            className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
              selected?.id === o.id ? 'border-ink bg-paper shadow-[0_10px_30px_-18px_rgba(23,25,30,0.4)]' : 'border-line bg-paper/60 hover:border-ink/30'
            }`}
          >
            <span className="block text-[14px] font-semibold text-ink">{o.label}</span>
            <span className="mt-1 block text-[12.5px] leading-relaxed text-faint">{o.detail}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-8 animate-fadeswap rounded-2xl border border-line bg-paper p-6 md:p-8" role="status">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-tech text-faint">Recommended starting point</p>
            <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-tech text-accentdeep">{selected.result.service}</span>
          </div>
          <dl className="mt-5 space-y-4">
            <div>
              <dt className="font-mono text-[9.5px] uppercase tracking-tech text-faint">Why this fits</dt>
              <dd className="mt-1 text-[14px] leading-relaxed text-ink">{selected.result.why}</dd>
            </div>
            <div>
              <dt className="font-mono text-[9.5px] uppercase tracking-tech text-faint">Typical scope</dt>
              <dd className="mt-1 text-[14px] leading-relaxed text-soft">{selected.result.scope}</dd>
            </div>
            <div>
              <dt className="font-mono text-[9.5px] uppercase tracking-tech text-faint">Next step</dt>
              <dd className="mt-1 text-[14px] leading-relaxed text-soft">{selected.result.next}</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/services/${selected.result.slug}`} className="rounded-full bg-ink px-6 py-3 text-[13.5px] font-medium text-paper transition-colors hover:bg-coal">
              Explore {selected.result.service}
            </Link>
            <Link href="/start-project" className="rounded-full border border-line px-6 py-3 text-[13.5px] font-medium text-ink transition-colors hover:border-ink/40">
              Start a project instead
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
