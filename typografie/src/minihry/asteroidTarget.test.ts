import { describe, expect, it } from 'vitest'
import { pickTarget, wouldMatchAny } from './asteroidTarget'

describe('asteroid targeting §3.3', () => {
  const rocks = [
    { id: 'a', text: '25 °C', y: 100 },
    { id: 'b', text: '2 × 3', y: 200 },
    { id: 'c', text: 'dálnice Praha – Brno', y: 150 },
  ]

  it('prefix match', () => {
    expect(pickTarget(rocks, '25', 'lehka')?.id).toBe('a')
  })

  it('picks lowest (highest y) on tie', () => {
    const both = [
      { id: 'hi', text: '2abc', y: 50 },
      { id: 'lo', text: '2xyz', y: 300 },
    ]
    expect(pickTarget(both, '2', 'lehka')?.id).toBe('lo')
  })

  it('retargets when prefix stops matching locked and matches other', () => {
    const both = [
      { id: 'a', text: '25 °C', y: 100 },
      { id: 'b', text: '2 × 3', y: 200 },
    ]
    expect(pickTarget(both, '2', 'lehka')?.id).toBe('b')
    expect(pickTarget(both, '25', 'lehka')?.id).toBe('a')
  })

  it('rejects wrong char', () => {
    expect(wouldMatchAny(rocks, 'dálnice Praha ', '-', 'lehka')).toBe(false)
    expect(wouldMatchAny(rocks, 'dálnice Praha ', '–', 'lehka')).toBe(true)
  })
})
