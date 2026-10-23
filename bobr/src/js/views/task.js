import { esc, shake } from "../dom.js";
import { href } from "../router.js";
import { nextTask, nextSection } from "../content.js";
import * as progress from "../progress.js";
import { computeStats, earnedBadges } from "../stats.js";
import { LETTERS, optionText, isCorrect, trapKey, answerText, starsFor } from "../answers.js";
import { renderBlocks } from "../components/blocks.js";
import { renderVisual, visualSvg } from "../visuals/index.js";
import { starRow } from "../components/stars.js";
import { diffChip } from "../components/difficulty.js";
import { newBadgeHtml } from "../components/badges.js";
import { confetti } from "../confetti.js";

/* Dočasný stav otevřené úlohy; při každé navigaci se začíná načisto. */
let view;

export function render(root, ctx) {
  view = { choice: null, result: null, trap: null, newBadges: [] };
  draw(root, ctx);
}

function explainHtml(S) {
  return `<div class="explain"><h3>Jak na to krok za krokem</h3><ol>${S.steps.map(x => `<li>${x}</li>`).join("")}</ol>
    ${S.mistake ? `<p class="note"><b>Pozor:</b> ${S.mistake}</p>` : ""}
    ${S.why ? `<p class="why">${S.why}</p>` : ""}</div>`;
}

function answerHtml(t, finished) {
  const a = t.answer;
  if (a.type === "choice") {
    const pics = a.options.some(o => typeof o !== "string");
    const chosen = finished ? t.correct : view.choice;
    return `<div class="options${pics ? " pics" : ""}" role="radiogroup" aria-label="Možnosti odpovědi">${a.options.map((o, i) => { const k = LETTERS[i], on = chosen === k;
      const focusable = on || (!chosen && i === 0);
      return `<button type="button" class="opt ${on ? "sel" : ""}" data-k="${k}" role="radio" aria-checked="${on}" tabindex="${focusable ? 0 : -1}" ${finished ? "disabled" : ""}><span class="k">${k}</span><span>${esc(optionText(o))}${o.visual ? visualSvg(o.visual) : ""}</span></button>`; }).join("")}</div>`;
  }
  const num = a.type === "number";
  return `<input class="answer-input${num ? "" : " word"}" id="answerInput" aria-label="Tvoje odpověď" ${num ? `inputmode="numeric"` : ""} autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${num ? "číslo" : "slovo"}" ${finished ? "disabled" : ""} value="${finished ? esc(answerText(a, t.correct)) : ""}">`;
}

