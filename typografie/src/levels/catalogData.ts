/**
 * Raw task catalog extracted from typografie-ulohy-cursor.md §§5–7.
 * `~` in solutions/prefills is expanded to U+00A0 (NBSP).
 * `{{a|b}}` alternatives are kept literal for the matcher.
 */

export type RawTask = {
  id: string
  category: 'typografie' | 'formatovani' | 'kombinace'
  level: number
  title: string
  mechanic: string
  bloom: string
  instructions: string
  charHints?: string[]
  editor?: {
    width?: 'normal' | 'narrow'
    allowPaste?: boolean
    toolbar?: 'full' | string[]
    showHiddenDefault?: boolean
    specialCharsPanel?: boolean
  }
  match?: {
    nbspMode?: 'ignore' | 'requiredOnly' | 'strict'
    dashStyle?: 'en' | 'enOrEm'
    trimLines?: boolean
    ignoreEmptyLines?: boolean
  }
  prefill?: { format: 'text' | 'html'; content: string }
  solution?: { format: 'text' | 'html'; content: string }
  media?: Array<
    | { kind: 'textImage'; lines: string[]; caption?: string }
    | { kind: 'docPreview'; html: string; mode: 'full' | 'wireframe'; caption?: string }
    | { kind: 'pagesPreview'; pages: unknown[]; caption?: string }
  >
  checks: Array<Record<string, unknown>>
  errors?: Array<{ at: string | string[]; rule: string }>
  autoErrors?: 'nbsp'
  feedback?: Record<string, unknown>
  review?: 'auto' | 'auto+manual' | 'manual'
  selfChecklist?: string[]
  phase: 'A' | 'B' | 'C' | 'D'
  ready: boolean
}

/** Expand document `~` NBSP placeholders to real U+00A0. */
const n = (s: string) => s.replace(/~/g, '\u00A0')

export const RULES: Record<
  string,
  { id: string; title: string; short: string; detail?: string }
> = {
  interpunkce: {
    id: 'interpunkce',
    title: 'Interpunkční znaménka',
    short:
      'Znaménka . , ; : ! ? patří hned za slovo (bez mezery před nimi), za nimi je mezera. před atd. čárka nepatří. Zkratka atd. má jednu tečku; ta zároveň končí větu.',
  },
  vypustka: {
    id: 'vypustka',
    title: 'Výpustka',
    short:
      'Píše se jedním znakem … (U+2026), ne třemi tečkami. Nedokončená myšlenka: bez mezery (tak…). Neúplný výčet: s mezerami (tři, …, deset).',
  },
  uvozovky: {
    id: 'uvozovky',
    title: 'Uvozovky',
    short:
      'České uvozovky „takto“ (dole – nahoře) přiléhají těsně k textu. Uvozovky uvnitř přímé řeči jsou jednoduché ‚takto‘. Linux: Ctrl+Shift+U a kód (pak mezerník) — „ 201E, “ 201C, ‚ 201A, ‘ 2018.',
  },
  zavorky: {
    id: 'zavorky',
    title: 'Závorky',
    short:
      'Uvnitř závorek bez mezer (takto), zvenku se závorky oddělují mezerou. Výjimka: zpracoval(a).',
  },
  datum: {
    id: 'datum',
    title: 'Datum',
    short:
      'V textu 6. října 2026 nebo 6. 10. 2026 (mezery za tečkami, bez nul). Do formulářů 06.10.2026 nebo 2026-10-06.',
  },
  cas: {
    id: 'cas',
    title: 'Čas',
    short:
      '7.30 nebo 7:30. Rozmezí pomlčkou bez mezer: 9–17 h. Sportovní časy 2:05:27,15 (části sekund za čárkou).',
  },
  lomitko: {
    id: 'lomitko',
    title: 'Lomítko',
    short:
      'Mezi jednoslovnými výrazy bez mezer (2025/2026, km/h, student/ka). Je-li některý výraz víceslovný, píšou se mezery z obou stran (základní škola / střední škola).',
  },
  jednotky: {
    id: 'jednotky',
    title: 'Jednotky, procenta, stupně',
    short:
      'Číslo a značka se oddělují mezerou: 5 kg, 25 °C, 10 %. Bez mezery, jde-li o přídavné jméno: 10% sleva (desetiprocentní), 30° svah. Úhel bez mezer: 65°12′10″.',
  },
  mena: {
    id: 'mena',
    title: 'Peněžní částky',
    short:
      '100 Kč (s mezerou). U celých částek žádné ,– ani ,-. Přídavné jméno bez mezery: 100Kč bankovka.',
  },
  matematika: {
    id: 'matematika',
    title: 'Matematické zápisy',
    short:
      'Mezery kolem + − = × (2 + 3 = 5). Poměr s mezerami 4 : 1, sportovní výsledek bez mezer 2:1. Znaménko u čísla bez mezery: −3 °C.',
  },
  cisla: {
    id: 'cisla',
    title: 'Čísla',
    short:
      'Od pěti číslic se člení po třech: 25 661,369 204. Desetinná čísla za sebou se oddělují středníkem: 12,76; 98,50.',
  },
  pomlcka: {
    id: 'pomlcka',
    title: 'Pomlčka',
    short:
      'Pomlčka (–) není spojovník. S mezerami u oddělených výrazů (Praha – Brno), bez mezer ve významu „až, proti“ (1914–1918, Sparta–Slavia), u víceslovných výrazů s mezerami (10. října – 15. října).',
  },
  spojovnik: {
    id: 'spojovnik',
    title: 'Spojovník',
    short:
      'Spojovník (-) je součást slova, píše se bez mezer: e-mail, bude-li, česko-německý.',
  },
  zalomeni: {
    id: 'zalomeni',
    title: 'Konce řádků',
    short:
      'Nezlomitelnou mezeru (U+00A0) piš za v, k, s, z, u, o, a, i, mezi číslo a jednotku nebo počítaný jev (25 km, 7. kapitola), za tj., tzv., tzn., mezi den a měsíc a mezi titul a jméno.',
  },
  strany: {
    id: 'strany',
    title: 'Začátky a konce stran',
    short:
      'Strana nesmí začínat posledním řádkem odstavce, nesmí končit prvním řádkem odstavce a nadpis nesmí zůstat na konci strany.',
  },
  tituly: {
    id: 'tituly',
    title: 'Jména a tituly',
    short:
      'Iniciály s mezerou (G. W. Bush). Tituly s přesnými velkými a malými písmeny (Ing., Mgr., PhDr.), prof. a doc. malými. Ph.D. a CSc. za jménem oddělit čárkou, a pokračuje-li věta, i za nimi.',
  },
  firmy: {
    id: 'firmy',
    title: 'Názvy firem',
    short:
      'Právní forma za názvem se odděluje čárkou (Pekárna Novák, s. r. o.), před názvem ne (a. s. Vzdělávací institut). Za tečkami uvnitř zkratky je mezera. & se píše s mezerami.',
  },
  zkratky: {
    id: 'zkratky',
    title: 'Zkratky',
    short:
      'Zkratka ze začátku slova má tečku (p., popř.). Zkratka ze začátku a konce slova ji nemá (cca, pí). Iniciálové zkratky ji nemají (ČR, OSN). Věta nesmí začínat zkratkou.',
  },
  cislovky: {
    id: 'cislovky',
    title: 'Řadové a násobné číslovky',
    short:
      'Řadové číslovky s tečkou (12. student, nikdy 12-tý). Bez koncovek (do 18 let, ne 18-ti). Přídavná jména dohromady: 8kilometrový, 20procentní, 15letý.',
  },
  'f-zvyrazneni': {
    id: 'f-zvyrazneni',
    title: 'Zvýraznění',
    short:
      'Tučně jen klíčové pojmy, kurzívou názvy děl a cizí slova. Podtržení nepoužívej, vypadá jako odkaz.',
  },
  'f-pisma': {
    id: 'f-pisma',
    title: 'Písma',
    short:
      'Patkové písmo má na koncích tahů „patičky“, bezpatkové ne. V dokumentu používej nejvýš 2 písma.',
  },
  'f-styly': {
    id: 'f-styly',
    title: 'Styly',
    short:
      'Nadpisy dělej styly (Název, Nadpis 1, Nadpis 2), ne zvětšeným tučným písmem. Jen tak funguje obsah, navigace a jednotný vzhled.',
  },
  'f-zarovnani': {
    id: 'f-zarovnani',
    title: 'Zarovnání',
    short:
      'Běžný text vlevo nebo do bloku, datum a podpis vpravo. Text nikdy neposouvej mezerami.',
  },
  'f-seznamy': {
    id: 'f-seznamy',
    title: 'Seznamy',
    short:
      'Používej odrážky a číslování z nástrojů, ne ručně psané pomlčky a čísla. Podúroveň se dělá klávesou Tab.',
  },
  'f-odkazy': {
    id: 'f-odkazy',
    title: 'Odkazy',
    short:
      'Text odkazu má popisovat cíl (rozvrh na webu školy), ne holou adresu ani „klikni sem“.',
  },
  'f-indexy': {
    id: 'f-indexy',
    title: 'Indexy',
    short:
      'Exponenty horním indexem (m³), čísla ve vzorcích dolním indexem (H₂O).',
  },
  'f-odstavce': {
    id: 'f-odstavce',
    title: 'Odstavce',
    short:
      'Mezery mezi odstavci nastav mezerou za odstavcem, ne prázdnými řádky.',
  },
  'f-jednotnost': {
    id: 'f-jednotnost',
    title: 'Jednotnost',
    short: 'Stejné prvky musí vypadat stejně: stejné písmo, velikost a styl.',
  },
}

/** Shared require regexes from TYP-21 / KOM-10 */
const REQUIRE_DATUM =
  '\\d{1,2}\\.[ \\u00A0](?:\\d{1,2}\\.|ledna|února|března|dubna|května|června|července|srpna|září|října|listopadu|prosince)'
const REQUIRE_ROZMEZI =
  '\\d{1,2}(?:[.:]\\d{2})?[–—]\\d{1,2}(?:[.:]\\d{2})?'

