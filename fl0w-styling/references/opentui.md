# OpenTUI (terminal) patterns

For `@opentui/react` apps such as fl0w-cli (`src/ui/`). The live implementation to copy from is
fl0w-cli: `src/ui/theme.ts`, `src/ui/App.tsx`, `src/ui/components/transcript/PhaseFrame.tsx`,
`src/ui/components/primitives/ContextCostStatusBar.tsx`, `src/ui/components/dialogs/*`.

## Contents
1. Defaults that break light themes
2. Page and renderer background
3. Reading column
4. Header
5. Progress footer
6. Chapter headings and turn breaks
7. Dialog sheets
8. Inputs, selects, code, markdown, diff
9. Verification

## 1. Defaults that break light themes

OpenTUI assumes a dark terminal. These default to white or dark-theme colors and must be set:

| Element | Default | Set |
|---|---|---|
| `<text>` with no `fg` | white | `fg={theme.ink}` on every `<text>`; `<span>` inherits from its `<text>` |
| `fg={cond ? x : undefined}` | white fallback | `fg={cond ? x : theme.ink}` |
| `<textarea>`, `<input>` | white text, dark focus bg | `{...textareaColors}` |
| `<select>` | white text, `#334455` selection, yellow selected text | `{...selectColors}` |
| `<code>` with plaintext/unknown filetype | white (syntax `default` style is not applied) | `fg={theme.ink}` |
| `<markdown>` | white base | `fg={theme.ink}` plus paper `syntaxStyle` |
| `<diff>` | `#1a4d1a`/`#4d1a1a` bgs, `#888` line numbers | `fg`, `addedBg`, `removedBg`, `addedSignColor`, `removedSignColor`, `lineNumberFg` |
| `<box border>` with no `borderColor` | white | always pass `borderColor` |
| scrollbox scrollbar | dark track | `scrollbarOptions={{ trackOptions: { backgroundColor: theme.paper, foregroundColor: theme.edge } }}` |
| backdrop `#000` at 0.45 | too heavy on paper | `backgroundColor={theme.shade} opacity={0.18}` |

## 2. Page and renderer background

```tsx
const renderer = await createCliRenderer({ backgroundColor: "#efede6", /* ... */ })

<box flexDirection="column" height={height} width="100%" paddingY={1} paddingX={3}
  position="relative" backgroundColor={theme.paper}>
```

No outer frame or bezel — the page fills the terminal; margins come from padding.

## 3. Reading column

Center the main column and cap its width so lines read like a page. Side panels (e.g. the plan
sidebar) sit to the **left**, separated by a single right-hand rule.

```tsx
<box flexDirection="row" flexGrow={1} minHeight={0} width="100%">
  {showSidebar && <Sidebar />}  {/* border={["right"]} borderColor={theme.edge} paddingRight={1} marginRight={2} */}
  <box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0} height="100%" alignItems="center">
    <box flexDirection="column" flexGrow={1} minHeight={0} width="100%" maxWidth={READING_WIDTH}>
      {/* scrollbox transcript, status line (height={1} so it never jumps), input, footer */}
    </box>
  </box>
</box>
```

## 4. Header

Title centered (muted), clock right, thin rule underneath, no wordmark. Keep an empty left box so the
title stays centered. Isolate the clock in its own component so the app doesn't re-render on ticks.

```tsx
const Clock = () => {
  const format = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  const [time, setTime] = useState(format)
  useEffect(() => { const id = setInterval(() => setTime(format()), 15_000); return () => clearInterval(id) }, [])
  return <text fg={theme.muted} selectable={false}>{time}</text>
}

<box flexDirection="row" flexShrink={0} width="100%" marginBottom={1} border={["bottom"]} borderColor={theme.edge}>
  <box flexGrow={1} flexBasis={0} />
  <box flexGrow={2} flexBasis={0} alignItems="center" minWidth={0}>
    <text fg={theme.muted} selectable={false} wrapMode="none">{title}</text>
  </box>
  <box flexGrow={1} flexBasis={0} alignItems="flex-end"><Clock /></box>
</box>
```

## 5. Progress footer

A thin e-reader progress line at the foot of the column: heavy `━` fill in graphite (clay when
warning), light `─` track in `edge`, stats at the end. Measure width with `onSizeChange`; shorten the
label before shrinking the bar below ~8 cells.

