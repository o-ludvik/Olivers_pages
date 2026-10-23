import { esc } from "../dom.js?v=837f6aa983";

export function renderBlocks(blocks) {
  return blocks.map(b => {
    if (typeof b === "string") return `<p>${b}</p>`;
    if (b.list) { const tag = b.ordered ? "ol" : "ul"; return `<${tag}>${b.list.map(x => `<li>${x}</li>`).join("")}</${tag}>`; }
    if (b.code !== undefined) return `<div class="code">${esc(b.code)}</div>`;
    return b.html;
  }).join("");
}
