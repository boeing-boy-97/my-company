'use server';
// ============================================================
// Server actions — every mutation entry point.
// Each action: authorizes → rate-limits → validates → sanitizes
// → persists → notifies. Errors returned are safe to display.
// ============================================================
import { headers } from 'next/headers';
import crypto from 'crypto';
import { redirect } from 'next/navigation';
import { rateLimit } from './rate-limit';
import { sanitize, sanitizeArray, vEmail, vLen, vPhone, vUrl } from './validate';
import { makeRef } from './utils';
import { track } from './analytics';
import {
  createLead, createContact, createApplication, updateLead, listLeads, sendMail,
  ensureUploadDir, addProjectMessage, getUserByEmail, createResetToken,
  consumeResetToken, updateUserPassword, hashPassword, listClients, createClient,
  updateClient, createProject, updateProject, upsertMilestone, listProjects, getProject,
  addFile, deleteFile, getFile, cmsList, cmsGet, cmsSave, cmsDelete, notify, writeUpload, removeUpload,
  saveSettings, getProjectMessages, markProjectMessagesRead, listFiles,
  findRecentDuplicateBrief, audit, createPortalInvite, friendlyProjectStatus, PROJECT_STATUSES, saveProjectRecord,
  type LeadStatus, type Role, type MilestoneStatus, type CmsStatus, type CmsRecord,
  type ProjectUpdate, type Approval,
} from './store';
import { authenticate, getCurrentSession, loginAs, logout } from './auth';
import { consultRespond, detectSolution, type ConsultState } from './consult';

export type ActionResult = { ok: true; ref?: string; id?: string; [k: string]: unknown } | { ok: false; error: string; errors?: Record<string, string> };

const UNAUTHORIZED: ActionResult = { ok: false, error: 'You are not authorized to do that.' };

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0] || 'local';
}

async function requireAdmin() {
  const session = await getCurrentSession();
  return session?.role === 'admin' ? session : null;
}

async function requireClient() {
  const session = await getCurrentSession();
  return session?.role === 'client' ? session : null;
}

// ================= PROJECT INTAKE =================

export interface ProjectBriefInput {
  projectTypes: string[];
  objective: string;
  existingAssets: string[];
  currentTech?: string;
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
  sourceUrl?: string;
  utm?: { source: string; medium: string; campaign: string };
}

export async function submitProjectBrief(input: ProjectBriefInput): Promise<ActionResult> {
  const ip = await clientIp();
  if (!rateLimit(`brief:${ip}`, 6, 10 * 60_000)) return { ok: false, error: 'Too many submissions. Please try again shortly.' };

  const errors: Record<string, string> = {};
  if (!input.projectTypes?.length) errors.projectTypes = 'Pick at least one option';
  const objective = sanitize(input.objective || '', 3000);
  if (objective.length < 12) errors.objective = 'Tell us a little more — one or two sentences helps us route this correctly.';
  if (!input.timeline) errors.timeline = 'Select a timeline';
  if (!input.budgetRange) errors.budget = 'Select a budget range (or "Not sure")';
  const contactName = sanitize(input.contactName, 120);
  if (!contactName) errors.contactName = 'Your name is required';
  const email = sanitize(input.email, 200);
  const emailErr = vRequiredEmail(email);
  if (emailErr) errors.email = emailErr;
  if (vPhone(input.phone || '')) errors.phone = 'Enter a valid phone number';
  if (vUrl(input.website || '')) errors.website = 'Enter a valid URL (https://…)';
  if (Object.keys(errors).length) return { ok: false, error: 'Please review the highlighted fields.', errors };

  // Duplicate detection: same email + same objective within 10 minutes → return existing reference.
  const dup = await findRecentDuplicateBrief(email, objective);
  if (dup) {
    await track('project_form_duplicate_blocked', { reference: dup.reference });
    return { ok: true, ref: dup.reference, id: dup.id, duplicate: true };
  }

  const reference = makeRef();
  const lead = await createLead({
    reference,
    source: 'website-form',
    kind: 'project-brief',
    projectTypes: sanitizeArray(input.projectTypes),
    objective,
    existingAssets: sanitizeArray(input.existingAssets || []),
    currentTech: sanitize(input.currentTech || '', 2000),
    timeline: sanitize(input.timeline, 40),
    budgetRange: sanitize(input.budgetRange, 40),
    currency: ['USD', 'INR', 'EUR', 'GBP', 'AED'].includes(input.currency) ? input.currency : 'USD',
    companyName: sanitize(input.companyName, 160),
    website: sanitize(input.website, 300),
    industry: sanitize(input.industry, 80),
    country: sanitize(input.country, 80),
    contactName,
    email,
    phone: sanitize(input.phone, 40),
    whatsapp: sanitize(input.whatsapp, 40),
    preferredChannel: sanitize(input.preferredChannel, 40) || 'Email',
    sourceUrl: sanitize(input.sourceUrl || '', 500),
    utm: {
      source: sanitize(input.utm?.source || '', 100),
      medium: sanitize(input.utm?.medium || '', 100),
      campaign: sanitize(input.utm?.campaign || '', 100),
    },
  });

  await sendMail(email, `We received your project brief (${reference})`,
    `Hi ${contactName},\n\nThanks for sending this over — your project brief is with our team.\nReference: ${reference}\n\nWe'll reply within one business day with next steps and a few questions.\n\n— Kiln Technology Studio`);

  await track('project_form_completed', { reference });
  return { ok: true, ref: reference, id: lead.id };
}

