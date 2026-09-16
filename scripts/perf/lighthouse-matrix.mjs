// PT25.1 — Lighthouse-Matrix (LAB oder PREVIEW), mobile + desktop, n Laeufe je Route.
// Aufruf (Node >= 22.19, Lighthouse 13.4.1 verlangt das):
//   CHROME_PATH=<chrome> node scripts/perf/lighthouse-matrix.mjs --origin <url> --env LAB|PREVIEW \
//     --runs 3 --profiles mobile,desktop [--routes id1,id2] [--warm] --out <dir>
// Lab-Werte sind KEINE Field-/RUM-Werte. Kein Consent wird gesetzt: Provider-Requests muessen 0 sein.
import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { ROUTES } from './routes.mjs'

const arg = (k, d) => {
  const i = process.argv.indexOf('--' + k)
  return i > -1 ? process.argv[i + 1] : d
}
const has = (k) => process.argv.includes('--' + k)
const origin = arg('origin', 'http://127.0.0.1:3960')
const env = arg('env', 'LAB')
const runs = Number(arg('runs', 3))
const profiles = arg('profiles', 'mobile,desktop').split(',')
const only = arg('routes', '')
const warm = has('warm')
const out = arg('out', 'node_modules/.cache/pt25.1/lh')
const LH = arg('lighthouse', 'lighthouse@13.4.1')
mkdirSync(out, { recursive: true })

// Analytics-/Marketing-Provider (AP23-Vertrag): vor Consent muessen es 0 Requests sein.
const PROVIDER =
  /googletagmanager\.com|google-analytics\.com|doubleclick\.net|hihuman\.co\.uk|facebook\.(net|com)|hotjar|clarity\.ms|linkedin\.com\/px|analytics\.google/i
const routes = ROUTES.filter((r) => !only || only.split(',').includes(r.id))
const median = (a) => {
  const s = a.filter((x) => x != null).sort((x, y) => x - y)
  return s.length ? s[Math.floor(s.length / 2)] : null
}

const extract = (lhr) => {
  const a = lhr.audits
  const reqs = a['network-requests']?.details?.items || []
  const byType = {}
  for (const r of reqs) {
    const t = r.resourceType || 'Other'
    byType[t] = byType[t] || { n: 0, transfer: 0 }
    byType[t].n++
    byType[t].transfer += r.transferSize || 0
  }
  // Lighthouse 13: LCP-Element und -Phasen stehen im `lcp-breakdown-insight` (Liste: Tabelle + Node).
  const lcpList = a['lcp-breakdown-insight']?.details?.items || []
  const lcpEl = lcpList.find((i) => i.type === 'node')
  const lcpPhases = (lcpList.find((i) => i.type === 'table')?.items || []).map((p) => ({
    phase: p.subpart,
    ms: Math.round(p.duration),
  }))
  const shifts = (a['layout-shifts']?.details?.items || []).slice(0, 5).map((i) => ({
    selector: i.node?.selector,
    label: i.node?.nodeLabel,
    score: Number((i.score || 0).toFixed(4)),
  }))
  return {
    score: lhr.categories.performance.score,
    fcp: a['first-contentful-paint'].numericValue,
    lcp: a['largest-contentful-paint'].numericValue,
    tbt: a['total-blocking-time'].numericValue,
    cls: a['cumulative-layout-shift'].numericValue,
    si: a['speed-index'].numericValue,
    tti: a['interactive']?.numericValue ?? null,
    ttfb: a['server-response-time']?.numericValue ?? null,
    bootupMs: a['bootup-time']?.numericValue ?? null,
    mainThreadMs: a['mainthread-work-breakdown']?.numericValue ?? null,
    totalTransfer: a['total-byte-weight']?.numericValue ?? null,
    requests: reqs.length,
    byType,
    providerRequests: reqs.filter((r) => PROVIDER.test(r.url)).map((r) => r.url),
    lcpElement: lcpEl
      ? {
          selector: lcpEl.selector,
          snippet: lcpEl.snippet,
          label: lcpEl.nodeLabel,
          rect: lcpEl.boundingRect,
        }
      : null,
    shifts,
    lcpPhases,
    unusedJsBytes: a['unused-javascript']?.details?.overallSavingsBytes ?? null,
    unusedCssBytes: a['unused-css-rules']?.details?.overallSavingsBytes ?? null,
    renderBlocking:
      (a['render-blocking-insight'] || a['render-blocking-resources'])?.details?.items?.map(
        (i) => ({
          url: String(i.url).replace(origin, ''),
          ms: Math.round(i.wastedMs ?? i.totalBytes ?? 0),
        }),
      ) ?? [],
    renderBlockingSavingsMs: a['render-blocking-insight']?.metricSavings?.FCP ?? null,
    imageDeliverySavingsBytes:
      a['image-delivery-insight']?.details?.items?.reduce((n, i) => n + (i.wastedBytes || 0), 0) ??
      null,
    unsizedImages: a['unsized-images']?.details?.items?.length ?? 0,
    longTasks: (a['long-tasks']?.details?.items || [])
      .slice(0, 5)
      .map((t) => ({ url: t.url, ms: Math.round(t.duration) })),
    requestList: reqs.map((r) => ({
      url: r.url.replace(origin, ''),
      type: r.resourceType,
      start: Math.round(r.networkRequestTime ?? r.startTime ?? 0),
      end: Math.round(r.networkEndTime ?? r.endTime ?? 0),
      transfer: r.transferSize,
      priority: r.priority,
    })),
  }
}

