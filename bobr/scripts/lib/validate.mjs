import fs from "node:fs";
import path from "node:path";
import { visuals } from "../../src/js/visuals/index.js";
import { LETTERS, norm, optionText, trapKey } from "../../src/js/answers.js";
import { badInlineTag } from "./inline-html.mjs";

const isObj = v => v !== null && typeof v === "object" && !Array.isArray(v);
const isStr = v => typeof v === "string" && v.trim() !== "";

export const RULES = {
  solved: ["min"], perfect: ["min"], level: ["level", "min"], stubborn: ["min"],
  everySection: [], sectionsComplete: ["min"], all: []
};

// Slova, která na webu nemají co dělat (věk, škola). „třídění“ je v pořádku.
const SCHOOL = /(^|[^\p{L}])(tříd(a|y|ě|u|ou|ám|ách|ami)|ročník\p{L}*|dět(i|í|em|mi)|žá(k|ci|ky|kům)|(?<!\d)1?\d\s*(let|roků)(?!\p{L})|(\d+-?|\p{L}+[iuí])let(ý|á|é))(?!\p{L})/iu;

/* Validace načteného obsahu → { errors[], warnings[] }. Hlášky: „soubor → pole: problém“. */
export function validate(content) {
  const errors = [...content.errors], warnings = [];

  function checker(file) {
    const e = (field, msg) => errors.push(`${file} → ${field}: ${msg}`);
    const w = (field, msg) => warnings.push(`${file} → ${field}: ${msg}`);
    return {
      e, w,
      keys(obj, field, required, optional = []) {
        if (!isObj(obj)) { e(field || "(soubor)", "musí být objekt"); return false; }
        for (const k of required) if (obj[k] === undefined) e(field ? `${field}.${k}` : k, "chybí povinné pole");
        for (const k of Object.keys(obj)) if (!required.includes(k) && !optional.includes(k)) e(field ? `${field}.${k}` : k, "neznámé pole (překlep?)");
        return true;
      },
      str(v, field) { if (v !== undefined && !isStr(v)) e(field, "musí být neprázdný text"); },
      inline(v, field) {
        if (v === undefined) return;
        if (!isStr(v)) return e(field, "musí být neprázdný text");
        const bad = badInlineTag(v);
        if (bad) e(field, `nepovolené HTML ${bad} (povoleno: b, strong, i, em, br, sub, sup, code, <b class="big">; znak < piš jako &lt;)`);
        if (SCHOOL.test(v.replace(/<[^>]*>/g, ""))) w(field, "text zmiňuje věk nebo školu (třída, ročník, děti…), přepiš neutrálně");
      },
      visual(v, field, sectionDir) {
        if (Array.isArray(v)) { if (!v.length) e(field, "prázdné pole vizualizací"); v.forEach((x, i) => this.visual(x, `${field}[${i}]`, sectionDir)); return; }
        if (!this.keys(v, field, ["type"], ["data"])) return;
        const mod = visuals[v.type];
        if (!mod) return e(`${field}.type`, `neznámý typ "${v.type}" (známé: ${Object.keys(visuals).join(", ")})`);
        for (const msg of mod.validate(v.data)) e(`${field}.data`, msg);
        if (v.type === "image" && isObj(v.data) && typeof v.data.src === "string" && !fs.existsSync(path.join(sectionDir, "assets", v.data.src)))
          e(`${field}.data.src`, `soubor assets/${v.data.src} v sekci neexistuje`);
      }
    };
  }

  // site.json
  if (content.site) {
    const c = checker("content/site.json");
    if (c.keys(content.site, "", ["title", "titleHtml", "intro", "levels", "storageKey"])) {
      ["title", "titleHtml", "intro", "storageKey"].forEach(k => c.str(content.site[k], k));
      if (c.keys(content.site.levels, "levels", ["1", "2", "3", "4"])) for (const k of ["1", "2", "3", "4"]) c.str(content.site.levels[k], `levels.${k}`);
    }
  }

  // badges.json
  if (content.badges) {
    const c = checker("content/badges.json");
    if (!Array.isArray(content.badges)) c.e("(soubor)", "musí být pole odznaků");
    else {
      const ids = new Set();
      content.badges.forEach((b, i) => {
        const f = `[${i}]`;
        if (!c.keys(b, f, ["id", "name", "desc", "rule"])) return;
        ["id", "name", "desc"].forEach(k => c.str(b[k], `${f}.${k}`));
        if (ids.has(b.id)) c.e(`${f}.id`, `duplicitní id "${b.id}"`);
        ids.add(b.id);
        if (!isObj(b.rule)) return c.e(`${f}.rule`, "musí být objekt");
        const params = RULES[b.rule.type];
        if (!params) return c.e(`${f}.rule.type`, `neznámý typ "${b.rule.type}" (známé: ${Object.keys(RULES).join(", ")})`);
        if (!c.keys(b.rule, `${f}.rule`, ["type", ...params])) return;
        if (params.includes("min") && !(Number.isInteger(b.rule.min) && b.rule.min >= 1)) c.e(`${f}.rule.min`, "musí být celé číslo ≥ 1");
        if (params.includes("level") && ![1, 2, 3, 4].includes(b.rule.level)) c.e(`${f}.rule.level`, "musí být 1–4");
      });
    }
  }

  for (const sec of content.sections) {
    if (sec.data) {
      const c = checker(sec.file);
      if (c.keys(sec.data, "", ["title", "icon", "description"])) {
        c.str(sec.data.title, "title");
        c.str(sec.data.description, "description");
        if (!isStr(sec.data.icon) || [...sec.data.icon].length > 3) c.e("icon", "musí mít 1–3 znaky");
        for (const k of ["title", "description"]) if (isStr(sec.data[k]) && SCHOOL.test(sec.data[k])) c.w(k, "text zmiňuje věk nebo školu, přepiš neutrálně");
      }
    }
    if (!sec.tasks.length) errors.push(`${sec.file.replace(/\/section\.json$/, "/")} → sekce nemá žádnou úlohu`);
    let prevLevel = 0;
    for (const task of sec.tasks) {
      if (!task.data) continue;
      validateTask(task.data, checker(task.file), sec.dir);
      const lv = task.data.level;
      if (Number.isInteger(lv) && lv < prevLevel) warnings.push(`${task.file} → level: sekce není seřazená podle obtížnosti (${lv} po ${prevLevel})`);
      if (Number.isInteger(lv)) prevLevel = Math.max(prevLevel, lv);
    }
  }
  return { errors, warnings };
}

