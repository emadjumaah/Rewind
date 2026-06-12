import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AccentColor } from '../lib/colors'

export type DeadlineCategory = 'work' | 'life'

export interface Deadline {
  id: string
  title: string
  deadline: Date
  estimatedHours: number
  category?: DeadlineCategory // defaults to 'work' when absent
  demo?: boolean
}

export interface BuriedDeadline {
  id: string
  title: string
  deadline: Date // when it was due
  buriedAt: Date // when you finally admitted it
  madeIt: boolean | null // null = life events; they just pass, no verdict
  category?: DeadlineCategory
}

export interface FocusSession {
  startedAt: number // epoch ms
  targetSec: number // what they committed to
  durationSec: number // what they actually did
  completed: boolean
}

export interface Settings {
  accentColor: AccentColor
  motionIntensity: 'low' | 'medium' | 'high'
  timeFormat: '12h' | '24h'
  focusSessionLength: number
  widgetMode: boolean
  darkMode: boolean
  language: 'en' | 'ar'
  notifications: boolean
  birthDate?: string // ISO date (yyyy-mm-dd) for the Life in Weeks view
  lifeExpectancy: number // years, for the Life in Weeks grid
}

interface AppState {
  deadlines: Deadline[]
  focusSessions: FocusSession[]
  graveyard: BuriedDeadline[]
  settings: Settings
  isFocusMode: boolean
  isCommandPaletteOpen: boolean
  isDeadlineModalOpen: boolean
  isLifeWeeksOpen: boolean
  isGraveyardOpen: boolean
  addDeadline: (deadline: Omit<Deadline, 'id'>) => void
  updateDeadline: (id: string, deadline: Omit<Deadline, 'id'>) => void
  removeDeadline: (id: string) => void
  buryDeadline: (id: string, madeIt: boolean | null) => void
  removeBuried: (id: string) => void
  recordFocusSession: (session: FocusSession) => void
  updateSettings: (settings: Partial<Settings>) => void
  toggleFocusMode: () => void
  setCommandPaletteOpen: (open: boolean) => void
  setDeadlineModalOpen: (open: boolean) => void
  setLifeWeeksOpen: (open: boolean) => void
  setGraveyardOpen: (open: boolean) => void
  toggleWidgetMode: () => void
}

const demoDeadlines: Deadline[] = [
  {
    id: 'demo-1',
    title: 'Q4 Report',
    deadline: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    estimatedHours: 20,
    demo: true,
  },
  {
    id: 'demo-2',
    title: 'Client Presentation',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    estimatedHours: 40,
    demo: true,
  },
  {
    id: 'demo-3',
    title: 'Feature Launch',
    deadline: new Date(Date.now() + 20 * 60 * 60 * 1000),
    estimatedHours: 30,
    demo: true,
  },
  {
    id: 'demo-4',
    title: 'Summer holiday',
    deadline: new Date(Date.now() + 64 * 24 * 60 * 60 * 1000),
    estimatedHours: 0,
    category: 'life',
    demo: true,
  },
]

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      deadlines: demoDeadlines,
      focusSessions: [],
      graveyard: [],
      settings: {
        accentColor: 'cyan',
        motionIntensity: 'medium',
        timeFormat: '24h',
        focusSessionLength: 90,
        widgetMode: false,
        darkMode: true,
        language: 'en',
        notifications: false,
        lifeExpectancy: 90,
      },
      isFocusMode: false,
      isCommandPaletteOpen: false,
      isDeadlineModalOpen: false,
      isLifeWeeksOpen: false,
      isGraveyardOpen: false,
      addDeadline: (deadline) =>
        set((state) => ({
          deadlines: [...state.deadlines, { ...deadline, id: Date.now().toString() }],
        })),
      updateDeadline: (id, deadline) =>
        set((state) => ({
          deadlines: state.deadlines.map((d) =>
            d.id === id ? { ...d, ...deadline } : d
          ),
        })),
      removeDeadline: (id) =>
        set((state) => ({
          deadlines: state.deadlines.filter((d) => d.id !== id),
        })),
      buryDeadline: (id, madeIt) =>
        set((state) => {
          const deadline = state.deadlines.find((d) => d.id === id)
          if (!deadline) return state
          return {
            deadlines: state.deadlines.filter((d) => d.id !== id),
            graveyard: [
              {
                id: deadline.id,
                title: deadline.title,
                deadline:
                  deadline.deadline instanceof Date
                    ? deadline.deadline
                    : new Date(deadline.deadline),
                buriedAt: new Date(),
                madeIt,
                category: deadline.category,
              },
              ...state.graveyard,
            ].slice(0, 200),
          }
        }),
      removeBuried: (id) =>
        set((state) => ({
          graveyard: state.graveyard.filter((d) => d.id !== id),
        })),
      recordFocusSession: (session) =>
        set((state) => ({
          focusSessions: [...state.focusSessions, session].slice(-200),
        })),
      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),
      toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
      setDeadlineModalOpen: (open) => set({ isDeadlineModalOpen: open }),
      setLifeWeeksOpen: (open) => set({ isLifeWeeksOpen: open }),
      setGraveyardOpen: (open) => set({ isGraveyardOpen: open }),
      toggleWidgetMode: () => set((state) => ({ settings: { ...state.settings, widgetMode: !state.settings.widgetMode } })),
    }),
    {
      name: 'rewind-storage-v2',
      // Persist data, not UI state — otherwise a reload with a modal or
      // focus mode open restores it open, forever.
      partialize: (state) => ({
        deadlines: state.deadlines,
        focusSessions: state.focusSessions,
        graveyard: state.graveyard,
        settings: state.settings,
      }),
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const parsed = JSON.parse(str)
          if (parsed.state?.deadlines) {
            parsed.state.deadlines = parsed.state.deadlines.map((d: any) => ({
              ...d,
              deadline: new Date(d.deadline),
            }))
          }
          if (parsed.state?.graveyard) {
            parsed.state.graveyard = parsed.state.graveyard.map((d: any) => ({
              ...d,
              deadline: new Date(d.deadline),
              buriedAt: new Date(d.buriedAt),
            }))
          }
          return parsed
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        },
      },
    }
  )
)
