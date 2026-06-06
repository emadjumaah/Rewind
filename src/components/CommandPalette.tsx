import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import { X, Clock, Settings as SettingsIcon, Plus, Trash2, RotateCcw, Moon, Sun, Monitor } from 'lucide-react'

export default function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    toggleFocusMode,
    deadlines,
    removeDeadline,
    settings,
    updateSettings,
    toggleWidgetMode
  } = useStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(!isCommandPaletteOpen)
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCommandPaletteOpen, setCommandPaletteOpen])

  const commands = [
    {
      icon: <Clock size={18} />,
      label: 'Start Focus Mode',
      action: () => {
        toggleFocusMode()
        setCommandPaletteOpen(false)
      },
      shortcut: '⌘K',
    },
    {
      icon: <Plus size={18} />,
      label: 'Add Deadline',
      action: () => {
        setCommandPaletteOpen(false)
      },
      shortcut: '⌘D',
    },
    {
      icon: <SettingsIcon size={18} />,
      label: 'Open Settings',
      action: () => {
        setCommandPaletteOpen(false)
      },
      shortcut: '⌘S',
    },
    {
      icon: <Trash2 size={18} />,
      label: 'Clear All Deadlines',
      action: () => {
        deadlines.forEach(d => removeDeadline(d.id))
        setCommandPaletteOpen(false)
      },
      shortcut: '⌘⌫',
      destructive: true,
    },
    {
      icon: <RotateCcw size={18} />,
      label: 'Reset Settings',
      action: () => {
        updateSettings({ focusSessionLength: 25 })
        setCommandPaletteOpen(false)
      },
      shortcut: '⌘R',
    },
    {
      icon: settings.darkMode ? <Sun size={18} /> : <Moon size={18} />,
      label: settings.darkMode ? 'Light Mode' : 'Dark Mode',
      action: () => {
        updateSettings({ darkMode: !settings.darkMode })
        setCommandPaletteOpen(false)
      },
      shortcut: '⌘L',
    },
    {
      icon: <Monitor size={18} />,
      label: settings.widgetMode ? 'Exit Widget Mode' : 'Widget Mode',
      action: () => {
        toggleWidgetMode()
        setCommandPaletteOpen(false)
      },
      shortcut: '⌘W',
    },
  ]

  if (!isCommandPaletteOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-32"
        onClick={() => setCommandPaletteOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="glass-strong rounded-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <span className="text-gray-400 text-sm">Type a command or search...</span>
            <button
              onClick={() => setCommandPaletteOpen(false)}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-2">
            {commands.map((command, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={command.action}
                className={`w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-colors text-left ${
                  command.destructive ? 'hover:bg-red-500/20' : ''
                }`}
              >
                <span className={command.destructive ? 'text-red-400' : 'text-gray-400'}>{command.icon}</span>
                <span className={`flex-1 ${command.destructive ? 'text-red-300' : 'text-gray-200'}`}>{command.label}</span>
                <span className="text-gray-500 text-xs">{command.shortcut}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
