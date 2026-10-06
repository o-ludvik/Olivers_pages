export type AsteroidLabel = {
  id: string
  tags: string[]
  text: string
  level: 1 | 2 | 3
}

function parse(level: 1 | 2 | 3, raw: string): AsteroidLabel[] {
  return raw
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [id, tags, ...rest] = line.split(' | ')
      const text = rest.join(' | ').replace(/~/g, '\u00A0')
      return {
        id: id!.trim(),
        tags: tags!.split(',').map((t) => t.trim()),
        text,
        level,
      }
    })
}

const L1 = `
A1-01 | uvozovky | „ahoj“
A1-02 | uvozovky | „pozor“
A1-03 | uvozovky | ‚mlsoun‘
A1-04 | spojovnik | e-mail
A1-05 | spojovnik | bude-li
A1-06 | spojovnik | on-line
A1-07 | spojovnik | česko-německý
A1-08 | pomlcka | 1914–1918
A1-09 | pomlcka | Sparta–Slavia
A1-10 | cas, pomlcka | 9–17~h
A1-11 | cas | 2:05:27,15
A1-12 | vypustka | tak…
A1-13 | vypustka | no…
A1-14 | jednotky | 25~°C
A1-15 | jednotky | −3~°C
A1-16 | jednotky | 30° svah
A1-17 | jednotky | 10~%
A1-18 | jednotky | 10% sleva
A1-19 | jednotky | 5~kg
A1-20 | lomitko | km/h
A1-21 | lomitko | 2026/2027
A1-22 | lomitko | student/ka
A1-23 | zavorky | zpracoval(a)
A1-24 | mena | 100~Kč
A1-25 | mena | 100Kč bankovka
A1-26 | matematika | 2 + 3 = 5
A1-27 | matematika | 2 × 3
A1-28 | matematika | poměr 4 : 1
A1-29 | matematika | skóre 2:1
A1-30 | cisla | 25~661
A1-31 | cislovky | 12.~student
A1-32 | cislovky | do 18~let
A1-33 | cislovky | 8kilometrový
A1-34 | cislovky | 15letý
A1-35 | cislovky | 20procentní
A1-36 | zkratky | ČR
A1-37 | zkratky | popř.
A1-38 | zkratky | pí Nováková
A1-39 | zkratky | cca
`

const L2 = `
A2-01 | pomlcka | dálnice Praha – Brno
A2-02 | pomlcka, datum | 10.–15.~října
A2-03 | datum | 6.~října 2026
A2-04 | datum | 6.~10. 2026
A2-05 | datum | 06.10.2026
A2-06 | datum | 2026-10-06
A2-07 | cas | oběd 12.00–12.45
A2-08 | cas, pomlcka | po–pá 8.00–15.00
A2-09 | tituly | Ing.~Jan Novák
A2-10 | tituly | Jan Novák, Ph.D.
A2-11 | tituly | prof.~Horká
A2-12 | tituly | G. W. Bush
A2-13 | firmy | Pekárna Novák, s. r. o.
A2-14 | firmy | Laurel & Hardy
A2-15 | zkratky, zalomeni | tzv.~klikání
A2-16 | zkratky, zalomeni | tj.~v~pondělí
A2-17 | lomitko | ZŠ / střední škola
A2-18 | jednotky, lomitko | 150~Kč/h
A2-19 | jednotky | 65~m²
A2-20 | cisla | 400~000~obyvatel
A2-21 | cisla, mena | 1~000~000~Kč
A2-22 | jednotky | 3,5~km
A2-23 | jednotky | sleva 10~%
A2-24 | cislovky | 2.~místo
A2-25 | cislovky, zalomeni | 7.~kapitola
A2-26 | zalomeni | v~pondělí
A2-27 | zalomeni | k~řece
A2-28 | zalomeni | s~třídou
A2-29 | zalomeni | a~u~mostu
A2-30 | uvozovky | „Malý princ“
A2-31 | uvozovky | Řekl: „Ne!“
A2-32 | vypustka | jedna, dva, …, deset
`

const L3 = `
A3-01 | tituly | Mgr.~Petra Malá, Ph.D.
A3-02 | firmy, zalomeni | Kavárna U~Lípy, s. r. o.
A3-03 | cas, pomlcka | pá–ne 7.00–12.00
A3-04 | pomlcka, datum | 10.~října – 15.~října
A3-05 | pomlcka, cas | Olomouc – Brno v~7.45
A3-06 | mena | platí 120~Kč pokutu!
A3-07 | jednotky | úhel 65°12′10″
A3-08 | uvozovky | „Prý jsem ‚mlsoun‘!“
A3-09 | cislovky, pomlcka | 1.–4.~ročník
A3-10 | cislovky | 15metrový most
A3-11 | matematika | 2 × 3 + 4 = 10
A3-12 | mena | vstupné 80~Kč
A3-13 | jednotky | teplota −5~°C
A3-14 | cisla | 12,76; 98,50; 45,67
A3-15 | zkratky, jednotky | cca 45~min
A3-16 | vypustka | tak… no… nevím
A3-17 | cislovky | do 18~let zdarma
A3-18 | lomitko | brigádník/brigádnice
`

export const ASTEROID_LABELS: AsteroidLabel[] = [
  ...parse(1, L1),
  ...parse(2, L2),
  ...parse(3, L3),
]

export function labelsForLevels(levels: number[]): AsteroidLabel[] {
  return ASTEROID_LABELS.filter((l) => levels.includes(l.level))
}
