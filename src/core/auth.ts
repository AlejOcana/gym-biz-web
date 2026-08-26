/** Demo admin auth — client-side only, for the case study. */
import type { AdminSession } from './types';

const ADMIN_EMAIL = 'admin@fitzone.es';
const ADMIN_PASSWORD = 'fitzone2024';

export function login(email: string, password: string): AdminSession | null {
  const e = email.trim().toLowerCase();
  if (e !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) return null;
  return { email: ADMIN_EMAIL, loggedInAt: new Date().toISOString() };
}

export function isValidSession(session: AdminSession | null | undefined): boolean {
  return !!session && session.email === ADMIN_EMAIL;
}

export const DEMO_CREDENTIALS = { email: ADMIN_EMAIL, password: ADMIN_PASSWORD };
