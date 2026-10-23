# Funkční specifikace – Bobří trénink

## 1. Cíl

Statický tréninkový web s úlohami ve stylu Bobříka informatiky. Úlohy jsou rozdělené do sekcí (témat). Uživatel si vybere sekci, v ní úlohu, odpoví, dostane zpětnou vazbu, nápovědu a postup řešení. Postup, hvězdičky a odznaky se ukládají v prohlížeči.

Vychází z jednostránkové aplikace `reference/original-index.html`. Vzhled a chování úlohy zůstávají stejné, mění se:

| Původně | Nově |
|---|---|
| Na začátku povinné jméno | Žádné jméno, rovnou se trénuje |
| Tlačítko „Odešli výsledky“ + Google tabulka | Zrušeno, web není na nic napojený |
| Měření času nad úlohou, varování pro učitele, seznam špatných odpovědí | Zrušeno |
| Více profilů (podle jména) v jednom prohlížeči | Jeden postup na prohlížeč |
| Jedna URL, stav jen v paměti | Každá sekce i úloha má vlastní URL přes query parametry |
| Úlohy jako jedno pole v JS | Jeden JSON soubor na úlohu, složka na sekci, build vše posbírá |
| Texty zmiňující třídu a děti | Neutrální texty |

### Mimo rozsah

Účty, backend, odesílání výsledků, statistiky pro učitele, vícejazyčnost, editor úloh v prohlížeči, časomíra.

## 2. URL a navigace

Jediný HTML soubor `index.html`. Pohled se určuje query parametry:

| URL | Pohled |
|---|---|
| `./` (bez parametrů) | Úvod |
| `?section=razeni` | Sekce |
| `?section=razeni&question=jeden-pruchod` | Úloha |

- Slug sekce = název složky bez číselného prefixu (`01-razeni` → `razeni`). Slug úlohy = název souboru bez prefixu a přípony (`02-jeden-pruchod.json` → `jeden-pruchod`). Slug úlohy je unikátní jen v rámci sekce.
- Pořadí parametrů při generování odkazů: vždy `section`, pak `question`. Jiné parametry se ignorují.
- Všechny navigační prvky jsou skutečné `<a href="?section=…">`, aby šlo otevřít v nové záložce a zkopírovat odkaz. Kliknutí levým tlačítkem bez modifikátoru se zachytí: `history.pushState` + překreslení bez reloadu. `popstate` (tlačítko Zpět v prohlížeči) překreslí podle URL.
- Po přechodu na jiný pohled se stránka posune nahoru a focus přejde na hlavní nadpis (`h1` s `tabindex="-1"`).
- `document.title`: úvod „Bobří trénink“, sekce „Řazení · Bobří trénink“, úloha „Jeden průchod · Řazení · Bobří trénink“.
- **Neplatné URL:**
  - neznámá `section` → pohled „Tohle jsme nenašli“ s odkazem na úvod;
  - známá `section`, neznámá `question` → stejný pohled s odkazem na danou sekci;
  - `question` bez `section` → pohled „nenašli“ s odkazem na úvod.
- Tlačítko „Zpět“ v aplikaci (← Všechna témata, ← Název sekce) je odkaz na nadřazený pohled, ne `history.back()`.

## 3. Pohledy

### 3.1 Horní lišta (všude)

- Vlevo logo bobra + „Bobří trénink“ jako odkaz na úvod (`./`).
- Vpravo (mimo úvod) pilulka s celkovým počtem hvězdiček `★ 12`. Žádné jméno, žádné tlačítko odeslání.

### 3.2 Úvod

- Hero: nadpis „Bobří **trénink**“ (`site.titleHtml`), úvodní odstavec (`site.intro`).
- Pilulky „Vyřešeno X z Y“ a „★ X z Y“ – zobrazit vždy (dříve jen po zadání jména).
- Mřížka dlaždic sekcí, **automaticky generovaná z obsahu** v pořadí složek: ikona, název, popis, progress bar, „X z Y úloh“, hvězdičky. Dokončená sekce má zelený okraj (`.topic.complete`). Dlaždice je odkaz `?section=<slug>`.
- Sekce „Odznaky (X z Y)“ – všechny odznaky z `content/badges.json`, získané zvýrazněné.

### 3.3 Sekce

