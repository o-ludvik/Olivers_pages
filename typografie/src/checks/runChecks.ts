import type { CheckOutcome, TaskDefinition } from '../levels/types'
import { editorHtmlToDocModel } from '../doc/parse'
import { runTaskChecks } from './evaluate'

export function runChecks(
  task: TaskDefinition,
  html: string,
): CheckOutcome[] {
  const student = editorHtmlToDocModel(html)
  return runTaskChecks({ task, student, studentHtml: html })
}
