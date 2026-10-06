import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  countRemainingErrors,
  fillInstructions,
  formatErrorCount,
} from '../checks/evaluate'
import { runChecks } from '../checks/runChecks'
import { editorHtmlToDocModel, sourceToEditorHtml } from '../doc/parse'
import { RULES } from '../levels/catalogData'
import { getNextLevel } from '../levels'
import type { CheckOutcome, TaskDefinition } from '../levels/types'
import {
  getAttempts,
  incrementAttempts,
  isLevelCompleted,
  isSubmitted,
  markLevelCompleted,
  markSubmitted,
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
  const [showSolution, setShowSolution] = useState(false)
  const [checklist, setChecklist] = useState<Record<string, boolean>>({})

  const instructions = useMemo(() => fillInstructions(level), [level])
  const maxChecks = level.feedback?.maxChecks
  const revealAfter = level.feedback?.revealAfter
  const needsSubmit =
    level.review === 'manual' || level.review === 'auto+manual'
  const completed =
    isLevelCompleted(level.id) || isSubmitted(level.id)

  const ruleIds = useMemo(() => {
    const fromErrors = (level.errors ?? []).map((e) => e.rule)
    const fromRules = level.rules ?? []
    return [...new Set([...fromRules, ...fromErrors])]
  }, [level.errors, level.rules])

  useEffect(() => {
    setHtml(initialHtml)
    setOutcomes(null)
    setAttempts(getAttempts(level.id))
    setResetToken(0)
    setFeedback(null)
    setShowSolution(false)
    setChecklist({})
  }, [level.id, initialHtml])

  const handleHtmlChange = useCallback((nextHtml: string) => {
    setHtml(nextHtml)
    setOutcomes(null)
  }, [])

  const handleReset = () => {
    // Do not reset attempts — limit must stay (TYP-18).
    setHtml(initialHtml)
    setResetToken((n) => n + 1)
    setOutcomes(null)
    setFeedback(null)
    setShowSolution(false)
  }

  const handleCheck = () => {
    if (maxChecks != null && attempts >= maxChecks) {
      setFeedback('Došly pokusy')
      return
    }
    const nextAttempts = incrementAttempts(level.id)
    setAttempts(nextAttempts)

    const student = editorHtmlToDocModel(html)
    const nextOutcomes = runChecks(level, html)
    const allPassed = nextOutcomes.every((o) => o.passed)
    const remaining = countRemainingErrors(level, student)

    const hideLocations =
      revealAfter != null &&
      nextAttempts < revealAfter &&
      level.feedback?.showCountUpfront === false

    if (hideLocations && !allPassed) {
      setOutcomes(null)
      setFeedback(`Zbývá ${formatErrorCount(remaining)}.`)
    } else {
      setOutcomes(nextOutcomes)
      if (allPassed) {
        if (level.review !== 'manual') {
          markLevelCompleted(level.id)
        }
        setFeedback(
          needsSubmit && level.review === 'manual'
            ? 'Kontroly prošly — ještě odešli odpověď.'
            : 'Hotovo!',
        )
      } else if (remaining > 0 && level.feedback?.showCountUpfront === false) {
        setFeedback(`Zbývá ${formatErrorCount(remaining)}.`)
      } else {
        setFeedback(null)
      }
    }

    if (maxChecks != null && nextAttempts >= maxChecks && !allPassed) {
      setFeedback('Došly pokusy')
    }
  }

  const handleSubmit = () => {
    const plain = editorHtmlToDocModel(html)
      .paragraphs.map((p) => p.runs.map((r) => r.text).join(''))
      .join('\n')
    const checked = (level.selfChecklist ?? []).filter((c) => checklist[c])
    markSubmitted({
      taskId: level.id,
      plainText: plain,
      html,
      checklist: checked.length ? checked : undefined,
      at: new Date().toISOString(),
    })
    setFeedback('Odesláno.')
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
  const attemptsExhausted =
    maxChecks != null && attempts >= maxChecks && !completed
  const solutionHtml = useMemo(
    () => (level.solution ? sourceToEditorHtml(level.solution) : null),
    [level.solution],
  )

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
        {ruleIds.length ? (
          <details className="rules-panel">
            <summary>Pravidla</summary>
            <ul>
              {ruleIds.map((id) => (
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
        {nextLevel && completed ? (
          <button
            type="button"
            className="secondary-btn"
            onClick={() => onGoToLevel(nextLevel.id)}
          >
            Další úloha →
          </button>
        ) : null}
      </div>

      {needsSubmit ? (
        <div className="submit-panel">
          {level.selfChecklist?.length ? (
            <ul className="submit-checklist">
              {level.selfChecklist.map((item) => (
                <li key={item}>
                  <label>
                    <input
                      type="checkbox"
                      checked={Boolean(checklist[item])}
                      onChange={(e) =>
                        setChecklist((c) => ({
                          ...c,
                          [item]: e.target.checked,
                        }))
                      }
                    />{' '}
                    {item}
                  </label>
                </li>
              ))}
            </ul>
          ) : null}
          <button type="button" className="primary-btn" onClick={handleSubmit}>
            Odeslat učiteli
          </button>
        </div>
      ) : null}

      {attemptsExhausted ? (
        <div className="attempts-exhausted">
          <p>Došly pokusy. Můžeš se vrátit na výběr, nebo si zobrazit řešení.</p>
          <button type="button" className="secondary-btn" onClick={onBack}>
            Zpět na výběr
          </button>
          {solutionHtml ? (
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setShowSolution(true)}
            >
              Ukázat řešení
            </button>
          ) : null}
        </div>
      ) : null}

      {showSolution && solutionHtml ? (
        <div className="solution-reveal" aria-label="Řešení">
          <h2>Řešení</h2>
          <div
            className="docs-editor"
            dangerouslySetInnerHTML={{ __html: solutionHtml }}
          />
        </div>
      ) : null}

      {feedback ? <p className="check-feedback">{feedback}</p> : null}
      <CheckResult outcomes={outcomes} />
    </main>
  )
}