- Odkaz „← Všechna témata“.
- Nadpis, popis sekce + věta „Úlohy jsou seřazené od nejlehčí. Můžeš začít kteroukoli.“
- Pilulky „Vyřešeno X z Y“, „★ X z Y·3“.
- Seznam úloh **generovaný automaticky** v pořadí souborů. Řádek (`.trow`) je odkaz `?section=…&question=…`: kolečko s pořadovým číslem, název, žebříček obtížnosti + štítek obtížnosti, stav („vyřešeno“, „vyřešeno po zobrazení řešení“, „zobrazené řešení“, „rozpracováno“), hvězdičky.
- Pod seznamem odkaz „Další téma: <název> →“ (pokud existuje další sekce).

### 3.4 Úloha

Přesně podle originálu (`renderTask` v `reference/original-index.html`):

- Odkaz „← <název sekce>“.
- Karta úlohy: štítky (sekce, obtížnost), nadpis, text (bloky), vizualizace, otázka, odpověď, zpětná vazba, akce.
- **Typy odpovědí:**
  - `choice` – tlačítka A, B, C, D… (`role="radiogroup"`, `role="radio"`, `aria-checked`), lze ovládat i klávesnicí (šipky + mezerník/Enter). Pokud má aspoň jedna možnost obrázek, použije se mřížka `.options.pics`.
  - `number` – input s `inputmode="numeric"`, akceptuje i desetinnou čárku.
  - `text` – input, kontrola ignoruje velikost písmen, diakritiku a mezery.
  - Enter v inputu = Zkontrolovat.
- **Kontrola** (tlačítko „Zkontrolovat“):
  - prázdná odpověď → animace „shake“ na poli odpovědi, nic se nezapočítá;
  - každý odeslaný pokus zvýší `attempts`;
  - správně → stav `done`, hvězdičky: 1. pokus 3★, 2. pokus 2★, později 1★; pokud uživatel dřív viděl řešení, vždy 1★. Zelený box „Správně! Paráda.“, animované hvězdy, oznámení nově získaných odznaků, konfety (ne při `prefers-reduced-motion`), postup řešení;
  - špatně → červený box „Ještě ne. Zkus to znovu!“, případně **past** (text z `solution.traps` pro danou špatnou odpověď), od 2. špatného pokusu **nápověda**, karta zatřese.
- Po 3 špatných pokusech se objeví „Ukaž mi řešení“ → stav `revealed`, `seen = true`, 0★, box se správnou odpovědí a postupem, tlačítko „Zkusit znovu“ (vrátí stav na `new`, pokusy i `seen` zůstávají).
- Hotová úloha (`done` / `revealed`) při dalším otevření rovnou ukazuje výsledek a postup; pole odpovědi je zamčené a předvyplněné správnou odpovědí.
- Akce po dokončení: „Další úloha →“ (další v sekci), u poslední úlohy sekce místo toho „Další téma →“ (na stránku další sekce), a „Zpět na téma“.
- Text „Pokus N“ vedle tlačítka, když už byl aspoň jeden pokus.
- Postup řešení: „Jak na to krok za krokem“ – číslovaný seznam `steps`, volitelně „**Pozor:** mistake“, volitelně `why`.
- Volitelné `source` (zdroj/inspirace úlohy) se zobrazí malým písmem pod kartou.

### 3.5 Patička (všude)

> Trénink na soutěž <a>Bobřík informatiky</a>. Úlohy jsou vlastní, napsané ve stylu soutěže. Bobřík informatiky (© KI PF JČU) šíří své úlohy pod licencí <a>CC BY-SA 3.0 CZ</a>; tato stránka je pod stejnou licencí. Postup se ukládá jen v tomto prohlížeči. <button>Smazat postup</button>

„Smazat postup“ → inline potvrzení („Opravdu smazat všechny vyřešené úlohy a odznaky? Ano / Ne“), po potvrzení vymaže `localStorage` klíč a překreslí aktuální pohled.

## 4. Stav a ukládání

- Klíč `localStorage`: `site.storageKey` (`bobri-trenink-v2`).
- Struktura:

```json
{
  "version": 2,
  "tasks": {
    "razeni/jeden-pruchod": { "status": "done", "attempts": 2, "stars": 2, "seen": false }
  }
}
```

