import { useCallback, useEffect, useRef, useState } from 'react'
import { pickTarget, wouldMatchAny } from './asteroidTarget'
import { textMatches, type Difficulty } from './charMatches'
import { CharBar } from './components/CharBar'
import { GameInput, type GameInputHandle } from './components/GameInput'
import {
  ASTEROID_LABELS,
  type AsteroidLabel,
} from './data/asteroidLabels'
import { SPECIAL_CHAR_SET } from './chars'
import { classifyError } from './errors'
import {
  getAsteroidRecord,
  getRecentAsteroidIds,
  pushRecentAsteroidId,
  saveAsteroidRecord,
  type AsteroidMode,
} from './records'
import { practiceLink, ruleShortHint } from './rules'

type Phase = 'pick' | 'play' | 'wavePause' | 'results'

type AsteroidsGameProps = {
  onBack: () => void
  onOpenLevel?: (levelId: string) => void
}

type Rock = {
  id: string
  label: AsteroidLabel
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  r: number
  fallMs: number
}

type HitInfo = { text: string; hint: string; until: number }
type ErrorStat = { rule: string; count: number; hint: string }

const MODE_LABEL: Record<AsteroidMode, string> = {
  lehka: 'Lehká',
  stredni: 'Střední',
  tezka: 'Těžká',
  klidny: 'Klidný trénink',
}

const BASE_FALL: Record<AsteroidMode, number> = {
  lehka: 16000,
  stredni: 12000,
  tezka: 9000,
  klidny: 20000,
}

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function waveLevels(wave: number): { levels: number[]; weights: number[] } {
  if (wave <= 2) return { levels: [1], weights: [1] }
  if (wave <= 5) return { levels: [1, 2], weights: [0.6, 0.4] }
  return { levels: [1, 2, 3], weights: [0.3, 0.4, 0.3] }
}

function pickLabel(
  wave: number,
  onScreen: string[],
  recent: string[],
): AsteroidLabel {
  const { levels, weights } = waveLevels(wave)
  const pool = ASTEROID_LABELS.filter((l) => levels.includes(l.level))
  const firstChars = new Set(
    onScreen
      .map((id) => ASTEROID_LABELS.find((l) => l.id === id)?.text[0])
      .filter(Boolean),
  )

  for (let attempt = 0; attempt < 10; attempt++) {
    const r = Math.random()
    let acc = 0
    let level = levels[0]!
    for (let i = 0; i < levels.length; i++) {
      acc += weights[i]!
      if (r <= acc) {
        level = levels[i]!
        break
      }
    }
    const candidates = pool.filter(
      (l) =>
        l.level === level &&
        !onScreen.includes(l.id) &&
        !recent.includes(l.id) &&
        !firstChars.has(l.text[0]!),
    )
    const use =
      candidates.length > 0
        ? candidates
        : pool.filter((l) => !onScreen.includes(l.id) && l.level === level)
    if (use.length > 0) return use[Math.floor(Math.random() * use.length)]!
  }
  const fallback = pool.filter((l) => !onScreen.includes(l.id))
  return (fallback[0] ?? pool[0])!
}

function hasSpecial(text: string, hard: boolean): boolean {
  for (const ch of text) {
    if (SPECIAL_CHAR_SET.has(ch)) {
      if (ch === '\u00A0' && !hard) continue
      return true
    }
  }
  return false
}

