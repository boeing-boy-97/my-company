import { NextResponse } from 'next/server';
import { apiErr, apiSession } from '@/lib/api';
import { getFile, getProject, readUpload } from '@/lib/store';

/**
 * Authorized file download. Session required; clients may only
 * download files belonging to their own projects.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await apiSession();
  if (!session) return apiErr('Unauthorized.', 401);

  const { id } = await params;
  const file = await getFile(id);
  if (!file) return apiErr('File not found.', 404);

  const project = await getProject(file.projectId);
  if (!project) return apiErr('File not found.', 404);
  if (session.role === 'client' && session.clientId && project.clientId !== session.clientId) {
    return apiErr('File not found.', 404);
  }

  // Key is server-generated; readUpload re-validates and serves from disk or memory.
  const buffer = await readUpload(file.key);
  if (!buffer) return apiErr('File not found.', 404);
  return new NextResponse(Buffer.from(buffer), {
    headers: {
      'Content-Type': file.mime || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(file.name)}"`,
      'Content-Length': String(buffer.byteLength),
      'Cache-Control': 'private, no-store',
    },
  });
}
