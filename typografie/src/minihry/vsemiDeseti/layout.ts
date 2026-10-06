import type { FingerId } from './fingers'

export type LayoutVariant = 'cs-QWERTZ' | 'cs-QWERTY'

export type KeyDef = {
  code: string
  /** Base character for cs-QWERTZ (empty = non-typing / modifier). */
  char: string
  shift: string
  finger: FingerId
  /** Width in units (row totals 15). */
  width: number
  /** Visual-only block (grey side of space bar). */
  filler?: boolean
  homeBump?: boolean
}

export type KeyRow = KeyDef[]

/** Physical layout §1.2 — characters for cs-QWERTZ. Pringers by position. */
export const ROWS_QWERTZ: KeyRow[] = [
  // Row 0 – number
  [
    { code: 'Backquote', char: ';', shift: '°', finger: 'L5', width: 1 },
    { code: 'Digit1', char: '+', shift: '1', finger: 'L5', width: 1 },
    { code: 'Digit2', char: 'ě', shift: '2', finger: 'L4', width: 1 },
    { code: 'Digit3', char: 'š', shift: '3', finger: 'L3', width: 1 },
    { code: 'Digit4', char: 'č', shift: '4', finger: 'L2', width: 1 },
    { code: 'Digit5', char: 'ř', shift: '5', finger: 'L2', width: 1 },
    { code: 'Digit6', char: 'ž', shift: '6', finger: 'L2', width: 1 },
    { code: 'Digit7', char: 'ý', shift: '7', finger: 'R2', width: 1 },
    { code: 'Digit8', char: 'á', shift: '8', finger: 'R3', width: 1 },
    { code: 'Digit9', char: 'í', shift: '9', finger: 'R4', width: 1 },
    { code: 'Digit0', char: 'é', shift: '0', finger: 'R5', width: 1 },
    { code: 'Minus', char: '=', shift: '%', finger: 'R5', width: 1 },
    { code: 'Equal', char: '´', shift: 'ˇ', finger: 'R5', width: 1 },
    { code: 'Backspace', char: '', shift: '', finger: 'R5', width: 2 },
  ],
  // Row 1 – top letter
  [
    { code: 'Tab', char: '', shift: '', finger: 'L5', width: 1.5 },
    { code: 'KeyQ', char: 'q', shift: 'Q', finger: 'L5', width: 1 },
    { code: 'KeyW', char: 'w', shift: 'W', finger: 'L4', width: 1 },
    { code: 'KeyE', char: 'e', shift: 'E', finger: 'L3', width: 1 },
    { code: 'KeyR', char: 'r', shift: 'R', finger: 'L2', width: 1 },
    { code: 'KeyT', char: 't', shift: 'T', finger: 'L2', width: 1 },
    { code: 'KeyY', char: 'z', shift: 'Z', finger: 'R2', width: 1 },
    { code: 'KeyU', char: 'u', shift: 'U', finger: 'R2', width: 1 },
    { code: 'KeyI', char: 'i', shift: 'I', finger: 'R3', width: 1 },
    { code: 'KeyO', char: 'o', shift: 'O', finger: 'R4', width: 1 },
    { code: 'KeyP', char: 'p', shift: 'P', finger: 'R5', width: 1 },
    { code: 'BracketLeft', char: 'ú', shift: '/', finger: 'R5', width: 1 },
    { code: 'BracketRight', char: ')', shift: '(', finger: 'R5', width: 1 },
    { code: 'Enter', char: '', shift: '', finger: 'R5', width: 1.5 },
  ],
  // Row 2 – home
  [
    { code: 'CapsLock', char: '', shift: '', finger: 'L5', width: 1.75 },
    { code: 'KeyA', char: 'a', shift: 'A', finger: 'L5', width: 1 },
    { code: 'KeyS', char: 's', shift: 'S', finger: 'L4', width: 1 },
    { code: 'KeyD', char: 'd', shift: 'D', finger: 'L3', width: 1 },
    { code: 'KeyF', char: 'f', shift: 'F', finger: 'L2', width: 1, homeBump: true },
    { code: 'KeyG', char: 'g', shift: 'G', finger: 'L2', width: 1 },
    { code: 'KeyH', char: 'h', shift: 'H', finger: 'R2', width: 1 },
    { code: 'KeyJ', char: 'j', shift: 'J', finger: 'R2', width: 1, homeBump: true },
    { code: 'KeyK', char: 'k', shift: 'K', finger: 'R3', width: 1 },
    { code: 'KeyL', char: 'l', shift: 'L', finger: 'R4', width: 1 },
    { code: 'Semicolon', char: 'ů', shift: '"', finger: 'R5', width: 1 },
    { code: 'Quote', char: '§', shift: '!', finger: 'R5', width: 1 },
    { code: 'Backslash', char: '¨', shift: "'", finger: 'R5', width: 1 },
    { code: 'Enter', char: '', shift: '', finger: 'R5', width: 1.25 },
  ],
  // Row 3 – bottom
  [
    { code: 'ShiftLeft', char: '', shift: '', finger: 'L5', width: 2.25 },
    { code: 'KeyZ', char: 'y', shift: 'Y', finger: 'L5', width: 1 },
    { code: 'KeyX', char: 'x', shift: 'X', finger: 'L4', width: 1 },
    { code: 'KeyC', char: 'c', shift: 'C', finger: 'L3', width: 1 },
    { code: 'KeyV', char: 'v', shift: 'V', finger: 'L2', width: 1 },
    { code: 'KeyB', char: 'b', shift: 'B', finger: 'L2', width: 1 },
    { code: 'KeyN', char: 'n', shift: 'N', finger: 'R2', width: 1 },
    { code: 'KeyM', char: 'm', shift: 'M', finger: 'R2', width: 1 },
    { code: 'Comma', char: ',', shift: '?', finger: 'R3', width: 1 },
    { code: 'Period', char: '.', shift: ':', finger: 'R4', width: 1 },
    { code: 'Slash', char: '-', shift: '_', finger: 'R5', width: 1 },
    { code: 'ShiftRight', char: '', shift: '', finger: 'R5', width: 2.75 },
  ],
  // Row 4 – space (simplified for mini keyboard)
  [
    { code: 'ControlLeft', char: '', shift: '', finger: 'L5', width: 1.5, filler: true },
    { code: 'MetaLeft', char: '', shift: '', finger: 'L5', width: 1.25, filler: true },
    { code: 'AltLeft', char: '', shift: '', finger: 'L1', width: 1.25, filler: true },
    { code: 'Space', char: ' ', shift: ' ', finger: 'L1', width: 5.75 },
    { code: 'AltRight', char: '', shift: '', finger: 'R1', width: 1.25, filler: true },
    { code: 'MetaRight', char: '', shift: '', finger: 'R5', width: 1.25, filler: true },
    { code: 'ContextMenu', char: '', shift: '', finger: 'R5', width: 1.25, filler: true },
    { code: 'ControlRight', char: '', shift: '', finger: 'R5', width: 1.5, filler: true },
  ],
]

