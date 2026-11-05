---
name: yabbistir.com
description: The landing site and extension store for yabbistir, set as a paste-up board (Montaj Masası).
colors:
  rubylith: "#cf232b"
  rubylith-deep: "#b31c23"
  rubylith-film: "rgba(207, 35, 43, 0.86)"
  on-rubylith: "#ffffff"
  blue-pencil: "#1d6a9c"
  non-photo-blue: "#8ccbe9"
  grid-minor: "rgba(103, 178, 222, 0.12)"
  grid-major: "rgba(103, 178, 222, 0.32)"
  illustration-board: "#f1f2ee"
  galley-paper: "#fffffc"
  paper-tint: "#f7f7f2"
  ink: "#151513"
  ink-secondary: "#3b3a36"
  ink-tertiary: "#64635d"
  hairline-rule: "rgba(21, 21, 19, 0.12)"
  crop-mark: "#151513"
  rubylith-dark: "#cf2a30"
  rubylith-deep-dark: "#b92228"
  blue-pencil-dark: "#92cdf0"
  non-photo-blue-dark: "#6aaed6"
  light-table: "#15191d"
  lit-paper: "#ecebe3"
  lit-paper-tint: "#e2e0d6"
  table-ink: "#f1efe8"
  table-ink-secondary: "#cfcdc5"
  table-ink-tertiary: "#a2a097"
  paper-ink-on-table: "#191916"
  crop-mark-dark: "#e9e7e0"
  app-surface: "#fbfbfc"
  app-surface-dark: "#1e1e21"
  app-accent: "#007aff"
  app-accent-dark: "#0a84ff"
  app-selection: "rgba(0, 0, 0, 0.058)"
  app-match: "rgba(255, 204, 0, 0.38)"
typography:
  display:
    fontFamily: "Libre Franklin, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(46px, 6.4vw, 96px)"
    fontWeight: 820
    lineHeight: 0.95
    letterSpacing: "-0.036em"
  poster:
    fontFamily: "Libre Franklin, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(54px, 7.5vw, 96px)"
    fontWeight: 860
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Libre Franklin, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(34px, 4.3vw, 62px)"
    fontWeight: 780
    lineHeight: 1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Libre Franklin, Helvetica Neue, Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 720
    lineHeight: 1.16
    letterSpacing: "-0.012em"
  body:
    fontFamily: "Source Serif 4, Iowan Old Style, Georgia, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.56
  body-large:
    fontFamily: "Source Serif 4, Iowan Old Style, Georgia, serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.55
  draft:
    fontFamily: "Source Serif 4, Iowan Old Style, Georgia, serif"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Libre Franklin, Helvetica Neue, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.005em"
  pencil-note:
    fontFamily: "Libre Franklin, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.005em"
  slug:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.01em"
    fontFeature: "tnum"
  app-row:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Helvetica Neue, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: "18px"
rounded:
  paper: "1px"
  mark: "2px"
  key: "4px"
  app-keycap: "5px"
  app-row: "8px"
  app-panel: "16px"
spacing:
  pica: "16px"
  margin: "clamp(16px, 4.2vw, 64px)"
  max: "1344px"
  galley-pad: "26px 28px 16px"
  galley-pad-compact: "22px 20px 14px"
  section-end: "120px"
  section-end-long: "140px"
