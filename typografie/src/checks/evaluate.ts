import type {
  Check,
  CheckOutcome,
  DocModel,
  MatchOptions,
  TaskDefinition,
} from '../levels/types'
import { runConstraint, extractSections, wordCount, paraText } from '../doc/constraints'
import {
  contextSnippet,
  formatLintFindings,
  lintErrorCount,
} from '../doc/lint'
import {
  linesMatch,
  linesMatchSet,
  textContainsLine,
  annotationResolved,
  expandAlternatives,
  isKeepDeleteMechanic,
  isBlankLine,
  resolveMatch,
  trimLine,
} from '../doc/matchText'
import {
  docToPlainLines,
  docToPlainText,
  parseDocSource,
} from '../doc/parse'
import { RULES } from '../levels/catalogData'

/** Locative-ish short labels for annotation feedback. */
const RULE_WHERE: Record<string, string> = {
  interpunkce: 'mezeře nebo interpunkci',
  vypustka: 'výpustce',
  uvozovky: 'uvozovce',
  zavorky: 'závorkách',
  lomitko: 'lomítku',
  datum: 'datu',
  cas: 'času',
  jednotky: 'jednotkách',
  mena: 'zápisu částky',
  matematika: 'matematickém zápisu',
  cislovky: 'číslovce',
  pomlcka: 'pomlčce',
  spojovnik: 'spojovníku',
  zalomeni: 'nezlomitelné mezeře',
  zkratky: 'zkratce',
  jmena: 'jménu nebo titulu',
}

function prepareDisplayLines(
  lines: string[],
  match: MatchOptions | undefined,
): string[] {
  const o = resolveMatch(match)
  let out = lines.map((l) => trimLine(l, o.trimLines))
  if (o.ignoreEmptyLines !== false) out = out.filter((l) => !isBlankLine(l))
  return out
}

function firstDiffIndex(student: string, expected: string): number {
  const n = Math.min(student.length, expected.length)
  for (let i = 0; i < n; i++) {
    if (student[i] !== expected[i]) return i
  }
  return n
}

/** Snippet in student text near an unresolved annotation (not just the first diff). */
function annotationSnippet(
  student: string,
  expected: string,
  at: string | string[],
): string {
  const variants = (Array.isArray(at) ? at : [at]).flatMap((v) =>
    expandAlternatives(v),
  )
  const normS = student.replace(/\u00A0/g, ' ')
  const normE = expected.replace(/\u00A0/g, ' ')

  for (const alt of variants) {
    const normA = alt.replace(/\u00A0/g, ' ')
    const inExpected = normE.indexOf(normA)
    if (inExpected < 0) continue

    // Longest prefix of the correct form that still appears in student
    let pos = -1
    for (let len = Math.min(normA.length, 12); len >= 3; len--) {
      const prefix = normA.slice(0, len)
      const hit = normS.indexOf(prefix)
      if (hit >= 0) {
        pos = hit
        break
      }
    }
    // Fallback: letters/digits from the annotation (e.g. "pohled" from pohled/magnetku)
    if (pos < 0) {
      const token = normA.match(/[\p{L}\d]{3,}/u)?.[0]
      if (token) pos = normS.indexOf(token)
    }
    if (pos < 0) pos = Math.min(inExpected, Math.max(0, student.length - 1))
    return contextSnippet(student, pos, Math.max(normA.length, 6))
  }

  return contextSnippet(student, firstDiffIndex(student, expected))
}

