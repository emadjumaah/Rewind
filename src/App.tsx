import { useState, useEffect } from "react";
import ReverseClock from "./components/ReverseClock";
import ContextSentence from "./components/ContextSentence";
import DeadlineCards from "./components/DeadlineCards";
import TimeAnalytics from "./components/TimeAnalytics";
import TimeLeftDisplay from "./components/TimeLeftDisplay";
import FocusMode from "./components/FocusMode";
import CommandPalette from "./components/CommandPalette";
import Settings from "./components/Settings";
import About from "./components/About";
import LifeInWeeks from "./components/LifeInWeeks";
import { useStore } from "./store";
import { useT } from "./i18n";
import { useDeadlineNotifications } from "./hooks/useDeadlineNotifications";
import { accentHex } from "./lib/colors";
import { yearElapsed } from "./lib/time";
import { drawShareCard, shareCard } from "./lib/shareCard";
import {
  Maximize2,
  Settings as SettingsIcon,
  Clock,
  Info,
  Command,
  Sun,
  Moon,
  X,
  LayoutGrid,
  Share2,
  MoreHorizontal,
  Languages,
  Monitor,
} from "lucide-react";

export default function App() {
  const {
    settings,
    updateSettings,
    toggleFocusMode,
    setCommandPaletteOpen,
    toggleWidgetMode,
    isLifeWeeksOpen,
    setLifeWeeksOpen,
  } = useStore();
  const T = useT();
  useDeadlineNotifications();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const lang = settings.language ?? "en";

  const handleShare = async () => {
    const accent = accentHex(settings.accentColor);
    let bigStat: string, statLabel: string, caption: string;
    if (settings.birthDate) {
      const total = (settings.lifeExpectancy || 90) * 52;
      const lived = Math.min(
        total,
        Math.floor((Date.now() - new Date(settings.birthDate).getTime()) / (7 * 86_400_000)),
      );
      const left = Math.max(0, total - lived);
      bigStat = left.toLocaleString(lang);
      statLabel = lang === "ar" ? "أسبوع باقٍ" : "weeks left";
      caption = T.shareWeeksLine(left);
    } else {
      const pct = Math.round(yearElapsed(new Date()) * 100);
      bigStat = `${pct}%`;
      statLabel = lang === "ar" ? "من العام مضى" : "of the year, gone";
      caption = T.shareSocialDesc;
    }
    const canvas = drawShareCard({ accent, bigStat, statLabel, caption, rtl: lang === "ar" });
    await shareCard(canvas, {
      title: T.shareSocialTitle,
      text: caption,
      url: "https://rewind.uts.qa",
    });
  };

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Keep <html class="dark"> in sync so Tailwind dark: variants work everywhere
  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings.darkMode]);

  // Keep <html lang/dir> in sync so :lang(ar) font rules, a11y, and the whole
  // layout (header, grid) mirror correctly in Arabic — not just text nodes.
  useEffect(() => {
    const lang = settings.language ?? "en";
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [settings.language]);

  // ⌘W exits widget mode from anywhere — CommandPalette isn't mounted in widget view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
        e.preventDefault();
        toggleWidgetMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleWidgetMode]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const isDark = settings.darkMode;
  const btnCls = isDark
    ? "text-gray-500 hover:text-gray-200 transition-colors hover:scale-110 active:scale-95"
    : "text-gray-400 hover:text-gray-700 transition-colors hover:scale-110 active:scale-95";

  if (settings.widgetMode) {
    return (
      <div
        className={`fixed inset-0 ${isDark ? "bg-gray-950" : "bg-gray-50"} flex items-center justify-center p-4`}
      >
        <button
          onClick={toggleWidgetMode}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-300 transition-colors"
          title={T.widgetExit}
        >
          <X size={20} />
        </button>
        <div className="glass-strong rounded-2xl p-6 max-w-sm w-full">
          <div className="aspect-square max-h-[50vh] mx-auto mb-4">
            <ReverseClock currentTime={currentTime} />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">{T.widgetMode}</p>
            <p className="text-xs mt-1 text-gray-500">{T.widgetExit}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen md:h-screen w-screen md:overflow-hidden p-3 relative ${isDark ? "bg-gray-950" : "bg-gray-50"}`}
    >
      <FocusMode />
      <CommandPalette />
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <About isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <LifeInWeeks isOpen={isLifeWeeksOpen} onClose={() => setLifeWeeksOpen(false)} />

      <div className="flex flex-col gap-2 relative z-10 md:h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-1">
          <h1
            className={`text-xl font-semibold tracking-tight ${isDark ? "text-gray-100" : "text-gray-900"}`}
          >
            {T.appName}
          </h1>
          <div className="flex items-center gap-3 md:gap-4">
            {/* Primary actions */}
            <button onClick={() => setLifeWeeksOpen(true)} className={btnCls} title={T.lifeWeeks}>
              <LayoutGrid size={18} />
            </button>
            <button onClick={handleShare} className={btnCls} title={T.share}>
              <Share2 size={18} />
            </button>
            <button
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className={btnCls}
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className={btnCls} title={T.settings}>
              <SettingsIcon size={18} />
            </button>

            {/* Overflow menu — secondary actions tucked away to keep it clean */}
            <div className="relative">
              <button onClick={() => setIsMenuOpen((o) => !o)} className={btnCls} title="More">
                <MoreHorizontal size={18} />
              </button>
              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsMenuOpen(false)} />
                  <div
                    className="absolute z-30 mt-2 end-0 min-w-[190px] glass-strong rounded-xl p-1.5 shadow-2xl"
                    dir={lang === "ar" ? "rtl" : "ltr"}
                  >
                    {[
                      { icon: <Command size={16} />, label: T.cmdTitle, onClick: () => setCommandPaletteOpen(true) },
                      { icon: <Clock size={16} />, label: T.cmdFocusLabel, onClick: toggleFocusMode },
                      { icon: <Monitor size={16} />, label: settings.widgetMode ? T.cmdExitWidget : T.cmdWidgetMode, onClick: toggleWidgetMode },
                      { icon: <Maximize2 size={16} />, label: lang === "ar" ? "ملء الشاشة" : "Fullscreen", onClick: toggleFullscreen },
                      { icon: <Languages size={16} />, label: lang === "ar" ? T.english : T.arabic, onClick: () => updateSettings({ language: lang === "ar" ? "en" : "ar" }) },
                      { icon: <Info size={16} />, label: T.aboutTitle, onClick: () => setIsAboutOpen(true) },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => { item.onClick(); setIsMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-start transition-colors ${isDark ? "text-gray-300 hover:bg-white/10" : "text-gray-700 hover:bg-black/5"}`}
                      >
                        <span className="text-gray-500">{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Context sentence — full-width banner, impossible to miss */}
        <ContextSentence />

        {/* Main grid — stacks on mobile, side-by-side on md+ */}
        <div className="md:flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 md:min-h-0">
          {/* Left: clock */}
          <div className="md:col-span-5 flex flex-col gap-3 md:min-h-0">
            <div className="glass rounded-xl p-4 flex items-center justify-center h-56 md:h-auto md:flex-1 md:min-h-0">
              <div className="w-52 h-52 md:w-full md:h-full">
                <ReverseClock currentTime={currentTime} />
              </div>
            </div>
          </div>

          {/* Right: digital + deadlines + analytics */}
          <div className="md:col-span-7 flex flex-col gap-3 md:min-h-0 pb-4 md:pb-0">
            <TimeLeftDisplay currentTime={currentTime} />
            {/* Deadlines grow to fill available space; list scrolls internally on desktop */}
            <div className="glass rounded-xl p-3 md:flex-1 md:min-h-0 md:overflow-hidden">
              <DeadlineCards currentTime={currentTime} />
            </div>
            <div className="glass rounded-xl p-3 shrink-0">
              <TimeAnalytics currentTime={currentTime} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
