import {
  FINGER_COLOR,
  FINGER_NAME,
  type FingerId,
  shiftFingerForLetter,
} from './fingers'
import {
  bindingForChar,
  rowsFor,
  type LayoutVariant,
} from './layout'

export type BadgeDrawOpts = {
  pulse?: number
  reducedMotion?: boolean
  scale?: number
}

const badgeCache = new Map<string, HTMLCanvasElement>()

/** 1 key-unit in px at scale 1 (was 5.6 — larger for readability). */
function uPx(scale: number): number {
  return 7.2 * scale
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

type Tip = { id: FingerId; x: number; y: number; r: number }

function paintKeyboard(
  ctx: CanvasRenderingContext2D,
  variant: LayoutVariant,
  scale: number,
  ox: number,
  oy: number,
  highlights: { code: string; color: string }[],
): number {
  const u = uPx(scale)
  const gap = 0.4 * scale
  const rowH = u * 0.95
  let y = oy
  for (const row of rowsFor(variant)) {
    let x = ox
    for (const key of row) {
      const kw = key.width * u
      const hl = highlights.find((h) => h.code === key.code)
      ctx.fillStyle = hl ? hl.color : key.filler ? '#c5c9ce' : '#d8dce3'
      roundRect(ctx, x, y, kw - gap, rowH, 1.6 * scale)
      ctx.fill()
      if (hl) {
        ctx.save()
        ctx.shadowColor = hl.color
        ctx.shadowBlur = 7 * scale
        roundRect(ctx, x, y, kw - gap, rowH, 1.6 * scale)
        ctx.fill()
        ctx.restore()
      }
      if (key.homeBump) {
        ctx.fillStyle = '#8a9096'
        ctx.fillRect(
          x + (kw - gap) * 0.28,
          y + rowH * 0.7,
          (kw - gap) * 0.3,
          1.5 * scale,
        )
      }
      x += kw
    }
    y += rowH + gap
  }
  return y - oy
}

/**
 * Draw one hand. Tips are always in canvas (parent) coordinates so highlights match.
 * Left: palm facing us, pinky on the left. Right: mirrored.
 */
function drawHand(
  ctx: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  scale: number,
  right: boolean,
  tips: Tip[],
) {
  const w = 48 * scale
  const h = 36 * scale
  const s = scale

  // Local finger layout (left-hand view): pinky → index + thumb
  const fingerIds: FingerId[] = right
    ? ['R5', 'R4', 'R3', 'R2']
    : ['L5', 'L4', 'L3', 'L2']
  const thumbId: FingerId = right ? 'R1' : 'L1'

  // Finger tip centers in local coords (left-hand template before mirror):
  // pinky left (outer) → index right (inner); thumb INNER (toward right / center)
  const localTips: { id: FingerId; lx: number; ly: number; r: number }[] = [
    { id: fingerIds[0]!, lx: 8 * s, ly: 4 * s, r: 4 * s },
    { id: fingerIds[1]!, lx: 17 * s, ly: 2 * s, r: 4 * s },
    { id: fingerIds[2]!, lx: 26 * s, ly: 2 * s, r: 4 * s },
    { id: fingerIds[3]!, lx: 35 * s, ly: 3 * s, r: 4 * s },
    { id: thumbId, lx: 40 * s, ly: 28 * s, r: 4.2 * s },
  ]

  const toWorld = (lx: number, ly: number) => {
    if (right) return { x: originX + w - lx, y: originY + ly }
    return { x: originX + lx, y: originY + ly }
  }

  ctx.save()
  if (right) {
    ctx.translate(originX + w, originY)
    ctx.scale(-1, 1)
  } else {
    ctx.translate(originX, originY)
  }

  // Palm
  ctx.fillStyle = '#e8d5c4'
  roundRect(ctx, 6 * s, 14 * s, 34 * s, 16 * s, 5 * s)
  ctx.fill()

  // Four fingers as capsules
  const fingerGeom = [
    { cx: 8 * s, top: 2 * s, fh: 16 * s },
    { cx: 17 * s, top: 0, fh: 18 * s },
    { cx: 26 * s, top: 0, fh: 18 * s },
    { cx: 35 * s, top: 1 * s, fh: 17 * s },
  ]
  for (const g of fingerGeom) {
    const fw = 6.5 * s
    ctx.fillStyle = '#e8d5c4'
    roundRect(ctx, g.cx - fw / 2, g.top, fw, g.fh, fw / 2)
    ctx.fill()
  }

  // Thumb on the INNER side (right in left-hand local coords → toward the other hand)
  ctx.fillStyle = '#e8d5c4'
  ctx.beginPath()
  ctx.ellipse(40 * s, 26 * s, 4 * s, 9 * s, 0.55, 0, Math.PI * 2)
  ctx.fill()

  // Grey tip circles in local space (same as localTips)
  for (const t of localTips) {
    ctx.fillStyle = '#b0b0b0'
    ctx.beginPath()
    ctx.arc(t.lx, t.ly, t.r, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()

  // World-space tips for highlighting
  for (const t of localTips) {
    const wpos = toWorld(t.lx, t.ly)
    tips.push({ id: t.id, x: wpos.x, y: wpos.y, r: t.r })
  }

  void h
}

function paintTips(
  ctx: CanvasRenderingContext2D,
  tips: Tip[],
  active: FingerId[],
  pulse: number,
  reducedMotion: boolean,
) {
  for (const tip of tips) {
    if (!active.includes(tip.id)) continue
    const color = FINGER_COLOR[tip.id]
    const glow = reducedMotion ? 1 : 0.55 + 0.45 * Math.sin(pulse * Math.PI * 2)
    ctx.save()
    ctx.shadowColor = color
    ctx.shadowBlur = 10 * glow
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(tip.x, tip.y, tip.r * (1 + 0.2 * glow), 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

export function badgePixelSize(scale = 1): { w: number; h: number } {
  const u = uPx(scale)
  const kbW = 15 * u
  const handW = 48 * scale
  const totalW = Math.max(kbW, handW * 2 + 12 * scale) + 12 * scale
  const letterH = 42 * scale
  const kbHApprox = 5 * (u * 0.95 + 0.4 * scale)
  const totalH = letterH + kbHApprox + 40 * scale + 12 * scale
  return { w: totalW, h: totalH }
}

export function renderBadge(
  char: string,
  variant: LayoutVariant,
  opts: BadgeDrawOpts = {},
): HTMLCanvasElement {
  const scale = opts.scale ?? 1
  const pulse = opts.pulse ?? 0
  const reducedMotion = opts.reducedMotion ?? false
  const binding = bindingForChar(char, variant)
  const animating = !reducedMotion && opts.pulse !== undefined
  const cacheKey = `${char}|${variant}|${scale}|s${binding?.needsShift ? 1 : 0}`
  if (!animating && badgeCache.has(cacheKey)) {
    return badgeCache.get(cacheKey)!
  }

  const { w: totalW, h: totalH } = badgePixelSize(scale)
  const canvas = document.createElement('canvas')
  const dpr =
    typeof window !== 'undefined'
      ? Math.min(window.devicePixelRatio || 1, 2)
      : 1
  canvas.width = Math.ceil(totalW * dpr)
  canvas.height = Math.ceil(totalH * dpr)
  const ctx = canvas.getContext('2d')!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const letterH = 42 * scale
  ctx.fillStyle = '#202124'
  // Merriweather: capital I has serifs, lowercase l is clearly different
  ctx.font = `bold ${36 * scale}px Merriweather, "PT Serif", Georgia, serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(char === ' ' ? '␣' : char, totalW / 2, letterH / 2)

  const kbW = 15 * uPx(scale)
  const kbOx = (totalW - kbW) / 2
  const highlights: { code: string; color: string }[] = []
  if (binding) {
    highlights.push({
      code: binding.code,
      color: FINGER_COLOR[binding.finger],
    })
    if (binding.needsShift) {
      const sf = shiftFingerForLetter(binding.finger)
      highlights.push({
        code: sf === 'R5' ? 'ShiftRight' : 'ShiftLeft',
        color: FINGER_COLOR[sf],
      })
    }
  }
  const kbH = paintKeyboard(ctx, variant, scale, kbOx, letterH, highlights)

  const handW = 48 * scale
  const handsGap = 12 * scale
  const handsY = letterH + kbH + 8 * scale
  const leftX = (totalW - (handW * 2 + handsGap)) / 2
  const tips: Tip[] = []
  drawHand(ctx, leftX, handsY, scale, false, tips)
  drawHand(ctx, leftX + handW + handsGap, handsY, scale, true, tips)

  const active: FingerId[] = []
  if (char === ' ') {
    active.push('L1', 'R1')
  } else if (binding) {
    active.push(binding.finger)
    if (binding.needsShift) active.push(shiftFingerForLetter(binding.finger))
  }
  paintTips(ctx, tips, active, pulse, reducedMotion)

  if (!animating) badgeCache.set(cacheKey, canvas)
  return canvas
}

export function clearBadgeCache() {
  badgeCache.clear()
}

export function galleryChars(): string[] {
  return [
    ...'abcdefghijklmnopqrstuvwxyzěščřžýáíéúů',
    ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    ...'1234567890',
    ',',
    '.',
    '-',
    ' ',
  ]
}

export function fingerLabelForChar(
  char: string,
  variant: LayoutVariant,
): string {
  const b = bindingForChar(char, variant)
  if (char === ' ') return `${FINGER_NAME.L1} / ${FINGER_NAME.R1}`
  if (!b) return '?'
  if (b.needsShift) {
    const sf = shiftFingerForLetter(b.finger)
    return `${FINGER_NAME[b.finger]} + ${FINGER_NAME[sf]} (Shift)`
  }
  return FINGER_NAME[b.finger]
}
