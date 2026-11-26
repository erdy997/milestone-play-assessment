import { AGE_BANDS } from '../data/demoQuestionBank';
import type { AgeBand } from '../types';

export interface AgeResult {
  totalMonths: number; // completed months
  years: number;
  months: number; // remainder months
  days: number; // remainder days
  totalDays: number;
}

/** Parse yyyy-mm-dd as a local calendar date (no timezone shift). */
export function parseISODate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const y = +m[1], mo = +m[2], d = +m[3];
  const dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  return dt;
}

export function todayISO(now = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

function daysInMonth(y: number, m0: number) {
  return new Date(y, m0 + 1, 0).getDate();
}

/**
 * Chronological age in completed years / months / days (calendar method).
 * A month is completed when the day-of-month is reached; if the birth day does not exist
 * in the current month (e.g. born on the 31st), the last day of the month counts.
 */
export function calculateAge(dobISO: string, onISO: string): AgeResult | null {
  const dob = parseISODate(dobISO);
  const on = parseISODate(onISO);
  if (!dob || !on || dob > on) return null;
  let months = (on.getFullYear() - dob.getFullYear()) * 12 + (on.getMonth() - dob.getMonth());
  const effectiveBirthDay = Math.min(dob.getDate(), daysInMonth(on.getFullYear(), on.getMonth()));
  if (on.getDate() < effectiveBirthDay) months -= 1;
  // Days since the last "monthiversary"
  const anchorY = dob.getFullYear() + Math.floor((dob.getMonth() + months) / 12);
  const anchorM = (dob.getMonth() + months) % 12;
  const anchor = new Date(anchorY, anchorM, Math.min(dob.getDate(), daysInMonth(anchorY, anchorM)));
  const MS = 86400000;
  const days = Math.round((on.getTime() - anchor.getTime()) / MS);
  const totalDays = Math.round((on.getTime() - dob.getTime()) / MS);
  return { totalMonths: months, years: Math.floor(months / 12), months: months % 12, days, totalDays };
}

export function bandForMonths(m: number): AgeBand | null {
  return AGE_BANDS.find((b) => m >= b.minMonths && m <= b.maxMonths) ?? null;
}

export const MAX_MONTHS = 72;
