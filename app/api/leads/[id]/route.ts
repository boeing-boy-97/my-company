import { z } from 'zod';
import { apiOk, apiErr, apiAdmin } from '@/lib/api';
import { getLead, updateLead, LEAD_STATUSES, type LeadStatus } from '@/lib/store';

const PatchSchema = z.object({
  status: z.enum(LEAD_STATUSES as [string, ...string[]]).optional(),
  notes: z.string().max(5000).optional(),
  owner: z.string().max(80).optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await apiAdmin())) return apiErr('Unauthorized.', 401);
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) return apiErr('Lead not found.', 404);
  return apiOk(lead);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await apiAdmin())) return apiErr('Unauthorized.', 401);
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) return apiErr('Lead not found.', 404);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiErr('Invalid JSON body.', 400);
  }
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return apiErr(parsed.error.issues[0].message, 422);

  const updated = await updateLead(id, { ...parsed.data, status: parsed.data.status as LeadStatus | undefined });
  return apiOk(updated);
}
