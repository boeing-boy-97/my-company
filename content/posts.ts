// ============================================================
// CMS CONTENT — Insights / blog posts. PLACEHOLDER ARTICLES:
// replace with your own writing. Structure: body[] blocks with
// id (used for the table of contents), heading and paragraphs.
// ============================================================

export interface PostSection {
  id: string;
  heading: string;
  paragraphs: string[];
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  featured: boolean;
  sections: PostSection[];
}

export const postCategories = ['All', 'AI', 'Automation', 'Software', 'Business Technology', 'Engineering', 'Product', 'Case Studies'];

export const posts: Post[] = [
  {
    slug: 'ai-agents-wont-replace-your-team',
    title: 'AI agents won’t replace your team. They’ll remove their busywork.',
    excerpt: 'The businesses getting real value from AI agents aren’t cutting staff — they’re removing the fifty small tasks that quietly consume every day.',
    category: 'AI',
    author: 'Kiln Studio',
    publishedAt: '2026-08-14',
    featured: true,
    sections: [
      { id: 'busywork', heading: 'The busywork problem', paragraphs: [
        'Most teams can point to it immediately: the enquiry inbox, the data re-keying, the report assembled every Monday from four spreadsheets. Nobody was hired for this work — it just accumulated around the real job.',
        'This is exactly the work AI agents are now good at. Not strategy, not judgment, not relationships. The fifty small tasks that interrupt everything else.',
      ]},
      { id: 'where', heading: 'Where agents actually work today', paragraphs: [
        'Answering routine customer questions with data from your own systems. Qualifying incoming enquiries before a human ever sees them. Chasing documents, updating records, sending the follow-up nobody remembered.',
        'The pattern behind every successful deployment is the same: the agent gets a narrow job, clear permissions, and a human escalation path. The moment a project tries to make the agent “handle everything,” it fails.',
      ]},
      { id: 'trust', heading: 'Trust is built in stages', paragraphs: [
        'The teams that adopt agents successfully don’t switch anything on overnight. They start with the agent drafting while a human sends. Then the agent sends routine items while a human samples. Only then does it run unattended on the narrow slice it proved.',
        'Each stage generates evidence. Evidence is what converts skepticism into a rollout.',
      ]},
      { id: 'start', heading: 'Where to start', paragraphs: [
        'Pick the task your team describes with a sigh. Count how often it happens and what it interrupts. If the answer is “constantly,” you have your first agent — and a measurable win when it launches.',
        'Bring us that task. The rest is engineering.',
      ]},
    ],
  },
  {
    slug: 'real-cost-of-manual-data-entry',
    title: 'The real cost of manual data entry',
    excerpt: 'It isn’t the hours. It’s the errors, the delays, and the fact that your best people are doing work a script should own.',
    category: 'Automation',
    author: 'Kiln Studio',
    publishedAt: '2026-07-02',
    featured: false,
    sections: [
      { id: 'visible', heading: 'The visible cost', paragraphs: [
        'Take one routine task — copying enquiry details into the CRM, say — and time it honestly. Ten minutes per record, thirty records a day, is twenty-five hours a month. Now multiply by every task that fits that shape.',
        'Most businesses discover three to five such tasks in the first audit. The visible cost alone usually pays for automation quickly.',
      ]},
      { id: 'hidden', heading: 'The hidden cost', paragraphs: [
        'Errors compound quietly. A mistyped phone number means a lost lead. A delayed entry means the follow-up happens a day late, when the prospect has moved on. None of this shows up on a spreadsheet, but it shows up in revenue.',
        'Then there is the morale cost nobody budgets for: skilled people doing robotic work disengage slowly and leave suddenly.',
      ]},
      { id: 'audit', heading: 'A simple audit', paragraphs: [
        'Ask each team member: what do you do repeatedly that you wish you didn’t have to? Rank the answers by frequency and frustration. The top item is almost always automatable, and usually within weeks.',
        'The audit takes a day. It is the highest-leverage day most operations teams will spend this year.',
      ]},
    ],
  },
  {
    slug: 'before-you-build-an-app',
    title: 'Before you build an app: the checklist we run with every founder',
    excerpt: 'Nine questions that separate ideas that ship from ideas that burn budget. Asked in week one, before a line of code.',
    category: 'Product',
    author: 'Kiln Studio',
    publishedAt: '2026-06-18',
    featured: false,
    sections: [
      { id: 'questions', heading: 'The questions', paragraphs: [
        'Who exactly will use this, and what do they do today instead? What is the one feature without which the product is pointless? What will you charge, and have you said the price out loud to a real customer?',
        'These feel obvious. Almost every project that struggles skipped them.',
      ]},
      { id: 'scope', heading: 'Scope is a weapon', paragraphs: [
        'Every feature you cut from version one is not a loss — it is weeks of budget redirected at the features that prove the business. We have never regretted a smaller MVP. We have seen many larger ones never launch.',
        'The goal of version one is not completeness. It is evidence.',
      ]},
      { id: 'team', heading: 'Choose builders who ask uncomfortable questions', paragraphs: [
        'A team that accepts your full feature list without pushback is not being agreeable — it is being indifferent. The engineers you want are the ones who argue about what to cut, because they intend to ship something that works.',
      ]},
    ],
  },
  {
    slug: 'n8n-zapier-or-custom-workflows',
    title: 'n8n, Zapier, Make or custom code? Choosing your automation stack',
    excerpt: 'The honest trade-offs between automation platforms and custom-built workflows — and when each one is the right call.',
    category: 'Engineering',
    author: 'Kiln Studio',
    publishedAt: '2026-05-21',
    featured: false,
    sections: [
      { id: 'landscape', heading: 'The landscape', paragraphs: [
        'Zapier is the fastest path between two popular apps and shines at simple triggers. Make handles more elaborate multi-step logic visually. n8n gives you near-code power with self-hosting, which matters when data cannot leave your infrastructure.',
        'Custom code is the fallback when none of them fit — and it fits more often than platforms admit.',
      ]},
      { id: 'decision', heading: 'How we decide', paragraphs: [
        'Three questions drive the call. How sensitive is the data? How much volume will flow through? How much custom logic sits between the steps? A hundred records a week of public data: platform. A thousand records an hour with custom validation and audit requirements: code.',
        'Often the answer is hybrid — a platform for glue, custom services for the parts that carry weight.',
      ]},
      { id: 'maintenance', heading: 'Maintenance is the real cost', paragraphs: [
        'Every automation will need care: an upstream API changes, a credential expires, an edge case appears. Budget for it. An unmaintained automation is worse than no automation, because everyone has learned to trust it.',
      ]},
    ],
  },
  {
    slug: 'how-to-write-a-software-brief',
    title: 'How to write a software brief (that engineers actually love)',
    excerpt: 'You don’t need technical language. You need the problem, the users, the constraints and what “done” looks like. Here is the structure we recommend.',
    category: 'Business Technology',
    author: 'Kiln Studio',
    publishedAt: '2026-04-09',
    featured: false,
    sections: [
      { id: 'problem', heading: 'Start with the problem, not the app', paragraphs: [
        '“We need a CRM” is a solution hunting for context. “Our six salespeople track deals in personal spreadsheets and we lose visibility every Friday” is a problem an engineer can build against.',
        'Describe the current world: who does what, with which tools, and where it hurts. That section is worth more than any feature list.',
      ]},
      { id: 'done', heading: 'Define done', paragraphs: [
        'What would be true six months after launch if this project succeeded? Fewer manual hours? Faster responses? A process only one person understood now documented? Write those down as observable outcomes.',
        'This is also how you will compare proposals fairly — against outcomes, not against feature counts.',
      ]},
      { id: 'constraints', heading: 'Say the constraints out loud', paragraphs: [
        'Budget range, deadline, systems the solution must live alongside, compliance requirements. Vendors respect constraints; they fear surprises. A stated budget of $10k–$25k produces a better proposal than a hidden one, every time.',
      ]},
    ],
  },
  {
    slug: 'rag-in-production',
    title: 'RAG in production: what actually matters',
    excerpt: 'Retrieval-augmented generation demos beautifully and disappoints quietly. The difference is almost never the model — it is everything around it.',
    category: 'AI',
    author: 'Kiln Studio',
    publishedAt: '2026-03-12',
    featured: false,
    sections: [
      { id: 'demo', heading: 'Why demos lie', paragraphs: [
        'A RAG demo uses a clean document set and friendly questions. Production delivers messy PDFs, ambiguous questions, and users who expect the system to know when it does not know.',
        'The gap between demo and production is where most RAG projects die.',
      ]},
      { id: 'retrieval', heading: 'Retrieval is the product', paragraphs: [
        'Chunking strategy, metadata filtering, re-ranking, and query rewriting decide answer quality long before the model does. Teams that spend their budget on the prompt and skimp on retrieval get exactly what they paid for.',
        'Instrument retrieval from day one: log what was retrieved for every answer, and review the misses weekly.',
      ]},
      { id: 'abstain', heading: 'Teach it to abstain', paragraphs: [
        'The most valuable behavior in a production knowledge system is “I don’t have that information.” Users forgive abstaining; they never forgive confident nonsense.',
        'Build the fallback path — route to a human, or to search — before launch, not after the first embarrassing answer.',
      ]},
    ],
  },
];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);

export function postWords(post: Post) {
  return post.sections.reduce((acc, s) => acc + s.paragraphs.join(' ').split(/\s+/).length + s.heading.split(/\s+/).length, 0);
}
