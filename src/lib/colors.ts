// Single source of truth for accent colors. Previously duplicated across
// ReverseClock, Settings, ContextSentence and TimeLeftDisplay.

export type AccentColor = 'cyan' | 'purple' | 'amber' | 'red'

export const ACCENT_HEX: Record<AccentColor, string> = {
  cyan: '#2dd4bf', // teal
  purple: '#8b5cf6', // violet
  amber: '#f59e0b', // amber
  red: '#f43f5e', // rose
}

export const ACCENT_ORDER: AccentColor[] = ['cyan', 'purple', 'amber', 'red']

export const accentHex = (c: AccentColor | string): string =>
  ACCENT_HEX[c as AccentColor] ?? ACCENT_HEX.cyan
