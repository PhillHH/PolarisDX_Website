# AP29 — Pre-Launch-Crawl, Redirect-Map-Entwurf, Sitemap/Robots (PT29.1–PT29.3, vorbereitend)

> Stand: 2026-10-16 · Branch `console/24-25-2026-09-16T09-52-24` · rein lesend (GET/HEAD, Concurrency ≤ 4).
> Kein Fix umgesetzt; gefundene Fehler sind unten mit Datei:Zeile und Fix-Vorschlag beschrieben.
> Rohdaten/Skripte (nicht im Repo): `/tmp/claude-1000/-home-phillip-01polaris-preview/507c3cf0-bf8c-4703-82f0-d1dba4248d4d/scratchpad/ap29/`.

## 1. Methode

| Ziel    | Host (lokal)            | Entspricht                                        |
| ------- | ----------------------- | ------------------------------------------------- |
| Prod    | `http://127.0.0.1:2026` | `https://polarisdx.net` (byte-identischer Docker) |
| Preview | `http://127.0.0.1:9100` | `https://preview.polarisdx.net` (dieser Worktree) |

1. **Seeds:** alle `<loc>` aus `/sitemap.xml` des jeweiligen Hosts; danach BFS über alle internen
   `<a href>` (gleicher Host bzw. absolute `polarisdx.net`-/Preview-/localhost-Links), alle 10 Locales.
2. **Je URL:** Status, Redirect-Kette (jeder Hop einzeln verfolgt, Länge, Loop-Erkennung), `<title>`,
   Meta-Description, Canonical, hreflang-Set, robots-Meta, `X-Robots-Tag`, H1, `og:url`, `html[lang]`,
   Anzahl interner Links, `<img>` ohne `alt`-Attribut (`alt=""` = dekorativ, zählt nicht als Fehler),
   verlinkte Downloads (`.pdf/.zip/…`, je HEAD), Vorkommen von Preview-/localhost-Hosts im HTML.
3. **Kreuzprobe:** jede auf einem Host gefundene URL plus 577 Legacy-Kandidaten auf **beiden** Hosts
   abgefragt. Legacy-Kandidaten = 30 Registry-Redirect-Quellen und 9 `INTENTIONAL_404_PATHS`
   (`src/routing/legacyRedirects.ts`, `getRedirectRegistryEntries()`) jeweils unpräfixiert + ×10 Locales,
   alle 43 kanonischen Pfade unpräfixiert und mit Trailing Slash, URLs aus `docs/`/`building-docs/`,
   `vercel.json` sowie gängige Heuristik-Pfade (`/impressum`, `/blog`, `/index.html` …).
4. **Registry-Abgleich:** Route Registry per `tsx` ausgelesen (43 kanonische Pfade, 39 sitemap-fähig,
   30 Redirect-Quellen, 9 bewusste 404).
5. Alle Bild-/`og:image`-URLs der Prod-Seiten per HEAD gegen Preview geprüft (Asset-Kontinuität).

Skripte: `crawl.py` (Crawler), `probe.py` (Listenprobe), `dump-registry.ts`. Daten: `prod.json`,
`preview.json`, `probe-prod.json`, `probe-preview.json`, `compare-prod-preview.csv`,
`redirect-map-preview.csv`, `prod-images-on-preview.json`, `*-sitemap.xml`, `registry.json`.

## 2. Zahlen

