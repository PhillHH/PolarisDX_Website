# Entwicklerdokumentation (PT33.1)

Überblick über die zehn Bereiche aus MASTER-SCOPE AP33/PT33.1. Je Bereich: wie es funktioniert,
welche Dateien die Wahrheit tragen, welcher Contract gilt. Details stehen im Contract — hier wird
nichts neu festgelegt.

## 1. Architektur

```text
Browser ─► Host-nginx (TLS, HSTS) ─► Web-Container :3000  server.ts (Express 5, tsx)
                                        ├─ /sitemap.xml        generateSitemapXml()
                                        ├─ /api/*  ── Proxy ─► Backend-Container :5000  server/server.js
                                        ├─ Redirect-Middleware (Locale-Präfix, Legacy-301)
                                        └─ SSR-Handler /{*path} ─► entry-server.tsx render(url, lang)
```

| Schicht       | Datei                                                           | Aufgabe                                                                                                                                                                       |
| ------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTTP/SSR      | `server.ts`                                                     | Security-Header, CSP (`buildContentSecurityPolicy`, Modus über `POLARIS_CSP_MODE`), Sitemap, `/api`-Proxy (`BACKEND_URL`), 301-Logik, SSR, 404-Handshake, `no-store` für HTML |
| Server-Render | `src/entry-server.tsx`                                          | `render(url, lang)`: `StaticRouter` + `HelmetProvider` + `I18nextProvider`, liefert HTML, Helmet-Head, SSR-i18n-Zustand                                                       |
| Hydration     | `src/entry-client.tsx`                                          | wartet auf `i18n.init()`, dann `hydrateRoot()`                                                                                                                                |
| App/Routen    | `src/App.tsx`                                                   | bindet Registry-Routen an Komponenten; alle Seiten außer Home per `React.lazy`; B2B-Shell vs. Consumer-Shell                                                                  |
| Fehlergrenzen | `src/routing/RootErrorBoundary.tsx`, `SegmentErrorBoundary.tsx` | Laufzeitfehler ≠ 404 (RUNTIME-CONTRACT)                                                                                                                                       |

Modi von `server.ts`: ohne `NODE_ENV=production` Vite-Middleware (`ssrLoadModule`, HMR); mit
`NODE_ENV=production` werden `dist/client/index.html` und `dist/server/entry-server.js` geladen
(überschreibbar mit `POLARIS_CLIENT_DIST_DIR` / `POLARIS_SERVER_DIST_DIR`), beim Start wärmt
`warmUpSsrRoutes` die Lazy-Routen vor. `LISTEN_HOST` (Standard `127.0.0.1`, im Image `0.0.0.0`).

Build: `npm run build` = `check:befunde` → `build:client` (`dist/client`) → `build:server`
(`dist/server`). Code-Splitting und `assetsInlineLimit` in `vite.config.ts`.
**Contract:** `RUNTIME-CONTRACT.md`.

## 2. Routing

- **Single Source of Truth:** `src/routing/routeRegistry.ts`. `STATIC_ROUTE_DEFINITIONS` (22 Familien)
  und `DYNAMIC_ROUTE_DEFINITIONS` (`service-detail` `/diagnostics/:slug`, `article-detail`
  `/articles/:slug`, `report-detail` `/epigenetics/musterbefund/:slug`). Dynamische Slugs kommen aus
  `src/data/services.tsx`, `src/data/articles.ts`, `src/content/befunde/meta.ts`
  (`getDynamicSourceRecords`).
- Je Route: `routeType`, `localeBehavior` (`LOCALIZED_X10`), `indexability`
  (`INDEX_FOLLOW`/`NOINDEX_NOFOLLOW`), `sitemap` (Policy oder `false`), `searchEligible`, `shell`.
