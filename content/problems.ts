// ============================================================
// CMS CONTENT — Problem → Solution map (home page signature
// interaction). Add/remove entries freely.
// ============================================================

export interface ProblemSolution {
  id: string;
  problem: string;
  solution: string;
  solutionHref: string;
  detail: string;
  artifact: 'workflow' | 'agent' | 'dashboard' | 'integration' | 'app' | 'document' | 'product' | 'mobile';
}

export const problemSolutions: ProblemSolution[] = [
  {
    id: 'manual',
    problem: 'Too much manual work',
    solution: 'AI Automation',
    solutionHref: '/services/ai-automation',
    detail: 'We map the repetitive steps in your operation and replace them with supervised workflows — data entry, routing, document handling, reports.',
    artifact: 'workflow',
  },
  {
    id: 'leads',
    problem: 'Leads are not followed up',
    solution: 'AI Agent + Workflow',
    solutionHref: '/services/ai-agents',
    detail: 'An agent responds in seconds, qualifies the enquiry, books the next step and updates your CRM — no lead goes cold.',
    artifact: 'agent',
  },
  {
    id: 'repeat',
    problem: 'Employees repeat the same tasks',
    solution: 'Workflow Automation',
    solutionHref: '/services/ai-automation',
    detail: 'Identify the tasks that consume hours every week and move them into reliable automation, with humans approving where it matters.',
    artifact: 'workflow',
  },
  {
    id: 'data',
    problem: 'Data is spread across systems',
    solution: 'Integration + Dashboard',
    solutionHref: '/services/custom-software',
    detail: 'We connect your tools into one data flow and give you a single operational dashboard you can actually run the business from.',
    artifact: 'dashboard',
  },
  {
    id: 'customers',
    problem: 'Customers wait too long',
    solution: 'AI Support Agent',
    solutionHref: '/services/ai-agents',
    detail: 'A support agent trained on your business answers instantly, resolves common requests fully, and escalates the rest with context.',
    artifact: 'agent',
  },
  {
    id: 'outdated',
    problem: 'Existing software is outdated',
    solution: 'Custom Software / Modernization',
    solutionHref: '/services/custom-software',
    detail: 'We modernize in stages — integrations first, then rebuild the parts that hold you back, without stopping the business.',
    artifact: 'integration',
  },
  {
    id: 'idea',
    problem: 'Business idea has not been built yet',
    solution: 'Product Development',
    solutionHref: '/services/ai-products',
    detail: 'From validation to MVP to production — one team takes the idea and turns it into working software with real users.',
    artifact: 'product',
  },
];
