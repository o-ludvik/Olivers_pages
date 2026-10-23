import { decode } from "./cipher.js";

/* Načte data/content.json (se stejnou ?v= verzí jako tento modul) a doplní do úloh dešifrované odpovědi a řešení. */
export async function loadContent() {
  const res = await fetch(new URL("../data/content.json" + new URL(import.meta.url).search, import.meta.url));
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const secret = decode(data.secret);
  for (const sec of data.sections) for (const t of sec.tasks) {
    t.id = `${sec.slug}/${t.slug}`;
    Object.assign(t, secret[t.id]);
  }
  return data;
}

export const findSection = (data, slug) => data.sections.find(s => s.slug === slug) || null;
export const findTask = (section, slug) => section.tasks.find(t => t.slug === slug) || null;
export const nextTask = (section, task) => section.tasks[section.tasks.indexOf(task) + 1] || null;
export const nextSection = (data, section) => data.sections[data.sections.indexOf(section) + 1] || null;
