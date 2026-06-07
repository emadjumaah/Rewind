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
import { Maximize2, Settings as SettingsIcon, Clock, Info } from "lucide-react";

export default function App() {
  const { settings, toggleFocusMode } = useStore();
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
            <p className="text-sm text-gray-400">Widget Mode</p>
            <p className="text-xs mt-1 text-gray-500">Press ⌘W to exit</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-screen w-screen overflow-hidden p-3 relative ${isDark ? "bg-gray-950" : "bg-gray-50"}`}
    >
      <FocusMode />
      <CommandPalette />
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <About isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      <div className="h-full flex flex-col gap-2 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-1">
          <h1
            className={`text-xl font-semibold tracking-tight ${isDark ? "text-gray-100" : "text-gray-900"}`}
          >
            Rewind
          </h1>
          <div className="flex gap-4">
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
            <button
              onClick={toggleFullscreen}
              className={btnCls}
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

        {/* Main grid */}
        <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">
          {/* Left: clock + context */}
          <div className="col-span-5 flex flex-col gap-3">
            <div className="glass rounded-xl p-4 flex-1 flex items-center justify-center">
              <ReverseClock currentTime={currentTime} />
            </div>
            <ContextSentence currentTime={currentTime} />
          </div>

          {/* Right: digital + deadlines + analytics */}
          <div className="col-span-7 flex flex-col gap-3 overflow-y-auto">
            <TimeLeftDisplay currentTime={currentTime} />
            <div className="glass rounded-xl p-3">
              <DeadlineCards currentTime={currentTime} />
            </div>
            <div className="glass rounded-xl p-3">
              <TimeAnalytics currentTime={currentTime} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
