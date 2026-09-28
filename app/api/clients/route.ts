import { z } from 'zod';
import { apiOk, apiErr, apiAdmin } from '@/lib/api';
import { listClients, createClient } from '@/lib/store';
import { sanitize } from '@/lib/validate';

const CreateSchema = z.object({
  company: z.string().min(2).max(160),
  contactName: z.string().max(120).default(''),
  email: z.string().email().max(200).or(z.literal('')).default(''),
  phone: z.string().max(40).default(''),
  country: z.string().max(80).default(''),
  currency: z.enum(['USD', 'INR', 'EUR', 'GBP', 'AED']).default('USD'),
  notes: z.string().max(2000).default(''),
});

export async function GET() {
  if (!(await apiAdmin())) return apiErr('Unauthorized.', 401);
  const clients = await listClients();
  return apiOk(clients.map((c) => ({ id: c.id, company: c.company, contactName: c.contactName, email: c.email, country: c.country, currency: c.currency, createdAt: c.createdAt })));
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

  const d = parsed.data;
  const existing = await listClients();
  if (existing.some((c) => c.company.toLowerCase() === d.company.toLowerCase())) {
    return apiErr('A client with this name already exists.', 409);
  }

  const client = await createClient({
    company: sanitize(d.company, 160),
    contactName: sanitize(d.contactName, 120),
    email: sanitize(d.email, 200),
    phone: sanitize(d.phone, 40),
    country: sanitize(d.country, 80),
    currency: d.currency,
    notes: sanitize(d.notes, 2000),
  });
  return apiOk({ id: client.id, company: client.company }, 201);
}
