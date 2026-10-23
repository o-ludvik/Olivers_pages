# Bobří trénink – instrukce pro Claude Code

Statický web s tréninkovými úlohami ve stylu soutěže Bobřík informatiky. Běží na GitHub Pages, nemá žádný backend ani napojení na externí služby. Postup žáka se ukládá jen do `localStorage`.

## Než začneš

Přečti v tomto pořadí:

1. `docs/SPEC.md` – co se staví, stránky, URL, chování, akceptační kritéria.
2. `docs/CONTENT_SCHEMA.md` – formát sekcí, úloh, vizualizací a odznaků.
3. `docs/ARCHITECTURE.md` – struktura repozitáře, build, nasazení.
4. `docs/DESIGN.md` – vzhled (převzatý z `reference/original-index.html`).
5. `docs/MIGRATION.md` – co se z původní stránky přebírá a co zahodit.

Obsah (`content/`) je **už převedený** ze staré stránky (63 úloh v 9 sekcích). Neměň ho, pokud to úloha výslovně nežádá.

## Práce s obsahem

Pro úlohy a sekce vždy platí `docs/PRAVIDLA_ULOH.md`. Skilly:

- `nova-uloha` – přidání úlohy (včetně povinného nezávislého ověření správnosti),
- `nova-sekce` – nové téma,
- `nova-vizualizace` – nový typ obrázku,
- `revize-uloh` – kontrola existujících úloh.

Slug úlohy/sekce (název bez číselného prefixu) je identita pro URL i uložený postup – **nikdy ho neměň**, pořadí se mění jen prefixem.

## Tvrdá pravidla

- **Žádné externí napojení.** Žádný `fetch` mimo vlastní soubory webu, žádná analytika, žádné jméno uživatele, žádné odesílání výsledků, žádné měření času.
- **Navigace jen přes query parametry**: `?section=<slug>&question=<slug>`. Žádné cesty typu `/razeni/`, žádný hash routing. Web musí fungovat v podadresáři (`https://uzivatel.github.io/repo/`), proto **všechny odkazy a cesty relativní** (`./`, `?section=…`, `assets/…`), nikdy s úvodním `/`.
- **Bez frameworku a bez npm závislostí.** Prohlížeč: čisté HTML, CSS, ES moduly. Build a nástroje: Node.js ≥ 20.11, jen vestavěné moduly (`node:fs`, `node:path`, `node:http`, `node:test`…). `package.json` nemá `dependencies` ani `devDependencies`.
- **Nikde žádné zmínky o věku, třídách, ročnících, „dětech ve třídě“ ani o konkrétních lidech.** Platí pro UI texty i obsah.
- **Obsah je data, ne kód.** Přidání úlohy nebo sekce = přidání JSON souboru / složky. Nic dalšího se nesmí muset upravovat ručně (žádné seznamy, importy, manifesty).
- Uživatelské texty v UI jsou česky. Identifikátory v kódu, názvy souborů a JSON klíče anglicky (kromě slugů obsahu, ty jsou česky bez diakritiky).
- Česká typografie v UI textech: „uvozovky“, nedělitelná mezera tam, kde dává smysl, `→` a `←` v tlačítkách jako v originálu.

## Příkazy (po implementaci)

```
npm run dev        # build + sledování změn + server na http://localhost:8080
npm run build      # vyrobí dist/
npm run check      # validace obsahu (bez buildu)
npm test           # node:test – logika a validace
npm run new -- <sekce> "Název úlohy"   # založí kostru nové úlohy
```

## Postup práce

- Implementuj po krocích z `docs/ARCHITECTURE.md` (sekce „Pořadí implementace“). Po každém kroku spusť `npm test` a `npm run build`.
- Vizualizace portuj z `reference/original-visuals.js` 1:1 (stejný vzhled SVG), jen je rozděl do modulů.
- CSS portuj z `reference/original-styles.css`, odstraň mrtvé části vyjmenované v `docs/DESIGN.md`.
- Před dokončením projdi akceptační kritéria v `docs/SPEC.md` a odškrtej je.
- `reference/` je jen pro čtení a do `dist/` se nekopíruje.
- `dist/` se **commituje** (web se nasazuje přímo z větve repozitáře `Olivers_pages`, viz README). Po každé změně v `content/` nebo `src/` spusť `npm run build` a commitni i `dist/`, jinak CI neprojde.
