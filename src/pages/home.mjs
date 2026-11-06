import { APP_REPO, STORE_REPO } from '../data.mjs';
import { html, esc, icon, reg, page, downloadTab, brewBlock, monogram, permissionMarks, consentSentences, localPath, bytes, playButton } from '../ui.mjs';

function demoPanel(t) {
  const p = t.panel;
  const rowIcon = (r) => {
    if (r.kind === 'code') return `<span class="yrow__ico">${icon('code')}</span>`;
    if (r.kind === 'text') return `<span class="yrow__ico">${icon('lines')}</span>`;
    if (r.kind === 'color') return `<span class="yrow__ico"><span class="yrow__swatch" style="--c:${esc(r.color)}"></span></span>`;
    return `<span class="yrow__ico"><span class="yrow__tile" style="--c:${esc(r.tileColor)}">${esc(r.tile)}</span></span>`;
  };
  let lastDay = null;
  const items = p.rows.map((r, i) => {
    const day = r.day !== lastDay ? `<li class="yday" role="presentation" data-day="${r.day}">${esc(r.day === 'today' ? p.today : p.yesterday)}</li>` : '';
    lastDay = r.day;
    return day + html`<li class="yrow${r.kind === 'code' ? ' yrow--code' : ''}" role="option" id="yrow-${i}" data-day="${r.day}" data-text="${esc(r.text)}" aria-selected="${r.selected ? 'true' : 'false'}">
      ${rowIcon(r)}<span class="yrow__text">${esc(r.text)}</span><span class="yrow__age">${esc(r.age)}</span></li>`;
  });
  return html`<div class="ypanel" data-demo data-pasted="${esc(t.hero.pasted('%s'))}" data-noresults="${esc(p.noResults('%s'))}">
    <div class="ypanel__search">
      <label class="visually-hidden" for="ypanel-q">${esc(p.label)}</label>
      <input id="ypanel-q" class="ypanel__input" type="text" role="combobox" aria-expanded="true" aria-controls="ypanel-list" aria-autocomplete="list" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(p.search)}">
      <span class="ypanel__cats">${esc(p.categories)}${icon('chev')}</span>
    </div>
    <p class="ypanel__col">${esc(p.history)}</p>
    <ul class="ypanel__list" id="ypanel-list" role="listbox" aria-label="${esc(p.history)}">${items}</ul>
    <p class="ypanel__empty" hidden></p>
    <div class="ypanel__bar" aria-hidden="true">
      <span class="yact yact--primary">${esc(p.paste)}<kbd>↵</kbd></span><i></i>
      <span class="yact">${esc(p.transform)}<kbd>⇧</kbd></span><i></i>
      <span class="yact">${esc(p.actions)}<kbd>⌘</kbd><kbd>K</kbd></span>
    </div>
  </div>`;
}

function hero(t, data, site) {
  const r = data.release;
  return html`<section class="hero" aria-labelledby="hero-title">
  <div class="hero__copy">
    <p class="draft" aria-hidden="true"><span class="draft__text">${esc(t.hero.draft)}</span><span class="draft__paste" data-draft-paste></span><span class="caret"></span></p>
    <div class="measure" aria-hidden="true" title="${esc(t.hero.measureNote)}"><span>${esc(t.hero.measure)}</span></div>
    <div class="galley galley--head" data-paste>
      <h1 id="hero-title">${esc(t.hero.h1)}</h1>
      <p class="slug slug--foot">yabbistir ${esc(r.version)} · macOS 26 · Apple silicon</p>
    </div>
    <p class="hero__sub">${esc(t.hero.sub)}</p>
    <div class="hero__actions">
      ${downloadTab(t, r)}
      <p class="hero__meta">${esc(t.download.meta(r, r.dmg ? bytes(r.dmg.size, t.locale) : ''))} · <a href="#install">${esc(t.download.brew)}</a></p>
    </div>
    <ul class="hero__facts">${t.hero.facts.map((f) => `<li>${esc(f)}</li>`)}</ul>
  </div>
  <figure class="hero__demo crop" data-paste>
    ${demoPanel(t)}
    <figcaption class="pencil">${esc(t.hero.tryNote)}</figcaption>
    <p class="visually-hidden" aria-live="polite" data-demo-live></p>
  </figure>
</section>`;
}


function film(t, site) {
  return html`<section class="film" aria-labelledby="film-title">
  <div class="film__head galley" data-paste>
    <h2 id="film-title">${esc(t.film.h2)}</h2>
    <p>${esc(t.film.body)}</p>
    <p class="slug slug--foot">${esc(t.film.slug)}</p>
  </div>
  <figure class="film__frame player crop" data-paste data-player data-autoplay>
    <video class="film__video" src="${site.url('/media/app-40s.mp4')}" poster="${site.url('/media/app-40s.jpg')}" muted loop playsinline controls preload="none" aria-label="${esc(t.film.label)}" width="1280" height="720"></video>
    ${playButton(t.film.play, t.film.label)}
    <figcaption class="slug player__slug">${esc(t.film.meta)}</figcaption>
  </figure>
</section>`;
}

