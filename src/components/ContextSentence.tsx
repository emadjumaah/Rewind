import { useState, useEffect, useRef } from 'react'
import React from 'react'
import { useStore, Deadline } from '../store'
import { differenceInHours } from 'date-fns'

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]

const getContextualMessage = (deadlines: Deadline[], currentTime: Date): string => {
  const hour = currentTime.getHours()
  const day  = currentTime.getDay()

  if (day === 1) return pick([
    "Monday. You'll say you'll start fresh. You won't.",
    "New week. Same you. Lower your expectations accordingly.",
    "Monday again. The calendar is merciless.",
    "The week stretches out like a punishment you scheduled yourself.",
    "Clean slate. You'll dirty it by noon.",
    "Monday motivation is just Tuesday's disappointment on a delay.",
  ])

  if (day === 5) return pick([
    "Friday. You'll pretend to work while planning the weekend.",
    "End of the week. Whatever wasn't done isn't getting done today.",
    "Friday afternoon. The work week's most convincing lie.",
    "The psychological finish line. The work didn't get the memo.",
    "You didn't finish what you started Monday. But it's Friday now, so.",
    "Friday. The weekly tradition of pretending this week was different.",
  ])

  if (day === 0 || day === 6) return pick([
    "Weekend. You'll rest instead of catching up. Again.",
    "It's the weekend. The deadlines don't know that.",
    "A day off. Your future self will pay for this.",
    "Two days. You'll waste both and feel guilty about one.",
    "Rest is productive. You're not resting. You're avoiding.",
    "The work will be there Monday. So will the regret.",
    "Weekend. The guilt is free. The time is not.",
  ])

  if (hour >= 5 && hour < 9) return pick([
    "The day begins. So does the procrastination.",
    "Morning. You'll waste the best hours on the wrong things.",
    "The sun is up. Your motivation is not.",
    "Early hours. You'll scroll through them.",
    "Morning coffee won't fix your time management.",
    "Fresh start. You said that yesterday too.",
    "The alarm went off. Your productivity hasn't.",
    "You woke up. That's the bar. And you barely cleared it.",
    "Morning. The day is full of potential you'll squander.",
    "Rise and decide to do nothing with the next two hours.",
  ])

  if (hour >= 9 && hour < 12) return pick([
    "The morning is slipping away. You haven't started.",
    "You have 3 hours until lunch. You'll use 0.5 productively.",
    "The work day is 25% gone. Your progress is 0%.",
    "Late morning. Still haven't started. Typical.",
    "The clock doesn't care about your morning routine.",
    "Peak hours. You're spending them on this.",
    "You could have started an hour ago. You didn't.",
    "Three hours until lunch. You'll work for 20 minutes of them.",
    "The to-do list isn't getting shorter by staring at the app.",
    "Halfway through the morning. Quarter-way through your ambition.",
    "The best hours of the day. Gone. Almost.",
  ])

  if (hour >= 12 && hour < 14) return pick([
    "Lunch break. You'll extend it by 30 minutes.",
    "Midday. Half the day is gone. What do you have to show?",
    "You're not hungry. You're avoiding work.",
    "Lunch won't make the deadlines disappear.",
    "The afternoon will be harder. You'll be less productive.",
    "Half the day. Half the excuses still left to use.",
    "Noon. The morning is gone and you can't have it back.",
    "Lunch. Your second most productive task of the day.",
    "You'll eat slower than you'll work this afternoon.",
    "The midpoint. Neither side looks particularly good.",
  ])

  if (hour >= 14 && hour < 17) return pick([
    "Afternoon slump. You'll blame the time of day.",
    "The work day is 60% over. You're 10% done.",
    "You're not tired. You're bored.",
    "The afternoon is for catching up. You won't.",
    "Your energy is low. Your to-do list is high.",
    "3pm. The graveyard of good intentions.",
    "You'll tell yourself you work better under pressure. You don't.",
    "Post-lunch coma. You planned for this. You still did nothing.",
    "The afternoon is a graveyard and you're the caretaker.",
    "One notification away from losing the whole afternoon.",
    "You're not stuck. You're just comfortable being stuck.",
  ])

  if (hour >= 17 && hour < 20) return pick([
    "Work day over. You'll work late anyway.",
    "You didn't finish. You'll say you will tomorrow. You won't.",
    "Evening. Time to regret the day you wasted.",
    "The work day is done. The guilt is just starting.",
    "You'll work late to compensate for the day you wasted.",
    "Five o'clock. The tasks remain. So do you.",
    "Another day filed under 'almost got things done'.",
    "You survived another workday. Not by doing much.",
    "Close the laptop. Tomorrow's problems are patient. Too patient.",
    "Evening. The deadline didn't move. You did. Backwards.",
  ])

  if (hour >= 20 || hour < 5) return pick([
    "Late night. You're not productive. You're just awake.",
    "Sleep won't fix the deadlines. But you need it anyway.",
    "The night is long. Your to-do list is longer.",
    "You're not a night owl. You're just procrastinating.",
    "Tomorrow will come. You won't be ready.",
    "It's late. The work is still there. So is tomorrow's version of this.",
    "Working at midnight doesn't make you dedicated. It makes you disorganized.",
    "Past midnight. The work didn't do itself. Shocker.",
    "You said you'd sleep by ten. You lied to yourself again.",
    "The night shift you gave yourself. Unpaid. Unnecessary.",
  ])

  const urgentDeadlines = deadlines.filter(d => {
    const deadlineDate = d.deadline instanceof Date ? d.deadline : new Date(d.deadline)
    return differenceInHours(deadlineDate, currentTime) < 24
  })

  if (urgentDeadlines.length > 0) return pick([
    `${urgentDeadlines.length} deadline${urgentDeadlines.length > 1 ? 's' : ''} in the next 24 hours. This is fine.`,
    "Urgent deadline. You'll start 2 hours before it's due.",
    "The deadline is close. Your panic is just beginning.",
    "You have less than a day. You'll need a miracle. Or an extension.",
    "Time is running out. You're scrolling.",
    "It's due tomorrow. You knew this was coming. You did nothing.",
    "The deadline didn't sneak up on you. You watched it approach.",
  ])

  return pick([
    "Time doesn't care about your plans. It just leaves.",
    "You'll probably procrastinate until the last hour. We both know this.",
    "Your future self will hate your current self's time management.",
    "The clock doesn't stop because you're tired. It keeps going.",
    "Tomorrow you'll wish you started today. You won't start tomorrow either.",
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
    "Another hour gone. Another hour you'll pretend didn't count.",
    "You'll feel better about the day if you actually do something in it.",
    "The gap between who you are and who you want to be is measured in wasted hours.",
    "This app isn't going to help you. But at least you're honest about needing it.",
    "You're not overwhelmed by the work. You're overwhelmed by the thought of starting it.",
    "Your planner is full. Your output is not.",
    "Discipline is doing it when you don't want to. You've been 'not wanting to' for hours.",
    "Busy and productive are different words. You know which one you are.",
    "You'll do it right after this. You've said that six times today.",
    "The clock has no sympathy. Neither does the deadline.",
    "Progress requires movement. Staring at this counts as neither.",
    "You're not waiting for the right moment. The right moment is embarrassed for you.",
    "The best time to start was an hour ago. The second best is also in the past.",
    "Check the deadlines. Then pretend you didn't.",
    "You're not stuck. You're just choosing to stay where you are.",
    "Procrastination is just optimism about how fast you'll work later.",
    "The work exists. You exist. These two facts have yet to interact today.",
    "Someday is not a day of the week. You keep scheduling things there.",
    "You opened this app. Progress! Now open whatever you've been avoiding.",
    "The task didn't grow while you waited. Your dread of it did.",
    "One tab. That's all it takes. Open the thing. You won't.",
    "Time spent regretting yesterday is borrowed from today. Return it.",
  ])
}

function ContextSentence({ currentTime }: { currentTime: Date }) {
  const { deadlines } = useStore()
  const [context, setContext] = useState('')
  const currentTimeRef = useRef(currentTime)
  currentTimeRef.current = currentTime

  useEffect(() => {
    const update = () => setContext(getContextualMessage(deadlines, currentTimeRef.current))
    update()
    const interval = setInterval(update, 20000)
    return () => clearInterval(interval)
  }, [deadlines])

  return (
    <div className="glass rounded-xl px-5 py-3 flex items-center justify-center min-h-[52px]">
      <p className="text-sm text-gray-400 text-center leading-relaxed italic">
        {context}
      </p>
    </div>
  )
}

export default React.memo(ContextSentence)
