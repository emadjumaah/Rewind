import { motion } from 'framer-motion'
import { differenceInWeeks, differenceInDays, endOfYear, endOfWeek, endOfDay, isWeekend } from 'date-fns'

export default function TimeAnalytics({ currentTime }: { currentTime: Date }) {
  const endOfDayDate = endOfDay(currentTime)
  const endOfWeekDate = endOfWeek(currentTime)
  const endOfYearDate = endOfYear(currentTime)

  const msLeftToday = endOfDayDate.getTime() - currentTime.getTime()
  const hoursLeftToday = Math.floor(msLeftToday / (1000 * 60 * 60))
  const minsLeftToday = Math.floor((msLeftToday % (1000 * 60 * 60)) / (1000 * 60))

  const weekendsLeft = differenceInWeeks(endOfYearDate, currentTime) + (isWeekend(endOfYearDate) ? 1 : 0)
  const yearProgress = ((currentTime.getTime() - new Date(currentTime.getFullYear(), 0, 1).getTime()) / (endOfYearDate.getTime() - new Date(currentTime.getFullYear(), 0, 1).getTime())) * 100

  const workHoursLeftWeek = 40 - (differenceInDays(currentTime, endOfWeekDate) * -8)

  const analytics = [
    {
      label: `${hoursLeftToday}h ${minsLeftToday}m left today`,
      subtext: 'You probably need double that.',
      progress: msLeftToday / (24 * 60 * 60 * 1000),
    },
    {
      label: `${weekendsLeft} weekends left this year`,
      subtext: 'Plan accordingly. Or don\'t.',
      progress: weekendsLeft / 52,
    },
    {
      label: `${yearProgress.toFixed(0)}% of ${currentTime.getFullYear()} gone`,
      subtext: 'Quarter remaining: not enough.',
      progress: 1 - yearProgress / 100,
    },
    {
      label: `Work hours left this week: ${Math.max(0, workHoursLeftWeek)}`,
      subtext: 'Meetings will take half.',
      progress: Math.max(0, workHoursLeftWeek) / 40,
    },
  ]

  const getRingColor = (progress: number) => {
    if (progress > 0.6) return 'rgba(6, 182, 212, 0.8)'
    if (progress > 0.3) return 'rgba(245, 158, 11, 0.8)'
    return 'rgba(239, 68, 68, 0.8)'
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-200">Time Remaining</h2>
      <div className="grid grid-cols-2 gap-2">
        {analytics.map((item, index) => {
          const circumference = 2 * Math.PI * 28
          const strokeDashoffset = circumference * (1 - item.progress)
          const ringColor = getRingColor(item.progress)

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-lg p-3 flex flex-col items-center"
            >
              <div className="relative mb-2">
                <svg className="w-16 h-16" viewBox="0 0 60 60">
                  <defs>
                    <radialGradient id={`analyticsGradient-${index}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={ringColor} stopOpacity="0.2" />
                      <stop offset="100%" stopColor={ringColor} stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle
                    cx="30"
                    cy="30"
                    r="28"
                    fill={`url(#analyticsGradient-${index})`}
                  />
                  <circle
                    cx="30"
                    cy="30"
                    r="28"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="3"
                  />
                  <motion.circle
                    cx="30"
                    cy="30"
                    r="28"
                    fill="none"
                    stroke={ringColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '30px 30px' }}
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
              <p className="text-gray-500 text-[10px] text-center mt-1">{item.subtext}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
