// Shared pieces: escaping, links, the page shell and the components of the paste-up board.

import { APP_REPO, STORE_REPO } from './data.mjs';

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const html = (strings, ...values) =>
  strings.reduce((out, s, i) => out + s + (i < values.length ? [].concat(values[i] ?? '').join('') : ''), '');

export function bytes(n, locale) {
  const mb = n / 1_000_000;
  return `${mb.toLocaleString(locale, { maximumFractionDigits: 1 })} MB`;
}

/** Paths on the site: `site.url('/extensions/')` → the base-aware href; `site.abs(...)` → the absolute URL. */
export function makeSite({ origin, base, assetVersion }) {
  const url = (path) => base.replace(/\/$/, '') + path;
  return { origin, base, assetVersion, url, abs: (path) => origin + url(path) };
}

/** The same page in the other language: English lives at /, Turkish at /tr/. */
export const localPath = (lang, path) => (lang === 'tr' ? '/tr' + path : path);
export const otherPath = (lang, path) => (lang === 'tr' ? path.replace(/^\/tr/, '') || '/' : '/tr' + path);

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

export function page({ t, site, path, title, description, body, data, bodyClass = '', image = '/img/og.png', jsonld = null }) {
  const here = site.url(path);
  const alt = otherPath(t.lang, path);
  const en = t.lang === 'en' ? path : alt;
  const tr = t.lang === 'tr' ? path : alt;
  const v = site.assetVersion;
  const nav = [
    ['/extensions/', t.nav.extensions],
    ['/privacy/', t.nav.privacy],
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
<link rel="alternate" hreflang="en" href="${esc(site.abs(en))}">
<link rel="alternate" hreflang="tr" href="${esc(site.abs(tr))}">
<link rel="alternate" hreflang="x-default" href="${esc(site.abs(en))}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f1f2ee">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#15191d">
<meta property="og:type" content="website">
<meta property="og:site_name" content="yabbistir">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(site.abs(path))}">
<meta property="og:image" content="${esc(site.abs(image))}">
<meta property="og:locale" content="${t.locale.replace('-', '_')}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="${site.url('/img/favicon-64.png')}">
<link rel="apple-touch-icon" href="${site.url('/img/apple-touch-icon.png')}">
<link rel="preload" href="${site.url('/fonts/libre-franklin-latin-wght-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${site.url('/fonts/source-serif-4-latin-opsz-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${site.url('/assets/site.css')}?v=${v}">
<script defer src="${site.url('/assets/site.js')}?v=${v}"></script>
<script>document.documentElement.classList.add('js')</script>
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>` : ''}
<script data-goatcounter="https://yabbistir.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
</head>
<body class="${esc(bodyClass)}" data-lang="${t.lang}">
${SPRITE}
<a class="skip" href="#main">${esc(t.skip)}</a>
<div class="lang-suggest" data-lang-suggest="${t.other.lang}" hidden>
  <p>${esc(t.langSuggest.text)} <a href="${site.url(alt)}" hreflang="${t.other.lang}" lang="${t.other.lang}">${esc(t.langSuggest.go)}</a></p>
  <button type="button" class="icon-button" data-lang-dismiss aria-label="${esc(t.langSuggest.dismiss)}">${icon('close')}</button>
</div>
<header class="masthead">
  <a class="wordmark" href="${site.url(localPath(t.lang, '/'))}" aria-label="yabbistir">
    <img src="${site.url('/img/icon-256.webp')}" width="28" height="28" alt="">
    <span>yabbistir</span>
  </a>
  <nav class="masthead__nav" aria-label="Primary">
    ${nav.map(([p, label]) => `<a href="${site.url(localPath(t.lang, p))}"${current(p)}>${esc(label)}</a>`)}
    <a href="${APP_REPO}" rel="noopener">${esc(t.nav.github)}</a>
    <a class="masthead__lang" href="${site.url(alt)}" hreflang="${t.other.lang}" lang="${t.other.lang}" aria-label="${esc(t.other.label)}">${esc(t.other.short)}</a>
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
    <li><a href="${site.url(localPath(t.lang, '/privacy/'))}">${esc(t.footer.links.privacy)}</a></li>
  </ul>
  <p class="colophon__fine">${esc(t.footer.made)} ${esc(t.footer.counter)}</p>
</footer>
</body>
</html>
`;
}
