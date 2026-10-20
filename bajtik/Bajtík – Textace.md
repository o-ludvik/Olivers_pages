# Bajtík – Textace

Oct 20, 2026 · @Oliver

Všechny texty hry. Agent je přebírá doslova do objektu `TEXTS` pod uvedenými ID; výraz Bajtíka je v hranatých závorkách, dvojité lomítko // odděluje stránky bubliny.

## 1. Pravidla a globální texty

Bajtík tyká, mluví krátce a vesele a nikdy nezesměšňuje chybu. Jedna stránka bubliny má nejvýše 2 věty (asi 140 znaků). Odborný pojem při prvním použití tučně, ve hře jako `<b>`. Vtipy jen o bitech, robotech a lodi, ne o žákovi.

### Názvy místností

| ID | Text |
| --- | --- |
| ROOM\_1 | Technická místnost |
| ROOM\_2 | Rozvodna |
| ROOM\_3 | Archiv |
| ROOM\_4 | Navigace |
| ROOM\_5 | Rozcestí |
| ROOM\_6 | Kajuta |
| ROOM\_7 | Cvičiště |
| ROOM\_9 | Měřírna |

### Úvodní obrazovka a ovládání

| ID | Text |
| --- | --- |
| G\_TITLE | Bajtík a ztracená loď |
| G\_SUBTITLE | Oprav loď, poznej dvojkovou soustavu a vyšli SOS. |
| G\_NEW | Nová hra |
| G\_CONTINUE | Pokračovat |
| G\_RESTART | Začít znovu |
| G\_RESTART\_CONFIRM | Opravdu začít znovu? Celý postup se smaže. |
| G\_YES\_RESTART | Ano, znovu |
| G\_BACK | Zpět |
| G\_NEXT | Dál › |
| G\_MENU\_TASK | Co mám dělat? |
| G\_MENU\_HINT | Nápověda |
| G\_MENU\_BOOK | Učebnice |
| G\_BOOK\_TITLE | Bajtíkova učebnice |
| G\_TOPBAR\_SYSTEMS | Systémy lodi |
| G\_KEY\_CONFIRM | Potvrdit |
| G\_KEY\_DELETE | Smazat |
| G\_CLOSE | Zavřít |

### Společné hlášky

| ID | Výraz | Text |
| --- | --- | --- |
| G\_DOOR\_LOCKED | varování | Tyhle dveře jsou zatím zamčené. Nejdřív musíme opravit, co je tady. |
| G\_HINT\_OFFER | přemýšlí | Tohle je záludné, to nevadí. Klikni na mě a dej „Nápověda“. |
| G\_HINT\_LAST | přemýšlí | Víc už neprozradím, to bych to vyřešil za tebe. Mrkni do učebnice! |
| G\_ROOM\_DONE\_BACK | neutrální | Tady už je všechno opravené. Pokračuj dál. |

## 2. Technická místnost a Rozvodna

Výraz uvedený na začátku stránky v hranatých závorkách platí od té stránky dál. Zástupné symboly: `{target}` cílové číslo, `{sum}` aktuální součet, `{bits}` cíl jako 5 bitů, `{decomp}` rozklad cíle.

### Technická místnost

| ID | Výraz | Text |
| --- | --- | --- |
| R1\_INTRO | radost | Bzzt… Jé, ty jsi vzhůru! Jsem Bajtík, opravářský robot téhle lodi. // \[vylekaný\] Narazili jsme do meteoritu a loď ztroskotala. Skoro všechny systémy jsou mimo provoz. // \[neutrální\] Ty umíš opravovat, já znám loď. Spolu ji zprovozníme a vyšleme SOS, ať pro nás někdo přiletí. |
| R1\_CLICK\_ME | přemýšlí | Vidíš ta tři počítadla? Ukazují pořád stejné číslo, jen každé ho zapisuje jinak. // \[neutrální\] Všechno, co jde ovládat, má u sebe žlutý kroužek. Zkus kliknout na mě. |
| R1\_MENU | radost | Výborně! Když si nebudeš vědět rady, klikni na mě: zopakuju úkol, napovím nebo otevřu učebnici. // Teď dveře vlevo. Jdeme do rozvodny. |
| R1\_TASK\_A | neutrální | Klikni na žlutý kroužek u mě. |
| R1\_TASK\_B | neutrální | Klikni na dveře vlevo, jdeme do rozvodny. |
| R1\_HINT\_1 | neutrální | Hledej žlutý kroužek a klikni přímo do něj. |

### Technická místnost – popisky

| ID | Text |
| --- | --- |
| R1\_LABEL\_10 | DESÍTKOVÁ (10) |
| R1\_LABEL\_2 | DVOJKOVÁ (2) |
| R1\_LABEL\_16 | ŠESTNÁCTKOVÁ (16) |

### Rozvodna – hlášky

| ID | Výraz | Text |
| --- | --- | --- |
| R2\_INTRO | vylekaný | Rozvodna! Reaktor skoro nedává energii, musíme mu ji poslat ručně. // \[neutrální\] Každá páka posílá jiné množství energie. Nahoře je **1** (zapnuto), dole **0** (vypnuto). // Displeje ukazují, kolik která páka posílá. Nastav součet přesně na číslo z mého seznamu a stiskni ODESLAT ENERGII. |
| R2\_TASK | neutrální | Nastav páky tak, aby součet byl {target}. Pak stiskni ODESLAT ENERGII. |
| R2\_OK\_1 | radost | Správně! Zleva páky ukazovaly {bits}. Tak se {target} píše ve **dvojkové soustavě**. |
| R2\_OK\_2 | radost | Paráda, další světýlko je zelené! {target} je ve dvojkové soustavě {bits}. |
| R2\_OK\_3 | radost | Sedí to! {target} = {bits}. Ty už mluvíš jako počítač. |
| R2\_OK\_DARK | radost | Naslepo a správně! {target} je {bits}. |
| R2\_WRONG\_MORE | varování | Reaktor dostal {sum}, ale potřebuje {target}. To je moc, některou páku sklop. |
| R2\_WRONG\_LESS | varování | Reaktor dostal {sum}, potřebuje {target}. To je málo, přidej energii. |
| R2\_WRONG\_MORE\_DARK | varování | Moc energie! Zkus některou páku sklopit. |
| R2\_WRONG\_LESS\_DARK | varování | Málo energie! Zkus přidat. |
| R2\_BLACKOUT | vylekaný | Ajaj, vypadl proud a displeje zhasly! // \[přemýšlí\] Ale páky posílají pořád stejně energie jako předtím. Pamatuješ si, kolik která? |
| R2\_DONE | radost | Reaktor jede a proud je zpátky! První systém opravený. // 31 je 11111, všechny páky nahoře. Víc se pěti pákami poslat nedá. |

