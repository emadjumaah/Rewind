import React from 'react'
import { endOfYear, endOfDay, differenceInWeeks, isWeekend } from 'date-fns'
import { useT } from '../i18n'

function TimeAnalytics({ currentTime }: { currentTime: Date }) {
  const T = useT()

  const endOfDayDate = endOfDay(currentTime)
  const endOfYearDate = endOfYear(currentTime)

  const msLeftToday = endOfDayDate.getTime() - currentTime.getTime()
  const hoursLeftToday = Math.floor(msLeftToday / (1000 * 60 * 60))
  const minsLeftToday = Math.floor((msLeftToday % (1000 * 60 * 60)) / (1000 * 60))

  const weekendsLeft = differenceInWeeks(endOfYearDate, currentTime) + (isWeekend(endOfYearDate) ? 1 : 0)

  const yearStart = new Date(currentTime.getFullYear(), 0, 1)
  const yearProgress = ((currentTime.getTime() - yearStart.getTime()) / (endOfYearDate.getTime() - yearStart.getTime())) * 100

  const dayOfWeek = currentTime.getDay()
  const isWorkday = dayOfWeek >= 1 && dayOfWeek <= 5
  const totalMinsToday = currentTime.getHours() * 60 + currentTime.getMinutes()
  const todayHoursLeft = isWorkday ? Math.max(0, (17 * 60 - totalMinsToday) / 60) : 0
  const fullDaysAfterToday = isWorkday ? Math.max(0, 5 - dayOfWeek) : 0
  const workHoursLeftWeek = Math.round(fullDaysAfterToday * 8 + todayHoursLeft)

  const analytics = [
    {
      label: T.todayLeft(hoursLeftToday, minsLeftToday),
      subtext: T.todaySubtext,
      progress: msLeftToday / (24 * 60 * 60 * 1000),
    },
    {
      label: T.weekendsLeft(weekendsLeft),
      subtext: T.weekendsSubtext,
      progress: weekendsLeft / 52,
    },
    {
      label: T.yearGone(yearProgress.toFixed(0), currentTime.getFullYear()),
      subtext: T.yearSubtext,
      progress: 1 - yearProgress / 100,
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
          const circumference = 2 * Math.PI * 28
          const strokeDashoffset = circumference * (1 - Math.max(0, Math.min(1, item.progress)))
          const ringColor = getRingColor(item.progress)

          return (
            <div key={index} className="glass rounded-lg p-3 flex flex-col items-center">
              <div className="relative mb-2">
                <svg className="w-16 h-16" viewBox="0 0 60 60">
                  <defs>
                    <radialGradient id={`ag-${index}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={ringColor} stopOpacity="0.2" />
                      <stop offset="100%" stopColor={ringColor} stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="30" cy="30" r="28" fill={`url(#ag-${index})`} />
                  <circle cx="30" cy="30" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                  <circle
                    cx="30" cy="30" r="28"
                    fill="none"
                    stroke={ringColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: '30px 30px',
                      transition: 'stroke-dashoffset 1s linear',
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold tabular-nums">
                    {Math.round(item.progress * 100)}%
                  </span>
                </div>
              </div>
              <span className="text-gray-200 text-xs font-medium tracking-tight text-center leading-tight">
                {item.label}
              </span>
              <p className="text-gray-500 text-[10px] text-center mt-1 leading-snug">{item.subtext}</p>
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