- **Konsumenten leiten ab:** `server.ts` (`isKnownCanonicalPath`, `getRegistryRedirectTarget`),
  `App.tsx` (`getStaticAppRoutes`, `getDynamicAppRoutes`, `getBefundRouteEntries`,
  `getArticleRouteEntries`), Sitemap (`getSitemapEligibleRouteEntries`), Suche
  (`getSearchEligibleRouteEntries` in `src/hooks/useSearch.ts`), Tests (`getRouteTestMatrix()` in
  `e2e/url-smoke.spec.ts`).
- **HTTP-Semantik:** URL ohne Präfix → 301 auf `/de/…` (nur bekannte Pfade); Legacy-Pfade in einem
  Hop auf das Ziel unter Beibehaltung von Locale und Query; unbekannte Pfade → echte 404 (die App
  setzt per `SEOHead notFound` `<meta name="prerender-status-code" content="404">`, `server.ts`
  liest den `NOT_FOUND_MARKER`); fehlende Dateien → 404 ohne Präfix-Umweg.
- **Redirects:** `src/routing/legacyRedirects.ts` (`LEGACY_REDIRECT_MIGRATIONS`: Aliase,
  stillgelegte Seiten, alte Artikel-IDs, alte Service-Keys; `INTENTIONAL_404_PATHS`),
  `/services*` → `/diagnostics*` in `getRedirectRegistryEntries`, Datei-Redirects in `server.ts`
  (`LEGACY_FILE_REDIRECTS`).
- **Guard G1:** `npm run check:routes` (`scripts/check-route-registry.ts`) — Parität App ↔ Registry ↔
  Server ↔ Sitemap ↔ Suche ↔ SEOHead, Redirect-Ziele kanonisch, keine Handspiegel, Header/Footer-Ziele
  gültig (`check:nav-targets` = `--nav-only`). HTTP-Matrix: `npm run check:http-status`.

**Contract:** `ROUTING-CONTRACT.md` (M-01…M-08), Inventar `IA-INVENTORY.md`.

## 3. Internationalisierung

- `src/i18n.ts`: `SUPPORTED_LANGUAGES` (10), `DEFAULT_LANGUAGE` `de`, `FALLBACK_LANGUAGE` `en`
  (nur technischer Notfall), `PRODUCTIVE_NAMESPACES` (15), `BACKLOG_NAMESPACES` `casestudies`, `shop`
  (nicht laden). Keine Browser-/Node-APIs in dieser Datei — Client **und** Server importieren sie.
- Server: `src/i18n.server.ts` (`createI18nInstance`), liest in Produktion `dist/client/locales`
  (Locale-Änderungen erst nach Build sichtbar, I18N M-06). Client: `src/i18n.client.ts`
  (`/locales/{{lng}}/{{ns}}.json`). SSR übergibt die gerenderten Namespaces per
  `SSR_I18N_STATE_ID`-Block.
- Sprachumschalter `src/components/ui/LanguageSwitcher.tsx`, defensiver Hinweis
  `LanguageFallbackNotice.tsx` (kein Ersatz für Übersetzung), Formatierung `src/lib/localeFormat.ts`.
- Systemmails x10: `server/system-i18n.js`. Musterbefund-Inhalte liegen **außerhalb** der Namespaces
  in `src/content/befunde/<slug>.<lang>.json`, Artikeltexte in `src/content/articles/<slug>.json`.
- **Guard G4:** `npm run check:i18n` — Namespace-Klassifikation, Key-Parität gegen die
  Schemareferenz je Namespace, leere Werte, Platzhalter (`TODO`, `Lorem ipsum`), sichtbare Keys,
  Interpolation, EN-/DE-Kopien, alle expliziten `t('ns:key')`-Aufrufe in `src/**` in 10 Sprachen.
  Zusätzlich `npm run check:shell-i18n` (Header/Footer/SkipLink/LanguageSwitcher in allen
  `common.json`, echte Übersetzung statt EN-Kopie). `npm run check:i18n:contract` schreibt die
  Evidenz in `I18N-CONTRACT.md`.

**Contract:** `I18N-CONTRACT.md` (Namespace-Eigentum M-01, Verbote §9). Locks `DEC-RL-001`, `REST-03`.

