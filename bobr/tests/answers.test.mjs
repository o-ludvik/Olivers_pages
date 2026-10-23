import { test } from "node:test";
import assert from "node:assert/strict";
import { norm, trapKey, isCorrect, answerText, starsFor } from "../src/js/answers.js";

test("normalizace textu: bez diakritiky, mezer a velikosti písmen", () => {
  assert.equal(norm(" k o l o "), "KOLO");
  assert.equal(norm("Žluťoučký kůň"), "ZLUTOUCKYKUN");
});

test("kontrola odpovědí", () => {
  assert.ok(isCorrect("choice", "B", "B"));
  assert.ok(!isCorrect("choice", "B", "A"));
  assert.ok(isCorrect("number", 2.5, "2,5"));
  assert.ok(isCorrect("number", 9, " 9 "));
  assert.ok(!isCorrect("number", 9, "9 klád"));
  assert.ok(isCorrect("text", ["KOLO", "KOLA"], "kolá"));
  assert.ok(!isCorrect("text", ["KOLO"], "KOLOO"));
});

test("klíč pasti", () => {
  assert.equal(trapKey("number", "05"), "5");
  assert.equal(trapKey("number", "2,50"), "2.5");
  assert.equal(trapKey("text", "Kolá"), "KOLA");
  assert.equal(trapKey("choice", "C"), "C");
});

test("text správné odpovědi a hvězdičky", () => {
  assert.equal(answerText({ type: "choice", options: ["a", { text: "Hráz", visual: {} }] }, "B"), "B) Hráz");
  assert.equal(answerText({ type: "text" }, ["KOLO", "KOLA"]), "KOLO");
  assert.equal(answerText({ type: "number" }, 2.5), "2.5");
  assert.deepEqual([1, 2, 3, 7].map(a => starsFor(a, false)), [3, 2, 1, 1]);
  assert.equal(starsFor(1, true), 1);
});
