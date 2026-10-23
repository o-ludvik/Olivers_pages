import fs from "node:fs";
import path from "node:path";
import { href } from "../src/js/router.js";

const [sectionSlug, title] = process.argv.slice(2);
const fail = msg => { console.error(msg); process.exit(1); };
if (!sectionSlug || !title) fail('Použití: npm run new -- <slug-sekce> "Název úlohy"');

const sections = path.join(import.meta.dirname, "..", "content", "sections");
const dirName = fs.readdirSync(sections).find(d => d.replace(/^\d+-/, "") === sectionSlug);
if (!dirName) fail(`Sekce "${sectionSlug}" neexistuje. Sekce: ${fs.readdirSync(sections).map(d => d.replace(/^\d+-/, "")).join(", ")}`);
const dir = path.join(sections, dirName);

const slug = title.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
if (!slug) fail("Z názvu nejde udělat slug (potřebuje aspoň jedno písmeno nebo číslici).");
const tasks = fs.readdirSync(dir).map(f => /^(\d+)-(.+)\.json$/.exec(f)).filter(Boolean);
if (tasks.some(m => m[2] === slug)) fail(`Úloha se slugem "${slug}" už v sekci ${sectionSlug} je.`);

// Nejvyšší prefix + 1, počet číslic zůstane (07 → 08).
const last = tasks.reduce((a, m) => Number(m[1]) > Number(a) ? m[1] : a, "00");
const prefix = String(Number(last) + 1).padStart(last.length, "0");
const file = path.join(dir, `${prefix}-${slug}.json`);

const template = {
  title, level: 1, text: [""], visual: { type: "cards", data: [] }, question: "",
  answer: { type: "choice", options: ["", "", "", ""], correct: "A" }, hint: "",
  solution: { steps: [""], mistake: "", why: "", traps: { B: "", C: "", D: "" } }
};
fs.writeFileSync(file, JSON.stringify(template, null, 2) + "\n");
console.log(`Vytvořeno: ${path.relative(process.cwd(), file)}`);
console.log(`Adresa:    ${href({ section: sectionSlug, question: slug })}`);
console.log("Vyplň ji podle docs/CONTENT_SCHEMA.md a docs/PRAVIDLA_ULOH.md, nepoužitá volitelná pole smaž a spusť npm run check.");
