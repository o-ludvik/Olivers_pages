import type { Check } from '../levels/types'

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function hasBoldText(html: string, text: string): boolean {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const boldNodes = doc.querySelectorAll('strong, b')
  const expected = normalizeText(text)

  for (const node of boldNodes) {
    if (normalizeText(node.textContent ?? '') === expected) {
      return true
    }
  }

  return false
}

function hasExactText(html: string, text: string): boolean {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return (doc.body.textContent ?? '').trim() === text
}

function hasHeadingText(
  html: string,
  level: 1 | 2 | 3 | 4,
  text: string,
): boolean {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const headings = doc.querySelectorAll(`h${level}`)
  const expected = normalizeText(text)

  for (const heading of headings) {
    if (normalizeText(heading.textContent ?? '') === expected) {
      return true
    }
  }

  return false
}

function containsText(html: string, text: string): boolean {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const plain = doc.body.textContent ?? ''
  return plain.includes(text)
}

export function evaluateCheck(check: Check, html: string): boolean {
  switch (check.type) {
    case 'hasBoldText':
      return hasBoldText(html, check.text)
    case 'hasExactText':
      return hasExactText(html, check.text)
    case 'hasHeadingText':
      return hasHeadingText(html, check.level, check.text)
    case 'containsText':
      return containsText(html, check.text)
  }
}
