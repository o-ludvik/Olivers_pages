export function render() {
  const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  let s = `<svg viewBox="0 0 540 96" width="540" role="img" aria-label="Abeceda od A do Z s pořadím">`;
  L.forEach((ch, i) => { const row = i < 13 ? 0 : 1, col = i % 13, x = 22 + col * 40, y = 26 + row * 46;
    s += `<text x="${x}" y="${y}" font-size="19" font-weight="800" fill="var(--ink)" text-anchor="middle">${ch}</text><text x="${x}" y="${y + 17}" font-size="11" fill="var(--muted)" text-anchor="middle">${i + 1}</text>`; });
  return s + `</svg>`;
}

export function validate(d) {
  return d === undefined ? [] : ["abeceda nemá žádná data, pole data vynech"];
}
