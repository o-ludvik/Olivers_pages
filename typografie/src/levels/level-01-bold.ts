import type { LevelDefinition } from './types'

const level01Bold: LevelDefinition = {
  id: 'level-01-bold',
  title: 'Tučný text',
  order: 1,
  assignment: 'Udělej text „test“ tučným.',
  initialHtml: '<p>test</p>',
  checks: [
    {
      type: 'hasBoldText',
      text: 'test',
      failMessage: 'Text není tučný.',
    },
  ],
}

export default level01Bold
