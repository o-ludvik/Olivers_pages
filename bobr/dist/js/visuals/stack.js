export function render(items) {
  let s = `<svg viewBox="0 0 220 ${items.length * 34 + 20}" width="220" role="img" aria-label="Hromada: dole ${items[0]}, nahoře ${items[items.length - 1]}">`;
  items.forEach((t, i) => { const y = (items.length - 1 - i) * 34 + 10;
    s += `<rect x="40" y="${y}" width="140" height="28" rx="14" fill="var(--wood)"/><text x="110" y="${y + 20}" text-anchor="middle" font-size="17" font-weight="800" fill="var(--surface)">${t}</text>`; });
  return s + `</svg>`;
}

export function validate(d) {
  if (!Array.isArray(d) || !d.length) return ["musí být neprázdné pole textů (první je dole)"];
  return d.some(t => typeof t !== "string" && typeof t !== "number") ? ["položky musí být texty"] : [];
}
