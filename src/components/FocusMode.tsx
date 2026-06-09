import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Pause } from 'lucide-react'
import { useStore } from '../store'
import { useT } from '../i18n'

export default function FocusMode() {
  const { isFocusMode, toggleFocusMode, settings } = useStore()
  const T = useT()
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
    let interval: ReturnType<typeof setInterval>
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = timeLeft / (settings.focusSessionLength * 60)

  if (!isFocusMode) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        className="fixed inset-0 bg-gray-950 z-50 flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10"
            animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ backgroundSize: '200% 200%' }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-tl from-amber-900/5 via-transparent to-blue-900/5"
            animate={{ backgroundPosition: ['100% 100%', '0% 0%', '100% 100%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            style={{ backgroundSize: '300% 300%' }}
          />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
              initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%', opacity: 0 }}
              animate={{ y: [null, Math.random() * 100 + '%'], opacity: [0, 0.6, 0] }}
              transition={{
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <button
          onClick={toggleFocusMode}
          className="absolute top-8 right-8 text-gray-500 hover:text-gray-300 transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="text-center relative z-10">
          <AnimatePresence mode="wait">
            {showMessage && timeLeft === settings.focusSessionLength * 60 && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-gray-400 text-lg mb-8 tracking-wide"
              >
                {T.focusPrompt(settings.focusSessionLength)}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative"
          >
            <svg className="w-96 h-96 mx-auto mb-8" viewBox="0 0 200 200">
              <defs>
                <radialGradient id="focusGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
                  <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="95" fill="url(#focusGradient)" />
              <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
              <motion.circle
                cx="100" cy="100" r="95"
                fill="none"
                stroke="rgba(59, 130, 246, 0.5)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 95}
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 95 * (1 - progress) }}
                transition={{ duration: 1 }}
                style={{ transform: 'scaleX(-1) rotate(-90deg)', transformOrigin: '100px 100px' }}
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-9xl font-light text-gray-100 tabular-nums tracking-tight"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </motion.div>
            </div>
          </motion.div>

          {timeLeft === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 text-lg tracking-wide"
            >
              {T.focusDone}
            </motion.p>
          )}

          {timeLeft > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setIsActive(!isActive); setShowMessage(false) }}
              className={`mt-8 px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2 mx-auto ${
                isActive
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30'
              }`}
            >
              {isActive ? <Pause size={18} /> : <Play size={18} />}
              {isActive ? T.focusPause : T.focusStart}
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
