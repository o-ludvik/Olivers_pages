import { esc } from "../dom.js";
import { hasBadge } from "../stats.js";

const BADGE_ICON = `<svg class="b-ico" viewBox="0 0 34 34" aria-hidden="true"><path d="M17 2 L21 12 L32 13 L23.5 20 L26 31 L17 25 L8 31 L10.5 20 L2 13 L13 12 Z" fill="currentColor"/></svg>`;

export function badgesHtml(badges, s) {
  const got = badges.filter(b => hasBadge(b, s));
  return `<h2 class="section-title">Odznaky (${got.length} z ${badges.length})</h2><div class="badges">${badges.map(b => { const has = got.includes(b);
    return `<div class="badge ${has ? "got" : ""}" style="color:${has ? "var(--sun)" : "var(--line)"}">${BADGE_ICON}<strong style="color:var(--ink)">${esc(b.name)}</strong><span>${esc(b.desc)}${has ? "" : `<span class="sr-only"> (zatím nezískaný)</span>`}</span></div>`; }).join("")}</div>`;
}

export function newBadgeHtml(badges, ids) {
  return ids.map(id => { const b = badges.find(x => x.id === id); return `<div class="newbadge">${BADGE_ICON}<span>Nový odznak: <strong>${esc(b.name)}</strong></span></div>`; }).join("");
}
