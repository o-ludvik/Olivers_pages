# Design

Vzhled zůstává **stejný jako v originálu**. Zdroj pravdy: `reference/original-styles.css` a markup v renderovacích funkcích `reference/original-index.html` (`renderHome`, `renderTopic`, `renderTask`, `explainHtml`, `badgesHtml`). Při pochybnostech otevři originál v prohlížeči a porovnej.

## Fonty

Google Fonts: **Baloo 2** (500, 700, 800) na nadpisy, **Nunito** (400, 600, 700, 800) na text. Načíst přes `<link rel="preconnect">` + stylesheet jako originál, vždy s fallbackem (`"Trebuchet MS", system-ui, sans-serif` a `"Segoe UI", system-ui, sans-serif`). Google Fonts jsou jediný externí zdroj.

## Barvy (CSS proměnné na `:root`)

| Token | Světlý | Tmavý | Použití |
|---|---|---|---|
| `--bg` | `#E6F2EE` | `#0F201E` | pozadí stránky |
| `--surface` | `#FFFFFF` | `#17302C` | karty |
| `--surface-2` | `#F1F8F5` | `#1C3833` | vnořené plochy, vizualizace |
| `--ink` | `#1D3634` | `#E4F1ED` | text |
| `--muted` | `#587370` | `#9BB6B0` | vedlejší text |
| `--line` | `#CFE2DC` | `#2A4A44` | okraje, neaktivní hvězdy |
| `--river` / `--river-soft` | `#2C88B0` / `#D3EBF4` | `#55B2DA` / `#173B4A` | primární akce, odkazy, výběr |
| `--wood` / `--wood-soft` | `#94592F` / `#F3E3D4` | `#D09363` / `#3A2B1F` | bobří prvky, kolečka úloh |
| `--leaf` / `--leaf-soft` | `#2F8A50` / `#D8F0E0` | `#5CC07F` / `#1C3F2A` | správně, hotovo |
| `--sun` | `#E9A72B` | `#F4C255` | hvězdy, odznaky |
| `--bad` / `--bad-soft` | `#C9503A` / `#F9E0DA` | `#EB7C64` / `#452621` | špatně |

Tmavý režim přes `@media (prefers-color-scheme: dark)` na `:root:not([data-theme="light"])` + `:root[data-theme="dark"]` přesně jako originál (přepínač v UI se nedělá, ale selektory nechat).

## Komponenty → třídy

| Prvek | Třídy |
|---|---|
| Obal stránky | `.wrap` (max 760 px) |
| Horní lišta | `.bar`, `.brand` (teď `<a>`), `.pill`, `.star` |
| Úvod | `.hero`, `.stats-row`, `.topics`, `.topic` (`.complete`), `.t-ico`, `.t-desc`, `.meter`, `.meta` |
| Odznaky | `.section-title`, `.badges`, `.badge` (`.got`), `.b-ico`, `.newbadge` |
| Sekce | `.back`, `.map-head`, `.summary`, `.tasklist`, `.trow` (`.done`, `.revealed`), `.log`, `.tr-main`, `.tr-title`, `.tr-sub`, `.ladder`, `.diff.d1–d4`, `.stars` |
| Úloha | `.task`, `.chips`, `.chip`, `.text`, `.code`, `.big`, `.visual`, `.question`, `.options` (`.pics`), `.opt` (`.sel`), `.k`, `.answer-input`, `.actions`, `.btn` (`.green`, `.ghost`), `.tries` |
| Zpětná vazba | `.feedback` (`.ok`, `.no`, `.info`), `.big-stars`, `.trap`, `.explain`, `.note`, `.why` |
| Efekty | `.shake`, `@keyframes pop`, `#confetti` (canvas) |
| Patička | `footer`, `.reset`, `.confirm` (inline potvrzení smazání) |

Úpravy kvůli odkazům: `.brand`, `.topic`, `.trow`, `.back` jsou teď `<a>` místo `<button>` – doplnit `text-decoration: none; color: inherit; display: …` tak, aby vypadaly stejně. `.answer-input` má `text-transform: uppercase` – nechat jen pro typ `text` (třída `.answer-input.word`).

## Odstranit (mrtvé po zrušení funkcí)

`.name-row*`, `.grades`, `.grade*` (včetně `.expert`, `.secret`), `.level*`, `.stations*`, `.station*`, `.lock-note`, `.unlock*`, `.btn.finish`, `#modal`, `.m-card*`, `.m-sum`. Pravidlo `.log` ponechat (používá ho `.trow`), `.plan` ponechat (pro blok `html` s tabulkou).

## Nové prvky (střídmě, ve stejném stylu)

- **Nenalezeno**: karta `.task` s nadpisem „Tohle jsme nenašli“, větou a tlačítkem `.btn` zpět.
- **Další téma** pod seznamem úloh: `.btn.ghost`.
- **Zdroj úlohy** (`source`): `<p class="source">` pod kartou, 13 px, `--muted`.
- **Načítání / chyba obsahu**: jednoduchá `.feedback.info` / `.feedback.no` v místě `main`.

## Logo a favicon

SVG bobra z `.brand` v originálu použít v liště a jako `src/favicon.svg` (barvy natvrdo: `#94592F`, `#F3E3D4`, bílá).

## Pravidla

- Mobil od 320 px; breakpoint `max-width: 480px` z originálu.
- `prefers-reduced-motion` vypíná animace, přechody i konfety.
- Viditelný focus (`outline: 3px solid var(--river)`), i na odkazech.
- Žádné nové barvy mimo tokeny; vizualizace používají `var(--…)` uvnitř SVG, aby fungovaly v tmavém režimu (výjimka: barvy korálků `COL`).
