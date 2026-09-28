import { z } from 'zod';
import { apiOk, apiErr, clientIp } from '@/lib/api';
import { rateLimit } from '@/lib/rate-limit';
import { authenticate, loginAs } from '@/lib/auth';

const LoginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
  role: z.enum(['admin', 'client']).optional(),
});

export async function POST(request: Request) {
  const ip = await clientIp();
  if (!rateLimit(`api-login:${ip}`, 8, 5 * 60_000)) return apiErr('Too many attempts — wait a minute and try again.', 429);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiErr('Invalid JSON body.', 400);
  }
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) return apiErr(parsed.error.issues[0].message, 422);

  const session = await authenticate(parsed.data.email, parsed.data.password, parsed.data.role);
  if (!session) return apiErr('Invalid credentials.', 401);
  await loginAs(session);
  return apiOk({ role: session.role, email: session.email, name: session.name });
}
