import { cookies } from 'next/headers';
import { createSession, destroySession, getSession, getUserByEmail, verifyPassword, type Session, type Role } from './store';

export const SESSION_COOKIE = 'kiln_session';

export async function getCurrentSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getSession(token);
}

/** Authenticate against stored users (hashed passwords). */
export async function authenticate(email: string, password: string, role?: Role): Promise<Session | null> {
  const user = await getUserByEmail(email.trim());
  if (!user) return null;
  if (role && user.role !== role) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  return createSession(user.role, user.email, user.name, user.clientId);
}

export async function loginAs(session: Session) {
  const store = await cookies();
  store.set(SESSION_COOKIE, session.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 12 * 3600,
  });
  return session;
}

export async function logout() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await destroySession(token);
  store.delete(SESSION_COOKIE);
}

export function credentialsFor(role: 'admin' | 'client') {
  return role === 'admin'
    ? { email: process.env.ADMIN_EMAIL || 'admin@kiln.studio', password: process.env.ADMIN_PASSWORD || 'admin2026' }
    : { email: process.env.PORTAL_EMAIL || 'client@demo.kiln.studio', password: process.env.PORTAL_PASSWORD || 'demo2026' };
}
