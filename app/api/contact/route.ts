import { z } from 'zod';
import { apiOk, apiErr, clientIp } from '@/lib/api';
import { rateLimit } from '@/lib/rate-limit';
import { createContact, sendMail } from '@/lib/store';
import { sanitize, honeypotTriggered } from '@/lib/validate';
import { track } from '@/lib/analytics';

const ContactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  topic: z.string().max(80).default('General'),
  message: z.string().min(10).max(4000),
  company: z.string().max(160).default(''),
  website: z.string().max(300).default(''),
  budget: z.string().max(40).default(''),
  timeline: z.string().max(40).default(''),
  context: z.string().max(400).default(''),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiErr('Invalid JSON body.', 400);
  }

  // Honeypot before rate limiting: bots never consume honest visitors' budget.
  if (honeypotTriggered((body as Record<string, unknown>)?.website_hp)) {
    await track('spam_blocked', { form: 'api-contact' });
    return apiOk({ received: true, spam: true }, 200);
  }

  const ip = await clientIp();
  if (!rateLimit(`api-contact:${ip}`, 8, 10 * 60_000)) return apiErr('Rate limit exceeded. Try again shortly.', 429);


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
    company: sanitize(parsed.data.company, 160),
    website: sanitize(parsed.data.website, 300),
    budget: sanitize(parsed.data.budget, 40),
    timeline: sanitize(parsed.data.timeline, 40),
    context: sanitize(parsed.data.context, 400),
  });
  await sendMail(entry.email, 'We received your message', `Hi ${entry.name},\n\nThanks for reaching out — we'll get back to you within one business day.\n\n— Kiln Technology Studio`);

  return apiOk({ received: true, id: entry.id }, 201);
}
