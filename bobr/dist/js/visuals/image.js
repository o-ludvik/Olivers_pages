import { esc } from "../dom.js?v=837f6aa983";

export function render(o) {
  return `<img src="${esc(o.src)}" alt="${esc(o.alt)}"${o.width ? ` width="${o.width}"` : ""}>`;
}

export function validate(o) {
  if (!o || typeof o !== "object" || Array.isArray(o)) return ["musí být objekt { src, alt, width? }"];
  const errs = [];
  const extra = Object.keys(o).filter(k => !["src", "alt", "width"].includes(k));
  if (extra.length) errs.push(`neznámé pole "${extra[0]}"`);
  if (typeof o.src !== "string" || !/^[\w-]+(\.[\w-]+)*\.(svg|png|jpe?g|webp)$/i.test(o.src))
    errs.push("src musí být název souboru ze složky assets/ (svg, png, jpg, webp)");
  if (typeof o.alt !== "string" || !o.alt.trim()) errs.push("alt (popis obrázku) je povinný");
  if (o.width !== undefined && !(Number.isFinite(o.width) && o.width > 0)) errs.push("width musí být kladné číslo");
  return errs;
}
