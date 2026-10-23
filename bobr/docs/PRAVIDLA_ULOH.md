# Pravidla pro tvorbu úloh

Platí pro každou novou nebo upravovanou úlohu. Technický formát je v `CONTENT_SCHEMA.md`, tady je obsah a styl. Než začneš psát, přečti si 2–3 existující úlohy ze stejné sekce a stejné obtížnosti.

## 1. Svět a tón

- **Bobří tématika.** Postavy jsou bobři (krátká česká jména: Ota, Ema, Ivo, Lea, Cyril…), prostředí řeka, hráz, rybníky, klády, nora, les. Informatický problém se schová do bobřího příběhu, ne naopak.
- **Tykání**, krátké věty, aktivní slovesa. Žádná ironie, žádné strašení.
- **Žádný věk ani škola.** Nikde nezmiňuj věk, třídu, ročník, „děti“, „žáky“, učitele ani konkrétní skutečné osoby. Ani v `mistake`. Místo „ve třídě děti často…“ piš „Častá chyba: …“.
- **Rod**: kde se oslovuje řešitel v minulém čase, použij „udělal(a)“.
- Jen vlastní úlohy ve stylu Bobříka. Oficiální úlohy Bobříka nekopírovat doslova; když je úloha volně inspirovaná konkrétní oficiální úlohou, uveď to v `source`.

## 2. Obtížnost

| `level` | Název | Co to znamená |
|---|---|---|
| 1 | Lehká | Jedno pravidlo, jeden až dva kroky. Pravidlo je v zadání vysvětlené. Dá se vyřešit z hlavy. |
| 2 | Střední | Dva až čtyři kroky, je dobré si mezivýsledky zapisovat. Pravidlo je stále vysvětlené. |
| 3 | Těžká | Víc kroků nebo kombinace dvou myšlenek, snadno se udělá chyba v půlce. Vyplatí se systematický postup (tabulka, kreslení). |
| 4 | Mistrovská | Je potřeba objevit vzor, zobecnit, nebo uvažovat o všech možnostech (nejmenší počet, kolik různých…). Hrubá síla je zdlouhavá. |

- Sekce jdou **vzestupně** podle obtížnosti: typicky 2× lehká, 2–3× střední, 2× těžká, 1× mistrovská.
- Obtížnost odhaduj podle počtu kroků v `solution.steps` a podle toho, kolik pastí úloha má.

## 3. Struktura úlohy

**`title`** – 2–4 slova, výstižné a hravé („Jeden průchod“, „Robot ve smyčce“). Neprozrazuje řešení.

**`text`** – zadání, ideálně do 60 slov:
- první věta = situace, pak přesné pravidlo;
- klíčová slova pravidla tučně (`<b>zleva doprava</b>`);
- všechno, co je potřeba k řešení, musí být v zadání nebo ve vizualizaci; nic se nepředpokládá;
- pseudokód jako blok `{ "code": … }`, česky: `opakuj 3×:`, odsazení 4 mezery, proměnné jako „krabičky“;
- když navazuje na jinou úlohu, zopakuj pravidlo (úlohy se dají otevírat v libovolném pořadí).

**`visual`** – kdykoli to jde, přidej obrázek. Přednostně existující typ (karty, lampy, graf…), jinak `image`. Data vizualizace musí přesně odpovídat textu.

**`question`** – jedna věta, končí otazníkem, ptá se na jednoznačnou věc. Když hrozí nejasnost, upřesni v závorce („Počítej i ten poslední průchod.“).

**`answer`**:
- `choice` – **4 možnosti** (výjimečně 2–6). Jedna správná. Každá špatná možnost odpovídá **konkrétní typické chybě** (jen jedno kolo místo dvou, posun opačným směrem, záměna zásobníku a fronty…), ne náhodnému nesmyslu. Možnosti stejného tvaru a podobné délky. Pozice správné odpovědi se v sekci střídá – **používej i D** (stávající obsah má D správně nikde).
- `number` – celé číslo. Volit úlohy, kde je typická chyba jiné číslo (o jedna méně, sečteno místo vynásobeno).
- `text` – jedno slovo velkými písmeny, do `correct` všechny přijatelné varianty.

**`hint`** – jedna až dvě věty. Navede na první krok nebo metodu („Udělej si tabulku…“, „Začni od malých čísel…“). **Nesmí obsahovat výsledek** ani vyloučit všechny špatné možnosti.

**`solution.steps`** – 2–6 kroků, každý = jedna akce + mezivýsledek („Porovnám 4 a 3: prohodím. Řada: 1 3 4 2.“). Poslední krok říká odpověď. Píše se v 1. osobě („spočítám“) nebo neosobně, jednotně v rámci úlohy.

**`solution.mistake`** – nejčastější chyba a jak se jí vyhnout. Jedna až dvě věty.

**`solution.why`** – jedna věta, kde se tohle v informatice používá („Tomuto postupu se říká bublinkové řazení.“). Doporučené.

**`solution.traps`** – ke **každé špatné možnosti** u `choice` vysvětlení, co řešitel nejspíš udělal a proč to nesedí. U `number` a `text` pro 2–3 nejpravděpodobnější špatné odpovědi. Tón povzbudivý, bez „špatně“, „chyba“ na začátku – popiš, co se stalo, a navrhni, co zkontrolovat.

## 4. Správnost – povinná kontrola

Každá úloha musí být ověřená **dvakrát nezávisle**:

1. Vyřeš ji ručně podle `solution.steps` a zkontroluj každý mezivýsledek.
2. U algoritmických úloh (řazení, cykly, dvojková soustava, šifry, zásobník/fronta, nejkratší cesty, půlení, počítání možností) ji navíc spočítej **krátkým skriptem** (`node -e "…"`) a výsledek porovnej. Skript do repozitáře neukládej.
3. Zkontroluj, že **žádná špatná možnost není taky správná** (u logických úloh projdi všechny varianty) a že zadání nepřipouští jiný výklad.
4. Ověř, že hint neprozrazuje odpověď a že každá past odpovídá skutečné cestě k dané špatné odpovědi.
5. `npm run check` bez chyb a bez varování pro tuto úlohu.

## 5. Kontrolní seznam před odevzdáním

- [ ] Bobří příběh, tykání, žádný věk / třída / děti.
- [ ] Název 2–4 slova, neprozrazuje řešení.
- [ ] Zadání úplné, pravidlo tučně, do ~60 slov.
- [ ] Vizualizace odpovídá textu (nebo dobrý důvod, proč chybí).
- [ ] Otázka jednoznačná.
- [ ] 4 možnosti, každá špatná = typická chyba, správná pozice ne vždy stejná.
- [ ] Hint navádí, neprozrazuje.
- [ ] Kroky s mezivýsledky, poslední = odpověď.
- [ ] Pasti ke všem špatným možnostem.
- [ ] Nezávisle ověřeno (ručně + skript, je-li to algoritmické).
- [ ] Prefix souboru odpovídá místu v sekci podle obtížnosti; slug z názvu.
- [ ] `npm run check` čistý, úloha v `npm run dev` vypadá dobře i v tmavém režimu a na mobilu.

## 6. Úprava existující úlohy

- Slug (název souboru bez prefixu) neměnit – je to identita úlohy a URL. Pořadí měň jen prefixem.
- Když se mění správná odpověď, je to vlastně jiná úloha – raději vytvoř novou.
