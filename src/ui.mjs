// Shared pieces: escaping, links, the page shell and the components of the paste-up board.

import { APP_REPO, STORE_REPO } from './data.mjs';
import { LANGUAGES, languageOf, localPath, pathIn } from './languages.mjs';

export { localPath, pathIn };

// Every language's copy: the language hint speaks each language in its own words, whatever the page's language.
const CATALOGS = Object.fromEntries(await Promise.all(LANGUAGES.map(async (l) => [l.code, (await import(`./i18n/${l.code}.mjs`)).default])));

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const html = (strings, ...values) =>
  strings.reduce((out, s, i) => out + s + (i < values.length ? [].concat(values[i] ?? '').join('') : ''), '');

export function bytes(n, locale) {
  const mb = n / 1_000_000;
  return `${mb.toLocaleString(locale, { maximumFractionDigits: 1 })} MB`;
}

/** Paths on the site: `site.url('/extensions/')` → the base-aware href; `site.abs(...)` → the absolute URL. */
export function makeSite({ origin, base, assetVersion, tracks = {} }) {
  const url = (path) => base.replace(/\/$/, '') + path;
  return { origin, base, assetVersion, tracks, url, abs: (path) => origin + url(path) };
}

const SPRITE = html`<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-reg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" stroke-width="1"/><path d="M12 0v24M0 12h24" stroke="currentColor" stroke-width="1"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/></symbol>
  <symbol id="i-down" viewBox="0 0 20 20"><path d="M10 3v10m0 0-4.2-4.2M10 13l4.2-4.2M4 16.5h12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-arrow" viewBox="0 0 20 20"><path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-back" viewBox="0 0 20 20"><path d="M16 10H5m0 0 4.5-4.5M5 10l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-copy" viewBox="0 0 20 20"><rect x="7" y="7" width="9.5" height="9.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M13 7V5.5A2 2 0 0 0 11 3.5H5.5a2 2 0 0 0-2 2V11a2 2 0 0 0 2 2H7" fill="none" stroke="currentColor" stroke-width="1.5"/></symbol>
  <symbol id="i-check" viewBox="0 0 20 20"><path d="m4.5 10.5 3.5 3.5 7.5-8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-close" viewBox="0 0 20 20"><path d="m5 5 10 10M15 5 5 15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></symbol>
  <symbol id="i-search" viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="5.25" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m12.5 12.5 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></symbol>
  <symbol id="i-chev" viewBox="0 0 12 12"><path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-code" viewBox="0 0 20 20"><path d="M7 5.5 2.5 10 7 14.5M13 5.5l4.5 4.5-4.5 4.5M11.2 4 8.8 16" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-lines" viewBox="0 0 20 20"><path d="M3.5 5h13M3.5 8.4h13M3.5 11.8h13M3.5 15.2h8" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/></symbol>
  <symbol id="i-play" viewBox="0 0 20 20"><path d="M6.5 4.2v11.6c0 .6.66.97 1.17.65l9.1-5.8a.77.77 0 0 0 0-1.3l-9.1-5.8a.77.77 0 0 0-1.17.65Z" fill="currentColor"/></symbol>
  <symbol id="i-menu" viewBox="0 0 20 20"><path d="M3.5 6.5h13M3.5 13.5h13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></symbol>
</svg>`;

