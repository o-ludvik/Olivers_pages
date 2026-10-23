export function render(nums) {
  const w = 64, gap = 14, W = nums.length * (w + gap) - gap + 20;
  let s = `<svg viewBox="0 0 ${W} 110" width="${W}" role="img" aria-label="Karty: ${nums.join(", ")}">`;
  nums.forEach((n, i) => { const x = 10 + i * (w + gap);
    s += `<rect x="${x}" y="10" width="${w}" height="88" rx="10" fill="var(--surface)" stroke="var(--wood)" stroke-width="3"/><text x="${x + w / 2}" y="68" text-anchor="middle" font-size="36" font-weight="800" fill="var(--ink)" font-family="var(--f-display)">${n}</text>`; });
  return s + `</svg>`;
}

export function validate(d) {
  if (!Array.isArray(d) || !d.length) return ["musí být neprázdné pole čísel"];
  return d.some(n => typeof n !== "number" && typeof n !== "string") ? ["karty musí být čísla nebo krátké texty"] : [];
}
