export const LETTERS = "ABCDEF";

export const norm = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "").toUpperCase();
const num = val => Number(String(val).replace(",", ".").trim());

export const optionText = o => typeof o === "string" ? o : o.text;

/* Klíč do solution.traps pro danou odpověď. */
export function trapKey(type, val) {
  return type === "number" ? String(num(val)) : type === "choice" ? val : norm(val);
}

export function isCorrect(type, correct, val) {
  if (type === "choice") return val === correct;
  if (type === "number") return num(val) === Number(correct);
  return correct.map(norm).includes(norm(val));
}

export function answerText(answer, correct) {
  if (answer.type === "choice") return correct + ") " + optionText(answer.options[LETTERS.indexOf(correct)]);
  return Array.isArray(correct) ? correct[0] : String(correct);
}

export function starsFor(attempts, seen) {
  return seen ? 1 : attempts === 1 ? 3 : attempts === 2 ? 2 : 1;
}
