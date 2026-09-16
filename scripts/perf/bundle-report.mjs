// PT25.1 — Bundle-/Asset-Report aus dem Vite-Manifest eines Produktionsbuilds.
// Aufruf: node scripts/perf/bundle-report.mjs [clientDir] [--json out.json]
// Liefert: initiales JS/CSS (statischer Abschluss des Entry), dynamische Chunks,
// Route-JS je Matrix-Seitenmodul, Font- und Bildinventar (raw/gzip/brotli).
// Exit 1, wenn Manifest fehlt/unparsebar ist oder das Inventar unvollstaendig ist.
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import { gzipSync, brotliCompressSync, constants } from 'node:zlib'

const dir = (
  process.argv[2] && !process.argv[2].startsWith('--')
    ? process.argv[2]
    : 'node_modules/.cache/pt25.1/client'
).replace(/\/?$/, '/')
const jsonOut = process.argv.includes('--json')
  ? process.argv[process.argv.indexOf('--json') + 1]
  : null
const manifestFile = dir + '.vite/manifest.json'
if (!existsSync(manifestFile)) {
  console.error(`Manifest fehlt: ${manifestFile} — zuerst "npm run perf:build"`)
  process.exit(1)
}
const m = JSON.parse(readFileSync(manifestFile, 'utf8'))

const size = (f) => {
  const b = readFileSync(dir + f)
  return {
    raw: b.length,
    gzip: gzipSync(b, { level: 9 }).length,
    brotli: brotliCompressSync(b, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length,
  }
}
const add = (a, b) => ({ raw: a.raw + b.raw, gzip: a.gzip + b.gzip, brotli: a.brotli + b.brotli })
const ZERO = { raw: 0, gzip: 0, brotli: 0 }

const entryKey = Object.keys(m).find((k) => m[k].isEntry)
const initial = new Set()
const initialCss = new Set()
const walk = (k) => {
  if (initial.has(k)) return
  initial.add(k)
  ;(m[k].css || []).forEach((c) => initialCss.add(c))
  ;(m[k].imports || []).forEach(walk)
}
walk(entryKey)

const initialJs = [...initial]
  .map((k) => ({ key: k, file: m[k].file, ...size(m[k].file) }))
  .sort((a, b) => b.raw - a.raw)
const css = [...initialCss].map((f) => ({ file: f, ...size(f) }))
const dynamic = Object.entries(m)
  .filter(([k, v]) => !initial.has(k) && v.file.endsWith('.js'))
  .map(([k, v]) => ({ key: k, file: v.file, ...size(v.file) }))
  .sort((a, b) => b.raw - a.raw)

// Route-JS: Seitenmodul + dessen nicht-initiale statische Imports (ohne weitere dynamische Imports).
const PAGE_MODULES = {
  'diagnostics-hub': 'src/pages/ServicesOverviewPage.tsx',
  'service-detail': 'src/pages/ServicePage.tsx',
  'igloo-pro': 'src/pages/IglooProPage.tsx',
  'epigenetics-hub': 'src/pages/EpigeneticsPage.tsx',
  'epigenetics-deep': 'src/pages/EpigeneticsBasicsPage.tsx',
  musterbefund: 'src/pages/musterbefund/metabolic-health.tsx',
  'articles-index': 'src/pages/ArticlesIndexPage.tsx',
  'article-detail': 'src/pages/articles/die-gruene-praxis.tsx',
  events: 'src/pages/EventsPage.tsx',
  downloads: 'src/pages/DownloadsPage.tsx',
  contact: 'src/pages/ContactPage.tsx',
  'not-found': 'src/pages/NotFoundPage.tsx',
  // PT25.2: Home und Consumer ueber den Manifest-Eintrag; ohne eigenen Eintrag liegen sie im Entry-Chunk.
  home: 'src/pages/HomePage.tsx',
  'consumer-d3': 'src/pages/consumer/SprayPage.tsx',
  'consumer-duo': 'src/pages/consumer/DuoPage.tsx',
}
const routeJs = {}
const missing = []
for (const [id, src] of Object.entries(PAGE_MODULES)) {
  if (!m[src]) {
    // Statisch importierte Seiten haben keinen eigenen Manifest-Eintrag: sie liegen im Entry-Chunk.
    if (['home', 'consumer-d3', 'consumer-duo'].includes(id)) {
      routeJs[id] = { module: src, chunks: [], inEntry: true, ...ZERO }
    } else missing.push(src)
    continue
  }
  const seen = new Set()
  const w = (k) => {
    if (seen.has(k) || initial.has(k)) return
    seen.add(k)
    ;(m[k]?.imports || []).forEach(w)
  }
  w(src)
  routeJs[id] = {
    module: src,
    chunks: [...seen].map((k) => m[k].file),
    ...[...seen].reduce((a, k) => add(a, size(m[k].file)), ZERO),
  }
}

const assets = readdirSync(dir + 'assets')
const fonts = assets
  .filter((f) => f.endsWith('.woff2'))
  .map((f) => ({ file: 'assets/' + f, bytes: size('assets/' + f).raw }))
const images = assets
  .filter((f) => /\.(webp|avif|png|jpe?g|svg|gif)$/i.test(f))
  .map((f) => ({
    file: 'assets/' + f,
    format: f.split('.').pop().toLowerCase(),
    bytes: readFileSync(dir + 'assets/' + f).length,
  }))
  .sort((a, b) => b.bytes - a.bytes)
const cssText = css.map((c) => readFileSync(dir + c.file, 'utf8')).join('\n')
const fontFaces = (cssText.match(/@font-face\{[^}]*\}/g) || []).map((f) => ({
  family: /font-family:([^;]+)/.exec(f)?.[1],
  display: /font-display:([a-z]+)/.exec(f)?.[1] ?? null,
  file: /url\(([^)]+)\)/.exec(f)?.[1] ?? null,
  unicodeRange: /unicode-range:([^;}]+)/.exec(f)?.[1]?.slice(0, 40) ?? null,
}))

