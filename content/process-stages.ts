// Process stages — single source for /process and the homepage strip.
// Each stage: what happens, what you receive, input/output, and the decision gate.
export type ProcessStage = {
  num: string;
  name: string;
  headline: string;
  body: string;
  deliverables: string[];
  input: string;
  output: string;
  gate: string;
};

export const PROCESS_STAGES: ProcessStage[] = [

  {
    num: '01',
    name: 'Discovery',
    headline: 'We learn the business problem before we talk solutions.',
    body: 'Interviews with the people who live with the problem, a review of the current tools and flows, and honest questions about what success means. We often find the real problem is adjacent to the one we were called about.',
    deliverables: ['Problem statement in plain language', 'Current-state map of tools & flows', 'Success criteria everyone agrees on'],
    input: 'The problem as you describe it, access to the people who live with it',
    output: 'Agreed problem statement + success criteria',
    gate: 'We don’t move to planning until the problem statement feels true to the people who live with it.',
    },
  {
    num: '02',
    name: 'Strategy',
    headline: 'The problem becomes a plan with a budget and a sequence.',
    body: 'We weigh build vs. buy vs. automate, define the smallest version that proves value, and sequence the work so the riskiest questions get answered first.',
    deliverables: ['Recommended approach & alternatives', 'Scope, phasing and investment range', 'Risk register — what could go wrong, and the mitigation'],
    input: 'Problem statement, constraints, budget appetite',
    output: 'Plan, phasing and investment range you can approve',
    gate: 'Scope, phasing and investment are approved by you before anything gets designed.',
    },
  {
    num: '03',
    name: 'UX',
    headline: 'Flows and interfaces designed around real usage.',
    body: 'Whether the surface is a dashboard, a WhatsApp conversation or an agent’s dialogue, we design the experience before engineering it — with states, edge cases and empty screens included.',
    deliverables: ['User flows & wireframes', 'Interface design with component rules', 'Conversation / notification design where relevant'],
    input: 'Approved plan, real usage examples',
    output: 'Flows and interface designs to sign off',
    gate: 'Flows and interfaces are signed off before engineering builds against them.',
    },
  {
    num: '04',
    name: 'Architecture',
    headline: 'The system is drawn before it is built.',
    body: 'Data model, integration map, permission boundaries for anything automated, and the operational plan: hosting, backups, monitoring. Boring decisions, made deliberately.',
    deliverables: ['Architecture diagram & data model', 'Integration map with failure handling', 'Security & access decisions documented'],
    input: 'Approved designs, existing systems inventory',
    output: 'Architecture and data model with security decisions',
    gate: 'Architecture, data access and security decisions are agreed before the first line ships.',
    },
  {
    num: '05',
    name: 'Development',
    headline: 'Weekly iterations you can see and respond to.',
    body: 'The build moves in short cycles with a demo at the end of each. You watch the system take shape against real data, and course corrections cost days instead of months.',
    deliverables: ['Working increments every week', 'Staging environment with real data', 'Automated tests on the critical paths'],
    input: 'Approved architecture, access to needed systems',
    output: 'Weekly working increments on staging',
    gate: 'Every weekly demo is an accept / adjust checkpoint — course corrections are cheap here.',
    },
  {
    num: '06',
    name: 'Testing',
    headline: 'We try to break it before your users do.',
    body: 'Functional, integration and load checks against the scenarios we mapped in discovery — including the awkward ones: dropped connections, duplicate messages, bad data.',
    deliverables: ['Test report against the success criteria', 'Edge-case log and resolutions', 'Performance baseline'],
    input: 'Working increments, success criteria',
    output: 'Test report and resolved edge cases',
    gate: 'Launch happens when the test report passes the success criteria agreed in stage 01 — not before.',
    },
  {
    num: '07',
    name: 'Deployment',
    headline: 'Launch is a controlled event, not a leap of faith.',
    body: 'Gradual rollout where possible — shadow mode, staged traffic, or a pilot group first. Monitoring is live before users arrive, and rollback paths exist from minute one.',
    deliverables: ['Deployment runbook', 'Monitoring & alerting in place', 'Training and documentation for your team'],
    input: 'Tested build, your team for training',
    output: 'Live system, runbook and trained users',
    gate: 'Your team confirms readiness: trained users, live monitoring, rollback path tested.',
    },
  {
    num: '08',
    name: 'Support',
    headline: 'The system keeps improving after launch.',
    body: 'We watch how it performs against the success criteria, fix what surfaces, and evolve it as the business changes. Some clients keep us on retainer; others take the keys. Both are valid exits.',
    deliverables: ['Support & maintenance agreement', 'Monthly health & usage report', 'Improvement backlog, prioritized by value'],
    input: 'Live system, feedback from real use',
    output: 'Health reports and a prioritized improvement backlog',
    gate: 'After 90 days we choose together: retainer, follow-on work, or a clean handover.',
    }
];