## 4. SEO

| Thema           | Umsetzung                                                                                                                                                                                                                                    |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Meta-Ausgabe    | **nur** `src/components/seo/SEOHead.tsx` (Props `title`, `description`, `indexability`/`noindex`, `notFound`, `ogImage`, `structuredData`, …); Suffix `\| PolarisDX`                                                                         |
| Canonical       | absolut auf `https://polarisdx.net` (`PUBLIC_SEO_ORIGIN` in `seoRouteSource.ts`), aktuelle Locale, gematchter Pfad; 404/Redirect ohne Canonical                                                                                              |
| hreflang        | 10 Sprachen + `x-default=de` auf indexierbaren Seiten; `noindex` ohne Alternates                                                                                                                                                             |
| Indexierbarkeit | aus der Registry; `SEOHead` bricht hart, wenn die Seite der Registry-Policy widerspricht (`resolveCanonicalRoute(path)`)                                                                                                                     |
| Sitemap         | `src/components/seo/sitemap.ts` → `/sitemap.xml` (dynamisch in `server.ts`); `lastmod` nur aus echtem `datePublished` der Artikel, sonst keins                                                                                               |
| robots          | `public/robots.txt` (statisch, `Disallow: /api`); Preview zusätzlich `X-Robots-Tag` am Host-nginx                                                                                                                                            |
| Structured Data | Helfer in `src/components/seo/structuredData.ts` (`createServiceSchema`, `createArticleSchema`, `createBreadcrumbSchema`, `createFAQSchema`, `createProductSchema`, `validateStructuredData`); kein Medical-/Offer-/Review-Schema ohne Beleg |

**Guards:** `npm run check:seo` (`check-meta-descriptions.mjs` + `check-seo.ts`, G3-Sitemap-Vertrag
`sitemapGuard.ts`), `npm run check:befunde-seo`, Regression `npm run test:seo:regression`.
**Contract:** `SEO-CONTRACT.md`.

## 5. Content-Datenmodelle

| Inhalt            | Stammdaten (Code)                                                                                                                        | Texte                                                                               | Contract                     |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------- |
| Services (9)      | `src/data/services.tsx` (`ServiceId` in `src/types/models.ts`), Projektion `src/data/serviceDetail.ts`, Hub `src/data/diagnosticsHub.ts` | `services:<translationKey>.*`                                                       | `SERVICE-DETAIL-CONTRACT.md` |
| Artikel (6)       | `src/data/articles.ts` (`articleInventory`, Status `PUBLISHED_LAUNCH`/`DRAFT_OR_NON_PUBLIC`; öffentlich nur `articles`)                  | Meta `articles:<id>.*`, Body `src/content/articles/<slug>.json` (Modell `model.ts`) | `ARTICLES-CONTRACT.md`       |
| Events            | `src/data/events.ts` (`validateEventInventory` bricht beim Import)                                                                       | `events:items.<id>`, `events:past_items.<id>`                                       | `EVENTS-CONTRACT.md`         |
| Musterbefunde (6) | `src/content/befunde/meta.ts` (`BEFUND_ORDER`), Modell/Validierung `model.ts`                                                            | `src/content/befunde/<slug>.<lang>.json` (60 Dateien)                               | `BEFUNDE-CONTRACT.md`        |
| Downloads         | `src/content/resources/resourceInventory.ts` (Asset-ID `rsc-<domain>-<nnn>`, Bytes/SHA-256/Seiten gemessen)                              | Label-Keys in den Namespaces                                                        | `RESOURCES-CONTRACT.md`      |
| Consumer (3)      | `src/content/consumer/products.ts`, Bilder `images.ts`                                                                                   | `consumer.json`                                                                     | `CONSUMER-CONTRACT.md`       |

