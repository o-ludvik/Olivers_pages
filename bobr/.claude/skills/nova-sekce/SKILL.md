---
name: nova-sekce
description: Založí novou sekci (téma) v Bobřím tréninku – složku content/sections/NN-slug se section.json a sadou úloh. Použij, když uživatel chce nové téma, kapitolu nebo okruh úloh.
---

# Nová sekce

1. Přečti `docs/PRAVIDLA_ULOH.md` a `docs/CONTENT_SCHEMA.md` (sekce a úlohy).
2. `ls content/sections/` – zjisti poslední prefix a ověř, že podobné téma ještě neexistuje.
3. Navrhni uživateli: název (1–3 slova), slug (bez diakritiky), ikonu (1–3 znaky – symbol jako `↕`, `⌘`, `½` nebo písmena jako `Aa`, `01`), popis (jedna věta do ~80 znaků, vyjmenuje 2–3 podtémata) a pořadí mezi ostatními sekcemi. Nech schválit.
4. Vytvoř `content/sections/NN-slug/section.json`. Prefix: další volné číslo, nebo pokud má sekce stát mezi existujícími, přečísluj prefixy složek (slugy nikdy neměň).
5. Navrhni sadu úloh (doporučeně 7: 2× lehká, 2× střední, 2× těžká, 1× mistrovská) jako tabulku a nech schválit.
6. Úlohy vytvoř skillem `nova-uloha` (každou ověř).
7. Když sekce potřebuje nový typ obrázku, použij skill `nova-vizualizace` a nejdřív se zeptej.
8. `npm run check`, pak v `npm run dev` zkontroluj dlaždici na úvodu, stránku sekce a odkaz „Další téma“ z předchozí sekce.
9. Shrň: složka, URL `?section=slug`, seznam úloh s obtížností a správnými odpověďmi.

Sekce nesmí být prázdná (validace). Odznaky se přizpůsobí samy (`everySection`, `all`), `badges.json` neměň, pokud to uživatel nechce.
