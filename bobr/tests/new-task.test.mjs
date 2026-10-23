import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { makeContent } from "./helpers.mjs";

// Skript pracuje vůči své složce, proto kopie scripts/ + src/ do dočasného projektu.
const root = path.join(import.meta.dirname, "..");
const proj = makeContent({ "content/sections/01-razeni/09-devata.json": "{}" });
for (const d of ["scripts", "src"]) fs.cpSync(path.join(root, d), path.join(proj, d), { recursive: true });
const run = (...args) => execFileSync(process.execPath, [path.join(proj, "scripts/new-task.mjs"), ...args], { cwd: proj, encoding: "utf8", stdio: "pipe" });

test("založí kostru s dalším prefixem a slugem bez diakritiky", () => {
  const out = run("razeni", "Žluťoučký kůň!");
  assert.match(out, /\?section=razeni&question=zlutoucky-kun/);
  const t = JSON.parse(fs.readFileSync(path.join(proj, "content/sections/01-razeni/10-zlutoucky-kun.json"), "utf8"));
  assert.equal(t.title, "Žluťoučký kůň!");
  assert.equal(t.level, 1);
});

test("existující slug nebo neznámá sekce skončí chybou", () => {
  assert.throws(() => run("razeni", "Jeden průchod"), /už v sekci/);
  assert.throws(() => run("neni", "X"), /neexistuje/);
});
