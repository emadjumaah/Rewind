import { useStore } from '../store'
import { accentHex } from '../lib/colors'

/**
 * The Rewind mark: a clock face with the day draining out of it — a depleting
 * accent ring sweeping counter-clockwise from 12, a sand-glass fill in the
 * lower half, and reversed hands. Same visual language as ReverseClock and the
 * draining favicon, scaled down to a glyph. Follows the chosen accent + theme.
 */
export default function Logo({ size = 28 }: { size?: number }) {
  const { settings } = useStore()
  const isDark = settings.darkMode
  const accent = accentHex(settings.accentColor)

  const track = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'
  const rim = isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.16)'
  const handMaj = isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)'
  const handMin = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)'
  const cap = isDark ? '#030712' : '#f5f5f0'

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <clipPath id="logoSand"><circle cx="50" cy="50" r="36" /></clipPath>
      </defs>

      {/* Sand-glass day fill */}
      <g clipPath="url(#logoSand)">
        <rect x="14" y="41.36" width="72" height="45" fill={accent} fillOpacity="0.18" />
        <rect x="14" y="41.36" width="72" height="0.9" fill={accent} fillOpacity="0.6" />
      </g>

      {/* Depleting ring: faint track + accent arc draining counter-clockwise */}
      <circle cx="50" cy="50" r="40" fill="none" stroke={track} strokeWidth="2.6" />
      <path d="M 50.00 10.00 A 40 40 0 1 0 77.38 79.16" fill="none" stroke={accent} strokeWidth="2.6" strokeLinecap="round" />

      {/* Face rim */}
      <circle cx="50" cy="50" r="42" fill="none" stroke={rim} strokeWidth="1.3" />

      {/* Hands, reversed */}
      <line x1="50" y1="50" x2="34" y2="32" stroke={handMaj} strokeWidth="3.6" strokeLinecap="round" />
      <line x1="50" y1="50" x2="69" y2="34" stroke={handMin} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="50" y1="50" x2="39" y2="73" stroke={accent} strokeWidth="1.2" strokeLinecap="round" />

      {/* Centre cap */}
      <circle cx="50" cy="50" r="4" fill={accent} />
      <circle cx="50" cy="50" r="1.7" fill={cap} />
    </svg>
  )
}
