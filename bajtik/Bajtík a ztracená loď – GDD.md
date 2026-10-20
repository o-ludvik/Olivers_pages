# Bajtík a ztracená loď – Game Design Document

Oct 20, 2026 · @Oliver

## 1. Přehled hry

Klikačka (point-and-click) pro samostatnou práci v 1. ročníku SŠ na 35–45 minut. Žák je opravář ztroskotané vesmírné lodi a s robotem Bajtíkem postupně zprovozní její systémy, aby mohl vyslat SOS. Ve hře není postava žáka: scény jsou místnosti s ovládacími prvky a Bajtíkem.

**Cílová skupina:** 1. ročník SŠ, žádné předchozí znalosti soustav. Každý žák hraje sám na svém počítači, učitel do hry nezasahuje.

**Výukové cíle – žák po hře umí:**

- vysvětlit, co je základ soustavy a poziční zápis čísla,
- přečíst pětibitové binární číslo (0–31) a zapsat číslo 0–31 binárně pomocí hodnot pozic 16, 8, 4, 2, 1,
- uvést, k čemu se dnes používají soustavy 2, 8, 10, 12, 16, 20 a 60,
- rozlišit bit a bajt a jejich značky b a B,
- převádět B, kB, MB, GB a TB po 1000 a vědět, že se někde počítá po 1024,
- sečíst a odečíst malá binární čísla pod sebou.

**Mimo rozsah:** algoritmické převody mezi soustavami (dělení dvěma) a převody mezi dvojkovou a šestnáctkovou soustavou.

**Herní smyčka:** vstup do místnosti → Bajtík vysvětlí úkol → žák ovládá prvky (chyby nic nestojí) → splněná podmínka odemkne dveře → přechod do další místnosti.

**Pořadí scén:**

1. Technická místnost (tutoriál ovládání)
2. Rozvodna (binárka)
3. Archiv (soustavy a jejich použití)
4. Navigace (bity, bajty, jednotky)
5. Rozcestí → Kajuta (minitest a SOS) nebo Cvičiště (procvičování); žák se mezi nimi může libovolně vracet
6. Vítězná obrazovka s diplomem

Textace všech hlášek je v dokumentu **Bajtík – Textace**, obsah Bajtíkovy učebnice v dokumentu **Bajtík – Učebnice**. Tento dokument popisuje chování a vzhled; texty z něj nepoužívej, ber je z Textace.

## 2. Technické zadání

Hra je jeden soubor `index.html` s vloženým CSS, JavaScriptem a SVG grafikou, bez externích knihoven, obrázků a fontů. Musí fungovat offline, otevřená z disku (`file://`) i z GitHub Pages.

| Oblast | Požadavek |
| --- | --- |
| Scéna | SVG s logickým rozměrem 1600 × 900 (16 : 9), škáluje se na okno se zachováním poměru, okraje černé |
| Cílová zařízení | Chrome na Chromebooku (1366 × 768) a PC (1920 × 1080); ovládání myší i dotykem |
| Kód | Vanilla JS, žádný build; místnosti jako moduly s funkcemi `enter`, `exit`, `render`; jeden objekt stavu hry |
| Texty | Všechny texty v objektu `TEXTS` převzatém z dokumentu Textace, učebnice v objektu `TEXTBOOK`; v kódu žádné natvrdo psané hlášky |
| Typografie | České zásady: nezlomitelná mezera po jednopísmenných předložkách a spojkách (k, s, v, z, o, u, a, i), tisíce oddělené mezerou (4 000 MB), desetinná čárka (2,5 MB) |
| Písmo | Texty: `system-ui, "Segoe UI", Roboto, sans-serif`. Displeje: sedmisegmentové číslice kreslené jako SVG cesty |
| Ukládání | `localStorage`, klíč `bajtik-save-v1`, každé čtení a zápis v `try/catch`. Při startu s uloženým postupem nabídnout „Pokračovat“ a „Začít znovu“ |
| Zvuk | Ve verzi 1 žádný (30 počítačů ve třídě) |
| Ladění | `?room=N` skočí do místnosti N se splněnými předchozími, `?debug=1` vypíše řešení do konzole |

