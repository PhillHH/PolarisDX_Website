/**
 * Visual-Regression-Galerie — deterministische Oberflaechen des Design-Systems.
 *
 * Herkunft des Musters: die Visual-Regression-Mechanik aus
 * `redesign/preview@5673b61` (AP01 PT01.3, Gruppen P1/P4). Uebernommen ist
 * ausschliesslich die MECHANIK — feste Viewports, deterministische Daten,
 * ganzseitige Aufnahmen. Keine Farbe, keine Typografie, kein Layout und keine
 * Komponente aus jener Linie (DEC-RL-002/DEC-RL-003).
 *
 * WARUM EINE GENERIERTE HTML-DATEI UND KEINE ROUTE:
 * Eine oeffentliche `/styleguide`-Route waere eine Test-Oberflaeche in der
 * Produktion — indexierbar, im Routing-Vertrag, im Bundle. Stattdessen rendert
 * dieses Skript die ECHTEN Komponenten mit `react-dom/server` in eine statische
 * Datei unter `dist/`. Damit gibt es keine zweite Wahrheit: was hier abgebildet
 * wird, ist exakt das, was die Komponenten rendern — eine nachgebaute
 * HTML-Attrappe wuerde mit der Zeit auseinanderlaufen.
 *
 * DETERMINISMUS: keine Zufallszahlen, keine Zeitstempel, keine Netzdaten, keine
 * echten Personen- oder Kundendaten. Alle Texte sind feste Platzhalter.
 *
 * ABLAGE AUSSERHALB DES AUSGELIEFERTEN VERZEICHNISSES: die Datei liegt in
 * `dist/`, NICHT in `dist/client/`. `server.ts` haengt ein
 * `express.static(dist/client)` ein und wuerde eine dort abgelegte HTML-Datei
 * mit HTTP 200 ausliefern — die Testflaeche waere oeffentlich erreichbar
 * (nachgemessen, bevor sie hierher verschoben wurde). Ein Verzeichnis hoeher
 * ist sie garantiert nicht Teil der Anwendung.
 *
 * Der CSS-Verweis ist deshalb relativ auf `./client/assets/…` und die Datei
 * wird per `file://` geladen.
 *
 * Aufruf: npm run visual:gallery  (schreibt dist/visual-gallery.html)
 */
/* eslint-disable react-refresh/only-export-components --
   Dieses Modul ist ein Node-Build-Skript, kein Teil des Browser-Bundles.
   Fast Refresh gibt es hier nicht; die Regel geht ins Leere. */
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { Button } from '../src/components/ui/Button'
import { Card } from '../src/components/ui/Card'
import { Alert } from '../src/components/ui/Alert'
import { Input } from '../src/components/ui/Input'
import { Textarea } from '../src/components/ui/Textarea'
import { Checkbox, Radio, Select } from '../src/components/ui/Choice'
import { FormField } from '../src/components/ui/FormField'
import { LoadingState, EmptyState, ErrorState, Skeleton } from '../src/components/ui/StateBlock'
import { Section, Container, CardGrid } from '../src/components/layout/Section'

/** Eine benannte Flaeche. Der Name wird zum Screenshot-Dateinamen. */
const Surface = ({ name, children }: { name: string; children: React.ReactNode }) => (
  <section data-surface={name} className="border-b border-ui-border">
    <Container rhythm="compact">
      <p className="t-h6 mb-6">{name}</p>
      {children}
    </Container>
  </section>
)

const SWATCHES: [string, string][] = [
  ['brand.navy / heading', 'bg-brand-navy'],
  ['brand.navy-hover', 'bg-brand-navy-hover'],
  ['brand.blue', 'bg-brand-blue'],
  ['brand.secondary', 'bg-brand-secondary'],
  ['accent', 'bg-accent'],
  ['accent.strong', 'bg-accent-strong'],
  ['accent.line', 'bg-accent-line'],
  ['accent.on-dark', 'bg-accent-on-dark'],
  ['accent.soft', 'bg-accent-soft'],
  ['accent.border', 'bg-accent-border'],
  ['success', 'bg-success'],
  ['success.strong', 'bg-success-strong'],
  ['warning', 'bg-warning'],
  ['warning.strong', 'bg-warning-strong'],
  ['befund.red', 'bg-befund-red'],
  ['befund.amber', 'bg-befund-amber'],
  ['befund.green', 'bg-befund-green'],
  ['ui.field', 'bg-ui-field'],
  ['ui.border', 'bg-ui-border'],
]

