# Typografie a formátování – katalog úloh a implementační zadání

> Tento soubor je zadání pro Cursor. Obsahuje:
> - prompt (sekce 0),
> - konvence zápisu (1),
> - datový model (2),
> - funkce k doprogramování F01–F19 (3),
> - pořadí práce (4),
> - katalog pravidel (5),
> - typografický linter (6),
> - katalog 52 úloh s přesným obsahem (7),
> - otázky k vyjasnění (8).

---

## 0. Prompt

Pracuješ v repozitáři výukové webové aplikace na procvičování typografie a formátování textu. Cílovou skupinou jsou studenti 1. ročníku gymnázia.

**Co aplikace už umí:**
- 3 kategorie (Typografie, Formátování, Kombinace), každá s vlastními levely a vlastním postupem. Level N+1 se odemkne po splnění levelu N.
- Zobrazit text zadání.
- Rich-text editor ve stylu Google Docs: styl odstavce (Normální text, Název, Nadpis 1…), písmo, velikost, tučné/kurzíva/podtržení, zarovnání a odrážky.
- Předvyplnit do editoru text.
- Základní (slabé) kontroly splnění.

**Tvůj úkol:** doprogramovat všechno, co potřebují úlohy z katalogu (sekce 7), a úlohy do aplikace přidat. U každé úlohy je v řádku **Potřebuje** seznam funkcí (F01–F19), které pro ni musí existovat.

### Postup práce

1. **Průzkum.** Nejdřív projdi kód a sepiš stručný přehled:
   - kde jsou definice levelů,
   - jaký editor se používá (knihovna, verze),
   - jak funguje předvyplnění,
   - jak fungují kontroly,
   - jak se ukládá postup.

   U každé funkce F01–F19 napiš, jestli už existuje, existuje částečně, nebo chybí. Odpověz i na otázky ze sekce 8. **Pak se zastav a počkej na potvrzení.**
2. **Fáze A → D.** Implementuj po fázích (sekce 4). Po každé fázi spusť testy včetně self-testu úloh (F19), krátce shrň, co je hotové, a zastav se.
3. **Obsah úloh přepiš přesně.** Texty, znaky a mezery ber z katalogu beze změny. Nic nevylepšuj ani „neopravuj“, chyby v prefillech jsou záměrné. Když ti něco nedává smysl, zeptej se.
4. **Existující úlohy nech být.** Pokud v aplikaci nějaké úlohy už jsou, nemaž je ani nepřepisuj bez potvrzení. Vypiš je a navrhni, kam do nového pořadí patří.

### Pravidla

- Celé UI a všechny texty pro studenty jsou česky.
- Datový model a názvy přizpůsob existující architektuře. Typy v sekci 2 jsou návrh, zachovej ale jejich význam.
- **Nic nesmí tiše normalizovat znaky** v textech úloh ani v textu studenta. Kontroluje se právě rozdíl mezi:
  - `-` `–` `—` `−`,
  - `"` `„` `“`,
  - `...` `…`,
  - mezerou U+0020 a nezlomitelnou mezerou U+00A0.

  Pozor na formátovače kódu, autokorekturu editoru i na vlastní „vylepšování“.
- V JavaScriptu `\s` v regulárních výrazech zahrnuje i U+00A0. Kde se rozlišuje mezera a nezlomitelná mezera, `\s` nepoužívej.
- V datových souborech zapisuj nezlomitelnou mezeru jako `\u00A0`. Ostatní speciální znaky můžou zůstat jako skutečné znaky v UTF-8.
- Každá úloha musí projít self-testem (F19).
- Novou závislost (např. knihovnu na diff) přidej jen s krátkým zdůvodněním.

---

## 1. Konvence tohoto dokumentu

- **`~` v textech úloh = nezlomitelná mezera U+00A0.** Jinde v tomto souboru se `~` nepoužívá.
- **`{{a|b}}` v řešení = alternativy.** Přijímá se kterákoli z nich. Prázdná alternativa (`{{C: |}}`) znamená volitelný text. V prefillu se alternativy nevyskytují.
- **Bloky ```` ```text ````:** každý řádek je jeden odstavec editoru, prázdný řádek je prázdný odstavec.
- **Bloky ```` ```html ````:** notace formátovaného dokumentu (podmnožina HTML), kterou parser (F02) převede do DocModelu a do editoru:
  - `<p>` = Normální text
  - `<p data-style="title">` = Název, `<p data-style="subtitle">` = Podnázev
  - `<h1>`–`<h3>` = Nadpis 1–3
  - `style="text-align:center|right|justify"` na odstavci (výchozí je vlevo)
  - `style="margin-bottom:Xpt"` = mezera za odstavcem
  - `<ul>` / `<ol>` s `<li>`; vnořený seznam = 2. úroveň
  - `<strong>` `<em>` `<u>` `<sup>` `<sub>` `<a href="…">`
  - `<span style="font-family:…; font-size:…pt; color:…; background-color:…">` = přímé formátování
  - `<p></p>` = prázdný odstavec
  - `data-accept="title,h1"` (jen v řešení) = přijímá se kterýkoli z uvedených stylů
  - `<!-- … -->` = komentář pro tebe, není součástí obsahu
  - **Bílé znaky:** konec řádku a odsazení za ním mezi tagy se ignorují. Mezery uvnitř řádku jsou významné a nesmí se kolabovat (např. 20 úvodních mezer ve FMT-05).
- **Odkazy v katalogu:** na funkce `F01`–`F19` (sekce 3), na pravidla `rule:id` (sekce 5).
- **Domény** `skola.example.com` a `ulipy.example.com` jsou záměrně fiktivní.
- **Písma v úlohách:**
  - bezpatková: **Arial, Roboto, Open Sans**
  - patková: **Merriweather, Lora, PT Serif**

  Pokud editor nabízí jiná, použij je. Musí jich ale být aspoň 3 patková a 3 bezpatková s českou diakritikou (F10i).

---

## 2. Datový model (návrh)

```ts
type Category = 'typografie' | 'formatovani' | 'kombinace';
type Mechanic = 'smaz-spatne' | 'preved' | 'oprav' | 'prepis-z-obrazku'
              | 'lovec-chyb' | 'napodob' | 'posud' | 'vytvor';
type Bloom = 'zapamatovat' | 'porozumet' | 'aplikovat' | 'analyzovat' | 'hodnotit' | 'tvorit';

interface TaskDefinition {
  id: string;                    // 'TYP-01', 'FMT-07', 'KOM-03'
  category: Category;
  level: number;                 // pořadí v kategorii od 1
  title: string;
  mechanic: Mechanic;
  bloom: Bloom;
  instructions: string;          // zadání pro studenta (markdown), smí obsahovat {errorCount}
  media?: TaskMedia[];           // obrázky nad editorem (F04–F06)
  charHints?: string[];          // znaky, ke kterým se pod zadáním ukáže tahák (F09)
  prefill?: DocSource;
  solution?: DocSource;          // referenční řešení, smí obsahovat {{a|b}}
  editor?: EditorConfig;
  match?: MatchOptions;
  checks: Check[];
  errors?: ErrorAnnotation[];    // F15
  autoErrors?: 'nbsp';           // F15: každá U+00A0 v řešení = jedna chyba
  feedback?: FeedbackPolicy;
  review?: 'auto' | 'auto+manual' | 'manual';   // výchozí 'auto' (F17)
  selfChecklist?: string[];      // F17
}

interface DocSource { format: 'text' | 'html'; content: string }

type TaskMedia =
  | { kind: 'textImage'; lines: string[]; caption?: string }                            // F04
  | { kind: 'docPreview'; html: string; mode: 'full' | 'wireframe'; caption?: string }  // F05
  | { kind: 'pagesPreview'; pages: PageSpec[]; caption?: string };                      // F06

interface PageSpec {
  number: number;
  blocks: Array<{ kind: 'heading' } | { kind: 'para'; lines: number; starts: boolean; ends: boolean }>;
}

interface EditorConfig {
  width?: 'normal' | 'narrow';        // výchozí 'normal'
  allowPaste?: boolean;               // výchozí true
  toolbar?: 'full' | ToolId[];        // výchozí 'full'
  showHiddenDefault?: boolean;        // výchozí false
  specialCharsPanel?: boolean;        // výchozí false
}

interface MatchOptions {
  nbspMode?: 'ignore' | 'requiredOnly' | 'strict';   // výchozí 'ignore'
  dashStyle?: 'en' | 'enOrEm';                        // výchozí 'enOrEm'
  trimLines?: boolean;                                // výchozí true
  ignoreEmptyLines?: boolean;                         // výchozí true
}

interface ErrorAnnotation {
  at: string | string[];   // podřetězec ŘEŠENÍ, kde je po opravě správně (nebo alternativy);
                           // v řešení právě jednou, v prefillu nikde
  rule: RuleId;            // sekce 5
}

interface FeedbackPolicy {
  showCountUpfront?: boolean;     // výchozí: true u 'oprav', jinak false
  showCountAfterCheck?: boolean;  // výchozí true
  revealAfter?: number;           // po kolika neúspěšných kontrolách ukázat místa chyb; výchozí 2
  maxChecks?: number;             // výchozí bez omezení
}
```

### DocModel – jednotný vstup pro všechny kontroly

```ts
type ParaStyle = 'normal' | 'title' | 'subtitle' | 'h1' | 'h2' | 'h3';
type Align = 'left' | 'center' | 'right' | 'justify';

interface DocModel { paragraphs: Paragraph[] }

interface Paragraph {
  style: ParaStyle;
  align: Align;
  list?: { type: 'bullet' | 'ordered'; level: number };  // level od 0
  spaceAfterPt: number;                                   // efektivní hodnota
  runs: Run[];
}

interface Run {
  text: string;               // přesně, včetně U+00A0
  bold: boolean; italic: boolean; underline: boolean;
  superscript: boolean; subscript: boolean;
  link?: string;
  fontFamily: string;         // efektivní (zděděné ze stylu, pokud není přímé)
  fontSize: number;           // efektivní, v pt
  color?: string;             // jen přímé formátování
  highlight?: string;         // jen přímé formátování
  direct: { fontFamily?: boolean; fontSize?: boolean; bold?: boolean };  // nastaveno přímo, ne stylem
}
```

### Kontroly

```ts
type Check =
  | { type: 'textLines' }                                    // text po odstavcích = řešení
  | { type: 'docMatches'; compare: CompareKey[]; trailingFreeText?: { minWords: number } }
  | { type: 'numberSet'; expected: number[] }
  | { type: 'containsLine'; line: string }                   // některý odstavec odpovídá řádku
  | { type: 'notContainsText'; text: string }
  | { type: 'require'; pattern: string; flags?: string; label: string; min?: number }
  | { type: 'minWords'; min: number; excludePattern?: string }
  | { type: 'constraint'; id: ConstraintId; params?: Record<string, unknown> }   // F13
  | { type: 'lint'; maxErrors: number; treatAsErrors?: LintRuleId[]; section?: string }  // F14
  | { type: 'sections'; labels: string[] }
  | { type: 'custom'; id: string; params?: Record<string, unknown> };

type CompareKey = 'text' | 'style' | 'align' | 'list' | 'bold' | 'italic' | 'underline'
                | 'superscript' | 'subscript' | 'link' | 'fontFamily' | 'fontSize';
```

### Příklad: úloha TYP-02 v datech

```ts
export const TYP_02: TaskDefinition = {
  id: 'TYP-02', category: 'typografie', level: 2,
  title: 'Interpunkce v odstavci', mechanic: 'oprav', bloom: 'aplikovat',
  instructions: 'Oprav mezery a interpunkci. V textu je {errorCount}.',
  prefill:  { format: 'text', content: 'Ahoj ,jak se máš ?Na trhu jsem koupil jablka,hrušky,švestky, atd.. Zítra se ozvu!Měj se.' },
  solution: { format: 'text', content: 'Ahoj, jak se máš? Na trhu jsem koupil jablka, hrušky, švestky atd. Zítra se ozvu! Měj se.' },
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
};
// {errorCount} → „7 chyb“ (F01)
```

V katalogu (sekce 7) jsou u každé úlohy uvedené jen hodnoty, které se liší od výchozích.

---

## 3. Funkce k doprogramování

Každá funkce má popis a akceptační kritéria (**AK**).

### F01 – Definice úloh a registr
- TaskDefinition podle sekce 2 a registr úloh napojený na existující kategorie, levely a odemykání.
- Placeholder `{errorCount}` v zadání se nahradí počtem chyb s českým tvarem přes `Intl.PluralRules('cs')`: 1 chyba, 2–4 chyby, 5 a víc chyb. Stejné skloňování použij ve všech hláškách s počtem.
- **AK:** všech 52 úloh je v aplikaci ve správném pořadí a odemykání funguje jako dřív.

### F02 – DocModel, adaptér editoru a parser notace
- Adaptér editor → DocModel s efektivními hodnotami (písmo a velikost zděděné ze stylu) a s příznakem `direct` pro přímé formátování.
- Parser notace `text` a `html` (sekce 1) → obsah editoru i DocModel:
  - `~` → U+00A0,
  - komentáře se zahazují,
  - `{{…}}` se řeší jen v řešení,
  - mezery uvnitř řádků se zachovají.
- **AK:** round-trip prefill → editor → DocModel zachová text znak po znaku (včetně U+00A0) i veškeré formátování. Pokryj to unit testem.

### F03 – Formátovaný prefill a reset
- Prefill umí všechno z notace: styly, zarovnání, seznamy, B/I/U, sup/sub, odkazy, písmo, velikost, barvu, zvýraznění, prázdné odstavce a úvodní mezery.
- Tlačítko „Začít znovu“ vrátí editor do stavu prefillu.
- **AK:** všechny prefilly z katalogu vypadají v editoru tak, jak popisuje notace.

### F04 – TextImage (nekopírovatelný text v obrázku)
- Vykreslí řádky textu do `<canvas>` s ohledem na `devicePixelRatio`.
- Text nejde označit ani zkopírovat.
- `aria-label` obecný („Obrázek s textem k přepsání“), ne samotný text.
- **AK:** ve Chromu nejde text obrázku označit a vložit do editoru.

### F05 – DocPreview (náhled cílového dokumentu)
- Read-only vykreslení html notace stejnými styly jako editor.
- Nekopírovatelné: `user-select: none`, blokované `copy`, `cut`, `contextmenu` a `dragstart`. Odkazy vypadají jako odkazy, ale nejsou klikací.
- `mode: 'wireframe'`: text se nahradí šedými pruhy úměrné délky. Viditelný zůstane styl odstavce (velikost a tloušťka pruhu), zarovnání, odrážky a číslování a tučné úseky (tmavší pruh).
- **AK:** FMT-11, FMT-14, FMT-15, KOM-04 a KOM-07 ukazují náhled, ze kterého nejde kopírovat.

### F06 – PagesPreview (náhled zlomu stránek)
- Vykreslí stránky podle `PageSpec` vedle sebe (2–3 na řádek), s čísly stránek.
- Odstavec = šedé řádky. Je-li `starts`, je první řádek odsazený. Je-li `ends`, má poslední řádek asi 55 % šířky.
- Nadpis = silnější a kratší pruh s mezerou nad sebou.
- **AK:** v TYP-15 je na první pohled vidět, kde odstavce začínají a končí.

### F07 – Věrnost znaků v editoru
- Vypni všechny automatické náhrady:
  - input rules a typografická rozšíření (např. Typography v TipTapu),
  - chytré uvozovky,
  - převod `...` → `…` a `--` → `–`.
- Na editoru nastav `spellcheck="false"`, `autocorrect="off"`, `autocapitalize="off"`.
- Mezerník vkládá vždy U+0020. Ověř, že prohlížeč nevkládá U+00A0 na konec řádku nebo mezi dvě mezery (`white-space: pre-wrap` nebo `break-spaces`).
- U+00A0 přežije psaní, vložení, undo/redo, serializaci i uložení.
- Funguje vstup přes IME/composition. Na ChromeOS a Linuxu jde o Ctrl+Shift+U + hex kód + mezerník; výsledný znak se vloží.
- **AK (automatizované testy):**
  - vložení `a\u00A0b` dá v DocModelu stejný text,
  - napsané `...`, `"`, `--` zůstanou beze změny,
  - mezera napsaná na konci odstavce je U+0020.

### F08 – Zobrazit skryté znaky
- Přepínač ¶ v toolbaru.
- Je-li zapnutý, U+00A0 se zobrazí viditelnou značkou (malé ° v barvě zvýraznění nebo podbarvení) a běžná mezera slabou tečkou ·.
- Zobrazení nesmí měnit text, jde jen o dekorace.
- Výchozí stav nastavuje `editor.showHiddenDefault`.
- **AK:** v TYP-14 student vidí, kam už nezlomitelnou mezeru vložil.

