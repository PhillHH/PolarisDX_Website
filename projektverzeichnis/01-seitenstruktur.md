# 01 — Seitenstruktur

Quelle: `src/App.tsx` (React-Router-Definition), `server.ts` (Sprachweiche, Sitemap, 404).

## 1. URL-Schema

Jede Seiten-URL trägt ein Sprachpräfix: `https://polarisdx.net/<lang>/<pfad>`.
`server.ts` leitet jede Seiten-URL ohne gültiges Präfix per **301** auf `/de/…` um.

```
/about                → 301 → /de/about
/                     → 301 → /de/
/xx/about             → 301 → /de/xx/about   (ungültiges Präfix zählt als Pfad)
```

Nicht umgeleitet werden: `/assets/*`, `/locales/*`, `/api/*`, `sitemap.xml`,
`robots.txt` und statische Dateien mit Endung (`.js`, `.css`, `.map`, Bilder, Fonts).

Gültige Präfixe: `de en pl fr it es pt da nl cs`.

## 2. Vollständige Routentabelle

### 2.1 Hauptwebsite (B2B-Shell `MainLayout` = Header + Footer + Chat + Call-Button)

| Route                             | Seitenkomponente            | Laden            | Sitemap-Prio                  | changefreq |
| --------------------------------- | --------------------------- | ---------------- | ----------------------------- | ---------- |
| `/`                               | `HomePage`                  | eager            | 1.0                           | weekly     |
| `/about`                          | `AboutPage`                 | lazy             | 0.8                           | monthly    |
| `/articles`                       | `ArticlesIndexPage`         | lazy             | 0.7                           | weekly     |
| `/articles/:slug`                 | `ArticlePage`               | lazy             | 0.6 je Artikel                | yearly     |
| `/diagnostics`                    | `ServicesOverviewPage`      | lazy             | 0.9                           | monthly    |
| `/diagnostics/:slug`              | `ServicePage`               | lazy             | 0.8 je Service                | monthly    |
| `/contact`                        | `ContactPage`               | lazy             | 0.8                           | monthly    |
| `/support`                        | `SupportPage`               | lazy             | — (bewusst nicht in Sitemap)  | —          |
| `/events`                         | `EventsPage`                | lazy             | 0.6                           | weekly     |
| `/downloads`                      | `DownloadsPage`             | lazy             | 0.6                           | monthly    |
| `/igloo-pro`                      | `IglooProPage`              | lazy             | 1.0                           | monthly    |
| `/epigenetics`                    | `EpigeneticsPage`           | lazy             | 0.8                           | monthly    |
| `/epigenetics/musterbefund/:slug` | `MusterbefundPage`          | lazy             | 0.6 je Befund                 | yearly     |
| `/vitamin-d3-spray`               | `VitaminD3SprayPage`        | lazy             | — (bekannt, nicht in Sitemap) | —          |
| `/vitamin-d3-implantologie`       | `VitaminD3ImplantologyPage` | lazy, **nur DE** | 0.7 (einmalig `/de/…`)        | monthly    |
| `/s3_leitlinie`                   | `S3LeitliniePage`           | lazy, **nur DE** | 0.7 (einmalig `/de/…`)        | monthly    |
| `/privacy`                        | `PrivacyPage`               | lazy             | 0.4                           | yearly     |
| `/imprint`                        | `ImprintPage`               | lazy             | 0.4                           | yearly     |
| `/terms`                          | `TermsPage`                 | lazy             | 0.4                           | yearly     |
| `*`                               | `NotFoundPage`              | lazy             | —                             | —          |

### 2.2 Consumer-Landingpages (eigene schlanke Chrome, **keine** B2B-Shell)

Eager importiert — die Head-Tags müssen im ersten SSR-Response stehen
(bezahlter Traffic aus Instagram/LinkedIn, Share-Previews).
Englisch-only: `/consumer/*` und `/<lang>/consumer/*` gehen per 301 auf `/en/consumer/*`.

| Route                        | Komponente                 | Sitemap                   |
| ---------------------------- | -------------------------- | ------------------------- |
| `/consumer/vitamin-d3-spray` | `pages/consumer/SprayPage` | `/en/…`, Prio 0.8, weekly |
| `/consumer/hydrating-masks`  | `pages/consumer/MaskPage`  | `/en/…`, Prio 0.8, weekly |
| `/consumer/inside-out-duo`   | `pages/consumer/DuoPage`   | `/en/…`, Prio 0.8, weekly |

