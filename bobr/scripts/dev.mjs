import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { build } from "./build.mjs";

const root = path.join(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const port = Number(process.env.PORT) || 8080;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".ico": "image/x-icon"
};

build();

http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = path.join(dist, path.normalize(url));
  if (!file.startsWith(dist)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  fs.readFile(file, (err, body) => {
    if (err) { res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Nenalezeno"); return; }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream", "cache-control": "no-store" }).end(body);
  });
}).listen(port, () => console.log(`Bobří trénink běží na http://localhost:${port}/ (Ctrl+C ukončí)`));

// Při změně přebuildovat. Neúspěšný build nechá dist/ z posledního úspěšného.
let timer;
for (const dir of ["src", "content"]) {
  fs.watch(path.join(root, dir), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => { console.log("\nZměna, builduju…"); build(); }, 150);
  });
}
