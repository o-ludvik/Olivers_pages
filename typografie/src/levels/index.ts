import level01Bold from './level-01-bold'
import level02Date from './level-02-date'
import level03TitlePhone from './level-03-title-phone'
import type { LevelDefinition } from './types'
import { isLevelCompleted } from '../progress'

export const levels: LevelDefinition[] = [
  level01Bold,
  level02Date,
  level03TitlePhone,
].sort((a, b) => a.order - b.order)

export function getLevelById(id: string): LevelDefinition | undefined {
  return levels.find((level) => level.id === id)
}

export function getNextLevel(
  level: LevelDefinition,
): LevelDefinition | undefined {
  return levels.find((candidate) => candidate.order === level.order + 1)
}

export function getPreviousLevel(
  level: LevelDefinition,
): LevelDefinition | undefined {
  return levels.find((candidate) => candidate.order === level.order - 1)
}

export function isLevelUnlocked(level: LevelDefinition): boolean {
  const previous = getPreviousLevel(level)
  if (!previous) return true
  return isLevelCompleted(previous.id)
}