### F09 – Konfigurace editoru pro jednotlivé úlohy
- **`width: 'narrow'`:** editor široký asi 30 znaků, aby bylo vidět zalamování řádků.
- **`allowPaste: false`:** blokuje vložení i drag & drop a ukáže krátkou hlášku.
- **`toolbar`:** podmnožina nástrojů.
- **`specialCharsPanel`:** panel pro vkládání znaků „ “ ‚ ‘ – … (nezlomitelná mezera) ° × − ′ ″. Výchozí stav je vypnuto.
- **`charHints`:** pod zadáním se ukážou čipy se znakem a s tím, jak ho napsat:

  | Znak | Ctrl+Shift+U | Alt (Windows) |
  |---|---|---|
  | „ | 201E | 0132 |
  | “ | 201C | 0147 |
  | ‚ | 201A | 0130 |
  | ‘ | 2018 | 0145 |
  | – | 2013 | 0150 |
  | … | 2026 | 0133 |
  | nezlomitelná mezera | 00A0 | 0160 |
  | ° | 00B0 | 0176 |
  | × | 00D7 | 0215 |
  | − | 2212 | – |
  | ′ | 2032 | – |
  | ″ | 2033 | – |

### F10 – Nové nástroje editoru
Ke každému nástroji přidej klávesovou zkratku jako v Google Docs.

- **a) Horní a dolní index** (Ctrl+. a Ctrl+,).
- **b) Odkazy** (Ctrl+K): vložit, upravit, odebrat. Podporuj `https:` i `mailto:`.
- **c) Seznamy:** číslovaný seznam (Ctrl+Shift+7) a odrážky (Ctrl+Shift+8). Víceúrovňový seznam, kde Tab odsadí a Shift+Tab vrátí úroveň.
- **d) Mezera za odstavcem:** menu jako v Google Docs, ideálně i řádkování.
- **e) Vymazat formátování** (Ctrl+\\): zruší přímé formátování textu (B/I/U, sup/sub, písmo, velikost, barvu, zvýraznění), styl odstavce ponechá.
- **f) Vložit obsah:** automaticky vygenerovaný z odstavců se stylem Nadpis. Používá se jako odměna po FMT-07.
- **g) Barva textu a zvýraznění:** stačí je vykreslit z prefillu (FMT-13, FMT-17). Nástroj v toolbaru není nutný.
- **h) Styly odstavců:** Normální text, Název (26 pt), Podnázev (15 pt, šedý), Nadpis 1 (20 pt), Nadpis 2 (16 pt), Nadpis 3 (14 pt). Zkratky Ctrl+Alt+0 až 3.
- **i) Písma:** aspoň 3 patková a 3 bezpatková s českou diakritikou (Google Fonts se subsetem latin-ext). Každé písmo má v konfiguraci `classification: 'serif' | 'sans'`.
- **j) Zkratky:**
  - Ctrl+B / I / U,
  - zarovnání Ctrl+Shift+L / E / R / J,
  - zvětšit a zmenšit písmo Ctrl+Shift+. a Ctrl+Shift+,.

**AK:** každý nástroj se promítne do DocModelu (F02) a jde zkontrolovat.

### F11 – Textový matcher
Porovnává text studenta s řešením.

**`nbspMode`:**
- `ignore`: U+00A0 a U+0020 jsou rovnocenné.
- `requiredOnly`: kde má řešení U+00A0, musí ji mít i student. Kde má řešení U+0020, smí student mít kteroukoli z obou.
- `strict`: přesná shoda.

**`dashStyle`:**
- `en`: přesná shoda.
- `enOrEm`: pokud student používá jen —, zachází se s nimi jako s –. Pokud kombinuje oba druhy, kontrola selže s hláškou „Používej v textu jen jeden druh pomlčky.“

**`trimLines`:** ořízne U+0020 a tabulátory na začátku a konci odstavce. Nezlomitelnou mezeru neořezává.

**`ignoreEmptyLines`:** prázdné odstavce se při porovnání vynechají.

**Alternativy `{{a|b}}`:** smí obsahovat i prázdnou alternativu.

**Doporučená implementace:**
- Každý očekávaný řádek zkompiluj na ukotvený regex: literály escapuj, alternativy převeď na `(?:a|b)`, mezery a pomlčky převeď podle módů.
- Pro zobrazení rozdílů zvol u každé alternativy tu variantu, která se v textu studenta vyskytuje (jinak první). Pak udělej znakový diff (např. diff-match-patch se sémantickým čištěním). V režimu `requiredOnly` zahoď úseky diffu, které se liší jen záměnou U+0020 ↔ U+00A0, kde má řešení U+0020.

**AK:** unit testy na každý mód a na alternativy.

### F12 – Typy kontrol
- **`textLines`:** odstavce studenta (plain text) odpovídají řádkům řešení. U řešení ve formátu `html` se bere plain text jeho odstavců. Používá F11.
- **`docMatches`:** porovnává DocModel studenta s řešením (`html`):
  - Odstavce se párují podle pořadí (prázdné se vynechají, pokud `ignoreEmptyLines`).
  - Pro každou položku z `compare`:
    - `text`: přes F11,
    - `style`: včetně `data-accept`,
    - `align`: chybějící = left,
    - `list`: typ a úroveň,
    - značky (`bold`, `italic`, `underline`, `superscript`, `subscript`): po znacích, s tolerancí na okrajích – rozdíl na mezerách a znacích `( ) [ ] „ “ ‚ ‘ " ' , . ; : ! ?` se nepočítá,
    - `link`: href po `decodeURI` a bez koncového lomítka.
  - **`trailingFreeText`:** za posledním párovaným odstavcem smí být libovolné další odstavce, celkem aspoň `minWords` slov. Ukládají se jako zdůvodnění (F17).
  - Hlášky musí být konkrétní, např. „3. odstavec má mít styl Nadpis 2.“
- **`numberSet`:** z textu se vytáhnou všechna celá čísla a jejich množina se porovná s očekávanou. Hláška: kolik správně, kolik chybí, kolik navíc.
- **`containsLine`:** některý odstavec odpovídá řádku (F11).
- **`notContainsText`:** text nikde neobsahuje daný podřetězec.
- **`require`:** regex (`u` flag) se v textu najde aspoň `min`× (výchozí 1). Při neúspěchu se ukáže `label`.
- **`minWords`:** počet slov v textu, volitelně bez odstavců, které odpovídají `excludePattern`.
- **`constraint`:** viz F13.
- **`lint`:** viz F14. `section` omezí kontrolu na obsah jedné sekce (viz `sections`).
- **`sections`:** text se rozdělí podle odstavců začínajících danými popisky (`Popisek:`). Obsah sekce je text za popiskem plus následující odstavce. Každá sekce musí být neprázdná.
- **`custom`:** registr pojmenovaných kontrolních funkcí pro jednorázové případy (TYP-22, KOM-12).

### F13 – Formátovací constraints

| id | parametry | význam | hláška (příklad) |
|---|---|---|---|
| `uniformFont` | `family?`, `size?`, `allowedFamilies?: 'serif' \| 'sans' \| string[]`, `scope?: 'all' \| 'normal'` | všechny runy v rozsahu mají stejné písmo (a velikost, je-li zadaná) | Text nemá jednotné písmo nebo velikost. |
| `maxFonts` | `max` | počet různých písem v dokumentu | Používáš 4 písma, povolená jsou nejvýš 2. |
| `underlineOnlyLinks` | – | podtržení jen uvnitř odkazů | Podtržený text vypadá jako odkaz. |
| `noFakeHeadings` | – | žádný odstavec Normální text s nejvýš 12 slovy, který je celý tučný nebo má efektivní velikost 14 pt a víc | „Kdy a kde?“ vypadá jako nadpis, ale nemá styl nadpisu. |
| `noManualHeadingFormatting` | – | runy v Název, Podnázev a Nadpis 1–3 nemají přímé tučné písmo, velikost ani písmo | Nadpis má ručně nastavené formátování. |
| `noDirectFormatting` | `allow?: ('bold' \| 'italic' \| …)[]` | žádné přímé písmo, velikost, barva ani zvýraznění a žádné značky kromě povolených | – |
| `noColor` / `noHighlight` | – | žádná barva textu / zvýraznění | – |
| `noEmptyParagraphs` | – | žádný prázdný odstavec | Mezery mezi odstavci nedělej prázdnými řádky. |
| `noLeadingWhitespace` | – | odstavec nezačíná mezerou ani tabulátorem | Text neposouvej mezerami. |
| `noManualListMarkers` | – | žádný odstavec mimo seznam nezačíná `- `, `* `, `• `, `– ` ani `1. ` / `1) ` | Použij seznam z nástrojů. |
| `spaceAfterMin` | `pt`, `scope?` | mezera za odstavcem aspoň X pt | – |
| `noCenteredBody` | – | odstavce Normální text (mimo seznamy) nejsou na střed | – |
| `boldRatioMax` | `ratio` | podíl tučných znaků v Normálním textu | Tučně má být jen to nejdůležitější. |
| `requireStyle` | `style`, `min?`, `max?` | počet odstavců daného stylu | – |
| `requireHeadings` | `min` | počet odstavců Nadpis 1–3 | – |
| `requireList` | `min`, `type?` | počet seznamů | – |
| `linkExists` | `hrefIncludes?`, `textMatches?` (regex bez rozlišení velikosti písmen) | existuje odkaz s danou adresou a textem | – |
| `noRawUrls` | – | mimo odkazy není `http(s)://`, `www.` ani e-mailová adresa | Holou adresu schovej do odkazu. |
| `noVagueLinkText` | – | text odkazu neodpovídá `/^(klikni(te)?\s+)?(sem\|zde\|tady)$\|^odkaz$/i` | Text odkazu má říkat, kam vede. |
| `textPreserved` | `source: 'prefill'` | slova z prefillu (písmena a číslice, bez rozlišení velikosti) jsou v textu studenta ve stejném pořadí; značky ručních odrážek se ignorují | Nemaž ani neměň obsah, jen formátuj. |

### F14 – Typografický linter
Implementace je v sekci 6.
- Výsledek je seznam nálezů `{ ruleId, severity, index, length, message, rule }`.
- Linter přeskakuje text uvnitř odkazů a holé URL a e-maily.
- `treatAsErrors` v kontrole povýší vybraná varování na chyby.

### F15 – Zpětná vazba, počítání chyb a pokusy

**Počet chyb:**
- Chyba z `errors[]` je **nevyřešená**, pokud se žádná varianta `at` nenachází v textu studenta. Porovnává se s normalizací podle F11.
- `autoErrors: 'nbsp'` vytvoří pro každou U+00A0 v řešení chybu s `at` = předchozí token + U+00A0 + následující token (tokeny se dělí podle U+0020 i U+00A0) a `rule: 'zalomeni'`. Přeskoč nezlomitelné mezery, které už pokrývá ruční `at`, a ty uvnitř `{{…}}`.
- **Zobrazený počet** = nevyřešené chyby + odstavce, které se od řešení liší a neobsahují žádnou anotovanou chybu.
- U úloh bez `errors[]` se počítají rozdílné odstavce. U `docMatches` a constraints se počítají neúspěšné položky.

**Kdy počet ukázat:**
- `showCountUpfront`: v zadání přes `{errorCount}`.
- `showCountAfterCheck`: hláška po kontrole („Zbývají 3 chyby.“).

**Zvýraznění míst (`revealAfter`):** po N neúspěšných kontrolách se v editoru zvýrazní:
- úseky diffu, nebo
- celé odstavce, které neprošly `docMatches`.

Tooltip ukáže krátké pravidlo z F16. U textových úloh je to pravidlo chyby, jejíž `at` se s úsekem překrývá, jinak obecná hláška.

**`maxChecks`:**
- Po vyčerpání pokusů hláška „Došly pokusy“ a tlačítko „Začít znovu“: reset na prefill a počítadlo na nulu.
- Úloha se nikdy natrvalo nezamkne.

**Uložení:** počet pokusů se ukládá k úloze a studentovi spolu s postupem.

### F16 – Katalog pravidel
- Texty jsou v sekci 5.
- Používají se v nápovědách (F15) a v hláškách linteru (F14).
- Volitelně tlačítko „Pravidla“ u zadání, které ukáže pravidla relevantní pro úlohu (podle `errors[].rule`).

### F17 – Otevřené úlohy a odevzdání

**Stavy úlohy:**
- `open`
- `passed` (automaticky splněno)
- `submitted` (čeká na učitele)
- `approved` / `returned`

**Odemykání:**
- Další level se odemkne při `passed` i `submitted`. Schválení učitelem není podmínkou postupu.
- `review: 'auto+manual'`: automatická část musí projít, pak se odevzdá i volný text (zdůvodnění) k učiteli.
- `review: 'manual'`: automatické kontroly, pokud nějaké jsou, musí projít. Pak student zaškrtá `selfChecklist` a odevzdá.

**Odevzdání** obsahuje DocModel, plain text a volitelnou přílohu obrázku (KOM-12).

**Přehled pro učitele:**
- Seznam odevzdání podle úlohy, náhled a tlačítka Schválit / Vrátit s komentářem.
- Pokud aplikace nemá role ani backend, zeptej se (sekce 8). Minimálně udělej export odevzdání do JSON nebo HTML.

### F18 – Export jako formátovaný text
- Tlačítko „Kopírovat do Google Docs“ zapíše do schránky `text/html` a `text/plain` (`navigator.clipboard.write`).
- Ověř, že se zachová formátování, styly nadpisů a nezlomitelné mezery.
- Používá se v KOM-11 (párová revize v režimu návrhů v Google Docs).

### F19 – Self-test úloh
Automatický test pro každou úlohu:
1. Prefill i řešení se naparsují (F02).
2. Řešení projde všemi kontrolami úlohy. Testuj první alternativy i každou další alternativu zvlášť.
3. Prefill **neprojde** (kromě úloh `vytvor` s prázdným prefillem).
4. Každé `errors[].at` (některá varianta) je v řešení právě jednou a v prefillu nikde. To samé platí pro chyby z `autoErrors`.
5. U typografických a kombinovaných úloh s řešením najde linter (F14) v řešení 0 chyb s výchozími závažnostmi.

Úlohy bez řešení (TYP-22, FMT-18, KOM-11, KOM-12) testují jen body 1 a 3.

Selhání self-testu je chyba v datech úlohy. Nahlas ji a neopravuj obsah sám.

---

## 4. Pořadí implementace

| Fáze | Funkce | Úlohy, které tím začnou fungovat |
|---|---|---|
| **A – jádro textových úloh** | F01, F02 (část text), F07, F09 (jen `charHints`), F11, F12 (`textLines`, `numberSet`, `containsLine`, `notContainsText`, `require`, `minWords`), F15, F16, F19 | TYP-01–03, TYP-05–13, TYP-16, TYP-17 |
| **B – obrázky a skryté znaky** | F04, F08, F09 (zbytek) | TYP-04, TYP-14, TYP-18, TYP-19, TYP-20 (do F17 se zdůvodnění jen uloží s pokusem) |
| **C – formátování** | F02 (celé), F03, F05, F10, F12 (`docMatches`, `constraint`), F13 | FMT-01–16, KOM-01–08 |
| **D – linter, náhled stran, otevřené úlohy** | F06, F14, F12 (`lint`, `sections`, `custom`), F17, F18 | TYP-15, TYP-21, TYP-22, FMT-17, FMT-18, KOM-09–12 |

Úlohy, které ještě nemají potřebné funkce, nech v aplikaci zamčené s popiskem „Připravujeme“, aby se nerozbilo odemykání.

---

## 5. Katalog pravidel (F16)

### Typografie

