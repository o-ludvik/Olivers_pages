import { describe, expect, it } from 'vitest'
import { ASTEROID_LABELS } from './data/asteroidLabels'
import { RACE_TEXTS } from './data/raceTexts'
import { VALID_RULE_IDS } from './rules'
import { runLinter } from '../doc/lint'

const ALLOWED_WARN_BY_ID: Record<string, string[]> = {
  'A1-18': ['cislo-procento'],
  'A2-05': ['datum-bez-mezer'],
  'A2-06': ['rozsah-spojovnikem'],
}

describe('minihry content self-test §6', () => {
  it('race IDs unique, tags valid', () => {
    const ids = RACE_TEXTS.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const t of RACE_TEXTS) {
      for (const tag of t.tags) {
        expect(VALID_RULE_IDS.has(tag), `${t.id} tag ${tag}`).toBe(true)
      }
      expect(t.text.includes('~')).toBe(false)
      expect(t.text.includes('\u00A0') || !t.text.includes('~')).toBe(true)
    }
  })

  it('asteroid IDs unique, tags valid, max 25 chars, no dup texts', () => {
    const ids = ASTEROID_LABELS.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
    const texts = ASTEROID_LABELS.map((t) => t.text)
    expect(new Set(texts).size).toBe(texts.length)
    for (const t of ASTEROID_LABELS) {
      for (const tag of t.tags) {
        expect(VALID_RULE_IDS.has(tag), `${t.id} tag ${tag}`).toBe(true)
      }
      expect([...t.text].length, t.id).toBeLessThanOrEqual(25)
      expect(t.text.includes('~')).toBe(false)
    }
  })

  it('linter finds no errors in converted texts (warn exceptions)', () => {
    for (const t of [...RACE_TEXTS, ...ASTEROID_LABELS]) {
      const findings = runLinter(t.text)
      const errors = findings.filter((f) => f.severity === 'error')
      expect(errors, `${t.id}: ${errors.map((e) => e.ruleId).join(',')}`).toEqual(
        [],
      )
      const warns = findings.filter((f) => f.severity === 'warn')
      const allowed = new Set(ALLOWED_WARN_BY_ID[t.id] ?? [])
      // NBSP rules treated as errors for content check
      const nbspAsError = warns.filter(
        (f) =>
          (f.ruleId === 'nbsp-jednopismenne' ||
            f.ruleId === 'nbsp-jednotka') &&
          !allowed.has(f.ruleId),
      )
      // Spec: NBSP rules count as errors for this check
      expect(
        nbspAsError,
        `${t.id} nbsp: ${nbspAsError.map((e) => e.message).join('; ')}`,
      ).toEqual([])

      for (const w of warns) {
        if (
          w.ruleId === 'nbsp-jednopismenne' ||
          w.ruleId === 'nbsp-jednotka' ||
          w.ruleId === 'nbsp-datum' ||
          w.ruleId === 'nbsp-titul' ||
          w.ruleId === 'nbsp-zkratka'
        ) {
          continue
        }
        if (allowed.has(w.ruleId)) continue
        // other warns should also be empty except allowed
        expect(
          allowed.has(w.ruleId),
          `${t.id} unexpected warn ${w.ruleId}: ${w.message}`,
        ).toBe(true)
      }
    }
  })
})
