import type { LevelDefinition } from './types'

const level03TitlePhone: LevelDefinition = {
  id: 'level-03-title-phone',
  title: 'Nadpis a telefon',
  order: 3,
  assignment:
    'Udělej text „Nadpis“ stylem Nadpis a oprav telefonní číslo (oddělené trojice).',
  initialHtml:
    '<p>Nadpis</p><p>moje telefoní číslo je +420789458260</p>',
  checks: [
    {
      type: 'hasHeadingText',
      level: 1,
      text: 'Nadpis',
      failMessage: 'Nadpis nemá správný styl.',
    },
    {
      type: 'containsText',
      text: '+420 789 458 260',
      failMessage: 'Telefonní číslo není správně rozdělené.',
    },
  ],
}

export default level03TitlePhone
