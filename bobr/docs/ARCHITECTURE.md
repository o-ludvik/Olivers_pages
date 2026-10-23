# Architektura

## Princip

- **Zdroj** (`src/` + `content/`) → **build** (Node skript bez závislostí) → **`dist/`** (čistě statické soubory, commitují se) → GitHub Pages z větve repozitáře `Olivers_pages` (projekt je jeho podsložka `bobr/`).
- Build je potřeba proto, že statický hosting neumí vypsat složku. Build sesbírá všechny JSON soubory do jednoho `data/content.json`, zvaliduje je a zašifruje řešení. Díky tomu stačí pro novou úlohu přidat jeden soubor.
- V prohlížeči jedna stránka `index.html`, ES moduly, router nad query parametry.

## Struktura repozitáře

```
.
├── CLAUDE.md
├── README.md
├── package.json                 # "type": "module", jen scripts, žádné závislosti
├── index.html                   # přesměrování na dist/ (zachová query)
├── .gitignore                   # node_modules/, .DS_Store (dist/ se commituje)
├── .claude/skills/              # skilly pro tvorbu obsahu
├── content/                     # obsah (viz CONTENT_SCHEMA.md)
├── docs/                        # tato dokumentace
├── reference/                   # původní stránka – jen ke čtení, nenasazuje se
├── scripts/
│   ├── build.mjs                # validace + sestavení dist/
│   ├── dev.mjs                  # build, watch, lokální server
│   ├── check.mjs                # jen validace (volá lib)
│   ├── new-task.mjs             # kostra nové úlohy
│   └── lib/
│       ├── content.mjs          # načtení content/ do jednoho objektu (řazení, slugy)
│       ├── validate.mjs         # validace → { errors[], warnings[] }
│       ├── cipher.mjs           # šifrování řešení (sdílené s prohlížečem přes src/js/cipher.js)
│       └── inline-html.mjs      # kontrola povolených tagů
├── src/
│   ├── index.html
│   ├── favicon.svg              # bobr z loga
│   ├── css/styles.css
│   └── js/
│       ├── main.js              # start: načti obsah, stav, router, první render
│       ├── router.js            # parse/href/navigate/popstate, zachytávání kliků na <a>
│       ├── content.js           # fetch data/content.json, dešifrování, indexy (findSection, findTask, next…)
│       ├── cipher.js            # decode (XOR + base64, UTF-8 přes TextDecoder)
│       ├── progress.js          # localStorage: load/save/get/update/reset, storage event
│       ├── stats.js             # statistiky + vyhodnocení odznaků
│       ├── answers.js           # normalize, isCorrect, trapKey, answerText, stars
│       ├── dom.js               # esc(), html helpery, shake(), focusHeading()
│       ├── confetti.js
│       ├── views/
│       │   ├── layout.js        # horní lišta, patička (+ smazání postupu)
│       │   ├── home.js
│       │   ├── section.js
│       │   ├── task.js
│       │   └── not-found.js
│       ├── components/
│       │   ├── blocks.js        # render textových bloků
│       │   ├── badges.js
│       │   ├── difficulty.js    # štítek + žebříček
│       │   └── stars.js
│       └── visuals/
│           ├── index.js         # registr: { cards, lamps, … } + renderVisual(v), visualSvg(v)
│           ├── cards.js  lamps.js  alphabet.js  grid.js
│           ├── graph.js  paths.js  beads.js  stack.js
│           └── image.js         # každý modul exportuje render(data) → string a validate(data) → string[]
├── tests/
│   ├── answers.test.mjs
│   ├── router.test.mjs
│   ├── cipher.test.mjs
│   ├── validate.test.mjs        # fixtures s chybami → očekávané hlášky
│   ├── stats.test.mjs
│   ├── build.test.mjs           # build do temp složky, kontrola výstupu (žádné čitelné řešení v dist/)
│   └── migration.test.mjs       # content/ vs reference/legacy-tasks-decrypted.json (viz MIGRATION.md)
└── dist/                        # generované buildem, commituje se (nasazuje se z větve)
```

Moduly v `src/js/` musí jít importovat i z Node (pro testy): čistá logika (`answers`, `cipher`, `stats`, `router` – parse/href) nesahá na `window`/`document` při importu.

## Build (`scripts/build.mjs`)

1. Načte `content/` (`lib/content.mjs`): složky a soubory seřadí číselně podle prefixu, odvodí slugy, přeskočí `_*` a `.*`.
2. Zvaliduje (`lib/validate.mjs`). Typy vizualizací a jejich `validate(data)` bere z registru `src/js/visuals/index.js` – seznam typů existuje jen na jednom místě. Chyby → výpis + `process.exit(1)`. Varování → výpis.
3. Smaže a vytvoří `dist/`, zkopíruje `src/` (kromě případných testovacích souborů).
4. Zkopíruje `content/sections/*/assets/*` do `dist/assets/content/<sectionSlug>/` a přepíše `src` ve vizualizacích `image` na tuto cestu (relativní, bez úvodního `/`).
5. Vyrobí `dist/data/content.json`:

```json
{
  "site": { … },
  "badges": [ … ],
  "sections": [
    { "slug": "razeni", "title": "…", "icon": "…", "description": "…",
      "tasks": [
        { "slug": "jeden-pruchod", "title": "…", "level": 1, "text": […], "visual": {…},
          "question": "…", "answer": { "type": "choice", "options": […] }, "hint": "…", "source": null }
      ] }
  ],
  "secret": "base64…"
}
```

   `answer.correct` a celé `solution` se z úloh vyjmou a uloží do objektu `{ "razeni/jeden-pruchod": { "correct": …, "solution": {…} } }`, který se zašifruje do `secret`.
6. Do `index.html` doplní `?v=<hash obsahu>` k odkazům na CSS, JS a `content.json` (cache busting na GitHub Pages).
7. Vytvoří `dist/.nojekyll`.

### Šifrování (`cipher`)

`secret = base64( utf8(JSON) XOR klíč )`, klíč = konstanta `"bobri-trenink"` v `cipher.js`. Prohlížeč: `atob` → bajty → XOR → `TextDecoder('utf-8')` → `JSON.parse`. Funkce `encode`/`decode` jsou v jednom modulu sdíleném buildem i prohlížečem (`scripts/lib/cipher.mjs` re-exportuje `src/js/cipher.js`).

## Dev server (`scripts/dev.mjs`)

- Udělá build, spustí `node:http` server nad `dist/` na portu 8080 (nebo `PORT`), správné MIME typy (`.js` → `text/javascript`, `.json`, `.svg`, `.css`, `.woff2`…).
- Sleduje `src/` a `content/` (`fs.watch` s `recursive: true`), při změně přebuilduje (debounce 150 ms). Chyba validace build neshodí – vypíše se a server servíruje poslední úspěšný build.
- Bez live reloadu (stačí F5).

## Kostra úlohy (`npm run new -- <sekce> "Název"`)

- Najde složku sekce podle slugu, vezme nejvyšší prefix + 1 (zachová počet číslic), vytvoří slug z názvu (bez diakritiky, malá písmena, pomlčky), zapíše šablonu se všemi povinnými poli a `"level": 1`, vypíše cestu a URL `?section=…&question=…`.
- Když slug v sekci existuje, skončí chybou.

## Router (`src/js/router.js`)

```js
parse(search)          // "?section=a&question=b" → { section: "a", question: "b" } (prázdné → null)
href({ section, question }) // → "./" | "?section=a" | "?section=a&question=b"
navigate(href)         // pushState + render
start(renderFn)        // popstate + delegovaný click na a[href^="?"], a[href="./"]
```

Zachytit jen levý klik bez Ctrl/Cmd/Shift/Alt a bez `target`. `href` používá `URLSearchParams`, slugy jsou bezpečné, ale kódovat stejně.

## Render

Každý pohled je modul s `render(root, ctx)`: nastaví `root.innerHTML` a naváže události, stejně jako originál (`app.innerHTML = …`). Žádný virtuální DOM. Pohled úlohy drží dočasný stav (vybraná možnost, poslední výsledek, past, nové odznaky) v modulu; při navigaci se resetuje.

## Nasazení

Repozitář `Olivers_pages` se na GitHub Pages nasazuje přímo z větve `main` (vlastní doména, vedle běží další stránky jako `bajtik/`). Proto:

- `dist/` se commituje; `bobr/index.html` přesměruje na `dist/` se zachováním query parametrů.
- Po změně obsahu nebo kódu: `npm run build` a commitnout i `dist/`.
- Workflow `.github/workflows/bobr.yml` v kořeni `Olivers_pages` (jen při změnách v `bobr/`): `npm test`, `npm run build` a `git diff --exit-code dist` – neprojde, když je obsah chybný nebo commitnutý `dist/` neodpovídá zdrojům. Nic nenasazuje.
- Jekyll na Pages zpracovává celou větev; `.nojekyll` v `dist/` nic nedělá, ale nevadí.

## Pořadí implementace

1. Kostra repozitáře, `package.json`, `.gitignore`, prázdný `src/index.html`.
2. `scripts/lib/content.mjs` + `validate.mjs` + `check.mjs` + testy validace. `npm run check` musí projít nad převedeným obsahem.
3. `cipher` + `build.mjs` + test buildu.
4. `answers.js`, `stats.js`, `progress.js`, `router.js` + testy.
5. CSS (port + úklid), layout, úvod, sekce.
6. Pohled úlohy, odpovědi, zpětná vazba, odznaky, konfety.
7. Vizualizace (port) + `image`.
8. `dev.mjs`, `new-task.mjs`, README.
9. Workflow pro Pages.
10. Projít akceptační kritéria (`SPEC.md` §8) a vizuálně porovnat několik úloh s `reference/original-index.html`.
