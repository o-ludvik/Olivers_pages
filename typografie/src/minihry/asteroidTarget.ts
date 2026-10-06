import { textMatchesPrefix } from './charMatches'
import type { Difficulty } from './charMatches'

export type Targetable = {
  id: string
  text: string
  /** Lower = closer to base (higher y). */
  y: number
}

/**
 * Pick the asteroid whose label starts with `typed` (charMatches).
 * On ties, prefer the lowest (largest y).
 */
export function pickTarget(
  asteroids: Targetable[],
  typed: string,
  difficulty: Difficulty,
): Targetable | null {
  if (typed.length === 0) return null
  const matches = asteroids.filter((a) =>
    textMatchesPrefix(a.text, typed, difficulty),
  )
  if (matches.length === 0) return null
  matches.sort((a, b) => b.y - a.y)
  return matches[0]!
}

/** Would adding `char` to `typed` still be a prefix of some asteroid? */
export function wouldMatchAny(
  asteroids: Targetable[],
  typed: string,
  char: string,
  difficulty: Difficulty,
): boolean {
  const next = typed + char
  return asteroids.some((a) => textMatchesPrefix(a.text, next, difficulty))
}