const keys = (slug) => `<p class="slug slug--foot slug--keys">${slug.split(' · ').flatMap((g) => g.split(' ')).map((k) => `<kbd class="key">${esc(k)}</kbd>`).join('')}</p>`;

function features(t, site) {
  const f = t.features.items;
  const stack = html`<ol class="stack" aria-hidden="true">${f.stack.steps.map((s, i) => `<li${i === 0 ? ' class="is-next"' : ''}><span class="stack__n">${i + 1}</span><code>${esc(s)}</code>${i === 0 ? `<span class="stack__next">${esc(f.stack.next)}</span>` : ''}</li>`)}</ol>`;
  const shot = (name, alt, w, h) => `<img src="${site.url(`/img/${name}.webp`)}" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async">`;
  return html`<section class="features" aria-labelledby="features-title">
  <h2 id="features-title" class="section-title">${esc(t.features.h2)}</h2>
  <div class="spread">
    <article class="galley spread__caret" data-paste>
      <h3>${esc(f.caret.title)}</h3>
      <p>${esc(f.caret.body)}</p>
      ${keys(f.caret.slug)}
    </article>
    <article class="galley spread__stack" data-paste>
      <h3>${esc(f.stack.title)}</h3>
      <p>${esc(f.stack.body)}</p>
      ${stack}
      ${keys(f.stack.slug)}
    </article>
    <figure class="spread__shot spread__shot--columns crop" data-paste>${shot('panel', f.columns.alt, 1600, 1131)}</figure>
    <article class="galley spread__columns" data-paste>
      <h3>${esc(f.columns.title)}</h3>
      <p>${esc(f.columns.body)}</p>
      ${keys(f.columns.slug)}
    </article>
    <figure class="spread__shot spread__shot--transforms crop" data-paste>${shot('transforms', f.transforms.alt, 960, 816)}</figure>
    <article class="galley spread__transforms" data-paste>
      <h3>${esc(f.transforms.title)}</h3>
      <p>${esc(f.transforms.body)}</p>
      ${keys(f.transforms.slug)}
    </article>
    <figure class="spread__shot spread__shot--jobs crop" data-paste>${shot('jobs', f.jobs.alt, 960, 816)}</figure>
    <article class="galley spread__jobs" data-paste>
      <h3>${esc(f.jobs.title)}</h3>
      <p>${esc(f.jobs.body)}</p>
      <p class="slug slug--foot">${esc(f.jobs.slug)}</p>
    </article>
  </div>
</section>`;
}

export function extensionGalley(t, site, e, { lead = false, strip = false } = {}) {
  const name = e.name[t.lang] ?? e.name.en;
  const desc = e.description[t.lang] ?? e.description.en;
  const cats = e.categories.map((c) => t.store.categories[c] ?? c).join(', ');
  const marks = permissionMarks(t, e);
  const sentences = consentSentences(t, e);
  const wants = lead
    ? `<span class="xgalley__wants"><span class="xgalley__wants-title">${esc(t.ext.wantsTitle(name))}</span>${(sentences.length ? sentences : [t.ext.nothing]).map((s) => `<span class="xgalley__wants-line">${esc(s)}</span>`).join('')}</span>`
    : '';
  return html`<li class="xgalley${lead ? ' xgalley--lead' : ''}${strip ? ' xgalley--strip' : ''}" data-paste data-name="${esc((name + ' ' + e.name.en + ' ' + desc + ' ' + e.id).toLocaleLowerCase(t.locale))}" data-cats="${esc(e.categories.join(' '))}" data-perms="${esc(marks.map((m) => m[0]).join(' '))}">
    <a class="xgalley__link" href="${site.url(localPath(t.lang, `/extensions/${e.slug}/`))}">
      <span class="xgalley__title">${monogram(e.name.en)}<span class="xgalley__name">${esc(name)}</span></span>
      <span class="xgalley__desc">${esc(desc)}</span>
      ${wants}
      <span class="marks">${marks.map(([k, label]) => `<span class="mark mark--${k}">${esc(label)}</span>`)}</span>
      <span class="slug slug--foot">${esc(cats)} · ${esc(e.version)}</span>
    </a>
  </li>`;
}

