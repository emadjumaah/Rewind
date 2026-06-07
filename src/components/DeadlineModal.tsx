import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore, Deadline } from '../store'
import { X } from 'lucide-react'

interface DeadlineModalProps {
  isOpen: boolean
  onClose: () => void
  deadline?: Deadline
}

export default function DeadlineModal({ isOpen, onClose, deadline }: DeadlineModalProps) {
  const { addDeadline, updateDeadline } = useStore()
  const [title, setTitle] = useState('')
  const [deadlineDate, setDeadlineDate] = useState('')
  const [estimatedHours, setEstimatedHours] = useState(8)

  useEffect(() => {
    if (deadline) {
      setTitle(deadline.title)
      setDeadlineDate(deadline.deadline.toISOString().slice(0, 16))
      setEstimatedHours(deadline.estimatedHours)
    } else {
      setTitle('')
      setDeadlineDate('')
      setEstimatedHours(8)
    }
  }, [deadline, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !deadlineDate) return

    const deadlineData = {
      title,
      deadline: new Date(deadlineDate),
      estimatedHours,
    }

    if (deadline) {
      updateDeadline(deadline.id, deadlineData)
    } else {
      addDeadline(deadlineData)
    }

    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-100">
                {deadline ? 'Edit Deadline' : 'Add Deadline'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                  placeholder="What won't you finish?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Deadline</label>
                <input
                  type="datetime-local"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-cyan-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(Number(e.target.value))}
                  min="1"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-cyan-500/50"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors"
                >
                  {deadline ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
