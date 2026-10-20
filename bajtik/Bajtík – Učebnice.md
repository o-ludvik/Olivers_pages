# Bajtík – Učebnice

Oct 20, 2026 · @Oliver

Obsah Bajtíkovy učebnice ve hře. Agent ho přebírá doslova do objektu `TEXTBOOK`, jedna kapitola = jedna položka obsahu; tabulky a příklady v kódových blocích se zobrazí jako tabulky a neproporcionálním písmem.

## Kapitola 1: Číselné soustavy

Číselná soustava je pravidlo, jak zapsat čísla pomocí několika znaků. Těm znakům říkáme **číslice**. Číslice je jen znak (třeba 7), číslo je hodnota, kterou z číslic poskládáme (třeba 347).

### Základ soustavy

**Základ** říká, kolik různých číslic soustava má. Nejvyšší číslice je vždy o jedna menší než základ.

| Soustava | Základ | Číslice |
| --- | --- | --- |
| Dvojková | 2 | 0, 1 |
| Desítková | 10 | 0–9 |
| Šestnáctková | 16 | 0–9, A, B, C, D, E, F |

Aby bylo jasné, ve které soustavě číslo je, píše se základ malým číslem vpravo dole: 101₂ je dvojkové číslo, 101₁₀ desítkové. Jsou to dvě úplně jiné hodnoty!

### Poziční zápis

V čísle 347 má každá číslice jinou váhu podle toho, **kde stojí**:

```
  3      4      7
  ×100   ×10    ×1
= 300  + 40   + 7  = 347
```

Každé místo směrem doleva má 10× větší hodnotu, protože základ je 10. V jiné soustavě to funguje úplně stejně, jen je každé místo doleva tolikrát větší, kolik je základ: ve dvojkové 2×, v šestnáctkové 16×.

### Přetečení

Když na nějakém místě dojdou číslice a přičteš 1, místo se vynuluje a místo vlevo se zvětší o 1. Říká se tomu **přetečení** a jednička, která „přeskočí“ doleva, je **přenos**.

- Desítková: 9 + 1 = **10**, 99 + 1 = **100**
- Dvojková: 1 + 1 = **10**, 11 + 1 = **100**

Přesně tohle ukazovala počítadla v technické místnosti: když se kolečko přetočí na nulu, vedlejší kolečko poskočí. Ve dvojkové se to děje nejčastěji, protože tam je číslic nejmíň.

**Bajtíkův tip:** Ve dvojkové soustavě se „10“ čte „jedna nula“, ne „deset“. Má totiž hodnotu dvě.

## Kapitola 2: Dvojková soustava

Dvojková (binární) soustava má jen dvě číslice, 0 a 1. Jedné takové číslici se říká **bit**. Počítače ji používají, protože jejich spínače mají jen dva stavy: proud teče (1), nebo neteče (0).

### Hodnoty pozic

Každé místo směrem doleva má **dvojnásobnou** hodnotu. Pro pět bitů:

| Pozice | 5. | 4. | 3. | 2. | 1. |
| --- | --- | --- | --- | --- | --- |
| Hodnota | 16 | 8 | 4 | 2 | 1 |

To jsou přesně hodnoty pák v rozvodně. Další pozice by měly hodnotu 32, 64, 128…

### Jak dvojkové číslo přečíst

Napiš si číslo pod hodnoty pozic a sečti hodnoty tam, kde je **1**. Kde je 0, nepočítáš nic.

```
Hodnota:  16   8   4   2   1
Číslo:     1   0   0   1   1
          16 + 0 + 0 + 2 + 1 = 19
```

Takže 10011₂ = 19₁₀. Nuly na začátku hodnotu nemění: 00101 je totéž co 101, tedy 5.

### Jak číslo zapsat dvojkově

Postupuj zleva, od největší hodnoty. U každé se zeptej: **vejde se do toho, co zbývá?**

```
Chci zapsat 19.
16 → vejde se (19 − 16 = zbývá 3)  → 1
 8 → nevejde se                    → 0
 4 → nevejde se                    → 0
 2 → vejde se  (3 − 2 = zbývá 1)   → 1
 1 → vejde se  (1 − 1 = zbývá 0)   → 1
Výsledek: 10011
```

### Čísla 0–15 ve dvojkové

| Desítkově | Dvojkově | Desítkově | Dvojkově |
| --- | --- | --- | --- |
| 0 | 0000 | 8 | 1000 |
| 1 | 0001 | 9 | 1001 |
| 2 | 0010 | 10 | 1010 |
| 3 | 0011 | 11 | 1011 |
| 4 | 0100 | 12 | 1100 |
| 5 | 0101 | 13 | 1101 |
| 6 | 0110 | 14 | 1110 |
| 7 | 0111 | 15 | 1111 |

### Kolik čísel se vejde

Každý bit navíc zdvojnásobí, kolik čísel jde zapsat. Čtyři bity zvládnou 16 čísel (0–15), pět bitů 32 čísel (0–31) a osm bitů 256 čísel (0–255). Největší číslo jsou vždy samé jedničky: 11111 = 31.

