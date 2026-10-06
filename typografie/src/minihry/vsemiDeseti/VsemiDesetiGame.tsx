import { useEffect, useRef, useState } from 'react'
import { clearBadgeCache, renderBadge } from './badge'
import { detectLayout, toVariant, variantFromPress } from './detectLayout'
import { FINGER_NAME } from './fingers'
import { classifyKeydown, resolveHit } from './input'
import { bindingForChar, type LayoutVariant } from './layout'
import { charsForLesson, pickFallingChar } from './lessons'
import {
  getVdKeyStats,
  getVdPreferredLayout,
  getVdRecord,
  recordVdKeyStat,
  saveVdRecord,
  setVdPreferredLayout,
  type VdHintMode,
  type VdSpeed,
} from '../records'

type Phase = 'detect' | 'blocked' | 'play' | 'paused' | 'results'

type Falling = {
  id: string
  char: string
  col: number
  y: number
  born: number
  fallMs: number
}

type VsemiDesetiGameProps = {
  onBack: () => void
  onOpenGallery?: () => void
}

/** Fixed “full keyboard” lesson id for records. */
const LESSON_ALL = 12 as const

const SPEED: Record<
  VdSpeed,
  { fall: number; interval: number; max: number; level: number }
> = {
  pomalu: { fall: 9000, interval: 2400, max: 3, level: 1 },
  stredne: { fall: 7000, interval: 1800, max: 4, level: 2 },
  rychle: { fall: 5000, interval: 1300, max: 5, level: 3 },
}

