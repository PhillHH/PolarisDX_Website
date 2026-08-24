# 06 — Inhaltsdaten und Kategorien

Es gibt **kein CMS**. Alle Inhalte liegen in drei Schichten:

1. **Struktur + Schlüssel** in TypeScript (`src/data/`)
2. **Texte** in den i18n-Dateien (`public/locales/<lang>/<ns>.json`)
3. **Sonderfälle** als eigenes JSON (`src/content/`) oder hartkodiert in der Seite

## 1. Diagnostik-Services — `src/data/services.tsx`

9 Einträge. Die `id` ist zugleich URL-Slug und i18n-Schlüssel.
Jeder Eintrag trägt ein `lucide-react`-Icon (32 px, `strokeWidth 1.5`).

| #   | id / Slug                     | Icon                | Menü-Gruppe                   |
| --- | ----------------------------- | ------------------- | ----------------------------- |
| 1   | `dental`                      | `Smile`             | `group_poc` (Header + Footer) |
| 2   | `beauty`                      | `Sparkles`          | `group_poc` (Header + Footer) |
| 3   | `longevity`                   | `Activity`          | `group_poc` (Header + Footer) |
| 4   | `poc-systemloesungen`         | `MonitorSmartphone` | `group_poc` (Header + Footer) |
| 5   | `praeventions-checks`         | `ShieldCheck`       | nur Footer                    |
| 6   | `infektion-entzuendung`       | `Flame`             | nur `/diagnostics`            |
| 7   | `stoffwechsel-herz`           | `HeartPulse`        | nur `/diagnostics`            |
| 8   | `hormon-tests`                | `Dna`               | nur Footer                    |
| 9   | `kompatibilitaet-integration` | `Puzzle`            | nur `/diagnostics`            |

Texte: Namespace `services`. Anzeige: `ServicesOverviewPage`, `ServicePage`, `ServiceCard`.

## 2. Artikel — `src/data/articles.ts`

