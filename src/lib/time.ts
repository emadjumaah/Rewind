// Shared time math. Previously each component rolled its own date arithmetic.
import {
  endOfDay, endOfYear, differenceInWeeks, isWeekend,
  startOfWeek, endOfWeek, startOfMonth, endOfMonth, differenceInCalendarDays,
} from 'date-fns'

const DAY_MS = 86_400_000
const HOUR_MS = 3_600_000

export const clamp01 = (x: number): number => Math.max(0, Math.min(1, x))

/** Hours from `now` until `date` (negative if past). */
export const hoursUntil = (date: Date, now: Date): number =>
  (date.getTime() - now.getTime()) / HOUR_MS

/** Milliseconds left until midnight tonight. */
export const msLeftToday = (now: Date): number => endOfDay(now).getTime() - now.getTime()

/** Fraction of today still ahead: 1.0 at midnight start, 0.0 at next midnight. */
export function dayRemaining(now: Date): number {
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  return clamp01((start.getTime() + DAY_MS - now.getTime()) / DAY_MS)
}

/** Fraction of the current year already elapsed (0..1). */
export function yearElapsed(now: Date): number {
  const start = new Date(now.getFullYear(), 0, 1)
  const end = endOfYear(now)
  return clamp01((now.getTime() - start.getTime()) / (end.getTime() - start.getTime()))
}

/** Fraction of [start, end] still ahead of `now` (1.0 at start, 0.0 at end). */
function fractionLeft(now: Date, start: Date, end: Date): number {
  return clamp01((end.getTime() - now.getTime()) / (end.getTime() - start.getTime()))
}

/** Fraction of the current week / month / year still ahead. */
export const weekRemaining = (now: Date): number => fractionLeft(now, startOfWeek(now), endOfWeek(now))
export const monthRemaining = (now: Date): number => fractionLeft(now, startOfMonth(now), endOfMonth(now))
export const yearRemaining = (now: Date): number => 1 - yearElapsed(now)

/** Whole calendar days left in the current week / month / year. */
export const daysLeftInWeek = (now: Date): number => differenceInCalendarDays(endOfWeek(now), now)
export const daysLeftInMonth = (now: Date): number => differenceInCalendarDays(endOfMonth(now), now)
export const daysLeftInYear = (now: Date): number => differenceInCalendarDays(endOfYear(now), now)

/** Weekends (Sat/Sun pairs, counted by weeks) left before year end. */
export function weekendsLeftInYear(now: Date): number {
  const end = endOfYear(now)
  return differenceInWeeks(end, now) + (isWeekend(end) ? 1 : 0)
}

/** Rough remaining 9–17 work hours left this week (Mon–Fri, ends 17:00). */
export function workHoursLeftThisWeek(now: Date): number {
  const dow = now.getDay()
  const isWorkday = dow >= 1 && dow <= 5
  const minsToday = now.getHours() * 60 + now.getMinutes()
  const todayLeft = isWorkday ? Math.max(0, (17 * 60 - minsToday) / 60) : 0
  const fullDaysAfter = isWorkday ? Math.max(0, 5 - dow) : 0
  return Math.round(fullDaysAfter * 8 + todayLeft)
}

/** Split milliseconds into h/m/s components. */
export function hms(ms: number): { hours: number; minutes: number; seconds: number } {
  return {
    hours: Math.floor(ms / HOUR_MS),
    minutes: Math.floor((ms % HOUR_MS) / 60_000),
    seconds: Math.floor((ms % 60_000) / 1_000),
  }
}
