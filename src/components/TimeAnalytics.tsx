import { motion } from 'framer-motion'
import { differenceInWeeks, differenceInDays, endOfYear, endOfWeek, endOfDay, isWeekend } from 'date-fns'

export default function TimeAnalytics() {
  const now = new Date()
  const endOfDayDate = endOfDay(now)
  const endOfWeekDate = endOfWeek(now)
  const endOfYearDate = endOfYear(now)

  const msLeftToday = endOfDayDate.getTime() - now.getTime()
  const hoursLeftToday = Math.floor(msLeftToday / (1000 * 60 * 60))
  const minsLeftToday = Math.floor((msLeftToday % (1000 * 60 * 60)) / (1000 * 60))

  const weekendsLeft = differenceInWeeks(endOfYearDate, now) + (isWeekend(endOfYearDate) ? 1 : 0)
  const yearProgress = ((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (endOfYearDate.getTime() - new Date(now.getFullYear(), 0, 1).getTime())) * 100

  const workHoursLeftWeek = 40 - (differenceInDays(now, endOfWeekDate) * -8)

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
      label: `${yearProgress.toFixed(0)}% of ${now.getFullYear()} gone`,
      subtext: 'Quarter remaining: not enough.',
      progress: 1 - yearProgress / 100,
    },
    {
      label: `Work hours left this week: ${Math.max(0, workHoursLeftWeek)}`,
      subtext: 'Meetings will take half.',
      progress: Math.max(0, workHoursLeftWeek) / 40,
    },
  ]

  const getBarColor = (progress: number) => {
    if (progress > 0.6) return 'from-cyan-500/50 to-cyan-400/50'
    if (progress > 0.3) return 'from-amber-500/50 to-amber-400/50'
    return 'from-red-500/50 to-red-400/50'
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-200">Time Remaining</h2>
      <div className="space-y-2">
        {analytics.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-lg p-2"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-200 text-xs font-medium">{item.label}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-1">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: `${item.progress * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`h-full bg-gradient-to-r ${getBarColor(item.progress)} rounded-full`}
              />
            </div>
            <p className="text-gray-500 text-[10px]">{item.subtext}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
