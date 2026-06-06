import { useState, useEffect } from 'react'
import { useStore } from '../store'

const contexts = [
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
  "You have enough time. You just don't use it well.",
  "Tomorrow you'll wish you started today. You won't.",
  "The perfect time to start was yesterday. The second best is now. You won't.",
  "Your deadlines are self-imposed. You're still going to miss them.",
  "Time management is just managing yourself. You're bad at it.",
  "The hours you waste today are gone forever. Forever is a long time.",
  "You're not busy. You're just inefficient.",
  "The work expands to fill the time available. You're proving Parkinson right.",
  "You'll feel better after you start. You won't start.",
  "The difference between success and failure is how you use time. You're failing.",
  "Time is free. But it's priceless. You can't own it, but you can spend it.",
  "You have the same 24 hours as everyone else. You just use yours worse.",
  "The days are long but the years are short. You're wasting both.",
  "You'll remember what you didn't do more than what you did.",
  "Time waits for no one. Especially not for you.",
  "Your to-do list is just a list of things you won't do.",
  "The future is promised to no one. You're acting like you have forever.",
  "You're not running out of time. You're wasting it.",
  "The best time to plant a tree was 20 years ago. You didn't.",
  "Your calendar is full of things that don't matter.",
  "Time is what you want most, but what you use worst.",
  "You'll never find time for anything. You have to make it. You won't.",
  "The days you don't take action are the days you lose forever.",
  "Your inbox is full. Your mind is empty. That's not a good trade.",
  "Time flies when you're procrastinating. It drags when you're working.",
  "You have enough time. You just don't have enough discipline.",
  "The clock is ticking. You're scrolling.",
  "Your deadlines are closer than they appear. You're not ready.",
  "Time is the most valuable thing you spend. You're spending it poorly.",
  "You'll regret the time you didn't spend wisely. You already do.",
  "The hours pass whether you use them or not. You're not using them.",
  "Your phone is full of time-wasters. You're using them all.",
  "Time is a created thing. You can't manage time, you manage yourself.",
  "You're not overwhelmed. You're just unorganized.",
  "The day has 24 hours. You're using about 4 of them productively.",
  "Your attention span is shorter than your to-do list. Both are problems.",
  "Time is the coin of your life. You're spending it on cheap things.",
  "You'll always be busy. You'll never be ready.",
  "The future is created by what you do today. You're doing nothing.",
  "Your schedule is a suggestion. You're not following it.",
  "Time is the wisest counselor of all. You're not listening.",
  "You have the time. You just don't have the focus.",
  "The days pass. Your deadlines don't move. You're in trouble.",
  "Your procrastination is a choice. You keep choosing it.",
  "Time doesn't forgive. It doesn't forget. It just passes.",
  "You're not waiting for the right time. You're avoiding the work.",
  "The clock has no sympathy. Neither does your boss.",
  "Your time is your life. You're giving it away for free.",
  "You'll be busy until you're dead. That's not a strategy.",
  "Time is the one thing you can never get back. You're wasting it.",
  "Your distractions are expensive. You can't afford them.",
  "The night is long. Your deadline is tomorrow. You're not sleeping.",
  "You're not a perfectionist. You're a procrastinator. There's a difference.",
  "Time is what we want most, but what we use worst.",
  "Your future is being created right now. You're creating nothing.",
  "The days are getting shorter. Your to-do list is getting longer.",
  "You're not taking a break. You're quitting early.",
  "Time is a terrible master but a great servant. You're serving it poorly.",
  "Your anxiety about time is wasting your time.",
  "The clock keeps moving. You keep stalling.",
  "You have 86,400 seconds today. How many have you wasted?",
  "Time is more valuable than money. You can get more money.",
  "Your deadlines are not suggestions. They're consequences.",
  "The present moment is all you have. You're not in it.",
  "You're not multitasking. You're just doing multiple things badly.",
  "Time is the fire in which we burn. You're adding fuel.",
  "Your calendar is full. Your accomplishments are empty.",
  "The days go by. Your goals stay the same.",
  "You're not prioritizing. You're avoiding.",
  "Time is a limited resource. You're treating it like it's infinite.",
  "Your phone is a time machine. It only goes backward.",
  "The work won't do itself. You're hoping it will.",
  "You're not tired. You're unmotivated.",
  "Time is the school in which we learn. You're not studying.",
  "Your distractions are costing you your future.",
  "The clock is neutral. Your relationship with it is not.",
  "You're not waiting for inspiration. You're procrastinating.",
  "Time is the most valuable thing a man can spend. You're spending it cheaply.",
  "Your to-do list is a graveyard of good intentions.",
  "The days are long. The years are short. You're wasting the days.",
  "You're not busy. You're just avoiding the important work.",
  "Time is a created thing. To say 'I don't have time' is to say 'I don't want to'.",
  "Your deadlines are approaching. You're standing still.",
  "The clock ticks. You scroll. Same as always.",
  "You'll never have more time. You'll just have less life.",
  "Time is what we want most, but use worst.",
  "Your future self is watching you right now. They're disappointed.",
  "The days pass. The regrets accumulate. You're not learning.",
  "You're not taking it slow. You're stalling.",
  "Time is the one thing you can never get more of. You're wasting it.",
  "Your phone is a black hole for time. You keep falling in.",
  "The work is waiting. You're not.",
  "You're not thinking about it. You're worrying about it.",
  "Time is a gift. You're returning it unopened.",
  "Your schedule is full of busy work. The important work waits.",
  "The clock doesn't care about your feelings. It cares about time.",
  "You're not planning. You're worrying.",
  "Time is the wisest of all teachers. You're not paying attention.",
  "Your distractions are endless. Your time is not.",
  "The days slip away. You're not holding on.",
  "You're not resting. You're avoiding.",
  "Time is the currency of life. You're bankrupt.",
]

