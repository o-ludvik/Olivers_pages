import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { computeStats, earnedBadges } from "../src/js/stats.js";

const sections = [
  { slug: "a", tasks: [{ slug: "1", level: 1 }, { slug: "2", level: 4 }] },
  { slug: "b", tasks: [{ slug: "1", level: 4 }] }
];
const badges = JSON.parse(fs.readFileSync(new URL("../content/badges.json", import.meta.url)));
const done = (stars, attempts, seen = false) => ({ status: "done", stars, attempts, seen });

test("prázdný postup", () => {
  const s = computeStats(sections, {});
  assert.equal(s.total, 3); assert.equal(s.maxStars, 9); assert.equal(s.solved, 0);
  assert.deepEqual(earnedBadges(badges, s), []);
});

test("statistiky a odznaky", () => {
  const s = computeStats(sections, {
    "a/1": done(3, 1), "a/2": done(1, 4), "b/1": { status: "revealed", stars: 0, attempts: 3, seen: true }, "zmizela/uloha": done(3, 1)
  });
  assert.equal(s.solved, 2); assert.equal(s.stars, 4); assert.equal(s.perfect, 1); assert.equal(s.stubborn, 1);
  assert.deepEqual(s.byLevel, { 1: 1, 4: 1 });
  assert.equal(s.sectionsTouched, 1); assert.equal(s.sectionsComplete, 1);
  assert.deepEqual(s.bySection.a, { solved: 2, total: 2, stars: 4 });
  assert.deepEqual(earnedBadges(badges, s), ["first", "topic", "stubborn"]);
});

test("po zobrazení řešení se nepočítá jako „Nevzdávám to“ a všechno vyřešené dá profesora", () => {
  const s = computeStats(sections, { "a/1": done(1, 5, true), "a/2": done(3, 1), "b/1": done(2, 2) });
  assert.equal(s.stubborn, 0);
  const got = earnedBadges(badges, s);
  assert.ok(got.includes("all") && got.includes("explorer") && !got.includes("brave"));
});
