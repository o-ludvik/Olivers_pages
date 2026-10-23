---
name: nova-uloha
description: Vytvoří novou úlohu do Bobřího tréninku (JSON soubor v content/sections/NN-sekce/). Použij, když uživatel chce přidat úlohu, vymyslet úlohy na téma, doplnit sekci nebo převést úlohu z textu/obrázku do formátu webu.
---

# Nová úloha

## Postup

1. **Načti pravidla.** Přečti `docs/PRAVIDLA_ULOH.md` a sekci „Úloha“ v `docs/CONTENT_SCHEMA.md`.
2. **Najdi sekci.** `ls content/sections/`. Když uživatel sekci neurčil, vyber podle tématu a řekni, kam úlohu dáváš. Když žádná nesedí, navrhni novou sekci (skill `nova-sekce`) a zeptej se.
3. **Poznej sekci.** Přečti `section.json` a 2–3 úlohy stejné nebo sousední obtížnosti. Zjisti:
   - jaké obtížnosti v sekci chybí nebo jsou slabě zastoupené;
   - jaká písmena jsou správná u `choice` (ať se střídají, včetně D);
   - jaké vizualizace se používají;
   - jaké myšlenky už úlohy pokrývají (nedělej duplicitu).
4. **Navrhni.** Pokud uživatel nedal hotové zadání, napiš mu krátce 1–3 nápady (název, obtížnost, jádro úlohy v jedné větě, typ odpovědi) a nech ho vybrat. Pokud zadání dal, rovnou pokračuj.
5. **Založ soubor.** `npm run new -- <slug-sekce> "Název úlohy"`. Pak uprav prefix tak, aby úloha stála ve správném místě podle obtížnosti (přejmenuj soubor; když je třeba, přečísluj následující soubory – jen prefixy, nikdy slugy).
6. **Napiš úlohu** podle pravidel: text v blocích, vizualizace, otázka, odpověď, hint, kroky, mistake, why, pasti ke všem špatným možnostem.
7. **Ověř správnost** (povinné, viz pravidla §4):
   - vyřeš ručně podle kroků;
   - u algoritmických úloh spočítej skriptem `node -e "…"` a porovnej;
   - projdi každou špatnou možnost a ujisti se, že správná není;
   - zkontroluj, že hint neprozrazuje výsledek.
8. **Validuj.** `npm run check`. Oprav všechny chyby i varování týkající se nové úlohy.
9. **Shrň uživateli**: cesta k souboru, URL (`?section=…&question=…`), obtížnost, správná odpověď, jak jsi ji ověřil, a co by stálo za vizuální kontrolu v `npm run dev`.

## Když přidáváš víc úloh najednou

- Nejdřív navrhni celou sadu (tabulka: název, obtížnost, jádro, typ odpovědi, správné písmeno) a nech schválit.
- Pak tvoř po jedné a každou ověř zvlášť. Na konci jeden `npm run check`.

## Šablona

```json
{
  "title": "",
  "level": 1,
  "text": [""],
  "visual": { "type": "cards", "data": [] },
  "question": "",
  "answer": { "type": "choice", "options": ["", "", "", ""], "correct": "A" },
  "hint": "",
  "solution": {
    "steps": [""],
    "mistake": "",
    "why": "",
    "traps": { "B": "", "C": "", "D": "" }
  }
}
```

Nepoužité volitelné klíče (`visual`, `mistake`, `why`, `source`) smaž, nenechávej prázdné řetězce.
