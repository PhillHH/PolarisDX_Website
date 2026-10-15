# Entwurf 4: Unterseiten im Editorial-Stil (2026-10-15)

Status: Entwurf, Bilder (JPG; PNG-Originale im Arbeitsverzeichnis) und HTML-Quelle. Es wurde kein Produktivcode geändert. Der Owner wählt aus und gibt frei.
Grundlage: die freigegebene Startseite aus AP34 PT34.1 (SC-002). Es ist ein Redesign, kein Neuentwurf: gleiche Routen, gleiche Inhalte, gleiche Claims.

## Dateien

| Datei | Inhalt |
|---|---|
| `00-uebersicht-desktop.jpg` / `00-uebersicht-mobile.jpg` | alle Seiten nebeneinander |
| `00-strecken-und-navigation.jpg` | Informationsarchitektur: fünf Orientierungshilfen, drei Strecken, Messpunkte |
| `01`–`07` `*-desktop.jpg` / `*-mobile.jpg` | ganze Seiten, Desktop 1440 px und Mobil 390 px (@2x) |
| `anmerkungen/*` | dieselben Desktop-Seiten mit nummerierten UX-Markern (Legende unten) |
| `quelle/` | HTML/CSS der Entwürfe; `node render.mjs epi-hub` rendert neu |

Seiten: 01 Epigenetik-Hub · 02 Epigenetik-Grundlagen (Vorlage auch für Studienlage und Unterlagen) ·
03 Musterbefund · 04 Diagnostik-Hub · 05 Service-Detail Dental (Vorlage für alle 9 Bereiche) · 06 IglooPro · 07 Kontakt.

## Was heute nicht gut funktioniert (Ist-Stand Preview, gemessen)

1. **Der Epigenetik-Hub ist 16.035 px lang** (Desktop). Er hat 12 Abschnitte und eine Sprungleiste mit 11 Chips, die horizontal abgeschnitten wird.
   NN/g rät von Chip-Optik für Inhaltsverzeichnisse ab, weil sie wie Filter wirkt.
2. **Doppelungen.** „Werte verstehen", „Studienlage" und „Unterlagen" stehen vollständig im Hub und noch einmal als eigene Unterseite.
   Wer weiterklickt, liest dasselbe noch einmal.
3. **Falsche Reihenfolge.** Die Vergleichstabelle der sechs Panels kommt vor den Karten, die erklären, was die Panels sind.
4. **Keine erkennbare Strecke.** Es gibt kein Signal, wo man steht, was als Nächstes kommt und wie man zurückkommt.
   „Weiterlesen" ist je Seite anders gebaut.
5. **Der Musterbefund ist 10.471 px lang** und hat keinen Lesefortschritt. Zwischen den sechs Befunden wechselt man nur über Chips im Kopf.
6. **Der Diagnostik-Hub listet die sechs Bereiche zweimal** („Weitere diagnostische Leistungsbereiche" und „Sechs Einstiege …").
7. **Uneinheitliche Bühnen.** Alte Navy-Kästen mit Icon-Kacheln stehen neben der neuen Foto-Bühne der Startseite.
8. **Zwei Telefonnummern.** Kontakt nennt `+49 151 75011699`, Epigenetik nennt `+49 152 2858 0999`
   (`EpigeneticsPage.tsx:970`, auch im Befund-PL-JSON). Der Owner muss entscheiden, welche gilt.

## Das Navigationssystem (gilt für jede Unterseite)

1. **Hauptnavigation.** Navy-Kopfzeile wie auf der Startseite.
2. **Bereichsleiste.** Sie liegt sticky unter der Bühne und gilt pro Bereich (Epigenetik, Diagnostik, IglooPro).
   - Fünf bis sechs echte Ziele, Unterstrich-Tabs statt Chips.
   - Rechts sitzen Merkliste und „Angebot anfragen".
   - Sie ersetzt die 11-Chip-Sprungleiste.
3. **Auf dieser Seite.** Inhaltsverzeichnis in der linken Spalte, sticky.
   - Der aktive Abschnitt und der Lesefortschritt werden angezeigt.
   - Mobil ist es nicht sticky, sondern zuklappbar am Seitenanfang. Laut NN/g werden zugeklappte sticky Inhaltsverzeichnisse oft übersehen.
4. **Nächster Schritt.** Jede Seite endet mit „Zurück · Weiter · Anfrage", sodass es keine Sackgassen gibt.
5. **Merkliste.** Die Funktion existiert bereits (`src/lib/merkliste.ts`) und wird jetzt sichtbar gemacht:
   - Zähler in der Bereichsleiste.
   - Mobile Leiste „2 Analysen vorgemerkt · Anfragen".
   - Das Formular ist vorbefüllt.
   - Gespeichert wird nur im Browser, ohne Tracking.

Mobil gibt es zusätzlich eine schwebende Aktionsleiste unten. Sie darf den Consent-Banner nicht verdecken und erscheint erst nach der Bühne.

