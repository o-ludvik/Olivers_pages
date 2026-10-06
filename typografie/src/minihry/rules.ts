import { RULES } from '../levels/catalogData'
import { getLevelById } from '../levels'

/** Rule id → practice task from minihry §1.8 */
export const RULE_PRACTICE: Record<string, string> = {
  interpunkce: 'TYP-02',
  vypustka: 'TYP-05',
  uvozovky: 'TYP-04',
  zavorky: 'TYP-03',
  datum: 'TYP-07',
  cas: 'TYP-07',
  lomitko: 'TYP-03',
  jednotky: 'TYP-08',
  mena: 'TYP-09',
  matematika: 'TYP-10',
  cisla: 'TYP-10',
  pomlcka: 'TYP-06',
  spojovnik: 'TYP-06',
  zalomeni: 'TYP-14',
  tituly: 'TYP-13',
  firmy: 'TYP-13',
  zkratky: 'TYP-12',
  cislovky: 'TYP-11',
}

export const VALID_RULE_IDS = new Set(Object.keys(RULE_PRACTICE))

export function ruleShortHint(ruleId: string): string {
  return RULES[ruleId]?.short ?? RULE_PRACTICE[ruleId] ?? ruleId
}

export function practiceLink(ruleId: string): string | null {
  const taskId = RULE_PRACTICE[ruleId]
  if (!taskId) return null
  if (!getLevelById(taskId)) return null
  return taskId
}