| Kennzahl                                              | Prod (:2026)                  | Preview (:9100)              |
| ----------------------------------------------------- | ----------------------------- | ---------------------------- |
| Sitemap-URLs                                          | 383                           | **390** (= 39 Families × 10) |
| gecrawlte URLs                                        | 434                           | 440                          |
| davon 200 direkt / 3xx / 4xx                          | 433 / 1 / 0                   | 440 / 0 / 0                  |
| kaputte interne Links (Ziel ≠ 200)                    | 10 (`/contact` → 301)         | **0**                        |
| Downloads verlinkt / HEAD 200                         | 33 / 33                       | 30 / 30                      |
| `<img>` ohne `alt` / mit `alt=""`                     | 0 / 20                        | 0 / 770                      |
| indexierbare Seiten mit 10 hreflang + `x-default`     | 363 (inkl. Legal)             | 410, Abweichungen **0**      |
| Seiten mit `noindex`                                  | 50 (Legal + Soft-404)         | 30 (nur Legal, gewollt)      |
| Canonical nicht selbstreferenzierend                  | 80 (60 Artikel → Homepage)    | 10 (nur `/xx` → `/xx/`)      |
| Seiten mit ≠ 1 H1                                     | 70                            | 0                            |
| Doppelte robots-Meta je Seite                         | 363                           | 0                            |
| Preview-/localhost-Host in Canonical/og/hreflang/HTML | 0                             | **0**                        |
| Sitemap-Einträge mit `lastmod`                        | 383, alle `2026-10-16` (Fake) | 60 (Artikel, echte Daten)    |

**Prod-URLs auf Preview (434):** 403 × 200 direkt · 11 × genau ein 301 → 200 (`/contact`,
`/xx/services/dental` → `/xx/diagnostics/dental`) · 20 × 404 (`/xx/blog/vitamin-d3-implantologie`,
`/xx/case-studies/32reasons` — beide auf Prod **Soft-404**: HTTP 200, Titel „Seite nicht gefunden“,
widersprüchliche robots `index` + `noindex`). Keine Kette, kein Loop, kein Homepage-Sammelredirect.

**Feld-Diffs auf den 403 gemeinsamen 200-URLs:** Title 323 · Description 333 · H1 268 · Canonical 60
(Artikel: Prod zeigte auf Homepage, Preview korrekt self) · hreflang 90 (60 Artikel korrigiert,
30 Legal ohne hreflang gemäß SEO-CONTRACT) · robots 343 (Prod doppelte robots-Meta, Preview eine).
Vollständig je URL in `compare-prod-preview.csv`; DE-Titel im Anhang A.

**Durch den Relaunch behobene Prod-Mängel (positiv):** Soft-404 für jede unbekannte URL (Prod: 301 →
`/de/<x>` → 200), doppelte robots-Meta, Artikel-Canonical auf Homepage + fehlende H1, `/xx/services/dental`
als 200 mit Homepage-Canonical, 30 `noindex`-Legal-URLs in der Sitemap, Fake-`lastmod`, Consumer nur EN
(Prod 301 `/de/consumer/*` → `/en/…`; Preview ×10 mit 200).

## 3. Findings

