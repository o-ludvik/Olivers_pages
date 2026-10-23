export const COL = { r: "#D9533B", b: "#2C88B0", y: "#E9A72B", g: "#2F8A50" };

export function render(seq) {
  let s = `<svg viewBox="0 0 520 90" width="520" role="img" aria-label="Korálky v řadě, pak otazník">`;
  s += `<path d="M10 45 H510" stroke="var(--muted)" stroke-width="3"/>`;
  seq.forEach((c, i) => { const x = 34 + i * 52; s += `<circle cx="${x}" cy="45" r="21" fill="${COL[c]}" stroke="var(--ink)" stroke-width="2"/><text x="${x}" y="84" text-anchor="middle" font-size="13" fill="var(--muted)" font-weight="700">${i + 1}</text>`; });
  const x = 34 + seq.length * 52;
  return s + `<circle cx="${x}" cy="45" r="21" fill="var(--surface)" stroke="var(--ink)" stroke-width="2" stroke-dasharray="5 4"/><text x="${x}" y="53" text-anchor="middle" font-size="24" font-weight="800" fill="var(--ink)">?</text></svg>`;
}

export function validate(d) {
  if (!Array.isArray(d) || !d.length) return ["musí být neprázdné pole barev"];
  // ponytail: šířka 520 px je pevná jako v originálu, víc než 8 korálků vyjede z obrázku
  if (d.length > 8) return ["nejvýš 8 korálků (víc se do obrázku nevejde)"];
  return d.flatMap((c, i) => c in COL ? [] : [`[${i}]: barva "${c}" není povolená (r, b, y, g)`]);
}
