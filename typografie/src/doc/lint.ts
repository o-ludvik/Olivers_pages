import { RULES } from '../levels/catalogData'

export type LintFinding = {
  ruleId: string
  severity: 'error' | 'warn'
  index: number
  length: number
  message: string
  rule: string
}

const LINT_RULES: Array<{
  id: string
  re: RegExp
  sev: 'error' | 'warn'
  rule: string
  msg: string
}> = [
  {
    id: 'mezera-pred-interpunkci',
    re: / [,.;!?]/gu,
    sev: 'error',
    rule: 'interpunkce',
    msg: 'Před interpunkcí nepatří mezera.',
  },
  {
    id: 'chybi-mezera-za-carkou',
    re: /,(?=[^\s\d“‘)\]])/gu,
    sev: 'error',
    rule: 'interpunkce',
    msg: 'Za čárkou chybí mezera.',
  },
  {
    id: 'dve-tecky',
    re: /(?<!\.)\.\.(?!\.)/gu,
    sev: 'error',
    rule: 'interpunkce',
    msg: 'Dvě tečky za sebou.',
  },
  {
    id: 'carka-pred-atd',
    re: /,\s*(?:atd|apod)\./gu,
    sev: 'error',
    rule: 'interpunkce',
    msg: 'Před atd./apod. na konci výčtu čárka nepatří.',
  },
  {
    id: 'rovne-uvozovky',
    re: /["']/gu,
    sev: 'error',
    rule: 'uvozovky',
    msg: 'Použij české uvozovky „…“ (‚…‘).',
  },
  {
    id: 'mezera-v-uvozovkach',
    re: /„ | “/gu,
    sev: 'error',
    rule: 'uvozovky',
    msg: 'Uvozovky přiléhají těsně k textu.',
  },
  {
    id: 'mezera-v-zavorkach',
    re: /\( | \)/gu,
    sev: 'error',
    rule: 'zavorky',
    msg: 'Uvnitř závorek nepatří mezera.',
  },
  {
    id: 'tri-tecky',
    re: /\.\.\./gu,
    sev: 'error',
    rule: 'vypustka',
    msg: 'Místo tří teček použij znak …',
  },
  {
    id: 'spojovnik-misto-pomlcky',
    re: / - /gu,
    sev: 'error',
    rule: 'pomlcka',
    msg: 'Mezi slovy patří pomlčka –, ne spojovník.',
  },
  {
    id: 'cislovka-spojovnik',
    re: /\d+-(?=\p{L})/gu,
    sev: 'error',
    rule: 'cislovky',
    msg: 'Číslovky se nepíšou se spojovníkem (18 let, 12., 8kilometrový).',
  },
  {
    id: 'cislovka-koncovka',
    re: /\d+(?:ti|mi)\p{L}|\d+(?:tý|tí|tá|té|tého)(?!\p{L})/gu,
    sev: 'error',
    rule: 'cislovky',
    msg: 'Číslovka s koncovkou (12tý, 8mikilometrový).',
  },
  {
    id: 'carka-pomlcka-mena',
    re: /,[-–](?!\d)/gu,
    sev: 'error',
    rule: 'mena',
    msg: 'U celých částek nepiš ,– (500 Kč).',
  },
  {
    id: 'stupne-bez-mezery',
    re: /\d°[CF]/gu,
    sev: 'error',
    rule: 'jednotky',
    msg: '°C se od čísla odděluje mezerou (25 °C).',
  },
  {
    id: 'nbsp-jednopismenne',
    re: /(?<=^|[ \u00A0(„])[ksvzuoaiKSVZUOAI] /gu,
    sev: 'warn',
    rule: 'zalomeni',
    msg: 'Za jednopísmenné slovo patří nezlomitelná mezera.',
  },
  {
    id: 'nbsp-jednotka',
    re: /\d (?:kg|g|km|m|cm|mm|l|ml|Kč|%|°C|min|h)(?!\p{L})/gu,
    sev: 'warn',
    rule: 'zalomeni',
    msg: 'Mezi číslem a jednotkou patří nezlomitelná mezera.',
  },
  {
    id: 'cislo-procento',
    re: /\d%/gu,
    sev: 'warn',
    rule: 'jednotky',
    msg: 'Bez mezery jen u přídavného jména (10% sleva), jinak 10 %.',
  },
  {
    id: 'rozsah-spojovnikem',
    re: /\d-\d/gu,
    sev: 'warn',
    rule: 'pomlcka',
    msg: 'Pro rozsah použij pomlčku – (1914–1918).',
  },
  {
    id: 'datum-bez-mezer',
    re: /\b\d{1,2}\.\d{1,2}\.\d{4}/gu,
    sev: 'warn',
    rule: 'datum',
    msg: 'V souvislém textu piš datum s mezerami (6. 10. 2026).',
  },
]

const URL_OR_EMAIL =
  /https?:\/\/\S+|www\.\S+|[\w.+-]+@[\w.-]+\.\w+/gi

function maskLinks(text: string): { masked: string; map: number[] } {
  const map: number[] = []
  let masked = ''
  let last = 0
  for (const m of text.matchAll(URL_OR_EMAIL)) {
    const start = m.index ?? 0
    masked += text.slice(last, start)
    for (let i = last; i < start; i++) map.push(i)
    const len = m[0].length
    masked += ' '.repeat(len)
    for (let i = 0; i < len; i++) map.push(-1)
    last = start + len
  }
  masked += text.slice(last)
  for (let i = last; i < text.length; i++) map.push(i)
  return { masked, map }
}

export function runLinter(text: string): LintFinding[] {
  const { masked, map } = maskLinks(text)
  const findings: LintFinding[] = []
  for (const rule of LINT_RULES) {
    rule.re.lastIndex = 0
    for (const m of masked.matchAll(rule.re)) {
      const idx = m.index ?? 0
      const real = map[idx]
      if (real < 0) continue
      findings.push({
        ruleId: rule.id,
        severity: rule.sev,
        index: real,
        length: m[0].length,
        message: rule.msg,
        rule: rule.rule,
      })
    }
  }
  return findings
}

export function lintErrorCount(
  text: string,
  treatAsErrors: string[] = [],
): { errors: LintFinding[]; warns: LintFinding[] } {
  const all = runLinter(text)
  const errors = all.filter(
    (f) => f.severity === 'error' || treatAsErrors.includes(f.ruleId),
  )
  const warns = all.filter(
    (f) => f.severity === 'warn' && !treatAsErrors.includes(f.ruleId),
  )
  return { errors, warns }
}

export function ruleShort(ruleId: string): string {
  return RULES[ruleId]?.short ?? ruleId
}

/** Short Czech phrase for location feedback (no trailing period). */
const FINDING_HINT: Record<string, string> = {
  'mezera-pred-interpunkci': 'mezeře před interpunkcí',
  'chybi-mezera-za-carkou': 'chybějící mezeře za čárkou',
  'dve-tecky': 'dvou tečkách za sebou',
  'carka-pred-atd': 'čárce před atd./apod.',
  'rovne-uvozovky': 'špatně napsané uvozovce',
  'mezera-v-uvozovkach': 'mezeře u uvozovek',
  'mezera-v-zavorkach': 'mezeře u závorek',
  'tri-tecky': 'třech tečkách místo výpustky',
  'spojovnik-misto-pomlcky': 'spojovníku místo pomlčky',
  'cislovka-spojovnik': 'číslovce se spojovníkem',
  'cislovka-koncovka': 'číslovce s koncovkou',
  'carka-pomlcka-mena': 'zápisu ceny s ,–',
  'stupne-bez-mezery': 'chybějící mezeře u °C/°F',
  'nbsp-jednopismenne': 'obyčejné mezeře za jednopísmenným slovem',
  'nbsp-jednotka': 'obyčejné mezeře mezi číslem a jednotkou',
  'cislo-procento': 'zápisu procent',
  'rozsah-spojovnikem': 'rozsahu se spojovníkem',
  'datum-bez-mezer': 'datu bez mezer',
}

/** Short quote around an index — works when the whole doc is one wrapped paragraph. */
export function contextSnippet(
  text: string,
  index: number,
  length = 1,
  radius = 14,
): string {
  const start = Math.max(0, index - radius)
  const end = Math.min(text.length, index + Math.max(length, 1) + radius)
  let s = text.slice(start, end).replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ')
  if (start > 0) s = `…${s}`
  if (end < text.length) s = `${s}…`
  return s.trim()
}

/** e.g. "Chyba je v mezeře před interpunkcí u «…film ?Nevím…»" */
export function formatFindingLocation(
  finding: LintFinding,
  text: string,
): string {
  const hint =
    FINDING_HINT[finding.ruleId] ??
    finding.message.replace(/\.$/, '').toLowerCase()
  const at = contextSnippet(text, finding.index, finding.length)
  return at ? `Chyba je v ${hint} u «${at}»` : `Chyba je v ${hint}.`
}

export function formatLintFindings(
  findings: LintFinding[],
  text: string,
  limit = 8,
): string {
  const seen = new Set<string>()
  const out: string[] = []
  for (const f of findings) {
    const msg = formatFindingLocation(f, text)
    if (seen.has(msg)) continue
    seen.add(msg)
    out.push(msg)
    if (out.length >= limit) break
  }
  return out.join('\n')
}
