'use client';

import { useState } from 'react';

/**
 * Kiln System Canvas — the site's signature visual.
 * A four-lane transformation diagram: PROBLEM → UNDERSTANDING → SYSTEM → OUTCOME.
 * Selecting any node (click / tap / keyboard) runs a worked trace through the
 * lanes. All traces are illustrative compositions, NOT live telemetry — the
 * header says so. Motion is limited to opacity/transform; honors reduced motion
 * via the global [data-rm] pattern (this component has no perpetual animation).
 */

type Node = { id: string; label: string; meta: string };
type Lane = { key: string; label: string; caption: string; nodes: Node[] };

const LANES: Lane[] = [
  {
    key: 'problem',
    label: 'Problem',
    caption: 'where work happens today',
    nodes: [
      { id: 'p1', label: 'WhatsApp enquiries', meta: 'unstructured' },
      { id: 'p2', label: 'Manual triage', meta: '3 people · daily' },
      { id: 'p3', label: 'Spreadsheet CRM', meta: '240 rows/wk' },
      { id: 'p4', label: 'Email attachments', meta: 'PDFs · invoices' },
    ],
  },
  {
    key: 'understanding',
    label: 'Understanding',
    caption: 'signals, rules, context',
    nodes: [
      { id: 'u1', label: 'Signal extraction', meta: 'parse' },
      { id: 'u2', label: 'Business rules', meta: 'versioned' },
      { id: 'u3', label: 'Customer context', meta: 'lookup' },
      { id: 'u4', label: 'Document AI', meta: 'fields → schema' },
    ],
  },
  {
    key: 'system',
    label: 'System',
    caption: 'decisions and execution',
    nodes: [
      { id: 's1', label: 'AI classification', meta: 'model + guardrails' },
      { id: 's2', label: 'Workflow engine', meta: 'queue · retry' },
      { id: 's3', label: 'API & data layer', meta: 'single source' },
      { id: 's4', label: 'Human approval', meta: 'reversible' },
    ],
  },
  {
    key: 'outcome',
    label: 'Outcome',
    caption: 'what changes for you',
    nodes: [
      { id: 'o1', label: 'Instant response', meta: 'first reply' },
      { id: 'o2', label: 'CRM updated', meta: 'no re-keying' },
      { id: 'o3', label: 'Escalation queue', meta: 'exceptions only' },
      { id: 'o4', label: 'Live visibility', meta: 'one dashboard' },
    ],
  },
];

