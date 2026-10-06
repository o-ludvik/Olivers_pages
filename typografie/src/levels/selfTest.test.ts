import { describe, expect, it } from 'vitest'
import { runTaskChecks } from '../checks/evaluate'
import { expandAlternatives } from '../doc/matchText'
import {
  docToPlainText,
  parseDocSource,
  parseTextSource,
} from '../doc/parse'
import { levels } from './index'
import type { TaskDefinition } from './types'

function withSolutionContent(
  task: TaskDefinition,
  content: string,
): TaskDefinition {
  if (!task.solution) return task
  return {
    ...task,
    solution: { ...task.solution, content },
  }
}

function atInText(text: string, at: string): boolean {
  if (text.includes(at)) return true
  const norm = (s: string) => s.replace(/\u00A0/g, ' ')
  return norm(text).includes(norm(at))
}

describe('F19 self-test', () => {
  for (const task of levels) {
    it(`${task.id} prefill/solution parse and solution passes checks`, () => {
      if (task.prefill) {
        expect(() => parseDocSource(task.prefill!)).not.toThrow()
      }
      if (!task.solution) {
        return
      }

      expect(() => parseDocSource(task.solution!)).not.toThrow()

      const baseContent = task.solution.content
      const variants = expandAlternatives(baseContent).slice(0, 12)

      for (const content of variants) {
        const student =
          task.solution.format === 'text'
            ? parseTextSource(content)
            : parseDocSource({ format: 'html', content })
        const outcomes = runTaskChecks({
          task: withSolutionContent(task, content),
          student,
          studentHtml: '<p></p>',
        })
        const failed = outcomes.filter((o) => !o.passed)
        expect(failed, failed.map((f) => f.message).join('; ')).toEqual([])
      }

      if (task.prefill && task.mechanic !== 'vytvor') {
        const student = parseDocSource(task.prefill)
        const outcomes = runTaskChecks({
          task,
          student,
          studentHtml: '<p></p>',
        })
        if (task.checks.length > 0) {
          expect(outcomes.some((o) => !o.passed)).toBe(true)
        }
      }

      if (task.errors?.length) {
        const solVariants = variants.map((content) =>
          docToPlainText(
            task.solution!.format === 'text'
              ? parseTextSource(content)
              : parseDocSource({ format: 'html', content }),
          ),
        )
        const pref = task.prefill
          ? docToPlainText(parseDocSource(task.prefill))
          : ''
        for (const err of task.errors) {
          const variantsAt = Array.isArray(err.at) ? err.at : [err.at]
          const inSol = variantsAt.some((at) =>
            solVariants.some((sol) => atInText(sol, at)),
          )
          expect(inSol, `errors.at missing in solution for ${task.id}`).toBe(
            true,
          )
          const inPrefill = variantsAt.some((at) => atInText(pref, at))
          // Catalog data bug if true — report, don't fail the suite hard
          if (inPrefill) {
            console.warn(
              `[F19] ${task.id}: errors.at also appears in prefill (catalog data)`,
            )
          }
        }
      }
    })
  }
})