## Epigenetik: vier Schritte zur Entscheidung

Verstehen (Grundlagen) → Analyse wählen (Finder im Hub) → Musterbefund ansehen (6 Befunde) → Anfragen (vorbefüllt).

- Der Wegweiser steht oben im Hub. Jede Unterseite zeigt „Schritt n von 4".
- Der Hub schrumpft auf etwa 8.600 px (−46 %).
- Studienlage, Unterlagen und „Werte verstehen" erscheinen im Hub nur noch als kurze Teaser mit Link auf die Unterseite.

## Legende der Anmerkungen (`anmerkungen/`)

**01 Epigenetik-Hub**
1. Foto-Bühne wie auf der Startseite. Text kommt vor dem Bild, ein einziges LCP-Bild.
2. Die Bereichsleiste ersetzt die 11-Chip-Leiste. Die Merkliste ist immer sichtbar.
3. Wegweiser in vier Schritten. Jede Karte ist ein Sprungziel.
4. Finder:
   - Jede Filteroption zeigt ihre Trefferzahl schon vor dem Klick.
   - Die Karten zeigen drei Vergleichsachsen statt fünf.
   - Hauptaktion ist „Musterbefund ansehen".
   - Hinweise wie „Explorativ" und „Mit Genetik · GenDG" stehen direkt an der Karte statt in einem Absatz weiter unten.
5. Die Vergleichstabelle ist aufklappbar (progressive disclosure) und steht nach den Karten statt davor.
6. Der Ablauf ist nach Ort gruppiert: in Ihrer Einrichtung, beim Kooperationspartner, wieder bei Ihnen.
7. Die Merkliste fließt sichtbar in die Anfrage.
8. „Nächster Schritt" am Seitenende.

**02 Grundlagen**
1. Schrittanzeige „1 von 4".
2. Gegenüberstellung von Genetik und Epigenetik: unveränderlich gegen im Verlauf messbar.
3. „Weiter: Schritt 2".

**03 Musterbefund**
1. „Diese Analyse anfragen" (Panel vorbefüllt), Vormerken und PDF.
2. Befund-Wechsler mit allen sechs Befunden plus Vor/Zurück.
3. Inhaltsverzeichnis mit aktivem Kapitel, Fortschritt und Mini-Anfrage.
4. „Auf einen Blick": Die Ampelfarben bleiben unverändert (BEFUNDE-CONTRACT, Ausnahme von SC-002).
5. „Wie belastbar ist dieser Wert?" steht direkt am Ergebnis statt in einem Hinweisblock.
6. Vorheriger und nächster Befund plus Anfrage.

**04 Diagnostik-Hub**
1. Zwei Einstiegsarten statt doppelter Liste: nach Fachrichtung (Foto-Karten) und nach Fragestellung (Kacheln).
2. Parameter-Abkürzung: Ein Klick auf CRP zeigt die drei Bereiche, in denen der Parameter vorkommt.
   Die Daten stammen aus den vorhandenen Tags.
3. IglooPro und Epigenetik als ein Band „Ein Reader. Eine zweite Ebene."

**05 Dental**
1. Parameterleiste in der Bühne.
2. Inhaltsverzeichnis plus Vertiefung (S3-Leitlinie, Vitamin D3).
3. „Nächster Bereich: Beauty". So kann man durch alle neun Bereiche blättern.

**06 IglooPro**
1. Das Produkt ist die Bühne, die Kennzahlen stehen als Glas-Chips am Gerät.
2. Produktleiste: Überblick, Aufbau, Technische Daten, Kompatibilität, Wirtschaftlichkeit, Passung.
3. Der ROI-Rechner ist als Vorschau auf der Seite eingebettet statt nur verlinkt.

**07 Kontakt**
1. Zuerst kommt die Frage „Worum geht es?". Es gibt einen Fortschrittsbalken, die Hinweise reagieren auf den gewählten Bereich.
2. „Nach dem Absenden": drei Schritte direkt neben dem Formular.

## Tracking und Technik (GTM / GA4)

- **Kein neuer Anbieter und kein neues Skript.** Alles läuft über die bestehende Grenze `src/lib/tracking.ts`.
  - Es gilt der Basic Consent Mode v2: Ohne Einwilligung lädt GTM nicht, und Ereignisse werden verworfen (`googleConsent.ts`).
- **Keine neuen Ereignisnamen nötig.** Die Strecken lassen sich mit der vorhandenen Taxonomie messen:
  - `page_view` (Pfadfolge)
  - `cta_click` (mit `ort`)
  - `panel_select` (Finder)
  - `chapter_toggle` (Akkordeons, Inhaltsverzeichnis mobil)
  - `scroll_depth`
  - `download_delivered`
  - Konversionen erst nach Speicherung: `epigenetics_inquiry_submit`, `contact_submit`, `roi_report_request`
