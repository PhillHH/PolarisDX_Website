// PT25.1 — verdichtet Lighthouse-Summaries und Playwright-Collector zu Markdown-Tabellen
// fuer building-docs/PERFORMANCE-CONTRACT.md. Keine Messung, nur Auswertung vorhandener Dateien.
// Aufruf: node scripts/perf/baseline-tables.mjs [lhDir] [resultsDir]
import { readFileSync, existsSync, readdirSync } from 'node:fs'

const lhDir = process.argv[2] || 'node_modules/.cache/pt25.1/lh'
const resDir = process.argv[3] || 'node_modules/.cache/pt25.1/results'
const ms = (v) => (v == null ? '–' : Math.round(v).toLocaleString('de-DE'))
const kb = (v) => (v == null ? '–' : Math.round(v / 1024).toLocaleString('de-DE'))
const load = (f) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null)

for (const f of readdirSync(lhDir)
  .filter((x) => x.startsWith('summary-'))
  .sort()) {
  const s = load(`${lhDir}/${f}`)
  console.log(
    `\n### ${f}  (${s.env}, ${s.runs} Lauf/Läufe je Route, Lighthouse ${s.meta?.lighthouse}, BenchmarkIndex ${s.meta?.benchmarkIndex})\n`,
  )
  for (const profile of s.profiles) {
    console.log(`\n#### ${profile}\n`)
    console.log(
      '| Route | Score (min–max) | FCP ms | LCP ms (min–max) | TBT ms | CLS | TTFB ms | SI ms | Transfer KB | Req | Unused JS KB | LCP-Element | Provider |',
    )
    console.log('|---|---|---|---|---|---|---|---|---|---|---|---|---|')
    for (const r of s.rows.filter((x) => x.profile === profile)) {
      const m = r.medians
      const el = r.representative.lcpElement
      const elTxt = el
        ? `\`${(el.selector || '').split(' > ').slice(-2).join(' > ')}\` ${(el.label || '').slice(0, 30)}`
        : '–'
      console.log(
        `| ${r.path} | ${m.score} (${r.spread.scoreMin}–${r.spread.scoreMax}) | ${ms(m.fcp)} | ${ms(m.lcp)} (${ms(r.spread.lcpMin)}–${ms(r.spread.lcpMax)}) | ${ms(m.tbt)} | ${m.cls?.toFixed(3)} | ${ms(m.ttfb)} | ${ms(m.si)} | ${kb(m.totalTransfer)} | ${m.requests} | ${kb(m.unusedJsBytes)} | ${elTxt.replace(/\|/g, '/')} | ${r.providerRequestsMax} |`,
      )
    }
  }
  console.log('\nLCP-Phasen (repräsentativer Lauf, Lighthouse-Insight, unsimuliert beobachtet):\n')
  console.log(
    '| Env/Profil | Route | TTFB | Load Delay | Load Duration | Render Delay | Render-blocking (FCP-Ersparnis) |',
  )
  console.log('|---|---|---|---|---|---|---|')
  for (const r of s.rows) {
    const p = Object.fromEntries((r.representative.lcpPhases || []).map((x) => [x.phase, x.ms]))
    console.log(
      `| ${r.env} ${r.profile} | ${r.path} | ${ms(p.timeToFirstByte)} | ${ms(p.resourceLoadDelay)} | ${ms(p.resourceLoadDuration)} | ${ms(p.elementRenderDelay)} | ${ms(r.representative.renderBlockingSavingsMs)} |`,
    )
  }
}

for (const env of ['LAB', 'PREVIEW']) {
  const parts = ['mobile', 'desktop']
    .map((pr) => load(`${resDir}/pw-${env}-${pr}.json`))
    .filter(Boolean)
  if (!parts.length) continue
  const pw = {
    head: parts[0].head,
    tool: parts[0].tool,
    measuredAt: parts.map((x) => x.measuredAt).join(' / '),
    rows: parts.flatMap((x) => x.rows),
  }
  console.log(`\n### Playwright-Collector ${env} (HEAD ${pw.head}, ${pw.tool}, ${pw.measuredAt})\n`)
  console.log(
    '| Profil | Cache | Route | HTTP | TTFB | FCP | LCP | LCP-Element | CLS | Long Tasks (n/Σ/max) | Hydration Start→Ende | Locale-JSON (n, Ende ms) | Transfer KB nach initiatorType script/link/img/css (css = Fonts aus CSS) | Provider | Hydr.-Fehler |',
  )
  console.log('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
  for (const r of pw.rows.filter((x) => x.id !== 'lab-interaction-proxy')) {
    const t = r.resourcesByType || {}
    const tr = (k) => kb(t[k]?.transfer ?? 0)
    const el = r.lcp?.element
    const elTxt = el
      ? `${el.tag}${el.src ? ' ' + String(el.src).split('/').pop().slice(0, 32) : el.text ? ' „' + el.text.slice(0, 24) + '“' : ''}`
      : '–'
    const locEnd = r.localeJson?.length ? Math.max(...r.localeJson.map((x) => x.end)) : null
    console.log(
      `| ${r.profile} | ${r.cache} | ${r.path} | ${r.status} | ${ms(r.ttfb)} | ${ms(r.paint?.['first-contentful-paint'])} | ${ms(r.lcp?.t)} | ${elTxt.replace(/\|/g, '/')} | ${r.cls} | ${r.longTasks.n}/${r.longTasks.totalMs}/${r.longTasks.maxMs} | ${ms(r.hydration.start)}→${ms(r.hydration.end)} | ${r.localeJson?.length ?? 0}, ${ms(locEnd)} | ${tr('script')}/${tr('link')}/${tr('img')}/${tr('css')} | ${r.providerRequests} | ${r.hydrationErrors} |`,
    )
  }
  const proxies = pw.rows.filter((x) => x.id === 'lab-interaction-proxy')
  for (const p of proxies)
    console.log(
      `\nLab-Interaktions-Surrogat (${p.profile}, ${p.target}): max. Event-Dauer ${p.maxDurationMs} ms — KEIN INP.`,
    )
}
