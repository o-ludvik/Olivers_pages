import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { loadContent } from "../scripts/lib/content.mjs";
import { renderBlocks } from "../src/js/components/blocks.js";
import { renderVisual, visuals } from "../src/js/visuals/index.js";

const root = path.join(import.meta.dirname, "..");
const legacy = JSON.parse(fs.readFileSync(path.join(root, "reference/legacy-tasks-decrypted.json"), "utf8"));
const content = loadContent(path.join(root, "content"));
const tasks = content.sections.flatMap(s => s.tasks.map(t => ({ section: s.slug, ...t.data })));
// Úlohy, u kterých se `mistake` přepisoval kvůli zmínkám o třídě a dětech (MIGRATION.md).
// Původní renderery vizualizací (drawVisual) pro porovnání SVG 1:1.
const original = vm.runInNewContext(fs.readFileSync(path.join(root, "reference/original-visuals.js"), "utf8") + "; ({ drawVisual })");
const REWORDED = new Set(["r4", "c3", "d3", "d6", "s3", "l4", "p3", "p5", "f4", "k7"]);

test("počet úloh sedí", () => assert.equal(tasks.length, legacy.length));

for (const [i, old] of legacy.entries()) {
  test(`${old.id}: ${old.title}`, () => {
    const t = tasks[i];
    assert.equal(t.section, old.topic);
    for (const k of ["title", "level", "question", "hint"]) assert.equal(t[k], old[k], k);
    assert.equal(renderBlocks(t.text), old.text, "text");
    assert.equal(t.answer.type, old.type);
    assert.deepEqual(t.answer.options, old.options);
    assert.deepEqual(t.answer.correct, old.sol.a);
    assert.deepEqual(t.solution.steps, old.sol.steps);
    assert.equal(t.solution.why, old.sol.why);
    assert.deepEqual(t.solution.traps, old.sol.traps);
    assert.deepEqual(t.visual, old.visual && { type: old.visual[0], ...(old.visual[1] !== undefined && { data: old.visual[1] }) });
    assert.equal(renderVisual(t.visual), original.drawVisual(old.visual), "SVG vizualizace");
    if (REWORDED.has(old.id)) assert.notEqual(t.solution.mistake, old.sol.mistake, "mistake měl být přepsaný");
    else assert.equal(t.solution.mistake, old.sol.mistake, "mistake");
  });
}

test("všechny typy vizualizací kromě image se v obsahu používají a sedí s originálem", () => {
  const used = new Set(tasks.flatMap(t => [].concat(t.visual || []).map(v => v.type)));
  assert.deepEqual([...used].sort(), Object.keys(visuals).filter(k => k !== "image").sort());
});
