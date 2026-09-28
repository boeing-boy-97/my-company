// ============================================================
// CMS CONTENT — Technology ecosystem (home + services pages).
// ============================================================

export interface TechCategory {
  name: string;
  code: string;
  description: string;
  items: string[];
}

export const techStack: TechCategory[] = [
  {
    name: 'AI',
    code: 'AI / ML',
    description: 'Models and systems that read, reason, speak and decide.',
    items: ['OpenAI', 'Claude', 'Gemini', 'LLMs', 'RAG', 'Agents', 'Speech AI', 'Computer Vision'],
  },
  {
    name: 'Automation',
    code: 'WORKFLOWS',
    description: 'Orchestration layers that move work between systems.',
    items: ['n8n', 'Zapier', 'Make', 'Webhooks', 'CRM Automation', 'Workflow Engines'],
  },
  {
    name: 'Development',
    code: 'ENGINEERING',
    description: 'The engineering core behind every product we ship.',
    items: ['React', 'Next.js', 'Node.js', 'Python', 'TypeScript', 'Flutter', 'React Native'],
  },
  {
    name: 'Cloud',
    code: 'INFRASTRUCTURE',
    description: 'Where systems live, scale and stay reliable.',
    items: ['AWS', 'Google Cloud', 'Azure', 'Firebase', 'Supabase', 'PostgreSQL'],
  },
];
