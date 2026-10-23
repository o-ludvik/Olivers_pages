# Formát obsahu

Veškerý obsah je v `content/`. Build (`scripts/build.mjs`) ho projde, zvaliduje, poskládá do jednoho souboru `dist/data/content.json` a zašifruje řešení. Nic jiného se při přidávání obsahu neupravuje.

```
content/
├── site.json                       # název webu, úvodní text, názvy obtížností, klíč úložiště
├── badges.json                     # odznaky
└── sections/
    ├── 01-razeni/                  # NN-slug: číslo = pořadí, slug = ?section=
    │   ├── section.json            # název, ikona, popis sekce
    │   ├── 01-kdo-je-nejmensi.json # NN-slug.json: číslo = pořadí, slug = &question=
    │   ├── 02-jeden-pruchod.json
    │   └── assets/                 # volitelné: obrázky pro vizualizaci "image"
    │       └── hraz.svg
    └── 02-cykly/
        └── …
```

## Pojmenování a pořadí

- Složka sekce: `NN-slug`, soubor úlohy: `NN-slug.json`. `NN` jsou aspoň dvě číslice (`01`, `02`, … `10`, … `99`; povoleno i `100`+).
- Řadí se **číselně podle prefixu**. Prefixy nemusí jít po jedné (`10`, `20`, `30` je v pořádku a umožní vkládat mezi).
- Duplicitní prefix ve stejné složce = chyba validace.
- `slug`: jen `a-z`, `0-9`, `-`; nezačíná ani nekončí pomlčkou. Slug úlohy je unikátní v rámci sekce, slug sekce globálně.
- **Slug je identita úlohy** (URL i uložený postup). Změna pořadí = přejmenovat jen prefix. Změna slugu = uživatelům se ztratí postup u té úlohy a přestanou fungovat sdílené odkazy.
- Soubory a složky začínající `_` nebo `.` build ignoruje (koncepty, např. `_rozpracovana.json`).

## `site.json`

```json
{
  "title": "Bobří trénink",
  "titleHtml": "Bobří <span>trénink</span>",
  "intro": "Vyber si téma a trénuj. …",
  "levels": { "1": "Lehká", "2": "Střední", "3": "Těžká", "4": "Mistrovská" },
  "storageKey": "bobri-trenink-v2"
}
```

## `section.json`

```json
{
  "title": "Řazení",
  "icon": "↕",
  "description": "Prohazování karet, kola řazení a počítání výměn."
}
```

| Pole | Povinné | Popis |
|---|---|---|
| `title` | ano | Název sekce (dlaždice, nadpis, štítek v úloze). |
| `icon` | ano | 1–3 znaky (symbol nebo písmena), zobrazí se v čtverečku na dlaždici. |
| `description` | ano | Jedna věta, max ~80 znaků. |

## Úloha `NN-slug.json`

```json
{
  "title": "Jeden průchod",
  "level": 1,
  "text": [
    "Bobr jde po kartách <b>zleva doprava</b> a porovnává vždy <b>dva sousedy</b>. …"
  ],
  "visual": { "type": "cards", "data": [4, 1, 3, 2] },
  "question": "Jak budou karty ležet po jednom průchodu zleva doprava?",
  "answer": {
    "type": "choice",
    "options": ["1 2 3 4", "1 3 2 4", "1 4 3 2", "3 1 2 4"],
    "correct": "B"
  },
  "hint": "Piš si řadu po každém porovnání. Začni dvojicí 4 a 1.",
  "solution": {
    "steps": ["Porovnám 4 a 1: …", "…"],
    "mistake": "Po jednom průchodu ještě nemusí být seřazeno. …",
    "why": "Tomuto postupu se říká bublinkové řazení. …",
    "traps": {
      "A": "To je úplně seřazená řada. …",
      "C": "Prohodil(a) jsi jen první dvojici. …"
    }
  },
  "source": "volitelné – inspirace / zdroj úlohy"
}
```

| Pole | Povinné | Typ | Popis |
|---|---|---|---|
| `title` | ano | string | Název úlohy, max ~40 znaků. Prostý text. |
| `level` | ano | 1–4 | Obtížnost (`site.levels`). |
| `text` | ano | blok[] | Zadání, viz Bloky. |
| `visual` | ne | vizualizace nebo pole vizualizací | Obrázek pod textem. |
| `question` | ano | inline HTML | Samotná otázka, jedna věta. |
| `answer` | ano | objekt | Viz Odpovědi. |
| `hint` | ano | inline HTML | Nápověda po 2. špatném pokusu. Nesmí prozradit výsledek. |
| `solution.steps` | ano | inline HTML[] | 2–8 kroků řešení. |
| `solution.mistake` | ne | inline HTML | Zobrazí se jako „**Pozor:** …“. |
| `solution.why` | ne | inline HTML | Souvislost s informatikou. |
| `solution.traps` | ne | objekt | Klíč = normalizovaná špatná odpověď, hodnota = vysvětlení (inline HTML). |
| `source` | ne | string | Zdroj/inspirace, zobrazí se malým písmem. |

Neznámé klíče = chyba validace (chrání před překlepy jako `hitn`).

### Bloky (`text`)

Pole bloků, renderují se pod sebou:

| Blok | Výsledek |
|---|---|
| `"řetězec s inline HTML"` | `<p>` |
| `{ "list": ["…", "…"] }` | `<ul>` |
| `{ "list": ["…"], "ordered": true }` | `<ol>` |
| `{ "code": "opakuj 3×:\n    tleskni" }` | `<div class="code">` – pseudokód, zachová mezery a řádky, obsah se **escapuje** (žádné HTML) |
| `{ "html": "<table class=\"plan\">…</table>" }` | Vloží se doslova. Nouzovka – používat výjimečně. |