| #   | Sev    | Befund                                                                                                                                                                                                                                                                                                                                                                                                                                      | Beleg                                                                              | Fix-Vorschlag (nicht umgesetzt)                                                                                                                                                                                                                                                                                                                                                                                                                             |
| --- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1  | **P1** | Fehlende statische Dateien antworten **301 → `/de/<datei>` → 404** statt direkt 404. Nach Go-live trifft das jedes gehashte Prod-Asset: 8 von 30 auf Prod verwendeten Bild-/`og:image`-URLs (`/assets/igloo_front-*.webp`, `/assets/polarisdx_logo-*.webp`, `/og-consumer-{spray,mask,duo}.jpg` …) und den Prod-Flyer `/assets/igloo-pro-flyer-BPQZrocN.pdf`. Kette + falsche Semantik (Google Images, Social-Caches, externe Flyer-Links). | `prod-images-on-preview.json`; `curl -I :9100/assets/x.js` → 301 `/de/assets/x.js` | `server.ts:466-470`: im SSR-Fallback ohne Locale vor dem Redirect `if (isStaticAsset(pathname)) return res.status(404).type('text/plain').send('Not found')`; alternativ eigene Middleware direkt nach den `express.static`-Blöcken (`server.ts:315-337`). Zusätzlich entscheiden: `/assets/igloo-pro-flyer-*.pdf` → 301 `/downloads/igloo-pro-flyer.pdf` (existiert, 200) und `og-consumer-*.jpg` in `public/` behalten oder auf aktuelle OG-Bilder 301en. |
| F2  | **P1** | `/downloads/epigenetics/PolarisDX_Musterbefunde_DE.zip` war auf Prod öffentlich (200, von allen 10 `/xx/epigenetics`-Seiten verlinkt) und ist auf Preview **404** (Datei bewusst nach `PROTECTED` verschoben, `resourceInventory.ts:790`, `RESOURCES-CONTRACT.md:102`). Für die alte öffentliche URL fehlt eine Redirect-/Gone-Entscheidung.                                                                                                | `prod.json` downloads; HEAD :9100 → 404                                            | Owner-Entscheidung: 301 → `/de/epigenetics/unterlagen` (Gate-Seite) oder bewusst 404 und in `INTENTIONAL_404_PATHS` dokumentieren. Hinweis: `epigenetics.json` (alle Locales, Z. 486) trägt den ZIP-Namen noch als `downloads.zipFile`.                                                                                                                                                                                                                     |
| F3  | **P1** | Titel/H1/Description auf 323/268/333 von 403 URLs geändert, darunter wahrscheinliche Top-Landingpages (z. B. `/de/diagnostics/dental`: „Blutdiagnostik Zahnarztpraxis: Chairside Testing Igloo Pro“ → „Dentaldiagnostik für Zahnarztpraxen“; `/de/igloo-pro` verliert „Spezifikationen & Technik“). Ohne Search-Console-Baseline nicht bewertbar.                                                                                           | `compare-prod-preview.csv`, Anhang A                                               | **Owner-gebunden:** GSC-Export (Top-Queries je Landingpage) gegen Anhang A legen; Keyword-tragende alte Titelbestandteile ggf. zurückführen.                                                                                                                                                                                                                                                                                                                |
| F4  | P2     | Trailing-Slash-Duplikate: `/xx/<pfad>/` antwortet 200 mit **selbstreferenzierendem** Canonical und hreflang **mit** Slash (84 geprüfte Varianten). Intern nicht verlinkt, aber jede externe Slash-Verlinkung erzeugt eine zweite indexierbare URL. Auf Prod identisch (kein Regress).                                                                                                                                                       | `probe-preview.json` (`/de/about/` → canonical `…/de/about/`)                      | `src/components/seo/seoRouteSource.ts:23-26` (`normalizedPath`) Trailing Slash außer Root entfernen (wie `normalizeRoutePath`), **oder** in `server.ts:434` vor `return next()` bei bekanntem Pfad mit Slash 301 auf die slashlose Form (ein Hop).                                                                                                                                                                                                          |
| F5  | P2     | Header-Logo und Footer verlinken `/xx` ohne Slash (41 Links je Locale); `/xx` liefert 200 mit Canonical `/xx/`. Intern damit massenhaft nicht-kanonische Linkziele.                                                                                                                                                                                                                                                                         | `preview.json` internal_unique                                                     | Home-Links auf `/${lang}/` erzeugen oder `server.ts:434` `/xx` → 301 `/xx/`.                                                                                                                                                                                                                                                                                                                                                                                |
| F6  | P2     | `/index.html` wird von `express.static` als rohes SPA-Template ausgeliefert: 200, `index, follow`, alter Default-Titel „IglooPro POC-Reader \| Point-of-Care Diagnostik“, Canonical `https://polarisdx.net/` (selbst ein 301).                                                                                                                                                                                                              | Probe `/index.html`                                                                | `server.ts:326-337`: vor `express.static` `app.get('/index.html', (_q, r) => r.redirect(301, '/de/'))` oder 404.                                                                                                                                                                                                                                                                                                                                            |
| F7  | P2     | `/blog/vitamin-d3-implantologie` war auf Prod intern verlinkt (von `/xx/diagnostics/dental`, Soft-404) und ist auf Preview 404 — ohne Eintrag in Redirect- oder 404-Tabelle.                                                                                                                                                                                                                                                                | `probe-preview.json`                                                               | Entscheidung: `PRIMARY_ALIAS` `/blog/vitamin-d3-implantologie` → `/vitamin-d3-implantologie` in `src/routing/legacyRedirects.ts:22-29` (Intention eindeutig) oder in `INTENTIONAL_404_PATHS` (`:79-89`) aufnehmen.                                                                                                                                                                                                                                          |
| F8  | P2     | Meta-Descriptions > 160 Zeichen auf 142 von 410 indexierbaren Preview-URLs; 20 Titel > 70 Zeichen (v. a. Legal und Nicht-DE). PL-`/igloo-pro`-Titel ist englisch („IglooPro Point-of-Care Reader“, identisch mit EN); `/de/support`-Titel nur „Support-Anfrage“.                                                                                                                                                                            | `preview.json`                                                                     | Content-Pass in AP29.4 bzw. Übersetzungs-Freeze; Längenregel ggf. in `scripts/check-meta-descriptions.mjs` aufnehmen.                                                                                                                                                                                                                                                                                                                                       |
| F9  | P2     | Consumer-`og:image` zeigt auf gehashte `/assets/…-<hash>.jpeg`; jeder Build ändert die URL, alte Social-Caches laufen in F1.                                                                                                                                                                                                                                                                                                                | Preview-HTML Consumer-Seiten                                                       | Stabile OG-Dateien unter `public/` (wie `og-image.jpg`, `og-vitd3-spray.jpg`).                                                                                                                                                                                                                                                                                                                                                                              |
| F10 | P2     | `alt=""` stieg von 20 auf 770 (Teaser-/Kartenbilder in Links mit Text, Testimonial-Foto, Hero). A11y-konform, aber ohne Bild-SEO-Wert für Produktfotos.                                                                                                                                                                                                                                                                                     | Stichprobe `/de/`                                                                  | Bewusst so lassen oder für Produkt-/Gerätebilder auf IglooPro-/Diagnostik-Seiten sprechende Alts setzen (A11y-Owner).                                                                                                                                                                                                                                                                                                                                       |

