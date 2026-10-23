# Migrace z původní stránky

Původní stránka: `reference/original-index.html` (jeden soubor, ~150 kB). Pomocné výtažky:

- `reference/original-styles.css` – celé CSS.
- `reference/original-visuals.js` – renderery vizualizací (`COL`, `VIS`, `drawVisual`).
- `reference/legacy-tasks-decrypted.json` – původních 63 úloh včetně dešifrovaných řešení (pole `sol`). Slouží jen ke kontrole migrace.

## Obsah je už převedený

Všech 63 úloh je převedeno do `content/sections/` ve formátu podle `CONTENT_SCHEMA.md`. **Nepřeváděj je znovu.** Úkol pro implementaci je jen ověřit:

- `npm run check` projde bez chyb;
- test `tests/migration.test.mjs` porovná `content/` s `reference/legacy-tasks-decrypted.json`: počet úloh, pořadí, `title`, `level`, `question`, `hint`, možnosti, správné odpovědi, `steps`, `why`, `traps` a vizualizace sedí 1:1 (rozdíly jsou povolené jen v `mistake` u úloh uvedených níže a v rozdělení `text` na bloky – po vykreslení musí dát stejné HTML);
- vizuálně porovnat vybrané úlohy s originálem (aspoň jednu od každého typu vizualizace).

### Co se při převodu změnilo

1. `text` (HTML řetězec) → pole bloků: `<p>` → řetězec, `<ul>/<ol>` → `{ "list" }`, `<div class="code">` → `{ "code" }`.
2. `visual: ["cards", [...]]` → `{ "type": "cards", "data": [...] }`.
3. `type` + `options` + `sol.a` → `answer: { type, options, correct }`.
4. `sol.steps / mistake / why / traps` → `solution`.
5. `topic` a staré `id` zmizely, identita je `složka/soubor` (slugy z názvů bez diakritiky).
6. Texty `mistake`, které zmiňovaly „ve třídě“ a „děti“, jsou přepsané neutrálně (úlohy `r4`, `c3`, `d3`, `d6`, `s3`, `l4`, `p3`, `p5`, `f4`, `k7`). Věcný obsah zůstal.

## Co z kódu převzít

| Originál | Kam | Poznámka |
|---|---|---|
| CSS | `src/css/styles.css` | úklid podle `DESIGN.md` |
| `VIS`, `COL`, `drawVisual` | `src/js/visuals/*` | 1:1, jen moduly |
| `starRow`, `diffChip`, `ladder`, `esc` | `components/`, `dom.js` | |
| `renderHome`, `renderTopic`, `renderTask`, `explainHtml`, `badgesHtml`, `newBadgeHtml` | `views/` | bez jména, bez tlačítka odeslání, s odkazy místo tlačítek |
| `check`, `isCorrect`, `norm`, `normVal`, `answerText`, výpočet hvězd | `answers.js`, `views/task.js` | |
| `stats`, `BADGES` | `stats.js` + `content/badges.json` | odznaky jsou nově deklarativní |
| `confetti` | `confetti.js` | |
| logika `tstate` / ukládání | `progress.js` | bez profilů, nový klíč a struktura (`SPEC.md` §4) |

## Co zahodit

Jméno a vše kolem (`store.name`, profily, `nameKey`, `otherNames`, shake na inputu jména), měření času (`flushTime`, `startTiming`, `LESSON_MS`, `starts`, `visibilitychange`), seznam špatných odpovědí (`wrong`), odesílání (`RESULTS_URL`, `buildResults`, `topicDetail`, `warnings`, `FAST_SEC`, modal, `sendResults`), komentář o `src/index.src.html`.

Starý postup v `localStorage` (`bobri-trenink-v1`) se nemigruje – jiná doména/struktura, nový web začíná načisto.

## Mapa úloh

