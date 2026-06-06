import { motion } from 'framer-motion'
import ReverseClock from './components/ReverseClock'
import DeadlineCards from './components/DeadlineCards'
import TimeAnalytics from './components/TimeAnalytics'
import FocusMode from './components/FocusMode'
import CommandPalette from './components/CommandPalette'
import Settings from './components/Settings'

export default function App() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden p-3">
      <FocusMode />
      <CommandPalette />
      <Settings />

      <div className="h-full flex flex-col gap-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-2xl font-light text-gray-100 tracking-tight">Rewind</h1>
        </motion.div>

        <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-5"
          >
            <div className="glass-strong rounded-xl p-4 h-full flex items-center justify-center">
              <ReverseClock />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="col-span-7 grid grid-rows-2 gap-3 overflow-y-auto"
          >
            <div className="glass rounded-xl p-3">
              <DeadlineCards />
            </div>

            <div className="glass rounded-xl p-3">
              <TimeAnalytics />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