**Vstup čísel:** všechna pole přijímají desetinnou čárku i tečku a ignorují mezery (`4 000`, `4000`, `2,5`, `2.5`). Na Chromebooku se zobrazí klávesnice ve hře (číslice, čárka, smazat, potvrdit), aby nebylo nutné hledat pole.

**Milníky pro agenta** (po každém milníku kontrola učitelem, teprve pak další):

1. Engine: škálování scény, klikací kruhy, přechody, Bajtík s bublinou a menu, učebnice, ukládání + Místnost 1
2. Rozvodna
3. Archiv
4. Navigace
5. Rozcestí, Kajuta a minitest
6. Cvičiště (čtyři trenažéry)
7. Vítězná obrazovka, diplom a ladění textů

## 3. Globální systémy

Pět systémů je společných všem místnostem: klikací kruhy, přechody, Bajtík, učebnice a stav hry. Žádný z nich netrestá chyby a nic nepočítá body.

### 3.1 Klikací kruhy

Vše, co jde ovládat, má u sebe nevyplněný kruh; nic jiného nesmí vypadat klikatelně.

- Kruh: průměr 56 px (logických), tah 4 px, barva interakce (žlutá, viz kap. 5), jemně pulzuje (měřítko 1 → 1,15 → 1, perioda 1,6 s).
- Klikací plocha = kruh i samotný prvek (páčka, dveře, kniha), nejméně 64 × 64 px. Při najetí se kruh vyplní na 30 % a kurzor je ruka.
- Prvek, který je hotový nebo už nejde použít, kruh ztratí (zmizí za 300 ms).
- Zamčené dveře mají kruh šedý a přerušovaný. Klik na ně → Bajtík řekne, proč jsou zamčené. Po odemčení kruh zežloutne.

### 3.2 Přechody mezi místnostmi

Klik na odemčené dveře → stmívání do černé 400 ms → výměna scény → rozsvícení 400 ms. Během přechodu je vstup blokovaný. Bajtík v nové místnosti už stojí na svém místě a při první návštěvě hned řekne úvodní hlášku místnosti, při opakované návštěvě krátkou.

### 3.3 Bajtík

Bajtík je ve všech místnostech v dolní části scény (pozice dle místnosti v kap. 4) a mírně se vznáší (pohyb 4 px nahoru a dolů, perioda 2 s).

- **Řečová bublina:** komiksová, nad Bajtíkem, nejvýše 2 věty na jednu stránku. Má-li hláška víc stránek, je v bublině tlačítko „Dál ›“. Text se vypisuje rychlostí 40 znaků/s, kliknutí do bubliny vypíše vše najednou.
- **Trvalá bublina:** jen v Rozvodně; samostatný panel se seznamem čísel, který nezmizí a nepřekrývá se s řečovou bublinou.
- **Výrazy:** neutrální, radost, přemýšlí, varování, vylekaný. Každá hláška v Textaci má výraz uvedený.
- **Menu:** klik na Bajtíka otevře tři tlačítka: „Co mám dělat?“ (zopakuje zadání aktuálního úkolu), „Nápověda“ (další stupeň nápovědy, viz 3.4), „Učebnice“ (otevře učebnici).

### 3.4 Nápověda

Každý úkol má tři stupně nápovědy: 1. připomenutí principu, 2. konkrétní postup, 3. téměř řešení. Každé kliknutí na „Nápověda“ ukáže další stupeň; třetí se pak opakuje. Po dvou chybných pokusech v jednom úkolu Bajtík sám nabídne nápovědu hláškou z Textace. Nové zadání (další číslo, další panel) vrací nápovědu na stupeň 1.

