export function render(o) {
  const sz = 64, pad = 16, W = o.cols * sz + pad * 2, H = o.rows * sz + pad * 2;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Mřížka ${o.rows} na ${o.cols} políček, S vlevo nahoře, H vpravo dole">`;
  for (let r = 0; r < o.rows; r++) for (let c = 0; c < o.cols; c++) s += `<rect x="${pad + c * sz}" y="${pad + r * sz}" width="${sz}" height="${sz}" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/>`;
  const lab = (c, r, t, f) => `<circle cx="${pad + c * sz + sz / 2}" cy="${pad + r * sz + sz / 2}" r="20" fill="${f}"/><text x="${pad + c * sz + sz / 2}" y="${pad + r * sz + sz / 2 + 8}" text-anchor="middle" font-size="22" font-weight="800" fill="var(--surface)">${t}</text>`;
  return s + lab(0, 0, "S", "var(--wood)") + lab(o.cols - 1, o.rows - 1, "H", "var(--leaf)") + `</svg>`;
}

const n = v => Number.isInteger(v) && v >= 1 && v <= 12;
export function validate(o) {
  if (!o || typeof o !== "object" || Object.keys(o).sort().join() !== "cols,rows") return ["musí být objekt { rows, cols }"];
  return n(o.rows) && n(o.cols) ? [] : ["rows a cols musí být celá čísla 1–12"];
}