components:
  tab:
    backgroundColor: "{colors.rubylith}"
    textColor: "{colors.on-rubylith}"
    typography: "{typography.label}"
    rounded: "0"
    padding: "15px 26px 15px 20px"
  tab-hover:
    backgroundColor: "{colors.rubylith-deep}"
    textColor: "{colors.on-rubylith}"
  tab-small:
    backgroundColor: "{colors.rubylith}"
    textColor: "{colors.on-rubylith}"
    padding: "10px 16px 10px 13px"
  tab-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.rubylith}"
    padding: "10px 16px 10px 13px"
  button-link:
    backgroundColor: "{colors.galley-paper}"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "12px 18px"
  galley:
    backgroundColor: "{colors.galley-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.paper}"
    padding: "{spacing.galley-pad}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.paper}"
    padding: "7px 12px"
  chip-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.illustration-board}"
  mark:
    backgroundColor: "transparent"
    textColor: "{colors.blue-pencil}"
    rounded: "{rounded.mark}"
    padding: "3px 8px"
  mono-tile:
    backgroundColor: "{colors.galley-paper}"
    textColor: "{colors.ink}"
    rounded: "0"
    size: "36px"
  input-search:
    backgroundColor: "{colors.galley-paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.paper}"
    height: "46px"
    padding: "0 14px 0 42px"
  key:
    backgroundColor: "{colors.paper-tint}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.key}"
    height: "24px"
    padding: "0 7px"
  app-panel:
    backgroundColor: "{colors.app-surface}"
    rounded: "{rounded.app-panel}"
  app-row-selected:
    backgroundColor: "{colors.app-selection}"
    typography: "{typography.app-row}"
    rounded: "{rounded.app-row}"
    height: "40px"
    padding: "0 10px"
---

# Design System: yabbistir.com

## Overview

**Creative North Star: "Montaj Masası" (the paste-up board)**

Paste was a physical craft before ⌘V, and the site is set as the table it happened on. The page is illustration board under a non-photo-blue modular grid (16px pica, a heavier line every six picas) with a pica ruler under the masthead. Every fact is a galley: a strip of near-white paper pressed onto the board with a soft offset shadow, closed by a typewriter slug line. Photos and the live panel are pasted prints framed by black hairline crop marks; registration targets mark the corners of the larger sheets. Notes in blue pencil measure and annotate. One strip of rubylith film carries the single action that matters.

Density is editorial rather than dashboard: generous section ends (120 to 140px), asymmetric twelve-column spreads where galleys and prints overlap rows like a layout in progress, and big tight Franklin headlines against a typeset serif body. Motion is one gesture only: galleys settle onto the board once, as they enter.

Dark mode is a light table, not an inverted page. The board goes dark slate with a lamp-lit field under the glass; the grid glows brighter; the galleys stay lit paper with dark ink. The demo panel is not part of the board world at all: it is a faithful depiction of the yabbistir app, drawn in the app's own panel tokens and system font.

**Key Characteristics:**
- Non-photo-blue grid on illustration board, with a pica ruler under the masthead.
- Galleys: paper strips, 1px corners, soft offset shadow, slug line at the foot.
- Crop marks and registration targets as the framing devices; no card borders.
- Rubylith red fill for one primary action per view; blue pencil for notes and measures.
- Libre Franklin headlines, Source Serif 4 body, Courier Prime slugs.
- Light table in dark mode: paper stays paper.

## Colors

A near-monochrome paste-up palette (board, paper, ink) with two working colors from the craft: rubylith red and blue pencil, each with one job.

### Primary
- **Rubylith** (light `rubylith`, dark `rubylith-dark`): the filled tab of the one primary action in a view (Download for macOS, Install, Open in yabbistir), and text selection as translucent film (`rubylith-film`). Its hover deepens to `rubylith-deep`. On a galley name, a 1.5px rubylith underline marks the hover of the whole galley link.

### Secondary
- **Blue Pencil** (`blue-pencil`, dark `blue-pencil-dark`): measurement notes, figure captions, permission marks, list markers, the hollow fact circles, the copied state, and the focus ring (2px outline, 3px offset). It is the editor's hand, never an action color.
- **Non-Photo Blue** (`non-photo-blue`, with `grid-minor` and `grid-major`): the board grid, ruler ticks, and dashed internal dividers (slug foot rules, privacy columns, fact rows). Structure that would not reproduce on film.

### Neutral
- **Illustration Board** (`illustration-board`; dark `light-table`): the page ground under the grid. The masthead and sticky filter bar are the board at 96 to 97% opacity.
- **Galley Paper** (`galley-paper`; dark `lit-paper`): every galley, sheet, FAQ item, consent line, search field and the install sheet.
- **Paper Tint** (`paper-tint`; dark `lit-paper-tint`): inset surfaces inside a galley: the terminal block, the stack rows, keycaps, the "wants to" box, inline code.
- **Ink** (`ink`, `ink-secondary`, `ink-tertiary`): headlines and strong text, galley body copy, slugs and metadata. On the dark board these are `table-ink` tones; inside paper on the light table they reset to `paper-ink-on-table`.
- **Hairline Rule** (`hairline-rule`): inset 1px strokes on fields, chips, keys and inset surfaces.
- **Crop Mark** (`crop-mark`; dark `crop-mark-dark`): crop marks and registration targets only, at 75 to 85% opacity.

