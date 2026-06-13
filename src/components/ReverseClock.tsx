import React, { useMemo, useRef, useEffect, useState } from 'react'
import { useStore, ClockHorizon } from '../store'
import { useT } from '../i18n'
import { accentHex } from '../lib/colors'
import { urgencyColor } from '../lib/urgency'
import {
  dayRemaining, hoursUntil, msLeftToday, hms,
  weekRemaining, monthRemaining, yearRemaining,
  daysLeftInWeek, daysLeftInMonth, daysLeftInYear,
} from '../lib/time'

const MS_PER_WEEK = 7 * 86_400_000

// A point on a circle, angle measured clockwise from 12 o'clock
function clockPoint(cx: number, deg: number, r: number): { x: number; y: number } {
  const rad = (deg - 90) * (Math.PI / 180)
  return { x: cx + r * Math.cos(rad), y: cx + r * Math.sin(rad) }
}

function ReverseClock({ currentTime }: { currentTime: Date }) {
  const { settings, deadlines, updateSettings } = useStore()
  const T = useT()
  const isAr = (settings.language ?? 'en') === 'ar'

  // Nearest deadline drives the outer ring: prefer the soonest upcoming one,
  // otherwise fall back to the most recently missed (overdue) deadline.
  const nearest = (() => {
    if (!deadlines.length) return null
    const withLeft = deadlines.map((d) => {
      const date = d.deadline instanceof Date ? d.deadline : new Date(d.deadline)
      return { d, date, hoursLeft: hoursUntil(date, currentTime) }
    })
    const upcoming = withLeft.filter((x) => x.hoursLeft >= 0).sort((a, b) => a.hoursLeft - b.hoursLeft)
    if (upcoming.length) return upcoming[0]
    return withLeft.sort((a, b) => b.hoursLeft - a.hoursLeft)[0] // least overdue
  })()

  const isDark = settings.darkMode
  const accent = accentHex(settings.accentColor)

  const sec = currentTime.getSeconds()
  const min = currentTime.getMinutes()
  const hr  = currentTime.getHours()

  // Backward (counter-clockwise) angles. Minute/hour move slowly enough that a
  // per-second step is invisible, so they stay React-driven. The second hand is
  // the one that used to *snap* 6° every tick — the metronome that made the
  // clock stressful — so it gets a continuous sweep instead (see effect below).
  const secDeg  = -(sec / 60) * 360
  const minDeg  = -((min + sec / 60)  / 60) * 360
  const hourDeg = -((hr % 12 + min / 60) / 12) * 360

  const cx = 100
  const R  = 88

  function tip(angleDeg: number, len: number): { x: number; y: number } {
    const rad = (angleDeg - 90) * (Math.PI / 180)
    return { x: cx + len * Math.cos(rad), y: cx + len * Math.sin(rad) }
  }

  const min4  = tip(minDeg,  R * 0.76)
  const hour4 = tip(hourDeg, R * 0.56)

  // Respect the OS "reduce motion" setting: fall back to the stepped hand.
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // Smoothly sweep the second hand counter-clockwise with millisecond precision.
  // We drive the group's transform directly via a ref (not React state) so the
  // glide runs on every animation frame without re-rendering the whole face, and
  // so the parent's once-a-second re-render can't snap it back. Epoch seconds are
  // timezone-invariant, so this stays aligned to the wall-clock second.
  const secHandRef = useRef<SVGGElement>(null)
  useEffect(() => {
    if (reducedMotion) return
    let raf = 0
    const animate = () => {
      const secNow = (Date.now() / 1000) % 60
      const deg = (secNow / 60) * 360
      secHandRef.current?.setAttribute('transform', `rotate(${-deg} ${cx} ${cx})`)
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [reducedMotion])

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

  // Tick marks and hour numbers are static — they only change with the theme,
  // so memoize them and skip rebuilding ~72 nodes on every per-second tick.
  const ticks = useMemo(() => Array.from({ length: 60 }, (_, i) => {
    const a = (i * 6 - 90) * (Math.PI / 180)
    const major = i % 5 === 0
    const r1 = major ? R - 13 : R - 6
    return (
      <line key={i}
        x1={cx + r1 * Math.cos(a)} y1={cx + r1 * Math.sin(a)}
        x2={cx + R * Math.cos(a)} y2={cx + R * Math.sin(a)}
        stroke={major ? tickMajor : tickMinor}
        strokeWidth={major ? 1.6 : 0.8}
      />
    )
  }), [tickMajor, tickMinor])

  const labels = useMemo(() => LABELS.map((num, i) => {
    const a = (i * 30 - 90) * (Math.PI / 180)
    return (
      <text key={num}
        x={cx + labelR * Math.cos(a)}
        y={cx + labelR * Math.sin(a)}
        textAnchor="middle" dominantBaseline="central"
        fontSize="11.5" fontWeight="500"
        fontFamily="'SF Mono', Monaco, Inconsolata, 'Courier New', monospace"
        fill={numFill}
      >
        {num}
      </text>
    )
  }), [numFill]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Comet trail ── The second hand, drawn pointing straight up (angle 0) in
  // local space; the rotating group above aims it. A soft tail arcs back along
  // the rim toward where the hand just was (the clockwise side, since it sweeps
  // counter-clockwise), fading to nothing — time visibly draining away.
  const lenSec = R * 0.88
  const trailDeg = 42
  const headPt = clockPoint(cx, 0, lenSec)
  const tailPt = clockPoint(cx, trailDeg, lenSec)
  const trailPath = `M ${headPt.x} ${headPt.y} A ${lenSec} ${lenSec} 0 0 1 ${tailPt.x} ${tailPt.y}`

  const ringR = R + 6

  // ── Horizon drain ── Tap the clock to pull the ring + sand-fill back from
  // today out to a whole life. Each horizon reports the fraction still ahead and
  // an honest figure of what's left. 'life' only exists once a birth date is set.
  const horizons: ClockHorizon[] = settings.birthDate
    ? ['day', 'week', 'month', 'year', 'life']
    : ['day', 'week', 'month', 'year']
  const horizon: ClockHorizon =
    settings.clockHorizon && horizons.includes(settings.clockHorizon) ? settings.clockHorizon : 'day'

  let frac: number
  let horizonLeft: string
  switch (horizon) {
    case 'week':
      frac = weekRemaining(currentTime)
      horizonLeft = T.clockLeftDays(daysLeftInWeek(currentTime))
      break
    case 'month':
      frac = monthRemaining(currentTime)
      horizonLeft = T.clockLeftDays(daysLeftInMonth(currentTime))
      break
    case 'year':
      frac = yearRemaining(currentTime)
      horizonLeft = T.clockLeftDays(daysLeftInYear(currentTime))
      break
    case 'life': {
      const total = (settings.lifeExpectancy || 90) * 52
      const lived = Math.floor((currentTime.getTime() - new Date(settings.birthDate!).getTime()) / MS_PER_WEEK)
      const weeksLeft = Math.max(0, total - lived)
      frac = total ? weeksLeft / total : 0
      horizonLeft = T.clockLeftWeeks(weeksLeft)
      break
    }
    default:
      frac = dayRemaining(currentTime)
      horizonLeft = T.clockLeftHours(hms(msLeftToday(currentTime)).hours)
  }
  const horizonName = T.clockHorizonName(horizon)

  const cycleHorizon = () => {
    const next = horizons[(horizons.indexOf(horizon) + 1) % horizons.length]
    updateSettings({ clockHorizon: next })
  }

  // Outer ring depletes counter-clockwise from 12 o'clock as the horizon runs out.
  const sweep = frac * 360
  const ringStart = clockPoint(cx, 0, ringR)
  const ringEnd = clockPoint(cx, -sweep, ringR)
  const ringLargeArc = sweep > 180 ? 1 : 0

  // Sand-glass liquid level inside the face: full at the horizon's start, empty at its end.
  const fillR = R - 8
  const fillTop = (cx - fillR) + (1 - frac) * (2 * fillR)

  // Nearest-deadline countdown chip (text only; the ring now tracks the day).
  let deadlineLabel: string | null = null
  if (nearest) {
    const h = Math.abs(Math.round(nearest.hoursLeft))
    const compact = h >= 24 ? Math.round(h / 24) + 'D' : h + 'H'
    deadlineLabel = nearest.hoursLeft < 0 ? `+${compact}` : compact
  }

  return (
    <div
      className="relative w-full aspect-square select-none cursor-pointer transition-transform active:scale-[0.99]"
      onClick={cycleHorizon}
      title={T.clockTapHint}
      role="button"
      aria-label={`${horizonName} — ${horizonLeft}. ${T.clockTapHint}`}
    >
      <svg className="w-full h-full" viewBox="0 0 200 200">
        {/* Day-drain ring: faint full track + remaining arc */}
        <circle cx={cx} cy={cx} r={ringR} fill="none" stroke={tickMinor} strokeWidth="2.4" strokeOpacity="0.5" />
        {sweep > 0.5 && (
          <path
            d={`M ${ringStart.x} ${ringStart.y} A ${ringR} ${ringR} 0 ${ringLargeArc} 0 ${ringEnd.x} ${ringEnd.y}`}
            fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round"
          />
        )}

        <circle cx={cx} cy={cx} r={R + 2}  fill={faceFill} stroke={faceStroke} strokeWidth="1.5" />
        <circle cx={cx} cy={cx} r={R - 8}  fill="none"     stroke={faceStroke} strokeWidth="0.5" strokeOpacity="0.35" />

        {/* Sand-glass day fill — the face empties as the day's hours drain away */}
        <defs>
          <clipPath id="dayFillClip">
            <circle cx={cx} cy={cx} r={fillR} />
          </clipPath>
          {/* Comet tail: opaque at the hand's head, fading to nothing at the tail.
              userSpaceOnUse coords are read in the rotating group's frame, so the
              gradient turns with the hand and stays aligned to the arc. */}
          <linearGradient id="secTrail" gradientUnits="userSpaceOnUse"
            x1={headPt.x} y1={headPt.y} x2={tailPt.x} y2={tailPt.y}>
            <stop offset="0%" stopColor={accent} stopOpacity="0.7" />
            <stop offset="55%" stopColor={accent} stopOpacity="0.16" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
          {/* Faint depth in the dial — settles the eye, no hard edges. */}
          <radialGradient id="faceDepth" cx="50%" cy="44%" r="62%">
            <stop offset="0%" stopColor={isDark ? '#ffffff' : '#000000'} stopOpacity="0" />
            <stop offset="100%" stopColor={isDark ? '#000000' : '#000000'} stopOpacity={isDark ? 0.28 : 0.05} />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cx} r={R - 8} fill="url(#faceDepth)" />
        <g clipPath="url(#dayFillClip)">
          <rect x={cx - fillR} y={fillTop} width={2 * fillR} height={(cx + fillR) - fillTop}
            fill={accent} fillOpacity="0.13" style={{ transition: 'y 1s linear, height 1s linear' }} />
          <rect x={cx - fillR} y={fillTop} width={2 * fillR} height="1" fill={accent} fillOpacity="0.45" />
        </g>

        {ticks}
        {labels}

        <line x1={cx} y1={cx} x2={hour4.x} y2={hour4.y}
          stroke={handHour} strokeWidth="4.5" strokeLinecap="round" />
        <line x1={cx} y1={cx} x2={min4.x} y2={min4.y}
          stroke={handMin} strokeWidth="2.5" strokeLinecap="round" />

        {/* Second hand + comet trail. In smooth mode the rAF loop owns this
            group's transform, so no transform prop here (React must not reset it
            each second). Reduced-motion falls back to the stepped angle. */}
        <g ref={secHandRef} transform={reducedMotion ? `rotate(${secDeg} ${cx} ${cx})` : undefined}>
          <path d={trailPath} fill="none" stroke="url(#secTrail)" strokeWidth="5" strokeLinecap="round" strokeOpacity="0.5" />
          <path d={trailPath} fill="none" stroke="url(#secTrail)" strokeWidth="2.2" strokeLinecap="round" />
          <line x1={cx} y1={cx} x2={headPt.x} y2={headPt.y}
            stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.92" />
          <circle cx={headPt.x} cy={headPt.y} r={5} fill={accent} fillOpacity="0.16" />
          <circle cx={headPt.x} cy={headPt.y} r={2.2} fill={accent} />
        </g>

        <circle cx={cx} cy={cx} r={5.5} fill={accent} />
        <circle cx={cx} cy={cx} r={2.5} fill={centerFill} />

        {/* Horizon watermark — names what the ring is draining, with the honest
            figure beneath. Tap the clock to cycle through horizons. */}
        <text x={cx} y={cx + 26} textAnchor="middle"
          fontSize="6" letterSpacing={isAr ? '0' : '3'}
          fontFamily="'SF Mono', Monaco, 'Courier New', monospace"
          fill={labelFill}>
          {horizonName}
        </text>
        <text x={cx} y={cx + 37} textAnchor="middle"
          fontSize="7" letterSpacing={isAr ? '0' : '0.5'}
          fontFamily="'SF Mono', Monaco, 'Courier New', monospace"
          fill={numFill} fillOpacity="0.75">
          {horizonLeft}
        </text>
      </svg>

      {/* Nearest-deadline countdown — a quiet pill on the bottom rim, below the
          hands' reach (~77% of radius) so it never overlaps them */}
      {deadlineLabel && (
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-[3%] pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.045)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: urgencyColor(nearest!.hoursLeft) }} />
          <span
            className="text-[10px] font-medium tabular-nums tracking-wider"
            style={{ color: urgencyColor(nearest!.hoursLeft) }}
          >
            {deadlineLabel}
          </span>
        </div>
      )}
    </div>
  )
}

// The second hand sweeps via its own rAF loop (direct DOM, no React), so the
// face only needs to re-render when the minute or hour actually changes — once
// a minute, not 60×. That keeps the parent's per-second tick from reconciling
// this whole SVG for nothing. Exception: under prefers-reduced-motion there's no
// rAF sweep, so we let it re-render every second to step the stepped hand.
const reducedMotionMQL =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null

export default React.memo(ReverseClock, (prev, next) => {
  if (reducedMotionMQL?.matches) return false // re-render so the stepped hand moves
  return prev.currentTime.getMinutes() === next.currentTime.getMinutes()
    && prev.currentTime.getHours() === next.currentTime.getHours()
})
