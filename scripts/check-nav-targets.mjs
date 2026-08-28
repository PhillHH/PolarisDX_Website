#!/usr/bin/env node
/**
 * Navigations-Ziel-Guard (AP06 / PT06.5).
 *
 * Jedes Ziel in Header, Mega-Menue und Footer muss eine Route sein, die es
 * wirklich gibt — und die richtige. Ein toter oder umgeleiteter Menuepunkt
 * faellt beim Entwickeln nicht auf: er sieht aus wie jeder andere Link.
 *
 * Geprueft wird gegen die **tatsaechlichen** `<Route path="…">` aus
 * `src/App.tsx`. Das ist bewusst **keine zweite Route Registry** — die zentrale
 * Registry ist und bleibt **AP10** (`ROUTING-CONTRACT.md` R-24). Dieser Guard
 * liest nur ab, was die Anwendung ohnehin definiert, und vergleicht.
 *
 * Vier Regeln:
 *   1. Das Ziel existiert als Route (Parameter-Routen werden gematcht).
 *   2. Kein `/services*` — kanonisch ist `/diagnostics*`, `/services` ist eine
 *      Redirect-Quelle (`IAD-18`).
 *   3. Keine Backlog-Bereiche (`DEC-RL-015`): Shop, Case Studies, Deal, Voucher.
 *   4. Kein Chat-Ziel (`DEC-RL-007`).
 *
 * Aufruf: npm run check:nav-targets
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname

const NAV_FILES = ['src/components/layout/Header.tsx', 'src/components/layout/Footer.tsx']

/** Alle Routen, die die Anwendung tatsaechlich definiert. */
function definedRoutes() {
  const app = readFileSync(join(ROOT, 'src/App.tsx'), 'utf8')
  return [...app.matchAll(/path="([^"]+)"/g)].map((m) => m[1]).filter((p) => p !== '*')
}

/** Alle Ziele, die die Shell verlinkt. */
function navTargets() {
  const targets = new Set()
  for (const file of NAV_FILES) {
    const src = readFileSync(join(ROOT, file), 'utf8')
    for (const m of src.matchAll(/\b(?:to|route):\s*'([^']+)'/g)) targets.add(m[1])
    for (const m of src.matchAll(/\bto="([^"{]+)"/g)) targets.add(m[1])
  }
  return [...targets]
}

/** Passt das Ziel auf eine definierte Route? `:param` matcht ein Segment. */
function routeExists(target, routes) {
  // Anker und Query zaehlen nicht zur Route-Identitaet.
  const path = target.split('#')[0].split('?')[0] || '/'
  return routes.some((route) => {
    if (route === path) return true
    if (!route.includes(':')) return false
    const routeParts = route.split('/')
    const pathParts = path.split('/')
    if (routeParts.length !== pathParts.length) return false
    return routeParts.every((part, i) => part.startsWith(':') || part === pathParts[i])
  })
}

const routes = definedRoutes()
const targets = navTargets().sort()

const problems = []

for (const target of targets) {
  if (!target.startsWith('/')) continue // externe Ziele pruefen wir hier nicht
  const path = target.split('#')[0]

  if (path.startsWith('/services')) {
    problems.push(`${target} — Redirect-Quelle; kanonisch ist /diagnostics* (IAD-18)`)
    continue
  }
  if (/^\/(shop|casestudys|case-studies|deal|voucher)/.test(path)) {
    problems.push(`${target} — Backlog-Bereich, nicht reaktivieren (DEC-RL-015)`)
    continue
  }
  if (/chat|hihuman/i.test(target)) {
    problems.push(`${target} — Chat ist im Relaunch ausgeschlossen (DEC-RL-007)`)
    continue
  }
  if (!routeExists(target, routes)) {
    problems.push(`${target} — keine passende Route in src/App.tsx`)
  }
}

if (problems.length) {
  console.error(`\n✖ Navigations-Ziele: ${problems.length} Problem(e)\n`)
  for (const problem of problems) console.error(`   ${problem}`)
  console.error(
    '\nNavigation erfindet keine Pfade (ROUTING-CONTRACT R-51). Ein Menuepunkt, der' +
      '\nins Leere oder auf eine Weiterleitung zeigt, ist im Betrieb nicht zu erkennen.\n',
  )
  process.exit(1)
}

console.log(
  `✓ Navigations-Ziele: ${targets.length} Ziele aus Header und Footer gegen ` +
    `${routes.length} definierte Routen geprueft — 0 tote, 0 /services*, 0 Backlog, 0 Chat.`,
)