export const rawCatalog: RawTask[] = [
  // ─── Typografie ───────────────────────────────────────────────
  {
    id: 'TYP-01',
    category: 'typografie',
    level: 1,
    title: 'Mezery u interpunkce',
    mechanic: 'smaž špatné',
    bloom: 'zapamatovat',
    instructions:
      'V každé skupině řádků je správně napsaný jen jeden. Smaž ostatní, ať zůstanou jen správné věty.',
    prefill: {
      format: 'text',
      content: `Přijdu zítra ,ale až večer.
Přijdu zítra, ale až večer.
Přijdu zítra,ale až večer.

Koupili jsme chleba;mléko došlo.
Koupili jsme chleba ; mléko došlo.
Koupili jsme chleba; mléko došlo.

Pozor! Most je zavřený.
Pozor !Most je zavřený.
Pozor ! Most je zavřený.

Kdy začíná film ?Nevím.
Kdy začíná film? Nevím.
Kdy začíná film ? Nevím.`,
    },
    solution: {
      format: 'text',
      content: `Přijdu zítra, ale až večer.
Koupili jsme chleba; mléko došlo.
Pozor! Most je zavřený.
Kdy začíná film? Nevím.`,
    },
    checks: [{ type: 'textLines' }],
    phase: 'A',
    ready: true,
  },
  {
    id: 'TYP-02',
    category: 'typografie',
    level: 2,
    title: 'Interpunkce v odstavci',
    mechanic: 'oprav',
    bloom: 'aplikovat',
    instructions: 'Oprav mezery a interpunkci. V textu je {errorCount}.',
    prefill: {
      format: 'text',
      content:
        'Ahoj ,jak se máš ?Na trhu jsem koupil jablka,hrušky,švestky, atd.. Zítra se ozvu!Měj se.',
    },
    solution: {
      format: 'text',
      content:
        'Ahoj, jak se máš? Na trhu jsem koupil jablka, hrušky, švestky atd. Zítra se ozvu! Měj se.',
    },
    checks: [{ type: 'textLines' }],
    errors: [
      { at: 'Ahoj, jak', rule: 'interpunkce' },
      { at: 'máš? Na', rule: 'interpunkce' },
      { at: 'jablka, ', rule: 'interpunkce' },
      { at: 'hrušky, ', rule: 'interpunkce' },
      { at: 'švestky atd', rule: 'interpunkce' },
      { at: 'atd. Zítra', rule: 'interpunkce' },
      { at: 'ozvu! Měj', rule: 'interpunkce' },
    ],
    phase: 'A',
    ready: true,
  },
  {
    id: 'TYP-03',
    category: 'typografie',
    level: 3,
    title: 'Závorky a lomítko',
    mechanic: 'oprav',
    bloom: 'aplikovat',
    instructions:
      'Oprav mezery kolem závorek a lomítek. V textu je {errorCount}.',
    prefill: {
      format: 'text',
      content: `Termín odevzdání najdeš v rozvrhu( viz příloha ).
Objednávku zpracoval (a) vedoucí prodejny.
Výsledky za školní rok 2025 / 2026 už visí na nástěnce.
Maximální povolená rychlost je 50 km / h.
Soutěž je určena pro kategorie základní škola/ střední škola.`,
    },
    solution: {
      format: 'text',
      content: `Termín odevzdání najdeš v rozvrhu (viz příloha).
Objednávku zpracoval(a) vedoucí prodejny.
Výsledky za školní rok 2025/2026 už visí na nástěnce.
Maximální povolená rychlost je 50 km/h.
Soutěž je určena pro kategorie základní škola / střední škola.`,
    },
    checks: [{ type: 'textLines' }],
    errors: [
      { at: 'rozvrhu (', rule: 'zavorky' },
      { at: '(viz ', rule: 'zavorky' },
      { at: 'příloha).', rule: 'zavorky' },
      { at: 'zpracoval(a)', rule: 'zavorky' },
      { at: '2025/2026', rule: 'lomitko' },
      { at: 'km/h', rule: 'lomitko' },
      { at: 'škola / střední', rule: 'lomitko' },
    ],
    phase: 'A',
    ready: true,
  },
  {
    id: 'TYP-04',
    category: 'typografie',
    level: 4,
    title: 'České uvozovky',
    mechanic: 'přepiš z obrázku',
    bloom: 'aplikovat',
    instructions:
      'Přepiš text z obrázku přesně, včetně uvozovek. České uvozovky napíšeš přes Ctrl+Shift+U a kód (pak mezerník nebo Enter), na Windows přes Alt a kód na numerické klávesnici. Kódy najdeš pod zadáním.',
    charHints: ['„', '“', '‚', '‘'],
    editor: { allowPaste: false },
    media: [
      {
        kind: 'textImage',
        lines: [
          'Babička se zeptala: „Kdo snědl ten koláč?“',
          'Honza se bránil: „Táta říkal, že jsem ‚mlsoun‘!“',
          'Knihu „Malý princ“ jsem četla už třikrát.',
        ],
      },
    ],
    solution: {
      format: 'text',
      content: `Babička se zeptala: „Kdo snědl ten koláč?“
Honza se bránil: „Táta říkal, že jsem ‚mlsoun‘!“
Knihu „Malý princ“ jsem četla už třikrát.`,
    },
    checks: [{ type: 'textLines' }],
    phase: 'B',
    ready: false,
  },
  {
    id: 'TYP-05',
    category: 'typografie',
    level: 5,
    title: 'Výpustka',
    mechanic: 'oprav',
    bloom: 'aplikovat',
    instructions:
      'Tři tečky nahraď znakem výpustky … a oprav mezery kolem ní. V textu je {errorCount}.',
    charHints: ['…'],
    prefill: {
      format: 'text',
      content: `Jestli si to nepřečteš, tak...
Počítej se mnou: jedna, dva, tři,..., deset.
„Já jsem ... no ... nevím,“ koktal.`,
    },
    solution: {
      format: 'text',
      content: `Jestli si to nepřečteš, tak…
Počítej se mnou: jedna, dva, tři, …, deset.
„Já jsem… no… nevím,“ koktal.`,
    },
    checks: [{ type: 'textLines' }],
    errors: [
      { at: 'tak…', rule: 'vypustka' },
      { at: 'tři, …, deset', rule: 'vypustka' },
      { at: 'jsem… no', rule: 'vypustka' },
      { at: 'no… nevím', rule: 'vypustka' },
    ],
    phase: 'A',
    ready: true,
  },
  {
    id: 'TYP-06',
    category: 'typografie',
    level: 6,
    title: 'Pomlčka, nebo spojovník?',
    mechanic: 'oprav',
    bloom: 'porozumět',
    instructions:
      'Některé spojovníky jsou správně – ty nech. Tam, kde má být pomlčka (–), je oprav a zkontroluj mezery kolem ní. Opravit je potřeba {errorCount}.',
    charHints: ['–'],
    match: { dashStyle: 'en' },
    prefill: {
      format: 'text',
      content: `Dálnice Praha - Brno je v pátek ucpaná.
Válka trvala v letech 1914-1918.
Pošli mi to e-mailem, bude-li čas.
Koupil jsem česko-německý slovník.
Zápas Sparta-Slavia skončil remízou.
Výstava potrvá 10. října - 15. října.`,
    },
    solution: {
      format: 'text',
      content: `Dálnice Praha – Brno je v pátek ucpaná.
Válka trvala v letech 1914–1918.
Pošli mi to e-mailem, bude-li čas.
Koupil jsem česko-německý slovník.
Zápas Sparta–Slavia skončil remízou.
Výstava potrvá 10. října – 15. října.`,
    },
    checks: [{ type: 'textLines' }],
    errors: [
      { at: 'Praha – Brno', rule: 'pomlcka' },
      { at: '1914–1918', rule: 'pomlcka' },
      { at: 'Sparta–Slavia', rule: 'pomlcka' },
      { at: 'října – 15.', rule: 'pomlcka' },
    ],
    phase: 'A',
    ready: true,
  },
  {
    id: 'TYP-07',
    category: 'typografie',
    level: 7,
    title: 'Datum a čas',
    mechanic: 'převeď',
    bloom: 'porozumět',
    instructions:
      'Za šipku napiš údaj v požadovaném tvaru. Levou část řádků neměň.',
    match: { trimLines: true },
    prefill: {
      format: 'text',
      content: `2026-10-06 v textu, měsíc slovem →
2026-10-06 v textu, měsíc číslem →
2026-10-06 do formuláře, vzestupně →
od 9 do 17 hodin, zkráceně se značkou h →
oběd od 12.00 do 12.45, zkráceně →
sportovní čas 2 hodiny, 5 minut a 27,15 sekundy →`,
    },
    solution: {
      format: 'text',
      content: `2026-10-06 v textu, měsíc slovem → 6. října 2026
2026-10-06 v textu, měsíc číslem → 6. 10. 2026
2026-10-06 do formuláře, vzestupně → 06.10.2026
od 9 do 17 hodin, zkráceně se značkou h → 9–17 h
oběd od 12.00 do 12.45, zkráceně → {{12.00–12.45|12:00–12:45}}
sportovní čas 2 hodiny, 5 minut a 27,15 sekundy → 2:05:27,15`,
    },
    checks: [{ type: 'textLines' }],
    errors: [
      { at: '→ 6. října 2026', rule: 'datum' },
      { at: '→ 6. 10. 2026', rule: 'datum' },
      { at: '→ 06.10.2026', rule: 'datum' },
      { at: '→ 9–17 h', rule: 'cas' },
      { at: ['12.00–12.45', '12:00–12:45'], rule: 'cas' },
      { at: '→ 2:05:27,15', rule: 'cas' },
    ],
    phase: 'A',
    ready: true,
  },
  {
    id: 'TYP-08',
    category: 'typografie',
    level: 8,
    title: 'Jednotky, procenta, stupně',
    mechanic: 'smaž špatné',
    bloom: 'porozumět',
    instructions:
      'V každé skupině nech jen správně napsaný řádek. Pozor: stejná značka se píše jinak, když jde o přídavné jméno („desetiprocentní sleva“).',
    prefill: {
      format: 'text',
      content: `Na všechno je sleva 10 %.
Na všechno je sleva 10%.

Dostali jsme 10 % slevu.
Dostali jsme 10% slevu.

Venku je 25°C.
Venku je 25 °C.
Venku je 25° C.

Vyšli jsme na 30 ° svah.
Vyšli jsme na 30° svah.

Batoh váží 5kg.
Batoh váží 5 kg.

Úhel měří 65°12′10″.
Úhel měří 65° 12′ 10″.`,
    },
    solution: {
      format: 'text',
      content: `Na všechno je sleva 10 %.
Dostali jsme 10% slevu.
Venku je 25 °C.
Vyšli jsme na 30° svah.
Batoh váží 5 kg.
Úhel měří 65°12′10″.`,
    },
    checks: [{ type: 'textLines' }],
    phase: 'A',
    ready: true,
  },
  {
    id: 'TYP-09',
    category: 'typografie',
    level: 9,
    title: 'Peněžní částky',
    mechanic: 'oprav + převeď',
    bloom: 'aplikovat',
    instructions:
      'Oprav zápisy cen (u všech použij značku Kč) a v posledním řádku doplň zápis číslicí a značkou. Úprav je {errorCount}.',
    prefill: {
      format: 'text',
      content: `Vstupné: Kč 80,–
Lístek na koncert stál 500,- Kč.
Mikina stojí 1290,–.
Zapiš číslicí a značkou: stokorunová bankovka →`,
    },
    solution: {
      format: 'text',
      content: `Vstupné: 80 Kč
Lístek na koncert stál 500 Kč.
Mikina stojí 1290 Kč.
Zapiš číslicí a značkou: stokorunová bankovka → 100Kč bankovka`,
    },
    checks: [{ type: 'textLines' }],
    errors: [
      { at: 'Vstupné: 80 Kč', rule: 'mena' },
      { at: 'stál 500 Kč', rule: 'mena' },
      { at: 'stojí 1290 Kč', rule: 'mena' },
      { at: '→ 100Kč bankovka', rule: 'mena' },
    ],
    phase: 'A',
    ready: true,
  },
  {
    id: 'TYP-10',
    category: 'typografie',
    level: 10,
    title: 'Matematika a velká čísla',
    mechanic: 'oprav',
    bloom: 'aplikovat',
    instructions: 'Oprav zápisy čísel a výpočtů. V textu je {errorCount}.',
    charHints: ['−'],
    prefill: {
      format: 'text',
      content: `Spočítej: 2+3=5.
Smíchej vodu a sirup v poměru 4:1.
Naši vyhráli 2 : 1.
V noci klesla teplota na - 3 °C.
Brno má 400000 obyvatel.
Výsledek je 25661,369204.
Naměřili jsme 12,76, 98,50, 45,67.`,
    },
    solution: {
      format: 'text',
      content: `Spočítej: 2 + 3 = 5.
Smíchej vodu a sirup v poměru 4 : 1.
Naši vyhráli 2:1.
V noci klesla teplota na {{−|-}}3 °C.
Brno má 400 000 obyvatel.
Výsledek je 25 661,369 204.
Naměřili jsme 12,76; 98,50; 45,67.`,
    },
    checks: [{ type: 'textLines' }],
    errors: [
      { at: '2 + 3 = 5', rule: 'matematika' },
      { at: '4 : 1', rule: 'matematika' },
      { at: 'vyhráli 2:1', rule: 'matematika' },
      { at: ['na −3', 'na -3'], rule: 'matematika' },
      { at: '400 000', rule: 'cisla' },
      { at: '25 661,369 204', rule: 'cisla' },
      { at: '12,76; 98,50; 45,67', rule: 'cisla' },
    ],
    phase: 'A',
    ready: true,
  },
  {
    id: 'TYP-11',
    category: 'typografie',
    level: 11,
    title: 'Hon na „-ti“ (číslovky)',
    mechanic: 'oprav',
    bloom: 'aplikovat',
    instructions: 'Oprav zápisy číslovek. V textu je {errorCount}.',
    prefill: {
      format: 'text',
      content: `Do 18-ti let je vstup zdarma.
Je to můj 12-tý pokus.
Čeká nás 8-mi kilometrový výlet.
Dostali jsme 20-ti procentní slevu.
Můj 15-ti letý bratr hraje fotbal.
Uběhl jsem už 3-tí kolo.`,
    },
    solution: {
      format: 'text',
      content: `Do 18 let je vstup zdarma.
Je to můj 12. pokus.
Čeká nás {{8kilometrový|8km}} výlet.
Dostali jsme {{20procentní|20%}} slevu.
Můj 15letý bratr hraje fotbal.
Uběhl jsem už 3. kolo.`,
    },
    checks: [{ type: 'textLines' }],
    errors: [
      { at: 'Do 18 let', rule: 'cislovky' },
      { at: '12. pokus', rule: 'cislovky' },
      { at: ['8kilometrový', '8km'], rule: 'cislovky' },
      { at: ['20procentní', '20%'], rule: 'cislovky' },
      { at: '15letý', rule: 'cislovky' },
      { at: '3. kolo', rule: 'cislovky' },
    ],
    phase: 'A',
    ready: true,
  },
  {
    id: 'TYP-12',
    category: 'typografie',
    level: 12,
    title: 'Zkratky',
    mechanic: 'smaž špatné + oprav',
    bloom: 'zapamatovat → aplikovat',
    instructions:
      'V prvních pěti dvojicích nech jen správný zápis zkratky. V posledních dvou větách vypiš zkratku na začátku věty celým slovem – věta nesmí začínat zkratkou.',
    prefill: {
      format: 'text',
      content: `cca. 20 minut
cca 20 minut

popř zavolej
popř. zavolej

Č.R.
ČR

pí Nováková
pí. Nováková

p Novák
p. Novák

Tzv. klikání je nejjednodušší ovládání.
Např. jablka obsahují hodně vitamínů.`,
    },
    solution: {
      format: 'text',
      content: `cca 20 minut
popř. zavolej
ČR
pí Nováková
p. Novák
Takzvané klikání je nejjednodušší ovládání.
Například jablka obsahují hodně vitamínů.`,
    },
    checks: [{ type: 'textLines' }],
    errors: [
      { at: 'Takzvané', rule: 'zkratky' },
      { at: 'Například', rule: 'zkratky' },
    ],
    phase: 'A',
    ready: true,
  },
  {
    id: 'TYP-13',
    category: 'typografie',
    level: 13,
    title: 'Jména, tituly, firmy',
    mechanic: 'oprav',
    bloom: 'aplikovat',
    instructions:
      'Oprav zápisy jmen, titulů a názvů firem. V textu je {errorCount}.',
    prefill: {
      format: 'text',
      content: `Na přednášku přišel ing. Jan Novák PhD. a hned začal mluvit.
Projev měl G.W.Bush.
Zkoušku vede Prof. Marie Horká.
Rohlíky dodává Pekárna Novák s.r.o.
Filmy dvojice Laurel&Hardy pobaví i dnes.
Smlouvu podepsala a.s. Vzdělávací institut.`,
    },
    solution: {
      format: 'text',
      content: `Na přednášku přišel Ing. Jan Novák, Ph.D., a hned začal mluvit.
Projev měl G. W. Bush.
Zkoušku vede prof. Marie Horká.
Rohlíky dodává Pekárna Novák, s. r. o.
Filmy dvojice Laurel & Hardy pobaví i dnes.
Smlouvu podepsala a. s. Vzdělávací institut.`,
    },
    checks: [{ type: 'textLines' }],
    errors: [
      { at: 'Ing. Jan', rule: 'tituly' },
      { at: ', Ph.D.,', rule: 'tituly' },
      { at: 'G. W. Bush', rule: 'tituly' },
      { at: 'prof. Marie', rule: 'tituly' },
      { at: 'Novák, s. r. o.', rule: 'firmy' },
      { at: 'Laurel & Hardy', rule: 'firmy' },
      { at: 'a. s. Vzdělávací', rule: 'firmy' },
    ],
    phase: 'A',
    ready: true,
  },
  {
    id: 'TYP-14',
    category: 'typografie',
    level: 14,
    title: 'Nezlomitelné mezery',
    mechanic: 'oprav',
    bloom: 'aplikovat',
    instructions:
      'Vlož nezlomitelnou mezeru všude, kde se řádek nesmí zlomit: za jednopísmenné předložky a spojky, mezi číslo a jednotku nebo počítanou věc, za tzv., mezi den a měsíc a mezi titul a jméno. Zapni si zobrazení skrytých znaků (¶), ať vidíš, kde už je máš. Chybí jich {errorCount}.',
    charHints: ['\u00A0'],
    editor: { width: 'narrow' },
    match: { nbspMode: 'requiredOnly' },
    autoErrors: 'nbsp',
    prefill: {
      format: 'text',
      content: `V pondělí 6. října jsme s třídou jeli k řece a u mostu jsme ušli 25 km.
Na tzv. klikání stačí i malé dítě.
Přednášel Ing. Novák o 7. kapitole a o tom, co v ní najdeme.`,
    },
    solution: {
      format: 'text',
      content: n(`V~pondělí 6.~října jsme s~třídou jeli k~řece a~u~mostu jsme ušli 25~km.
Na tzv.~klikání stačí i~malé dítě.
Přednášel Ing.~Novák o~7.~kapitole a~o~tom, co v~ní najdeme.`),
    },
    checks: [{ type: 'textLines' }],
    phase: 'B',
    ready: false,
  },
  // TODO: pagesPreview structure is best-effort from the legend in §7.1
  {
    id: 'TYP-15',
    category: 'typografie',
    level: 15,
    title: 'Začátky a konce stran',
    mechanic: 'lovec chyb',
    bloom: 'analyzovat',
    instructions:
      'Na obrázku je 6 stránek dokumentu. Odstavec poznáš podle odsazeného prvního řádku a kratšího posledního řádku. Napiš čísla stránek, na kterých je porušené pravidlo o začátku nebo konci strany (oddělená čárkou).',
    feedback: { revealAfter: 2 },
    media: [
      {
        kind: 'pagesPreview',
        caption: 'H = nadpis (2 řádky); Pn = odstavec s n řádky; s = začíná; e = končí',
        pages: [
          { page: 1, blocks: ['H', 'P6 s e', 'P8 s'] },
          { page: 2, blocks: ['P3 e', 'P12 s e', 'P1 s'], error: 'končí prvním řádkem odstavce' },
          { page: 3, blocks: ['P6 e', 'P8 s e', 'H'], error: 'nadpis na konci strany' },
          { page: 4, blocks: ['P7 s e', 'P5 s e', 'P4 s'] },
          { page: 5, blocks: ['P5 e', 'H', 'P6 s e', 'P3 s'] },
          { page: 6, blocks: ['P1 e', 'P9 s e', 'P6 s e'], error: 'začíná posledním řádkem odstavce' },
        ],
      },
    ],
    checks: [{ type: 'numberSet', values: [2, 3, 6] }],
    phase: 'D',
    ready: false,
  },
  {
    id: 'TYP-16',
    category: 'typografie',
    level: 16,
    title: 'Lovec chyb I: znaky',
    mechanic: 'lovec chyb',
    bloom: 'analyzovat',
    instructions:
      'V textu jsou chyby v interpunkci, závorkách, uvozovkách, výpustce, pomlčkách a lomítkách. Kolik jich je, se dozvíš až po kontrole.',
    feedback: { showCountUpfront: false, revealAfter: 3 },
    prefill: {
      format: 'text',
      content:
        'Na školním výletě ( Praha - Kutná Hora ) jsme navštívili kostnici.Paní učitelka řekla:"Tady se nefotí !" Pak jsme šli na oběd a pak... no,radši nic. Kdo chtěl, mohl si koupit pohled/ magnetku.',
    },
    solution: {
      format: 'text',
      content:
        'Na školním výletě (Praha – Kutná Hora) jsme navštívili kostnici. Paní učitelka řekla: „Tady se nefotí!“ Pak jsme šli na oběd a pak… no, radši nic. Kdo chtěl, mohl si koupit pohled/magnetku.',
    },
    checks: [{ type: 'textLines' }],
    errors: [
      { at: '(Praha', rule: 'zavorky' },
      { at: 'Praha – Kutná', rule: 'pomlcka' },
      { at: 'Hora)', rule: 'zavorky' },
      { at: 'kostnici. Paní', rule: 'interpunkce' },
      { at: 'řekla: „Tady', rule: 'uvozovky' },
      { at: 'nefotí!', rule: 'interpunkce' },
      { at: '!“ Pak', rule: 'uvozovky' },
      { at: 'pak… no', rule: 'vypustka' },
      { at: 'no, radši', rule: 'interpunkce' },
      { at: 'pohled/magnetku', rule: 'lomitko' },
    ],
    phase: 'A',
    ready: true,
  },
  {
    id: 'TYP-17',
    category: 'typografie',
    level: 17,
    title: 'Lovec chyb II: čísla',
    mechanic: 'lovec chyb',
    bloom: 'analyzovat',
    instructions:
      'V rozpisu sportovního dne jsou chyby v datech, časech, cenách, jednotkách a číslovkách. Najdi je a oprav.',
    feedback: { showCountUpfront: false, revealAfter: 3 },
    prefill: {
      format: 'text',
      content: `Sportovní den proběhne 15.10.2026 v čase 8:00 - 13:00 hod.
Startovné je 50,- Kč, pro 1-ní ročníky zdarma.
Trať měří 3,5km a vede po 15-ti metrovém mostě.
Loni vyhrála Jana s časem 0:12:45.30.
Pití zajistí sponzor, který dá 10 % slevu na limonády.`,
    },
    solution: {
      format: 'text',
      content: `Sportovní den proběhne 15. 10. 2026 v čase {{8:00–13:00|8.00–13.00}} hod.
Startovné je 50 Kč, pro 1. ročníky zdarma.
Trať měří 3,5 km a vede po 15metrovém mostě.
Loni vyhrála Jana s časem 0:12:45,30.
Pití zajistí sponzor, který dá 10% slevu na limonády.`,
    },
    checks: [{ type: 'textLines' }],
    errors: [
      { at: '15. 10. 2026', rule: 'datum' },
      { at: ['8:00–13:00', '8.00–13.00'], rule: 'cas' },
      { at: '50 Kč,', rule: 'mena' },
      { at: '1. ročníky', rule: 'cislovky' },
      { at: '3,5 km', rule: 'jednotky' },
      { at: '15metrovém', rule: 'cislovky' },
      { at: '45,30', rule: 'cas' },
      { at: '10% slevu', rule: 'jednotky' },
    ],
    phase: 'A',
    ready: true,
  },
  {
    id: 'TYP-18',
    category: 'typografie',
    level: 18,
    title: 'Lovec chyb III: všechno',
    mechanic: 'lovec chyb',
    bloom: 'analyzovat',
    instructions:
      'Zpráva z výletu do školního časopisu. Najdi a oprav všechny typografické chyby včetně chybějících nezlomitelných mezer. Máš jen 3 kontroly.',
    match: { nbspMode: 'requiredOnly' },
    autoErrors: 'nbsp',
    feedback: {
      showCountUpfront: false,
      revealAfter: 2,
      maxChecks: 3,
    },
    prefill: {
      format: 'text',
      content:
        'Výlet do Brna\nVe čtvrtek 9.října jsme vyrazili vlakem Olomouc-Brno v 7.45. Cesta trvala cca. 1 hodinu. Paní učitelka mgr. Dvořáková nám cestou řekla: "Kdo ztratí lístek, platí 120,- Kč pokutu !" V Brně jsme navštívili Tzv. Labyrint pod Zelným trhem ( vstupné 160 Kč, studenti 120 Kč ). Prohlídka trvala 45min. Pak jsme zašli do science centra VIDA, kde jsme zkoušeli pokusy s vodou, pískem, atd.. Venku bylo jen 8°C , ale uvnitř bylo teplo. Domů jsme dorazili v 16.30 unavení ,ale spokojení.',
    },
    solution: {
      format: 'text',
      content: n(`Výlet do Brna
Ve čtvrtek 9.~října jsme vyrazili vlakem {{Olomouc – Brno|Olomouc–Brno}} v~7.45. Cesta trvala cca 1~hodinu. Paní učitelka Mgr.~Dvořáková nám cestou řekla: „Kdo ztratí lístek, platí 120~Kč pokutu!“ V~Brně jsme navštívili tzv.~Labyrint pod Zelným trhem (vstupné 160~Kč, studenti 120~Kč). Prohlídka trvala 45~min. Pak jsme zašli do science centra VIDA, kde jsme zkoušeli pokusy s~vodou, pískem atd. Venku bylo jen 8~°C, ale uvnitř bylo teplo. Domů jsme dorazili v~16.30 unavení, ale spokojení.`),
    },
    checks: [{ type: 'textLines' }],
    errors: [
      { at: n('9.~října'), rule: 'datum' },
      { at: ['Olomouc – Brno', 'Olomouc–Brno'], rule: 'pomlcka' },
      { at: 'cca 1', rule: 'zkratky' },
      { at: n('Mgr.~Dvořáková'), rule: 'tituly' },
      { at: 'řekla: „Kdo', rule: 'uvozovky' },
      { at: n('120~Kč pokutu'), rule: 'mena' },
      { at: 'pokutu!', rule: 'interpunkce' },
      { at: '!“ V', rule: 'uvozovky' },
      { at: n('tzv.~Labyrint'), rule: 'zkratky' },
      { at: '(vstupné', rule: 'zavorky' },
      { at: n('120~Kč)'), rule: 'zavorky' },
      { at: n('45~min'), rule: 'jednotky' },
      { at: 'pískem atd', rule: 'interpunkce' },
      { at: 'atd. Venku', rule: 'interpunkce' },
      { at: n('8~°C'), rule: 'jednotky' },
      { at: '°C, ale', rule: 'interpunkce' },
      { at: 'unavení, ale', rule: 'interpunkce' },
    ],
    phase: 'B',
    ready: false,
  },
  {
    id: 'TYP-19',
    category: 'typografie',
    level: 19,
    title: 'Oprava opravy',
    mechanic: 'posuď',
    bloom: 'hodnotit',
    instructions:
      'Na obrázku je text před opravou, v editoru je po opravě spolužáka. Některé jeho opravy jsou dobře, některé pokazily, co bylo správně, a někde oprava nestačila. Porovnej obě verze a uveď text v editoru do správného stavu.',
    feedback: { showCountUpfront: false },
    media: [
      {
        kind: 'textImage',
        caption: 'původní text',
        lines: [
          'Dostali jsme 10% slevu na e-mailové služby.',
          'Je to už 12-tý student, který přišel pozdě.',
          'Teplota klesla na -5°C.',
          'Zápas skončil 3:2.',
          'Výstava potrvá 1.-15. června.',
          'Čeká nás 8km pochod.',
          'Smíchej to v poměru 3:1.',
        ],
      },
    ],
    prefill: {
      format: 'text',
      content: `Dostali jsme 10 % slevu na e–mailové služby.
Je to už 12 student, který přišel pozdě.
Teplota klesla na -5 °C.
Zápas skončil 3 : 2.
Výstava potrvá 1.–15. června.
Čeká nás 8 km pochod.
Smíchej to v poměru 3 : 1.`,
    },
    solution: {
      format: 'text',
      content: `Dostali jsme 10% slevu na e-mailové služby.
Je to už 12. student, který přišel pozdě.
Teplota klesla na {{-|−}}5 °C.
Zápas skončil 3:2.
Výstava potrvá 1.–15. června.
Čeká nás {{8km|8kilometrový}} pochod.
Smíchej to v poměru 3 : 1.`,
    },
    checks: [{ type: 'textLines' }],
    errors: [
      { at: '10% slevu', rule: 'jednotky' },
      { at: 'e-mailové', rule: 'spojovnik' },
      { at: '12. student', rule: 'cislovky' },
      { at: 'skončil 3:2', rule: 'matematika' },
      { at: ['8km pochod', '8kilometrový pochod'], rule: 'jednotky' },
    ],
    phase: 'B',
    ready: false,
  },
  {
    id: 'TYP-20',
    category: 'typografie',
    level: 20,
    title: 'Která verze?',
    mechanic: 'posuď',
    bloom: 'hodnotit',
    instructions:
      'Tři spolužáci napsali stejnou zprávu do třídní skupiny. Nech v editoru jen tu bezchybnou (zbylé dvě smaž) a pod ni napiš aspoň jednou větou, co je na ostatních špatně.',
    review: 'auto+manual',
    prefill: {
      format: 'text',
      content: `A: Sraz je v sobotu 17.10. v 9.30 h u kina. Vezměte si 200,- Kč na vstupné a svačinu. Jirka říkal: „Kdo přijde pozdě, platí zmrzlinu!“
B: Sraz je v sobotu 17. 10. v 9.30 h u kina. Vezměte si 200 Kč na vstupné, a svačinu. Jirka říkal: "Kdo přijde pozdě, platí zmrzlinu !"
C: Sraz je v sobotu 17. 10. v 9.30 h u kina. Vezměte si 200 Kč na vstupné a svačinu. Jirka říkal: „Kdo přijde pozdě, platí zmrzlinu!“`,
    },
    solution: {
      format: 'text',
      content: `C: Sraz je v sobotu 17. 10. v 9.30 h u kina. Vezměte si 200 Kč na vstupné a svačinu. Jirka říkal: „Kdo přijde pozdě, platí zmrzlinu!“
Verze A má datum bez mezer a cenu s čárkou a pomlčkou, verze B má rovné uvozovky a čárku navíc.`,
    },
    checks: [
      {
        type: 'containsLine',
        line: '{{C: |}}Sraz je v sobotu 17. 10. v 9.30 h u kina. Vezměte si 200 Kč na vstupné a svačinu. Jirka říkal: „Kdo přijde pozdě, platí zmrzlinu!“',
      },
      { type: 'notContainsText', text: '200,- Kč' },
      { type: 'notContainsText', text: 'na vstupné, a' },
      {
        type: 'minWords',
        min: 6,
        excludePattern: 'Sraz je v sobotu',
      },
    ],
    phase: 'B',
    ready: false,
  },
  {
    id: 'TYP-21',
    category: 'typografie',
    level: 21,
    title: 'Oznámení',
    mechanic: 'vytvoř',
    bloom: 'tvořit',
    instructions: `Napiš pro třídu oznámení o změně rozvrhu (3–6 vět). Musí obsahovat:
- datum v souvislém textu,
- časové rozmezí,
- číslo učebny,
- přímou řeč v českých uvozovkách,
- výčet zakončený „atd.“

Text musí projít typografickou kontrolou včetně nezlomitelných mezer.`,
    review: 'auto',
    solution: {
      format: 'text',
      content: n(
        'Milí spolužáci, ve středu 14.~října se mění rozvrh. Matematika bude v~čase 10.00–11.30 v~učebně 204. Paní učitelka vzkazuje: „Vezměte si kalkulačku, pravítko, kružítko atd.“ Tělocvik ten den odpadá.',
      ),
    },
    checks: [
      {
        type: 'require',
        pattern: REQUIRE_DATUM,
        label: 'datum v souvislém textu',
      },
      {
        type: 'require',
        pattern: REQUIRE_ROZMEZI,
        label: 'časové rozmezí s pomlčkou',
      },
      {
        type: 'require',
        pattern: 'učebn\\p{L}*[ \\u00A0](?:č\\.[ \\u00A0])?\\d+',
        label: 'číslo učebny',
      },
      {
        type: 'require',
        pattern: '„[^„“]+“',
        label: 'přímá řeč v českých uvozovkách',
      },
      {
        type: 'require',
        pattern: '[\\p{L}\\d][ \\u00A0]atd\\.',
        label: 'výčet zakončený atd.',
      },
      { type: 'minWords', min: 20 },
      {
        type: 'lint',
        maxErrors: 0,
        treatAsErrors: ['nbsp-jednopismenne', 'nbsp-jednotka'],
      },
    ],
    phase: 'D',
    ready: false,
  },
  {
    id: 'TYP-22',
    category: 'typografie',
    level: 22,
    title: 'Chytáky pro spolužáka',
    mechanic: 'vytvoř',
    bloom: 'tvořit',
    instructions:
      'Vymysli 5 vět, každou s jednou typografickou chybou jiného typu. Pod každou napiš její opravenou verzi. Nejlepší chytáky můžou dostat ostatní jako úlohu.',
    review: 'manual',
    prefill: {
      format: 'text',
      content: `1. Chyták:
1. Oprava:
2. Chyták:
2. Oprava:
3. Chyták:
3. Oprava:
4. Chyták:
4. Oprava:
5. Chyták:
5. Oprava:`,
    },
    checks: [
      {
        type: 'custom',
        id: 'trapPairs',
        // TODO: runtime must parse ^(\d)\. (Chyták|Oprava):[ \u00A0]*(.*)$ —
        // 5 pairs, both non-empty, differ, fix passes lint, trap has ≥1 lint hit
      },
    ],
    phase: 'D',
    ready: false,
  },

  // ─── Formátování (default nbspMode: ignore) ───────────────────
  {
    id: 'FMT-01',
    category: 'formatovani',
    level: 1,
    title: 'Tučně a kurzíva',
    mechanic: 'oprav',
    bloom: 'aplikovat',
    instructions:
      'Označ tučně všechna jména zvířat a kurzívou jejich latinské názvy v závorkách. Nic dalšího neformátuj.',
    match: { nbspMode: 'ignore' },
    prefill: {
      format: 'html',
      content: `<h1>Zvířata v Moravském krasu</h1>
<p>V jeskyních žije netopýr velký (Myotis myotis), který v zimě hibernuje. U potoků můžeš potkat mloka skvrnitého (Salamandra salamandra). V lesích nad propastí Macocha loví kuna lesní (Martes martes).</p>`,
    },
    solution: {
      format: 'html',
      content: `<h1>Zvířata v Moravském krasu</h1>
<p>V jeskyních žije <strong>netopýr velký</strong> (<em>Myotis myotis</em>), který v zimě hibernuje. U potoků můžeš potkat <strong>mloka skvrnitého</strong> (<em>Salamandra salamandra</em>). V lesích nad propastí Macocha loví <strong>kuna lesní</strong> (<em>Martes martes</em>).</p>`,
    },
    checks: [
      { type: 'docMatches', compare: ['text', 'style', 'bold', 'italic'] },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'FMT-02',
    category: 'formatovani',
    level: 2,
    title: 'Kdy zvýrazňovat',
    mechanic: 'oprav',
    bloom: 'porozumět',
    instructions: `Text je přezvýrazněný. Uprav ho:
- tučně nech jen pojmy fotosyntéza, oxid uhličitý a chlorofyl (každý jen při prvním výskytu),
- název knihy dej kurzívou,
- podtržení odstraň úplně – podtržený text vypadá jako odkaz.`,
    match: { nbspMode: 'ignore' },
    prefill: {
      format: 'html',
      content: `<p><strong><u>Fotosyntéza je proces, při kterém rostliny vyrábějí cukry.</u></strong> <u>K tomu potřebují světlo, vodu a </u><strong>oxid uhličitý</strong>. <strong>Zelenou barvu jim dává chlorofyl, který zachycuje světlo.</strong> Víc se dočteš v knize <u>Zelená továrna</u>. <strong>Fotosyntéza</strong> probíhá hlavně v listech.</p>`,
    },
    solution: {
      format: 'html',
      content: `<p><strong>Fotosyntéza</strong> je proces, při kterém rostliny vyrábějí cukry. K tomu potřebují světlo, vodu a <strong>oxid uhličitý</strong>. Zelenou barvu jim dává <strong>chlorofyl</strong>, který zachycuje světlo. Víc se dočteš v knize <em>Zelená továrna</em>. Fotosyntéza probíhá hlavně v listech.</p>`,
    },
    checks: [
      {
        type: 'docMatches',
        compare: ['text', 'bold', 'italic', 'underline'],
      },
      { type: 'constraint', id: 'underlineOnlyLinks' },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'FMT-03',
    category: 'formatovani',
    level: 3,
    title: 'Patkové, nebo bezpatkové?',
    mechanic: 'smaž špatné',
    bloom: 'zapamatovat',
    instructions:
      'Každý řádek je napsaný jiným písmem. Smaž řádky s bezpatkovým písmem. Zbylé řádky pak nastav všechny na jedno stejné patkové písmo.',
    match: { nbspMode: 'ignore' },
    prefill: {
      format: 'html',
      content: `<p><span style="font-family:'Arial'">1 – Příliš žluťoučký kůň úpěl ďábelské ódy.</span></p>
<p><span style="font-family:'Merriweather'">2 – Příliš žluťoučký kůň úpěl ďábelské ódy.</span></p>
<p><span style="font-family:'Roboto'">3 – Příliš žluťoučký kůň úpěl ďábelské ódy.</span></p>
<p><span style="font-family:'Lora'">4 – Příliš žluťoučký kůň úpěl ďábelské ódy.</span></p>
<p><span style="font-family:'Open Sans'">5 – Příliš žluťoučký kůň úpěl ďábelské ódy.</span></p>
<p><span style="font-family:'PT Serif'">6 – Příliš žluťoučký kůň úpěl ďábelské ódy.</span></p>`,
    },
    solution: {
      format: 'html',
      // Any single serif family is fine; Merriweather used for self-test.
      content: `<p><span style="font-family:'Merriweather'">2 – Příliš žluťoučký kůň úpěl ďábelské ódy.</span></p>
<p><span style="font-family:'Merriweather'">4 – Příliš žluťoučký kůň úpěl ďábelské ódy.</span></p>
<p><span style="font-family:'Merriweather'">6 – Příliš žluťoučký kůň úpěl ďábelské ódy.</span></p>`,
    },
    checks: [
      { type: 'textLines' },
      {
        type: 'constraint',
        id: 'uniformFont',
        allowedFamilies: 'serif',
        scope: 'all',
      },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'FMT-04',
    category: 'formatovani',
    level: 4,
    title: 'Sjednocení písma',
    mechanic: 'lovec chyb',
    bloom: 'analyzovat',
    instructions:
      'Celý text pod nadpisem má být písmem Arial o velikosti 11. Některé odstavce (nebo jejich části) se liší. Najdi je a sjednoť. Nadpis nech, jak je.',
    match: { nbspMode: 'ignore' },
    feedback: { showCountUpfront: false },
    prefill: {
      format: 'html',
      content: `<h1>Pravidla školní knihovny</h1>
<p><span style="font-family:'Arial';font-size:11pt">Knihovna je otevřená každý všední den od 8.00 do 15.00.</span></p>
<p><span style="font-family:'Roboto';font-size:11pt">Půjčit si můžeš najednou nejvýš tři knihy.</span></p>
<p><span style="font-family:'Arial';font-size:11pt">Výpůjční doba je čtyři týdny, prodloužit ji můžeš jednou.</span></p>
<p><span style="font-family:'Arial';font-size:12pt">Za poškozenou knihu se platí náhrada.</span></p>
<p><span style="font-family:'Arial';font-size:11pt">V knihovně se nejí a nepije. </span><span style="font-family:'Open Sans';font-size:11pt">Mobil měj ztlumený.</span></p>`,
    },
    // TODO: solution HTML not fully specified — text matches plain text of prefill; all normal paras Arial 11
    solution: {
      format: 'text',
      content: `Pravidla školní knihovny
Knihovna je otevřená každý všední den od 8.00 do 15.00.
Půjčit si můžeš najednou nejvýš tři knihy.
Výpůjční doba je čtyři týdny, prodloužit ji můžeš jednou.
Za poškozenou knihu se platí náhrada.
V knihovně se nejí a nepije. Mobil měj ztlumený.`,
    },
    checks: [
      { type: 'textLines' },
      {
        type: 'constraint',
        id: 'uniformFont',
        family: 'Arial',
        size: 11,
        scope: 'normal',
      },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'FMT-05',
    category: 'formatovani',
    level: 5,
    title: 'Zarovnání omluvenky',
    mechanic: 'oprav',
    bloom: 'aplikovat',
    instructions: `Naformátuj omluvenku:
- místo a datum zarovnej vpravo,
- nadpis na střed,
- text omluvenky do bloku,
- podpis vpravo.

Text neposouvej mezerami – ty, které tam jsou, smaž.`,
    match: { nbspMode: 'ignore' },
    prefill: {
      format: 'html',
      // první odstavec začíná přesně 20 mezerami U+0020
      content: `<p>                    V Brně dne 6. 10. 2026</p>
<p data-style="title">Omluvenka</p>
<p>Omlouvám svou dceru Annu Novákovou z vyučování ve dnech 1.–3. října 2026 z rodinných důvodů. Děkuji za pochopení.</p>
<p>Jana Nováková</p>`,
    },
    solution: {
      format: 'html',
      content: `<p style="text-align:right">V Brně dne 6. 10. 2026</p>
<p data-style="title" style="text-align:center">Omluvenka</p>
<p style="text-align:justify">Omlouvám svou dceru Annu Novákovou z vyučování ve dnech 1.–3. října 2026 z rodinných důvodů. Děkuji za pochopení.</p>
<p style="text-align:right">Jana Nováková</p>`,
    },
    checks: [
      { type: 'docMatches', compare: ['text', 'style', 'align'] },
      { type: 'constraint', id: 'noLeadingWhitespace' },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'FMT-06',
    category: 'formatovani',
    level: 6,
    title: 'Odrážky a číslování',
    mechanic: 'oprav',
    bloom: 'aplikovat',
    instructions:
      'Seznamy jsou napsané ručně pomlčkami, hvězdičkami a čísly. Udělej z věcí na výlet odrážkový seznam a z postupu číslovaný seznam. Ruční značky smaž.',
    match: { nbspMode: 'ignore' },
    prefill: {
      format: 'html',
      content: `<h2>Co si vzít na výlet</h2>
<p>- pláštěnku</p>
<p>* svačinu</p>
<p>- láhev s pitím</p>
<p>- kartičku pojišťovny</p>
<h2>Postup přihlášení</h2>
<p>1) Vyplň přihlášku.</p>
<p>2) Nech ji podepsat rodiči.</p>
<p>3) Odevzdej ji třídní učitelce do pátku.</p>`,
    },
    solution: {
      format: 'html',
      content: `<h2>Co si vzít na výlet</h2>
<ul><li>pláštěnku</li><li>svačinu</li><li>láhev s pitím</li><li>kartičku pojišťovny</li></ul>
<h2>Postup přihlášení</h2>
<ol><li>Vyplň přihlášku.</li><li>Nech ji podepsat rodiči.</li><li>Odevzdej ji třídní učitelce do pátku.</li></ol>`,
    },
    checks: [
      { type: 'docMatches', compare: ['text', 'style', 'list'] },
      { type: 'constraint', id: 'noManualListMarkers' },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'FMT-07',
    category: 'formatovani',
    level: 7,
    title: 'Styly nadpisů',
    mechanic: 'převeď',
    bloom: 'porozumět',
    instructions: `Nadpisy jsou udělané ručně – jen zvětšené a tučné. Převeď je na styly:
- hlavní nadpis na Název,
- rubriky na Nadpis 1,
- články na Nadpis 2.

Ruční tučné písmo a velikost u nich zruš.`,
    match: { nbspMode: 'ignore' },
    prefill: {
      format: 'html',
      content: `<p><span style="font-size:24pt"><strong>Školní časopis Kompas</strong></span></p>
<p><span style="font-size:18pt"><strong>Rozhovory</strong></span></p>
<p><span style="font-size:14pt"><strong>S novou paní ředitelkou</strong></span></p>
<p>Zeptali jsme se, co chce na škole změnit a co by naopak nechala.</p>
<p><span style="font-size:14pt"><strong>Se školníkem</strong></span></p>
<p>Prozradil nám, kde ve škole najdeme nejstarší lavici.</p>
<p><span style="font-size:18pt"><strong>Sport</strong></span></p>
<p><span style="font-size:14pt"><strong>Florbalový turnaj</strong></span></p>
<p>Naši florbalisté skončili na krajském turnaji druzí.</p>`,
    },
    solution: {
      format: 'html',
      content: `<p data-style="title">Školní časopis Kompas</p>
<h1>Rozhovory</h1>
<h2>S novou paní ředitelkou</h2>
<p>Zeptali jsme se, co chce na škole změnit a co by naopak nechala.</p>
<h2>Se školníkem</h2>
<p>Prozradil nám, kde ve škole najdeme nejstarší lavici.</p>
<h1>Sport</h1>
<h2>Florbalový turnaj</h2>
<p>Naši florbalisté skončili na krajském turnaji druzí.</p>`,
    },
    checks: [
      { type: 'docMatches', compare: ['text', 'style'] },
      { type: 'constraint', id: 'noManualHeadingFormatting' },
      { type: 'constraint', id: 'noFakeHeadings' },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'FMT-08',
    category: 'formatovani',
    level: 8,
    title: 'Struktura článku',
    mechanic: 'lovec chyb',
    bloom: 'analyzovat',
    instructions:
      'Článek nemá žádné formátování. Rozhodni, který řádek je Název, které jsou nadpisy kapitol (Nadpis 1) a které podkapitol (Nadpis 2), a nastav jim styly.',
    match: { nbspMode: 'ignore' },
    feedback: { showCountUpfront: false },
    prefill: {
      format: 'text',
      content: `Jak přežít první ročník
Učení
Jak si dělat poznámky
Poznámky si piš vlastními slovy, ne opisuj tabuli.
Kdy se učit
Lepší je učit se průběžně než všechno noc před testem.
Volný čas
Kroužky a kluby
Na škole funguje debatní klub, sbor i robotický kroužek.
Kde se potkat s ostatními
Nejvíc lidí potkáš o velké přestávce v atriu.`,
    },
    solution: {
      format: 'html',
      content: `<p data-style="title">Jak přežít první ročník</p>
<h1>Učení</h1>
<h2>Jak si dělat poznámky</h2>
<p>Poznámky si piš vlastními slovy, ne opisuj tabuli.</p>
<h2>Kdy se učit</h2>
<p>Lepší je učit se průběžně než všechno noc před testem.</p>
<h1>Volný čas</h1>
<h2>Kroužky a kluby</h2>
<p>Na škole funguje debatní klub, sbor i robotický kroužek.</p>
<h2>Kde se potkat s ostatními</h2>
<p>Nejvíc lidí potkáš o velké přestávce v atriu.</p>`,
    },
    checks: [{ type: 'docMatches', compare: ['text', 'style'] }],
    phase: 'C',
    ready: false,
  },
  {
    id: 'FMT-09',
    category: 'formatovani',
    level: 9,
    title: 'Horní a dolní index',
    mechanic: 'oprav',
    bloom: 'aplikovat',
    instructions:
      'Exponenty nastav jako horní index (Ctrl+.) a čísla v chemických vzorcích jako dolní index (Ctrl+,).',
    match: { nbspMode: 'ignore' },
    prefill: {
      format: 'html',
      content: `<p>Byt má rozlohu 65 m2 a sklep 12 m3.</p>
<p>Voda má vzorec H2O, oxid uhličitý CO2.</p>
<p>Kyselina sírová se zapisuje H2SO4.</p>
<p>Platí (a + b)2 = a2 + 2ab + b2.</p>
<p>Vlnová délka zeleného světla je asi 5 · 10-7 m.</p>`,
    },
    solution: {
      format: 'html',
      content: `<p>Byt má rozlohu 65 m<sup>2</sup> a sklep 12 m<sup>3</sup>.</p>
<p>Voda má vzorec H<sub>2</sub>O, oxid uhličitý CO<sub>2</sub>.</p>
<p>Kyselina sírová se zapisuje H<sub>2</sub>SO<sub>4</sub>.</p>
<p>Platí (a + b)<sup>2</sup> = a<sup>2</sup> + 2ab + b<sup>2</sup>.</p>
<p>Vlnová délka zeleného světla je asi 5 · 10<sup>{{-|−}}7</sup> m.</p>`,
    },
    checks: [
      {
        type: 'docMatches',
        compare: ['text', 'superscript', 'subscript'],
      },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'FMT-10',
    category: 'formatovani',
    level: 10,
    title: 'Odkazy',
    mechanic: 'oprav',
    bloom: 'aplikovat → hodnotit',
    instructions: `1. Z textu „rozvrhu na webu školy“ udělej odkaz na https://skola.example.com/rozvrh.
2. Holou adresu ve druhém řádku schovej do odkazu, jehož text řekne, kam vede (třeba „Přihláška na kroužky“).
3. Odkaz „Klikni sem“ přepiš tak, aby jeho text říkal, kam vede. Odkaz musí zůstat.`,
    match: { nbspMode: 'ignore' },
    prefill: {
      format: 'html',
      content: `<p>Změny najdeš v rozvrhu na webu školy.</p>
<p>Přihláška na kroužky: https://skola.example.com/krouzky</p>
<p>Jídelníček na příští týden? <a href="https://skola.example.com/jidelna">Klikni sem</a>.</p>`,
    },
    solution: {
      format: 'html',
      content: `<p>Změny najdeš v <a href="https://skola.example.com/rozvrh">rozvrhu na webu školy</a>.</p>
<p><a href="https://skola.example.com/krouzky">Přihláška na kroužky</a></p>
<p><a href="https://skola.example.com/jidelna">Jídelníček na příští týden</a></p>`,
    },
    checks: [
      {
        type: 'constraint',
        id: 'linkExists',
        hrefIncludes: '/rozvrh',
        textMatches: 'rozvrh',
      },
      {
        type: 'constraint',
        id: 'linkExists',
        hrefIncludes: '/krouzky',
        textMatches: 'krouž|přihláš',
      },
      {
        type: 'constraint',
        id: 'linkExists',
        hrefIncludes: '/jidelna',
        textMatches: 'jídelníč',
      },
      { type: 'constraint', id: 'noRawUrls' },
      { type: 'constraint', id: 'noVagueLinkText' },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'FMT-11',
    category: 'formatovani',
    level: 11,
    title: 'Víceúrovňový seznam',
    mechanic: 'napodob',
    bloom: 'aplikovat',
    instructions:
      'Podle náhledu udělej z osnovy referátu číslovaný seznam se dvěma úrovněmi. Podúroveň vytvoříš klávesou Tab, zpět se vrátíš přes Shift+Tab.',
    match: { nbspMode: 'ignore' },
    editor: { toolbar: 'full' },
    prefill: {
      format: 'text',
      content: `Úvod
Proč jsem si vybral(a) téma
Co se dozvíte
Historie
Počátky
Současnost
Závěr`,
    },
    solution: {
      format: 'html',
      content: `<ol>
  <li>Úvod
    <ol><li>Proč jsem si vybral(a) téma</li><li>Co se dozvíte</li></ol>
  </li>
  <li>Historie
    <ol><li>Počátky</li><li>Současnost</li></ol>
  </li>
  <li>Závěr</li>
</ol>`,
    },
    media: [
      {
        kind: 'docPreview',
        mode: 'full',
        html: `<ol>
  <li>Úvod
    <ol><li>Proč jsem si vybral(a) téma</li><li>Co se dozvíte</li></ol>
  </li>
  <li>Historie
    <ol><li>Počátky</li><li>Současnost</li></ol>
  </li>
  <li>Závěr</li>
</ol>`,
      },
    ],
    checks: [{ type: 'docMatches', compare: ['text', 'list'] }],
    phase: 'C',
    ready: false,
  },
  {
    id: 'FMT-12',
    category: 'formatovani',
    level: 12,
    title: 'Mezery mezi odstavci',
    mechanic: 'oprav',
    bloom: 'aplikovat',
    instructions:
      'Odstavce jsou od sebe oddělené prázdnými řádky. Smaž je a místo nich nastav všem odstavcům mezeru za odstavcem (aspoň 6 pt).',
    match: { nbspMode: 'ignore' },
    prefill: {
      format: 'html',
      content: `<h1>Jak se připravit na test</h1>
<p>Začni s opakováním aspoň tři dny předem.</p>
<p></p>
<p>Udělej si přehled toho, co už umíš a co ne.</p>
<p></p>
<p></p>
<p>Vysvětli látku někomu jinému – nejlíp poznáš, co nechápeš.</p>
<p></p>
<p>Před testem se pořádně vyspi.</p>`,
    },
    solution: {
      format: 'html',
      content: `<h1>Jak se připravit na test</h1>
<p style="margin-bottom:8pt">Začni s opakováním aspoň tři dny předem.</p>
<p style="margin-bottom:8pt">Udělej si přehled toho, co už umíš a co ne.</p>
<p style="margin-bottom:8pt">Vysvětli látku někomu jinému – nejlíp poznáš, co nechápeš.</p>
<p style="margin-bottom:8pt">Před testem se pořádně vyspi.</p>`,
    },
    checks: [
      { type: 'textLines' },
      { type: 'constraint', id: 'noEmptyParagraphs' },
      {
        type: 'constraint',
        id: 'spaceAfterMin',
        pt: 6,
        scope: 'normal',
      },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'FMT-13',
    category: 'formatovani',
    level: 13,
    title: 'Vymazat formátování',
    mechanic: 'oprav',
    bloom: 'aplikovat',
    instructions: `Text jsi zkopíroval z webu a přinesl si s ním zbytečné formátování.
1. Označ všechno a vymaž formátování (Ctrl+\\\\).
2. Pak nastav první řádek jako Nadpis 1.
3. Název filmu Poslední zvonění dej kurzívou.

Nic dalšího neformátuj.`,
    match: { nbspMode: 'ignore' },
    prefill: {
      format: 'html',
      content: `<p><span style="font-family:'Roboto';font-size:17pt;color:#c0392b">Festival studentského filmu</span></p>
<p><span style="font-family:'Lora';font-size:13pt;background-color:#fff176">Letos se do soutěže přihlásilo 24 krátkých filmů. </span><span style="font-family:'Open Sans';font-size:9pt;color:#2e86de">Cenu diváků získal film Poslední zvonění, který natočili studenti 3. ročníku.</span></p>
<p><span style="font-family:'Merriweather';font-size:13pt"><strong><u>Promítání vítězných filmů proběhne v pátek v aule.</u></strong></span></p>`,
    },
    solution: {
      format: 'html',
      content: `<h1>Festival studentského filmu</h1>
<p>Letos se do soutěže přihlásilo 24 krátkých filmů. Cenu diváků získal film <em>Poslední zvonění</em>, který natočili studenti 3. ročníku.</p>
<p>Promítání vítězných filmů proběhne v pátek v aule.</p>`,
    },
    checks: [
      {
        type: 'docMatches',
        compare: ['text', 'style', 'bold', 'italic', 'underline'],
      },
      {
        type: 'constraint',
        id: 'noDirectFormatting',
        allow: ['italic'],
      },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'FMT-14',
    category: 'formatovani',
    level: 14,
    title: 'Napodob: pozvánka',
    mechanic: 'napodob',
    bloom: 'analyzovat',
    instructions:
      'Naformátuj text tak, aby vypadal jako pozvánka na náhledu: styly, zarovnání, tučné a kurzíva, seznam.',
    match: { nbspMode: 'ignore' },
    feedback: { showCountUpfront: false },
    editor: { toolbar: 'full' },
    prefill: {
      format: 'text',
      content: `Vánoční koncert
pěveckého sboru Kos
úterý 15. prosince 2026, 18.00
Srdečně zveme rodiče, přátele i učitele na tradiční vánoční koncert v aule školy. Zazní koledy i úryvky z České mše vánoční.
vstupné dobrovolné
občerstvení připraví 2. ročník
Za sbor Mgr. Petra Malá`,
    },
    solution: {
      format: 'html',
      content: `<p data-style="title" style="text-align:center">Vánoční koncert</p>
<p data-style="subtitle" style="text-align:center">pěveckého sboru Kos</p>
<p style="text-align:center"><strong>úterý 15. prosince 2026, 18.00</strong></p>
<p style="text-align:justify">Srdečně zveme rodiče, přátele i učitele na tradiční vánoční koncert v aule školy. Zazní koledy i úryvky z <em>České mše vánoční</em>.</p>
<ul><li>vstupné dobrovolné</li><li>občerstvení připraví 2. ročník</li></ul>
<p style="text-align:right">Za sbor Mgr. Petra Malá</p>`,
    },
    media: [
      {
        kind: 'docPreview',
        mode: 'full',
        html: `<p data-style="title" style="text-align:center">Vánoční koncert</p>
<p data-style="subtitle" style="text-align:center">pěveckého sboru Kos</p>
<p style="text-align:center"><strong>úterý 15. prosince 2026, 18.00</strong></p>
<p style="text-align:justify">Srdečně zveme rodiče, přátele i učitele na tradiční vánoční koncert v aule školy. Zazní koledy i úryvky z <em>České mše vánoční</em>.</p>
<ul><li>vstupné dobrovolné</li><li>občerstvení připraví 2. ročník</li></ul>
<p style="text-align:right">Za sbor Mgr. Petra Malá</p>`,
      },
    ],
    checks: [
      {
        type: 'docMatches',
        compare: ['text', 'style', 'align', 'list', 'bold', 'italic'],
      },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'FMT-15',
    category: 'formatovani',
    level: 15,
    title: 'Napodob: referát',
    mechanic: 'napodob',
    bloom: 'analyzovat',
    instructions:
      'Naformátuj referát podle náhledu. Adresu zdroje schovej do odkazu s textem „Včela medonosná – Wikipedie“ (adresa: https://cs.wikipedia.org/wiki/Včela_medonosná).',
    match: { nbspMode: 'ignore' },
    feedback: { showCountUpfront: false },
    editor: { toolbar: 'full' },
    prefill: {
      format: 'text',
      content: `Včely
Referát do biologie
Jak žijí
Včela medonosná (Apis mellifera) žije ve včelstvu, které v létě čítá až 50 000 jedinců. Jedna buňka plástve má plochu asi 0,25 cm2.
Kdo je kdo ve včelstvu
královna – klade vajíčka
dělnice – sbírají nektar a pyl, staví plástve
trubci – oplozují královnu
Proč jsou důležité
Včely opylují velkou část plodin, které jíme. Bez nich by byla úroda výrazně menší.
Zdroje
Včela medonosná – Wikipedie (https://cs.wikipedia.org/wiki/Včela_medonosná)`,
    },
    solution: {
      format: 'html',
      content: `<p data-style="title">Včely</p>
<p data-style="subtitle">Referát do biologie</p>
<h1>Jak žijí</h1>
<p style="text-align:justify">Včela medonosná (<em>Apis mellifera</em>) žije ve včelstvu, které v létě čítá až 50 000 jedinců. Jedna buňka plástve má plochu asi 0,25 cm<sup>2</sup>.</p>
<h2>Kdo je kdo ve včelstvu</h2>
<ul><li><strong>královna</strong> – klade vajíčka</li><li><strong>dělnice</strong> – sbírají nektar a pyl, staví plástve</li><li><strong>trubci</strong> – oplozují královnu</li></ul>
<h1>Proč jsou důležité</h1>
<p style="text-align:justify">Včely opylují velkou část plodin, které jíme. Bez nich by byla úroda výrazně menší.</p>
<h1>Zdroje</h1>
<ol><li><a href="https://cs.wikipedia.org/wiki/Včela_medonosná">Včela medonosná – Wikipedie</a></li></ol>`,
    },
    media: [
      {
        kind: 'docPreview',
        mode: 'full',
        // same as solution
        html: `<p data-style="title">Včely</p>
<p data-style="subtitle">Referát do biologie</p>
<h1>Jak žijí</h1>
<p style="text-align:justify">Včela medonosná (<em>Apis mellifera</em>) žije ve včelstvu, které v létě čítá až 50 000 jedinců. Jedna buňka plástve má plochu asi 0,25 cm<sup>2</sup>.</p>
<h2>Kdo je kdo ve včelstvu</h2>
<ul><li><strong>královna</strong> – klade vajíčka</li><li><strong>dělnice</strong> – sbírají nektar a pyl, staví plástve</li><li><strong>trubci</strong> – oplozují královnu</li></ul>
<h1>Proč jsou důležité</h1>
<p style="text-align:justify">Včely opylují velkou část plodin, které jíme. Bez nich by byla úroda výrazně menší.</p>
<h1>Zdroje</h1>
<ol><li><a href="https://cs.wikipedia.org/wiki/Včela_medonosná">Včela medonosná – Wikipedie</a></li></ol>`,
      },
    ],
    checks: [
      {
        type: 'docMatches',
        compare: [
          'text',
          'style',
          'align',
          'list',
          'bold',
          'italic',
          'superscript',
          'link',
        ],
      },
      { type: 'constraint', id: 'noRawUrls' },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'FMT-16',
    category: 'formatovani',
    level: 16,
    title: 'Nejednotnosti',
    mechanic: 'lovec chyb',
    bloom: 'analyzovat',
    instructions:
      'Dokument je skoro hotový, ale stejné věci v něm nevypadají stejně. Najdi nejednotnosti a oprav je.',
    match: { nbspMode: 'ignore' },
    feedback: { showCountUpfront: false, revealAfter: 3 },
    prefill: {
      format: 'html',
      content: `<p data-style="title">Turistický kroužek</p>
<h2>Kdy se scházíme</h2>
<p style="text-align:justify">Každou středu od 15.00 v učebně 112.</p>
<p><strong><span style="font-size:16pt">Co budeme dělat</span></strong></p>
<ul><li>výlety do okolí Brna</li><li>orientace v terénu</li></ul>
<p>- základy první pomoci</p>
<h2>Kolik to stojí</h2>
<p style="text-align:center">Kroužek je zdarma, platíš jen jízdenky.</p>
<p></p>
<h2>Kontakt</h2>
<p style="text-align:justify"><span style="font-family:'Lora'">Mgr. Tomáš Horák, horak@skola.example.com</span></p>`,
    },
    solution: {
      format: 'html',
      content: `<p data-style="title">Turistický kroužek</p>
<h2>Kdy se scházíme</h2>
<p style="text-align:justify">Každou středu od 15.00 v učebně 112.</p>
<h2>Co budeme dělat</h2>
<ul><li>výlety do okolí Brna</li><li>orientace v terénu</li><li>základy první pomoci</li></ul>
<h2>Kolik to stojí</h2>
<p style="text-align:justify">Kroužek je zdarma, platíš jen jízdenky.</p>
<h2>Kontakt</h2>
<p style="text-align:justify">Mgr. Tomáš Horák, horak@skola.example.com</p>`,
    },
    checks: [
      { type: 'docMatches', compare: ['text', 'style', 'align', 'list'] },
      { type: 'constraint', id: 'uniformFont', scope: 'normal' },
      { type: 'constraint', id: 'noEmptyParagraphs' },
      { type: 'constraint', id: 'noFakeHeadings' },
      { type: 'constraint', id: 'noManualListMarkers' },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'FMT-17',
    category: 'formatovani',
    level: 17,
    title: 'Zachraň plakát',
    mechanic: 'posuď',
    bloom: 'hodnotit',
    instructions: `Plakát je nečitelný. Uprav ho tak, aby splnil pravidla:
- nejvýš 2 písma,
- hlavní nadpis jako Název, další nadpisy stylem nadpisu,
- běžný text není na střed,
- nic není podtržené,
- tučně je nejvýš desetina textu.

Obsah neměň. Na konec připiš odstavec, který začíná „Změnil(a) jsem:“, a dvěma větami vysvětli, co a proč.`,
    match: { nbspMode: 'ignore' },
    review: 'auto+manual',
    prefill: {
      format: 'html',
      content: `<p style="text-align:center"><span style="font-family:'Lora';font-size:30pt"><strong><u>ŠKOLNÍ BLEŠÁK</u></strong></span></p>
<p style="text-align:center"><span style="font-family:'Roboto';font-size:16pt;color:#e67e22"><strong>Kdy a kde?</strong></span></p>
<p style="text-align:center"><span style="font-family:'Open Sans';font-size:13pt"><strong><u>Ve čtvrtek 5. listopadu 2026 od 15.00 do 18.00 v atriu školy.</u></strong></span></p>
<p style="text-align:center"><span style="font-family:'Merriweather';font-size:16pt;color:#8e44ad"><strong>Co můžeš přinést?</strong></span></p>
<p style="text-align:center"><span style="font-family:'PT Serif';font-size:12pt"><strong>Oblečení, knihy, deskové hry a cokoli, co už nepotřebuješ, ale někomu jinému udělá radost. Prodávat můžeš sám, nebo věci jen darovat.</strong></span></p>
<p style="text-align:center"><span style="font-family:'Arial';font-size:14pt;background-color:#fff176"><strong><u>Výtěžek věnujeme útulku Pes v nouzi.</u></strong></span></p>`,
    },
    solution: {
      format: 'html',
      content: `<p data-style="title">Školní blešák</p>
<h2>Kdy a kde?</h2>
<p>Ve čtvrtek 5. listopadu 2026 od 15.00 do 18.00 v atriu školy.</p>
<h2>Co můžeš přinést?</h2>
<p>Oblečení, knihy, deskové hry a cokoli, co už nepotřebuješ, ale někomu jinému udělá radost. Prodávat můžeš sám, nebo věci jen darovat.</p>
<p>Výtěžek věnujeme útulku <strong>Pes v nouzi</strong>.</p>
<p>Změnil jsem: nadpisy jsem převedl na styly a sjednotil písmo. Zrušil jsem podtržení a většinu tučného textu, aby vynikla jen hlavní informace.</p>`,
    },
    checks: [
      { type: 'constraint', id: 'maxFonts', max: 2 },
      {
        type: 'constraint',
        id: 'requireStyle',
        style: 'title',
        min: 1,
        max: 1,
      },
      { type: 'constraint', id: 'requireHeadings', min: 1 },
      { type: 'constraint', id: 'noFakeHeadings' },
      { type: 'constraint', id: 'noCenteredBody' },
      { type: 'constraint', id: 'underlineOnlyLinks' },
      { type: 'constraint', id: 'boldRatioMax', ratio: 0.1 },
      {
        type: 'require',
        pattern: '5\\. listopadu',
        flags: 'iu',
        label: 'datum akce',
      },
      {
        type: 'require',
        pattern: 'Pes v nouzi',
        flags: 'iu',
        label: 'název útulku',
      },
      {
        type: 'require',
        pattern: 'Změnil(?:a|\\(a\\))? jsem:',
        flags: 'iu',
        label: 'odstavec Změnil(a) jsem:',
      },
    ],
    phase: 'D',
    ready: false,
  },
  {
    id: 'FMT-18',
    category: 'formatovani',
    level: 18,
    title: 'Navrhni formát',
    mechanic: 'vytvoř',
    bloom: 'tvořit',
    instructions: `Naformátuj návod tak, aby se dobře četl. Jak, je na tobě. Minimum:
- Název,
- aspoň jeden nadpis,
- aspoň jeden seznam.

Obsah neměň. Návod pak ohodnotí spolužák.`,
    match: { nbspMode: 'ignore' },
    review: 'manual',
    prefill: {
      format: 'text',
      content: `Bylinky v truhlíku
Co budeš potřebovat
truhlík s otvory ve dně
substrát pro bylinky
sazenice bazalky, máty a petrželky
konev
Postup
Na dno truhlíku nasyp vrstvu keramzitu.
Truhlík naplň substrátem do dvou třetin.
Sazenice rozmísti asi 15 cm od sebe a zasyp je.
Bylinky zalij a postav je na světlé místo.
Tip
Mátu sázej zvlášť, jinak ostatní bylinky přeroste.`,
    },
    checks: [
      {
        type: 'constraint',
        id: 'requireStyle',
        style: 'title',
        min: 1,
        max: 1,
      },
      { type: 'constraint', id: 'requireHeadings', min: 1 },
      { type: 'constraint', id: 'requireList', min: 1 },
      { type: 'constraint', id: 'noFakeHeadings' },
      { type: 'constraint', id: 'noEmptyParagraphs' },
      { type: 'constraint', id: 'maxFonts', max: 2 },
      {
        type: 'constraint',
        id: 'textPreserved',
        source: 'prefill',
      },
    ],
    selfChecklist: [
      'Čte se to snadno i na první pohled?',
      'Je jasné, co je nadpis a co obsah?',
      'Používám nejvýš 2 písma a tučné jen výjimečně?',
    ],
    phase: 'D',
    ready: false,
  },

  // ─── Kombinace (KOM-05..08: requiredOnly; others ignore) ──────
  {
    id: 'KOM-01',
    category: 'kombinace',
    level: 1,
    title: 'Jídelníček',
    mechanic: 'oprav',
    bloom: 'aplikovat',
    instructions: `V jídelníčku je {errorCount} v typografii. Kromě toho ho naformátuj:
- hlavní nadpis jako Název,
- dny jako Nadpis 2,
- jídla jako odrážkový seznam (bez ručních pomlček).`,
    match: { nbspMode: 'ignore' },
    prefill: {
      format: 'html',
      content: `<p><strong><span style="font-size:20pt">Jídelníček 12.10.-16.10.</span></strong></p>
<p>Výdej obědů: 11:30 - 14:00</p>
<p><strong>Pondělí</strong></p>
<p>- Polévka: hovězí vývar s nudlemi (alergeny 1,3,9)</p>
<p>- Kuřecí řízek, bramborová kaše (35,- Kč)</p>
<p><strong>Úterý</strong></p>
<p>- Polévka: hrachová (alergeny 1 ,7)</p>
<p>- Špagety s rajskou omáčkou (35,-Kč)</p>`,
    },
    solution: {
      format: 'html',
      content: `<p data-style="title">Jídelníček {{12.–16. 10.|12. 10. – 16. 10.|12.–16. října|12. října – 16. října}}</p>
<p>Výdej obědů: {{11:30–14:00|11.30–14.00}}</p>
<h2>Pondělí</h2>
<ul><li>Polévka: hovězí vývar s nudlemi (alergeny 1, 3, 9)</li><li>Kuřecí řízek, bramborová kaše (35 Kč)</li></ul>
<h2>Úterý</h2>
<ul><li>Polévka: hrachová (alergeny 1, 7)</li><li>Špagety s rajskou omáčkou (35 Kč)</li></ul>`,
    },
    checks: [
      { type: 'docMatches', compare: ['text', 'style', 'list'] },
      { type: 'constraint', id: 'noManualListMarkers' },
      { type: 'constraint', id: 'noFakeHeadings' },
    ],
    errors: [
      {
        at: [
          '12.–16. 10.',
          '12. 10. – 16. 10.',
          '12.–16. října',
          '12. října – 16. října',
        ],
        rule: 'datum',
      },
      { at: ['11:30–14:00', '11.30–14.00'], rule: 'cas' },
      { at: '1, 3, 9', rule: 'interpunkce' },
      { at: 'kaše (35 Kč)', rule: 'mena' },
      { at: '1, 7', rule: 'interpunkce' },
      { at: 'omáčkou (35 Kč)', rule: 'mena' },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'KOM-02',
    category: 'kombinace',
    level: 2,
    title: 'Omluvenka',
    mechanic: 'oprav',
    bloom: 'aplikovat',
    instructions: `V omluvence je {errorCount} v typografii. Naformátuj ji:
- datum a podpis vpravo,
- nadpis jako Název na střed,
- hlavní text do bloku.`,
    match: { nbspMode: 'ignore' },
    prefill: {
      format: 'html',
      content: `<p>V Brně dne 6.10.2026</p>
<p><strong>Omluvenka</strong></p>
<p>Vážená paní mgr. Nováková,</p>
<p>omlouvám svého syna Petra Dvořáka z vyučování ve dnech 1.-3. října 2026 z rodinných důvodů.Děkuji za pochopení .</p>
<p>Jana Dvořáková</p>`,
    },
    solution: {
      format: 'html',
      content: `<p style="text-align:right">V Brně dne 6. 10. 2026</p>
<p data-style="title" style="text-align:center">Omluvenka</p>
<p>Vážená paní Mgr. Nováková,</p>
<p style="text-align:justify">omlouvám svého syna Petra Dvořáka z vyučování ve dnech 1.–3. října 2026 z rodinných důvodů. Děkuji za pochopení.</p>
<p style="text-align:right">Jana Dvořáková</p>`,
    },
    checks: [
      { type: 'docMatches', compare: ['text', 'style', 'align', 'bold'] },
    ],
    errors: [
      { at: '6. 10. 2026', rule: 'datum' },
      { at: 'Mgr. Nováková', rule: 'tituly' },
      { at: '1.–3. října', rule: 'pomlcka' },
      { at: 'důvodů. Děkuji', rule: 'interpunkce' },
      { at: 'pochopení.', rule: 'interpunkce' },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'KOM-03',
    category: 'kombinace',
    level: 3,
    title: 'Recept',
    mechanic: 'oprav',
    bloom: 'aplikovat',
    instructions: `V receptu je {errorCount} v typografii. Naformátuj ho:
- název receptu jako Název,
- Suroviny a Postup jako Nadpis 2,
- suroviny jako odrážky, postup jako číslovaný seznam.`,
    match: { nbspMode: 'ignore' },
    prefill: {
      format: 'html',
      content: `<p><span style="font-size:20pt"><strong>Bábovka</strong></span></p>
<p><strong>Suroviny</strong></p>
<p>- 250g polohrubé mouky</p>
<p>- 200g cukru</p>
<p>- 4 vejce</p>
<p>- 1/2 balíčku prášku do pečiva</p>
<p>- 125ml oleje</p>
<p>- 125ml mléka</p>
<p><strong>Postup</strong></p>
<p>1. Troubu předehřej na 180°C.</p>
<p>2. Vejce utři s cukrem, přidej olej, mléko a mouku s práškem do pečiva.</p>
<p>3. Těsto nalij do vymazané formy a peč cca. 45 min.</p>`,
    },
    solution: {
      format: 'html',
      content: `<p data-style="title">Bábovka</p>
<h2>Suroviny</h2>
<ul><li>250 g polohrubé mouky</li><li>200 g cukru</li><li>4 vejce</li><li>{{1/2|½}} balíčku prášku do pečiva</li><li>125 ml oleje</li><li>125 ml mléka</li></ul>
<h2>Postup</h2>
<ol><li>Troubu předehřej na 180 °C.</li><li>Vejce utři s cukrem, přidej olej, mléko a mouku s práškem do pečiva.</li><li>Těsto nalij do vymazané formy a peč cca 45 min.</li></ol>`,
    },
    checks: [
      { type: 'docMatches', compare: ['text', 'style', 'list'] },
      { type: 'constraint', id: 'noManualListMarkers' },
      { type: 'constraint', id: 'noFakeHeadings' },
    ],
    errors: [
      { at: '250 g', rule: 'jednotky' },
      { at: '200 g', rule: 'jednotky' },
      { at: '125 ml oleje', rule: 'jednotky' },
      { at: '125 ml mléka', rule: 'jednotky' },
      { at: '180 °C', rule: 'jednotky' },
      { at: 'cca 45', rule: 'zkratky' },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'KOM-04',
    category: 'kombinace',
    level: 4,
    title: 'Plakát na seznamovák',
    mechanic: 'přepiš z obrázku + napodob',
    bloom: 'aplikovat → analyzovat',
    instructions:
      'Podle náhledu napiš a naformátuj plakát. Text přepiš přesně, včetně uvozovek a pomlček. Odkaz u registrace vede na https://skola.example.com/seznamovak.',
    match: { nbspMode: 'ignore' },
    charHints: ['„', '“', '–'],
    editor: { allowPaste: false, toolbar: 'full' },
    feedback: { showCountUpfront: false },
    solution: {
      format: 'html',
      content: `<p data-style="title" style="text-align:center">Seznamovací večer</p>
<p data-style="subtitle" style="text-align:center">„Prváci, vítejte!“</p>
<p style="text-align:center"><strong>pátek 23. října 2026, {{18.00–22.00|18:00–22:00}}</strong></p>
<p>Kde: aula gymnázia</p>
<p>Pro koho: 1.–4. ročník</p>
<p>Vstupné: 80 Kč</p>
<ul><li>hudba a tanec</li><li>kvíz o škole</li><li>občerstvení</li></ul>
<p>Registrace: <a href="https://skola.example.com/seznamovak">přihlas se online</a></p>`,
    },
    media: [
      {
        kind: 'docPreview',
        mode: 'full',
        caption: 'nekopírovatelný náhled = řešení',
        html: `<p data-style="title" style="text-align:center">Seznamovací večer</p>
<p data-style="subtitle" style="text-align:center">„Prváci, vítejte!“</p>
<p style="text-align:center"><strong>pátek 23. října 2026, {{18.00–22.00|18:00–22:00}}</strong></p>
<p>Kde: aula gymnázia</p>
<p>Pro koho: 1.–4. ročník</p>
<p>Vstupné: 80 Kč</p>
<ul><li>hudba a tanec</li><li>kvíz o škole</li><li>občerstvení</li></ul>
<p>Registrace: <a href="https://skola.example.com/seznamovak">přihlas se online</a></p>`,
      },
    ],
    checks: [
      {
        type: 'docMatches',
        compare: ['text', 'style', 'align', 'list', 'bold', 'link'],
      },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'KOM-05',
    category: 'kombinace',
    level: 5,
    title: 'Sportovní zpráva',
    mechanic: 'lovec chyb',
    bloom: 'analyzovat',
    instructions: `Článek před vydáním ve školním časopise. Oprav typografii, nejen v číslech, ale i nezlomitelné mezery. Oprav i formátování:
- titulek má být Název,
- první odstavec (perex) celý kurzívou.`,
    match: { nbspMode: 'requiredOnly' },
    autoErrors: 'nbsp',
    feedback: { showCountUpfront: false, revealAfter: 3 },
    prefill: {
      format: 'html',
      content: `<p><strong><span style="font-size:18pt">Florbalisté vybojovali 2.místo</span></strong></p>
<p>Náš tým uspěl na krajském turnaji v Blansku.Ve finále prohrál těsně 3 : 4.</p>
<p>Turnaje se zúčastnilo 12 týmů z celého kraje. Kapitán Ondra Malý, kterému je teprve 15-ti let, po zápase řekl: "Trenér nám před finále říkal, ať hrajeme 'v klidu'. Nepovedlo se." Doprovodný běh na 1km vyhrála Klára Nová časem 3:21.45.</p>`,
    },
    solution: {
      format: 'html',
      content: n(`<p data-style="title" data-accept="title,h1">Florbalisté vybojovali 2.~místo</p>
<p><em>Náš tým uspěl na krajském turnaji v~Blansku. Ve finále prohrál těsně 3:4.</em></p>
<p>Turnaje se zúčastnilo 12~týmů z~celého kraje. Kapitán Ondra Malý, kterému je teprve 15~let, po zápase řekl: „Trenér nám před finále říkal, ať hrajeme ‚v~klidu‘. Nepovedlo se.“ Doprovodný běh na 1~km vyhrála Klára Nová časem 3:21,45.</p>`),
    },
    checks: [
      { type: 'docMatches', compare: ['text', 'style', 'italic'] },
      { type: 'constraint', id: 'noManualHeadingFormatting' },
    ],
    errors: [
      { at: n('2.~místo'), rule: 'cislovky' },
      { at: 'Blansku. Ve', rule: 'interpunkce' },
      { at: 'těsně 3:4', rule: 'matematika' },
      { at: n('15~let'), rule: 'cislovky' },
      { at: 'řekl: „Trenér', rule: 'uvozovky' },
      { at: n('‚v~klidu‘'), rule: 'uvozovky' },
      { at: 'se.“ Doprovodný', rule: 'uvozovky' },
      { at: n('1~km'), rule: 'jednotky' },
      { at: '3:21,45', rule: 'cas' },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'KOM-06',
    category: 'kombinace',
    level: 6,
    title: 'Inzerát na brigádu',
    mechanic: 'lovec chyb',
    bloom: 'analyzovat',
    instructions:
      'Inzerát kavárny má chyby v typografii i ve formátování. Podmínky dej do odrážkového seznamu a e-mailovou adresu udělej odkazem (mailto).',
    match: { nbspMode: 'requiredOnly' },
    autoErrors: 'nbsp',
    feedback: { showCountUpfront: false, revealAfter: 3 },
    prefill: {
      format: 'html',
      content: `<p data-style="title">Hledáme brigádníka / brigádnici</p>
<p>Kavárna U Lípy s.r.o. hledá posilu na víkendy.</p>
<p>- mzda 150Kč/h</p>
<p>- směny pá-ne 7:00 - 12:00</p>
<p>- věk od 15-ti let</p>
<p>Životopis pošli na adresu prace@ulipy.example.com nebo volej na 777 123 456.</p>
<p>Nástup možný ihned.Těšíme se !</p>`,
    },
    solution: {
      format: 'html',
      content: n(`<p data-style="title">Hledáme brigádníka/brigádnici</p>
<p>Kavárna U~Lípy, s. r. o., hledá posilu na víkendy.</p>
<ul><li>mzda 150~Kč/h</li><li>směny pá–ne {{7:00–12:00|7.00–12.00}}</li><li>věk od 15~let</li></ul>
<p>Životopis pošli na adresu <a href="mailto:prace@ulipy.example.com">prace@ulipy.example.com</a> nebo volej na 777 123 456.</p>
<p>Nástup možný ihned. Těšíme se!</p>`),
    },
    checks: [
      { type: 'docMatches', compare: ['text', 'style', 'list', 'link'] },
      { type: 'constraint', id: 'noManualListMarkers' },
      { type: 'constraint', id: 'noRawUrls' },
    ],
    errors: [
      { at: 'brigádníka/brigádnici', rule: 'lomitko' },
      { at: 'Lípy, s. r. o.,', rule: 'firmy' },
      { at: n('150~Kč/h'), rule: 'jednotky' },
      { at: 'pá–ne', rule: 'pomlcka' },
      { at: ['7:00–12:00', '7.00–12.00'], rule: 'cas' },
      { at: n('15~let'), rule: 'cislovky' },
      { at: 'ihned. Těšíme', rule: 'interpunkce' },
      { at: 'se!', rule: 'interpunkce' },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'KOM-07',
    category: 'kombinace',
    level: 7,
    title: 'Přírodovědný referát',
    mechanic: 'napodob + lovec chyb',
    bloom: 'analyzovat',
    instructions:
      'Naformátuj referát podle náhledu struktury (Název, Nadpis 1, Nadpis 2, text do bloku, seznamy) a oprav typografii. Jednotky a vzorce zapiš s indexy. Adresu zdroje schovej do odkazu s textem „Wikipedie: Voda“.',
    match: { nbspMode: 'requiredOnly' },
    autoErrors: 'nbsp',
    feedback: { showCountUpfront: false, revealAfter: 3 },
    editor: { toolbar: 'full' },
    prefill: {
      format: 'text',
      content: `Voda na Zemi
Kolik vody máme
Voda pokrývá asi 71% povrchu Země. Celkový objem vody je přibližně 1386000000 km3, sladká voda z toho tvoří jen 2,5 %.
Vlastnosti vody
Molekula vody má vzorec H2O. Za normálního tlaku voda vře při 100°C a mrzne při 0 °C. Hustota vody je 1000 kg/m3.
Skupenství
- pevné - led
- kapalné - voda
- plynné - vodní pára
Zdroje
Wikipedie: Voda (https://cs.wikipedia.org/wiki/Voda)`,
    },
    solution: {
      format: 'html',
      content: n(`<p data-style="title">Voda na Zemi</p>
<h1>Kolik vody máme</h1>
<p style="text-align:justify">Voda pokrývá asi 71~% povrchu Země. Celkový objem vody je přibližně 1~386~000~000~km<sup>3</sup>, sladká voda z~toho tvoří jen 2,5~%.</p>
<h1>Vlastnosti vody</h1>
<p style="text-align:justify">Molekula vody má vzorec H<sub>2</sub>O. Za normálního tlaku voda vře při 100~°C a~mrzne při 0~°C. Hustota vody je {{1~000|1000}}~kg/m<sup>3</sup>.</p>
<h2>Skupenství</h2>
<ul><li>pevné – led</li><li>kapalné – voda</li><li>plynné – vodní pára</li></ul>
<h1>Zdroje</h1>
<ol><li><a href="https://cs.wikipedia.org/wiki/Voda">Wikipedie: Voda</a></li></ol>`),
    },
    media: [
      {
        kind: 'docPreview',
        mode: 'wireframe',
        caption: 'struktura = řešení (bez textu)',
        // TODO: wireframe should show structure only; using solution HTML as placeholder
        html: n(`<p data-style="title">Voda na Zemi</p>
<h1>Kolik vody máme</h1>
<p style="text-align:justify">…</p>
<h1>Vlastnosti vody</h1>
<p style="text-align:justify">…</p>
<h2>Skupenství</h2>
<ul><li>…</li></ul>
<h1>Zdroje</h1>
<ol><li>…</li></ol>`),
      },
    ],
    checks: [
      {
        type: 'docMatches',
        compare: [
          'text',
          'style',
          'align',
          'list',
          'superscript',
          'subscript',
          'link',
        ],
      },
      { type: 'constraint', id: 'noManualListMarkers' },
      { type: 'constraint', id: 'noRawUrls' },
    ],
    errors: [
      { at: n('71~%'), rule: 'jednotky' },
      { at: n('1~386~000~000'), rule: 'cisla' },
      { at: n('100~°C'), rule: 'jednotky' },
      { at: [n('1~000~kg'), n('1000~kg')], rule: 'jednotky' },
      { at: 'pevné – led', rule: 'pomlcka' },
      { at: 'kapalné – voda', rule: 'pomlcka' },
      { at: 'plynné – vodní', rule: 'pomlcka' },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'KOM-08',
    category: 'kombinace',
    level: 8,
    title: 'Zápis ze studentské rady',
    mechanic: 'lovec chyb',
    bloom: 'analyzovat',
    instructions:
      'Zápis ze schůze má chyby v typografii (včetně nezlomitelných mezer) i ve formátování. Nadpisy oddílů mají být Nadpis 2, body jednání číslovaný seznam a úkoly odrážkový seznam.',
    match: { nbspMode: 'requiredOnly' },
    autoErrors: 'nbsp',
    feedback: { showCountUpfront: false, revealAfter: 3 },
    prefill: {
      format: 'html',
      content: `<p data-style="title">Zápis ze schůze studentské rady</p>
<p>Datum: 2.10.2026, 14:00-15:30, učebna č.204</p>
<p>Přítomni: PhDr. Jana Malá Ph.D. (koordinátorka), zástupci všech ročníků</p>
<p><strong>Projednáno</strong></p>
<p>1) Tzv. "ples nanečisto" proběhne v pátek 20.11. v tělocvičně.</p>
<p>2) Vstupné bude 100,- Kč, tj. stejně jako loni.</p>
<p>3) Výzdobu připraví 2. a 3.ročník do 15. 11.</p>
<p><strong>Úkoly</strong></p>
<p>- Tomáš - plakáty (termín: 9.11.)</p>
<p>- Lucie - rozpočet v Excelu/Tabulkách Google</p>
<p>Zapsala: Eva Králová, 1.ročník</p>`,
    },
    solution: {
      format: 'html',
      content: n(`<p data-style="title">Zápis ze schůze studentské rady</p>
<p>Datum: {{2.~10. 2026|02.10.2026|2026-10-02}}, {{14:00–15:30|14.00–15.30}}, učebna č. 204</p>
<p>Přítomni: PhDr.~Jana Malá, Ph.D. (koordinátorka), zástupci všech ročníků</p>
<h2>Projednáno</h2>
<ol><li>Takzvaný „ples nanečisto“ proběhne v~pátek 20.~11. v~tělocvičně.</li><li>Vstupné bude 100~Kč, tj.~stejně jako loni.</li><li>Výzdobu připraví 2. a~3.~ročník do 15.~11.</li></ol>
<h2>Úkoly</h2>
<ul><li>Tomáš – plakáty (termín: 9.~11.)</li><li>Lucie – rozpočet v~Excelu / Tabulkách Google</li></ul>
<p>Zapsala: Eva Králová, 1.~ročník</p>`),
    },
    checks: [
      { type: 'docMatches', compare: ['text', 'style', 'list'] },
      { type: 'constraint', id: 'noManualListMarkers' },
      { type: 'constraint', id: 'noFakeHeadings' },
    ],
    errors: [
      {
        at: [n('2.~10. 2026'), '02.10.2026', '2026-10-02'],
        rule: 'datum',
      },
      { at: ['14:00–15:30', '14.00–15.30'], rule: 'cas' },
      { at: 'č. 204', rule: 'zkratky' },
      { at: 'Malá, Ph.D.', rule: 'tituly' },
      { at: 'Takzvaný', rule: 'zkratky' },
      { at: '„ples nanečisto“', rule: 'uvozovky' },
      { at: n('20.~11.'), rule: 'datum' },
      { at: n('100~Kč,'), rule: 'mena' },
      { at: n('3.~ročník'), rule: 'cislovky' },
      { at: 'Tomáš – plakáty', rule: 'pomlcka' },
      { at: n('9.~11.'), rule: 'datum' },
      { at: 'Lucie – rozpočet', rule: 'pomlcka' },
      { at: 'Excelu / Tabulkách', rule: 'lomitko' },
      { at: n('1.~ročník'), rule: 'cislovky' },
    ],
    phase: 'C',
    ready: false,
  },
  {
    id: 'KOM-09',
    category: 'kombinace',
    level: 9,
    title: 'Dva plakáty',
    mechanic: 'posuď',
    bloom: 'hodnotit',
    instructions: `Dva spolužáci udělali plakát na stejnou akci.
1. Smaž horší verzi i oba popisky „Verze A“ a „Verze B“.
2. V lepší verzi oprav zbylé chyby.
3. Pod plakát napiš aspoň dvě věty, proč je lepší.`,
    match: { nbspMode: 'ignore' },
    review: 'auto+manual',
    feedback: { showCountUpfront: false },
    prefill: {
      format: 'html',
      content: `<h3>Verze A</h3>
<p data-style="title">Školní blešák</p>
<p><strong>čtvrtek 5. listopadu 2026, 15.00 - 18.00, atrium školy</strong></p>
<p>Přines oblečení, knihy nebo hry, které už nepotřebuješ. Výtěžek poputuje do útulku "Pes v nouzi".</p>
<ul><li>stůl za 20 Kč</li><li>vstup zdarma</li></ul>
<h3>Verze B</h3>
<p style="text-align:center"><span style="font-family:'Lora';font-size:28pt"><strong><u>ŠKOLNÍ BLEŠÁK</u></strong></span></p>
<p style="text-align:center"><span style="font-family:'Roboto'">čtvrtek 5.11.2026, 15.00-18.00, atrium školy</span></p>
<p style="text-align:center"><span style="font-family:'Open Sans'"><u>Přines oblečení, knihy nebo hry , které už nepotřebuješ.</u> Výtěžek dáme útulku „Pes v nouzi“.</span></p>
<p style="text-align:center">- stůl za 20,- Kč</p>
<p style="text-align:center">- vstup zdarma</p>`,
    },
    solution: {
      format: 'html',
      content: `<p data-style="title">Školní blešák</p>
<p><strong>čtvrtek 5. listopadu 2026, 15.00–18.00, atrium školy</strong></p>
<p>Přines oblečení, knihy nebo hry, které už nepotřebuješ. Výtěžek poputuje do útulku „Pes v nouzi“.</p>
<ul><li>stůl za 20 Kč</li><li>vstup zdarma</li></ul>
<p>Verze A je lepší, protože má nadpis jako Název a podmínky v seznamu. Verze B míchá několik písem, všechno je na střed a podtržené.</p>`,
    },
    checks: [
      {
        type: 'docMatches',
        compare: ['text', 'style', 'list', 'bold'],
        trailingFreeText: { minWords: 12 },
      },
    ],
    errors: [
      { at: '15.00–18.00', rule: 'cas' },
      { at: 'do útulku „Pes', rule: 'uvozovky' },
    ],
    phase: 'D',
    ready: false,
  },
  {
    id: 'KOM-10',
    category: 'kombinace',
    level: 10,
    title: 'Vlastní pozvánka',
    mechanic: 'vytvoř',
    bloom: 'tvořit',
    instructions: `Vymysli akci (turnaj, výstavu, koncert…) a napiš na ni pozvánku. Musí obsahovat:
- Název,
- datum v souvislém textu,
- časové rozmezí,
- cenu v Kč,
- přímou řeč v českých uvozovkách,
- odkaz na přihlášku,
- aspoň jeden seznam.

Text musí projít typografickou kontrolou včetně nezlomitelných mezer.`,
    match: { nbspMode: 'ignore' },
    review: 'auto',
    solution: {
      format: 'html',
      content: n(`<p data-style="title">Turnaj ve stolním tenise</p>
<p>Zveme všechny na turnaj, který proběhne ve středu 18.~listopadu 2026 v~čase 14.00–17.00 v~tělocvičně. Startovné je 30~Kč a~zahrnuje i~čaj. Pan učitel Novák slibuje: „Vítěz dostane pohár i~diplom.“ Přihlásit se můžeš do pátku 13.~listopadu.</p>
<h2>S~sebou</h2>
<ul><li>pálku (nebo si ji půjč)</li><li>sálovou obuv</li><li>pití</li></ul>
<p>Přihláška: <a href="https://skola.example.com/turnaj">formulář na webu školy</a></p>`),
    },
    checks: [
      {
        type: 'constraint',
        id: 'requireStyle',
        style: 'title',
        min: 1,
        max: 1,
      },
      {
        type: 'require',
        pattern: REQUIRE_DATUM,
        label: 'datum v souvislém textu',
      },
      {
        type: 'require',
        pattern: REQUIRE_ROZMEZI,
        label: 'časové rozmezí s pomlčkou',
      },
      {
        type: 'require',
        pattern: '\\d[ \\u00A0]Kč',
        label: 'cena v Kč',
      },
      {
        type: 'require',
        pattern: '„[^„“]+“',
        label: 'přímá řeč v českých uvozovkách',
      },
      { type: 'constraint', id: 'linkExists' },
      { type: 'constraint', id: 'requireList', min: 1 },
      { type: 'constraint', id: 'noFakeHeadings' },
      { type: 'constraint', id: 'maxFonts', max: 2 },
      { type: 'constraint', id: 'underlineOnlyLinks' },
      {
        type: 'lint',
        maxErrors: 0,
        treatAsErrors: ['nbsp-jednopismenne', 'nbsp-jednotka'],
      },
      { type: 'minWords', min: 40 },
    ],
    phase: 'D',
    ready: false,
  },
  {
    id: 'KOM-11',
    category: 'kombinace',
    level: 11,
    title: 'Článek do školního časopisu',
    mechanic: 'vytvoř',
    bloom: 'tvořit',
    instructions:
      'Napiš článek do školního časopisu na vlastní téma (aspoň 150 slov) s Názvem a aspoň dvěma nadpisy. Až projde kontrolou, zkopíruj ho tlačítkem do Google Docs a dej spolužákovi k revizi v režimu návrhů.',
    match: { nbspMode: 'ignore' },
    review: 'manual',
    checks: [
      { type: 'minWords', min: 150 },
      {
        type: 'constraint',
        id: 'requireStyle',
        style: 'title',
        min: 1,
        max: 1,
      },
      { type: 'constraint', id: 'requireHeadings', min: 2 },
      { type: 'constraint', id: 'noFakeHeadings' },
      { type: 'constraint', id: 'maxFonts', max: 2 },
      { type: 'lint', maxErrors: 0 },
    ],
    selfChecklist: [
      'Má článek jasnou strukturu?',
      'Zkontroloval(a) jsem uvozovky, pomlčky, čísla a zkratky?',
      'Je tučné písmo jen u toho nejdůležitějšího?',
    ],
    phase: 'D',
    ready: false,
  },
  {
    id: 'KOM-12',
    category: 'kombinace',
    level: 12,
    title: 'Terénní úkol',
    mechanic: 'posuď',
    bloom: 'hodnotit',
    instructions:
      'Najdi v reálném světě text s typografickými chybami (jídelní lístek, plakát, cedule, web obce…). Volitelně ho vyfoť a přilož. Vyplň všechny čtyři části.',
    match: { nbspMode: 'ignore' },
    review: 'manual',
    prefill: {
      format: 'text',
      content: `Kde jsem text našel:
Původní text:
Opravený text:
Co bylo špatně:`,
    },
    checks: [
      {
        type: 'sections',
        labels: [
          'Kde jsem text našel',
          'Původní text',
          'Opravený text',
          'Co bylo špatně',
        ],
      },
      {
        type: 'custom',
        id: 'sectionsDiffer',
        a: 'Původní text',
        b: 'Opravený text',
      },
      {
        type: 'lint',
        maxErrors: 0,
        section: 'Opravený text',
      },
    ],
    phase: 'D',
    ready: false,
  },
]
