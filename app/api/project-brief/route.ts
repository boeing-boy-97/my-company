import { apiOk, apiErr, clientIp } from '@/lib/api';
import { rateLimit } from '@/lib/rate-limit';
import { createLead, sendMail, findRecentDuplicateBrief } from '@/lib/store';
import { makeRef } from '@/lib/utils';
import { sanitize, honeypotTriggered } from '@/lib/validate';
import { track } from '@/lib/analytics';
import { LeadSchema } from '@/lib/leadSchema';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiErr('Invalid JSON body.', 400);
  }

  // Honeypot before rate limiting: bots never consume honest visitors' budget.
  if (honeypotTriggered((body as Record<string, unknown>)?.website_hp)) {
    await track('spam_blocked', { form: 'api-project-brief' });
    return apiOk({ received: true, spam: true }, 200);
  }

  const ip = await clientIp();
  if (!rateLimit(`api-brief:${ip}`, 6, 10 * 60_000)) return apiErr('Rate limit exceeded. Try again shortly.', 429);


  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return apiErr(`${first.path.join('.') || 'request'}: ${first.message}`, 422);
  }

  const data = parsed.data;

  // Duplicate detection: same email + same objective within 10 minutes → return existing reference.
  const dup = await findRecentDuplicateBrief(data.email, data.objective);
  if (dup) return apiOk({ id: dup.id, reference: dup.reference, status: dup.status, createdAt: dup.createdAt, duplicate: true }, 200);

  const reference = makeRef();
  const lead = await createLead({
    reference,
    source: 'api',
    kind: 'project-brief',
    projectTypes: data.projectTypes.map((t) => sanitize(t, 80)),
    objective: sanitize(data.objective, 3000),
    existingAssets: data.existingAssets.map((a) => sanitize(a, 80)),
    currentTech: sanitize(data.currentTech, 2000),
    users: sanitize(data.users, 1200),
    success: sanitize(data.success, 1200),
    timeline: sanitize(data.timeline, 40),
    budgetRange: sanitize(data.budgetRange, 40),
    currency: data.currency,
    companyName: sanitize(data.companyName, 160),
    website: sanitize(data.website, 300),
    industry: sanitize(data.industry, 80),
    country: sanitize(data.country, 80),
    contactName: sanitize(data.contactName, 120),
    email: sanitize(data.email, 200),
    phone: sanitize(data.phone, 40),
    whatsapp: sanitize(data.whatsapp, 40),
    preferredChannel: sanitize(data.preferredChannel, 40),
    sourceUrl: sanitize(data.sourceUrl || '', 500),
    utm: {
      source: sanitize(data.utm?.source || '', 100),
      medium: sanitize(data.utm?.medium || '', 100),
      campaign: sanitize(data.utm?.campaign || '', 100),
    },
  });

  await sendMail(lead.email, `We received your project brief (${reference})`,
    `Hi ${lead.contactName},\n\nThanks for sending this over — your project brief is with our team.\nReference: ${reference}\n\nWe'll reply within one business day.\n\n— Kiln Technology Studio`);

  return apiOk({ id: lead.id, reference, status: lead.status, createdAt: lead.createdAt }, 201);
}