const Gallery = () => (
  <div className="bg-white">
    <Surface name="tokens-color">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {SWATCHES.map(([label, cls]) => (
          <div key={label}>
            <div className={`h-14 rounded-md border border-ui-border ${cls}`} />
            <p className="t-caption mt-1">{label}</p>
          </div>
        ))}
      </div>
    </Surface>

    <Surface name="typography">
      <div className="space-y-3">
        <p className="t-h1">Überschrift H1 — Präzise Diagnostik</p>
        <p className="t-h2">Überschrift H2 — Sektionstitel</p>
        <p className="t-h2-sub">Überschrift H2 (Unterüberschrift)</p>
        <p className="t-h3">Überschrift H3 — Kartentitel</p>
        <p className="t-h4">Überschrift H4</p>
        <p className="t-h5">Überschrift H5</p>
        <p className="t-h6">Überschrift H6</p>
        <p className="t-lead">Lead — Laborwerte in Minuten, direkt in der Praxis.</p>
        <p className="t-body">Body — Fließtext in der kanonischen Body-Ink gray-700.</p>
        <p className="t-small">Small — kleinerer Fließtext, gleiche Ink.</p>
        <p className="t-caption">Caption — Bildunterschrift und Evidenzhinweis.</p>
        <p className="t-label">Label — Formularbeschriftung</p>
        <p className="t-helper">Helper — erklärender Hilfstext</p>
        <p className="t-error">Error — Fehlermeldung</p>
        <p>
          <a className="t-link" href="#gallery">
            Inline-Link mit Unterstreichung
          </a>
        </p>
      </div>
    </Surface>

    <Surface name="typography-on-navy">
      <div className="rounded-xl bg-brand-deep p-6">
        <p className="t-h1 text-white">Überschrift auf Navy</p>
        <p className="t-lead-on-dark mt-3">Lead auf Navy — weiß mit 80 % Deckkraft.</p>
        <p className="t-body-on-dark mt-2">Body auf Navy.</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark">
          Eyebrow auf Navy
        </p>
      </div>
    </Surface>

    <Surface name="buttons">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="primary">Angebot anfragen</Button>
        <Button variant="secondary">Sekundär</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="secondary" size="sm">
          Klein
        </Button>
        <Button variant="secondary" size="lg">
          Groß
        </Button>
        <Button variant="secondary" loading>
          Wird gesendet
        </Button>
        <Button variant="secondary" disabled>
          Deaktiviert
        </Button>
        <Button variant="secondary" size="icon" aria-label="Aktion" />
      </div>
      <div className="mt-4 rounded-xl bg-brand-deep p-4">
        <Button variant="outline">Outline auf Navy</Button>
      </div>
    </Surface>

    <Surface name="form-controls">
      <div className="grid max-w-xl gap-5">
        <FormField label="Firma" description="Rechnungsadresse">
          {(p) => <Input {...p} placeholder="PolarisDX GmbH" />}
        </FormField>
        <FormField label="E-Mail" error="Bitte eine gültige Adresse angeben" required>
          {(p) => <Input {...p} placeholder="name@praxis.de" />}
        </FormField>
        <FormField label="Nachricht">
          {(p) => <Textarea {...p} placeholder="Ihre Anfrage" />}
        </FormField>
        <FormField label="Anliegen">
          {(p) => (
            <Select {...p}>
              <option>Hardware</option>
              <option>Software</option>
            </Select>
          )}
        </FormField>
        <FormField as="group" label="Anrede">
          {() => (
            <>
              <Radio name="g" label="Frau" defaultChecked />
              <Radio name="g" label="Herr" />
            </>
          )}
        </FormField>
        <Checkbox label="Newsletter abonnieren" description="Jederzeit abbestellbar" />
        <Input label="Deaktiviert" disabled placeholder="Nicht bedienbar" />
      </div>
    </Surface>

    <Surface name="status-alerts">
      <div className="grid max-w-2xl gap-3">
        <Alert variant="info" title="Hinweis">
          Neutrale Information ohne Statusfarbe.
        </Alert>
        <Alert variant="success" title="Gesendet">
          Ihre Anfrage ist eingegangen.
        </Alert>
        <Alert variant="warning" title="Achtung">
          Diese Angabe sollte geprüft werden.
        </Alert>
        <Alert variant="error" title="Fehlgeschlagen">
          Die Anfrage konnte nicht gesendet werden.
        </Alert>
      </div>
    </Surface>

    <Surface name="cards">
      <CardGrid columns={3}>
        <Card to="/diagnostics">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent-strong">
            ●
          </span>
          <h3 className="t-h3 mt-5">Interaktive Karte</h3>
          <p className="t-small mt-2">Die ganze Karte ist genau ein Link.</p>
          <span className="t-link-cta mt-auto pt-6">Mehr erfahren →</span>
        </Card>
        <Card>
          <h3 className="t-h3">Statische Karte</h3>
          <p className="t-small mt-2">Keine Hover-Affordanz, kein Tabstop.</p>
        </Card>
        <Card padding="sm">
          <h3 className="t-h4">Kompakte Karte</h3>
          <p className="t-small mt-2">Padding sm.</p>
        </Card>
      </CardGrid>
    </Surface>

    <Surface name="states">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-ui-border">
          <LoadingState label="Wird geladen" />
        </div>
        <div className="rounded-xl border border-ui-border">
          <EmptyState title="Keine Treffer" description="Versuchen Sie eine andere Suche." />
        </div>
        <div className="rounded-xl border border-ui-border">
          <ErrorState
            title="Etwas ist schiefgelaufen"
            description="Die Daten konnten nicht geladen werden."
            onRetry={() => {}}
          />
        </div>
      </div>
      <div className="mt-6 grid max-w-md gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4" count={2} />
      </div>
    </Surface>

    <Surface name="dialog">
      {/* Der Dialog rendert absichtlich nur im Browser (mounted-Gate). Fuer die
          Galerie wird sein Panel als statische Flaeche mit denselben Klassen
          gezeigt — die Interaktion selbst deckt der Playwright-Test ab. */}
      <div className="relative h-[320px] overflow-hidden rounded-xl bg-brand-deep/60">
        <div className="absolute left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col rounded-2xl bg-white shadow-dialog">
            <div className="flex items-start justify-between gap-4 p-6 pb-0">
              <div>
                <h2 className="t-h3">Angebot anfragen</h2>
                <p className="t-small mt-1">Wir melden uns werktags innerhalb von 24 Stunden.</p>
              </div>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ui-field">
                ✕
              </span>
            </div>
            <div className="p-6">
              <p className="t-body">Inhalt des Dialogs.</p>
            </div>
            <div className="flex justify-end gap-3 p-6 pt-0">
              <Button variant="ghost">Abbrechen</Button>
              <Button variant="secondary">Senden</Button>
            </div>
          </div>
        </div>
      </div>
    </Surface>

    <Surface name="layout-grid">
      <CardGrid columns={4} gap="sm">
        {[1, 2, 3, 4].map((n) => (
          <Card key={n} padding="sm">
            <p className="t-h5">Spalte {n}</p>
          </Card>
        ))}
      </CardGrid>
    </Surface>

    <Section surface="navy" data-surface="section-navy">
      <Container rhythm="compact">
        <p className="t-h6 mb-6 text-accent-on-dark">section-navy</p>
        <p className="t-h2 text-white">Dunkle Fläche im Light Theme</p>
        <p className="t-lead-on-dark mt-3">Kein Dark Mode — eine Navy-Kontrastfläche.</p>
      </Container>
    </Section>
  </div>
)

const cssFile = readdirSync(join(process.cwd(), 'dist/client/assets')).find((f) =>
  f.endsWith('.css'),
)
if (!cssFile) {
  console.error('Kein gebautes CSS gefunden — bitte zuerst `npm run build`.')
  process.exit(1)
}

const body = renderToStaticMarkup(
  <StaticRouter location="/">
    <Gallery />
  </StaticRouter>,
)

const html = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Design-System — Visual Regression Gallery</title>
    <link rel="stylesheet" href="./client/assets/${cssFile}" />
  </head>
  <body id="gallery" class="antialiased">
    ${body}
  </body>
</html>
`

writeFileSync(join(process.cwd(), 'dist/visual-gallery.html'), html)
console.log(`✓ Visual-Galerie geschrieben: dist/visual-gallery.html (CSS: ${cssFile})`)
