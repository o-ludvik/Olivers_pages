const HINTS: Record<
  string,
  { name: string; linux: string; mac: string; win: string }
> = {
  '„': {
    name: 'uvozovky dole',
    linux: 'Ctrl+Shift+U 201E mezerník',
    mac: 'Alt+Shift+W (nebo znaková paleta)',
    win: 'Alt+0132 (numpad)',
  },
  '“': {
    name: 'uvozovky nahoře',
    linux: 'Ctrl+Shift+U 201C mezerník',
    mac: 'Alt+[',
    win: 'Alt+0147',
  },
  '‚': {
    name: 'jednoduché dole',
    linux: 'Ctrl+Shift+U 201A mezerník',
    mac: 'Alt+Shift+0',
    win: 'Alt+0130',
  },
  '‘': {
    name: 'jednoduché nahoře',
    linux: 'Ctrl+Shift+U 2018 mezerník',
    mac: 'Alt+]',
    win: 'Alt+0145',
  },
  '–': {
    name: 'pomlčka',
    linux: 'Ctrl+Shift+U 2013 mezerník',
    mac: 'Option+-',
    win: 'Alt+0150',
  },
  '…': {
    name: 'výpustka',
    linux: 'Ctrl+Shift+U 2026 mezerník',
    mac: 'Option+;',
    win: 'Alt+0133',
  },
  '\u00A0': {
    name: 'nezlomitelná mezera',
    linux: 'Ctrl+Shift+U 00A0 mezerník',
    mac: 'Option+mezerník',
    win: 'Alt+0160',
  },
  '°': {
    name: 'stupeň',
    linux: 'Ctrl+Shift+U 00B0 mezerník',
    mac: 'Option+Shift+8',
    win: 'Alt+0176',
  },
  '×': {
    name: 'krát',
    linux: 'Ctrl+Shift+U 00D7 mezerník',
    mac: 'Option+Shift+9',
    win: 'Alt+0215',
  },
  '−': {
    name: 'minus',
    linux: 'Ctrl+Shift+U 2212 mezerník',
    mac: 'znaková paleta',
    win: 'znaková mapa',
  },
  '′': {
    name: 'minuta',
    linux: 'Ctrl+Shift+U 2032 mezerník',
    mac: 'znaková paleta',
    win: 'znaková mapa',
  },
  '″': {
    name: 'vteřina',
    linux: 'Ctrl+Shift+U 2033 mezerník',
    mac: 'znaková paleta',
    win: 'znaková mapa',
  },
}

type CharHintsProps = { chars: string[] }

export function CharHints({ chars }: CharHintsProps) {
  return (
    <div className="char-hints" aria-label="Jak napsat speciální znaky">
      {chars.map((ch) => {
        const hint = HINTS[ch] ?? {
          name: ch,
          linux: 'Ctrl+Shift+U + kód',
          mac: 'znaková paleta',
          win: 'Alt + kód',
        }
        return (
          <div key={ch} className="char-hint">
            <span className="char-hint-glyph" aria-hidden>
              {ch === '\u00A0' ? '°nbsp' : ch}
            </span>
            <span className="char-hint-meta">
              <strong>{hint.name}</strong>
              <br />
              Linux: {hint.linux}
              <br />
              Mac: {hint.mac}
              <br />
              Windows: {hint.win}
            </span>
          </div>
        )
      })}
    </div>
  )
}
