import path from "node:path";
import { pathToFileURL } from "node:url";
import { loadContent } from "./lib/content.mjs";
import { validate } from "./lib/validate.mjs";

const root = path.join(import.meta.dirname, "..");

/* Načte a zvaliduje content/, vypíše chyby a varování. Vrací obsah, nebo null při chybě. */
export function checkContent(contentDir = path.join(root, "content")) {
  const content = loadContent(contentDir);
  const { errors, warnings } = validate(content);
  for (const w of warnings) console.warn(`varování: ${w}`);
  for (const e of errors) console.error(`chyba: ${e}`);
  if (errors.length) { console.error(`\nObsah má ${errors.length} ${errors.length === 1 ? "chybu" : errors.length < 5 ? "chyby" : "chyb"}.`); return null; }
  return content;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const content = checkContent();
  if (!content) process.exit(1);
  const n = content.sections.reduce((a, s) => a + s.tasks.length, 0);
  console.log(`Obsah v pořádku: ${content.sections.length} sekcí, ${n} úloh.`);
}