### The App's Own Tokens
- **App Surface, App Accent, App Selection, App Match** (`app-surface`, `app-accent`, `app-selection`, `app-match`, with dark pairs): used only inside the demo panel, which depicts the yabbistir app. They mirror the app's DESIGN.md panel tokens and never leak onto the board.

### Named Rules
**The One Strip of Film Rule.** A view has exactly one filled rubylith tab, and rubylith appears otherwise only as text selection, the galley-name hover underline, and the outlined quiet tab that keeps Download reachable from the masthead and the install sheet. Nothing decorative is ever red.

**The Pencil Doesn't Click Rule.** Blue pencil annotates, measures and focuses; it never fills a button.

**The Two Worlds Rule.** Board tokens dress the site; app tokens dress the depiction of the app. A depiction of the app is drawn with the app's values, and nothing else on the page borrows them.

## Typography

**Display Font:** Libre Franklin (with Helvetica Neue, Arial)
**Body Font:** Source Serif 4, optical sizing on (with Iowan Old Style, Georgia)
**Label/Mono Font:** Courier Prime (with Courier New) for slugs, metadata and code

**Character:** Franklin Gothic headlines set heavy and tight, like display type pasted from a headline machine, against a quiet typeset serif for reading, with a typewriter for everything a compositor would mark on a slug.

### Hierarchy
- **Display** (820, clamp(46px, 6.4vw, 96px), 0.95, -0.036em): the hero H1 galley; the extension page H1 runs the same voice at clamp(38px, 5vw, 64px).
- **Poster** (860, clamp(54px, 7.5vw, 96px), 0.9, -0.04em): page and section titles set loose on the board (Extensions, It grows, Get yabbistir, Privacy).
- **Headline** (780, clamp(34px, 4.3vw, 62px), 1.0, -0.03em): section titles, held to 15 to 18ch.
- **Title** (720, 22px, 1.16): galley headings; galley names at 740 20px; FAQ questions at 680 19px.
- **Body** (400, 18px, 1.56; 17px under 760px): reading text, galley copy in ink-secondary, prose at 70ch and 1.62.
- **Body Large** (19px, 1.55): ledes beside poster titles; the hero subhead runs clamp(18px, 1.5vw, 20.5px).
- **Draft** (italic, 21px, 1.4): the typed draft line above the hero, ending in a blinking caret.
- **Label** (600, 15px, -0.005em): navigation, links, chips, buttons; the tab sets 680 17px.
- **Pencil Note** (600, 14px): blue pencil captions, led by a 26px pencil rule.
- **Slug** (Courier Prime 400, 12.5px, 1.4, tabular figures): version, id, size, permissions and category lines at the foot of galleys; dt labels; counts.

### Named Rules
**The Slug Line Rule.** Machine facts (versions, ids, sizes, dates, categories, paths) are set in Courier Prime as a slug, not as display labels.

**The Sentence Case Rule.** Headlines, labels and chips are sentence case; nothing is set uppercase and letterspaced.

## Layout

The board is a twelve-column grid inside `max` with `margin` gutters, and the visible grid background is registered to the same left margin so galleys sit on its lines. Sections are asymmetric spreads: hero 7/5 (copy and a 340 to 440px panel column), film and FAQ 4/8, store head 5/7, extension page 7/5 with a sticky "wants to" column. The features and extensions spreads place galleys and prints at deliberate offset column spans and rows so the page reads as a layout in progress, not a card grid. The store itself is the exception: an auto-fill grid of 290px-minimum galleys, because it is a catalog.

