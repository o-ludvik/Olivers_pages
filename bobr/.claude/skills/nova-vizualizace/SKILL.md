---
name: nova-vizualizace
description: Přidá nový typ obrázku (vizualizace) pro úlohy Bobřího tréninku – renderer SVG v src/js/visuals, validaci dat a dokumentaci. Použij, když úloha potřebuje obrázek, který žádný existující typ (cards, lamps, alphabet, grid, graph, paths, beads, stack, image) neumí a statický obrázek přes "image" by nestačil.
---

# Nový typ vizualizace

Nejdřív zvaž, jestli nestačí existující typ nebo `image` se SVG souborem v `assets/` sekce. Nový typ se vyplatí, když se bude opakovat ve více úlohách s různými daty.

1. Prohlédni existující renderery v `src/js/visuals/` a drž se jejich stylu:
   - čistá funkce `render(data) → string` se `<svg viewBox=… width=… role="img" aria-label="…">`;
   - barvy jen přes `var(--…)` (tmavý režim), písmo zdědí;
   - velikost přirozená (šířka do ~540 px), `.visual` ji na mobilu zmenší;
   - `aria-label` česky popisuje obsah (ne „obrázek“).
2. Vytvoř `src/js/visuals/<typ>.js`, exportuj `render` a `validate(data) → string[]` (seznam chyb česky).
3. Zaregistruj v `src/js/visuals/index.js` (jediné místo, kde je seznam typů; validátor buildu bere typy odsud).
4. Do tabulky vizualizací v `docs/CONTENT_SCHEMA.md` přidej řádek: typ, tvar dat, co kreslí.
5. Přidej test do `tests/` (render vrací SVG s `role="img"`, validate odmítne špatná data).
6. Použij typ v úloze, spusť `npm run check` a `npm test`, zkontroluj v `npm run dev` ve světlém i tmavém režimu a na úzké obrazovce.
