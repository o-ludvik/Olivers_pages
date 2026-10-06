import { describe, expect, it } from 'vitest'
import { splitRaceWords } from './words'

const NBSP = '\u00A0'

describe('splitRaceWords §2.3', () => {
  it('splits on regular space including the space', () => {
    expect(splitRaceWords('ahoj světe')).toEqual(['ahoj ', 'světe'])
  })

  it('NBSP does not split — v~pondělí is one word', () => {
    const text = `v${NBSP}pondělí`
    expect(splitRaceWords(text)).toEqual([text])
  })

  it('mixed: NBSP inside, space between words', () => {
    const a = `v${NBSP}pondělí`
    const b = `k${NBSP}řece`
    expect(splitRaceWords(`${a} ${b}`)).toEqual([`${a} `, b])
  })
})
