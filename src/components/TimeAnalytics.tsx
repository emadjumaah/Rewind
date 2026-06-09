import React from 'react'
import { useT } from '../i18n'
import DrainCircle from './DrainCircle'
import { msLeftToday, hms, weekendsLeftInYear, yearElapsed, workHoursLeftThisWeek } from '../lib/time'

function TimeAnalytics({ currentTime }: { currentTime: Date }) {
  const T = useT()

  const msToday = msLeftToday(currentTime)
  const { hours: hoursLeftToday, minutes: minsLeftToday } = hms(msToday)
  const weekendsLeft = weekendsLeftInYear(currentTime)
  const yearPct = yearElapsed(currentTime) * 100
  const workHoursLeftWeek = workHoursLeftThisWeek(currentTime)

  const analytics = [
    {
      label: T.todayLeft(hoursLeftToday, minsLeftToday),
      subtext: T.todaySubtext,
      progress: msToday / (24 * 60 * 60 * 1000),
    },
    {
      label: T.weekendsLeft(weekendsLeft),
      subtext: T.weekendsSubtext,
      progress: weekendsLeft / 52,
    },
    {
      label: T.yearGone(yearPct.toFixed(0), currentTime.getFullYear()),
      subtext: T.yearSubtext,
      progress: 1 - yearPct / 100,
    },
    {
      label: T.workHoursLeft(workHoursLeftWeek),
      subtext: T.workHoursSubtext,
      progress: workHoursLeftWeek / 40,
    },
  ]

  const getRingColor = (progress: number) => {
    if (progress > 0.6) return 'rgba(59, 130, 246, 0.8)'
    if (progress > 0.3) return 'rgba(245, 158, 11, 0.8)'
    return 'rgba(239, 68, 68, 0.8)'
  }

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-gray-300 tracking-wide uppercase">{T.sectionTimeRemaining}</h2>
      <div className="grid grid-cols-2 gap-2">
        {analytics.map((item, index) => {
          const ringColor = getRingColor(item.progress)
          const pct = Math.round(Math.max(0, Math.min(1, item.progress)) * 100)
          return (
            <div key={index} className="glass rounded-lg p-2.5 flex items-center gap-2.5">
              <div className="relative shrink-0 w-11 h-11">
                <DrainCircle size={44} progress={item.progress} color={ringColor} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-semibold tabular-nums text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    {pct}%
                  </span>
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-gray-200 text-xs font-medium leading-tight">{item.label}</p>
                <p className="text-gray-500 text-[10px] leading-snug mt-0.5">{item.subtext}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default React.memo(TimeAnalytics, (prev, next) =>
  prev.currentTime.getMinutes() === next.currentTime.getMinutes() &&
  prev.currentTime.getHours() === next.currentTime.getHours()
)
