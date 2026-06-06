import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useStore } from '../store'

export default function FocusMode() {
  const { isFocusMode, toggleFocusMode, settings } = useStore()
  const [timeLeft, setTimeLeft] = useState(settings.focusSessionLength * 60)
  const [isActive, setIsActive] = useState(false)
  const [showMessage, setShowMessage] = useState(true)

  useEffect(() => {
    if (!isFocusMode) {
      setTimeLeft(settings.focusSessionLength * 60)
      setIsActive(false)
      setShowMessage(true)
    }
  }, [isFocusMode, settings.focusSessionLength])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  if (!isFocusMode) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-950 z-50 flex items-center justify-center"
      >
        <button
          onClick={toggleFocusMode}
          className="absolute top-8 right-8 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <AnimatePresence mode="wait">
            {showMessage && timeLeft === settings.focusSessionLength * 60 && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-gray-400 text-lg mb-8"
              >
                {settings.focusSessionLength} minutes. No excuses. We'll see.
              </motion.p>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-8xl font-light text-gray-100 mb-8 font-mono"
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </motion.div>

          {timeLeft === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 text-lg"
            >
              Done. Or you gave up. Either way, time passed.
            </motion.p>
          )}

          {timeLeft > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsActive(!isActive)
                setShowMessage(false)
              }}
              className={`mt-8 px-8 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              }`}
            >
              {isActive ? 'Pause' : 'Start'}
            </motion.button>
          )}
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-500/20 rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-500/20 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-amber-500/20 rounded-full animate-pulse delay-500" />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
