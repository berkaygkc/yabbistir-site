// The site's languages, in the order the language menu and the app list them. A new language is one entry here,
// `src/i18n/<code>.mjs` and `public/media/extensions-60s.<code>.vtt` (plus `<file>.<code>.vtt` for any film in
// src/films.mjs it captions); nothing else names a language, and nothing depends on an entry's position but English first.
//
//   code    the BCP 47 tag: <html lang>, hreflang, the i18n module's name
//   path    where the language lives ('' for English at the root)
//   name    the language's own name, for menus and hints
//   locale  for number, date and collation formatting
//   og      og:locale

export const LANGUAGES = [
  { code: 'en', path: '', name: 'English', locale: 'en-US', og: 'en_US' },
  { code: 'de', path: '/de', name: 'Deutsch', locale: 'de-DE', og: 'de_DE' },
  { code: 'es', path: '/es', name: 'Español', locale: 'es-ES', og: 'es_ES' },
  { code: 'fr', path: '/fr', name: 'Français', locale: 'fr-FR', og: 'fr_FR' },
  { code: 'tr', path: '/tr', name: 'Türkçe', locale: 'tr-TR', og: 'tr_TR' },
  { code: 'ja', path: '/ja', name: '日本語', locale: 'ja-JP', og: 'ja_JP' },
  { code: 'ko', path: '/ko', name: '한국어', locale: 'ko-KR', og: 'ko_KR' },
  { code: 'zh-Hans', path: '/zh-hans', name: '简体中文', locale: 'zh-CN', og: 'zh_CN' },
  { code: 'zh-Hant', path: '/zh-hant', name: '繁體中文', locale: 'zh-TW', og: 'zh_TW' },
];

export const DEFAULT_LANGUAGE = LANGUAGES[0];

export const languageOf = (code) => LANGUAGES.find((l) => l.code === code) ?? DEFAULT_LANGUAGE;

/** An English path (`/extensions/`) as it is served in a language. */
export const localPath = (code, enPath) => languageOf(code).path + enPath;

/** The language a served path belongs to, and the English path under it (longest prefix first, so /zh-hans never reads as /zh). */
export function splitPath(path) {
  const own = [...LANGUAGES].sort((a, b) => b.path.length - a.path.length).find((l) => l.path && (path === l.path || path.startsWith(l.path + '/')));
  return own ? { language: own, enPath: path.slice(own.path.length) || '/' } : { language: DEFAULT_LANGUAGE, enPath: path };
}

/** A served path (in any language) as it is served in `code`. */
export const pathIn = (code, path) => localPath(code, splitPath(path).enPath);
