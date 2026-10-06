import { useCallback, useEffect, useMemo, useState } from 'react'
import { runChecks } from '../checks/runChecks'
import { fillInstructions } from '../checks/evaluate'
import { editorHtmlToDocModel, sourceToEditorHtml } from '../doc/parse'
import { RULES } from '../levels/catalogData'
import { getNextLevel } from '../levels'
import type { CheckOutcome, TaskDefinition } from '../levels/types'
import {
  getAttempts,
  incrementAttempts,
  markLevelCompleted,
  resetAttempts,
} from '../progress'
import { CharHints } from './CharHints'
import { CheckResult } from './CheckResult'
import { DocPreview } from './DocPreview'
import { Editor } from './Editor'
import { PagesPreview } from './PagesPreview'
import { TextImage } from './TextImage'

type LevelPlayProps = {
  level: TaskDefinition
  onBack: () => void
  onGoToLevel: (levelId: string) => void
}

export function LevelPlay({ level, onBack, onGoToLevel }: LevelPlayProps) {
  const initialHtml = useMemo(
    () => sourceToEditorHtml(level.prefill),
    [level.id, level.prefill],
  )
  const [html, setHtml] = useState(initialHtml)
  const [outcomes, setOutcomes] = useState<CheckOutcome[] | null>(null)
  const [attempts, setAttempts] = useState(() => getAttempts(level.id))
  const [resetToken, setResetToken] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)

  const instructions = useMemo(() => fillInstructions(level), [level])
  const maxChecks = level.feedback?.maxChecks

  useEffect(() => {
    setHtml(initialHtml)
    setOutcomes(null)
    setAttempts(getAttempts(level.id))
    setResetToken(0)
    setFeedback(null)
  }, [level.id, initialHtml])

  const handleHtmlChange = useCallback((nextHtml: string) => {
    setHtml(nextHtml)
    setOutcomes(null)
  }, [])

  const handleReset = () => {
    resetAttempts(level.id)
    setAttempts(0)
    setHtml(initialHtml)
    setResetToken((n) => n + 1)
    setOutcomes(null)
    setFeedback(null)
  }

  const handleCheck = () => {
    if (maxChecks != null && attempts >= maxChecks) {
      setFeedback('Došly pokusy')
      return
    }
    const nextAttempts = incrementAttempts(level.id)
    setAttempts(nextAttempts)

    const nextOutcomes = runChecks(level, html)
    setOutcomes(nextOutcomes)
    const allPassed = nextOutcomes.every((o) => o.passed)

    if (allPassed) {
      markLevelCompleted(level.id)
      setFeedback('Hotovo!')
    } else {
      setFeedback(null)
    }

    if (maxChecks != null && nextAttempts >= maxChecks && !allPassed) {
      setFeedback('Došly pokusy')
    }
  }

  const handleCopyDocs = async () => {
    try {
      const plain = editorHtmlToDocModel(html)
        .paragraphs.map((p) => p.runs.map((r) => r.text).join(''))
        .join('\n')
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([plain], { type: 'text/plain' }),
        }),
      ])
      setFeedback('Zkopírováno do schránky (pro Google Docs).')
    } catch {
      setFeedback('Kopírování se nepodařilo.')
    }
  }

  const nextLevel = getNextLevel(level)

  return (
    <main className="page page-play">
      <header className="page-header">
        <button type="button" className="link-btn" onClick={onBack}>
          ← Zpět na výběr
        </button>
        <h1>
          {level.id}: {level.title}
        </h1>
        <p className="assignment">{instructions}</p>
        {level.errors?.length ? (
          <details className="rules-panel">
            <summary>Pravidla</summary>
            <ul>
              {[...new Set(level.errors.map((e) => e.rule))].map((id) => (
                <li key={id}>
                  <strong>{RULES[id]?.title ?? id}:</strong>{' '}
                  {RULES[id]?.short}
                </li>
              ))}
            </ul>
          </details>
        ) : null}
        {level.charHints?.length ? (
          <CharHints chars={level.charHints} />
        ) : null}
      </header>

      {level.media?.map((m, i) => {
        if (m.kind === 'textImage')
          return <TextImage key={i} lines={m.lines} caption={m.caption} />
        if (m.kind === 'docPreview')
          return (
            <DocPreview
              key={i}
              html={m.html}
              mode={m.mode}
              caption={m.caption}
            />
          )
        if (m.kind === 'pagesPreview')
          return (
            <PagesPreview key={i} pages={m.pages} caption={m.caption} />
          )
        return null
      })}

      <Editor
        key={level.id}
        initialHtml={initialHtml}
        resetToken={resetToken}
        config={level.editor}
        onHtmlChange={handleHtmlChange}
      />

      <div className="play-actions">
        <button type="button" className="primary-btn" onClick={handleCheck}>
          Zkontrolovat
          {maxChecks != null ? ` (${attempts}/${maxChecks})` : ''}
        </button>
        <button type="button" className="secondary-btn" onClick={handleReset}>
          Začít znovu
        </button>
        <button type="button" className="secondary-btn" onClick={handleCopyDocs}>
          Kopírovat do Google Docs
        </button>
        {nextLevel ? (
          <button
            type="button"
            className="secondary-btn"
            onClick={() => onGoToLevel(nextLevel.id)}
          >
            Další úloha →
          </button>
        ) : null}
      </div>

      {feedback ? <p className="check-feedback">{feedback}</p> : null}
      <CheckResult outcomes={outcomes} />
    </main>
  )
}
