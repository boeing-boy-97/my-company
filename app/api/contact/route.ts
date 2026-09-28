import { z } from 'zod';
import { apiOk, apiErr, clientIp } from '@/lib/api';
import { rateLimit } from '@/lib/rate-limit';
import { createContact, sendMail } from '@/lib/store';
import { sanitize } from '@/lib/validate';

const ContactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  topic: z.string().max(80).default('General'),
  message: z.string().min(10).max(4000),
});

export async function POST(request: Request) {
  const ip = await clientIp();
  if (!rateLimit(`api-contact:${ip}`, 8, 10 * 60_000)) return apiErr('Rate limit exceeded. Try again shortly.', 429);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiErr('Invalid JSON body.', 400);
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return apiErr(`${first.path.join('.') || 'request'}: ${first.message}`, 422);
  }

  const entry = await createContact({
    name: sanitize(parsed.data.name, 120),
    email: sanitize(parsed.data.email, 200),
    topic: sanitize(parsed.data.topic, 80),
    message: sanitize(parsed.data.message, 4000),
  });
  await sendMail(entry.email, 'We received your message', `Hi ${entry.name},\n\nThanks for reaching out — we'll get back to you within one business day.\n\n— Kiln Technology Studio`);

  return apiOk({ received: true, id: entry.id }, 201);
}
