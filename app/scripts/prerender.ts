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

async function prerender() {
  await build({
    configFile: path.resolve(__dirname, "../vite.config.ssr.ts"),
  })

  const { render } = await import(
    path.resolve(__dirname, "../dist/ssr/entry-server.js")
  )

  const templatePath = path.resolve(__dirname, "../dist/public/index.html")
  const template = fs.readFileSync(templatePath, "utf-8")

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