| id | Název | Krátké pravidlo (pro nápovědu) |
|---|---|---|
| `interpunkce` | Interpunkční znaménka | Znaménka . , ; : ! ? se píšou hned za slovo bez mezery, za nimi následuje mezera. Před „atd.“ na konci výčtu se čárka nepíše. Tečka za zkratkou na konci věty zároveň ukončuje větu. |
| `vypustka` | Výpustka | Píše se jedním znakem … (U+2026), ne třemi tečkami. Nedokončená myšlenka: bez mezery (tak…). Neúplný výčet: s mezerami (tři, …, deset). |
| `uvozovky` | Uvozovky | České uvozovky „takto“ (dole – nahoře) přiléhají těsně k textu. Uvozovky uvnitř přímé řeči jsou jednoduché ‚takto‘. |
| `zavorky` | Závorky | Uvnitř závorek bez mezer (takto), zvenku se závorky oddělují mezerou. Výjimka: zpracoval(a). |
| `datum` | Datum | V textu 6. října 2026 nebo 6. 10. 2026 (mezery za tečkami, bez nul). Do formulářů 06.10.2026 nebo 2026-10-06. |
| `cas` | Čas | 7.30 nebo 7:30. Rozmezí pomlčkou bez mezer: 9–17 h. Sportovní časy 2:05:27,15 (části sekund za čárkou). |
| `lomitko` | Lomítko | Mezi jednoslovnými výrazy bez mezer (2025/2026, km/h, student/ka). Je-li některý výraz víceslovný, píšou se mezery z obou stran (základní škola / střední škola). |
| `jednotky` | Jednotky, procenta, stupně | Číslo a značka se oddělují mezerou: 5 kg, 25 °C, 10 %. Bez mezery, jde-li o přídavné jméno: 10% sleva (desetiprocentní), 30° svah. Úhel bez mezer: 65°12′10″. |
| `mena` | Peněžní částky | 100 Kč (s mezerou). U celých částek žádné ,– ani ,-. Přídavné jméno bez mezery: 100Kč bankovka. |
| `matematika` | Matematické zápisy | Mezery kolem + − = × (2 + 3 = 5). Poměr s mezerami 4 : 1, sportovní výsledek bez mezer 2:1. Znaménko u čísla bez mezery: −3 °C. |
| `cisla` | Čísla | Od pěti číslic se člení po třech: 25 661,369 204. Desetinná čísla za sebou se oddělují středníkem: 12,76; 98,50. |
| `pomlcka` | Pomlčka | Pomlčka (–) není spojovník. S mezerami u oddělených výrazů (Praha – Brno), bez mezer ve významu „až, proti“ (1914–1918, Sparta–Slavia), u víceslovných výrazů s mezerami (10. října – 15. října). |
| `spojovnik` | Spojovník | Spojovník (-) je součást slova, píše se bez mezer: e-mail, bude-li, česko-německý. |
| `zalomeni` | Konce řádků | Nezlomitelnou mezeru (U+00A0) piš za v, k, s, z, u, o, a, i, mezi číslo a jednotku nebo počítaný jev (25 km, 7. kapitola), za tj., tzv., tzn., mezi den a měsíc a mezi titul a jméno. |
| `strany` | Začátky a konce stran | Strana nesmí začínat posledním řádkem odstavce, nesmí končit prvním řádkem odstavce a nadpis nesmí zůstat na konci strany. |
| `tituly` | Jména a tituly | Iniciály s mezerou (G. W. Bush). Tituly s přesnými velkými a malými písmeny (Ing., Mgr., PhDr.), prof. a doc. malými. Ph.D. a CSc. za jménem oddělit čárkou, a pokračuje-li věta, i za nimi. |
| `firmy` | Názvy firem | Právní forma za názvem se odděluje čárkou (Pekárna Novák, s. r. o.), před názvem ne (a. s. Vzdělávací institut). Za tečkami uvnitř zkratky je mezera. & se píše s mezerami. |
| `zkratky` | Zkratky | Zkratka ze začátku slova má tečku (p., popř.). Zkratka ze začátku a konce slova ji nemá (cca, pí). Iniciálové zkratky ji nemají (ČR, OSN). Věta nesmí začínat zkratkou. |
| `cislovky` | Řadové a násobné číslovky | Řadové číslovky s tečkou (12. student, nikdy 12-tý). Bez koncovek (do 18 let, ne 18-ti). Přídavná jména dohromady: 8kilometrový, 20procentní, 15letý. |

### Formátování

| id | Název | Krátké pravidlo |
|---|---|---|
| `f-zvyrazneni` | Zvýraznění | Tučně jen klíčové pojmy, kurzívou názvy děl a cizí slova. Podtržení nepoužívej, vypadá jako odkaz. |
| `f-pisma` | Písma | Patkové písmo má na koncích tahů „patičky“, bezpatkové ne. V dokumentu používej nejvýš 2 písma. |
| `f-styly` | Styly | Nadpisy dělej styly (Název, Nadpis 1, Nadpis 2), ne zvětšeným tučným písmem. Jen tak funguje obsah, navigace a jednotný vzhled. |
| `f-zarovnani` | Zarovnání | Běžný text vlevo nebo do bloku, datum a podpis vpravo. Text nikdy neposouvej mezerami. |
| `f-seznamy` | Seznamy | Používej odrážky a číslování z nástrojů, ne ručně psané pomlčky a čísla. Podúroveň se dělá klávesou Tab. |
| `f-odkazy` | Odkazy | Text odkazu má popisovat cíl (rozvrh na webu školy), ne holou adresu ani „klikni sem“. |
| `f-indexy` | Indexy | Exponenty horním indexem (m³), čísla ve vzorcích dolním indexem (H₂O). |
| `f-odstavce` | Odstavce | Mezery mezi odstavci nastav mezerou za odstavcem, ne prázdnými řádky. |
| `f-jednotnost` | Jednotnost | Stejné prvky musí vypadat stejně: stejné písmo, velikost a styl. |

### Poznámky ke zdrojovému PDF

Učitelův podklad `03_Typografie_celek.pdf` má dvě nepřesnosti. Katalog i kontroly se řídí touto sekcí, ne PDF:
- V příkladu „2, 4, 6, 8, atd.“ je čárka navíc. Správně je „2, 4, 6, 8 atd.“
- Úhel 65°12’10” má mít znaky minuty a vteřiny ′ ″ (U+2032, U+2033), ne apostrof a uvozovku.

---

## 6. Typografický linter (F14)

Výchozí závažnosti jsou `error` a `warn`. Kontrola `lint` počítá jen chyby, pokud `treatAsErrors` nepovýší varování. Regexy používají flag `u`. Mezery jsou záměrně zapsané jako literální mezera, ne `\s`.

```ts
const LINT_RULES = [
  { id: 'mezera-pred-interpunkci', re: / [,.;!?]/u,                        sev: 'error', rule: 'interpunkce', msg: 'Před interpunkcí nepatří mezera.' },
  { id: 'chybi-mezera-za-carkou',  re: /,(?=[^\s\d“‘)\]])/u,               sev: 'error', rule: 'interpunkce', msg: 'Za čárkou chybí mezera.' },
  { id: 'dve-tecky',               re: /(?<!\.)\.\.(?!\.)/u,               sev: 'error', rule: 'interpunkce', msg: 'Dvě tečky za sebou.' },
  { id: 'carka-pred-atd',          re: /,\s*(?:atd|apod)\./u,              sev: 'error', rule: 'interpunkce', msg: 'Před atd./apod. na konci výčtu čárka nepatří.' },
  { id: 'rovne-uvozovky',          re: /["']/u,                            sev: 'error', rule: 'uvozovky',    msg: 'Použij české uvozovky „…“ (‚…‘).' },
  { id: 'mezera-v-uvozovkach',     re: /„ | “/u,                           sev: 'error', rule: 'uvozovky',    msg: 'Uvozovky přiléhají těsně k textu.' },
  { id: 'mezera-v-zavorkach',      re: /\( | \)/u,                         sev: 'error', rule: 'zavorky',     msg: 'Uvnitř závorek nepatří mezera.' },
  { id: 'tri-tecky',               re: /\.\.\./u,                          sev: 'error', rule: 'vypustka',    msg: 'Místo tří teček použij znak …' },
  { id: 'spojovnik-misto-pomlcky', re: / - /u,                             sev: 'error', rule: 'pomlcka',     msg: 'Mezi slovy patří pomlčka –, ne spojovník.' },
  { id: 'cislovka-spojovnik',      re: /\d+-(?=\p{L})/u,                   sev: 'error', rule: 'cislovky',    msg: 'Číslovky se nepíšou se spojovníkem (18 let, 12., 8kilometrový).' },
  { id: 'cislovka-koncovka',       re: /\d+(?:ti|mi)\p{L}|\d+(?:tý|tí|tá|té|tého)(?!\p{L})/u, sev: 'error', rule: 'cislovky', msg: 'Číslovka s koncovkou (12tý, 8mikilometrový).' },
  { id: 'carka-pomlcka-mena',      re: /,[-–](?!\d)/u,                     sev: 'error', rule: 'mena',        msg: 'U celých částek nepiš ,– (500 Kč).' },
  { id: 'stupne-bez-mezery',       re: /\d°[CF]/u,                         sev: 'error', rule: 'jednotky',    msg: '°C se od čísla odděluje mezerou (25 °C).' },
  // varování – záleží na kontextu
  { id: 'nbsp-jednopismenne',      re: /(?<=^|[ \u00A0(„])[ksvzuoaiKSVZUOAI] /u, sev: 'warn', rule: 'zalomeni', msg: 'Za jednopísmenné slovo patří nezlomitelná mezera.' },
  { id: 'nbsp-jednotka',           re: /\d (?:kg|g|km|m|cm|mm|l|ml|Kč|%|°C|min|h)(?!\p{L})/u, sev: 'warn', rule: 'zalomeni', msg: 'Mezi číslem a jednotkou patří nezlomitelná mezera.' },
  { id: 'cislo-procento',          re: /\d%/u,                             sev: 'warn', rule: 'jednotky',    msg: 'Bez mezery jen u přídavného jména (10% sleva), jinak 10 %.' },
  { id: 'rozsah-spojovnikem',      re: /\d-\d/u,                           sev: 'warn', rule: 'pomlcka',     msg: 'Pro rozsah použij pomlčku – (1914–1918).' },
  { id: 'datum-bez-mezer',         re: /\b\d{1,2}\.\d{1,2}\.\d{4}/u,       sev: 'warn', rule: 'datum',       msg: 'V souvislém textu piš datum s mezerami (6. 10. 2026).' },
] as const;
```

Linter je pomůcka pro úlohy typu „vytvoř“, ne hlavní kontrola. U úloh s přesným řešením se rozhoduje přes F11 a F12.

---

## 7. Katalog úloh

### Jak číst katalog

**Mechaniky a Bloomova taxonomie:**

| Mechanika | Co student dělá | Bloom |
|---|---|---|
| smaž špatné | z několika variant nechá jen správnou | zapamatovat |
| převeď | stejný údaj napíše v jiném tvaru | porozumět |
| oprav | opraví text, ví kolik chyb a jakého typu | aplikovat |
| přepiš z obrázku | přepíše text se speciálními znaky | aplikovat |
| lovec chyb | opraví text bez nápovědy, kolik chyb tam je | analyzovat |
| napodob | podle náhledu naformátuje holý text | analyzovat |
| posuď | vybírá mezi verzemi a vrací špatné opravy | hodnotit |
| vytvoř | píše vlastní text s povinnými prvky | tvořit |

**Struktura kategorií:**
- **Fáze 1** (zapamatovat → aplikovat): jeden level na téma.
- **Fáze 2** (analyzovat): více témat najednou bez nápovědy.
- **Fáze 3** (hodnotit, tvořit).

U každé úlohy:
- **Nastavení** uvádí jen hodnoty, které se liší od výchozích (sekce 2).
- **Chyby** jsou anotace pro F15 ve tvaru `at` → `rule`.

---

## 7.1 Typografie

### TYP-01 · Mezery u interpunkce
- **Mechanika / Bloom:** smaž špatné / zapamatovat
- **Potřebuje:** F01, F11, F12 `textLines`, F15
- **Nastavení:** výchozí

**Zadání:**
> V každé skupině řádků je správně napsaný jen jeden. Smaž ostatní, ať zůstanou jen správné věty.

**Prefill (text):**
```text
Přijdu zítra ,ale až večer.
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
Kdy začíná film ? Nevím.
```

**Řešení (text):**
```text
Přijdu zítra, ale až večer.
Koupili jsme chleba; mléko došlo.
Pozor! Most je zavřený.
Kdy začíná film? Nevím.
```

**Kontroly:** `textLines`

**Chyby:** žádné anotace, počítají se rozdílné řádky.

---

### TYP-02 · Interpunkce v odstavci
- **Mechanika / Bloom:** oprav / aplikovat
- **Potřebuje:** F01, F11, F12 `textLines`, F15
- **Nastavení:** výchozí

Kompletní data jsou v příkladu v sekci 2.

**Zadání:**
> Oprav mezery a interpunkci. V textu je {errorCount}.

**Prefill (text):**
```text
Ahoj ,jak se máš ?Na trhu jsem koupil jablka,hrušky,švestky, atd.. Zítra se ozvu!Měj se.
```

**Řešení (text):**
```text
Ahoj, jak se máš? Na trhu jsem koupil jablka, hrušky, švestky atd. Zítra se ozvu! Měj se.
```

**Kontroly:** `textLines`

**Chyby:**
- `Ahoj, jak` → interpunkce
- `máš? Na` → interpunkce
- `jablka, ` → interpunkce
- `hrušky, ` → interpunkce
- `švestky atd` → interpunkce
- `atd. Zítra` → interpunkce
- `ozvu! Měj` → interpunkce

---

### TYP-03 · Závorky a lomítko
- **Mechanika / Bloom:** oprav / aplikovat
- **Potřebuje:** F01, F11, F12 `textLines`, F15

**Zadání:**
> Oprav mezery kolem závorek a lomítek. V textu je {errorCount}.

**Prefill (text):**
```text
Termín odevzdání najdeš v rozvrhu( viz příloha ).
Objednávku zpracoval (a) vedoucí prodejny.
Výsledky za školní rok 2025 / 2026 už visí na nástěnce.
Maximální povolená rychlost je 50 km / h.
Soutěž je určena pro kategorie základní škola/ střední škola.
```

**Řešení (text):**
```text
Termín odevzdání najdeš v rozvrhu (viz příloha).
Objednávku zpracoval(a) vedoucí prodejny.
Výsledky za školní rok 2025/2026 už visí na nástěnce.
Maximální povolená rychlost je 50 km/h.
Soutěž je určena pro kategorie základní škola / střední škola.
```

**Kontroly:** `textLines`

**Chyby:**
- `rozvrhu (` → zavorky
- `(viz ` → zavorky
- `příloha).` → zavorky
- `zpracoval(a)` → zavorky
- `2025/2026` → lomitko
- `km/h` → lomitko
- `škola / střední` → lomitko

---

### TYP-04 · České uvozovky
- **Mechanika / Bloom:** přepiš z obrázku / aplikovat
- **Potřebuje:** F01, F04, F07 (IME), F09 (`allowPaste`, `charHints`), F11, F12 `textLines`, F15
- **Nastavení:** `editor.allowPaste: false` · `charHints: ['„','“','‚','‘']` · prefill prázdný

**Zadání:**
> Přepiš text z obrázku přesně, včetně uvozovek. České uvozovky napíšeš přes Ctrl+Shift+U a kód (pak mezerník nebo Enter), na Windows přes Alt a kód na numerické klávesnici. Kódy najdeš pod zadáním.

**Media:** `textImage`:
```text
Babička se zeptala: „Kdo snědl ten koláč?“
Honza se bránil: „Táta říkal, že jsem ‚mlsoun‘!“
Knihu „Malý princ“ jsem četla už třikrát.
```

**Řešení (text):** stejné tři řádky jako na obrázku.

**Kontroly:** `textLines`

**Chyby:** žádné anotace, počítají se rozdílné řádky.

---

### TYP-05 · Výpustka
- **Mechanika / Bloom:** oprav / aplikovat
- **Potřebuje:** F01, F07, F09 (`charHints`), F11, F12 `textLines`, F15
- **Nastavení:** `charHints: ['…']`

**Zadání:**
> Tři tečky nahraď znakem výpustky … a oprav mezery kolem ní. V textu je {errorCount}.

**Prefill (text):**
```text
Jestli si to nepřečteš, tak...
Počítej se mnou: jedna, dva, tři,..., deset.
„Já jsem ... no ... nevím,“ koktal.
```

**Řešení (text):**
```text
Jestli si to nepřečteš, tak…
Počítej se mnou: jedna, dva, tři, …, deset.
„Já jsem… no… nevím,“ koktal.
```

**Kontroly:** `textLines`

**Chyby:**
- `tak…` → vypustka
- `tři, …, deset` → vypustka
- `jsem… no` → vypustka
- `no… nevím` → vypustka

---

### TYP-06 · Pomlčka, nebo spojovník?
- **Mechanika / Bloom:** oprav / porozumět
- **Potřebuje:** F01, F07, F09 (`charHints`), F11 (`dashStyle`), F12 `textLines`, F15
- **Nastavení:** `charHints: ['–']`

