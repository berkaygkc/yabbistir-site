// Picks the site language for a list of browser preferences, the way the app does. The build inlines this
// function's source ahead of site.js, so it stays one self-contained function.

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
