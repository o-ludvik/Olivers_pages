import { test } from "node:test";
import assert from "node:assert/strict";

const mem = new Map();
globalThis.localStorage = { getItem: k => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, String(v)), removeItem: k => mem.delete(k) };
const progress = await import("../src/js/progress.js");

test("uloží, načte znovu a smaže", () => {
  progress.init("k");
  assert.deepEqual(progress.getTask("a/1"), { status: "new", attempts: 0, stars: 0, seen: false });
  progress.updateTask("a/1", { attempts: 2, status: "done", stars: 2 });
  assert.deepEqual(JSON.parse(mem.get("k")), { version: 2, tasks: { "a/1": { status: "done", attempts: 2, stars: 2, seen: false } } });
  progress.init("k");
  assert.equal(progress.getTask("a/1").stars, 2);
  progress.reset();
  assert.ok(!mem.has("k"));
  assert.equal(progress.getTask("a/1").status, "new");
});

test("poškozená data a nefunkční úložiště nespadnou", () => {
  mem.set("k", "{nejde");
  progress.init("k");
  assert.deepEqual(progress.allTasks(), {});
  const saved = globalThis.localStorage;
  globalThis.localStorage = { getItem() { throw new Error("blokováno"); }, setItem() { throw new Error("blokováno"); }, removeItem() { throw new Error("blokováno"); } };
  progress.init("k");
  progress.updateTask("a/1", { attempts: 1 });
  assert.equal(progress.getTask("a/1").attempts, 1);
  progress.reset();
  globalThis.localStorage = saved;
});
