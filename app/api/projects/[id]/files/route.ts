import { apiOk, apiErr, apiSession, clientIp } from '@/lib/api';
import { rateLimit } from '@/lib/rate-limit';
import { getProject, listFiles, addFile, writeUpload } from '@/lib/store';
import crypto from 'crypto';

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

async function authorize(projectId: string) {
  const session = await apiSession();
  if (!session) return { error: apiErr('Unauthorized.', 401) };
  const project = await getProject(projectId);
  if (!project) return { error: apiErr('Project not found.', 404) };
  if (session.role === 'client' && session.clientId && project.clientId !== session.clientId) {
    return { error: apiErr('Project not found.', 404) };
  }
  return { session, project };
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorize((await params).id);
  if ('error' in auth) return auth.error;
  const files = await listFiles(auth.project.id);
  return apiOk(files.map((f) => ({ id: f.id, name: f.name, mime: f.mime, size: f.size, uploadedBy: f.uploadedBy, createdAt: f.createdAt, downloadUrl: `/api/files/${f.id}` })));
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorize((await params).id);
  if ('error' in auth) return auth.error;

  const ip = await clientIp();
  if (!rateLimit(`api-upload:${ip}`, 20, 10 * 60_000)) return apiErr('Rate limit exceeded.', 429);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return apiErr('Expected multipart/form-data with a "file" field.', 400);
  }

  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) return apiErr('Missing file.', 422);
  const ext = UPLOAD_MIMES[file.type];
  if (!ext) return apiErr('File type not allowed.', 422);
  if (file.size > MAX_UPLOAD) return apiErr('File exceeds the 10 MB limit.', 413);

  const safeBase = file.name.replace(/[^\w.\- ]+/g, '').slice(0, 80).trim().replace(/\s+/g, '-') || 'file';
  const key = `${auth.project.id}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
  await writeUpload(key, Buffer.from(await file.arrayBuffer()));

  const record = await addFile({
    projectId: auth.project.id, name: safeBase, key, mime: file.type, size: file.size,
    uploadedBy: auth.session.role === 'admin' ? 'studio' : 'client',
  });
  return apiOk({ id: record.id, name: record.name, size: record.size, downloadUrl: `/api/files/${record.id}` }, 201);
}
