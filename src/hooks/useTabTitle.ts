import { useEffect } from 'react'
import { useT } from '../i18n'
import { msLeftToday, hms } from '../lib/time'

const BRAND = 'Rewind — time, honestly.'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Turns the browser tab into a memento-mori. While Rewind is the active tab the
 * big on-screen countdown already does the talking, so the title stays the brand.
 * The moment you tab away, the title quietly becomes the time draining out of
 * today — so even in a strip of twenty tabs, you can still see it going.
 *
 * On top of that, the top of every hour flashes a brief reminder in the tab —
 * a quiet pulse to mark another hour gone. No sound.
 */
const PULSE_MS = 6000

export function useTabTitle() {
  const T = useT()

  useEffect(() => {
    let lastHour = new Date().getHours()
    let pulseUntil = 0

    const render = () => {
      const now = new Date()
      const hour = now.getHours()
      if (hour !== lastHour) {
        lastHour = hour
        pulseUntil = now.getTime() + PULSE_MS
      }

      if (now.getTime() < pulseUntil) {
        document.title = T.tabPulse
        return
      }
      if (!document.hidden) {
        document.title = BRAND
        return
      }
      const { hours, minutes, seconds } = hms(msLeftToday(now))
      document.title = T.tabTitle(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`)
    }

    render()
    const interval = setInterval(render, 1000)
    document.addEventListener('visibilitychange', render)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', render)
      document.title = BRAND
    }
  }, [T])
}
