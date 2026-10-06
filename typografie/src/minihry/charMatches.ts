export type Difficulty = 'lehka' | 'stredni' | 'tezka'

const NBSP = '\u00A0'
const SPACE = ' '
const MINUS = '\u2212'
const HYPHEN = '-'

/** Compare one expected char to what the player typed (§1.4). */
export function charMatches(
  expected: string,
  typed: string,
  difficulty: Difficulty,
): boolean {
  if (expected === typed) return true

  if (expected === NBSP) {
    if (difficulty === 'tezka') return typed === NBSP
    return typed === NBSP || typed === SPACE
  }

  if (expected === SPACE) {
    return typed === SPACE || typed === NBSP
  }

  if (expected === MINUS) {
    return typed === MINUS || typed === HYPHEN
  }

  return false
}

/** Prefix match using charMatches for each position. */
export function textMatchesPrefix(
  expected: string,
  typed: string,
  difficulty: Difficulty,
): boolean {
  if (typed.length > expected.length) return false
  for (let i = 0; i < typed.length; i++) {
    if (!charMatches(expected[i]!, typed[i]!, difficulty)) return false
  }
  return true
}

/** Full string match. */
export function textMatches(
  expected: string,
  typed: string,
  difficulty: Difficulty,
): boolean {
  if (typed.length !== expected.length) return false
  return textMatchesPrefix(expected, typed, difficulty)
}
