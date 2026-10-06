import type { CategoryDefinition, TaskDefinition } from '../levels/types'
import { fillInstructions } from '../checks/evaluate'
import { isLevelCompleted } from '../progress'

type LevelSelectProps = {
  categories: CategoryDefinition[]
  onSelect: (levelId: string) => void
  onOpenRace: () => void
  onOpenAsteroids: () => void
  onOpenVsemiDeseti: () => void
}

function LevelButton({
  level,
  onSelect,
}: {
  level: TaskDefinition
  onSelect: (levelId: string) => void
}) {
  const completed = isLevelCompleted(level.id)
  const preparing = !level.ready

  return (
    <li>
      <button
        type="button"
        className={`level-item${completed ? ' is-completed' : ''}${preparing ? ' is-preparing' : ''}`}
        onClick={() => {
          if (!preparing) onSelect(level.id)
        }}
        disabled={preparing}
      >
        <span className="level-item-top">
          <span className="level-item-title">
            {level.id}: {level.title}
          </span>
          {completed ? (
            <span className="level-check" aria-label="hotovo" title="Hotovo">
              ✓
            </span>
          ) : null}
        </span>
        <span className="level-item-assignment">
          {preparing
            ? 'Tuto úlohu ještě připravujeme.'
            : fillInstructions(level)}
        </span>
      </button>
    </li>
  )
}

export function LevelSelect({
  categories,
  onSelect,
  onOpenRace,
  onOpenAsteroids,
  onOpenVsemiDeseti,
}: LevelSelectProps) {
  return (
    <main className="page page-select">
      <header className="page-header">
        <h1>Typografie</h1>
        <p>Vyber úlohu nebo minihru.</p>
      </header>

      <section className="minihry-home-section" aria-labelledby="minihry-heading">
        <h2 id="minihry-heading" className="category-title">
          Minihry
        </h2>
        <p className="minihry-home-lead">
          Vždy přístupné – nezávisí na postupu v kategoriích.
        </p>
        <div className="minihry-hub-actions">
          <button type="button" className="minihry-diff-btn" onClick={onOpenRace}>
            Typografický závod
          </button>
          <button
            type="button"
            className="minihry-diff-btn"
            onClick={onOpenAsteroids}
          >
            Typografické asteroidy
          </button>
          <button
            type="button"
            className="minihry-diff-btn"
            onClick={onOpenVsemiDeseti}
          >
            Všemi deseti
          </button>
        </div>
      </section>

      <div className="category-grid">
        {categories.map((category) => (
          <section key={category.id} className="category-section">
            <h2 className="category-title">{category.title}</h2>
            <ul className="level-list">
              {category.levels.map((level) => (
                <LevelButton
                  key={level.id}
                  level={level}
                  onSelect={onSelect}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
