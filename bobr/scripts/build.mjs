import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import crypto from "node:crypto";
import { checkContent } from "./check.mjs";
import { encode } from "./lib/cipher.mjs";

const root = path.join(import.meta.dirname, "..");

/* Validace + sestavení statického webu. Vrací true/false, při chybě nechá původní outDir být. */
export function build({ contentDir = path.join(root, "content"), srcDir = path.join(root, "src"), outDir = path.join(root, "dist") } = {}) {
  const content = checkContent(contentDir);
  if (!content) return false;

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.cpSync(srcDir, outDir, { recursive: true, filter: f => !/\.test\.m?js$/.test(f) });

  const secret = {};
  const sections = content.sections.map(sec => {
    const assets = path.join(sec.dir, "assets");
    if (fs.existsSync(assets)) fs.cpSync(assets, path.join(outDir, "assets/content", sec.slug), { recursive: true });
    // Obrázky se servírují z dist/assets/content/<sekce>/, cesta relativní k index.html.
    const fixImages = v => Array.isArray(v) ? v.map(fixImages)
      : v && v.type === "image" ? { ...v, data: { ...v.data, src: `assets/content/${sec.slug}/${v.data.src}` } } : v;
    return {
      slug: sec.slug, title: sec.data.title, icon: sec.data.icon, description: sec.data.description,
      tasks: sec.tasks.map(({ slug, data: t }) => {
        const { correct, ...answer } = t.answer;
        if (answer.options) answer.options = answer.options.map(o => typeof o === "string" ? o : { ...o, visual: fixImages(o.visual) });
        secret[`${sec.slug}/${slug}`] = { correct, solution: t.solution };
        return { slug, title: t.title, level: t.level, text: t.text, visual: fixImages(t.visual) ?? null, question: t.question, answer, hint: t.hint, source: t.source ?? null };
      })
    };
  });
  const json = JSON.stringify({ site: content.site, badges: content.badges, sections, secret: encode(secret) });
  fs.mkdirSync(path.join(outDir, "data"), { recursive: true });
  fs.writeFileSync(path.join(outDir, "data/content.json"), json);

  // Cache busting: ?v=<hash> u CSS/JS v index.html i u importů mezi moduly (GitHub Pages cachuje 10 minut).
  const files = fs.readdirSync(outDir, { recursive: true }).map(f => path.join(outDir, f)).filter(f => fs.statSync(f).isFile()).sort();
  const hash = crypto.createHash("sha256");
  for (const f of files) hash.update(fs.readFileSync(f));
  const v = hash.digest("hex").slice(0, 10);
  for (const f of files) {
    if (f.endsWith(".js")) fs.writeFileSync(f, fs.readFileSync(f, "utf8").replace(/((?:from|import)\s*\(?\s*)"(\.{1,2}\/[^"?]+\.js)"/g, `$1"$2?v=${v}"`));
  }
  const index = path.join(outDir, "index.html");
  fs.writeFileSync(index, fs.readFileSync(index, "utf8").replace(/((?:href|src)=")((?:css|js)\/[^"?]+)"/g, `$1$2?v=${v}"`));
  fs.writeFileSync(path.join(outDir, ".nojekyll"), "");

  const n = sections.reduce((a, s) => a + s.tasks.length, 0);
  console.log(`Build hotový: ${path.relative(process.cwd(), outDir) || "."}/ (${sections.length} sekcí, ${n} úloh, verze ${v})`);
  return true;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!build()) process.exit(1);
}
