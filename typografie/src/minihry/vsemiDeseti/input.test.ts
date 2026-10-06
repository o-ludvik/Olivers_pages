import { describe, expect, it } from 'vitest'
import { classifyKeydown, resolveHit } from './input'

describe('keydown processing §4', () => {
  const held = { shiftLeft: false, shiftRight: false }

  it('ignores repeat, Dead, modifiers, ctrl', () => {
    expect(
      classifyKeydown(
        { key: 'a', code: 'KeyA', repeat: true, ctrlKey: false, metaKey: false, altKey: false },
        held,
      ).type,
    ).toBe('ignore')
    expect(
      classifyKeydown(
        { key: 'Dead', code: 'Equal', repeat: false, ctrlKey: false, metaKey: false, altKey: false },
        held,
      ).type,
    ).toBe('ignore')
    expect(
      classifyKeydown(
        { key: 'a', code: 'KeyA', repeat: false, ctrlKey: true, metaKey: false, altKey: false },
        held,
      ).type,
    ).toBe('ignore')
    expect(
      classifyKeydown(
        { key: 'Shift', code: 'ShiftLeft', repeat: false, ctrlKey: false, metaKey: false, altKey: false },
        held,
      ).type,
    ).toBe('ignore')
  })

  it('Escape pauses', () => {
    expect(
      classifyKeydown(
        { key: 'Escape', code: 'Escape', repeat: false, ctrlKey: false, metaKey: false, altKey: false },
        held,
      ).type,
    ).toBe('pause')
  })

  it('hits lowest matching char', () => {
    const items = [
      { char: 'f', y: 10 },
      { char: 'f', y: 80 },
      { char: 'j', y: 50 },
    ]
    const r = resolveHit(items, 'f', {
      ...held,
      capsLock: false,
      variant: 'cs-QWERTZ',
    })
    expect(r.kind).toBe('hit')
    if (r.kind === 'hit') expect(r.index).toBe(1)
  })

  it('miss attributes to lowest', () => {
    const items = [
      { char: 'f', y: 10 },
      { char: 'j', y: 90 },
    ]
    const r = resolveHit(items, 'g', {
      ...held,
      capsLock: false,
      variant: 'cs-QWERTZ',
    })
    expect(r.kind).toBe('miss')
    if (r.kind === 'miss') {
      expect(r.expected).toBe('j')
      expect(r.typed).toBe('g')
    }
  })

  it('Caps Lock soft-fail', () => {
    const items = [{ char: 'f', y: 50 }]
    const r = resolveHit(items, 'F', {
      ...held,
      capsLock: true,
      variant: 'cs-QWERTZ',
    })
    expect(r.kind).toBe('caps')
  })

  it('wrong shift still hits with tip', () => {
    const items = [{ char: 'F', y: 50 }]
    const r = resolveHit(items, 'F', {
      shiftLeft: true,
      shiftRight: false,
      capsLock: false,
      variant: 'cs-QWERTZ',
    })
    expect(r.kind).toBe('hit_wrong_shift')
  })
})
