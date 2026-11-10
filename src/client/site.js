// yabbistir.com: the demo panel, galleys settling onto the board, store filters, copy buttons, the language menu and hint.
// Everything here is an enhancement: with scripts off, every page still reads, links and downloads.

(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* Galleys settle onto the board once, when they come into view. */
  const pasteables = $$('[data-paste]');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-set'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    pasteables.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.9) setTimeout(() => el.classList.add('is-set'), el.closest('.hero') ? 140 : 40);
      else io.observe(el);
    });
  } else pasteables.forEach((el) => el.classList.add('is-set'));

  /* The measure sits under the draft's caret. */
  const caret = $('.draft .caret');
  const measure = $('.measure');
  const placeMeasure = () => {
    if (!caret || !measure) return;
    const host = measure.parentElement.getBoundingClientRect();
    const c = caret.getBoundingClientRect();
    measure.style.setProperty('--caret-x', `${Math.max(0, Math.round(c.left - host.left))}px`);
  };
  placeMeasure();
  addEventListener('resize', placeMeasure, { passive: true });
  document.fonts?.ready.then(placeMeasure);

  /* The demo panel: type to search, ↑ ↓ to move, ↵ (or a click) pastes into the draft. */
  const panel = $('[data-demo]');
  if (panel) {
    const input = $('.ypanel__input', panel);
    const list = $('.ypanel__list', panel);
    const empty = $('.ypanel__empty', panel);
    const rows = $$('.yrow', panel);
    const days = $$('.yday', panel);
    const live = $('[data-demo-live]');
    const pasteSpot = $('[data-draft-paste]');
    const texts = new Map(rows.map((r) => [r, $('.yrow__text', r).textContent]));
    let selected = rows.find((r) => r.getAttribute('aria-selected') === 'true') ?? rows[0];

    const visible = () => rows.filter((r) => !r.hidden);
    const select = (row) => {
      rows.forEach((r) => r.setAttribute('aria-selected', String(r === row)));
      selected = row;
      if (row) {
        input.setAttribute('aria-activedescendant', row.id);
        const top = row.offsetTop - list.offsetTop;
        if (top < list.scrollTop) list.scrollTop = top - 30;
        else if (top + row.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = top + row.offsetHeight - list.clientHeight + 8;
      } else input.removeAttribute('aria-activedescendant');
    };
    const highlight = (row, q) => {
      const span = $('.yrow__text', row);
      const t = texts.get(row);
      const i = q ? t.toLocaleLowerCase().indexOf(q) : -1;
      if (i < 0) { span.textContent = t; return; }
      span.replaceChildren(t.slice(0, i), Object.assign(document.createElement('mark'), { textContent: t.slice(i, i + q.length) }), t.slice(i + q.length));
    };
    const filter = () => {
      const q = input.value.trim().toLocaleLowerCase();
      rows.forEach((r) => { r.hidden = q && !texts.get(r).toLocaleLowerCase().includes(q); highlight(r, q); });
      days.forEach((d) => { d.hidden = !rows.some((r) => !r.hidden && r.dataset.day === d.dataset.day); });
      const shown = visible();
      list.hidden = !shown.length;
      empty.hidden = !!shown.length;
      if (!shown.length) empty.textContent = panel.dataset.noresults.replace('%s', input.value.trim());
      select(shown.includes(selected) ? selected : shown[0]);
    };
    const paste = (row) => {
      if (!row || !pasteSpot) return;
      const text = row.dataset.text;
      pasteSpot.textContent = text;
      pasteSpot.classList.toggle('is-code', row.classList.contains('yrow--code'));
      if (live) live.textContent = panel.dataset.pasted.replace('%s', text);
      placeMeasure();
    };

    input.addEventListener('input', filter);
    input.addEventListener('keydown', (e) => {
      const shown = visible();
      const i = shown.indexOf(selected);
      if (e.key === 'ArrowDown') { e.preventDefault(); select(shown[Math.min(shown.length - 1, i + 1)]); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); select(shown[Math.max(0, i - 1)]); }
      else if (e.key === 'Enter') { e.preventDefault(); paste(selected); }
      else if (e.key === 'Escape') { input.value = ''; filter(); }
    });
    rows.forEach((r) => {
      r.addEventListener('mousemove', () => { if (selected !== r) select(r); });
      r.addEventListener('click', () => { select(r); paste(r); input.focus({ preventScroll: true }); });
    });
    panel.addEventListener('click', (e) => { if (!e.target.closest('.yrow')) input.focus({ preventScroll: true }); });
    select(selected);
  }

  /* Films: a poster with an authored play control; the browser's own controls appear only once a film plays.
     The silent film loops on its own while it is on screen (not with reduced motion). */
  $$('[data-player]').forEach((fig) => {
    const v = $('video', fig);
    const btn = $('.player__play', fig);
    const auto = fig.hasAttribute('data-autoplay') && !reduce;
    v.controls = false;
    const start = () => {
      btn.hidden = true;
      fig.classList.add('is-playing');
      if (!auto) v.controls = true;
      v.play().catch(() => { v.controls = true; });
    };
    if (auto) {
      fig.classList.add('is-playing');
      v.preload = 'auto';
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting) v.play().catch(() => { fig.classList.remove('is-playing'); btn.hidden = false; });
        else v.pause();
      }, { threshold: 0.35 }).observe(v);
      v.addEventListener('click', () => (v.paused ? v.play() : v.pause()));
    } else btn.hidden = false;
    btn.addEventListener('click', start);
  });
  $$('video[data-goatcounter-play]').forEach((v) => {
    v.addEventListener('play', () => window.goatcounter?.count?.({ path: v.dataset.goatcounterPlay, title: 'play', event: true }), { once: true });
  });

  /* Copy buttons. */
  $$('[data-copy]').forEach((b) => {
    b.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(b.dataset.copy);
        const label = $('span', b);
        const before = label.textContent;
        b.dataset.state = 'copied';
        label.textContent = b.dataset.copied;
        setTimeout(() => { b.dataset.state = ''; label.textContent = before; }, 1600);
      } catch { /* The command stays selectable. */ }
    });
  });

  /* Store filters: words, one category, one permission. State lives in the URL query. */
  const filters = $('[data-store-filters]');
  if (filters) {
    const q = $('[data-filter-q]', filters);
    const items = $$('[data-store-list] .xgalley');
    const count = $('[data-filter-count]', filters);
    const emptyBox = $('[data-store-empty]');
    const state = { cat: '', perm: '' };
    const params = new URLSearchParams(location.search);
    q.value = params.get('q') ?? '';
    state.cat = params.get('category') ?? '';
    state.perm = params.get('permission') ?? '';
    const total = Number(count.dataset.total);
    const apply = () => {
      const words = q.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
      let n = 0;
      items.forEach((el) => {
        const ok = words.every((w) => el.dataset.name.includes(w))
          && (!state.cat || el.dataset.cats.split(' ').includes(state.cat))
          && (!state.perm || el.dataset.perms.split(' ').includes(state.perm));
        el.hidden = !ok;
        if (ok) { n++; el.classList.add('is-set'); }
      });
      $$('.chip', filters).forEach((c) => c.setAttribute('aria-pressed', String(state[c.dataset.filter] === c.dataset.value)));
      count.textContent = n === total ? count.dataset.templateAll : count.dataset.templateSome.replace('999001', n).replace('999002', total);
      emptyBox.hidden = n > 0;
      const p = new URLSearchParams();
      if (q.value.trim()) p.set('q', q.value.trim());
      if (state.cat) p.set('category', state.cat);
      if (state.perm) p.set('permission', state.perm);
      history.replaceState(null, '', p.size ? `?${p}` : location.pathname);
    };
    q.addEventListener('input', apply);
    filters.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      state[chip.dataset.filter] = chip.dataset.value;
      apply();
    });
    $('[data-filter-reset]')?.addEventListener('click', () => { q.value = ''; state.cat = ''; state.perm = ''; apply(); q.focus(); });
    if (q.value || state.cat || state.perm) apply();
  }

  /* The language menu is a <details>: it opens and links without this. Here it also closes on Esc (focus back on its
     tab), on a click outside and when focus leaves it, and ↑ ↓ Home End move through the languages. */
  $$('.langmenu').forEach((menu) => {
    const tab = $('summary', menu);
    const links = $$('a', menu);
    const close = (refocus) => {
      if (!menu.open) return;
      menu.open = false;
      if (refocus) tab.focus();
    };
    document.addEventListener('click', (e) => { if (!menu.contains(e.target)) close(false); });
    menu.addEventListener('focusout', (e) => { if (e.relatedTarget && !menu.contains(e.relatedTarget)) close(false); });
    menu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.open) { e.preventDefault(); close(true); return; }
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key) || !links.length) return;
      if (!menu.open) {
        if (e.key !== 'ArrowDown') return;
        menu.open = true;
      }
      e.preventDefault();
      const i = links.indexOf(document.activeElement);
      const last = links.length - 1;
      const next = { Home: 0, End: last, ArrowDown: i < 0 ? 0 : Math.min(last, i + 1), ArrowUp: i < 0 ? last : Math.max(0, i - 1) }[e.key];
      links[next].focus();
    });
  });

  /* A visitor whose first browser language the site serves, if it isn't this page's, gets a quiet hint in that
     language, once. */
  const hint = $('[data-lang-suggest]');
  if (hint) {
    const best = bestLanguage(navigator.languages?.length ? navigator.languages : [navigator.language], hint.dataset.langCodes.split(' ')) ?? 'en';
    const line = best === document.documentElement.lang ? null : $(`[data-lang-for="${best}"]`, hint);
    let dismissed = false;
    try { dismissed = localStorage.getItem('yab-lang-hint') === '1'; } catch {}
    if (line && !dismissed) line.hidden = hint.hidden = false;
    hint.addEventListener('click', (e) => {
      if (!e.target.closest('[data-lang-dismiss]')) return;
      hint.hidden = true;
      try { localStorage.setItem('yab-lang-hint', '1'); } catch {}
    });
  }
})();