Abgeleitet, nie von Hand pflegen: `server/resource-registry.json` (`npm run build:resource-registry`).
Schichtenmodell Code ↔ i18n ↔ Content-JSON ↔ Assets: `CONTENT-ASSET-CONTRACT.md`; Status je Inhalt:
`CONTENT-MATRIX.md`. Inhaltliche Aussagen hängen am Claim-Register (`HOMEPAGE-CONTRACT.md` §9,
`HCL-*`) und an den Claim-Guards (`npm run check:claims`, u. a. `CV < 2 %`).

## 6. Komponenten und Design-System

- **Token-Wahrheit:** `tailwind.config.js`; erlaubte Hexwerte `PALETTE_HEX` in
  `scripts/check-color-tokens.mjs`; Typo-/Basisschicht `src/index.css` (`.t-*`-Rollen).
  Eine Navy `#083358` (`brand.navy`/`heading`), ein Akzent im Logo-Blauspektrum (`accent.DEFAULT`
  `#1b67b1`, `accent.strong` für Text auf hell, `accent.on-dark` auf Navy, `accent.line` nur Dekor),
  Papierfläche `paper`.
- **AP34 „Editorial“ (SC-002/SC-003):** Navy-Kopfzeile mit weißem Logo, ein art-directed Foto je
  Bühne als einziges `fetchpriority="high"`-Bild, weiße Pille (`Button variant="light"`) auf Navy.
  Bühnen: `HeroSection` (Start), `DiagnosticsHero`/`IglooProHero` (Navy), `AreaStage` + `StageFacts`
  (Epigenetik, ohne Bild), `SubpageHero` (Unterseiten), `.legal-hero`.
- **Bausteine:** `src/components/ui/` (Core: `Button`, `Card`, `FormField`, `Input`, `Dialog`, `Alert`,
  `StateBlock`, … — Liste `OWNED` im DS-Changelog-Gate), Layout `src/components/layout/` (`Header`,
  `Footer`, `Section`, `SkipLink`), Sektionen `src/components/sections/`, Führungssystem
  `src/components/area/` (`AreaNav`, `JourneySteps`, `PageToc` + `tocSpy.ts`, `NextSteps`,
  `MobileActionBar`), Kapitelnavigation `src/components/ui/ChapterNav.tsx` (Musterbefunde),
  Service-Template `src/components/service-detail/`, Befund-Blöcke `src/components/befund/`.
- Bilder über `ResponsivePicture` (AVIF-`<source>` + WebP-`<img>`, Option `lean`).
- **Guards:** `npm run check:colors` (Raw-Hex, Arbitrary-Farbklassen, `gray-900`, rohe
  Tailwind-Farbskalen, `rgb()`-Literale), `npm run check:ds-changelog` (Token-Pfade, `.t-*`-Rollen und
  Exporte müssen in den `SURFACE`-Blöcken von `building-docs/DESIGN-SYSTEM-CHANGELOG.md` stehen).

**Contract:** `DESIGN-SYSTEM-CONTRACT.md` (§3 Tokens, §6.3 Bühnen, §6.5 Führungssystem, §10 Guard),
`ACCESSIBILITY-CONTRACT.md`, `work-packages/AP34.md`.

## 7. Lead-Plattform, CRM, Queue, DRY_RUN

| Journey (`JOURNEY_REGISTRY`) | Endpunkt                                                                  | CRM-Ziel         |
| ---------------------------- | ------------------------------------------------------------------------- | ---------------- |
| `contact`                    | `POST /api/contact`                                                       | `general-sales`  |
| `support`                    | `POST /api/support`                                                       | `support`        |
| `consumer_order`             | `POST /api/consumer-order`                                                | `consumer`       |
| `roi_report`                 | `POST /api/roi-report`                                                    | `reports`        |
| `practice_order`             | `POST /api/practice-order`                                                | `practice-sales` |
| `epigenetics_inquiry`        | `POST /api/epigenetics-inquiry`                                           | `epigenetics`    |
| `content_download`           | `POST /api/content-download` + `GET /api/content-download/asset/:assetId` | `resources`      |

