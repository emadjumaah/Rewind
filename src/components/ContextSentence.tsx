import { useState, useEffect, useRef } from 'react'
import React from 'react'
import { useStore, Deadline } from '../store'
import { differenceInHours } from 'date-fns'

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]

// ─── English messages ──────────────────────────────────────────────────────

const getEnMessage = (deadlines: Deadline[], t: Date): string => {
  const hour = t.getHours()
  const day  = t.getDay()

  if (day === 1) return pick([
    "Monday. You'll say you'll start fresh. You won't.",
    "New week. Same you. Lower your expectations accordingly.",
    "Monday again. The calendar is merciless.",
    "The week stretches out like a punishment you scheduled yourself.",
    "Clean slate. You'll dirty it by noon.",
    "Monday motivation is just Tuesday's disappointment on a delay.",
  ])
  if (day === 5) return pick([
    "Friday. You'll pretend to work while planning the weekend.",
    "End of the week. Whatever wasn't done isn't getting done today.",
    "Friday afternoon. The work week's most convincing lie.",
    "The psychological finish line. The work didn't get the memo.",
    "You didn't finish what you started Monday. But it's Friday now, so.",
  ])
  if (day === 0 || day === 6) return pick([
    "Weekend. You'll rest instead of catching up. Again.",
    "It's the weekend. The deadlines don't know that.",
    "Two days. You'll waste both and feel guilty about one.",
    "Rest is productive. You're not resting. You're avoiding.",
    "The work will be there Monday. So will the regret.",
  ])

  if (hour >= 5 && hour < 9) return pick([
    "The day begins. So does the procrastination.",
    "Morning. You'll waste the best hours on the wrong things.",
    "Fresh start. You said that yesterday too.",
    "The alarm went off. Your productivity hasn't.",
    "You woke up. That's the bar. And you barely cleared it.",
    "Rise and decide to do nothing with the next two hours.",
  ])
  if (hour >= 9 && hour < 12) return pick([
    "The morning is slipping away. You haven't started.",
    "You have 3 hours until lunch. You'll use 0.5 productively.",
    "Peak hours. You're spending them on this.",
    "You could have started an hour ago. You didn't.",
    "Three hours until lunch. You'll work for 20 minutes of them.",
    "The best hours of the day. Almost gone.",
  ])
  if (hour >= 12 && hour < 14) return pick([
    "Lunch break. You'll extend it by 30 minutes.",
    "Midday. Half the day is gone. What do you have to show?",
    "You're not hungry. You're avoiding work.",
    "Half the day. Half the excuses still left to use.",
    "Noon. The morning is gone and you can't have it back.",
    "Lunch. Your second most productive task of the day.",
  ])
  if (hour >= 14 && hour < 17) return pick([
    "Afternoon slump. You'll blame the time of day.",
    "The work day is 60% over. You're 10% done.",
    "3pm. The graveyard of good intentions.",
    "You'll tell yourself you work better under pressure. You don't.",
    "Post-lunch coma. You planned for this. You still did nothing.",
    "One notification away from losing the whole afternoon.",
  ])
  if (hour >= 17 && hour < 20) return pick([
    "Work day over. You'll work late anyway.",
    "Evening. Time to regret the day you wasted.",
    "Five o'clock. The tasks remain. So do you.",
    "Another day filed under 'almost got things done'.",
    "Close the laptop. Tomorrow's problems are patient. Too patient.",
  ])
  if (hour >= 20 || hour < 5) return pick([
    "Late night. You're not productive. You're just awake.",
    "Working at midnight doesn't make you dedicated. It makes you disorganized.",
    "The night is long. Your to-do list is longer.",
    "You said you'd sleep by ten. You lied to yourself again.",
    "Past midnight. The work didn't do itself. Shocker.",
  ])

  const urgent = deadlines.filter(d => {
    const dd = d.deadline instanceof Date ? d.deadline : new Date(d.deadline)
    return differenceInHours(dd, t) < 24
  })
  if (urgent.length > 0) return pick([
    `${urgent.length} deadline${urgent.length > 1 ? 's' : ''} in the next 24 hours. This is fine.`,
    "Urgent deadline. You'll start 2 hours before it's due.",
    "Time is running out. You're scrolling.",
    "It's due tomorrow. You knew this was coming.",
  ])

  return pick([
    "Time doesn't care about your plans. It just leaves.",
    "You'll probably procrastinate until the last hour. We both know this.",
    "The clock is ticking. You're scrolling.",
    "You're not busy. You're just avoiding what matters.",
    "Productivity apps won't fix procrastination. Neither will this one.",
    "The to-do list grows. The motivation shrinks. Classic.",
    "You're not overwhelmed. You're just not starting.",
    "The clock mocks you. You deserve it.",
    "Motivation is a lie. Discipline is the truth. You have neither.",
    "You're not taking a break. You're quitting.",
    "The future you want requires the work you're avoiding.",
    "Every second you waste is a second you'll never get back. Obvious.",
    "This app isn't going to help you. But at least you're honest about needing it.",
    "Procrastination is just optimism about how fast you'll work later.",
    "Discipline is doing it when you don't want to. You've been 'not wanting to' for hours.",
    "Busy and productive are different words. You know which one you are.",
    "You'll do it right after this. You've said that six times today.",
    "The best time to start was an hour ago. The second best is also in the past.",
    "Procrastination is just optimism about your future self. That self isn't coming.",
    "The work exists. You exist. These two facts have yet to interact today.",
    "Someday is not a day of the week. You keep scheduling things there.",
    "The task didn't grow while you waited. Your dread of it did.",
    "Time spent regretting yesterday is borrowed from today. Return it.",
  ])
}

