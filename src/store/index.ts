import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Deadline {
  id: string
  title: string
  deadline: Date
  estimatedHours: number
}

export interface Settings {
  accentColor: 'cyan' | 'purple' | 'amber' | 'red'
  motionIntensity: 'low' | 'medium' | 'high'
  timeFormat: '12h' | '24h'
  focusSessionLength: number
  widgetMode: boolean
  darkMode: boolean
}

interface AppState {
  deadlines: Deadline[]
  settings: Settings
  isFocusMode: boolean
  isCommandPaletteOpen: boolean
  addDeadline: (deadline: Omit<Deadline, 'id'>) => void
  updateDeadline: (id: string, deadline: Omit<Deadline, 'id'>) => void
  removeDeadline: (id: string) => void
  updateSettings: (settings: Partial<Settings>) => void
  toggleFocusMode: () => void
  setCommandPaletteOpen: (open: boolean) => void
  toggleWidgetMode: () => void
}

const demoDeadlines: Deadline[] = [
  {
    id: '1',
    title: 'Q4 Report',
    deadline: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    estimatedHours: 20,
  },
  {
    id: '2',
    title: 'Client Presentation',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    estimatedHours: 40,
  },
  {
    id: '3',
    title: 'Feature Launch',
    deadline: new Date(Date.now() + 20 * 60 * 60 * 1000),
    estimatedHours: 30,
  },
]

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      deadlines: demoDeadlines,
      settings: {
        accentColor: 'cyan',
        motionIntensity: 'medium',
        timeFormat: '24h',
        focusSessionLength: 90,
        widgetMode: false,
        darkMode: true,
      },
      isFocusMode: false,
      isCommandPaletteOpen: false,
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
      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),
      toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
      toggleWidgetMode: () => set((state) => ({ settings: { ...state.settings, widgetMode: !state.settings.widgetMode } })),
    }),
    {
      name: 'rewind-storage-v2',
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
