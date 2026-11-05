// Everything the site states about the app and the store comes from here: the store's signed catalog (the same list
// the app reads), each extension's manifest and README from the store repository, and the app's latest release.
// A build that cannot reach them falls back to data/snapshot/data.json, so a network hiccup never takes the site down.

import { readFile, writeFile, mkdir } from 'node:fs/promises';

const CATALOG = 'https://berkaygkc.github.io/yabbistir-extensions/v1/catalog.json';
const RAW = 'https://raw.githubusercontent.com/berkaygkc/yabbistir-extensions/main/extensions';
const RELEASE = 'https://api.github.com/repos/berkaygkc/yabbistir/releases/latest';
export const STORE_REPO = 'https://github.com/berkaygkc/yabbistir-extensions';
export const APP_REPO = 'https://github.com/berkaygkc/yabbistir';
const SNAPSHOT = new URL('../data/snapshot/data.json', import.meta.url);

async function get(url, kind = 'json') {
  const headers = { 'User-Agent': 'yabbistir-site-build' };
  if (url.startsWith('https://api.github.com/') && process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return kind === 'json' ? res.json() : res.text();
}

async function fetchLive() {
  const [catalog, release] = await Promise.all([get(CATALOG), get(RELEASE)]);
  const manifests = {};
  const readmes = {};
  await Promise.all(catalog.extensions.map(async (e) => {
    const [m, r] = await Promise.all([get(`${RAW}/${e.id}/manifest.json`), get(`${RAW}/${e.id}/README.md`, 'text')]);
    manifests[e.id] = m;
    readmes[e.id] = r;
  }));
  const trimmed = {
    tag_name: release.tag_name,
    published_at: release.published_at,
    html_url: release.html_url,
    assets: release.assets.map((a) => ({ name: a.name, size: a.size, browser_download_url: a.browser_download_url })),
  };
  return { catalog, release: trimmed, manifests, readmes };
}

export const slugOf = (id) => (id.startsWith('dev.yabbistir.') ? id.slice('dev.yabbistir.'.length) : id);

function normalize(raw) {
  const extensions = raw.catalog.extensions.map((e) => {
    const manifest = raw.manifests[e.id] ?? {};
    const sources = manifest.contributes?.sources ?? [];
    return {
      id: e.id,
      slug: slugOf(e.id),
      version: e.version,
      minAppVersion: e.minAppVersion,
      name: e.name,
      description: e.description,
      author: e.author,
      categories: e.categories,
      permissions: e.permissions,
      hosts: e.networkHosts,
      tools: e.tools,
      sensitive: sources.some((s) => s.sensitive),
      updatedAt: e.updatedAt,
      size: e.size,
      readmeUrl: e.readme,
      readme: raw.readmes[e.id] ?? '',
    };
  });
  const dmg = raw.release.assets.find((a) => a.name.endsWith('.dmg'));
  return {
    generatedAt: raw.catalog.generatedAt,
    extensions,
    release: {
      version: raw.release.tag_name.replace(/^v/, ''),
      date: raw.release.published_at,
      notes: raw.release.html_url,
      dmg: dmg ? { name: dmg.name, size: dmg.size, url: dmg.browser_download_url } : null,
    },
  };
}

export async function loadData({ snapshot = false, offline = false } = {}) {
  let raw;
  if (!offline) {
    try {
      raw = await fetchLive();
    } catch (error) {
      console.warn(`warning: live data unavailable (${error.message}); using the snapshot`);
    }
  }
  if (raw && snapshot) {
    await mkdir(new URL('.', SNAPSHOT), { recursive: true });
    await writeFile(SNAPSHOT, JSON.stringify(raw, null, 1) + '\n');
    console.log('snapshot written: data/snapshot/data.json');
  }
  raw ??= JSON.parse(await readFile(SNAPSHOT, 'utf8'));
  return normalize(raw);
}