Weitere Route: `GET /api/health` (Datenbank lesbar, ohne Nebenwirkung). `/api/chat` existiert nicht
(`DEC-RL-007`).

- **Ablauf:** validieren → **persistieren** (SQLite, `server/lead-foundation/repository.js`) →
  Outbox-Aufträge je Kanal → Antwort `accepted` → `LeadDispatcher` (`dispatcher.js`) /
  `LeadHandoffWorker` (`worker.js`) stellen mit Timeout, Retry/Backoff (`retry-policy.js`) und
  Dead Letter zu. Jede Schreibroute hat Rate Limit (`formLimiter`), Idempotenz-Schlüssel
  (`IDEMPOTENCY_KEY_REQUIRED`) und Honeypot `_hp`. Client-Module: `src/api/*.ts`.
- **CRM:** anbieterneutraler Port, `CrmRouter` wählt das Ziel nur aus der gespeicherten Journey.
  Heute ist **kein CRM-Anbieter angebunden** (`NoProviderConfiguredCrmAdapter`); Zustellung ans Team
  läuft per Mail (SendGrid). Anbieterwahl ist Owner-Entscheidung (`CRM-INTEGRATION.md`).
- **DRY_RUN:** `server/lead-foundation/environment.js` (`resolveDeliveryMode`). `APP_ENV=preview`
  oder `staging` erzwingt den Trockenlauf, `DRY_RUN=0` hebt das **nicht** auf; `DRY_RUN=1` schaltet
  ihn sonst ein. `describeRuntimeIsolation` meldet Fehlbetrieb im Log (`[runtime-isolation]`).
- **Daten:** Migrationen additiv in `server/lead-foundation/migrations/` (`npm --prefix server run
migrate:leads`); Pfad `LEAD_DB_PATH` (in Produktion Pflicht); Anhänge `SUPPORT_UPLOAD_DIR`;
  geschützte Downloads `storage/protected/` (`POLARIS_PROTECTED_ASSET_DIR`).
- **Betrieb:** `npm run lead:ops -- <befehl>` bzw. `node scripts/lead-ops.mjs <befehl>` — `metrics`,
  `dead-letters`, `reconciliation`, `requeue`, `alerts`, `isolation`, `retention-policy`,
  `retention [--apply]`, `dsar-lookup|dsar-export|dsar-erase`, `legal-hold`, `backup`.

**Contracts:** `BACKEND-API-CONTRACT.md`, `LEAD-DATA-CONTRACT.md`, `LEAD-DELIVERY-CONTRACT.md`,
`CRM-INTEGRATION.md`, `SECURITY-CONTRACT.md`.

## 8. Consent und Tracking

- **Basic Mode:** Vor einer Einwilligung wird **kein** Google-Skript geladen, kein `dataLayer`,
  kein Request (`CONSENT-TRACKING-CONTRACT.md` §1). `index.html` enthält kein GTM.
- Einwilligung: `src/components/ui/CookieBanner.tsx` → `src/lib/consentState.ts` (`localStorage`
  `cookie-consent`, Version 2, Kategorien `necessary`/`analytics`/`marketing`, Widerruf löscht) →
  `src/lib/googleConsent.ts` (`applyGoogleConsent`: Consent Mode v2 `default` denied, dann `update`,
  Container genau einmal; `withdrawGoogleConsent`).
- **Eine Fassade:** Feature-Code ruft nur `track()` aus `src/lib/tracking.ts` (typisierte Union
  `TrackingEreignis`, Liste `TRACKING_EREIGNISSE`, Allowlist `pruefeEreignis`). `dataLayer`/`gtag`
  stehen ausschließlich in `src/lib/trackingProvider.ts`. Ohne Provider oder ohne Einwilligung ist
  `track` ein No-Op; Ereignisse vor der Einwilligung werden verworfen, nicht gepuffert.
  Konversionen hängen an persistiertem Zustand, nicht am Klick.
