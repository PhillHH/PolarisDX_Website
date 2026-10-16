# Wartungsregeln (PT33.3)

Checklisten für die zehn typischen Änderungen. Je Fall: **Dateien**, **was bricht, wenn etwas
vergessen wird** (aus den Guard-Skripten und Tests abgelesen), **welcher Contract nachzuziehen ist**.
Grundsatz aller Fälle: Es gibt je Thema genau eine Wahrheit; alles andere leitet ab. Eine zweite
Liste „nur vorübergehend“ ist immer ein Fehler.

Immer, bei jeder Änderung:

- [ ] `lefthook.yml` (pre-commit) läuft lokal: Prettier, ESLint, `tsc -b --noEmit`, `check:colors`,
      `check:ds-changelog`, `check:shell-i18n`, `check:nav-targets`, `check:search-index`,
      `check:internal-findability`.
- [ ] Vor dem Push zusätzlich `npm run test:guards && npm test`; CI (`.github/workflows/ci.yml`)
      fährt den Rest bis zum Job „AP27 Launch gate aggregate“.
- [ ] Ein Guard, der eine feste Anzahl erwartet (z. B. 9 Services), wird nur zusammen mit dem
      Contract angepasst — das ist eine Vertragsänderung, keine Testpflege.

## 1. Neue Route

**Contract:** `ROUTING-CONTRACT.md` M-02 · zusätzlich `IA-INVENTORY.md`, ggf. `SEO-CONTRACT.md`.

- [ ] Eintrag in `STATIC_ROUTE_DEFINITIONS` (`src/routing/routeRegistry.ts`): `id`, `pathPattern`
      (ohne Locale), `routeType`, `localeBehavior: x10`, bewusste Entscheidung zu `indexability`,
      `sitemap` (Policy oder `false`), `searchEligible`, `shell` (`B2B`/`CONSUMER`).
- [ ] Seitenkomponente `src/pages/<Name>Page.tsx` mit genau einem `<SEOHead>`; Texte in einem
      produktiven Namespace × 10.
- [ ] `src/App.tsx`: `lazy(() => import(…))` und Schlüssel in `STATIC_ROUTE_ELEMENTS`.
- [ ] Bei `searchEligible: true`: Eintrag `SEARCH_PAGE_METADATA[<id>]` in `src/hooks/useSearch.ts`
      (`type`, `titleKey`, `descriptionKey`, `priority`) — Keys in allen 10 Sprachen.
- [ ] Einstieg in `Header.tsx`/`Footer.tsx` oder begründete Ausnahme in `AP07-FINDABILITY-MATRIX.md`.
- [ ] Optional: Perf-Matrix `scripts/perf/routes.mjs` ergänzen (manuelle Liste, nicht abgeleitet).
- [ ] **Nicht** anfassen: Pfadlisten in `server.ts`, `sitemap.ts`, `useSearch.ts`, `e2e/url-smoke.spec.ts`.

| Vergessen / falsch                                                     | Fängt                                                                                                   |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Komponentenbindung fehlt                                               | `npm run typecheck` (`Record<StaticRouteId, …>`), `npm run check:routes` („App static binding drift“)   |
| `INDEX_FOLLOW` ohne Sitemap-Entscheidung / `noindex` in Sitemap        | `check:routes` („indexable route lacks explicit sitemap decision“, „noindex route is sitemap-eligible“) |
| doppelte ID / doppeltes Muster                                         | `check:routes`                                                                                          |
| Suchmetadaten fehlen                                                   | `check:routes`, `check:search-index` (`createSearchIndex`: „Search metadata missing“)                   |
| `<Route path="…">`-Literal, `KNOWN_PATHS`, manuelle Sitemap-/Suchpfade | `check:routes` („stale route mirrors“)                                                                  |
| Nav-Link auf unbekannte Route oder Redirect-Quelle                     | `npm run check:nav-targets`                                                                             |
| Locale-Key fehlt                                                       | `npm run check:i18n`                                                                                    |
| Seite antwortet nicht 200 in allen Sprachen                            | `npm run check:http-status`, `npm run test:seo:regression` (Matrix aus `getRouteTestMatrix()`)          |

## 2. Neuer Sprach-Key

**Contract:** `I18N-CONTRACT.md` (M-01 Namespace-Eigentum, §9 Verbote).

- [ ] Key in allen zehn `public/locales/<lang>/<namespace>.json`, Struktur wie die Schemareferenz
      (`schemaReference` in `scripts/check-i18n.ts`: meist `de`, `epigenetics`/`consumer` = `en`).