function validateTask(t, c, sectionDir) {
  if (!c.keys(t, "", ["title", "level", "text", "question", "answer", "hint", "solution"], ["visual", "source"])) return;
  if (!isStr(t.title)) c.e("title", "musí být neprázdný text");
  else {
    if (/[<>]/.test(t.title)) c.e("title", "musí být prostý text bez HTML");
    if (t.title.length > 40) c.w("title", `je dlouhý (${t.title.length} znaků, doporučeno do 40)`);
  }
  if (![1, 2, 3, 4].includes(t.level)) c.e("level", "musí být 1, 2, 3 nebo 4");

  if (!Array.isArray(t.text) || !t.text.length) c.e("text", "musí být neprázdné pole bloků");
  else t.text.forEach((b, i) => {
    const f = `text[${i}]`;
    if (typeof b === "string") return c.inline(b, f);
    if (!isObj(b)) return c.e(f, "blok musí být text nebo objekt { list } / { code } / { html }");
    if ("list" in b) {
      if (!c.keys(b, f, ["list"], ["ordered"])) return;
      if (!Array.isArray(b.list) || !b.list.length) return c.e(`${f}.list`, "musí být neprázdné pole");
      if (b.ordered !== undefined && typeof b.ordered !== "boolean") c.e(`${f}.ordered`, "musí být true nebo false");
      b.list.forEach((x, j) => c.inline(x, `${f}.list[${j}]`));
    } else if ("code" in b) {
      if (c.keys(b, f, ["code"]) && !isStr(b.code)) c.e(`${f}.code`, "musí být neprázdný text");
    } else if ("html" in b) {
      if (c.keys(b, f, ["html"])) c.str(b.html, `${f}.html`);
    } else c.e(f, "neznámý blok (povoleno: text, { list }, { code }, { html })");
  });

  if (t.visual !== undefined) c.visual(t.visual, "visual", sectionDir);
  c.inline(t.question, "question");
  c.inline(t.hint, "hint");
  if (t.source !== undefined) c.str(t.source, "source");

  const a = t.answer;
  let correctKeys = null, trapOk = () => false, trapRule = "";
  if (isObj(a)) {
    if (a.type === "choice") {
      if (c.keys(a, "answer", ["type", "options", "correct"])) {
        const opts = Array.isArray(a.options) ? a.options : [];
        if (!Array.isArray(a.options) || opts.length < 2 || opts.length > 6) c.e("answer.options", "musí být pole 2 až 6 možností");
        const seen = new Set(), range = `A–${LETTERS[Math.max(opts.length, 1) - 1]}`;
        opts.forEach((o, i) => {
          const f = `answer.options[${i}]`;
          if (isObj(o)) { if (c.keys(o, f, ["text", "visual"])) { c.str(o.text, `${f}.text`); c.visual(o.visual, `${f}.visual`, sectionDir); } }
          else if (!isStr(o)) return c.e(f, "musí být text nebo { text, visual }");
          const txt = optionText(o);
          if (isStr(txt) && seen.has(norm(txt))) c.e(f, `duplicitní možnost "${txt}"`);
          if (isStr(txt)) seen.add(norm(txt));
        });
        const letters = LETTERS.slice(0, opts.length);
        if (typeof a.correct !== "string" || a.correct.length !== 1 || !letters.includes(a.correct))
          c.e("answer.correct", `písmeno "${a.correct}" neodpovídá žádné možnosti (${range})`);
        correctKeys = [a.correct];
        trapOk = k => k.length === 1 && letters.includes(k);
        trapRule = `musí být písmeno možnosti (${range})`;
      }
    } else if (a.type === "number") {
      if (c.keys(a, "answer", ["type", "correct"])) {
        if (!Number.isFinite(a.correct)) c.e("answer.correct", "musí být číslo (ne text v uvozovkách)");
        correctKeys = [trapKey("number", a.correct)];
        trapOk = k => k === trapKey("number", k);
        trapRule = 'musí být číslo zapsané jako String(Number(…)), např. "5" nebo "2.5"';
      }
    } else if (a.type === "text") {
      if (c.keys(a, "answer", ["type", "correct"])) {
        if (!Array.isArray(a.correct) || !a.correct.length || !a.correct.every(isStr)) c.e("answer.correct", "musí být neprázdné pole přijatelných odpovědí");
        else correctKeys = a.correct.map(norm);
        trapOk = k => k === norm(k);
        trapRule = "musí být normalizovaný text (velká písmena, bez diakritiky a mezer)";
      }
    } else c.e("answer.type", `neznámý typ "${a.type}" (choice, number, text)`);
  } else c.e("answer", "musí být objekt");

  const s = t.solution;
  if (!c.keys(s, "solution", ["steps"], ["mistake", "why", "traps"])) return;
  if (!Array.isArray(s.steps) || s.steps.length < 2 || s.steps.length > 8) c.e("solution.steps", "musí být pole 2 až 8 kroků");
  else s.steps.forEach((x, i) => c.inline(x, `solution.steps[${i}]`));
  c.inline(s.mistake, "solution.mistake");
  c.inline(s.why, "solution.why");
  if (s.traps === undefined) { if (isObj(a) && a.type === "choice") c.w("solution.traps", "chybí pasti ke špatným možnostem"); }
  else if (!isObj(s.traps)) c.e("solution.traps", "musí být objekt { odpověď: vysvětlení }");
  else for (const [k, v] of Object.entries(s.traps)) {
    const f = `solution.traps.${k}`;
    if (correctKeys && !trapOk(k)) c.e(f, `klíč ${trapRule}`);
    else if (correctKeys && correctKeys.includes(k)) c.e(f, "past nesmí být správná odpověď");
    c.inline(v, f);
  }
}
