export function render(o) {
  const rows = o.rows, n = rows[0].filter(v => typeof v === "number").length, top = o.values ? 34 : 10, H = top + rows.length * 62;
  const W = 40 + n * 56 + 90;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Lampy">`;
  if (o.values) o.values.forEach((v, i) => s += `<text x="${40 + i * 56}" y="22" text-anchor="middle" font-size="17" font-weight="800" fill="var(--muted)">${v}</text>`);
  rows.forEach((row, r) => { const y = top + 26 + r * 62;
    row.forEach((v, i) => {
      if (typeof v === "number") s += `<circle cx="${40 + i * 56}" cy="${y}" r="21" fill="${v ? "var(--sun)" : "var(--surface)"}" stroke="var(--ink)" stroke-width="2"/>`;
      else s += `<text x="${40 + n * 56 - 10}" y="${y + 8}" font-size="22" font-weight="800" fill="var(--ink)">${v}</text>`; }); });
  return s + `</svg>`;
}

export function validate(o) {
  if (!o || typeof o !== "object" || Array.isArray(o)) return ["musí být objekt { rows, values? }"];
  const extra = Object.keys(o).filter(k => k !== "rows" && k !== "values");
  if (extra.length) return [`neznámé pole "${extra[0]}"`];
  if (!Array.isArray(o.rows) || !o.rows.length) return ["rows musí být neprázdné pole řádků"];
  const errs = [];
  let n = null;
  o.rows.forEach((row, r) => {
    if (!Array.isArray(row)) return errs.push(`rows[${r}] musí být pole`);
    const lamps = row.filter(v => typeof v === "number");
    if (lamps.some(v => v !== 0 && v !== 1)) errs.push(`rows[${r}]: lampa může být jen 0 nebo 1`);
    if (row.some((v, i) => typeof v === "string" && i !== row.length - 1)) errs.push(`rows[${r}]: popisek (text) smí být jen na konci řádku`);
    if (row.some(v => typeof v !== "number" && typeof v !== "string")) errs.push(`rows[${r}]: povolené jsou jen 0, 1 a text na konci`);
    if (n === null) n = lamps.length;
    else if (lamps.length !== n) errs.push(`rows[${r}]: má ${lamps.length} lamp, první řádek ${n}`);
  });
  if (o.values !== undefined && (!Array.isArray(o.values) || o.values.length !== n || o.values.some(v => typeof v !== "number")))
    errs.push(`values musí být pole ${n} čísel (jedno nad každou lampou)`);
  return errs;
}
