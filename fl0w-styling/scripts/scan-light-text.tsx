// Flags text that would vanish on the paper background (near-white foregrounds) in OpenTUI views.
//
// Usage: copy into the project's src/ (so @opentui packages resolve), edit SCENES to render the
// components you changed, then:
//   bun src/scan-light-text.tsx                 # report light text per scene
//   bun src/scan-light-text.tsx --html out.html # also dump every frame as colored HTML
// Delete the copy afterwards. Exit code is 1 when any scene has light text.
import { testRender } from "@opentui/react/test-utils"
import type { ReactNode } from "react"
// Adjust this import to the project's theme module.
import { theme } from "./ui/theme"

const WIDTH = 120
const HEIGHT = 40
const LUMINANCE_LIMIT = 0.7
// Rules, borders and ornaments are meant to be pale; only words count.
const DECORATIVE = /^[\s\u2500-\u259f⁂·•]*$/

// One entry per view to check. Replace these examples with the project's own components.
const SCENES: Record<string, ReactNode> = {
  example: <text fg={theme.ink}>Replace with the component under test</text>,
}

type Color = { r: number; g: number; b: number; a: number }
const hex = (c: Color, fallback: string) => c.a === 0
  ? fallback
  : "#" + [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("")
const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;")

const htmlIndex = process.argv.indexOf("--html")
const htmlPath = htmlIndex > -1 ? process.argv[htmlIndex + 1] : undefined
let html = ""
let failed = false

for (const [name, node] of Object.entries(SCENES)) {
  const setup = await testRender(
    <box width="100%" height="100%" backgroundColor={theme.paper} flexDirection="column">{node}</box>,
    { width: WIDTH, height: HEIGHT },
  )
  // Markdown, highlighting and onSizeChange layouts settle over a few frames.
  for (let frame = 0; frame < 4; frame++) {
    await setup.renderOnce()
    await new Promise((resolve) => setTimeout(resolve, 150))
  }
  const captured = setup.captureSpans()
  const light = new Set<string>()
  captured.lines.forEach((line, row) => line.spans.forEach((span) => {
    const luminance = 0.2126 * span.fg.r + 0.7152 * span.fg.g + 0.0722 * span.fg.b
    if (!DECORATIVE.test(span.text) && span.fg.a > 0 && luminance > LUMINANCE_LIMIT) {
      light.add(`row ${row}: "${span.text.trim().slice(0, 50)}" fg=${hex(span.fg, "")}`)
    }
  }))
  if (light.size) failed = true
  console.log(light.size ? `✗ ${name}\n  ${[...light].join("\n  ")}` : `✓ ${name}`)

  if (htmlPath) {
    html += `<h3 style="font:600 13px system-ui;margin:12px 0 4px">${escape(name)}</h3>`
      + `<pre style="font:13px/1.15 Menlo,monospace;margin:0;display:inline-block">`
      + captured.lines.map((line) => line.spans.map((span) =>
        `<span style="color:${hex(span.fg, theme.ink)};background:${hex(span.bg, theme.paper)};`
        + `${span.attributes & 1 ? "font-weight:700;" : ""}${span.attributes & 4 ? "font-style:italic;" : ""}">`
        + `${escape(span.text)}</span>`).join("")).join("\n")
      + "</pre>"
  }
  setup.renderer.destroy()
}

if (htmlPath) await Bun.write(htmlPath, `<!doctype html><meta charset="utf-8"><body style="margin:0;padding:16px;background:#c9c7c0">${html}</body>`)
process.exit(failed ? 1 : 0)