// Illustrative traces — one per node, so every node teaches the whole path.
const TRACES: Record<string, { title: string; steps: { lane: string; text: string }[] }> = {
  p1: {
    title: 'Lead enquiry on WhatsApp',
    steps: [
      { lane: 'PROBLEM', text: 'Message arrives in a shared inbox' },
      { lane: 'UNDERSTANDING', text: 'Intent + entity extraction · customer looked up' },
      { lane: 'SYSTEM', text: 'AI drafts reply · rules decide routing' },
      { lane: 'OUTCOME', text: 'Answer in seconds · CRM updated · human approves edge cases' },
    ],
  },
  p2: {
    title: 'Manual triage replaced by routing',
    steps: [
      { lane: 'PROBLEM', text: 'Someone reads and forwards every enquiry' },
      { lane: 'UNDERSTANDING', text: 'Classified by topic, urgency, language' },
      { lane: 'SYSTEM', text: 'Workflow assigns owner · SLA timer starts' },
      { lane: 'OUTCOME', text: 'Nothing sits unread · load balances itself' },
    ],
  },
  p3: {
    title: 'Spreadsheet becomes a system of record',
    steps: [
      { lane: 'PROBLEM', text: 'Rows copied by hand between tools' },
      { lane: 'UNDERSTANDING', text: 'Fields mapped to a real data model' },
      { lane: 'SYSTEM', text: 'One store · APIs feed CRM, sheets, email' },
      { lane: 'OUTCOME', text: 'Every view agrees · edits sync instantly' },
    ],
  },
  p4: {
    title: 'Documents that process themselves',
    steps: [
      { lane: 'PROBLEM', text: 'Invoices arrive as PDFs in email' },
      { lane: 'UNDERSTANDING', text: 'Document AI extracts fields to schema' },
      { lane: 'SYSTEM', text: 'Validation rules · exceptions flagged' },
      { lane: 'OUTCOME', text: 'Accounting system fed · humans check only flags' },
    ],
  },
  u1: {
    title: 'Signal extraction from noise',
    steps: [
      { lane: 'PROBLEM', text: 'Requests buried in threads and forms' },
      { lane: 'UNDERSTANDING', text: 'Parse → structured events with confidence scores' },
      { lane: 'SYSTEM', text: 'Events trigger the right workflow' },
      { lane: 'OUTCOME', text: 'Work starts without a human sorting it' },
    ],
  },
  u2: {
    title: 'Business rules, written down',
    steps: [
      { lane: 'PROBLEM', text: 'Decisions live in people’s heads' },
      { lane: 'UNDERSTANDING', text: 'Rules captured, versioned, reviewable' },
      { lane: 'SYSTEM', text: 'Engine applies rules consistently at volume' },
      { lane: 'OUTCOME', text: 'Same answer every time · auditable' },
    ],
  },
  u3: {
    title: 'Context before the conversation',
    steps: [
      { lane: 'PROBLEM', text: 'Support opens a ticket blind' },
      { lane: 'UNDERSTANDING', text: 'History, plan, last orders pulled together' },
      { lane: 'SYSTEM', text: 'Context attached to ticket + agent reply' },
      { lane: 'OUTCOME', text: 'First response already knows the customer' },
    ],
  },
  u4: {
    title: 'Paper into data',
    steps: [
      { lane: 'PROBLEM', text: 'Forms and PDFs re-typed by staff' },
      { lane: 'UNDERSTANDING', text: 'Extraction with per-field confidence' },
      { lane: 'SYSTEM', text: 'Low-confidence routed to human review' },
      { lane: 'OUTCOME', text: 'Clean records · review time only where needed' },
    ],
  },
  s1: {
    title: 'AI that knows its limits',
    steps: [
      { lane: 'PROBLEM', text: 'Repetitive judgement calls at scale' },
      { lane: 'UNDERSTANDING', text: 'Model + guardrails + escalation policy' },
      { lane: 'SYSTEM', text: 'Classifies, drafts, routes — logs every decision' },
      { lane: 'OUTCOME', text: 'Fast standard cases · human-slow for the rest' },
    ],
  },
  s2: {
    title: 'A workflow you can watch',
    steps: [
      { lane: 'PROBLEM', text: 'Handoffs lost between tools' },
      { lane: 'UNDERSTANDING', text: 'Process mapped to states and events' },
      { lane: 'SYSTEM', text: 'Queue with retries, timeouts, dead-letter review' },
      { lane: 'OUTCOME', text: 'Every item has a known state — always' },
    ],
  },
  s3: {
    title: 'One API surface over many systems',
    steps: [
      { lane: 'PROBLEM', text: 'CRM · billing · support each hold a fragment' },
      { lane: 'UNDERSTANDING', text: 'Ownership and sync direction decided per field' },
      { lane: 'SYSTEM', text: 'Event-driven connectors with error monitoring' },
      { lane: 'OUTCOME', text: 'Any screen reads the same truth' },
    ],
  },
  s4: {
    title: 'Humans keep control',
    steps: [
      { lane: 'PROBLEM', text: 'Automation feels risky for big decisions' },
      { lane: 'UNDERSTANDING', text: 'Thresholds define what needs approval' },
      { lane: 'SYSTEM', text: 'Approval inbox · changes stay reversible' },
      { lane: 'OUTCOME', text: 'Speed of automation · judgment of people' },
    ],
  },
  o1: {
    title: 'Minutes become seconds',
    steps: [
      { lane: 'OUTCOME', text: 'First reply lands instantly, on-channel' },
      { lane: 'SYSTEM', text: 'Drafted by AI · bounded by rules' },
      { lane: 'UNDERSTANDING', text: 'Understood the question, found the answer' },
      { lane: 'PROBLEM', text: 'The enquiry that used to wait overnight' },
    ],
  },
  o2: {
    title: 'Systems updated by the work itself',
    steps: [
      { lane: 'OUTCOME', text: 'CRM, sheet, warehouse all current' },
      { lane: 'SYSTEM', text: 'Each event writes to the right place' },
      { lane: 'UNDERSTANDING', text: 'Fields mapped and validated' },
      { lane: 'PROBLEM', text: 'Re-keying at end of day' },
    ],
  },
  o3: {
    title: 'Attention for exceptions only',
    steps: [
      { lane: 'OUTCOME', text: 'People work the queue of “uncertain”' },
      { lane: 'SYSTEM', text: 'Confident items processed unattended' },
      { lane: 'UNDERSTANDING', text: 'Confidence measured per decision' },
      { lane: 'PROBLEM', text: 'Everything reviewed “to be safe”' },
    ],
  },
  o4: {
    title: 'Visibility without meetings',
    steps: [
      { lane: 'OUTCOME', text: 'One dashboard, refreshed by events' },
      { lane: 'SYSTEM', text: 'Pipeline emits metrics as it runs' },
      { lane: 'UNDERSTANDING', text: 'Definitions agreed at stage 01' },
      { lane: 'PROBLEM', text: 'Friday spreadsheets and guessing' },
    ],
  },
};