Diese Seiten sind **indexierbar** (kein noindex, in der Sitemap, kein Basic Auth mehr) —
sie sind nur nicht in der Navigation verlinkt. Der Kommentarkopf in `src/App.tsx`
behauptet noch das Gegenteil (siehe [10-befunde.md](10-befunde.md)).

### 2.3 Dynamische Slugs

**Services** (`src/data/services.tsx`, 9 Stück):

```
dental · beauty · longevity · poc-systemloesungen · praeventions-checks
infektion-entzuendung · stoffwechsel-herz · hormon-tests · kompatibilitaet-integration
```

**Artikel** (`src/data/articles.ts`, 6 veröffentlicht — `id` ≠ `slug`):

| id                         | slug                                                            |
| -------------------------- | --------------------------------------------------------------- |
| `green_practice`           | `die-gruene-praxis`                                             |
| `invisible_patient`        | `der-unsichtbare-patient`                                       |
| `five_minute_diagnosis`    | `die-5-minuten-diagnose`                                        |
| `ecosystem_of_rapid_tests` | `the-ecosystem-of-rapid-tests-why-compatibility-creates-safety` |
| `rapid_setup_formula`      | `die-performance-formel-effizienz-in-der-poc-diagnostik`        |
| `precision_point_of_care`  | `precision-in-point-of-care-the-key-to-patient-safety`          |

**Musterbefunde** (`src/content/befunde/index.ts`, Reihenfolge 01–06 wie auf `/epigenetics`):

```
metabolic-health · healthy-aging · biologische-altersuhr
telomer-analyse · stress-monitor · healthy-sport
```

## 3. Redirects

### 3.1 Server-seitig (`server.ts`)

| Von                                                        | Nach                          | Typ |
| ---------------------------------------------------------- | ----------------------------- | --- |
| Jede Seiten-URL ohne Sprachpräfix                          | `/de/…`                       | 301 |
| `/consumer/*`, `/<lang>/consumer/*`                        | `/en/consumer/*`              | 301 |
| `/<lang>/vitamin-d3-implantologie`, `/<lang>/s3_leitlinie` | `/de/…`                       | 301 |
| `/agb`                                                     | `/terms` (Präfix bleibt)      | 301 |
| `/s3-leitlinie` (Bindestrich)                              | `/s3_leitlinie` (Unterstrich) | 301 |

### 3.2 Client-seitig (`src/App.tsx`)

| Von               | Nach                                      |
| ----------------- | ----------------------------------------- |
| `/services`       | `/diagnostics` (`<Navigate replace>`)     |
| `/services/:slug` | `/diagnostics/:slug` (`ServicesRedirect`) |

`GermanOnlyPage` fängt zusätzlich In-App-`<Link>`-Navigation auf die beiden
deutschen Seiten unter fremdem Präfix ab und löst per Effekt eine echte
Navigation auf `/de/…` aus (SSR rendert sie ohnehin nur unter `/de`).

### 3.3 Vercel (`vercel.json` — Altbestand, aktuell nicht das Deploy-Ziel)

`/services/:path*` → `/diagnostics/:path*` (permanent), plus SPA-Rewrite auf `/index.html`.

## 4. 404-Logik

`server.ts` führt eine `KNOWN_PATHS`-Menge aus `SITEMAP_ROUTES` + `EXTRA_KNOWN_PATHS`.
Ein Pfad außerhalb dieser Menge bekommt **HTTP 404** statt 200 mit 404-Seite.

`EXTRA_KNOWN_PATHS`: `/support`, `/vitamin-d3-spray`, `/services`,
die drei `/consumer/*`, die zwei Nur-Deutsch-Seiten.
`/services/:slug` wird per Muster erkannt (3 Segmente).

Dynamische Fälle (unbekannter Artikel-Slug, Catch-all) melden sich selbst:
`<SEOHead notFound>` schreibt `<meta name="prerender-status-code" content="404">`,
`server.ts` erkennt das per Regex `NOT_FOUND_MARKER` und antwortet 404.

> **Wartungsregel:** Eine neue `<Route>` in `src/App.tsx` ohne Eintrag in
> `SITEMAP_ROUTES` oder `EXTRA_KNOWN_PATHS` rendert korrekt, antwortet aber 404.
