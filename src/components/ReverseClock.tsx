import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'

export default function ReverseClock() {
  const [time, setTime] = useState(new Date())
  const [glowIntensity, setGlowIntensity] = useState(0.5)
  const { settings } = useStore()

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 50) // Higher refresh rate for smooth animation
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Breathing glow effect
    const breathingInterval = setInterval(() => {
      setGlowIntensity(prev => 0.3 + Math.sin(Date.now() / 1000) * 0.2)
    }, 50)
    return () => clearInterval(breathingInterval)
  }, [])

  const seconds = time.getSeconds()
  const milliseconds = time.getMilliseconds()
  const minutes = time.getMinutes()
  const hours = time.getHours()

  // Ultra-smooth hand movement with millisecond interpolation
  const secondDeg = ((seconds + milliseconds / 1000) / 60) * 360
  const minuteDeg = ((minutes + seconds / 60 + milliseconds / 60000) / 60) * 360
  const hourDeg = ((hours % 12 + minutes / 60 + seconds / 3600) / 12) * 360

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

  const getMotionMultiplier = () => {
    const multipliers = {
      low: 2,
      medium: 1,
      high: 0.5,
    }
    return multipliers[settings.motionIntensity]
  }

  const motionMultiplier = getMotionMultiplier()

  const getNumberPosition = (num: number) => {
    const angle = ((12 - num) % 12 - 3) * (Math.PI / 6)
    const radius = 80
    const x = 100 + radius * Math.cos(angle)
    const y = 100 + radius * Math.sin(angle)
    return { x, y }
  }

  return (
    <div className="relative w-full aspect-square">
      {/* Ambient radial lighting */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          background: [
            'radial-gradient(circle at 30% 30%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)',
            'radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)',
            'radial-gradient(circle at 30% 30%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10 * motionMultiplier,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ pointerEvents: 'none' }}
      />

      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            `0 0 ${30 + glowIntensity * 20}px ${10 + glowIntensity * 5}px ${accentColor} ${glowIntensity * 0.15})`,
            `0 0 ${40 + glowIntensity * 25}px ${15 + glowIntensity * 8}px ${accentColor} ${glowIntensity * 0.1})`,
            `0 0 ${30 + glowIntensity * 20}px ${10 + glowIntensity * 5}px ${accentColor} ${glowIntensity * 0.15})`,
          ],
        }}
        transition={{
          duration: 4 * motionMultiplier,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <svg className="w-full h-full" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="clockGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={`${accentColor} 0.1)`} />
            <stop offset="100%" stopColor={`${accentColor} 0)`} />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx="100"
          cy="100"
          r="95"
          fill="url(#clockGradient)"
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
              fill="rgba(255,255,255,0.7)"
              fontSize="18"
              fontWeight="500"
              letterSpacing="1"
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

        <motion.line
          x1="100"
          y1="100"
          x2={secondHandX}
          y2={secondHandY}
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="2"
          strokeLinecap="round"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        <motion.line
          x1="100"
          y1="100"
          x2={minuteHandX}
          y2={minuteHandY}
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="3"
          strokeLinecap="round"
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />

        <motion.line
          x1="100"
          y1="100"
          x2={hourHandX}
          y2={hourHandY}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="4"
          strokeLinecap="round"
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </svg>
    </div>
  )
}
