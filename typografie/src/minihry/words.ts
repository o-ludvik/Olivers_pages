/**
 * Split race prompt into words: segments up to and including the next
 * regular space U+0020. NBSP does not split (§2.3).
 */
export function splitRaceWords(text: string): string[] {
  const words: string[] = []
  let start = 0
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') {
      words.push(text.slice(start, i + 1))
      start = i + 1
    }
  }
  if (start < text.length) words.push(text.slice(start))
  return words
}
