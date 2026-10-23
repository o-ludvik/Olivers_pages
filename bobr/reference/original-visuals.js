/* Vytaženo z original-index.html: renderery obrázků k úlohám (port 1:1 do src/js/visuals/). */
const COL = { r: "#D9533B", b: "#2C88B0", y: "#E9A72B", g: "#2F8A50" };
const VIS = {
  cards(nums) {
    const w = 64, gap = 14, W = nums.length * (w + gap) - gap + 20;
    let s = `<svg viewBox="0 0 ${W} 110" width="${W}" role="img" aria-label="Karty: ${nums.join(", ")}">`;
    nums.forEach((n, i) => { const x = 10 + i * (w + gap);
      s += `<rect x="${x}" y="10" width="${w}" height="88" rx="10" fill="var(--surface)" stroke="var(--wood)" stroke-width="3"/><text x="${x + w / 2}" y="68" text-anchor="middle" font-size="36" font-weight="800" fill="var(--ink)" font-family="var(--f-display)">${n}</text>`; });
    return s + `</svg>`;
  },
  lamps(o) {
    const rows = o.rows, n = rows[0].filter(v => typeof v === "number").length, top = o.values ? 34 : 10, H = top + rows.length * 62;
    const W = 40 + n * 56 + 90;
    let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Lampy">`;
    if (o.values) o.values.forEach((v, i) => s += `<text x="${40 + i * 56}" y="22" text-anchor="middle" font-size="17" font-weight="800" fill="var(--muted)">${v}</text>`);
    rows.forEach((row, r) => { const y = top + 26 + r * 62;
      row.forEach((v, i) => {
        if (typeof v === "number") s += `<circle cx="${40 + i * 56}" cy="${y}" r="21" fill="${v ? "var(--sun)" : "var(--surface)"}" stroke="var(--ink)" stroke-width="2"/>`;
        else s += `<text x="${40 + n * 56 - 10}" y="${y + 8}" font-size="22" font-weight="800" fill="var(--ink)">${v}</text>`; }); });
    return s + `</svg>`;
  },
  alphabet() {
    const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let s = `<svg viewBox="0 0 540 96" width="540" role="img" aria-label="Abeceda od A do Z s pořadím">`;
    L.forEach((ch, i) => { const row = i < 13 ? 0 : 1, col = i % 13, x = 22 + col * 40, y = 26 + row * 46;
      s += `<text x="${x}" y="${y}" font-size="19" font-weight="800" fill="var(--ink)" text-anchor="middle">${ch}</text><text x="${x}" y="${y + 17}" font-size="11" fill="var(--muted)" text-anchor="middle">${i + 1}</text>`; });
    return s + `</svg>`;
  },
  grid(letters) {
    const n = 5, sz = 56, o = 20;
    let s = `<svg viewBox="0 0 320 320" width="300" role="img" aria-label="Mřížka 5 na 5, start S vlevo dole">`;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) s += `<rect x="${o + c * sz}" y="${o + r * sz}" width="${sz}" height="${sz}" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/>`;
    const put = (c, r, t, fill, col) => `<circle cx="${o + c * sz + sz / 2}" cy="${o + r * sz + sz / 2}" r="20" fill="${fill}"/><text x="${o + c * sz + sz / 2}" y="${o + r * sz + sz / 2 + 8}" text-anchor="middle" font-size="22" font-weight="800" fill="${col}">${t}</text>`;
    s += put(0, 4, "S", "var(--wood)", "var(--surface)");
    letters.forEach(([t, c, r]) => s += put(c, r, t, "var(--river-soft)", "var(--river)"));
    return s + `</svg>`;
  },
  graph(o) {
    const P = o.P, h = Math.max(...Object.values(P).map(p => p[1])) + 40;
    let s = `<svg viewBox="0 0 ${o.w} ${h}" width="${o.w}" role="img" aria-label="Síť míst ${Object.keys(P).join(", ")}">`;
    o.E.forEach(([a, b, wt]) => { const [x1, y1] = P[a], [x2, y2] = P[b], mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--river)" stroke-width="6" stroke-linecap="round"/>`;
      if (wt != null) s += `<circle cx="${mx}" cy="${my}" r="14" fill="var(--surface)" stroke="var(--river)" stroke-width="2"/><text x="${mx}" y="${my + 6}" text-anchor="middle" font-size="16" font-weight="800" fill="var(--ink)">${wt}</text>`; });
    Object.entries(P).forEach(([k, [x, y]]) => { const hot = k === o.start;
      s += `<circle cx="${x}" cy="${y}" r="24" fill="${hot ? "var(--wood)" : "var(--river-soft)"}" stroke="var(--river)" stroke-width="3"/><text x="${x}" y="${y + 8}" text-anchor="middle" font-size="22" font-weight="800" fill="${hot ? "var(--surface)" : "var(--river)"}">${k}</text>`; });
    return s + `</svg>`;
  },
  paths(o) {
    const sz = 64, pad = 16, W = o.cols * sz + pad * 2, H = o.rows * sz + pad * 2;
    let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Mřížka ${o.rows} na ${o.cols} políček, S vlevo nahoře, H vpravo dole">`;
    for (let r = 0; r < o.rows; r++) for (let c = 0; c < o.cols; c++) s += `<rect x="${pad + c * sz}" y="${pad + r * sz}" width="${sz}" height="${sz}" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/>`;
    const lab = (c, r, t, f) => `<circle cx="${pad + c * sz + sz / 2}" cy="${pad + r * sz + sz / 2}" r="20" fill="${f}"/><text x="${pad + c * sz + sz / 2}" y="${pad + r * sz + sz / 2 + 8}" text-anchor="middle" font-size="22" font-weight="800" fill="var(--surface)">${t}</text>`;
    return s + lab(0, 0, "S", "var(--wood)") + lab(o.cols - 1, o.rows - 1, "H", "var(--leaf)") + `</svg>`;
  },
  beads(seq) {
    let s = `<svg viewBox="0 0 520 90" width="520" role="img" aria-label="Korálky v řadě, pak otazník">`;
    s += `<path d="M10 45 H510" stroke="var(--muted)" stroke-width="3"/>`;
    seq.forEach((c, i) => { const x = 34 + i * 52; s += `<circle cx="${x}" cy="45" r="21" fill="${COL[c]}" stroke="var(--ink)" stroke-width="2"/><text x="${x}" y="84" text-anchor="middle" font-size="13" fill="var(--muted)" font-weight="700">${i + 1}</text>`; });
    const x = 34 + seq.length * 52;
    return s + `<circle cx="${x}" cy="45" r="21" fill="var(--surface)" stroke="var(--ink)" stroke-width="2" stroke-dasharray="5 4"/><text x="${x}" y="53" text-anchor="middle" font-size="24" font-weight="800" fill="var(--ink)">?</text></svg>`;
  },
  stack(items) {
    let s = `<svg viewBox="0 0 220 ${items.length * 34 + 20}" width="220" role="img" aria-label="Hromada: dole ${items[0]}, nahoře ${items[items.length - 1]}">`;
    items.forEach((t, i) => { const y = (items.length - 1 - i) * 34 + 10;
      s += `<rect x="40" y="${y}" width="140" height="28" rx="14" fill="var(--wood)"/><text x="110" y="${y + 20}" text-anchor="middle" font-size="17" font-weight="800" fill="var(--surface)">${t}</text>`; });
    return s + `</svg>`;
  }
};
function drawVisual(v) { if (!v || !VIS[v[0]]) return ""; return `<div class="visual">${VIS[v[0]](v[1])}</div>`; }
