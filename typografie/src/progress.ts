const COOKIE_NAME = 'typografie_completed'
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

export function getCompletedLevelIds(): string[] {
  const raw = readCookie(COOKIE_NAME)
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
  writeCookie(COOKIE_NAME, [...current].join(','))
}
