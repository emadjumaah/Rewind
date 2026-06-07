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
import { useStore } from "./store";
import { useT } from "./i18n";
import {
  Maximize2,
  Settings as SettingsIcon,
  Clock,
  Info,
  Command,
  Sun,
  Moon,
} from "lucide-react";

export default function App() {
  const { settings, updateSettings, toggleFocusMode, setCommandPaletteOpen } =
    useStore();
  const T = useT();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Keep <html class="dark"> in sync so Tailwind dark: variants work everywhere
  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings.darkMode]);

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

      <div className="flex flex-col gap-2 relative z-10 md:h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-1">
          <h1
            className={`text-xl font-semibold tracking-tight ${isDark ? "text-gray-100" : "text-gray-900"}`}
          >
            {T.appName}
          </h1>
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className={btnCls}
              title="Commands ⌘K"
            >
              <Command size={18} />
            </button>
            <button
              onClick={() => setIsAboutOpen(true)}
              className={btnCls}
              title="About"
            >
              <Info size={18} />
            </button>
            <button
              onClick={toggleFocusMode}
              className={btnCls}
              title="Focus Mode"
            >
              <Clock size={18} />
            </button>

            {/* Language toggle */}
            <button
              onClick={() =>
                updateSettings({
                  language: settings.language === "ar" ? "en" : "ar",
                })
              }
              className={`${btnCls} text-[11px] font-bold tracking-widest leading-none w-7 text-center`}
              title={
                settings.language === "ar"
                  ? "Switch to English"
                  : "التبديل للعربية"
              }
            >
              {settings.language === "ar" ? "EN" : "ع"}
            </button>

            {/* Dark / light toggle */}
            <button
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className={btnCls}
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <button
              onClick={toggleFullscreen}
              className={`${btnCls} hidden md:block`}
              title="Fullscreen"
            >
              <Maximize2 size={18} />
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={btnCls}
              title="Settings"
            >
              <SettingsIcon size={18} />
            </button>
          </div>
        </div>

        {/* Context sentence — full-width banner, impossible to miss */}
        <ContextSentence currentTime={currentTime} />

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
