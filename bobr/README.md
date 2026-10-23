# Bobří trénink

Tréninkové úlohy ve stylu soutěže [Bobřík informatiky](https://www.ibobr.cz). Statický web na GitHub Pages, bez backendu; postup se ukládá jen v prohlížeči.

## Spuštění

Potřeba je Node.js 20.11 nebo novější (žádné `npm install` není potřeba).

```
npm run dev      # http://localhost:8080, po změně stačí F5
npm run check    # kontrola obsahu
npm test
npm run build    # výstup v dist/
```

## Odkazy

- úvod: `./`
- téma: `?section=razeni`
- úloha: `?section=razeni&question=jeden-pruchod`

## Přidání úlohy

1. `npm run new -- razeni "Název úlohy"` – vytvoří `content/sections/01-razeni/NN-nazev-ulohy.json`.
2. Vyplň podle [`docs/CONTENT_SCHEMA.md`](docs/CONTENT_SCHEMA.md) a [`docs/PRAVIDLA_ULOH.md`](docs/PRAVIDLA_ULOH.md).
3. `npm run check`, zkontroluj v `npm run dev`, pak `npm run build` a commitni i `dist/`. Po pushi se web nasadí sám.

Pořadí určuje číslo na začátku názvu souboru (a složky u sekcí). Text za číslem je adresa úlohy – po zveřejnění ho neměň.

S Claude Code stačí napsat třeba „přidej do řazení dvě těžké úlohy“ – použije skill `nova-uloha`.

## Přidání sekce

Nová složka `content/sections/NN-slug/` se souborem `section.json` a aspoň jednou úlohou. Dlaždice na úvodu, odkazy a odznaky se doplní samy.

## Nasazení

Web je složka `bobr/` v repozitáři `Olivers_pages`, který GitHub Pages nasazuje přímo z větve `main` (stejně jako `bajtik/`). Adresa: `https://oliverova-informatika.cz/bobr/`.

- Sestavený web je v `dist/` a **commituje se**. Po každé změně v `content/` nebo `src/` spusť `npm run build` a commitni i `dist/`.
- `bobr/index.html` jen přesměruje na `dist/` (zachová `?section=…&question=…`).
- Workflow `.github/workflows/bobr.yml` v kořeni repozitáře při každém pushi spustí testy, build a zkontroluje, že commitnutý `dist/` odpovídá zdrojům. Nic nenasazuje.

Pozor: v repozitáři jsou správné odpovědi čitelně v `content/`, a protože se nasazuje celá větev, jsou dostupné i na webu pod `bobr/content/…`. V `dist/` jsou zašifrované, ale kdo ví, kam se podívat, je najde.

## Licence

Úlohy jsou vlastní, napsané ve stylu soutěže. Bobřík informatiky (© KI PF JČU) šíří své úlohy pod licencí [CC BY-SA 3.0 CZ](https://creativecommons.org/licenses/by-sa/3.0/cz/); tento projekt je pod stejnou licencí.