Pořadí: R2\_OK\_1 po 1. čísle, R2\_OK\_2 po 2., R2\_OK\_3 po 3. (pak hned R2\_BLACKOUT), R2\_OK\_DARK po 4. a 5., po 6. rovnou R2\_DONE.

### Rozvodna – popisky

| ID | Text |
| --- | --- |
| R2\_NEED | Reaktor potřebuje: |
| R2\_SEND | ODESLAT ENERGII |

### Rozvodna – nápověda

| ID | Výraz | Text |
| --- | --- | --- |
| R2\_HINT\_1 | přemýšlí | Každá páka má svou hodnotu: zleva 16, 8, 4, 2, 1. Číslo poskládáš jejich sečtením. |
| R2\_HINT\_2 | přemýšlí | Začni zleva. Když se hodnota páky do zbytku čísla vejde, zvedni ji a odečti. Pak pokračuj další pákou. |
| R2\_HINT\_3 | neutrální | {target} = {decomp}. Zvedni právě tyhle páky. |

| Cíl | {decomp} | {bits} |
| --- | --- | --- |
| 5 | 4 + 1 | 00101 |
| 12 | 8 + 4 | 01100 |
| 19 | 16 + 2 + 1 | 10011 |
| 10 | 8 + 2 | 01010 |
| 26 | 16 + 8 + 2 | 11010 |
| 31 | 16 + 8 + 4 + 2 + 1 | 11111 |

## 3. Archiv

### Hlášky

| ID | Výraz | Text |
| --- | --- | --- |
| R3\_INTRO | neutrální | Lodní archiv. Počítač tu drží dveře zamčené, dokud mu neukážeš, že soustavám rozumíš. // \[přemýšlí\] Desítková a dvojková totiž nejsou jediné! Spoj každou soustavu na stole s tím, k čemu se dnes používá. // \[neutrální\] Nevíš si rady? Knihy v regálu ti to vysvětlí. Klikni na ně. |
| R3\_TASK | neutrální | Spoj každou soustavu s jejím použitím a dej ZKONTROLOVAT. Když nevíš, čti knihy v regálu. |
| R3\_RESULT | přemýšlí | Máš {correct} ze 7 správně. Zelené zůstanou, ostatní zkus spojit znovu. |
| R3\_DONE | radost | Všech 7 správně, archiv odemyká dveře! // Soustav je spousta, ale v počítačích vládne ta dvojková. Jdeme do měřírny. |
| R3\_HINT\_1 | přemýšlí | Každá kniha v regálu patří k jednomu použití. Přečti si ji a najdi, o které soustavě mluví. |
| R3\_HINT\_2 | přemýšlí | Začni tím, co znáš: běžné počítání je 10 a počítače 2. Zbytek najdeš v knihách. |
| R3\_HINT\_3 | neutrální | Minuty jsou 60, tucet 12, barvy na webu 16 a letadla mají kódy v osmičkové. Zbývá francouzština. |
| R3\_CHECK | – | ZKONTROLOVAT |

Karty jde spojovat v libovolném pořadí (soustava → použití i použití → soustava).

### Karty (R3\_CARDS)

Levý sloupec v tomto pořadí: **2, 8, 10, 12, 16, 20, 60**. Pravý sloupec v pořadí tabulky níže (pevné zamíchání).

| ID | Text karty | Správná soustava |
| --- | --- | --- |
| R3\_CARD\_16 | Barvy na webu, např. #FF0000 = červená | 16 |
| R3\_CARD\_10 | Ceny, známky, měření a běžné počítání lidí | 10 |
| R3\_CARD\_60 | Minuty, sekundy, úhly a zeměpisné souřadnice | 60 |
| R3\_CARD\_2 | Vše uvnitř počítačů a telefonů: programy, fotky, hudba | 2 |
| R3\_CARD\_20 | Francouzské číslovky: 80 = quatre-vingts (4 × 20) | 20 |
| R3\_CARD\_8 | Kódy transpondérů v letadlech, např. 7700 = nouze | 8 |
| R3\_CARD\_12 | Tucet vajec, 12 měsíců, 12 hodin na ciferníku | 12 |

### Knihy (R3\_BOOK\_\*)

**R3\_BOOK\_2 – Uvnitř počítače** Počítač je postavený z miliard drobných spínačů, tranzistorů. Každý umí jen dva stavy: proud teče, nebo neteče. Proto počítače používají **dvojkovou soustavu**, která má jen dvě číslice: 0 a 1. Všechno, co v telefonu nebo počítači máš, je uložené jako dlouhá řada nul a jedniček: program, fotka, písnička i tahle hra. Třeba písmeno A je pro počítač 01000001.

**R3\_BOOK\_8 – Řízení letového provozu** Každé letadlo má **transpondér**, přístroj, který radaru hlásí čtyřmístný kód. Číslice v kódu jdou jen od 0 do 7, je to tedy **osmičková soustava** a kódů existuje 8 × 8 × 8 × 8 = 4 096. Některé kódy mají zvláštní význam: 7700 znamená nouzi na palubě, 7600 poruchu rádia. Osmičkovou soustavu potkáš i u práv k souborům na serverech, kde zápis 755 říká, kdo smí soubor číst a měnit.

