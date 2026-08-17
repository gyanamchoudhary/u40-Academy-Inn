import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { build } from "vite"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const routes = [
  { path: "/", outDir: ".", outFile: "index.html" },
  { path: "/privacy", outDir: "privacy", outFile: "index.html" },
  { path: "/terms", outDir: "terms", outFile: "index.html" },
]

const fontFaces = [
  { family: "Manrope", weight: 400, file: "manrope-400.woff2" },
  { family: "Manrope", weight: 500, file: "manrope-500.woff2" },
  { family: "Manrope", weight: 600, file: "manrope-600.woff2" },
  { family: "Manrope", weight: 700, file: "manrope-700.woff2" },
  { family: "Manrope", weight: 800, file: "manrope-800.woff2" },
  { family: "Roboto Mono", weight: 400, file: "roboto-mono-400.woff2" },
  { family: "Roboto Mono", weight: 500, file: "roboto-mono-500.woff2" },
  { family: "Roboto Mono", weight: 600, file: "roboto-mono-600.woff2" },
]

function buildFontCss() {
  return fontFaces
    .map(
      (font) => `@font-face {
  font-family: "${font.family}";
  font-style: normal;
  font-weight: ${font.weight};
  font-display: swap;
  src: url(/assets/fonts/${font.file}) format("woff2");
}`,
    )
    .join("\n")
}

async function prerender() {
  await build({
    configFile: path.resolve(__dirname, "../vite.config.ssr.ts"),
  })

  const { render } = await import(
    path.resolve(__dirname, "../dist/ssr/entry-server.js")
  )

  const templatePath = path.resolve(__dirname, "../dist/public/index.html")
  let template = fs.readFileSync(templatePath, "utf-8")

  const fontPreloads = fontFaces
    .map(
      (font) =>
        `<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/${font.file}" crossorigin>`,
    )
    .join("\n    ")
  const inlineCss = `<style>${buildFontCss()}</style>`
  template = template.replace(
    "<!-- GOOGLE_FONTS_CSS -->",
    `${fontPreloads}\n    ${inlineCss}`,
  )
  console.log(`Inlined local font CSS and preloaded ${fontFaces.length} font files`)

  for (const route of routes) {
    const shell = render(route.path)

    const html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${shell}</div>`
    )

    const outDir = path.resolve(__dirname, "../dist/public", route.outDir)
    fs.mkdirSync(outDir, { recursive: true })
    const outPath = path.resolve(outDir, route.outFile)
    fs.writeFileSync(outPath, html)
    console.log(`Prerendered ${route.path} into ${path.relative(path.resolve(__dirname, "../dist/public"), outPath)}`)
  }
}

prerender().catch((err) => {
  console.error(err)
  process.exit(1)
})