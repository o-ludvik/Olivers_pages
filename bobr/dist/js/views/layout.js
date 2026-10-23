import * as progress from "../progress.js?v=837f6aa983";

export function renderBar(isHome, stars) {
  document.getElementById("barRight").innerHTML = isHome ? ""
    : `<span class="pill" aria-label="Hvězdičky celkem: ${stars}"><span class="star" aria-hidden="true">★</span> ${stars}</span>`;
}

/* Patička: „Smazat postup“ s inline potvrzením. */
export function initFooter(onReset) {
  const box = document.getElementById("reset");
  const idle = () => { box.innerHTML = `<button type="button" class="reset">Smazat postup</button>`; };
  box.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.answer === "yes") { progress.reset(); idle(); onReset(); box.querySelector("button").focus(); }
    else if (b.dataset.answer === "no") { idle(); box.querySelector("button").focus(); }
    else {
      box.innerHTML = `<span class="confirm">Opravdu smazat všechny vyřešené úlohy a odznaky? <button type="button" class="reset" data-answer="yes">Ano</button> <button type="button" class="reset" data-answer="no">Ne</button></span>`;
      box.querySelector('[data-answer="no"]').focus();
    }
  });
}