**Inline HTML** (povoleno v textových řetězcích, otázce, nápovědě, krocích, pastech): `<b>`, `<strong>`, `<i>`, `<em>`, `<br>`, `<sub>`, `<sup>`, `<code>` a `<b class="big">` (velké písmo pro šifrovaná slova). Cokoli jiného validace odmítne. Obsah je z repozitáře, proto se vkládá jako `innerHTML` bez sanitizace.

### Odpovědi (`answer`)

**Výběr** – 2 až 6 možností, písmena A–F:

```json
{ "type": "choice", "options": ["Ota", "Ema", "Ivo", "Lea"], "correct": "C" }
```

Možnost může být i objekt s obrázkem (pak se použije mřížka `.options.pics`):

```json
{ "type": "choice",
  "options": [
    { "text": "Hráz 1", "visual": { "type": "image", "data": { "src": "hraz1.svg", "alt": "Hráz se třemi kládami" } } },
    { "text": "Hráz 2", "visual": { "type": "cards", "data": [1, 2] } }
  ],
  "correct": "A" }
```

**Číslo** – celé nebo desetinné; uživatel smí psát desetinnou čárku:

```json
{ "type": "number", "correct": 9 }
```

**Text** – pole všech přijatelných variant. Porovnává se po normalizaci (bez diakritiky, bez mezer, velká písmena), takže `"Kolo"`, `"k o l o"` a `"KOLO"` jsou stejné:

```json
{ "type": "text", "correct": ["KOLO"] }
```

První položka `correct` se zobrazí jako „správná odpověď“.

### Pasti (`solution.traps`)

Klíč je normalizovaná špatná odpověď:

| Typ | Klíč | Příklad |
|---|---|---|
| `choice` | písmeno | `"A"` |
| `number` | `String(Number(odpověď))` | `"5"`, `"2.5"` |
| `text` | normalizovaný text | `"KOLA"` |

Validace kontroluje, že klíč není správná odpověď a u `choice` že písmeno existuje.

## Vizualizace

Objekt `{ "type": "…", "data": … }`. Renderery jsou v `src/js/visuals/`, každý vrací SVG řetězec. Vzhled převzatý 1:1 z originálu.

| `type` | `data` | Co nakreslí |
|---|---|---|
| `cards` | `number[]` | Řada karet s čísly. |
| `lamps` | `{ "values"?: number[], "rows": (0\|1\|string)[][] }` | Řádky lamp (1 = svítí). Volitelné hodnoty nad lampami. Řetězec na konci řádku je popisek (`"= 3"`). |
| `alphabet` | – | Abeceda A–Z s pořadovými čísly ve dvou řádcích. |
| `grid` | `[písmeno, sloupec, řádek][]` | Mřížka 5×5, start S vlevo dole (sloupec 0, řádek 4), písmena na zadaných políčkách (0-based, řádek 0 = nahoře). |
| `graph` | `{ "P": { "A": [x, y], … }, "E": [["A","B", váha?], …], "start"?: "A", "w": šířka }` | Síť míst a cest, volitelné váhy na hranách, `start` zvýrazněn. |
| `paths` | `{ "rows": n, "cols": m }` | Mřížka, S vlevo nahoře, H vpravo dole. |
| `beads` | `("r"\|"b"\|"y"\|"g")[]` | Řada barevných korálků a za ní prázdný s otazníkem. |
| `stack` | `string[]` | Hromada, první prvek dole. |
| `image` | `{ "src": "soubor.svg", "alt": "popis", "width"?: px }` | Obrázek ze složky `assets/` dané sekce (SVG, PNG, JPG, WEBP). `alt` povinný. |

`visual` může být i pole – vykreslí se víc obrázků pod sebou.

Přidání nového typu: viz skill `.claude/skills/nova-vizualizace`.

## `badges.json`

```json
[
  { "id": "ten", "name": "Desítka", "desc": "Vyřeš 10 úloh", "rule": { "type": "solved", "min": 10 } }
]
```

| `rule.type` | Parametry | Platí, když |
|---|---|---|
| `solved` | `min` | vyřešeno aspoň `min` úloh |
| `perfect` | `min` | aspoň `min` úloh za 3★ |
| `level` | `level`, `min` | aspoň `min` vyřešených úloh dané obtížnosti |
| `stubborn` | `min` | aspoň `min` úloh vyřešených po ≥ 3 chybách bez zobrazení řešení |
| `everySection` | – | v každé sekci aspoň 1 vyřešená |
| `sectionsComplete` | `min` | aspoň `min` celých sekcí |
| `all` | – | vyřešeno vše |

Pořadí v souboru = pořadí zobrazení.

## Validace (`npm run check`, součást buildu)

Chyba = build selže s hláškou ve tvaru `content/sections/01-razeni/02-jeden-pruchod.json → answer.correct: písmeno "E" neodpovídá žádné možnosti (A–D)`. Kontroluje se minimálně:

- platný JSON, povinná pole, žádná neznámá pole, typy;
- formát názvů složek a souborů, unikátní prefixy a slugy;
- `level` 1–4, `answer` podle typu, `correct` existuje, počet možností 2–6, žádné duplicitní možnosti;
- klíče `traps` (existují, nejsou správnou odpovědí);
- povolené inline HTML;
- známý typ vizualizace a tvar jejích dat; u `image` existence souboru a `alt`;
- sekce má aspoň 1 úlohu;
- `badges.json`: unikátní `id`, známý `rule.type`, potřebné parametry.

Varování (build projde, ale vypíše): `title` delší než 40 znaků, chybí `traps` u `choice`, sekce není seřazená podle `level` vzestupně, v textu se objevují slova „třída“, „ročník“, „let“ ve spojení s věkem, „děti“.
