import { describe, expect, it } from 'vitest'
import { charMatches } from './charMatches'

const NBSP = '\u00A0'
const SPACE = ' '
const MINUS = '\u2212'

describe('charMatches §1.4', () => {
  it('exact match always', () => {
    expect(charMatches('a', 'a', 'lehka')).toBe(true)
    expect(charMatches('–', '–', 'tezka')).toBe(true)
    expect(charMatches('a', 'b', 'lehka')).toBe(false)
  })

  it('NBSP soft on lehka/stredni, hard on tezka', () => {
    expect(charMatches(NBSP, NBSP, 'lehka')).toBe(true)
    expect(charMatches(NBSP, SPACE, 'lehka')).toBe(true)
    expect(charMatches(NBSP, SPACE, 'stredni')).toBe(true)
    expect(charMatches(NBSP, SPACE, 'tezka')).toBe(false)
    expect(charMatches(NBSP, NBSP, 'tezka')).toBe(true)
  })

  it('regular space accepts NBSP on all difficulties', () => {
    expect(charMatches(SPACE, SPACE, 'tezka')).toBe(true)
    expect(charMatches(SPACE, NBSP, 'tezka')).toBe(true)
    expect(charMatches(SPACE, NBSP, 'lehka')).toBe(true)
  })

  it('minus accepts hyphen on all difficulties', () => {
    expect(charMatches(MINUS, MINUS, 'lehka')).toBe(true)
    expect(charMatches(MINUS, '-', 'lehka')).toBe(true)
    expect(charMatches(MINUS, '-', 'tezka')).toBe(true)
  })

  it('quotes and dash must be exact', () => {
    expect(charMatches('„', '"', 'lehka')).toBe(false)
    expect(charMatches('–', '-', 'lehka')).toBe(false)
    expect(charMatches('–', '—', 'lehka')).toBe(false)
    expect(charMatches('…', '.', 'lehka')).toBe(false)
  })
})