const HINT_MODE: VdHintMode = 'mizi'

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function VsemiDesetiGame({
  onBack,
  onOpenGallery,
}: VsemiDesetiGameProps) {
  const [phase, setPhase] = useState<Phase>('detect')
  const [variant, setVariant] = useState<LayoutVariant>('cs-QWERTZ')
  const [speed, setSpeed] = useState<VdSpeed>('stredne')
  const [tip, setTip] = useState<string | null>(null)
  const [targetLine, setTargetLine] = useState('')
  const [hud, setHud] = useState({
    lives: 5,
    score: 0,
    hits: 0,
    misses: 0,
    wrong: 0,
    combo: 1,
    speedFactor: 1,
  })
  const [flash, setFlash] = useState(false)
  const [showMiss, setShowMiss] = useState<{
    char: string
    label: string
  } | null>(null)
  const [newRecord, setNewRecord] = useState(false)
  const [confusions, setConfusions] = useState<
    { expected: string; typed: string; n: number }[]
  >([])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const itemsRef = useRef<Falling[]>([])
  const rafRef = useRef(0)
  const lastTs = useRef(0)
  const spawnAcc = useRef(0)
  const pausedRef = useRef(false)
  const phaseRef = useRef<Phase>('detect')
  const held = useRef({ shiftLeft: false, shiftRight: false })
  const hitsRef = useRef(0)
  const speedUpsRef = useRef(0)
  const fallFactorRef = useRef(1)
  const recentKeys = useRef<{ ok: boolean }[]>([])
  const tipTimer = useRef(0)
  const confusionMap = useRef<Map<string, number>>(new Map())
  const variantRef = useRef(variant)
  const speedRef = useRef(speed)
  const scoreRef = useRef(0)
  const livesRef = useRef(5)
  const comboRef = useRef(1)
  const wrongRef = useRef(0)
  const missFallRef = useRef(0)
  const fieldSize = useRef(720)
  const beginPlayRef = useRef<() => void>(() => {})

  useEffect(() => {
    variantRef.current = variant
  }, [variant])
  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  const syncHud = () => {
    setHud({
      lives: livesRef.current,
      score: scoreRef.current,
      hits: hitsRef.current,
      misses: missFallRef.current,
      wrong: wrongRef.current,
      combo: comboRef.current,
      speedFactor: fallFactorRef.current,
    })
  }

  const showTip = (msg: string, ms = 2500) => {
    setTip(msg)
    window.clearTimeout(tipTimer.current)
    tipTimer.current = window.setTimeout(() => setTip(null), ms)
  }

  const beginPlay = () => {
    clearBadgeCache()
    itemsRef.current = []
    spawnAcc.current = 0
    hitsRef.current = 0
    speedUpsRef.current = 0
    fallFactorRef.current = 1
    recentKeys.current = []
    confusionMap.current = new Map()
    scoreRef.current = 0
    livesRef.current = 5
    comboRef.current = 1
    wrongRef.current = 0
    missFallRef.current = 0
    pausedRef.current = false
    setShowMiss(null)
    setNewRecord(false)
    setConfusions([])
    setPhase('play')
    phaseRef.current = 'play'
    syncHud()
    lastTs.current = 0
  }
  beginPlayRef.current = beginPlay

  const endGame = () => {
    phaseRef.current = 'results'
    setPhase('results')
    pausedRef.current = true
    const total = hitsRef.current + wrongRef.current
    const accuracy =
      total > 0 ? Math.round((hitsRef.current / total) * 1000) / 10 : 100
    const conf = [...confusionMap.current.entries()]
      .map(([k, n]) => {
        const [expected, typed] = k.split('→')
        return { expected: expected!, typed: typed!, n }
      })
      .sort((a, b) => b.n - a.n)
      .slice(0, 5)
    setConfusions(conf)
    syncHud()
    const isNew = saveVdRecord(LESSON_ALL, speedRef.current, HINT_MODE, {
      score: scoreRef.current,
      accuracy,
      at: new Date().toISOString(),
    })
    setNewRecord(isNew)
  }

  // Layout detection → start immediately
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const start = (v: LayoutVariant, noteQwerty: boolean) => {
        setVariant(v)
        variantRef.current = v
        if (noteQwerty) {
          showTip('Máš české rozložení QWERTY – Y a Z jsou prohozené')
        }
        beginPlayRef.current()
      }

      const preferred = getVdPreferredLayout()
      if (preferred) {
        if (!cancelled) start(preferred, preferred === 'cs-QWERTY')
        return
      }
      const d = await detectLayout()
      if (cancelled) return
      const v = toVariant(d)
      if (v) {
        setVdPreferredLayout(v)
        start(v, v === 'cs-QWERTY')
      } else if (d.kind === 'non-czech') {
        setPhase('blocked')
        phaseRef.current = 'blocked'
      } else {
        // unknown — start anyway with QWERTZ, correct from first Y/Z
        start('cs-QWERTZ', false)
        showTip('Rozložení ověříme z prvních stisků – piš česky.')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Game loop
  useEffect(() => {
    if (phase !== 'play' && phase !== 'paused') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const wrap = canvas.parentElement
      const availW = wrap?.clientWidth ?? 720
      const availH = Math.min(window.innerHeight - 160, 900)
      const size = Math.max(360, Math.min(availW, availH, 900))
      fieldSize.current = size
      const dpr = window.devicePixelRatio || 1
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      canvas.width = Math.floor(size * dpr)
      canvas.height = Math.floor(size * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const loop = (ts: number) => {
      const dt = Math.min(0.05, (ts - (lastTs.current || ts)) / 1000)
      lastTs.current = ts
      const size = fieldSize.current
      const sp = SPEED[speedRef.current]

      if (!pausedRef.current && phaseRef.current === 'play') {
        spawnAcc.current += dt * 1000
        const interval = sp.interval * fallFactorRef.current
        if (
          spawnAcc.current >= interval &&
          itemsRef.current.length < sp.max
        ) {
          spawnAcc.current = 0
          const ch = pickFallingChar(LESSON_ALL, {
            includeDigits: false,
            exclude: itemsRef.current.map((i) => i.char),
            variant: variantRef.current,
          })
          if (ch) {
            const cols = sp.max
            const used = new Set(itemsRef.current.map((i) => i.col))
            let col = 0
            for (let c = 0; c < cols; c++) {
              if (!used.has(c)) {
                col = c
                break
              }
              col = c
            }
            const fallMs = sp.fall * fallFactorRef.current
            itemsRef.current.push({
              id: `${ch}-${Math.random().toString(36).slice(2, 6)}`,
              char: ch,
              col,
              y: -20,
              born: performance.now(),
              fallMs,
            })
          }
        }

        const next: Falling[] = []
        for (const it of itemsRef.current) {
          const speedY = size / (it.fallMs / 1000)
          it.y += speedY * dt
          if (it.y >= size - 8) {
            missFallRef.current += 1
            comboRef.current = 1
            livesRef.current -= 1
            const b = bindingForChar(it.char, variantRef.current)
            const label = b
              ? `${it.char} – ${FINGER_NAME[b.finger]}`
              : it.char
            setShowMiss({ char: it.char, label })
            window.setTimeout(() => setShowMiss(null), 2000)
            if (livesRef.current <= 0) endGame()
            syncHud()
          } else {
            next.push(it)
          }
        }
        itemsRef.current = next

        const lowest = [...itemsRef.current].sort((a, b) => b.y - a.y)[0]
        if (lowest) {
          const b = bindingForChar(lowest.char, variantRef.current)
          setTargetLine(
            b ? `${lowest.char} – ${FINGER_NAME[b.finger]}` : lowest.char,
          )
        } else {
          setTargetLine('')
        }
      }

      ctx.clearRect(0, 0, size, size)
      ctx.fillStyle = '#f8f9fa'
      ctx.fillRect(0, 0, size, size)
      ctx.strokeStyle = '#dadce0'
      ctx.strokeRect(0.5, 0.5, size - 1, size - 1)

      const cols = SPEED[speedRef.current].max
      const colW = size / cols
      // Larger badges relative to field
      const badgeScale = (size / 560) * 1.35
      const pulse = (performance.now() / 1000) % 1
      const rm = reducedMotion()

      for (const it of itemsRef.current) {
        const progress = Math.min(1, (it.y + 20) / size)
        let badgeAlpha = 1
        if (progress < 1 / 3) badgeAlpha = 1
        else {
          const t = (progress - 1 / 3) / (1 / 3)
          badgeAlpha = Math.max(0, 1 - t)
        }

        const cx = it.col * colW + colW / 2
        if (badgeAlpha > 0.05) {
          const badge = renderBadge(it.char, variantRef.current, {
            scale: badgeScale,
            pulse: rm ? 0 : pulse,
            reducedMotion: rm,
          })
          const dpr = window.devicePixelRatio || 1
          const bw = badge.width / dpr
          const bh = badge.height / dpr
          ctx.save()
          ctx.globalAlpha = badgeAlpha
          ctx.drawImage(badge, cx - bw / 2, it.y, bw, bh)
          ctx.restore()
        } else {
          ctx.fillStyle = '#202124'
          ctx.font = `bold ${36 * (size / 560)}px Merriweather, "PT Serif", Georgia, serif`
          ctx.textAlign = 'center'
          ctx.fillText(it.char, cx, it.y + 32 * (size / 560))
        }
      }

      if (showMiss) {
        ctx.fillStyle = 'rgba(255,255,255,0.85)'
        ctx.fillRect(0, size * 0.3, size, size * 0.35)
        const b = renderBadge(showMiss.char, variantRef.current, {
          scale: 1.6,
          reducedMotion: true,
        })
        const dpr = window.devicePixelRatio || 1
        const bw = b.width / dpr
        const bh = b.height / dpr
        ctx.drawImage(b, size / 2 - bw / 2, size * 0.32, bw, bh)
        ctx.fillStyle = '#c5221f'
        ctx.font = '16px "Open Sans", sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(showMiss.label, size / 2, size * 0.32 + bh + 24)
      }

      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [phase, showMiss])

  // Keyboard
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.code === 'ShiftLeft') held.current.shiftLeft = true
      if (e.code === 'ShiftRight') held.current.shiftRight = true

      const inferred = variantFromPress(e.code, e.key)
      if (inferred && inferred !== variantRef.current) {
        variantRef.current = inferred
        setVariant(inferred)
        setVdPreferredLayout(inferred)
        clearBadgeCache()
        if (inferred === 'cs-QWERTY') {
          showTip('Máš české rozložení QWERTY – Y a Z jsou prohozené')
        }
      }

      if (phaseRef.current === 'blocked' || phaseRef.current === 'detect') {
        return
      }

      if (phaseRef.current === 'paused') {
        if (e.code === 'Space' || e.key === ' ') {
          e.preventDefault()
          pausedRef.current = false
          setPhase('play')
          phaseRef.current = 'play'
          lastTs.current = 0
        }
        return
      }

      if (phaseRef.current !== 'play') return

      const action = classifyKeydown(e, held.current)
      if (action.type === 'pause') {
        e.preventDefault()
        pausedRef.current = true
        setPhase('paused')
        phaseRef.current = 'paused'
        return
      }
      if (action.type !== 'char') return
      e.preventDefault()

      const result = resolveHit(
        itemsRef.current.map((i) => ({ char: i.char, y: i.y })),
        action.key,
        {
          shiftLeft: action.shiftLeft,
          shiftRight: action.shiftRight,
          capsLock: action.capsLock,
          variant: variantRef.current,
        },
      )

      if (result.kind === 'caps') {
        showTip('Máš zapnutý Caps Lock')
        return
      }

      if (result.kind === 'hit' || result.kind === 'hit_wrong_shift') {
        const item = itemsRef.current[result.index]
        if (!item) return
        const reaction = performance.now() - item.born
        recordVdKeyStat(item.char, { error: false, reactionMs: reaction })
        itemsRef.current = itemsRef.current.filter((_, i) => i !== result.index)
        hitsRef.current += 1
        const base =
          10 *
          SPEED[speedRef.current].level *
          (1 + speedUpsRef.current)
        scoreRef.current += Math.round(base * comboRef.current)
        comboRef.current = Math.min(2, comboRef.current + 0.1)
        recentKeys.current = [...recentKeys.current, { ok: true }].slice(-20)
        if (hitsRef.current % 10 === 0) {
          speedUpsRef.current += 1
          fallFactorRef.current = Math.max(0.45, fallFactorRef.current * 0.95)
        }
        if (result.kind === 'hit_wrong_shift') showTip(result.tip)
        syncHud()
        return
      }

      wrongRef.current += 1
      comboRef.current = 1
      recentKeys.current = [...recentKeys.current, { ok: false }].slice(-20)
      if (result.expected) {
        recordVdKeyStat(result.expected, { error: true, reactionMs: 0 })
        const k = `${result.expected}→${result.typed}`
        confusionMap.current.set(k, (confusionMap.current.get(k) ?? 0) + 1)
        if (
          result.expected === result.expected.toUpperCase() &&
          result.typed === result.typed.toLowerCase()
        ) {
          showTip('Velké písmeno: drž Shift druhou rukou')
        }
      }
      const okCount = recentKeys.current.filter((x) => x.ok).length
      const rate =
        recentKeys.current.length > 0
          ? okCount / recentKeys.current.length
          : 1
      if (recentKeys.current.length >= 20 && rate < 0.75) {
        fallFactorRef.current = Math.min(1, fallFactorRef.current * 1.1)
        showTip('Zpomalím, ať to stíháš')
      }
      if (!reducedMotion()) {
        setFlash(true)
        window.setTimeout(() => setFlash(false), 120)
      }
      syncHud()
    }

    const onUp = (e: KeyboardEvent) => {
      if (e.code === 'ShiftLeft') held.current.shiftLeft = false
      if (e.code === 'ShiftRight') held.current.shiftRight = false
    }

    const onVis = () => {
      if (document.hidden && phaseRef.current === 'play') {
        pausedRef.current = true
        setPhase('paused')
        phaseRef.current = 'paused'
      }
    }

    document.addEventListener('keydown', onDown)
    document.addEventListener('keyup', onUp)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      document.removeEventListener('keydown', onDown)
      document.removeEventListener('keyup', onUp)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  if (phase === 'detect') {
    return (
      <main className="page page-minihry">
        <p>Kontroluji rozložení klávesnice…</p>
      </main>
    )
  }

  if (phase === 'blocked') {
    return (
      <main className="page page-minihry">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Zpět
        </button>
        <header className="page-header">
          <h1>Přepni si klávesnici na češtinu</h1>
          <p>
            ChromeOS: Ctrl+Shift+mezerník · Windows: Win+mezerník
          </p>
        </header>
        <button
          type="button"
          className="primary-btn"
          onClick={async () => {
            const d = await detectLayout()
            const v = toVariant(d)
            if (v) {
              setVariant(v)
              variantRef.current = v
              setVdPreferredLayout(v)
              beginPlay()
            } else {
              showTip('Pořád to nevypadá na českou klávesnici')
            }
          }}
        >
          Zkusit znovu
        </button>
        {tip && <div className="minihry-hint">{tip}</div>}
      </main>
    )
  }

  if (phase === 'results') {
    const total = hud.hits + hud.wrong
    const acc =
      total > 0 ? Math.round((hud.hits / total) * 1000) / 10 : 100
    const prev = getVdRecord(LESSON_ALL, speed, HINT_MODE)
    const stats = getVdKeyStats()
    const fingerAcc = (
      ['L5', 'L4', 'L3', 'L2', 'L1', 'R1', 'R2', 'R3', 'R4', 'R5'] as const
    ).map((f) => {
      let att = 0
      let err = 0
      for (const [ch, s] of Object.entries(stats)) {
        const b = bindingForChar(ch, variant)
        if (b?.finger === f) {
          att += s.attempts
          err += s.errors
        }
      }
      return { f, name: FINGER_NAME[f], rate: att ? 1 - err / att : 1 }
    })
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
              : prev
                ? `Rekord: ${prev.score}`
                : null}
          </p>
        </header>
        <ul className="minihry-metrics">
          <li>Skóre: {hud.score}</li>
          <li>Přesnost: {acc} %</li>
          <li>
            Zásahy: {hud.hits} · chyby: {hud.wrong} · propuštěno:{' '}
            {hud.misses}
          </li>
        </ul>
        {confusions.length > 0 && (
          <section className="minihry-error-rules">
            <h2>Nejčastější záměny</h2>
            <ul>
              {confusions.map((c) => (
                <li key={`${c.expected}${c.typed}`}>
                  {c.expected} → {c.typed} ({c.n}×)
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="minihry-error-rules">
          <h2>Přesnost podle prstů</h2>
          <div className="vd-finger-bars">
            {fingerAcc.map((f) => (
              <div key={f.f} className="vd-finger-bar" title={f.name}>
                <div
                  className="vd-finger-fill"
                  style={{
                    height: `${Math.round(f.rate * 100)}%`,
                    background: `var(--vd-${f.f}, #888)`,
                  }}
                />
                <span>{f.f}</span>
              </div>
            ))}
          </div>
        </section>
        <div className="minihry-actions">
          <button type="button" className="primary-btn" onClick={beginPlay}>
            Znovu
          </button>
          <button type="button" className="secondary-btn" onClick={onBack}>
            Zpět
          </button>
        </div>
      </main>
    )
  }

  const poolSize = charsForLesson(LESSON_ALL, {
    variant,
    includeDigits: false,
  }).all.length

  return (
    <main
      className={`page page-minihry page-vd${flash ? ' is-shake' : ''}`}
    >
      <div className="vd-topbar">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Zpět
        </button>
        <h1 className="vd-lesson-title">Všemi deseti</h1>
        <label className="vd-speed-inline">
          Rychlost{' '}
          <select
            value={speed}
            onChange={(e) => setSpeed(e.target.value as VdSpeed)}
          >
            <option value="pomalu">Pomalu</option>
            <option value="stredne">Středně</option>
            <option value="rychle">Rychle</option>
          </select>
        </label>
        <button
          type="button"
          className="secondary-btn"
          onClick={() => {
            pausedRef.current = true
            setPhase('paused')
            phaseRef.current = 'paused'
          }}
        >
          Pauza
        </button>
        {import.meta.env.DEV && onOpenGallery ? (
          <button
            type="button"
            className="linkish"
            onClick={onOpenGallery}
          >
            Galerie
          </button>
        ) : null}
      </div>
      {phase === 'paused' && (
        <div className="minihry-pause" role="dialog">
          <p>Pauza – mezerník pokračuje</p>
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              pausedRef.current = false
              setPhase('play')
              phaseRef.current = 'play'
              lastTs.current = 0
            }}
          >
            Pokračovat
          </button>
        </div>
      )}
      {tip && <div className="minihry-hint">{tip}</div>}
      <div className="vd-field-wrap">
        <canvas ref={canvasRef} className="vd-canvas" />
      </div>
      <div className="vd-panel">
        <span>{'♥'.repeat(Math.max(0, Math.min(5, hud.lives)))}</span>
        <span>Skóre {hud.score}</span>
        <span>×{hud.combo.toFixed(1)}</span>
        <span>
          {hud.hits + hud.wrong > 0
            ? `${Math.round((hud.hits / (hud.hits + hud.wrong)) * 100)} %`
            : '—'}
        </span>
        <span className="vd-muted">{poolSize} znaků</span>
      </div>
      {targetLine && <div className="vd-target-line">{targetLine}</div>}
    </main>
  )
}