**Zadání:**
> Některé spojovníky jsou správně – ty nech. Tam, kde má být pomlčka (–), je oprav a zkontroluj mezery kolem ní. Opravit je potřeba {errorCount}.

**Prefill (text):**
```text
Dálnice Praha - Brno je v pátek ucpaná.
Válka trvala v letech 1914-1918.
Pošli mi to e-mailem, bude-li čas.
Koupil jsem česko-německý slovník.
Zápas Sparta-Slavia skončil remízou.
Výstava potrvá 10. října - 15. října.
```

**Řešení (text):**
```text
Dálnice Praha – Brno je v pátek ucpaná.
Válka trvala v letech 1914–1918.
Pošli mi to e-mailem, bude-li čas.
Koupil jsem česko-německý slovník.
Zápas Sparta–Slavia skončil remízou.
Výstava potrvá 10. října – 15. října.
```

**Kontroly:** `textLines`

**Chyby:**
- `Praha – Brno` → pomlcka
- `1914–1918` → pomlcka
- `Sparta–Slavia` → pomlcka
- `října – 15.` → pomlcka

---

### TYP-07 · Datum a čas
- **Mechanika / Bloom:** převeď / porozumět
- **Potřebuje:** F01, F11 (alternativy), F12 `textLines`, F15

**Zadání:**
> Za šipku napiš údaj v požadovaném tvaru. Levou část řádků neměň.

**Prefill (text):**
```text
2026-10-06 v textu, měsíc slovem →
2026-10-06 v textu, měsíc číslem →
2026-10-06 do formuláře, vzestupně →
od 9 do 17 hodin, zkráceně se značkou h →
oběd od 12.00 do 12.45, zkráceně →
sportovní čas 2 hodiny, 5 minut a 27,15 sekundy →
```

**Řešení (text):**
```text
2026-10-06 v textu, měsíc slovem → 6. října 2026
2026-10-06 v textu, měsíc číslem → 6. 10. 2026
2026-10-06 do formuláře, vzestupně → 06.10.2026
od 9 do 17 hodin, zkráceně se značkou h → 9–17 h
oběd od 12.00 do 12.45, zkráceně → {{12.00–12.45|12:00–12:45}}
sportovní čas 2 hodiny, 5 minut a 27,15 sekundy → 2:05:27,15
```

**Kontroly:** `textLines`

**Chyby:**
- `→ 6. října 2026` → datum
- `→ 6. 10. 2026` → datum
- `→ 06.10.2026` → datum
- `→ 9–17 h` → cas
- `12.00–12.45` / `12:00–12:45` → cas
- `→ 2:05:27,15` → cas

**Poznámka:** prefill končí `→` bez mezery za šipkou, `trimLines` mezeru za šipkou toleruje.

---

### TYP-08 · Jednotky, procenta, stupně
- **Mechanika / Bloom:** smaž špatné / porozumět
- **Potřebuje:** F01, F11, F12 `textLines`, F15

**Zadání:**
> V každé skupině nech jen správně napsaný řádek. Pozor: stejná značka se píše jinak, když jde o přídavné jméno („desetiprocentní sleva“).

**Prefill (text):**
```text
Na všechno je sleva 10 %.
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
Úhel měří 65° 12′ 10″.
```

**Řešení (text):**
```text
Na všechno je sleva 10 %.
Dostali jsme 10% slevu.
Venku je 25 °C.
Vyšli jsme na 30° svah.
Batoh váží 5 kg.
Úhel měří 65°12′10″.
```

**Kontroly:** `textLines`

**Chyby:** žádné anotace, počítají se rozdílné řádky.

---

### TYP-09 · Peněžní částky
- **Mechanika / Bloom:** oprav + převeď / aplikovat
- **Potřebuje:** F01, F11, F12 `textLines`, F15

**Zadání:**
> Oprav zápisy cen (u všech použij značku Kč) a v posledním řádku doplň zápis číslicí a značkou. Úprav je {errorCount}.

**Prefill (text):**
```text
Vstupné: Kč 80,–
Lístek na koncert stál 500,- Kč.
Mikina stojí 1290,–.
Zapiš číslicí a značkou: stokorunová bankovka →
```

**Řešení (text):**
```text
Vstupné: 80 Kč
Lístek na koncert stál 500 Kč.
Mikina stojí 1290 Kč.
Zapiš číslicí a značkou: stokorunová bankovka → 100Kč bankovka
```

**Kontroly:** `textLines`

**Chyby:**
- `Vstupné: 80 Kč` → mena
- `stál 500 Kč` → mena
- `stojí 1290 Kč` → mena
- `→ 100Kč bankovka` → mena

---

### TYP-10 · Matematika a velká čísla
- **Mechanika / Bloom:** oprav / aplikovat
- **Potřebuje:** F01, F11 (alternativy), F12 `textLines`, F15
- **Nastavení:** `charHints: ['−']`

**Zadání:**
> Oprav zápisy čísel a výpočtů. V textu je {errorCount}.

**Prefill (text):**
```text
Spočítej: 2+3=5.
Smíchej vodu a sirup v poměru 4:1.
Naši vyhráli 2 : 1.
V noci klesla teplota na - 3 °C.
Brno má 400000 obyvatel.
Výsledek je 25661,369204.
Naměřili jsme 12,76, 98,50, 45,67.
```

**Řešení (text):**
```text
Spočítej: 2 + 3 = 5.
Smíchej vodu a sirup v poměru 4 : 1.
Naši vyhráli 2:1.
V noci klesla teplota na {{−|-}}3 °C.
Brno má 400 000 obyvatel.
Výsledek je 25 661,369 204.
Naměřili jsme 12,76; 98,50; 45,67.
```

**Kontroly:** `textLines`

**Chyby:**
- `2 + 3 = 5` → matematika
- `4 : 1` → matematika
- `vyhráli 2:1` → matematika
- `na −3` / `na -3` → matematika
- `400 000` → cisla
- `25 661,369 204` → cisla
- `12,76; 98,50; 45,67` → cisla

---

### TYP-11 · Hon na „-ti“ (číslovky)
- **Mechanika / Bloom:** oprav / aplikovat
- **Potřebuje:** F01, F11 (alternativy), F12 `textLines`, F15

**Zadání:**
> Oprav zápisy číslovek. V textu je {errorCount}.

**Prefill (text):**
```text
Do 18-ti let je vstup zdarma.
Je to můj 12-tý pokus.
Čeká nás 8-mi kilometrový výlet.
Dostali jsme 20-ti procentní slevu.
Můj 15-ti letý bratr hraje fotbal.
Uběhl jsem už 3-tí kolo.
```

**Řešení (text):**
```text
Do 18 let je vstup zdarma.
Je to můj 12. pokus.
Čeká nás {{8kilometrový|8km}} výlet.
Dostali jsme {{20procentní|20%}} slevu.
Můj 15letý bratr hraje fotbal.
Uběhl jsem už 3. kolo.
```

**Kontroly:** `textLines`

**Chyby (všechny → cislovky):**
- `Do 18 let`
- `12. pokus`
- `8kilometrový` / `8km`
- `20procentní` / `20%`
- `15letý`
- `3. kolo`

---

### TYP-12 · Zkratky
- **Mechanika / Bloom:** smaž špatné + oprav / zapamatovat → aplikovat
- **Potřebuje:** F01, F11, F12 `textLines`, F15

**Zadání:**
> V prvních pěti dvojicích nech jen správný zápis zkratky. V posledních dvou větách vypiš zkratku na začátku věty celým slovem – věta nesmí začínat zkratkou.

**Prefill (text):**
```text
cca. 20 minut
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
Např. jablka obsahují hodně vitamínů.
```

**Řešení (text):**
```text
cca 20 minut
popř. zavolej
ČR
pí Nováková
p. Novák
Takzvané klikání je nejjednodušší ovládání.
Například jablka obsahují hodně vitamínů.
```

**Kontroly:** `textLines`

**Chyby:**
- `Takzvané` → zkratky
- `Například` → zkratky
- Dvojice se počítají jako rozdílné řádky.

---

### TYP-13 · Jména, tituly, firmy
- **Mechanika / Bloom:** oprav / aplikovat
- **Potřebuje:** F01, F11, F12 `textLines`, F15

**Zadání:**
> Oprav zápisy jmen, titulů a názvů firem. V textu je {errorCount}.

**Prefill (text):**
```text
Na přednášku přišel ing. Jan Novák PhD. a hned začal mluvit.
Projev měl G.W.Bush.
Zkoušku vede Prof. Marie Horká.
Rohlíky dodává Pekárna Novák s.r.o.
Filmy dvojice Laurel&Hardy pobaví i dnes.
Smlouvu podepsala a.s. Vzdělávací institut.
```

**Řešení (text):**
```text
Na přednášku přišel Ing. Jan Novák, Ph.D., a hned začal mluvit.
Projev měl G. W. Bush.
Zkoušku vede prof. Marie Horká.
Rohlíky dodává Pekárna Novák, s. r. o.
Filmy dvojice Laurel & Hardy pobaví i dnes.
Smlouvu podepsala a. s. Vzdělávací institut.
```

**Kontroly:** `textLines`

**Chyby:**
- `Ing. Jan` → tituly
- `, Ph.D.,` → tituly
- `G. W. Bush` → tituly
- `prof. Marie` → tituly
- `Novák, s. r. o.` → firmy
- `Laurel & Hardy` → firmy
- `a. s. Vzdělávací` → firmy

---

### TYP-14 · Nezlomitelné mezery
- **Mechanika / Bloom:** oprav / aplikovat
- **Potřebuje:** F01, F07, F08, F09 (`width`, `charHints`), F11 (`requiredOnly`), F12 `textLines`, F15 (`autoErrors`)
- **Nastavení:**
  - `editor.width: 'narrow'`
  - `match.nbspMode: 'requiredOnly'`
  - `autoErrors: 'nbsp'`
  - `charHints: ['\u00A0']` (čip zobrazí popisek „nezlomitelná mezera“, ne prázdný znak)

**Zadání:**
> Vlož nezlomitelnou mezeru všude, kde se řádek nesmí zlomit: za jednopísmenné předložky a spojky, mezi číslo a jednotku nebo počítanou věc, za tzv., mezi den a měsíc a mezi titul a jméno. Zapni si zobrazení skrytých znaků (¶), ať vidíš, kde už je máš. Chybí jich {errorCount}.

**Prefill (text):**
```text
V pondělí 6. října jsme s třídou jeli k řece a u mostu jsme ušli 25 km.
Na tzv. klikání stačí i malé dítě.
Přednášel Ing. Novák o 7. kapitole a o tom, co v ní najdeme.
```

**Řešení (text):**
```text
V~pondělí 6.~října jsme s~třídou jeli k~řece a~u~mostu jsme ušli 25~km.
Na tzv.~klikání stačí i~malé dítě.
Přednášel Ing.~Novák o~7.~kapitole a~o~tom, co v~ní najdeme.
```

**Kontroly:** `textLines`

**Chyby:** automaticky z `~` v řešení, celkem 15.

**Poznámka:** úzký editor je nutný, aby student viděl, proč na tom záleží – jednopísmenná slova zůstávají na konci řádků.

---

### TYP-15 · Začátky a konce stran
- **Mechanika / Bloom:** lovec chyb / analyzovat
- **Potřebuje:** F01, F06, F12 `numberSet`, F15
- **Nastavení:** prefill prázdný · `feedback.revealAfter: 2` (ukáže pravidlo `strany`)

**Zadání:**
> Na obrázku je 6 stránek dokumentu. Odstavec poznáš podle odsazeného prvního řádku a kratšího posledního řádku. Napiš čísla stránek, na kterých je porušené pravidlo o začátku nebo konci strany (oddělená čárkou).

**Media:** `pagesPreview`

Legenda:
- `H` = nadpis (zabírá 2 řádky)
- `Pn` = odstavec s n řádky na této straně
- `s` = odstavec na této straně začíná
- `e` = odstavec na této straně končí

```text
1: H | P6 s e  | P8 s
2: P3 e | P12 s e | P1 s           <!-- chyba: končí prvním řádkem odstavce -->
3: P6 e | P8 s e  | H              <!-- chyba: nadpis na konci strany -->
4: P7 s e | P5 s e | P4 s
5: P5 e | H | P6 s e | P3 s
6: P1 e | P9 s e  | P6 s e         <!-- chyba: začíná posledním řádkem odstavce -->
```

**Kontroly:** `numberSet` [2, 3, 6]

---

### TYP-16 · Lovec chyb I: znaky
- **Mechanika / Bloom:** lovec chyb / analyzovat
- **Potřebuje:** F01, F11, F12 `textLines`, F15
- **Nastavení:** `feedback.showCountUpfront: false` · `feedback.revealAfter: 3`

**Zadání:**
> V textu jsou chyby v interpunkci, závorkách, uvozovkách, výpustce, pomlčkách a lomítkách. Kolik jich je, se dozvíš až po kontrole.

**Prefill (text):**
```text
Na školním výletě ( Praha - Kutná Hora ) jsme navštívili kostnici.Paní učitelka řekla:"Tady se nefotí !" Pak jsme šli na oběd a pak... no,radši nic. Kdo chtěl, mohl si koupit pohled/ magnetku.
```

**Řešení (text):**
```text
Na školním výletě (Praha – Kutná Hora) jsme navštívili kostnici. Paní učitelka řekla: „Tady se nefotí!“ Pak jsme šli na oběd a pak… no, radši nic. Kdo chtěl, mohl si koupit pohled/magnetku.
```

**Kontroly:** `textLines`

**Chyby:**
- `(Praha` → zavorky
- `Praha – Kutná` → pomlcka
- `Hora)` → zavorky
- `kostnici. Paní` → interpunkce
- `řekla: „Tady` → uvozovky
- `nefotí!` → interpunkce
- `!“ Pak` → uvozovky
- `pak… no` → vypustka
- `no, radši` → interpunkce
- `pohled/magnetku` → lomitko

---

### TYP-17 · Lovec chyb II: čísla
- **Mechanika / Bloom:** lovec chyb / analyzovat
- **Potřebuje:** F01, F11 (alternativy), F12 `textLines`, F15
- **Nastavení:** `feedback.showCountUpfront: false` · `feedback.revealAfter: 3`

**Zadání:**
> V rozpisu sportovního dne jsou chyby v datech, časech, cenách, jednotkách a číslovkách. Najdi je a oprav.

**Prefill (text):**
```text
Sportovní den proběhne 15.10.2026 v čase 8:00 - 13:00 hod.
Startovné je 50,- Kč, pro 1-ní ročníky zdarma.
Trať měří 3,5km a vede po 15-ti metrovém mostě.
Loni vyhrála Jana s časem 0:12:45.30.
Pití zajistí sponzor, který dá 10 % slevu na limonády.
```

**Řešení (text):**
```text
Sportovní den proběhne 15. 10. 2026 v čase {{8:00–13:00|8.00–13.00}} hod.
Startovné je 50 Kč, pro 1. ročníky zdarma.
Trať měří 3,5 km a vede po 15metrovém mostě.
Loni vyhrála Jana s časem 0:12:45,30.
Pití zajistí sponzor, který dá 10% slevu na limonády.
```

**Kontroly:** `textLines`

**Chyby:**
- `15. 10. 2026` → datum
- `8:00–13:00` / `8.00–13.00` → cas
- `50 Kč,` → mena
- `1. ročníky` → cislovky
- `3,5 km` → jednotky
- `15metrovém` → cislovky
- `45,30` → cas
- `10% slevu` → jednotky

---

### TYP-18 · Lovec chyb III: všechno
- **Mechanika / Bloom:** lovec chyb / analyzovat
- **Potřebuje:** F01, F07, F08, F11 (`requiredOnly`, alternativy), F12 `textLines`, F15 (`autoErrors`, `maxChecks`)
- **Nastavení:**
  - `match.nbspMode: 'requiredOnly'`
  - `autoErrors: 'nbsp'`
  - `feedback.showCountUpfront: false`
  - `feedback.revealAfter: 2`
  - `feedback.maxChecks: 3`

**Zadání:**
> Zpráva z výletu do školního časopisu. Najdi a oprav všechny typografické chyby včetně chybějících nezlomitelných mezer. Máš jen 3 kontroly.

**Prefill (text):**
```text
Výlet do Brna
Ve čtvrtek 9.října jsme vyrazili vlakem Olomouc-Brno v 7.45. Cesta trvala cca. 1 hodinu. Paní učitelka mgr. Dvořáková nám cestou řekla: "Kdo ztratí lístek, platí 120,- Kč pokutu !" V Brně jsme navštívili Tzv. Labyrint pod Zelným trhem ( vstupné 160 Kč, studenti 120 Kč ). Prohlídka trvala 45min. Pak jsme zašli do science centra VIDA, kde jsme zkoušeli pokusy s vodou, pískem, atd.. Venku bylo jen 8°C , ale uvnitř bylo teplo. Domů jsme dorazili v 16.30 unavení ,ale spokojení.
```

