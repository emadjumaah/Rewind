import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import { useT, useDir } from '../i18n'
import { X, Clock, Settings as SettingsIcon, Plus, Trash2, RotateCcw, Moon, Sun, Monitor } from 'lucide-react'

export default function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    setDeadlineModalOpen,
    toggleFocusMode,
    deadlines,
    removeDeadline,
    settings,
    updateSettings,
    toggleWidgetMode,
  } = useStore()

  const T = useT()
  const dir = useDir()

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
      label: T.cmdFocusLabel,
      desc: T.cmdFocusDesc,
      action: () => { toggleFocusMode(); setCommandPaletteOpen(false) },
      shortcut: '⌘F',
    },
    {
      icon: <Plus size={18} />,
      label: T.cmdAddLabel,
      desc: T.cmdAddDesc,
      action: () => { setDeadlineModalOpen(true); setCommandPaletteOpen(false) },
      shortcut: '⌘D',
    },
    {
      icon: <SettingsIcon size={18} />,
      label: T.cmdOpenSettings,
      desc: T.cmdOpenSettingsDesc,
      action: () => setCommandPaletteOpen(false),
      shortcut: '⌘S',
    },
    {
      icon: settings.darkMode ? <Sun size={18} /> : <Moon size={18} />,
      label: settings.darkMode ? T.cmdLightMode : T.cmdDarkMode,
      desc: settings.darkMode ? T.cmdLightModeDesc : T.cmdDarkModeDesc,
      action: () => { updateSettings({ darkMode: !settings.darkMode }); setCommandPaletteOpen(false) },
      shortcut: '⌘L',
    },
    {
      icon: <Monitor size={18} />,
      label: settings.widgetMode ? T.cmdExitWidget : T.cmdWidgetMode,
      desc: settings.widgetMode ? T.cmdExitWidgetDesc : T.cmdWidgetDesc,
      action: () => { toggleWidgetMode(); setCommandPaletteOpen(false) },
      shortcut: '⌘W',
    },
    {
      icon: <Trash2 size={18} />,
      label: T.cmdClearAll,
      desc: T.cmdClearDesc,
      action: () => { deadlines.forEach(d => removeDeadline(d.id)); setCommandPaletteOpen(false) },
      shortcut: '⌘⌫',
      destructive: true,
    },
    {
      icon: <RotateCcw size={18} />,
      label: T.cmdReset,
      desc: T.cmdResetDesc,
      action: () => { updateSettings({ focusSessionLength: 90 }); setCommandPaletteOpen(false) },
      shortcut: '⌘R',
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
          className="glass-strong rounded-2xl w-full max-w-md overflow-hidden mx-4"
          onClick={(e) => e.stopPropagation()}
          dir={dir}
        >
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <span className="text-gray-500 text-sm font-mono tracking-wide">{T.cmdTitle}</span>
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
                transition={{ delay: index * 0.04 }}
                onClick={command.action}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-left ${
                  command.destructive ? 'hover:bg-red-500/20' : ''
                }`}
              >
                <span className={command.destructive ? 'text-red-400' : 'text-gray-400'}>{command.icon}</span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-sm ${command.destructive ? 'text-red-300' : 'text-gray-200'}`}>
                    {command.label}
                  </span>
                  <span className="block text-xs text-gray-500 mt-0.5 italic">{command.desc}</span>
                </span>
                <span className="text-gray-600 text-xs font-mono shrink-0">{command.shortcut}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