**Bajtíkův tip:** Dvojkové číslo, které končí 1, je vždy liché. Jen poslední pozice má totiž lichou hodnotu 1.

## Kapitola 3: Soustavy kolem nás

Lidé dnes nejvíc používají desítkovou soustavu a počítače dvojkovou, ale v běžném životě potkáš i další. Často ani nevíš, že s nimi počítáš.

| Základ | Název | Kde ji dnes potkáš |
| --- | --- | --- |
| 2 | dvojková | Všechno uvnitř počítačů a telefonů: programy, fotky, hudba |
| 8 | osmičková | Kódy transpondérů v letadlech (7700 = nouze), práva k souborům na serverech (755) |
| 10 | desítková | Ceny, známky, měření, běžné počítání |
| 12 | dvanáctková | Tucet (12 kusů), 12 měsíců, 12 hodin na ciferníku |
| 16 | šestnáctková | Barvy na webu (#FF0000), adresy síťových karet |
| 20 | dvacítková | Francouzské číslovky: 80 = quatre-vingts, „čtyři dvacítky“ |
| 60 | šedesátková | Minuty a sekundy, úhly, zeměpisné souřadnice (49° 12′ 30″) |

Podrobnosti ke každé najdeš v knihách v archivu.

### Šestnáctková soustava

Šestnáctková (hexadecimální) soustava potřebuje 16 číslic. Číslic 0–9 je jen deset, a tak si půjčuje písmena:

| Číslice | A | B | C | D | E | F |
| --- | --- | --- | --- | --- | --- | --- |
| Hodnota | 10 | 11 | 12 | 13 | 14 | 15 |

Poziční zápis funguje stejně jako jinde, jen je každé místo doleva 16× větší. Největší dvoumístné číslo je FF:

```
F        F
15 × 16 + 15 × 1 = 255
```

**Proč ji mají programátoři rádi?** Jedna šestnáctková číslice přesně odpovídá čtyřem bitům, takže dvě číslice popíšou celý bajt (8 bitů). Místo dlouhého 11111111 stačí napsat FF. Šestnáctková je tak zkratka, jak lidé zapisují dvojková data.

**Barvy na webu:** zápis #RRGGBB říká, jak silně svítí červená (RR), zelená (GG) a modrá (BB), vždy od 00 (vůbec) do FF (naplno).

| Zápis | Barva |
| --- | --- |
| #FF0000 | červená |
| #00FF00 | zelená |
| #0000FF | modrá |
| #FFFFFF | bílá (všechno naplno) |
| #000000 | černá (nic nesvítí) |

**Bajtíkův tip:** Aby se šestnáctková čísla nepletla s desítkovými, píše se před ně často # (u barev) nebo 0x (v programování), třeba 0xFF.

## Kapitola 4: Bity, bajty a jednotky

Bit je nejmenší kousek informace: 0, nebo 1. Počítač ale data čte a ukládá po skupinách 8 bitů a té se říká **bajt**.

```
1 bajt = 8 bitů
01000001  ← jeden bajt, pro počítač písmeno A
```

### Malé b a velké B

| Značka | Znamená | Příklad |
| --- | --- | --- |
| **b** | bit | rychlost internetu 100 Mb/s |
| **B** | bajt | velikost souboru 3 MB |

Jedno písmenko, ale osmkrát velký rozdíl. Vždycky se dívej, jestli je B velké, nebo malé!

### Předpony: kilo, mega, giga, tera

Velká data se měří s předponami, stejně jako metry a kilometry. Každá předpona je **1 000× víc** než ta předchozí.

| Jednotka | Značka | Kolik bajtů | Přibližně odpovídá |
| --- | --- | --- | --- |
| bajt | B | 1 | jedno písmeno |
| kilobajt | kB | 1 000 | krátká zpráva |
| megabajt | MB | 1 000 000 | fotka z mobilu (asi 3 MB) |
| gigabajt | GB | 1 000 000 000 | film (asi 2–5 GB) |
| terabajt | TB | 1 000 000 000 000 | velký pevný disk |

### Žebřík jednotek

```
TB
 ↕  × 1 000 / ÷ 1 000
GB
 ↕  × 1 000 / ÷ 1 000
MB
 ↕  × 1 000 / ÷ 1 000
kB
 ↕  × 1 000 / ÷ 1 000
B
 ↕  × 8 / ÷ 8
b
```

- Dolů, na **menší** jednotku: **násobíš**. 4 GB = 4 × 1 000 = 4 000 MB.
- Nahoru, na **větší** jednotku: **dělíš**. 2 500 kB = 2 500 ÷ 1 000 = 2,5 MB.
- O dva schody: násobíš (dělíš) dvakrát. 2 GB = 2 × 1 000 × 1 000 = 2 000 000 kB.
- Bity a bajty se stejnou předponou: dělíš nebo násobíš 8. 16 Mb = 16 ÷ 8 = 2 MB.

**Příklad ze života:** internet má rychlost 80 Mb/s (megabitů za sekundu). Za sekundu tedy stáhneš 80 ÷ 8 = **10 MB**. Proto se stahování zdá pomalejší, než slibuje reklama.

### Pozor: někdy se počítá po 1 024

Počítače rády počítají s mocninami dvojky a 2¹⁰ = 1 024 je skoro 1 000. Proto se někde místo 1 000 používá 1 024. Aby se to nepletlo, mají tyto jednotky vlastní názvy: **kibibajt (KiB)**, **mebibajt (MiB)**, **gibibajt (GiB)**.

| Kde | Jak počítá |
| --- | --- |
| Výrobci disků a flashek, macOS, rychlost internetu | po 1 000 |
| Operační paměť (RAM) | po 1 024 |
| Windows (Průzkumník souborů) | po 1 024, ale píše kB, MB, GB |

Proto nový disk s 1 TB ukazuje ve Windows jen asi 931 GB. Nikdo tě neokradl, jen se počítá jinak.

**V téhle hře a ve škole počítáme po 1 000**, pokud zadání neřekne jinak. Vždycky si ale zadání pořádně přečti!

## Kapitola 5: Počítání ve dvojkové soustavě

Ve dvojkové se sčítá a odčítá pod sebou úplně stejně jako v desítkové: zprava doleva, sloupec po sloupci. Rozdíl je jen v tom, že přetéká už při dvojce.

### Sčítání

| Sloupec | Výsledek | Píšeš | Přenášíš |
| --- | --- | --- | --- |
| 0 + 0 | 0 | 0 | – |
| 0 + 1 | 1 | 1 | – |
| 1 + 1 | 10 (dvě) | 0 | 1 |
| 1 + 1 + přenos 1 | 11 (tři) | 1 | 1 |

**Příklad:** 0101 + 0011 (5 + 3)

```
Přenos:    1 1 1
           0 1 0 1
         + 0 0 1 1
         ---------
           1 0 0 0
```

1. Vpravo: 1 + 1 = 10. Píšu 0, přenáším 1.
2. Druhý sloupec: 0 + 1 + 1 = 10. Píšu 0, přenáším 1.
3. Třetí sloupec: 1 + 0 + 1 = 10. Píšu 0, přenáším 1.
4. Čtvrtý sloupec: 0 + 0 + 1 = 1. Píšu 1.

Výsledek 1000₂ = 8. A opravdu 5 + 3 = 8.

### Odčítání

| Sloupec | Výsledek |
| --- | --- |
| 0 − 0 | 0 |
| 1 − 0 | 1 |
| 1 − 1 | 0 |
| 0 − 1 | nejde, půjčíš si 1 z vedlejšího sloupce vlevo: 10 − 1 = 1 |

Půjčená jednička má v pravém sloupci hodnotu **dvě** (protože každé místo doleva je 2× větší). Sloupci, ze kterého si půjčuješ, pak 1 ubude.

**Příklad:** 0110 − 0011 (6 − 3)

```
           0 1 1 0
         − 0 0 1 1
         ---------
           0 0 1 1
```

1. Vpravo: 0 − 1 nejde. Půjčím si z druhého sloupce: 2 − 1 = 1.
2. Druhý sloupec měl 1, půjčil ji, zbyla 0. 0 − 1 zase nejde, půjčím si ze třetího: 2 − 1 = 1.
3. Třetí sloupec měl 1, půjčil ji, zbyla 0. 0 − 0 = 0.
4. Čtvrtý sloupec: 0 − 0 = 0.

Výsledek 0011₂ = 3. A opravdu 6 − 3 = 3.

**Bajtíkův tip:** Kontroluj se v desítkové. Převeď obě čísla i výsledek na desítková a ověř, že příklad sedí.

## Kapitola 6: Slovníček pojmů

| Pojem | Vysvětlení |
| --- | --- |
| bajt (B) | Skupina 8 bitů. Počítač po bajtech čte a ukládá data. |
| bit (b) | Nejmenší jednotka informace: 0, nebo 1. |
| číslice | Znak, ze kterého skládáme čísla (např. 0–9 nebo 0 a 1). |
| desítková soustava | Soustava se základem 10 a číslicemi 0–9. Používají ji lidé. |
| dvojková soustava | Soustava se základem 2 a číslicemi 0 a 1. Používají ji počítače. |
| gigabajt (GB) | 1 000 megabajtů. |
| kibibajt (KiB) | 1 024 bajtů. Používá se třeba u operační paměti. |
| kilobajt (kB) | 1 000 bajtů. |
| megabajt (MB) | 1 000 kilobajtů. |
| poziční zápis | Hodnota číslice závisí na místě, kde v čísle stojí. |
| přenos | Jednička, která při sčítání přeteče do vyššího řádu (doleva). |
| přetečení | Když na jednom místě dojdou číslice, místo se vynuluje a místo vlevo se zvětší o 1. |
| půjčka | Při odčítání si vezmeš 1 z vedlejšího sloupce vlevo, protože číslo nestačí. |
| šestnáctková soustava | Soustava se základem 16 a číslicemi 0–9 a A–F. Barvy na webu, zkratka pro bajty. |
| terabajt (TB) | 1 000 gigabajtů. |
| základ soustavy | Kolik různých číslic soustava používá. |
