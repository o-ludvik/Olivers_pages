export type FontClassification = 'serif' | 'sans'

export type FontOption = {
  /** Canonical name stored in TipTap / DocModel (matches catalog prefills). */
  value: string
  label: string
  classification: FontClassification
  /** CSS font-family stack for rendering. */
  stack: string
}

export const FONTS: FontOption[] = [
  {
    value: 'Arial',
    label: 'Arial',
    classification: 'sans',
    stack: 'Arial, Helvetica, sans-serif',
  },
  {
    value: 'Roboto',
    label: 'Roboto',
    classification: 'sans',
    stack: '"Roboto", Arial, sans-serif',
  },
  {
    value: 'Open Sans',
    label: 'Open Sans',
    classification: 'sans',
    stack: '"Open Sans", Arial, sans-serif',
  },
  {
    value: 'Merriweather',
    label: 'Merriweather',
    classification: 'serif',
    stack: '"Merriweather", Georgia, serif',
  },
  {
    value: 'Lora',
    label: 'Lora',
    classification: 'serif',
    stack: '"Lora", Georgia, serif',
  },
  {
    value: 'PT Serif',
    label: 'PT Serif',
    classification: 'serif',
    stack: '"PT Serif", Georgia, serif',
  },
]

/** First family name, quotes stripped. */
export function normalizeFontName(family: string | null | undefined): string {
  if (!family) return ''
  return family.split(',')[0]?.replace(/['"]/g, '').trim() ?? ''
}

export function findFont(family: string | null | undefined): FontOption | undefined {
  const key = normalizeFontName(family).toLowerCase()
  if (!key) return undefined
  return FONTS.find(
    (f) =>
      f.value.toLowerCase() === key ||
      f.label.toLowerCase() === key ||
      normalizeFontName(f.stack).toLowerCase() === key,
  )
}

export function fontClassification(
  family: string | null | undefined,
): FontClassification | undefined {
  return findFont(family)?.classification
}

/** Value to pass to TipTap setFontFamily (quote multi-word names). */
export function tipTapFontValue(font: FontOption): string {
  return font.value.includes(' ') ? `"${font.value}"` : font.value
}