**R3\_BOOK\_10 – Obchod a měření** Ceny v obchodě, známky ve škole, délka v metrech nebo teplota: to všechno lidé zapisují v **desítkové soustavě** s číslicemi 0 až 9. Je to soustava, kterou používá skoro celý svět. Postavená je na ní i soustava jednotek: 1 kilometr je 1 000 metrů a 1 metr je 100 centimetrů, vždy násobky deseti. Když vidíš číslo bez dalšího označení, je skoro jistě desítkové.

**R3\_BOOK\_12 – Kalendáře a tucty** Rok má 12 měsíců a ciferník hodin 12 hodin. Vejce se dodnes prodávají po **tuctech**: tucet je 12 kusů a veletucet 12 × 12 = 144. Dvanáctka se dá dělit 2, 3, 4 i 6, a proto se hodí na dělení věcí na stejné díly. Stopy **dvanáctkové soustavy** jsou i v anglických mírách: jedna stopa má 12 palců.

**R3\_BOOK\_16 – Barvy na obrazovce** Každá barva na obrazovce se míchá ze tří světel: červeného, zeleného a modrého. Síla každého se zapisuje dvěma číslicemi **šestnáctkové soustavy** od 00 do FF. Ta má číslice 0–9 a pak písmena A–F (A = 10, F = 15). #FF0000 je tedy naplno červená a nic ostatního, #FFFFFF bílá a #000000 černá. Šestnáctkově se zapisují i adresy síťových karet (MAC adresy).

**R3\_BOOK\_20 – Jazyky světa** Některé jazyky dodnes počítají po dvacítkách, ve **dvacítkové soustavě**. Francouz neřekne osmdesát, ale quatre-vingts, „čtyři dvacítky“, a devadesát je quatre-vingt-dix, „čtyři dvacítky a deset“. Dvacítky mají v číslovkách schované i Dánové. Ve dvacítkové soustavě počítali také Mayové a jejich kalendář.

**R3\_BOOK\_60 – Čas a mapy** Minuta má 60 sekund a hodina 60 minut: čas zapisujeme v **šedesátkové soustavě**. Stejně se dělí úhly: kruh má 360 stupňů a stupeň 60 úhlových minut. Proto zeměpisná poloha na mapě vypadá třeba takto: 49° 12′ 30″. Šedesátku vymysleli už staří Babyloňané, protože jde dělit 2, 3, 4, 5, 6, 10, 12, 15, 20 i 30.

## 3a. Měřírna

Vložená mezi Archiv a Navigaci (v kódu místnost 9). Čtyři vitríny jdou popořadě; klik na vitrínu = výklad, pak otázka se třemi možnostmi na tabuli.

### Popisky

| ID | Text |
| --- | --- |
| R9\_E1\_TITLE | BIT |
| R9\_E2\_TITLE | BAJT |
| R9\_E3\_TITLE | PŘEDPONY |
| R9\_E4\_TITLE | V PRAXI |

### Hlášky

| ID | Výraz | Text |
| --- | --- | --- |
| R9\_INTRO | neutrální | Měřírna! Než půjdeme do navigace, musíš znát jednotky, ve kterých počítač měří data. // \[přemýšlí\] Na stěně jsou čtyři vitríny. Klikni na tu rozsvícenou, vysvětlím ti ji a pak se tě na něco zeptám. // \[neutrální\] Odpovídáš na tabuli pod vitrínami. Až budou všechny čtyři zelené, dveře se otevřou. |
| R9\_TASK | neutrální | Klikni na rozsvícenou vitrínu a poslechni si, co ukazuje. |
| R9\_E1 | neutrální | Tohle je **bit**, nejmenší kousek informace. Má jen dvě možnosti: **0**, nebo **1**. Jako ta kontrolka: zhasnuto, nebo rozsvíceno. // Bit je **jednotka** jako metr nebo gram. Metr měří délku, gram hmotnost a bit měří informaci. Značí se malým **b**. |
| R9\_E2 | neutrální | Jeden bit toho moc neřekne. Počítač proto bity skládá po osmi a osmi bitům se říká **bajt**. // Do jednoho bajtu se vejde třeba jedno písmeno: 01000001 je A. // \[varování\] Pozor na značky! Bit je malé **b**, bajt velké **B**. Jedno písmenko, osmkrát větší rozdíl. |
| R9\_E3 | neutrální | Bajt je malá jednotka, jedna fotka jich má miliony. Proto se přidávají **předpony**, úplně stejně jako u metrů a gramů. // **Kilo** znamená 1 000×: 1 km = 1 000 m, 1 kg = 1 000 g a 1 kB = 1 000 B. // Každá další předpona je zase 1 000× víc: **mega** (MB), **giga** (GB) a **tera** (TB). |
| R9\_E4 | neutrální | K čemu to je? V **bajtech** se měří, kolik místa data zaberou. Fotka z mobilu má asi 3 MB, film asi 4 GB. // \[přemýšlí\] Rychlost internetu se ale udává v **bitech** za sekundu, třeba 100 Mb/s. Malé b, megabity! // \[neutrální\] Až uvidíš jednotku, vždy se podívej, jestli je b malé, nebo velké. |
| R9\_Q1 | neutrální | Kolik různých hodnot může mít jeden bit? |
| R9\_Q2 | neutrální | Kolik bitů je 1 B? |
| R9\_Q3 | neutrální | Kolik kB je 1 MB? |
| R9\_Q4 | neutrální | Která značka znamená megabajt? |
| R9\_OK\_1 | radost | Ano, dvě: 0 a 1. Proto počítače mluví dvojkovou soustavou. |
| R9\_OK\_2 | radost | Přesně, 1 B = 8 b. Velké B je bajt, malé b je bit. |
| R9\_OK\_3 | radost | Ano, 1 MB = 1 000 kB. Každá předpona je 1 000× víc, jako u metrů a kilometrů. |
| R9\_WRONG | varování | To nesedí. Klikni znovu na vitrínu a poslechni si ji ještě jednou. |
| R9\_DONE | radost | Všechny vitríny svítí zeleně! Bit, bajt i předpony znáš. // MB je megabajt, Mb megabit, osmkrát menší. Teď to využijeme v navigaci, dveře jsou otevřené. |
| R9\_HINT\_1 | přemýšlí | Klikni na vitrínu, která svítí. Odpověď je schovaná v tom, co ti o ní řeknu. |
| R9\_Q1\_HINT | neutrální | Bit je jako vypínač: buď 0, nebo 1. Kolik je to možností? |
| R9\_Q2\_HINT | neutrální | Velké B je bajt. Spočítej kontrolky ve vitríně BAJT. |
| R9\_Q3\_HINT | neutrální | Mega je hned po kilo a každá předpona je 1 000× víc. |
| R9\_Q4\_HINT | neutrální | Mega se píše velkým M a bajt velkým B. |