Rhythm is the pica: 16px grid, 96px major lines; section ends at 120 to 140px; galley gaps of 12px internally, 24 to 32px between galleys. Breakpoints: at 1180px spreads relax to even halves; at 980px every spread and two-column layout collapses to one column and the overlaps flatten; at 760px the masthead tightens to 58px, galley padding compacts, crop marks shrink and registration targets drop; at 420px the wordmark keeps only the icon.

## Elevation & Depth

Depth is physical: paper on board. Galleys cast a soft, short offset shadow that reads as paper a fraction of a millimetre proud of the surface; hover lifts the paper with a longer shadow and a 1 to 2px rise. On the light table the shadows go near-black and pick up a 1px dark edge so lit paper separates from the glowing board. There are no glows, no glass, and no hard offset shadows.

### Shadow Vocabulary
- **Paper** (`box-shadow: 0 1px 0 rgba(21,21,19,.035), 0 1px 2px rgba(21,21,19,.06), 0 12px 24px -14px rgba(21,21,19,.28)`; dark `0 0 0 1px rgba(0,0,0,.35), 0 16px 32px -16px rgba(0,0,0,.9)`): every galley, print, sheet and FAQ item at rest.
- **Lift** (`box-shadow: 0 3px 6px rgba(21,21,19,.07), 0 26px 44px -18px rgba(21,21,19,.34)`; dark `0 0 0 1px rgba(0,0,0,.35), 0 30px 54px -22px rgba(0,0,0,.95)`): hover on galley links and button links, the open sheet, and galleys mid-settle.
- **Film** (`box-shadow: 0 10px 18px -12px rgba(21,21,19,.5)`): under the rubylith tab only.
- **Hairline Inset** (`box-shadow: inset 0 0 0 1px var(--rule)`): the edge of fields, chips, keys and inset paper; borders are drawn as inset shadows, not `border`.

### Named Rules
**The Paper Never Floats Rule.** Shadows stay short and soft at rest; elevation grows only for hover, the open sheet, and the settle motion.

## Shapes

Paper is cut, not rounded: galleys, fields and chips carry a 1px corner (`paper`), marks 2px, keycaps and icon buttons 4px. The rubylith tab is a rectangle with its top-right corner clipped at 45° (11px, 8px on the small tab), a cut strip of film. Monogram tiles are square, outlined 1.5px in ink. Circles appear only as hollow blue-pencil markers on fact and consent lines and as the play disc. Dividers inside paper are dashed non-photo blue; structural rules on the board are solid `grid-major` lines. The demo panel alone uses the app's rounder geometry (16px panel, 8px rows, 5px keycaps). The lost page tilts its galley -1.2°; that tilt is the only resting rotation.

## Components

### Buttons
- **Rubylith Tab (primary):** filled `rubylith`, white Libre Franklin 680 17px, padding 15px 26px 15px 20px, clipped top-right corner, film shadow. Hover deepens to `rubylith-deep` and rises 1px (0.18s, `ease`); active returns. Small size for the masthead and sheet: 14.5px, 10px 16px 10px 13px, 8px cut. Carries a stroked download or arrow icon at 19px (16px small).
- **Quiet Tab:** transparent, rubylith text, 1.5px inset rubylith stroke, no clip; hover fills to 10% rubylith. Only for the standing Download path in the masthead and the install sheet's no-app fallback.
- **Button Link (secondary):** galley paper with paper shadow plus a hairline inset, ink Libre Franklin 650 16px, padding 12px 18px; hover takes the lift shadow and rises 1px.
- **Text Link:** Libre Franklin 620 16px with the base link underline: 1px, `blue-pencil` at 70%, offset 0.2em; hover turns the underline ink.
- **Icon Button:** 32px, 4px corner, ink-secondary; hover fills with the hairline rule tone.

### Chips
- **Style:** transparent, hairline inset, Libre Franklin 600 14px ink-secondary, 7px 12px, 1px corner.
- **State:** hover darkens text and stroke to ink-tertiary; pressed is solid ink with board-colored text and no stroke. Used for store category and permission filters.

### Marks (permission tags)
Dashed 1px non-photo-blue border, 2px corner, blue pencil Libre Franklin 600 12.5px. "No permissions" drops to ink-tertiary with a hairline-rule border.

