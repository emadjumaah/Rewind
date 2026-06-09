import { useState, useEffect } from 'react'
import React from 'react'
import { Hourglass } from 'lucide-react'
import { useStore } from '../store'
import { accentHex } from '../lib/colors'
import { hoursUntil, dayRemaining, yearElapsed } from '../lib/time'
import { sentenceSetFor, generateSentence, SentenceCtx } from '../lib/sentences'

function buildCtx(deadlines: { deadline: Date }[], now: Date): SentenceCtx {
  const urgentCount = deadlines.filter((d) => {
    const date = d.deadline instanceof Date ? d.deadline : new Date(d.deadline)
    const h = hoursUntil(date, now)
    return h >= 0 && h < 24
  }).length
  return {
    hour: now.getHours(),
    day: now.getDay(),
    urgentCount,
    dayRemaining: dayRemaining(now),
    yearPct: yearElapsed(now) * 100,
  }
}

function ContextSentence() {
  const { deadlines, settings } = useStore()
  const [context, setContext] = useState('')

  const lang = settings.language ?? 'en'

  useEffect(() => {
    const update = () => {
      const set = sentenceSetFor(lang)
      setContext(generateSentence(set, buildCtx(deadlines, new Date())))
    }
    update()
    const interval = setInterval(update, 20000)
    return () => clearInterval(interval)
  }, [deadlines, lang])

  const isAr = lang === 'ar'
  const accent = accentHex(settings.accentColor)

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="glass rounded-xl px-5 py-3.5 flex items-center justify-center gap-3 min-h-[60px] border-s-[3px]"
      style={{ borderInlineStartColor: accent }}
    >
      <Hourglass size={19} className="shrink-0" style={{ color: accent }} />
      <p
        className="text-base md:text-lg font-medium text-center leading-snug text-gray-100"
        lang={isAr ? 'ar' : 'en'}
      >
        {context}
      </p>
    </div>
  )
}

export default React.memo(ContextSentence)
