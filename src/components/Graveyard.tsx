import { motion, AnimatePresence } from 'framer-motion'
import { X, Skull } from 'lucide-react'
import { differenceInDays } from 'date-fns'
import { useStore, BuriedDeadline } from '../store'
import { useT, useDir } from '../i18n'

function Tombstone({ buried, index }: { buried: BuriedDeadline; index: number }) {
  const T = useT()
  const { settings, removeBuried } = useStore()
  const lang = settings.language ?? 'en'
  const locale = lang === 'ar' ? 'ar' : 'en-US'

  const fmt = (d: Date) => d.toLocaleDateString(locale, { month: 'short', day: 'numeric' })
  const daysLate = differenceInDays(buried.buriedAt, buried.deadline)

  const verdict =
    buried.madeIt === null
      ? { label: T.graveyardBadgePassed, cls: 'text-gray-400 border-gray-500/30 bg-gray-500/10' }
      : buried.madeIt
        ? { label: T.graveyardBadgeMadeIt, cls: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' }
        : { label: T.graveyardBadgeMissed, cls: 'text-red-400 border-red-500/30 bg-red-500/10' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="relative rounded-t-[2.5rem] rounded-b-lg border border-white/10 bg-white/5 px-3 pt-6 pb-4 text-center group"
    >
      <button
        onClick={() => removeBuried(buried.id)}
        className="absolute top-2 end-2 text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
        title={T.graveyardForget}
      >
        <X size={13} />
      </button>

      <Skull size={16} className="mx-auto text-gray-600 mb-2" />
      <h3 className="text-sm font-semibold text-gray-200 truncate px-2" title={buried.title}>
        {buried.title}
      </h3>
      <p className="text-[10px] text-gray-500 mt-1 tabular-nums">
        {T.graveyardLifespan(fmt(buried.deadline), fmt(buried.buriedAt))}
      </p>
      {buried.madeIt !== null && (
        <p className="text-[10px] text-gray-600 mt-0.5">{T.graveyardLate(daysLate)}</p>
      )}
      <span
        className={`inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full border ${verdict.cls}`}
      >
        {verdict.label}
      </span>
    </motion.div>
  )
}

export default function Graveyard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { graveyard } = useStore()
  const T = useT()
  const dir = useDir()

  if (!isOpen) return null

  // Life events just pass — only work deadlines get judged.
  const judged = graveyard.filter((b) => b.madeIt !== null)
  const madeIt = judged.filter((b) => b.madeIt).length
  const missed = judged.length - madeIt

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
          className="w-full max-w-2xl max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-bold tracking-tight text-gray-100 flex items-center gap-2.5">
              <Skull size={22} className="text-gray-500" />
              {T.graveyardTitle}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-200 transition-colors">
              <X size={22} />
            </button>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">{T.graveyardIntro}</p>

          {graveyard.length === 0 ? (
            <div className="glass-strong rounded-2xl p-10 text-center">
              <Skull size={28} className="mx-auto text-gray-700 mb-3" />
              <p className="text-gray-500 text-sm">{T.graveyardEmpty}</p>
            </div>
          ) : (
            <>
              <div className="glass-strong rounded-xl px-4 py-3 mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="text-sm font-semibold text-gray-200 tabular-nums">
                  {T.graveyardCount(graveyard.length)}
                </span>
                {judged.length > 0 && (
                  <span className="text-xs text-gray-400 tabular-nums">
                    {T.graveyardScore(madeIt, missed)}
                  </span>
                )}
                <span className="text-xs text-gray-500 italic ms-auto">
                  {T.graveyardCommentary(madeIt, missed)}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto pr-1 pb-2">
                {graveyard.map((buried, i) => (
                  <Tombstone key={buried.id} buried={buried} index={i} />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
