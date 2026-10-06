import type { LayoutVariant } from './layout'

export type LessonId = number | 'weak'

export type Lesson = {
  id: LessonId
  number: number
  title: string
  /** Newly introduced characters this lesson (cs-QWERTZ base). */
  newChars: string[]
  optional?: boolean
  isFull?: boolean
  isWeak?: boolean
}

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export const LESSONS: Lesson[] = [
  { id: 1, number: 1, title: 'Základní pozice: ukazováčky', newChars: ['f', 'j'] },
  { id: 2, number: 2, title: 'Prostředníčky', newChars: ['d', 'k'] },
  { id: 3, number: 3, title: 'Prsteníčky', newChars: ['s', 'l'] },
  { id: 4, number: 4, title: 'Malíčky', newChars: ['a', 'ů'] },
  { id: 5, number: 5, title: 'Ukazováčky do středu', newChars: ['g', 'h'] },
  { id: 6, number: 6, title: 'Horní řada – levá ruka', newChars: ['q', 'w', 'e', 'r', 't'] },
  {
    id: 7,
    number: 7,
    title: 'Horní řada – pravá ruka',
    newChars: ['z', 'u', 'i', 'o', 'p', 'ú'],
  },
  {
    id: 8,
    number: 8,
    title: 'Dolní řada',
    newChars: ['y', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '-'],
  },
  {
    id: 9,
    number: 9,
    title: 'Háčky a čárky',
    newChars: ['ě', 'š', 'č', 'ř', 'ž', 'ý', 'á', 'í', 'é'],
  },
  { id: 10, number: 10, title: 'Velká písmena', newChars: UPPER },
  {
    id: 11,
    number: 11,
    title: 'Číslice',
    newChars: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    optional: true,
  },
  { id: 12, number: 12, title: 'Celá klávesnice', newChars: [], isFull: true },
  {
    id: 'weak',
    number: 13,
    title: 'Moje slabé klávesy',
    newChars: [],
    optional: true,
    isWeak: true,
  },
]

export function getLesson(id: LessonId): Lesson | undefined {
  return LESSONS.find((l) => l.id === id)
}

/**
 * Remap lesson chars for layout: on QWERTY, Y/Z swap so lesson 7 (right top)
 * teaches y… and lesson 8 (bottom) teaches z….
 */
export function charsForLayout(
  chars: string[],
  variant: LayoutVariant = 'cs-QWERTZ',
): string[] {
  if (variant !== 'cs-QWERTY') return [...chars]
  return chars.map((ch) => {
    if (ch === 'z') return 'y'
    if (ch === 'Z') return 'Y'
    if (ch === 'y') return 'z'
    if (ch === 'Y') return 'Z'
    return ch
  })
}

export function charsForLesson(
  lessonId: LessonId,
  opts: {
    includeDigits?: boolean
    weakChars?: string[]
    variant?: LayoutVariant
  } = {},
): { all: string[]; neu: string[] } {
  const variant = opts.variant ?? 'cs-QWERTZ'
  const lesson = getLesson(lessonId)
  if (!lesson) return { all: [], neu: [] }

  if (lesson.isWeak) {
    const weak = opts.weakChars ?? []
    return { all: weak, neu: weak }
  }

  if (lesson.isFull) {
    const all: string[] = []
    for (const l of LESSONS) {
      if (typeof l.id !== 'number' || l.id > 10) continue
      if (l.id === 11) continue
      for (const ch of charsForLayout(l.newChars, variant)) {
        if (!all.includes(ch)) all.push(ch)
      }
    }
    if (opts.includeDigits) {
      for (const ch of getLesson(11)!.newChars) {
        if (!all.includes(ch)) all.push(ch)
      }
    }
    return { all, neu: [] }
  }

  const all: string[] = []
  const neu = charsForLayout(lesson.newChars, variant)
  for (const l of LESSONS) {
    if (typeof l.id !== 'number') continue
    if (l.id > (lesson.id as number)) break
    if (l.id === 11 && lesson.id !== 11) continue
    for (const ch of charsForLayout(l.newChars, variant)) {
      if (!all.includes(ch)) all.push(ch)
    }
  }
  return { all, neu }
}

export function pickFallingChar(
  lessonId: LessonId,
  opts: {
    includeDigits?: boolean
    weakChars?: string[]
    exclude?: string[]
    weights?: Map<string, number>
    variant?: LayoutVariant
  } = {},
): string | null {
  const { all, neu } = charsForLesson(lessonId, opts)
  const exclude = new Set(opts.exclude ?? [])
  const prev = all.filter((c) => !neu.includes(c))

  const poolNew = neu.filter((c) => !exclude.has(c))
  const poolPrev = prev.filter((c) => !exclude.has(c))
  const poolAll = all.filter((c) => !exclude.has(c))
  if (poolAll.length === 0) return null

  const useNew =
    poolNew.length > 0 && (poolPrev.length === 0 || Math.random() < 0.5)
  const pool = useNew ? poolNew : poolPrev.length > 0 ? poolPrev : poolAll

  if (opts.weights && opts.weights.size > 0) {
    let total = 0
    const weighted = pool.map((ch) => {
      const w = opts.weights!.get(ch) ?? 1
      total += w
      return { ch, w }
    })
    let r = Math.random() * total
    for (const { ch, w } of weighted) {
      r -= w
      if (r <= 0) return ch
    }
    return weighted[weighted.length - 1]?.ch ?? null
  }

  return pool[Math.floor(Math.random() * pool.length)] ?? null
}

export function lessonIntroText(
  lesson: Lesson,
  variant: LayoutVariant = 'cs-QWERTZ',
): string {
  if (lesson.isWeak) {
    return 'Procvič klávesy, ve kterých nejčastěji chybuješ.'
  }
  if (lesson.isFull) {
    return 'Celá klávesnice z lekcí 1–10. Číslice zapneš v nastavení.'
  }
  if (lesson.id === 10) {
    return 'Velká písmena: drž Shift druhou rukou. Ukazováčky drž na F a J (mají výstupek).'
  }
  if (lesson.id === 11) {
    return 'Číslice na české klávesnici: Shift + číselná řada.'
  }
  const listed = charsForLayout(lesson.newChars, variant).join(', ')
  const qwerty =
    variant === 'cs-QWERTY' && (lesson.id === 7 || lesson.id === 8)
      ? ' (QWERTY: Y a Z jsou prohozené.)'
      : ''
  return `Nová písmena: ${listed}.${qwerty} Ukazováčky drž na F a J (mají výstupek).`
}
