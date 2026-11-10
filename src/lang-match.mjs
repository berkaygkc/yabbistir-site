// Picks the site language for a list of browser preferences, the way the app does, and the language the hint offers.
// The build inlines this file's source ahead of site.js, so its functions stay self-contained.

/** First preference that one of `codes` serves. Chinese: an explicit script (Hans, Hant) wins over the region; without one,
    Taiwan, Hong Kong and Macao → zh-Hant and every other zh → zh-Hans. Other languages go by the language subtag. */
export function bestLanguage(preferences, codes) {
  const find = (c) => codes.find((x) => x.toLowerCase() === c.toLowerCase()) ?? null;
  for (const pref of preferences) {
    const [language, ...rest] = String(pref).replace(/_/g, '-').toLowerCase().split('-');
    let hit;
    if (language === 'zh') {
      const script = rest.find((p) => p === 'hans' || p === 'hant');
      const traditional = script ? script === 'hant' : rest.some((p) => p === 'tw' || p === 'hk' || p === 'mo');
      hit = find(traditional ? 'zh-Hant' : 'zh-Hans');
    } else hit = find(language);
    if (hit) return hit;
  }
  return null;
}

/** The language the hint offers on a page in `pageLang`, or null for none. A language the visitor picked from the menu
    (`chosen`) outranks the browser's list, so a visitor who picked this page's language is never offered another;
    without a choice it is the first browser language the site serves, else English. */
export function hintLanguage(preferences, pageLang, codes, chosen) {
  const want = chosen && codes.includes(chosen) ? chosen : bestLanguage(preferences, codes) ?? 'en';
  return want === pageLang ? null : want;
}