function vRequiredEmail(email: string): string | null {
  if (!email) return 'Email is required';
  return vEmail(email) || vLen(email, 200, 'Email');
}

// ================= CONTACT =================

export async function submitContact(input: { name: string; email: string; topic: string; message: string }): Promise<ActionResult> {
  const ip = await clientIp();
  if (!rateLimit(`contact:${ip}`, 8, 10 * 60_000)) return { ok: false, error: 'Too many messages. Please try again shortly.' };

  const errors: Record<string, string> = {};
  const name = sanitize(input.name, 120);
  if (!name) errors.name = 'Your name is required';
  const email = sanitize(input.email, 200);
  const emailErr = vRequiredEmail(email);
  if (emailErr) errors.email = emailErr;
  const message = sanitize(input.message, 4000);
  if (message.length < 10) errors.message = 'Add a little more detail';
  if (Object.keys(errors).length) return { ok: false, error: 'Please review the highlighted fields.', errors };

  await createContact({ name, email, topic: sanitize(input.topic, 80), message });
  await sendMail(email, 'We received your message', `Hi ${name},\n\nThanks for reaching out — we'll get back to you within one business day.\n\n— Kiln Technology Studio`);
  await track('contact_form_submitted');
  return { ok: true };
}

// ================= AI CONSULTANT =================

export async function consultMessage(message: string, state: ConsultState): Promise<{ reply: string; suggestions?: string[]; state: ConsultState; showHandoff?: boolean; leadCreated?: boolean }> {
  const ip = await clientIp();
  if (!rateLimit(`consult:${ip}`, 30, 60_000)) {
    return { reply: 'Let’s pause here for a moment — you can continue with the project form or talk to a human.', state: { ...state, phase: 'done' }, showHandoff: true };
  }
  const clean = sanitize(message, 1500);
  if (!clean) return { reply: 'Tell me a little about the problem — one sentence is enough.', state };

  const result = consultRespond(clean, state);
  await track('ai_consultant_message');

  if (state.phase === 'recommend' && /send|team/i.test(clean)) {
    const direction = state.solution || detectSolution(state.problem || '')?.solution || 'General enquiry';
    const reference = makeRef('AI');
    await createLead({
      reference, source: 'ai-consultant', kind: 'consultant',
      projectTypes: [direction],
      objective: sanitize(state.problem || clean, 2000),
      timeline: 'Not shared yet', budgetRange: 'Not shared yet', currency: 'USD',
      contactName: 'Via AI consultant', email: 'pending',
      consultantLog: [
        { role: 'user', text: state.problem || '' },
        { role: 'assistant', text: `Direction: ${direction}. Complexity: ${state.complexity || '—'}.` },
      ],
    });
    await track('ai_consultant_completed');
    return {
      reply: 'Done — the summary is with our team. Add your email if you’d like the reply directly, or continue into the project form to add detail.',
      state: { ...state, phase: 'capture' },
      showHandoff: true,
      leadCreated: true,
    };
  }

  if (state.phase === 'capture') {
    const emailMatch = clean.match(/[^\s@]+@[^\s@]+\.[^\s@]{2,}/);
    if (emailMatch) await track('ai_consultant_completed');
  }

  return { reply: result.text, suggestions: result.suggestions, state: result.state, showHandoff: result.showHandoff };
}

