import * as cards from "./cards.js?v=837f6aa983";
import * as lamps from "./lamps.js?v=837f6aa983";
import * as alphabet from "./alphabet.js?v=837f6aa983";
import * as grid from "./grid.js?v=837f6aa983";
import * as graph from "./graph.js?v=837f6aa983";
import * as paths from "./paths.js?v=837f6aa983";
import * as beads from "./beads.js?v=837f6aa983";
import * as stack from "./stack.js?v=837f6aa983";
import * as image from "./image.js?v=837f6aa983";

/* Jediný seznam typů vizualizací – bere ho i validace obsahu. */
export const visuals = { cards, lamps, alphabet, grid, graph, paths, beads, stack, image };

/* Samotné SVG/obrázek – pro možnosti odpovědi (uvnitř <button> nesmí být <div>). */
export const visualSvg = v => [].concat(v || []).map(x => visuals[x.type] ? visuals[x.type].render(x.data) : "").join("");

export const renderVisual = v => [].concat(v || []).map(x => `<div class="visual">${visualSvg(x)}</div>`).join("");
