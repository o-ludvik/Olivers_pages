import { describe, expect, it } from 'vitest'
import {
  detectFromKeyPress,
  detectFromLayoutMap,
} from './detectLayout'

describe('layout detection §1.3', () => {
  it('detects cs-QWERTZ from layout map', () => {
    const map = new Map([
      ['Digit2', 'ě'],
      ['KeyY', 'z'],
    ])
    expect(detectFromLayoutMap(map).kind).toBe('cs-QWERTZ')
  })

  it('detects cs-QWERTY from layout map', () => {
    const map = new Map([
      ['Digit2', 'ě'],
      ['KeyY', 'y'],
      ['KeyZ', 'z'],
    ])
    expect(detectFromLayoutMap(map).kind).toBe('cs-QWERTY')
  })

  it('detects QWERTY from KeyY alone with czech Digit2', () => {
    const map = new Map([
      ['Digit2', 'ě'],
      ['KeyY', 'y'],
    ])
    expect(detectFromLayoutMap(map).kind).toBe('cs-QWERTY')
  })

  it('variantFromPress distinguishes layouts', async () => {
    const { variantFromPress } = await import('./detectLayout')
    expect(variantFromPress('KeyY', 'y')).toBe('cs-QWERTY')
    expect(variantFromPress('KeyY', 'z')).toBe('cs-QWERTZ')
    expect(variantFromPress('KeyZ', 'z')).toBe('cs-QWERTY')
    expect(variantFromPress('KeyZ', 'y')).toBe('cs-QWERTZ')
  })

  it('detects US as non-czech', () => {
    const map = new Map([
      ['Digit2', '2'],
      ['KeyY', 'y'],
    ])
    expect(detectFromLayoutMap(map).kind).toBe('non-czech')
  })

  it('infers from key presses', () => {
    expect(
      detectFromKeyPress([
        { code: 'Digit2', key: 'ě' },
        { code: 'KeyY', key: 'z' },
      ]).kind,
    ).toBe('cs-QWERTZ')
  })
})