### 3.5 Učebnice

Překryv přes 90 % scény: vlevo obsah kapitol, vpravo text kapitoly s posuvníkem. Otevře se vždy na kapitole patřící k aktuální místnosti (mapování v kap. 4), ostatní kapitoly jsou dostupné hned od začátku. Zavírá se křížkem, klávesou Esc nebo klikem mimo. Kromě Bajtíkova menu ji otevírá i ikona knihy vpravo nahoře.

### 3.6 Zpětná vazba

- Správně: prvek krátce zeleně zazáří + Bajtík s výrazem „radost“.
- Špatně: prvek se 200 ms zatřese a červeně blikne + Bajtík řekne, co nesedí. Nic se nezamyká a nic se nepočítá.

### 3.7 Horní lišta

Vlevo nahoře název místnosti, uprostřed ukazatel „Systémy lodi: X / 4“ (zelené kontrolky za Rozvodnu, Archiv, Navigaci a vyslané SOS), vpravo nahoře ikona učebnice.

### 3.8 Stav hry

```
{
  room: 1,               // aktuální scéna
  visited: [1],          // pro úvodní vs. krátkou hlášku
  r2: { solved: 0 },     // 0–6 zadaných čísel v Rozvodně
  r3: { locked: [] },    // potvrzené správné dvojice v Archivu
  r4: { a: false, b: 0, c: false }, // panely Navigace (b = počet splněných podúkolů 0–3)
  testPassed: false,
  playerName: ""
}
```

Stav se ukládá po každé změně. Rozdělané pokusy (poloha páček, nespojené karty) se neukládají.

## 4. Místnosti

Každá místnost je čelní pohled na jednu stěnu lodi s pruhem podlahy dole. Souřadnice jsou orientační v logickém rozměru 1600 × 900; ID hlášek (např. `R2_INTRO`) odkazují do Textace.

### 4.1 Technická místnost (tutoriál)

**Účel:** naučit ovládání (kruhy, Bajtík, dveře) a ukázat, že jedno číslo jde zapsat třemi způsoby. **Učebnice:** kap. 1.

**Rozvržení:** dveře vlevo (x 80–300), uprostřed stěna se třemi počítadly pod sebou s popisky „DESÍTKOVÁ (10)“, „DVOJKOVÁ (2)“, „ŠESTNÁCTKOVÁ (16)“, Bajtík vpravo dole (x ≈ 1350).

**Počítadla:** všechna ukazují stejnou hodnotu n, která roste o 1 každých 1,5 s od 0. Desítkové má 3 kolečka (000–255), dvojkové 8 koleček (00000000–11111111), šestnáctkové 2 kolečka (00–FF). Každá číslice je kolečko, které se při změně protočí (200 ms), takže je vidět přenos do vyššího řádu. Po 255 se všechna tři zároveň přetočí na nulu. Počítadla nejsou klikací.

**Průběh:**

1. Start: černá obrazovka, světla nabíhají (bliknutí 3×, 1,5 s), Bajtík „se probudí“.
2. `R1_INTRO` (3 stránky): kdo je Bajtík, loď ztroskotala, cíl je vyslat SOS.
3. Na Bajtíkovi se objeví kruh + `R1_CLICK_ME`. Dveře mají šedý kruh.
4. Klik na Bajtíka otevře menu a zazní `R1_MENU`. Kruh se přesune ke dveřím (zežloutnou).
5. Klik na dveře → Rozvodna.

### 4.2 Rozvodna (dvojková soustava)

**Účel:** pochopit hodnoty pozic 16, 8, 4, 2, 1 a skládat z nich čísla 0–31. **Učebnice:** kap. 2.

**Rozvržení:**

