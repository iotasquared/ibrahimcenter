#!/usr/bin/env node
// Local preview server for site/dist — node built-ins only, no dependencies.
// Replaces the python3 http.server call so preview works on any machine with node.
// Usage: node site/serve.mjs [port] [dir]

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.argv[2] ?? 4173);
const ROOT = join(SITE, process.argv[3] ?? "dist");

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".webp": "image/webp", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8",
  ".json": "application/json", ".woff2": "font/woff2",
};

createServer(async (req, res) => {
  try {
    // Strip query/hash, decode, and confine to ROOT (no path traversal).
    const rel = normalize(decodeURIComponent(req.url.split(/[?#]/)[0])).replace(/^([/\\])+/, "");
    let file = join(ROOT, rel);
    if (!file.startsWith(ROOT)) { res.writeHead(403).end("Forbidden"); return; }
    const s = await stat(file).catch(() => null);
    if (s?.isDirectory()) file = join(file, "index.html");
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end("<h1>404</h1>");
  }
}).listen(PORT, () => console.log(`preview: http://localhost:${PORT}/`));
