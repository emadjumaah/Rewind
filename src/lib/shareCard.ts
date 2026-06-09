// Generates a striking social share image (1200×630, the Open Graph ratio) and
// shares it with a title + description via the Web Share API, falling back to a
// PNG download + clipboard text where file sharing isn't supported.

export interface ShareContent {
  accent: string
  bigStat: string // e.g. "2,140"
  statLabel: string // e.g. "weeks left"
  caption: string // the punchy line
  footer?: string
  rtl?: boolean
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ')
  let line = ''
  let cursorY = y
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY)
      line = word
      cursorY += lineHeight
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, cursorY)
}

/** Render the share card to a canvas. */
export function drawShareCard(content: ShareContent): HTMLCanvasElement {
  const W = 1200
  const H = 630
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  const rtl = !!content.rtl
  ctx.direction = rtl ? 'rtl' : 'ltr'
  const x = rtl ? W - 90 : 90
  ctx.textAlign = rtl ? 'right' : 'left'

  // Background + accent glow
  ctx.fillStyle = '#030712'
  ctx.fillRect(0, 0, W, H)
  const glow = ctx.createRadialGradient(W * 0.78, H * 0.25, 40, W * 0.78, H * 0.25, 760)
  glow.addColorStop(0, content.accent + '33')
  glow.addColorStop(1, '#03071200')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  // Faint week-grid motif in a corner — reinforces the concept
  ctx.fillStyle = 'rgba(255,255,255,0.05)'
  for (let i = 0; i < 7 * 14; i++) {
    const gx = (rtl ? 70 : W - 70 - 14 * 16) + (i % 14) * 16
    const gy = H - 70 - 7 * 16 + Math.floor(i / 14) * 16
    ctx.fillRect(gx, gy, 9, 9)
  }

  // Wordmark
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '600 30px "Courier New", monospace'
  ctx.fillText('REWIND', x, 110)

  // Big stat
  ctx.fillStyle = content.accent
  ctx.font = '800 190px Arial, sans-serif'
  ctx.fillText(content.bigStat, x, 330)

  // Stat label
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = '600 50px Arial, sans-serif'
  ctx.fillText(content.statLabel, x, 400)

  // Caption (wrapped)
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.font = '400 34px Arial, sans-serif'
  wrapText(ctx, content.caption, x, 475, W - 180, 46)

  // Footer
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.font = '400 26px "Courier New", monospace'
  ctx.fillText(content.footer ?? 'rewind.uts.qa', x, H - 52)

  return canvas
}

export type ShareResult = 'shared' | 'downloaded'

/** Share the card image with title/description, or download + copy as fallback. */
export async function shareCard(
  canvas: HTMLCanvasElement,
  meta: { title: string; text: string; url: string },
): Promise<ShareResult> {
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'))
  const nav = navigator as Navigator & {
    canShare?: (data?: ShareData) => boolean
    share?: (data: ShareData) => Promise<void>
  }
  const file = blob ? new File([blob], 'rewind.png', { type: 'image/png' }) : null

  if (file && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share!({ title: meta.title, text: meta.text, url: meta.url, files: [file] })
      return 'shared'
    } catch {
      /* user cancelled or failed — fall through to download */
    }
  }

  if (blob) {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'rewind.png'
    link.click()
    URL.revokeObjectURL(link.href)
  }
  try {
    await navigator.clipboard.writeText(`${meta.text} ${meta.url}`)
  } catch {
    /* clipboard may be unavailable; the image still downloaded */
  }
  return 'downloaded'
}
