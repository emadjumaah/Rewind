import { useEffect } from 'react'
import { useStore } from '../store'
import { accentHex } from '../lib/colors'
import { dayRemaining } from '../lib/time'

const SIZE = 64

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function draw(ctx: CanvasRenderingContext2D, accent: string, frac: number) {
  const c = SIZE / 2
  ctx.clearRect(0, 0, SIZE, SIZE)

  // Dark rounded badge — keeps the favicon legible on any tab background.
  ctx.fillStyle = '#030712'
  roundRect(ctx, 0, 0, SIZE, SIZE, 14)
  ctx.fill()

  // Sand-glass day fill: the part of the day that has drained down.
  const Rf = 22
  const fillTop = c - Rf + (1 - frac) * (2 * Rf)
  ctx.save()
  ctx.beginPath()
  ctx.arc(c, c, Rf, 0, Math.PI * 2)
  ctx.clip()
  ctx.fillStyle = accent
  ctx.globalAlpha = 0.18
  ctx.fillRect(c - Rf, fillTop, 2 * Rf, c + Rf - fillTop)
  ctx.globalAlpha = 0.6
  ctx.fillRect(c - Rf, fillTop, 2 * Rf, 1.4)
  ctx.restore()

  // Depleting ring: faint full track + accent arc draining counter-clockwise.
  const R = 25
  ctx.lineWidth = 3.4
  ctx.lineCap = 'round'
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.beginPath()
  ctx.arc(c, c, R, 0, Math.PI * 2)
  ctx.stroke()
  if (frac > 0.01) {
    const start = -Math.PI / 2
    ctx.strokeStyle = accent
    ctx.beginPath()
    ctx.arc(c, c, R, start, start - frac * Math.PI * 2, true)
    ctx.stroke()
  }

  // Hands, reversed.
  const hand = (x2: number, y2: number, w: number, color: string) => {
    ctx.strokeStyle = color
    ctx.lineWidth = w
    ctx.beginPath()
    ctx.moveTo(c, c)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }
  hand(22, 21, 4, 'rgba(255,255,255,0.85)')
  hand(44, 22, 2.6, 'rgba(255,255,255,0.55)')
  hand(25, 47, 1.4, accent)

  // Centre cap.
  ctx.fillStyle = accent
  ctx.beginPath()
  ctx.arc(c, c, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#030712'
  ctx.beginPath()
  ctx.arc(c, c, 1.7, 0, Math.PI * 2)
  ctx.fill()
}

/**
 * Redraws the favicon as the day drains. Same mark as the app icon, but the
 * accent ring and the sand fill track the live fraction of today still ahead —
 * so the tab icon itself empties out as the day goes.
 */
export function useDrainingFavicon() {
  const accentColor = useStore((s) => s.settings.accentColor)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = SIZE
    canvas.height = SIZE
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.removeAttribute('type') // was image/svg+xml; we now feed PNG data URLs

    const accent = accentHex(accentColor)
    const render = () => {
      draw(ctx, accent, dayRemaining(new Date()))
      link!.href = canvas.toDataURL('image/png')
    }

    render()
    const interval = setInterval(render, 30_000)
    return () => clearInterval(interval)
  }, [accentColor])
}
