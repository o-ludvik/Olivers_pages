import type { MatchOptions } from '../levels/types'

export type ResolvedMatchOptions = Required<MatchOptions>

export const DEFAULT_MATCH: ResolvedMatchOptions = {
  nbspMode: 'ignore',
  dashStyle: 'enOrEm',
  trimLines: true,
  ignoreEmptyLines: true,
}

export function resolveMatch(opts?: MatchOptions): ResolvedMatchOptions {
  return { ...DEFAULT_MATCH, ...opts }
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Expand first layer of {{a|b|c}} alternatives into list of concrete strings. */
export function expandAlternatives(pattern: string): string[] {
  const re = /\{\{((?:\\.|[^{}]|\{(?!\{)|\}(?!\}))*)\}\}/
  const m = re.exec(pattern)
  if (!m) return [pattern]
  const parts = m[1].split('|')
  const before = pattern.slice(0, m.index)
  const after = pattern.slice(m.index + m[0].length)
  const out: string[] = []
  for (const part of parts) {
    for (const rest of expandAlternatives(after)) {
      out.push(before + part + rest)
    }
  }
  return out.length ? out : [pattern]
}

function spaceClass(mode: ResolvedMatchOptions['nbspMode']): string {
  if (mode === 'strict') return ' '
  // ignore / requiredOnly handled differently per char
  return '[ \\u00A0]'
}

/**
 * Compile expected line to anchored regex per F11.
 * For requiredOnly: NBSP in expected must match NBSP; space may be either.
 */
export function lineToRegex(
  expected: string,
  opts: ResolvedMatchOptions,
): RegExp {
  // pick first alternative for regex structure; alternatives expanded by caller
  let src = ''
  for (let i = 0; i < expected.length; i++) {
    const ch = expected[i]
    if (ch === '\u00A0') {
      if (opts.nbspMode === 'ignore') src += spaceClass('ignore')
      else src += '\u00A0'
    } else if (ch === ' ') {
      if (opts.nbspMode === 'strict') src += ' '
      else src += spaceClass('ignore')
    } else if (ch === '–' || ch === '—') {
      if (opts.dashStyle === 'enOrEm') src += '[–—]'
      else src += escapeRegExp(ch)
    } else {
      src += escapeRegExp(ch)
    }
  }
  return new RegExp(`^${src}$`, 'u')
}

export function trimLine(line: string, trimLines: boolean): string {
  if (!trimLines) return line
  // trim U+0020 and tabs only, not NBSP
  return line.replace(/^[ \t]+|[ \t]+$/g, '')
}

/** Empty / TipTap `<br>`-only paragraphs (ignoreEmptyLines). */
export function isBlankLine(line: string): boolean {
  return line.replace(/[\s\u00A0]+/g, '').length === 0
}

function lineMatches(
  student: string,
  expected: string,
  opts: ResolvedMatchOptions,
): boolean {
  const dash = normalizeDashStudent(student, expected, opts.dashStyle)
  if (!dash.ok) return false
  return expandAlternatives(expected).some((alt) =>
    lineToRegex(alt, opts).test(dash.text),
  )
}

function prepareLines(
  lines: string[],
  opts: ResolvedMatchOptions,
): string[] {
  let out = lines.map((l) => trimLine(l, opts.trimLines))
  if (opts.ignoreEmptyLines) out = out.filter((l) => !isBlankLine(l))
  return out
}

export function normalizeDashStudent(
  student: string,
  expected: string,
  dashStyle: ResolvedMatchOptions['dashStyle'],
): { ok: true; text: string } | { ok: false; message: string } {
  if (dashStyle !== 'enOrEm') return { ok: true, text: student }
  const hasEn = student.includes('–')
  const hasEm = student.includes('—')
  if (hasEn && hasEm) {
    return {
      ok: false,
      message: 'Používej v textu jen jeden druh pomlčky.',
    }
  }
  if (hasEm && expected.includes('–') && !expected.includes('—')) {
    return { ok: true, text: student.replace(/—/g, '–') }
  }
  return { ok: true, text: student }
}

export function linesMatch(
  studentLines: string[],
  expectedLines: string[],
  opts?: MatchOptions,
): { passed: boolean; message?: string; mismatches: number[] } {
  const o = resolveMatch(opts)
  const sLines = prepareLines(studentLines, o)
  const eLines = prepareLines(expectedLines, o)

  const mismatches: number[] = []
  const max = Math.max(sLines.length, eLines.length)
  for (let i = 0; i < max; i++) {
    const s = sLines[i]
    const e = eLines[i]
    if (s === undefined || e === undefined) {
      mismatches.push(i)
      continue
    }
    const dash = normalizeDashStudent(s, e, o.dashStyle)
    if (!dash.ok) {
      return { passed: false, message: dash.message, mismatches: [i] }
    }
    if (!lineMatches(dash.text, e, o)) mismatches.push(i)
  }
  return {
    passed: mismatches.length === 0,
    message:
      mismatches.length === 0
        ? undefined
        : `V odstavci ${mismatches.map((i) => i + 1).join(', ')} je ještě chyba.`,
    mismatches,
  }
}

/**
 * For „smaž špatné“: ignore order and blank lines; require all good lines,
 * forbid leftover wrong lines (and any other unexpected line).
 */
export function linesMatchSet(
  studentLines: string[],
  expectedLines: string[],
  opts?: MatchOptions,
): { passed: boolean; message?: string; mismatches: number[] } {
  const o = resolveMatch(opts)
  const sLines = prepareLines(studentLines, o)
  const eLines = prepareLines(expectedLines, o)
  const used = new Set<number>()

  for (let ei = 0; ei < eLines.length; ei++) {
    const found = sLines.findIndex(
      (s, si) => !used.has(si) && lineMatches(s, eLines[ei], o),
    )
    if (found < 0) {
      return {
        passed: false,
        message: 'Chybí některá správná věta.',
        mismatches: [ei],
      }
    }
    used.add(found)
  }

  const extras = sLines
    .map((_, i) => i)
    .filter((i) => !used.has(i))
  if (extras.length > 0) {
    return {
      passed: false,
      message: 'Smaž ještě špatné nebo přebytečné řádky.',
      mismatches: extras,
    }
  }

  return { passed: true, mismatches: [] }
}

export function textContainsLine(
  studentLines: string[],
  expectedLine: string,
  opts?: MatchOptions,
): boolean {
  const o = resolveMatch(opts)
  return prepareLines(studentLines, o).some((s) =>
    lineMatches(s, expectedLine, o),
  )
}

/** True when mechanic is about keeping correct lines and deleting wrong ones. */
export function isKeepDeleteMechanic(mechanic: string): boolean {
  return /smaž/i.test(mechanic)
}

/** Whether annotation `at` appears in student text under F11 normalization. */
export function annotationResolved(
  studentText: string,
  at: string | string[],
  opts?: MatchOptions,
): boolean {
  const variants = Array.isArray(at) ? at : [at]
  const o = resolveMatch(opts)
  // flatten student for substring search with nbsp modes
  for (const variant of variants) {
    for (const alt of expandAlternatives(variant)) {
      if (o.nbspMode === 'strict') {
        if (studentText.includes(alt)) return true
      } else {
        // ignore: treat NBSP and space as equal for search
        const normS = studentText.replace(/\u00A0/g, ' ')
        const normA = alt.replace(/\u00A0/g, ' ')
        if (normS.includes(normA)) return true
        if (o.nbspMode === 'requiredOnly' && studentText.includes(alt))
          return true
      }
    }
  }
  return false
}
