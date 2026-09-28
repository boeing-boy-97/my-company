// ============================================================
// CMS CONTENT — Open roles. PLACEHOLDER LISTINGS: update as you
// actually open positions. Applications persist to the database.
// ============================================================

export interface Job {
  slug: string;
  title: string;
  location: string;
  type: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
}

export const jobs: Job[] = [
  {
    slug: 'fullstack-engineer',
    title: 'Full-Stack Engineer',
    location: 'Nagpur / Remote (India)',
    type: 'Full-time',
    summary: 'Build client platforms end to end — TypeScript, Next.js, PostgreSQL, and the integrations that make them useful.',
    responsibilities: ['Own features from specification to deployment', 'Build web applications, APIs and integrations', 'Write code that the next engineer can read', 'Review work and improve our engineering standards'],
    requirements: ['Strong TypeScript / React experience', 'Comfort with backend work (Node.js or Python, SQL)', 'You have shipped real products, not just exercises', 'Clear written communication'],
    perks: ['Real client systems, not ticket factory work', 'Direct exposure to architecture decisions', 'Learning budget and conference support'],
  },
  {
    slug: 'automation-engineer',
    title: 'Automation Engineer',
    location: 'Nagpur / Remote (India)',
    type: 'Full-time',
    summary: 'Design and build the workflow systems that remove repetitive work from client businesses.',
    responsibilities: ['Map client workflows and design automation', 'Build on n8n / Make and custom services', 'Connect CRMs, ERPs, messaging and payment systems', 'Monitor and improve live automations'],
    requirements: ['Experience with workflow platforms or scripting', 'API fluency — webhooks, REST, authentication', 'A debugging mindset and patience for edge cases', 'Bonus: Python or Node.js'],
    perks: ['Visible impact — hours saved are measurable', 'Variety of industries and systems', 'Growth path into AI systems engineering'],
  },
  {
    slug: 'ai-engineer',
    title: 'AI Engineer',
    location: 'Nagpur / Remote (India)',
    type: 'Full-time',
    summary: 'Put LLMs, agents and RAG systems into production — with the evaluation and guardrails that keep them there.',
    responsibilities: ['Build agents, RAG pipelines and AI features', 'Design evaluations and monitoring for AI behavior', 'Integrate models into production applications', 'Prototype fast, then harden'],
    requirements: ['Hands-on experience with LLM APIs in real projects', 'Python or TypeScript fluency', 'Understanding of retrieval, prompts-as-code, evaluation', 'Skepticism — you test what you ship'],
    perks: ['AI work that ships, not research that stalls', 'Freedom to choose tools per problem', 'Budget for models, courses and experiments'],
  },
  {
    slug: 'product-designer',
    title: 'Product Designer',
    location: 'Nagpur / Remote (India)',
    type: 'Full-time',
    summary: 'Design the interfaces for internal tools, dashboards and products — where clarity beats decoration.',
    responsibilities: ['Design flows and interfaces from problem statements', 'Build and maintain design systems', 'Prototype and test with real users', 'Work shoulder-to-shoulder with engineers'],
    requirements: ['A portfolio of shipped product work', 'Systems thinking — components, states, edge cases', 'Strong typography and layout instincts', 'You can explain your decisions in plain language'],
    perks: ['Work visible to real users within weeks', 'Design authority, not pixel-pushing', 'Close collaboration with founders of client teams'],
  },
];

export const jobBySlug = (slug: string) => jobs.find((j) => j.slug === slug);