**Řešení (text):**
```text
Výlet do Brna
Ve čtvrtek 9.~října jsme vyrazili vlakem {{Olomouc – Brno|Olomouc–Brno}} v~7.45. Cesta trvala cca 1~hodinu. Paní učitelka Mgr.~Dvořáková nám cestou řekla: „Kdo ztratí lístek, platí 120~Kč pokutu!“ V~Brně jsme navštívili tzv.~Labyrint pod Zelným trhem (vstupné 160~Kč, studenti 120~Kč). Prohlídka trvala 45~min. Pak jsme zašli do science centra VIDA, kde jsme zkoušeli pokusy s~vodou, pískem atd. Venku bylo jen 8~°C, ale uvnitř bylo teplo. Domů jsme dorazili v~16.30 unavení, ale spokojení.
```

**Kontroly:** `textLines`

**Chyby (ruční):**
- `9.~října` → datum
- `Olomouc – Brno` / `Olomouc–Brno` → pomlcka
- `cca 1` → zkratky
- `Mgr.~Dvořáková` → tituly
- `řekla: „Kdo` → uvozovky
- `120~Kč pokutu` → mena
- `pokutu!` → interpunkce
- `!“ V` → uvozovky
- `tzv.~Labyrint` → zkratky
- `(vstupné` → zavorky
- `120~Kč)` → zavorky
- `45~min` → jednotky
- `pískem atd` → interpunkce
- `atd. Venku` → interpunkce
- `8~°C` → jednotky
- `°C, ale` → interpunkce
- `unavení, ale` → interpunkce

**Chyby (automaticky):** zbylé nezlomitelné mezery, tj. `v~7.45`, `1~hodinu`, `V~Brně`, `160~Kč`, `s~vodou`, `v~16.30`.

---

### TYP-19 · Oprava opravy
- **Mechanika / Bloom:** posuď / hodnotit
- **Potřebuje:** F01, F04, F11 (alternativy), F12 `textLines`, F15
- **Nastavení:** `feedback.showCountUpfront: false`

**Zadání:**
> Na obrázku je text před opravou, v editoru je po opravě spolužáka. Některé jeho opravy jsou dobře, některé pokazily, co bylo správně, a někde oprava nestačila. Porovnej obě verze a uveď text v editoru do správného stavu.

**Media:** `textImage` (původní text):
```text
Dostali jsme 10% slevu na e-mailové služby.
Je to už 12-tý student, který přišel pozdě.
Teplota klesla na -5°C.
Zápas skončil 3:2.
Výstava potrvá 1.-15. června.
Čeká nás 8km pochod.
Smíchej to v poměru 3:1.
```

**Prefill (text)** (verze po opravě spolužáka):
```text
Dostali jsme 10 % slevu na e–mailové služby.
Je to už 12 student, který přišel pozdě.
Teplota klesla na -5 °C.
Zápas skončil 3 : 2.
Výstava potrvá 1.–15. června.
Čeká nás 8 km pochod.
Smíchej to v poměru 3 : 1.
```

**Řešení (text):**
```text
Dostali jsme 10% slevu na e-mailové služby.
Je to už 12. student, který přišel pozdě.
Teplota klesla na {{-|−}}5 °C.
Zápas skončil 3:2.
Výstava potrvá 1.–15. června.
Čeká nás {{8km|8kilometrový}} pochod.
Smíchej to v poměru 3 : 1.
```

**Kontroly:** `textLines`

**Chyby:**
- `10% slevu` → jednotky
- `e-mailové` → spojovnik
- `12. student` → cislovky
- `skončil 3:2` → matematika
- `8km pochod` / `8kilometrový pochod` → jednotky

---

### TYP-20 · Která verze?
- **Mechanika / Bloom:** posuď / hodnotit
- **Potřebuje:** F01, F11, F12 (`containsLine`, `notContainsText`, `minWords`), F15, F17 (`auto+manual`)
- **Nastavení:** `review: 'auto+manual'`

**Zadání:**
> Tři spolužáci napsali stejnou zprávu do třídní skupiny. Nech v editoru jen tu bezchybnou (zbylé dvě smaž) a pod ni napiš aspoň jednou větou, co je na ostatních špatně.

**Prefill (text):**
```text
A: Sraz je v sobotu 17.10. v 9.30 h u kina. Vezměte si 200,- Kč na vstupné a svačinu. Jirka říkal: „Kdo přijde pozdě, platí zmrzlinu!“
B: Sraz je v sobotu 17. 10. v 9.30 h u kina. Vezměte si 200 Kč na vstupné, a svačinu. Jirka říkal: "Kdo přijde pozdě, platí zmrzlinu !"
C: Sraz je v sobotu 17. 10. v 9.30 h u kina. Vezměte si 200 Kč na vstupné a svačinu. Jirka říkal: „Kdo přijde pozdě, platí zmrzlinu!“
```

**Řešení (text):** pro self-test
```text
C: Sraz je v sobotu 17. 10. v 9.30 h u kina. Vezměte si 200 Kč na vstupné a svačinu. Jirka říkal: „Kdo přijde pozdě, platí zmrzlinu!“
Verze A má datum bez mezer a cenu s čárkou a pomlčkou, verze B má rovné uvozovky a čárku navíc.
```

**Kontroly:**
- `containsLine`: `{{C: |}}Sraz je v sobotu 17. 10. v 9.30 h u kina. Vezměte si 200 Kč na vstupné a svačinu. Jirka říkal: „Kdo přijde pozdě, platí zmrzlinu!“`
- `notContainsText`: `200,- Kč`
- `notContainsText`: `na vstupné, a`
- `minWords` 6 s `excludePattern`: `Sraz je v sobotu` (počítá se jen zdůvodnění)

**Poznámka:** zdůvodnění se odevzdá učiteli (F17). Do implementace F17 se jen uloží k pokusu.

---

### TYP-21 · Oznámení
- **Mechanika / Bloom:** vytvoř / tvořit
- **Potřebuje:** F01, F12 (`require`, `minWords`, `lint`), F14, F15
- **Nastavení:** prefill prázdný · `review: 'auto'`

**Zadání:**
> Napiš pro třídu oznámení o změně rozvrhu (3–6 vět). Musí obsahovat:
> - datum v souvislém textu,
> - časové rozmezí,
> - číslo učebny,
> - přímou řeč v českých uvozovkách,
> - výčet zakončený „atd.“
>
> Text musí projít typografickou kontrolou včetně nezlomitelných mezer.

**Kontroly:**
- `require` datum: `\d{1,2}\.[ \u00A0](?:\d{1,2}\.|ledna|února|března|dubna|května|června|července|srpna|září|října|listopadu|prosince)` – label „datum v souvislém textu“
- `require` rozmezí: `\d{1,2}(?:[.:]\d{2})?[–—]\d{1,2}(?:[.:]\d{2})?` – label „časové rozmezí s pomlčkou“
- `require` učebna: `učebn\p{L}*[ \u00A0](?:č\.[ \u00A0])?\d+` – label „číslo učebny“
- `require` přímá řeč: `„[^„“]+“` – label „přímá řeč v českých uvozovkách“
- `require` výčet: `[\p{L}\d][ \u00A0]atd\.` – label „výčet zakončený atd.“
- `minWords` 20
- `lint` s `maxErrors: 0` a `treatAsErrors: ['nbsp-jednopismenne', 'nbsp-jednotka']`

**Řešení (text):** pro self-test
```text
Milí spolužáci, ve středu 14.~října se mění rozvrh. Matematika bude v~čase 10.00–11.30 v~učebně 204. Paní učitelka vzkazuje: „Vezměte si kalkulačku, pravítko, kružítko atd.“ Tělocvik ten den odpadá.
```

---

### TYP-22 · Chytáky pro spolužáka
- **Mechanika / Bloom:** vytvoř / tvořit
- **Potřebuje:** F01, F12 `custom`, F14, F17 (`manual`)
- **Nastavení:** `review: 'manual'`

**Zadání:**
> Vymysli 5 vět, každou s jednou typografickou chybou jiného typu. Pod každou napiš její opravenou verzi. Nejlepší chytáky můžou dostat ostatní jako úlohu.

**Prefill (text):**
```text
1. Chyták:
1. Oprava:
2. Chyták:
2. Oprava:
3. Chyták:
3. Oprava:
4. Chyták:
4. Oprava:
5. Chyták:
5. Oprava:
```

**Kontroly:** `custom: 'trapPairs'`
- Parsuj řádky `^(\d)\. (Chyták|Oprava):[ \u00A0]*(.*)$`.
- Musí být 5 párů a obě části neprázdné.
- Chyták se od opravy liší.
- Oprava projde linterem s 0 chybami.
- Na chyták linter najde aspoň 1 nález (chyba i varování).
- To, jestli jsou chyby „jiného typu“, posoudí učitel.

**Poznámka (později, mimo rozsah):** schválené chytáky se dají přidat jako nové úlohy typu „oprav“.

---

## 7.2 Formátování

U všech úloh této kategorie platí výchozí `match.nbspMode: 'ignore'`. Text se kontroluje jen proto, aby student obsah nepřepisoval.

★ = úloha procvičuje nástroj, který je potřeba do editoru doplnit (F10).

### FMT-01 · Tučně a kurzíva
- **Mechanika / Bloom:** oprav / aplikovat
- **Potřebuje:** F01, F02, F03, F12 `docMatches`, F15

**Zadání:**
> Označ tučně všechna jména zvířat a kurzívou jejich latinské názvy v závorkách. Nic dalšího neformátuj.

**Prefill (html):**
```html
<h1>Zvířata v Moravském krasu</h1>
<p>V jeskyních žije netopýr velký (Myotis myotis), který v zimě hibernuje. U potoků můžeš potkat mloka skvrnitého (Salamandra salamandra). V lesích nad propastí Macocha loví kuna lesní (Martes martes).</p>
```

**Řešení (html):**
```html
<h1>Zvířata v Moravském krasu</h1>
<p>V jeskyních žije <strong>netopýr velký</strong> (<em>Myotis myotis</em>), který v zimě hibernuje. U potoků můžeš potkat <strong>mloka skvrnitého</strong> (<em>Salamandra salamandra</em>). V lesích nad propastí Macocha loví <strong>kuna lesní</strong> (<em>Martes martes</em>).</p>
```

**Kontroly:** `docMatches` [text, style, bold, italic]

---

### FMT-02 · Kdy zvýrazňovat
- **Mechanika / Bloom:** oprav / porozumět
- **Potřebuje:** F01, F02, F03, F12 `docMatches`, F13, F15

**Zadání:**
> Text je přezvýrazněný. Uprav ho:
> - tučně nech jen pojmy fotosyntéza, oxid uhličitý a chlorofyl (každý jen při prvním výskytu),
> - název knihy dej kurzívou,
> - podtržení odstraň úplně – podtržený text vypadá jako odkaz.

**Prefill (html):**
```html
<p><strong><u>Fotosyntéza je proces, při kterém rostliny vyrábějí cukry.</u></strong> <u>K tomu potřebují světlo, vodu a </u><strong>oxid uhličitý</strong>. <strong>Zelenou barvu jim dává chlorofyl, který zachycuje světlo.</strong> Víc se dočteš v knize <u>Zelená továrna</u>. <strong>Fotosyntéza</strong> probíhá hlavně v listech.</p>
```

**Řešení (html):**
```html
<p><strong>Fotosyntéza</strong> je proces, při kterém rostliny vyrábějí cukry. K tomu potřebují světlo, vodu a <strong>oxid uhličitý</strong>. Zelenou barvu jim dává <strong>chlorofyl</strong>, který zachycuje světlo. Víc se dočteš v knize <em>Zelená továrna</em>. Fotosyntéza probíhá hlavně v listech.</p>
```

**Kontroly:**
- `docMatches` [text, bold, italic, underline]
- `constraint underlineOnlyLinks`

---

### FMT-03 · Patkové, nebo bezpatkové?
- **Mechanika / Bloom:** smaž špatné / zapamatovat
- **Potřebuje:** F01, F02, F03, F10i, F12 (`textLines`, `constraint`), F13

**Zadání:**
> Každý řádek je napsaný jiným písmem. Smaž řádky s bezpatkovým písmem. Zbylé řádky pak nastav všechny na jedno stejné patkové písmo.

**Prefill (html):**
```html
<p><span style="font-family:'Arial'">1 – Příliš žluťoučký kůň úpěl ďábelské ódy.</span></p>
<p><span style="font-family:'Merriweather'">2 – Příliš žluťoučký kůň úpěl ďábelské ódy.</span></p>
<p><span style="font-family:'Roboto'">3 – Příliš žluťoučký kůň úpěl ďábelské ódy.</span></p>
<p><span style="font-family:'Lora'">4 – Příliš žluťoučký kůň úpěl ďábelské ódy.</span></p>
<p><span style="font-family:'Open Sans'">5 – Příliš žluťoučký kůň úpěl ďábelské ódy.</span></p>
<p><span style="font-family:'PT Serif'">6 – Příliš žluťoučký kůň úpěl ďábelské ódy.</span></p>
```

**Řešení (text):**
```text
2 – Příliš žluťoučký kůň úpěl ďábelské ódy.
4 – Příliš žluťoučký kůň úpěl ďábelské ódy.
6 – Příliš žluťoučký kůň úpěl ďábelské ódy.
```

**Kontroly:**
- `textLines`
- `constraint uniformFont` { `allowedFamilies: 'serif'`, `scope: 'all'` }

**Poznámka:** self-test musí řešení vyhodnotit s nastaveným jedním patkovým písmem.

---

### FMT-04 · Sjednocení písma
- **Mechanika / Bloom:** lovec chyb / analyzovat
- **Potřebuje:** F01, F02, F03, F12 (`textLines`, `constraint`), F13, F15
- **Nastavení:** `feedback.showCountUpfront: false`

**Zadání:**
> Celý text pod nadpisem má být písmem Arial o velikosti 11. Některé odstavce (nebo jejich části) se liší. Najdi je a sjednoť. Nadpis nech, jak je.

**Prefill (html):**
```html
<h1>Pravidla školní knihovny</h1>
<p><span style="font-family:'Arial';font-size:11pt">Knihovna je otevřená každý všední den od 8.00 do 15.00.</span></p>
<p><span style="font-family:'Roboto';font-size:11pt">Půjčit si můžeš najednou nejvýš tři knihy.</span></p>
<p><span style="font-family:'Arial';font-size:11pt">Výpůjční doba je čtyři týdny, prodloužit ji můžeš jednou.</span></p>
<p><span style="font-family:'Arial';font-size:12pt">Za poškozenou knihu se platí náhrada.</span></p>
<p><span style="font-family:'Arial';font-size:11pt">V knihovně se nejí a nepije. </span><span style="font-family:'Open Sans';font-size:11pt">Mobil měj ztlumený.</span></p>
```

**Řešení:** stejný text jako prefill, všechny odstavce Normální text v písmu Arial 11 pt.

**Kontroly:**
- `textLines` (řešení = plain text prefillu)
- `constraint uniformFont` { `family: 'Arial'`, `size: 11`, `scope: 'normal'` }

---

### FMT-05 · Zarovnání omluvenky
- **Mechanika / Bloom:** oprav / aplikovat
- **Potřebuje:** F01, F02, F03, F12 `docMatches`, F13, F15

**Zadání:**
> Naformátuj omluvenku:
> - místo a datum zarovnej vpravo,
> - nadpis na střed,
> - text omluvenky do bloku,
> - podpis vpravo.
>
> Text neposouvej mezerami – ty, které tam jsou, smaž.

**Prefill (html):**
```html
<!-- první odstavec začíná přesně 20 mezerami U+0020 -->
<p>                    V Brně dne 6. 10. 2026</p>
<p data-style="title">Omluvenka</p>
<p>Omlouvám svou dceru Annu Novákovou z vyučování ve dnech 1.–3. října 2026 z rodinných důvodů. Děkuji za pochopení.</p>
<p>Jana Nováková</p>
```

**Řešení (html):**
```html
<p style="text-align:right">V Brně dne 6. 10. 2026</p>
<p data-style="title" style="text-align:center">Omluvenka</p>
<p style="text-align:justify">Omlouvám svou dceru Annu Novákovou z vyučování ve dnech 1.–3. října 2026 z rodinných důvodů. Děkuji za pochopení.</p>
<p style="text-align:right">Jana Nováková</p>
```

