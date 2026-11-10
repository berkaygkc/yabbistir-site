import { html, esc, page, localPath, titleEms } from '../ui.mjs';

export function privacy({ t, data, site }) {
  const path = localPath(t.lang, '/privacy/');
  const p = t.privacyPage;
  const body = html`<article class="doc" aria-labelledby="doc-title">
  <h1 id="doc-title" class="doc__title" style="--title-ems: ${titleEms(p.h1)}">${esc(p.h1)}</h1>
  <section class="doc__section galley" data-paste>
    <h2>${esc(p.siteTitle)}</h2>
    ${p.site.map((s) => `<p>${esc(s)}</p>`)}
  </section>
  <section class="doc__section galley" data-paste>
    <h2>${esc(p.appTitle)}</h2>
    ${p.app.map((s) => `<p>${esc(s)}</p>`)}
  </section>
</article>`;
  return { path, html: page({ t, site, path, title: t.meta.privacyTitle, description: p.site[0], body, data, bodyClass: 'doc-page' }) };
}

export function notFound({ t, data, site }) {
  const path = '/404.html';
  const body = html`<article class="lost" aria-labelledby="lost-title">
  <div class="galley galley--lost">
    <h1 id="lost-title">${esc(t.notFound.title)}</h1>
    <p>${esc(t.notFound.body)}</p>
    <p><a class="button-link" href="${site.url('/')}">${esc(t.notFound.home)}</a></p>
  </div>
</article>`;
  return { path, html: page({ t, site, path: '/', title: `${t.notFound.title} · yabbistir`, description: t.notFound.body, body, data, bodyClass: 'lost-page' }) };
}