### Cards / Containers (Galleys)
- **Corner Style:** 1px.
- **Background:** galley paper; inset surfaces in paper tint.
- **Shadow Strategy:** Paper at rest, Lift on hover for linked galleys (rise 2px, 0.25s).
- **Border:** none; the slug foot is divided by a dashed non-photo-blue rule.
- **Internal Padding:** 26px 28px 16px (22px 20px 14px under 760px); lead galleys 30px 32px 16px, strip galleys 16px 18px 10px.
- **Extension galley:** monogram tile + name (Libre Franklin 740 20px), serif description, permission marks, slug of categories and version.

### Inputs / Fields
- **Style:** store search on galley paper, 46px tall, 1px corner, paper shadow plus hairline inset, Source Serif 17px, stroked search icon inset 14px.
- **Focus:** the global 2px blue-pencil outline at 3px offset.

### Navigation
Sticky 64px masthead (58px under 760px) on board at 96% with a `grid-major` bottom rule, followed by the pica ruler with Courier Prime pencil numbers every six picas. Links are Libre Franklin 600 15px ink-secondary; hover goes ink; the current page gets ink text and a 2px ink underline drawn as an inset shadow. The language switch is set as a Courier Prime 700 13px slug. The quiet Download tab closes the bar.

### Terminal Block
Paper tint with hairline inset; a slug-labelled bar with a Copy button (paper, hairline, Libre Franklin 600 13px; copied state turns blue pencil); Courier Prime 14.5px lines with a "$ " prompt in ink-tertiary and hanging indent.

### Crop Marks and Registration
Prints and the demo panel sit inside 13px hairline crop marks offset 20px from the image (8px and 12px on small screens), drawn in `crop-mark` at 85%. A 26px registration target marks the corner of the install sheet, the hero, and the colophon mark.

### Demo Panel (signature)
The live yabbistir panel under the hero draft caret, drawn entirely with the app tokens and system font: 16px panel, 56px search field with an app-accent caret, 40px rows with 8px corners, hover and selected fills, highlighted matches, and a footer action bar with keycaps. Arrow keys move the selection and Return pastes the row into the draft line above. It is framed by crop marks and captioned by a blue pencil note.

### Motion
Galleys settle onto the board once: they start 14px high and rotated -0.5° under the Lift shadow, then slide and press into place over 0.9s on `cubic-bezier(0.16, 1, 0.3, 1)` while the shadow tightens to Paper. The hero galley falls from 34px at -1.4° over 1.1s; the demo panel follows at 1.2s with a 0.12s delay. Triggered once by intersection; never replayed. The draft caret blinks at 1.06s in steps. Reduced motion removes the settle and the blink.

## Do's and Don'ts

### Do:
- **Do** press every new fact onto the board as a galley: paper, 1px corner, Paper shadow, slug line at the foot.
- **Do** give each view exactly one filled rubylith tab for its primary action.
- **Do** frame photos, films and the demo panel with hairline crop marks.
- **Do** set versions, ids, sizes, dates and categories in Courier Prime as slugs with tabular figures.
- **Do** write annotations and captions in blue pencil, led by the 26px pencil rule.
- **Do** keep paper lit with dark ink in dark mode by adding new paper components to the scoped paper context.
- **Do** draw any depiction of the app with the app's own tokens and system font.
- **Do** draw icons as inline stroked SVG from the sprite, 1.35 to 1.8 stroke, round caps.

### Don't:
- **Don't** use SF Symbols on the web; extensions are represented by two-letter monogram tiles.
- **Don't** use rubylith for decoration, secondary buttons, headings or illustrations.
- **Don't** round paper beyond 1px or swap the soft paper shadow for a glow, glass, or hard offset shadow.
- **Don't** invert galleys in dark mode; only the board and its notes change.
- **Don't** let the app's panel tokens (blue accent, 8 to 16px radii, system font) dress board components.
- **Don't** replay the settle motion on scroll back, or animate anything else on entry.
- **Don't** set uppercase letterspaced labels above headlines.