```tsx
<box flexDirection="row" width="100%" height={1} flexShrink={0} marginTop={1}
  onSizeChange={function (this: BoxRenderable) { setWidth(this.width) }}>
  <text fg={theme.edge} selectable={false} wrapMode="none">
    <span fg={warn ? theme.clay : theme.graphite}>{"━".repeat(filled)}</span>
    {"─".repeat(barWidth - filled)}
    <span fg={warn ? theme.clay : theme.muted}>{`  ${label}`}</span>
  </text>
</box>
```

## 6. Chapter headings and turn breaks

Section headings are centered text between two flexible rules. A box with only a top border at
`height={1}` draws a clean full-width line.

```tsx
<box flexDirection="row" width="100%" height={1} flexShrink={0} marginBottom={1}
  backgroundColor={hovered ? theme.hover : "transparent"} onMouseDown={toggle}>
  <box flexGrow={1} height={1} border={["top"]} borderColor={theme.edge} />
  <text fg={theme.ink} selectable={false} flexShrink={0} wrapMode="none">
    <span fg={theme.muted}>{expanded ? " ▾ " : " ▸ "}</span>
    <span fg={accent}>Plan</span>
    <span fg={theme.muted}>{" · 3 steps "}</span>
  </text>
  <box flexGrow={1} height={1} border={["top"]} borderColor={theme.edge} />
</box>
```

Live/in-progress variant: `" ● Plan… "` in the accent. Between conversation turns (not before the
first), a centered `⁂` in `faint` with a blank line below.

## 7. Dialog sheets

Box-drawing borders sit mid-cell, so the sheet's background peeks out around the line and frames look
ragged. Use a borderless sheet with a title rule instead:

```tsx
<box position="absolute" top={0} left={0} width="100%" height="100%" zIndex={5}
  backgroundColor={theme.shade} opacity={0.18} />
<box position="absolute" top={top} left={left} width={w} height={h} zIndex={10}
  backgroundColor={theme.paperRaised} flexDirection="column" paddingX={2} paddingY={1}>
  <box flexShrink={0} width="100%" border={["bottom"]} borderColor={theme.edge}>
    <text fg={theme.ink}><strong>Resume session</strong></text>
  </box>
  {/* body */}
</box>
```

- `paddingX={2}` matches the inner width of the old `border + padding={1}`, so width math holds; the
  title rule takes one of the two rows freed by dropping the border.
- Destructive confirm: title in `theme.error`, backdrop opacity ~0.55 (it stacks over a dialog).
- Popup on a sheet: `backgroundColor={theme.paperDeep}` so it reads as a layer without a border.
- Inline panels in the page (e.g. clarifying questions): `paperDeep`, `paddingX={2} paddingY={1}`,
  same title rule.

## 8. Inputs, selects, code, markdown, diff

```tsx
<textarea {...textareaColors} placeholder="What would you like to do" />
<select {...selectColors} options={options} />
<code content={src} filetype={ft} syntaxStyle={syntaxStyle} fg={theme.ink} />
<markdown content={md} syntaxStyle={syntaxStyle} fg={theme.ink} />
<diff diff={d} syntaxStyle={syntaxStyle} fg={theme.ink} lineNumberFg={theme.faint}
  addedBg={theme.addedBg} removedBg={theme.removedBg}
  addedSignColor={theme.moss} removedSignColor={theme.error} />
```

`assets/syntax-style.ts` covers code scopes (keyword bold ink, string moss, number clay, comment
muted italic, type inkSoft italic) and markdown scopes (`markup.heading`, `markup.strong`,
`markup.italic`, `markup.quote`, `markup.list`, `markup.raw`, `markup.link*`, `conceal`).

Chat input: a `paperDeep` well with `paddingX={1} paddingY={1}`, cursor in clay.

## 9. Verification

1. `bun run lint` / typecheck.
2. Copy `scripts/scan-light-text.tsx` into the project's `src/` (bun resolves packages relative to
   the file), add scenes for every view you touched, run `bun src/scan-light-text.tsx`, then delete
   it. It renders each scene with `@opentui/react/test-utils` and lists any non-space glyph whose
   foreground luminance is above 0.7.
3. For a visual check, pass `--html out.html` to the scan script to dump the frames, then
   screenshot with headless Chrome:
   `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --window-size=1500,900 --screenshot=out.png file:///abs/path/out.html`.
   Faint horizontal lines in that HTML are a browser artifact, not part of the TUI.
4. Async renderables (markdown, code highlighting, `onSizeChange`-driven layout) need several
   `renderOnce()` calls with short waits before capturing.
