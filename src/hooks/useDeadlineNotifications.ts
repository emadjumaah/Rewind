import { useEffect } from 'react'
import { useStore } from '../store'
import { useT } from '../i18n'

const SEEN_KEY = 'rewind-notified'

// Buckets ordered most-urgent → least-urgent. `h` is the upper bound in hours.
const BUCKETS = [
  { key: 'over', max: 0 },
  { key: '1', max: 1 },
  { key: '24', max: 24 },
  { key: '72', max: 72 },
] as const

function loadSeen(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

function saveSeen(seen: Set<string>) {
  localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]))
}

/**
 * Fires a browser notification as each deadline crosses a threshold
 * (72h → 24h → 1h → overdue), at most once per threshold per deadline.
 *
 * Honest scope: this only runs while the app/tab is open. True background
 * delivery would need a push backend, which a static PWA doesn't have.
 */
export function useDeadlineNotifications() {
  const { deadlines, settings } = useStore()
  const T = useT()

  useEffect(() => {
    if (!settings.notifications) return
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return

    const check = () => {
      const seen = loadSeen()
      const now = Date.now()
      let changed = false

      for (const d of deadlines) {
        if (d.demo) continue // sample data shouldn't nag anyone
        const date = d.deadline instanceof Date ? d.deadline : new Date(d.deadline)
        const hoursLeft = (date.getTime() - now) / 3_600_000

        // Current bucket = first whose upper bound the deadline is at/under.
        const idx = hoursLeft < 0 ? 0 : BUCKETS.findIndex((b) => b.max > 0 && hoursLeft <= b.max)
        if (idx < 0) continue // more than 72h out — nothing to say yet

        const bucket = BUCKETS[idx]
        const fireKey = `${d.id}@${bucket.key}`
        if (!seen.has(fireKey)) {
          const body =
            bucket.key === 'over' ? T.notifOverdue(d.title)
            : bucket.key === '1'  ? T.notif1(d.title)
            : bucket.key === '24' ? T.notif24(d.title)
            :                       T.notif72(d.title)
          try {
            new Notification('Rewind', { body, tag: fireKey })
          } catch {
            /* notification construction can throw on some platforms — ignore */
          }
        }
        // Mark this bucket + all less-urgent ones seen so a freshly-added,
        // already-urgent deadline doesn't retro-fire every higher threshold.
        for (let i = idx; i < BUCKETS.length; i++) {
          const k = `${d.id}@${BUCKETS[i].key}`
          if (!seen.has(k)) { seen.add(k); changed = true }
        }
      }

      if (changed) saveSeen(seen)
    }

    check()
    const interval = setInterval(check, 60_000)
    return () => clearInterval(interval)
  }, [deadlines, settings.notifications, T])
}
