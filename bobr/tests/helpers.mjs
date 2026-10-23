import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const roots = [];
process.on("exit", () => roots.forEach(r => fs.rmSync(r, { recursive: true, force: true })));

export const validTask = () => ({
  title: "Jeden průchod", level: 1, text: ["Bobr jde po <b>kartách</b>."],
  visual: { type: "cards", data: [4, 1, 3] },
  question: "Jak budou karty ležet?",
  answer: { type: "choice", options: ["1 3 4", "1 4 3"], correct: "B" },
  hint: "Začni zleva.",
  solution: { steps: ["Krok jedna.", "Krok dva – TAJNY-KROK."], traps: { A: "To je seřazené." } }
});

/* Vytvoří v temp složce minimální platný projekt: content/ se dvěma sekcemi. files = { "relativní/cesta": obsah } přepíše/doplní. */
export function makeContent(files = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "bobr-"));
  roots.push(root);
  const base = {
    "content/site.json": { title: "Bobří trénink", titleHtml: "Bobří <span>trénink</span>", intro: "Úvod.", levels: { 1: "Lehká", 2: "Střední", 3: "Těžká", 4: "Mistrovská" }, storageKey: "test" },
    "content/badges.json": [{ id: "all", name: "Bobří profesor", desc: "Vše", rule: { type: "all" } }],
    "content/sections/01-razeni/section.json": { title: "Řazení", icon: "↕", description: "Karty." },
    "content/sections/01-razeni/01-jeden-pruchod.json": validTask(),
    "content/sections/02-cykly/section.json": { title: "Cykly", icon: "↻", description: "Opakování." },
    "content/sections/02-cykly/01-tleskani.json": { ...validTask(), title: "Tleskání", visual: undefined, answer: { type: "number", correct: 6 }, solution: { steps: ["a", "b"], traps: { "5": "Málo." } } },
    ...files
  };
  for (const [rel, data] of Object.entries(base)) {
    if (data === null) continue;
    const file = path.join(root, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, typeof data === "string" ? data : JSON.stringify(data));
  }
  return root;
}