- [ ] Verwendung als `t('ns:key')` oder `useTranslation('ns')` + `t('key')` — beide Formen prüft G4.
- [ ] Neuer **Namespace**: Datei × 10, `PRODUCTIVE_NAMESPACES` in `src/i18n.ts` (nur AP08) und
      `schemaReference` in `scripts/check-i18n.ts`; danach `npm run check:i18n:contract`.
- [ ] Shell-Texte (Header, Footer, SkipLink, LanguageSwitcher) → `common.json`.

| Vergessen / falsch                              | Fängt (`npm run check:i18n`, Meldung)                                          |
| ----------------------------------------------- | ------------------------------------------------------------------------------ |
| Key fehlt in einer Sprache                      | Schemaabweichung bzw. „`<datei>: <lang>/<ns>:<key> fehlt`“                     |
| leerer Wert, `TODO`/`Lorem ipsum`, Key als Wert | „leerer Pflichtwert“, „Platzhaltertext“, „sichtbarer Translation-Key als Wert“ |
| `{{…}}` anders als in der Referenz              | „Interpolationsabweichung“                                                     |
| Zahl/URL abweichend (epigenetics, Befunde)      | „Zahlen-/URL-Abweichung“                                                       |
| Übersetzung = EN-/DE-Kopie                      | „lange Texte sind exakte EN-Kopien“ / „DE-Kopien“                              |
| Datei nicht klassifiziert / fehlt               | „ist nicht klassifiziert“ / „fehlt“                                            |
| Shell-Key fehlt oder ist EN-Kopie               | `npm run check:shell-i18n`                                                     |
| SEO-Key leer/zu kurz/Platzhalter                | `npm run check:seo` (`check-meta-descriptions.mjs`)                            |

## 3. Neuer Service

**Contract:** `SERVICE-DETAIL-CONTRACT.md` (§2 Matrix, §7 Claim-Entscheidung je Service),
`DIAGNOSTICS-HUB-CONTRACT.md`, `CONTENT-MATRIX.md`.

- [ ] ID in die Union `ServiceId` (`src/types/models.ts`).
- [ ] Datensatz in `src/data/services.tsx`: `id` (= URL-Slug), `translationKey`, `icon`,
      `relatedArticleIds`, `hubCategory`, `hubPriority`, `specialtyTags`, `detailParameterKey`,
      optional `detailTitleSource`, `detailCrosslinks` (Registry-IDs).
- [ ] `services:<translationKey>` × 10 inkl. `seo.title`, `seo.description`, `detail.*`.
- [ ] Gegenseitige Artikelbeziehungen in `src/data/articles.ts` (`relatedServiceIds`).
- [ ] Feste Anzahlen bewusst anheben: `scripts/check-i18n.ts:379` (18 = 9 × Title/Description),
      `scripts/check-internal-findability.ts:26` (9), Tests `src/data/diagnosticsHub.test.tsx`,
      `src/data/serviceDetail.test.ts`, `src/components/layout/Footer.test.tsx`,
      `src/components/service-detail/ServiceDetailTemplate.test.tsx`.
- Automatisch: Route `/diagnostics/<id>` × 10, Sitemap, Suche (`services:<key>.seo.*`), 301 von
  `/services/<id>` und — falls `translationKey ≠ id` — von `/diagnostics/<translationKey>`.

| Vergessen / falsch                    | Fängt                                                                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `ServiceId` fehlt                     | `npm run typecheck`                                                                                                       |
| Anzahl nicht angehoben                | `check:i18n` („erwartet 18 Pflichtwerte“), `check:internal-findability` („expected 9 current services“), `npm test`       |
| Artikelbeziehung einseitig            | `check:internal-findability` („relationship is not reciprocal“)                                                           |
| Crosslink auf nicht vorgesehene Route | `npm run typecheck` (`routeId` ist eine Union in `src/types/models.ts`); `getServiceDetailStaticRoute` wirft zur Laufzeit |
| SEO-Text fehlt                        | `check:i18n`, `check:seo`, `check:search-index`                                                                           |

## 4. Neuer Artikel

**Contract:** `ARTICLES-CONTRACT.md`. Redaktionsablauf: `redaktion.md` §2.

- [ ] `src/data/articles.ts` (`articleInventory`), `src/content/articles/<slug>.json` (10 Sprachen),
      `src/pages/articles/<slug>.tsx` (`createArticleRoute`), `src/App.tsx` (`lazy` +
      `ARTICLE_ROUTE_ELEMENTS`), `articles:<id>.{title,excerpt,seo.title}` × 10,
      `common:search.index.article-<id>.{title,description}` × 10, `src/data/articles.test.ts` (Anzahl).