export const icon = (id, cls = '') => `<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
export const reg = (cls = '') => `<svg class="reg ${cls}" aria-hidden="true"><use href="#i-reg"/></svg>`;

/** The primary action, a strip of rubylith. Only one per view. */
export function downloadTab(t, release, { size = 'lg', id = 'download-dmg' } = {}) {
  if (!release.dmg) return '';
  return html`<a class="tab tab--${size}" href="${esc(release.dmg.url)}" data-goatcounter-click="${id}" data-goatcounter-title="${esc(release.dmg.name)}">
    ${icon('down')}<span class="tab__label">${esc(size === 'sm' ? t.nav.download : t.download.cta)}</span>
  </a>`;
}

export function brewBlock(t) {
  const lines = ['brew tap berkaygkc/tap', 'brew trust --cask berkaygkc/tap/yabbistir', 'brew install --cask berkaygkc/tap/yabbistir'];
  const wrap = (l) => esc(l).replace(/ (--cask|berkaygkc\/tap\/)/g, ' <wbr>$1');
  return html`<div class="cmd">
    <div class="cmd__bar"><span class="slug">${esc(t.install.terminal)}</span>
      <button class="cmd__copy" type="button" data-copy="${esc(lines.join('\n'))}" data-copied="${esc(t.install.copied)}" data-goatcounter-click="copy-brew">
        ${icon('copy')}<span>${esc(t.install.copy)}</span>
      </button>
    </div>
    <pre class="cmd__code"><code>${lines.map((l) => `<span class="cmd__line">${wrap(l)}</span>`).join('')}</code></pre>
  </div>`;
}

/** Two letters set like a galley slug, standing in for an extension's icon (SF Symbols can't ship on the web). */
export function monogram(name) {
  const words = name.replace(/[^\p{L}\p{N} ]/gu, ' ').trim().split(/\s+/);
  const camel = words[0].match(/^\p{Lu}|(?<=\p{Ll})\p{Lu}/gu);
  const letters = words.length > 1 ? words[0][0] + words[1][0] : camel?.length > 1 ? camel[0] + camel[1] : name.slice(0, 2);
  return `<span class="mono-tile" aria-hidden="true">${esc(letters.toLocaleUpperCase('en'))}</span>`;
}

export function permissionMarks(t, e) {
  const marks = [];
  if (e.permissions.includes('network')) marks.push(['network', t.store.perm.network]);
  if (e.permissions.includes('exec')) marks.push(['exec', t.store.perm.exec]);
  if (e.sensitive) marks.push(['sensitive', t.store.perm.sensitive]);
  if (e.permissions.includes('capture')) marks.push(['capture', t.store.perm.capture]);
  if (e.permissions.includes('history')) marks.push(['history', t.store.perm.history]);
  if (!marks.length) marks.push(['none', t.store.perm.none]);
  return marks;
}

/** The app's consent sentences, in its fixed order (ConsentText.swift). */
export function consentSentences(t, e) {
  const s = t.ext.sentences;
  const out = [];
  if (e.permissions.includes('network')) out.push(e.hosts.length ? s.network(e.hosts.join(', ')) : s.networkAny);
  if (e.permissions.includes('exec')) out.push(s.exec(e.tools.join(', ')));
  if (e.sensitive) out.push(s.sensitive);
  if (e.permissions.includes('capture')) out.push(s.capture);
  if (e.permissions.includes('history')) out.push(s.history);
  return out;
}

/** The language menu: a paste-up tab in the masthead that opens a galley of every language, each linking this same page.
    A plain <details>, so it opens, links and closes without scripts; site.js adds Esc, outside clicks and arrow keys. */
function langMenu(t, site, path) {
  const own = languageOf(t.lang);
  const row = (l) => {
    const inner = `<span class="langmenu__mark" aria-hidden="true">${l.code === own.code ? icon('check') : ''}</span><span class="langmenu__name">${esc(l.name)}</span><span class="langmenu__code">${l.code}</span>`;
    return l.code === own.code
      ? `<li><span class="langmenu__item" aria-current="true" lang="${l.code}">${inner}</span></li>`
      : `<li><a class="langmenu__item" href="${site.url(pathIn(l.code, path))}" hreflang="${l.code}" lang="${l.code}">${inner}</a></li>`;
  };
  return html`<details class="langmenu">
      <summary class="langmenu__tab"><span class="visually-hidden">${esc(t.langMenu.label)} </span><span class="langmenu__code" aria-hidden="true">${own.code}</span> <span class="langmenu__name">${esc(own.name)}</span>${icon('chev', 'langmenu__chev')}</summary>
      <div class="langmenu__sheet">
        <p class="langmenu__label pencil" id="langmenu-label">${esc(t.langMenu.label)}</p>
        <ul class="langmenu__list" aria-labelledby="langmenu-label">
          ${LANGUAGES.map(row).join('\n          ')}
        </ul>
      </div>
    </details>`;
}

/** The quiet hint over the masthead: one line per other language, each in that language's own words. site.js shows the
    line for the visitor's first browser language the site serves, when it isn't this page's, until it is dismissed. */
function langSuggest(t, site, path) {
  return html`<div class="lang-suggest" data-lang-suggest data-lang-codes="${LANGUAGES.map((l) => l.code).join(' ')}" hidden>
  ${LANGUAGES.filter((l) => l.code !== t.lang).map((l) => {
    const words = CATALOGS[l.code].langSuggest;
    return `<div class="lang-suggest__line" data-lang-for="${l.code}" lang="${l.code}" hidden><p><a href="${site.url(pathIn(l.code, path))}" hreflang="${l.code}">${esc(words.text)}${icon('arrow')}</a></p><button type="button" class="icon-button" data-lang-dismiss aria-label="${esc(words.dismiss)}">${icon('close')}</button></div>`;
  }).join('\n  ')}
