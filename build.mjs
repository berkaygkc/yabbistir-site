#!/usr/bin/env node
// build.mjs: renders yabbistir.com into dist/.
//
//   node build.mjs              live data (falls back to data/snapshot/data.json), base from public/CNAME
//   node build.mjs --snapshot   also refreshes data/snapshot/data.json from live data
//   node build.mjs --offline    snapshot only
//   node build.mjs --base /     override the base path (local preview)
//
// With public/CNAME present the site is built for that domain at "/"; without it, for the GitHub Pages project URL
// (https://berkaygkc.github.io/yabbistir-site/).

import { mkdir, rm, cp, readFile, writeFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { loadData } from './src/data.mjs';
import { LANGUAGES } from './src/languages.mjs';
import { makeSite } from './src/ui.mjs';
import { home } from './src/pages/home.mjs';
import { extensions } from './src/pages/extensions.mjs';
import { extension } from './src/pages/extension.mjs';
import { privacy, notFound } from './src/pages/privacy.mjs';

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : undefined);
const exists = (p) => access(p).then(() => true, () => false);

const DIST = 'dist';
const cname = (await exists('public/CNAME')) ? (await readFile('public/CNAME', 'utf8')).trim() : null;
const origin = opt('origin') ?? (cname ? `https://${cname}` : 'https://berkaygkc.github.io');
const base = opt('base') ?? (cname ? '/' : '/yabbistir-site/');

const data = await loadData({ snapshot: flag('snapshot'), offline: flag('offline') });

await rm(DIST, { recursive: true, force: true });
await mkdir(join(DIST, 'assets'), { recursive: true });
await cp('public', DIST, { recursive: true });
const css = await readFile('src/styles/site.css', 'utf8');
// The client picks a language with the same function the tests run: its source goes ahead of site.js.
const matcher = (await readFile('src/lang-match.mjs', 'utf8')).replace(/^export /m, '');
const js = matcher + '\n' + (await readFile('src/client/site.js', 'utf8'));
const assetVersion = createHash('sha256').update(css).update(js).digest('hex').slice(0, 10);
await writeFile(join(DIST, 'assets/site.css'), css);
await writeFile(join(DIST, 'assets/site.js'), js);

const catalogs = await Promise.all(LANGUAGES.map(async (l) => (await import(`./src/i18n/${l.code}.mjs`)).default));
const tracks = (await Promise.all(LANGUAGES.map(async (l) => ((await exists(`public/media/extensions-60s.${l.code}.vtt`)) ? l : null)))).filter(Boolean);
const site = makeSite({ origin, base, assetVersion, tracks });
const pages = [];
for (const t of catalogs) {
  pages.push(home({ t, data, site }), extensions({ t, data, site }), privacy({ t, data, site }));
  const sorted = [...data.extensions].sort((a, b) => (a.name[t.lang] ?? a.name.en).localeCompare(b.name[t.lang] ?? b.name.en, t.locale));
  sorted.forEach((e, i) => pages.push(extension({ t, data, site, e, prev: sorted[i - 1], next: sorted[i + 1] })));
}
const lost = notFound({ t: catalogs[0], data, site });

for (const p of pages) {
  const file = join(DIST, p.path, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, p.html);
}
await writeFile(join(DIST, '404.html'), lost.html);
await writeFile(join(DIST, '.nojekyll'), '');
await writeFile(join(DIST, '.base'), base);
// What this build rendered from, for the tests (outside dist/, so it isn't published).
await mkdir('.build', { recursive: true });
await writeFile('.build/manifest.json', JSON.stringify({ base, origin, version: data.release.version, dmg: data.release.dmg.url, extensions: data.extensions.map((e) => e.id) }, null, 2));

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${site.abs(p.path)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
await writeFile(join(DIST, 'sitemap.xml'), sitemap);
await writeFile(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.abs('/sitemap.xml')}\n`);

console.log(`built ${pages.length + 1} pages for ${origin}${base} · ${data.extensions.length} extensions · app ${data.release.version}`);
