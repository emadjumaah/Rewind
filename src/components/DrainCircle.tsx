import { useId } from 'react'

/**
 * A circular "vial" whose liquid level drains as time runs out — the same
 * sand/water metaphor as the main clock face. `progress` is the fraction of
 * time REMAINING (1 = full, 0 = empty).
 */
export default function DrainCircle({
  size = 64,
  progress,
  color,
  className,
}: {
  size?: number
  progress: number
  color: string
  className?: string
}) {
  const clip = useId().replace(/:/g, '')
  const p = Math.max(0, Math.min(1, progress))
  const R = 44
  const top = 50 - R
  const level = top + (1 - p) * (2 * R) // y of the liquid surface

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* faint track ring */}
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeOpacity="0.22" strokeWidth="2" />
      <clipPath id={clip}>
        <circle cx="50" cy="50" r={R} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <rect
          x={top}
          y={level}
          width={2 * R}
          height={50 + R - level}
          fill={color}
          fillOpacity="0.8"
          style={{ transition: 'y 1s linear, height 1s linear' }}
        />
        {/* surface line */}
        <rect x={top} y={level} width={2 * R} height="1.4" fill={color} />
      </g>
    </svg>
  )
}
