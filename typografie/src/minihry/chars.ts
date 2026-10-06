/** Special characters for the mini-game char bar (spec §1.2). */

export type SpecialChar = {
  char: string
  label: string
  linux: string
  win: string
}

export const SPECIAL_CHARS: SpecialChar[] = [
  { char: '„', label: 'české uvozovky – otevírací', linux: '201E', win: '0132' },
  { char: '“', label: 'české uvozovky – zavírací', linux: '201C', win: '0147' },
  { char: '‚', label: 'jednoduché uvozovky – otevírací', linux: '201A', win: '0130' },
  { char: '‘', label: 'jednoduché uvozovky – zavírací', linux: '2018', win: '0145' },
  { char: '–', label: 'pomlčka', linux: '2013', win: '0150' },
  { char: '…', label: 'výpustka', linux: '2026', win: '0133' },
  { char: '\u00A0', label: 'nezlomitelná mezera', linux: '00A0', win: '0160' },
  { char: '°', label: 'stupeň', linux: '00B0', win: '0176' },
  { char: '×', label: 'krát', linux: '00D7', win: '0215' },
  { char: '−', label: 'minus', linux: '2212', win: '–' },
  { char: '′', label: 'úhlová minuta', linux: '2032', win: '–' },
  { char: '″', label: 'úhlová vteřina', linux: '2033', win: '–' },
  { char: '²', label: 'na druhou', linux: '00B2', win: '–' },
]

export const SPECIAL_CHAR_SET = new Set(SPECIAL_CHARS.map((c) => c.char))

export function tooltipFor(ch: SpecialChar): string {
  const win =
    ch.win === '–' ? 'znaková mapa' : `Alt+${ch.win}`
  return `${ch.label}\nCtrl+Shift+U ${ch.linux}\n${win}`
}