const report = {
  clientDir: dir,
  entry: entryKey,
  initialJs,
  initialJsTotal: initialJs.reduce(add, ZERO),
  initialCss: css,
  initialCssTotal: css.reduce(add, ZERO),
  dynamicChunks: dynamic.length,
  dynamicTotal: dynamic.reduce(add, ZERO),
  largestDynamic: dynamic.slice(0, 25),
  routeJs,
  fonts,
  fontFaces,
  images,
  imagesByFormat: images.reduce((a, i) => ((a[i.format] = (a[i.format] || 0) + i.bytes), a), {}),
  manualChunks:
    'vite.config.ts build.rollupOptions.output.manualChunks (vendor-react, vendor-i18n, vendor-seo)',
}

const problems = []
if (!initialJs.length) problems.push('kein initiales JS')
if (!css.length) problems.push('kein initiales CSS')
if (missing.length) problems.push('Seitenmodule nicht im Manifest: ' + missing.join(', '))
if (!fonts.length) problems.push('keine Fontdateien emittiert')
if (
  fontFaces.filter((f) => f.file).some((f) => !assets.includes(f.file.replace(/^\/?assets\//, '')))
)
  problems.push('@font-face verweist auf nicht emittierte Datei')
if (!images.length) problems.push('keine Bilder emittiert')

const kb = (n) => (n / 1024).toFixed(1)
const t = report.initialJsTotal,
  c = report.initialCssTotal
console.log(
  `Initial JS ${kb(t.raw)} KB raw / ${kb(t.gzip)} gzip / ${kb(t.brotli)} brotli in ${initialJs.length} Dateien; CSS ${kb(c.raw)} / ${kb(c.gzip)} / ${kb(c.brotli)}`,
)
console.log(
  `${dynamic.length} dynamische Chunks, ${kb(report.dynamicTotal.raw)} KB raw; ${fonts.length} Fonts (${kb(fonts.reduce((a, f) => a + f.bytes, 0))} KB); ${images.length} Bilder (${kb(images.reduce((a, i) => a + i.bytes, 0))} KB)`,
)
for (const [id, r] of Object.entries(routeJs))
  console.log(
    `  route ${id.padEnd(16)} ${r.inEntry ? 'im Entry-Chunk' : `${kb(r.raw)} KB raw / ${kb(r.gzip)} gzip (${r.chunks.length} Chunks)`}`,
  )
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(report, null, 2))
if (problems.length) {
  console.error('UNVOLLSTAENDIG: ' + problems.join('; '))
  process.exit(1)
}