### Možnosti na tabuli (správná první, zobrazují se zamíchané)

| ID | Možnosti |
| --- | --- |
| R9\_A1 | 2 · 1 · 10 |
| R9\_A2 | 8 · 1 · 10 |
| R9\_A3 | 1 000 · 100 · 8 |
| R9\_A4 | MB · Mb · mB |

## 4. Navigace

### Popisky

| ID | Text |
| --- | --- |
| R4\_PANEL\_A | Datová páska |
| R4\_PANEL\_B | Žebřík jednotek |
| R4\_PANEL\_C | Paměťové moduly |
| R4\_LEN | Délka kusu |
| R4\_SPLIT | ROZDĚLIT |
| R4\_GARBAGE | nesmyslná data |
| R4\_INSERT | VLOŽIT |
| R4\_RACK | nejmenší → největší |
| R4B\_NOTE\_1024 | Pozor: někde se počítá po 1 024 (KiB, MiB, GiB). Vždy čti zadání! |
| R4\_MAP\_STATION | Orion-7 |

### Úvod a panel A – Datová páska

| ID | Výraz | Text |
| --- | --- | --- |
| R4\_INTRO | vylekaný | Navigace je prázdná! Bez hvězdné mapy nevíme, kde jsme, a SOS by nikdo nenašel. // \[neutrální\] Mapu nahrajeme přes tři panely. Začni panelem A, datovou páskou. |
| R4A\_TASK | neutrální | Nastav délku kusu tak, aby z pásky vyšla smysluplná data, a dej ROZDĚLIT. |
| R4A\_OK | radost | Funguje to! Kus o 8 bitech je **bajt**, jako ve vitríně v měřírně. Počítač čte data právě po bajtech. // 24 bitů jsou tedy 3 bajty. A vyšlo z nich BAJ… skoro moje jméno! |
| R4A\_WRONG | přemýšlí | Hmm, z toho vyšla jen změť znaků. Zkus jinou délku kusu. |
| R4A\_UNIT\_Q | neutrální | Navigace hlásí velikost pásky: 3 \_. Doplň správnou značku. |
| R4A\_DONE | radost | Správně! Malé **b** je bit, velké **B** je bajt. Jedno písmenko, osmkrát větší rozdíl. |
| R4A\_UNIT\_WRONG | varování | Pozor, malé b je bit. Bitů má páska 24, bajty jsou jen 3. Která značka patří k číslu 3? |
| R4A\_HINT\_1 | přemýšlí | Počítač čte data po kouscích, které mají vždy stejný počet bitů. Zkoušej různé délky. |
| R4A\_HINT\_2 | přemýšlí | Ten správný kousek se jmenuje bajt. Kolik bitů má bajt? Je to v učebnici. |
| R4A\_HINT\_3 | neutrální | Nastav délku kusu na 8. |

### Panel B – Žebřík jednotek

| ID | Výraz | Text |
| --- | --- | --- |
| R4B\_INTRO | neutrální | Předpony už znáš z měřírny: kilobajty, megabajty, gigabajty… Na žebříku je každý schod nahoru je 1 000× víc, jako u metrů a kilometrů. // Jen mezi bity a bajty je schod 8×. // \[přemýšlí\] Vidíš cedulku? Někde, třeba u operační paměti nebo ve Windows, se počítá po 1 024. My tu počítáme po 1 000, ale vždy čti zadání! |
| R4B\_Q1 | neutrální | Hvězdná mapa má 4 GB. Starý počítač přijímá velikost jen v MB. Kolik MB má mapa? |
| R4B\_Q2 | neutrální | Modul motorů hlásí 2 500 kB. Kolik je to MB? |
| R4B\_Q3 | neutrální | Kontrolní otázka: kolik bitů je 1 kB? |
| R4B\_OK\_1 | radost | Přesně, 4 GB = 4 000 MB. Z větší jednotky na menší násobíš. |
| R4B\_OK\_2 | radost | Ano, 2 500 kB = 2,5 MB. Z menší jednotky na větší dělíš. |
| R4B\_OK\_3 | radost | Správně! 1 kB = 1 000 B a každý bajt má 8 bitů, takže 8 000 b. |
| R4B\_WRONG | varování | To nesedí. Podívej se na žebřík: jdeš nahoru, nebo dolů? A o kolik schodů? |
| R4B\_DONE | radost | Žebřík zvládnutý! Poslední panel: paměťové moduly. |
| R4B\_HINT\_1 | přemýšlí | Najdi na žebříku jednotku, ze které jdeš, a tu, do které jdeš. Každý schod je × 1 000 nebo ÷ 1 000. |
| R4B\_HINT\_2 | přemýšlí | Dolů na menší jednotku násobíš, nahoru na větší dělíš. |
| R4B\_HINT\_3\_Q1 | neutrální | Z GB na MB je jeden schod dolů: 4 × 1 000. |
| R4B\_HINT\_3\_Q2 | neutrální | Z kB na MB je jeden schod nahoru: 2 500 ÷ 1 000. |
| R4B\_HINT\_3\_Q3 | neutrální | Z kB na B je × 1 000, z B na b je × 8. |

