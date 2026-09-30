import type { CheckOutcome } from '../levels/types'

type CheckResultProps = {
  outcomes: CheckOutcome[] | null
}

export function CheckResult({ outcomes }: CheckResultProps) {
  if (!outcomes) {
    return null
  }

  const allPassed = outcomes.every((outcome) => outcome.passed)

  return (
    <div
      className={`check-result${allPassed ? ' is-success' : ' is-fail'}`}
      role="status"
    >
      <p className="check-result-summary">
        {allPassed ? 'Výborně, level splněn!' : 'Ještě to není ono.'}
      </p>
      <ul>
        {outcomes.map((outcome, index) => (
          <li
            key={`${outcome.check.type}-${index}`}
            className={outcome.passed ? 'passed' : 'failed'}
          >
            {outcome.passed ? 'OK' : outcome.check.failMessage}
          </li>
        ))}
      </ul>
    </div>
  )
}
