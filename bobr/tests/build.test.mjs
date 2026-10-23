import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { build } from "../scripts/build.mjs";
import { loadContent } from "../scripts/lib/content.mjs";
import { decode } from "../src/js/cipher.js";
import { makeContent, validTask } from "./helpers.mjs";

const root = path.join(import.meta.dirname, "..");
const out = fs.mkdtempSync(path.join(os.tmpdir(), "bobr-dist-"));
process.on("exit", () => fs.rmSync(out, { recursive: true, force: true }));
const ok = build({ outDir: out });
const read = f => fs.readFileSync(path.join(out, f), "utf8");
const data = JSON.parse(read("data/content.json"));
const allText = fs.readdirSync(out, { recursive: true }).map(f => path.join(out, f)).filter(f => fs.statSync(f).isFile()).map(f => fs.readFileSync(f, "utf8")).join("\n");

test("build projde a vyrobí statický web", () => {
  assert.ok(ok);
  for (const f of ["index.html", "favicon.svg", "css/styles.css", "js/main.js", ".nojekyll", "data/content.json"]) assert.ok(fs.existsSync(path.join(out, f)), f);
  assert.ok(!fs.existsSync(path.join(out, "reference")));
});

test("content.json má 9 sekcí a 63 úloh bez správných odpovědí", () => {
  assert.equal(data.sections.length, 9);
  const tasks = data.sections.flatMap(s => s.tasks);
  assert.equal(tasks.length, 63);
  for (const t of tasks) { assert.equal(t.answer.correct, undefined); assert.equal(t.solution, undefined); }
  const secret = decode(data.secret);
  assert.equal(Object.keys(secret).length, 63);
  assert.equal(secret["razeni/jeden-pruchod"].correct, "B");
});

test("v dist/ není čitelně žádný krok řešení ani vysvětlení", () => {
  const content = loadContent(path.join(root, "content"));
  const secrets = content.sections.flatMap(s => s.tasks.flatMap(({ data: t }) => [...t.solution.steps, t.solution.why, t.solution.mistake, ...Object.values(t.solution.traps || {})]));
  const leaks = secrets.filter(s => s && s.length > 30 && allText.includes(s));
  assert.deepEqual(leaks, []);
});

test("všechny cesty jsou relativní a s ?v= verzí", () => {
  const html = read("index.html");
  assert.doesNotMatch(html, /(href|src)="\/(?!\/)/);
  assert.match(html, /src="js\/main\.js\?v=[0-9a-f]{10}"/);
  assert.match(html, /href="css\/styles\.css\?v=[0-9a-f]{10}"/);
  assert.match(read("js/main.js"), /from "\.\/[\w/.-]+\.js\?v=[0-9a-f]{10}"/);
  assert.doesNotMatch(allText, /fetch\(\s*["'`]\//);
});

test("obrázky ze složky assets se zkopírují a src se přepíše", () => {
  const src = makeContent({
    "content/sections/01-razeni/02-obrazek.json": { ...validTask(), visual: { type: "image", data: { src: "hraz.svg", alt: "Hráz" } } },
    "content/sections/01-razeni/assets/hraz.svg": "<svg/>"
  });
  const dist = path.join(src, "dist");
  assert.ok(build({ contentDir: path.join(src, "content"), outDir: dist }));
  assert.ok(fs.existsSync(path.join(dist, "assets/content/razeni/hraz.svg")));
  const d = JSON.parse(fs.readFileSync(path.join(dist, "data/content.json"), "utf8"));
  assert.equal(d.sections[0].tasks[1].visual.data.src, "assets/content/razeni/hraz.svg");
});

test("nový soubor úlohy se objeví bez dalších úprav, chyba build zastaví", () => {
  const src = makeContent({ "content/sections/02-cykly/02-nova.json": { ...validTask(), title: "Nová" } });
  const dist = path.join(src, "dist");
  assert.ok(build({ contentDir: path.join(src, "content"), outDir: dist }));
  const d = JSON.parse(fs.readFileSync(path.join(dist, "data/content.json"), "utf8"));
  assert.deepEqual(d.sections[1].tasks.map(t => t.slug), ["tleskani", "nova"]);
  const bad = makeContent({ "content/sections/02-cykly/02-nova.json": { ...validTask(), level: 9 } });
  assert.equal(build({ contentDir: path.join(bad, "content"), outDir: path.join(bad, "dist") }), false);
  assert.ok(!fs.existsSync(path.join(bad, "dist")));
});
