import { esc } from "../dom.js";
import { href } from "../router.js";
import { badgesHtml } from "../components/badges.js";

export function render(root, { data, stats: s }) {
  root.innerHTML = `
    <section class="hero">
      <h1>${data.site.titleHtml}</h1>
      <p>${data.site.intro}</p>
      <div class="stats-row"><span class="pill">Vyřešeno ${s.solved} z ${s.total}</span><span class="pill"><span class="star" aria-hidden="true">★</span> ${s.stars} z ${s.maxStars}</span></div>
    </section>
    <div class="topics">
      ${data.sections.map(sec => { const b = s.bySection[sec.slug]; return `
        <a class="topic ${b.solved === b.total ? "complete" : ""}" href="${href({ section: sec.slug })}">
          <span class="t-ico" aria-hidden="true">${esc(sec.icon)}</span>
          <h2>${esc(sec.title)}</h2>
          <span class="t-desc">${esc(sec.description)}</span>
          <span class="meter"><i style="width:${Math.round(b.solved / b.total * 100)}%"></i></span>
          <span class="meta"><span>${b.solved} z ${b.total} úloh</span><span><span class="star" aria-hidden="true">★</span> ${b.stars}</span></span>
        </a>`; }).join("")}
    </div>
    ${badgesHtml(data.badges, s)}`;
}
