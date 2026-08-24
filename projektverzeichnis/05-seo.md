# 05 — SEO

Quellen: `server.ts` (Sitemap, Redirects, 404), `src/components/seo/SEOHead.tsx`,
`src/components/seo/structuredData.ts`, `public/robots.txt`, `index.html`.

## 1. Sitemap (`/sitemap.xml`)

Dynamisch aus `server.ts` erzeugt, nicht als Datei abgelegt.
`Cache-Control: public, max-age=3600, s-maxage=3600`.
`BASE_URL = https://polarisdx.net`.

### 1.1 Zusammensetzung

| Block                        | Einträge                               | hreflang                     |
| ---------------------------- | -------------------------------------- | ---------------------------- |
| `SITEMAP_ROUTES`             | 27 Routen × 10 Sprachen = **270 URLs** | alle 10 + `x-default` → `de` |
| `CONSUMER_SITEMAP_ROUTES`    | 3 URLs, fest `/en/…`                   | **keine** (einsprachig)      |
| `GERMAN_ONLY_SITEMAP_ROUTES` | 2 URLs, fest `/de/…`                   | **keine** (einsprachig)      |
| **Summe**                    | **275 URLs**                           |                              |

### 1.2 Prioritäten

| Prio | Routen                                                                    |
| ---- | ------------------------------------------------------------------------- |
| 1.0  | `/`, `/igloo-pro`                                                         |
| 0.9  | `/diagnostics`                                                            |
| 0.8  | 9 Service-Seiten, `/about`, `/contact`, `/epigenetics`, 3 Consumer-Seiten |
| 0.7  | `/articles`, `/de/vitamin-d3-implantologie`, `/de/s3_leitlinie`           |
| 0.6  | 6 Artikel, 6 Musterbefunde, `/events`, `/downloads`                       |
| 0.4  | `/privacy`, `/imprint`, `/terms`                                          |

`changefreq`: `weekly` für `/`, `/articles`, `/events`, Consumer · `monthly` für
Produkt-/Service-/Unternehmensseiten · `yearly` für Artikel, Musterbefunde, Rechtstexte.

### 1.3 Bewusst nicht in der Sitemap

`/support` (über den Header erreichbar, absichtlich ungelistet) ·
`/vitamin-d3-spray` (B2B-Zwilling der Consumer-Seite) · `/services` (Redirect).
Alle drei stehen in `EXTRA_KNOWN_PATHS`, antworten also 200 statt 404.

## 2. hreflang und Canonical

Erzeugt in `SEOHead`:

- **Canonical:** `https://polarisdx.net/<lang><pfad>` — `<lang>` ist die _URL_-Sprache,
  nicht die i18n-Sprache. Übergibt der Aufrufer `canonical` explizit, gewinnt der.
- **hreflang:** alle 10 Sprachen + `x-default` → `de`
- **Deutsch-only-Seiten** (`GERMAN_ONLY_PATHS = ['/s3_leitlinie', '/vitamin-d3-implantologie']`):
  hreflang enthält **nur** `de`, Canonical zeigt immer auf die deutsche URL —
  egal unter welchem Präfix die Komponente rendert.
- **404-Seiten** (`notFound`): **kein** Canonical, **kein** hreflang,
  **kein** `og:locale:alternate`. Eine Fehlerseite darf sich nicht als Kanon ausgeben.

## 3. Meta-Tags je Seite (`SEOHead`)

| Gruppe     | Tags                                                                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| Basis      | `<title>` = `"{title}                                                                                                                                                                                  | PolarisDX"`, `meta[name=title]`, `meta[name=description]` |
| Robots     | `meta[name=robots]`, `meta[name=googlebot]`                                                                                                                                                            |
| Canonical  | `link[rel=canonical]` (außer bei `notFound`)                                                                                                                                                           |
| Open Graph | `og:type` (`website`\|`article`\|`product`), `og:url`, `og:title`, `og:description`, `og:image` (+`:width` 1200, `:height` 630, `:alt`), `og:locale`, `og:locale:alternate` je Sprache, `og:site_name` |
| Twitter    | `twitter:card=summary_large_image`, `:url`, `:title`, `:description`, `:image`, `:image:alt`                                                                                                           |
| 404-Marker | `meta[name=prerender-status-code][content=404]`                                                                                                                                                        |

Empfehlung im Code: Description 150–160 Zeichen. Standard-OG-Bild: `/og-image.jpg`;
Sonderbilder `/og-epigenetics.jpg` und `/og-vitd3-spray.jpg`.
Relative `ogImage`-Werte werden auf `BASE_URL` absolut gemacht.

### 3.1 Robots-Werte

| Fall              | Wert                                       |
| ----------------- | ------------------------------------------ |
| Normal            | `index, follow`                            |
| `notFound`        | `noindex, follow` (überschreibt `noindex`) |
| `noindex` gesetzt | `noindex, nofollow`                        |

## 4. Structured Data (`src/components/seo/structuredData.ts`)

Feste Schemata:

| Export                  | `@type`                                                                  |
| ----------------------- | ------------------------------------------------------------------------ |
| `medicalBusinessSchema` | `MedicalBusiness` (2 `PostalAddress`, `GeoCircle`/`GeoCoordinates`)      |
| `organizationSchema`    | `Organization` (Logo als `ImageObject`, `PostalAddress`, `ContactPoint`) |
| `websiteSchema`         | `WebSite` mit `SearchAction`/`EntryPoint` (Sitelinks-Searchbox)          |
| `iglooProProductSchema` | `Product` (`Brand`, `Organization`, `QuantitativeValue`)                 |

Fabriken:

| Funktion                                   | Ergebnis                                                                                  | Verwendet auf            |
| ------------------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------ |
| `createBreadcrumbSchema(items, language?)` | `BreadcrumbList` / `ListItem`                                                             | Unterseiten              |
| `createFAQSchema(items)`                   | `FAQPage` / `Question` / `Answer`                                                         | Seiten mit FAQ-Abschnitt |
| `createArticleSchema(options)`             | `Article` (Typ wählbar), `author`, `publisher`, `reviewedBy` (Person), `mainEntityOfPage` | `ArticlePage`            |

Helfer: `toIsoDate()` normalisiert Datumsangaben, `canonicalUrlFor(url, language?)`
setzt Sprachpräfixe konsistent.

Seiten mit eigener Schema-Einbindung: `ArticlePage`, `ServicePage`,
`S3LeitliniePage`, `NotFoundPage`.

## 5. robots.txt

Ausdrückliche Politik (Kopf der Datei, Stand 2026-06-04):

- **Google Search + Google-Extended (KI-Training) voll erlaubt**
- **KI-Crawler durchgängig erlaubt:** GPTBot, ChatGPT-User, OAI-SearchBot,
  anthropic-ai, ClaudeBot, Claude-Web, claude-user, Applebot-Extended,
  Meta-ExternalAgent/-Fetcher, Amazonbot, Bytespider, MistralAI-User,
  PerplexityBot/Perplexity-User, cohere-ai, cohere-training-data-crawler,
  CCBot, DuckAssistBot, Diffbot, YouBot
- **Suchmaschinen:** Googlebot (+ AdsBot, Images, News, Video), Bingbot, AdIdxBot,
  DuckDuckBot, Yandex, Baiduspider, Applebot
- **Social/Preview:** FacebookBot, facebookexternalhit, LinkedInBot, Twitterbot
- **Wildcard-Gruppe `*`:** `Disallow: /api/`, `/locales/`, `/_`, `/*.json$`;
  ausdrücklich erlaubt `/assets/`, `/*.js$`, `/*.css$`

Nach RFC 9309 gewinnt die spezifischste Gruppe — benannte Bots ignorieren die
Wildcard-Sperren. `/consumer/*` ist **nicht mehr** gesperrt.

`Sitemap: https://polarisdx.net/sitemap.xml`.

## 6. Indexierungsmatrix

| Bereich                   | Sitemap                 | robots            | noindex | Canonical                  |
| ------------------------- | ----------------------- | ----------------- | ------- | -------------------------- |
| B2B-Hauptseiten           | ja, 10 Sprachen         | erlaubt           | nein    | `/<lang><pfad>`            |
| `/support`                | nein                    | erlaubt           | nein    | `/<lang>/support`          |
| `/vitamin-d3-spray`       | nein                    | erlaubt           | nein    | `/<lang>/vitamin-d3-spray` |
| Consumer `/en/consumer/*` | ja, einsprachig         | erlaubt           | nein    | `/en/consumer/…`           |
| Deutsch-only              | ja, einsprachig `/de/…` | erlaubt           | nein    | immer `/de/…`              |
| 404                       | nein                    | `noindex, follow` | ja      | keiner                     |

## 7. Weitere SEO-Technik

- **Prerendering:** `scripts/prerender.mjs` fährt per Playwright eine Routenliste ab und
  legt statisches HTML in `dist/` — Altbestand aus der Zeit vor SSR. Seine Routenliste ist
  **veraltet** (siehe [10-befunde.md](10-befunde.md)).
- **Site-Verification:** `google0a5363efd12b6a30.html` im Repo-Root.
- **`site.webmanifest`** + Favicon-Satz (16/32/192, maskable-512, apple-touch-icon).
- **Meta-Description-Prüfung:** `scripts/check-meta-descriptions.mjs`.
- **OG-Bild-Erzeugung:** `scripts/og-image-template.html` + `convert-og-image.mjs` (sharp).
- **Bildoptimierung:** `scripts/optimize-images.mjs`.

## 8. Vorhandene SEO-Analysen im Repo

| Datei                                                 | Inhalt             |
| ----------------------------------------------------- | ------------------ |
| `SEO_STRATEGY.md`                                     | Gesamtstrategie    |
| `docs/seo-analysis-2026-02-06.md`                     | Analyse            |
| `docs/internal-linking-audit.md`                      | interne Verlinkung |
| `docs/migration-map.md`                               | URL-Migration      |
| `docs/seo/keyword-strategie-vitamin-d-zahnmedizin.md` | Keyword-Strategie  |
| `docs/seo/artikel-outline-vitamin-d-zahnmedizin.md`   | Artikel-Outline    |
| `docs/seo/seo-check-vitamin-d-zahnmedizin.md`         | Prüfung            |
| `docs/seo/faq-structure-analysis.md`                  | FAQ-Struktur       |