**Kontroly:**
- `docMatches` [text, style, align]
- `constraint noLeadingWhitespace`

---

### FMT-06 · Odrážky a číslování
- **Mechanika / Bloom:** oprav / aplikovat
- **Potřebuje:** F01, F02, F03, F10c, F12 `docMatches`, F13, F15

**Zadání:**
> Seznamy jsou napsané ručně pomlčkami, hvězdičkami a čísly. Udělej z věcí na výlet odrážkový seznam a z postupu číslovaný seznam. Ruční značky smaž.

**Prefill (html):**
```html
<h2>Co si vzít na výlet</h2>
<p>- pláštěnku</p>
<p>* svačinu</p>
<p>- láhev s pitím</p>
<p>- kartičku pojišťovny</p>
<h2>Postup přihlášení</h2>
<p>1) Vyplň přihlášku.</p>
<p>2) Nech ji podepsat rodiči.</p>
<p>3) Odevzdej ji třídní učitelce do pátku.</p>
```

**Řešení (html):**
```html
<h2>Co si vzít na výlet</h2>
<ul><li>pláštěnku</li><li>svačinu</li><li>láhev s pitím</li><li>kartičku pojišťovny</li></ul>
<h2>Postup přihlášení</h2>
<ol><li>Vyplň přihlášku.</li><li>Nech ji podepsat rodiči.</li><li>Odevzdej ji třídní učitelce do pátku.</li></ol>
```

**Kontroly:**
- `docMatches` [text, style, list]
- `constraint noManualListMarkers`

---

### FMT-07 · Styly nadpisů
- **Mechanika / Bloom:** převeď / porozumět
- **Potřebuje:** F01, F02, F03, F10h, F10f (odměna), F12 `docMatches`, F13, F15

**Zadání:**
> Nadpisy jsou udělané ručně – jen zvětšené a tučné. Převeď je na styly:
> - hlavní nadpis na Název,
> - rubriky na Nadpis 1,
> - články na Nadpis 2.
>
> Ruční tučné písmo a velikost u nich zruš.

**Prefill (html):**
```html
<p><span style="font-size:24pt"><strong>Školní časopis Kompas</strong></span></p>
<p><span style="font-size:18pt"><strong>Rozhovory</strong></span></p>
<p><span style="font-size:14pt"><strong>S novou paní ředitelkou</strong></span></p>
<p>Zeptali jsme se, co chce na škole změnit a co by naopak nechala.</p>
<p><span style="font-size:14pt"><strong>Se školníkem</strong></span></p>
<p>Prozradil nám, kde ve škole najdeme nejstarší lavici.</p>
<p><span style="font-size:18pt"><strong>Sport</strong></span></p>
<p><span style="font-size:14pt"><strong>Florbalový turnaj</strong></span></p>
<p>Naši florbalisté skončili na krajském turnaji druzí.</p>
```

**Řešení (html):**
```html
<p data-style="title">Školní časopis Kompas</p>
<h1>Rozhovory</h1>
<h2>S novou paní ředitelkou</h2>
<p>Zeptali jsme se, co chce na škole změnit a co by naopak nechala.</p>
<h2>Se školníkem</h2>
<p>Prozradil nám, kde ve škole najdeme nejstarší lavici.</p>
<h1>Sport</h1>
<h2>Florbalový turnaj</h2>
<p>Naši florbalisté skončili na krajském turnaji druzí.</p>
```

**Kontroly:**
- `docMatches` [text, style]
- `constraint noManualHeadingFormatting`
- `constraint noFakeHeadings`

**Odměna:** po splnění se ukáže tlačítko „Vložit obsah“ (F10f) s hláškou „Obsah se vytvořil sám – funguje to jen díky stylům nadpisů.“

---

### FMT-08 · Struktura článku
- **Mechanika / Bloom:** lovec chyb / analyzovat
- **Potřebuje:** F01, F02, F03, F12 `docMatches`, F15
- **Nastavení:** `feedback.showCountUpfront: false`

**Zadání:**
> Článek nemá žádné formátování. Rozhodni, který řádek je Název, které jsou nadpisy kapitol (Nadpis 1) a které podkapitol (Nadpis 2), a nastav jim styly.

**Prefill (text):**
```text
Jak přežít první ročník
Učení
Jak si dělat poznámky
Poznámky si piš vlastními slovy, ne opisuj tabuli.
Kdy se učit
Lepší je učit se průběžně než všechno noc před testem.
Volný čas
Kroužky a kluby
Na škole funguje debatní klub, sbor i robotický kroužek.
Kde se potkat s ostatními
Nejvíc lidí potkáš o velké přestávce v atriu.
```

**Řešení (html):**
```html
<p data-style="title">Jak přežít první ročník</p>
<h1>Učení</h1>
<h2>Jak si dělat poznámky</h2>
<p>Poznámky si piš vlastními slovy, ne opisuj tabuli.</p>
<h2>Kdy se učit</h2>
<p>Lepší je učit se průběžně než všechno noc před testem.</p>
<h1>Volný čas</h1>
<h2>Kroužky a kluby</h2>
<p>Na škole funguje debatní klub, sbor i robotický kroužek.</p>
<h2>Kde se potkat s ostatními</h2>
<p>Nejvíc lidí potkáš o velké přestávce v atriu.</p>
```

**Kontroly:** `docMatches` [text, style]

---

### FMT-09 · Horní a dolní index ★
- **Mechanika / Bloom:** oprav / aplikovat
- **Potřebuje:** F01, F02, F03, F10a, F11 (alternativy), F12 `docMatches`, F15

**Zadání:**
> Exponenty nastav jako horní index (Ctrl+.) a čísla v chemických vzorcích jako dolní index (Ctrl+,).

**Prefill (html):**
```html
<p>Byt má rozlohu 65 m2 a sklep 12 m3.</p>
<p>Voda má vzorec H2O, oxid uhličitý CO2.</p>
<p>Kyselina sírová se zapisuje H2SO4.</p>
<p>Platí (a + b)2 = a2 + 2ab + b2.</p>
<p>Vlnová délka zeleného světla je asi 5 · 10-7 m.</p>
```

**Řešení (html):**
```html
<p>Byt má rozlohu 65 m<sup>2</sup> a sklep 12 m<sup>3</sup>.</p>
<p>Voda má vzorec H<sub>2</sub>O, oxid uhličitý CO<sub>2</sub>.</p>
<p>Kyselina sírová se zapisuje H<sub>2</sub>SO<sub>4</sub>.</p>
<p>Platí (a + b)<sup>2</sup> = a<sup>2</sup> + 2ab + b<sup>2</sup>.</p>
<p>Vlnová délka zeleného světla je asi 5 · 10<sup>{{-|−}}7</sup> m.</p>
```

**Kontroly:** `docMatches` [text, superscript, subscript]

---

### FMT-10 · Odkazy ★
- **Mechanika / Bloom:** oprav / aplikovat → hodnotit
- **Potřebuje:** F01, F02, F03, F10b, F12 `constraint`, F13, F15

**Zadání:**
> 1. Z textu „rozvrhu na webu školy“ udělej odkaz na https://skola.example.com/rozvrh.
> 2. Holou adresu ve druhém řádku schovej do odkazu, jehož text řekne, kam vede (třeba „Přihláška na kroužky“).
> 3. Odkaz „Klikni sem“ přepiš tak, aby jeho text říkal, kam vede. Odkaz musí zůstat.

**Prefill (html):**
```html
<p>Změny najdeš v rozvrhu na webu školy.</p>
<p>Přihláška na kroužky: https://skola.example.com/krouzky</p>
<p>Jídelníček na příští týden? <a href="https://skola.example.com/jidelna">Klikni sem</a>.</p>
```

**Řešení (html):** jedno z možných, pro self-test
```html
<p>Změny najdeš v <a href="https://skola.example.com/rozvrh">rozvrhu na webu školy</a>.</p>
<p><a href="https://skola.example.com/krouzky">Přihláška na kroužky</a></p>
<p><a href="https://skola.example.com/jidelna">Jídelníček na příští týden</a></p>
```

**Kontroly:**
- `constraint linkExists` { `hrefIncludes: '/rozvrh'`, `textMatches: 'rozvrh'` }
- `constraint linkExists` { `hrefIncludes: '/krouzky'`, `textMatches: 'krouž|přihláš'` }
- `constraint linkExists` { `hrefIncludes: '/jidelna'`, `textMatches: 'jídelníč'` }
- `constraint noRawUrls`
- `constraint noVagueLinkText`

---

### FMT-11 · Víceúrovňový seznam ★
- **Mechanika / Bloom:** napodob / aplikovat
- **Potřebuje:** F01, F02, F05 (`full`), F10c, F12 `docMatches`, F15

**Zadání:**
> Podle náhledu udělej z osnovy referátu číslovaný seznam se dvěma úrovněmi. Podúroveň vytvoříš klávesou Tab, zpět se vrátíš přes Shift+Tab.

**Media:** `docPreview` (`full`) = řešení.

**Prefill (text):**
```text
Úvod
Proč jsem si vybral(a) téma
Co se dozvíte
Historie
Počátky
Současnost
Závěr
```

**Řešení (html):**
```html
<ol>
  <li>Úvod
    <ol><li>Proč jsem si vybral(a) téma</li><li>Co se dozvíte</li></ol>
  </li>
  <li>Historie
    <ol><li>Počátky</li><li>Současnost</li></ol>
  </li>
  <li>Závěr</li>
</ol>
```

**Kontroly:** `docMatches` [text, list]

---

### FMT-12 · Mezery mezi odstavci ★
- **Mechanika / Bloom:** oprav / aplikovat
- **Potřebuje:** F01, F02, F03, F10d, F12 (`textLines`, `constraint`), F13, F15

**Zadání:**
> Odstavce jsou od sebe oddělené prázdnými řádky. Smaž je a místo nich nastav všem odstavcům mezeru za odstavcem (aspoň 6 pt).

**Prefill (html):**
```html
<h1>Jak se připravit na test</h1>
<p>Začni s opakováním aspoň tři dny předem.</p>
<p></p>
<p>Udělej si přehled toho, co už umíš a co ne.</p>
<p></p>
<p></p>
<p>Vysvětli látku někomu jinému – nejlíp poznáš, co nechápeš.</p>
<p></p>
<p>Před testem se pořádně vyspi.</p>
```

**Řešení (html):**
```html
<h1>Jak se připravit na test</h1>
<p style="margin-bottom:8pt">Začni s opakováním aspoň tři dny předem.</p>
<p style="margin-bottom:8pt">Udělej si přehled toho, co už umíš a co ne.</p>
<p style="margin-bottom:8pt">Vysvětli látku někomu jinému – nejlíp poznáš, co nechápeš.</p>
<p style="margin-bottom:8pt">Před testem se pořádně vyspi.</p>
```

**Kontroly:**
- `textLines`
- `constraint noEmptyParagraphs`
- `constraint spaceAfterMin` { `pt: 6`, `scope: 'normal'` }

**Poznámka:** výchozí mezera za odstavcem Normálního textu musí být menší než 6 pt, jinak úloha nemá smysl.

---

### FMT-13 · Vymazat formátování ★
- **Mechanika / Bloom:** oprav / aplikovat
- **Potřebuje:** F01, F02, F03, F10e, F10g, F12 `docMatches`, F13, F15

**Zadání:**
> Text jsi zkopíroval z webu a přinesl si s ním zbytečné formátování.
> 1. Označ všechno a vymaž formátování (Ctrl+\\).
> 2. Pak nastav první řádek jako Nadpis 1.
> 3. Název filmu Poslední zvonění dej kurzívou.
>
> Nic dalšího neformátuj.

**Prefill (html):**
```html
<p><span style="font-family:'Roboto';font-size:17pt;color:#c0392b">Festival studentského filmu</span></p>
<p><span style="font-family:'Lora';font-size:13pt;background-color:#fff176">Letos se do soutěže přihlásilo 24 krátkých filmů. </span><span style="font-family:'Open Sans';font-size:9pt;color:#2e86de">Cenu diváků získal film Poslední zvonění, který natočili studenti 3. ročníku.</span></p>
<p><span style="font-family:'Merriweather';font-size:13pt"><strong><u>Promítání vítězných filmů proběhne v pátek v aule.</u></strong></span></p>
```

**Řešení (html):**
```html
<h1>Festival studentského filmu</h1>
<p>Letos se do soutěže přihlásilo 24 krátkých filmů. Cenu diváků získal film <em>Poslední zvonění</em>, který natočili studenti 3. ročníku.</p>
<p>Promítání vítězných filmů proběhne v pátek v aule.</p>
```

**Kontroly:**
- `docMatches` [text, style, bold, italic, underline]
- `constraint noDirectFormatting` { `allow: ['italic']` }

---

### FMT-14 · Napodob: pozvánka
- **Mechanika / Bloom:** napodob / analyzovat
- **Potřebuje:** F01, F02, F05 (`full`), F10h, F12 `docMatches`, F15
- **Nastavení:** `feedback.showCountUpfront: false`

**Zadání:**
> Naformátuj text tak, aby vypadal jako pozvánka na náhledu: styly, zarovnání, tučné a kurzíva, seznam.

**Media:** `docPreview` (`full`) = řešení.

**Prefill (text):**
```text
Vánoční koncert
pěveckého sboru Kos
úterý 15. prosince 2026, 18.00
Srdečně zveme rodiče, přátele i učitele na tradiční vánoční koncert v aule školy. Zazní koledy i úryvky z České mše vánoční.
vstupné dobrovolné
občerstvení připraví 2. ročník
Za sbor Mgr. Petra Malá
```

**Řešení (html):**
```html
<p data-style="title" style="text-align:center">Vánoční koncert</p>
<p data-style="subtitle" style="text-align:center">pěveckého sboru Kos</p>
<p style="text-align:center"><strong>úterý 15. prosince 2026, 18.00</strong></p>
<p style="text-align:justify">Srdečně zveme rodiče, přátele i učitele na tradiční vánoční koncert v aule školy. Zazní koledy i úryvky z <em>České mše vánoční</em>.</p>
<ul><li>vstupné dobrovolné</li><li>občerstvení připraví 2. ročník</li></ul>
<p style="text-align:right">Za sbor Mgr. Petra Malá</p>
```

**Kontroly:** `docMatches` [text, style, align, list, bold, italic]

---

### FMT-15 · Napodob: referát
- **Mechanika / Bloom:** napodob / analyzovat
- **Potřebuje:** F01, F02, F05 (`full`), F10a, F10b, F10c, F12 `docMatches`, F13, F15
- **Nastavení:** `feedback.showCountUpfront: false`

