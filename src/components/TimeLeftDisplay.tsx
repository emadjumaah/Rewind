import React from 'react'
import { endOfDay } from 'date-fns'
import { useStore } from '../store'

const ACCENT_TEXT: Record<string, string> = {
  cyan:   'text-cyan-400',
  purple: 'text-purple-400',
  amber:  'text-amber-400',
  red:    'text-red-400',
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function TimeLeftDisplay({ currentTime }: { currentTime: Date }) {
  const { settings } = useStore()

  const msLeft = endOfDay(currentTime).getTime() - currentTime.getTime()
  const hours   = Math.floor(msLeft / 3_600_000)
  const minutes = Math.floor((msLeft % 3_600_000) / 60_000)
  const seconds = Math.floor((msLeft % 60_000) / 1_000)

  const isDark = settings.darkMode
  const accentCls = ACCENT_TEXT[settings.accentColor]
  const mutedCls = isDark ? 'text-gray-500' : 'text-gray-400'
  const sepCls   = isDark ? 'text-gray-600' : 'text-gray-300'

  return (
    <div className="glass rounded-xl px-6 py-4 flex flex-col items-center justify-center h-[150px]">
      {/* Label */}
      <p className={`font-mono text-[9px] tracking-[0.28em] uppercase mb-3 ${mutedCls}`}>
        Time Remaining Today
      </p>

      {/* Countdown */}
      <div className="flex items-baseline gap-0.5 font-mono tabular-nums leading-none">
        <span className={`text-[3.6rem] font-bold ${accentCls}`}>{pad(hours)}</span>
        <span className={`text-[2.4rem] font-light mx-0.5 ${sepCls}`}>:</span>
        <span className={`text-[3.6rem] font-bold ${accentCls}`}>{pad(minutes)}</span>
        <span className={`text-[2.4rem] font-light mx-0.5 ${sepCls}`}>:</span>
        <span className={`text-[3.6rem] font-bold ${accentCls}`}>{pad(seconds)}</span>
      </div>

      {/* Sub-label */}
      <p className={`font-mono text-[8px] tracking-[0.22em] mt-3 ${mutedCls}`}>
        HH &nbsp;·&nbsp; MM &nbsp;·&nbsp; SS
      </p>
    </div>
  )
}

export default React.memo(TimeLeftDisplay)
