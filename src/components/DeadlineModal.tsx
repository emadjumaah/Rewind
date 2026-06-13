import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore, Deadline, DeadlineCategory } from '../store'
import { useT, useDir } from '../i18n'
import { X, Briefcase, Heart } from 'lucide-react'

interface DeadlineModalProps {
  isOpen: boolean
  onClose: () => void
  deadline?: Deadline
}

export default function DeadlineModal({ isOpen, onClose, deadline }: DeadlineModalProps) {
  const { addDeadline, updateDeadline } = useStore()
  const T = useT()
  const dir = useDir()

  const [title, setTitle] = useState('')
  const [deadlineDate, setDeadlineDate] = useState('')
  const [estimatedHours, setEstimatedHours] = useState(8)
  const [category, setCategory] = useState<DeadlineCategory>('work')

  useEffect(() => {
    if (deadline) {
      setTitle(deadline.title)
      // A datetime-local input speaks local wall-clock time. toISOString() is
      // UTC, so feeding it directly shifted the value by the viewer's offset on
      // every edit — re-saving an untouched deadline silently moved it. Offset
      // by the timezone so the input shows the same local time it was set to.
      const d = deadline.deadline
      const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      setDeadlineDate(local.toISOString().slice(0, 16))
      setEstimatedHours(deadline.estimatedHours)
      setCategory(deadline.category ?? 'work')
    } else {
      setTitle('')
      setDeadlineDate('')
      setEstimatedHours(8)
      setCategory('work')
    }
  }, [deadline, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !deadlineDate) return
    const deadlineData = {
      title,
      deadline: new Date(deadlineDate),
      estimatedHours: category === 'life' ? 0 : estimatedHours,
      category,
    }
    if (deadline) {
      updateDeadline(deadline.id, deadlineData)
    } else {
      addDeadline(deadlineData)
    }
    onClose()
  }

  const lifePresets = [T.lifePresetBirthday, T.lifePresetTrip, T.lifePresetMilestone]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4 md:p-0"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-t-2xl md:rounded-2xl p-6 w-full md:max-w-md"
            dir={dir}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-100">
                {deadline ? T.editDeadline : T.addDeadline}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">{T.categoryLabel}</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { key: 'work' as const, label: T.categoryWork, icon: <Briefcase size={15} /> },
                    { key: 'life' as const, label: T.categoryLife, icon: <Heart size={15} /> },
                  ]).map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setCategory(opt.key)}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                        category === opt.key
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
                      }`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">{T.titleLabel}</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                  placeholder={category === 'life' ? T.lifeTitlePlaceholder : T.deadlinePlaceholder}
                  required
                />
                {category === 'life' && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {lifePresets.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setTitle(p)}
                        className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">{T.deadlineLabel}</label>
                <input
                  type="datetime-local"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500/50"
                  required
                />
              </div>

              {category === 'work' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">{T.estimatedHours}</label>
                  <input
                    type="number"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Number(e.target.value))}
                    min="1"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
                >
                  {T.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                >
                  {deadline ? T.update : T.add}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
