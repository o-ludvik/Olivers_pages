import { rawCatalog, type RawTask } from './catalogData'
import type {
  CategoryDefinition,
  CategoryId,
  Check,
  TaskDefinition,
} from './types'
const CATEGORY_META: Record<
  CategoryId,
  { title: string; order: number }
> = {
  typografie: { title: 'Typografie', order: 1 },
  formatovani: { title: 'Formátování', order: 2 },
  kombinace: { title: 'Kombinace', order: 3 },
}

/** Flip as phases ship; all true once A–D complete. */
const IMPLEMENTED_PHASES = new Set(['A', 'B', 'C', 'D'])

function normalizeCheck(raw: Record<string, unknown>): Check {
  if (raw.type === 'constraint') {
    const { type: _type, id, params, ...rest } = raw
    return {
      type: 'constraint',
      id: String(id),
      params: { ...((params as Record<string, unknown>) ?? {}), ...rest },
    }
  }
  if (raw.type === 'numberSet') {
    const expected =
      (raw.expected as number[] | undefined) ??
      (raw.values as number[] | undefined) ??
      []
    return { type: 'numberSet', expected, values: expected }
  }
  return raw as Check
}

function toTask(raw: RawTask): TaskDefinition {
  const ready = IMPLEMENTED_PHASES.has(raw.phase)
  return {
    id: raw.id,
    categoryId: raw.category,
    order: raw.level,
    title: raw.title,
    mechanic: raw.mechanic,
    bloom: raw.bloom,
    assignment: raw.instructions,
    instructions: raw.instructions,
    charHints: raw.charHints,
    editor: raw.editor,
    match: raw.match,
    prefill: raw.prefill,
    solution: raw.solution,
    media: raw.media as TaskDefinition['media'],
    checks: raw.checks.map((c) => normalizeCheck(c)),
    errors: raw.errors,
    rules: raw.rules,
    autoErrors: raw.autoErrors,
    feedback: raw.feedback as TaskDefinition['feedback'],
    review: raw.review,
    selfChecklist: raw.selfChecklist,
    phase: raw.phase,
    ready,
  }
}

export const levels: TaskDefinition[] = rawCatalog
  .map(toTask)
  .sort((a, b) => {
    const co =
      CATEGORY_META[a.categoryId].order - CATEGORY_META[b.categoryId].order
    return co !== 0 ? co : a.order - b.order
  })

export const categories: CategoryDefinition[] = (
  Object.keys(CATEGORY_META) as CategoryId[]
)
  .sort((a, b) => CATEGORY_META[a].order - CATEGORY_META[b].order)
  .map((id) => ({
    id,
    title: CATEGORY_META[id].title,
    order: CATEGORY_META[id].order,
    levels: levels.filter((l) => l.categoryId === id),
  }))

export function getLevelById(id: string): TaskDefinition | undefined {
  return levels.find((level) => level.id === id)
}

export function getNextLevel(
  level: TaskDefinition,
): TaskDefinition | undefined {
  return levels.find(
    (c) => c.categoryId === level.categoryId && c.order === level.order + 1,
  )
}

export type { TaskDefinition, CategoryDefinition }
