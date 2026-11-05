# yabbistir.com

The landing site and extension store for [yabbistir](https://github.com/berkaygkc/yabbistir), a free, open-source clipboard history for macOS 26.

Everything it states comes from the source: the store's signed catalog (the list the app reads), each extension's manifest and README from [yabbistir-extensions](https://github.com/berkaygkc/yabbistir-extensions), and the app's latest release. A build that can't reach them uses `data/snapshot/data.json`.

## Build

```sh
npm install
npm run build        # dist/, live data with the snapshot as fallback
npm run snapshot     # also refreshes data/snapshot/data.json
npm run serve        # http://localhost:4321/<base>/
npm test             # checks on dist/
```

`public/CNAME` decides where the site lives: with it, the site is built for that domain at `/`; without it, for `https://berkaygkc.github.io/yabbistir-site/`.

GitHub Actions builds, tests and deploys to GitHub Pages on every push, every six hours and by hand (`.github/workflows/deploy.yml`).

## Layout

```
build.mjs          renders every page into dist/
src/data.mjs       catalog, manifests, READMEs, release; snapshot fallback
src/ui.mjs         page shell and shared pieces
src/pages/         home, extensions, extension, privacy and 404
src/i18n/          English and Turkish copy (permission and panel strings are the app's own)
src/styles/        site.css
src/client/        site.js: the demo panel, store filters, copy buttons
public/            fonts, images, films, captions
```

Install buttons open `yabbistir://store/install?id=<extension id>`, which needs yabbistir 0.5 or later.

Visits are counted with [GoatCounter](https://www.goatcounter.com), without cookies.

## License

The code is MIT. Libre Franklin, Source Serif 4 and Courier Prime are under the SIL Open Font License 1.1 (`public/fonts/OFL.txt`). The films, screenshots and app icon belong to the yabbistir project.
