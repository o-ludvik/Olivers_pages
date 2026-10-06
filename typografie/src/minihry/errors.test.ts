import { describe, expect, it } from 'vitest'
import { classifyError } from './errors'

const NBSP = '\u00A0'

describe('classifyError §1.5', () => {
  it('dash vs hyphen is typographic pomlcka', () => {
    const e = classifyError('–', '-', ['pomlcka'])
    expect(e.kind).toBe('typograficka')
    expect(e.rule).toBe('pomlcka')
    expect(e.hint).toMatch(/pomlčka/)
  })

  it('straight quote for opening is uvozovky', () => {
    const e = classifyError('„', '"', ['uvozovky'])
    expect(e.kind).toBe('typograficka')
    expect(e.rule).toBe('uvozovky')
  })

  it('ellipsis vs period', () => {
    const e = classifyError('…', '.', ['vypustka'])
    expect(e.kind).toBe('typograficka')
    expect(e.rule).toBe('vypustka')
  })

  it('NBSP vs space is typographic on hard', () => {
    const hard = classifyError(NBSP, ' ', ['zalomeni'], { hardNbsp: true })
    expect(hard.kind).toBe('typograficka')
    expect(hard.rule).toBe('zalomeni')
  })

  it('regular letter typo is preklep', () => {
    const e = classifyError('a', 'b', ['uvozovky'])
    expect(e.kind).toBe('preklep')
  })

  it('times vs x', () => {
    const e = classifyError('×', 'x', ['matematika'])
    expect(e.kind).toBe('typograficka')
    expect(e.rule).toBe('matematika')
  })

  it('space mistake uses first tag', () => {
    const e = classifyError(' ', 'x', ['mena', 'zalomeni'])
    expect(e.kind).toBe('typograficka')
    expect(e.rule).toBe('mena')
  })
})
