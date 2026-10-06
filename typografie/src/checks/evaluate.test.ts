import { describe, expect, it } from 'vitest'
import { getLevelById } from '../levels'
import { parseDocSource } from '../doc/parse'
import {
  evaluateCheck,
  fillInstructions,
  formatErrorCountPhrase,
} from './evaluate'
import {
  normalizePages,
  parsePageBlock,
} from '../components/pagesPreviewParse'
import { nbspDecorations } from '../extensions/ShowHiddenChars'
import { Node, Schema } from '@tiptap/pm/model'

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

describe('TYP-15 pages parser', () => {
  it('parses H and Pn tokens', () => {
    expect(parsePageBlock('H')).toEqual({ kind: 'heading' })
    expect(parsePageBlock('P6 s e')).toEqual({
      kind: 'para',
      lines: 6,
      starts: true,
      ends: true,
    })
    expect(parsePageBlock('P3 e')).toEqual({
      kind: 'para',
      lines: 3,
      starts: false,
      ends: true,
    })
    expect(parsePageBlock('P1 s')).toEqual({
      kind: 'para',
      lines: 1,
      starts: true,
      ends: false,
    })
  })

  it('normalizes catalog page shape', () => {
    const pages = normalizePages([
      { page: 2, blocks: ['P3 e', 'P12 s e', 'P1 s'] },
    ])
    expect(pages[0].number).toBe(2)
    expect(pages[0].blocks).toHaveLength(3)
    expect(pages[0].blocks[0]).toEqual({
      kind: 'para',
      lines: 3,
      starts: false,
      ends: true,
    })
  })
})

describe('numberSet', () => {
  it('accepts values and fails empty', () => {
    const task = getLevelById('TYP-15')!
    const empty = parseDocSource({ format: 'text', content: '' })
    const emptyR = evaluateCheck(
      { type: 'numberSet', values: [2, 3, 6] },
      { task, student: empty, studentHtml: '' },
    )
    expect(emptyR.passed).toBe(false)

    const ok = parseDocSource({ format: 'text', content: '2, 3, 6' })
    const okR = evaluateCheck(
      { type: 'numberSet', values: [2, 3, 6] },
      { task, student: ok, studentHtml: '' },
    )
    expect(okR.passed).toBe(true)
  })
})

describe('trapPairs', () => {
  it('fails prefill-only', () => {
    const task = getLevelById('TYP-22')!
    const student = parseDocSource(task.prefill!)
    const r = evaluateCheck(
      { type: 'custom', id: 'trapPairs' },
      { task, student, studentHtml: '' },
    )
    expect(r.passed).toBe(false)
  })

  it('passes valid trap/fix pairs', () => {
    const task = getLevelById('TYP-22')!
    const content = `1. Chyták: Ahoj , jak se máš?
1. Oprava: Ahoj, jak se máš?
2. Chyták: Řekl "ahoj".
2. Oprava: Řekl „ahoj“.
3. Chyták: Film ?Nevím.
3. Oprava: Film? Nevím.
4. Chyták: Praha - Brno.
4. Oprava: Praha – Brno.
5. Chyták: No... nevím.
5. Oprava: No… nevím.`
    const student = parseDocSource({ format: 'text', content })
    const r = evaluateCheck(
      { type: 'custom', id: 'trapPairs' },
      { task, student, studentHtml: '' },
    )
    expect(r.passed, r.message).toBe(true)
  })
})

describe('fillInstructions grammar', () => {
  it('uses Czech plural verb', () => {
    expect(formatErrorCountPhrase(4)).toBe('jsou 4 chyby')
    expect(formatErrorCountPhrase(1)).toBe('je 1 chyba')
    const task = getLevelById('TYP-05')!
    expect(fillInstructions(task)).toMatch(/V textu jsou \d+ chyby/)
  })
})

describe('nbsp decorations helper', () => {
  it('marks NBSP positions', () => {
    const schema = new Schema({
      nodes: {
        doc: { content: 'text*' },
        text: { group: 'inline' },
      },
    })
    const doc = Node.fromJSON(schema, {
      type: 'doc',
      content: [{ type: 'text', text: `a\u00A0b` }],
    })
    const set = nbspDecorations(doc)
    expect(set.find().length).toBe(1)
  })
})
