import { useStore } from './store'

interface Translations {
  // App / clock
  appName: string
  clockLabel: string

  // TimeLeftDisplay
  timeRemainingToday: string
  timeUnits: string

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

  // DeadlineModal
  addDeadline: string
  editDeadline: string
  titleLabel: string
  deadlineLabel: string
  estimatedHours: string
  cancel: string
  update: string
  deadlinePlaceholder: string

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

  // Widget
  widgetMode: string
  widgetExit: string
}

const en: Translations = {
  appName: 'Rewind',
  clockLabel: 'REWIND',

  timeRemainingToday: 'Time Remaining Today',
  timeUnits: 'HH · MM · SS',

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

  addDeadline: 'Add Deadline',
  editDeadline: 'Edit Deadline',
  titleLabel: 'Title',
  deadlineLabel: 'Deadline',
  estimatedHours: 'Estimated Hours',
  cancel: 'Cancel',
  update: 'Update',
  deadlinePlaceholder: "What won't you finish?",

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

  widgetMode: 'Widget Mode',
  widgetExit: 'Press ⌘W to exit',
}

const ar: Translations = {
  appName: 'Rewind',
  clockLabel: 'REWIND',

  timeRemainingToday: 'ما تبقّى من يومك',
  timeUnits: 'س · د · ث',

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

  addDeadline: 'إضافة موعد',
  editDeadline: 'تعديل الموعد',
  titleLabel: 'العنوان',
  deadlineLabel: 'الموعد',
  estimatedHours: 'الساعات المقدّرة',
  cancel: 'إلغاء',
  update: 'حفظ',
  deadlinePlaceholder: 'ما الذي لن تنجزه هذه المرة؟',

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
