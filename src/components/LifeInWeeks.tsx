import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Share2, Check, Pencil } from 'lucide-react'
import { useStore } from '../store'
import { useT, useDir } from '../i18n'
import { accentHex } from '../lib/colors'
import { drawShareCard, shareCard } from '../lib/shareCard'

const MS_PER_WEEK = 7 * 86_400_000
const COLS = 52
const pad = (n: number) => String(n).padStart(2, '0')

export default function LifeInWeeks({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { settings, updateSettings } = useStore()
  const T = useT()
  const dir = useDir()
  const lang = settings.language ?? 'en'
  const accent = accentHex(settings.accentColor)

  const lifeExpectancy = settings.lifeExpectancy || 90
  const nowYear = new Date().getFullYear()

  // Birthdate as separate Y/M/D so users pick quickly instead of fighting the
  // native picker's decade-by-decade navigation.
  const parsed = settings.birthDate ? settings.birthDate.split('-').map(Number) : []
  const [y, setY] = useState(parsed[0] || nowYear - 30)
  const [m, setM] = useState(parsed[1] || 1)
  const [d, setD] = useState(parsed[2] || 1)
  const [draftLife, setDraftLife] = useState(lifeExpectancy)
  const [shared, setShared] = useState(false)
  const [editing, setEditing] = useState(false)

  if (!isOpen) return null

  const hasBirth = !!settings.birthDate && !editing

  // ── Stats ──
  const rows = Math.max(1, Math.round(lifeExpectancy))
  const total = rows * COLS
  let lived = 0
  if (settings.birthDate) {
    const elapsed = Date.now() - new Date(settings.birthDate).getTime()
    lived = Math.min(total, Math.max(0, Math.floor(elapsed / MS_PER_WEEK)))
  }
  const left = Math.max(0, total - lived)
  const pct = total ? ((lived / total) * 100).toFixed(1) : '0'

  const months = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(lang, { month: 'long' }).format(new Date(2000, i, 1)),
  )
  const years = Array.from({ length: 101 }, (_, i) => nowYear - i)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  const handleSave = () => {
    updateSettings({
      birthDate: `${y}-${pad(m)}-${pad(d)}`,
      lifeExpectancy: Math.min(120, Math.max(1, draftLife)),
    })
    setEditing(false)
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

  const selectCls =
    'bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-gray-100 text-sm focus:outline-none focus:border-blue-500/50'

  // ── Week grid (scales to fit its bounded box, never a giant scroll) ──
  const grid = (
    <svg
      viewBox={`-1 -1 ${COLS + 1} ${rows + 1}`}
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full"
      shapeRendering="geometricPrecision"
    >
      {Array.from({ length: total }, (_, i) => {
        const isLived = i < lived
        const isNow = i === lived
        return (
          <circle
            key={i}
            cx={i % COLS}
            cy={Math.floor(i / COLS)}
            r={0.38}
            fill={isLived ? accent : 'transparent'}
            fillOpacity={isLived ? 0.85 : 0}
            stroke={isNow ? '#ffffff' : accent}
            strokeOpacity={isNow ? 1 : isLived ? 0 : 0.22}
            strokeWidth={isNow ? 0.18 : 0.07}
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
        className="fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
        dir={dir}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-bold tracking-tight text-gray-100">{T.lifeWeeks}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-200 transition-colors">
              <X size={22} />
            </button>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-5">{T.lifeWeeksIntro}</p>

          {!hasBirth ? (
            <div className="glass-strong rounded-2xl p-6">
              <p className="text-gray-300 mb-4">{T.lifeWeeksSetup}</p>
              <label className="block text-sm text-gray-400 mb-1.5">{T.birthDateLabel}</label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <select value={d} onChange={(e) => setD(+e.target.value)} className={selectCls}>
                  {days.map((day) => <option key={day} value={day}>{day}</option>)}
                </select>
                <select value={m} onChange={(e) => setM(+e.target.value)} className={selectCls}>
                  {months.map((name, i) => <option key={i} value={i + 1}>{name}</option>)}
                </select>
                <select value={y} onChange={(e) => setY(+e.target.value)} className={selectCls}>
                  {years.map((yr) => <option key={yr} value={yr}>{yr}</option>)}
                </select>
              </div>
              <label className="block text-sm text-gray-400 mb-1.5">{T.lifeExpectancyLabel}</label>
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
                className="w-full py-2.5 rounded-lg font-medium transition-colors"
                style={{ backgroundColor: accent + '26', color: accent }}
              >
                {T.save}
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-end gap-x-6 gap-y-2 mb-4">
                <div>
                  <div className="text-4xl font-bold tabular-nums leading-none" style={{ color: accent }}>
                    {left.toLocaleString(lang)}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{T.lifeWeeksLeft(left)}</div>
                </div>
                <div className="text-sm text-gray-400">
                  <div>{T.lifeWeeksLived(lived)}</div>
                  <div>{T.lifeWeeksSpent(pct)}</div>
                </div>
                <div className="ms-auto flex gap-2">
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors"
                  >
                    <Pencil size={15} />
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
              <div className="glass rounded-2xl p-4 flex items-center justify-center" style={{ height: '56vh' }}>
                {grid}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
