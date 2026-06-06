import { motion, AnimatePresence } from 'framer-motion'

export default function About({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
            className="glass-strong rounded-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">About Rewind</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                The numbers are mirrored because the way we experience time is backwards — we think we have more than we do, until we don't.
              </p>
              
              <p className="text-gray-400 text-sm leading-relaxed">
                Rewind tracks what remains, not what has passed. The clock runs backward because our perception of time is inverted: we always assume there's more, until suddenly there isn't.
              </p>

              <div className="pt-4 border-t border-white/10">
                <p className="text-gray-500 text-xs">
                  Built with modern tools to track ancient problems.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