### Panel C – Paměťové moduly a konec

| ID | Výraz | Text |
| --- | --- | --- |
| R4C\_INTRO | neutrální | Moduly s mapou dej do stojanu od nejmenšího po největší. // \[přemýšlí\] Pozor, každý je popsaný jinou jednotkou. Převeď si je na stejnou, třeba na MB. |
| R4C\_TASK | neutrální | Seřaď moduly od nejmenšího po největší a dej VLOŽIT. |
| R4C\_WRONG | varování | Některé moduly byly na špatném místě a vyskočily. Převeď si všechny na MB. |
| R4C\_WRONG\_MB | přemýšlí | 12 000 vypadá jako obr, ale koukni na jednotku: **Mb** je megabit, ne megabajt! Vyděl to osmi. |
| R4C\_DONE | radost | Všechny moduly sedí! 12 000 Mb je jen 1 500 MB, ta past tam byla schválně. |
| R4C\_HINT\_1 | přemýšlí | Převeď všechny moduly na MB a pak je porovnej. |
| R4C\_HINT\_2 | přemýšlí | GB na MB: × 1 000. kB na MB: ÷ 1 000. Mb na MB: ÷ 8. |
| R4C\_HINT\_3 | neutrální | 750 MB · 1 GB = 1 000 MB · 12 000 Mb = 1 500 MB · 2 000 000 kB = 2 000 MB. |
| R4\_DONE | radost | Mapa je nahraná! Nejbližší je stanice Orion-7, tam pošleme SOS. // Navigace opravená. Vysílač je kousek odsud. |

## 5. Rozcestí, Kajuta a SOS

Všechny hlášky jsou rodově neutrální (žádné „připravený“, „zaškobrtl jsi“), hru hrají kluci i holky.

### Rozcestí

| ID | Výraz | Text |
| --- | --- | --- |
| R5\_DOOR\_L | – | KAJUTA – VYSÍLAČ SOS |
| R5\_DOOR\_R | – | CVIČIŠTĚ |
| R5\_INTRO | neutrální | Rozcestí! Vlevo je kajuta s vysílačem SOS, vpravo cvičiště. // \[přemýšlí\] Vysílač se zapne až po krátkém testu. Kdo si ještě nevěří, ať zajde nejdřív do cvičiště. Test jde zkoušet pořád dokola. |
| R5\_REVISIT | neutrální | Kajuta vlevo, cvičiště vpravo. Kam to bude? |
| R5\_TASK | neutrální | Vlevo test a vysílač SOS, vpravo cvičiště na trénink. |

### Kajuta a minitest

| ID | Výraz | Text |
| --- | --- | --- |
| R6\_INTRO | neutrální | Tohle je kajuta a tamhle vysílač. // \[varování\] Chrání ho bezpečnostní test: 8 otázek, aspoň 7 musí být správně. Až budeš chtít, klikni na terminál. |
| R6\_REVISIT | neutrální | Zkusíme test znovu? Pokaždé dostaneš jiné otázky. |
| R6\_TASK | neutrální | Klikni na terminál a splň test. Pak vyšleme SOS. |
| R6\_TEST\_TITLE | – | Bezpečnostní test vysílače |
| R6\_TEST\_START | – | Spustit test |
| R6\_TEST\_PROGRESS | – | Otázka {n} z 8 |
| R6\_TEST\_NEXT | – | Další |
| R6\_TEST\_FINISH | – | Vyhodnotit |
| R6\_TEST\_CHECK | – | Zkontrolovat |
| R6\_FB\_YOURS | – | Tvoje odpověď: |
| R6\_FB\_RIGHT | – | Správně: |
| R6\_FB\_OK | radost | Správně! {why} |
| R6\_FB\_KO | přemýšlí | Tohle nevyšlo, správně je **{right}**. // {why} |
| R6\_RESULT | – | Výsledek: {score} z 8 |
| R6\_CAT\_A | – | Pojmy |
| R6\_CAT\_B | – | Dvojková → desítková |
| R6\_CAT\_C | – | Počítání ve dvojkové |
| R6\_CAT\_D | – | Jednotky |
| R6\_RETRY | – | Zkusit znovu |
| R6\_PASS | radost | {score} z 8, test splněný! Vysílač je odemčený. // Klikni na VYSLAT SOS. |
| R6\_FAIL\_A | přemýšlí | Tentokrát {score} z 8, potřebujeme 7. Zádrhel byl u pojmů. // Zahraj si ve cvičišti Pexeso pojmů (D), nebo mrkni do slovníčku v učebnici. |
| R6\_FAIL\_B | přemýšlí | Tentokrát {score} z 8, potřebujeme 7. Zádrhel byl u převodu z dvojkové do desítkové. // Ve cvičišti pomůže Asteroidová střelnice (A). |
| R6\_FAIL\_C | přemýšlí | Tentokrát {score} z 8, potřebujeme 7. Zádrhel byl u počítání ve dvojkové. // Ve cvičišti si to vyzkoušej na Sčítačce (B). |
| R6\_FAIL\_D | přemýšlí | Tentokrát {score} z 8, potřebujeme 7. Zádrhel byl u jednotek. // Ve cvičišti je na to Převodník (C). |
| R6\_HINT\_1 | přemýšlí | Test má 8 otázek ze čtyř oblastí: pojmy, dvojková → desítková, počítání ve dvojkové a jednotky. |
| R6\_HINT\_2 | přemýšlí | Ve cvičišti si každou oblast natrénuješ na lehčích příkladech. |
| R6\_HINT\_3 | neutrální | I během testu můžeš otevřít učebnici. To není podvod, to je výzkum! |

