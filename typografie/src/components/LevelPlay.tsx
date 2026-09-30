import { useCallback, useEffect, useState } from 'react'
import { runChecks } from '../checks/runChecks'
import { getNextLevel } from '../levels'
import type { CheckOutcome, LevelDefinition } from '../levels/types'
import { isLevelCompleted, markLevelCompleted } from '../progress'
import { CheckResult } from './CheckResult'
import { Editor } from './Editor'

type LevelPlayProps = {
  level: LevelDefinition
  onBack: () => void
  onGoToLevel: (levelId: string) => void
}

export function LevelPlay({ level, onBack, onGoToLevel }: LevelPlayProps) {
  const [html, setHtml] = useState(level.initialHtml)
  const [outcomes, setOutcomes] = useState<CheckOutcome[] | null>(null)
  const [completed, setCompleted] = useState(() => isLevelCompleted(level.id))

  useEffect(() => {
    setHtml(level.initialHtml)
    setOutcomes(null)
    setCompleted(isLevelCompleted(level.id))
  }, [level.id, level.initialHtml])

  const handleHtmlChange = useCallback((nextHtml: string) => {
    setHtml(nextHtml)
    setOutcomes(null)
  }, [])

  const handleCheck = () => {
    const nextOutcomes = runChecks(level.checks, html)
    setOutcomes(nextOutcomes)

    if (nextOutcomes.every((outcome) => outcome.passed)) {
      markLevelCompleted(level.id)
      setCompleted(true)
    }
  }

  const nextLevel = getNextLevel(level)
  const showNextButton = completed && Boolean(nextLevel)

  return (
    <main className="page page-play">
      <header className="page-header">
        <button type="button" className="link-btn" onClick={onBack}>
          ← Zpět na výběr
        </button>
        <h1>
          Level {level.order}: {level.title}
        </h1>
        <p className="assignment">{level.assignment}</p>
      </header>

      <Editor
        key={level.id}
        initialHtml={level.initialHtml}
        onHtmlChange={handleHtmlChange}
      />

      <div className="play-actions">
        <button type="button" className="primary-btn" onClick={handleCheck}>
          Zkontrolovat
        </button>
        {showNextButton && nextLevel ? (
          <button
            type="button"
            className="secondary-btn"
            onClick={() => onGoToLevel(nextLevel.id)}
          >
            Další level →
          </button>
        ) : null}
      </div>

      <CheckResult outcomes={outcomes} />
    </main>
  )
}
