import { useEffect, useMemo, useRef, useState } from 'react'
import { charMatches, textMatches, type Difficulty } from './charMatches'
import { CharBar } from './components/CharBar'
import { GameInput, type GameInputHandle } from './components/GameInput'
import { PromptText } from './components/PromptText'
import { pickRaceText, type RaceText } from './data/raceTexts'
import { classifyError } from './errors'
import {
  getRaceRecord,
  getRecentRaceIds,
  pushRecentRaceId,
  saveRaceRecord,
  type TimelinePoint,
} from './records'
import { practiceLink, ruleShortHint } from './rules'
import { splitRaceWords } from './words'

type Phase = 'pick' | 'countdown' | 'race' | 'results'

type RaceGameProps = {
  onBack: () => void
  onOpenLevel?: (levelId: string) => void
}

const BOT_CPM: Record<Difficulty, [number, number]> = {
  lehka: [80, 120],
  stredni: [120, 170],
  tezka: [150, 210],
}

const DIFF_LABEL: Record<Difficulty, string> = {
  lehka: 'Lehká',
  stredni: 'Střední',
  tezka: 'Těžká',
}

type ErrorStat = { rule: string; count: number; hint: string }

export function RaceGame({ onBack, onOpenLevel }: RaceGameProps) {
  const [phase, setPhase] = useState<Phase>('pick')
  const [difficulty, setDifficulty] = useState<Difficulty>('lehka')
  const [text, setText] = useState<RaceText | null>(null)
  const [countdown, setCountdown] = useState(3)
  const [input, setInput] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [correctInWord, setCorrectInWord] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [hint, setHint] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)
  const [barUses, setBarUses] = useState(0)
  const [correctKeys, setCorrectKeys] = useState(0)
  const [totalKeys, setTotalKeys] = useState(0)
  const [errorStats, setErrorStats] = useState<ErrorStat[]>([])
  const [errorIndexes, setErrorIndexes] = useState<number[]>([])
  const [elapsedMs, setElapsedMs] = useState(0)
  const [newRecord, setNewRecord] = useState(false)
  const [prevRecord, setPrevRecord] = useState<ReturnType<typeof getRaceRecord>>(null)

  const inputRef = useRef<GameInputHandle>(null)
  const startRef = useRef(0)
  const pauseAccum = useRef(0)
  const pauseStarted = useRef(0)
  const lastErrorKey = useRef('')
  const hintTimer = useRef(0)
  const correctRef = useRef(0)
  const totalRef = useRef(0)
  const barRef = useRef(0)
  const errorsRef = useRef<ErrorStat[]>([])
  const errorIdxRef = useRef<number[]>([])
  const timelineRef = useRef<TimelinePoint[]>([])
  const wordIndexRef = useRef(0)
  const correctInWordRef = useRef(0)
  const words = useMemo(
    () => (text ? splitRaceWords(text.text) : []),
    [text],
  )

  const doneChars = useMemo(() => {
    let n = 0
    for (let i = 0; i < wordIndex; i++) n += words[i]!.length
    return n + correctInWord
  }, [words, wordIndex, correctInWord])

  const absoluteCurrent = doneChars

  const ghost = text ? getRaceRecord(difficulty, text.id) : null

  const startRace = (diff: Difficulty, preferId?: string) => {
      const recent = getRecentRaceIds()
      const picked = pickRaceText(diff, recent, preferId)
      setDifficulty(diff)
      setText(picked)
      setPhase('countdown')
      setCountdown(3)
      setInput('')
      setWordIndex(0)
      setCorrectInWord(0)
      setHasError(false)
      setHint(null)
      setPaused(false)
      setBarUses(0)
      setCorrectKeys(0)
      setTotalKeys(0)
      setErrorStats([])
      setErrorIndexes([])
      setElapsedMs(0)
      setNewRecord(false)
      setPrevRecord(getRaceRecord(diff, picked.id))
      pauseAccum.current = 0
      lastErrorKey.current = ''
      correctRef.current = 0
      totalRef.current = 0
      barRef.current = 0
      errorsRef.current = []
      errorIdxRef.current = []
      timelineRef.current = []
      wordIndexRef.current = 0
      correctInWordRef.current = 0
  }

  // Countdown
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown <= 0) {
      setPhase('race')
      startRef.current = performance.now()
      return
    }
    const t = window.setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, countdown])

  // Keep input focused during countdown and race so typing works immediately
  useEffect(() => {
    if (phase !== 'countdown' && phase !== 'race') return
    const focus = () => inputRef.current?.focus()
    focus()
    const id = requestAnimationFrame(focus)
    return () => cancelAnimationFrame(id)
  }, [phase, countdown])

  // Timer + timeline
  useEffect(() => {
    if (phase !== 'race' || paused) return
    const id = window.setInterval(() => {
      const now = performance.now()
      const ms = now - startRef.current - pauseAccum.current
      setElapsedMs(ms)
      const chars = (() => {
        let n = 0
        for (let i = 0; i < wordIndexRef.current; i++) n += words[i]!.length
        return n + correctInWordRef.current
      })()
      const prev = timelineRef.current
      const last = prev[prev.length - 1]
      if (!last || last.chars !== chars) {
        timelineRef.current = [...prev, { t: ms, chars }]
      }
    }, 100)
    return () => clearInterval(id)
  }, [phase, paused, words])

  // Visibility pause
  useEffect(() => {
    if (phase !== 'race') return
    const onVis = () => {
      if (document.hidden) {
        setPaused(true)
        pauseStarted.current = performance.now()
      }
    }
    const onBlur = () => {
      setPaused(true)
      pauseStarted.current = performance.now()
    }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('blur', onBlur)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('blur', onBlur)
    }
  }, [phase])

  const resume = () => {
    if (!paused) return
    pauseAccum.current += performance.now() - pauseStarted.current
    setPaused(false)
    inputRef.current?.focus()
  }

  const showHint = (msg: string) => {
    setHint(msg)
    window.clearTimeout(hintTimer.current)
    hintTimer.current = window.setTimeout(() => setHint(null), 2000)
  }

  const recordError = (
    expected: string,
    typed: string,
    absIndex: number,
  ) => {
    const key = `${absIndex}:${typed}`
    if (lastErrorKey.current === key) return
    lastErrorKey.current = key
    const classified = classifyError(expected, typed, text?.tags ?? [], {
      hardNbsp: difficulty === 'tezka',
    })
    totalRef.current += 1
    setTotalKeys(totalRef.current)
    if (!errorIdxRef.current.includes(absIndex)) {
      errorIdxRef.current = [...errorIdxRef.current, absIndex]
      setErrorIndexes(errorIdxRef.current)
    }
    if (classified.kind === 'typograficka') {
      showHint(classified.hint)
      const prev = errorsRef.current
      const i = prev.findIndex((e) => e.rule === classified.rule)
      if (i < 0) {
        errorsRef.current = [
          ...prev,
          { rule: classified.rule, count: 1, hint: classified.hint },
        ]
      } else {
        const copy = [...prev]
        copy[i] = { ...copy[i]!, count: copy[i]!.count + 1 }
        errorsRef.current = copy
      }
      setErrorStats(errorsRef.current)
    }
  }

  const finishRace = () => {
    if (!text) return
    const ms = performance.now() - startRef.current - pauseAccum.current
    const minutes = Math.max(ms / 60000, 1 / 60000)
    const cpm = Math.round(correctRef.current / minutes)
    const accuracy =
      totalRef.current > 0
        ? Math.round((correctRef.current / totalRef.current) * 1000) / 10
        : 100
    const record = {
      cpm,
      accuracy,
      timeline: timelineRef.current,
      at: new Date().toISOString(),
    }
    const isNew = saveRaceRecord(difficulty, text.id, record)
    setNewRecord(isNew)
    pushRecentRaceId(text.id)
    setElapsedMs(ms)
    setCorrectKeys(correctRef.current)
    setTotalKeys(totalRef.current)
    setBarUses(barRef.current)
    setErrorStats(errorsRef.current)
    setErrorIndexes(errorIdxRef.current)
    setPhase('results')
  }

  const evaluate = (value: string, prevValue = input) => {
    if (phase !== 'race' || paused || !text) return
    const wi = wordIndexRef.current
    const word = words[wi]
    if (!word) return

    let matchLen = 0
    const limit = Math.min(value.length, word.length)
    for (let i = 0; i < limit; i++) {
      if (!charMatches(word[i]!, value[i]!, difficulty)) break
      matchLen++
    }

    if (value.length > matchLen) {
      setHasError(true)
      correctInWordRef.current = matchLen
      setCorrectInWord(matchLen)
      const expected = word[matchLen] ?? ''
      const typed = value[matchLen] ?? ''
      const abs =
        words.slice(0, wi).reduce((s, w) => s + w.length, 0) + matchLen
      recordError(expected, typed, abs)
      return
    }

    setHasError(false)
    lastErrorKey.current = ''
    correctInWordRef.current = matchLen
    setCorrectInWord(matchLen)

    if (value.length > prevValue.length && matchLen === value.length) {
      const added = value.length - prevValue.length
      correctRef.current += added
      totalRef.current += added
      setCorrectKeys(correctRef.current)
      setTotalKeys(totalRef.current)
    }

    if (textMatches(word, value, difficulty)) {
      const nextWord = wi + 1
      wordIndexRef.current = nextWord
      correctInWordRef.current = 0
      setWordIndex(nextWord)
      setCorrectInWord(0)
      setInput('')
      if (nextWord >= words.length) {
        const ms = performance.now() - startRef.current - pauseAccum.current
        const nextDone = words.reduce((s, w) => s + w.length, 0)
        timelineRef.current = [
          ...timelineRef.current,
          { t: ms, chars: nextDone },
        ]
        finishRace()
      }
    }
  }

  const insertChar = (ch: string) => {
    if (phase !== 'race' || paused) return
    barRef.current += 1
    setBarUses(barRef.current)
    const el = inputRef.current?.el
    const prev = input
    if (!el) {
      const next = prev + ch
      setInput(next)
      evaluate(next, prev)
      return
    }
    const start = el.selectionStart ?? prev.length
    const end = el.selectionEnd ?? prev.length
    const next = prev.slice(0, start) + ch + prev.slice(end)
    setInput(next)
    requestAnimationFrame(() => {
      el.focus()
      const pos = start + ch.length
      el.setSelectionRange(pos, pos)
      evaluate(next, prev)
    })
  }

  const minutes = Math.max(elapsedMs / 60000, 1 / 60000)
  const liveCpm = Math.round(correctKeys / minutes)
  const liveAcc =
    totalKeys > 0 ? Math.round((correctKeys / totalKeys) * 1000) / 10 : 100

  const progress = text ? doneChars / text.text.length : 0
  const ghostProgress = (() => {
    if (!ghost || phase !== 'race') return 0
    const tl = ghost.timeline
    if (tl.length === 0) return 0
    let chars = 0
    for (const p of tl) {
      if (p.t <= elapsedMs) chars = p.chars
      else break
    }
    return text ? chars / text.text.length : 0
  })()
  const botProgress = (cpm: number) => {
    if (!text || phase !== 'race') return 0
    const chars = (cpm / 60000) * elapsedMs
    return Math.min(1, chars / text.text.length)
  }

  if (phase === 'pick') {
    return (
      <main className="page page-minihry">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Zpět
        </button>
        <header className="page-header">
          <h1>Typografický závod</h1>
          <p>Přepiš text přesně – včetně pomlček, uvozovek a mezer.</p>
        </header>
        <div className="minihry-diff-pick">
          {(Object.keys(DIFF_LABEL) as Difficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              className="minihry-diff-btn"
              onClick={() => startRace(d)}
            >
              {DIFF_LABEL[d]}
            </button>
          ))}
        </div>
      </main>
    )
  }

  if (phase === 'results' && text) {
    const minutesR = Math.max(elapsedMs / 60000, 1 / 60000)
    const cpm = Math.round(correctKeys / minutesR)
    const wpm = Math.round(cpm / 5)
    const acc =
      totalKeys > 0 ? Math.round((correctKeys / totalKeys) * 1000) / 10 : 100
    const playerPos = 1 // simplified: show metrics; bots finish by cpm estimate
    return (
      <main className="page page-minihry">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Zpět
        </button>
        <header className="page-header">
          <h1>Výsledky</h1>
          <p>
            {newRecord
              ? 'Nový osobní rekord!'
              : prevRecord
                ? `Rekord: ${prevRecord.cpm} úhozů/min (rozdíl ${cpm - prevRecord.cpm})`
                : 'První pokus na tomto textu'}
          </p>
        </header>
        <ul className="minihry-metrics">
          <li>{cpm} úhozů/min · {wpm} slov/min</li>
          <li>Přesnost {acc} %</li>
          <li>
            Chyby: {totalKeys - correctKeys} (typografické:{' '}
            {errorStats.reduce((s, e) => s + e.count, 0)})
          </li>
          <li>Lišta znaků: {barUses}×</li>
          <li>Pořadí: {playerPos}. (hráč)</li>
        </ul>
        <div className="minihry-result-prompt">
          {[...text.text].map((ch, i) => (
            <span
              key={i}
              className={errorIndexes.includes(i) ? 'is-error' : ''}
              title={
                errorIndexes.includes(i)
                  ? errorStats[0]?.hint
                  : undefined
              }
            >
              {ch === '\u00A0' ? ' ' : ch}
            </span>
          ))}
        </div>
        {errorStats.length > 0 && (
          <section className="minihry-error-rules">
            <h2>Typografické chyby</h2>
            <ul>
              {errorStats.map((e) => {
                const task = practiceLink(e.rule)
                return (
                  <li key={e.rule}>
                    <strong>{e.rule}</strong> ({e.count}×): {e.hint || ruleShortHint(e.rule)}
                    {task && onOpenLevel ? (
                      <>
                        {' '}
                        <button
                          type="button"
                          className="linkish"
                          onClick={() => onOpenLevel(task)}
                        >
                          Procvič v úloze {task}
                        </button>
                      </>
                    ) : task ? (
                      <> · Procvič v úloze {task}</>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </section>
        )}
        <div className="minihry-actions">
          <button
            type="button"
            className="primary-btn"
            onClick={() => startRace(difficulty)}
          >
            Další text
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => startRace(difficulty, text.id)}
          >
            Znovu stejný
          </button>
        </div>
      </main>
    )
  }

  // Race UI (also during countdown — input already focused)
  if (phase !== 'countdown' && phase !== 'race') return null
  const botSpeeds = BOT_CPM[difficulty]
  const botA = botSpeeds[0]
  const botB = botSpeeds[1]
  return (
    <main className="page page-minihry page-race">
      <button type="button" className="back-btn" onClick={onBack}>
        ← Zpět
      </button>
      {phase === 'countdown' && (
        <div className="minihry-countdown-overlay" aria-live="polite">
          <div className="minihry-countdown">
            {countdown > 0 ? countdown : 'Start!'}
          </div>
          <p className="minihry-countdown-diff">{DIFF_LABEL[difficulty]}</p>
        </div>
      )}
      {paused && (
        <div className="minihry-pause" role="dialog">
          <p>Pauza</p>
          <button type="button" className="primary-btn" onClick={resume}>
            Pokračovat
          </button>
        </div>
      )}
      <div className="minihry-track" aria-hidden>
        <TrackLane label="Ty" progress={progress} kind="player" />
        {ghost && (
          <TrackLane label="Duch" progress={ghostProgress} kind="ghost" />
        )}
        <TrackLane label="Bot 1" progress={botProgress(botA)} kind="bot" />
        <TrackLane label="Bot 2" progress={botProgress(botB)} kind="bot" />
      </div>

      {text && (
        <div className="minihry-prompt-wrap">
          <PromptText
            text={text.text}
            done={doneChars}
            current={absoluteCurrent}
            errorFrom={hasError ? absoluteCurrent : -1}
            difficulty={difficulty}
          />
        </div>
      )}

      {hint && <div className="minihry-hint">{hint}</div>}

      <GameInput
        ref={inputRef}
        value={input}
        onValueChange={setInput}
        onCommit={evaluate}
        disabled={paused}
        className={`minihry-input${hasError ? ' is-error' : ''}`}
        readOnly={phase === 'countdown'}
      />
      <CharBar onInsert={insertChar} showCodes />

      <div className="minihry-live-metrics">
        <span>{liveCpm} úhozů/min</span>
        <span>{liveAcc} %</span>
        <span>{(elapsedMs / 1000).toFixed(1)} s</span>
      </div>
    </main>
  )
}

function TrackLane({
  label,
  progress,
  kind,
}: {
  label: string
  progress: number
  kind: string
}) {
  return (
    <div className={`minihry-lane kind-${kind}`}>
      <span className="minihry-lane-label">{label}</span>
      <div className="minihry-lane-track">
        <span
          className="minihry-car"
          style={{ left: `${Math.min(100, progress * 100)}%` }}
        />
      </div>
    </div>
  )
}
