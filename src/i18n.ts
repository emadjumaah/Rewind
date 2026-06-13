import { useStore } from './store'

interface Translations {
  // App / clock
  appName: string
  clockLabel: string

  // Clock horizon (tap-to-zoom drain ring)
  clockHorizonName: (h: 'day' | 'week' | 'month' | 'year' | 'life') => string
  clockLeftHours: (h: number) => string
  clockLeftDays: (d: number) => string
  clockLeftWeeks: (w: number) => string
  clockTapHint: string

  // TimeLeftDisplay
  timeRemainingToday: string
  timeUnits: string
  tabTitle: (clock: string) => string // shown in the browser tab when you look away
  tabPulse: string // brief flash in the tab at the top of every hour

  // TimeAnalytics
  sectionTimeRemaining: string
  todayLeft: (h: number, m: number) => string
  todaySubtext: string
  weekendsLeft: (n: number) => string
  weekendsSubtext: string
  yearGone: (pct: string, year: number) => string
  yearSubtext: string
  workHoursLeft: (h: number) => string
  workHoursSubtext: string

  // DeadlineCards
  deadlines: string
  demoBadge: string
  demoHint: string
  add: string
  addDeadlineTooltip: string
  addFirst: string
  addAnother: string
  overdue: (d: number) => string
  urgentCritical: (h: number, e: number) => string
  urgentHigh: (d: number, h: number, e: number) => string
  urgentMedium: (d: number, e: number, wh: number) => string
  normal: (d: number, e: number) => string
  lifePassed: (d: number) => string
  lifeToday: () => string
  lifeAway: (d: number) => string

  // DeadlineModal
  addDeadline: string
  editDeadline: string
  titleLabel: string
  deadlineLabel: string
  estimatedHours: string
  cancel: string
  update: string
  deadlinePlaceholder: string
  categoryLabel: string
  categoryWork: string
  categoryLife: string
  lifeTitlePlaceholder: string
  lifePresetBirthday: string
  lifePresetTrip: string
  lifePresetMilestone: string

  // Graveyard
  graveyardTitle: string
  graveyardIntro: string
  graveyardEmpty: string
  graveyardVerdictPrompt: string
  graveyardBtnMadeIt: string
  graveyardBtnMissed: string
  graveyardBtnRest: string
  graveyardBadgeMadeIt: string
  graveyardBadgeMissed: string
  graveyardBadgePassed: string
  graveyardLifespan: (due: string, buried: string) => string
  graveyardLate: (d: number) => string
  graveyardCount: (n: number) => string
  graveyardScore: (madeIt: number, missed: number) => string
  graveyardCommentary: (madeIt: number, missed: number) => string
  graveyardForget: string
  cmdGraveyard: string
  cmdGraveyardDesc: string

  // Life in Weeks
  lifeWeeks: string
  lifeWeeksIntro: string
  lifeWeeksSetup: string
  birthDateLabel: string
  lifeExpectancyLabel: string
  lifeWeeksLived: (n: number) => string
  lifeWeeksLeft: (n: number) => string
  lifeWeeksSpent: (p: string) => string
  weekendsLeftBig: (n: number) => string
  save: string
  share: string

  // Share
  shareSocialTitle: string
  shareSocialDesc: string
  shareWeeksLine: (n: number) => string
  shareCopied: string
  cmdLifeWeeks: string
  cmdLifeWeeksDesc: string

  // Settings
  settings: string
  darkMode: string
  enabled: string
  disabled: string
  accentColor: string
  motionIntensity: string
  low: string
  medium: string
  high: string
  timeFormat: string
  twelveHour: string
  twentyFourHour: string
  focusLength: string
  language: string
  english: string
  arabic: string
  notifications: string
  notificationsHint: string

  // Notification bodies
  notif72: (title: string) => string
  notif24: (title: string) => string
  notif1: (title: string) => string
  notifOverdue: (title: string) => string

  // About
  aboutTitle: string
  aboutP1: string
  aboutP2: string
  aboutFooter: string