Pokud bylo chybných kategorií víc, Bajtík řekne R6\_FAIL\_\* té první v pořadí A, B, C, D.

### SOS

| ID | Výraz | Text |
| --- | --- | --- |
| R6\_SOS\_BUTTON | – | VYSLAT SOS |
| R6\_SOS\_SENDING | – | Vysílám… |
| R6\_SOS | radost | Signál letí! Stanice Orion-7 nás slyší! // Díky! Bez tebe bych tu pořád počítal na prstech. A to žádné prsty nemám. |

## 6. Banka otázek minitestu

Každý pokus losuje 2 otázky z každé kategorie (A, B, C, D) a celé pořadí zamíchá. U otázek s výběrem je správná možnost vždy první a hra možnosti zamíchá. Číselné odpovědi přijímají mezery, čárku i tečku; dvojkové odpovědi jen 0 a 1 a ignorují úvodní nuly (`0111` = `111`). V kategorii C ukazuje klávesnice ve hře jen 0, 1, Smazat a Potvrdit.

### A – Pojmy (výběr ze 4)

| ID | Otázka | Možnosti (správná první) |
| --- | --- | --- |
| TEST\_A\_1 | Kolik různých číslic používá dvojková soustava? | 2 · 1 · 8 · 10 |
| TEST\_A\_2 | Jak se jmenuje nejmenší jednotka informace, která může být jen 0, nebo 1? | bit · bajt · kilobajt · pixel |
| TEST\_A\_3 | Kolik bitů má jeden bajt? | 8 · 2 · 10 · 16 |
| TEST\_A\_4 | Co udává základ soustavy? | Kolik různých číslic soustava používá · Největší číslo, které jde zapsat · Kolik míst má číslo · První číslici čísla |
| TEST\_A\_5 | Ve které soustavě se zapisují barvy na webu, např. #FF0000? | šestnáctkové · dvojkové · osmičkové · šedesátkové |
| TEST\_A\_6 | Proč počítače používají dvojkovou soustavu? | Jejich spínače mají jen dva stavy: proud teče, nebo neteče · Je to nejstarší soustava · Lidé mají dvě ruce · Čísla v ní jsou kratší než v desítkové |
| TEST\_A\_7 | Ve které soustavě počítáme minuty a sekundy? | šedesátkové · dvanáctkové · desítkové · dvacítkové |
| TEST\_A\_8 | Jaká je správná značka pro bajt? | B · b · Bt · bj |

### B – Dvojková → desítková (číslo do pole)

Znění všech: „Jaké desítkové číslo je ve dvojkové soustavě **{bits}**?“

| ID | {bits} | Správně |
| --- | --- | --- |
| TEST\_B\_1 | 1010 | 10 |
| TEST\_B\_2 | 0111 | 7 |
| TEST\_B\_3 | 1100 | 12 |
| TEST\_B\_4 | 01001 | 9 |
| TEST\_B\_5 | 10001 | 17 |
| TEST\_B\_6 | 10110 | 22 |
| TEST\_B\_7 | 11001 | 25 |
| TEST\_B\_8 | 11111 | 31 |

### C – Počítání ve dvojkové (výsledek dvojkově do pole)

Znění všech: „Spočítej ve dvojkové soustavě: **{priklad}**“

| ID | {priklad} | Správně | Kontrola v desítkové |
| --- | --- | --- | --- |
| TEST\_C\_1 | 0101 + 0010 | 111 | 5 + 2 = 7 |
| TEST\_C\_2 | 0011 + 0001 | 100 | 3 + 1 = 4 |
| TEST\_C\_3 | 0110 + 0011 | 1001 | 6 + 3 = 9 |
| TEST\_C\_4 | 1001 + 0110 | 1111 | 9 + 6 = 15 |
| TEST\_C\_5 | 1011 + 0101 | 10000 | 11 + 5 = 16 |
| TEST\_C\_6 | 0111 − 0010 | 101 | 7 − 2 = 5 |
| TEST\_C\_7 | 1100 − 0100 | 1000 | 12 − 4 = 8 |
| TEST\_C\_8 | 1010 − 0011 | 111 | 10 − 3 = 7 |

### D – Jednotky (převody po 1 000)

| ID | Typ | Otázka | Správně / možnosti (správná první) |
| --- | --- | --- | --- |
| TEST\_D\_1 | číslo | 3 GB = ? MB | 3 000 |
| TEST\_D\_2 | číslo | 5 000 MB = ? GB | 5 |
| TEST\_D\_3 | číslo | 1 B = ? b | 8 |
| TEST\_D\_4 | číslo | 2 MB = ? kB | 2 000 |
| TEST\_D\_5 | číslo | 500 MB = ? GB | 0,5 |
| TEST\_D\_6 | číslo | 16 b = ? B | 2 |
| TEST\_D\_7 | výběr | Který soubor je největší? | 1,5 GB · 1 200 MB · 800 000 kB · 9 000 Mb |
| TEST\_D\_8 | výběr | Internet má rychlost 80 Mb/s. Kolik MB stáhne za 1 sekundu? | 10 · 80 · 640 · 8 |

### Zpětná vazba po každé otázce

Žák nejdřív dá ZKONTROLOVAT: výběr ukáže správnou možnost zeleně a zvolenou špatnou červeně, u čísla se vypíše jeho odpověď a správná. Bajtík řekne `R6_FB_OK`, nebo `R6_FB_KO`, s vysvětlením `{why}`. Dál se pokračuje tlačítkem DALŠÍ v testu nebo „Dál ›“ v bublině.