function swapYZ(rows: KeyRow[]): KeyRow[] {
  return rows.map((row) =>
    row.map((k) => {
      if (k.code === 'KeyY') return { ...k, char: 'y', shift: 'Y' }
      if (k.code === 'KeyZ') return { ...k, char: 'z', shift: 'Z' }
      return k
    }),
  )
}

export const ROWS_QWERTY: KeyRow[] = swapYZ(ROWS_QWERTZ)

export function rowsFor(variant: LayoutVariant): KeyRow[] {
  return variant === 'cs-QWERTY' ? ROWS_QWERTY : ROWS_QWERTZ
}

export type CharBinding = {
  code: string
  finger: FingerId
  needsShift: boolean
  key: KeyDef
}

/** Map printable character → physical key for a layout. */
export function buildCharMap(
  variant: LayoutVariant,
): Map<string, CharBinding> {
  const map = new Map<string, CharBinding>()
  for (const row of rowsFor(variant)) {
    for (const key of row) {
      if (!key.char || key.filler) continue
      if (!map.has(key.char)) {
        map.set(key.char, {
          code: key.code,
          finger: key.finger,
          needsShift: false,
          key,
        })
      }
      if (key.shift && key.shift !== key.char && !map.has(key.shift)) {
        map.set(key.shift, {
          code: key.code,
          finger: key.finger,
          needsShift: true,
          key,
        })
      }
    }
  }
  return map
}

export function fingerForChar(
  ch: string,
  variant: LayoutVariant,
): FingerId | null {
  return buildCharMap(variant).get(ch)?.finger ?? null
}

export function bindingForChar(
  ch: string,
  variant: LayoutVariant,
): CharBinding | null {
  return buildCharMap(variant).get(ch) ?? null
}

/** Codes that sit on the hand-split boundary (after ž, T, G, B). */
export const HAND_SPLIT_AFTER = new Set([
  'Digit6',
  'KeyT',
  'KeyG',
  'KeyB',
])
