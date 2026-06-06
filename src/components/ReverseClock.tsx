import { useState, useEffect } from 'react'
import { useStore } from '../store'

export default function ReverseClock() {
  const { settings } = useStore()
  const [time, setTime] = useState(new Date())
  const [context, setContext] = useState('')

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const updateContext = () => {
      const now = new Date()
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)
      const msLeft = endOfDay.getTime() - now.getTime()
      const hoursLeft = Math.floor(msLeft / (1000 * 60 * 60))
      const minsLeft = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60))

      const timeStr = settings.timeFormat === '12h'
        ? now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        : now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

      const contexts = [
        `It is ${timeStr}. You have ${hoursLeft}h ${minsLeft}m of today left. You probably need ${hoursLeft + 2}.`,
        `${timeStr}. ${hoursLeft} hours remain. Most will be wasted on things that don't matter.`,
        `${timeStr}. The day is ${Math.round((1 - msLeft / (24 * 60 * 60 * 1000)) * 100)}% gone. Progress is optional.`,
      ]
      setContext(contexts[Math.floor(Math.random() * contexts.length)])
    }

    updateContext()
    const interval = setInterval(updateContext, 15000)
    return () => clearInterval(interval)
  }, [settings.timeFormat])

  const seconds = time.getSeconds()
  const minutes = time.getMinutes()
  const hours = time.getHours()

  const secondDeg = -(seconds / 60) * 360
  const minuteDeg = -((minutes + seconds / 60) / 60) * 360
  const hourDeg = -((hours % 12 + minutes / 60) / 12) * 360

  const secondHandX = 100 + 75 * Math.sin((secondDeg * Math.PI) / 180)
  const secondHandY = 100 - 75 * Math.cos((secondDeg * Math.PI) / 180)
  const minuteHandX = 100 + 65 * Math.sin((minuteDeg * Math.PI) / 180)
  const minuteHandY = 100 - 65 * Math.cos((minuteDeg * Math.PI) / 180)
  const hourHandX = 100 + 50 * Math.sin((hourDeg * Math.PI) / 180)
  const hourHandY = 100 - 50 * Math.cos((hourDeg * Math.PI) / 180)

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-80 h-80">
        <svg className="w-full h-full" viewBox="0 0 200 200">
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

          <circle
            cx="100"
            cy="100"
            r="3"
            fill="rgba(255,255,255,0.8)"
          />

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
      <p className="text-xl text-gray-400 text-center max-w-md leading-relaxed">
        {context}
      </p>
    </div>
  )
}
