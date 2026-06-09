import { useStore } from '../store'
import { useT } from '../i18n'

const ACCENT_HEX: Record<string, string> = {
  cyan:   '#2dd4bf', // teal
  purple: '#8b5cf6', // violet
  amber:  '#f59e0b', // amber
  red:    '#f43f5e', // rose
}

// Urgency color, shared thresholds with the deadline cards
function urgencyColor(hoursLeft: number): string {
  if (hoursLeft < 0)   return '#dc2626'
  if (hoursLeft < 24)  return '#ef4444'
  if (hoursLeft < 72)  return '#f59e0b'
  return '#3b82f6'
}

// A point on a circle, angle measured clockwise from 12 o'clock
function clockPoint(cx: number, deg: number, r: number): { x: number; y: number } {
  const rad = (deg - 90) * (Math.PI / 180)
  return { x: cx + r * Math.cos(rad), y: cx + r * Math.sin(rad) }
}

export default function ReverseClock({ currentTime }: { currentTime: Date }) {
  const { settings, deadlines } = useStore()
  const T = useT()

  // Nearest deadline drives the outer ring: prefer the soonest upcoming one,
  // otherwise fall back to the most recently missed (overdue) deadline.
  const nearest = (() => {
    if (!deadlines.length) return null
    const withLeft = deadlines.map((d) => {
      const date = d.deadline instanceof Date ? d.deadline : new Date(d.deadline)
      return { d, date, hoursLeft: (date.getTime() - currentTime.getTime()) / 3_600_000 }
    })
    const upcoming = withLeft.filter((x) => x.hoursLeft >= 0).sort((a, b) => a.hoursLeft - b.hoursLeft)
    if (upcoming.length) return upcoming[0]
    return withLeft.sort((a, b) => b.hoursLeft - a.hoursLeft)[0] // least overdue
  })()

  const isDark = settings.darkMode
  const accent = ACCENT_HEX[settings.accentColor]

  const sec = currentTime.getSeconds()
  const min = currentTime.getMinutes()
  const hr  = currentTime.getHours()

  const secDeg  = -(sec / 60) * 360
  const minDeg  = -((min + sec / 60)  / 60) * 360
  const hourDeg = -((hr % 12 + min / 60) / 12) * 360

  const cx = 100
  const R  = 88

  function tip(angleDeg: number, len: number): { x: number; y: number } {
    const rad = (angleDeg - 90) * (Math.PI / 180)
    return { x: cx + len * Math.cos(rad), y: cx + len * Math.sin(rad) }
  }

  const sec4  = tip(secDeg,  R * 0.88)
  const min4  = tip(minDeg,  R * 0.76)
  const hour4 = tip(hourDeg, R * 0.56)

  const faceStroke = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.14)'
  const faceFill   = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'
  const tickMajor  = isDark ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.38)'
  const tickMinor  = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)'
  const numFill    = isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.52)'
  const handHour   = isDark ? 'rgba(255,255,255,0.78)' : 'rgba(0,0,0,0.70)'
  const handMin    = isDark ? 'rgba(255,255,255,0.90)' : 'rgba(0,0,0,0.84)'
  const centerFill = isDark ? '#060610'                : '#f5f5f0'
  const labelFill  = isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.18)'

  const LABELS = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
  const labelR = R - 22

  // ── Nearest-deadline ring ── depletes counter-clockwise from 12 o'clock over
  // a 30-day window, mirroring the reverse-clock motif: time only runs out.
  const ringR = R + 6
  const WINDOW_H = 30 * 24
  let ringEl: JSX.Element | null = null
  let deadlineLabel: string | null = null
  if (nearest) {
    const dColor = urgencyColor(nearest.hoursLeft)
    const isOverdue = nearest.hoursLeft < 0
    const frac = Math.max(0, Math.min(1, nearest.hoursLeft / WINDOW_H))
    if (isOverdue) {
      ringEl = <circle cx={cx} cy={cx} r={ringR} fill="none" stroke={dColor} strokeWidth="2.4" strokeOpacity="0.9" />
    } else {
      const sweep = frac * 360
      const start = clockPoint(cx, 0, ringR)
      const end = clockPoint(cx, -sweep, ringR)
      const largeArc = sweep > 180 ? 1 : 0
      ringEl = (
        <path
          d={`M ${start.x} ${start.y} A ${ringR} ${ringR} 0 ${largeArc} 0 ${end.x} ${end.y}`}
          fill="none" stroke={dColor} strokeWidth="2.4" strokeLinecap="round"
          style={{ transition: 'stroke 0.6s ease' }}
        />
      )
    }
    const h = Math.abs(Math.round(nearest.hoursLeft))
    const compact = h >= 24 ? Math.round(h / 24) + 'D' : h + 'H'
    deadlineLabel = isOverdue ? `+${compact}` : compact
  }

  return (
    <div className="relative w-full aspect-square select-none">
      <svg className="w-full h-full" viewBox="0 0 200 200">
        {/* faint full track behind the deadline ring */}
        {nearest && (
          <circle cx={cx} cy={cx} r={ringR} fill="none" stroke={tickMinor} strokeWidth="2.4" strokeOpacity="0.5" />
        )}
        {ringEl}
        <circle cx={cx} cy={cx} r={R + 2}  fill={faceFill} stroke={faceStroke} strokeWidth="1.5" />
        <circle cx={cx} cy={cx} r={R - 8}  fill="none"     stroke={faceStroke} strokeWidth="0.5" strokeOpacity="0.35" />

        {Array.from({ length: 60 }, (_, i) => {
          const a = (i * 6 - 90) * (Math.PI / 180)
          const major = i % 5 === 0
          const r1 = major ? R - 13 : R - 6
          return (
            <line key={i}
              x1={cx + r1 * Math.cos(a)} y1={cx + r1 * Math.sin(a)}
              x2={cx + R  * Math.cos(a)} y2={cx + R  * Math.sin(a)}
              stroke={major ? tickMajor : tickMinor}
              strokeWidth={major ? 1.6 : 0.8}
            />
          )
        })}

        {LABELS.map((num, i) => {
          const a = (i * 30 - 90) * (Math.PI / 180)
          return (
            <text key={num}
              x={cx + labelR * Math.cos(a)}
              y={cx + labelR * Math.sin(a)}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="11.5"
              fontWeight="500"
              fontFamily="'SF Mono', Monaco, Inconsolata, 'Courier New', monospace"
              fill={numFill}
            >
              {num}
            </text>
          )
        })}

        <line x1={cx} y1={cx} x2={hour4.x} y2={hour4.y}
          stroke={handHour} strokeWidth="4.5" strokeLinecap="round" />
        <line x1={cx} y1={cx} x2={min4.x} y2={min4.y}
          stroke={handMin} strokeWidth="2.5" strokeLinecap="round" />
        <line x1={cx} y1={cx} x2={sec4.x} y2={sec4.y}
          stroke={accent} strokeWidth="1.6" strokeLinecap="round" />

        <circle cx={cx} cy={cx} r={5.5} fill={accent} />
        <circle cx={cx} cy={cx} r={2.5} fill={centerFill} />

        <text x={cx} y={cx + 30} textAnchor="middle"
          fontSize="6" letterSpacing="3.5"
          fontFamily="'SF Mono', Monaco, 'Courier New', monospace"
          fill={labelFill}>
          {T.clockLabel}
        </text>
      </svg>

      {/* Nearest-deadline countdown — pinned to the bottom rim, below the hands'
          reach (they only span ~77% of the radius) so it never overlaps them */}
      {deadlineLabel && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[1%] pointer-events-none">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold tabular-nums tracking-wide"
            style={{
              color: urgencyColor(nearest!.hoursLeft),
              backgroundColor: isDark ? 'rgba(6,6,16,0.8)' : 'rgba(245,245,240,0.9)',
              border: `1px solid ${urgencyColor(nearest!.hoursLeft)}55`,
            }}
          >
            {deadlineLabel}
          </span>
        </div>
      )}
    </div>
  )
}