function describeTextLineFailures(
  task: TaskDefinition,
  studentLines: string[],
  expectedLines: string[],
  mismatches: number[],
): string {
  const sLines = prepareDisplayLines(studentLines, task.match)
  const eLines = prepareDisplayLines(expectedLines, task.match)
  const multi = Math.max(sLines.length, eLines.length) > 1
  const msgs: string[] = []
  const seen = new Set<string>()
  const push = (m: string) => {
    if (!m || seen.has(m)) return
    seen.add(m)
    msgs.push(m)
  }

  for (const i of mismatches) {
    const s = sLines[i]
    const e = eLines[i]
    const para = multi ? ` (odstavec ${i + 1})` : ''
    if (s === undefined) {
      push(`Chybí odstavec ${i + 1}.`)
      continue
    }
    if (e === undefined) {
      push(`Smaž přebytečný odstavec ${i + 1}.`)
      continue
    }

    const unresolved = (task.errors ?? []).filter(
      (err) =>
        annotationResolved(e, err.at, task.match) &&
        !annotationResolved(s, err.at, task.match),
    )

    if (unresolved.length) {
      for (const err of unresolved) {
        const where =
          RULE_WHERE[err.rule] ?? RULES[err.rule]?.title?.toLowerCase()
        if (!where) continue
        const at = annotationSnippet(s, e, err.at)
        push(
          at
            ? `Chyba je v ${where} u «${at}»${para}`
            : `Chyba je v ${where}.${para}`,
        )
      }
      continue
    }

    const { errors } = lintErrorCount(s)
    if (errors.length) {
      for (const line of formatLintFindings(errors, s).split('\n')) {
        push(para ? `${line}${para}` : line)
      }
      continue
    }

    const at = contextSnippet(s, firstDiffIndex(s, e))
    push(at ? `Ještě chyba u «${at}»${para}` : `Na odstavci ${i + 1} je ještě chyba.`)
  }

  return msgs.join('\n') || 'Text ještě neodpovídá.'
}

export type EvaluateContext = {
  task: TaskDefinition
  student: DocModel
  studentHtml: string
}

function solutionDoc(task: TaskDefinition): DocModel | undefined {
  return task.solution ? parseDocSource(task.solution) : undefined
}

function solutionLines(task: TaskDefinition): string[] {
  const doc = solutionDoc(task)
  return doc ? docToPlainLines(doc) : []
}