| ID | Text vysvětlení |
| --- | --- |
| TEST\_B\_WHY | Sečti hodnoty pozic, kde je jednička: {decomp} = {ans}. |
| TEST\_C\_WHY | V desítkové je to {a} {op} {b} = {dec} a {dec} se dvojkově píše {bin}. |
| TEST\_A\_1\_WHY | Dvojková soustava má jen dvě číslice, 0 a 1. Proto dvojková. |
| TEST\_A\_2\_WHY | Bit je nejmenší kousek informace, jen 0, nebo 1. Bajt je až skupina 8 bitů. |
| TEST\_A\_3\_WHY | Bajt je skupina 8 bitů, proto 1 B = 8 b. |
| TEST\_A\_4\_WHY | Základ říká, kolik různých číslic soustava má: desítková 10, dvojková 2. |
| TEST\_A\_5\_WHY | Barvy se píší šestnáctkově, proto v nich jsou písmena A–F. FF je 255, nejsilnější světlo. |
| TEST\_A\_6\_WHY | Tranzistor v počítači zná jen dva stavy: proud teče, nebo neteče. Na to stačí 1 a 0. |
| TEST\_A\_7\_WHY | Minuta má 60 sekund a hodina 60 minut, to je šedesátková soustava. |
| TEST\_A\_8\_WHY | Bajt se píše velkým B, malé b je bit. |
| TEST\_D\_1\_WHY | Z GB na MB je schod dolů, takže násobíš: 3 × 1 000 = 3 000 MB. |
| TEST\_D\_2\_WHY | Z MB na GB je schod nahoru, takže dělíš: 5 000 ÷ 1 000 = 5 GB. |
| TEST\_D\_3\_WHY | Bajt má 8 bitů, takže 1 B = 8 b. |
| TEST\_D\_4\_WHY | Z MB na kB je schod dolů, takže násobíš: 2 × 1 000 = 2 000 kB. |
| TEST\_D\_5\_WHY | Z MB na GB je schod nahoru, takže dělíš: 500 ÷ 1 000 = 0,5 GB. |
| TEST\_D\_6\_WHY | Z bitů na bajty dělíš osmi: 16 ÷ 8 = 2 B. |
| TEST\_D\_7\_WHY | Převeď vše na MB: 1,5 GB = 1 500 MB, 800 000 kB = 800 MB. // 9 000 Mb jsou megabity, takže ÷ 8 = 1 125 MB. Největší je 1,5 GB. |
| TEST\_D\_8\_WHY | Mb jsou megabity a na megabajty se dělí osmi: 80 ÷ 8 = 10 MB. |

## 7. Cvičiště

### Místnost a společné popisky

| ID | Výraz | Text |
| --- | --- | --- |
| R7\_INTRO | radost | Vítej ve cvičišti! Tady se nic nepočítá, jen se trénuje. // \[neutrální\] Každý automat procvičuje jednu oblast z testu. Začni ukázkou a pak to zkus. |
| R7\_REVISIT | neutrální | Který automat to dneska bude? |
| R7\_TASK | neutrální | Vyber si automat a trénuj. Až si budeš věřit, vrať se do kajuty k testu. |
| TRAIN\_A\_NAME | – | A · Asteroidová střelnice |
| TRAIN\_B\_NAME | – | B · Sčítačka |
| TRAIN\_C\_NAME | – | C · Převodník |
| TRAIN\_D\_NAME | – | D · Pexeso pojmů |
| TRAIN\_DEMO | – | Ukázka |
| TRAIN\_NEXT | – | Další příklad |
| TRAIN\_CHECK | – | Zkontrolovat |

### A – Asteroidová střelnice

| ID | Text |
| --- | --- |
| TRAIN\_A\_INTRO | Zaměřovač ukazuje desítkové číslo. Sestřel asteroid, na kterém je to samé číslo ve dvojkové. Takhle postupně všechny 4. |
| TRAIN\_A\_DEMO | Cíl je 13. // Hodnoty pozic zleva jsou 8, 4, 2, 1. // Asteroid 1101: 8 + 4 + 0 + 1 = 13. Zásah! |
| TRAIN\_A\_HIT | Zásah! {bits} = {decomp} = {target}. |
| TRAIN\_A\_MISS | Vedle! {bits} je {value}, ne {target}. |
| TRAIN\_A\_LVL\_1 – \_4 | Level 1 · 3 bity / Level 2 · 4 bity / Level 3 · 5 bitů / Level 4 · 6 bitů |
| TRAIN\_A\_CLEAR | Všechny 4 asteroidy sestřelené! Odemyká se další level s bitem navíc. |
| TRAIN\_A\_NEXT\_LVL | Další level |
| TRAIN\_A\_CLEAR\_LAST | Všechny 4 asteroidy sestřelené i se 6 bity. Mistrovská střelba! |
| TRAIN\_A\_AGAIN | Nová vlna |

Generátor: level = vlna 4 různých čísel s n bity (level 1 = 3 bity … level 4 = 6 bitů). Zaměřovač ukazuje vždy jedno z ještě nesestřelených čísel; sestřelené asteroidy nemizí znovu. Po celé vlně se odemkne další level, mezi odemčenými lze přepínat.

### B – Sčítačka