6 Artikel. `id` (i18n-Schlüssel) und `slug` (URL) sind verschieden — Zuordnung in
[01-seitenstruktur.md](01-seitenstruktur.md#23-dynamische-slugs).
Zugriff über `getArticleBySlug(slug)`.
Jeder Artikel hat `sections[]` mit optionalem `image`.

`src/data/blogPosts.ts` ist **abgeleitet**, keine eigene Quelle: es mappt `articles`
auf `{ id, slug, image }` für die Teaser (`BlogSection`, `BlogCard`).

Texte: Namespace `articles`. Metadaten: `src/lib/articleMeta.ts`. Hook: `useArticles`.
Schema: `createArticleSchema()` inklusive `reviewedBy`.

## 3. Events — `src/data/events.ts`

Die `id` ist zugleich i18n-Schlüssel (`events:items.<id>.*`) und **muss stabil bleiben** —
wer sie ändert, muss sie in allen zehn Sprachdateien mitändern.

### 3.1 Kommende Termine (`events`)

| id                             | Datum              | Ort        | Partner       |
| ------------------------------ | ------------------ | ---------- | ------------- |
| `dentale_themenwelt`           | 2026-06-12 – 06-13 | Stuttgart  | Nobel Biocare |
| `dgi_summer_event`             | 2026-06-12 – 06-13 | Düsseldorf | Nobel Biocare |
| `nobel_biocare_dach_symposium` | 2026-06-18 – 06-20 | München    | Nobel Biocare |
| `kite_education`               | 2026-08-01 – 09-04 | Sylt       | —             |
| `dgi_jahreskongress`           | 2026-11-27 – 11-28 | Hamburg    | Nobel Biocare |

`HIGHLIGHT_EVENT_ID = 'dgi_jahreskongress'` — der prominent gezeigte Flaggschiff-Termin.
Felder: `date`, optional `endDate` (fehlt = eintägig), `location`, optional `link`, `partner`.
Ortsnamen und Partnernamen bleiben in allen Sprachen unübersetzt.

### 3.2 Rückblick (`pastEvents`, i18n-Schlüssel `events:past_items.<id>.*`)

| id                       | Monat/Jahr | Ort        |
| ------------------------ | ---------- | ---------- |
| `ids_cologne`            | 10/2025    | Köln       |
| `dgi_kongress_frankfurt` | 8/2025     | Frankfurt  |
| `dental_summer`          | 5/2025     | Timmendorf |
| `ids_innovation`         | 2/2025     | Köln       |

Abgelaufene Einträge aus `events` rutschen **automatisch** in diesen Abschnitt —
dort ist nichts nachzupflegen. Helfer: `humanizeEventId()`, Datums-Helfer in UTC.

## 4. Downloads

### 4.1 Katalogseite `/downloads` — `src/content/downloads.json`

Zwei Kategorien, in `DownloadsPage` als Union `'tech' | 'info'` typisiert:

| Kategorie | Anzeige               | Einträge                       |
| --------- | --------------------- | ------------------------------ |
| `tech`    | Technische Broschüren | **0** — Abschnitt aktuell leer |
| `info`    | Informationsmaterial  | 3                              |

| id                  | Datei                     | Format | Größe  | Datum      |
| ------------------- | ------------------------- | ------ | ------ | ---------- |
| `im-de-igloo-pro`   | `igloo-pro-flyer.pdf`     | PDF    | 0.5 MB | 2025-01-20 |
| `im-vitd3-spray-de` | `vitamin-d3-spray-de.pdf` | PDF    | 1.0 MB | 2025-01-20 |
| `im-vitd3-spray-en` | `vitamin-d3-spray-en.pdf` | PDF    | 1.0 MB | 2025-01-20 |

Dateien liegen in `public/downloads/`.

### 4.2 Epigenetik-Unterlagen — `public/downloads/epigenetics/`

Eigener Bestand, **nicht** über `downloads.json` geführt.
`ASSET_BASE = '/downloads/epigenetics/'` in `EpigeneticsPage`, `MusterbefundPage`,
`EpigeneticsPanels`, `BefundBlocks`.

Sammelpakete im Wurzelverzeichnis:
`PolarisDX_Unterlagen_DE.zip` · `PolarisDX_Unterlagen_EN.zip` · `PolarisDX_Musterbefunde_DE.zip`

**Deutsch (`/de/`, 17 PDFs):** 00 Portfolio-Übersicht · 01–06 Panel-Broschüren
(Metabolic Health, Healthy Aging, Biologisches Alter, Telomer-Analyse, Stress Monitor,
Healthy Sport) · 07 Konditionen-Anfrage · 08 Evidenz/Studienlage ·
10–15 Musterbefunde (dieselben sechs Panels) · 16 Parameterübersicht · 17 Werte verstehen

**Englisch (`/en/`, 9 PDFs):** 00 Portfolio Overview · 01–06 Panel-Broschüren ·
07 Terms Enquiry · 08 Evidence Base

Englisch fehlen also die sechs Musterbefund-PDFs (10–15), die Parameterübersicht (16)
und „Werte verstehen" (17) sowie ein `PolarisDX_Musterbefunde_EN.zip`.

## 5. Musterbefunde — `src/content/befunde/`

Sechs Panels, je eine deutsche und eine englische JSON-Datei.
Reihenfolge `BEFUND_ORDER` = die Nummerierung 01–06 auf `/epigenetics`:

```
metabolic-health · healthy-aging · biologische-altersuhr
telomer-analyse · stress-monitor · healthy-sport
```

Datenmodell: `Befund { slug, panel, blocks: { type, … }[] }`, exportiert als
`BEFUNDE: Record<slug, { de, en }>`.

Bewusst **außerhalb** des i18n-Namensraums: der lädt auf jeder Seite mit, diese Daten
werden nur auf den Befundseiten gebraucht und kommen über den Lazy-Chunk nur dort ins Netz.

Herkunft der Werte (dokumentiert im Kopf von `index.ts`): abgeleitet aus den Quell-PDFs.
Die Netzdiagramm-Werte stehen in keinem PDF-Text — sie sind aus der Vektorgrafik
zurückgerechnet (fünf Gitterringe geben Mittelpunkt und Maßstab); die acht im Fließtext
genannten Werte dienten als Gegenprobe und stimmen exakt.
Das Lebensstil-Radar hat elf Achsen im Uhrzeigersinn ab 12 Uhr: Alltagsbewegung, Sport,
Stress, Tabak, Alkohol, Snacks, Fleisch, Omega-3, Ballaststoffe, Obst/Gemüse, Flüssigkeit —
in allen Befunden dieselbe Beispielperson, daher dieselben Werte.

Weitere Dateien: `panelNames.ts` (+ Test), `legacyAnchors.ts` (alte Ankernamen).

## 6. Testimonials — `src/data/testimonials.ts`

5 Einträge mit `id`, `name`, `role`:
`richard_pollock` (Zahnarzt) · `kristian_grimm` (Zahnarzt) · `goran_stojanovic` (Zahnarzt) ·
`bastian_wessing` (Ärztlicher Leiter) · `martin_fischer` (Allgemeinmediziner/Praxis).
Anzeige: `TestimonialsSection`, `DoctorsSection`.

## 7. Hartkodierte Seiten (kein i18n, kein Datenmodell)

`/s3_leitlinie` und `/vitamin-d3-implantologie` — handgeschriebenes Deutsch direkt in der
Seitenkomponente. Beide sind über `GERMAN_ONLY_PATHS` an die deutsche URL gebunden.

## 8. Statische Assets (`public/`)

| Datei                                                                                   | Zweck                          |
| --------------------------------------------------------------------------------------- | ------------------------------ |
| `og-image.jpg`, `og-image.svg`                                                          | Standard-Social-Bild           |
| `og-epigenetics.jpg`                                                                    | Social-Bild Epigenetik-Strecke |
| `og-vitd3-spray.jpg`                                                                    | Social-Bild Vitamin-D3-Spray   |
| `polarisdx-mark.svg`                                                                    | Logo                           |
| `favicon.ico/.png`, `favicon-16/32/192.png`, `maskable-512.png`, `apple-touch-icon.png` | Icons                          |
| `site.webmanifest`                                                                      | PWA-Manifest                   |
| `robots.txt`                                                                            | Crawler-Regeln                 |
| `browser.png`, `vite.svg`                                                               | Sonstiges                      |
| `google0a5363efd12b6a30.html` (Repo-Root)                                               | Search-Console-Verifikation    |
