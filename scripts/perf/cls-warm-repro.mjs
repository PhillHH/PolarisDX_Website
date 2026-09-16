// PT25.1 — Reproduktion des Warm-Navigations-CLS (Befund PERF-B05 im PERFORMANCE-CONTRACT).
// Aufruf: node scripts/perf/cls-warm-repro.mjs [origin ...]
// Mobil 412x823 DPR 1.75, CDP-Drosselung 4x CPU / 150 ms RTT / 1,6 Mbit/s. Erster Aufruf kalt,
// zweiter Aufruf im selben Tab (HTTP-Cache warm). Gibt Shift-Quellen mit previousRect/currentRect aus.
// Kein Consent, keine Provider, keine Telemetrie — reines Lab-Werkzeug.
import { chromium } from '@playwright/test'

const origins = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['http://127.0.0.1:3960', 'https://preview.polarisdx.net']
const PATHS = ['/de/', '/de/epigenetics']
const REPS = 3

const browser = await chromium.launch()
for (const origin of origins) {
  for (const path of PATHS) {
    for (let rep = 1; rep <= REPS; rep++) {
      const ctx = await browser.newContext({
        viewport: { width: 412, height: 823 },
        deviceScaleFactor: 1.75,
        isMobile: true,
        hasTouch: true,
      })
      await ctx.addInitScript(() => {
        window.__shifts = []
        new PerformanceObserver((list) =>
          list.getEntries().forEach((e) => {
            if (e.hadRecentInput || e.value <= 0.01) return
            window.__shifts.push({
              t: Math.round(e.startTime),
              value: Number(e.value.toFixed(3)),
              sources: e.sources.map((s) => ({
                node: s.node
                  ? `${s.node.tagName}.${(s.node.getAttribute('class') || '').slice(0, 60)}`
                  : null,
                parent: s.node?.parentElement
                  ? `${s.node.parentElement.tagName}#${s.node.parentElement.id}`
                  : null,
                previous: [Math.round(s.previousRect.y), Math.round(s.previousRect.height)],
                current: [Math.round(s.currentRect.y), Math.round(s.currentRect.height)],
              })),
            })
          }),
        ).observe({ type: 'layout-shift', buffered: true })
      })
      const page = await ctx.newPage()
      // PT25.3: `PERF_BLOCK_IMAGES=1` blockiert alle Bild-Requests — trennt bildbedingte Shifts von anderen.
      // PT25.3: `PERF_BLOCK_IMAGES=1` blockiert alle Bild-Requests, `PERF_BLOCK_PATTERN=<regex>`
      // nur passende URLs — trennt bildbedingte Shifts und findet das ausloesende Bild.
      const blockAll = process.env.PERF_BLOCK_IMAGES === '1'
      const blockPattern = process.env.PERF_BLOCK_PATTERN
        ? new RegExp(process.env.PERF_BLOCK_PATTERN)
        : null
      if (blockAll || blockPattern) {
        await page.route('**/*', (route) => {
          const request = route.request()
          const hit = blockAll
            ? request.resourceType() === 'image'
            : blockPattern.test(request.url())
          return hit ? route.abort() : route.continue()
        })
      }
      const cdp = await ctx.newCDPSession(page)
      await cdp.send('Network.enable')
      await cdp.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 150,
        downloadThroughput: (1638.4 * 1024) / 8,
        uploadThroughput: (675 * 1024) / 8,
      })
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
      await page.goto(origin + path, { waitUntil: 'load' })
      await page.waitForTimeout(9000)
      const cold = await page.evaluate(() => window.__shifts)
      await page.goto(origin + path, { waitUntil: 'load' })
      await page.waitForTimeout(3000)
      const warm = await page.evaluate(() => window.__shifts)
      const sum = (a) => a.reduce((n, s) => n + s.value, 0).toFixed(3)
      console.log(
        `${origin} ${path} #${rep} cold CLS>0.01 ${sum(cold)} warm ${sum(warm)} ${JSON.stringify(warm)}`,
      )
      await ctx.close()
    }
  }
}
await browser.close()