- Uprostřed 5 velkých pák vedle sebe (rozestup ≈ 170 px). Nad každou je natištěno **1**, pod ní **0**. Páka je buď nahoře (1), nebo dole (0); výchozí dole.
- Nad každou pákou sedmisegmentový displej s hodnotou páky: zleva 16, 8, 4, 2, 1 když je nahoře, jinak 0. Mezi displeji znaménko „+“, za posledním „=“ a displej součtu (2 číslice).
- Pod pákami velké tlačítko „ODESLAT ENERGII“.
- Vpravo dveře se 6 čtverečky v řadě (červené, po splnění zelené, popořadě zleva).
- Bajtík vlevo dole, nad ním trvalá bublina: „Reaktor potřebuje:“ a čísla **5 · 12 · 19 · 10 · 26 · 31**. Aktuální číslo je zvýrazněné rámečkem, splněná jsou zelená a přeškrtnutá.

**Ovládání:** klik na páku ji přepne (animace 150 ms) a hned aktualizuje její displej i součet. Klik na „ODESLAT ENERGII“:

- součet = cíl → další čtvereček zezelená, `R2_OK`, všechny páky se vrátí dolů, cíl se posune;
- součet ≠ cíl → tlačítko červeně blikne a Bajtík řekne `R2_WRONG_MORE` (dodáno víc) nebo `R2_WRONG_LESS` (dodáno míň).

**Výpadek proudu (po 3. správném čísle):** světla 3× zablikají, scéna ztmavne (překryv černá 40 %), všech 6 displejů včetně součtu zhasne, rozsvítí se červené nouzové světlo nad dveřmi. Natištěné 1 a 0 u pák zůstávají vidět. Bajtík s výrazem „vylekaný“ řekne `R2_BLACKOUT`. Čísla 4–6 se zadávají naslepo; Bajtík po chybě říká jen „víc“ / „míň“.

**Konec:** po 6. čísle se obnoví světlo i displeje, `R2_DONE`, dveře se odemknou a v horní liště se rozsvítí 1. kontrolka. Dveře → Archiv.

**Nápověda (3 stupně)** pro každé číslo je v Textaci; 3. stupeň říká rozklad (např. 19 = 16 + 2 + 1).

### 4.3 Archiv (soustavy kolem nás)

**Účel:** zjistit, že soustav je víc a k čemu se dnes používají. **Učebnice:** kap. 3.

**Rozvržení:** vlevo regál se 7 knihami (hřbety různých barev s názvy), uprostřed stůl s deskou, vpravo dveře, Bajtík vpravo dole.

**Deska na stole:** vlevo sloupec 7 karet se soustavami (2, 8, 10, 12, 16, 20, 60), vpravo sloupec 7 karet s použitím v pevném zamíchaném pořadí (Textace `R3_CARDS`). Pod deskou tlačítko „ZKONTROLOVAT“, aktivní až po spojení všech 7 dvojic.

| Soustava | Karta s použitím (zkráceně) | Kniha (název hřbetu) |
| --- | --- | --- |
| 2 | Vše uvnitř počítačů a telefonů | Uvnitř počítače |
| 8 | Kódy transpondérů v letadlech, např. 7700 = nouze | Řízení letového provozu |
| 10 | Ceny, známky, měření, běžné počítání | Obchod a měření |
| 12 | Tucet, 12 měsíců, 12 hodin na ciferníku | Kalendáře a tucty |
| 16 | Barvy na webu, např. #FF0000 | Barvy na obrazovce |
| 20 | Francouzské číslovky: 80 = quatre-vingts (4 × 20) | Jazyky světa |
| 60 | Minuty a sekundy, úhly a zeměpisné souřadnice | Čas a mapy |

**Ovládání:** klik na kartu soustavy ji vybere (rámeček), klik na kartu použití je spojí čarou. Každá karta má nejvýše jedno spojení; klik na spojenou kartu spojení zruší. Klik na knihu otevře překryv s otevřenou knihou (dvoustrana, text z Textace `R3_BOOK_*`), zavírá se křížkem.

