import { bindingForChar, type LayoutVariant } from './layout'
import { isLeftFinger, shiftFingerForLetter } from './fingers'

export type KeyAction =
  | { type: 'ignore' }
  | { type: 'pause' }
  | { type: 'resume_or_start' }
  | {
      type: 'char'
      key: string
      shiftLeft: boolean
      shiftRight: boolean
      capsLock: boolean
    }

const MOD_CODES = new Set([
  'ShiftLeft',
  'ShiftRight',
  'ControlLeft',
  'ControlRight',
  'AltLeft',
  'AltRight',
  'MetaLeft',
  'MetaRight',
  'CapsLock',
])

export function classifyKeydown(
  e: {
    key: string
    code: string
    repeat: boolean
    ctrlKey: boolean
    metaKey: boolean
    altKey: boolean
    getModifierState?: (key: string) => boolean
  },
  held: { shiftLeft: boolean; shiftRight: boolean },
): KeyAction {
  if (e.repeat) return { type: 'ignore' }
  if (e.code === 'Escape') return { type: 'pause' }
  if (
    MOD_CODES.has(e.code) ||
    e.key === 'Shift' ||
    e.key === 'Control' ||
    e.key === 'Alt' ||
    e.key === 'Meta'
  ) {
    return { type: 'ignore' }
  }
  if (e.key === 'Dead') return { type: 'ignore' }
  if (e.ctrlKey || e.metaKey || e.altKey) return { type: 'ignore' }
  if (e.key.length !== 1 && e.key !== ' ') return { type: 'ignore' }

  const capsLock = e.getModifierState?.('CapsLock') ?? false
  return {
    type: 'char',
    key: e.key,
    shiftLeft: held.shiftLeft,
    shiftRight: held.shiftRight,
    capsLock,
  }
}

export type HitResult =
  | { kind: 'hit'; index: number }
  | { kind: 'miss'; expectedIndex: number; expected: string; typed: string }
  | { kind: 'caps' }
  | { kind: 'hit_wrong_shift'; index: number; tip: string }

export type FallingItem = { char: string; y: number }

export function resolveHit(
  items: FallingItem[],
  typed: string,
  opts: {
    shiftLeft: boolean
    shiftRight: boolean
    capsLock: boolean
    variant: LayoutVariant
  },
): HitResult {
  const matches = items
    .map((it, index) => ({ ...it, index }))
    .filter((it) => it.char === typed)
    .sort((a, b) => b.y - a.y)

  if (matches.length > 0) {
    const hit = matches[0]!
    const binding = bindingForChar(hit.char, opts.variant)
    if (binding?.needsShift) {
      const want = shiftFingerForLetter(binding.finger)
      const ok = want === 'R5' ? opts.shiftRight : opts.shiftLeft
      if (!ok && (opts.shiftLeft || opts.shiftRight)) {
        return {
          kind: 'hit_wrong_shift',
          index: hit.index,
          tip: `Velké ${hit.char} piš s ${want === 'R5' ? 'pravým' : 'levým'} Shiftem – Shift vždy druhou rukou`,
        }
      }
    }
    return { kind: 'hit', index: hit.index }
  }

  const lowest = [...items].sort((a, b) => b.y - a.y)[0]
  if (
    lowest &&
    opts.capsLock &&
    typed.toLowerCase() === lowest.char &&
    typed !== lowest.char &&
    typed === typed.toUpperCase()
  ) {
    return { kind: 'caps' }
  }

  if (!lowest) {
    return { kind: 'miss', expectedIndex: -1, expected: '', typed }
  }
  return {
    kind: 'miss',
    expectedIndex: items.indexOf(lowest),
    expected: lowest.char,
    typed,
  }
}

export function expectedShiftSide(
  char: string,
  variant: LayoutVariant,
): 'left' | 'right' | null {
  const b = bindingForChar(char, variant)
  if (!b?.needsShift) return null
  return isLeftFinger(b.finger) ? 'right' : 'left'
}