| Staré id | Sekce | Soubor | URL |
|---|---|---|---|
| r1 | razeni | `01-razeni/01-kdo-je-nejmensi.json` | `?section=razeni&question=kdo-je-nejmensi` |
| r2 | razeni | `01-razeni/02-jeden-pruchod.json` | `?section=razeni&question=jeden-pruchod` |
| r3 | razeni | `01-razeni/03-vyber-nejmensi-karty.json` | `?section=razeni&question=vyber-nejmensi-karty` |
| r4 | razeni | `01-razeni/04-dve-kola.json` | `?section=razeni&question=dve-kola` |
| r5 | razeni | `01-razeni/05-vymeny-sousedu.json` | `?section=razeni&question=vymeny-sousedu` |
| r6 | razeni | `01-razeni/06-kolik-pruchodu.json` | `?section=razeni&question=kolik-pruchodu` |
| r7 | razeni | `01-razeni/07-velke-razeni.json` | `?section=razeni&question=velke-razeni` |
| c1 | cykly | `02-cykly/01-tleskaci-program.json` | `?section=cykly&question=tleskaci-program` |
| c2 | cykly | `02-cykly/02-pridavani-klad.json` | `?section=cykly&question=pridavani-klad` |
| c3 | cykly | `02-cykly/03-zdvojovani.json` | `?section=cykly&question=zdvojovani` |
| c4 | cykly | `02-cykly/04-cyklus-v-cyklu.json` | `?section=cykly&question=cyklus-v-cyklu` |
| c5 | cykly | `02-cykly/05-krabicky-a-a-b.json` | `?section=cykly&question=krabicky-a-a-b` |
| c6 | cykly | `02-cykly/06-robot-ve-smycce.json` | `?section=cykly&question=robot-ve-smycce` |
| c7 | cykly | `02-cykly/07-navod-sam-na-sebe.json` | `?section=cykly&question=navod-sam-na-sebe` |
| d1 | dvojkova | `03-dvojkova/01-hodnoty-lamp.json` | `?section=dvojkova&question=hodnoty-lamp` |
| d2 | dvojkova | `03-dvojkova/02-dve-rozsvicene.json` | `?section=dvojkova&question=dve-rozsvicene` |
| d3 | dvojkova | `03-dvojkova/03-signalni-lampy.json` | `?section=dvojkova&question=signalni-lampy` |
| d4 | dvojkova | `03-dvojkova/04-zjisti-hodnoty-sam.json` | `?section=dvojkova&question=zjisti-hodnoty-sam` |
| d5 | dvojkova | `03-dvojkova/05-zapis-jedenactku.json` | `?section=dvojkova&question=zapis-jedenactku` |
| d6 | dvojkova | `03-dvojkova/06-pet-lamp.json` | `?section=dvojkova&question=pet-lamp` |
| d7 | dvojkova | `03-dvojkova/07-nejvetsi-cislo.json` | `?section=dvojkova&question=nejvetsi-cislo` |
| d8 | dvojkova | `03-dvojkova/08-kolik-cisel.json` | `?section=dvojkova&question=kolik-cisel` |
| s1 | sifry | `04-sifry/01-posun-o-jedno.json` | `?section=sifry&question=posun-o-jedno` |
| s2 | sifry | `04-sifry/02-zasifruj-sam.json` | `?section=sifry&question=zasifruj-sam` |
| s3 | sifry | `04-sifry/03-posun-o-tri.json` | `?section=sifry&question=posun-o-tri` |
| s4 | sifry | `04-sifry/04-pres-konec-abecedy.json` | `?section=sifry&question=pres-konec-abecedy` |
| s5 | sifry | `04-sifry/05-najdi-klic.json` | `?section=sifry&question=najdi-klic` |
| s6 | sifry | `04-sifry/06-sifra-ktera-roste.json` | `?section=sifry&question=sifra-ktera-roste` |
| s7 | sifry | `04-sifry/07-zrcadlova-abeceda.json` | `?section=sifry&question=zrcadlova-abeceda` |
| h1 | hromady | `05-hromady/01-hromada-taliru.json` | `?section=hromady&question=hromada-taliru` |
| h2 | hromady | `05-hromady/02-fronta-k-vode.json` | `?section=hromady&question=fronta-k-vode` |
| h3 | hromady | `05-hromady/03-hromada-klad.json` | `?section=hromady&question=hromada-klad` |
| h4 | hromady | `05-hromady/04-fronta-nebo-hromada.json` | `?section=hromady&question=fronta-nebo-hromada` |
| h5 | hromady | `05-hromady/05-ktere-poradi-nejde.json` | `?section=hromady&question=ktere-poradi-nejde` |
| h6 | hromady | `05-hromady/06-zpet-v-prohlizeci.json` | `?section=hromady&question=zpet-v-prohlizeci` |
| h7 | hromady | `05-hromady/07-mala-hromada.json` | `?section=hromady&question=mala-hromada` |
| l1 | logika | `06-logika/01-koralky.json` | `?section=logika&question=koralky` |
| l2 | logika | `06-logika/02-na-lavicce.json` | `?section=logika&question=na-lavicce` |
| l3 | logika | `06-logika/03-co-prijde-dal.json` | `?section=logika&question=co-prijde-dal` |
| l4 | logika | `06-logika/04-kdo-snedl-mrkev.json` | `?section=logika&question=kdo-snedl-mrkev` |
| l5 | logika | `06-logika/05-kdo-mluvi-pravdu.json` | `?section=logika&question=kdo-mluvi-pravdu` |
| l6 | logika | `06-logika/06-tri-hraze.json` | `?section=logika&question=tri-hraze` |
| p1 | cesty | `07-cesty/01-kudy-k-hrazi.json` | `?section=cesty&question=kudy-k-hrazi` |
| p2 | cesty | `07-cesty/02-zprava-po-retezu.json` | `?section=cesty&question=zprava-po-retezu` |
| p3 | cesty | `07-cesty/03-zradna-oklika.json` | `?section=cesty&question=zradna-oklika` |
| p4 | cesty | `07-cesty/04-kdo-ma-zacit.json` | `?section=cesty&question=kdo-ma-zacit` |
| p5 | cesty | `07-cesty/05-propoj-rybniky.json` | `?section=cesty&question=propoj-rybniky` |
| p6 | cesty | `07-cesty/06-kolik-je-cest.json` | `?section=cesty&question=kolik-je-cest` |
| p7 | cesty | `07-cesty/07-cesta-pres-bazinu.json` | `?section=cesty&question=cesta-pres-bazinu` |
| f1 | hledani | `08-hledani/01-hadej-od-1-do-8.json` | `?section=hledani&question=hadej-od-1-do-8` |
| f2 | hledani | `08-hledani/02-na-co-se-zeptat.json` | `?section=hledani&question=na-co-se-zeptat` |
| f3 | hledani | `08-hledani/03-od-1-do-100.json` | `?section=hledani&question=od-1-do-100` |
| f4 | hledani | `08-hledani/04-od-1-do-1000.json` | `?section=hledani&question=od-1-do-1000` |
| f5 | hledani | `08-hledani/05-serazeny-seznam.json` | `?section=hledani&question=serazeny-seznam` |
| f6 | hledani | `08-hledani/06-tezsi-klada-z-deviti.json` | `?section=hledani&question=tezsi-klada-z-deviti` |
| f7 | hledani | `08-hledani/07-tezsi-klada-z-27.json` | `?section=hledani&question=tezsi-klada-z-27` |
| k1 | pocitac | `09-pocitac/01-vystupni-zarizeni.json` | `?section=pocitac&question=vystupni-zarizeni` |
| k2 | pocitac | `09-pocitac/02-co-je-v-souboru.json` | `?section=pocitac&question=co-je-v-souboru` |
| k3 | pocitac | `09-pocitac/03-vstupni-zarizeni.json` | `?section=pocitac&question=vstupni-zarizeni` |
| k4 | pocitac | `09-pocitac/04-kopirovat-a-vlozit.json` | `?section=pocitac&question=kopirovat-a-vlozit` |
| k5 | pocitac | `09-pocitac/05-vyjmout-a-vlozit.json` | `?section=pocitac&question=vyjmout-a-vlozit` |
| k6 | pocitac | `09-pocitac/06-zpet-a-znovu.json` | `?section=pocitac&question=zpet-a-znovu` |
| k7 | pocitac | `09-pocitac/07-zpet-po-novem-psani.json` | `?section=pocitac&question=zpet-po-novem-psani` |