**Zadání:**
> Naformátuj referát podle náhledu. Adresu zdroje schovej do odkazu s textem „Včela medonosná – Wikipedie“ (adresa: https://cs.wikipedia.org/wiki/Včela_medonosná).

**Media:** `docPreview` (`full`) = řešení.

**Prefill (text):**
```text
Včely
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
Včela medonosná – Wikipedie (https://cs.wikipedia.org/wiki/Včela_medonosná)
```

**Řešení (html):**
```html
<p data-style="title">Včely</p>
<p data-style="subtitle">Referát do biologie</p>
<h1>Jak žijí</h1>
<p style="text-align:justify">Včela medonosná (<em>Apis mellifera</em>) žije ve včelstvu, které v létě čítá až 50 000 jedinců. Jedna buňka plástve má plochu asi 0,25 cm<sup>2</sup>.</p>
<h2>Kdo je kdo ve včelstvu</h2>
<ul><li><strong>královna</strong> – klade vajíčka</li><li><strong>dělnice</strong> – sbírají nektar a pyl, staví plástve</li><li><strong>trubci</strong> – oplozují královnu</li></ul>
<h1>Proč jsou důležité</h1>
<p style="text-align:justify">Včely opylují velkou část plodin, které jíme. Bez nich by byla úroda výrazně menší.</p>
<h1>Zdroje</h1>
<ol><li><a href="https://cs.wikipedia.org/wiki/Včela_medonosná">Včela medonosná – Wikipedie</a></li></ol>
```

**Kontroly:**
- `docMatches` [text, style, align, list, bold, italic, superscript, link]
- `constraint noRawUrls`

---

### FMT-16 · Nejednotnosti
- **Mechanika / Bloom:** lovec chyb / analyzovat
- **Potřebuje:** F01, F02, F03, F12 `docMatches`, F13, F15
- **Nastavení:** `feedback.showCountUpfront: false` · `feedback.revealAfter: 3`

**Zadání:**
> Dokument je skoro hotový, ale stejné věci v něm nevypadají stejně. Najdi nejednotnosti a oprav je.

**Prefill (html):**
```html
<p data-style="title">Turistický kroužek</p>
<h2>Kdy se scházíme</h2>
<p style="text-align:justify">Každou středu od 15.00 v učebně 112.</p>
<p><strong><span style="font-size:16pt">Co budeme dělat</span></strong></p>   <!-- falešný nadpis -->
<ul><li>výlety do okolí Brna</li><li>orientace v terénu</li></ul>
<p>- základy první pomoci</p>                                              <!-- ruční odrážka mimo seznam -->
<h2>Kolik to stojí</h2>
<p style="text-align:center">Kroužek je zdarma, platíš jen jízdenky.</p>    <!-- na střed místo do bloku -->
<p></p>                                                                    <!-- prázdný odstavec -->
<h2>Kontakt</h2>
<p style="text-align:justify"><span style="font-family:'Lora'">Mgr. Tomáš Horák, horak@skola.example.com</span></p>   <!-- jiné písmo -->
```

**Řešení (html):**
```html
<p data-style="title">Turistický kroužek</p>
<h2>Kdy se scházíme</h2>
<p style="text-align:justify">Každou středu od 15.00 v učebně 112.</p>
<h2>Co budeme dělat</h2>
<ul><li>výlety do okolí Brna</li><li>orientace v terénu</li><li>základy první pomoci</li></ul>
<h2>Kolik to stojí</h2>
<p style="text-align:justify">Kroužek je zdarma, platíš jen jízdenky.</p>
<h2>Kontakt</h2>
<p style="text-align:justify">Mgr. Tomáš Horák, horak@skola.example.com</p>
```

**Kontroly:**
- `docMatches` [text, style, align, list]
- `constraint uniformFont` { `scope: 'normal'` }
- `constraint noEmptyParagraphs`
- `constraint noFakeHeadings`
- `constraint noManualListMarkers`

---

### FMT-17 · Zachraň plakát
- **Mechanika / Bloom:** posuď / hodnotit
- **Potřebuje:** F01, F02, F03, F10g, F12 (`constraint`, `require`), F13, F15, F17 (`auto+manual`)
- **Nastavení:** `review: 'auto+manual'`

**Zadání:**
> Plakát je nečitelný. Uprav ho tak, aby splnil pravidla:
> - nejvýš 2 písma,
> - hlavní nadpis jako Název, další nadpisy stylem nadpisu,
> - běžný text není na střed,
> - nic není podtržené,
> - tučně je nejvýš desetina textu.
>
> Obsah neměň. Na konec připiš odstavec, který začíná „Změnil(a) jsem:“, a dvěma větami vysvětli, co a proč.

**Prefill (html):**
```html
<p style="text-align:center"><span style="font-family:'Lora';font-size:30pt"><strong><u>ŠKOLNÍ BLEŠÁK</u></strong></span></p>
<p style="text-align:center"><span style="font-family:'Roboto';font-size:16pt;color:#e67e22"><strong>Kdy a kde?</strong></span></p>
<p style="text-align:center"><span style="font-family:'Open Sans';font-size:13pt"><strong><u>Ve čtvrtek 5. listopadu 2026 od 15.00 do 18.00 v atriu školy.</u></strong></span></p>
<p style="text-align:center"><span style="font-family:'Merriweather';font-size:16pt;color:#8e44ad"><strong>Co můžeš přinést?</strong></span></p>
<p style="text-align:center"><span style="font-family:'PT Serif';font-size:12pt"><strong>Oblečení, knihy, deskové hry a cokoli, co už nepotřebuješ, ale někomu jinému udělá radost. Prodávat můžeš sám, nebo věci jen darovat.</strong></span></p>
<p style="text-align:center"><span style="font-family:'Arial';font-size:14pt;background-color:#fff176"><strong><u>Výtěžek věnujeme útulku Pes v nouzi.</u></strong></span></p>
```

**Řešení (html):** jedno z možných, pro self-test
```html
<p data-style="title">Školní blešák</p>
<h2>Kdy a kde?</h2>
<p>Ve čtvrtek 5. listopadu 2026 od 15.00 do 18.00 v atriu školy.</p>
<h2>Co můžeš přinést?</h2>
<p>Oblečení, knihy, deskové hry a cokoli, co už nepotřebuješ, ale někomu jinému udělá radost. Prodávat můžeš sám, nebo věci jen darovat.</p>
<p>Výtěžek věnujeme útulku <strong>Pes v nouzi</strong>.</p>
<p>Změnil jsem: nadpisy jsem převedl na styly a sjednotil písmo. Zrušil jsem podtržení a většinu tučného textu, aby vynikla jen hlavní informace.</p>
```

**Kontroly:**
- `constraint maxFonts` { `max: 2` }
- `constraint requireStyle` { `style: 'title'`, `min: 1`, `max: 1` }
- `constraint requireHeadings` { `min: 1` }
- `constraint noFakeHeadings`
- `constraint noCenteredBody`
- `constraint underlineOnlyLinks`
- `constraint boldRatioMax` { `ratio: 0.1` }
- `require` (`iu`) `5\. listopadu` – label „datum akce“
- `require` (`iu`) `Pes v nouzi` – label „název útulku“
- `require` (`iu`) `Změnil(?:a|\(a\))? jsem:` – label „odstavec Změnil(a) jsem:“

**Poznámka:** zdůvodnění se odevzdá učiteli (F17).

---

### FMT-18 · Navrhni formát
- **Mechanika / Bloom:** vytvoř / tvořit
- **Potřebuje:** F01, F02, F03, F12 `constraint`, F13, F17 (`manual`)
- **Nastavení:** `review: 'manual'`

**Zadání:**
> Naformátuj návod tak, aby se dobře četl. Jak, je na tobě. Minimum:
> - Název,
> - aspoň jeden nadpis,
> - aspoň jeden seznam.
>
> Obsah neměň. Návod pak ohodnotí spolužák.

**Prefill (text):**
```text
Bylinky v truhlíku
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
Mátu sázej zvlášť, jinak ostatní bylinky přeroste.
```

**Kontroly:**
- `constraint requireStyle` { `style: 'title'`, `min: 1`, `max: 1` }
- `constraint requireHeadings` { `min: 1` }
- `constraint requireList` { `min: 1` }
- `constraint noFakeHeadings`
- `constraint noEmptyParagraphs`
- `constraint maxFonts` { `max: 2` }
- `constraint textPreserved` { `source: 'prefill'` }

**selfChecklist:**
- Čte se to snadno i na první pohled?
- Je jasné, co je nadpis a co obsah?
- Používám nejvýš 2 písma a tučné jen výjimečně?

---

## 7.3 Kombinace

Reálné dokumenty, ve kterých se procvičuje typografie i formátování najednou. V KOM-05 až KOM-08 se vyžadují i nezlomitelné mezery (`nbspMode: 'requiredOnly'`), ostatní mají výchozí `ignore`.

### KOM-01 · Jídelníček
- **Mechanika / Bloom:** oprav / aplikovat
- **Potřebuje:** F01, F02, F03, F11 (alternativy), F12 `docMatches`, F13, F15

**Zadání:**
> V jídelníčku je {errorCount} v typografii. Kromě toho ho naformátuj:
> - hlavní nadpis jako Název,
> - dny jako Nadpis 2,
> - jídla jako odrážkový seznam (bez ručních pomlček).

**Prefill (html):**
```html
<p><strong><span style="font-size:20pt">Jídelníček 12.10.-16.10.</span></strong></p>
<p>Výdej obědů: 11:30 - 14:00</p>
<p><strong>Pondělí</strong></p>
<p>- Polévka: hovězí vývar s nudlemi (alergeny 1,3,9)</p>
<p>- Kuřecí řízek, bramborová kaše (35,- Kč)</p>
<p><strong>Úterý</strong></p>
<p>- Polévka: hrachová (alergeny 1 ,7)</p>
<p>- Špagety s rajskou omáčkou (35,-Kč)</p>
```

**Řešení (html):**
```html
<p data-style="title">Jídelníček {{12.–16. 10.|12. 10. – 16. 10.|12.–16. října|12. října – 16. října}}</p>
<p>Výdej obědů: {{11:30–14:00|11.30–14.00}}</p>
<h2>Pondělí</h2>
<ul><li>Polévka: hovězí vývar s nudlemi (alergeny 1, 3, 9)</li><li>Kuřecí řízek, bramborová kaše (35 Kč)</li></ul>
<h2>Úterý</h2>
<ul><li>Polévka: hrachová (alergeny 1, 7)</li><li>Špagety s rajskou omáčkou (35 Kč)</li></ul>
```

**Kontroly:**
- `docMatches` [text, style, list]
- `constraint noManualListMarkers`
- `constraint noFakeHeadings`

**Chyby:**
- `12.–16. 10.` / `12. 10. – 16. 10.` / `12.–16. října` / `12. října – 16. října` → datum
- `11:30–14:00` / `11.30–14.00` → cas
- `1, 3, 9` → interpunkce
- `kaše (35 Kč)` → mena
- `1, 7` → interpunkce
- `omáčkou (35 Kč)` → mena

---

### KOM-02 · Omluvenka
- **Mechanika / Bloom:** oprav / aplikovat
- **Potřebuje:** F01, F02, F03, F12 `docMatches`, F15

**Zadání:**
> V omluvence je {errorCount} v typografii. Naformátuj ji:
> - datum a podpis vpravo,
> - nadpis jako Název na střed,
> - hlavní text do bloku.

**Prefill (html):**
```html
<p>V Brně dne 6.10.2026</p>
<p><strong>Omluvenka</strong></p>
<p>Vážená paní mgr. Nováková,</p>
<p>omlouvám svého syna Petra Dvořáka z vyučování ve dnech 1.-3. října 2026 z rodinných důvodů.Děkuji za pochopení .</p>
<p>Jana Dvořáková</p>
```

**Řešení (html):**
```html
<p style="text-align:right">V Brně dne 6. 10. 2026</p>
<p data-style="title" style="text-align:center">Omluvenka</p>
<p>Vážená paní Mgr. Nováková,</p>
<p style="text-align:justify">omlouvám svého syna Petra Dvořáka z vyučování ve dnech 1.–3. října 2026 z rodinných důvodů. Děkuji za pochopení.</p>
<p style="text-align:right">Jana Dvořáková</p>
```

**Kontroly:** `docMatches` [text, style, align, bold]

**Chyby:**
- `6. 10. 2026` → datum
- `Mgr. Nováková` → tituly
- `1.–3. října` → pomlcka
- `důvodů. Děkuji` → interpunkce
- `pochopení.` → interpunkce

---

### KOM-03 · Recept
- **Mechanika / Bloom:** oprav / aplikovat
- **Potřebuje:** F01, F02, F03, F10c, F11 (alternativy), F12 `docMatches`, F13, F15

**Zadání:**
> V receptu je {errorCount} v typografii. Naformátuj ho:
> - název receptu jako Název,
> - Suroviny a Postup jako Nadpis 2,
> - suroviny jako odrážky, postup jako číslovaný seznam.

**Prefill (html):**
```html
<p><span style="font-size:20pt"><strong>Bábovka</strong></span></p>
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
<p>3. Těsto nalij do vymazané formy a peč cca. 45 min.</p>
```

**Řešení (html):**
```html
<p data-style="title">Bábovka</p>
<h2>Suroviny</h2>
<ul><li>250 g polohrubé mouky</li><li>200 g cukru</li><li>4 vejce</li><li>{{1/2|½}} balíčku prášku do pečiva</li><li>125 ml oleje</li><li>125 ml mléka</li></ul>
<h2>Postup</h2>
<ol><li>Troubu předehřej na 180 °C.</li><li>Vejce utři s cukrem, přidej olej, mléko a mouku s práškem do pečiva.</li><li>Těsto nalij do vymazané formy a peč cca 45 min.</li></ol>
```

**Kontroly:**
- `docMatches` [text, style, list]
- `constraint noManualListMarkers`
- `constraint noFakeHeadings`

**Chyby:**
- `250 g` → jednotky
- `200 g` → jednotky
- `125 ml oleje` → jednotky
- `125 ml mléka` → jednotky
- `180 °C` → jednotky
- `cca 45` → zkratky

---

### KOM-04 · Plakát na seznamovák
- **Mechanika / Bloom:** přepiš z obrázku + napodob / aplikovat → analyzovat
- **Potřebuje:** F01, F02, F05 (`full`), F07, F09 (`allowPaste`, `charHints`), F10b, F10h, F11 (alternativy), F12 `docMatches`, F15
- **Nastavení:** `editor.allowPaste: false` · `charHints: ['„','“','–']` · prefill prázdný · `feedback.showCountUpfront: false`

**Zadání:**
> Podle náhledu napiš a naformátuj plakát. Text přepiš přesně, včetně uvozovek a pomlček. Odkaz u registrace vede na https://skola.example.com/seznamovak.

**Media:** `docPreview` (`full`) = řešení. Musí být nekopírovatelný.

**Řešení (html):**
```html
<p data-style="title" style="text-align:center">Seznamovací večer</p>
<p data-style="subtitle" style="text-align:center">„Prváci, vítejte!“</p>
<p style="text-align:center"><strong>pátek 23. října 2026, {{18.00–22.00|18:00–22:00}}</strong></p>
<p>Kde: aula gymnázia</p>
<p>Pro koho: 1.–4. ročník</p>
<p>Vstupné: 80 Kč</p>
<ul><li>hudba a tanec</li><li>kvíz o škole</li><li>občerstvení</li></ul>
<p>Registrace: <a href="https://skola.example.com/seznamovak">přihlas se online</a></p>
```

**Kontroly:** `docMatches` [text, style, align, list, bold, link]

---

### KOM-05 · Sportovní zpráva
- **Mechanika / Bloom:** lovec chyb / analyzovat
- **Potřebuje:** F01, F02, F03, F08, F11 (`requiredOnly`), F12 `docMatches`, F13, F15 (`autoErrors`)
- **Nastavení:**
  - `match.nbspMode: 'requiredOnly'`
  - `autoErrors: 'nbsp'`
  - `feedback.showCountUpfront: false`
  - `feedback.revealAfter: 3`

**Zadání:**
> Článek před vydáním ve školním časopise. Oprav typografii, nejen v číslech, ale i nezlomitelné mezery. Oprav i formátování:
> - titulek má být Název,
> - první odstavec (perex) celý kurzívou.

**Prefill (html):**
```html
<p><strong><span style="font-size:18pt">Florbalisté vybojovali 2.místo</span></strong></p>
<p>Náš tým uspěl na krajském turnaji v Blansku.Ve finále prohrál těsně 3 : 4.</p>
<p>Turnaje se zúčastnilo 12 týmů z celého kraje. Kapitán Ondra Malý, kterému je teprve 15-ti let, po zápase řekl: "Trenér nám před finále říkal, ať hrajeme 'v klidu'. Nepovedlo se." Doprovodný běh na 1km vyhrála Klára Nová časem 3:21.45.</p>
```

**Řešení (html):**
```html
<p data-style="title" data-accept="title,h1">Florbalisté vybojovali 2.~místo</p>
<p><em>Náš tým uspěl na krajském turnaji v~Blansku. Ve finále prohrál těsně 3:4.</em></p>
<p>Turnaje se zúčastnilo 12~týmů z~celého kraje. Kapitán Ondra Malý, kterému je teprve 15~let, po zápase řekl: „Trenér nám před finále říkal, ať hrajeme ‚v~klidu‘. Nepovedlo se.“ Doprovodný běh na 1~km vyhrála Klára Nová časem 3:21,45.</p>
```

**Kontroly:**
- `docMatches` [text, style, italic]
- `constraint noManualHeadingFormatting`

**Chyby (ruční):**
- `2.~místo` → cislovky
- `Blansku. Ve` → interpunkce
- `těsně 3:4` → matematika
- `15~let` → cislovky
- `řekl: „Trenér` → uvozovky
- `‚v~klidu‘` → uvozovky
- `se.“ Doprovodný` → uvozovky
- `1~km` → jednotky
- `3:21,45` → cas

**Chyby (automaticky):** `v~Blansku`, `12~týmů`, `z~celého`.

---

### KOM-06 · Inzerát na brigádu
- **Mechanika / Bloom:** lovec chyb / analyzovat
- **Potřebuje:** F01, F02, F03, F08, F10b (`mailto:`), F11 (`requiredOnly`, alternativy), F12 `docMatches`, F13, F15 (`autoErrors`)
- **Nastavení:**
  - `match.nbspMode: 'requiredOnly'`
  - `autoErrors: 'nbsp'`
  - `feedback.showCountUpfront: false`
  - `feedback.revealAfter: 3`

**Zadání:**
> Inzerát kavárny má chyby v typografii i ve formátování. Podmínky dej do odrážkového seznamu a e-mailovou adresu udělej odkazem (mailto).

**Prefill (html):**
```html
<p data-style="title">Hledáme brigádníka / brigádnici</p>
<p>Kavárna U Lípy s.r.o. hledá posilu na víkendy.</p>
<p>- mzda 150Kč/h</p>
<p>- směny pá-ne 7:00 - 12:00</p>
<p>- věk od 15-ti let</p>
<p>Životopis pošli na adresu prace@ulipy.example.com nebo volej na 777 123 456.</p>
<p>Nástup možný ihned.Těšíme se !</p>
```

**Řešení (html):**
```html
<p data-style="title">Hledáme brigádníka/brigádnici</p>
<p>Kavárna U~Lípy, s. r. o., hledá posilu na víkendy.</p>
<ul><li>mzda 150~Kč/h</li><li>směny pá–ne {{7:00–12:00|7.00–12.00}}</li><li>věk od 15~let</li></ul>
<p>Životopis pošli na adresu <a href="mailto:prace@ulipy.example.com">prace@ulipy.example.com</a> nebo volej na 777 123 456.</p>
<p>Nástup možný ihned. Těšíme se!</p>
```

**Kontroly:**
- `docMatches` [text, style, list, link]
- `constraint noManualListMarkers`
- `constraint noRawUrls`

**Chyby (ruční):**
- `brigádníka/brigádnici` → lomitko
- `Lípy, s. r. o.,` → firmy
- `150~Kč/h` → jednotky
- `pá–ne` → pomlcka
- `7:00–12:00` / `7.00–12.00` → cas
- `15~let` → cislovky
- `ihned. Těšíme` → interpunkce
- `se!` → interpunkce

**Chyby (automaticky):** `U~Lípy,`.

---

### KOM-07 · Přírodovědný referát
- **Mechanika / Bloom:** napodob + lovec chyb / analyzovat
- **Potřebuje:** F01, F02, F05 (`wireframe`), F08, F10a, F10b, F10c, F11 (`requiredOnly`, alternativy), F12 `docMatches`, F13, F15 (`autoErrors`)
- **Nastavení:**
  - `match.nbspMode: 'requiredOnly'`
  - `autoErrors: 'nbsp'`
  - `feedback.showCountUpfront: false`
  - `feedback.revealAfter: 3`

**Zadání:**
> Naformátuj referát podle náhledu struktury (Název, Nadpis 1, Nadpis 2, text do bloku, seznamy) a oprav typografii. Jednotky a vzorce zapiš s indexy. Adresu zdroje schovej do odkazu s textem „Wikipedie: Voda“.

**Media:** `docPreview` (`wireframe`) = řešení. Ukazuje strukturu, ne text.

**Prefill (text):**
```text
Voda na Zemi
Kolik vody máme
Voda pokrývá asi 71% povrchu Země. Celkový objem vody je přibližně 1386000000 km3, sladká voda z toho tvoří jen 2,5 %.
Vlastnosti vody
Molekula vody má vzorec H2O. Za normálního tlaku voda vře při 100°C a mrzne při 0 °C. Hustota vody je 1000 kg/m3.
Skupenství
- pevné - led
- kapalné - voda
- plynné - vodní pára
Zdroje
Wikipedie: Voda (https://cs.wikipedia.org/wiki/Voda)
```

**Řešení (html):**
```html
<p data-style="title">Voda na Zemi</p>
<h1>Kolik vody máme</h1>
<p style="text-align:justify">Voda pokrývá asi 71~% povrchu Země. Celkový objem vody je přibližně 1~386~000~000~km<sup>3</sup>, sladká voda z~toho tvoří jen 2,5~%.</p>
<h1>Vlastnosti vody</h1>
<p style="text-align:justify">Molekula vody má vzorec H<sub>2</sub>O. Za normálního tlaku voda vře při 100~°C a~mrzne při 0~°C. Hustota vody je {{1~000|1000}}~kg/m<sup>3</sup>.</p>
<h2>Skupenství</h2>
<ul><li>pevné – led</li><li>kapalné – voda</li><li>plynné – vodní pára</li></ul>
<h1>Zdroje</h1>
<ol><li><a href="https://cs.wikipedia.org/wiki/Voda">Wikipedie: Voda</a></li></ol>
```

**Kontroly:**
- `docMatches` [text, style, align, list, superscript, subscript, link]
- `constraint noManualListMarkers`
- `constraint noRawUrls`

**Chyby (ruční):**
- `71~%` → jednotky
- `1~386~000~000` → cisla
- `100~°C` → jednotky
- `1~000~kg` / `1000~kg` → jednotky
- `pevné – led` → pomlcka
- `kapalné – voda` → pomlcka
- `plynné – vodní` → pomlcka

**Chyby (automaticky):** `000~km3,`, `z~toho`, `a~mrzne`, `0~°C.`, `2,5~%.`

**Poznámka:** pro `at` se porovnává plain text, takže `km<sup>3</sup>` je `km3`.

---

### KOM-08 · Zápis ze studentské rady
- **Mechanika / Bloom:** lovec chyb / analyzovat
- **Potřebuje:** F01, F02, F03, F08, F10c, F11 (`requiredOnly`, alternativy), F12 `docMatches`, F13, F15 (`autoErrors`)
- **Nastavení:**
  - `match.nbspMode: 'requiredOnly'`
  - `autoErrors: 'nbsp'`
  - `feedback.showCountUpfront: false`
  - `feedback.revealAfter: 3`

**Zadání:**
> Zápis ze schůze má chyby v typografii (včetně nezlomitelných mezer) i ve formátování. Nadpisy oddílů mají být Nadpis 2, body jednání číslovaný seznam a úkoly odrážkový seznam.

**Prefill (html):**
```html
<p data-style="title">Zápis ze schůze studentské rady</p>
<p>Datum: 2.10.2026, 14:00-15:30, učebna č.204</p>
<p>Přítomni: PhDr. Jana Malá Ph.D. (koordinátorka), zástupci všech ročníků</p>
<p><strong>Projednáno</strong></p>
<p>1) Tzv. "ples nanečisto" proběhne v pátek 20.11. v tělocvičně.</p>
<p>2) Vstupné bude 100,- Kč, tj. stejně jako loni.</p>
<p>3) Výzdobu připraví 2. a 3.ročník do 15. 11.</p>
<p><strong>Úkoly</strong></p>
<p>- Tomáš - plakáty (termín: 9.11.)</p>
<p>- Lucie - rozpočet v Excelu/Tabulkách Google</p>
<p>Zapsala: Eva Králová, 1.ročník</p>
```

**Řešení (html):**
```html
<p data-style="title">Zápis ze schůze studentské rady</p>
<p>Datum: {{2.~10. 2026|02.10.2026|2026-10-02}}, {{14:00–15:30|14.00–15.30}}, učebna č. 204</p>
<p>Přítomni: PhDr.~Jana Malá, Ph.D. (koordinátorka), zástupci všech ročníků</p>
<h2>Projednáno</h2>
<ol><li>Takzvaný „ples nanečisto“ proběhne v~pátek 20.~11. v~tělocvičně.</li><li>Vstupné bude 100~Kč, tj.~stejně jako loni.</li><li>Výzdobu připraví 2. a~3.~ročník do 15.~11.</li></ol>
<h2>Úkoly</h2>
<ul><li>Tomáš – plakáty (termín: 9.~11.)</li><li>Lucie – rozpočet v~Excelu / Tabulkách Google</li></ul>
<p>Zapsala: Eva Králová, 1.~ročník</p>
```

**Kontroly:**
- `docMatches` [text, style, list]
- `constraint noManualListMarkers`
- `constraint noFakeHeadings`

**Chyby (ruční):**
- `2.~10. 2026` / `02.10.2026` / `2026-10-02` → datum
- `14:00–15:30` / `14.00–15.30` → cas
- `č. 204` → zkratky
- `Malá, Ph.D.` → tituly
- `Takzvaný` → zkratky
- `„ples nanečisto“` → uvozovky
- `20.~11.` → datum
- `100~Kč,` → mena
- `3.~ročník` → cislovky
- `Tomáš – plakáty` → pomlcka
- `9.~11.` → datum
- `Lucie – rozpočet` → pomlcka
- `Excelu / Tabulkách` → lomitko
- `1.~ročník` → cislovky

**Chyby (automaticky):** `PhDr.~Jana`, `v~pátek`, `v~tělocvičně.`, `tj.~stejně`, `a~3.`, `15.~11.`, `v~Excelu`.

---

### KOM-09 · Dva plakáty
- **Mechanika / Bloom:** posuď / hodnotit
- **Potřebuje:** F01, F02, F03, F12 `docMatches` (`trailingFreeText`), F15, F17 (`auto+manual`)
- **Nastavení:** `review: 'auto+manual'` · `feedback.showCountUpfront: false`

**Zadání:**
> Dva spolužáci udělali plakát na stejnou akci.
> 1. Smaž horší verzi i oba popisky „Verze A“ a „Verze B“.
> 2. V lepší verzi oprav zbylé chyby.
> 3. Pod plakát napiš aspoň dvě věty, proč je lepší.

**Prefill (html):**
```html
<h3>Verze A</h3>
<p data-style="title">Školní blešák</p>
<p><strong>čtvrtek 5. listopadu 2026, 15.00 - 18.00, atrium školy</strong></p>
<p>Přines oblečení, knihy nebo hry, které už nepotřebuješ. Výtěžek poputuje do útulku "Pes v nouzi".</p>
<ul><li>stůl za 20 Kč</li><li>vstup zdarma</li></ul>
<h3>Verze B</h3>
<p style="text-align:center"><span style="font-family:'Lora';font-size:28pt"><strong><u>ŠKOLNÍ BLEŠÁK</u></strong></span></p>
<p style="text-align:center"><span style="font-family:'Roboto'">čtvrtek 5.11.2026, 15.00-18.00, atrium školy</span></p>
<p style="text-align:center"><span style="font-family:'Open Sans'"><u>Přines oblečení, knihy nebo hry , které už nepotřebuješ.</u> Výtěžek dáme útulku „Pes v nouzi“.</span></p>
<p style="text-align:center">- stůl za 20,- Kč</p>
<p style="text-align:center">- vstup zdarma</p>
```

**Řešení (html):**
```html
<p data-style="title">Školní blešák</p>
<p><strong>čtvrtek 5. listopadu 2026, 15.00–18.00, atrium školy</strong></p>
<p>Přines oblečení, knihy nebo hry, které už nepotřebuješ. Výtěžek poputuje do útulku „Pes v nouzi“.</p>
<ul><li>stůl za 20 Kč</li><li>vstup zdarma</li></ul>
<!-- pro self-test přidej odstavec se zdůvodněním, např.: -->
<p>Verze A je lepší, protože má nadpis jako Název a podmínky v seznamu. Verze B míchá několik písem, všechno je na střed a podtržené.</p>
```

**Kontroly:** `docMatches` [text, style, list, bold] s `trailingFreeText` { `minWords: 12` }

**Chyby:**
- `15.00–18.00` → cas
- `do útulku „Pes` → uvozovky

---

### KOM-10 · Vlastní pozvánka
- **Mechanika / Bloom:** vytvoř / tvořit
- **Potřebuje:** F01, F02, F12 (`require`, `minWords`, `constraint`, `lint`), F13, F14, F15
- **Nastavení:** prefill prázdný · `review: 'auto'`

**Zadání:**
> Vymysli akci (turnaj, výstavu, koncert…) a napiš na ni pozvánku. Musí obsahovat:
> - Název,
> - datum v souvislém textu,
> - časové rozmezí,
> - cenu v Kč,
> - přímou řeč v českých uvozovkách,
> - odkaz na přihlášku,
> - aspoň jeden seznam.
>
> Text musí projít typografickou kontrolou včetně nezlomitelných mezer.

**Kontroly:**
- `constraint requireStyle` { `style: 'title'`, `min: 1`, `max: 1` }
- `require` datum (stejný regex jako TYP-21)
- `require` časové rozmezí (stejný regex jako TYP-21)
- `require` `\d[ \u00A0]Kč` – label „cena v Kč“
- `require` `„[^„“]+“` – label „přímá řeč v českých uvozovkách“
- `constraint linkExists` {}
- `constraint requireList` { `min: 1` }
- `constraint noFakeHeadings`
- `constraint maxFonts` { `max: 2` }
- `constraint underlineOnlyLinks`
- `lint` s `maxErrors: 0` a `treatAsErrors: ['nbsp-jednopismenne', 'nbsp-jednotka']`
- `minWords` 40

**Řešení (html):** pro self-test
```html
<p data-style="title">Turnaj ve stolním tenise</p>
<p>Zveme všechny na turnaj, který proběhne ve středu 18.~listopadu 2026 v~čase 14.00–17.00 v~tělocvičně. Startovné je 30~Kč a~zahrnuje i~čaj. Pan učitel Novák slibuje: „Vítěz dostane pohár i~diplom.“ Přihlásit se můžeš do pátku 13.~listopadu.</p>
<h2>S~sebou</h2>
<ul><li>pálku (nebo si ji půjč)</li><li>sálovou obuv</li><li>pití</li></ul>
<p>Přihláška: <a href="https://skola.example.com/turnaj">formulář na webu školy</a></p>
```

---

### KOM-11 · Článek do školního časopisu
- **Mechanika / Bloom:** vytvoř / tvořit
- **Potřebuje:** F01, F02, F12 (`minWords`, `constraint`, `lint`), F13, F14, F17 (`manual`), F18
- **Nastavení:** prefill prázdný · `review: 'manual'`

**Zadání:**
> Napiš článek do školního časopisu na vlastní téma (aspoň 150 slov) s Názvem a aspoň dvěma nadpisy. Až projde kontrolou, zkopíruj ho tlačítkem do Google Docs a dej spolužákovi k revizi v režimu návrhů.

**Kontroly:**
- `minWords` 150
- `constraint requireStyle` { `style: 'title'`, `min: 1`, `max: 1` }
- `constraint requireHeadings` { `min: 2` }
- `constraint noFakeHeadings`
- `constraint maxFonts` { `max: 2` }
- `lint` s `maxErrors: 0` (výchozí závažnosti)

**selfChecklist:**
- Má článek jasnou strukturu?
- Zkontroloval(a) jsem uvozovky, pomlčky, čísla a zkratky?
- Je tučné písmo jen u toho nejdůležitějšího?

---

### KOM-12 · Terénní úkol
- **Mechanika / Bloom:** posuď / hodnotit
- **Potřebuje:** F01, F12 (`sections`, `custom`, `lint`), F14, F17 (`manual`, příloha obrázku)
- **Nastavení:** `review: 'manual'`

**Zadání:**
> Najdi v reálném světě text s typografickými chybami (jídelní lístek, plakát, cedule, web obce…). Volitelně ho vyfoť a přilož. Vyplň všechny čtyři části.

**Prefill (text):**
```text
Kde jsem text našel:
Původní text:
Opravený text:
Co bylo špatně:
```

**Kontroly:**
- `sections` [`Kde jsem text našel`, `Původní text`, `Opravený text`, `Co bylo špatně`]
- `custom: 'sectionsDiffer'` { `a: 'Původní text'`, `b: 'Opravený text'` }
- `lint` s `maxErrors: 0` a `section: 'Opravený text'`

---

## 8. Otázky k vyjasnění (odpověz v kroku 1, před implementací)

1. Jaký editor aplikace používá (knihovna a verze)? Podporuje IME/composition a dekorace (kvůli F07 a F08)?
2. Má aplikace backend a role student/učitel? Kam ukládat odevzdání a pokusy (F15, F17)? Pokud nic z toho neexistuje, navrhni nejjednodušší řešení a zeptej se.
3. Jak se identifikuje student (přihlášení, jméno, nic)?
4. Smí aplikace načítat Google Fonts, nebo musí být písma lokálně (školní síť)?
5. Jaké úlohy už v aplikaci jsou a jak je zařadit do nového pořadí?
6. Na čem studenti pracují (Chromebooky, Windows, Mac)? Podle toho se doladí `charHints` a výchozí stav `specialCharsPanel`, protože Ctrl+Shift+U funguje jen na ChromeOS a Linuxu.

### Hotovo znamená
- Všech 52 úloh je v aplikaci a ve správném pořadí.
- Self-test (F19) prochází.
- Unit testy F07, F11, F12, F13 a F14 procházejí.
- Žádná úloha nezávisí na funkci, která chybí.