| ID | Text |
| --- | --- |
| TRAIN\_B\_INTRO | Počítej pod sebou zprava doleva, stejně jako v desítkové. Kliknutím měníš číslici 0 ↔ 1. |
| TRAIN\_B\_RULES | 0 + 0 = 0 · 0 + 1 = 1 · 1 + 1 = 10 · 1 + 1 + 1 = 11 |
| TRAIN\_B\_DEMO\_ADD | Sčítáme 0101 + 0011, tedy 5 + 3. // Vpravo: 1 + 1 = 2 a dvojka se ve dvojkové píše 10. Píšu 0 a 1 přenáším doleva. // Pamatuješ na počítadla v technické místnosti? Když se kolečko přetočí, poskočí to vedlejší. To je přenos. // Další sloupec: 0 + 1 + přenos 1 = 10. Zase píšu 0 a přenáším 1. // Třetí sloupec: 1 + 0 + 1 = 10, píšu 0, přenos 1. Poslední: 0 + 0 + 1 = 1. // Výsledek je 1000, tedy 8. Sedí to! |
| TRAIN\_B\_DEMO\_SUB | Odčítáme 0110 − 0011, tedy 6 − 3. // Vpravo: 0 − 1 nejde, půjčím si 1 z vedlejšího sloupce. Půjčená jednička má tady hodnotu 2, takže 2 − 1 = 1. // Druhý sloupec měl 1, ale půjčil ji, zbyla 0. 0 − 1 zase nejde, půjčím si znovu: 2 − 1 = 1. // Třetí sloupec půjčil, má 0. 0 − 0 = 0. Poslední 0 − 0 = 0. // Výsledek je 0011, tedy 3. Sedí to! |
| TRAIN\_B\_OK | Správně! {a} {op} {b} = {result}, v desítkové {dec}. |
| TRAIN\_B\_WRONG | Ve zvýrazněném sloupci je chyba. Nezapomeň na přenos nebo půjčku z vedlejšího sloupce. |
| TRAIN\_B\_LVL\_1 | Sčítání bez přenosu |
| TRAIN\_B\_LVL\_2 | Sčítání s přenosem |
| TRAIN\_B\_LVL\_3 | Odčítání bez půjčování |
| TRAIN\_B\_LVL\_4 | Odčítání s půjčováním |

Generátor (4bitová čísla, výsledek nejvýše 31): úroveň 1 `a & b == 0`; úroveň 2 `a & b != 0`; úroveň 3 `(a & b) == b`; úroveň 4 `a > b` a `(a & b) != b`. Po 3 správných se nabídne další úroveň, úroveň jde přepnout i ručně.

### C – Převodník

| ID | Text |
| --- | --- |
| TRAIN\_C\_INTRO | Převáděj po žebříku. Dolů na menší jednotku násobíš, nahoru na větší dělíš. |
| TRAIN\_C\_DEMO | Převedeme 3 GB na MB. Z GB na MB je jeden schod dolů. // Dolů se násobí 1 000: 3 × 1 000 = 3 000 MB. |
| TRAIN\_C\_OK | Přesně! {q} = {a}. |
| TRAIN\_C\_WRONG | Ještě ne. Správně je {a}, protože {path}. |

Generátor: nejdřív 1 schod (např. 3 GB → MB, 7 000 kB → MB, 4 B → b, 24 b → B), po 5 správných i 2 schody (2 GB → kB) a bity s předponou (16 Mb → MB je ÷ 8). `{path}` vypisuje schody, např. „GB → MB je × 1 000“.

### D – Pexeso pojmů (TRAIN\_D\_PAIRS)

| Pojem | Vysvětlení |
| --- | --- |
| bit | Nejmenší jednotka informace: 0, nebo 1 |
| bajt (B) | Skupina 8 bitů |
| základ soustavy | Kolik různých číslic soustava používá |
| poziční zápis | Hodnota číslice závisí na tom, na kterém místě stojí |
| dvojková soustava | Jen číslice 0 a 1, jazyk počítačů |
| šestnáctková soustava | Číslice 0–9 a A–F, třeba barvy #FF0000 |
| přenos | Jednička, která při sčítání přeteče do vyššího řádu |
| kilobajt (kB) | 1 000 bajtů |

| ID | Text |
| --- | --- |
| TRAIN\_D\_INTRO | Najdi dvojice: pojem a jeho vysvětlení. Otáčej vždy dvě karty. |
| TRAIN\_D\_MATCH | Dvojice! {term}: {definition}. |
| TRAIN\_D\_DONE | Všechny dvojice nalezené! |
| TRAIN\_D\_AGAIN | Nové rozdání |

## 8. Vítězná obrazovka a diplom

| ID | Výraz | Text |
| --- | --- | --- |
| WIN\_TITLE | – | SOS přijato! |
| WIN\_TEXT | – | Všechny systémy jsou opravené a záchranná loď ze stanice Orion-7 je na cestě. Skvělá práce! |
| WIN\_BAJTIK | radost | Tohle si zasloužíš. Napiš své jméno a vytisknu ti diplom! |
| WIN\_NAME\_LABEL | – | Tvoje jméno na diplom |
| WIN\_NAME\_PLACEHOLDER | – | Jméno a příjmení |
| WIN\_GET\_DIPLOMA | – | Získat diplom |
| WIN\_REPLAY | – | Zahrát si znovu: |
| WIN\_REPLAY\_ALL | – | Celou hru |
| DIPLOMA\_TITLE | – | Diplom |
| DIPLOMA\_SUBTITLE | – | za záchranu vesmírné lodi |
| DIPLOMA\_TEXT | – | za opravu reaktoru, archivu a navigace a za vyslání signálu SOS. Dvojková soustava, bity a bajty už pro tebe nejsou žádná záhada. |
| DIPLOMA\_SYSTEMS | – | Reaktor · Archiv · Navigace · Vysílač SOS |
| DIPLOMA\_DATE | – | Dne {date} |
| DIPLOMA\_SIGN | – | Bajtík, opravářský robot |
| DIPLOMA\_PS | – | PS: 01000100 01001001 01001011 01011001 |
| DIPLOMA\_PRINT | – | Vytisknout / uložit jako PDF |

Pořadí na diplomu: DIPLOMA\_TITLE, DIPLOMA\_SUBTITLE, jméno žáka velkým písmem, DIPLOMA\_TEXT, ikony s DIPLOMA\_SYSTEMS, vlevo dole DIPLOMA\_DATE, vpravo dole kresba Bajtíka s DIPLOMA\_SIGN, pod ní drobně DIPLOMA\_PS. PS je v ASCII slovo „DIKY“ (68, 73, 75, 89), malá odměna pro zvídavé.
