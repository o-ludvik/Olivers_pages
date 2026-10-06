import type { CheckOutcome } from '../levels/types'

type CheckResultProps = {
  outcomes: CheckOutcome[] | null
}

function failMessages(outcomes: CheckOutcome[]): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const outcome of outcomes) {
    if (outcome.passed) continue
    const raw = outcome.message?.trim() || 'Kontrola neprošla.'
    for (const line of raw.split('\n')) {
      const msg = line.trim()
      if (!msg || seen.has(msg)) continue
      seen.add(msg)
      out.push(msg)
    }
  }
  return out
}

export function CheckResult({ outcomes }: CheckResultProps) {
  if (!outcomes) return null

  const allPassed = outcomes.every((o) => o.passed)
  const fails = failMessages(outcomes)

  return (
    <div
      className={`check-result${allPassed ? ' is-success' : ' is-fail'}`}
      role="status"
    >
      {allPassed ? (
        <p className="check-result-summary">Všechny kontroly prošly.</p>
      ) : (
        <>
          <p className="check-result-summary">Ještě něco oprav:</p>
          <ul>
            {fails.map((msg) => (
              <li key={msg} className="fail">
                {msg}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
