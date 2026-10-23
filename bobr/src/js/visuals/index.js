import * as cards from "./cards.js";
import * as lamps from "./lamps.js";
import * as alphabet from "./alphabet.js";
import * as grid from "./grid.js";
import * as graph from "./graph.js";
import * as paths from "./paths.js";
import * as beads from "./beads.js";
import * as stack from "./stack.js";
import * as image from "./image.js";

/* Jediný seznam typů vizualizací – bere ho i validace obsahu. */
export const visuals = { cards, lamps, alphabet, grid, graph, paths, beads, stack, image };

/* Samotné SVG/obrázek – pro možnosti odpovědi (uvnitř <button> nesmí být <div>). */
export const visualSvg = v => [].concat(v || []).map(x => visuals[x.type] ? visuals[x.type].render(x.data) : "").join("");

export const renderVisual = v => [].concat(v || []).map(x => `<div class="visual">${visualSvg(x)}</div>`).join("");
