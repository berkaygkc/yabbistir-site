// Checks on the built site (run `npm run build` first; CI builds before testing).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';
const base = (await readFile(join(DIST, '.base'), 'utf8')).trim();
const data = JSON.parse(await readFile('data/snapshot/data.json', 'utf8'));
const exists = (p) => access(p).then(() => true, () => false);

async function htmlFiles(dir = DIST) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}
const files = await htmlFiles();
const pages = await Promise.all(files.map(async (f) => [f, await readFile(f, 'utf8')]));

test('every extension has a page in both languages', async () => {
  for (const e of data.catalog.extensions) {
    const slug = e.id.replace(/^dev\.yabbistir\./, '');
    assert.ok(await exists(join(DIST, 'extensions', slug, 'index.html')), `en ${slug}`);
    assert.ok(await exists(join(DIST, 'tr/extensions', slug, 'index.html')), `tr ${slug}`);
  }
});

test('the store lists every extension once', async () => {
  for (const lang of ['', 'tr/']) {
    const html = await readFile(join(DIST, lang, 'extensions/index.html'), 'utf8');
    assert.equal((html.match(/class="xgalley"/g) ?? []).length, data.catalog.extensions.length);
  }
});

test('no page leaks a missing value or a template marker', () => {
  for (const [f, html] of pages) {
    const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<div class="prose"[\s\S]*?<\/div>\s*<\/section>/g, ''); // README text is the store's own
    assert.doesNotMatch(text, />[^<]*\b(undefined|null|NaN|\[object Object\])\b[^<]*</, f);
    // Attribute values may carry the store count's template; text and other attributes may not.
    assert.doesNotMatch(text.replace(/ data-template-some="[^"]*"/g, ''), /\$\{|999001|999002|="(undefined|null)"/, f);
  }
});

test('pages carry their language, an alternate and a canonical link', () => {
  for (const [f, html] of pages) {
    const lang = f.startsWith(join(DIST, 'tr')) ? 'tr' : 'en';
    assert.match(html, new RegExp(`<html lang="${lang}">`), f);
    assert.match(html, /<link rel="canonical"/, f);
    assert.match(html, /hreflang="tr"/, f);
    assert.match(html, /hreflang="en"/, f);
  }
});

test('every internal link and asset resolves', async () => {
  const seen = new Set();
  for (const [f, html] of pages) {
    for (const [, href] of html.matchAll(/(?:href|src|poster)="([^"]+)"/g)) {
      if (!href.startsWith(base) || seen.has(href)) continue;
      seen.add(href);
      const path = decodeURIComponent(href.slice(base.length).split(/[?#]/)[0]);
      const target = join(DIST, path);
      const ok = (await exists(target)) && (path === '' || path.endsWith('/') ? await exists(join(target, 'index.html')) : true);
      assert.ok(ok, `${f}: ${href}`);
    }
  }
});

test('the download points at the release DMG', async () => {
  const html = await readFile(join(DIST, 'index.html'), 'utf8');
  const dmg = data.release.assets.find((a) => a.name.endsWith('.dmg'));
  assert.ok(html.includes(dmg.browser_download_url));
});

test('install links use the app scheme with the extension id', async () => {
  const html = await readFile(join(DIST, 'extensions/secret-guard/index.html'), 'utf8');
  assert.ok(html.includes('yabbistir://store/install?id=dev.yabbistir.secret-guard'));
});

test('no star or download counts anywhere', () => {
  for (const [f, html] of pages) assert.doesNotMatch(html, /shields\.io|stargazers|github\/downloads/, f);
});