const summary = []
for (const profile of profiles) {
  for (const r of routes) {
    const res = []
    for (let i = 1; i <= runs; i++) {
      const file = `${out}/${env}-${profile}-${r.id}-${warm ? 'warm' : 'cold'}-${i}.json`
      if (!existsSync(file)) {
        const flags = [
          '-y',
          LH,
          origin + r.path,
          '--quiet',
          '--output=json',
          `--output-path=${file}`,
          '--only-categories=performance',
          '--chrome-flags=--headless=new --no-sandbox',
        ]
        if (profile === 'desktop') flags.push('--preset=desktop')
        if (warm) flags.push('--disable-storage-reset')
        const p = spawnSync('npx', flags, { encoding: 'utf8', timeout: 180000 })
        if (p.status !== 0 && !existsSync(file)) {
          console.error(`FEHLER ${profile} ${r.id} #${i}: ${p.stderr?.slice(-400)}`)
          continue
        }
      }
      const lhr = JSON.parse(readFileSync(file, 'utf8'))
      if (lhr.runtimeError) {
        console.error(`RUNTIME ${profile} ${r.id} #${i}: ${lhr.runtimeError.code}`)
        continue
      }
      res.push({ run: i, ...extract(lhr) })
      if (i === 1)
        summary.meta = {
          lighthouse: lhr.lighthouseVersion,
          userAgent: lhr.environment.hostUserAgent,
          benchmarkIndex: lhr.environment.benchmarkIndex,
        }
    }
    if (!res.length) continue
    // Repraesentativer Lauf = Lauf mit medianem LCP (Wasserfall/LCP-Element stammen daraus).
    const mLcp = median(res.map((x) => x.lcp))
    const rep = res.find((x) => x.lcp === mLcp)
    const row = {
      env,
      profile,
      cache: warm ? 'warm' : 'cold',
      id: r.id,
      path: r.path,
      runs: res.length,
      medians: Object.fromEntries(
        [
          'score',
          'fcp',
          'lcp',
          'tbt',
          'cls',
          'si',
          'tti',
          'ttfb',
          'bootupMs',
          'mainThreadMs',
          'totalTransfer',
          'requests',
          'unusedJsBytes',
          'unusedCssBytes',
        ].map((k) => [k, median(res.map((x) => x[k]))]),
      ),
      spread: {
        lcpMin: Math.min(...res.map((x) => x.lcp)),
        lcpMax: Math.max(...res.map((x) => x.lcp)),
        scoreMin: Math.min(...res.map((x) => x.score)),
        scoreMax: Math.max(...res.map((x) => x.score)),
      },
      providerRequestsMax: Math.max(...res.map((x) => x.providerRequests.length)),
      representative: rep,
    }
    summary.push(row)
    const m = row.medians
    console.error(
      `${env} ${profile.padEnd(7)} ${row.cache} ${r.id.padEnd(17)} score ${m.score} LCP ${Math.round(m.lcp)} FCP ${Math.round(m.fcp)} TBT ${Math.round(m.tbt)} CLS ${m.cls?.toFixed(3)} TTFB ${m.ttfb} xfer ${Math.round(m.totalTransfer / 1024)}KB prov=${row.providerRequestsMax} lcpEl=${rep.lcpElement?.label?.slice(0, 40)}`,
    )
  }
}
const target = `${out}/summary-${env}-${warm ? 'warm' : 'cold'}-${profiles.join('+')}${only ? '-subset' : ''}.json`
writeFileSync(
  target,
  JSON.stringify(
    {
      env,
      origin,
      runs,
      profiles,
      warm,
      meta: summary.meta,
      measuredAt: new Date().toISOString(),
      rows: summary,
    },
    null,
    2,
  ),
)
console.error('-> ' + target)