**P0: keine.** Kein Preview-/localhost-Host in Canonical, `og:url`, hreflang, Sitemap oder HTML; keine
versehentlichen `noindex`; keine Redirect-Ketten/-Loops bei Seiten-URLs; keine Massenredirects auf Home.

## 4. Redirect-Map (Entwurf, gemessen auf Preview)

Alle Pfade gelten je Locale-Family (`/<locale>` bleibt erhalten, unpräfixiert → `de`), Query bleibt
erhalten (geprüft: `/agb?utm_source=x` → `/de/terms?utm_source=x`). Vollständig je Variante:
`redirect-map-preview.csv`.

| Alt (ohne Locale)                                                                                                                                      | Neu                                               | Prod heute                    | Preview gemessen              | Entscheidung                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- | ----------------------------- | ----------------------------- | -------------------------------------------------------------- |
| `/services`                                                                                                                                            | `/diagnostics`                                    | 200 (präfixiert)              | 301 → 200, 1 Hop, ×11         | REDIRECT_301 ✔                                                 |
| `/services/<9 IDs>`                                                                                                                                    | `/diagnostics/<id>`                               | 200, Canonical Home           | 301 → 200, 1 Hop, 99/99       | REDIRECT_301 ✔                                                 |
| `/services/<6 Underscore-Keys>`, `/diagnostics/<6 Underscore-Keys>`                                                                                    | `/diagnostics/<id mit Bindestrich>`               | 200 (Soft)                    | 301 → 200, 1 Hop, 132/132     | REDIRECT_301 ✔                                                 |
| `/articles/<6 alte IDs>`                                                                                                                               | `/articles/<slug>`                                | 200 (Soft)                    | 301 → 200, 1 Hop, 66/66       | REDIRECT_301 ✔                                                 |
| `/agb`                                                                                                                                                 | `/terms`                                          | 200 (Soft)                    | 301 → 200, 1 Hop, ×11         | REDIRECT_301 ✔                                                 |
| `/s3-leitlinie`                                                                                                                                        | `/s3_leitlinie`                                   | 200 (Soft)                    | 301 → 200, 1 Hop, ×11         | REDIRECT_301 ✔                                                 |
| jede kanonische Seite ohne Locale (43)                                                                                                                 | `/de/<pfad>`                                      | 301 → 200                     | 301 → 200, 1 Hop              | REDIRECT_301 ✔ (`/` → `/de/` = Home, begründet)                |
| `/contact` (Prod-interner Link)                                                                                                                        | `/de/contact`                                     | 301 → 200                     | 301 → 200, 1 Hop              | ✔, intern nicht mehr verlinkt                                  |
| `/articles/{first_checkup,managing_diabetes,home_care}`, `/consumer`, `/shop`, `/casestudys/32reasons`, `/case-studies/32reasons`, `/deal`, `/voucher` | —                                                 | 200 Soft-404                  | 404 direkt, 99/99             | GONE_OR_404_INTENTIONAL ✔                                      |
| `/blog/vitamin-d3-implantologie`                                                                                                                       | `/vitamin-d3-implantologie` (Vorschlag)           | 200 Soft-404, intern verlinkt | 404 direkt                    | **offen** (F7)                                                 |
| `/downloads/epigenetics/PolarisDX_Musterbefunde_DE.zip`                                                                                                | `/de/epigenetics/unterlagen` (Vorschlag) oder 404 | 200 (Datei)                   | 404                           | **offen** (F2)                                                 |
| `/assets/igloo-pro-flyer-BPQZrocN.pdf`                                                                                                                 | `/downloads/igloo-pro-flyer.pdf` (Vorschlag)      | 200 (Datei)                   | 301 → 404 (Kette)             | **offen** (F1)                                                 |
| alte gehashte `/assets/*`, `/og-consumer-*.jpg`                                                                                                        | 404 direkt (oder stabile Datei)                   | 200                           | 301 → 404 (Kette)             | **offen** (F1)                                                 |
| `/xx/<pfad>/` (Trailing Slash)                                                                                                                         | `/xx/<pfad>`                                      | 200, Self-Canonical mit Slash | 200, Self-Canonical mit Slash | **offen** (F4)                                                 |
| `/xx` (ohne Slash)                                                                                                                                     | `/xx/`                                            | 200, Canonical `/xx/`         | 200, Canonical `/xx/`         | akzeptabel, Empfehlung 301 (F5)                                |
| `/index.html`                                                                                                                                          | `/de/`                                            | 200 Roh-Template              | 200 Roh-Template              | **offen** (F6)                                                 |
| Heuristik (`/impressum`, `/datenschutz`, `/kontakt`, `/ueber-uns`, `/blog`, `/news`, `/products`, `/igloo`, `/epigenetik`, `/vitamin-d3`, `/home` …)   | —                                                 | 301 → 200 Soft-404            | 404 direkt                    | ohne Repo-Evidenz; erst bei GSC-/Backlink-Treffern entscheiden |

