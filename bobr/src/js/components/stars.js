export const starRow = (n, max = 3) => Array.from({ length: max }, (_, i) => i < n ? "<b>★</b>" : "★").join("");