  // CommandPalette
  cmdTitle: string
  cmdFocusLabel: string
  cmdFocusDesc: string
  cmdAddLabel: string
  cmdAddDesc: string
  cmdOpenSettings: string
  cmdOpenSettingsDesc: string
  cmdLightMode: string
  cmdDarkMode: string
  cmdLightModeDesc: string
  cmdDarkModeDesc: string
  cmdWidgetMode: string
  cmdExitWidget: string
  cmdWidgetDesc: string
  cmdExitWidgetDesc: string
  cmdClearAll: string
  cmdClearDesc: string
  cmdReset: string
  cmdResetDesc: string

  // FocusMode
  focusPrompt: (min: number) => string
  focusDone: string
  focusPause: string
  focusStart: string
  focusWeekStats: (started: number, finished: number) => string

  // Widget
  widgetMode: string
  widgetExit: string
}

const en: Translations = {
  appName: 'Rewind',
  clockLabel: 'REWIND',

  clockHorizonName: (h) => ({ day: 'TODAY', week: 'THIS WEEK', month: 'THIS MONTH', year: 'THIS YEAR', life: 'YOUR LIFE' }[h]),
  clockLeftHours: (h) => `${h}h left`,
  clockLeftDays: (d) => `${d}d left`,
  clockLeftWeeks: (w) => `${w.toLocaleString('en')}w left`,
  clockTapHint: 'Tap the clock to zoom out',

  timeRemainingToday: 'Time Remaining Today',
  timeUnits: 'HH · MM · SS',
  tabTitle: (clock) => `${clock} left today`,
  tabPulse: '⏳ another hour, gone.',

  sectionTimeRemaining: 'Time Remaining',
  todayLeft: (h, m) => `${h}h ${m}m left today`,
  todaySubtext: 'You probably need double that.',
  weekendsLeft: (n) => `${n} weekends left this year`,
  weekendsSubtext: "Plan accordingly. Or don't.",
  yearGone: (pct, year) => `${pct}% of ${year} gone`,
  yearSubtext: 'Progress: debatable.',
  workHoursLeft: (h) => `${h}h work hours left this week`,
  workHoursSubtext: 'Meetings will take half.',

  deadlines: 'Deadlines',
  demoBadge: 'DEMO',
  demoHint: 'Sample data — delete it and add your own.',
  add: 'Add',
  addDeadlineTooltip: 'Add deadline ⌘D',
  addFirst: '+ Add your first deadline',
  addAnother: '+ Add another',
  overdue: (d) => `${d}d overdue. This is a you problem now.`,
  urgentCritical: (h, e) => `${h}h left. You need ${e}h. This is not happening.`,
  urgentHigh: (d, h, e) => `${d} days, ${h}h left. You need ${e}h. This is a you problem.`,
  urgentMedium: (d, e, wh) => `${d} days left. You need ${e}h. You have ${wh}h work hours. Good luck.`,
  normal: (d, e) => `${d} days left. You need ${e}h. This is fine. Probably.`,
  lifePassed: (d) => `${d} days ago. It came and went.`,
  lifeToday: () => `Today. This is the day. Right now.`,
  lifeAway: (d) => `${d} days away. Closer than it feels.`,

  addDeadline: 'Add Deadline',
  editDeadline: 'Edit Deadline',
  titleLabel: 'Title',
  deadlineLabel: 'Deadline',
  estimatedHours: 'Estimated Hours',
  cancel: 'Cancel',
  update: 'Update',
  deadlinePlaceholder: "What won't you finish?",
  categoryLabel: 'Type',
  categoryWork: 'Work',
  categoryLife: 'Life',
  lifeTitlePlaceholder: 'A moment worth counting toward',
  lifePresetBirthday: 'A birthday',
  lifePresetTrip: 'A trip',
  lifePresetMilestone: 'A milestone',

  graveyardTitle: 'The Graveyard',
  graveyardIntro: "Deadlines don't get deleted here. They get buried. The record stays.",
  graveyardEmpty: 'No graves yet. Your failures are still upstairs.',
  graveyardVerdictPrompt: "It's over. Did you make it?",
  graveyardBtnMadeIt: 'Made it',
  graveyardBtnMissed: "Didn't",
  graveyardBtnRest: 'Lay it to rest',
  graveyardBadgeMadeIt: 'Made it',
  graveyardBadgeMissed: 'Missed',
  graveyardBadgePassed: 'Came and went',
  graveyardLifespan: (due, buried) => `due ${due} · buried ${buried}`,
  graveyardLate: (d) => (d <= 0 ? 'on time, technically' : `${d}d late`),
  graveyardCount: (n) => `${n} buried`,
  graveyardScore: (madeIt, missed) => `${madeIt} made it · ${missed} missed`,
  graveyardCommentary: (madeIt, missed) => {
    const total = madeIt + missed
    if (total === 0) return 'Nothing judged yet. The graveyard is patient.'
    const rate = madeIt / total
    if (rate === 1) return 'All of them made it. The graveyard is suspicious of you.'
    if (rate >= 0.6) return 'Most made it. Better than expected, honestly.'
    if (rate >= 0.4) return "Roughly a coin flip. The coin doesn't lose sleep."
    if (rate > 0) return 'A coin flip would have done better.'
    return "None made it. At least you're consistent."
  },
  graveyardForget: "Forget it. The record won't.",
  cmdGraveyard: 'Visit the Graveyard',
  cmdGraveyardDesc: 'Where missed deadlines rest. The record stays.',

  lifeWeeks: 'Life in Weeks',
  lifeWeeksIntro: 'Each dot is one week. The filled ones are gone. This is the honest picture.',
  lifeWeeksSetup: 'Enter your birth date to see your life, week by week.',
  birthDateLabel: 'Birth date',
  lifeExpectancyLabel: 'Life expectancy (years)',
  lifeWeeksLived: (n) => `${n.toLocaleString()} weeks lived`,
  lifeWeeksLeft: (n) => `${n.toLocaleString()} weeks left`,
  lifeWeeksSpent: (p) => `${p}% spent`,
  weekendsLeftBig: (n) => `${n.toLocaleString()} weekends left`,
  save: 'Save',
  share: 'Share',

  shareSocialTitle: 'Rewind — time, honestly.',
  shareSocialDesc: 'A backward clock and an honest look at the time you have left. Watch it go.',
  shareWeeksLine: (n) => `I have about ${n.toLocaleString()} weeks left. What are you doing with yours?`,
  shareCopied: 'Copied',
  cmdLifeWeeks: 'Life in Weeks',
  cmdLifeWeeksDesc: 'See your whole life, one dot per week.',

  settings: 'Settings',
  darkMode: 'Dark Mode',
  enabled: 'Enabled',
  disabled: 'Disabled',
  accentColor: 'Accent Color',
  motionIntensity: 'Motion Intensity',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  timeFormat: 'Time Format',
  twelveHour: '12 Hour',
  twentyFourHour: '24 Hour',
  focusLength: 'Focus Session Length (minutes)',
  language: 'Language',
  english: 'English',
  arabic: 'العربية',
  notifications: 'Notifications',
  notificationsHint: 'Reminders as deadlines close in. Only fire while the app is open.',

  notif72: (t) => `${t}: 3 days out. Plenty of time to keep ignoring it.`,
  notif24: (t) => `${t}: 24 hours left. Now it's real.`,
  notif1: (t) => `${t}: 1 hour left. Hope you started.`,
  notifOverdue: (t) => `${t}: overdue. It's a you problem now.`,

  aboutTitle: 'About Rewind',
  aboutP1: "The numbers are mirrored because the way we experience time is backwards — we think we have more than we do, until we don't.",
  aboutP2: "Rewind tracks what remains, not what has passed. The clock runs backward because our perception of time is inverted: we always assume there's more, until suddenly there isn't.",
  aboutFooter: 'Built with modern tools to track ancient problems.',

  cmdTitle: '⌘ commands',
  cmdFocusLabel: 'Start Focus Mode',
  cmdFocusDesc: 'No excuses.',
  cmdAddLabel: 'Add Deadline',
  cmdAddDesc: "Another thing you probably won't finish.",
  cmdOpenSettings: 'Open Settings',
  cmdOpenSettingsDesc: 'Change the theme. Not the deadline.',
  cmdLightMode: 'Switch to Light Mode',
  cmdDarkMode: 'Switch to Dark Mode',
  cmdLightModeDesc: 'For people who like seeing things.',
  cmdDarkModeDesc: 'For staring at your failures in the dark.',
  cmdWidgetMode: 'Widget Mode',
  cmdExitWidget: 'Exit Widget Mode',
  cmdWidgetDesc: 'For your second monitor. Dual productivity theater.',
  cmdExitWidgetDesc: 'Back to full guilt.',
  cmdClearAll: 'Clear All Deadlines',
  cmdClearDesc: "They don't disappear. You just stop looking.",
  cmdReset: 'Reset Settings',
  cmdResetDesc: "A fresh start you'll squander just the same.",

  focusPrompt: (min) => `${min} minutes. No excuses. We'll see.`,
  focusDone: 'Done. Or you gave up. Either way, time passed.',
  focusPause: 'Pause',
  focusStart: 'Start',
  focusWeekStats: (started, finished) =>
    finished >= started
      ? `This week: started ${started}, finished ${started}. Noted.`
      : `This week: started ${started}, finished ${finished}. The gap says everything.`,

  widgetMode: 'Widget Mode',
  widgetExit: 'Press ⌘W to exit',
}

