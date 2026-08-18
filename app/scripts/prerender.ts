import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const routes = [
  {
    path: "/",
    outDir: ".",
    outFile: "index.html",
    seo: {
      title: "Residential Science Academy in Malda | U40 Academy Inn",
      description:
        "Residential science academy and boys’ hostel in Malda for Classes IX–XII, NEET, IIT-JEE and WBJEE preparation. Explore admissions at U40.",
      canonical: "https://u40academy.com/",
    },
  },
  {
    path: "/privacy",
    outDir: "privacy",
    outFile: "index.html",
    seo: {
      title: "Privacy Policy | U40 Academy Inn",
      description:
        "Learn how U40 Academy Inn collects, uses and protects information submitted through its admission inquiry form and website.",
      canonical: "https://u40academy.com/privacy/",
    },
  },
  {
    path: "/terms",
    outDir: "terms",
    outFile: "index.html",
    seo: {
      title: "Website Terms | U40 Academy Inn",
      description:
        "Read the terms governing use of the U40 Academy Inn website, admission inquiries, intellectual property and information provided online.",
      canonical: "https://u40academy.com/terms/",
    },
  },
];

const fontFaces = [
  { family: "Manrope", weight: 400, file: "manrope-400.woff2" },
  { family: "Manrope", weight: 500, file: "manrope-500.woff2" },
  { family: "Manrope", weight: 600, file: "manrope-600.woff2" },
  { family: "Manrope", weight: 700, file: "manrope-700.woff2" },
  { family: "Manrope", weight: 800, file: "manrope-800.woff2" },
  { family: "Roboto Mono", weight: 400, file: "roboto-mono-400.woff2" },
  { family: "Roboto Mono", weight: 500, file: "roboto-mono-500.woff2" },
  { family: "Roboto Mono", weight: 600, file: "roboto-mono-600.woff2" },
];

const fontPreloadFiles = new Set(["manrope-600.woff2"]);

function buildFontCss() {
  return fontFaces
    .map(
      font => `@font-face {
  font-family: "${font.family}";
  font-style: normal;
  font-weight: ${font.weight};
  font-display: swap;
  src: url(/assets/fonts/${font.file}) format("woff2");
}`
    )
    .join("\n");
}

function escapeAttribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function applyRouteSeo(
  html: string,
  seo: { title: string; description: string; canonical: string }
) {
  const title = escapeAttribute(seo.title);
  const description = escapeAttribute(seo.description);
  const canonical = escapeAttribute(seo.canonical);

  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${description}" />`
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:title" content="${title}" />`
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:description" content="${description}" />`
    )
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:url" content="${canonical}" />`
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
      `<meta name="twitter:title" content="${title}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
      `<meta name="twitter:description" content="${description}" />`
    )
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
      `<link rel="canonical" href="${canonical}" />`
    );
}

async function prerender() {
  await build({
    configFile: path.resolve(__dirname, "../vite.config.ssr.ts"),
  });

  const { render } = await import(
    path.resolve(__dirname, "../dist/ssr/entry-server.js")
  );

  const templatePath = path.resolve(__dirname, "../dist/public/index.html");
  let template = fs.readFileSync(templatePath, "utf-8");

  const fontPreloads = fontFaces
    .filter(font => fontPreloadFiles.has(font.file))
    .map(
      font =>
        `<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/${font.file}" crossorigin>`
    )
    .join("\n    ");
  const inlineCss = `<style>${buildFontCss()}</style>`;
  template = template.replace(
    "<!-- GOOGLE_FONTS_CSS -->",
    `${fontPreloads}\n    ${inlineCss}`
  );
  console.log(
    `Inlined local font CSS and preloaded ${fontPreloadFiles.size} critical font file`
  );

  for (const route of routes) {
    const shell = render(route.path);

    const html = applyRouteSeo(template, route.seo).replace(
      '<div id="root"></div>',
      `<div id="root">${shell}</div>`
    );

    const outDir = path.resolve(__dirname, "../dist/public", route.outDir);
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.resolve(outDir, route.outFile);
    fs.writeFileSync(outPath, html);
    console.log(
      `Prerendered ${route.path} into ${path.relative(path.resolve(__dirname, "../dist/public"), outPath)}`
    );
  }
}

prerender().catch(err => {
  console.error(err);
  process.exit(1);
});
