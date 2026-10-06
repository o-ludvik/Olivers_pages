import { SPECIAL_CHAR_SET } from './chars'

const NBSP = '\u00A0'
const SPACE = ' '

export type ErrorKind = 'typograficka' | 'preklep'

export type ClassifiedError = {
  kind: ErrorKind
  rule: string
  hint: string
}

type MistakeRow = {
  expected: string | ((ch: string) => boolean)
  typed: string | ((ch: string) => boolean)
  rule: string
  hint: string
}

const MISTAKES: MistakeRow[] = [
  {
    expected: '„',
    typed: '"',
    rule: 'uvozovky',
    hint: 'České uvozovky: „ = Ctrl+Shift+U 201E / Alt+0132',
  },
  {
    expected: '“',
    typed: '"',
    rule: 'uvozovky',
    hint: 'Zavírací uvozovky: “ = 201C / Alt+0147',
  },
  {
    expected: '‚',
    typed: (t) => t === "'" || t === ',',
    rule: 'uvozovky',
    hint: 'Jednoduché uvozovky: ‚ = 201A / Alt+0130',
  },
  {
    expected: '‘',
    typed: "'",
    rule: 'uvozovky',
    hint: 'Jednoduché uvozovky: ‘ = 2018 / Alt+0145',
  },
  {
    expected: '–',
    typed: (t) => t === '-' || t === '—',
    rule: 'pomlcka',
    hint: 'Tady je pomlčka –, ne spojovník (2013 / Alt+0150)',
  },
  {
    expected: '…',
    typed: '.',
    rule: 'vypustka',
    hint: 'Výpustka je jeden znak … (2026 / Alt+0133)',
  },
  {
    expected: NBSP,
    typed: SPACE,
    rule: 'zalomeni',
    hint: 'Tady je nezlomitelná mezera (00A0 / Alt+0160)',
  },
  {
    expected: '×',
    typed: (t) => t === 'x' || t === '*',
    rule: 'matematika',
    hint: 'Krát se píše × (00D7 / Alt+0215)',
  },
  {
    expected: '°',
    typed: (t) => t === 'o' || t === '0',
    rule: 'jednotky',
    hint: 'Stupeň je ° (00B0 / Alt+0176)',
  },
  {
    expected: '′',
    typed: "'",
    rule: 'jednotky',
    hint: 'Úhlová minuta ′ (2032), vteřina ″ (2033)',
  },
  {
    expected: '″',
    typed: '"',
    rule: 'jednotky',
    hint: 'Úhlová minuta ′ (2032), vteřina ″ (2033)',
  },
  {
    expected: '²',
    typed: '2',
    rule: 'jednotky',
    hint: 'Na druhou: ² (00B2)',
  },
]

function matches(
  spec: string | ((ch: string) => boolean),
  ch: string,
): boolean {
  return typeof spec === 'function' ? spec(ch) : spec === ch
}

/**
 * Classify a wrong keystroke (§1.5).
 * @param tags first tag of the prompt text, used for space mistakes
 * @param hardNbspOnly when true, space instead of NBSP counts as typographic (heavy difficulty)
 */
export function classifyError(
  expected: string,
  typed: string,
  tags: string[],
  opts: { hardNbsp?: boolean } = {},
): ClassifiedError {
  const spaceLike = expected === SPACE || expected === NBSP

  // Table rows (NBSP→space only on hard, otherwise soft modes accept space)
  for (const row of MISTAKES) {
    if (row.expected === NBSP && !opts.hardNbsp) continue
    if (matches(row.expected, expected) && matches(row.typed, typed)) {
      return { kind: 'typograficka', rule: row.rule, hint: row.hint }
    }
  }

  if (
    SPECIAL_CHAR_SET.has(expected) ||
    spaceLike ||
    SPECIAL_CHAR_SET.has(typed)
  ) {
    if (spaceLike) {
      const rule = tags[0] ?? 'zalomeni'
      return {
        kind: 'typograficka',
        rule,
        hint: 'Zkontroluj mezery – viz pravidlo podle štítku',
      }
    }
    // Expected special or typed special without specific row
    const fromTable = MISTAKES.find((r) => matches(r.expected, expected))
    if (fromTable) {
      return {
        kind: 'typograficka',
        rule: fromTable.rule,
        hint: fromTable.hint,
      }
    }
    return {
      kind: 'typograficka',
      rule: tags[0] ?? 'interpunkce',
      hint: 'Zkontroluj speciální znak.',
    }
  }

  return { kind: 'preklep', rule: 'preklep', hint: '' }
}
