export type Check =
  | {
      type: 'hasBoldText'
      text: string
      failMessage: string
    }
  | {
      type: 'hasExactText'
      text: string
      failMessage: string
    }
  | {
      type: 'hasHeadingText'
      level: 1 | 2 | 3 | 4
      text: string
      failMessage: string
    }
  | {
      type: 'containsText'
      text: string
      failMessage: string
    }

export type LevelDefinition = {
  id: string
  title: string
  order: number
  assignment: string
  initialHtml: string
  checks: Check[]
}

export type CheckOutcome = {
  check: Check
  passed: boolean
}
