import { motion } from 'framer-motion'
import { useStore, Deadline } from '../store'
import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns'
import { X } from 'lucide-react'

function getUrgencyColor(deadline: Date): string {
  const hoursLeft = differenceInHours(deadline, new Date())
  if (hoursLeft < 24) return 'border-red-500/50 shadow-red-500/20'
  if (hoursLeft < 72) return 'border-amber-500/50 shadow-amber-500/20'
  if (hoursLeft < 168) return 'border-blue-500/50 shadow-blue-500/20'
  return 'border-cyan-500/50 shadow-cyan-500/20'
}

function getUrgencyText(deadline: Date, estimatedHours: number): string {
  const now = new Date()
  const daysLeft = differenceInDays(deadline, now)
  const hoursLeft = differenceInHours(deadline, now)
  const workHoursLeft = Math.max(0, hoursLeft - (daysLeft * 16))

  if (hoursLeft < 24) {
    return `${hoursLeft}h left. You need ${estimatedHours}h. This is not happening.`
  }
  if (hoursLeft < 72) {
    return `${daysLeft} days, ${hoursLeft % 24}h left. You need ${estimatedHours}h. This is a you problem.`
  }
  if (estimatedHours > workHoursLeft) {
    return `${daysLeft} days left. You need ${estimatedHours}h. You have ${workHoursLeft}h work hours. Good luck.`
  }
  return `${daysLeft} days left. You need ${estimatedHours}h. This is fine. Probably.`
}

function DeadlineCard({ deadline, onRemove }: { deadline: Deadline; onRemove: (id: string) => void }) {
  const now = new Date()
  const deadlineDate = deadline.deadline instanceof Date ? deadline.deadline : new Date(deadline.deadline)
  const totalHours = differenceInHours(deadlineDate, new Date(deadlineDate.getTime() - 30 * 24 * 60 * 60 * 1000))
  const hoursLeft = differenceInHours(deadlineDate, now)
  const progress = Math.max(0, Math.min(1, hoursLeft / totalHours))
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-6 relative ${getUrgencyColor(deadlineDate)}`}
    >
      <button
        onClick={() => onRemove(deadline.id)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
      >
        <X size={16} />
      </button>

      <div className="flex items-start gap-4">
        <div className="relative">
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1 }}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold">
              {differenceInDays(deadlineDate, now)}d
            </span>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{deadline.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {getUrgencyText(deadlineDate, deadline.estimatedHours)}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            {deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function DeadlineCards() {
  const { deadlines, removeDeadline } = useStore()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-200">Deadlines</h2>
      <div className="grid gap-4">
        {deadlines.map((deadline) => (
          <DeadlineCard key={deadline.id} deadline={deadline} onRemove={removeDeadline} />
        ))}
      </div>
    </div>
  )
}
