export type Difficulty = 'lehka' | 'stredni' | 'tezka'
export type AsteroidMode = Difficulty | 'klidny'

export type TimelinePoint = { t: number; chars: number }

export type RaceRecord = {
  cpm: number
  accuracy: number
  timeline: TimelinePoint[]
  at: string
}

export type AsteroidRecord = {
  score: number
  wave: number
  at: string
}

export type VdSpeed = 'pomalu' | 'stredne' | 'rychle'
export type VdHintMode = 'vzdy' | 'mizi' | 'jenNova' | 'vypnuta'

export type VdRecord = {
  score: number
  accuracy: number
  at: string
}

export type VdKeyStat = {
  attempts: number
  errors: number
  reactionSumMs: number
}

type Store = {
  zavod: Partial<Record<Difficulty, Record<string, RaceRecord>>>
  asteroidy: Partial<Record<Exclude<AsteroidMode, 'klidny'>, AsteroidRecord>>
  recentRaceIds: string[]
  recentAsteroidIds: string[]
  sound: boolean
  vsemiDeseti: Record<string, VdRecord>
  vdCompletedLessons: (number | 'weak')[]
  vdKeyStats: Record<string, VdKeyStat>
  vdLayout?: 'cs-QWERTZ' | 'cs-QWERTY'
}

const KEY = 'typografie_minihry_records'

const empty: Store = {
  zavod: {},
  asteroidy: {},
  recentRaceIds: [],
  recentAsteroidIds: [],
  sound: false,
  vsemiDeseti: {},
  vdCompletedLessons: [],
  vdKeyStats: {},
}

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...empty, ...(JSON.parse(raw) as Store) }
  } catch {
    /* ignore */
  }
  return { ...empty }
}

function write(store: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store))
  } catch {
    /* ignore */
  }
}

export function vdRecordKey(
  lessonId: number | 'weak',
  speed: VdSpeed,
  hint: VdHintMode,
): string {
  return `${lessonId}|${speed}|${hint}`
}

export function getVdRecord(
  lessonId: number | 'weak',
  speed: VdSpeed,
  hint: VdHintMode,
): VdRecord | null {
  return read().vsemiDeseti[vdRecordKey(lessonId, speed, hint)] ?? null
}

export function saveVdRecord(
  lessonId: number | 'weak',
  speed: VdSpeed,
  hint: VdHintMode,
  record: VdRecord,
): boolean {
  const store = read()
  const k = vdRecordKey(lessonId, speed, hint)
  const prev = store.vsemiDeseti[k]
  const isNew = !prev || record.score > prev.score
  if (!isNew) return false
  store.vsemiDeseti = { ...store.vsemiDeseti, [k]: record }
  write(store)
  return true
}

export function markVdLessonCompleted(lessonId: number | 'weak') {
  const store = read()
  if (store.vdCompletedLessons.includes(lessonId)) return
  store.vdCompletedLessons = [...store.vdCompletedLessons, lessonId]
  write(store)
}

export function getVdCompletedLessons(): (number | 'weak')[] {
  return read().vdCompletedLessons
}

export function recordVdKeyStat(
  char: string,
  opts: { error: boolean; reactionMs: number },
) {
  const store = read()
  const prev = store.vdKeyStats[char] ?? {
    attempts: 0,
    errors: 0,
    reactionSumMs: 0,
  }
  store.vdKeyStats = {
    ...store.vdKeyStats,
    [char]: {
      attempts: prev.attempts + 1,
      errors: prev.errors + (opts.error ? 1 : 0),
      reactionSumMs: prev.reactionSumMs + opts.reactionMs,
    },
  }
  write(store)
}

export function getVdKeyStats(): Record<string, VdKeyStat> {
  return read().vdKeyStats
}

export function weakKeyWeights(): Map<string, number> {
  const stats = getVdKeyStats()
  const map = new Map<string, number>()
  for (const [ch, s] of Object.entries(stats)) {
    if (s.attempts < 5) continue
    const rate = s.errors / s.attempts
    map.set(ch, 1 + 4 * rate)
  }
  return map
}

export function getVdPreferredLayout(): 'cs-QWERTZ' | 'cs-QWERTY' | null {
  return read().vdLayout ?? null
}

export function setVdPreferredLayout(layout: 'cs-QWERTZ' | 'cs-QWERTY') {
  const store = read()
  store.vdLayout = layout
  write(store)
}

export function getRaceRecord(
  difficulty: Difficulty,
  textId: string,
): RaceRecord | null {
  return read().zavod[difficulty]?.[textId] ?? null
}

export function saveRaceRecord(
  difficulty: Difficulty,
  textId: string,
  record: RaceRecord,
): boolean {
  const store = read()
  const prev = store.zavod[difficulty]?.[textId]
  const isNew = !prev || record.cpm > prev.cpm
  if (!isNew) return false
  store.zavod[difficulty] = {
    ...(store.zavod[difficulty] ?? {}),
    [textId]: record,
  }
  write(store)
  return true
}

export function getAsteroidRecord(
  mode: Exclude<AsteroidMode, 'klidny'>,
): AsteroidRecord | null {
  return read().asteroidy[mode] ?? null
}

export function saveAsteroidRecord(
  mode: Exclude<AsteroidMode, 'klidny'>,
  record: AsteroidRecord,
): boolean {
  const store = read()
  const prev = store.asteroidy[mode]
  const isNew = !prev || record.score > prev.score
  if (!isNew) return false
  store.asteroidy = { ...store.asteroidy, [mode]: record }
  write(store)
  return true
}

export function pushRecentRaceId(id: string) {
  const store = read()
  store.recentRaceIds = [id, ...store.recentRaceIds.filter((x) => x !== id)].slice(
    0,
    5,
  )
  write(store)
}

export function getRecentRaceIds(): string[] {
  return read().recentRaceIds
}

export function pushRecentAsteroidId(id: string) {
  const store = read()
  store.recentAsteroidIds = [
    id,
    ...store.recentAsteroidIds.filter((x) => x !== id),
  ].slice(0, 10)
  write(store)
}

export function getRecentAsteroidIds(): string[] {
  return read().recentAsteroidIds
}

export function getSoundEnabled(): boolean {
  return read().sound
}

export function setSoundEnabled(on: boolean) {
  const store = read()
  store.sound = on
  write(store)
}