function markToleranceChar(ch: string): boolean {
  return /[ \u00A0()[\]„“‚‘"'',.;:!?…]/.test(ch)
}

function marksEqual(
  student: DocModel['paragraphs'][0],
  expected: DocModel['paragraphs'][0],
  key: 'bold' | 'italic' | 'underline' | 'superscript' | 'subscript',
): boolean {
  const sText = paraText(student)
  const eText = paraText(expected)
  const sMarks: boolean[] = []
  const eMarks: boolean[] = []
  for (const r of student.runs) {
    for (let i = 0; i < r.text.length; i++) sMarks.push(Boolean(r[key]))
  }
  for (const r of expected.runs) {
    for (let i = 0; i < r.text.length; i++) eMarks.push(Boolean(r[key]))
  }
  const len = Math.min(sText.length, eText.length, sMarks.length, eMarks.length)
  for (let i = 0; i < len; i++) {
    if (markToleranceChar(sText[i]) || markToleranceChar(eText[i])) continue
    if (sMarks[i] !== eMarks[i]) return false
  }
  return true
}

function normalizeHref(href: string): string {
  try {
    let h = decodeURI(href)
    if (h.endsWith('/')) h = h.slice(0, -1)
    return h
  } catch {
    return href
  }
}

function docMatchesCheck(
  student: DocModel,
  expected: DocModel,
  compare: string[],
  match: MatchOptions | undefined,
  trailing?: { minWords: number },
): CheckOutcome {
  let sParas = student.paragraphs
  let eParas = expected.paragraphs
  if (match?.ignoreEmptyLines !== false) {
    sParas = sParas.filter((p) => !isBlankLine(paraText(p)))
    eParas = eParas.filter((p) => !isBlankLine(paraText(p)))
  }

  // Last expected paragraph is sample free-text when trailingFreeText is set
  const paired = trailing ? Math.max(0, eParas.length - 1) : eParas.length
  if (!trailing && sParas.length !== eParas.length) {
    return {
      check: { type: 'docMatches', compare: compare as never },
      passed: false,
      message: `Počet odstavců: ${sParas.length}, očekáváno ${eParas.length}.`,
    }
  }
  if (trailing && sParas.length < paired) {
    return {
      check: { type: 'docMatches', compare: compare as never },
      passed: false,
      message: `Chybí odstavce (máš ${sParas.length}, potřeba aspoň ${paired}).`,
    }
  }

  for (let i = 0; i < paired; i++) {
    const s = sParas[i]
    const e = eParas[i]
    for (const key of compare) {
      if (key === 'text') {
        const r = linesMatch([paraText(s)], [paraText(e)], match)
        if (!r.passed) {
          return {
            check: { type: 'docMatches', compare: compare as never },
            passed: false,
            message: `Na ${i + 1}. odstavci je ještě chyba v textu.`,
          }
        }
      } else if (key === 'style') {
        const accepted = e.acceptStyles ?? [e.style]
        if (!accepted.includes(s.style)) {
          return {
            check: { type: 'docMatches', compare: compare as never },
            passed: false,
            message: `${i + 1}. odstavec má mít styl ${e.style}.`,
          }
        }
      } else if (key === 'align') {
        if ((s.align || 'left') !== (e.align || 'left')) {
          return {
            check: { type: 'docMatches', compare: compare as never },
            passed: false,
            message: `${i + 1}. odstavec má špatné zarovnání.`,
          }
        }
      } else if (key === 'list') {
        const sl = s.list
        const el = e.list
        if (!!sl !== !!el || sl?.type !== el?.type || sl?.level !== el?.level) {
          return {
            check: { type: 'docMatches', compare: compare as never },
            passed: false,
            message: `${i + 1}. odstavec: špatný seznam.`,
          }
        }
      } else if (
        key === 'bold' ||
        key === 'italic' ||
        key === 'underline' ||
        key === 'superscript' ||
        key === 'subscript'
      ) {
        if (!marksEqual(s, e, key)) {
          return {
            check: { type: 'docMatches', compare: compare as never },
            passed: false,
            message: `${i + 1}. odstavec: špatné ${key}.`,
          }
        }
      } else if (key === 'link') {
        const sLinks = s.runs.map((r) => r.link).filter(Boolean)
        const eLinks = e.runs.map((r) => r.link).filter(Boolean)
        const ok =
          sLinks.length === eLinks.length &&
          sLinks.every(
            (h, idx) =>
              normalizeHref(h!) === normalizeHref(eLinks[idx] as string),
          )
        if (!ok) {
          return {
            check: { type: 'docMatches', compare: compare as never },
            passed: false,
            message: `${i + 1}. odstavec: špatný odkaz.`,
          }
        }
      } else if (key === 'fontFamily') {
        const sf = s.runs.find((r) => r.text.trim())?.fontFamily
        const ef = e.runs.find((r) => r.text.trim())?.fontFamily
        if (sf && ef && !sf.includes(ef) && !ef.includes(sf)) {
          return {
            check: { type: 'docMatches', compare: compare as never },
            passed: false,
            message: `${i + 1}. odstavec: špatné písmo.`,
          }
        }
      } else if (key === 'fontSize') {
        const sf = s.runs.find((r) => r.text.trim())?.fontSize
        const ef = e.runs.find((r) => r.text.trim())?.fontSize
        if (sf != null && ef != null && sf !== ef) {
          return {
            check: { type: 'docMatches', compare: compare as never },
            passed: false,
            message: `${i + 1}. odstavec: špatná velikost písma.`,
          }
        }
      }
    }
  }

  if (trailing) {
    const free = sParas.slice(paired).map(paraText).join(' ')
    if (wordCount(free) < trailing.minWords) {
      return {
        check: { type: 'docMatches', compare: compare as never },
        passed: false,
        message: `Zdůvodnění musí mít aspoň ${trailing.minWords} slov.`,
      }
    }
  }

  return {
    check: { type: 'docMatches', compare: compare as never },
    passed: true,
  }
}

function customCheck(
  id: string,
  params: Record<string, unknown>,
  ctx: EvaluateContext,
): CheckOutcome {
  const lines = docToPlainLines(ctx.student)
  if (id === 'sectionsDiffer') {
    const a = String(params.a)
    const b = String(params.b)
    const labels = [a, b]
    // also gather from sections check if present
    const taskSections = ctx.task.checks.find((c) => c.type === 'sections')
    const allLabels =
      taskSections && taskSections.type === 'sections'
        ? taskSections.labels
        : labels
    const sec = extractSections(lines, allLabels)
    const passed = (sec[a] ?? '') !== (sec[b] ?? '') && Boolean(sec[a] && sec[b])
    return {
      check: { type: 'custom', id, params },
      passed,
      message: passed ? undefined : 'Původní a opravený text se musí lišit.',
    }
  }
  if (id === 'trapPairs') {
    // TYP-22: best-effort — require min lines
    const passed = lines.filter((l) => l.trim()).length >= 4
    return {
      check: { type: 'custom', id, params },
      passed,
      message: passed ? undefined : 'Přidej aspoň dvě dvojice chytáků.',
    }
  }
  return {
    check: { type: 'custom', id, params },
    passed: false,
    message: `Neznámá custom kontrola: ${id}`,
  }
}

export function evaluateCheck(check: Check, ctx: EvaluateContext): CheckOutcome {
  const { task, student } = ctx
  const match = task.match
  const lines = docToPlainLines(student)
  const text = docToPlainText(student)

  switch (check.type) {
    case 'textLines': {
      const expected = solutionLines(task)
      if (isKeepDeleteMechanic(task.mechanic)) {
        const r = linesMatchSet(lines, expected, match)
        if (r.passed) return { check, passed: true }
        const extras = r.mismatches.map((i) => i + 1)
        const msg =
          r.message === 'Chybí některá správná věta.'
            ? 'Ještě chybí některá správná věta — zkontroluj, co jsi smazal(a).'
            : extras.length
              ? `Smaž ještě špatné řádky: ${extras.join(', ')}.`
              : (r.message ?? 'Smaž ještě špatné řádky.')
        return { check, passed: false, message: msg }
      }
      const r = linesMatch(lines, expected, match)
      if (r.passed) return { check, passed: true }
      if (r.message?.includes('pomlčky')) {
        return { check, passed: false, message: r.message }
      }
      return {
        check,
        passed: false,
        message: describeTextLineFailures(task, lines, expected, r.mismatches),
      }
    }
    case 'docMatches': {
      const sol = solutionDoc(task)
      if (!sol) return { check, passed: false, message: 'Chybí řešení.' }
      return docMatchesCheck(
        student,
        sol,
        check.compare,
        match,
        check.trailingFreeText,
      )
    }
    case 'numberSet': {
      const found = [...text.matchAll(/-?\d+/g)].map((m) => Number(m[0]))
      const set = new Set(found)
      const expected = new Set(check.expected)
      const missing = [...expected].filter((n) => !set.has(n))
      const extra = [...set].filter((n) => !expected.has(n))
      const ok = missing.length === 0 && extra.length === 0
      return {
        check,
        passed: ok,
        message: ok
          ? undefined
          : `Čísla: chybí ${missing.join(', ') || '—'}, navíc ${extra.join(', ') || '—'}.`,
      }
    }
    case 'containsLine': {
      const ok = textContainsLine(lines, check.line, match)
      return {
        check,
        passed: ok,
        message: ok ? undefined : 'Požadovaný řádek v textu chybí.',
      }
    }
    case 'notContainsText': {
      const ok = !text.includes(check.text)
      return {
        check,
        passed: ok,
        message: ok ? undefined : `Text nesmí obsahovat „${check.text}“.`,
      }
    }
    case 'require': {
      const re = new RegExp(check.pattern, check.flags ?? 'u')
      const min = check.min ?? 1
      const count = [...text.matchAll(new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`))].length
      const ok = count >= min
      return {
        check,
        passed: ok,
        message: ok ? undefined : `Chybí: ${check.label}.`,
      }
    }
    case 'minWords': {
      let t = text
      if (check.excludePattern) {
        const re = new RegExp(check.excludePattern, 'gmu')
        t = lines.filter((l) => !re.test(l)).join('\n')
      }
      const n = wordCount(t)
      const ok = n >= check.min
      return {
        check,
        passed: ok,
        message: ok ? undefined : `Potřebuješ aspoň ${check.min} slov (máš ${n}).`,
      }
    }
    case 'constraint': {
      const prefill = task.prefill ? parseDocSource(task.prefill) : undefined
      const r = runConstraint(check.id, student, check.params ?? {}, prefill)
      return { check, passed: r.passed, message: r.message }
    }
    case 'lint': {
      let target = text
      if (check.section) {
        const secCheck = task.checks.find((c) => c.type === 'sections')
        const labels =
          secCheck && secCheck.type === 'sections' ? secCheck.labels : [check.section]
        const sec = extractSections(lines, labels)
        target = sec[check.section] ?? ''
      }
      const { errors } = lintErrorCount(target, check.treatAsErrors)
      const ok = errors.length <= check.maxErrors
      return {
        check,
        passed: ok,
        message: ok
          ? undefined
          : formatLintFindings(errors, target) ||
            `Ještě ${errors.length} typografických chyb.`,
      }
    }
    case 'sections': {
      const sec = extractSections(lines, check.labels)
      const missing = check.labels.filter((l) => !sec[l]?.trim())
      return {
        check,
        passed: missing.length === 0,
        message:
          missing.length === 0
            ? undefined
            : `Vyplň sekce: ${missing.join(', ')}.`,
      }
    }
    case 'custom':
      return customCheck(check.id, check.params ?? {}, ctx)
    default:
      return { check, passed: false, message: 'Neznámá kontrola.' }
  }
}

export function runTaskChecks(ctx: EvaluateContext): CheckOutcome[] {
  return ctx.task.checks.map((c) => evaluateCheck(c, ctx))
}

export function countRemainingErrors(
  task: TaskDefinition,
  student: DocModel,
): number {
  const text = docToPlainText(student)
  const match = task.match
  let unresolved = 0

  const annotations = [...(task.errors ?? [])]
  if (task.autoErrors === 'nbsp' && task.solution) {
    const solText = docToPlainText(parseDocSource(task.solution))
    // skip alternatives insides
    // each NBSP in solution (outside {{}})
    let i = 0
    while (i < solText.length) {
      if (solText.startsWith('{{', i)) {
        const end = solText.indexOf('}}', i)
        i = end < 0 ? solText.length : end + 2
        continue
      }
      if (solText[i] === '\u00A0') {
        const before = solText.slice(0, i).split(/[ \u00A0]/).pop() ?? ''
        const after = solText.slice(i + 1).split(/[ \u00A0]/)[0] ?? ''
        const at = `${before}\u00A0${after}`
        if (!annotations.some((a) => a.at === at || (Array.isArray(a.at) && a.at.includes(at)))) {
          annotations.push({ at, rule: 'zalomeni' })
        }
      }
      i++
    }
  }

  for (const err of annotations) {
    if (!annotationResolved(text, err.at, match)) unresolved++
  }

  if (annotations.length === 0 && task.solution) {
    const lines = docToPlainLines(student)
    const expected = solutionLines(task)
    const r = isKeepDeleteMechanic(task.mechanic)
      ? linesMatchSet(lines, expected, match)
      : linesMatch(lines, expected, match)
    unresolved = r.mismatches.length
  } else if (annotations.length > 0 && task.solution) {
    const r = linesMatch(docToPlainLines(student), solutionLines(task), match)
    // add mismatched paragraphs that don't contain any annotation site
    for (const idx of r.mismatches) {
      const line = docToPlainLines(student)[idx] ?? ''
      const covered = annotations.some((a) =>
        annotationResolved(line, a.at, match),
      )
      // if line still wrong and no annotation on solution side for that area — count extra
      void covered
    }
  }

  return unresolved
}

export function formatErrorCount(n: number): string {
  const pr = new Intl.PluralRules('cs')
  const cat = pr.select(n)
  if (cat === 'one') return `${n} chyba`
  if (cat === 'few') return `${n} chyby`
  return `${n} chyb`
}

export function fillInstructions(task: TaskDefinition): string {
  const count =
    task.errors?.length ??
    (task.autoErrors === 'nbsp' && task.solution
      ? countNbspInSolution(task)
      : 0)
  const show =
    task.feedback?.showCountUpfront ?? task.mechanic === 'oprav'
  if (!show && !task.instructions.includes('{errorCount}')) {
    return task.instructions
  }
  const n =
    task.instructions.includes('{errorCount}') && count === 0
      ? guessErrorCount(task)
      : count || guessErrorCount(task)
  return task.instructions.replace('{errorCount}', formatErrorCount(n))
}

function countNbspInSolution(task: TaskDefinition): number {
  if (!task.solution) return 0
  const t = parseDocSource(task.solution)
  return [...docToPlainText(t)].filter((c) => c === '\u00A0').length
}

function guessErrorCount(task: TaskDefinition): number {
  if (task.errors?.length) return task.errors.length
  return countNbspInSolution(task)
}

/** Expand all alternative combinations for self-test (bounded). */
export function expandSolutionVariants(content: string): string[] {
  return expandAlternatives(content).slice(0, 32)
}
