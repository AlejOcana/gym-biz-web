/** Booking logic — pure functions, unit-testable. */
import type { Booking, ScheduleItem } from './types';

export interface BookingInput {
  name: string;
  email: string;
}

export type BookingError = 'session_not_found' | 'full' | 'duplicate' | 'invalid_input';

export interface BookingResult {
  ok: boolean;
  error?: BookingError;
  booking?: Booking;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function bookingsForSession(bookings: Booking[], sessionId: string): Booking[] {
  return bookings.filter((b) => b.sessionId === sessionId);
}

export function seatsLeft(session: ScheduleItem, bookings: Booking[]): number {
  const taken = bookingsForSession(bookings, session.id).length;
  return Math.max(session.capacity - taken, 0);
}

/** Validates and creates a booking. Pure: returns a new booking or an error code. */
export function createBooking(
  session: ScheduleItem | undefined,
  bookings: Booking[],
  input: BookingInput,
  now = new Date(),
): BookingResult {
  if (!session) return { ok: false, error: 'session_not_found' };
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (name.length < 2 || !isValidEmail(email)) return { ok: false, error: 'invalid_input' };
  if (bookingsForSession(bookings, session.id).some((b) => b.email === email)) {
    return { ok: false, error: 'duplicate' };
  }
  if (seatsLeft(session, bookings) <= 0) return { ok: false, error: 'full' };

  return {
    ok: true,
    booking: {
      id: `bk_${now.getTime().toString(36)}`,
      sessionId: session.id,
      className: session.className,
      time: session.time,
      name,
      email,
      createdAt: now.toISOString(),
    },
  };
}

export const BOOKING_ERRORS: Record<BookingError, string> = {
  session_not_found: 'La clase ya no existe.',
  full: 'Lo sentimos, la clase está completa.',
  duplicate: 'Ya tienes una reserva para esta clase con ese email.',
  invalid_input: 'Introduce tu nombre y un email válido.',
};
