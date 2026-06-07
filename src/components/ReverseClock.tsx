import { useStore } from '../store'

const ACCENT_HEX: Record<string, string> = {
  cyan:   '#06b6d4',
  purple: '#a855f7',
  amber:  '#f59e0b',
  red:    '#ef4444',
}

export default function ReverseClock({ currentTime }: { currentTime: Date }) {
  const { settings } = useStore()

  const isDark = settings.darkMode
  const accent = ACCENT_HEX[settings.accentColor]

  const sec = currentTime.getSeconds()
  const min = currentTime.getMinutes()
  const hr  = currentTime.getHours()

  // Counter-clockwise angles (negative = CCW from 12 o'clock)
  // 1-second ticks — smooth enough for a clock, no re-render overhead
  const secDeg  = -(sec / 60) * 360
  const minDeg  = -((min + sec / 60)  / 60) * 360
  const hourDeg = -((hr % 12 + min / 60) / 12) * 360

  // SVG coordinate helpers
  const cx = 100
  const R  = 88  // outer tick radius

  function tip(angleDeg: number, len: number): { x: number; y: number } {
    const rad = (angleDeg - 90) * (Math.PI / 180)
    return { x: cx + len * Math.cos(rad), y: cx + len * Math.sin(rad) }
  }

  const sec4  = tip(secDeg,  R * 0.88)
  const min4  = tip(minDeg,  R * 0.76)
  const hour4 = tip(hourDeg, R * 0.56)

  // Theme colours
  const faceStroke = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.14)'
  const faceFill   = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'
  const tickMajor  = isDark ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.38)'
  const tickMinor  = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)'
  const numFill    = isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.52)'
  const handHour   = isDark ? 'rgba(255,255,255,0.78)' : 'rgba(0,0,0,0.70)'
  const handMin    = isDark ? 'rgba(255,255,255,0.90)' : 'rgba(0,0,0,0.84)'
  const centerFill = isDark ? '#060610'                : '#f5f5f0'
  const labelFill  = isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.18)'

  // Mirrored labels: clockwise positions (i×30°), counter-clockwise numbers
  // 12 at top → as you go clockwise you see 11, 10, 9 … 1
  const LABELS = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
  const labelR = R - 22

  return (
    <div className="relative w-full aspect-square select-none">
      <svg className="w-full h-full" viewBox="0 0 200 200">

        {/* Outer ring + subtle inner ring */}
        <circle cx={cx} cy={cx} r={R + 2}  fill={faceFill} stroke={faceStroke} strokeWidth="1.5" />
        <circle cx={cx} cy={cx} r={R - 8}  fill="none"     stroke={faceStroke} strokeWidth="0.5" strokeOpacity="0.35" />

        {/* 60 tick marks */}
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

        {/* Mirrored hour labels */}
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

        {/* Hour hand */}
        <line x1={cx} y1={cx} x2={hour4.x} y2={hour4.y}
          stroke={handHour} strokeWidth="4.5" strokeLinecap="round" />

        {/* Minute hand */}
        <line x1={cx} y1={cx} x2={min4.x} y2={min4.y}
          stroke={handMin} strokeWidth="2.5" strokeLinecap="round" />

        {/* Second hand — smooth via rAF */}
        <line x1={cx} y1={cx} x2={sec4.x} y2={sec4.y}
          stroke={accent} strokeWidth="1.6" strokeLinecap="round" />

        {/* Centre cap */}
        <circle cx={cx} cy={cx} r={5.5} fill={accent} />
        <circle cx={cx} cy={cx} r={2.5} fill={centerFill} />

        {/* REWIND label */}
        <text x={cx} y={cx + 30} textAnchor="middle"
          fontSize="6" letterSpacing="3.5"
          fontFamily="'SF Mono', Monaco, 'Courier New', monospace"
          fill={labelFill}>
          REWIND
        </text>

      </svg>
    </div>
  )
}
