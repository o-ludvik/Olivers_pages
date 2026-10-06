import type { PageSpec } from '../levels/types'

type PageBlock = PageSpec['blocks'][number]

/** Parse catalog block tokens: `H`, `P6 s e`, `P3 e`, … */
export function parsePageBlock(token: string): PageBlock {
  const t = token.trim()
  if (t === 'H' || /^H\b/.test(t)) return { kind: 'heading' }
  const m = t.match(/^P(\d+)(?:\s+s)?(?:\s+e)?$/i)
  if (!m) return { kind: 'para', lines: 1, starts: false, ends: false }
  return {
    kind: 'para',
    lines: Number(m[1]),
    starts: /\bs\b/i.test(t),
    ends: /\be\b/i.test(t),
  }
}

/** Accept PageSpec or catalog `{ page, blocks: string[] }`. */
export function normalizePages(raw: unknown[]): PageSpec[] {
  return raw.map((entry, i) => {
    if (!entry || typeof entry !== 'object') {
      return { number: i + 1, blocks: [] }
    }
    const obj = entry as Record<string, unknown>
    const number =
      typeof obj.number === 'number'
        ? obj.number
        : typeof obj.page === 'number'
          ? obj.page
          : i + 1
    const blocksRaw = Array.isArray(obj.blocks) ? obj.blocks : []
    const blocks: PageBlock[] = blocksRaw.map((b) => {
      if (typeof b === 'string') return parsePageBlock(b)
      if (b && typeof b === 'object' && 'kind' in (b as object)) {
        return b as PageBlock
      }
      return { kind: 'para', lines: 1, starts: false, ends: false }
    })
    return { number, blocks }
  })
}
