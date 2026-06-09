// Single source of truth for deadline urgency. Previously the thresholds and
// colors were re-implemented in DeadlineCards, ReverseClock and TimeAnalytics.

export type Urgency = 'overdue' | 'critical' | 'high' | 'normal'

/** Urgency bucket from hours remaining (negative = overdue). */
export function urgencyOf(hoursLeft: number): Urgency {
  if (hoursLeft < 0) return 'overdue'
  if (hoursLeft < 24) return 'critical'
  if (hoursLeft < 72) return 'high'
  return 'normal'
}

export const URGENCY_HEX: Record<Urgency, string> = {
  overdue: '#dc2626',
  critical: '#ef4444',
  high: '#f59e0b',
  normal: '#3b82f6',
}

export const urgencyColor = (hoursLeft: number): string => URGENCY_HEX[urgencyOf(hoursLeft)]

/** Tailwind border/background classes for a deadline card by urgency. */
export function urgencyCardClasses(hoursLeft: number): string {
  switch (urgencyOf(hoursLeft)) {
    case 'overdue':
      return 'border-2 border-red-700/70 shadow-md shadow-red-700/20 bg-gradient-to-br from-red-900/25 to-red-950/10'
    case 'critical':
      return 'border-2 border-red-500/60 shadow-md shadow-red-500/20 bg-gradient-to-br from-red-500/15 to-red-900/5'
    case 'high':
      return 'border-2 border-amber-500/50 shadow-md shadow-amber-500/15 bg-gradient-to-br from-amber-500/10 to-amber-900/5'
    default:
      return 'border border-blue-500/40 shadow-sm shadow-blue-500/10 bg-gradient-to-br from-blue-500/5 to-blue-900/5'
  }
}