**Vyhodnocení:** správné dvojice zezelenají a zamknou se (už nejdou rozpojit), špatné červeně bliknou a rozpojí se. Bajtík řekne `R3_RESULT` s počtem správných. Při 7/7 → `R3_DONE`, odemknou se dveře, rozsvítí se 2. kontrolka. Dveře → Navigace.

### 4.4 Navigace (bity, bajty, jednotky)

**Účel:** bit vs. bajt, značky b a B, předpony k, M, G, T po 1000 a vědomí, že existuje i 1024. **Učebnice:** kap. 4.

**Rozvržení:** velká navigační obrazovka uprostřed nahoře (zhaslá, šedý šum), nad ní 3 kontrolky A, B, C. Pod ní tři panely vedle sebe: A „Datová páska“, B „Žebřík jednotek“, C „Paměťové moduly“. Panely jdou plnit jen popořadě; nedostupný panel je ztmavený bez kruhu. Klik na panel ho přiblíží (překryv 80 % scény). Dveře vpravo, Bajtík vlevo dole.

**Panel A – Datová páska.** Na pásce běží 24 bitů `010000100100000101001010`. Pod ní otočný volič „Délka kusu“ s tlačítky − a + (rozsah 1–12, výchozí 4) a tlačítko „ROZDĚLIT“.

- Rozdělení po 8: páska se rozstřihne na 3 kusy, pod každým se objeví jeho hodnota a znak: 66 → B, 65 → A, 74 → J. Obrazovka ukáže „BAJ…“, `R4A_OK`.
- Jiná délka: páska se rozstřihne, pod kusy se ukáže „nesmyslná data“ (náhodné znaky), `R4A_WRONG`.
- Po úspěchu otázka „Navigace hlásí velikost pásky: 3 \_“ s tlačítky **b** a **B**. Správně B → `R4A_DONE`, kontrolka A zezelená. Špatně → `R4A_UNIT_WRONG`.

**Panel B – Žebřík jednotek.** Svislý žebřík TB, GB, MB, kB, B, b (shora dolů). Mezi stupni šipky: dolů „× 1000“ (mezi B a b „× 8“), nahoru „÷ 1000“ (mezi b a B „÷ 8“). U žebříku trvalá cedulka `R4B_NOTE_1024`. Tři podúkoly za sebou, odpověď se píše do pole s klávesnicí ve hře:

1. „Hvězdná mapa má 4 GB. Starý počítač přijímá velikost jen v MB.“ → **4 000**
2. „Modul motorů hlásí 2 500 kB. Kolik je to MB?“ → **2,5**
3. „Kolik bitů je 1 kB?“ → **8 000**

Při odpovědi se příslušné šipky na žebříku rozsvítí podle cesty převodu. Po třech správných `R4B_DONE`, kontrolka B zezelená.

**Panel C – Paměťové moduly.** Stojan se 4 sloty popsanými „nejmenší → největší“ a 4 moduly: **750 MB**, **1 GB**, **12 000 Mb**, **2 000 000 kB** (výchozí rozložení na stole: 12 000 Mb, 750 MB, 2 000 000 kB, 1 GB). Klik na modul ho vezme, klik na slot ho vloží; klik na vložený modul ho vrátí. Tlačítko „VLOŽIT“ po zaplnění všech slotů.

- Správné pořadí: 750 MB (750 MB) < 1 GB (1 000 MB) < 12 000 Mb (1 500 MB) < 2 000 000 kB (2 000 MB) → `R4C_DONE`.
- Špatně: moduly na špatných místech vyskočí zpět na stůl, `R4C_WRONG`. Pokud byl 12 000 Mb na posledním místě, místo toho `R4C_WRONG_MB`.

**Konec:** obrazovka se rozsvítí hvězdnou mapou, ukáže polohu lodi, stanici Orion-7 a čárkovanou trasu. `R4_DONE`, 3. kontrolka, dveře → Rozcestí.

