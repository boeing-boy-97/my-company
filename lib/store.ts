// ============================================================
// Data layer — file-backed store mirroring db/schema.sql 1:1.
// In production, swap these repositories for Supabase/Postgres
// queries; signatures are designed to stay identical.
//
// Collections: leads, contacts, applications, clients, users,
// projects (+milestones/tasks/messages/files), cms (case studies,
// posts, testimonials, team, jobs), notifications, sessions,
// outbox, settings, resetTokens.
// ============================================================
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

// Seed modules — clearly development/example content (§69).
import { caseStudies as seedCases } from '@/content/caseStudies';
import { posts as seedPosts } from '@/content/posts';
import { testimonials as seedTestimonials } from '@/content/testimonials';
import { teamMembers as seedTeam } from '@/content/team';
import { jobs as seedJobs } from '@/content/jobs';

const DATA_DIR = path.join(process.cwd(), 'data');
export const uploadsDir = path.join(DATA_DIR, 'uploads');

// ---------------- types ----------------

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'discovery' | 'proposal' | 'negotiation' | 'won' | 'lost';
export const LEAD_STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'discovery', 'proposal', 'negotiation', 'won', 'lost'];

export interface LeadActivity { id: string; type: string; note: string; at: string }

export interface Lead {
  id: string;
  reference: string;
  source: string;
  kind: string;
  projectTypes: string[];
  objective: string;
  existingAssets: string[];
  timeline: string;
  budgetRange: string;
  currency: string;
  companyName: string;
  website: string;
  industry: string;
  country: string;
  contactName: string;
  email: string;
  phone: string;
  whatsapp: string;
  preferredChannel: string;
  consultantLog?: Array<{ role: 'user' | 'assistant'; text: string }>;
  status: LeadStatus;
  owner: string;
  sourceUrl: string;
  utm: { source: string; medium: string; campaign: string };
  activity: LeadActivity[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactSubmission { id: string; name: string; email: string; topic: string; message: string; status: string; createdAt: string }

export interface Application {
  id: string; jobId: string; name: string; email: string; resumeKey: string;
  portfolio: string; github: string; linkedin: string; message: string; status: string; createdAt: string;
}

export interface Client {
  id: string; company: string; contactName: string; email: string; phone: string;
  country: string; currency: string; notes: string; status: 'active' | 'archived'; createdAt: string; updatedAt: string;
}

export type Role = 'admin' | 'client';

export interface UserAccount {
  id: string; email: string; passwordHash: string; role: Role; name: string; clientId?: string;
  status: 'active' | 'disabled'; createdAt: string;
}

export type MilestoneStatus = 'upcoming' | 'in_progress' | 'blocked' | 'complete';
export interface Milestone { id: string; title: string; detail: string; status: MilestoneStatus; progress: number; due: string }

export interface PortalMessage { id: string; authorRole: 'client' | 'studio'; authorName: string; body: string; createdAt: string; readAt?: string }
export interface PortalTask { id: string; title: string; status: 'done' | 'in-progress' | 'todo' }
export interface PortalFile { id: string; projectId: string; name: string; key: string; mime: string; size: number; uploadedBy: 'client' | 'studio'; createdAt: string }

export interface Project {
  id: string; clientId: string; name: string; summary: string; status: string; progress: number;
  latestUpdate: { at: string; note: string }; nextMilestone: string;
  milestones: Milestone[]; tasks: PortalTask[]; deployment: { env: string; status: string; url: string; lastDeploy: string };
  createdAt: string;
}

export interface Session { token: string; role: Role; email: string; name: string; clientId?: string; expiresAt: string }

export type CmsStatus = 'draft' | 'published' | 'archived';
export interface CmsRecord { id: string; status: CmsStatus; sample?: boolean; updatedAt: string }
export type CaseStudyRecord = CmsRecord & Omit<(typeof seedCases)[number], never> & { seoTitle?: string; seoDescription?: string; publishedAt?: string };
export type PostRecord = CmsRecord & (typeof seedPosts)[number] & { seoTitle?: string; seoDescription?: string };
export type TestimonialRecord = CmsRecord & { quote: string; person: string; role: string; company: string };
export type TeamRecord = CmsRecord & { name: string; title: string; bio: string };
export interface JobRecord extends CmsRecord {
  slug: string; title: string; location: string; type: string; summary: string;
  responsibilities: string[]; requirements: string[]; perks: string[];
}

export interface Notification { id: string; audience: 'admin' | 'client'; type: string; text: string; link?: string; readAt?: string; createdAt: string }

export interface SiteSettings {
  contactEmail?: string; phone?: string; whatsapp?: string; hours?: string;
  socials?: Array<{ id: string; label: string; url: string }>;
}

interface DB {
  version: number;
  leads: Lead[];
  contacts: ContactSubmission[];
  applications: Application[];
  clients: Client[];
  users: UserAccount[];
  projects: Project[];
  files: PortalFile[];
  cms: { caseStudies: CaseStudyRecord[]; posts: PostRecord[]; testimonials: TestimonialRecord[]; team: TeamRecord[]; jobs: JobRecord[] };
  notifications: Notification[];
  sessions: Session[];
  outbox: Array<{ id: string; to: string; subject: string; body: string; sentAt: string }>;
  settings: SiteSettings;
  resetTokens: Array<{ token: string; email: string; expiresAt: string }>;
}

const uid = () => crypto.randomUUID();
const now = () => new Date().toISOString();

// ---------------- passwords ----------------

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(8).toString('hex');
  const hash = crypto.scryptSync(password, salt, 32).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const check = crypto.scryptSync(password, salt, 32).toString('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(check, 'hex'));
  } catch {
    return false;
  }
}

// ---------------- seed ----------------

function seed(): DB {
  const t = now();
  const iso = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString();

  const demoClient: Client = {
    id: 'cli-demo-01', company: 'Aurora Retail Group', contactName: 'Demo Client',
    email: process.env.PORTAL_EMAIL || 'client@demo.kiln.studio', phone: '', country: 'India', currency: 'USD',
    notes: 'Sample workspace used to demonstrate the client portal.', status: 'active', createdAt: t, updatedAt: t,
  };

  const demoProject: Project = {
    id: 'prj-demo-01',
    clientId: 'cli-demo-01',
    name: 'Aurora CRM — Phase 2',
    summary: 'Sales pipeline automation with AI follow-up. Phase 2 adds WhatsApp integration and a forecasting dashboard.',
    status: 'build',
    progress: 62,
    latestUpdate: { at: iso(1), note: 'WhatsApp webhook integration passed QA. Forecast charts in review.' },
    nextMilestone: 'Internal QA round',
    milestones: [
      { id: 'm1', title: 'Discovery & specification', detail: 'Problem mapping, data audit, success metrics.', status: 'complete', progress: 100, due: iso(34) },
      { id: 'm2', title: 'UX & architecture', detail: 'Pipeline UI, automation flows, API contracts.', status: 'complete', progress: 100, due: iso(20) },
      { id: 'm3', title: 'Build & integration', detail: 'Core build, WhatsApp Business API, forecasting.', status: 'in_progress', progress: 62, due: iso(-12) },
      { id: 'm4', title: 'QA & launch', detail: 'End-to-end testing, rollout, team training.', status: 'upcoming', progress: 0, due: iso(-26) },
    ],
    tasks: [
      { id: 't1', title: 'Forecast dashboard — chart review', status: 'in-progress' },
      { id: 't2', title: 'WhatsApp tone variants for enterprise segment', status: 'todo' },
      { id: 't3', title: 'Webhook retry policy', status: 'done' },
    ],
    deployment: { env: 'staging', status: 'healthy', url: 'staging.aurora-demo.app', lastDeploy: iso(1) },
    createdAt: iso(40),
  };

  const users: UserAccount[] = [
    { id: uid(), email: process.env.ADMIN_EMAIL || 'admin@kiln.studio', passwordHash: hashPassword(process.env.ADMIN_PASSWORD || 'admin2026'), role: 'admin', name: 'Administrator', status: 'active', createdAt: t },
    { id: uid(), email: process.env.PORTAL_EMAIL || 'client@demo.kiln.studio', passwordHash: hashPassword(process.env.PORTAL_PASSWORD || 'demo2026'), role: 'client', name: 'Demo Client', clientId: 'cli-demo-01', status: 'active', createdAt: t },
  ];

  return {
    version: 2,
    leads: [],
    contacts: [],
    applications: [],
    clients: [demoClient],
    users,
    projects: [demoProject],
    files: [
      { id: uid(), projectId: 'prj-demo-01', name: 'aurora-phase2-spec.pdf', key: 'sample-spec.pdf', mime: 'application/pdf', size: 421888, uploadedBy: 'studio', createdAt: iso(18) },
    ],
    cms: {
      caseStudies: seedCases.map((c) => ({ ...c, id: uid(), status: 'published' as CmsStatus, sample: true, publishedAt: `${c.year}-01-15`, updatedAt: t })),
      posts: seedPosts.map((p) => ({ ...p, id: uid(), status: 'published' as CmsStatus, sample: true, updatedAt: t })),
      testimonials: seedTestimonials.map((x) => ({ id: uid(), quote: x.quote, person: x.person, role: x.role, company: x.company, status: 'draft' as CmsStatus, sample: true, updatedAt: t })),
      team: seedTeam.map((m) => ({ id: uid(), name: m.name, title: m.role, bio: m.bio, status: m.isPlaceholder ? ('draft' as CmsStatus) : ('published' as CmsStatus), sample: m.isPlaceholder, updatedAt: t })),
      jobs: seedJobs.map((j) => ({ ...j, id: uid(), status: 'published' as CmsStatus, sample: true, updatedAt: t })),
    },
    notifications: [],
    sessions: [],
    outbox: [],
    settings: {},
    resetTokens: [],
  };
}

// ---------------- persistence ----------------

let cache: DB | null = null;
const DB_PATH = () => path.join(DATA_DIR, 'db.json');

async function ensureDirs() {
  if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
  if (!existsSync(uploadsDir)) await mkdir(uploadsDir, { recursive: true });
}

/** Migrate v1 databases (pre-CMS) to the current shape. */
function migrate(old: Partial<DB> & { version?: number }): DB {
  const fresh = seed();
  const merged: DB = {
    ...fresh,
    ...old,
    version: 2,
    clients: old.clients?.length ? old.clients : fresh.clients,
    users: old.users?.length ? old.users : fresh.users,
    files: old.files || [],
    cms: old.cms && old.cms.caseStudies ? old.cms : fresh.cms,
    notifications: old.notifications || [],
    settings: old.settings || {},
    resetTokens: old.resetTokens || [],
  };
  // Milestone status migration (done/active/pending → new vocabulary).
  for (const p of merged.projects) {
    p.createdAt ||= merged.projects.length ? now() : now();
    for (const m of p.milestones as Array<Milestone & { status: string }>) {
      if (m.status === 'done' as string) m.status = 'complete';
      else if (m.status === 'active' as string) m.status = 'in_progress';
      else if (m.status === 'pending' as string) m.status = 'upcoming';
    }
  }
  for (const l of merged.leads) {
    l.owner ||= 'Unassigned';
    l.activity ||= [];
    l.utm ||= { source: '', medium: '', campaign: '' };
  }
  return merged;
}

async function load(): Promise<DB> {
  if (cache) return cache;
  await ensureDirs();
  if (!existsSync(DB_PATH())) {
    cache = seed();
    await persist();
    return cache;
  }
  try {
    const raw = JSON.parse(await readFile(DB_PATH(), 'utf8')) as DB & { version?: number };
    cache = raw.version === 2 && raw.cms && raw.clients ? raw : migrate(raw);
  } catch {
    cache = seed();
  }
  return cache;
}

async function persist() {
  if (!cache) return;
  await ensureDirs();
  await writeFile(DB_PATH(), JSON.stringify(cache, null, 2), 'utf8');
}

// ---------------- notifications ----------------

export async function notify(audience: 'admin' | 'client', type: string, text: string, link?: string) {
  const data = await load();
  data.notifications.unshift({ id: uid(), audience, type, text, link, createdAt: now() });
  data.notifications = data.notifications.slice(0, 200);
  await persist();
}

export async function listNotifications(audience: 'admin' | 'client'): Promise<Notification[]> {
  const data = await load();
  return data.notifications.filter((n) => n.audience === audience);
}

export async function markNotificationsRead(audience: 'admin' | 'client') {
  const data = await load();
  for (const n of data.notifications) if (n.audience === audience && !n.readAt) n.readAt = now();
  await persist();
}

// ---------------- leads ----------------

export async function listLeads(): Promise<Lead[]> {
  const data = await load();
  return [...data.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getLead(id: string): Promise<Lead | undefined> {
  const data = await load();
  return data.leads.find((l) => l.id === id);
}

export async function createLead(input: Partial<Lead> & { reference: string }): Promise<Lead> {
  const data = await load();
  const t = now();
  const lead: Lead = {
    id: uid(), status: 'new', owner: 'Unassigned', sourceUrl: '', utm: { source: '', medium: '', campaign: '' },
    activity: [{ id: uid(), type: 'created', note: `Lead created via ${input.source || 'website-form'}`, at: t }],
    notes: '', createdAt: t, updatedAt: t,
    kind: 'project-brief', projectTypes: [], objective: '', existingAssets: [], timeline: '', budgetRange: '',
    currency: 'USD', companyName: '', website: '', industry: '', country: '', contactName: '', email: '',
    phone: '', whatsapp: '', preferredChannel: 'Email', source: 'website-form',
    ...input,
  };
  data.leads.unshift(lead);
  await persist();
  await notify('admin', 'lead', `New lead ${lead.reference} — ${lead.contactName || lead.companyName || 'unnamed'}`, `/admin/leads/${lead.id}`);
  return lead;
}

export async function updateLead(id: string, patch: Partial<Pick<Lead, 'status' | 'notes' | 'owner'>>, activityNote?: string): Promise<Lead | undefined> {
  const data = await load();
  const lead = data.leads.find((l) => l.id === id);
  if (!lead) return undefined;
  Object.assign(lead, patch, { updatedAt: now() });
  lead.activity.unshift({ id: uid(), type: patch.status ? 'status' : 'note', note: activityNote || (patch.status ? `Status changed to ${patch.status}` : 'Note updated'), at: now() });
  await persist();
  return lead;
}

export async function leadCounts(): Promise<Record<string, number>> {
  const leads = await listLeads();
  const counts: Record<string, number> = {};
  for (const s of LEAD_STATUSES) counts[s] = 0;
  for (const l of leads) counts[l.status] = (counts[l.status] || 0) + 1;
  return counts;
}

// ---------------- contacts & applications ----------------

export async function createContact(input: Omit<ContactSubmission, 'id' | 'status' | 'createdAt'>): Promise<ContactSubmission> {
  const data = await load();
  const entry: ContactSubmission = { ...input, id: uid(), status: 'new', createdAt: now() };
  data.contacts.unshift(entry);
  await persist();
  await notify('admin', 'contact', `New contact message from ${entry.name}`, '/admin');
  return entry;
}

export async function listContacts(): Promise<ContactSubmission[]> {
  const data = await load();
  return [...data.contacts];
}

export async function createApplication(input: Omit<Application, 'id' | 'status' | 'createdAt'>): Promise<Application> {
  const data = await load();
  const entry: Application = { ...input, id: uid(), status: 'new', createdAt: now() };
  data.applications.unshift(entry);
  await persist();
  await notify('admin', 'application', `New application — ${entry.name}`, '/admin');
  return entry;
}

export async function listApplications(): Promise<Application[]> {
  const data = await load();
  return [...data.applications];
}

// ---------------- clients ----------------

export async function listClients(): Promise<Client[]> {
  const data = await load();
  return data.clients.filter((c) => c.status === 'active');
}

export async function getClient(id: string): Promise<Client | undefined> {
  const data = await load();
  return data.clients.find((c) => c.id === id);
}

export async function getClientByEmail(email: string): Promise<Client | undefined> {
  const data = await load();
  return data.clients.find((c) => c.email.toLowerCase() === email.toLowerCase());
}

export async function createClient(input: Partial<Client> & { company: string }): Promise<Client> {
  const data = await load();
  const t = now();
  const client: Client = {
    id: uid(), company: input.company, contactName: input.contactName || '', email: input.email || '',
    phone: input.phone || '', country: input.country || '', currency: input.currency || 'USD',
    notes: input.notes || '', status: 'active', createdAt: t, updatedAt: t,
  };
  data.clients.push(client);
  await persist();
  return client;
}

export async function updateClient(id: string, patch: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<Client | undefined> {
  const data = await load();
  const client = data.clients.find((c) => c.id === id);
  if (!client) return undefined;
  Object.assign(client, patch, { updatedAt: now() });
  await persist();
  return client;
}

// ---------------- users / auth ----------------

export async function getUserByEmail(email: string): Promise<UserAccount | undefined> {
  const data = await load();
  return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.status === 'active');
}

export async function updateUserPassword(email: string, passwordHash: string) {
  const data = await load();
  const user = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (user) user.passwordHash = passwordHash;
  await persist();
}

export async function createResetToken(email: string): Promise<string> {
  const data = await load();
  const token = crypto.randomBytes(24).toString('hex');
  data.resetTokens = data.resetTokens.filter((t) => t.email !== email);
  data.resetTokens.push({ token, email, expiresAt: new Date(Date.now() + 3600_000).toISOString() });
  await persist();
  return token;
}

export async function consumeResetToken(token: string): Promise<string | null> {
  const data = await load();
  const entry = data.resetTokens.find((t) => t.token === token);
  if (!entry) return null;
  if (new Date(entry.expiresAt) < new Date()) return null;
  data.resetTokens = data.resetTokens.filter((t) => t.token !== token);
  await persist();
  return entry.email;
}

export async function createSession(role: Role, email: string, name: string, clientId?: string): Promise<Session> {
  const data = await load();
  const session: Session = {
    token: crypto.randomBytes(32).toString('hex'), role, email, name, clientId,
    expiresAt: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
  };
  data.sessions = data.sessions.filter((s) => new Date(s.expiresAt) > new Date());
  data.sessions.push(session);
  await persist();
  return session;
}

export async function getSession(token: string): Promise<Session | null> {
  const data = await load();
  const session = data.sessions.find((s) => s.token === token);
  if (!session || new Date(session.expiresAt) < new Date()) return null;
  return session;
}

export async function destroySession(token: string) {
  const data = await load();
  data.sessions = data.sessions.filter((s) => s.token !== token);
  await persist();
}

// ---------------- projects ----------------

export async function listProjects(clientId?: string): Promise<Project[]> {
  const data = await load();
  return clientId ? data.projects.filter((p) => p.clientId === clientId) : data.projects;
}

export async function getProject(id: string): Promise<Project | undefined> {
  const data = await load();
  return data.projects.find((p) => p.id === id);
}

export async function createProject(input: { clientId: string; name: string; summary: string }): Promise<Project> {
  const data = await load();
  const project: Project = {
    id: `prj-${uid().slice(0, 8)}`, clientId: input.clientId, name: input.name, summary: input.summary,
    status: 'discovery', progress: 0, latestUpdate: { at: now(), note: 'Project created.' },
    nextMilestone: 'Discovery call',
    milestones: [
      { id: uid(), title: 'Discovery', detail: 'Problem mapping and success criteria.', status: 'in_progress', progress: 0, due: '' },
      { id: uid(), title: 'Strategy', detail: 'Approach, scope and investment range.', status: 'upcoming', progress: 0, due: '' },
      { id: uid(), title: 'Design', detail: 'Flows, interfaces and architecture.', status: 'upcoming', progress: 0, due: '' },
      { id: uid(), title: 'Development', detail: 'Build in weekly iterations.', status: 'upcoming', progress: 0, due: '' },
      { id: uid(), title: 'QA', detail: 'Testing against success criteria.', status: 'upcoming', progress: 0, due: '' },
      { id: uid(), title: 'Deployment', detail: 'Staged rollout and monitoring.', status: 'upcoming', progress: 0, due: '' },
      { id: uid(), title: 'Support', detail: 'Health reports and improvements.', status: 'upcoming', progress: 0, due: '' },
    ],
    tasks: [], deployment: { env: '—', status: 'not deployed', url: '', lastDeploy: '' }, createdAt: now(),
  };
  data.projects.unshift(project);
  await persist();
  await notify('client', 'project', `A new project was opened: ${project.name}`, `/portal/projects/${project.id}`);
  return project;
}

export async function updateProject(id: string, patch: Partial<Pick<Project, 'name' | 'summary' | 'status' | 'progress' | 'nextMilestone' | 'latestUpdate'>>): Promise<Project | undefined> {
  const data = await load();
  const project = data.projects.find((p) => p.id === id);
  if (!project) return undefined;
  Object.assign(project, patch);
  await persist();
  return project;
}

export async function upsertMilestone(projectId: string, milestone: Partial<Milestone> & { title: string }): Promise<Project | undefined> {
  const data = await load();
  const project = data.projects.find((p) => p.id === projectId);
  if (!project) return undefined;
  if (milestone.id) {
    const m = project.milestones.find((x) => x.id === milestone.id);
    if (m) Object.assign(m, milestone);
  } else {
    project.milestones.push({ id: uid(), title: milestone.title, detail: milestone.detail || '', status: milestone.status || 'upcoming', progress: milestone.progress || 0, due: milestone.due || '' });
  }
  await persist();
  return project;
}

export async function addProjectMessage(projectId: string, authorRole: 'client' | 'studio', authorName: string, body: string) {
  const data = await load();
  const project = data.projects.find((p) => p.id === projectId);
  if (!project) return;
  // Messages stored with project for backward compat.
  (project as Project & { messages?: PortalMessage[] }).messages ||= [];
  (project as Project & { messages: PortalMessage[] }).messages.push({ id: uid(), authorRole, authorName, body, createdAt: now() });
  await persist();
  if (authorRole === 'client') {
    await notify('admin', 'message', `New message from ${authorName} on ${project.name}`, `/admin/projects/${projectId}`);
  } else {
    await notify('client', 'message', `New reply from the studio on ${project.name}`, `/portal/projects/${projectId}`);
  }
}

export async function getProjectMessages(projectId: string): Promise<PortalMessage[]> {
  const data = await load();
  const project = data.projects.find((p) => p.id === projectId);
  return ((project as (Project & { messages?: PortalMessage[] }) | undefined)?.messages || []);
}

export async function markProjectMessagesRead(projectId: string, reader: 'client' | 'studio') {
  const data = await load();
  const project = data.projects.find((p) => p.id === projectId);
  if (!project) return;
  const messages = (project as Project & { messages?: PortalMessage[] }).messages || [];
  for (const m of messages) {
    if (m.authorRole !== reader && !m.readAt) m.readAt = now();
  }
  await persist();
}

export async function unreadMessageCount(clientId?: string): Promise<number> {
  const data = await load();
  const projects = clientId ? data.projects.filter((p) => p.clientId === clientId) : data.projects;
  let count = 0;
  for (const p of projects) {
    const messages = (p as Project & { messages?: PortalMessage[] }).messages || [];
    for (const m of messages) {
      const reader = clientId ? 'client' : 'studio';
      if (m.authorRole !== reader && !m.readAt) count++;
    }
  }
  return count;
}

export async function recentMessages(clientId?: string, limit = 6): Promise<Array<PortalMessage & { projectId: string; projectName: string }>> {
  const data = await load();
  const projects = clientId ? data.projects.filter((p) => p.clientId === clientId) : data.projects;
  const all: Array<PortalMessage & { projectId: string; projectName: string }> = [];
  for (const p of projects) {
    for (const m of (p as Project & { messages?: PortalMessage[] }).messages || []) {
      all.push({ ...m, projectId: p.id, projectName: p.name });
    }
  }
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}

// ---------------- files ----------------

export async function addFile(input: Omit<PortalFile, 'id' | 'createdAt'>): Promise<PortalFile> {
  const data = await load();
  const file: PortalFile = { ...input, id: uid(), createdAt: now() };
  data.files.unshift(file);
  await persist();
  await notify(input.uploadedBy === 'client' ? 'admin' : 'client', 'file', `File uploaded: ${file.name}`, input.uploadedBy === 'client' ? `/admin/projects/${file.projectId}` : `/portal/files`);
  return file;
}

export async function listFiles(projectId?: string): Promise<PortalFile[]> {
  const data = await load();
  return projectId ? data.files.filter((f) => f.projectId === projectId) : data.files;
}

export async function getFile(id: string): Promise<PortalFile | undefined> {
  const data = await load();
  return data.files.find((f) => f.id === id);
}

export async function deleteFile(id: string): Promise<boolean> {
  const data = await load();
  const before = data.files.length;
  data.files = data.files.filter((f) => f.id !== id);
  await persist();
  return data.files.length < before;
}

// ---------------- CMS ----------------

type CmsKind = 'caseStudies' | 'posts' | 'testimonials' | 'team' | 'jobs';

export async function cmsList<T = CmsRecord>(kind: CmsKind): Promise<T[]> {
  const data = await load();
  return data.cms[kind] as unknown as T[];
}

export async function cmsGet<T = CmsRecord>(kind: CmsKind, idOrSlug: string): Promise<T | undefined> {
  const data = await load();
  const list = data.cms[kind] as unknown as Array<{ id: string; slug?: string }>;
  return list.find((r) => r.id === idOrSlug || r.slug === idOrSlug) as unknown as T | undefined;
}

export async function cmsSave<T extends CmsRecord>(kind: CmsKind, record: T): Promise<T> {
  const data = await load();
  const list = data.cms[kind] as unknown as T[];
  const idx = list.findIndex((r) => r.id === record.id);
  const stamped = { ...record, updatedAt: now() };
  if (idx >= 0) list[idx] = stamped;
  else list.unshift(stamped);
  await persist();
  return stamped;
}

export async function cmsDelete(kind: CmsKind, id: string): Promise<boolean> {
  const data = await load();
  const list = data.cms[kind] as unknown as Array<{ id: string }>;
  const before = list.length;
  (data.cms[kind] as unknown as Array<{ id: string }>) = list.filter((r) => r.id !== id);
  await persist();
  return (data.cms[kind] as unknown as Array<{ id: string }>).length < before;
}

export async function cmsPublished<T = CmsRecord>(kind: CmsKind): Promise<T[]> {
  const list = await cmsList<T & CmsRecord>(kind);
  return list.filter((r) => r.status === 'published') as T[];
}

// ---------------- mail outbox (Resend stub) ----------------

export async function sendMail(to: string, subject: string, body: string) {
  const data = await load();
  data.outbox.unshift({ id: uid(), to, subject, body, sentAt: now() });
  await persist();

  // Real delivery through Resend when configured; the outbox copy is kept either way.
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Kiln Technology Studio <onboarding@resend.dev>',
          to: [to],
          subject,
          text: body,
        }),
      });
    } catch {
      // Delivery failure must never break the user action — the email stays in the outbox.
    }
  }
}

export async function listOutbox() {
  const data = await load();
  return data.outbox.slice(0, 50);
}

// ---------------- settings ----------------

export async function getSettings(): Promise<SiteSettings> {
  const data = await load();
  return data.settings;
}

export async function saveSettings(patch: SiteSettings) {
  const data = await load();
  data.settings = { ...data.settings, ...patch };
  await persist();
}

// ---------------- uploads ----------------

export async function ensureUploadDir() {
  await ensureDirs();
}