export default function ReverseClock() {
  const { settings } = useStore()
  const [time, setTime] = useState(new Date())
  const [context, setContext] = useState('')

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const updateContext = () => {
      const shuffled = [...contexts].sort(() => Math.random() - 0.5)
      setContext(shuffled[0])
    }

    updateContext()
    const interval = setInterval(updateContext, 15000)
    return () => clearInterval(interval)
  }, [])

  const seconds = time.getSeconds()
  const minutes = time.getMinutes()
  const hours = time.getHours()

  const secondDeg = -(seconds / 60) * 360
  const minuteDeg = -((minutes + seconds / 60) / 60) * 360
  const hourDeg = -((hours % 12 + minutes / 60) / 12) * 360

  const secondHandX = 100 + 75 * Math.sin((secondDeg * Math.PI) / 180)
  const secondHandY = 100 - 75 * Math.cos((secondDeg * Math.PI) / 180)
  const minuteHandX = 100 + 65 * Math.sin((minuteDeg * Math.PI) / 180)
  const minuteHandY = 100 - 65 * Math.cos((minuteDeg * Math.PI) / 180)
  const hourHandX = 100 + 50 * Math.sin((hourDeg * Math.PI) / 180)
  const hourHandY = 100 - 50 * Math.cos((hourDeg * Math.PI) / 180)

  const getNumberPosition = (num: number) => {
    const angle = (num - 3) * (Math.PI / 6)
    const radius = 80
    const x = 100 + radius * Math.cos(angle)
    const y = 100 + radius * Math.sin(angle)
    return { x, y }
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="relative w-full aspect-square max-w-[480px] max-h-[480px]">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />

          {Array.from({ length: 12 }, (_, i) => {
            const num = i + 1
            const { x, y } = getNumberPosition(num)
            return (
              <text
                key={num}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.4)"
                fontSize="12"
                fontWeight="500"
              >
                {num}
              </text>
            )
          })}

          <circle
            cx="100"
            cy="100"
            r="3"
            fill="rgba(255,255,255,0.8)"
          />

          <line
            x1="100"
            y1="100"
            x2={secondHandX}
            y2={secondHandY}
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <line
            x1="100"
            y1="100"
            x2={minuteHandX}
            y2={minuteHandY}
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <line
            x1="100"
            y1="100"
            x2={hourHandX}
            y2={hourHandY}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="p-2">
        <p className="text-lg text-gray-400 text-center leading-relaxed">
          {context}
        </p>
      </div>
    </div>
  )
}
