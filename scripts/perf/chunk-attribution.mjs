// PT25.1 — Modul-Attribution eines Chunks ueber seine Sourcemap (Bytes je Quellmodul).
// Aufruf: node scripts/perf/chunk-attribution.mjs <chunk.js> [top]
// Voraussetzung: Build mit `vite build --sourcemap` (eigener Ausgabeordner, nicht dist/).
import { readFileSync } from 'node:fs'
import { SourceMapConsumer } from 'source-map-js'

const file = process.argv[2]
const top = Number(process.argv[3] || 40)
const code = readFileSync(file, 'utf8')
const map = new SourceMapConsumer(JSON.parse(readFileSync(file + '.map', 'utf8')))
const lines = code.split('\n')
const bytes = new Map()
// Jede generierte Spalte dem Quellmodul des vorangehenden Mappings zuordnen.
const segs = []
map.eachMapping((m) => segs.push(m))
segs.sort((a, b) => a.generatedLine - b.generatedLine || a.generatedColumn - b.generatedColumn)
for (let i = 0; i < segs.length; i++) {
  const s = segs[i]
  const n = segs[i + 1]
  const lineText = lines[s.generatedLine - 1] || ''
  const end = n && n.generatedLine === s.generatedLine ? n.generatedColumn : lineText.length
  const len = Buffer.byteLength(lineText.slice(s.generatedColumn, end))
  const key = (s.source || '(ohne Quelle)')
    .replace(/^.*node_modules\//, 'node_modules/')
    .replace(/^(\.\.\/)+/, '')
  bytes.set(key, (bytes.get(key) || 0) + len)
}
const total = Buffer.byteLength(code)
const group = new Map()
for (const [k, v] of bytes) {
  const g = k.startsWith('node_modules/')
    ? k
        .split('/')
        .slice(0, k.split('/')[1].startsWith('@') ? 3 : 2)
        .join('/')
    : k.split('/').slice(0, 3).join('/')
  group.set(g, (group.get(g) || 0) + v)
}
const kb = (n) => (n / 1024).toFixed(1).padStart(7)
console.log(
  `${file}: ${kb(total)} KB gesamt, zugeordnet ${kb([...bytes.values()].reduce((a, b) => a + b, 0))} KB`,
)
console.log('\n-- Gruppen --')
;[...group]
  .sort((a, b) => b[1] - a[1])
  .slice(0, top)
  .forEach(([k, v]) =>
    console.log(`${kb(v)} KB  ${((v / total) * 100).toFixed(1).padStart(5)} %  ${k}`),
  )
console.log('\n-- Einzelmodule --')
;[...bytes]
  .sort((a, b) => b[1] - a[1])
  .slice(0, top)
  .forEach(([k, v]) => console.log(`${kb(v)} KB  ${k}`))