- `status`: `new` | `done` | `revealed`. Chybějící záznam = `new`, 0 pokusů.
- Klíč úlohy je `<sectionSlug>/<taskSlug>`. Záznamy, které neodpovídají žádné existující úloze (přejmenovaná úloha), se ignorují a nemažou.
- Všechny operace s `localStorage` v `try/catch`; když úložiště nejde (anonymní režim), web funguje dál, jen si nic nepamatuje.
- Synchronizace mezi záložkami přes událost `storage`: znovu načíst stav a překreslit (v pohledu úlohy jen pokud se nezmění rozepsaná odpověď – stačí překreslit, jen když se změnil záznam právě otevřené úlohy nebo pohled není úloha).

### Statistiky (pro úvod, sekce a odznaky)

- `solved` – počet úloh ve stavu `done`;
- `stars` – součet hvězd; `maxStars` = počet úloh × 3;
- `perfect` – `done` se 3★;
- `byLevel[n]` – vyřešené úlohy dané obtížnosti;
- `stubborn` – `done`, `!seen`, `attempts >= 4`;
- `sectionsTouched` – sekce s aspoň jednou vyřešenou úlohou; `sectionsComplete` – sekce se vším vyřešeným.

## 5. Odznaky

Definované deklarativně v `content/badges.json` (viz `CONTENT_SCHEMA.md`). Odznak se vyhodnocuje vždy znovu ze stavu (neukládá se). „Nový odznak“ = odznak, který po správné odpovědi platí a před ní neplatil.

## 6. Řešení v prohlížeči

Správné odpovědi a celé `solution` se v `dist/` neobjeví čitelně. Build je zašifruje (XOR s klíčem + base64, stejný princip jako originál), prohlížeč je dešifruje až za běhu. Jde o ochranu proti „podívám se do zdrojáku“, ne o bezpečnost. `hint` zůstává čitelný.

## 7. Přístupnost a technické požadavky

- Funguje v aktuálním Chrome, Firefoxu, Safari, Edge a na mobilu (od 320 px šířky).
- Světlý i tmavý režim podle systému (`prefers-color-scheme`), `prefers-reduced-motion` vypne animace a konfety.
- Viditelný focus, ovládání klávesnicí, SVG vizualizace s `role="img"` a `aria-label`, obrázky s `alt`.
- Bez JS se zobrazí krátká hláška `<noscript>`.
- Při chybě načtení obsahu se zobrazí srozumitelná chybová hláška místo prázdné stránky.

## 8. Akceptační kritéria

- [x] `npm run build` vytvoří `dist/`, který po nahrání na GitHub Pages do podadresáře repozitáře funguje bez úprav.
- [x] Úvod ukazuje 9 sekcí a 63 úloh celkem; dlaždice a seznamy jsou generované z `content/`.
- [x] Přidání nového JSON souboru do sekce (bez jakékoli další úpravy) po buildu přidá úlohu do seznamu, statistik i odznaku „Bobří profesor“.
- [x] Přidání nové složky sekce přidá dlaždici na úvod a odkaz „Další téma“ v předchozí sekci.
- [x] Odkazy `?section=razeni`, `?section=razeni&question=jeden-pruchod` jdou otevřít přímo, sdílet a obnovit (F5). Zpět/Vpřed v prohlížeči fungují.
- [x] Neplatné URL ukážou pohled „Tohle jsme nenašli“.
- [x] Žádný text na webu nezmiňuje věk, třídu, ročník ani jméno uživatele; web nikam nic neposílá (v Network jen vlastní soubory a Google Fonts).
- [x] V `dist/` se nenachází čitelně žádná správná odpověď ani postup řešení (ověřeno testem, který hledá vybrané texty z `solution.steps`).
- [x] Hvězdičky, nápověda po 2. chybě, „Ukaž mi řešení“ po 3. chybě, pasti, odznaky, konfety fungují jako v originálu.
- [x] Postup přežije reload; „Smazat postup“ ho vymaže; dvě záložky se synchronizují.
- [x] Všech 8 typů vizualizací + `image` vypadá stejně jako v originálu (vizuální kontrola úloh, které je používají).
- [x] `npm run check` odhalí chybný obsah s jasnou českou hláškou (soubor + pole + problém) a CI při chybě neprojde. *(CI = `.github/workflows/bobr.yml` v kořeni `Olivers_pages`; ověřeno lokálně v `node:20`, na GitHubu poběží po prvním pushi.)*
- [x] Tmavý režim, mobil 360 px, klávesnice – bez rozbitého layoutu.
