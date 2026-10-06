import { describe, expect, it } from 'vitest'
import { formatFindingLocation, runLinter } from './lint'

describe('F14 linter', () => {
  it('flags three dots', () => {
    const f = runLinter('ahoj...')
    expect(f.some((x) => x.ruleId === 'tri-tecky')).toBe(true)
  })

  it('flags straight quotes', () => {
    const f = runLinter('rekni "ahoj"')
    expect(f.some((x) => x.ruleId === 'rovne-uvozovky')).toBe(true)
  })

  it('skips urls', () => {
    const f = runLinter('viz https://example.com/path...')
    expect(f.some((x) => x.index > 10 && x.ruleId === 'tri-tecky')).toBe(false)
  })

  it('locates findings with a text snippet', () => {
    const text = 'ok řádek\nšpatně "uvozovky"\na tady ,'
    const f = runLinter(text)
    const quote = f.find((x) => x.ruleId === 'rovne-uvozovky')
    expect(quote && formatFindingLocation(quote, text)).toMatch(
      /uvozovce u «.*"/,
    )
  })
})
