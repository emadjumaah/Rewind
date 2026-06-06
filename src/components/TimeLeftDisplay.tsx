import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { endOfDay } from 'date-fns'
import { useStore } from '../store'

export default function TimeLeftDisplay() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const { settings } = useStore()

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date()
      const endOfDayDate = endOfDay(now)
      const msLeft = endOfDayDate.getTime() - now.getTime()
      const hours = Math.floor(msLeft / (1000 * 60 * 60))
      const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((msLeft % (1000 * 60)) / 1000)
      setTimeLeft({ hours, minutes, seconds })
    }

    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [])

  const getAccentColor = () => {
    const colors = {
      cyan: 'text-cyan-400',
      purple: 'text-purple-400',
      amber: 'text-amber-400',
      red: 'text-red-400',
    }
    return colors[settings.accentColor]
  }

  const accentColor = getAccentColor()

  return (
    <div className="glass rounded-xl p-6 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-sm text-gray-400 mb-2 tracking-wide">TIME LEFT TODAY</p>
        <div className="flex items-baseline justify-center gap-2">
          <motion.span
            key={timeLeft.hours}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`text-6xl font-bold tabular-nums ${accentColor}`}
          >
            {String(timeLeft.hours).padStart(2, '0')}
          </motion.span>
          <span className="text-4xl text-gray-500">:</span>
          <motion.span
            key={timeLeft.minutes}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`text-6xl font-bold tabular-nums ${accentColor}`}
          >
            {String(timeLeft.minutes).padStart(2, '0')}
          </motion.span>
          <span className="text-4xl text-gray-500">:</span>
          <motion.span
            key={timeLeft.seconds}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`text-6xl font-bold tabular-nums ${accentColor}`}
          >
            {String(timeLeft.seconds).padStart(2, '0')}
          </motion.span>
        </div>
        <p className="text-xs text-gray-500 mt-3">Hours : Minutes : Seconds</p>
      </motion.div>
    </div>
  )
}