// ================= AUTH =================

export async function loginAction(role: Role, email: string, password: string): Promise<ActionResult> {
  const ip = await clientIp();
  if (!rateLimit(`login:${ip}`, 8, 5 * 60_000)) return { ok: false, error: 'Too many attempts — wait a minute and try again.' };
  const session = await authenticate(email, password, role);
  await new Promise((r) => setTimeout(r, 120)); // dampen timing probes
  if (!session) return { ok: false, error: 'Invalid credentials.' };
  await loginAs(session);
  await track(role === 'admin' ? 'admin_login' : 'portal_login');
  redirect(role === 'admin' ? '/admin' : '/portal');
}

export async function logoutAction(role: Role) {
  await logout();
  redirect(role === 'admin' ? '/admin/login' : '/portal/login');
}

export async function requestPasswordReset(email: string): Promise<ActionResult> {
  const ip = await clientIp();
  if (!rateLimit(`reset:${ip}`, 4, 10 * 60_000)) return { ok: false, error: 'Too many reset requests — try again shortly.' };
  const clean = sanitize(email, 200);
  const user = await getUserByEmail(clean);
  // Always report success — never reveal which emails exist.
  if (user) {
    const token = await createResetToken(user.email);
    const base = process.env.BASE_URL || 'http://localhost:3000';
    await sendMail(user.email, 'Reset your password',
      `Hi ${user.name},\n\nUse this link to reset your password (valid for 1 hour):\n${base}/portal/reset?token=${token}\n\nIf you didn't request this, ignore this email.\n\n— Kiln Technology Studio`);
  }
  return { ok: true };
}

export async function resetPassword(token: string, password: string): Promise<ActionResult> {
  const clean = sanitize(token, 100);
  if (password.length < 8) return { ok: false, error: 'Password must be at least 8 characters.' };
  const email = await consumeResetToken(clean);
  if (!email) return { ok: false, error: 'This reset link is invalid or has expired. Request a new one.' };
  await updateUserPassword(email, hashPassword(password));
  return { ok: true };
}

// ================= ADMIN — LEADS =================

const LEAD_STATUS_SET: LeadStatus[] = ['new', 'contacted', 'qualified', 'discovery', 'proposal', 'negotiation', 'won', 'lost'];

export async function updateLeadStatusAction(id: string, status: string): Promise<ActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;
  if (!LEAD_STATUS_SET.includes(status as LeadStatus)) return { ok: false, error: 'Invalid status' };
  const leads = await listLeads();
  if (!leads.some((l) => l.id === id)) return { ok: false, error: 'Lead not found' };
  const admin = await requireAdmin();
  const lead = leads.find((l) => l.id === id);
  await updateLead(id, { status: status as LeadStatus });
  await audit(admin?.email || 'admin', 'lead.status_changed', lead ? lead.reference : id, lead?.status, status);
  return { ok: true };
}

export async function assignLeadOwnerAction(id: string, owner: string): Promise<ActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;
  await updateLead(id, { owner: sanitize(owner, 80) || 'Unassigned' }, `Assigned to ${sanitize(owner, 80) || 'Unassigned'}`);
  return { ok: true };
}

export async function saveLeadNoteAction(id: string, note: string): Promise<ActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;
  await updateLead(id, { notes: sanitize(note, 5000) });
  return { ok: true };
}

// ================= ADMIN — CLIENTS & PROJECTS =================

