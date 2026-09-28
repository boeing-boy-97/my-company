import { z } from 'zod';
import { apiOk, apiErr, apiSession } from '@/lib/api';
import { getProject, getProjectMessages, addProjectMessage } from '@/lib/store';

const MessageSchema = z.object({
  body: z.string().min(2).max(2000),
});

async function authorize(projectId: string) {
  const session = await apiSession();
  if (!session) return { error: apiErr('Unauthorized.', 401) };
  const project = await getProject(projectId);
  if (!project) return { error: apiErr('Project not found.', 404) };
  // Server-side ownership: clients may only access their own projects.
  if (session.role === 'client' && session.clientId && project.clientId !== session.clientId) {
    return { error: apiErr('Project not found.', 404) };
  }
  return { session, project };
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorize((await params).id);
  if ('error' in auth) return auth.error;
  const messages = await getProjectMessages(auth.project.id);
  return apiOk(messages.map((m) => ({ id: m.id, authorRole: m.authorRole, authorName: m.authorName, body: m.body, createdAt: m.createdAt, readAt: m.readAt || null })));
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorize((await params).id);
  if ('error' in auth) return auth.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiErr('Invalid JSON body.', 400);
  }
  const parsed = MessageSchema.safeParse(body);
  if (!parsed.success) return apiErr(parsed.error.issues[0].message, 422);

  const role = auth.session.role === 'admin' ? 'studio' : 'client';
  await addProjectMessage(auth.project.id, role, auth.session.name || (role === 'studio' ? 'Studio' : 'Client'), parsed.data.body);
  return apiOk({ delivered: true }, 201);
}
