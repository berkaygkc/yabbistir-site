import { Marked } from 'marked';
import { STORE_REPO } from '../data.mjs';
import { html, esc, icon, page, localPath, monogram, consentSentences, downloadTab, playButton } from '../ui.mjs';
import { FILMS } from '../films.mjs';

/** README → HTML. Raw HTML is shown as text, links and images resolve against the store repository, the title goes. */
function renderReadme(e) {
  const blob = `${STORE_REPO}/blob/main/extensions/${e.id}/`;
  const raw = `https://raw.githubusercontent.com/berkaygkc/yabbistir-extensions/main/extensions/${e.id}/`;
  const resolve = (href, base) => (/^(https?:|mailto:|#)/.test(href) ? href : new URL(href, base).href);
  const marked = new Marked({
    gfm: true,
    renderer: {
      html: ({ text }) => esc(text),
      link({ href, title, tokens }) {
        const inner = this.parser.parseInline(tokens);
        const target = resolve(href, blob);
        const external = /^https?:/.test(target);
        return `<a href="${esc(target)}"${title ? ` title="${esc(title)}"` : ''}${external ? ' rel="noopener"' : ''}>${inner}</a>`;
      },
      image: ({ href, title, text }) => `<img src="${esc(resolve(href, raw))}" alt="${esc(text)}"${title ? ` title="${esc(title)}"` : ''} loading="lazy">`,
      heading({ tokens, depth }) {
        const level = Math.min(depth + 1, 6);
        return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>`;
      },
    },
  });
  const md = e.readme.replace(/^#\s+[^\n]*\n+/, '');
  return marked.parse(md);
}

/** The extension's film, when it has one: the site's player, captions in both languages, and the YouTube copy. */
function film(t, site, e, name) {
  const f = FILMS[e.id];
  if (!f) return '';
  const label = t.ext.film.label(name);
  return html`<figure class="xpage__film player crop" data-paste data-player>
    <video class="film__video" controls preload="none" poster="${site.url(`/media/${f.file}.jpg`)}" playsinline width="1280" height="720" aria-label="${esc(label)}" data-goatcounter-play="film-${esc(e.slug)}">
      <source src="${site.url(`/media/${f.file}.mp4`)}" type="video/mp4">
      <track kind="captions" src="${site.url(`/media/${f.file}.en.vtt`)}" srclang="en" label="English"${t.lang === 'en' ? ' default' : ''}>
      <track kind="subtitles" src="${site.url(`/media/${f.file}.tr.vtt`)}" srclang="tr" label="Türkçe"${t.lang === 'tr' ? ' default' : ''}>
    </video>
    ${playButton(t.film.play, label)}
    <figcaption class="player__caption"><span class="slug">${esc(t.ext.film.meta(f.length))}</span><a class="text-link" href="${esc(f.youtube)}" rel="noopener">${esc(t.ext.film.youtube)}</a></figcaption>
  </figure>`;
}

export function extension({ t, data, site, e, prev, next }) {
  const path = localPath(t.lang, `/extensions/${e.slug}/`);
  const name = e.name[t.lang] ?? e.name.en;
  const desc = e.description[t.lang] ?? e.description.en;
  const sentences = consentSentences(t, e);
  const scheme = `yabbistir://store/install?id=${encodeURIComponent(e.id)}`;
  const cats = e.categories.map((c) => t.store.categories[c] ?? c).join(', ');
  const nameOf = (x) => x.name[t.lang] ?? x.name.en;
  const facts = [
    [t.ext.facts.version, e.version],
    ...(e.minAppVersion ? [[t.ext.facts.requires, `${e.minAppVersion}+`]] : []),
    [t.ext.facts.updated, t.dates(e.updatedAt)],
    [t.ext.facts.author, e.author],
    [t.ext.facts.categories, cats],
    [t.ext.facts.size, `${Math.max(1, Math.round(e.size / 1000)).toLocaleString(t.locale)} KB`],
    [t.ext.facts.id, e.id],
  ];
  const body = html`<article class="xpage" aria-labelledby="x-title">
  <nav class="xpage__crumbs" aria-label="Breadcrumb"><a href="${site.url(localPath(t.lang, '/extensions/'))}">${icon('back')}${esc(t.ext.back)}</a></nav>
  <header class="xpage__head galley" data-paste>
    <div class="xpage__title">${monogram(e.name.en)}<h1 id="x-title">${esc(name)}</h1></div>
    <p class="xpage__desc">${esc(desc)}</p>
    <div class="xpage__actions">
      <button type="button" class="tab tab--lg" popovertarget="install-sheet" data-goatcounter-click="install-open-${esc(e.slug)}">${icon('down')}<span class="tab__label">${esc(t.ext.install)}</span></button>
      <a class="text-link" href="${esc(e.readmeUrl)}" rel="noopener">${esc(t.ext.source)}</a>
    </div>
    <p class="slug slug--foot">${esc(e.id)} · ${esc(e.version)}</p>
  </header>
  ${film(t, site, e, name)}
  <section class="xpage__wants" aria-labelledby="wants-title">
    <h2 id="wants-title">${esc(t.ext.wants)}</h2>
    ${sentences.length ? `<ul class="consent">${sentences.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : `<p class="consent consent--none">${esc(t.ext.nothing)}</p>`}
    <dl class="xfacts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  </section>
  <section class="xpage__readme galley" aria-labelledby="readme-title">
    <h2 id="readme-title" class="visually-hidden">${esc(t.ext.readme)}</h2>
    ${t.ext.readmeLang ? `<p class="pencil pencil--inline" lang="${t.lang}">${esc(t.ext.readmeLang)}</p>` : ''}
    <div class="prose" lang="en">${renderReadme(e)}</div>
  </section>
  <nav class="xpage__pager" aria-label="${esc(t.store.h1)}">
    ${prev ? `<a rel="prev" href="${site.url(localPath(t.lang, `/extensions/${prev.slug}/`))}">${icon('back')}<span><small>${esc(t.ext.prev)}</small>${esc(nameOf(prev))}</span></a>` : '<span></span>'}
    ${next ? `<a rel="next" href="${site.url(localPath(t.lang, `/extensions/${next.slug}/`))}"><span><small>${esc(t.ext.next)}</small>${esc(nameOf(next))}</span>${icon('arrow')}</a>` : '<span></span>'}
  </nav>
</article>
<div class="sheet" id="install-sheet" popover>
  <div class="sheet__head">
    <h2>${esc(t.ext.sheet.title(name))}</h2>
    <button type="button" class="icon-button" popovertarget="install-sheet" popovertargetaction="hide" aria-label="${esc(t.ext.sheet.close)}">${icon('close')}</button>
  </div>
  <a class="tab tab--lg sheet__open" href="${esc(scheme)}" data-goatcounter-click="install-scheme-${esc(e.slug)}">${esc(t.ext.sheet.open)}${icon('arrow')}</a>
  <p class="sheet__note">${esc(t.ext.sheet.openNote)}</p>
  <p class="sheet__manual">${esc(t.ext.sheet.manual(name))}</p>
  <div class="sheet__noapp">
    <p>${esc(t.ext.sheet.noApp)}</p>
    ${downloadTab(t, data.release, { size: 'sm', id: 'download-dmg-sheet' }).replace('tab tab--sm', 'tab tab--sm tab--quiet')}
  </div>
</div>`;
  return {
    path,
    html: page({ t, site, path, title: `${name} · ${t.meta.extensionsTitle}`, description: desc, body, data, bodyClass: 'ext-page' }),
  };
}