export async function createClientAction(input: { company: string; contactName: string; email: string; phone: string; country: string; currency: string; notes: string }): Promise<ActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;
  const company = sanitize(input.company, 160);
  if (!company) return { ok: false, error: 'Company name is required', errors: { company: 'Required' } };
  if (input.email && vEmail(input.email)) return { ok: false, error: 'Enter a valid email', errors: { email: 'Invalid email' } };
  const clients = await listClients();
  if (clients.some((c) => c.company.toLowerCase() === company.toLowerCase())) {
    return { ok: false, error: 'A client with this name already exists.' };
  }
  const client = await createClient({
    company, contactName: sanitize(input.contactName, 120), email: sanitize(input.email, 200),
    phone: sanitize(input.phone, 40), country: sanitize(input.country, 80),
    currency: ['USD', 'INR', 'EUR', 'GBP', 'AED'].includes(input.currency) ? input.currency : 'USD',
    notes: sanitize(input.notes, 2000),
  });
  const admin = await requireAdmin();
  await audit(admin?.email || 'admin', 'client.created', company);
  return { ok: true, id: client.id };
}

export async function updateClientAction(id: string, patch: { company?: string; contactName?: string; email?: string; phone?: string; country?: string; notes?: string; status?: string }): Promise<ActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;
  const clean: Record<string, string> = {};
  for (const key of ['company', 'contactName', 'email', 'phone', 'country', 'notes'] as const) {
    if (patch[key] !== undefined) clean[key] = sanitize(patch[key] as string, key === 'notes' ? 2000 : 200);
  }
  if (patch.status === 'archived' || patch.status === 'active') clean.status = patch.status;
  await updateClient(id, clean);
  return { ok: true };
}

export async function createProjectAction(input: { clientId: string; name: string; summary: string }): Promise<ActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;
  const name = sanitize(input.name, 160);
  if (!name) return { ok: false, error: 'Project name is required', errors: { name: 'Required' } };
  if (!(await listClients()).some((c) => c.id === input.clientId)) return { ok: false, error: 'Select a valid client' };
  const project = await createProject({ clientId: input.clientId, name, summary: sanitize(input.summary, 1000) });
  const admin = await requireAdmin();
  await audit(admin?.email || 'admin', 'project.created', name);
  return { ok: true, id: project.id };
}

export async function updateProjectAction(id: string, patch: { name?: string; summary?: string; status?: string; nextMilestone?: string; progress?: number; note?: string }): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return UNAUTHORIZED;
  const existing = await getProject(id);
  if (!existing) return { ok: false, error: 'Project not found' };
  if (patch.status !== undefined && !PROJECT_STATUSES.includes(patch.status as typeof PROJECT_STATUSES[number])) {
    return { ok: false, error: 'Unknown project status' };
  }
  if (patch.status && patch.status !== existing.status) {
    await audit(admin.email, 'project.status_changed', existing.name, friendlyProjectStatus(existing.status), friendlyProjectStatus(patch.status));
  }
  await updateProject(id, {
    ...(patch.name !== undefined ? { name: sanitize(patch.name, 160) } : {}),
    ...(patch.summary !== undefined ? { summary: sanitize(patch.summary, 1000) } : {}),
    ...(patch.status !== undefined ? { status: sanitize(patch.status, 40) } : {}),
    ...(patch.nextMilestone !== undefined ? { nextMilestone: sanitize(patch.nextMilestone, 120) } : {}),
    ...(patch.progress !== undefined ? { progress: Math.min(100, Math.max(0, Math.round(patch.progress))) } : {}),
    ...(patch.note !== undefined ? { latestUpdate: { at: new Date().toISOString(), note: sanitize(patch.note, 500) } } : {}),
  });
  if (patch.note) await notify('client', 'update', `Project update: ${sanitize(patch.note, 200)}`, `/portal/projects/${id}`);
  return { ok: true };
}

export async function upsertMilestoneAction(projectId: string, milestone: { id?: string; title: string; detail?: string; status?: MilestoneStatus; progress?: number; due?: string }): Promise<ActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;
  const title = sanitize(milestone.title, 120);
  if (!title) return { ok: false, error: 'Milestone title is required' };
  await upsertMilestone(projectId, {
    ...(milestone.id ? { id: milestone.id } : {}),
    title,
    detail: sanitize(milestone.detail || '', 500),
    status: (['upcoming', 'in_progress', 'blocked', 'complete'].includes(milestone.status || '') ? milestone.status : 'upcoming') as MilestoneStatus,
    progress: Math.min(100, Math.max(0, Number(milestone.progress) || 0)),
    due: sanitize(milestone.due || '', 30),
  });
  await notify('client', 'milestone', `Milestone “${title}” was updated.`, `/portal/milestones`);
  const admin2 = await requireAdmin();
  await audit(admin2?.email || 'admin', milestone.status === 'complete' ? 'milestone.completed' : 'milestone.updated', title);
  return { ok: true };
}

