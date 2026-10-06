import type {
  Align,
  DocModel,
  DocSource,
  ParaStyle,
  Paragraph,
  Run,
} from '../levels/types'

const DEFAULT_FONT = 'Arial'
const DEFAULT_SIZE = 11

export const STYLE_SIZES: Record<ParaStyle, number> = {
  normal: 11,
  title: 26,
  subtitle: 15,
  h1: 20,
  h2: 16,
  h3: 14,
}

function emptyRun(overrides: Partial<Run> = {}): Run {
  return {
    text: '',
    bold: false,
    italic: false,
    underline: false,
    superscript: false,
    subscript: false,
    fontFamily: DEFAULT_FONT,
    fontSize: DEFAULT_SIZE,
    direct: {},
    ...overrides,
  }
}

function paraFromText(text: string, style: ParaStyle = 'normal'): Paragraph {
  return {
    style,
    align: 'left',
    spaceAfterPt: 0,
    runs: [emptyRun({ text, fontSize: STYLE_SIZES[style] })],
  }
}

export function expandNbspTilde(content: string): string {
  return content.replace(/~/g, '\u00A0')
}

export function parseTextSource(content: string): DocModel {
  const lines = expandNbspTilde(content).replace(/\r\n/g, '\n').split('\n')
  return { paragraphs: lines.map((line) => paraFromText(line)) }
}

function parseAlign(style: string | null): Align {
  if (!style) return 'left'
  const m = /text-align\s*:\s*(center|right|justify|left)/i.exec(style)
  return (m?.[1]?.toLowerCase() as Align) ?? 'left'
}

function parseSpaceAfter(style: string | null): number {
  if (!style) return 0
  const m = /margin-bottom\s*:\s*([\d.]+)pt/i.exec(style)
  return m ? Number(m[1]) : 0
}

function parseDataStyle(el: Element): ParaStyle {
  const ds = el.getAttribute('data-style')
  if (ds === 'title' || ds === 'subtitle') return ds
  const tag = el.tagName.toLowerCase()
  if (tag === 'h1') return 'h1'
  if (tag === 'h2') return 'h2'
  if (tag === 'h3') return 'h3'
  return 'normal'
}

