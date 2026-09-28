import { z } from 'zod';
import { apiOk, apiErr, apiAdmin } from '@/lib/api';
import { listProjects, createProject, listClients } from '@/lib/store';

const CreateSchema = z.object({
  clientId: z.string().min(1).max(80),
  name: z.string().min(2).max(160),
  summary: z.string().max(1000).default(''),
});

export async function GET() {
  if (!(await apiAdmin())) return apiErr('Unauthorized.', 401);
  const projects = await listProjects();
  return apiOk(projects.map((p) => ({ id: p.id, clientId: p.clientId, name: p.name, status: p.status, progress: p.progress, nextMilestone: p.nextMilestone, createdAt: p.createdAt })));
}

export async function POST(request: Request) {
  if (!(await apiAdmin())) return apiErr('Unauthorized.', 401);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiErr('Invalid JSON body.', 400);
  }
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) return apiErr(parsed.error.issues[0].message, 422);

  const clients = await listClients();
  if (!clients.some((c) => c.id === parsed.data.clientId)) return apiErr('Client not found.', 404);

  const project = await createProject(parsed.data);
  return apiOk({ id: project.id, name: project.name, status: project.status, createdAt: project.createdAt }, 201);
}
