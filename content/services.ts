// ============================================================
// CMS CONTENT — Services. Replace freely; the site renders from
// this file. In production this lives in the `services` table.
// ============================================================

export interface Service {
  slug: string;
  num: string;
  title: string;
  short: string;
  icon: 'automation' | 'agent' | 'software' | 'webmobile' | 'integration' | 'product';
  problemsSolved: string[];
  whatWeBuild: string[];
  process: string[];
  deliverables: string[];
  technologies: string[];
  /** Sub-capabilities shown in the /services capability map. */
  capabilities: string[];
}

export const services: Service[] = [
  {
    slug: 'ai-automation',
    num: '01',
    title: 'AI Automation',
    short: 'Automate repetitive business operations using AI, workflows and intelligent decision systems.',
    icon: 'automation',
    problemsSolved: [
      'Enquiries answered slowly or missed entirely',
      'Staff re-keying data between systems',
      'Documents processed by hand',
      'Reports assembled manually every week',
      'Follow-ups forgotten under load',
    ],
    whatWeBuild: [
      'Enquiry & lead handling pipelines',
      'WhatsApp / email automation',
      'Document extraction and processing',
      'Auto-generated reporting',
      'Human-escalation and review flows',
    ],
    process: ['Map the workflow end to end', 'Find the steps that can run unattended', 'Build with human checkpoints', 'Measure time saved, then expand'],
    deliverables: ['Workflow specification', 'Working automation system', 'Monitoring dashboard', 'Documentation & handover'],
    technologies: ['n8n', 'Make', 'OpenAI', 'Claude', 'Zapier', 'Webhooks'],
    capabilities: ['Trigger pipelines', 'Document processing', 'Reporting automation', 'Escalations & approvals', 'Queue & retry logic'],
  },
  {
    slug: 'ai-agents',
    num: '02',
    title: 'AI Agents',
    short: 'Voice agents, customer support agents, sales agents, research agents, internal agents and custom AI workflows.',
    icon: 'agent',
    problemsSolved: [
      'Customers wait too long for answers',
      'Calls and appointments unhandled after hours',
      'Support costs grow with volume',
      'Internal knowledge hard to find',
      'Sales leads not followed up in time',
    ],
    whatWeBuild: [
      'Voice & phone agents',
      'Customer support agents',
      'Sales & lead qualification agents',
      'Receptionist & appointment agents',
      'Internal knowledge agents',
    ],
    process: ['Define the agent’s job in business terms', 'Design knowledge, tools & guardrails', 'Build, test against real scenarios', 'Deploy with monitoring & human handoff'],
    deliverables: ['Agent design specification', 'Deployed agent with guardrails', 'Analytics on resolution & handoff', 'Escalation playbook'],
    technologies: ['OpenAI', 'Claude', 'Gemini', 'Speech AI', 'RAG', 'n8n'],
    capabilities: ['Voice agents', 'Support agents', 'Sales & qualification', 'Research agents', 'Guardrails & evals'],
  },
  {
    slug: 'custom-software',
    num: '03',
    title: 'Custom Software',
    short: 'Business platforms, internal tools, SaaS applications, dashboards and operational software.',
    icon: 'software',
    problemsSolved: [
      'Data spread across spreadsheets and tools',
      'Off-the-shelf software that almost fits',
      'Outdated systems that block growth',
      'No visibility into operations',
      'Processes that depend on one person’s memory',
    ],
    whatWeBuild: [
      'Internal tools & operations platforms',
      'CRM / ERP systems',
      'Dashboards & business intelligence',
      'SaaS products',
      'API & backend systems',
    ],
    process: ['Understand the operation, not just the request', 'Specify the system & data model', 'Build in weekly iterations', 'Launch, measure, evolve'],
    deliverables: ['Technical specification', 'Working software in production', 'Admin tooling', 'Support & improvement plan'],
    technologies: ['Next.js', 'React', 'Node.js', 'Python', 'TypeScript', 'PostgreSQL'],
    capabilities: ['Operations platforms', 'Internal tools', 'Dashboards', 'SaaS products', 'Admin systems'],
  },
  {
    slug: 'web-mobile',
    num: '04',
    title: 'Web & Mobile',
    short: 'High-performance websites, web applications and mobile applications.',
    icon: 'webmobile',
    problemsSolved: [
      'A website that doesn’t convert or is slow',
      'No mobile experience for customers or teams',
      'Customer portals missing entirely',
      'E-commerce held back by platform limits',
      'Design that doesn’t match the business quality',
    ],
    whatWeBuild: [
      'Corporate & marketing websites',
      'Web applications & customer portals',
      'E-commerce platforms',
      'iOS & Android applications',
      'Admin dashboards',
    ],
    process: ['Define goals and success metrics', 'Design the experience', 'Build with performance budgets', 'Ship, monitor, iterate'],
    deliverables: ['Design system & UI', 'Production application', 'Analytics setup', 'Maintenance runway'],
    technologies: ['Next.js', 'React', 'Flutter', 'React Native', 'Tailwind CSS', 'Supabase'],
    capabilities: ['Product interfaces', 'Web apps', 'iOS & Android', 'Design systems', 'Performance engineering'],
  },
  {
    slug: 'system-integration',
    num: '05',
    title: 'System Integration',
    short: 'APIs, CRM, ERP, payments, communication platforms and third-party integrations.',
    icon: 'integration',
    problemsSolved: [
      'Systems that don’t talk to each other',
      'Manual syncing between tools',
      'Payments or messaging not connected',
      'Migrations stuck for months',
      'No single source of truth',
    ],
    whatWeBuild: [
      'CRM / ERP integrations',
      'Payment & billing connections',
      'WhatsApp / SMS / email platforms',
      'Data synchronization pipelines',
      'Legacy system bridges',
    ],
    process: ['Audit the current system landscape', 'Design the integration map', 'Build with retry & error handling', 'Monitor data flow continuously'],
    deliverables: ['Integration architecture', 'Working connectors', 'Error monitoring', 'Documentation'],
    technologies: ['REST APIs', 'Webhooks', 'n8n', 'PostgreSQL', 'Stripe', 'Twilio'],
    capabilities: ['CRM & ERP sync', 'Payments', 'Messaging channels', 'Data pipelines', 'Event bus & APIs'],
  },
  {
    slug: 'ai-products',
    num: '06',
    title: 'AI Product Development',
    short: 'Turn an idea into a production-ready AI product.',
    icon: 'product',
    problemsSolved: [
      'An AI idea with no technical path',
      'A prototype that won’t survive production',
      'Unclear which AI approach actually fits',
      'No team that can own an AI product end to end',
      'RAG or agent experiments that stalled',
    ],
    whatWeBuild: [
      'LLM-powered products',
      'RAG knowledge systems',
      'AI assistants & copilots',
      'Document intelligence',
      'Recommendation & analytics systems',
    ],
    process: ['Validate the idea against real usage', 'Prototype the riskiest part first', 'Design the AI architecture', 'Ship MVP, then scale'],
    deliverables: ['Validation report', 'Working prototype', 'Production AI system', 'Evaluation & monitoring setup'],
    technologies: ['OpenAI', 'Claude', 'Gemini', 'RAG', 'Vector databases', 'Python'],
    capabilities: ['Model selection', 'RAG architecture', 'Evaluation harness', 'Prototype → MVP', 'Monitoring & cost'],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
