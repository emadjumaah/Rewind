import { motion } from 'framer-motion'
import ReverseClock from './components/ReverseClock'
import DeadlineCards from './components/DeadlineCards'
import TimeAnalytics from './components/TimeAnalytics'
import FocusMode from './components/FocusMode'
import QuoteFeed from './components/QuoteFeed'
import CommandPalette from './components/CommandPalette'
import Settings from './components/Settings'

export default function App() {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      <FocusMode />
      <CommandPalette />
      <Settings />

      <div className="container mx-auto px-4 py-4 max-w-7xl h-full flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <h1 className="text-3xl font-light text-gray-100 mb-1 tracking-tight">Rewind</h1>
          <p className="text-gray-500 text-sm">Time is always running out. Watch it go.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="glass-strong rounded-2xl p-4 h-full flex items-center justify-center">
              <ReverseClock />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 space-y-4 overflow-y-auto"
          >
            <div className="glass rounded-2xl p-4">
              <DeadlineCards />
            </div>

            <div className="glass rounded-2xl p-4">
              <TimeAnalytics />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-2 text-center"
        >
          <p className="text-gray-600 text-xs">
            Press <kbd className="px-2 py-1 bg-white/10 rounded text-gray-400">⌘K</kbd> to open command palette
          </p>
        </motion.div>
      </div>
    </div>
  )
}
