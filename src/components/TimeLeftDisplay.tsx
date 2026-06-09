import React from 'react'
import { useStore } from '../store'
import { useT } from '../i18n'
import { accentHex } from '../lib/colors'
import { msLeftToday, hms } from '../lib/time'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function TimeLeftDisplay({ currentTime }: { currentTime: Date }) {
  const { settings } = useStore()
  const T = useT()

  const { hours, minutes, seconds } = hms(msLeftToday(currentTime))

  const isDark = settings.darkMode
  const accent = accentHex(settings.accentColor)
  const mutedCls = isDark ? 'text-gray-500' : 'text-gray-400'
  const sepCls   = isDark ? 'text-gray-600' : 'text-gray-300'

  return (
    <div className="glass rounded-xl px-6 py-4 flex flex-col items-center justify-center h-[150px]">
      <p className={`font-mono text-[9px] tracking-[0.28em] uppercase mb-3 ${mutedCls}`}>
        {T.timeRemainingToday}
      </p>
      <div className="flex items-baseline gap-0.5 font-mono tabular-nums leading-none">
        <span className="text-[3.6rem] font-bold" style={{ color: accent }}>{pad(hours)}</span>
        <span className={`text-[2.4rem] font-light mx-0.5 ${sepCls}`}>:</span>
        <span className="text-[3.6rem] font-bold" style={{ color: accent }}>{pad(minutes)}</span>
        <span className={`text-[2.4rem] font-light mx-0.5 ${sepCls}`}>:</span>
        <span className="text-[3.6rem] font-bold" style={{ color: accent }}>{pad(seconds)}</span>
      </div>
      <p className={`font-mono text-[8px] tracking-[0.22em] mt-3 ${mutedCls}`}>
        {T.timeUnits}
      </p>
    </div>
  )
}

export default React.memo(TimeLeftDisplay)