</div>`;
}

export function page({ t, site, path, title, description, body, data, bodyClass = '', image = '/img/og.png', jsonld = null }) {
  const v = site.assetVersion;
  const nav = [
    ['/extensions/', t.nav.extensions, 'extensions'],
    ['/privacy/', t.nav.privacy, 'privacy'],
  ];
  const current = (p) => (path === localPath(t.lang, p) || path.startsWith(localPath(t.lang, p)) ? ' aria-current="page"' : '');
  const rulerMarks = Array.from({ length: 24 }, (_, i) => `<span>${(i + 1) * 6}</span>`).join('');
  return html`<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(site.abs(path))}">
${LANGUAGES.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${esc(site.abs(pathIn(l.code, path)))}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${esc(site.abs(pathIn('en', path)))}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f1f2ee">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#15191d">
<meta property="og:type" content="website">
<meta property="og:site_name" content="yabbistir">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(site.abs(path))}">
<meta property="og:image" content="${esc(site.abs(image))}">
<meta property="og:locale" content="${languageOf(t.lang).og}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="${site.url('/img/favicon-64.png')}">
<link rel="apple-touch-icon" href="${site.url('/img/apple-touch-icon.png')}">
<link rel="preload" href="${site.url('/fonts/libre-franklin-latin-wght-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${site.url('/fonts/source-serif-4-latin-opsz-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${site.url('/assets/site.css')}?v=${v}">
<script defer src="${site.url('/assets/site.js')}?v=${v}"></script>
<script>document.documentElement.classList.add('js')</script>
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>` : ''}
${site.base === '/' ? '' : `<script>window.goatcounter={path:function(p){var b=${JSON.stringify(site.base)};return p.indexOf(b)===0?p.slice(b.length-1):p}}</script>`}
<script data-goatcounter="https://yabbistir.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
</head>
<body class="${esc(bodyClass)}" data-lang="${t.lang}">
${SPRITE}
<a class="skip" href="#main">${esc(t.skip)}</a>
${langSuggest(t, site, path)}
<header class="masthead">
  <a class="wordmark" href="${site.url(localPath(t.lang, '/'))}" aria-label="yabbistir">
    <img src="${site.url('/img/icon-256.webp')}" width="28" height="28" alt="">
    <span>yabbistir</span>
  </a>
  <nav class="masthead__nav" aria-label="Primary">
    ${nav.map(([p, label, key]) => `<a class="masthead__${key}" href="${site.url(localPath(t.lang, p))}"${current(p)}>${esc(label)}</a>`)}
    <a class="masthead__github" href="${APP_REPO}" rel="noopener">${esc(t.nav.github)}</a>
    ${langMenu(t, site, path)}
  </nav>
  ${downloadTab(t, data.release, { size: 'sm', id: 'download-dmg-nav' }).replace('tab tab--sm', 'tab tab--sm tab--quiet')}
</header>
<div class="ruler" aria-hidden="true"><div class="ruler__marks">${rulerMarks}</div></div>
<main id="main" class="${esc(bodyClass)}__main">
${body}
</main>
<footer class="colophon">
  <div class="colophon__mark">${reg()}<img src="${site.url('/img/icon-256.webp')}" width="40" height="40" alt=""></div>
  <p class="colophon__name">${esc(t.footer.name)}</p>
  <ul class="colophon__links">
    <li><a href="${APP_REPO}" rel="noopener">${esc(t.footer.links.app)}</a></li>
    <li><a href="${STORE_REPO}" rel="noopener">${esc(t.footer.links.store)}</a></li>
    <li><a href="${APP_REPO}/releases" rel="noopener">${esc(t.footer.links.releases)}</a></li>
    <li><a href="${APP_REPO}/issues" rel="noopener">${esc(t.footer.links.issues)}</a></li>
    <li><a href="${APP_REPO}/issues/new?template=translation.yml" rel="noopener">${esc(t.footer.links.translation)}</a></li>
    <li><a href="${site.url(localPath(t.lang, '/privacy/'))}">${esc(t.footer.links.privacy)}</a></li>
  </ul>
  <p class="colophon__fine">${esc(t.footer.made)} ${esc(t.footer.counter)}</p>
</footer>
</body>
</html>
`;
}

/** A film's caption tracks: one per language the build found a `<file>.<code>.vtt` for, the page's own language on. */
export const captionTracks = (t, site, file) =>
  (site.tracks[file] ?? []).map((l) => `<track kind="${l.code === 'en' ? 'captions' : 'subtitles'}" src="${site.url(`/media/${file}.${l.code}.vtt`)}" srclang="${l.code}" label="${esc(l.name)}"${t.lang === l.code ? ' default' : ''}>`).join('\n      ');

export const playButton = (label, aria) => `<button type="button" class="player__play" aria-label="${esc(aria)}" hidden><span class="player__disc">${icon('play')}</span><span class="player__label">${esc(label)}</span></button>`;