### 4.5 Rozcestí

Chodba se dvojími dveřmi: vlevo „KAJUTA – VYSÍLAČ SOS“, vpravo „CVIČIŠTĚ“. Obojí odemčené. Bajtík uprostřed dole řekne `R5_INTRO`. Z Kajuty i Cvičiště se vždy vrací sem. **Učebnice:** obsah (bez vybrané kapitoly).

### 4.6 Kajuta – minitest a SOS

**Rozvržení:** lůžko vlevo, uprostřed terminál vysílače s velkou anténou za oknem, dveře zpět vpravo, Bajtík vpravo dole.

**Minitest:** klik na terminál otevře test přes celou scénu. Každý pokus vylosuje 8 otázek, po 2 z každé kategorie banky v Textaci (`TEST_A_*` pojmy, `TEST_B_*` dvojková → desítková, `TEST_C_*` sčítání a odčítání ve dvojkové, `TEST_D_*` jednotky). Otázky jsou výběr ze 4 možností nebo číslo do pole. Jedna otázka na obrazovku, bez zpětné vazby během testu, tlačítko „Další“. Učebnice je během testu dostupná (ikona v liště), test je formativní.

- Výsledek ≥ `PASS_SCORE` (výchozí 7 z 8, konstanta v kódu): `R6_PASS`, na terminálu se objeví tlačítko „VYSLAT SOS“.
- Méně: obrazovka výsledku ukáže jen ✓ / ✗ u každé ze 4 kategorií (správné odpovědi neukazuje) a Bajtík řekne `R6_FAIL_*` podle první chybné kategorie, s doporučením trenažéru. Tlačítka „Zkusit znovu“ a „Zpět“.

**Vyslání SOS:** klik → anténa se vysune, kolem ní vlny, na terminálu se vypisuje morseovka `... --- ...` a pod ní binárně, 3 s. Rozsvítí se 4. kontrolka, `R6_SOS`, přechod na vítěznou obrazovku.

### 4.7 Cvičiště

**Rozvržení:** tělocvična lodi se čtyřmi stanovišti (automaty) vedle sebe, každé s kruhem a cedulí. Dveře zpět vlevo, Bajtík dole uprostřed. Klik na stanoviště otevře trenažér přes celou scénu. Každý trenažér má tlačítko „Ukázka“ (animovaný vzorový příklad krok po kroku), pak nekonečné procvičování od snadných příkladů, bez skóre a bez konce; zavírá se křížkem.

| Stanoviště | Kategorie testu | Mechanika | Učebnice |
| --- | --- | --- | --- |
| A – Asteroidová střelnice | B: dvojková → desítková | Zaměřovač ukazuje desítkové číslo, 3–4 asteroidy s binárními čísly pomalu plují; klik na správný ho rozstřelí a ukáže rozklad (13 = 8 + 4 + 1), špatný se odrazí. Prvních 5 kol 4 bity, pak 5 bitů. | kap. 2 |
| B – Sčítačka | C: sčítání a odčítání | Příklad pod sebou (4–5 bitů). Žák klikáním přepíná číslice výsledku a políčka přenosu (0/1) zprava doleva, pak „Zkontrolovat“; chybný sloupec se zvýrazní. Pod příkladem kontrola v desítkové (5 + 3 = 8). Pořadí: sčítání bez přenosu → s přenosem → odčítání bez výpůjčky → s výpůjčkou. | kap. 5 |
| C – Převodník | D: jednotky | Žebřík z Navigace a náhodné zadání („3 GB = ? MB“, „2 500 MB = ? GB“, „16 Mb = ? MB“, „1 B = ? b“). Po odpovědi se rozsvítí cesta po žebříku. | kap. 4 |
| D – Pexeso pojmů | A: pojmy | 8 dvojic pojem–vysvětlení (Textace `TRAIN_D_PAIRS`), otáčení karet, po dohrání nové rozdání. | kap. 6 |