Registry-Redirects: **330/330** Varianten korrekt (genau ein 301, Ziel = Registry-Ziel, Ziel 200,
kein Homepage-Ziel). Ketten 0, Loops 0, Homepage-Sammelredirects 0.

## 5. Sitemap & Robots (PT29.3, Preview)

| Prüfpunkt                 | Ergebnis                                                                                                                                                  |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host                      | ausschließlich `https://polarisdx.net` (Loc und `xhtml:link`) ✔                                                                                           |
| Abgleich Route Registry   | 390 = `getSitemapEligibleRouteEntries()` (39) × 10 Locales; fehlend 0, zusätzlich 0, doppelt 0 ✔                                                          |
| Ziel-Qualität             | alle 390: HTTP 200 direkt, `index, follow`, Canonical = `<loc>`, hreflang Sitemap = hreflang Seite ✔                                                      |
| Bewusste Ausschlüsse      | `/privacy`, `/imprint`, `/terms` (`noindex, nofollow`), `/support` (indexierbar, bewusst nicht in Sitemap) ✔                                              |
| Gegenüber Prod            | −30 Legal (Prod: `noindex` in Sitemap = Widerspruch), +30 Consumer (DE/PL/…), +10 `/vitamin-d3-spray` ✔                                                   |
| `lastmod`                 | 60 Artikel-URLs mit echten Publikationsdaten (2025-11-25 … 2025-12-02), 330 ohne `lastmod`; kein Fake-Datum ✔                                             |
| robots.txt                | `Allow: /`, `/assets/`, `/locales/`; nur `Disallow: /api`; alle bisherigen Such-/Social-/AI-Bots erhalten; `Sitemap: https://polarisdx.net/sitemap.xml` ✔ |
| Prod-Assets crawlbar      | `/assets/`, `/locales/`, `/downloads/*` erlaubt (Prod sperrte `/locales/` und `*.json`) ✔                                                                 |
| versehentliches `noindex` | 0 (meta und `X-Robots-Tag` auf :9100) ✔                                                                                                                   |
| Preview-Host öffentlich   | `https://preview.polarisdx.net` sendet `X-Robots-Tag: noindex, nofollow` (Proxy) ✔                                                                        |