const ar: Translations = {
  appName: 'Rewind',
  clockLabel: 'REWIND',

  clockHorizonName: (h) => ({ day: 'اليوم', week: 'هذا الأسبوع', month: 'هذا الشهر', year: 'هذا العام', life: 'حياتك' }[h]),
  clockLeftHours: (h) => `${h.toLocaleString('ar')} ساعة`,
  clockLeftDays: (d) => `${d.toLocaleString('ar')} يوم`,
  clockLeftWeeks: (w) => `${w.toLocaleString('ar')} أسبوع`,
  clockTapHint: 'انقر الساعة للتصغير',

  timeRemainingToday: 'ما تبقّى من يومك',
  timeUnits: 'س · د · ث',
  tabTitle: (clock) => `بقي ${clock} من يومك`,
  tabPulse: '⏳ ساعة أخرى، ذهبت.',

  sectionTimeRemaining: 'ما تبقّى',
  todayLeft: (h, m) => `بقي من يومك ${h} ساعة و${m} دقيقة`,
  todaySubtext: 'وتحتاج ضعفها، كالعادة.',
  weekendsLeft: (n) => `بقيت ${n} عطلة نهاية أسبوع هذا العام`,
  weekendsSubtext: 'اغتنمها… أو دعها تمرّ كغيرها.',
  yearGone: (pct, year) => `مضى ${pct}٪ من عام ${year}`,
  yearSubtext: 'وأنت لا تزال كما أنت.',
  workHoursLeft: (h) => `بقي ${h} ساعة عمل هذا الأسبوع`,
  workHoursSubtext: 'وستلتهم الاجتماعات نصفها.',

  deadlines: 'المواعيد',
  demoBadge: 'للعرض',
  demoHint: 'بيانات تجريبية للعرض — احذفها وأضف مواعيدك.',
  add: 'إضافة',
  addDeadlineTooltip: 'إضافة موعد ⌘D',
  addFirst: '+ أضف موعدك الأول',
  addAnother: '+ أضف موعداً آخر',
  overdue: (d) => `فات موعده بـ${d} يوم. تدبّر أمرك الآن.`,
  urgentCritical: (h, e) => `${h} ساعة فقط، وتحتاج ${e}. لن تُنجزه.`,
  urgentHigh: (d, h, e) => `${d} يوم و${h} ساعة، وتحتاج ${e}. ابدأ الآن أو انسَ الأمر.`,
  urgentMedium: (d, e, wh) => `${d} يوم، تحتاج ${e} ساعة ولا تملك سوى ${wh}. بالتوفيق.`,
  normal: (d, e) => `${d} يوم وتحتاج ${e} ساعة. الوقت يكفي… نظرياً.`,
  lifePassed: (d) => `قبل ${d} يوم. جاء ومضى.`,
  lifeToday: () => `اليوم. هو هذا اليوم. الآن.`,
  lifeAway: (d) => `بعد ${d} يوم. أقرب مما تشعر.`,

  addDeadline: 'إضافة موعد',
  editDeadline: 'تعديل الموعد',
  titleLabel: 'العنوان',
  deadlineLabel: 'الموعد',
  estimatedHours: 'الساعات المقدّرة',
  cancel: 'إلغاء',
  update: 'حفظ',
  deadlinePlaceholder: 'ما الذي لن تنجزه هذه المرة؟',
  categoryLabel: 'النوع',
  categoryWork: 'عمل',
  categoryLife: 'حياة',
  lifeTitlePlaceholder: 'لحظة تستحق أن تُعَدّ الأيام إليها',
  lifePresetBirthday: 'عيد ميلاد',
  lifePresetTrip: 'رحلة',
  lifePresetMilestone: 'محطّة',

  graveyardTitle: 'المقبرة',
  graveyardIntro: 'هنا لا تُحذف المواعيد، بل تُدفن. والسجل يبقى.',
  graveyardEmpty: 'لا قبور بعد. إخفاقاتك ما زالت في الأعلى.',
  graveyardVerdictPrompt: 'انتهى الأمر. هل أنجزته؟',
  graveyardBtnMadeIt: 'أنجزته',
  graveyardBtnMissed: 'لم أنجزه',
  graveyardBtnRest: 'ادفنه بسلام',
  graveyardBadgeMadeIt: 'أُنجز',
  graveyardBadgeMissed: 'فات',
  graveyardBadgePassed: 'جاء ومضى',
  graveyardLifespan: (due, buried) => `استُحق ${due} · دُفن ${buried}`,
  graveyardLate: (d) => (d <= 0 ? 'في الوقت، نظرياً' : `متأخراً ${d} يوم`),
  graveyardCount: (n) => `${n} مدفون`,
  graveyardScore: (madeIt, missed) => `${madeIt} أُنجز · ${missed} فات`,
  graveyardCommentary: (madeIt, missed) => {
    const total = madeIt + missed
    if (total === 0) return 'لا أحكام بعد. المقبرة صبورة.'
    const rate = madeIt / total
    if (rate === 1) return 'أنجزتها كلها. المقبرة تشكّ في أمرك.'
    if (rate >= 0.6) return 'أنجزت معظمها. أفضل من المتوقع، بصراحة.'
    if (rate >= 0.4) return 'قرعة عملة تقريباً. والعملة لا يؤرّقها شيء.'
    if (rate > 0) return 'قرعة عملة كانت ستُبلي أحسن منك.'
    return 'لم تُنجز شيئاً. على الأقل أنت ثابت على المبدأ.'
  },
  graveyardForget: 'انسَه. السجل لن ينسى.',
  cmdGraveyard: 'زيارة المقبرة',
  cmdGraveyardDesc: 'حيث ترقد المواعيد الفائتة. والسجل يبقى.',

  lifeWeeks: 'العمر بالأسابيع',
  lifeWeeksIntro: 'كل نقطة أسبوع. الممتلئة منها مضت. هذه هي الصورة الصادقة.',
  lifeWeeksSetup: 'أدخل تاريخ ميلادك لترى عمرك، أسبوعاً أسبوعاً.',
  birthDateLabel: 'تاريخ الميلاد',
  lifeExpectancyLabel: 'العمر المتوقّع (سنوات)',
  lifeWeeksLived: (n) => `${n.toLocaleString('ar')} أسبوع مضى`,
  lifeWeeksLeft: (n) => `${n.toLocaleString('ar')} أسبوع باقٍ`,
  lifeWeeksSpent: (p) => `انقضى ${p}٪`,
  weekendsLeftBig: (n) => `${n.toLocaleString('ar')} عطلة نهاية أسبوع باقية`,
  save: 'حفظ',
  share: 'مشاركة',

  shareSocialTitle: 'Rewind — الوقت، بصدق.',
  shareSocialDesc: 'ساعة تسير إلى الوراء ونظرة صادقة لما تبقّى من وقتك. شاهده يمضي.',
  shareWeeksLine: (n) => `بقي لي نحو ${n.toLocaleString('ar')} أسبوع. وأنت، بماذا تقضي أسابيعك؟`,
  shareCopied: 'نُسخ',
  cmdLifeWeeks: 'العمر بالأسابيع',
  cmdLifeWeeksDesc: 'انظر إلى عمرك كله، نقطة لكل أسبوع.',

  settings: 'الإعدادات',
  darkMode: 'الوضع الليلي',
  enabled: 'مُفعّل',
  disabled: 'مُعطّل',
  accentColor: 'اللون المميّز',
  motionIntensity: 'شدّة الحركة',
  low: 'خفيفة',
  medium: 'متوسطة',
  high: 'عالية',
  timeFormat: 'صيغة الوقت',
  twelveHour: '12 ساعة',
  twentyFourHour: '24 ساعة',
  focusLength: 'مدة جلسة التركيز (بالدقائق)',
  language: 'اللغة',
  english: 'English',
  arabic: 'العربية',
  notifications: 'التنبيهات',
  notificationsHint: 'تذكيرات كلما اقترب موعد. لا تظهر إلا والتطبيق مفتوح.',

  notif72: (t) => `${t}: ثلاثة أيام تفصلك عنه. وقتٌ كافٍ لتتجاهله أكثر.`,
  notif24: (t) => `${t}: 24 ساعة، وصار الأمر جدّياً.`,
  notif1: (t) => `${t}: ساعة واحدة. أرجو أنك بدأت.`,
  notifOverdue: (t) => `${t}: فات موعده. تدبّر أمرك.`,

  aboutTitle: 'عن Rewind',
  aboutP1: 'الأرقام مقلوبة لأن إحساسنا بالوقت مقلوب — نظنّ أن أمامنا متّسعاً، إلى أن ينفد.',
  aboutP2: 'يقيس Rewind ما بقي، لا ما مضى. تدور عقاربه عكس المعتاد لأننا دائماً نفترض أن في العمر بقيّة، حتى يأتي يوم لا بقيّة فيه.',
  aboutFooter: 'صُنع بأدوات حديثة لقياس همٍّ قديم.',

  cmdTitle: '⌘ الأوامر',
  cmdFocusLabel: 'ابدأ وضع التركيز',
  cmdFocusDesc: 'بلا أعذار.',
  cmdAddLabel: 'إضافة موعد',
  cmdAddDesc: 'مهمّة أخرى لن تُكملها على الأرجح.',
  cmdOpenSettings: 'فتح الإعدادات',
  cmdOpenSettingsDesc: 'غيّر المظهر، لا الموعد.',
  cmdLightMode: 'التبديل للوضع النهاري',
  cmdDarkMode: 'التبديل للوضع الليلي',
  cmdLightModeDesc: 'لمن يفضّل أن يرى ما ينتظره.',
  cmdDarkModeDesc: 'لتتأمّل إخفاقاتك في العتمة.',
  cmdWidgetMode: 'وضع الأداة',
  cmdExitWidget: 'الخروج من وضع الأداة',
  cmdWidgetDesc: 'لشاشتك الثانية. عرضٌ مزدوج لإنتاجيةٍ وهمية.',
  cmdExitWidgetDesc: 'عُد إلى الشعور الكامل بالذنب.',
  cmdClearAll: 'مسح كل المواعيد',
  cmdClearDesc: 'لن تختفي، لكنك ستكفّ عن النظر إليها.',
  cmdReset: 'إعادة ضبط الإعدادات',
  cmdResetDesc: 'بدايةٌ جديدة ستبدّدها كسابقتها.',

  focusPrompt: (min) => `${min} دقيقة. بلا أعذار. لنرَ.`,
  focusDone: 'انتهيت، أو استسلمت. المهم أن الوقت مضى.',
  focusPause: 'إيقاف',
  focusStart: 'ابدأ',
  focusWeekStats: (started, finished) =>
    finished >= started
      ? `هذا الأسبوع: بدأت ${started} وأنهيت ${started}. مسجَّل.`
      : `هذا الأسبوع: بدأت ${started} وأنهيت ${finished}. الفرق يتحدث عن نفسه.`,

  widgetMode: 'وضع الأداة',
  widgetExit: 'اضغط ⌘W للخروج',
}

export function useT(): Translations {
  const { settings } = useStore()
  return (settings.language ?? 'en') === 'ar' ? ar : en
}

export function useDir(): 'rtl' | 'ltr' {
  const { settings } = useStore()
  return (settings.language ?? 'en') === 'ar' ? 'rtl' : 'ltr'
}
