import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Share2, Check } from 'lucide-react'
import { useStore } from '../store'
import { useT, useDir } from '../i18n'
import { accentHex } from '../lib/colors'
import { drawShareCard, shareCard } from '../lib/shareCard'

const MS_PER_WEEK = 7 * 86_400_000
const COLS = 52

export default function LifeInWeeks({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { settings, updateSettings } = useStore()
  const T = useT()
  const dir = useDir()
  const lang = settings.language ?? 'en'
  const accent = accentHex(settings.accentColor)

  // Fall back for users whose persisted settings predate this field.
  const lifeExpectancy = settings.lifeExpectancy || 90
  const [draftDate, setDraftDate] = useState(settings.birthDate ?? '')
  const [draftLife, setDraftLife] = useState(lifeExpectancy)
  const [shared, setShared] = useState(false)

  if (!isOpen) return null

  const hasBirth = !!settings.birthDate
  const today = new Date().toISOString().slice(0, 10)

  // ── Stats ──
  const rows = Math.max(1, Math.round(lifeExpectancy))
  const total = rows * COLS
  let lived = 0
  if (hasBirth) {
    const elapsed = Date.now() - new Date(settings.birthDate!).getTime()
    lived = Math.min(total, Math.max(0, Math.floor(elapsed / MS_PER_WEEK)))
  }
  const left = Math.max(0, total - lived)
  const pct = total ? ((lived / total) * 100).toFixed(1) : '0'

  const handleSave = () => {
    if (!draftDate) return
    updateSettings({ birthDate: draftDate, lifeExpectancy: Math.min(120, Math.max(1, draftLife)) })
  }

  const handleShare = async () => {
    const canvas = drawShareCard({
      accent,
      bigStat: left.toLocaleString(lang),
      statLabel: lang === 'ar' ? 'أسبوع باقٍ' : 'weeks left',
      caption: T.shareWeeksLine(left),
      rtl: dir === 'rtl',
    })
    const result = await shareCard(canvas, {
      title: T.shareSocialTitle,
      text: T.shareWeeksLine(left),
      url: 'https://rewind.uts.qa',
    })
    if (result === 'downloaded') {
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  // ── Week grid (SVG, rendered once on open) ──
  const STEP = 13
  const CELL = 10
  const grid = (
    <svg
      viewBox={`0 0 ${COLS * STEP} ${rows * STEP}`}
      className="w-full h-auto"
      shapeRendering="crispEdges"
    >
      {Array.from({ length: total }, (_, i) => {
        const col = i % COLS
        const row = Math.floor(i / COLS)
        const isLived = i < lived
        const isNow = i === lived
        return (
          <rect
            key={i}
            x={col * STEP}
            y={row * STEP}
            width={CELL}
            height={CELL}
            rx={1.5}
            fill={isLived ? accent : 'transparent'}
            fillOpacity={isLived ? 0.85 : 0}
            stroke={isNow ? '#ffffff' : accent}
            strokeOpacity={isNow ? 0.9 : isLived ? 0 : 0.18}
            strokeWidth={isNow ? 1.2 : 0.7}
          />
        )
      })}
    </svg>
  )

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
        dir={dir}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="min-h-full max-w-3xl mx-auto px-5 py-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold tracking-tight text-gray-100">{T.lifeWeeks}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-200 transition-colors">
              <X size={22} />
            </button>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">{T.lifeWeeksIntro}</p>

          {!hasBirth ? (
            <div className="glass-strong rounded-2xl p-6 max-w-md">
              <p className="text-gray-300 mb-4">{T.lifeWeeksSetup}</p>
              <label className="block text-sm text-gray-400 mb-1">{T.birthDateLabel}</label>
              <input
                type="date"
                max={today}
                value={draftDate}
                onChange={(e) => setDraftDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-gray-100 mb-4 focus:outline-none focus:border-blue-500/50"
              />
              <label className="block text-sm text-gray-400 mb-1">{T.lifeExpectancyLabel}</label>
              <input
                type="number"
                min={1}
                max={120}
                value={draftLife}
                onChange={(e) => setDraftLife(Number(e.target.value) || 90)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-gray-100 mb-5 focus:outline-none focus:border-blue-500/50"
              />
              <button
                onClick={handleSave}
                disabled={!draftDate}
                className="w-full py-2.5 rounded-lg font-medium transition-colors disabled:opacity-40"
                style={{ backgroundColor: accent + '26', color: accent }}
              >
                {T.save}
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-end gap-x-8 gap-y-2 mb-6">
                <div>
                  <div className="text-4xl font-bold tabular-nums" style={{ color: accent }}>
                    {left.toLocaleString(lang)}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{T.lifeWeeksLeft(left)}</div>
                </div>
                <div className="text-sm text-gray-400">
                  <div>{T.lifeWeeksLived(lived)}</div>
                  <div>{T.lifeWeeksSpent(pct)}</div>
                </div>
                <div className="ms-auto flex gap-2">
                  <button
                    onClick={() => updateSettings({ birthDate: undefined })}
                    className="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors"
                  >
                    {T.birthDateLabel}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{ backgroundColor: accent + '26', color: accent }}
                  >
                    {shared ? <Check size={16} /> : <Share2 size={16} />}
                    {shared ? T.shareCopied : T.share}
                  </button>
                </div>
              </div>
              <div className="glass rounded-2xl p-4 md:p-6">{grid}</div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
