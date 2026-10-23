import fs from "node:fs";
import path from "node:path";

const NAME = /^(\d{2,})-([a-z0-9]+(?:-[a-z0-9]+)*)$/;
const skip = n => n.startsWith("_") || n.startsWith(".");

/* Načte content/ do jednoho objektu. Chyby ve struktuře (názvy, JSON) sbírá do errors, aby je check vypsal všechny najednou. */
export function loadContent(contentDir) {
  const errors = [];
  const rel = p => path.relative(path.dirname(contentDir), p).split(path.sep).join("/");
  const err = (file, msg) => errors.push(`${rel(file)} → ${msg}`);
  const readJson = file => {
    try { return JSON.parse(fs.readFileSync(file, "utf8")); }
    catch (e) { err(file, e.code === "ENOENT" ? "soubor chybí" : `neplatný JSON (${e.message})`); return null; }
  };
  // Seřadí položky NN-slug číselně a ohlásí špatné názvy a duplicitní prefixy/slugy.
  const ordered = (dir, names, ext) => {
    const items = [], prefixes = new Map(), slugs = new Map();
    for (const name of names) {
      const m = NAME.exec(ext ? name.slice(0, -ext.length) : name);
      if (!m || (ext && !name.endsWith(ext))) { err(path.join(dir, name), `název musí mít tvar NN-slug${ext} (číslo, pomlčka, malá písmena bez diakritiky)`); continue; }
      const [, prefix, slug] = m, n = Number(prefix);
      if (prefixes.has(n)) err(path.join(dir, name), `duplicitní pořadové číslo ${prefix} (stejné má ${prefixes.get(n)})`);
      if (slugs.has(slug)) err(path.join(dir, name), `duplicitní slug "${slug}" (stejný má ${slugs.get(slug)})`);
      prefixes.set(n, name); slugs.set(slug, name);
      items.push({ n, slug, name });
    }
    return items.sort((a, b) => a.n - b.n);
  };

  const site = readJson(path.join(contentDir, "site.json"));
  const badges = readJson(path.join(contentDir, "badges.json"));
  const secDir = path.join(contentDir, "sections");
  const secNames = fs.existsSync(secDir) ? fs.readdirSync(secDir).filter(n => !skip(n) && fs.statSync(path.join(secDir, n)).isDirectory()) : [];

  const sections = ordered(secDir, secNames, "").map(({ slug, name }) => {
    const dir = path.join(secDir, name);
    const meta = readJson(path.join(dir, "section.json"));
    const files = fs.readdirSync(dir).filter(n => !skip(n) && n !== "section.json" && n !== "assets");
    const tasks = ordered(dir, files, ".json").map(t => {
      const file = path.join(dir, t.name);
      return { slug: t.slug, file: rel(file), data: readJson(file) };
    });
    return { slug, dir, file: rel(path.join(dir, "section.json")), data: meta, tasks };
  });
  return { site, badges, sections, errors, rel };
}