- **CTA-Marker:** `data-cta-intent` (z. B. `GENERAL_SALES`), `data-cta-source`, `data-cta-section`,
  `data-cta-journey`, `data-cta-role` kennzeichnen Anfrage-CTAs im DOM (geprüft in Komponententests,
  z. B. `HomeConversion.test.tsx`, `Header.test.tsx`). Die Lead-Herkunft reist als Query ins
  Kontaktformular (`?intent=quote&source=…&journey=…&section=…#kontaktformular`). Im Repo liest kein
  Code diese Attribute zum Messen — Messung läuft nur über `track()`. Consumer-Seiten tragen
  zusätzlich `data-gtm-event="consumer_cta_click"`.
- **GTM je Umgebung:** `src/lib/analyticsConfig.ts` (`resolveAnalyticsConfig`) liest
  `VITE_APP_ENV`, `VITE_GTM_CONTAINER_ID`, `VITE_GTM_CONTAINER_ID_PREVIEW`, `VITE_GA4_MEASUREMENT_ID`
  (zur **Bauzeit**). In `preview`/`staging` wird nur der Preview-Container geladen. Ohne Kennung lädt
  nichts. `docker-compose.yml` baut heute mit `VITE_APP_ENV=preview` und dem Preview-Container — ein
  eigener Produktionscontainer ist Owner-Punkt (`CTC-04`, `docs/deploy.md` §6).
- Technische Telemetrie strikt getrennt (`VITE_TELEMETRY_SCOPE`, Standard `NONE`).
- **Tests:** `npm run test:e2e:consent` (Pre-Consent 0 Requests, Reject, Widerruf, kein Nachsenden),
  `npm run security:test` (u. a. `analyticsIsolation.test.ts`, `trackingTaxonomy.test.ts`).

**Contracts:** `CONSENT-CONTRACT.md`, `TRACKING-CONTRACT.md`, `CONSENT-TRACKING-CONTRACT.md`,
`NETWORK-ALLOWLIST.md` (jede externe Origin auch in `src/security/contentSecurityPolicy.ts`).

## 9. Tests und Launch-Gates

| Stufe       | Befehl                                                                                                                                                                                                                                            | Hinweis                                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Statik      | `npm run typecheck`, `npm run lint`, `npm run format:check`                                                                                                                                                                                       | lefthook pre-commit: Prettier, ESLint, `tsc`, 6 Guards                                                                                |
| Guards      | `npm run test:guards` (colors, ds-changelog, shell-i18n, i18n `--self-test`, nav-targets, search-index, internal-findability, routes, seo)                                                                                                        | CI-Job `ap27-guards`                                                                                                                  |
| Content     | `npm run test:guards:content` (assets, epigenetics-resources, resource-inventory, resource-center, content-download, lead-magnets, consumer-images, article-images), `npm run check:claims`, `npm run check:befunde`, `npm run check:befunde-seo` |                                                                                                                                       |
| Unit/Komp.  | `npm test` bzw. `test:unit`, `test:component`, `test:server`                                                                                                                                                                                      | `server`-Projekt braucht `npm ci --prefix server`; bei `better-sqlite3 … self-register`: `npm --prefix server rebuild better-sqlite3` |
| Integration | `npm run test:integration`, `npm run test:integration:http`                                                                                                                                                                                       | keine echten Provider                                                                                                                 |
| E2E         | `npm run test:e2e:core`, `npm run test:e2e:consent`, `npm run test:seo:regression`, `npm run check:http-status`                                                                                                                                   | `check:http-status`/`test:e2e` nutzen `playwright.config.ts` und bauen nach `dist/`                                                   |
| A11y        | `npm run a11y:gate` (PT24.6), `npm run a11y:suite`                                                                                                                                                                                                | axe serious/critical = 0                                                                                                              |
| Visual      | `npm run test:visual:docker`                                                                                                                                                                                                                      | nur im Image `mcr.microsoft.com/playwright:v1.57.0-noble`                                                                             |
| Performance | `npm run perf:budget:build` → `npm run check:perf-budget` (Profil `ci`) / `check:perf-budget:lab`                                                                                                                                                 | Budgets `scripts/perf/budgets.json`                                                                                                   |
| Security    | `npm run security:audit`, `npm run security:secrets` (gitleaks in Docker), `npm run security:test`                                                                                                                                                | CI-Jobs `security`, `security-runtime`                                                                                                |

