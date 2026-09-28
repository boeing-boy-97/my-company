import { apiOk, apiErr, clientIp } from '@/lib/api';
import { rateLimit } from '@/lib/rate-limit';
import { createApplication, ensureUploadDir, uploadsDir, sendMail } from '@/lib/store';
import { sanitize } from '@/lib/validate';
import { writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(request: Request) {
  const ip = await clientIp();
  if (!rateLimit(`api-apply:${ip}`, 5, 10 * 60_000)) return apiErr('Rate limit exceeded. Try again shortly.', 429);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return apiErr('Expected multipart/form-data.', 400);
  }

  const name = sanitize(String(form.get('name') || ''), 120);
  const email = sanitize(String(form.get('email') || ''), 200);
  if (!name) return apiErr('name: required', 422);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return apiErr('email: valid email required', 422);

  let resumeKey = '';
  const file = form.get('resume');
  if (file instanceof File && file.size > 0) {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) return apiErr('resume: must be PDF or DOC/DOCX', 422);
    if (file.size > 5 * 1024 * 1024) return apiErr('resume: must be under 5 MB', 413);
    await ensureUploadDir();
    const ext = file.type === 'application/pdf' ? '.pdf' : '.docx';
    const key = `resume-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
    await writeFile(path.join(uploadsDir, key), Buffer.from(await file.arrayBuffer()));
    resumeKey = key;
  }

  const entry = await createApplication({
    jobId: sanitize(String(form.get('jobId') || ''), 80),
    name, email, resumeKey,
    portfolio: sanitize(String(form.get('portfolio') || ''), 300),
    github: sanitize(String(form.get('github') || ''), 300),
    linkedin: sanitize(String(form.get('linkedin') || ''), 300),
    message: sanitize(String(form.get('message') || ''), 3000),
  });
  await sendMail(email, 'We received your application', `Hi ${name},\n\nThanks for applying — we review every application and will reply either way.\n\n— Kiln Technology Studio`);

  return apiOk({ received: true, id: entry.id }, 201);
}
