// ============================================================
// CMS CONTENT — Case studies. PLACEHOLDER / REPRESENTATIVE WORK:
// these entries demonstrate the structure and depth of your case
// studies. Replace each field with real project data as projects
// complete. Clients are anonymized — do not publish real client
// names or metrics without permission.
// ============================================================

export interface CaseSection {
  id: string;
  label: string;
  paragraphs: string[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  industry: string;
  category: 'AI' | 'Automation' | 'SaaS' | 'Web' | 'Mobile' | 'Enterprise' | 'Other';
  year: string;
  services: string[];
  stack: string[];
  summary: string;
  problem: string;
  solution: string;
  outcome: string;
  featured: boolean;
  visual: 'workflow' | 'agent' | 'dashboard' | 'mobile' | 'documents' | 'platform';
  metrics: Array<{ value: string; label: string }>;
  sections: CaseSection[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'ai-operations-assistant',
    title: 'AI Operations Assistant',
    client: 'Confidential — Logistics group',
    industry: 'Logistics',
    category: 'AI',
    year: '2025',
    services: ['AI Agents', 'System Integration'],
    stack: ['OpenAI', 'n8n', 'Next.js', 'PostgreSQL', 'WhatsApp API'],
    summary: 'An AI assistant that handles shipment-status enquiries across WhatsApp and email, freeing a four-person coordination team from repetitive lookups.',
    problem: 'The coordination team spent most of the day answering “where is my shipment?” messages across WhatsApp and email, with delays during peak hours.',
    solution: 'An AI operations assistant connected to the transport management system answers status enquiries instantly, escalates exceptions to humans, and logs every interaction.',
    outcome: 'Enquiries are answered in seconds around the clock, and coordinators now focus on exceptions instead of lookups.',
    featured: true,
    visual: 'agent',
    metrics: [
      { value: '~70%', label: 'of status enquiries resolved without a human' },
      { value: '< 30s', label: 'typical response time, 24/7' },
      { value: '4 hrs/day', label: 'returned to the coordination team' },
    ],
    sections: [
      { id: 'challenge', label: 'Challenge', paragraphs: [
        'A mid-size logistics group moves hundreds of shipments a week. Customers and dispatch partners expect constant status updates, and every enquiry landed in a shared WhatsApp inbox answered manually by the coordination team.',
        'During peak hours, responses slipped to several hours. The team knew the answers — they were in the transport management system — but finding and typing them was the job.',
      ]},
      { id: 'before', label: 'What was happening before', paragraphs: [
        'Four coordinators rotated through the inbox. Each enquiry meant opening the TMS, finding the consignment, copying details into a reply. The same fifty questions accounted for most of the volume.',
        'Nothing was logged. When a coordinator was away, context disappeared with them.',
      ]},
      { id: 'goals', label: 'Goals', paragraphs: [
        'Answer routine status enquiries automatically, in the customer’s language, on the channel they already used. Escalate anything unusual to a human with full context. Keep every interaction searchable.',
      ]},
      { id: 'strategy', label: 'Strategy', paragraphs: [
        'We audited eight weeks of message history and grouped enquiries by intent. Status checks, document requests and delay complaints covered the overwhelming majority.',
        'Rather than a generic chatbot, we designed a constrained assistant: it can read shipment data and send updates, but changes to bookings always route to a human.',
      ]},
      { id: 'solution', label: 'Solution', paragraphs: [
        'The assistant connects to WhatsApp Business and a shared email inbox. When a message arrives, it identifies the shipment, pulls live status from the TMS through an API bridge, and replies in plain language.',
        'Anything it is not confident about — a damaged-goods claim, an angry customer, an unusual request — is escalated with a summary, so the human never starts from zero.',
      ]},
      { id: 'architecture', label: 'Architecture & AI implementation', paragraphs: [
        'A webhook layer receives messages and passes them through intent classification. An LLM handles language; a rule layer enforces what the agent may and may not do. Tool calls fetch shipment data — the model never invents statuses.',
        'All conversations are stored with intent labels, feeding a weekly report on what customers actually ask.',
      ]},
      { id: 'deployment', label: 'Deployment', paragraphs: [
        'The system launched behind a gradual rollout: first as a draft-suggestion tool for the team, then handling routine enquiries directly. Monitoring tracks resolution rate, escalation rate and sentiment.',
      ]},
      { id: 'results', label: 'Results', paragraphs: [
        'Within the first month, the assistant resolved around seventy percent of status enquiries on its own. Response time dropped from hours to seconds, and the team absorbed a busier season without extra headcount.',
        'Because the rollout was staged, trust was earned with the team rather than imposed on them.',
      ]},
      { id: 'lessons', label: 'Lessons', paragraphs: [
        'The biggest lever was not the model — it was deciding exactly which actions the agent could take. Constraint is what made automation safe enough to trust.',
      ]},
    ],
  },
  {
    slug: 'business-automation-platform',
    title: 'Business Automation Platform',
    client: 'Confidential — Real-estate services',
    industry: 'Real Estate',
    category: 'Automation',
    year: '2025',
    services: ['AI Automation', 'System Integration'],
    stack: ['n8n', 'OpenAI', 'PostgreSQL', 'Next.js'],
    summary: 'An end-to-end automation layer that takes a new enquiry from first message to scheduled viewing, with humans stepping in only where judgment matters.',
    problem: 'Enquiries arrived from three portals and WhatsApp, were copied into spreadsheets, and follow-up depended on whoever remembered.',
    solution: 'A central automation platform classifies enquiries, enriches them, schedules viewings against live agent calendars and keeps the CRM current — with one dashboard for the sales manager.',
    outcome: 'Every enquiry now receives a first response within minutes, and the pipeline is visible to management in real time.',
    featured: true,
    visual: 'workflow',
    metrics: [
      { value: '3 → 1', label: 'systems needed to run the enquiry flow' },
      { value: 'minutes', label: 'first response time, previously same-day best case' },
      { value: '100%', label: 'of enquiries logged and tracked' },
    ],
    sections: [
      { id: 'challenge', label: 'Challenge', paragraphs: [
        'A real-estate services company received steady enquiries from listing portals, WhatsApp and its website. Each arrived in a different inbox, and each was manually re-entered into a spreadsheet that served as the de-facto CRM.',
        'Follow-ups happened when someone had time. In busy weeks, promising leads simply went quiet.',
      ]},
      { id: 'goals', label: 'Goals', paragraphs: [
        'One pipeline for all enquiries. Automatic first response. Viewings booked without back-and-forth emails. Management able to see the pipeline at any moment.',
      ]},
      { id: 'strategy', label: 'Strategy', paragraphs: [
        'We mapped the actual flow — not the assumed one — and found three hand-off points where leads leaked. The design principle: automate movement, never judgment. Agents still decide pricing and negotiation; everything around it moves on its own.',
      ]},
      { id: 'solution', label: 'Solution', paragraphs: [
        'Enquiries from all channels flow into one system. An AI layer extracts intent, budget signals and property preferences, then classifies urgency. A scheduling engine proposes viewing slots from live agent calendars and confirms automatically.',
        'If an enquiry goes quiet for two days, a polite nudge goes out. If it asks something unusual, it routes to an agent with the full history attached.',
      ]},
      { id: 'architecture', label: 'Architecture', paragraphs: [
        'Workflow orchestration runs on n8n with a PostgreSQL record for every enquiry — a single source of truth. The dashboard is a Next.js app reading the same database, so what management sees is never stale.',
      ]},
      { id: 'deployment', label: 'Deployment', paragraphs: [
        'We ran the automation in shadow mode for two weeks — processing real enquiries while agents worked the old way — to verify every decision before switching over.',
      ]},
      { id: 'results', label: 'Results', paragraphs: [
        'First responses now go out within minutes at any hour. The spreadsheet is gone; the pipeline dashboard is how the company runs its mornings.',
      ]},
      { id: 'lessons', label: 'Lessons', paragraphs: [
        'Shadow-mode deployment removed almost all rollout risk. When the team finally saw the switch happen, it was a non-event — the system had already proven itself.',
      ]},
    ],
  },
  {
    slug: 'business-intelligence-dashboard',
    title: 'Business Intelligence Dashboard',
    client: 'Confidential — Retail group',
    industry: 'Retail',
    category: 'Enterprise',
    year: '2024',
    services: ['Custom Software', 'System Integration'],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    summary: 'A single operational dashboard that replaced five spreadsheets and gave store leadership one trusted view of sales, stock and staffing.',
    problem: 'Store data lived in five spreadsheets updated by different people. Weekly reports arrived late and rarely agreed with each other.',
    solution: 'An operational dashboard that syncs from the POS and inventory systems nightly, with role-based views for owners, managers and auditors.',
    outcome: 'Decisions that waited for the weekly report now happen daily, from one set of numbers everyone trusts.',
    featured: true,
    visual: 'dashboard',
    metrics: [
      { value: '5 → 1', label: 'sources of truth consolidated' },
      { value: 'daily', label: 'reporting cadence, previously weekly' },
      { value: '3 roles', label: 'with tailored, permissioned views' },
    ],
    sections: [
      { id: 'challenge', label: 'Challenge', paragraphs: [
        'A multi-store retail group ran its numbers on five spreadsheets maintained by different people. Sales, stock, staffing, wastage and promotions each lived somewhere different.',
        'The weekly consolidation took a full working day, and the numbers frequently disagreed — which meant meetings about whose numbers were right instead of what to do.',
      ]},
      { id: 'goals', label: 'Goals', paragraphs: [
        'One dashboard, refreshed automatically, that owners and store managers both trust. No more manual consolidation. Clear views per role.',
      ]},
      { id: 'strategy', label: 'Strategy', paragraphs: [
        'Before any interface work, we defined each metric precisely with the leadership team — the same word meant different things to different spreadsheets. The data model came first; the dashboard came second.',
      ]},
      { id: 'solution', label: 'Solution', paragraphs: [
        'Nightly syncs pull from the POS and inventory systems into a central warehouse. The dashboard renders store-level and group-level views, with anomaly flags — a store whose wastage jumps gets noticed the same morning.',
        'Exports exist for the auditors. Everything else is live.',
      ]},
      { id: 'architecture', label: 'Architecture', paragraphs: [
        'ETL jobs run on scheduled workers writing to PostgreSQL. The frontend is a Next.js application with role-based access. Sync health is monitored, so a broken feed is caught before the numbers go stale.',
      ]},
      { id: 'results', label: 'Results', paragraphs: [
        'The weekly consolidation day disappeared. Store managers check their numbers each morning on their phones; leadership reviews happen from the same source.',
        'An anomaly flag surfaced a stock-counting error in the first month that had been invisible in the spreadsheets for over a year.',
      ]},
      { id: 'lessons', label: 'Lessons', paragraphs: [
        'Dashboards fail when they digitize confusion. Defining the metrics first was the actual product work.',
      ]},
    ],
  },
  {
    slug: 'customer-support-agent',
    title: 'Customer Support Automation',
    client: 'Confidential — E-commerce brand',
    industry: 'E-commerce',
    category: 'AI',
    year: '2025',
    services: ['AI Agents', 'AI Automation'],
    stack: ['Claude', 'n8n', 'Shopify API', 'Zendesk'],
    summary: 'A support agent that resolves order-level questions end to end and hands the rest to humans with complete context.',
    problem: 'Support volume tripled during peak season. Order-status and return questions dominated the queue, and response times slipped past 24 hours.',
    solution: 'An AI agent embedded in the helpdesk resolves order, return and shipping questions directly, drafts answers for complex cases, and tags everything for analysis.',
    outcome: 'The team cleared queues in hours instead of days, with customers getting real resolutions rather than holding replies.',
    featured: false,
    visual: 'agent',
    metrics: [
      { value: '~60%', label: 'of tickets resolved by the agent' },
      { value: 'hours → minutes', label: 'median first response' },
      { value: 'peak-safe', label: 'capacity without seasonal hiring' },
    ],
    sections: [
      { id: 'challenge', label: 'Challenge', paragraphs: [
        'A growing e-commerce brand hit peak season with a support team sized for a third of the volume. Order-status, returns and “where is my refund” questions dominated the queue — repetitive, but each required logging into multiple systems.',
      ]},
      { id: 'strategy', label: 'Strategy', paragraphs: [
        'We classified three months of tickets. Half the volume was fully resolvable with data the systems already had. The design split tickets into act (agent resolves), draft (agent proposes, human approves) and route (human owns).',
      ]},
      { id: 'solution', label: 'Solution', paragraphs: [
        'The agent reads the helpdesk queue, pulls order data from the commerce platform, and acts: explains shipping status, initiates returns within policy, confirms refunds already processed. For anything outside policy it drafts a response and escalates.',
        'Every action is logged against the ticket, so humans can audit any resolution.',
      ]},
      { id: 'architecture', label: 'Architecture', paragraphs: [
        'An orchestration layer polls the helpdesk API, an LLM handles language and intent, and a permission layer restricts the agent to read-only commerce access plus a small allowlist of write actions (return initiation, tag updates).',
      ]},
      { id: 'results', label: 'Results', paragraphs: [
        'Around sixty percent of tickets closed without human involvement. The team spent peak season on the genuinely hard cases, and customer sentiment scores held steady instead of collapsing with response times.',
      ]},
      { id: 'lessons', label: 'Lessons', paragraphs: [
        'The allowlist of permitted actions mattered more than the model choice. Support automation is a permissions problem before it is an AI problem.',
      ]},
    ],
  },
  {
    slug: 'document-intelligence-system',
    title: 'Document Intelligence System',
    client: 'Confidential — Financial services',
    industry: 'Finance',
    category: 'Automation',
    year: '2024',
    services: ['AI Automation', 'Custom Software'],
    stack: ['Python', 'OpenAI', 'PostgreSQL', 'Next.js', 'AWS'],
    summary: 'A document processing pipeline that extracts, verifies and files client documents that previously required manual review for every case.',
    problem: 'Every client onboarding meant staff reading documents, extracting fields by hand and double-checking each other — slow, and error-prone under load.',
    solution: 'A pipeline that ingests documents, extracts structured data with confidence scores, flags low-confidence fields for human review and files everything consistently.',
    outcome: 'Onboarding paperwork moved from days to same-day, with human attention reserved for the fields that actually need judgment.',
    featured: false,
    visual: 'documents',
    metrics: [
      { value: '~85%', label: 'of fields extracted without review' },
      { value: 'same-day', label: 'document processing, previously days' },
      { value: 'full audit', label: 'trail on every extraction' },
    ],
    sections: [
      { id: 'challenge', label: 'Challenge', paragraphs: [
        'A financial services firm processed hundreds of client documents a month — identity proofs, statements, agreements. Each was read by one person, keyed in by another, and spot-checked by a third.',
        'Errors weren’t the main cost; time was. Onboarding queues grew every month.',
      ]},
      { id: 'strategy', label: 'Strategy', paragraphs: [
        'We didn’t aim to remove human review — we aimed to remove uninteresting review. Every extracted field carries a confidence score; humans see only the uncertain ones.',
      ]},
      { id: 'solution', label: 'Solution', paragraphs: [
        'Documents arrive by upload or email. The pipeline classifies the document type, extracts fields, cross-checks them against the application, and routes exceptions. Reviewers see a focused queue: “check these three fields,” not “read this document.”',
        'Compliance required everything to be auditable, so each extraction stores the source region on the original page.',
      ]},
      { id: 'architecture', label: 'Architecture', paragraphs: [
        'Extraction combines vision models with deterministic validation rules. A Next.js review console handles the human loop. The data layer is PostgreSQL with full lineage per field.',
      ]},
      { id: 'results', label: 'Results', paragraphs: [
        'Most fields now flow through without a human touching them. Processing time per client fell from days to same-day, and reviewers report the work became easier, not just faster — they review flagged fields instead of re-reading everything.',
      ]},
      { id: 'lessons', label: 'Lessons', paragraphs: [
        'Confidence-based routing is the pattern behind every successful document system. Automate the certain, route the uncertain, never guess silently.',
      ]},
    ],
  },
  {
    slug: 'saas-management-platform',
    title: 'SaaS Management Platform',
    client: 'Confidential — Startup founder',
    industry: 'B2B SaaS',
    category: 'SaaS',
    year: '2025',
    services: ['AI Product Development', 'Web & Mobile'],
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Stripe', 'AWS'],
    summary: 'A founder’s idea taken from a written brief to a paying SaaS platform — specification, design, build, billing and launch in one engagement.',
    problem: 'A founder had validated demand for an operations tool with potential customers, but had no technical team and a list of fifteen features with no idea what to build first.',
    solution: 'We cut the scope to the three features customers would pay for, built the MVP on a production-grade foundation, wired billing, and shipped to the first cohort.',
    outcome: 'The platform launched to its first paying cohort, with a roadmap driven by actual usage data rather than assumptions.',
    featured: false,
    visual: 'platform',
    metrics: [
      { value: '15 → 3', label: 'features scoped to a shippable MVP' },
      { value: 'launch', label: 'from idea to live product with billing' },
      { value: 'usage-led', label: 'roadmap from day one' },
    ],
    sections: [
      { id: 'challenge', label: 'Challenge', paragraphs: [
        'The founder had something rare: customers who said they would pay. What he didn’t have was a technical team, or clarity on what to build first — the feature list had grown to fifteen items of wildly different complexity.',
      ]},
      { id: 'strategy', label: 'Strategy', paragraphs: [
        'We ran a scoping exercise against the validation conversations: which three features actually closed the deal? Everything else moved to a post-launch backlog. The MVP had to be small enough to ship, but real enough to charge for.',
      ]},
      { id: 'solution', label: 'Solution', paragraphs: [
        'A multi-tenant platform with authentication, team workspaces, the core operational workflow, and Stripe billing. Deliberately boring architecture — proven components, typed end to end — so the product could move fast without accumulating debt.',
      ]},
      { id: 'development', label: 'Development', paragraphs: [
        'Weekly iterations with a demo at the end of each. The founder showed real screens to waiting customers during the build, which caught two misunderstandings before they became features.',
      ]},
      { id: 'deployment', label: 'Deployment', paragraphs: [
        'Infrastructure was set up for production from day one: environments, backups, error monitoring, and a feature-flag system so the launch could be gradual.',
      ]},
      { id: 'results', label: 'Results', paragraphs: [
        'The first paying cohort onboarded within weeks of launch. Usage analytics from day one meant the post-launch roadmap was decided by what customers actually used — not by the loudest voice in the room.',
      ]},
      { id: 'lessons', label: 'Lessons', paragraphs: [
        'The hardest part of an MVP is the “M.” Protecting scope was a service to the founder, even when it meant arguing against features everyone liked.',
      ]},
    ],
  },
];

export const caseBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);
export const workFilters = ['All', 'AI', 'Automation', 'SaaS', 'Web', 'Mobile', 'Enterprise', 'Other'];
