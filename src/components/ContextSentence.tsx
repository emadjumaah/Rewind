import { useState, useEffect } from 'react'
import React from 'react'
import { useStore, Deadline } from '../store'
import { differenceInHours } from 'date-fns'

const getContextualMessage = (deadlines: Deadline[], currentTime: Date): string => {
  const hour = currentTime.getHours()
  const day = currentTime.getDay()
  const month = currentTime.getMonth()
  const year = currentTime.getFullYear()

  // Time of day context
  if (hour >= 5 && hour < 9) {
    const morningMessages = [
      "The day begins. So does the procrastination.",
      "Morning. You'll waste the best hours on the wrong things.",
      "The sun is up. Your motivation is not.",
      "Early hours. You'll scroll through them.",
      "Morning coffee won't fix your time management.",
    ]
    return morningMessages[Math.floor(Math.random() * morningMessages.length)]
  }

  if (hour >= 9 && hour < 12) {
    const lateMorningMessages = [
      "The morning is slipping away. You haven't started.",
      "You have 3 hours until lunch. You'll use 0.5 productively.",
      "The work day is 25% gone. Your progress is 0%.",
      "Late morning. Still haven't started. Typical.",
      "The clock doesn't care about your morning routine.",
    ]
    return lateMorningMessages[Math.floor(Math.random() * lateMorningMessages.length)]
  }

  if (hour >= 12 && hour < 14) {
    const lunchMessages = [
      "Lunch break. You'll extend it by 30 minutes.",
      "Midday. Half the day is gone. What do you have to show?",
      "You're not hungry. You're avoiding work.",
      "Lunch won't make the deadlines disappear.",
      "The afternoon will be harder. You'll be less productive.",
    ]
    return lunchMessages[Math.floor(Math.random() * lunchMessages.length)]
  }

  if (hour >= 14 && hour < 17) {
    const afternoonMessages = [
      "Afternoon slump. You'll blame the time of day.",
      "The work day is 60% over. You're 10% done.",
      "You're not tired. You're bored.",
      "The afternoon is for catching up. You won't.",
      "Your energy is low. Your to-do list is high.",
    ]
    return afternoonMessages[Math.floor(Math.random() * afternoonMessages.length)]
  }

  if (hour >= 17 && hour < 20) {
    const eveningMessages = [
      "Work day over. You'll work late anyway.",
      "You didn't finish. You'll say you will tomorrow. You won't.",
      "Evening. Time to regret the day you wasted.",
      "The work day is done. The guilt is just starting.",
      "You'll work late to compensate for the day you wasted.",
    ]
    return eveningMessages[Math.floor(Math.random() * eveningMessages.length)]
  }

  if (hour >= 20 || hour < 5) {
    const nightMessages = [
      "Late night. You're not productive. You're just awake.",
      "Sleep won't fix the deadlines. But you need it anyway.",
      "The night is long. Your to-do list is longer.",
      "You're not a night owl. You're just procrastinating.",
      "Tomorrow will come. You won't be ready.",
    ]
    return nightMessages[Math.floor(Math.random() * nightMessages.length)]
  }

  // Day of week context
  if (day === 1) {
    return "Monday. You'll say you'll start fresh. You won't."
  }
  if (day === 5) {
    return "Friday. You'll pretend to work while planning the weekend."
  }
  if (day === 6 || day === 0) {
    return "Weekend. You'll rest instead of catching up. Again."
  }

  // Deadline context
  const urgentDeadlines = deadlines.filter(d => {
    const deadlineDate = d.deadline instanceof Date ? d.deadline : new Date(d.deadline)
    return differenceInHours(deadlineDate, currentTime) < 24
  })

  if (urgentDeadlines.length > 0) {
    const deadlineMessages = [
      `You have ${urgentDeadlines.length} deadline${urgentDeadlines.length > 1 ? 's' : ''} in the next 24 hours. This is fine.`,
      "Urgent deadline. You'll start 2 hours before it's due.",
      "The deadline is close. Your panic is just beginning.",
      "You have less than a day. You'll need a miracle.",
      "Time is running out. You're scrolling.",
    ]
    return deadlineMessages[Math.floor(Math.random() * deadlineMessages.length)]
  }

  // Month context
  if (month === 11) {
    const yearProgress = ((currentTime.getTime() - new Date(year, 0, 1).getTime()) / (new Date(year + 1, 0, 1).getTime() - new Date(year, 0, 1).getTime()) * 100).toFixed(0)
    return `${yearProgress}% of the year is gone. What do you have to show for it?`
  }

  // Default existential messages
  const defaultMessages = [
    "Time doesn't care about your plans. It just leaves.",
    "You'll probably procrastinate until the last hour. We both know this.",
    "Your future self will hate your current self's time management.",
    "The clock doesn't stop because you're tired. It keeps going.",
    "Tomorrow you'll wish you started today. You won't.",
    "The days are long but the years are short. You're wasting both.",
    "Time waits for no one. Especially not for you.",
    "You're not running out of time. You're wasting it.",
    "The clock is ticking. You're scrolling.",
    "You have 86,400 seconds today. How many have you wasted?",
    "You're not busy. You're just avoiding what matters.",
    "The deadline isn't moving closer. You're just standing still.",
    "Productivity apps won't fix procrastination. Neither will this one.",
    "You've had this tab open for 20 minutes. Still nothing done.",
    "The to-do list grows. The motivation shrinks. Classic.",
    "You're not overwhelmed. You're just not starting.",
    "Time management is simple. You just won't do it.",
    "The perfect moment doesn't exist. Start now. You won't.",
    "You're reading this instead of working. We noticed.",
    "The clock mocks you. You deserve it.",
    "You have enough time. You just don't use it.",
    "Motivation is a lie. Discipline is the truth. You have neither.",
    "The day started without you. It might end that way too.",
    "You're not taking a break. You're quitting.",
    "Time is the one resource you can't renew. You're burning it.",
    "The future you want requires the work you're avoiding.",
    "You're not tired. You're bored with your own excuses.",
    "Every second you waste is a second you'll never get back. Obvious.",
    "The clock doesn't judge. It just counts. You should too.",
    "You're not waiting for inspiration. You're procrastinating.",
    "Time passes whether you use it or not. You're choosing not to.",
  ]
  return defaultMessages[Math.floor(Math.random() * defaultMessages.length)]
}

function ContextSentence({ currentTime }: { currentTime: Date }) {
  const { deadlines } = useStore()
  const [context, setContext] = useState('')

  useEffect(() => {
    const updateContext = () => {
      setContext(getContextualMessage(deadlines, currentTime))
    }

    updateContext()
    const interval = setInterval(updateContext, 20000)
    return () => clearInterval(interval)
  }, [deadlines])

  return (
    <div className="p-2">
      <p className="text-lg text-gray-400 text-center leading-relaxed">
        {context}
      </p>
    </div>
  )
}

export default React.memo(ContextSentence)