- [ ] Bild: Quelle in `scripts/build-article-images.mjs`, Import in `src/assets/articleImages.ts`.
- Automatisch: Route, Sitemap mit `lastmod` = `datePublished`, Suche, 301 `/articles/<id>` → Slug.

| Vergessen / falsch                          | Fängt                                                                                                   |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Sprache im Body fehlt / leere `sections`    | `createArticleRoute` wirft beim Import („lazy content locale contract mismatch“)                        |
| `ARTICLE_ROUTE_ELEMENTS`-Eintrag fehlt      | **kein statischer Guard** (`Record<string, …>`, G1 prüft nur Static/Dynamic/Befund) — im Browser prüfen |
| Suchtexte fehlen                            | `check:search-index`, `check:i18n`                                                                      |
| `relatedServiceIds` leer/unbekannt          | `check:internal-findability`                                                                            |
| Datum nicht `YYYY-MM-DD`                    | `npm run typecheck` (`IsoCalendarDate`), `check:seo` (`sitemapGuard.ts`: „Invalid lastmod“)             |
| Bildvariante fehlt/zu groß/nicht importiert | `npm run check:article-images`                                                                          |

## 5. Neue API-Route

**Contracts:** `BACKEND-API-CONTRACT.md` (M-01…M-06, §5.1), `LEAD-DATA-CONTRACT.md`,
`LEAD-DELIVERY-CONTRACT.md`, `CRM-INTEGRATION.md` §5.2, `SECURITY-CONTRACT.md`.

- [ ] Eingabeschema und Fehler-Envelope zuerst; Fehlercodes additiv und stabil.
- [ ] `server/server.js`: `app.post('/api/<name>', formLimiter, jsonForm, …)` — Rate Limit Pflicht.
- [ ] Journey-Slice `server/<name>.js`: Idempotency-Key (`IDEMPOTENCY_KEY_REQUIRED`), Honeypot `_hp`,
      **erst persistieren, dann zustellen** (Outbox).
- [ ] `JOURNEY_REGISTRY` in `server/lead-foundation/constants.js` (`id`, `endpoint`, `crmTarget`,
      `state`, `slice`); die CRM-Route leitet `CrmRouter` daraus ab.
- [ ] Schemaänderung nur als neue additive Migration in `server/lead-foundation/migrations/`
      (destruktiv = eigener Beschluss, DEP-13; Rollbackpfad mitplanen, DEPLOYMENT M-06).
- [ ] Client `src/api/<name>.ts` (Muster `src/api/contact.ts`, Header `Idempotency-Key`).
- [ ] Nutzergerichtete Mails × 10 in `server/system-i18n.js`.
- [ ] Tests: `server/<name>.endpoint.test.js`; Route in die Liste `ROUTES` von
      `server/api-security.endpoint.test.js` (manuell gepflegt); `CANONICAL_SEVEN` in
      `server/lead-api-contract.test.js` bewusst erweitern.
- Nicht nötig: `server.ts` proxyt `/api/*` automatisch; `robots.txt` sperrt `/api`; gleiche Herkunft
  braucht keine CSP-Änderung.

| Vergessen / falsch                          | Fängt                                                                                                          |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Route ohne `formLimiter`                    | `npm run test:server` (`lead-api-contract.test.js`: „montiert jeden Journey-Endpunkt hinter dem Rate Limiter“) |
| Journey nicht registriert / Anzahl          | `lead-api-contract.test.js` (`CANONICAL_SEVEN`, `DEFAULT_JOURNEY_ROUTES`)                                      |
| Interna/Stacktrace in Fehlern, 5xx bei Müll | `api-security.endpoint.test.js` — **nur, wenn die Route in `ROUTES` steht**                                    |
| Persistenz/Retry/Idempotenz                 | `npm run test:integration`                                                                                     |
| echte Zustellung in Preview                 | `DRY_RUN` erzwungen über `APP_ENV=preview`; `node scripts/lead-ops.mjs isolation`                              |

## 6. Neues Tracking-Event

**Contracts:** `TRACKING-CONTRACT.md` (M-04: Antrag → Typ + Allowlist → Aufruf; M-06),
`CONSENT-TRACKING-CONTRACT.md` §14.1 (Ereignisregister), `NETWORK-ALLOWLIST.md`.

