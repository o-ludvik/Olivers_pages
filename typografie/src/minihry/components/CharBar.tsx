import { SPECIAL_CHARS, tooltipFor } from '../chars'

type CharBarProps = {
  onInsert: (char: string) => void
  /** Always-visible keyboard codes under the buttons. */
  showCodes?: boolean
}

export function CharBar({ onInsert, showCodes = false }: CharBarProps) {
  return (
    <div className="minihry-charbar-wrap">
      <div className="minihry-charbar" aria-label="Lišta speciálních znaků">
        {SPECIAL_CHARS.map((item) => (
          <button
            key={item.linux}
            type="button"
            className="minihry-charbar-btn"
            title={tooltipFor(item)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onInsert(item.char)}
          >
            {item.char === '\u00A0' ? '⍽' : item.char}
          </button>
        ))}
      </div>
      {showCodes ? (
        <ul className="minihry-char-codes" aria-label="Jak napsat znaky z klávesnice">
          {SPECIAL_CHARS.map((item) => {
            const win =
              item.win === '–' ? 'znaková mapa' : `Alt+${item.win}`
            const glyph = item.char === '\u00A0' ? '⍽' : item.char
            return (
              <li key={item.linux}>
                <span className="minihry-char-codes-glyph">{glyph}</span>
                <span className="minihry-char-codes-label">{item.label}</span>
                <span className="minihry-char-codes-keys">
                  Ctrl+Shift+U {item.linux}
                  {' · '}
                  {win}
                </span>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
