// ============================================================
// AI Project Consultant — deterministic rules engine.
// Understands a described problem, asks one clarifying question,
// proposes a solution direction + complexity, then captures the
// lead. Never promises pricing or outcomes; final scoping always
// happens with a human.
// ============================================================

export type ConsultPhase = 'listen' | 'clarify' | 'recommend' | 'capture' | 'done';

export interface ConsultState {
  phase: ConsultPhase;
  solution?: string;
  solutionHref?: string;
  complexity?: 'Small' | 'Medium' | 'Large';
  problem?: string;
  volume?: string;
}

export interface ConsultReply {
  text: string;
  suggestions?: string[];
  state: ConsultState;
  showHandoff?: boolean;
}

const SIGNALS: Array<{ keys: RegExp; solution: string; href: string; weight: number }> = [
  { keys: /whatsapp|enquir(y|ies)|lead|follow.?up|qualif|respond|response time|reply/i, solution: 'AI Automation', href: '/services/ai-automation', weight: 2 },
  { keys: /manual|data entry|re-key|copy.?paste|spreadsheet|repeat|repetitive|invoice|document|extract|ocr|report/i, solution: 'Workflow Automation', href: '/services/ai-automation', weight: 2 },
  { keys: /receptionist|appointment|booking|calendar|schedul|voice|call(er|s|ing)?\b|phone|support agent|chatbot|help.?desk|ticket/i, solution: 'AI Agent', href: '/services/ai-agents', weight: 2 },
  { keys: /crm|erp|dashboard|internal tool|admin panel|portal|inventory|ops platform|manage(ment)? system/i, solution: 'Custom Software', href: '/services/software', weight: 2 },
  { keys: /website|landing|e-?commerce|shop|storefront|web app|saas idea|saas|subscription product/i, solution: 'Web / SaaS Product', href: '/services/web-mobile', weight: 2 },
  { keys: /mobile|app store|ios|android|flutter/i, solution: 'Mobile Application', href: '/services/web-mobile', weight: 3 },
  { keys: /integrat|api|connect|sync|zapier|migration|legacy|outdated|upgrade|moderni[sz]/i, solution: 'System Integration', href: '/services/software', weight: 1 },
  { keys: /idea|prototype|mvp|validate|startup|new product/i, solution: 'AI Product Development', href: '/services/ai-products', weight: 1 },
];

const COMPLEXITY_UP = /voice|real.?time|erp|legacy|migrat|multiple (system|location)|multi.?lang|compliance|payment/i;
const COMPLEXITY_DOWN = /simple|small|one (page|system|flow)|single|basic/i;

export function detectSolution(text: string) {
  const scores = new Map<string, { solution: string; href: string; score: number }>();
  for (const s of SIGNALS) {
    if (s.keys.test(text)) {
      const entry = scores.get(s.solution) || { solution: s.solution, href: s.href, score: 0 };
      entry.score += s.weight;
      scores.set(s.solution, entry);
    }
  }
  const ranked = [...scores.values()].sort((a, b) => b.score - a.score);
  return ranked[0] || null;
}

export function estimateComplexity(text: string): 'Small' | 'Medium' | 'Large' {
  let score = 1;
  if (COMPLEXITY_UP.test(text)) score += 1;
  if (/\b(300|500|1000|hundreds|thousands|multiple (team|depart|location))\b/i.test(text)) score += 1;
  if (/voice|calling|speech/i.test(text)) score += 1;
  if (COMPLEXITY_DOWN.test(text)) score -= 1;
  return score >= 3 ? 'Large' : score === 2 ? 'Medium' : 'Small';
}

export function consultRespond(message: string, state: ConsultState): ConsultReply {
  const text = message.trim();

  if (state.phase === 'listen') {
    const hit = detectSolution(text);
    if (!hit) {
      return {
        text: 'Got it. Can you tell me a little more — what happens today when this problem shows up, and roughly how often? For example: "We get 300 WhatsApp enquiries a day and answer them manually."',
        suggestions: [
          'We answer hundreds of enquiries manually every day',
          'My team re-keys data between systems',
          'I have an idea for a product I want to build',
        ],
        state: { ...state, phase: 'listen' },
      };
    }
    return {
      text: `That sounds like a strong fit for ${hit.solution}. One quick question — roughly how much volume are we talking about? (messages per day, records per week, users, anything you know)`,
      suggestions: ['~50–200 per day', '~200–1000 per day', 'Not sure yet'],
      state: { ...state, phase: 'clarify', problem: text, solution: hit.solution, solutionHref: hit.href },
    };
  }

  if (state.phase === 'clarify') {
    const combined = `${state.problem || ''} ${text}`;
    const complexity = estimateComplexity(combined);
    const sizeNote =
      complexity === 'Small'
        ? 'This usually lands as a focused build — often live within a few weeks.'
        : complexity === 'Medium'
          ? 'This typically runs as a structured project with clear milestones.'
          : 'This is a larger system — we would phase it so value ships early.';
    return {
      text: `Here's my read:\n\n→ Direction: ${state.solution}\n→ Complexity: ${complexity}\n→ ${sizeNote}\n\nWe'd confirm scope on a short discovery call — I never quote from a chat. Want me to pass this to our team, or continue into the project form?`,
      state: { ...state, phase: 'recommend', complexity, volume: text },
      showHandoff: true,
      suggestions: ['Send this to the team', "I'll fill the project form"],
    };
  }

  if (state.phase === 'recommend' && /fill|form/i.test(text)) {
    return {
      text: 'Smart move — the form takes about a minute and your summary above will come with you.',
      state: { ...state, phase: 'done' },
      showHandoff: true,
    };
  }

  // capture contact
  const emailMatch = text.match(/[^\s@]+@[^\s@]+\.[^\s@]{2,}/);
  if (emailMatch) {
    return {
      text: 'Perfect — our team will reply within one business day with next steps and a time to talk. In the meantime you can continue into the project form to add detail.',
      state: { ...state, phase: 'done' },
      showHandoff: true,
    };
  }

  return {
    text: 'Great — what is the best email for our team to reach you?',
    state: { ...state, phase: 'capture' },
  };
}