function walkRuns(node: Node, base: Omit<Run, 'text'>, out: Run[]): void {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? ''
    if (text) out.push({ ...base, text, direct: { ...base.direct } })
    return
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return
  const el = node as HTMLElement
  const tag = el.tagName.toLowerCase()
  if (tag === 'br') {
    out.push({ ...base, text: '\n', direct: { ...base.direct } })
    return
  }

  const next = { ...base, direct: { ...base.direct } }
  if (tag === 'strong' || tag === 'b') {
    next.bold = true
    next.direct.bold = true
  }
  if (tag === 'em' || tag === 'i') next.italic = true
  if (tag === 'u') next.underline = true
  if (tag === 'sup') next.superscript = true
  if (tag === 'sub') next.subscript = true
  if (tag === 'a') next.link = el.getAttribute('href') ?? undefined

  if (tag === 'span') {
    const style = (el.getAttribute('style') ?? '').replace(/&quot;/g, '"')
    const ff = /font-family\s*:\s*([^;]+)/i.exec(style)
    if (ff) {
      next.fontFamily = ff[1].trim().replace(/^['"]|['"]$/g, '')
      next.direct.fontFamily = true
    }
    const fs = /font-size\s*:\s*([\d.]+)pt/i.exec(style)
    if (fs) {
      next.fontSize = Number(fs[1])
      next.direct.fontSize = true
    }
    const color = /(?:^|;)\s*color\s*:\s*([^;]+)/i.exec(style)
    if (color) next.color = color[1].trim()
    const bg = /background-color\s*:\s*([^;]+)/i.exec(style)
    if (bg) next.highlight = bg[1].trim()
  }

  for (const child of Array.from(el.childNodes)) walkRuns(child, next, out)
}

function paragraphFromElement(
  el: Element,
  list?: Paragraph['list'],
): Paragraph {
  const style = parseDataStyle(el)
  const styleAttr = el.getAttribute('style')
  const accept = el.getAttribute('data-accept')
  const runs: Run[] = []
  const base = emptyRun({ fontSize: STYLE_SIZES[style] })
  for (const child of Array.from(el.childNodes)) walkRuns(child, base, runs)
  if (runs.length === 0) runs.push(emptyRun({ fontSize: STYLE_SIZES[style] }))

  return {
    style,
    align: parseAlign(styleAttr),
    list,
    spaceAfterPt: parseSpaceAfter(styleAttr),
    acceptStyles: accept
      ? (accept.split(',').map((s) => s.trim()) as ParaStyle[])
      : undefined,
    runs,
  }
}

function collectListItems(
  listEl: Element,
  type: 'bullet' | 'ordered',
  level: number,
  out: Paragraph[],
): void {
  for (const child of Array.from(listEl.children)) {
    if (child.tagName.toLowerCase() !== 'li') continue
    const nested: Element[] = []
    const clone = child.cloneNode(true) as Element
    for (const n of Array.from(clone.children)) {
      const t = n.tagName.toLowerCase()
      if (t === 'ul' || t === 'ol') {
        nested.push(n)
        n.remove()
      }
    }
    const wrapper = document.createElement('p')
    while (clone.firstChild) wrapper.appendChild(clone.firstChild)
    out.push(paragraphFromElement(wrapper, { type, level }))
    for (const n of nested) {
      const nt = n.tagName.toLowerCase() === 'ol' ? 'ordered' : 'bullet'
      collectListItems(n, nt, level + 1, out)
    }
  }
}

export function parseHtmlSource(content: string): DocModel {
  const expanded = expandNbspTilde(content)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')

  const doc = new DOMParser().parseFromString(
    `<div id="root">${expanded}</div>`,
    'text/html',
  )
  const root = doc.getElementById('root')
  if (!root) return { paragraphs: [] }

  const paragraphs: Paragraph[] = []
  for (const child of Array.from(root.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      const t = child.textContent ?? ''
      if (t.trim()) paragraphs.push(paraFromText(t))
      continue
    }
    if (child.nodeType !== Node.ELEMENT_NODE) continue
    const el = child as Element
    const tag = el.tagName.toLowerCase()
    if (tag === 'ul') collectListItems(el, 'bullet', 0, paragraphs)
    else if (tag === 'ol') collectListItems(el, 'ordered', 0, paragraphs)
    else paragraphs.push(paragraphFromElement(el))
  }
  return { paragraphs }
}

export function parseDocSource(source: DocSource): DocModel {
  return source.format === 'html'
    ? parseHtmlSource(source.content)
    : parseTextSource(source.content)
}

export function docToPlainLines(doc: DocModel): string[] {
  return doc.paragraphs.map((p) => p.runs.map((r) => r.text).join(''))
}

export function docToPlainText(doc: DocModel): string {
  return docToPlainLines(doc).join('\n')
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** Catalog HTML → TipTap HTML (title/subtitle as marked headings). */
export function htmlNotationToEditorHtml(html: string): string {
  return (
    expandNbspTilde(html)
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(
        /<p([^>]*)\bdata-style="title"([^>]*)>([\s\S]*?)<\/p>/gi,
        '<h1 data-para-style="title"$1$2>$3</h1>',
      )
      .replace(
        /<p([^>]*)\bdata-style="subtitle"([^>]*)>([\s\S]*?)<\/p>/gi,
        '<h2 data-para-style="subtitle"$1$2>$3</h2>',
      )
      .replace(/<h1(\b[^>]*)>/gi, (full, attrs: string) =>
        attrs.includes('data-para-style')
          ? full
          : `<h1 data-para-style="h1"${attrs}>`,
      )
      .replace(/<h2(\b[^>]*)>/gi, (full, attrs: string) =>
        attrs.includes('data-para-style')
          ? full
          : `<h2 data-para-style="h2"${attrs}>`,
      )
      .replace(/<h3(\b[^>]*)>/gi, (full, attrs: string) =>
        attrs.includes('data-para-style')
          ? full
          : `<h3 data-para-style="h3"${attrs}>`,
      ) || '<p></p>'
  )
}

export function sourceToEditorHtml(source?: DocSource): string {
  if (!source) return '<p></p>'
  if (source.format === 'text') {
    const lines = expandNbspTilde(source.content)
      .replace(/\r\n/g, '\n')
      .split('\n')
    return lines.map((line) => `<p>${escapeHtml(line) || '<br>'}</p>`).join('')
  }
  return htmlNotationToEditorHtml(source.content)
}

/** TipTap HTML → DocModel */
export function editorHtmlToDocModel(html: string): DocModel {
  const normalized = html
    .replace(
      /<h1([^>]*)\bdata-para-style="title"([^>]*)>([\s\S]*?)<\/h1>/gi,
      '<p data-style="title"$1$2>$3</p>',
    )
    .replace(
      /<h2([^>]*)\bdata-para-style="subtitle"([^>]*)>([\s\S]*?)<\/h2>/gi,
      '<p data-style="subtitle"$1$2>$3</p>',
    )
    .replace(
      /<h1([^>]*)\bdata-para-style="h1"([^>]*)>([\s\S]*?)<\/h1>/gi,
      '<h1$1$2>$3</h1>',
    )
    .replace(
      /<h2([^>]*)\bdata-para-style="h2"([^>]*)>([\s\S]*?)<\/h2>/gi,
      '<h2$1$2>$3</h2>',
    )
    .replace(
      /<h3([^>]*)\bdata-para-style="h3"([^>]*)>([\s\S]*?)<\/h3>/gi,
      '<h3$1$2>$3</h3>',
    )
    .replace(/\sdata-para-style="[^"]*"/gi, '')
  return parseHtmlSource(normalized)
}