Unverhandelbar:

- **Budgets werden nie gelockert.** Änderung nur nach den Regeln aus `PERFORMANCE-CONTRACT.md` §29.3
  mit neuer, dokumentierter Kalibrierung; schlägt `lab` ohne Codeänderung fehl, wird zuerst die
  Kalibrierung verbreitert, nicht das Budget erhöht (§29.5).
- **Visual-Baselines** (`e2e/*-snapshots/*.png`): roter Lauf = Befund. Beabsichtigte Änderung nur im
  gepinnten Image neu aufnehmen, z. B.
  `docker run --rm --network host --user "$(id -u):$(id -g)" -e HOME=/tmp -e CI=true -v "$PWD":/work -w /work mcr.microsoft.com/playwright:v1.57.0-noble npx playwright test --config e2e/pt27.6-visual.config.ts --update-snapshots -g "<Zustand>"`,
  danach Lauf ohne Update grün, und im selben Change Eintrag in
  `building-docs/DESIGN-SYSTEM-CHANGELOG.md` (Ursache, Screenshots, Delta, Reviewer) — sonst bricht
  `npm run check:visual-changelog`. In CI nie `--update-snapshots` (`TESTING-CONTRACT.md` §22).
- `retries: 0`, keine Toleranz, kein `continue-on-error` auf harten Gates (`CI-CONTRACT.md`).
- Aggregat: CI-Job „AP27 Launch gate aggregate“; die zwölf Launch-Gates und ihr Stand stehen in
  `QUALITY-GATES.md` §12/§12.1.

## 10. Deployment, Backup, Rollback

Vollständig in **`docs/deploy.md`** (einziger produktiver Zielpfad, DEP-02). Kurzfassung:

| Schritt    | Befehl                                                        | Wirkung                                                                                         |
| ---------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Bauen      | `./deploy.sh build`                                           | Images aus sauberem Commit, Tag = Git-SHA (12 Zeichen), OCI-Label `revision`                    |
| Preview    | `./deploy.sh --env preview up <release>`                      | Projekt `polarisdx-preview`, Web `127.0.0.1:9100`, API `5100`, `APP_ENV=preview`                |
| Produktion | `./deploy.sh up <release>` (nur mit Owner-Go)                 | Backup + Restore-Test, `--no-build`, Health-Gate ≤ 180 s, Identität, Smoke, sonst Auto-Rollback |
| Status     | `./deploy.sh status`, `./deploy.sh logs`, `./deploy.sh smoke` | laufendes Release, Health, Historie `.deploy/<env>/releases`                                    |
| Rollback   | `./deploy.sh rollback [release]`                              | tauscht Images, kein `git checkout`; mindestens 3 Releases behalten                             |
| Sicherung  | `./deploy.sh backup`, `restore-test`, `restore <dir>`         | `VACUUM INTO` + Anhänge + Manifest, Aufbewahrung 14, Restore-Test Pflicht                       |

- Secrets nur in `server/.env` bzw. `server/.env.preview` (nicht versioniert), nie im Image.
- `VITE_*` wird zur Bauzeit eingebacken — „einmal bauen, befördern“ gilt, solange beide Umgebungen
  dasselbe Profil nutzen (`docs/deploy.md` §6).
- Schuldenstand und Nachweise: `DEPLOYMENT-CONTRACT.md` §6.2 (offen: DD-2, DD-13, DD-14, DD-17,
  externer Alarmweg, RPO/RTO-Bestätigung). Cutover-Blocker Early-Access/Event-Daten:
  `building-docs/migration/MAIN-DELTA-2026-10.md`.
- Rückfallweg der Preview als Host-Prozess: `docs/deploy-preview.md`.
