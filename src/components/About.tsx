import { motion, AnimatePresence } from 'framer-motion'
import { useT, useDir } from '../i18n'

export default function About({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const T = useT()
  const dir = useDir()

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-strong rounded-2xl w-full max-w-md p-6 mx-4"
            onClick={(e) => e.stopPropagation()}
            dir={dir}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{T.aboutTitle}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-300 transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">{T.aboutP1}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{T.aboutP2}</p>
              <div className="pt-4 border-t border-white/10">
                <p className="text-gray-500 text-xs">{T.aboutFooter}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
