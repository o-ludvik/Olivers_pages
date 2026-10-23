import { esc } from "../dom.js?v=837f6aa983";
import { href } from "../router.js?v=837f6aa983";
import { nextSection } from "../content.js?v=837f6aa983";
import * as progress from "../progress.js?v=837f6aa983";
import { starRow } from "../components/stars.js?v=837f6aa983";
import { diffChip, ladder } from "../components/difficulty.js?v=837f6aa983";

const STATE = st => st.status === "done" ? (st.seen ? "vyřešeno po zobrazení řešení" : "vyřešeno")
  : st.status === "revealed" ? "zobrazené řešení" : st.attempts ? "rozpracováno" : "";

export function render(root, { data, section: sec, stats }) {
  const b = stats.bySection[sec.slug], next = nextSection(data, sec);
  root.innerHTML = `
    <a class="back" href="./">← Všechna témata</a>
    <div class="map-head"><h1>${esc(sec.title)}</h1><p>${esc(sec.description)} Úlohy jsou seřazené od nejlehčí. Můžeš začít kteroukoli.</p></div>
    <div class="summary"><span class="pill">Vyřešeno ${b.solved} z ${b.total}</span><span class="pill"><span class="star" aria-hidden="true">★</span> ${b.stars} z ${b.total * 3}</span></div>
    <div class="tasklist">${sec.tasks.map((t, i) => { const st = progress.getTask(t.id), state = STATE(st);
      return `<a class="trow ${st.status}" href="${href({ section: sec.slug, question: t.slug })}">
        <span class="log">${i + 1}</span>
        <span class="tr-main"><span class="tr-title">${esc(t.title)}</span><span class="tr-sub">${ladder(t.level)}${diffChip(t.level, data.site.levels)}${state ? `<span>${state}</span>` : ""}</span></span>
        <span class="stars" aria-label="${st.stars} ${st.stars === 1 ? "hvězdička" : st.stars ? "hvězdičky" : "hvězdiček"} ze 3">${starRow(st.stars)}</span></a>`; }).join("")}</div>
    ${next ? `<a class="btn ghost next-topic" href="${href({ section: next.slug })}">Další téma: ${esc(next.title)} →</a>` : ""}`;
}