export async function sendStudioMessage(projectId: string, body: string): Promise<ActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;
  const clean = sanitize(body, 2000);
  if (clean.length < 2) return { ok: false, error: 'Message is empty' };
  await addProjectMessage(projectId, 'studio', 'Kiln Studio', clean);
  return { ok: true };
}

// ================= ADMIN — PROJECT OPERATIONS =================

export async function publishProjectUpdateAction(projectId: string, title: string, note: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return UNAUTHORIZED;
  const project = await getProject(projectId);
  if (!project) return { ok: false, error: 'Project not found' };
  const cleanTitle = sanitize(title, 120);
  const cleanNote = sanitize(note, 1500);
  if (!cleanTitle) return { ok: false, error: 'Give the update a short title' };
  if (cleanNote.length < 10) return { ok: false, error: 'Add a bit more detail' };
  const update: ProjectUpdate = { id: crypto.randomUUID(), at: new Date().toISOString(), title: cleanTitle, note: cleanNote };
  project.updates.unshift(update);
  await updateProject(projectId, { latestUpdate: { at: update.at, note: cleanNote } });
  await audit(admin.email, 'project.update_published', project.name, undefined, cleanTitle);
  await notify('client', 'update', `New update on ${project.name}: ${cleanTitle}`, `/portal/projects/${projectId}`);
  return { ok: true };
}

export async function setActionRequiredAction(projectId: string, text: string | null): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return UNAUTHORIZED;
  const project = await getProject(projectId);
  if (!project) return { ok: false, error: 'Project not found' };
  if (text) {
    const clean = sanitize(text, 300);
    if (!clean) return { ok: false, error: 'Describe what is needed' };
    project.actionRequired = { text: clean, at: new Date().toISOString() };
    await audit(admin.email, 'project.action_required_set', project.name, undefined, clean);
    await notify('client', 'update', `Action required on ${project.name}: ${clean}`, `/portal/projects/${projectId}`);
  } else {
    project.actionRequired = null;
    await audit(admin.email, 'project.action_required_cleared', project.name);
  }
  await persistProject(project);
  return { ok: true };
}

/** Persist a fully-loaded project object (updates/approvals/actionRequired live on the object). */
async function persistProject(project: import('./store').Project): Promise<void> {
  await saveProjectRecord(project);
}

export async function approveProjectAction(projectId: string, label: string, comment: string): Promise<ActionResult> {
  const session = await requireClient();
  if (!session) return UNAUTHORIZED;
  const project = await getProject(projectId);
  if (!project || (session.clientId && project.clientId !== session.clientId)) return UNAUTHORIZED;
  const cleanLabel = sanitize(label, 200);
  if (!cleanLabel) return { ok: false, error: 'Approval label is required' };
  const approval: Approval = { id: crypto.randomUUID(), kind: 'client-approval', label: cleanLabel, approvedBy: session.name || session.email, approvedAt: new Date().toISOString(), comment: sanitize(comment, 1000) };
  project.approvals.unshift(approval);
  if (project.actionRequired && project.actionRequired.text.toLowerCase().includes(cleanLabel.toLowerCase())) {
    project.actionRequired = null;
  }
  await persistProject(project);
  await audit(session.email || 'client', 'project.approved', `${project.name}: ${cleanLabel}`);
  await notify('admin', 'update', `${session.name || 'Client'} approved “${cleanLabel}” on ${project.name}`, `/admin/projects/${projectId}`);
  return { ok: true };
}

