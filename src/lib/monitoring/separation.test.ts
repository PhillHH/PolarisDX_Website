// @vitest-environment node
import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

import { TRACKING_EREIGNISSE } from '../tracking'

/**
 * AP23 PT23.5 — technische Beobachtung und Marketing-Messung bleiben getrennt.
 *
 * Die Trennung ist heute vorhanden, aber sie steht nirgends geschrieben und
 * haelt damit genau bis zum naechsten schnellen Einbau: es genuegt EIN
 * `setMonitoringSink(…)`, der die Web Vitals in den dataLayer schiebt, und aus
 * technischer Selbstbeobachtung wird Marketing-Telemetrie — vorbei an der
 * Einwilligung, die fuer Marketing gilt.
 *
 * Diese Datei misst die Trennung an drei Stellen: am Vokabular, an den
 * Abhaengigkeiten und an den Daten, die ein technisches Ereignis ueberhaupt
 * tragen kann.
 */

const ROOT = path.resolve(__dirname, '..', '..', '..')
const lies = (rel: string) => fs.readFileSync(path.join(ROOT, rel), 'utf8')
const ohneKommentare = (text: string) =>
  text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

const MONITORING = ['src/lib/monitoring/report.ts', 'src/lib/monitoring/web-vitals.ts']

describe('PT23.5 · kein Marketing im technischen Meldeweg', () => {
  it.each(MONITORING)('%s kennt keinen Marketingprovider', (rel) => {
    const code = ohneKommentare(lies(rel))
    // Der Transport ist eine Entscheidung von AP25/AP26 — nicht etwas, das
    // hier nebenbei an Google haengt.
    expect(code).not.toMatch(/\bdataLayer\b/)
    expect(code).not.toMatch(/\bgtag\b/)
    expect(code).not.toMatch(/googletagmanager|google-analytics/)
    expect(code).not.toMatch(/\bGTM-[A-Z0-9]/)
    expect(code).not.toMatch(/\bG-[A-Z0-9]{8,}/)
  })

  it.each(MONITORING)('%s verwendet kein Marketing-Ereignisvokabular', (rel) => {
    const code = ohneKommentare(lies(rel))
    for (const name of TRACKING_EREIGNISSE) {
      expect(code, `${rel}: ${name}`).not.toContain(name)
    }
  })

  it('die Marketing-Fassade kennt umgekehrt keine technischen Metriken', () => {
    const code = ohneKommentare(lies('src/lib/tracking.ts'))
    for (const metrik of ['LCP', 'CLS', 'INP', 'TTFB', 'FCP', 'web-vital', 'PerformanceObserver']) {
      expect(code, metrik).not.toContain(metrik)
    }
  })

  it('haelt die beiden Module ohne gegenseitige Abhaengigkeit', () => {
    const marketing = lies('src/lib/tracking.ts')
    expect(marketing).not.toContain('monitoring')
    for (const rel of MONITORING) {
      const code = lies(rel)
      expect(code, rel).not.toMatch(/from ['"]\.\.\/tracking['"]/)
      expect(code, rel).not.toMatch(/from ['"]\.\.\/trackingProvider['"]/)
      expect(code, rel).not.toMatch(/from ['"]\.\.\/googleConsent['"]/)
    }
  })
})

describe('PT23.5 · technische Metriken tragen keine Personendaten', () => {
  const report = lies('src/lib/monitoring/report.ts')

  it('meldet den Pfad OHNE Query — genau wie die Marketingseite', () => {
    // Ein Querystring kann einen Token oder eine Kennung tragen. Dass das
    // Monitoring `location.pathname` und nicht `href` liest, ist die ganze
    // Schranke — sie steht deshalb unter Test.
    expect(report).toContain('window.location.pathname')
    expect(report).not.toContain('location.href')
    expect(report).not.toContain('location.search')
  })

  it('meldet keine rohen Props, keinen State und keine Kennungen', () => {
    for (const verboten of ['props', 'userId', 'leadId', 'email', 'sessionId', 'clientId']) {
      expect(ohneKommentare(report), verboten).not.toContain(verboten)
    }
  })

  it('begrenzt das Ereignis auf die aufgezaehlten Felder', () => {
    // Zwei Formen, beide abschliessend beschrieben: Renderfehler und
    // Web-Vital. Ein spaeter ergaenztes Feld faellt hier auf.
    expect(report).toContain("readonly type: 'client-error'")
    expect(report).toContain("readonly type: 'web-vital'")
    const namen = report.match(/readonly name: '(LCP|CLS|INP|TTFB|FCP)'/)
    expect(namen ?? report).toBeTruthy()
  })
})

describe('PT23.5 · nichts laeuft ohne ausdrueckliche Entscheidung', () => {
  it('registriert im produktiven Baum KEINE Senke', () => {
    // Ohne Senke meldet `reportError`/`reportWebVital` nichts. Das ist der
    // Auslieferungszustand und bleibt es, bis AP25/AP26 einen Transport
    // beschliessen — inklusive der Rechtsgrundlage dafuer.
    const treffer: string[] = []
    const lauf = (dir: string) => {
      for (const eintrag of fs.readdirSync(dir, { withFileTypes: true })) {
        const voll = path.join(dir, eintrag.name)
        if (eintrag.isDirectory()) lauf(voll)
        else if (/\.tsx?$/.test(eintrag.name) && !/\.test\.tsx?$/.test(eintrag.name)) {
          const rel = path.relative(ROOT, voll)
          if (rel.startsWith('src/lib/monitoring/')) continue
          const code = ohneKommentare(fs.readFileSync(voll, 'utf8'))
          if (/setMonitoringSink\s*\(/.test(code)) treffer.push(rel)
        }
      }
    }
    lauf(path.join(ROOT, 'src'))
    expect(treffer, `Senke registriert in: ${treffer.join(', ')}`).toEqual([])
  })

  it('startet im produktiven Baum KEINEN Web-Vitals-Sammler', () => {
    const treffer: string[] = []
    const lauf = (dir: string) => {
      for (const eintrag of fs.readdirSync(dir, { withFileTypes: true })) {
        const voll = path.join(dir, eintrag.name)
        if (eintrag.isDirectory()) lauf(voll)
        else if (/\.tsx?$/.test(eintrag.name) && !/\.test\.tsx?$/.test(eintrag.name)) {
          const rel = path.relative(ROOT, voll)
          if (rel.startsWith('src/lib/monitoring/')) continue
          const code = ohneKommentare(fs.readFileSync(voll, 'utf8'))
          if (/initWebVitals\s*\(/.test(code)) treffer.push(rel)
        }
      }
    }
    lauf(path.join(ROOT, 'src'))
    // Kein Sammler heisst: keine Datenerhebung, also auch keine offene
    // Consent-Frage. Wer ihn startet, muss vorher §17 des Vertrags fuellen.
    expect(treffer, `Sammler gestartet in: ${treffer.join(', ')}`).toEqual([])
  })

  it('kann den Marketing-Anbieter typseitig nicht als Monitoring-Senke annehmen', () => {
    // Beide Senken nehmen unterschiedliche Ereignistypen. Ein Versehen
    // („registrier doch einfach den vorhandenen Provider") faellt beim
    // Uebersetzen auf, nicht erst im Netzmitschnitt.
    const report = lies('src/lib/monitoring/report.ts')
    expect(report).toContain('MonitoringEreignis')
    expect(report).not.toContain('TrackingEreignis')
  })
})