function draw(root, ctx, focusAfter = false) {
  const { data, section: sec, task: t } = ctx;
  const st = progress.getTask(t.id), S = t.solution;
  const finished = st.status === "done" || st.status === "revealed";
  const live = view.result ? ` role="alert"` : "";
  let fb = "";
  if (st.status === "done") {
    fb = `<div class="feedback ok"${live}><h3>Správně! ${view.result === "ok" && !st.seen ? "Paráda." : ""}</h3><div class="big-stars" aria-label="${st.stars} ze 3 hvězdiček">${starRow(st.stars)}</div>${st.seen ? `<p class="tries">Řešení jsi už viděl(a), proto jen 1 hvězdička.</p>` : ""}</div>${newBadgeHtml(data.badges, view.newBadges)}${explainHtml(S)}`;
  } else if (st.status === "revealed") {
    fb = `<div class="feedback info"><h3>Řešení</h3><p>Správná odpověď: <b>${esc(answerText(t.answer, t.correct))}</b></p><p class="tries">Projdi si postup a zkus úlohu znovu tlačítkem dole. Dostaneš za ni nejvýš 1 hvězdičku.</p></div>${explainHtml(S)}`;
  } else if (view.result === "no") {
    fb = `<div class="feedback no"${live}><h3>Ještě ne. Zkus to znovu!</h3>${view.trap ? `<p class="trap">${view.trap}</p>` : ""}${st.attempts >= 2 ? `<p><b>Nápověda:</b> ${t.hint}</p>` : ""}</div>`;
  }
  const next = nextTask(sec, t), nextSec = !next && nextSection(data, sec);
  root.innerHTML = `
    <a class="back" href="${href({ section: sec.slug })}">← ${esc(sec.title)}</a>
    <article class="task" style="margin-top:10px">
      <div class="chips"><span class="chip">${esc(sec.title)}</span>${diffChip(t.level, data.site.levels)}</div>
      <h1>${esc(t.title)}</h1>
      <div class="text">${renderBlocks(t.text)}</div>
      ${renderVisual(t.visual)}
      <div class="question">${t.question}</div>
      ${answerHtml(t, finished)}
      ${fb}
      <div class="actions">
        ${finished ? "" : `<button type="button" class="btn" id="checkBtn">Zkontrolovat</button>`}
        ${!finished && st.attempts >= 3 && !st.seen ? `<button type="button" class="btn ghost" id="revealBtn">Ukaž mi řešení</button>` : ""}
        ${finished && next ? `<a class="btn green" href="${href({ section: sec.slug, question: next.slug })}">Další úloha →</a>` : ""}
        ${finished && nextSec ? `<a class="btn green" href="${href({ section: nextSec.slug })}">Další téma →</a>` : ""}
        ${finished ? `<a class="btn ghost" href="${href({ section: sec.slug })}">Zpět na téma</a>` : ""}
        ${st.status === "revealed" ? `<button type="button" class="btn ghost" id="retryBtn">Zkusit znovu</button>` : ""}
        ${!finished && st.attempts > 0 ? `<span class="tries">Pokus ${st.attempts + 1}</span>` : ""}
      </div>
    </article>
    ${t.source ? `<p class="source">Zdroj: ${esc(t.source)}</p>` : ""}`;

  const redraw = () => { draw(root, ctx, true); ctx.updateBar(); };
  const group = root.querySelector(".options");
  if (group && !finished) {
    const opts = [...group.querySelectorAll(".opt")];
    const select = k => {
      view.choice = k;
      for (const o of opts) { const on = o.dataset.k === k; o.classList.toggle("sel", on); o.setAttribute("aria-checked", on); o.tabIndex = on ? 0 : -1; }
    };
    group.addEventListener("click", e => { const o = e.target.closest(".opt"); if (o) select(o.dataset.k); });
    group.addEventListener("keydown", e => {
      const i = opts.indexOf(document.activeElement), d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (i < 0 || !d) return;
      e.preventDefault();
      const o = opts[(i + d + opts.length) % opts.length];
      select(o.dataset.k); o.focus();
    });
  }
  const inp = root.querySelector("#answerInput");
  if (inp && !finished) inp.addEventListener("keydown", e => { if (e.key === "Enter") check(); });
  const on = (sel, fn) => { const el = root.querySelector(sel); if (el) el.addEventListener("click", fn); };
  on("#checkBtn", check);
  on("#revealBtn", () => { progress.updateTask(t.id, { status: "revealed", stars: 0, seen: true }); view.result = null; redraw(); });
  // Zkusit znovu: pokusy i záznam o zobrazeném řešení zůstávají.
  on("#retryBtn", () => { progress.updateTask(t.id, { status: "new" }); view.result = null; view.trap = null; view.choice = null; redraw(); });

  if (focusAfter) (root.querySelector("#answerInput:not(:disabled), .opt[tabindex='0']:not(:disabled), .actions .btn") || root).focus({ preventScroll: true });

  function check() {
    const val = t.answer.type === "choice" ? view.choice : inp.value;
    if (!val || !String(val).trim()) { shake(root.querySelector(".options, .answer-input")); return; }
    const stats = () => computeStats(data.sections, progress.allTasks());
    const before = earnedBadges(data.badges, stats());
    const attempts = st.attempts + 1;
    if (isCorrect(t.answer.type, t.correct, val)) {
      progress.updateTask(t.id, { attempts, status: "done", stars: starsFor(attempts, st.seen) });
      view.result = "ok"; view.trap = null;
      view.newBadges = earnedBadges(data.badges, stats()).filter(id => !before.includes(id));
      redraw(); confetti();
    } else {
      progress.updateTask(t.id, { attempts });
      view.trap = (S.traps || {})[trapKey(t.answer.type, val)] || null;
      view.result = "no"; redraw();
      shake(root.querySelector(".task"));
    }
  }
}