export async function inviteClientAction(clientId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return UNAUTHORIZED;
  const clients = await listClients();
  const client = clients.find((c) => c.id === clientId);
  if (!client || !client.email) return { ok: false, error: 'This client has no email on record' };
  const token = await createPortalInvite(client.email, client.contactName || client.company, clientId);
  if (!token) return { ok: false, error: 'Could not create invite' };
  const baseUrl = process.env.BASE_URL || '';
  await sendMail(client.email, 'Your project portal is ready',
    `Hi ${client.contactName || 'there'},\n\nYour client portal is ready. Set your password and sign in here:\n${baseUrl}/portal/reset?token=${token}\n\n— Kiln Technology Studio`);
  await audit(admin.email, 'client.invited', client.company);
  return { ok: true, token };
}

export async function archiveLeadAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return UNAUTHORIZED;
  const lead = (await listLeads()).find((l) => l.id === id);
  if (!lead) return { ok: false, error: 'Lead not found' };
  await updateLead(id, { archived: !lead.archived });
  await audit(admin.email, lead.archived ? 'lead.unarchived' : 'lead.archived', lead.reference);
  return { ok: true };
}

// ================= PORTAL =================

export async function sendPortalMessage(projectId: string, body: string): Promise<ActionResult> {
  const session = await requireClient();
  if (!session) return UNAUTHORIZED;
  const project = await getProject(projectId);
  // Authorization: clients may only message their own projects.
  if (!project || (session.clientId && project.clientId !== session.clientId)) return UNAUTHORIZED;
  const clean = sanitize(body, 2000);
  if (clean.length < 2) return { ok: false, error: 'Message is empty' };
  await addProjectMessage(projectId, 'client', session.name || 'Client', clean);
  return { ok: true };
}

export async function markProjectRead(projectId: string): Promise<ActionResult> {
  const session = await getCurrentSession();
  if (!session) return UNAUTHORIZED;
  const project = await getProject(projectId);
  if (!project) return { ok: false, error: 'Project not found' };
  if (session.role === 'client' && session.clientId && project.clientId !== session.clientId) return UNAUTHORIZED;
  await markProjectMessagesRead(projectId, session.role === 'admin' ? 'studio' : 'client');
  return { ok: true };
}

const UPLOAD_MIMES: Record<string, string> = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'text/csv': '.csv',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'text/plain': '.txt',
  'application/zip': '.zip',
};
const MAX_UPLOAD = 10 * 1024 * 1024;

export async function uploadProjectFile(formData: FormData): Promise<ActionResult> {
  const session = await getCurrentSession();
  if (!session || (session.role !== 'client' && session.role !== 'admin')) return UNAUTHORIZED;
  const ip = await clientIp();
  if (!rateLimit(`upload:${ip}`, 20, 10 * 60_000)) return { ok: false, error: 'Too many uploads right now.' };

  const projectId = sanitize(String(formData.get('projectId') || ''), 60);
  const project = await getProject(projectId);
  if (!project) return { ok: false, error: 'Project not found' };
  if (session.role === 'client' && session.clientId && project.clientId !== session.clientId) return UNAUTHORIZED;

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'Choose a file to upload.', errors: { file: 'Required' } };
  const ext = UPLOAD_MIMES[file.type];
  if (!ext) return { ok: false, error: 'File type not allowed. Use PDF, DOC(X), XLS(X), CSV, TXT, PNG, JPG, WEBP or ZIP.' };
  if (file.size > MAX_UPLOAD) return { ok: false, error: 'File must be under 10 MB.' };

  const safeBase = file.name.replace(/[^\w.\- ]+/g, '').slice(0, 80).trim().replace(/\s+/g, '-') || 'file';
  const key = `${projectId}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
  await writeUpload(key, Buffer.from(await file.arrayBuffer()));

  await addFile({ projectId, name: safeBase, key, mime: file.type, size: file.size, uploadedBy: session.role === 'admin' ? 'studio' : 'client' });
  return { ok: true };
}

export async function deleteProjectFileAction(fileId: string): Promise<ActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;
  const file = await getFile(fileId);
  if (!file) return { ok: false, error: 'File not found' };
  await removeUpload(file.key);
  await deleteFile(fileId);
  return { ok: true };
}

// ================= CAREERS =================

export async function submitApplication(formData: FormData): Promise<ActionResult> {
  const ip = await clientIp();
  if (!rateLimit(`apply:${ip}`, 5, 10 * 60_000)) return { ok: false, error: 'Too many applications right now — try again shortly.' };

  const errors: Record<string, string> = {};
  const name = sanitize(String(formData.get('name') || ''), 120);
  if (!name) errors.name = 'Your name is required';
  const email = sanitize(String(formData.get('email') || ''), 200);
  const emailErr = vRequiredEmail(email);
  if (emailErr) errors.email = emailErr;

  let resumeKey = '';
  const file = formData.get('resume');
  if (file instanceof File && file.size > 0) {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) errors.resume = 'Resume must be PDF or DOC/DOCX';
    else if (file.size > 5 * 1024 * 1024) errors.resume = 'Resume must be under 5 MB';
    else {
      const ext = file.type === 'application/pdf' ? '.pdf' : '.docx';
      const key = `resume-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
      await writeUpload(key, Buffer.from(await file.arrayBuffer()));
      resumeKey = key;
    }
  }
  if (Object.keys(errors).length) return { ok: false, error: 'Please review the highlighted fields.', errors };

  await createApplication({
    jobId: sanitize(String(formData.get('jobId') || ''), 80),
    name, email, resumeKey,
    portfolio: sanitize(String(formData.get('portfolio') || ''), 300),
    github: sanitize(String(formData.get('github') || ''), 300),
    linkedin: sanitize(String(formData.get('linkedin') || ''), 300),
    message: sanitize(String(formData.get('message') || ''), 3000),
  });
  await sendMail(email, 'We received your application', `Hi ${name},\n\nThanks for applying — we review every application and will reply either way.\n\n— Kiln Technology Studio`);
  return { ok: true };
}

