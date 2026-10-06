import { describe, expect, it } from 'vitest'
import {
  expandAlternatives,
  lineToRegex,
  linesMatch,
  linesMatchSet,
  resolveMatch,
} from './matchText'

describe('F11 matcher', () => {
  it('expands alternatives', () => {
    expect(expandAlternatives('a{{b|c}}d')).toEqual(['abd', 'acd'])
  })

  it('ignore nbsp mode treats space and nbsp equal', () => {
    const o = resolveMatch({ nbspMode: 'ignore' })
    expect(lineToRegex('a b', o).test('a\u00A0b')).toBe(true)
  })

  it('requiredOnly requires nbsp where solution has nbsp', () => {
    const o = resolveMatch({ nbspMode: 'requiredOnly' })
    expect(lineToRegex('a\u00A0b', o).test('a\u00A0b')).toBe(true)
    expect(lineToRegex('a\u00A0b', o).test('a b')).toBe(false)
    expect(lineToRegex('a b', o).test('a\u00A0b')).toBe(true)
  })

  it('enOrEm accepts em as en', () => {
    const r = linesMatch(['a—b'], ['a–b'], { dashStyle: 'enOrEm' })
    expect(r.passed).toBe(true)
  })

  it('rejects mixed dash styles', () => {
    const r = linesMatch(['a–b a—c'], ['a–b a–c'], { dashStyle: 'enOrEm' })
    expect(r.passed).toBe(false)
  })

  it('ignores blank / br-only lines', () => {
    const r = linesMatch(
      ['Ahoj.', '', '\n', '  ', 'Světe.'],
      ['Ahoj.', 'Světe.'],
    )
    expect(r.passed).toBe(true)
  })

  it('set match ignores order and blanks for keep/delete', () => {
    const r = linesMatchSet(
      ['B.', '', 'A.', '\n', 'C.'],
      ['A.', 'B.', 'C.'],
    )
    expect(r.passed).toBe(true)
  })

  it('set match fails when a wrong line remains', () => {
    const r = linesMatchSet(['A.', 'špatně', 'B.'], ['A.', 'B.'])
    expect(r.passed).toBe(false)
  })
})
