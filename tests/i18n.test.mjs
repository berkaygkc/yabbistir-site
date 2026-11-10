// Every language carries the same copy as English: same key paths, same function arity, no stray template markers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LANGUAGES } from '../src/languages.mjs';
import { bestLanguage, hintLanguage } from '../src/lang-match.mjs';

const catalogs = Object.fromEntries(await Promise.all(LANGUAGES.map(async (l) => [l.code, (await import(`../src/i18n/${l.code}.mjs`)).default])));

/** Every leaf as `path → value` (strings, functions, null); arrays count as leaves of their own length. */
function leaves(node, prefix = '', out = new Map()) {
  if (node && typeof node === 'object' && !Array.isArray(node)) for (const [k, v] of Object.entries(node)) leaves(v, prefix ? `${prefix}.${k}` : k, out);
  else out.set(prefix, node);
  return out;
}
const en = leaves(catalogs.en);

for (const { code } of LANGUAGES.filter((l) => l.code !== 'en')) {
  test(`${code} has English's keys, arities and no template markers`, () => {
    const own = leaves(catalogs[code]);
    assert.deepEqual([...own.keys()].sort(), [...en.keys()].sort(), `${code}: key paths`);
    for (const [path, ref] of en) {
      const v = own.get(path);
      if (typeof ref === 'function') {
        assert.equal(typeof v, 'function', `${code}.${path} should be a function`);
        assert.equal(v.length, ref.length, `${code}.${path} arity`);
      } else if (Array.isArray(ref)) {
        assert.ok(Array.isArray(v) && v.length === ref.length, `${code}.${path} length`);
      } else if (typeof ref === 'string') {
        assert.equal(typeof v, 'string', `${code}.${path} should be a string`);
        assert.ok(!v.includes('${'), `${code}.${path} carries a template marker`);
      } else assert.equal(typeof v, typeof ref, `${code}.${path} type`);
    }
  });
}

test('the registry holds each language once, English first, with its own catalogue', () => {
  assert.equal(LANGUAGES[0].code, 'en');
  assert.equal(new Set(LANGUAGES.map((l) => l.code)).size, LANGUAGES.length);
  assert.equal(new Set(LANGUAGES.map((l) => l.path)).size, LANGUAGES.length);
  for (const l of LANGUAGES) assert.equal(catalogs[l.code].lang, l.code, l.code);
});

test('the registry lists the languages in the menu order', () => {
  assert.deepEqual(LANGUAGES.map((l) => l.code), ['en', 'de', 'es', 'fr', 'tr', 'ja', 'ko', 'zh-Hans', 'zh-Hant']);
});

test('an explicit Chinese script wins over the region', () => {
  const all = LANGUAGES.map((l) => l.code);
  assert.equal(bestLanguage(['zh-Hans-HK'], all), 'zh-Hans');
  assert.equal(bestLanguage(['zh-Hans-TW'], all), 'zh-Hans');
  assert.equal(bestLanguage(['zh-Hant-CN'], all), 'zh-Hant');
  assert.equal(bestLanguage(['zh_Hans_MO'], all), 'zh-Hans');
  for (const region of ['zh-HK', 'zh-TW', 'zh-MO']) assert.equal(bestLanguage([region], all), 'zh-Hant', region);
  for (const region of ['zh-CN', 'zh-SG', 'zh']) assert.equal(bestLanguage([region], all), 'zh-Hans', region);
});

test('bestLanguage maps the browser list the way the app does', () => {
  const all = ['en', 'de', 'es', 'fr', 'tr', 'ja', 'ko', 'zh-Hans', 'zh-Hant'];
  assert.equal(bestLanguage(['zh-TW'], all), 'zh-Hant');
  assert.equal(bestLanguage(['zh-HK'], all), 'zh-Hant');
  assert.equal(bestLanguage(['zh-Hant-TW'], all), 'zh-Hant');
  assert.equal(bestLanguage(['zh-CN'], all), 'zh-Hans');
  assert.equal(bestLanguage(['zh'], all), 'zh-Hans');
  assert.equal(bestLanguage(['yue'], all), 'zh-Hant');
  assert.equal(bestLanguage(['yue-Hant-HK'], all), 'zh-Hant');
  assert.equal(bestLanguage(['yue-Hans-CN'], all), 'zh-Hans');
  assert.equal(bestLanguage(['pt-BR', 'ja'], all), 'ja');
  assert.equal(bestLanguage(['pt-BR'], all), null);
  assert.equal(bestLanguage(['de-AT'], all), 'de');
  assert.equal(bestLanguage(['tr-TR', 'de'], all), 'tr');
  assert.equal(bestLanguage(['de'], ['en', 'tr']), null);
  assert.equal(bestLanguage([], all), null);
});

test('the hint offers the browser language until the visitor picks one from the menu', () => {
  const all = LANGUAGES.map((l) => l.code);
  // No choice: the first browser language the site serves, unless the page is already in it.
  assert.equal(hintLanguage(['ja-JP', 'en'], 'en', all, null), 'ja');
  assert.equal(hintLanguage(['en-US'], 'en', all, null), null);
  assert.equal(hintLanguage(['zh-TW'], 'zh-Hant', all, undefined), null);
  // Cantonese is offered Chinese, as in the app: Traditional unless it names Simplified.
  assert.equal(hintLanguage(['yue'], 'en', all, null), 'zh-Hant');
  assert.equal(hintLanguage(['yue-Hant-HK'], 'en', all, null), 'zh-Hant');
  assert.equal(hintLanguage(['yue-Hans-CN'], 'en', all, null), 'zh-Hans');
  assert.equal(hintLanguage(['yue-Hant-HK'], 'zh-Hant', all, null), null);
  // The choice is this page's language: no hint, whatever the browser says.
  assert.equal(hintLanguage(['en-US'], 'zh-Hant', all, 'zh-Hant'), null);
  assert.equal(hintLanguage(['ja-JP'], 'de', all, 'de'), null);
  // The choice is another language: it outranks the browser's list.
  assert.equal(hintLanguage(['en-US'], 'de', all, 'zh-Hant'), 'zh-Hant');
  assert.equal(hintLanguage(['ja-JP'], 'ja', all, 'en'), 'en');
  // A stored code the site no longer serves is ignored.
  assert.equal(hintLanguage(['ja-JP'], 'en', all, 'pt'), 'ja');
  // Browser languages the site doesn't serve: English, unless the page is English.
  assert.equal(hintLanguage(['pt-BR'], 'de', all, null), 'en');
  assert.equal(hintLanguage(['pt-BR'], 'en', all, null), null);
  assert.equal(hintLanguage([], 'ko', all, null), 'en');
});
