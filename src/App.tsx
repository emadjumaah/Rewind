import { useState } from 'react'
import { motion } from 'framer-motion'
import ReverseClock from './components/ReverseClock'
import ContextSentence from './components/ContextSentence'
import DeadlineCards from './components/DeadlineCards'
import TimeAnalytics from './components/TimeAnalytics'
import TimeLeftDisplay from './components/TimeLeftDisplay'
import FocusMode from './components/FocusMode'
import CommandPalette from './components/CommandPalette'
import Settings from './components/Settings'
import About from './components/About'
import { useStore } from './store'
import { Maximize2, Settings as SettingsIcon, Clock, Info } from 'lucide-react'

export default function App() {
  const { settings, toggleFocusMode } = useStore()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const themeClass = settings.darkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100'

  if (settings.widgetMode) {
    return (
      <div className={`fixed inset-0 ${settings.darkMode ? 'bg-gray-950' : 'bg-gray-100'} flex items-center justify-center p-4`}>
        <div className={`glass-strong rounded-2xl p-6 max-w-sm w-full ${settings.darkMode ? '' : 'bg-white/80'}`}>
          <div className="aspect-square max-h-[50vh] mx-auto mb-4">
            <ReverseClock />
          </div>
          <div className="text-center">
            <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Widget Mode</p>
            <p className={`text-xs mt-1 ${settings.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Press ⌘W to exit</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-screen w-screen ${themeClass} overflow-hidden p-3 relative`}>
      {/* Ambient background system */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 via-transparent to-purple-900/5"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ backgroundSize: '200% 200%' }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-tl from-amber-900/3 via-transparent to-cyan-900/3"
          animate={{
            backgroundPosition: ['100% 100%', '0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 70,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ backgroundSize: '300% 300%' }}
        />
        {/* Floating particles - reduced for performance */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-cyan-500/20 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              opacity: 0,
            }}
            animate={{
              y: [null, Math.random() * 100 + '%'],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 30,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>

      <FocusMode />
      <CommandPalette />
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <About isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      <div className="h-full flex flex-col gap-2 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center flex items-center justify-between px-4"
        >
          <h1 className={`text-2xl font-light tracking-tight ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Rewind</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAboutOpen(true)}
              className={`${settings.darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors hover:scale-110 active:scale-95`}
              title="About"
            >
              <Info size={20} />
            </button>
            <button
              onClick={toggleFocusMode}
              className={`${settings.darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors hover:scale-110 active:scale-95`}
              title="Focus Mode"
            >
              <Clock size={20} />
            </button>
            <button
              onClick={toggleFullscreen}
              className={`${settings.darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors hover:scale-110 active:scale-95`}
              title="Fullscreen"
            >
              <Maximize2 size={20} />
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`${settings.darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors hover:scale-110 active:scale-95`}
              title="Settings"
            >
              <SettingsIcon size={20} />
            </button>
          </div>
        </motion.div>

        <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-5 flex flex-col gap-3"
          >
            <div className="glass-strong rounded-xl p-4 flex-1 flex items-center justify-center">
              <ReverseClock />
            </div>
            <ContextSentence />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="col-span-7 grid  gap-3 overflow-y-auto"
          >
            <TimeLeftDisplay />
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
