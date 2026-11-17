# fl0w e-reader palette

Source of truth: `assets/theme.ts` (TS) and `assets/theme.css` (CSS). The values derive from the
fl0w-work brand (`fl0w-work/app/globals.css`: cream `#f6f1e7`, ink `#1f2a24`, moss `#3f6b53`,
clay `#b4643f`) pulled toward e-ink greys.

## Surfaces

| Token | Hex | Role |
|---|---|---|
| `paper` | `#efede6` | The page. Root background everywhere. |
| `paperRaised` | `#f7f6f2` | Sheets lifted toward the light: dialogs, overlays, menus. |
| `paperDeep` | `#e4e2db` | Wells: text inputs, inline question panels, nested popups on a sheet. |
| `hover` | `#e0ded6` | Hover wash on clickable rows. |
| `highlight` | `#d8d6ce` | Selected list row — a grey "invert", not a colored one. |
| `stone` | `#bdb9b0` | Mid-grey fills (illustrations, mascot body). |
| `shade` | `#2a2a28` | Backdrop behind dialogs at ~18% opacity (≈55% for a confirm stacked on a dialog). |

## Ink (greyscale ramp)

| Token | Hex | Role |
|---|---|---|
| `ink` | `#1f2a24` | Obsidian. Body text, titles, user input, default code. |
| `graphite` | `#4a4843` | Strong secondary: sidebar titles, active tab, plan-phase label. |
| `inkSoft` | `#5c5a55` | Journal/step sentences, italic markdown, types in code. |
| `muted` | `#7c7a74` | Secondary text: hints, counts, subtitles, comments. Lowest grey for sentences. |
| `faint` | `#a3a19a` | Ornaments only: `⁂`, line numbers, concealed markdown markers. |
| `edge` | `#c9c6be` | Rules and connectors: header rule, chapter rules, sidebar divider, empty progress track. |
| `placeholder` | `#9c9a93` | Input placeholders. |

## Accents (status only)

| Token | Hex | Meaning |
|---|---|---|
| `moss` | `#3f6b53` | Done / success / execute phase / strings in code. |
| `olive` | `#6b7a2f` | Small organic details (mascot limbs). Use rarely. |
| `clay` | `#b4643f` | Warning (context near limit), numbers in code, cursor. |
| `orange` | `#c8702f` | The current/in-progress step marker. |
| `error` | `#a8392c` | Errors, destructive dialog titles, removed-line sign. |
| `errorSoft` | `#9c6a62` | Error previews / peeks. |
| `addedBg` / `removedBg` | `#dfe4d8` / `#ead9d3` | Diff line backgrounds. |

## Pairing rules

- Text on `paper`, `paperRaised`, `paperDeep`: use `ink`…`muted`. `muted` on `paperDeep` is the
  lowest-contrast pairing still acceptable for a full sentence.
- Never put text in `faint` or `edge` unless it is decorative.
- One accent per element. A row with a moss check mark keeps its label in `ink` or `moss`, not both
  plus orange.
- Bold/weight carries emphasis before color does (e.g. code keywords are bold `ink`).

## Typography (web)

fl0w-work loads Fraunces (serif, `--font-fraunces`), DM Sans (`--font-dm-sans`) and IBM Plex Mono
(`--font-plex-mono`). For reading surfaces use Fraunces for headings and long-form body, DM Sans for
UI controls, Plex Mono for code and terminal-like text. Line-height 1.6–1.7 for prose; measure
60–75ch.
