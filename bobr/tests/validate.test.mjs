import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { loadContent } from "../scripts/lib/content.mjs";
import { validate } from "../scripts/lib/validate.mjs";
import { makeContent, validTask } from "./helpers.mjs";

const run = files => validate(loadContent(path.join(makeContent(files), "content")));
const T = "content/sections/01-razeni/02-nova.json";
const withTask = patch => run({ [T]: { ...validTask(), ...patch } });
const hasError = (res, text) => assert.ok(res.errors.some(e => e.includes(text)), `čekal jsem chybu „${text}“, dostal jsem:\n${res.errors.join("\n")}`);

test("převedený obsah projde bez chyb", () => {
  const res = validate(loadContent(path.join(import.meta.dirname, "..", "content")));
  assert.deepEqual(res.errors, []);
});

test("platná fixture projde a sekce jsou seřazené číselně", () => {
  const c = loadContent(path.join(makeContent({ "content/sections/10-dalsi/section.json": { title: "D", icon: "D", description: "d" }, "content/sections/10-dalsi/05-x.json": validTask(), "content/sections/10-dalsi/_koncept.json": "{" }), "content"));
  assert.deepEqual(validate(c).errors, []);
  assert.deepEqual(c.sections.map(s => s.slug), ["razeni", "cykly", "dalsi"]);
});

test("hláška má tvar soubor → pole: problém", () => {
  const res = withTask({ answer: { type: "choice", options: ["a", "b", "c", "d"], correct: "E" } });
  assert.ok(res.errors.includes(`${T} → answer.correct: písmeno "E" neodpovídá žádné možnosti (A–D)`), res.errors.join("\n"));
});

test("chybné úlohy", () => {
  hasError(run({ [T]: "{ nejde" }), `${T} → neplatný JSON`);
  hasError(withTask({ hitn: "x" }), "hitn: neznámé pole");
  hasError(withTask({ hint: undefined }), "hint: chybí povinné pole");
  hasError(withTask({ level: 5 }), "level: musí být 1, 2, 3 nebo 4");
  hasError(withTask({ text: ["<a href='x'>odkaz</a>"] }), "nepovolené HTML <a href='x'>");
  hasError(withTask({ text: [{ code: "x", list: [] }] }), "text[0].code: neznámé pole");
  hasError(withTask({ answer: { type: "choice", options: ["a"], correct: "A" } }), "2 až 6 možností");
  hasError(withTask({ answer: { type: "choice", options: ["a", "A"], correct: "A" } }), "duplicitní možnost");
  hasError(withTask({ answer: { type: "number", correct: "6" } }), "answer.correct: musí být číslo");
  hasError(withTask({ answer: { type: "text", correct: [] } }), "answer.correct: musí být neprázdné pole");
  hasError(withTask({ answer: { type: "slider", correct: 1 } }), 'answer.type: neznámý typ "slider"');
  hasError(withTask({ solution: { steps: ["jen jeden"] } }), "solution.steps: musí být pole 2 až 8 kroků");
  hasError(withTask({ solution: { steps: ["a", "b"], traps: { B: "x" } } }), "solution.traps.B: past nesmí být správná odpověď");
  hasError(withTask({ solution: { steps: ["a", "b"], traps: { E: "x" } } }), "solution.traps.E: klíč musí být písmeno");
  hasError(withTask({ answer: { type: "number", correct: 6 }, solution: { steps: ["a", "b"], traps: { "05": "x" } } }), "solution.traps.05: klíč musí být číslo");
  hasError(withTask({ answer: { type: "text", correct: ["Kolo"] }, solution: { steps: ["a", "b"], traps: { KOLO: "x" } } }), "past nesmí být správná odpověď");
});

test("chybné vizualizace", () => {
  hasError(withTask({ visual: { type: "ufo", data: 1 } }), 'visual.type: neznámý typ "ufo"');
  hasError(withTask({ visual: [{ type: "cards", data: [1] }, { type: "beads", data: ["x"] }] }), 'visual[1].data: [0]: barva "x"');
  hasError(withTask({ visual: { type: "graph", data: { P: { A: [1, 2] }, E: [["A", "B"]], w: 100 } } }), 'místo "B" není v P');
  hasError(withTask({ visual: { type: "image", data: { src: "chybi.svg", alt: "x" } } }), "soubor assets/chybi.svg v sekci neexistuje");
  hasError(withTask({ visual: { type: "image", data: { src: "a.svg" } } }), "alt (popis obrázku) je povinný");
  const ok = run({ [T]: { ...validTask(), visual: { type: "image", data: { src: "a.svg", alt: "Hráz" } } }, "content/sections/01-razeni/assets/a.svg": "<svg/>" });
  assert.deepEqual(ok.errors, []);
});

test("struktura složek", () => {
  hasError(run({ "content/sections/01-razeni/1-spatne.json": validTask() }), "1-spatne.json → název musí mít tvar NN-slug.json");
  hasError(run({ "content/sections/01-razeni/01-jina.json": validTask() }), "duplicitní pořadové číslo 01");
  hasError(run({ "content/sections/01-razeni/05-jeden-pruchod.json": validTask() }), 'duplicitní slug "jeden-pruchod"');
  hasError(run({ "content/sections/03-prazdna/section.json": { title: "P", icon: "P", description: "p" } }), "content/sections/03-prazdna/ → sekce nemá žádnou úlohu");
  hasError(run({ "content/sections/03-bez/01-a.json": validTask() }), "03-bez/section.json → soubor chybí");
  hasError(run({ "content/badges.json": [{ id: "a", name: "A", desc: "A", rule: { type: "solved" } }, { id: "a", name: "B", desc: "B", rule: { type: "magic" } }] }), "[0].rule.min: chybí povinné pole");
  hasError(run({ "content/badges.json": [{ id: "a", name: "A", desc: "A", rule: { type: "all" } }, { id: "a", name: "B", desc: "B", rule: { type: "magic" } }] }), 'duplicitní id "a"');
});

test("varování", () => {
  const res = withTask({ title: "Velmi dlouhý název úlohy, který se nevejde do řádku", level: 1, solution: { steps: ["Ve třídě to děti pletou.", "b"] } });
  assert.deepEqual(res.errors, []);
  assert.ok(res.warnings.some(w => w.includes("title: je dlouhý")));
  assert.ok(res.warnings.some(w => w.includes("steps[0]: text zmiňuje věk nebo školu")));
  const order = run({ "content/sections/01-razeni/01-jeden-pruchod.json": { ...validTask(), level: 3 }, [T]: validTask() });
  assert.ok(order.warnings.some(w => w.includes("není seřazená podle obtížnosti")));
});
