# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static site with no framework: a Node build script (`build.mjs`) renders HTML from the store catalog and the latest release, plus hand-written CSS and a small vanilla script. Hosted on GitHub Pages at yabbistir.com. The user approved a brief that named Astro and left the stack to Claude; a plain generator was chosen at build time because the site is a handful of page types and needs no client framework.

## Users

Mac users who arrive from Hacker News, Reddit, YouTube, AlternativeTo and LinkedIn, most of them developers. They clicked a link and decide within seconds. Until now they landed on GitHub, saw a low star count and left.

## Product Purpose

The landing site for yabbistir, a free, open-source (MIT) clipboard history for macOS 26 on Apple silicon. It explains the product, lets visitors try the panel, presents the extension store from its signed catalog, and gets the app downloaded. Success: downloads and extension installs, measured by a cookie-free counter (GoatCounter).

## Positioning

Two hooks, always together: yabbistir opens right under the text caret, and it grows through extensions from an open store, each showing what it wants to do before you install it. Competitor comparisons (Paste, Maccy, Raycast) stay in launch posts and are not on the site.

## Brand Commitments

- Name: **yabbistir**, always lowercase; a playful way of saying *yapıştır*, Turkish for "paste".
- The app icon (a glass Y on a dark tile) is the only logo.
- English by default, Turkish at `/tr/`. Turkish extension names come from the catalog.
- No star counts, no download counts, no invented testimonials, no invented numbers.
- No SF Symbols on the web (Apple's license); app screenshots may show them as part of the app.
- Visual direction chosen by the user on 2026-11-05: the paste-up board (Montaj Masası).

## Evidence on Hand

- Two films: the app in 40 s (silent) and five extensions in 60 s (narrated, with captions).
- Real screenshots from the app repo (`.github/assets`), all with made-up sample data.
- The store's signed catalog (36 extensions as of 2026-11-05), each extension's manifest and README.
- Facts: signed with a Developer ID and notarized; no telemetry, no background network; Homebrew tap `berkaygkc/tap`.

## Product Principles

1. Show the mechanism, don't describe it.
2. Every number and claim comes from the catalog, the release or the app's own strings.
3. Quiet and precise; one primary action per view.

## Accessibility & Inclusion

WCAG AA contrast, full keyboard use (the demo panel included), reduced motion respected, captions on the narrated film, `lang` and `hreflang` set per language.
