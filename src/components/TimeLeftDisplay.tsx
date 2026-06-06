import { useState, useEffect } from "react";
import React from "react";
import { motion } from "framer-motion";
import { endOfDay } from "date-fns";
import { useStore } from "../store";

function TimeLeftDisplay() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const { settings } = useStore();

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const endOfDayDate = endOfDay(now);
      const msLeft = endOfDayDate.getTime() - now.getTime();
      const hours = Math.floor(msLeft / (1000 * 60 * 60));
      const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((msLeft % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  const getAccentColor = () => {
    const colors = {
      cyan: "text-cyan-400",
      purple: "text-purple-400",
      amber: "text-amber-400",
      red: "text-red-400",
    };
    return colors[settings.accentColor];
  };

  const accentColor = getAccentColor();

  return (
    <div className="glass rounded-xl py-0 px-4 flex flex-col items-center justify-center h-[150px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-[9px] text-gray-400 mb-0 tracking-wide">
          TIME LEFT TODAY
        </p>
        <div className="flex items-baseline justify-center gap-2">
          <span className={`text-6xl font-bold tabular-nums ${accentColor}`}>
            {timeLeft.hours}
          </span>
          <span className="text-5xl text-gray-500">:</span>
          <span className={`text-6xl font-bold tabular-nums ${accentColor}`}>
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="text-5xl text-gray-500">:</span>
          <span className={`text-6xl font-bold tabular-nums ${accentColor}`}>
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
        </div>
        <p className="text-[8px] text-gray-500 mt-0 leading-none">Hours : Minutes : Seconds</p>
      </motion.div>
    </div>
  );
}

export default React.memo(TimeLeftDisplay);
