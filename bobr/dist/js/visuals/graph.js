export function render(o) {
  const P = o.P, h = Math.max(...Object.values(P).map(p => p[1])) + 40;
  let s = `<svg viewBox="0 0 ${o.w} ${h}" width="${o.w}" role="img" aria-label="Síť míst ${Object.keys(P).join(", ")}">`;
  o.E.forEach(([a, b, wt]) => { const [x1, y1] = P[a], [x2, y2] = P[b], mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--river)" stroke-width="6" stroke-linecap="round"/>`;
    if (wt != null) s += `<circle cx="${mx}" cy="${my}" r="14" fill="var(--surface)" stroke="var(--river)" stroke-width="2"/><text x="${mx}" y="${my + 6}" text-anchor="middle" font-size="16" font-weight="800" fill="var(--ink)">${wt}</text>`; });
  Object.entries(P).forEach(([k, [x, y]]) => { const hot = k === o.start;
    s += `<circle cx="${x}" cy="${y}" r="24" fill="${hot ? "var(--wood)" : "var(--river-soft)"}" stroke="var(--river)" stroke-width="3"/><text x="${x}" y="${y + 8}" text-anchor="middle" font-size="22" font-weight="800" fill="${hot ? "var(--surface)" : "var(--river)"}">${k}</text>`; });
  return s + `</svg>`;
}

const point = p => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite);
export function validate(o) {
  if (!o || typeof o !== "object" || Array.isArray(o)) return ["musí být objekt { P, E, w, start? }"];
  const extra = Object.keys(o).filter(k => !["P", "E", "w", "start"].includes(k));
  if (extra.length) return [`neznámé pole "${extra[0]}"`];
  const errs = [];
  if (!o.P || typeof o.P !== "object" || !Object.keys(o.P).length) return ["P musí být objekt míst { \"A\": [x, y] }"];
  for (const [k, p] of Object.entries(o.P)) if (!point(p)) errs.push(`P.${k} musí být [x, y]`);
  if (!Array.isArray(o.E)) errs.push("E musí být pole cest [\"A\", \"B\", váha?]");
  else o.E.forEach((e, i) => {
    if (!Array.isArray(e) || e.length < 2 || e.length > 3) return errs.push(`E[${i}] musí být ["A", "B"] nebo ["A", "B", váha]`);
    for (const k of e.slice(0, 2)) if (!(k in o.P)) errs.push(`E[${i}]: místo "${k}" není v P`);
  });
  if (!Number.isFinite(o.w) || o.w <= 0) errs.push("w (šířka) musí být kladné číslo");
  if (o.start !== undefined && !(o.start in o.P)) errs.push(`start: místo "${o.start}" není v P`);
  return errs;
}
