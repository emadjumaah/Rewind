import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const quotes = [
  "11 days left. 4 of them are weekend. Good luck.",
  "You've used 74% of your year. What do you have to show for it?",
  "This deadline is in 6 hours. This is fine.",
  "3 weekends left in the month. One of them you'll waste. Statistically.",
  "Time doesn't care about your plans. It just leaves.",
  "You have 40 hours left. You said you need 60. This is a you problem.",
  "The day is 60% gone. Your progress is not.",
  "Deadlines are just suggestions that have consequences.",
  "You'll probably procrastinate until the last hour. We both know this.",
  "Time is the one resource you can't renew. Spend it poorly, it's gone.",
  "5 hours left today. You'll spend 3 on things that don't matter.",
  "The weekend is coming. You'll rest instead of catching up. Again.",
  "Your future self will hate your current self's time management.",
  "Procrastination is just borrowing time from future you at high interest.",
  "The clock doesn't stop because you're tired. It keeps going.",
]

export default function QuoteFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length)
    }, 20000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-24 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-gray-400 text-center text-lg italic"
        >
          "{quotes[currentIndex]}"
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
