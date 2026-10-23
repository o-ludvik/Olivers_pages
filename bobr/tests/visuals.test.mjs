import { test } from "node:test";
import assert from "node:assert/strict";
import { visuals, renderVisual } from "../src/js/visuals/index.js";

const samples = {
  cards: [4, 1], lamps: { values: [2, 1], rows: [[1, 0, "= 2"]] }, alphabet: undefined, grid: [["A", 1, 2]],
  graph: { P: { A: [30, 30], B: [130, 30] }, E: [["A", "B", 3]], start: "A", w: 200 }, paths: { rows: 2, cols: 3 },
  beads: ["r", "b"], stack: ["a", "b"], image: { src: "a.svg", alt: "Hráz <velká>" }
};

test("každý typ má render a validate, vzorová data projdou", () => {
  for (const [type, mod] of Object.entries(visuals)) {
    assert.deepEqual(mod.validate(samples[type]), [], type);
    const html = mod.render(samples[type]);
    assert.match(html, type === "image" ? /^<img [^>]*alt="Hráz &lt;velká&gt;"/ : /^<svg [^>]*role="img" aria-label="/, type);
  }
});

test("validate odmítne špatná data", () => {
  for (const [type, mod] of Object.entries(visuals)) assert.notDeepEqual(mod.validate(type === "alphabet" ? [1] : 42), [], type);
  assert.notDeepEqual(visuals.lamps.validate({ rows: [[1, 0], [1]] }), []);
  assert.notDeepEqual(visuals.image.validate({ src: "../tajne.svg", alt: "x" }), []);
});

test("pole vizualizací se vykreslí pod sebou", () => {
  assert.equal(renderVisual([{ type: "cards", data: [1] }, { type: "stack", data: ["a"] }]).match(/class="visual"/g).length, 2);
  assert.equal(renderVisual(null), "");
});
