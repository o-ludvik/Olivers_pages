---
name: revize-uloh
description: Zkontroluje existující úlohy Bobřího tréninku proti pravidlům (správnost, jednoznačnost, styl, pasti, obtížnost, zmínky o věku). Použij, když uživatel chce revizi, kontrolu, audit nebo vylepšení úloh či celé sekce.
---

# Revize úloh

1. Přečti `docs/PRAVIDLA_ULOH.md`.
2. Pro každou úlohu v zadaném rozsahu (soubor, sekce, nebo vše):
   - **správnost** – vyřeš nezávisle (u algoritmických úloh skriptem `node -e`), ověř, že žádná špatná možnost není také správná a že zadání má jediný výklad;
   - **úplnost** – je v zadání všechno potřebné? sedí vizualizace s textem?
   - **hint** neprozrazuje výsledek;
   - **pasti** – existují ke všem špatným možnostem a popisují skutečnou cestu k té odpovědi;
   - **obtížnost** odpovídá definici a pořadí v sekci;
   - **styl** – bobří svět, tykání, délka, žádný věk / třída / děti;
   - pozice správných písmen v sekci (nemá být pořád stejná, chybí D?).
3. Výsledek předlož jako tabulku: soubor, závažnost (chyba / doporučení), problém, návrh opravy. Chyby ve správnosti nahoře.
4. Opravy proveď až po souhlasu. Nikdy neměň slug. Změna správné odpovědi u existující úlohy jen s výslovným souhlasem (uživatelům se tím rozbije uložený postup).
5. Na konci `npm run check`.
