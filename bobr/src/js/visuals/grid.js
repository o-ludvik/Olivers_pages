export function render(letters) {
  const n = 5, sz = 56, o = 20;
  let s = `<svg viewBox="0 0 320 320" width="300" role="img" aria-label="Mřížka 5 na 5, start S vlevo dole">`;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) s += `<rect x="${o + c * sz}" y="${o + r * sz}" width="${sz}" height="${sz}" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/>`;
  const put = (c, r, t, fill, col) => `<circle cx="${o + c * sz + sz / 2}" cy="${o + r * sz + sz / 2}" r="20" fill="${fill}"/><text x="${o + c * sz + sz / 2}" y="${o + r * sz + sz / 2 + 8}" text-anchor="middle" font-size="22" font-weight="800" fill="${col}">${t}</text>`;
  s += put(0, 4, "S", "var(--wood)", "var(--surface)");
  letters.forEach(([t, c, r]) => s += put(c, r, t, "var(--river-soft)", "var(--river)"));
  return s + `</svg>`;
}

const cell = v => Number.isInteger(v) && v >= 0 && v <= 4;
export function validate(d) {
  if (!Array.isArray(d)) return ["musí být pole [písmeno, sloupec, řádek]"];
  return d.flatMap((x, i) => Array.isArray(x) && x.length === 3 && typeof x[0] === "string" && x[0] && cell(x[1]) && cell(x[2]) ? []
    : [`[${i}] musí být [písmeno, sloupec 0–4, řádek 0–4]`]);
}
