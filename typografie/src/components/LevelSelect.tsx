import type { LevelDefinition } from '../levels/types'
import { isLevelCompleted } from '../progress'
import { getPreviousLevel, isLevelUnlocked } from '../levels'

type LevelSelectProps = {
  levels: LevelDefinition[]
  onSelect: (levelId: string) => void
}

export function LevelSelect({ levels, onSelect }: LevelSelectProps) {
  return (
    <main className="page page-select">
      <header className="page-header">
        <h1>Typografie</h1>
        <p>Vyber level a uprav text podle zadání.</p>
      </header>

      <ul className="level-list">
        {levels.map((level) => {
          const unlocked = isLevelUnlocked(level)
          const completed = isLevelCompleted(level.id)
          const previous = getPreviousLevel(level)

          return (
            <li key={level.id}>
              <button
                type="button"
                className={`level-item${unlocked ? '' : ' is-locked'}${completed ? ' is-completed' : ''}`}
                onClick={() => {
                  if (unlocked) onSelect(level.id)
                }}
                disabled={!unlocked}
                aria-disabled={!unlocked}
              >
                <span className="level-item-title">
                  Level {level.order}: {level.title}
                  {completed ? ' — hotovo' : ''}
                  {!unlocked ? ' — zamčeno' : ''}
                </span>
                <span className="level-item-assignment">
                  {unlocked
                    ? level.assignment
                    : `Nejdřív dokonči level ${previous?.order ?? level.order - 1}.`}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
