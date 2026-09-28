export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function readingTime(words: number) {
  return Math.max(1, Math.round(words / 220));
}

export function makeRef(prefix = 'KD') {
  // Human-readable, non-sequential: KD-2026-83F42 style.
  const year = new Date().getFullYear();
  const chars = '0123456789ABCDEFGHJKMNPQRSTUVWXYZ';
  let suffix = '';
  for (let i = 0; i < 5; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${year}-${suffix}`;
}


export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function truncate(text: string, n: number) {
  return text.length > n ? text.slice(0, n - 1).trimEnd() + '…' : text;
}

// Operational project statuses (admin) and the friendly labels clients see.
export const PROJECT_STATUSES = ['planning', 'in_progress', 'blocked', 'in_review', 'ready_to_launch', 'live', 'completed', 'on_hold', 'archived'] as const;
export const FRIENDLY_STATUS: Record<string, string> = {
  planning: 'Planning', in_progress: 'In progress', blocked: 'Waiting on something', in_review: 'In review',
  ready_to_launch: 'Ready to launch', live: 'Live', completed: 'Completed', on_hold: 'On hold', archived: 'Archived',
  // legacy values map to friendly equivalents
  discovery: 'Planning', design: 'In progress', build: 'In progress', qa: 'In review', support: 'Live', paused: 'On hold',
};
export function friendlyProjectStatus(status: string): string {
  return FRIENDLY_STATUS[status] || status;
}
