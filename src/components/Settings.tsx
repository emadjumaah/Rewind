import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import { useT, useDir } from '../i18n'
import { ACCENT_ORDER, accentHex } from '../lib/colors'
import { X } from 'lucide-react'

export default function Settings({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { settings, updateSettings } = useStore()
  const T = useT()
  const dir = useDir()

  if (!isOpen) return null

  const selectCls = 'w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500/50'

  const notificationsSupported = typeof Notification !== 'undefined'

  const toggleNotifications = async () => {
    if (settings.notifications) {
      updateSettings({ notifications: false })
      return
    }
    if (!notificationsSupported) return
    let perm = Notification.permission
    if (perm === 'default') perm = await Notification.requestPermission()
    updateSettings({ notifications: perm === 'granted' })
  }

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
              <h2 className="text-xl font-semibold">{T.settings}</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">

              {/* Dark mode */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">{T.darkMode}</label>
                <button
                  onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                  className={`w-full px-4 py-2 rounded-lg transition-all ${
                    settings.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {settings.darkMode ? T.enabled : T.disabled}
                </button>
              </div>

              {/* Notifications */}
              {notificationsSupported && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{T.notifications}</label>
                  <button
                    onClick={toggleNotifications}
                    className={`w-full px-4 py-2 rounded-lg transition-all ${
                      settings.notifications ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {settings.notifications ? T.enabled : T.disabled}
                  </button>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">{T.notificationsHint}</p>
                </div>
              )}

              {/* Language */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">{T.language}</label>
                <div className="flex gap-2">
                  {(['en', 'ar'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => updateSettings({ language: lang })}
                      className={`flex-1 px-4 py-2 rounded-lg transition-all text-sm ${
                        (settings.language ?? 'en') === lang
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {lang === 'en' ? T.english : T.arabic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent color */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">{T.accentColor}</label>
                <div className="flex gap-3">
                  {ACCENT_ORDER.map((color) => {
                    const hex = accentHex(color)
                    const active = settings.accentColor === color
                    return (
                      <button
                        key={color}
                        onClick={() => updateSettings({ accentColor: color })}
                        className={`w-9 h-9 rounded-full border-2 transition-all ${active ? 'scale-110' : 'hover:scale-110'}`}
                        style={{
                          backgroundColor: hex,
                          borderColor: active ? '#fff' : 'transparent',
                          boxShadow: active ? `0 0 0 2px ${hex}` : 'none',
                        }}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Motion */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">{T.motionIntensity}</label>
                <select
                  value={settings.motionIntensity}
                  onChange={(e) => updateSettings({ motionIntensity: e.target.value as any })}
                  className={selectCls}
                >
                  <option value="low">{T.low}</option>
                  <option value="medium">{T.medium}</option>
                  <option value="high">{T.high}</option>
                </select>
              </div>

              {/* Time format */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">{T.timeFormat}</label>
                <select
                  value={settings.timeFormat}
                  onChange={(e) => updateSettings({ timeFormat: e.target.value as any })}
                  className={selectCls}
                >
                  <option value="12h">{T.twelveHour}</option>
                  <option value="24h">{T.twentyFourHour}</option>
                </select>
              </div>

              {/* Focus length */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">{T.focusLength}</label>
                <input
                  type="number"
                  value={settings.focusSessionLength}
                  onChange={(e) => updateSettings({ focusSessionLength: parseInt(e.target.value) || 90 })}
                  className={selectCls}
                  min="15"
                  max="180"
                  step="15"
                />
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
