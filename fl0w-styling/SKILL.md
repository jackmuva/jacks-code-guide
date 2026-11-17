---
name: fl0w-ereader-ui
description: Design and build UI with the fl0w e-reader look — greyscale e-ink paper, obsidian ink, sparing moss-green and clay-orange accents, a centered reading column, Kindle-style header and progress footer, chapter-style section breaks, and borderless paper-sheet dialogs. Use this whenever building, restyling, or reviewing any fl0w interface (the fl0w-cli OpenTUI terminal app, fl0w-work web pages, docs, landing pages, dashboards, or components), whenever the user mentions the fl0w brand, the e-reader/e-ink/paper/Kindle feel, light reading themes, or asks to make something "feel like fl0w" — even if they don't name this skill.
---

# fl0w e-reader UI

fl0w's interface should feel like reading on a paper e-reader in daylight: a calm grey-cream page,
dark ink, almost no chrome, and color only where it carries meaning. This skill holds the palette,
the layout patterns, and the gotchas learned while restyling the fl0w TUI.

## The feel, in five rules

1. **Paper, not panels.** One continuous page surface (`paper`). Raised surfaces (dialogs) are a
   slightly lighter sheet; wells (inputs) are slightly darker. Separate things with spacing and
   thin rules, not boxes. Avoid full box borders — they look like a terminal app, not a page.
2. **Ink is greyscale.** Text runs obsidian → graphite → muted → faint by importance. Most of the
   screen should be greys.
3. **Color is a status signal.** Moss = done/success, clay/orange = in progress or warning,
   red = error. If a color isn't telling the reader something, make it grey.
4. **Typeset like a book.** A capped reading measure (~92 columns / ~70ch), a quiet header
   (title centered, time right, thin rule under it), a thin progress line at the foot, and
   section breaks as centered headings between rules (`──── Plan · 3 steps ────`) or an
   asterism (`⁂`) between turns.
5. **Every glyph has an explicit color.** Light themes fail silently: anything falling back to a
   default color (often white in TUIs) disappears on paper. Set foreground colors deliberately.

## Workflow

1. Identify the target and read the matching reference:
   - Terminal UI (OpenTUI / React in the terminal, e.g. `fl0w-cli`) → `references/opentui.md`
   - Web (Next.js / Tailwind / CSS, e.g. `fl0w-work`) → `references/web.md`
2. Read `references/palette.md` for token roles before choosing any color. Use tokens by role,
   never ad-hoc hex values.
3. Bring the tokens into the codebase from `assets/` rather than retyping them:
   - `assets/theme.ts` — palette object plus OpenTUI `selectColors` / `textareaColors`
   - `assets/syntax-style.ts` — code and markdown highlighting for paper
   - `assets/theme.css` — the same palette as CSS custom properties (web)
   If the project already has a theme module (fl0w-cli: `src/ui/theme.ts`), extend that instead.
4. Build with the layout patterns in the reference (reading column, header, footer, chapter
   headings, sheets).
5. Verify on the real rendering, not by reading code:
   - TUI: run `scripts/scan-light-text.tsx` (copy into the project's `src/`, adapt the scenes) to
     flag any text drawn in a near-white color, then render a frame to HTML and screenshot it.
   - Web: open the page and check contrast of muted text and the absence of heavy borders.

## Review checklist

- No visible text in white or near-white; no element relying on library default colors.
- No full rectangular borders on dialogs or cards; a title rule instead.
- Accents appear only on status (done, current, warning, error) and a few code tokens.
- Long text sits in a centered, width-capped column with margins on wide screens.
- Header has no logo/wordmark clutter — title, with a thin rule beneath.
- Muted text is still readable: use `muted` (#7c7a74) for secondary text, reserve `faint` for
  ornaments and rules, never for sentences.
