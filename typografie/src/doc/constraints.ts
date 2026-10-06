import type { DocModel, ParaStyle } from '../levels/types'
import {
  fontClassification,
  normalizeFontName,
} from '../fonts'
import { docToPlainLines, docToPlainText } from './parse'

export type ConstraintResult = { passed: boolean; message?: string }

function paraText(p: DocModel['paragraphs'][0]): string {
  return p.runs.map((r) => r.text).join('')
}

function wordCount(text: string): number {
  return text
    .trim()
    .split(/[ \u00A0\t\n]+/)
    .filter(Boolean).length
}

export function runConstraint(
  id: string,
  doc: DocModel,
  params: Record<string, unknown> = {},
  prefillDoc?: DocModel,
): ConstraintResult {
  const paras = doc.paragraphs
  switch (id) {
    case 'uniformFont': {
      const scope = (params.scope as string) ?? 'all'
      const runs = paras
        .filter((p) => scope !== 'normal' || p.style === 'normal')
        .flatMap((p) => p.runs.filter((r) => r.text.trim()))
      if (runs.length === 0) return { passed: true }
      const size = params.size as number | undefined
      const allowed = params.allowedFamilies as
        | 'serif'
        | 'sans'
        | string[]
        | undefined
      const targetFamily = normalizeFontName(
        (params.family as string) || runs[0].fontFamily,
      )
      const ok = runs.every((r) => {
        if (size != null && r.fontSize !== size) return false
        const name = normalizeFontName(r.fontFamily)
        if (allowed === 'serif' || allowed === 'sans') {
          if (fontClassification(name) !== allowed) return false
          // same concrete font for all runs
          return name.toLowerCase() === targetFamily.toLowerCase()
        }
        if (Array.isArray(allowed)) {
          return allowed.some(
            (a) => name.toLowerCase() === normalizeFontName(a).toLowerCase(),
          )
        }
        return name.toLowerCase() === targetFamily.toLowerCase()
      })
      return {
        passed: ok,
        message: ok
          ? undefined
          : 'Text nemá jednotné písmo nebo velikost.',
      }
    }
    case 'maxFonts': {
      const max = Number(params.max ?? 2)
      const fonts = new Set(
        paras.flatMap((p) =>
          p.runs
            .filter((r) => r.text.trim())
            .map((r) => normalizeFontName(r.fontFamily).toLowerCase())
            .filter(Boolean),
        ),
      )
      const passed = fonts.size <= max
      return {
        passed,
        message: passed
          ? undefined
          : `Používáš ${fonts.size} písma, povolená jsou nejvýš ${max}.`,
      }
    }
    case 'underlineOnlyLinks': {
      for (const p of paras) {
        for (const r of p.runs) {
          if (r.underline && !r.link && r.text.trim()) {
            return {
              passed: false,
              message: 'Podtržený text vypadá jako odkaz.',
            }
          }
        }
      }
      return { passed: true }
    }
    case 'noFakeHeadings': {
      for (const p of paras) {
        if (p.style !== 'normal' || p.list) continue
        const t = paraText(p).trim()
        const words = wordCount(t)
        if (words === 0 || words > 12) continue
        const allBold = p.runs.every((r) => !r.text.trim() || r.bold)
        const big = p.runs.some((r) => r.text.trim() && r.fontSize >= 14)
        if (allBold || big) {
          return {
            passed: false,
            message: `„${t}“ vypadá jako nadpis, ale nemá styl nadpisu.`,
          }
        }
      }
      return { passed: true }
    }
    case 'noManualHeadingFormatting': {
      const heading: ParaStyle[] = ['title', 'subtitle', 'h1', 'h2', 'h3']
      for (const p of paras) {
        if (!heading.includes(p.style)) continue
        for (const r of p.runs) {
          if (r.direct.bold || r.direct.fontSize || r.direct.fontFamily) {
            return {
              passed: false,
              message: 'Nadpis má ručně nastavené formátování.',
            }
          }
        }
      }
      return { passed: true }
    }
    case 'noDirectFormatting': {
      const allow = new Set((params.allow as string[]) ?? [])
      for (const p of paras) {
        for (const r of p.runs) {
          if (r.direct.fontFamily || r.direct.fontSize || r.color || r.highlight)
            return { passed: false, message: 'Odstraň přímé formátování.' }
          if (r.bold && !allow.has('bold'))
            return { passed: false, message: 'Odstraň přímé formátování.' }
          if (r.italic && !allow.has('italic'))
            return { passed: false, message: 'Odstraň přímé formátování.' }
          if (r.underline && !allow.has('underline'))
            return { passed: false, message: 'Odstraň přímé formátování.' }
        }
      }
      return { passed: true }
    }
    case 'noColor':
      return {
        passed: !paras.some((p) => p.runs.some((r) => r.color)),
        message: 'Odstraň barvu textu.',
      }
    case 'noHighlight':
      return {
        passed: !paras.some((p) => p.runs.some((r) => r.highlight)),
        message: 'Odstraň zvýraznění.',
      }
    case 'noEmptyParagraphs': {
      const empty = paras.some((p) => !paraText(p).trim())
      return {
        passed: !empty,
        message: empty
          ? 'Mezery mezi odstavci nedělej prázdnými řádky.'
          : undefined,
      }
    }
    case 'noLeadingWhitespace': {
      for (const p of paras) {
        const t = paraText(p)
        if (/^[ \t]/.test(t)) {
          return {
            passed: false,
            message: 'Text neposouvej mezerami.',
          }
        }
      }
      return { passed: true }
    }
    case 'noManualListMarkers': {
      for (const p of paras) {
        if (p.list) continue
        const t = paraText(p)
        if (/^(?:[-*•–]\s|\d+[.)]\s)/.test(t)) {
          return {
            passed: false,
            message: 'Použij seznam z nástrojů.',
          }
        }
      }
      return { passed: true }
    }
    case 'spaceAfterMin': {
      const pt = Number(params.pt ?? 0)
      const scope = (params.scope as string) ?? 'all'
      const ok = paras.every((p) => {
        if (!paraText(p).trim() || p.list) return true
        if (scope === 'normal' && p.style !== 'normal') return true
        return p.spaceAfterPt >= pt
      })
      return {
        passed: ok,
        message: ok ? undefined : `Mezera za odstavcem má být aspoň ${pt} pt.`,
      }
    }
    case 'noCenteredBody': {
      for (const p of paras) {
        if (p.style === 'normal' && !p.list && p.align === 'center') {
          return {
            passed: false,
            message: 'Běžný text nemá být na střed.',
          }
        }
      }
      return { passed: true }
    }
    case 'boldRatioMax': {
      const ratio = Number(params.ratio ?? 0.3)
      let bold = 0
      let total = 0
      for (const p of paras) {
        if (p.style !== 'normal') continue
        for (const r of p.runs) {
          const n = r.text.replace(/\s/g, '').length
          total += n
          if (r.bold) bold += n
        }
      }
      const passed = total === 0 || bold / total <= ratio
      return {
        passed,
        message: passed
          ? undefined
          : 'Tučně má být jen to nejdůležitější.',
      }
    }
    case 'requireStyle': {
      const style = params.style as ParaStyle
      const min = Number(params.min ?? 1)
      const max = params.max != null ? Number(params.max) : Infinity
      const n = paras.filter((p) => p.style === style).length
      const passed = n >= min && n <= max
      return {
        passed,
        message: passed
          ? undefined
          : `Počet odstavců stylu ${style}: ${n} (očekáváno ${min}–${max === Infinity ? '∞' : max}).`,
      }
    }
    case 'requireHeadings': {
      const min = Number(params.min ?? 1)
      const n = paras.filter((p) =>
        (['h1', 'h2', 'h3'] as ParaStyle[]).includes(p.style),
      ).length
      return {
        passed: n >= min,
        message: n >= min ? undefined : `Potřebuješ aspoň ${min} nadpis(y).`,
      }
    }
    case 'requireList': {
      const min = Number(params.min ?? 1)
      const type = params.type as 'bullet' | 'ordered' | undefined
      const lists = paras.filter(
        (p) => p.list && (!type || p.list.type === type),
      )
      // count list starts (level 0 groups roughly)
      const n = lists.filter((p) => p.list?.level === 0).length || lists.length
      return {
        passed: n >= min,
        message: n >= min ? undefined : `Potřebuješ aspoň ${min} seznam(y).`,
      }
    }
    case 'linkExists': {
      const hrefIncludes = params.hrefIncludes as string | undefined
      const textMatches = params.textMatches as string | undefined
      const re = textMatches ? new RegExp(textMatches, 'i') : null
      for (const p of paras) {
        for (const r of p.runs) {
          if (!r.link) continue
          if (hrefIncludes && !r.link.includes(hrefIncludes)) continue
          if (re && !re.test(r.text)) continue
          return { passed: true }
        }
      }
      // empty params = any link
      if (!hrefIncludes && !textMatches) {
        const any = paras.some((p) => p.runs.some((r) => r.link))
        return {
          passed: any,
          message: any ? undefined : 'Chybí odkaz.',
        }
      }
      return { passed: false, message: 'Chybí požadovaný odkaz.' }
    }
    case 'noRawUrls': {
      const text = docToPlainText(doc)
      // remove link texts from consideration roughly
      const stripped = paras
        .map((p) =>
          p.runs.map((r) => (r.link ? ' ' : r.text)).join(''),
        )
        .join('\n')
      if (/https?:\/\/|www\.|[\w.+-]+@[\w.-]+\.\w+/.test(stripped)) {
        return {
          passed: false,
          message: 'Holou adresu schovej do odkazu.',
        }
      }
      void text
      return { passed: true }
    }
    case 'noVagueLinkText': {
      const vague =
        /^(klikni(te)?\s+)?(sem|zde|tady)$|^odkaz$/i
      for (const p of paras) {
        for (const r of p.runs) {
          if (r.link && vague.test(r.text.trim())) {
            return {
              passed: false,
              message: 'Text odkazu má říkat, kam vede.',
            }
          }
        }
      }
      return { passed: true }
    }
    case 'textPreserved': {
      if (!prefillDoc) return { passed: true }
      const tokens = (s: string) =>
        s
          .toLowerCase()
          .replace(/^[-*•–]\s+/, '')
          .replace(/^\d+[.)]\s+/, '')
          .match(/[\p{L}\p{N}]+/gu) ?? []
      const pref = tokens(docToPlainText(prefillDoc))
      const stud = tokens(docToPlainText(doc))
      let j = 0
      for (const t of pref) {
        while (j < stud.length && stud[j] !== t) j++
        if (j >= stud.length) {
          return {
            passed: false,
            message: 'Nemaž ani neměň obsah, jen formátuj.',
          }
        }
        j++
      }
      return { passed: true }
    }
    default:
      return { passed: false, message: `Neznámý constraint: ${id}` }
  }
}

export function extractSections(
  lines: string[],
  labels: string[],
): Record<string, string> {
  const result: Record<string, string> = {}
  let current: string | null = null
  const buf: string[] = []
  const flush = () => {
    if (current) result[current] = buf.join('\n').trim()
    buf.length = 0
  }
  for (const line of lines) {
    const label = labels.find(
      (l) => line === l || line.startsWith(`${l}:`) || line.startsWith(`${l}：`),
    )
    if (label) {
      flush()
      current = label
      const rest = line.slice(label.length).replace(/^:\s*/, '')
      if (rest) buf.push(rest)
    } else if (current) {
      buf.push(line)
    }
  }
  flush()
  return result
}

export { wordCount, paraText, docToPlainLines }
