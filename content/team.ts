// ============================================================
// CMS CONTENT — Team members. PLACEHOLDER RECORDS ONLY:
// `isPlaceholder` entries are never rendered as real people.
// Add real members as they join (and set isPlaceholder: false).
// ============================================================

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  isPlaceholder: boolean;
}

export const teamMembers: TeamMember[] = [
  { name: 'Founder & Lead Engineer', role: 'Architecture, AI systems, delivery', bio: '', isPlaceholder: true },
  { name: 'Product Engineer', role: 'Web & mobile applications', bio: '', isPlaceholder: true },
  { name: 'Automation Engineer', role: 'Workflow & integration systems', bio: '', isPlaceholder: true },
];

export const realTeamMembers = teamMembers.filter((m) => !m.isPlaceholder);
