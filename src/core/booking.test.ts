import { describe, expect, it } from 'vitest';
import { createBooking, isValidEmail, seatsLeft } from './booking';
import type { Booking, ScheduleItem } from './types';

const session: ScheduleItem = {
  id: 'sch1',
  dayOfWeek: 1,
  className: 'Spinning',
  time: '08:00',
  instructor: 'María',
  duration: 45,
  capacity: 2,
};

const existing: Booking[] = [
  { id: 'b1', sessionId: 'sch1', className: 'Spinning', time: '08:00', name: 'Ana', email: 'ana@x.com', createdAt: '' },
];

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('ana@x.com')).toBe(true);
  });
  it('rejects invalid emails', () => {
    expect(isValidEmail('no-at-sign')).toBe(false);
    expect(isValidEmail('a@b')).toBe(false);
  });
});

describe('seatsLeft', () => {
  it('subtracts existing bookings from capacity', () => {
    expect(seatsLeft(session, existing)).toBe(1);
  });
  it('never goes below zero', () => {
    const full: Booking[] = [
      ...existing,
      { id: 'b2', sessionId: 'sch1', className: 'Spinning', time: '08:00', name: 'Bo', email: 'bo@x.com', createdAt: '' },
      { id: 'b3', sessionId: 'sch1', className: 'Spinning', time: '08:00', name: 'Cy', email: 'cy@x.com', createdAt: '' },
    ];
    expect(seatsLeft(session, full)).toBe(0);
  });
});

describe('createBooking', () => {
  it('creates a booking with normalized email', () => {
    const r = createBooking(session, [], { name: 'Luis', email: '  Luis@X.COM ' });
    expect(r.ok).toBe(true);
    expect(r.booking!.email).toBe('luis@x.com');
    expect(r.booking!.className).toBe('Spinning');
  });

  it('rejects when the session is full', () => {
    const full: Booking[] = [
      ...existing,
      { id: 'b2', sessionId: 'sch1', className: 'Spinning', time: '08:00', name: 'Bo', email: 'bo@x.com', createdAt: '' },
    ];
    const r = createBooking(session, full, { name: 'Luis', email: 'luis@x.com' });
    expect(r.ok).toBe(false);
    expect(r.error).toBe('full');
  });

  it('rejects duplicate emails for the same session', () => {
    const r = createBooking(session, existing, { name: 'Ana', email: 'ana@x.com' });
    expect(r.error).toBe('duplicate');
  });

  it('rejects invalid input', () => {
    expect(createBooking(session, [], { name: 'A', email: 'a@x.com' }).error).toBe('invalid_input');
    expect(createBooking(session, [], { name: 'Ana', email: 'bad' }).error).toBe('invalid_input');
  });

  it('rejects unknown sessions', () => {
    expect(createBooking(undefined, [], { name: 'Ana', email: 'ana@x.com' }).error).toBe(
      'session_not_found',
    );
  });
});
