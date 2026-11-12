# Homepage Contract

## 1. Aktueller Stand: SC-025 (2026-11-12, nur Preview)

Die Startseite folgt der Owner-Vorgabe zur Navbit-inspirierten Werkstattvorlage. Owner wörtlich:
„ich will das SO WIE DIE SEITE; ABER AUCH mit der Animation, in unserer Brandsprache, das finde ich stark“
und danach „Bringe das mal mit unseren Header auf preview bitte“. Ausrollen nur auf die Preview.

- Route: Registry `home`, `/{locale}/`, HTTP 200 in `de en pl fr it es pt da nl cs`.
- Die vorhandene Kopfzeile mit Messe-Zeile, Hover-Menüs, Shops, Suche und Menü bleibt unverändert.
- Die vorhandene Fußzeile einschließlich SC-024 bleibt unverändert. `Layout` ergänzt nur auf der Startseite
  unmittelbar danach die dekorative, angeschnittene Wortmarke `polarisdx`.
- Termin-Popup, Cookie-Banner, Consent und Tracking werden von SC-025 nicht verändert.
- Die dunklen Abschnitte sind Einzelflächen im Light Theme, kein Theme-Wechsel und keine `dark:`-Variante.
- Die ältere Komposition aus Hero-Karussell, EventBand, TeamEventSection, BusinessPillars, Why/Steps,
  Testimonials, Blog und FinalCta wird auf dieser Route vollständig ersetzt. Geteilte Bausteine anderer
  Routen bleiben bestehen.

## 2. Abschnittsfolge und visuelle Sprache

Die Reihenfolge ist verbindlich:

1. dunkle Bühne;
2. weißer Auftakt mit großer Wortmarke;
3. dunkler Produktteil;
4. weißer Sachteil;
5. dunkler Kontaktblock;
6. FAQ und Blog auf Weiß;
7. bestehende Fußzeile plus Wortmarke.

Typografie bleibt selbstgehostetes Inter. Royal (`accent`) und Cyan (`accent.line`) kommen aus dem Signet.
Die neuen semantischen Flächentoken sind `night` `#041a2e`, `night.raised` `#072640`,
`night.panel` `#0a2f4e`, `night.dim` `#9fb6cc` und `night.ghost` `#eef2f6`. Ihre Rollen und Kontraste
stehen im DESIGN-SYSTEM-CONTRACT. `night.dim` erreicht 8,42:1 auf `night`, 7,38:1 auf `night.raised`
und 6,56:1 auf `night.panel`; `night.ghost` erreicht mindestens 12,20:1. Cyan bleibt Dekor, nicht Text.

## 3. Bühne und LCP

- Genau eine H1 enthält den vollständigen Locale-Text `hero.title` in einem `sr-only`-Span. Die sichtbaren
  Satzteile sind `aria-hidden`; der zugängliche Name ist deshalb in jeder Sprache vollständig und nicht von
  der Animation abhängig.
- Nach dem ersten Rendern erscheinen die Satzteile nacheinander mit Weichzeichner/Deckkraft. Drei
  Fortschrittsstriche und ein Pause-/Weiter-Knopf (`aria-pressed`, mindestens 44 px) steuern den Ablauf.
  Pause zeigt den vollständigen Titel und hält Timer an; Weiter setzt ihn fort.
- `prefers-reduced-motion: reduce` zeigt alle Satzteile und alle Striche sofort und startet keinen Timer.
- `hero.description` und `hero.cta_secondary` bleiben erhalten. Der einzige Hero-Link ist das heutige Ziel
  `contact` ohne `GENERAL_SALES`-Attribution.
- Es gibt kein Hero-Foto und keinen Bild-LCP-Trick. Die H1 ist LCP-Kandidat. Produktbilder und Porträts
  liegen unter dem Falz, sind dimensioniert und `loading="lazy"`; `fetchpriority="high"` wird nicht gesetzt.

## 4. Auftakt und Produktteil

Der weiße Auftakt nutzt `business_pillars.pillars.igloo.headline` und `hero.description` sowie eine dekorative
Wortmarke. Der Produktteil enthält:

- IglooPro als Registry-Link `igloo-pro`, mit `PILLAR_READER` und Cursor-Drehung nur bei Maus und ohne
  Reduced Motion; `sc025.products.tilt` erklärt die Interaktion;
- Diagnostik als Registry-Link `diagnostics`, mit dem Gerät am Praxistresen aus `HERO_SHOW[0]`;
- eine echte Tabelle mit `caption`, drei Spalten-`th` und Zeilen-`th scope="row"` für Präzision,
  Bereitstellung und die drei Fachbereiche;