export default function KilnSystemCanvas() {
  const [active, setActive] = useState<string>('p1');
  const trace = TRACES[active];
  const laneOf = (nodeId: string) => LANES.find((l) => l.nodes.some((n) => n.id === nodeId))?.key;
  const activeLane = laneOf(active);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_80px_-50px_rgba(23,25,30,0.4)]">
      {/* canvas header — technical labels, explicitly not live data */}
      <div className="flex items-center justify-between border-b border-line bg-paper px-4 py-2.5">
        <div className="flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-tech text-faint">
          <span className="h-[5px] w-[5px] rounded-full bg-accent" aria-hidden />
          System canvas · 01
        </div>
        <span className="font-mono text-[9.5px] uppercase tracking-tech text-faint">Illustrative trace — not live telemetry</span>
      </div>

      <div className="grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-4">
        {LANES.map((lane, li) => (
          <div key={lane.key} className="relative bg-surface p-3.5">
            <div className="flex items-baseline justify-between gap-2">
              <p className={`font-mono text-[9.5px] uppercase tracking-tech ${activeLane === lane.key ? 'text-accentdeep' : 'text-faint'}`}>
                <span className="mr-1.5 text-faint">{String(li + 1).padStart(2, '0')}</span>
                {lane.label}
              </p>
              <span className="hidden text-[10px] italic text-faint lg:inline">{lane.caption}</span>
            </div>
            <div className="mt-2.5 space-y-1.5">
              {lane.nodes.map((n) => {
                const on = active === n.id;
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setActive(n.id)}
                    onMouseEnter={() => setActive(n.id)}
                    onFocus={() => setActive(n.id)}
                    aria-pressed={on}
                    className={`group flex w-full items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent ${
                      on
                        ? 'border-accent/45 bg-accenthalo shadow-[inset_2px_0_0_0_#E4572E]'
                        : 'border-line bg-paper hover:border-ink/20'
                    }`}
                  >
                    <span className={`truncate text-[12px] font-medium ${on ? 'text-ink' : 'text-soft group-hover:text-ink'}`}>{n.label}</span>
                    <span className={`shrink-0 font-mono text-[9px] ${on ? 'text-accentdeep' : 'text-faint'}`}>{n.meta}</span>
                  </button>
                );
              })}
            </div>
            {li < 3 && (
              <svg
                aria-hidden
                className="pointer-events-none absolute -right-[13px] top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 text-line xl:block"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M4 12h16m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* trace panel */}
      <div className="border-t border-line bg-paper px-4 py-3.5" aria-live="polite">
        <p className="font-mono text-[9.5px] uppercase tracking-tech text-faint">
          Trace — {trace.title}
        </p>
        <ol className="mt-2 grid gap-1 sm:grid-cols-2 xl:grid-cols-4">
          {trace.steps.map((st, i) => (
            <li key={st.lane + i} className="flex items-start gap-2 text-[11.5px] leading-snug text-soft">
              <span className="mt-[3px] shrink-0 font-mono text-[9px] tabular-nums text-accentdeep">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <span className="mr-1.5 font-mono text-[9px] uppercase tracking-tech text-faint">{st.lane}</span>
                <span className="text-ink/85">{st.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
