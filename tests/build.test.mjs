// Checks on the built site (run `npm run build` first; CI builds before testing).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { join } from 'node:path';
import { LANGUAGES, localPath, splitPath } from '../src/languages.mjs';
import { titleEms } from '../src/ui.mjs';

const DIST = 'dist';
const base = (await readFile(join(DIST, '.base'), 'utf8')).trim();
// What the build rendered from (live data or the snapshot), not the committed snapshot: the two differ after a release.
const built = JSON.parse(await readFile('.build/manifest.json', 'utf8'));
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

const dirOf = (code) => join(DIST, LANGUAGES.find((l) => l.code === code).path);

test('every language has a home, a store, a privacy page and every extension page', async () => {
  for (const { code } of LANGUAGES) {
    for (const p of ['', 'extensions', 'privacy']) assert.ok(await exists(join(dirOf(code), p, 'index.html')), `${code} ${p || 'home'}`);
    for (const id of built.extensions) {
      const slug = id.replace(/^dev\.yabbistir\./, '');
      assert.ok(await exists(join(dirOf(code), 'extensions', slug, 'index.html')), `${code} ${slug}`);
    }
  }
});

test('the store lists every extension once', async () => {
  for (const { code } of LANGUAGES) {
    const html = await readFile(join(dirOf(code), 'extensions/index.html'), 'utf8');
    assert.equal((html.match(/class="xgalley"/g) ?? []).length, built.extensions.length);
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

// The language a built page belongs to: the registry entry whose path prefixes it (longest first, so /zh-hans never reads as /zh).
const languageOf = (file) => {
  const rel = '/' + file.slice(DIST.length + 1).replace(/index\.html$/, '');
  return [...LANGUAGES].sort((a, b) => b.path.length - a.path.length).find((l) => l.path && (rel === l.path + '/' || rel.startsWith(l.path + '/'))) ?? LANGUAGES[0];
};

test('pages carry their language, an alternate for every language and a canonical link', () => {
  for (const [f, html] of pages) {
    assert.match(html, new RegExp(`<html lang="${languageOf(f).code}">`), f);
    assert.match(html, /<link rel="canonical"/, f);
    for (const { code } of LANGUAGES) assert.match(html, new RegExp(`<link rel="alternate" hreflang="${code}" href="`), `${f} ${code}`);
    assert.match(html, /<link rel="alternate" hreflang="x-default" href="/, f);
  }
});

// The English path a built page serves (the 404 page carries the home page's links).
const enPathOf = (file) => (file === join(DIST, '404.html') ? '/' : splitPath('/' + file.slice(DIST.length + 1).replace(/index\.html$/, '')).enPath);
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, k, v]) => [k, v]));
const hrefIn = (code, file) => `${base.replace(/\/$/, '')}${localPath(code, enPathOf(file))}`;

test('every masthead has a language menu that links the same page in every other language, without scripts', () => {
  for (const [f, html] of pages) {
    const own = languageOf(f);
    const masthead = html.match(/<header class="masthead">[\s\S]*?<\/header>/)?.[0] ?? '';
    const menu = masthead.match(/(<details class="langmenu"[^>]*>)([\s\S]*?)<\/details>/);
    assert.ok(menu, `${f}: no <details class="langmenu"> in the masthead`);
    assert.doesNotMatch(menu[1], /\b(hidden|open)\b/, `${f}: the menu is closed and visible as served`);
    const summary = menu[2].match(/<summary[^>]*>([\s\S]*?)<\/summary>/)?.[1] ?? '';
    assert.ok(summary.replace(/<[^>]+>/g, ' ').includes(own.name), `${f}: the summary shows ${own.name}`);
    const links = [...menu[2].matchAll(/<a\b[^>]*>/g)].map(([tag]) => attrs(tag));
    const others = LANGUAGES.filter((l) => l.code !== own.code);
    assert.deepEqual(links.map((a) => a.hreflang), others.map((l) => l.code), `${f}: one link per other language, in registry order`);
    for (const a of links) {
      assert.equal(a.lang, a.hreflang, `${f}: ${a.hreflang} lang`);
      assert.equal(a.href, hrefIn(a.hreflang, f), `${f}: ${a.hreflang} href`);
    }
  }
});