// ================= CMS (admin) =================

type CmsKind = 'caseStudies' | 'posts' | 'testimonials' | 'team' | 'jobs';
const CMS_KINDS: CmsKind[] = ['caseStudies', 'posts', 'testimonials', 'team', 'jobs'];

export async function cmsSaveAction(kind: string, payload: Record<string, unknown>): Promise<ActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;
  if (!CMS_KINDS.includes(kind as CmsKind)) return { ok: false, error: 'Unknown content type' };
  const existing = payload.id ? await cmsGet(kind as CmsKind, String(payload.id)) : undefined;
  const record = {
    ...(existing || {}),
    ...payload,
    id: existing?.id || crypto.randomUUID(),
    status: ['draft', 'published', 'archived'].includes(String(payload.status)) ? (payload.status as CmsStatus) : 'draft',
  } as CmsRecord;
  await cmsSave(kind as CmsKind, record);
  return { ok: true, id: record.id };
}

export async function cmsStatusAction(kind: string, id: string, status: string): Promise<ActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;
  if (!['draft', 'published', 'archived'].includes(status)) return { ok: false, error: 'Invalid status' };
  const record = await cmsGet(kind as CmsKind, id);
  if (!record) return { ok: false, error: 'Content not found' };
  await cmsSave(kind as CmsKind, { ...record, status: status as CmsStatus });
  return { ok: true };
}

export async function cmsDeleteAction(kind: string, id: string): Promise<ActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;
  const record = await cmsGet(kind as CmsKind, id);
  if (!record) return { ok: false, error: 'Content not found' };
  await cmsDelete(kind as CmsKind, id);
  return { ok: true };
}

// ================= SETTINGS =================

export async function saveSettingsAction(patch: { contactEmail?: string; phone?: string; whatsapp?: string; hours?: string }): Promise<ActionResult> {
  if (!(await requireAdmin())) return UNAUTHORIZED;
  if (patch.contactEmail && vEmail(patch.contactEmail)) return { ok: false, error: 'Enter a valid contact email' };
  await saveSettings({
    contactEmail: patch.contactEmail !== undefined ? sanitize(patch.contactEmail, 200) : undefined,
    phone: patch.phone !== undefined ? sanitize(patch.phone, 40) : undefined,
    whatsapp: patch.whatsapp !== undefined ? sanitize(patch.whatsapp, 40) : undefined,
    hours: patch.hours !== undefined ? sanitize(patch.hours, 120) : undefined,
  });
  return { ok: true };
}

// ================= ANALYTICS =================

export async function trackAction(event: string) {
  const safe = sanitize(event, 60).replace(/[^a-z0-9_]/gi, '');
  if (safe) await track(safe);
}
