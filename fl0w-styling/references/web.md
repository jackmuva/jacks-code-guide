# Web patterns (Next.js / Tailwind / CSS)

For fl0w-work and other web surfaces. Import `assets/theme.css` (or merge its variables into the
app's `globals.css`) and build with the tokens below. fl0w-work uses Tailwind v4 `@theme` tokens; map
these variables there if you want utility classes (`bg-paper`, `text-ink`, …).

## Page

```css
body {
  background: var(--fl0w-paper);
  color: var(--fl0w-ink);
  font-family: var(--font-dm-sans), system-ui, sans-serif;
}
.reading {
  max-width: 68ch;
  margin-inline: auto;
  padding-inline: 1.5rem;
  font-family: var(--font-fraunces), Georgia, serif;
  font-size: 1.0625rem;
  line-height: 1.7;
}
```

No gradients, glows, or drop-shadow-heavy cards. Daylight is soft: at most a very low, warm shadow
under raised sheets (`0 1px 2px rgb(42 42 40 / 0.06), 0 8px 24px rgb(42 42 40 / 0.08)`).

## Header

```html
<header class="page-header">
  <span></span>
  <span class="title">Triage open issues</span>
  <time>1:47 PM</time>
</header>
```
```css
.page-header { display: grid; grid-template-columns: 1fr 2fr 1fr; align-items: baseline;
  padding: .75rem 1.5rem; border-bottom: 1px solid var(--fl0w-edge); color: var(--fl0w-muted);
  font-size: .8125rem; }
.page-header .title { text-align: center; }
.page-header time { text-align: right; font-variant-numeric: tabular-nums; }
```

No logo or wordmark in the reading header; branding belongs on marketing pages.

## Progress footer

```html
<footer class="progress"><div class="bar"><span style="width:34%"></span></div><span>34%</span></footer>
```
```css
.progress { display: flex; gap: .75rem; align-items: center; color: var(--fl0w-muted); font-size: .75rem; }
.progress .bar { flex: 1; height: 1px; background: var(--fl0w-edge); }
.progress .bar span { display: block; height: 2px; margin-top: -0.5px; background: var(--fl0w-graphite); }
.progress.warn { color: var(--fl0w-clay); }
.progress.warn .bar span { background: var(--fl0w-clay); }
```

## Chapter heading / section break

```css
.chapter { display: flex; align-items: center; gap: .75rem; color: var(--fl0w-muted);
  font: 500 .8125rem/1 var(--font-dm-sans); letter-spacing: .02em; margin: 2rem 0 1rem; }
.chapter::before, .chapter::after { content: ""; flex: 1; border-top: 1px solid var(--fl0w-edge); }
.chapter strong { color: var(--fl0w-ink); font-weight: 600; }
.asterism { text-align: center; color: var(--fl0w-faint); margin: 2rem 0; }  /* content: ⁂ */
```

## Dialog / sheet

```css
.backdrop { background: rgb(42 42 40 / 0.18); }
.sheet { background: var(--fl0w-paper-raised); padding: 1.25rem 1.5rem; border: none;
  border-radius: 6px; box-shadow: 0 8px 24px rgb(42 42 40 / 0.08); }
.sheet h2 { font-weight: 600; padding-bottom: .5rem; margin-bottom: .75rem;
  border-bottom: 1px solid var(--fl0w-edge); }
.sheet.danger h2 { color: var(--fl0w-error); }
```

Keep radii small (≤6px) — paper has nearly square corners.

## Controls

- Inputs: `background: var(--fl0w-paper-deep); border: none; border-bottom: 1px solid var(--fl0w-edge);`
  caret `var(--fl0w-clay)`, placeholder `var(--fl0w-placeholder)`.
- Primary button: ink fill with paper text (`bg ink / text paper`) — like an e-ink invert.
  Secondary: transparent with `--fl0w-edge` underline or hairline outline.
- Selected list row: `--fl0w-highlight` background, ink text.
- Links: moss, underline offset 3px, thin decoration.
- Status chips: text color only (moss / clay / error) on paper; avoid filled color pills.

## Code

Background `var(--fl0w-paper-deep)`, text ink, IBM Plex Mono. Token colors mirror
`assets/syntax-style.ts`: keywords bold ink, strings moss, numbers clay, comments muted italic, types
inkSoft italic. With Shiki, build a custom theme from these values rather than picking a stock light
theme (stock themes are too saturated).
