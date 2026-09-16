// @vitest-environment node
import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

import { CTA_LOCATIONS, TRACKING_EREIGNISSE } from './tracking'

/**
 * AP23 PT23.2 — der Bypass-Waechter.
 *
 * Die Regel lautet: nur der zentrale Adapter kennt `dataLayer` und `gtag`.
 * Eine Regel, die niemand nachmisst, haelt genau bis zum naechsten schnellen
 * Einbau. Dieser Test liest den Quellbaum.
 */

describe('PT23.2 · keine Umgehung im Quellbaum', () => {
  const ROOT = path.resolve(__dirname, '..', '..')
  const ADAPTER = ['src/lib/trackingProvider.ts', 'src/lib/googleConsent.ts']

  const dateien = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const voll = path.join(dir, entry.name)
      if (entry.isDirectory()) return dateien(voll)
      return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [voll] : []
    })

  const ohneKommentare = (text: string) =>
    text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

  it('nennt dataLayer und gtag ausschliesslich im zentralen Adapter', () => {
    const treffer = dateien(path.join(ROOT, 'src'))
      .map((datei) => path.relative(ROOT, datei))
      .filter((rel) => !ADAPTER.includes(rel))
      .filter((rel) => /dataLayer|gtag\s*\(/.test(ohneKommentare(fs.readFileSync(rel, 'utf8'))))
    expect(treffer, `Umgehungen: ${treffer.join(', ')}`).toEqual([])
  })

  it('traegt kein Datenattribut mit uebersetztem Freitext mehr', () => {
    const treffer = dateien(path.join(ROOT, 'src'))
      .map((datei) => path.relative(ROOT, datei))
      .filter((rel) => /data-gtm-cta/.test(ohneKommentare(fs.readFileSync(rel, 'utf8'))))
    expect(treffer).toEqual([])
  })

  it('fuehrt die zwoelf kanonischen Ereignisse der Taxonomie', () => {
    // AP23 PT23.3 — die Liste aus der Aufgabenstellung.
    // `consumer_order_submit` ist seit dem Shopify-Beschluss (2026-09-11)
    // keine geforderte Website-Konversion mehr; das Ereignis existiert
    // weiter als Engagement (Bestellanfrage = Lead, kein Kauf).
    const kanonisch = [
      'page_view',
      'contact_submit',
      'support_submit',
      'roi_report_request',
      'epigenetics_inquiry_submit',
      'lead_magnet_submit',
      'download_delivered',
      'cta_click',
      'panel_select',
      'search',
      'outbound_click',
    ]
    for (const name of kanonisch) {
      expect(TRACKING_EREIGNISSE, name).toContain(name)
    }
    // Der Bestand aus AP15/AP19/AP21 bleibt — Engagement, keine Konversionen.
    expect(TRACKING_EREIGNISSE).toHaveLength(17)
    // `consumer_page_view` ist entfallen: es zaehlte denselben Wechsel ein
    // zweites Mal, den `page_view` bereits meldet.
    expect(TRACKING_EREIGNISSE).not.toContain('consumer_page_view')
    expect(CTA_LOCATIONS.length).toBeGreaterThan(0)
  })

  it('meldet keine Consumer-Seite mehr einen eigenen Seitenaufruf', () => {
    const treffer = dateien(path.join(ROOT, 'src'))
      .map((datei) => path.relative(ROOT, datei))
      .filter((rel) => /useConsumerPageView|consumer_page_view/.test(fs.readFileSync(rel, 'utf8')))
      // Der Kommentar, der die Entfernung begruendet, darf stehen bleiben.
      .filter((rel) =>
        /useConsumerPageView\(|'consumer_page_view'/.test(
          fs.readFileSync(rel, 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''),
        ),
      )
    expect(treffer, `Reste: ${treffer.join(', ')}`).toEqual([])
  })
})
