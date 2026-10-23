import { test } from "node:test";
import assert from "node:assert/strict";
import { encode, decode } from "../scripts/lib/cipher.mjs";

test("encode/decode zachová data včetně češtiny a emoji", () => {
  const v = { "razeni/x": { correct: ["ŽLUŤOUČKÝ"], solution: { steps: ["→ ★ 🦫", "a".repeat(100000)] } } };
  assert.deepEqual(decode(encode(v)), v);
});

test("výstup je base64 bez čitelného textu", () => {
  const s = encode({ tajne: "Porovnám 4 a 1" });
  assert.match(s, /^[A-Za-z0-9+/]+=*$/);
  assert.ok(!s.includes("Porovn"));
  assert.ok(!Buffer.from(s, "base64").toString().includes("Porovn"));
});