### 4.8 Vítězná obrazovka a diplom

Animace: záchranná loď přilétá ke stanici, text `WIN_TITLE` a `WIN_TEXT`. Pole „Napiš své jméno“ a tlačítko „Získat diplom“ (aktivní po zadání aspoň 2 znaků).

**Diplom** (A4 na šířku): rozložení a texty podle Textace (kap. 8): nadpis „Diplom“, podnadpis „za záchranu vesmírné lodi“, jméno žáka, text `DIPLOMA_TEXT`, dnešní datum v českém formátu (20. 10. 2026), 4 ikony opravených systémů a Bajtíkův „podpis“ (malá kresba Bajtíka). Žádný čas, počet pokusů ani skóre. Tlačítko „Vytisknout / uložit jako PDF“ (`window.print()` s tiskovým CSS, které skryje vše kromě diplomu).

## 5. Vizuální styl a assety

Plochá vektorová grafika (flat), čelní pohled na stěnu, bez perspektivy a bez fotorealistických přechodů; povolené jsou jen jemné záře (glow) u displejů a kontrolek. Tvary mají zaoblené rohy a obrys o 1 odstín tmavší než výplň. Vše je kresleno jako inline SVG, opakované prvky jako `<symbol>`.

### 5.1 Paleta

| Role | Barva | Použití |
| --- | --- | --- |
| Nejtmavší pozadí | `#0F1B2D` | Pozadí za scénou, okna do vesmíru |
| Stěny | `#1B2A41` | Hlavní plochy místností |
| Panely | `#2C3E5A` | Konzole, stůl, regál, dveře |
| Světlé hrany | `#3D5578` | Obrysy panelů, nýty, lišty |
| Kov | `#8A9BB0` | Páky, kliky, stojany |
| Interakce | `#FFD23F` | Pouze klikací kruhy a vybraný prvek |
| Funguje / správně | `#3DDC97` | Zelené kontrolky, číslice displejů, správné odpovědi |
| Porucha / chyba | `#FF6B4A` | Červené čtverečky, nouzové světlo, chyby |
| Informace | `#5AC8FA` | Bajtík, šestnáctkové počítadlo, hvězdná mapa |
| Displej (pozadí) | `#071018` | Plocha displejů a terminálů |
| Text na tmavé | `#F2F5F9` | Popisky, lišta |
| Bublina | `#F2F5F9` s textem `#0F1B2D` | Bajtíkovy bubliny, knihy, diplom |

Žlutá `#FFD23F` se nesmí použít na nic jiného než klikací prvky, aby kruhy zůstaly jednoznačné.

### 5.2 Bajtík

Malý vznášející se robot, asi 140 × 170 px. Tělo zaoblená kapsle v barvě `#5AC8FA` s tmavým obrysem, místo obličeje tmavý displej se dvěma očima, na hlavě anténka s blikající bambulkou (`#3DDC97`, 1 bliknutí za 2 s). Na hrudi řada 8 malých LED, které binárně ukazují číslo aktuální místnosti (Rozvodna = 00000010). Žádné nohy, pod tělem jemná záře trysky.

| Výraz | Oči na displeji |
| --- | --- |
| Neutrální | Dva svislé ovály |
| Radost | Dva oblouky ^ ^ |
| Přemýšlí | Jedno oko menší, vedle malý otazník |
| Varování | Ovály s vodorovnou čarou nahoře (zamračení) |
| Vylekaný | Dva velké kruhy, displej problikne |

### 5.3 Seznam assetů

