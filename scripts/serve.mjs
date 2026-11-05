#!/usr/bin/env node
// Serves dist/ at the base path it was built for (dist/.base), so links behave as they will on GitHub Pages.
// Usage: node scripts/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = 'dist';
const base = (await readFile(join(root, '.base'), 'utf8').catch(() => '/')).trim();
const port = Number(process.argv[2] ?? 4321);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.vtt': 'text/vtt', '.xml': 'application/xml', '.txt': 'text/plain' };

createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (!path.startsWith(base)) { res.writeHead(302, { Location: base }); return res.end(); }
  path = normalize('/' + path.slice(base.length));
  let file = join(root, path);
  try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); } catch {}
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': types['.html'] });
    res.end(await readFile(join(root, '404.html')));
  }
}).listen(port, () => console.log(`http://localhost:${port}${base}`));
