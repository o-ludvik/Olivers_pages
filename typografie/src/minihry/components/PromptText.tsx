import { SPECIAL_CHAR_SET } from '../chars'
import type { Difficulty } from '../charMatches'

type PromptTextProps = {
  text: string
  /** Characters already completed (absolute index into full text). */
  done: number
  /** Index of current char within full text. */
  current: number
  /** Error range start (absolute), or -1. */
  errorFrom?: number
  difficulty: Difficulty
  className?: string
}

function isSpecial(ch: string) {
  return SPECIAL_CHAR_SET.has(ch)
}

export function PromptText({
  text,
  done,
  current,
  errorFrom = -1,
  difficulty,
  className,
}: PromptTextProps) {
  const highlightSpecial = difficulty === 'lehka'
  const markNbsp = difficulty === 'tezka'

  return (
    <p className={className ?? 'minihry-prompt'} lang="cs">
      {[...text].map((ch, i) => {
        let cls = 'minihry-ch'
        if (errorFrom >= 0 && i >= errorFrom && i < current) cls += ' is-error'
        else if (i < done) cls += ' is-done'
        else if (i === current) cls += ' is-current'
        if (i >= done && i < text.length) {
          // current word underline handled by parent for race; keep char mark
        }
        if (highlightSpecial && isSpecial(ch) && ch !== '\u00A0') {
          cls += ' is-special'
        }
        if (markNbsp && ch === '\u00A0') cls += ' is-nbsp'
        else if (!markNbsp && ch === '\u00A0') {
          // show as regular space visually
        }

        const display = ch === '\u00A0' && !markNbsp ? ' ' : ch === '\u00A0' ? '\u00A0' : ch
        const title =
          ch === '\u00A0' && markNbsp
            ? 'nezlomitelná mezera'
            : highlightSpecial && isSpecial(ch)
              ? `U+${ch.codePointAt(0)!.toString(16).toUpperCase()}`
              : undefined

        return (
          <span key={i} className={cls} title={title}>
            {display === '\u00A0' ? '\u00A0' : display}
          </span>
        )
      })}
    </p>
  )
}
