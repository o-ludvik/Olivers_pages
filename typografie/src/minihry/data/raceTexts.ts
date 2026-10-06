import type { Difficulty } from '../charMatches'

export type RaceText = {
  id: string
  tags: string[]
  text: string
  difficulty: Difficulty
}

function parse(
  difficulty: Difficulty,
  raw: string,
): RaceText[] {
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
        difficulty,
      }
    })
}

const LEHKA = `
R-L01 | uvozovky | Babička se zeptala: „Kdo snědl ten koláč?“
R-L02 | pomlcka, zalomeni | Válka trvala v~letech 1914–1918.
R-L03 | spojovnik | Pošli mi to e-mailem, bude-li čas.
R-L04 | jednotky, zalomeni | Venku je 25~°C a~fouká.
R-L05 | mena | Lístek na koncert stál 500~Kč.
R-L06 | vypustka | Jestli si to nepřečteš, tak…
R-L07 | cislovky | Do 18~let je vstup zdarma.
R-L08 | jednotky | Na všechno je dnes sleva 20~%.
R-L09 | pomlcka | Dálnice Praha – Brno je zase ucpaná.
R-L10 | matematika | Naši florbalisté vyhráli 3:1.
R-L11 | datum, cas, zalomeni | Sraz je v~sobotu 17.~října v~9.30.
R-L12 | zavorky | Objednávku zpracoval(a) vedoucí prodejny.
`

const STREDNI = `
R-S01 | datum, pomlcka, zkratky, zalomeni | Ve čtvrtek 9.~října jsme jeli vlakem Olomouc – Brno a~cesta trvala cca 1~hodinu.
R-S02 | uvozovky, mena | Paní učitelka řekla: „Kdo ztratí lístek, platí pokutu 120~Kč!“
R-S03 | jednotky, cislovky, zalomeni | Trať měří 3,5~km a~vede po 15metrovém mostě.
R-S04 | matematika, zalomeni | Smíchej vodu a~sirup v~poměru 4 : 1, jinak to bude moc sladké.
R-S05 | tituly, zalomeni | Na přednášku přišel Ing.~Jan Novák, Ph.D., a~hned začal mluvit.
R-S06 | firmy | Rohlíky do školního bufetu dodává Pekárna Novák, s. r. o.
R-S07 | cisla, jednotky, zalomeni | Brno má asi 400~000~obyvatel a~rozlohu 230~km².
R-S08 | uvozovky | Honza se bránil: „Táta říkal, že jsem ‚mlsoun‘!“
R-S09 | pomlcka, datum, mena | Výstava potrvá 10.~října – 15.~října a~vstupné je 80~Kč.
R-S10 | zkratky, zalomeni | Do soutěže se přihlásilo 24~týmů z~celého kraje, tj.~o~5 víc než loni.
R-S11 | zkratky, zalomeni | Na tzv.~klikání stačí i~malé dítě, ale na psaní všemi deseti už ne.
R-S12 | matematika | Spočítej: 2 + 3 × 4 = 14.
`

const TEZKA = `
R-T01 | datum, pomlcka, cas, tituly, uvozovky, mena, zkratky, zavorky, zalomeni | Ve čtvrtek 9.~října jsme vyrazili vlakem Olomouc – Brno v~7.45. Paní učitelka Mgr.~Dvořáková nám cestou řekla: „Kdo ztratí lístek, platí 120~Kč pokutu!“ V~Brně jsme navštívili tzv.~Labyrint pod Zelným trhem (vstupné 160~Kč, studenti 120~Kč).
R-T02 | datum, cas, mena, cislovky, jednotky, zalomeni | Sportovní den proběhne 15.~10. 2026 v~čase 8.00–13.00. Startovné je 50~Kč, pro 1.~ročníky zdarma. Trať měří 3,5~km a~vede po 15metrovém mostě.
R-T03 | cislovky, matematika, uvozovky, zalomeni | Florbalisté vybojovali 2.~místo. Ve finále prohráli těsně 3:4. Kapitán, kterému je teprve 15~let, po zápase řekl: „Trenér nám říkal, ať hrajeme ‚v~klidu‘. Nepovedlo se.“
R-T04 | jednotky, zalomeni | Voda pokrývá asi 71~% povrchu Země. Sladká voda z~toho tvoří jen 2,5~%. Za normálního tlaku voda vře při 100~°C a~mrzne při 0~°C.
R-T05 | firmy, lomitko, jednotky, pomlcka, cas, zalomeni | Kavárna U~Lípy, s. r. o., hledá brigádníka/brigádnici na víkendy. Nabízí 150~Kč/h, směny pá–ne 7.00–12.00 a~příjemný kolektiv.
R-T06 | tituly, zkratky, zalomeni | Přednášku vede prof.~Petr Malý, CSc., a~po něm vystoupí PhDr.~Jana Horká, Ph.D. Vstup je zdarma, kapacita sálu je cca 120~míst.
R-T07 | jednotky, zkratky, vypustka, zalomeni | Recept: 250~g mouky, 200~g cukru, 4~vejce a~125~ml mléka. Troubu předehřej na 180~°C a~peč cca 45~min. Hotovou bábovku pocukruj… pokud ti nějaká zbude.
R-T08 | lomitko, datum, pomlcka, mena, zalomeni | Školní rok 2026/2027 začal 1.~září. Výlet do Vídně proběhne 12.~11. – 13.~11. a~stojí 1290~Kč včetně ubytování.
R-T09 | matematika, uvozovky, vypustka, zalomeni | „Kolik je 12 × 12?“ zeptal se Ondra. „144… asi,“ zamumlala Klára a~raději se podívala do kalkulačky.
R-T10 | cisla, jednotky, pomlcka, zalomeni | Brno má asi 400~000~obyvatel a~rozlohu přibližně 230~km². Je druhým největším městem v~Česku. Dálnice D1 Praha – Brno měří zhruba 200~km.
`

export const RACE_TEXTS: RaceText[] = [
  ...parse('lehka', LEHKA),
  ...parse('stredni', STREDNI),
  ...parse('tezka', TEZKA),
]

export function raceTextsFor(difficulty: Difficulty): RaceText[] {
  return RACE_TEXTS.filter((t) => t.difficulty === difficulty)
}

export function pickRaceText(
  difficulty: Difficulty,
  recentIds: string[],
  preferId?: string,
): RaceText {
  const pool = raceTextsFor(difficulty)
  if (preferId) {
    const found = pool.find((t) => t.id === preferId)
    if (found) return found
  }
  const available = pool.filter((t) => !recentIds.includes(t.id))
  const use = available.length > 0 ? available : pool
  return use[Math.floor(Math.random() * use.length)]!
}
