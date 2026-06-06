Build a React + Vite + TypeScript web app called "Rewind."

A real-time deadline and time-decay dashboard that is genuinely useful
AND has a dark, self-aware sense of humor. Not a joke app. Not a
sterile productivity tool. Something in between — like a doctor who
gives you bad news but makes you laugh anyway.

---

CORE IDEA

People are bad at feeling how much time they have left.
Not tracking tasks — FEELING the weight of disappearing time.

This app makes that feeling honest, visible, and slightly funny.
The backward clock is not a gimmick. It is the whole philosophy:
time is always running out, you might as well watch it go.

---

TONE

Think: a brutally honest friend who is also funny about it.

Examples of the voice:
- "11 days left. 4 of them are weekend. Good luck."
- "You've used 74% of your year. What do you have to show for it?"
- "This deadline is in 6 hours. This is fine."
- "3 weekends left in the month. One of them you'll waste. Statistically."

NOT motivational poster language.
NOT mean or stressful.
Dark, dry, self-aware. Like the app knows it can't help you,
but it's going to be honest with you anyway.

---

STACK

React, Vite, TypeScript, TailwindCSS, Framer Motion,
Zustand, Lucide React, date-fns.

---

LAYOUT — desktop first, second monitor friendly

1. HERO REVERSE CLOCK
   Large centerpiece. Analog clock, hands move counter-clockwise.
   Real time, displayed backward.
   Below it: one dry contextual line that updates live.
   Example: "It is 3:42 PM. You have 2h 18m of today left.
   You probably need 4."

2. DEADLINE CARDS
   User adds projects with: title, deadline, estimated hours needed.
   Each card shows:
   - Days / hours remaining
   - Honest assessment: "You have 40h left. You said you need 60h.
     This is a you problem."
   - Reverse progress ring, draining not filling
   - Urgency shifts card color as deadline approaches:
     >7 days: calm (muted cyan)
     3-7 days: active (muted blue)
     1-3 days: warning (muted amber)
     <24h: critical (muted red, subtle pulse)
   No task lists. Just time pressure made visible.

3. TIME REMAINING ANALYTICS
   Real calculated stats, delivered with dry humor:
   - "5h 12m left today"
   - "27 weekends left this year. Plan accordingly."
   - "2026 is 58% gone. Quarter remaining: not enough."
   - "Work hours left this week: 11. Meetings will take 6."
   Animated reverse-draining bars.

4. DEEP WORK FOCUS MODE
   Fullscreen. Reverse countdown from 90 minutes.
   Minimal UI. Subtle ambient dark background, slow particle movement.
   One line of dry encouragement at start:
   "90 minutes. No excuses. We'll see."
   When timer ends: "Done. Or you gave up. Either way, time passed."

5. QUOTE FEED
   Rotating every 20 seconds. Dry, honest, slightly existential.
   Examples already given above. Add more in this voice.
   Never motivational. Always true.

6. COMMAND PALETTE
   CMD/CTRL + K.
   Add deadline, start focus mode, toggle fullscreen.
   Fast, minimal, keyboard-first.

7. SETTINGS
   Accent color, motion intensity, 12h/24h, focus session length.
   Persist in localStorage.

---

VISUAL DESIGN

Premium but not sterile. Dark. Glassmorphism, subtle blur layers,
soft shadows. Muted colors only — cyan, purple, amber, red urgency.
No bright colors. No cartoon UI. No gamer aesthetics.

The humor lives in the TEXT, not the visuals.
The visuals stay calm and beautiful.
The words are honest and slightly funny.
That contrast IS the personality of the app.

---

DEMO DATA

Seed with 3 realistic projects:
- One comfortable (9 days left, on track)
- One tight (3 days left, behind on hours)
- One critical (<24h, clearly not happening)

The cards should speak for themselves when someone first opens it.

---

WHAT THIS IS NOT

Not a task manager. Not a kanban. Not a team tool.
Not a motivational app. Not a joke app.

It is an honest mirror for how you're spending time,
with enough dark humor to make looking at it bearable.