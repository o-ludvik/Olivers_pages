/* Řešení nejsou v dist/ čitelně: JSON → UTF-8 → XOR s klíčem → base64. Ochrana proti nahlédnutí do zdrojáku, ne bezpečnost. */
const KEY = new TextEncoder().encode("bobri-trenink");
const xor = bytes => bytes.map((b, i) => b ^ KEY[i % KEY.length]);

export function encode(value) {
  return btoa(Array.from(xor(new TextEncoder().encode(JSON.stringify(value))), b => String.fromCharCode(b)).join(""));
}

export function decode(secret) {
  return JSON.parse(new TextDecoder("utf-8").decode(xor(Uint8Array.from(atob(secret), c => c.charCodeAt(0)))));
}
