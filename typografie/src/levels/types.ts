export type CategoryId = 'typografie' | 'formatovani' | 'kombinace'
export type Mechanic =
  | 'smaz-spatne'
  | 'preved'
  | 'oprav'
  | 'prepis-z-obrazku'
  | 'lovec-chyb'
  | 'napodob'
  | 'posud'
  | 'vytvor'
export type Bloom =
  | 'zapamatovat'
  | 'porozumet'
  | 'aplikovat'
  | 'analyzovat'
  | 'hodnotit'
  | 'tvorit'

export type ParaStyle = 'normal' | 'title' | 'subtitle' | 'h1' | 'h2' | 'h3'
export type Align = 'left' | 'center' | 'right' | 'justify'

export type DocSource = { format: 'text' | 'html'; content: string }

export type TaskMedia =
  | { kind: 'textImage'; lines: string[]; caption?: string }
  | { kind: 'docPreview'; html: string; mode: 'full' | 'wireframe'; caption?: string }
  | {
      kind: 'pagesPreview'
      pages: PageSpec[]
      caption?: string
    }

export type PageSpec = {
  number: number
  blocks: Array<
    | { kind: 'heading' }
    | { kind: 'para'; lines: number; starts: boolean; ends: boolean }
  >
}

export type EditorConfig = {
  width?: 'normal' | 'narrow'
  allowPaste?: boolean
  toolbar?: 'full' | string[]
  showHiddenDefault?: boolean
  specialCharsPanel?: boolean
}

export type MatchOptions = {
  nbspMode?: 'ignore' | 'requiredOnly' | 'strict'
  dashStyle?: 'en' | 'enOrEm'
  trimLines?: boolean
  ignoreEmptyLines?: boolean
}

export type ErrorAnnotation = {
  at: string | string[]
  rule: string
}

export type FeedbackPolicy = {
  showCountUpfront?: boolean
  showCountAfterCheck?: boolean
  revealAfter?: number
  maxChecks?: number
}

export type CompareKey =
  | 'text'
  | 'style'
  | 'align'
  | 'list'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'superscript'
  | 'subscript'
  | 'link'
  | 'fontFamily'
  | 'fontSize'

export type Check =
  | { type: 'textLines' }
  | {
      type: 'docMatches'
      compare: CompareKey[]
      trailingFreeText?: { minWords: number }
    }
  | { type: 'numberSet'; expected?: number[]; values?: number[] }
  | { type: 'containsLine'; line: string }
  | { type: 'notContainsText'; text: string }
  | { type: 'require'; pattern: string; flags?: string; label: string; min?: number }
  | { type: 'minWords'; min: number; excludePattern?: string }
  | { type: 'constraint'; id: string; params?: Record<string, unknown> }
  | {
      type: 'lint'
      maxErrors: number
      treatAsErrors?: string[]
      section?: string
    }
  | { type: 'sections'; labels: string[] }
  | { type: 'custom'; id: string; params?: Record<string, unknown> }

export type TaskDefinition = {
  id: string
  categoryId: CategoryId
  order: number
  title: string
  mechanic: string
  bloom: string
  assignment: string
  instructions: string
  charHints?: string[]
  editor?: EditorConfig
  match?: MatchOptions
  prefill?: DocSource
  solution?: DocSource
  media?: TaskMedia[]
  checks: Check[]
  errors?: ErrorAnnotation[]
  /** Rule ids shown in the Pravidla panel even without errors[]. */
  rules?: string[]
  autoErrors?: 'nbsp'
  feedback?: FeedbackPolicy
  review?: 'auto' | 'auto+manual' | 'manual'
  selfChecklist?: string[]
  phase: 'A' | 'B' | 'C' | 'D'
  ready: boolean
}

export type CategoryDefinition = {
  id: CategoryId
  title: string
  order: number
  levels: TaskDefinition[]
}

export type Run = {
  text: string
  bold: boolean
  italic: boolean
  underline: boolean
  superscript: boolean
  subscript: boolean
  link?: string
  fontFamily: string
  fontSize: number
  color?: string
  highlight?: string
  direct: {
    fontFamily?: boolean
    fontSize?: boolean
    bold?: boolean
  }
}

export type Paragraph = {
  style: ParaStyle
  align: Align
  list?: { type: 'bullet' | 'ordered'; level: number }
  spaceAfterPt: number
  acceptStyles?: ParaStyle[]
  runs: Run[]
}

export type DocModel = { paragraphs: Paragraph[] }

export type CheckOutcome = {
  check: Check
  passed: boolean
  message?: string
}

/** @deprecated alias while wiring */
export type LevelDefinition = TaskDefinition
