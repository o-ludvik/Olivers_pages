import type { Check, CheckOutcome } from '../levels/types'
import { evaluateCheck } from './registry'

export function runChecks(checks: Check[], html: string): CheckOutcome[] {
  return checks.map((check) => ({
    check,
    passed: evaluateCheck(check, html),
  }))
}
