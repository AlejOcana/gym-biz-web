import { describe, expect, it } from 'vitest';
import { annualPrice } from './types';
import { login, isValidSession } from './auth';

describe('annualPrice', () => {
  it('charges 10 months instead of 12', () => {
    expect(annualPrice(49)).toBe(490);
    expect(annualPrice(29)).toBe(290);
  });
});

describe('login (demo auth)', () => {
  it('accepts the demo credentials', () => {
    const s = login('admin@fitzone.es', 'fitzone2024');
    expect(s).not.toBeNull();
    expect(s!.email).toBe('admin@fitzone.es');
  });

  it('is case-insensitive on email, exact on password', () => {
    expect(login('ADMIN@FITZONE.ES', 'fitzone2024')).not.toBeNull();
    expect(login('admin@fitzone.es', 'wrong')).toBeNull();
  });

  it('validates sessions by email', () => {
    expect(isValidSession({ email: 'admin@fitzone.es', loggedInAt: '' })).toBe(true);
    expect(isValidSession({ email: 'intruder@x.com', loggedInAt: '' })).toBe(false);
    expect(isValidSession(null)).toBe(false);
  });
});