## 6. Owner-gebundene offene Punkte

1. **Search Console (Owner):** Top-Landingpages, Top-Queries und Indexierungsbericht der Property
   `polarisdx.net` exportieren — nötig für F3 und um zu bestätigen, dass keine weitere Alt-URL
   (`DEFERRED_MIGRATION_DISCOVERY`, ROUTING-CONTRACT §2.2) Traffic hat. **Nicht verfügbar, owner-gebunden.**
2. **Backlinks (Owner):** externer Backlink-Export (GSC „Links“ oder Tool) — prüfen, ob Heuristik-Pfade,
   Trailing-Slash-Varianten, Flyer-/ZIP-URLs extern verlinkt sind. **Nicht verfügbar, owner-gebunden.**
3. Entscheidungen F2 (Musterbefunde-ZIP), F7 (`/blog/vitamin-d3-implantologie`), F1 (Flyer/OG-Altbilder).
4. Search-Console-Einreichung vorbereiten: nach Cutover `https://polarisdx.net/sitemap.xml` einreichen,
   URL-Prüfung für `/de/`, `/de/igloo-pro`, `/de/diagnostics/dental`.
5. **Launch-Gate:** Der `X-Robots-Tag: noindex, nofollow` des Preview-Proxys darf nicht in die
   Produktions-Proxy-Konfiguration übernommen werden; nach Cutover `curl -I https://polarisdx.net/de/` prüfen.
6. Nach Umsetzung von F1/F4–F7 diesen Crawl mit denselben Skripten wiederholen (Delta = 0 erwartet).

## Anhang A — DE-Titel alt → neu (geänderte Seiten)

