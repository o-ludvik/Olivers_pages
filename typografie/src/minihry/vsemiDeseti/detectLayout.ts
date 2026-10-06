import type { LayoutVariant } from './layout'

export type DetectedLayout =
  | { kind: 'cs-QWERTZ' }
  | { kind: 'cs-QWERTY' }
  | { kind: 'non-czech' }
  | { kind: 'unknown' }

type LayoutMapLike = {
  get: (code: string) => string | undefined
}

function normalizeKey(k: string | undefined): string | undefined {
  if (k === undefined) return undefined
  // Layout map may return multi-char or dead keys; take first char
  if (k.length === 0) return undefined
  return k.length === 1 ? k : k[0]
}

/** Detect from KeyboardLayoutMap-like object (§1.3). */
export function detectFromLayoutMap(map: LayoutMapLike): DetectedLayout {
  const digit2 = normalizeKey(map.get('Digit2'))
  const keyY = normalizeKey(map.get('KeyY'))
  const keyZ = normalizeKey(map.get('KeyZ'))

  const czechDigit = digit2 === 'ě'
  // Prefer Y/Z pair when both known
  if (czechDigit && keyY === 'z' && (keyZ === undefined || keyZ === 'y')) {
    return { kind: 'cs-QWERTZ' }
  }
  if (czechDigit && keyY === 'y' && (keyZ === undefined || keyZ === 'z')) {
    return { kind: 'cs-QWERTY' }
  }
  if (keyY === 'z' && keyZ === 'y') return { kind: 'cs-QWERTZ' }
  if (keyY === 'y' && keyZ === 'z') return { kind: 'cs-QWERTY' }
  if (keyY === 'z') return { kind: 'cs-QWERTZ' }
  if (keyY === 'y' && czechDigit) return { kind: 'cs-QWERTY' }
  if (keyZ === 'y') return { kind: 'cs-QWERTZ' }
  if (keyZ === 'z' && czechDigit) return { kind: 'cs-QWERTY' }
  if (czechDigit) return { kind: 'unknown' } // czech but Y/Z unclear
  return { kind: 'non-czech' }
}

/** Infer from first key presses (code + key). */
export function detectFromKeyPress(
  samples: { code: string; key: string }[],
): DetectedLayout {
  let digit2: string | undefined
  let keyY: string | undefined
  let keyZ: string | undefined
  for (const s of samples) {
    const k = s.key.length === 1 ? s.key : s.key[0]
    if (s.code === 'Digit2' && k) digit2 = k
    if (s.code === 'KeyY' && k) keyY = k
    if (s.code === 'KeyZ' && k) keyZ = k
  }
  if (digit2 === undefined && keyY === undefined && keyZ === undefined) {
    return { kind: 'unknown' }
  }
  return detectFromLayoutMap({
    get: (code: string) => {
      if (code === 'Digit2') return digit2
      if (code === 'KeyY') return keyY
      if (code === 'KeyZ') return keyZ
      return undefined
    },
  })
}

/**
 * If a single physical press clearly indicates QWERTY vs QWERTZ, return it.
 * Used to auto-correct mid-session.
 */
export function variantFromPress(
  code: string,
  key: string,
): LayoutVariant | null {
  const k = key.length === 1 ? key : key[0]
  if (!k) return null
  if (code === 'KeyY') {
    if (k === 'z' || k === 'Z') return 'cs-QWERTZ'
    if (k === 'y' || k === 'Y') return 'cs-QWERTY'
  }
  if (code === 'KeyZ') {
    if (k === 'y' || k === 'Y') return 'cs-QWERTZ'
    if (k === 'z' || k === 'Z') return 'cs-QWERTY'
  }
  return null
}

export async function detectLayout(): Promise<DetectedLayout> {
  try {
    const kb = (
      navigator as Navigator & {
        keyboard?: { getLayoutMap: () => Promise<Map<string, string>> }
      }
    ).keyboard
    if (kb?.getLayoutMap) {
      const map = await kb.getLayoutMap()
      return detectFromLayoutMap(map)
    }
  } catch {
    /* ignore */
  }
  return { kind: 'unknown' }
}

export function toVariant(d: DetectedLayout): LayoutVariant | null {
  if (d.kind === 'cs-QWERTZ' || d.kind === 'cs-QWERTY') return d.kind
  return null
}