- Epigenetik als eigenständige Säule und Registry-Link `epigenetics`.

Die Kennzahlen verwenden ausschließlich die vorhandenen Werte `hero.stat2.value` (`CV < 2 %`,
DEC-RL-008) und `hero.stat1.value` (`3–5 Werktage`). Fachbereichstitel und Biomarker kommen aus
`segments.dental|beauty|longevity`; es werden keine Parameter oder Zahlen ergänzt. `sc025.process.title`
und die übrigen kurzen neuen UI-Texte stehen als `sc025.*` vollständig in allen zehn `home.json`-Dateien.

## 5. Weißer Sachteil, Prozess und Termine

- `why.title`, `why.intro` und genau drei `why.signals` erklären den Informationszugang. Die früheren zwei
  Benefit-Karten entfallen.
- Der POC-Prozess ist eine Tabelle mit echten Spalten- und Zeilenüberschriften in der Reihenfolge
  `application`, `result`, `context`. `steps.safety_note` bleibt auf allen Viewports sichtbar.
- Termine kommen aus `splitEventsByDate(events, new Date()).upcoming`; Datumsformat und Berliner
  Kalendertag bleiben die kanonische Eventlogik. Jede Zeile zeigt lokalisierten Titel, Datum, Ort/Kurztext
  und den Registry-Link `contact`.
- Ohne kommenden Termin verschwinden Überschrift und gesamte Termin-Tabelle. Kein Ersatztermin wird erfunden.
- Vier belegte Praxisstimmen bleiben im SSR: Wessing (`HCL-006`), Pollock, Grimm und Stojanovic
  (`HCL-017`). Vor/Zurück-Knöpfe, nativer Scroll-Snap und der Zähler ermöglichen Weiterblättern; kein
  Autoplay, keine Bewertung und `martin_fischer` bleibt ausgeschlossen.

Mobil bleiben Prozess- und Termin-Tabelle innerhalb des Viewports. Die Terminzeilen wechseln auf ein
zweispaltiges Leseraster, Ortsdetails entfallen nur visuell. Praxisstimmen brechen ohne abgeschnittenen Text um.

## 6. Kontaktblock und Conversion

Der Block trägt `sc025.contact.eyebrow` und `sc025.contact.lead`. Die Karten für Zahnarztpraxis, Ästhetik &
Beauty und Longevity & Prävention führen zum heutigen Hero-Ziel `contact`; ihre Texte kommen aus `segments.*`.
Die Messebesucher-Karte erscheint nur mit `getNextHomeEvent()` und enthält reale Eventdaten sowie
`sc025.contact.live`. Ohne Event entfällt sie ohne Restfläche.

„Oder direkt:“ verlinkt `contact`, `shopUrl(locale)` und `panelsUrl(locale)`. Externe Shops öffnen mit
`target="_blank" rel="noopener noreferrer"`, erhalten `data-shop` und verwenden die bestehende Outbound-
Messung. Es gibt keinen ROI-Rechner und keinen neuen `GENERAL_SALES`-Einstieg in dieser Komposition.
Die Blog-Route bleibt die sekundäre Wissenskonversion (`data-home-secondary-conversion="knowledge"`).

## 7. FAQ und Blog

- Vier sichtbare FAQ-Einträge verwenden die bestehende `FAQSection` mit `aria-expanded`/`aria-controls`.
  Der erste Eintrag startet über `initialOpenIndex={0}` offen; alle sind per Tastatur bedienbar.
- `HomePage` übergibt dasselbe `faq.items`-Array an `createFAQSchema` und serialisiert es mit
  `serializeStructuredData`. Sichtbare Fragen/Antworten und FAQPage-Schema bleiben dadurch identisch.
- Drei Blogteaser kommen aus `blogPosts`/`articles.ts`, ihre Titel und Auszüge aus dem Namespace `articles`
  und ihre Ziele aus der Route Registry. „Alle Fachartikel“ führt zu `articles`.

## 8. Luminous Trace

`src/components/home/LuminousTrace.tsx` ist ein eigener, nach dem ersten Rendern durch `HomePage`
nachgeladener Chunk. Er verwendet ausschließlich Browser-APIs, keine Bibliothek:

- SVG-Pfad und Punkt mit Verlauf `accent.on-dark` → `accent.line` → `accent` → `accent.line`;
- Berechnung aus realen Abschnittspositionen einschließlich Footer und Wortmarke;
- Scrollzeichnen mit rAF-Drosselung und binärer Suche entlang der Pfadlänge;
- Neuberechnung bei Resize, `ResizeObserver`, `load` und `document.fonts.ready`;
- `prefers-reduced-motion: reduce` = vollständige Linie, kein Punkt und keine Scrollanimation;
- `aria-hidden`, `focusable="false"`, `pointer-events: none`, keine Klickabdeckung;
- Listener, Observer und Frames werden beim Unmount entfernt.

Der Trace wird clientseitig per Portal unter `#root` eingesetzt und erzeugt kein SSR-Markup. Die Startseite
bleibt ohne JavaScript vollständig lesbar und bedienbar; nur die dekorative Linie fehlt dann.

## 9. Route-spezifisches CSS und Budgetgrenze

`src/components/home/home.css` ist kein Bestandteil des globalen App-CSS. Vite emittiert die Datei über einen
referenzierten `?url`-Assetpfad. `server.ts` findet diesen Hash und fügt den Inhalt ausschließlich bei der
Startseite in das bereits vorhandene Inline-Stylesheet ein. Dadurch bleiben:

- fremde Seiten bytegleich ohne SC-025-CSS;
- genau ein `style[data-inline-stylesheet]` und null `link[rel="stylesheet"]` im Produktions-HTML;
- CSP-Hash und `style-src` korrekt auf das kombinierte CSS abgestimmt;
- kein Hydration-Umbau durch React-Stylesheet-Float und keine zusätzliche CSS-Rundreise.

Kein Performance-Budget wird durch SC-025 erhöht. Wenn Startseiten- oder Fremdseiten-Budgets nicht halten,
muss zuerst HTML/CSS/JS reduziert werden; danach ist mit einer exakten Budgettabelle anzuhalten.

## 10. Deep-Link-Matrix

| Fläche                       | Ziel/Quelle                                               |
| ---------------------------- | --------------------------------------------------------- |
| Hero und Praxis-/Messekarten | Registry `contact`                                        |
| IglooPro                     | Registry `igloo-pro`                                      |
| Diagnostik                   | Registry `diagnostics`                                    |
| Epigenetik                   | Registry `epigenetics`                                    |
| Blogteaser                   | Registry `article-detail:<id>` aus `articles.ts`          |
| Alle Fachartikel             | Registry `articles`                                       |
| Praxis-Shop                  | `shopUrl(locale)`, `data-shop="practice"`                 |
| Epigenetik-Shop              | `panelsUrl(locale)`, `data-shop="panels"`                 |
| Termine                      | `events.ts`, `events.json`, `formatEventRange`, `contact` |
| Bestehender Anker            | `#los-gehts` bleibt am Kontaktblock erhalten              |

## 11. Claim- und Content-Grenzen

- `HCL-001`, `HCL-004`, `HCL-005`, `HCL-007`–`HCL-012`, `HCL-015`–`HCL-017` werden nur mit den
  bestehenden Texten fortgeführt.
- `CV < 2 %` bleibt exakt der Decision-Lock-Wert. Keine neue Genauigkeits-, Kompatibilitäts-, Zeit-,
  Behandlungs-, Ergebnis-, Umsatz-, Bewertungs- oder Lieferbehauptung wird ergänzt.
- Die vier Praxisstimmen verwenden weiterhin die wörtlichen `proof_text`-Sätze und echten Porträts.
- Alle neuen kurzen UI-Texte stehen unter `sc025.*` in zehn Sprachen. Geteilte Strings für andere Seiten,
  TrustBar, Service-Detail, FinalCta und Shops bleiben erhalten.

## 12. Verifikationsvertrag

- Komponenten-/SSR-Tests in `src/components/home/` und `EventSsrSchedule.test.tsx` prüfen H1, Pause,
  Registry-Ziele, Tabellen, alle vier Stimmen, FAQ/Blog und die Eventmatrix 15./20./27./29.11.2026.
- `e2e/sc025.config.ts` führt sechs `home-*.spec.ts`-Suiten gegen einen frischen Produktionsbuild:
  zehn Sprachen, echte Links, native FAQ, Schema-Parität, Reduced Motion, Trace, Tastatur, 44-px-Ziele,
  Axe im Main und horizontaler Überlauf bei mehreren Viewports.
- PT24.6 prüft den dynamischen Zustand „Bühnen-Pause“; das alte Hero-Slider-Bild entfällt.
- PT27.6 aktualisiert ausschließlich beabsichtigte Startseiten-Baselines im gepinnten Playwright-Image,
  danach muss ein zweiter Lauf ohne Update grün sein. Änderungen stehen im DESIGN-SYSTEM-CHANGELOG.