- [ ] Zweck und Parameter begründen; keine Freitexte, E-Mail-Muster oder vollen URLs.
- [ ] `src/lib/tracking.ts`: Interface, Union `TrackingEreignis`, Liste `TRACKING_EREIGNISSE`,
      `case` in `pruefeEreignis` (Parameter-Allowlist).
- [ ] `src/lib/trackingProvider.ts`: Eintrag in `TRANSPORT` (`gtag` oder `dataLayer`).
- [ ] Aufruf **nur** über `track({ name: … })` im Feature; Konversion erst nach persistierter
      Antwort, genau eine Aufrufstelle.
- [ ] Erwartete Gegenseite im GTM-Container dokumentieren (Container ist kein Repo-Zustand).
- [ ] Neue externe Origin? `NETWORK-ALLOWLIST.md` und `src/security/contentSecurityPolicy.ts`.

| Vergessen / falsch                                           | Fängt                                                                                    |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| Name nicht in Union/`TRANSPORT`                              | `npm run typecheck` (`Record<TrackingEreignis['name'], …>`, `satisfies`)                 |
| `dataLayer`/`gtag` im Feature-Code, zweite Aufrufstelle, PII | `src/lib/trackingTaxonomy.test.ts`, `src/lib/tracking.test.ts` (`npm run security:test`) |
| Ereignis vor Einwilligung / Request vor Consent              | `npm run test:e2e:consent`                                                               |
| neue Origin nicht in CSP                                     | `npm run security:test` (`contentSecurityPolicy.test.ts`, `analyticsIsolation.test.ts`)  |

## 7. Neue Farbe / neues Token

**Contract:** `DESIGN-SYSTEM-CONTRACT.md` §3 (Rolle, Kontrast), §10 (Kopplungsregel); Changelog.

- [ ] Semantisches Token in `tailwind.config.js` (keine rohe Tailwind-Farbskala, kein Arbitrary-Wert).
- [ ] Hexwert in `PALETTE_HEX` (`scripts/check-color-tokens.mjs`) — **im selben Commit**.
- [ ] Kontrast messen und Rolle im Contract §3 eintragen (Text nur ≥ 4,5:1).
- [ ] `building-docs/DESIGN-SYSTEM-CHANGELOG.md`: Change Note und Token-Pfad im Block
      `<!-- SURFACE:colors -->` (gleiches gilt für neue `.t-*`-Rollen in `src/index.css` und neue
      Exporte der `OWNED`-Komponenten).
- [ ] Sichtbare Änderung → Visual-Baselines im gepinnten Image neu, Changelog-Eintrag (`entwicklung.md` §9).

| Vergessen / falsch                                                     | Fängt                                                            |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Hex nicht in `PALETTE_HEX`, `bg-[#…]`, `teal-600`, `gray-900`, `rgb()` | `npm run check:colors`                                           |
| Token nicht im Changelog-`SURFACE`                                     | `npm run check:ds-changelog` („NEU im Code, fehlt im Changelog“) |
| Baseline geändert ohne Changelog                                       | `npm run check:visual-changelog`                                 |
| Kontrast zu niedrig                                                    | `npm run a11y:gate`                                              |
| unbeabsichtigte Optik                                                  | `npm run test:visual:docker`                                     |

## 8. Neue Download-Datei

**Contract:** `RESOURCES-CONTRACT.md` (RI-01…RI-16, §9 Gate). Ablauf: `redaktion.md` §4.

- [ ] Datei in `public/downloads/**` (frei) **oder** `storage/protected/**` (gegatet).
- [ ] Eintrag in `src/content/resources/resourceInventory.ts` mit gemessenen `bytes`/`sha256`/`pages`.
- [ ] Label-Keys × 10; `npm run build:resource-registry`.

| Vergessen / falsch                                                              | Fängt                                                         |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Datei nicht inventarisiert / Größe, SHA, Seiten falsch / Textangabe passt nicht | `npm run check:resource-inventory`                            |
| `server/resource-registry.json` veraltet; gegatete Datei auch öffentlich        | `npm run check:content-download`                              |
| Karte zeigt Key statt Text, Gruppe leer                                         | `npm run check:resource-center`                               |
| verlinkte Datei existiert nicht                                                 | `npm run check:assets`, `npm run check:epigenetics-resources` |
| Lead-Magnet-Matrix inkonsistent                                                 | `npm run check:lead-magnets`                                  |

Alle zusammen: `npm run test:guards:content`; Auslieferungspfad: `npm run test:content-download`.

