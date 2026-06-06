import { useStore } from '../store'

export default function ReverseClock({ currentTime }: { currentTime: Date }) {
  const { settings } = useStore()

  const seconds = currentTime.getSeconds()
  const minutes = currentTime.getMinutes()
  const hours = currentTime.getHours()

  // Simple hand movement without millisecond interpolation for performance
  const secondDeg = (seconds / 60) * 360
  const minuteDeg = ((minutes + seconds / 60) / 60) * 360
  const hourDeg = ((hours % 12 + minutes / 60) / 12) * 360

  const secondHandX = 100 + 75 * Math.sin((-secondDeg * Math.PI) / 180)
  const secondHandY = 100 - 75 * Math.cos((-secondDeg * Math.PI) / 180)
  const minuteHandX = 100 + 65 * Math.sin((-minuteDeg * Math.PI) / 180)
  const minuteHandY = 100 - 65 * Math.cos((-minuteDeg * Math.PI) / 180)
  const hourHandX = 100 + 50 * Math.sin((-hourDeg * Math.PI) / 180)
  const hourHandY = 100 - 50 * Math.cos((-hourDeg * Math.PI) / 180)

  const getAccentColor = () => {
    const colors = {
      cyan: 'rgba(6, 182, 212,',
      purple: 'rgba(168, 85, 247,',
      amber: 'rgba(245, 158, 11,',
      red: 'rgba(239, 68, 68,',
    }
    return colors[settings.accentColor]
  }

  const accentColor = getAccentColor()

  const getNumberPosition = (num: number) => {
    const angle = ((12 - num) % 12 - 3) * (Math.PI / 6)
    const radius = 80
    const x = 100 + radius * Math.cos(angle)
    const y = 100 + radius * Math.sin(angle)
    return { x, y }
  }

  return (
    <div className="relative w-full aspect-square">
      {/* Ambient radial lighting - disabled for performance */}

      <svg className="w-full h-full" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="rgba(255,255,255,0.02)"
        />

        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
        />
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />

        {Array.from({ length: 12 }, (_, i) => {
          const num = i + 1
          const { x, y } = getNumberPosition(num)
          return (
            <text
              key={num}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.8)"
              fontSize="20"
              fontWeight="600"
              letterSpacing="0.5"
              fontFamily="'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace"
            >
              {num}
            </text>
          )
        })}

        <circle
          cx="100"
          cy="100"
          r="4"
          fill="rgba(255,255,255,0.8)"
        />

        {/* Backward digital clock overlay */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 text-sm font-mono tabular-nums tracking-widest" style={{ transform: 'scaleX(-1)', color: `${accentColor} 0.7)` }}>
          {settings.timeFormat === '12h'
            ? `${hours % 12 || 12}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            : `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
          }
        </div>

        <line
          x1="100"
          y1="100"
          x2={secondHandX}
          y2={secondHandY}
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <line
          x1="100"
          y1="100"
          x2={minuteHandX}
          y2={minuteHandY}
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <line
          x1="100"
          y1="100"
          x2={hourHandX}
          y2={hourHandY}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
