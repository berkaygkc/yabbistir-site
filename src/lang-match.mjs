// Picks the site language for a list of browser preferences, the way the app does. The build inlines this
// function's source ahead of site.js, so it stays one self-contained function.

/** First preference that one of `codes` serves: Traditional Chinese regions → zh-Hant, other zh → zh-Hans, else the language subtag. */
export function bestLanguage(preferences, codes) {
  const find = (c) => codes.find((x) => x.toLowerCase() === c.toLowerCase()) ?? null;
  for (const pref of preferences) {
    const parts = String(pref).replace(/_/g, '-').toLowerCase().split('-');
    const language = parts[0];
    const hit = language === 'zh'
      ? find(parts.includes('hant') || parts.some((p) => p === 'tw' || p === 'hk' || p === 'mo') ? 'zh-Hant' : 'zh-Hans')
      : find(language);
    if (hit) return hit;
  }
  return null;
}
