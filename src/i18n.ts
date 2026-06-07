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
  appName: 'ريواند',
  clockLabel: 'ريواند',

  timeRemainingToday: 'الوقت المتبقي اليوم',
  timeUnits: 'س · د · ث',

  sectionTimeRemaining: 'الوقت المتبقي',
  todayLeft: (h, m) => `تبقّى ${h}س ${m}د اليوم`,
  todaySubtext: 'على الأرجح تحتاج ضعف ذلك.',
  weekendsLeft: (n) => `${n} عطلة نهاية أسبوع هذا العام`,
  weekendsSubtext: 'خطط لذلك. أو لا.',
  yearGone: (pct, year) => `${pct}% من عام ${year} انقضى`,
  yearSubtext: 'التقدم: قابل للجدل.',
  workHoursLeft: (h) => `تبقّى ${h} ساعة عمل هذا الأسبوع`,
  workHoursSubtext: 'الاجتماعات ستأخذ نصفها.',

  deadlines: 'المواعيد النهائية',
  add: 'إضافة',
  addDeadlineTooltip: 'إضافة موعد ⌘D',
  addFirst: '+ أضف موعدك الأول',
  addAnother: '+ إضافة موعد آخر',
  overdue: (d) => `متأخر ${d} يوم. هذه مشكلتك الآن.`,
  urgentCritical: (h, e) => `تبقّى ${h} ساعة. تحتاج ${e}. لن يحدث هذا.`,
  urgentHigh: (d, h, e) => `${d} أيام و${h} ساعة. تحتاج ${e}. هذه مشكلتك.`,
  urgentMedium: (d, e, wh) => `${d} أيام. تحتاج ${e} ساعة. لديك ${wh} ساعة عمل. حظاً موفقاً.`,
  normal: (d, e) => `${d} أيام. تحتاج ${e} ساعة. لا بأس. ربما.`,

  addDeadline: 'إضافة موعد نهائي',
  editDeadline: 'تعديل الموعد النهائي',
  titleLabel: 'العنوان',
  deadlineLabel: 'الموعد النهائي',
  estimatedHours: 'الساعات التقديرية',
  cancel: 'إلغاء',
  update: 'تحديث',
  deadlinePlaceholder: 'ما الذي لن تنهيه؟',

  settings: 'الإعدادات',
  darkMode: 'الوضع الليلي',
  enabled: 'مفعّل',
  disabled: 'معطّل',
  accentColor: 'اللون الأساسي',
  motionIntensity: 'شدّة الحركة',
  low: 'منخفض',
  medium: 'متوسط',
  high: 'مرتفع',
  timeFormat: 'تنسيق الوقت',
  twelveHour: '12 ساعة',
  twentyFourHour: '24 ساعة',
  focusLength: 'مدة جلسة التركيز (دقائق)',
  language: 'اللغة',
  english: 'English',
  arabic: 'العربية',

  aboutTitle: 'عن ريواند',
  aboutP1: 'الأرقام معكوسة لأن طريقتنا في تجربة الوقت معكوسة — نظن أن لدينا وقتاً أكثر مما لدينا، حتى لا يكون كذلك.',
  aboutP2: 'ريواند يتتبع ما تبقّى، لا ما مضى. الساعة تسير عكس المعتاد لأن إدراكنا للوقت مقلوب: دائماً نفترض أن هناك المزيد، حتى يأتي يوم لا يكون.',
  aboutFooter: 'مبني بأدوات حديثة لتتبع مشاكل قديمة.',

  cmdTitle: '⌘ الأوامر',
  cmdFocusLabel: 'بدء وضع التركيز',
  cmdFocusDesc: 'بلا أعذار.',
  cmdAddLabel: 'إضافة موعد نهائي',
  cmdAddDesc: 'شيء آخر على الأرجح لن تنهيه.',
  cmdOpenSettings: 'فتح الإعدادات',
  cmdOpenSettingsDesc: 'غيّر المظهر. ليس الموعد النهائي.',
  cmdLightMode: 'التبديل للوضع النهاري',
  cmdDarkMode: 'التبديل للوضع الليلي',
  cmdLightModeDesc: 'للناس الذين يحبون الرؤية.',
  cmdDarkModeDesc: 'لتأمل إخفاقاتك في الظلام.',
  cmdWidgetMode: 'وضع الأداة',
  cmdExitWidget: 'الخروج من وضع الأداة',
  cmdWidgetDesc: 'لشاشتك الثانية. مسرح الإنتاجية المزدوج.',
  cmdExitWidgetDesc: 'عودة للشعور الكامل بالذنب.',
  cmdClearAll: 'مسح كل المواعيد النهائية',
  cmdClearDesc: 'لا تختفي. فقط تتوقف عن النظر إليها.',
  cmdReset: 'إعادة ضبط الإعدادات',
  cmdResetDesc: 'بداية جديدة ستبددها بنفس الطريقة.',

  focusPrompt: (min) => `${min} دقيقة. بلا أعذار. سنرى.`,
  focusDone: 'انتهيت. أو استسلمت. على أي حال، الوقت مضى.',
  focusPause: 'إيقاف مؤقت',
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
