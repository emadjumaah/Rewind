// ─────────────────────────────────────────────────────────────────────────
// Combinatorial sentence engine.
//
// Instead of a fixed list of ~100 lines, each context provides a set of
// `openers` and we splice in a shared bank of standalone `{jab}` quips. With
// ~8 openers per context and ~30 jabs, a single context already yields ~240
// distinct lines, and the jab bank is reused everywhere — so the dataset stays
// small but the output feels endless. A short no-repeat memory avoids echoes.
// ─────────────────────────────────────────────────────────────────────────

export interface SentenceCtx {
  hour: number // 0..23
  day: number // 0 Sun .. 6 Sat
  urgentCount: number // deadlines due within 24h
  dayRemaining: number // 0..1 of today still ahead
  yearPct: number // 0..100 of the year elapsed
}

interface Rule {
  when?: (c: SentenceCtx) => boolean
  weight: number
  openers: string[]
}

interface SentenceSet {
  jabs: string[]
  rules: Rule[]
}

const recent: string[] = []
const RECENT_MAX = 25

function remember(s: string) {
  recent.push(s)
  if (recent.length > RECENT_MAX) recent.shift()
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function weightedRule(rules: Rule[]): Rule {
  const total = rules.reduce((s, r) => s + r.weight, 0)
  let n = Math.random() * total
  for (const r of rules) {
    n -= r.weight
    if (n <= 0) return r
  }
  return rules[rules.length - 1]
}

/** Compose one line: an opener, optionally followed by a shared jab.
 *  We only ever concatenate complete, hand-written sentences — never swap
 *  words inside one — so every result reads as curated copy. A jab is appended
 *  only to a SHORT opener, giving a tight "setup + punchline" beat and never a
 *  rambling pile-up. Longer openers (already two sentences) stand alone. */
function compose(set: SentenceSet, rule: Rule): string {
  const opener = pick(rule.openers)
  if (opener.includes('{jab}')) return opener.replace('{jab}', pick(set.jabs))
  const isShortPunch = opener.length <= 42 && !opener.slice(0, -1).includes('. ')
  return isShortPunch && Math.random() < 0.5 ? `${opener} ${pick(set.jabs)}` : opener
}

export function generateSentence(set: SentenceSet, ctx: SentenceCtx): string {
  const matching = set.rules.filter((r) => !r.when || r.when(ctx))
  for (let attempt = 0; attempt < 10; attempt++) {
    const line = compose(set, weightedRule(matching))
    if (!recent.includes(line)) {
      remember(line)
      return line
    }
  }
  return compose(set, weightedRule(matching))
}

// ─── English ─────────────────────────────────────────────────────────────

const EN: SentenceSet = {
  jabs: [
    'Time is unimpressed.',
    'The clock is winning.',
    'You knew this already.',
    "And yet, here you are.",
    'Acting on it is optional. The consequences are not.',
    "This is fine. Probably.",
    'No one is coming to do it for you.',
    'The scroll can wait. It always does.',
    "You'll start later. You always say that.",
    'Motivation is late. Discipline never showed.',
    'The task is patient. Too patient.',
    "Don't think about it. Just delay it differently.",
    'Awareness is not action, but it is a start.',
    'The hard part is starting. You have not.',
    'Future you is not coming to help.',
    'It compounds. So does avoiding it.',
    'Honesty is free. Time is not.',
    'You have time. Just less than you think.',
    'The number only goes down.',
    "Pretending otherwise doesn't slow it.",
  ],
  rules: [
    // Baseline — keeps the jab bank in play at every hour.
    { weight: 2, openers: [
      'Time leaves. It does not ask.',
      'You are not busy. You are avoiding.',
      'The to-do list grows; the will shrinks.',
      'Every second spent here is spent.',
      'Awareness was the easy part.',
      'The work exists. So do you. They have not met today.',
    ] },
    // Mornings
    { when: (c) => c.hour >= 5 && c.hour < 9, weight: 3, openers: [
      'The day begins. {jab}',
      'Best hours of the day, and you are warming up.',
      'You woke up. That was the easy decision.',
      'Fresh start. You said that yesterday too.',
      'Morning. The good hours leave first.',
    ] },
    { when: (c) => c.hour >= 9 && c.hour < 12, weight: 3, openers: [
      'The morning is slipping. {jab}',
      'Peak hours, spent on this.',
      'You could have started an hour ago.',
      'Three hours to lunch. You will use half of one.',
    ] },
    // Midday
    { when: (c) => c.hour >= 12 && c.hour < 14, weight: 3, openers: [
      'Half the day is gone. {jab}',
      'Noon. The morning is not coming back.',
      'Lunch: your second most productive act today.',
    ] },
    // Afternoon
    { when: (c) => c.hour >= 14 && c.hour < 17, weight: 3, openers: [
      'Afternoon slump. You will blame the hour.',
      'The day is 60% over. You are 10% in.',
      '3pm: the graveyard of good intentions.',
      'You work better under pressure, you lie.',
    ] },
    // Evening
    { when: (c) => c.hour >= 17 && c.hour < 20, weight: 3, openers: [
      'Work day over. You will work late anyway.',
      'Evening. Time to regret the hours.',
      "Another day filed under 'almost'.",
    ] },
    // Night
    { when: (c) => c.hour >= 20 || c.hour < 5, weight: 3, openers: [
      'Late. You are not productive, just awake.',
      'Midnight work is not dedication. It is disorganization.',
      'The night is long. The list is longer.',
      'You said you would sleep by ten.',
    ] },
    // Day-of-week
    { when: (c) => c.day === 1, weight: 3, openers: [
      'Monday again. {jab}',
      'New week, same you.',
      'A clean slate. Dirty by noon.',
      'The week stretches out like a sentence you handed yourself.',
    ] },
    { when: (c) => c.day === 5, weight: 3, openers: [
      'Friday. The week’s most convincing lie.',
      "Whatever isn't done today isn't getting done.",
      'The finish line is psychological. The work missed the memo.',
    ] },
    { when: (c) => c.day === 0 || c.day === 6, weight: 3, openers: [
      'Weekend. The deadlines did not get the day off.',
      'Two days. You will waste both, regret one.',
      'Rest is productive. This is avoidance.',
    ] },
    // Urgent deadlines dominate when present
    { when: (c) => c.urgentCount > 0, weight: 8, openers: [
      'Something is due within the day. {jab}',
      'A deadline is closing in. You are here.',
      'Due soon. You will start two hours before.',
      'The countdown is real now.',
    ] },
    // Year almost over
    { when: (c) => c.yearPct > 92, weight: 4, openers: [
      'The year is almost gone. Again.',
      'Weeks left in the year, and the resolutions wait.',
      'December math: less time than plans.',
    ] },
    // Day almost gone
    { when: (c) => c.dayRemaining < 0.12, weight: 3, openers: [
      'The day is nearly spent. {jab}',
      'What is left of today is small.',
    ] },
  ],
}

// ─── Arabic (native phrasing, not translated) ───────────────────────────────

const AR: SentenceSet = {
  jabs: [
    'الوقت لا يكترث.',
    'الساعة تكسب.',
    'تعرف هذا مسبقاً.',
    'ومع ذلك، أنت هنا.',
    'الفعل اختياري. النتائج ليست كذلك.',
    'لا بأس… ربما.',
    'لن يأتي أحد ليفعلها عنك.',
    'التصفّح ينتظر. هو دائماً ينتظر.',
    'ستبدأ لاحقاً. تقولها دوماً.',
    'الحماس تأخّر، والانضباط لم يحضر.',
    'المهمة صبورة. صبورة أكثر من اللازم.',
    'الإدراك ليس فعلاً، لكنه بداية.',
    'الجزء الصعب أن تبدأ. ولم تبدأ.',
    'نسختك المستقبلية لن تنقذك.',
    'يتراكم. والتأجيل يتراكم معه.',
    'الصدق مجاني. الوقت ليس كذلك.',
    'لديك وقت، لكن أقل مما تظن.',
    'الرقم ينقص فقط.',
    'التظاهر بغير ذلك لا يبطئه.',
    'ابدأ بلا إلهام؛ لن يأتي.',
  ],
  rules: [
    { weight: 2, openers: [
      'الوقت يمضي ولا يستأذن.',
      'لستَ مشغولاً، أنت تتهرّب.',
      'القائمة تطول والعزيمة تقصر.',
      'كل ثانية هنا تُنفَق.',
      'الإدراك كان الجزء السهل.',
      'المهمة موجودة، وأنت موجود، ولم يلتقيا اليوم.',
    ] },
    { when: (c) => c.hour >= 5 && c.hour < 9, weight: 3, openers: [
      'بدأ اليوم. {jab}',
      'أفضل ساعات اليوم، وأنت ما زلت تتهيّأ.',
      'استيقظت. كان ذلك القرار السهل.',
      'بداية جديدة. قلتها بالأمس أيضاً.',
    ] },
    { when: (c) => c.hour >= 9 && c.hour < 12, weight: 3, openers: [
      'الصباح يتسرّب. {jab}',
      'ساعات الذروة، تُنفقها على هذا.',
      'كان يمكن أن تبدأ قبل ساعة.',
    ] },
    { when: (c) => c.hour >= 12 && c.hour < 14, weight: 3, openers: [
      'نصف اليوم مضى. {jab}',
      'الظهر. الصباح لن يعود.',
      'الغداء: ثاني أكثر أعمالك إنتاجاً اليوم.',
    ] },
    { when: (c) => c.hour >= 14 && c.hour < 17, weight: 3, openers: [
      'فتور ما بعد الظهر؛ ستلوم الساعة.',
      'انقضى 60٪ من اليوم وأنت في أوله.',
      'الثالثة عصراً: مقبرة النوايا الحسنة.',
    ] },
    { when: (c) => c.hour >= 17 && c.hour < 20, weight: 3, openers: [
      'انتهى الدوام، وستعمل متأخراً رغم ذلك.',
      'المساء. وقت الندم.',
      'يوم آخر يُصنّف تحت «كِدت».',
    ] },
    { when: (c) => c.hour >= 20 || c.hour < 5, weight: 3, openers: [
      'متأخر. لستَ منتجاً، أنت فقط مستيقظ.',
      'العمل بعد منتصف الليل ليس التزاماً؛ هو سوء تنظيم.',
      'الليل طويل والقائمة أطول.',
      'قلت إنك ستنام عند العاشرة.',
    ] },
    { when: (c) => c.day === 1, weight: 3, openers: [
      'الاثنين من جديد. {jab}',
      'أسبوع جديد، وأنت القديم نفسه.',
      'لوحٌ نظيف، ستلوّثه قبل الظهر.',
    ] },
    { when: (c) => c.day === 5, weight: 3, openers: [
      'الجمعة، أكثر أكاذيب الأسبوع إقناعاً.',
      'ما لم يُنجَز اليوم لن يُنجَز.',
      'خط النهاية نفسيّ، والعمل لم يصله الخبر.',
    ] },
    { when: (c) => c.day === 0 || c.day === 6, weight: 3, openers: [
      'العطلة، والمواعيد لم تأخذ إجازة.',
      'يومان، ستضيّع كليهما وتندم على أحدهما.',
      'الراحة إنتاج. وهذا تهرّب.',
    ] },
    { when: (c) => c.urgentCount > 0, weight: 8, openers: [
      'موعد يقترب خلال اليوم. {jab}',
      'الموعد يضيق، وأنت هنا.',
      'مستحقّ قريباً، وستبدأ قبله بساعتين.',
      'العدّ التنازلي صار حقيقياً.',
    ] },
    { when: (c) => c.yearPct > 92, weight: 4, openers: [
      'العام يكاد ينتهي. من جديد.',
      'أسابيع تبقّت من العام، والوعود تنتظر.',
    ] },
    { when: (c) => c.dayRemaining < 0.12, weight: 3, openers: [
      'اليوم يكاد ينفد. {jab}',
      'ما تبقّى من يومك قليل.',
    ] },
  ],
}

export const sentenceSetFor = (lang: 'en' | 'ar'): SentenceSet => (lang === 'ar' ? AR : EN)