export function AsteroidsGame({ onBack, onOpenLevel }: AsteroidsGameProps) {
  const [phase, setPhase] = useState<Phase>('pick')
  const [mode, setMode] = useState<AsteroidMode>('lehka')
  const [input, setInput] = useState('')
  const [hint, setHint] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)
  const [needsResume, setNeedsResume] = useState(false)
  const [shake, setShake] = useState(false)
  const [waveBanner, setWaveBanner] = useState('')
  const [hud, setHud] = useState({
    score: 0,
    lives: 3,
    wave: 1,
    combo: 1,
    shot: 0,
    missed: 0,
    correct: 0,
    total: 0,
  })
  const [hitMsg, setHitMsg] = useState<HitInfo | null>(null)
  const [errorStats, setErrorStats] = useState<ErrorStat[]>([])
  const [missedLabels, setMissedLabels] = useState<
    { text: string; hint: string }[]
  >([])
  const [newRecord, setNewRecord] = useState(false)
  const [lockedId, setLockedId] = useState<string | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<GameInputHandle>(null)
  const rocksRef = useRef<Rock[]>([])
  const particlesRef = useRef<
    { x: number; y: number; vx: number; vy: number; life: number }[]
  >([])
  const lasersRef = useRef<{ x0: number; y0: number; x1: number; y1: number; life: number }[]>(
    [],
  )
  const rafRef = useRef(0)
  const lastTs = useRef(0)
  const waveRef = useRef(1)
  const toSpawn = useRef(0)
  const spawnCd = useRef(0)
  const modeRef = useRef<AsteroidMode>('lehka')
  const difficulty = (): Difficulty =>
    modeRef.current === 'klidny' ? 'lehka' : modeRef.current
  const recentRef = useRef<string[]>([])
  const scoreRef = useRef(0)
  const livesRef = useRef(3)
  const comboRef = useRef(1)
  const shotRef = useRef(0)
  const missedRef = useRef(0)
  const correctRef = useRef(0)
  const totalRef = useRef(0)
  const errorsRef = useRef<ErrorStat[]>([])
  const missedListRef = useRef<{ text: string; hint: string }[]>([])
  const inputVal = useRef('')
  const committedRef = useRef('')
  const lockedRef = useRef<string | null>(null)
  const pausedRef = useRef(false)
  const phaseRef = useRef<Phase>('pick')
  const hintTimer = useRef(0)
  const betweenWaves = useRef(false)

  const syncHud = () => {
    setHud({
      score: scoreRef.current,
      lives: livesRef.current,
      wave: waveRef.current,
      combo: comboRef.current,
      shot: shotRef.current,
      missed: missedRef.current,
      correct: correctRef.current,
      total: totalRef.current,
    })
  }

  const startGame = (m: AsteroidMode) => {
    modeRef.current = m
    setMode(m)
    waveRef.current = 1
    toSpawn.current = 4 + 2 * 1
    spawnCd.current = 0.5
    rocksRef.current = []
    particlesRef.current = []
    lasersRef.current = []
    scoreRef.current = 0
    livesRef.current = m === 'klidny' ? 999 : 3
    comboRef.current = 1
    shotRef.current = 0
    missedRef.current = 0
    correctRef.current = 0
    totalRef.current = 0
    errorsRef.current = []
    missedListRef.current = []
    recentRef.current = getRecentAsteroidIds()
    inputVal.current = ''
    committedRef.current = ''
    setInput('')
    lockedRef.current = null
    setLockedId(null)
    setErrorStats([])
    setMissedLabels([])
    setHitMsg(null)
    setHint(null)
    setPaused(false)
    pausedRef.current = false
    setNeedsResume(false)
    betweenWaves.current = false
    setNewRecord(false)
    phaseRef.current = 'play'
    setPhase('play')
    syncHud()
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const endGame = useCallback(() => {
    phaseRef.current = 'results'
    setPhase('results')
    setErrorStats(errorsRef.current)
    setMissedLabels(missedListRef.current)
    syncHud()
    if (modeRef.current !== 'klidny') {
      const rec = {
        score: scoreRef.current,
        wave: waveRef.current,
        at: new Date().toISOString(),
      }
      setNewRecord(saveAsteroidRecord(modeRef.current, rec))
    }
  }, [])

  const showHintMsg = (msg: string) => {
    setHint(msg)
    window.clearTimeout(hintTimer.current)
    hintTimer.current = window.setTimeout(() => setHint(null), 2000)
  }

  const recordTypo = (expected: string, typed: string, tags: string[]) => {
    totalRef.current += 1
    const c = classifyError(expected, typed, tags, {
      hardNbsp: modeRef.current === 'tezka',
    })
    if (c.kind === 'typograficka') {
      showHintMsg(c.hint)
      const prev = errorsRef.current
      const i = prev.findIndex((e) => e.rule === c.rule)
      if (i < 0) {
        errorsRef.current = [
          ...prev,
          { rule: c.rule, count: 1, hint: c.hint },
        ]
      } else {
        const copy = [...prev]
        copy[i] = { ...copy[i]!, count: copy[i]!.count + 1 }
        errorsRef.current = copy
      }
    }
    comboRef.current = 1
    syncHud()
    if (!reducedMotion()) {
      setShake(true)
      window.setTimeout(() => setShake(false), 300)
    }
  }

  const destroyRock = (rock: Rock) => {
    const hard = modeRef.current === 'tezka'
    const base =
      10 * rock.label.text.length * (1 + 0.1 * waveRef.current)
    const bonus = hasSpecial(rock.label.text, hard) ? 1.5 : 1
    scoreRef.current += Math.round(base * bonus * comboRef.current)
    comboRef.current = Math.min(2, comboRef.current + 0.1)
    shotRef.current += 1
    correctRef.current += rock.label.text.length
    totalRef.current += rock.label.text.length
    pushRecentAsteroidId(rock.label.id)
    recentRef.current = [
      rock.label.id,
      ...recentRef.current.filter((x) => x !== rock.label.id),
    ].slice(0, 10)

    const canvas = canvasRef.current
    const baseY = canvas ? canvas.clientHeight - 40 : 400
    const baseX = canvas ? canvas.clientWidth / 2 : 200
    lasersRef.current.push({
      x0: baseX,
      y0: baseY,
      x1: rock.x,
      y1: rock.y,
      life: 0.15,
    })
    for (let i = 0; i < 12; i++) {
      particlesRef.current.push({
        x: rock.x,
        y: rock.y,
        vx: (Math.random() - 0.5) * 200,
        vy: (Math.random() - 0.5) * 200,
        life: 0.4 + Math.random() * 0.3,
      })
    }
    rocksRef.current = rocksRef.current.filter((r) => r.id !== rock.id)
    lockedRef.current = null
    setLockedId(null)
    inputVal.current = ''
    committedRef.current = ''
    setInput('')
    syncHud()
  }

  const evaluateInput = (value: string) => {
    if (phaseRef.current !== 'play' || pausedRef.current) return
    const diff = difficulty()
    const rocks = rocksRef.current
    const prev = committedRef.current

    if (value.length === 0) {
      lockedRef.current = null
      setLockedId(null)
      committedRef.current = ''
      inputVal.current = ''
      setInput('')
      return
    }

    if (value.length > prev.length) {
      const added = value.slice(prev.length)
      const targetables = rocks.map((r) => ({
        id: r.id,
        text: r.label.text,
        y: r.y,
      }))
      if (!wouldMatchAny(targetables, prev, added, diff)) {
        const expectedRock = pickTarget(targetables, prev, diff)
        const expected =
          expectedRock?.text[prev.length] ??
          rocks[0]?.label.text[0] ??
          ''
        const tags = expectedRock
          ? (ASTEROID_LABELS.find((l) => l.id === expectedRock.id)?.tags ??
            [])
          : []
        recordTypo(expected, added[0] ?? '', tags)
        inputVal.current = prev
        setInput(prev)
        return
      }
    }

    const target = pickTarget(
      rocks.map((r) => ({ id: r.id, text: r.label.text, y: r.y })),
      value,
      diff,
    )
    if (!target) {
      committedRef.current = value
      inputVal.current = value
      setInput(value)
      return
    }
    lockedRef.current = target.id
    setLockedId(target.id)
    committedRef.current = value
    inputVal.current = value
    setInput(value)

    const rock = rocks.find((r) => r.id === target.id)
    if (rock && textMatches(rock.label.text, value, diff)) {
      destroyRock(rock)
    }
  }

  // Game loop
  useEffect(() => {
    if (phase !== 'play' && phase !== 'wavePause') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const loop = (ts: number) => {
      const dt = Math.min(0.05, (ts - (lastTs.current || ts)) / 1000)
      lastTs.current = ts

      if (!pausedRef.current && phaseRef.current === 'play' && !betweenWaves.current) {
        const w = canvas.clientWidth
        const h = canvas.clientHeight
        const baseY = h - 36
        const maxOnScreen = Math.min(2 + Math.ceil(waveRef.current / 2), 6)

        // spawn
        if (toSpawn.current > 0 && rocksRef.current.length < maxOnScreen) {
          spawnCd.current -= dt
          if (spawnCd.current <= 0) {
            const onIds = rocksRef.current.map((r) => r.label.id)
            const label = pickLabel(
              waveRef.current,
              onIds,
              recentRef.current,
            )
            let fall = BASE_FALL[modeRef.current]
            if (modeRef.current !== 'klidny') {
              const factor = Math.max(
                0.45,
                Math.pow(0.94, waveRef.current - 1),
              )
              fall *= factor
            }
            fall += Math.max(0, label.text.length - 8) * 300
            const baseX = w / 2
            const x = 40 + Math.random() * (w - 80)
            const y = -30
            const dx = baseX - x
            const dy = baseY - y
            const dist = Math.hypot(dx, dy) || 1
            const speed = dist / (fall / 1000)
            rocksRef.current.push({
              id: `${label.id}-${Math.random().toString(36).slice(2, 7)}`,
              label,
              x,
              y,
              vx: (dx / dist) * speed,
              vy: (dy / dist) * speed,
              rot: Math.random() * Math.PI * 2,
              r: 28 + Math.min(20, label.text.length),
              fallMs: fall,
            })
            toSpawn.current -= 1
            spawnCd.current = 0.6 + Math.random() * 0.5
          }
        }

        // move rocks
        const next: Rock[] = []
        for (const rock of rocksRef.current) {
          rock.x += rock.vx * dt
          rock.y += rock.vy * dt
          rock.rot += dt * 0.5
          if (rock.y + rock.r >= baseY) {
            missedRef.current += 1
            if (modeRef.current !== 'klidny') {
              livesRef.current -= 1
              comboRef.current = 1
              if (!reducedMotion()) {
                setShake(true)
                window.setTimeout(() => setShake(false), 400)
              }
              const tag = rock.label.tags[0] ?? 'zalomeni'
              const hint = ruleShortHint(tag)
              missedListRef.current = [
                ...missedListRef.current,
                { text: rock.label.text, hint },
              ]
              setHitMsg({
                text: rock.label.text,
                hint,
                until: performance.now() + 3000,
              })
              if (livesRef.current <= 0) {
                endGame()
              }
            }
            syncHud()
            if (lockedRef.current === rock.id) {
              lockedRef.current = null
              setLockedId(null)
              inputVal.current = ''
              committedRef.current = ''
              setInput('')
            }
          } else {
            next.push(rock)
          }
        }
        rocksRef.current = next

        // wave complete
        if (
          toSpawn.current <= 0 &&
          rocksRef.current.length === 0 &&
          !betweenWaves.current
        ) {
          betweenWaves.current = true
          phaseRef.current = 'wavePause'
          setPhase('wavePause')
          const nextWave = waveRef.current + 1
          const tips = Object.keys(MODE_LABEL) // placeholder
          void tips
          const tipKeys = [
            'uvozovky',
            'pomlcka',
            'zalomeni',
            'jednotky',
            'vypustka',
          ]
          const tip =
            ruleShortHint(
              tipKeys[Math.floor(Math.random() * tipKeys.length)]!,
            )
          setWaveBanner(`Vlna ${nextWave}`)
          setHint(tip)
          window.setTimeout(() => {
            waveRef.current = nextWave
            toSpawn.current = 4 + 2 * nextWave
            spawnCd.current = 0.4
            betweenWaves.current = false
            setWaveBanner('')
            setHint(null)
            phaseRef.current = 'play'
            setPhase('play')
            syncHud()
            inputRef.current?.focus()
          }, 3000)
        }

        // particles / lasers
        particlesRef.current = particlesRef.current
          .map((p) => ({
            ...p,
            x: p.x + p.vx * dt,
            y: p.y + p.vy * dt,
            life: p.life - dt,
          }))
          .filter((p) => p.life > 0)
        lasersRef.current = lasersRef.current
          .map((l) => ({ ...l, life: l.life - dt }))
          .filter((l) => l.life > 0)

        if (hitMsg && performance.now() > hitMsg.until) setHitMsg(null)
      }

      // draw
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)
      // bg
      const g = ctx.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, '#0b1220')
      g.addColorStop(1, '#1a2740')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      // base
      ctx.fillStyle = '#3d8bfd'
      ctx.beginPath()
      ctx.moveTo(w / 2, h - 12)
      ctx.lineTo(w / 2 - 28, h - 40)
      ctx.lineTo(w / 2 + 28, h - 40)
      ctx.closePath()
      ctx.fill()

      for (const l of lasersRef.current) {
        ctx.strokeStyle = `rgba(120,200,255,${l.life * 6})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(l.x0, l.y0)
        ctx.lineTo(l.x1, l.y1)
        ctx.stroke()
      }

      for (const p of particlesRef.current) {
        ctx.fillStyle = `rgba(255,180,80,${p.life})`
        ctx.fillRect(p.x, p.y, 3, 3)
      }

      const typed = inputVal.current
      const diff = difficulty()
      for (const rock of rocksRef.current) {
        ctx.save()
        ctx.translate(rock.x, rock.y)
        ctx.rotate(rock.rot)
        ctx.fillStyle =
          rock.id === lockedRef.current ? '#e8a838' : '#8a7a6a'
        ctx.beginPath()
        for (let i = 0; i < 7; i++) {
          const a = (i / 7) * Math.PI * 2
          const rr = rock.r * (0.75 + (i % 2) * 0.25)
          const px = Math.cos(a) * rr
          const py = Math.sin(a) * rr
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.fill()
        ctx.restore()

        // label pill (always upright)
        const label = rock.label.text
        ctx.font = '18px "Open Sans", "Segoe UI", sans-serif'
        const pad = 8
        const tw = ctx.measureText(
          label.replace(/\u00A0/g, ' '),
        ).width
        const bx = rock.x - tw / 2 - pad
        const by = rock.y - 10
        ctx.fillStyle = 'rgba(20,24,36,0.92)'
        roundRect(ctx, bx, by, tw + pad * 2, 28, 10)
        ctx.fill()

        // typed prefix coloring
        let matched = 0
        if (rock.id === lockedRef.current) {
          for (let i = 0; i < typed.length && i < label.length; i++) {
            if (
              // dynamic import avoid — use inline soft compare via text prefix already locked
              typed[i] === label[i] ||
              (label[i] === '\u00A0' &&
                typed[i] === ' ' &&
                diff !== 'tezka') ||
              (label[i] === ' ' && typed[i] === '\u00A0') ||
              (label[i] === '\u2212' && typed[i] === '-')
            ) {
              matched++
            } else break
          }
        }
        const display = [...label].map((ch) =>
          ch === '\u00A0'
            ? modeRef.current === 'tezka'
              ? '·'
              : ' '
            : ch,
        )
        let xOff = rock.x - tw / 2
        for (let i = 0; i < display.length; i++) {
          ctx.fillStyle = i < matched ? '#7ddea0' : '#f1f3f4'
          ctx.fillText(display[i]!, xOff, rock.y + 10)
          xOff += ctx.measureText(display[i]!).width
        }
      }

      if (waveBanner) {
        ctx.fillStyle = 'rgba(0,0,0,0.45)'
        ctx.fillRect(0, h / 2 - 40, w, 80)
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 28px "Open Sans", sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(waveBanner, w / 2, h / 2 + 10)
        ctx.textAlign = 'start'
      }

      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [phase, endGame, waveBanner, hitMsg])

  // visibility pause
  useEffect(() => {
    if (phase !== 'play' && phase !== 'wavePause') return
    const onVis = () => {
      if (document.hidden) {
        pausedRef.current = true
        setPaused(true)
        setNeedsResume(true)
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [phase])

  const resume = () => {
    pausedRef.current = false
    setPaused(false)
    setNeedsResume(false)
    lastTs.current = 0
    inputRef.current?.focus()
  }

  const insertChar = (ch: string) => {
    if (pausedRef.current || phaseRef.current !== 'play') return
    const next = inputVal.current + ch
    evaluateInput(next)
  }

  if (phase === 'pick') {
    return (
      <main className="page page-minihry">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Zpět
        </button>
        <header className="page-header">
          <h1>Typografické asteroidy</h1>
          <p>Sestřel asteroidy přesným přepsáním popisku.</p>
        </header>
        <div className="minihry-diff-pick">
          {(Object.keys(MODE_LABEL) as AsteroidMode[]).map((m) => (
            <button
              key={m}
              type="button"
              className="minihry-diff-btn"
              onClick={() => startGame(m)}
            >
              {MODE_LABEL[m]}
            </button>
          ))}
        </div>
      </main>
    )
  }

  if (phase === 'results') {
    const acc =
      hud.total > 0
        ? Math.round((hud.correct / hud.total) * 1000) / 10
        : 100
    const prev =
      mode !== 'klidny' ? getAsteroidRecord(mode) : null
    return (
      <main className="page page-minihry">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Zpět
        </button>
        <header className="page-header">
          <h1>Konec hry</h1>
          <p>
            {mode === 'klidny'
              ? 'Klidný trénink – bez rekordu'
              : newRecord
                ? 'Nový osobní rekord!'
                : prev
                  ? `Rekord: ${prev.score} bodů`
                  : null}
          </p>
        </header>
        <ul className="minihry-metrics">
          <li>Skóre: {hud.score}</li>
          <li>Vlna: {hud.wave}</li>
          <li>Přesnost: {acc} %</li>
          <li>
            Sestřeleno: {hud.shot} · propuštěno: {hud.missed}
          </li>
        </ul>
        {missedLabels.length > 0 && (
          <section className="minihry-error-rules">
            <h2>Co tě trefilo</h2>
            <ul>
              {missedLabels.map((m, i) => (
                <li key={i}>
                  <code>{m.text}</code> — {m.hint}
                </li>
              ))}
            </ul>
          </section>
        )}
        {errorStats.length > 0 && (
          <section className="minihry-error-rules">
            <h2>Typografické chyby</h2>
            <ul>
              {errorStats.map((e) => {
                const task = practiceLink(e.rule)
                return (
                  <li key={e.rule}>
                    <strong>{e.rule}</strong> ({e.count}×):{' '}
                    {e.hint || ruleShortHint(e.rule)}
                    {task ? (
                      <>
                        {' '}
                        <button
                          type="button"
                          className="linkish"
                          onClick={() => onOpenLevel?.(task)}
                        >
                          Procvič v úloze {task}
                        </button>
                      </>
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
            onClick={() => startGame(mode)}
          >
            Znovu
          </button>
          <button type="button" className="secondary-btn" onClick={onBack}>
            Zpět
          </button>
        </div>
      </main>
    )
  }

  return (
    <main
      className={`page page-minihry page-asteroids${shake ? ' is-shake' : ''}`}
    >
      <button type="button" className="back-btn" onClick={onBack}>
        ← Zpět
      </button>
      {(paused || needsResume) && (
        <div className="minihry-pause" role="dialog">
          <p>Pauza – klikni nebo stiskni klávesu</p>
          <button type="button" className="primary-btn" onClick={resume}>
            Pokračovat
          </button>
        </div>
      )}
      <div className="minihry-asteroid-hud">
        <span>Skóre {hud.score}</span>
        <span>Vlna {hud.wave}</span>
        <span>
          {mode === 'klidny' ? '∞' : '♥'.repeat(Math.max(0, hud.lives))}
        </span>
        <span>×{hud.combo.toFixed(1)}</span>
      </div>
      <canvas
        ref={canvasRef}
        className="minihry-canvas"
        onClick={() => {
          if (needsResume) resume()
          else inputRef.current?.focus()
        }}
      />
      {hitMsg && (
        <div className="minihry-hit-msg">
          Tohle tě trefilo: {hitMsg.text} · {hitMsg.hint}
        </div>
      )}
      {hint && <div className="minihry-hint">{hint}</div>}
      <GameInput
        ref={inputRef}
        value={input}
        onValueChange={setInput}
        onCommit={evaluateInput}
        disabled={paused}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            pausedRef.current = true
            setPaused(true)
            setNeedsResume(true)
          }
          if (needsResume) {
            e.preventDefault()
            resume()
          }
        }}
      />
      <CharBar onInsert={insertChar} />
      {lockedId && (
        <p className="minihry-locked-hint" aria-live="polite">
          Cíl zamčen
        </p>
      )}
    </main>
  )
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