- **Neue CTA-Orte müssen in `CTA_LOCATIONS` ergänzt werden**, sonst verwirft `track()` sie:
  `area-nav`, `next-step`, `mobile-bar`, `panel-card`, `toc-box`.
  - Die Werte sind Aufzählungen und keine übersetzten Texte, damit es in 10 Sprachen nur einen Wert gibt.
- **GA4-Auswertung.** Ein Trichterbericht in Explorations kann so aussehen:
  `/epigenetics` → `/epigenetics/grundlagen` oder `panel_select` → `/epigenetics/musterbefund/*` → `epigenetics_inquiry_submit`.
  Es braucht keine zusätzlichen Parameter.
- **Merkliste.** Sie bleibt ohne Tracking und ohne Übertragung. So ist sie nicht einwilligungspflichtig (siehe Kommentar in `merkliste.ts`).
- **Deep-Links.** Die heutigen Hub-Anker müssen weiter funktionieren:
  `#analysen #vergleich #musterbefunde #prinzip #ablauf #studienlage #fragen #downloads #werte-verstehen #inquiry`.
  - Teaser behalten ihre ID.
  - `#werte-verstehen` leitet clientseitig auf `/epigenetics/grundlagen#werte-verstehen` um.
  - `#inquiry` ist Vertragsanker (EPIGENETICS-CONTRACT). Die Anfrage-Sektion behält diese ID.
- **Performance.** Pro Hub gibt es ein Bühnenfoto mit eingebackenem Verlauf als AVIF (Pipeline aus PT34.1).
  - Es gilt das `lcpImageBytes`-Budget von 19,4 KB je Route.
  - Sticky-Leisten und die mobile Aktionsleiste dürfen keinen CLS verursachen: Höhe reservieren, keine Einblend-Animation, die Layout verschiebt.
- **Barrierefreiheit:**
  - Die Bereichsleiste ist ein `<nav aria-label="Bereich Epigenetik">` mit `aria-current="page"`.
  - Das Inhaltsverzeichnis nutzt `aria-current="location"`.
  - Die mobile Leiste kommt in der Fokus-Reihenfolge nach dem Inhalt.
  - Auf Navy gelten immer `accent-on-dark` und weiße Fokusringe.
- **SEO.** Keine Route ändert sich. H1 und Titel bleiben gleich. Die Breadcrumb-Struktur und die JSON-LD-Daten bleiben.

## Folgen für Verträge und Arbeitspakete

- SC-002 sagt „keine neuen Sektionen". Folgende Punkte sind daher Strukturänderungen und brauchen eine Owner-Freigabe als **SC-003 Informationsführung**:
  - Wegweiser
  - Parameter-Abkürzung
  - Bereichsleiste
  - „Nächster Schritt"
  - Hub-Teaser statt Doppelungen
  - mobile Aktionsleiste
- **Neue Mikrotexte** (etwa „In vier Schritten zur Entscheidung", „Vorgemerkt", „Weiter · Schritt 2") müssen in allen 10 Sprachen gepflegt werden.
- **Betroffene Verträge:** EPIGENETICS, DIAGNOSTICS-HUB, IGLOOPRO, BEFUNDE (nur Rahmen), DESIGN-SYSTEM, CONSENT-TRACKING (CTA-Orte).
  - Bei den E2E-Tests sind vor allem die Abschnittszählungen und die Deep-Link-Matrix betroffen.
- **Umsetzung im bestehenden Plan:**
  - PT34.2: Hubs, Service-Details, IglooPro, Epigenetik inklusive Musterbefund-Rahmen.
  - PT34.3: Blog, Termine, Über uns, Kontakt, Support, Downloads, Rechtstexte, 404, Consumer.
  - PT34.4: Konsistenz und Abnahme.

## Offene Entscheidungen für den Owner

1. Freigabe der Strukturänderungen als SC-003 (ja oder nein, einzeln oder gesamt).
2. Welche Telefonnummer gilt?
3. Die mobile Aktionsleiste auf allen Unterseiten oder nur in Epigenetik?
4. Die Parameter-Abkürzung im Diagnostik-Hub: ja oder nein?

## Recherche-Quellen

- NN/g, Table of Contents: Platzierung, Sticky-Verhalten, mobil, keine Chip-Optik, Rückwärts-Links. https://www.nngroup.com/articles/table-of-contents/
- NN/g, Accordions on Desktop: progressive disclosure, kein Verstecken kritischer Inhalte. https://www.nngroup.com/articles/accordions-on-desktop/
- NN/g, B2B Website Usability (3. Auflage): Produktinformationen, Preise, Kontakt zu Vertrieb, Vertrauen. https://www.nngroup.com/reports/b2b-websites-usability/
- Queensland Health Design System, In-page navigation: Liste über dem Inhalt, Linktext gleich Überschrift. https://www.design-system.health.qld.gov.au/components/in-page-navigation
- Consent Mode v2 Basic gegen Advanced, Pflichtsignale: https://datanostro.com/en/blog/tracking/consent-mode-v2-server-side-gdpr/