| Family                                                                    | Prod (alt)                                                                     | Preview (neu)                                              |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| `/`                                                                       | IglooPro POC-Reader: Laborwerte in 3 Minuten                                   | Point-of-Care-Diagnostik für Praxen                        |
| `/articles/der-unsichtbare-patient`                                       | IglooPro POC-Reader / Point-of-Care Diagnostik (Fallback)                      | Der unsichtbare Patient: Remote-Monitoring                 |
| `/articles/die-5-minuten-diagnose`                                        | IglooPro POC-Reader / Point-of-Care Diagnostik (Fallback)                      | Die 5-Minuten-Diagnose: POC rechnet sich                   |
| `/articles/die-gruene-praxis`                                             | IglooPro POC-Reader / Point-of-Care Diagnostik (Fallback)                      | Grüne Praxis: Nachhaltigkeit im Wartezimmer                |
| `/articles/die-performance-formel-effizienz-in-der-poc-diagnostik`        | IglooPro POC-Reader / Point-of-Care Diagnostik (Fallback)                      | Die Performance-Formel für POC-Diagnostik                  |
| `/articles/precision-in-point-of-care-the-key-to-patient-safety`          | IglooPro POC-Reader / Point-of-Care Diagnostik (Fallback)                      | Präzision im Point-of-Care: Patientensicherheit            |
| `/articles/the-ecosystem-of-rapid-tests-why-compatibility-creates-safety` | IglooPro POC-Reader / Point-of-Care Diagnostik (Fallback)                      | Schnelltests: Kompatibilität schafft Sicherheit            |
| `/contact`                                                                | Kontakt & Angebot zum IglooPro anfordern                                       | Kontakt & Demo-Termin zum IglooPro vereinbaren             |
| `/diagnostics`                                                            | POC-Diagnostik für Praxen: Dental, Beauty, Longevity                           | Point-of-Care-Diagnostik und Diagnostiklösungen für Praxen |
| `/diagnostics/beauty`                                                     | Beauty-Diagnostik: Biomarker für Ästhetische Medizin                           | Beauty-Diagnostik für Praxen und Ästhetik                  |
| `/diagnostics/dental`                                                     | Blutdiagnostik Zahnarztpraxis: Chairside Testing Igloo Pro                     | Dentaldiagnostik für Zahnarztpraxen                        |
| `/diagnostics/hormon-tests`                                               | Hormon- & Endokrinologie-Tests: Spezialdiagnostik leicht gemacht               | Hormon-Tests im professionellen Versorgungskontext         |
| `/diagnostics/infektion-entzuendung`                                      | Infektion & Entzündungsmarker: Schnelle Antworten in kritischen Fällen         | Infektions- und Entzündungsmarker im Versorgungskontext    |
| `/diagnostics/kompatibilitaet-integration`                                | Herstellerübergreifende Kompatibilität: Investitionssicherheit durch Offenheit | Kompatibilität & Integration für POC-Workflows             |
| `/diagnostics/longevity`                                                  | Longevity-Diagnostik: Präventive Biomarker-Analyse                             | Longevity-Diagnostik und Biomarker-Monitoring              |
| `/diagnostics/poc-systemloesungen`                                        | POCT-Systemlösungen für Praxen & Kliniken                                      | POC-Systemlösungen für Praxis und Versorgung               |
| `/diagnostics/praeventions-checks`                                        | Präventive Gesundheits-Checks: Vorsorge neu gedacht                            | Präventions-Checks und diagnostische Orientierung          |
| `/diagnostics/stoffwechsel-herz`                                          | Stoffwechsel & Herzgesundheit: Chronische Überwachung auf Knopfdruck           | Stoffwechsel- und Herzmarker im Versorgungskontext         |
| `/downloads`                                                              | Downloads: IglooPro Datenblätter & Produktflyer                                | Downloads: Infoblätter, Musterbefunde und Produktflyer     |
| `/igloo-pro`                                                              | IglooPro POC-Reader: Spezifikationen & Technik                                 | IglooPro Point-of-Care-Reader                              |
| `/support`                                                                | Support für Igloo Reader & POC-Testkits                                        | Support-Anfrage                                            |

Alle Titel tragen zusätzlich das Suffix „| PolarisDX“. Epigenetik-, S3- und Implantologie-Titel sind
auf DE unverändert (Änderungen nur in Nicht-DE-Locales).