test('the language hint offers each other language in its own words', async () => {
  const words = Object.fromEntries(await Promise.all(LANGUAGES.map(async (l) => [l.code, (await import(`../src/i18n/${l.code}.mjs`)).default.langSuggest])));
  const escAttr = (s) => s.replace(/'/g, '&#39;');
  for (const [f, html] of pages) {
    const own = languageOf(f);
    const hint = html.match(/<div class="lang-suggest"[\s\S]*?(?=<header class="masthead">)/)?.[0] ?? '';
    assert.match(hint, /^<div class="lang-suggest"[^>]*\bhidden\b/, `${f}: the hint starts hidden`);
    for (const l of LANGUAGES) {
      const line = hint.match(new RegExp(`<div class="lang-suggest__line" data-lang-for="${l.code}" lang="${l.code}" hidden>[\\s\\S]*?</div>`))?.[0];
      assert.equal(Boolean(line), l.code !== own.code, `${f}: ${l.code} line`);
      if (!line) continue;
      assert.ok(line.includes(escAttr(words[l.code].text)), `${f}: ${l.code} text`);
      assert.ok(line.includes(`href="${hrefIn(l.code, f)}" hreflang="${l.code}"`), `${f}: ${l.code} link`);
      assert.ok(line.includes(`aria-label="${escAttr(words[l.code].dismiss)}"`), `${f}: ${l.code} dismiss`);
    }
  }
});

test('hreflang links point at the same page in each language', () => {
  const html = pages.find(([f]) => f === join(DIST, 'tr/extensions/secret-guard/index.html'))[1];
  for (const { code } of LANGUAGES) {
    const want = `${base.replace(/\/$/, '')}${localPath(code, '/extensions/secret-guard/')}`;
    assert.ok(html.includes(`hreflang="${code}" href="${built.origin}${want}"`), code);
  }
});

test('non-English extension pages say the README is English; English pages do not', async () => {
  for (const { code } of LANGUAGES) {
    const html = await readFile(join(dirOf(code), 'extensions/secret-guard/index.html'), 'utf8');
    const note = (await import(`../src/i18n/${code}.mjs`)).default.ext.readmeNote;
    assert.equal(html.includes('class="pencil pencil--inline"'), code !== 'en', code);
    if (code !== 'en') assert.ok(html.includes(note.replace(/'/g, '&#39;')), code);
  }
});

test('the footer links to the translation issue form', () => {
  for (const [f, html] of pages) assert.ok(html.includes('https://github.com/berkaygkc/yabbistir/issues/new?template=translation.yml'), f);
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
  assert.match(built.dmg, /^https:\/\/github\.com\/berkaygkc\/yabbistir\/releases\/download\/v[\d.]+\/yabbistir-[\d.]+\.dmg$/);
  assert.ok(html.includes(built.dmg));
});

test('install links use the app scheme with the extension id', async () => {
  const html = await readFile(join(DIST, 'extensions/secret-guard/index.html'), 'utf8');
  assert.ok(html.includes('yabbistir://store/install?id=dev.yabbistir.secret-guard'));
});

test('the counter records the same paths under the project URL and the domain', async () => {
  const html = await readFile(join(DIST, 'tr/extensions/index.html'), 'utf8');
  const config = html.match(/<script>(window\.goatcounter=[^<]*)<\/script>/)?.[1];
  const window = {};
  if (config) new Function('window', config)(window);
  const path = window.goatcounter?.path ?? ((p) => p);
  assert.equal(path(`${base}tr/extensions/`), '/tr/extensions/');
  assert.equal(path(base), '/');
});

test('no star or download counts anywhere', () => {
  for (const [f, html] of pages) assert.doesNotMatch(html, /shields\.io|stargazers|github\/downloads/, f);
});

test('an extension with a film shows it on its page in every language, with captions, and others show none', async () => {
  assert.ok(await exists('public/media/authenticator-44s.en.vtt'));
  assert.ok(await exists('public/media/authenticator-44s.tr.vtt'));
  for (const { code } of LANGUAGES) {
    const html = await readFile(join(dirOf(code), 'extensions/authenticator/index.html'), 'utf8');
    assert.match(html, /<video[^>]*poster="[^"]*\/media\/authenticator-44s\.jpg"/, code);
    assert.ok(html.includes('/media/authenticator-44s.mp4'), code);
    assert.ok(html.includes('https://youtu.be/sBg1I6EmRB0'), code);
    // A track for each language with a caption file (English captions, the rest subtitles), on for the page's own.
    for (const l of LANGUAGES) {
      const has = await exists(`public/media/authenticator-44s.${l.code}.vtt`);
      const track = html.match(new RegExp(`<track kind="(\\w+)" src="[^"]*authenticator-44s\\.${l.code}\\.vtt" srclang="${l.code}"[^>]*>`));
      assert.equal(Boolean(track), has, `${code}: ${l.code} track`);
      if (!track) continue;
      assert.equal(track[1], l.code === 'en' ? 'captions' : 'subtitles', `${code}: ${l.code} kind`);
      assert.equal(track[0].includes(' default'), l.code === code, `${code}: ${l.code} default`);
    }
  }
  const other = await readFile(join(DIST, 'extensions/secret-guard/index.html'), 'utf8');
  assert.doesNotMatch(other, /<video/);
});

test('the home film carries a track for each language with a caption file', async () => {
  for (const { code } of LANGUAGES) {
    const html = await readFile(join(dirOf(code), 'index.html'), 'utf8');
    for (const l of LANGUAGES) {
      const has = await exists(`public/media/extensions-60s.${l.code}.vtt`);
      assert.equal(html.includes(`/media/extensions-60s.${l.code}.vtt" srclang="${l.code}"`), has, `${code}: ${l.code}`);
    }
  }
});


test('poster titles carry the width of their longest word, so a long one can shrink to fit a phone', async () => {
  // A long Latin word is wider than a short one; a CJK or Hangul character may break after itself; spaces end a run.
  assert.ok(titleEms('Erweiterungen') > titleEms('Extensions'));
  assert.equal(titleEms('機能拡張'), 0.96);
  assert.equal(titleEms('개인정보 보호'), 0.96);
  assert.equal(titleEms('Get yabbistir'), titleEms('yabbistir'));
  for (const { code } of LANGUAGES) {
    for (const [file, cls] of [['extensions/index.html', 'store__title'], ['privacy/index.html', 'doc__title']]) {
      const html = await readFile(join(dirOf(code), file), 'utf8');
      const [, ems, text] = html.match(new RegExp(`<h1 [^>]*class="${cls}" style="--title-ems: ([\\d.]+)">([^<]*)</h1>`)) ?? [];
      assert.ok(ems, `${code} ${cls}`);
      assert.equal(Number(ems), titleEms(text.replace(/&#39;/g, "'").replace(/&amp;/g, '&')), `${code} ${cls}`);
    }
  }
});