function grows(t, data, site) {
  const byId = new Map(data.extensions.map((e) => [e.id, e]));
  const featured = t.grows.featured.map((id) => byId.get(id)).filter(Boolean);
  const total = data.extensions.length;
  return html`<section class="grows" aria-labelledby="grows-title">
  <div class="grows__head">
    <h2 id="grows-title" class="grows__title">${esc(t.grows.h2)}</h2>
    <p class="grows__body">${esc(t.grows.body)}</p>
  </div>
  <figure class="grows__film player crop" data-paste data-player>
    <video class="film__video" controls preload="none" poster="${site.url('/media/extensions-60s.jpg')}" playsinline width="1280" height="720" aria-label="${esc(t.grows.filmLabel)}" data-goatcounter-play="extensions-film">
      <source src="${site.url('/media/extensions-60s.mp4')}" type="video/mp4">
      ${site.tracks.map((l) => `<track kind="${l.code === 'en' ? 'captions' : 'subtitles'}" src="${site.url(`/media/extensions-60s.${l.code}.vtt`)}" srclang="${l.code}" label="${esc(l.name)}"${t.lang === l.code ? ' default' : ''}>`).join('\n      ')}
    </video>
    ${playButton(t.film.play, t.grows.filmLabel)}
    <figcaption class="player__caption"><span class="pencil">${esc(t.grows.film)}</span><span class="slug">${esc(t.grows.filmMeta)}</span></figcaption>
  </figure>
  <div class="asks galley" data-paste>
    <h3>${esc(t.grows.asks)}</h3>
    <p>${esc(t.grows.asksBody)}</p>
    <p class="slug slug--foot">${esc(t.grows.asksSlug)}</p>
  </div>
  <ul class="xspread" role="list">${featured.map((e, i) => extensionGalley(t, site, e, { lead: i === 0, strip: i > 0 }))}</ul>
  <div class="grows__more">
    <a class="button-link" href="${site.url(localPath(t.lang, '/extensions/'))}">${esc(t.grows.all(total))}${icon('arrow')}</a>
    <div class="grows__write">
      <h3>${esc(t.grows.write)}</h3>
      <p>${esc(t.grows.writeBody)} <a href="${STORE_REPO}#readme" rel="noopener">${esc('yabbistir-extensions')}</a></p>
    </div>
  </div>
</section>`;
}

function privacy(t, site) {
  return html`<section class="privacy" aria-labelledby="privacy-title">
  <h2 id="privacy-title" class="section-title">${esc(t.privacy.h2)}</h2>
  <div class="privacy__sheet galley" data-paste>${t.privacy.items.map((it) => `<div class="privacy__item"><h3>${esc(it.title)}</h3><p>${esc(it.body)}</p><p class="slug slug--foot">${esc(it.slug)}</p></div>`)}</div>
  <p><a class="text-link" href="${site.url(localPath(t.lang, '/privacy/'))}">${esc(t.privacy.more)}</a></p>
</section>`;
}

export function installSection(t, data, site) {
  const r = data.release;
  return html`<section class="install" id="install" aria-labelledby="install-title">
  ${reg('install__reg')}
  <h2 id="install-title" class="install__title">${esc(t.install.h2)}</h2>
  <div class="install__grid">
    <div class="install__dmg galley" data-paste>
      ${downloadTab(t, r, { id: 'download-dmg-install' })}
      <p class="install__meta">${esc(t.download.meta(r, r.dmg ? bytes(r.dmg.size, t.locale) : ''))} · <a href="${esc(r.notes)}" rel="noopener">${esc(t.install.notes)}</a></p>
      <p>${esc(t.install.dmgSteps)}</p>
      <p class="slug slug--foot">${esc(r.dmg ? r.dmg.name : '')} · ${esc(t.dates(r.date))}</p>
    </div>
    <div class="install__brew galley" data-paste>
      <h3>${esc(t.install.brewTitle)}</h3>
      ${brewBlock(t)}
      <p class="fine">${esc(t.install.brewNote)}</p>
      <p class="slug slug--foot">berkaygkc/tap</p>
    </div>
    <div class="install__first">
      <p class="install__requires">${esc(t.install.requires)}</p>
      <p>${esc(t.install.first)}</p>
    </div>
  </div>
</section>`;
}

function faq(t) {
  return html`<section class="faq" aria-labelledby="faq-title">
  <h2 id="faq-title" class="section-title">${esc(t.faq.h2)}</h2>
  <div class="faq__list">${t.faq.items.map((it) => `<details class="faq__item"><summary>${esc(it.q)}</summary><p>${esc(it.a)}</p></details>`)}</div>
</section>`;
}

export function home({ t, data, site }) {
  const path = localPath(t.lang, '/');
  const r = data.release;
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'yabbistir',
    operatingSystem: 'macOS 26',
    applicationCategory: 'UtilitiesApplication',
    softwareVersion: r.version,
    description: t.meta.description,
    url: site.abs(path),
    downloadUrl: r.dmg?.url,
    license: 'https://opensource.org/licenses/MIT',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  const body = [hero(t, data, site), film(t, site), features(t, site), grows(t, data, site), privacy(t, site), installSection(t, data, site), faq(t)].join('\n');
  return { path, html: page({ t, site, path, title: t.meta.title, description: t.meta.description, body, data, bodyClass: 'home', jsonld }) };
}
