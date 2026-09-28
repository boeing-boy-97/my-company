import { apiOk } from '@/lib/api';

export async function GET() {
  return apiOk({ status: 'healthy', time: new Date().toISOString() });
}
