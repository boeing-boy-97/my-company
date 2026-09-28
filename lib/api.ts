import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getCurrentSession } from './auth';
import type { Session } from './store';

/** Consistent JSON envelope for every API route. */
export const apiOk = (data: unknown, status = 200) => NextResponse.json({ ok: true, data }, { status });
export const apiErr = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

export async function apiSession(): Promise<Session | null> {
  return getCurrentSession();
}

export async function apiAdmin(): Promise<Session | null> {
  const session = await getCurrentSession();
  return session?.role === 'admin' ? session : null;
}

/** Client session that owns the given project — null when unauthorized. */
export function clientOwning(session: Session | null, clientId: string): boolean {
  return !!session && session.role === 'client' && (!session.clientId || session.clientId === clientId);
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0] || 'local';
}