| Asset | Kde | Stavy / poznámka |
| --- | --- | --- |
| Bajtík | Všude | 5 výrazů, vznášení, LED na hrudi |
| Řečová bublina, trvalá bublina, menu | Všude | Šipka k Bajtíkovi, tlačítko „Dál ›“ |
| Klikací kruh | Všude | Normální, hover, zamčený (šedý přerušovaný), mizení |
| Dveře | Všude | Zamčené, odemčené, otevírání (posun do strany 300 ms) |
| Horní lišta | Všude | Název místnosti, 4 kontrolky, ikona učebnice |
| Překryv učebnice | Všude | Obsah, text, posuvník, křížek |
| Pozadí: Technická místnost | 1 | Potrubí, kabely, blikající kontrolky |
| Počítadlo s kolečky | 1 | Varianty se 3, 8 a 2 kolečky, animace protočení |
| Pozadí: Rozvodna | 2 | Varianta normální a při výpadku (+ červené nouzové světlo) |
| Páka | 2 | Nahoře / dole, natištěné 1 a 0 |
| Sedmisegmentový displej | 2, 4 | Číslice 0–9, A–F, zhasnutý |
| Tlačítko „ODESLAT ENERGII“ | 2 | Normální, stisk, červené bliknutí |
| Řada 6 čtverečků na dveřích | 2 | Červený, zelený |
| Pozadí: Archiv | 3 | Regál, stůl, lampa |
| Kniha na regálu + otevřená kniha | 3 | 7 hřbetů s názvy, dvoustrana |
| Karty na desce + spojovací čára | 3 | Normální, vybraná, spojená, správná (zelená), chybná |
| Pozadí: Navigace | 4 | Velká obrazovka: šum / hvězdná mapa s trasou |
| Datová páska, volič, nůžky | 4 | Celá, rozstřižená |
| Žebřík jednotek | 4, Cvičiště | Šipky zhaslé / rozsvícené |
| Paměťový modul + stojan se 4 sloty | 4 | Na stole, v ruce, ve slotu |
| Pozadí: Rozcestí | 5 | Chodba, dvoje dveře s cedulemi |
| Pozadí: Kajuta + terminál + anténa | 6 | Anténa zasunutá / vysunutá s vlnami |
| Pozadí: Cvičiště + 4 automaty | 7 | Každý automat s vlastní ikonou |
| Asteroid, zaměřovač, výbuch | Trenažér A | Výbuch z jednoduchých úlomků |
| Karty pexesa | Trenažér D | Rub (logo lodi), líc |
| Vítězná scéna + diplom | 8 | Záchranná loď, stanice Orion-7, rámeček diplomu |

## 6. Akceptační kritéria

Hra je hotová, když platí všechny body níže.

- [ ] Hru jde dohrát od začátku po diplom bez chyby v konzoli v Chromu na 1366 × 768 i 1920 × 1080.
- [ ] Hra funguje bez připojení k internetu, otevřená z disku i z GitHub Pages.
- [ ] Každý ovladatelný prvek má klikací kruh; nic bez kruhu nereaguje na klik (kromě Bajtíkových bublin a překryvů).
- [ ] Všechny texty odpovídají dokumentu Textace doslova, včetně české typografie.
- [ ] Po obnovení stránky hra nabídne pokračování v poslední místnosti se zachovaným postupem.
- [ ] Rozvodna: displeje se aktualizují hned po přepnutí páky; po 3. čísle nastane výpadek a zhasne i součet.
- [ ] Archiv: kontrola jde spustit až po 7 spojeních; správné dvojice zůstanou zamčené.
- [ ] Navigace: panely jdou plnit jen popořadě; pole přijímají `2,5` i `2.5` a `4 000` i `4000`.
- [ ] Minitest: každý pokus losuje jiné otázky, vždy 2 z každé kategorie; po neúspěchu ukáže jen ✓ / ✗ po kategoriích.
- [ ] Cvičiště: všechny 4 trenažéry mají ukázku a jdou hrát donekonečna.
- [ ] Učebnice se otevře na kapitole aktuální místnosti nebo stanoviště.
- [ ] Diplom se vytiskne na jednu stranu A4 na šířku bez prvků hry.
- [ ] `?room=N` a `?debug=1` fungují.
