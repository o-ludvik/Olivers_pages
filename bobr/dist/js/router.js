export function parse(search) {
  const p = new URLSearchParams(search);
  return { section: p.get("section") || null, question: p.get("question") || null };
}

export function href({ section, question } = {}) {
  if (!section) return "./";
  const p = new URLSearchParams({ section });
  if (question) p.set("question", question);
  return "?" + p;
}

let render = () => {};

export function navigate(url) {
  history.pushState(null, "", url);
  render();
}

/* Vnitřní odkazy (?… a ./) se překreslí bez reloadu; Ctrl/Cmd/Shift/Alt klik a target nechá na prohlížeči. */
export function start(fn) {
  render = fn;
  addEventListener("popstate", () => render());
  document.addEventListener("click", e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest("a[href]");
    if (!a || a.target) return;
    const h = a.getAttribute("href");
    if (!h.startsWith("?") && h !== "./") return;
    e.preventDefault();
    navigate(h);
  });
}