// ─── Arabic messages ───────────────────────────────────────────────────────

const getArMessage = (deadlines: Deadline[], t: Date): string => {
  const hour = t.getHours()
  const day  = t.getDay()

  if (day === 1) return pick([
    "الاثنين. وعدٌ بالبداية تكسره كل أسبوع.",
    "أسبوع جديد وأنت القديم نفسه.",
    "سبعة أيام أمامك. ستبدأ ضياع أولها بنفس الطريقة.",
    "الاثنين مو بداية جديدة. هو الأحد بملابس رسمية.",
    "لوح نظيف. ستلوثه قبل الظهر.",
  ])
  if (day === 5) return pick([
    "الجمعة. خط النهاية الوهمي الذي لا ينجز المهام.",
    "ما أنهيت اللي بدأته الاثنين. بس الجمعة وصلت على أي حال.",
    "نهاية الأسبوع. والمهام تنظر إليك في صمت.",
    "الجمعة لا تمحو تقاعس الأسبوع. فقط تؤجله.",
  ])
  if (day === 0 || day === 6) return pick([
    "إجازة من إيش؟ من المهام اللي ما بدأتها أصلاً.",
    "يومين حرية. وأسبوع من الندم بعدها.",
    "الوقت الحر ليس مضموناً. والتزاماتك تعرف ذلك.",
    "ترتاح من ماذا؟ لم تكتمل المهمة بعد.",
    "العطلة تجدد الجسد. لكن المهام لا تستريح.",
  ])

  if (hour >= 5 && hour < 9) return pick([
    "الفجر طلع وأنت بعد تفكر في البداية.",
    "الصبح وعدٌ، والوعد مكسور قبل أن يبدأ.",
    "القهوة جاهزة والذريعة الجاية مو.",
    "صحيت مبكراً. الفضل لك. الإنجاز ليس كذلك.",
    "الوقت الذهبي للإنتاج. تهدره بذهب.",
  ])
  if (hour >= 9 && hour < 12) return pick([
    "ربع النهار راح وأنت لسا 'تتهيأ للشغل'.",
    "قهوتك الثانية لن تغير الحقيقة: لم تنجز شيئاً.",
    "ساعات الذروة. أفعالك لا توافق ذلك.",
    "المنتج الوحيد في صباحك حتى الآن: التبريرات.",
    "وقت الصباح يمضي. أنت تراقبه يذهب.",
  ])
  if (hour >= 12 && hour < 14) return pick([
    "نصف يومك ذاب وأنت تراقبه.",
    "الغداء ذريعة أخرى في قائمة طويلة.",
    "وقفة منتصف النهار: ماذا أنجزت؟ الصمت إجابة.",
    "اليوم في منتصفه والخطة لا تزال في رأسك فقط.",
    "الساعة اثنتا عشرة. نصف الوقت مضى. صفر من العمل أُنجز.",
  ])
  if (hour >= 14 && hour < 17) return pick([
    "بعد الظهر وقت 'رح أعوض'. الذي لن يحدث.",
    "الثلاثة بعد الظهر. مقبرة النوايا الحسنة.",
    "طاقتك تنقص والمهام تبقى. معادلة ثابتة لا تتغير.",
    "تعبان؟ ليس من العمل. من التفكير فيه.",
    "ساعات بعد الظهر: حين يتبين أن خطط الصباح كانت وهماً.",
  ])
  if (hour >= 17 && hour < 20) return pick([
    "النهار انتهى قبل أن تنتهي منه.",
    "الشغل ما خلص. لكن اليوم خلص.",
    "المساء. وقت الندم المسائي المجاني.",
    "اليوم ودّع دون استئذان، وبدون إنجاز.",
    "عُد للمنزل. الندم يتبعك وحده.",
  ])
  if (hour >= 20 || hour < 5) return pick([
    "السهر لا يساوي الإنتاجية. يساوي الإرهاق.",
    "الليل طويل والمهام أطول.",
    "العمل بعد منتصف الليل ليس التزاماً. هو فشل في التخطيط.",
    "الظلام يخفي المكتب، لا المواعيد النهائية.",
    "نوم متأخر واستيقاظ متأخر وإنتاج أقل. دورة مألوفة.",
  ])

  const urgent = deadlines.filter(d => {
    const dd = d.deadline instanceof Date ? d.deadline : new Date(d.deadline)
    return differenceInHours(dd, t) < 24
  })
  if (urgent.length > 0) return pick([
    "الموعد النهائي غداً وأنت هنا. ليس ذلك مفاجئاً.",
    "الوقت ضاق والمهمة لم تبدأ. هذا القرار كان لك.",
    "التأجيل وصل لنهايته. الذعر يبدأ الآن.",
    "موعد قريب والعمل بعيد. أتمنى لك التوفيق.",
  ])

  return pick([
    "الوقت يمشي. أنت لا.",
    "الوقت لا يعود، والندم لا يفيد.",
    "بكرة صار امبارح وأنت لسا قاعد.",
    "لستَ مشغولاً. لستَ متعباً. فقط لا تريد أن تبدأ.",
    "ما في أحد يسرق وقتك. أنت توزعه مجاناً.",
    "الساعة تدور عكس هنا. وأنت لم تكن تتقدم أصلاً.",
    "التأجيل تفاؤل بنسخة مستقبلية منك لن تأتي.",
    "كل ثانية تمر دون بداية هي اختيار ألا تبدأ.",
    "هذا التطبيق لن يساعدك. لكنك صادق مع نفسك على الأقل.",
    "الساعة تعرف الحقيقة. أنت تتجاهلها.",
    "المواعيد النهائية لا تحترم مزاجك.",
    "لا تحتاج تحفيزاً. تحتاج أن تبدأ.",
    "الفرق بين المنجز والمتأمل: الفعل.",
    "تقول 'بعد شوي' من ساعات. الشوي لا ينتهي.",
    "الخطة في رأسك. المواعيد في الواقع. الفجوة بينهما: أنت.",
    "لستَ مستعداً؟ لم تكن كذلك في أي يوم قبل هذا.",
    "الوقت الذي أضعته في الندم مسروق من الحاضر، أعده.",
    "ما أنجزته اليوم لن يصبح أكثر بالتمني.",
    "تفتح هذا التطبيق. خطوة أولى. الثانية تتطلب منك أكثر.",
    "المهمة موجودة. أنت موجود. لم يلتقيا اليوم بعد.",
    "لا يوجد وقت مثالي للبدء. هذه الفكرة اخترعها المؤجِّلون.",
    "الساعة لا ترحمك. ولا المواعيد النهائية تفعل ذلك.",
    "ما الذي تنتظره؟ الإلهام؟ لن يأتي. ابدأ بدونه.",
  ])
}

// ─── Component ─────────────────────────────────────────────────────────────

function ContextSentence({ currentTime }: { currentTime: Date }) {
  const { deadlines, settings } = useStore()
  const [context, setContext] = useState('')
  const currentTimeRef = useRef(currentTime)
  currentTimeRef.current = currentTime

  const lang = settings.language ?? 'en'

  useEffect(() => {
    const update = () => {
      const t = currentTimeRef.current
      const msg = lang === 'ar'
        ? getArMessage(deadlines, t)
        : getEnMessage(deadlines, t)
      setContext(msg)
    }
    update()
    const interval = setInterval(update, 20000)
    return () => clearInterval(interval)
  }, [deadlines, lang])

  const isAr = lang === 'ar'

  return (
    <div className="glass rounded-xl px-5 py-3 flex items-center justify-center min-h-[52px]">
      <p
        className="text-sm text-gray-400 text-center leading-relaxed italic"
        dir={isAr ? 'rtl' : 'ltr'}
        lang={isAr ? 'ar' : 'en'}
        style={isAr ? { fontFamily: 'system-ui, -apple-system, sans-serif', fontStyle: 'normal' } : undefined}
      >
        {context}
      </p>
    </div>
  )
}

export default React.memo(ContextSentence)
