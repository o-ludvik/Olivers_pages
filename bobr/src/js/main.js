import { loadContent, findSection, findTask } from "./content.js";
import { parse, start } from "./router.js";
import { computeStats } from "./stats.js";
import { focusHeading } from "./dom.js";
import * as progress from "./progress.js";
import { renderBar, initFooter } from "./views/layout.js";
import * as home from "./views/home.js";
import * as section from "./views/section.js";
import * as task from "./views/task.js";
import * as notFound from "./views/not-found.js";

const app = document.getElementById("app");
let data, current = null;

const stats = () => computeStats(data.sections, progress.allTasks());
const updateBar = () => renderBar(!current || current.view === home, stats().stars);

/* Vybere pohled podle URL. */
function resolve() {
  const { section: s, question: q } = parse(location.search);
  const sec = s && findSection(data, s);
  if (!s && !q) return { view: home, title: [] };
  if (!sec) return { view: notFound, title: ["Tohle jsme nenašli"] };
  if (!q) return { view: section, section: sec, title: [sec.title] };
  const t = findTask(sec, q);
  return t ? { view: task, section: sec, task: t, title: [t.title, sec.title] } : { view: notFound, section: sec, title: ["Tohle jsme nenašli"] };
}

/* nav = přechod na jiný pohled: posun nahoru a focus na nadpis. */
function render(nav = true) {
  current = resolve();
  document.title = [...current.title, data.site.title].join(" · ");
  current.view.render(app, { data, section: current.section, task: current.task, stats: stats(), updateBar });
  updateBar();
  if (nav) { window.scrollTo({ top: 0 }); focusHeading(app); }
}

try {
  app.innerHTML = `<div class="feedback info"><p>Načítám úlohy…</p></div>`;
  data = await loadContent();
} catch (e) {
  app.innerHTML = `<div class="feedback no"><h3>Úlohy se nepodařilo načíst</h3><p>Zkontroluj připojení k internetu a načti stránku znovu.</p></div>`;
  throw e;
}
progress.init(data.site.storageKey);
start(render);
initFooter(() => render(false));
// Jiná záložka změnila postup: překreslit, ale nezahodit rozepsanou odpověď v jiné úloze.
progress.onExternalChange(changed => {
  if (current.view !== task || changed(current.task.id)) render(false);
  else updateBar();
});
render(false);