## 9. Neue Redirect-Regel

**Contract:** `ROUTING-CONTRACT.md` §2.2 (Legacy-Map), M-03, M-08, Nachträge AP29;
Evidenz `building-docs/migration/AP29-PRELAUNCH-CRAWL.md`.

| Fall                         | Ort                                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------------------- |
| Alias / stillgelegte Seite   | `src/routing/legacyRedirects.ts`: `primaryAliases` (`PRIMARY_ALIAS`), `retiredPages` (`RETIRED_PAGE`) |
| ganze Familie (`/services*`) | `getRedirectRegistryEntries` in `src/routing/routeRegistry.ts`                                        |
| Datei-URL ohne Locale        | `LEGACY_FILE_REDIRECTS` in `server.ts` (G3)                                                           |
| kein ehrlicher Nachfolger    | `INTENTIONAL_404_PATHS` — nie auf die Startseite „weich“ umleiten                                     |

- [ ] Quelle ohne Locale-Präfix; Ziel ist eine kanonische Registry-Route; ein Hop; Locale und Query
      bleiben erhalten (macht `server.ts`).
- [ ] Neue Evidenz-Art → Typ `LegacyRedirectMigration['evidence']` erweitern.
- [ ] Datei-Redirect → Fall in `e2e/url-smoke.spec.ts` („AP29 legacy files“) ergänzen.

| Vergessen / falsch                                              | Fängt                                                                                           |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| zwei Ziele für eine Quelle                                      | Modulimport wirft („Conflicting legacy redirect“)                                               |
| Ziel unbekannt, Schleife, doppelte Quelle, Quelle ist kanonisch | `npm run check:routes`                                                                          |
| Nav verlinkt auf Redirect-Quelle                                | `npm run check:nav-targets`                                                                     |
| Status/Hop falsch                                               | `src/routing/legacyRedirects.test.ts`, `routeResolution.test.ts`, `npm run test:seo:regression` |

## 10. Deprecation-Prozess

Ablauf für jedes Stilllegen: (1) Entscheidung dokumentieren (`building-docs/DECISIONS.md`, bei
Scope-Wirkung `SCOPE-CHANGELOG.md`; Decision Locks nie eigenmächtig) → (2) Konsumenten per `grep`
inventarisieren → (3) Nachfolger/Redirect festlegen → (4) entfernen → (5) Guards grün → (6) Contract
und `state/AP-STATE.md` nachziehen.

| Gegenstand            | Regel                                                                                                    | Quelle                     |
| --------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------- |
| Route                 | Registry, App, Seite, Keys, Suchmetadaten, Nav zurückbauen **und** Redirect-Entscheidung (§9)            | ROUTING M-03               |
| Artikel               | `status: 'DRAFT_OR_NON_PUBLIC'` nimmt ihn aus Index/Suche/Sitemap; URL → 301 oder bewusste 404           | ARTICLES-CONTRACT          |
| Namespace             | in `LEGACY_NAMESPACES`/`BACKLOG_NAMESPACES` (`src/i18n.ts`) verschieben, nicht mehr laden                | I18N §9, nur AP08          |
| Token/Alias           | als `DEPRECATED` klassifizieren, keine neuen Call-Sites; Entfernen erst bei 0 Call-Sites + `SURFACE`     | DESIGN-SYSTEM §3.5         |
| Download              | `lifecycle` `LEGACY_ORPHAN`/`REPLACED` oder `NOT_LAUNCH_VISIBLE`; alte Datei-URL → Datei-Redirect        | RESOURCES RI-14            |
| Tracking/Provider     | Registrierung, Ereignisse, Consent-Kategorie und CSP-Eintrag im selben Schritt entfernen                 | TRACKING M-05              |
| API-Endpunkt          | antwortet danach 404 (Vorbild `/api/chat`, Test `server/chat-removal.test.js`); Fehlercodes nie umdeuten | BACKEND M-05, `DEC-RL-007` |
| DB-Spalte/Tabelle     | nur additiv; destruktive Migration braucht Beschluss und Rollbackplan                                    | DEP-13, DEPLOYMENT M-06    |
| Betriebskonfiguration | widersprüchliche Alt-Datei archivieren (`_project-knowledge/deploy/archiv-ap28/`)                        | DEPLOYMENT M-01            |
| Dokumentation         | veraltete Doku mit „nicht kanonisch“-Banner kennzeichnen statt löschen (Vorbild `README.md`)             | AGENT-CONTRACT §1          |
