const COMPLETED_KEY = 'typografie_completed'
const ATTEMPTS_KEY = 'typografie_attempts'
const SUBMITTED_KEY = 'typografie_submitted'
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365 * 10

function readCookie(name: string): string | null {
  const prefix = `${name}=`
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
  if (!match) return null
  return decodeURIComponent(match.slice(prefix.length))
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const fromLs = localStorage.getItem(key)
    if (fromLs) return JSON.parse(fromLs) as T
  } catch {
    /* ignore */
  }
  return fallback
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getCompletedLevelIds(): string[] {
  const raw = readCookie(COMPLETED_KEY)
  if (!raw) return []
  return raw
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
}

export function isLevelCompleted(levelId: string): boolean {
  return getCompletedLevelIds().includes(levelId)
}

export function markLevelCompleted(levelId: string) {
  const current = new Set(getCompletedLevelIds())
  if (current.has(levelId)) return
  current.add(levelId)
  writeCookie(COMPLETED_KEY, [...current].join(','))
}

export function getAttempts(levelId: string): number {
  const map = readJson<Record<string, number>>(ATTEMPTS_KEY, {})
  return map[levelId] ?? 0
}

export function incrementAttempts(levelId: string): number {
  const map = readJson<Record<string, number>>(ATTEMPTS_KEY, {})
  map[levelId] = (map[levelId] ?? 0) + 1
  writeJson(ATTEMPTS_KEY, map)
  return map[levelId]
}

export function resetAttempts(levelId: string) {
  const map = readJson<Record<string, number>>(ATTEMPTS_KEY, {})
  map[levelId] = 0
  writeJson(ATTEMPTS_KEY, map)
}

export type Submission = {
  taskId: string
  plainText: string
  html: string
  checklist?: string[]
  attachmentDataUrl?: string
  at: string
}

export function markSubmitted(submission: Submission) {
  const map = readJson<Record<string, Submission>>(SUBMITTED_KEY, {})
  map[submission.taskId] = submission
  writeJson(SUBMITTED_KEY, map)
  markLevelCompleted(submission.taskId)
}

export function isSubmitted(levelId: string): boolean {
  const map = readJson<Record<string, Submission>>(SUBMITTED_KEY, {})
  return Boolean(map[levelId])
}

export function exportSubmissionsJson(): string {
  return JSON.stringify(readJson(SUBMITTED_KEY, {}), null, 2)
}
