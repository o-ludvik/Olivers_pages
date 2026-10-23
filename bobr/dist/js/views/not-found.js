import { esc } from "../dom.js?v=837f6aa983";
import { href } from "../router.js?v=837f6aa983";

export function render(root, { section }) {
  root.innerHTML = `
    <article class="task notfound">
      <h1>Tohle jsme nenašli</h1>
      <p>Odkaz je možná starý, nebo je v něm překlep.</p>
      <div class="actions">${section
        ? `<a class="btn" href="${href({ section: section.slug })}">← ${esc(section.title)}</a>`
        : `<a class="btn" href="./">← Všechna témata</a>`}</div>
    </article>`;
}
