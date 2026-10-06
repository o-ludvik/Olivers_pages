import { describe, expect, it } from 'vitest'
import {
  buildCharMap,
  fingerForChar,
  ROWS_QWERTZ,
  rowsFor,
} from './layout'
import { LESSONS, charsForLesson } from './lessons'

describe('keyboard layout §1.2', () => {
  it('each row sums to 15u', () => {
    for (const variant of ['cs-QWERTZ', 'cs-QWERTY'] as const) {
      for (const row of rowsFor(variant)) {
        const sum = row.reduce((s, k) => s + k.width, 0)
        expect(sum, `${variant} row`).toBe(15)
      }
    }
  })

  it('lesson 1–11 target chars each have exactly one key+finger', () => {
    const map = buildCharMap('cs-QWERTZ')
    for (const lesson of LESSONS) {
      if (typeof lesson.id !== 'number' || lesson.id > 11) continue
      for (const ch of lesson.newChars) {
        const b = map.get(ch)
        expect(b, `char ${ch} in lesson ${lesson.id}`).toBeTruthy()
        expect(b!.finger).toBeTruthy()
      }
    }
  })

  it('finger checkpoints', () => {
    const checks: [string, string][] = [
      ['f', 'L2'],
      ['j', 'R2'],
      ['ž', 'L2'],
      ['ý', 'R2'],
      ['á', 'R3'],
      ['é', 'R5'],
      ['ů', 'R5'],
      ['ú', 'R5'],
      ['y', 'L5'], // QWERTZ KeyZ
      ['z', 'R2'], // QWERTZ KeyY
      ['-', 'R5'],
      [',', 'R3'],
      ['.', 'R4'],
    ]
    for (const [ch, finger] of checks) {
      expect(fingerForChar(ch, 'cs-QWERTZ'), ch).toBe(finger)
    }
    // QWERTY swaps y/z fingers with positions
    expect(fingerForChar('y', 'cs-QWERTY')).toBe('R2')
    expect(fingerForChar('z', 'cs-QWERTY')).toBe('L5')
  })

  it('QWERTZ has z on KeyY and y on KeyZ', () => {
    const y = ROWS_QWERTZ.flat().find((k) => k.code === 'KeyY')
    const z = ROWS_QWERTZ.flat().find((k) => k.code === 'KeyZ')
    expect(y?.char).toBe('z')
    expect(z?.char).toBe('y')
  })

  it('cumulative lesson pools grow', () => {
    const l1 = charsForLesson(1).all
    const l2 = charsForLesson(2).all
    expect(l1).toEqual(['f', 'j'])
    expect(l2).toContain('f')
    expect(l2).toContain('d')
    expect(l2).toContain('k')
  })

  it('QWERTY swaps y/z in lessons 7–8', () => {
    expect(charsForLesson(7, { variant: 'cs-QWERTZ' }).neu[0]).toBe('z')
    expect(charsForLesson(7, { variant: 'cs-QWERTY' }).neu[0]).toBe('y')
    expect(charsForLesson(8, { variant: 'cs-QWERTZ' }).neu[0]).toBe('y')
    expect(charsForLesson(8, { variant: 'cs-QWERTY' }).neu[0]).toBe('z')
  })
})
