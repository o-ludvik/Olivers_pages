import type { LevelDefinition } from './types'

const level02Date: LevelDefinition = {
  id: 'level-02-date',
  title: 'Mezery v datu',
  order: 2,
  assignment: 'Oprav datum tak, aby za tečkami byly mezery.',
  initialHtml: '<p>17.10.2001</p>',
  checks: [
    {
      type: 'hasExactText',
      text: '17. 10. 2001',
      failMessage: 'Datum nemá správné mezery.',
    },
  ],
}

export default level02Date
