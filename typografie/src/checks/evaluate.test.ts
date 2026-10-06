import { describe, expect, it } from 'vitest'
import { getLevelById } from '../levels'
import { parseDocSource } from '../doc/parse'
import { evaluateCheck } from './evaluate'

describe('textLines location hints', () => {
  it('puts each annotation near its own place in the text', () => {
    const task = getLevelById('TYP-16')
    expect(task).toBeTruthy()
    const student = parseDocSource({
      format: 'text',
      content:
        'Na školním výletě (Praha – Kutná Hora) jsme navštívili kostnici. Paní učitelka řekla:„Tady se nefotí!“ Pak jsme šli na oběd a pak… no, radši nic. Kdo chtěl, mohl si koupit pohled/ magnetku.',
    })
    const r = evaluateCheck(
      { type: 'textLines' },
      { task: task!, student, studentHtml: '' },
    )
    expect(r.passed).toBe(false)
    const msg = r.message ?? ''
    expect(msg).toMatch(/uvozovce u «[^»]*řekla/)
    expect(msg).toMatch(/lomítku u «[^»]*pohled/)
    expect(msg).not.toMatch(/lomítku u «[^»]*řekla/)
  })
})
