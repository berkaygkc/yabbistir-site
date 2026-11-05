import { html, esc, icon, page, localPath } from '../ui.mjs';
import { extensionGalley } from './home.mjs';

export function extensions({ t, data, site }) {
  const path = localPath(t.lang, '/extensions/');
  const total = data.extensions.length;
  const sorted = [...data.extensions].sort((a, b) => (a.name[t.lang] ?? a.name.en).localeCompare(b.name[t.lang] ?? b.name.en, t.locale));
  const catCounts = new Map();
  for (const e of data.extensions) for (const c of e.categories) catCounts.set(c, (catCounts.get(c) ?? 0) + 1);
  const cats = [...catCounts.keys()].sort((a, b) => catCounts.get(b) - catCounts.get(a));
  const permKeys = ['none', 'network', 'exec', 'sensitive', 'capture', 'history'].filter((k) =>
    data.extensions.some((e) => (k === 'none' ? !e.permissions.length && !e.sensitive : k === 'sensitive' ? e.sensitive : e.permissions.includes(k))),
  );
  const chip = (group, value, label, pressed) =>
    `<button type="button" class="chip" data-filter="${group}" data-value="${esc(value)}" aria-pressed="${pressed ? 'true' : 'false'}">${esc(label)}</button>`;
  const body = html`<section class="store" aria-labelledby="store-title">
  <header class="store__head">
    <h1 id="store-title" class="store__title">${esc(t.store.h1)}</h1>
    <p class="store__sub">${esc(t.store.sub(total))}</p>
  </header>
  <div class="filters" data-store-filters>
    <div class="filters__search">
      <label class="visually-hidden" for="store-q">${esc(t.store.search)}</label>
      ${icon('search')}
      <input id="store-q" type="search" placeholder="${esc(t.store.searchPlaceholder)}" autocomplete="off" spellcheck="false" data-filter-q>
    </div>
    <div class="filters__group" role="group" aria-label="${esc(t.store.category)}">
      ${chip('cat', '', t.store.allCategories, true)}${cats.map((c) => chip('cat', c, `${t.store.categories[c] ?? c}`, false))}
    </div>
    <div class="filters__group" role="group" aria-label="${esc(t.store.permission)}">
      ${chip('perm', '', t.store.anyPermission, true)}${permKeys.map((k) => chip('perm', k, t.store.perm[k], false))}
    </div>
    <p class="filters__count" aria-live="polite" data-filter-count data-total="${total}" data-template-all="${esc(t.store.showing(total, total))}" data-template-some="${esc(t.store.showing(999001, 999002))}">${esc(t.store.showing(total, total))}</p>
  </div>
  <ul class="xgrid" role="list" data-store-list>${sorted.map((e) => extensionGalley(t, site, e))}</ul>
  <div class="store__empty" data-store-empty hidden>
    <p>${esc(t.store.empty)}</p>
    <button type="button" class="button-link" data-filter-reset>${esc(t.store.reset)}</button>
  </div>
</section>`;
  return {
    path,
    html: page({ t, site, path, title: t.meta.extensionsTitle, description: t.meta.extensionsDescription(total), body, data, bodyClass: 'store-page' }),
  };
}
