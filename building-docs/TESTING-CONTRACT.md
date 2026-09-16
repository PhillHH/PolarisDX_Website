# TESTING-CONTRACT

Owner: **AP27 — Teststrategie, Regression und Quality Gates**. Angelegt in **PT27.1 (2026-09-15)**.
Gilt neben `QUALITY-GATES.md` (Gate-Modell, Altlast-Klassen) und den fachlichen Verträgen; dieser
Vertrag beschreibt, **auf welcher Teststufe** ein Vertrag bewiesen wird, **mit welchem Kommando**
und **was davon heute wirklich in CI ankommt**.

Stand: HEAD `48ca775` (0 Commits, Index durch Dritte gestaged), Branch
`console/24-25-2026-09-11T13-00-11`. AP26 ist COMPLETE_WITH_ACCEPTED_RISK (AP26-WAIVER-01, OA-11/OA-12
technisch offen) — das betrifft Gate 12, nicht die Teststufen hier.

---

## 1. Testpyramide

| Stufe       | Beweist                                              | Ort / Runner                                               | Nicht dafuer                   |
| ----------- | ---------------------------------------------------- | ---------------------------------------------------------- | ------------------------------ |
| Unit        | reine Domainlogik (Registry, i18n, Consent, SEO)     | `src/**/*.test.ts` — vitest Projekt `unit`                 | Netzwerk-Evidence, HTTP-Status |
| Component   | Semantik, Fokus, Tastatur, Zustaende                 | `src/**/*.test.tsx` — vitest Projekt `component` (jsdom)   | Layout/CSS, echte Navigation   |
| Server      | Module + Endpunkte mit In-Memory-SQLite, Doubles     | `server/**/*.test.{js,ts}` — vitest Projekt `server`       | produktive Provider            |
| Integration | Repository-/Queue-/API-Grenzen zusammen              | `test:integration` + `test:integration:http` (§9, PT27.2)  | Browser                        |
| E2E         | Browser + Routing + Network + Journeys               | Playwright, `e2e/*.config.ts` (50 Configs, 91 Specs)       | reine Stringfunktionen         |
| Visual      | Layout/CSS                                           | Playwright-Screenshots (AP06/AP24) — Broad Gate **PT27.6** | Logik                          |
| Guard/CI    | systemweite Konfiguration, Paritaet, Spiegelfreiheit | `npm run test:guards`, `.github/workflows/ci.yml`          | Verhalten zur Laufzeit         |

Regel: Jeder Vertrag wird auf der **kleinsten** Stufe bewiesen, auf der er wahr oder falsch sein kann.
Ein Render-Smoke ersetzt keinen Vertragstest; ein Unit-Test ersetzt keine Network-Evidence.

## 2. Runner- und Toolchain-Wahrheit (gemessen 2026-09-15)

| Punkt                  | Wahrheit                                                                                                                                                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runner                 | vitest **4.1.5**, jsdom 29, @testing-library/react 16.3, React 19.2; Playwright fuer E2E                                                                                                                                                                      |
| Konfiguration          | `vitest.config.ts`: globals, jsdom, `src/test/setup.ts` (jest-dom + `react-i18next`-Mock `t(key) → key`), **drei Projekte** `unit`/`component`/`server`, zusammen exakt die fruehere Include-Liste (101 Dateien, geprueft)                                    |
| `NODE_ENV`             | Die Config setzt `NODE_ENV=test`. Vorher: Shell mit `NODE_ENV=production` → React-Produktionsbuild ohne `act` → **233 von 590** src-Tests rot; ohne Variable 590/590. Nachher mit derselben Shell: 377 + 250 gruen                                            |
| Node lokal             | Default **18.20.8**; **22.23.2** ueber nvm. npm 10.8.2. Kein `engines`/`packageManager` (QD-10)                                                                                                                                                               |
| Node CI                | **22** (`actions/setup-node`), frische Installation                                                                                                                                                                                                           |
| Node-Aufteilung lokal  | `unit`/`component` brauchen Node ≥ 20 (jsdom laedt unter 18 nicht: `ERR_REQUIRE_ESM`). `server` braucht die ABI der lokalen `server/node_modules` (better-sqlite3, hier Node 18); einzige jsdom-Datei dort, `server/pt08-2-i18n.test.ts`, laeuft nur unter 22 |
| Server-Abhaengigkeiten | liegen in `server/package.json`; Root-`npm ci` installiert sie **nicht** (D-12)                                                                                                                                                                               |
| Testdaten              | synthetisch (`*.example`-Adressen, In-Memory-SQLite, Fake-Adapter); keine Provider-Credentials noetig                                                                                                                                                         |

## 3. Kommandos

| Kommando                                         | Umfang                                                                                                                                                  | Node lokal                  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `npm test`                                       | alle drei vitest-Projekte                                                                                                                               | siehe §2                    |
| `npm run test:unit`                              | Projekt `unit` — 40 Dateien, 379 Tests (Stand PT27.3)                                                                                                   | 22                          |
| `npm run test:component`                         | Projekt `component` — 27 Dateien, 250 Tests                                                                                                             | 22                          |
| `npm run test:server`                            | Projekt `server` — 36 Dateien, 482 Tests (Stand PT27.2)                                                                                                 | 18 (+22 fuer `pt08-2-i18n`) |
| `npm run test:guards`                            | die neun Guards, die CI ausfuehrt: colors, ds-changelog, shell-i18n, i18n (`--self-test`), nav-targets, search-index, internal-findability, routes, seo | 22                          |
| `npm run security:test`                          | AP26-Vertragstests (Teilmenge unit/server)                                                                                                              | 22 / 18                     |
| `npx playwright test --config e2e/<x>.config.ts` | E2E je Paket (nicht Teil von PT27.1)                                                                                                                    | 22                          |

Hook-Tests mit `renderHook` (`useContactForm.test.ts`, `useSearch.test.ts`) liegen nach Dateiendung im
Projekt `unit` und laufen dort ebenfalls unter jsdom. Die Einteilung ist bewusst mechanisch (Endung),
damit keine Datei zwei Stufen oder keiner zugeordnet wird.

## 4. Vertragsabdeckung auf Unit-/Component-Ebene

| Vertrag            | Beweis (Datei)                                                                                                                                                                                                                                                                                                                                                                                              | Rest-Owner                                                                              |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Route Registry     | `src/routing/routeRegistry.test.ts` (AP10), `legacyRedirects.test.ts`, **`routeResolution.test.ts` (PT27.1, 16)**: Locale-Praefix x10 fuer alle 43 Pfade, Unbekanntes/Umgeleitetes/404, Segmentmodell Consumer/Epigenetik/Befunde/Ressourcen/Legal, Shopify-only (keine Checkout-Route), Redirects 30 stabil und kettenfrei, Sitemap/Suche = Registry                                                       | SSR-Status 200/301/404 → **PT27.5**; Spiegelfreiheit `server.ts` → Guard `check:routes` |
| SEOHead            | `src/components/seo/SEOHead.test.tsx` (8): Canonical, hreflang x10, x-default `de`, OG/Twitter, 404 noindex ohne Canonical/hreflang, Indexability-Zustaende, Preview-/Dev-Host abgelehnt; `sitemap.test.ts`, `structuredData.test.ts`                                                                                                                                                                       | Redirect-Head existiert nicht (301 ohne Dokument) → HTTP **PT27.5**                     |
| i18n               | `src/i18n.test.ts` (6), **`src/lib/i18nSchema.test.ts` (PT27.1, 12)**: fehlender/unerwarteter/typverschiedener Key, Array, Pluralformen, Marker, Mutation echter Locale-Daten, fehlende/unklassifizierte Namespace-Datei; Locale-Zuordnung in `routeResolution.test.ts`                                                                                                                                     | Vollstaendigkeit aller Namespaces x10 → Guard `check:i18n` (G4)                         |
| Lead-Domain        | `server/lead-foundation/lead-foundation.test.js`, `lead-queue.test.js`, `crm-handoff.test.js`, `lead-api-contract.test.js`, `integration-security.test.js`: Persistenz vor Handoff, Idempotenz-Konflikt, Retry/Backoff, Unknown → Klaerung, Dead Letter, Lease                                                                                                                                              | Zusammenhaengender Harness → **PT27.2**                                                 |
| Consent-Domain     | `src/lib/consentState.test.ts`, `googleConsent.test.ts`, `tracking.test.ts` (kein Puffer, keine PII, nur Aufzaehlungswerte), `trackingBypass.test.ts`, `trackingTaxonomy.test.ts`, `analyticsIsolation.test.ts`                                                                                                                                                                                             | Network-Evidence → **PT27.4**                                                           |
| CRM-/Queue-Doubles | **`server/lead-foundation/testing/crm-test-double.js` + `crm-test-double.test.js` (PT27.1, 9)**: Skript `delivered`/`retryable`/`terminal`/`unknown` ueber die echte Zustellgrenze, Retry-Entscheidung aus `RESULT_HANDLING` + `shouldRetry`, Call Count, Reihenfolge, DRY_RUN = 0 Aufrufe, erschoepftes Skript sichtbar terminal, deterministisch, keine PII-Aufzeichnung, kein Netzwerk-/SDK-/Env-Zugriff | Einsatz mit Repository/Worker → **PT27.2**                                              |
| UI-Patterns        | `Dialog.test.tsx` (15), `FormField.test.tsx` (13), `SearchModal.test.tsx` (12), `Header.test.tsx` (33), **`LanguageSwitcher.test.tsx` (PT27.1, 9)**: zehn Sprachen in Reihenfolge, genau ein `aria-current`, Regionscode, Pfeil/Home/End/Umlauf, Escape mit Fokusrueckgabe, Klick aussen, Wechsel loest Navigation mit Pfad/Query/Hash aus                                                                  | Resource-Gate-Trigger im Browser → **PT27.3**                                           |

## 5. Bekannte Baselines (klassifiziert, QUALITY-GATES §6.1)

| ID    | Befund                                                                                                                                | Klasse                       | Owner / Stand                                                                |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| TB-01 | 233 src-Tests rot `React.act is not a function` (seit AP22–AP26 als „vorbestehend“ gefuehrt)                                          | Umgebung, kein Code          | **FIXED PT27.1** (`NODE_ENV` in `vitest.config.ts`), gegengeprueft           |
| TB-02 | vitest-Exit 1 im Projekt `server` unter Node 18 trotz 0 Fehlschlaegen: `server/pt08-2-i18n.test.ts` (jsdom) startet nicht             | TOOLCHAIN_BASELINE           | Datei unter Node 22 12/12; eine Node-Version fuer alles → **PT27.6** / QD-10 |
| TB-03 | Root-`npm ci` installiert Server-Abhaengigkeiten nicht → `npm test` im CI-Job `quality` scheitert am Server-Import (D-12)             | LAUNCH_BLOCKER-Voraussetzung | **PT27.6** (`ci.yml`-Hotspot, in PT27.1 nicht angefasst)                     |
| TB-04 | CI-Job `quality` rot ab Schritt Lint seit 2026-08-25 (eslint 6 / Prettier 34 in Nicht-AP26-Dateien, Stand PT26.5, nicht neu gemessen) | BASELINE_DEBT (QD-1/QD-2)    | **PT27.6**                                                                   |
| TB-05 | E2E `pt23.1` 2 Faelle, `search-modal` Strict-Mode 1 Fall (A/B vorbestehend)                                                           | BASELINE_DEBT                | **PT27.3/PT27.4**                                                            |
| TB-06 | SEC-43 Kontrast SprayPage                                                                                                             | BASELINE_DEBT (a11y)         | **PT27.6**                                                                   |
| TB-07 | `vitest.config.ts` wird von `tsc -b` nicht geprueft (`tsconfig.node.json` enthaelt nur `vite.config.ts`); Laufzeitladen bewiesen      | BASELINE_DEBT                | **PT27.6**                                                                   |

## 6. CI-Reichweite heute

- Trigger: `main`, `feat/home-leadmagnet`, `console/**`. Der aktuelle Branch liegt **nicht** auf `origin` → **0 Laeufe**.
- Job `quality`: `npm ci` → tsc → **eslint (rot, TB-04)** → … → `npm test`. Die Unit-/Component-/Server-Tests werden
  dort heute **nicht erreicht**; wuerden sie erreicht, scheiterte der Server-Teil an TB-03.
- Job `routing`: `check:routes`, HTTP-Status-E2E. Job `seo`: `check:seo` + drei SEO-Unit-Dateien direkt.
  Job `performance`: Budgets. Jobs `security`/`security-runtime`: `security:test` (mit Server-Install), Scans, E2E pt26.x.
- Guards in `quality`: colors, ds-changelog, shell-i18n, i18n, nav-targets, search-index, internal-findability
  (alle **vor** `npm test`, aber **nach** eslint → ebenfalls nicht erreicht).
- Nicht in CI: `check:assets`, `check:epigenetics-resources`, `check:resource-inventory`, `check:resource-center`,
  `check:content-download`, `check:lead-magnets`, `check:befunde-seo`, `check:consumer-images`, `check:article-images`
  (`check:befunde` laeuft ueber `npm run build`). In PT27.1 nicht ausgefuehrt.
- Die neuen Scripts `test:unit`/`test:component`/`test:server`/`test:guards` sind **lokal** bewiesen, in CI **nicht
  verdrahtet** (PT27.6). Kein CI-PASS wird behauptet.

## 7. Offene Luecken (bewusst nicht in PT27.1)

| Luecke                                                                                                                                                                | Owner                                        |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Zusammenhaengender Integrations-Harness: Repository + Worker + Double + API; Persistenz vor Handoff, Idempotenz, Replay, Dead Letter, Preview/DRY_RUN in einem Ablauf | PT27.2                                       |
| `LDC-10` `requestId` nicht am Lead persistiert; `LDC-13` `findRecentDuplicate()` ungenutzt; `LDC-22` `getRuntime*({ env })`                                           | PT27.2 (Befund klaeren, nicht still beheben) |
| Kernjourneys im Browser inkl. Resource-Gate-Trigger, Consumer SEO-Landingpage → Shopify-Outbound                                                                      | PT27.3                                       |
| Consent-Network-Evidence (vor Consent/Reject 0, Grant nur Allowlist, Widerruf)                                                                                        | PT27.4                                       |
| HTTP 200/301/404 + Head, Sitemap/hreflang aus SSR/XML                                                                                                                 | PT27.5                                       |
| CI-Verdrahtung der Kommandos, TB-02/03/04/07, Visual/A11y Broad Gate, Gate 12 PARTIAL                                                                                 | PT27.6                                       |

## 8. Handoff PT27.1 → PT27.2

```text
HEAD: 48ca775 (0 Commits; Index durch Dritte gestaged, PT27.1 ungestaged darueber)
Changed files: vitest.config.ts, package.json (test:unit|component|server|guards), scripts/check-i18n.ts,
  src/lib/i18nSchema.ts (neu), src/lib/i18nSchema.test.ts (neu), src/routing/routeResolution.test.ts (neu),
  src/components/ui/LanguageSwitcher.test.tsx (neu), server/lead-foundation/testing/crm-test-double.js (neu),
  server/lead-foundation/crm-test-double.test.js (neu), building-docs/TESTING-CONTRACT.md (neu),
  building-docs/QUALITY-GATES.md (Delta §3.1), building-docs/state/AP-STATE.md
TEST RUNNER: vitest 4.1.5, Projekte unit/component/server; NODE_ENV=test in der Config; Playwright fuer E2E
UNIT COMMAND: npm run test:unit (Node 22) — 40 Dateien, 377/377
COMPONENT COMMAND: npm run test:component (Node 22) — 27 Dateien, 250/250
NODE/TOOLCHAIN: lokal Node 18.20.8 Default + 22.23.2 (nvm), npm 10.8.2, CI Node 22; server-Projekt lokal Node 18
  (better-sqlite3-ABI), server/pt08-2-i18n.test.ts nur Node 22; kein engines-Pin

ROUTE REGISTRY UNIT: PASS — routeRegistry.test.ts (5) + routeResolution.test.ts (16)
SEOHEAD UNIT: PASS — SEOHead.test.tsx (8), unveraendert bewiesen
I18N UNIT: PASS — i18n.test.ts (6) + i18nSchema.test.ts (12); Guard check:i18n nutzt dieselbe Erkennung, Ausgabe identisch
LEAD DOMAIN UNIT: PASS fuer reine Module (retry-policy, crm-delivery, RESULT_HANDLING); DB-gebundene Vertraege → PT27.2
CONSENT DOMAIN UNIT: PASS — consentState/googleConsent/tracking/trackingBypass/trackingTaxonomy/analyticsIsolation
CRM/QUEUE DOUBLES: PASS — createScriptedCrmAdapter (delivered|retryable|terminal|unknown), 9/9
UI PATTERNS: PASS — Dialog 15, FormField 13, SearchModal 12, Header 33, LanguageSwitcher 9

KNOWN BASELINES: TB-01 FIXED; TB-02..TB-07 klassifiziert mit Owner (§5)
CI CURRENT REACH: 0 Laeufe fuer den Branch; quality rot ab Lint → Tests nicht erreicht; Server-Deps fehlen im quality-Job (D-12)
PROVEN - DO NOT REDISCOVER: Testinventar und Stufen (§3/§4); 233 rot = NODE_ENV; Include-Menge 101 Dateien identisch;
  9 CI-Guards gruen inkl. i18n-Self-Test; Registry/Sitemap/Suche aus einer Quelle; SEOHead-Vertrag; Consent-Unit-Vertraege;
  CrmRouter/withDeliveryGuards/RESULT_HANDLING sind DB-frei und unter Node 22 ladbar
PT27.2 PRIMARY WRITE SET: server/lead-foundation/testing/** (Harness: openLeadDatabase(':memory:') + LeadRepository +
  LeadHandoffWorker + createScriptedCrmAdapter), server/**/*.integration.test.js bzw. bestehende server/*.test.js,
  ggf. package.json test:integration, TESTING-CONTRACT §4/§7, LEAD-DATA-/BACKEND-API-CONTRACT nur Delta, AP-STATE
OPEN PT27.2 DELTA: Persist-before-handoff, Idempotenz/Replay, Retry→Dead Letter, Unknown→RECONCILIATION_REQUIRED, Lease,
  Preview/DRY_RUN end-to-end im Server mit dem Double; LDC-10/13/22 klaeren; Server-Tests unter einer Node-Version
DRIFT SIGNALS: Index durch Dritte gestaged; server/pt08-2-i18n.test.ts ist jsdom im Server-Baum; zwei Node-Versionen
  lokal; QUALITY-GATES §3-Tabelle historisch (Delta §3.1); AP26-WAIVER-01 aktiv (Gate 12)
```

## 9. Integrationsstufe (PT27.2, gemessen 2026-09-15)

| Kommando                        | Umfang                                                                                                                                                                                                                                | Node lokal |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `npm run test:integration`      | vitest-Projekt `server`: `server/lead-pipeline.integration.test.js` (7), `server/gated-entitlement.integration.test.js` (7), `server/preview-isolation.endpoint.test.js` (2, AP26) — **16/16**                                        | 18         |
| `npm run test:integration:http` | Playwright **nur `request`** (kein Browser, kein JavaScript): `e2e/pt27.2.config.ts` + `e2e/pt27.2-http.spec.ts` — **12/12**; baut in jedem Lauf neu nach `node_modules/.cache/pt27.2` und prueft die Build-Identitaet am Zeitstempel | 18         |

**Harness** `server/lead-foundation/testing/integration-harness.js`: der echte `server.js` laeuft im Testprozess gegen eine
temporaere SQLite-Datei. Echt sind Validierung, Persistenz, Outbox, Worker, SendGrid-Adapter und Entitlements; ersetzt
ist nur der Transport `sgMail.send` durch ein Skript (`delivered`/`retryable` = 503/`terminal` = 400/`unknown` =
`ETIMEDOUT`). `client.request` und `https.request` auf SendGrid-Hosts sind gesperrt und gezaehlt. Provider-Variablen
werden explizit gesetzt (leer oder synthetisch), damit `dotenv` nichts aus einer lokalen `.env` nachlaedt. Weitere
Helfer: Konsolen-Mitschnitt, zweite DB-Verbindung (Neustart), DB-Volltext, Warten auf das gespeicherte `available_at`.

| Vertrag               | Beweis                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SSR/Head              | 7 Routentypen (Home, Contact, Service, Epigenetik-Hub, Musterbefund, Artikel, Consumer) × `de`/`en`/`cs` im ersten Response: `lang`, genau ein Title/Description, `robots` index, Canonical = `publicSeoUrl`, hreflang x10 + `x-default` → `de`, lokalisiert, kein Preview-/Localhost-Host, kein Google-Script                                                                  |
| HTTP 200/301/404      | 33 Redirects (`/`, locale-loses `/about?ref=…` mit Query, `/services`, alle 30 Registry-Quellen unter `/pl`): 301, exakte `Location`, Ziel 200 ohne weitere `Location`. 8 × 404 (unbekannt, locale-los, ungueltiges Praefix, Service-/Artikel-/Befund-/Consumer-Slug, Legacy-Service-Slug) mit `noindex, follow`, Statusmarker, ohne Canonical/hreflang                         |
| Sitemap/hreflang      | ausgelieferte XML **byte-gleich** `generateSitemapXml()` des Arbeitsbaums; `validateSitemapArtifact` gruen; URL-Menge = Registry × 10; nur `https://polarisdx.net`; je URL hreflang x10 + `x-default`; `lastmod` nur und genau aus der Registry; noindex-Routen fehlen; 39 Familien × `cs`/`de` erreichbar und selbstkanonisch                                                  |
| Lead-Pipeline         | ungueltig → 400 ohne Lead und ohne Transport; gueltig → beim Transportaufruf ist der Lead ueber eine **zweite** Verbindung committet, Outbox `PROCESSING`; danach `DELIVERED`, Journey, Locale, Kampagne, Herkunftsroute, Consent persistiert; Replay gleicher Key → derselbe Lead, eine Zustellung; anderer Inhalt → 409                                                       |
| Retry/Recovery        | 503 → `RETRY_PENDING`, Versuch 1, `SENDGRID_TEMPORARY`, neue Verbindung sieht denselben Zustand; vor Faelligkeit kein Lauf; nach `available_at` Recovery ueber den Runtime-Worker → derselbe Lead `DELIVERED`, Versuch 2, genau eine angenommene Zustellung; `ETIMEDOUT` → `RECONCILIATION_REQUIRED`, kein Replay; 400 → `FAILED_TERMINAL`, Lead erhalten                       |
| Gated Entitlement     | Anspruch in der DB an Lead + Asset gebunden, nur `sha256(token)` gespeichert; gueltiges Token gegen zweites reales Asset → 403 `ASSET_MISMATCH`; fremder Anspruch → 403 `INVALID_TOKEN`; abgelaufen 410, widerrufen 403, aufgebraucht 410; Resubmit rotiert (alter Link 403, neuer 200, ein Anspruch); Pfade statt ID → 403/404 ohne Inhalt; kein Token in DB-Volltext oder Log |
| DRY_RUN/Preview       | `preview-isolation` (AP26): `APP_ENV=preview` mit produktionsaehnlichem Schluessel → 0 Provider-Aufrufe, kein `setApiKey`. Ohne Schluessel ehrlich `NO_PROVIDER_CONFIGURED` (Gate-Suite: 0 Sendungen). Analytics: SSR ohne Provider-Script, Spec fuehrt kein JS aus                                                                                                             |
| Provider-Side-Effects | **0**: Transport geskriptet, `client.request`/`https.request` gezaehlt 0, keine Credentials, synthetische `*.example`-Adressen                                                                                                                                                                                                                                                  |

Bewusst nicht dupliziert: `url-smoke`/`seo-head`/`sitemap` (breite Matrix, PT27.5), `content-download.endpoint.test.js`,
`lead-queue.test.js`. Regressionslauf Projekt `server` nach PT27.2: 35 Dateien, **470/470** (Exit 1 nur TB-02).

## 10. Handoff PT27.2 → PT27.3

```text
HEAD: 48ca775 (0 Commits; Index durch Dritte gestaged, PT27.2 ungestaged darueber)
Changed files: package.json (test:integration, test:integration:http),
  server/lead-foundation/testing/integration-harness.js (neu), server/lead-pipeline.integration.test.js (neu),
  server/gated-entitlement.integration.test.js (neu), e2e/pt27.2.config.ts (neu), e2e/pt27.2-http.spec.ts (neu),
  building-docs/TESTING-CONTRACT.md, building-docs/state/AP-STATE.md
INTEGRATION COMMAND: npm run test:integration (Node 18, 16/16) · npm run test:integration:http (12/12, frischer Build)
SSR/HEAD: PASS — 7 Routentypen x de/en/cs im ersten Response, ohne Hydration
HTTP 200/301/404: PASS — 33 x 301 ein Hop auf 200 mit exakter Location; 8 x echte 404 mit nicht indexierbarem Head
SITEMAP/HREFLANG: PASS — ausgeliefert == Registry-Ausgabe; 390 URLs; x-default de; lastmod ehrlich; 78 Ziele 200 + selbstkanonisch
LEAD PIPELINE: PASS — Validierung vor Persistenz, Persistenz vor Transport (zweite Verbindung), Kontext, Idempotenz, 409
RETRY/RECOVERY: PASS — RETRY_PENDING dauerhaft, Recovery-Lauf nach available_at, derselbe Lead, eine Zustellung; unknown ohne Replay
GATED ENTITLEMENT: PASS — DB-Bindung, Hash-only, ASSET_MISMATCH, fremder Anspruch, 410/403/410, Rotation, Pfad-Abwehr, Token nicht in DB/Log
DRY_RUN/PREVIEW: PASS — preview-isolation 2/2, NO_PROVIDER ehrlich, SSR ohne Analytics-Script
PROVIDER SIDE EFFECTS: 0
PROVEN - DO NOT REDISCOVER: Handoff laeuft inline im Request (worker.processNext nach createLead); Runtime-Services sind pro Prozess
  memoisiert und lesen LEAD_DB_PATH beim ersten Aufruf; Registry liest POLARIS_RESOURCE_REGISTRY_PATH beim require; dotenv
  ueberschreibt gesetzte Variablen nicht; Retry-Abstand default 1 s mit Streuung nach unten; Redirect-Middleware: Legacy-Ziel
  locale-treu, bekannte locale-lose Pfade 301 nach /de, unbekannte direkt 404; request-only Playwright startet keinen Browser;
  pt26.3-/pt27.2-Buildmuster (Node 18 + node18-crypto-hash.cjs) funktioniert
PT27.3 PRIMARY WRITE SET: e2e/pt27.3*.config.ts + Specs (Browser), Build-/Backend-Muster aus e2e/pt27.2.config.ts und
  e2e/pt26.3.config.ts (APP_ENV=preview, temporaere DB, Dispatcher aus), ggf. package.json test:e2e:core, TESTING-CONTRACT-Delta, AP-STATE
OPEN PT27.3 DELTA: Kernjourneys im Browser — Contact, Epigenetik-Inquiry, Support (Formular → Envelope-Erfolg → persistierter
  Vorgang), Resource-Gate-Trigger → Download, Consumer-SEO-Landingpage → Shopify-Outbound (kein interner Kauf), Sprachwechsel,
  404-UI; Tastatur/Fokus je Journey; TB-05 (pt23.1, search-modal) bleibt klassifiziert; Consent-Network-Evidence bleibt PT27.4
```

## 11. Befunde PT27.2

| ID       | Befund                                                                                                                                                                                                                                          | Klasse                       | Owner                                                                    |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------ |
| PT272-F1 | Der Ablehnungs-Log des Downloads (`logDownloadFailure`, `server/server.js`) schreibt die **vom Client gesendete** `assetId` ungefiltert (bis 64 Zeichen) als Warnung. Kein Server-Pfad, kein Token (geprueft); clientkontrollierter Text im Log | BASELINE_DEBT (Log-Hygiene)  | Security (SECURITY-CONTRACT §6.2); Produktcode in PT27.2 nicht geaendert |
| PT272-F2 | TB-02 bestaetigt: Projekt `server` endet unter Node 18 mit Exit 1 trotz 470/470 (`pt08-2-i18n`, jsdom)                                                                                                                                          | TOOLCHAIN_BASELINE           | PT27.6                                                                   |
| PT272-F3 | Die neuen Integrationskommandos sind nicht in CI verdrahtet; `quality` erreicht Tests weiterhin nicht (TB-03/TB-04)                                                                                                                             | LAUNCH_BLOCKER-Voraussetzung | PT27.6                                                                   |

## 12. E2E-Kernjourneys (PT27.3, gemessen 2026-09-15)

**Kommando** `npm run test:e2e:core` → `e2e/pt27.3.config.ts` + `e2e/pt27.3-core.spec.ts`, **15/15** (Lauf 3 und
Wiederholung Lauf 4, je ~40 s, `retries: 0`, 0 flaky). Production-like: Build in jedem Lauf frisch nach
`node_modules/.cache/pt27.3` (Identitaet am Zeitstempel geprueft), SSR `NODE_ENV=production` mit durchgesetzter CSP (kein
`bypassCSP`), Backend `server/server.js` mit `APP_ENV=preview` (erzwungener Trockenlauf), temporaerer DB und
Upload-Ablage, Dispatcher aus, Provider-Variablen explizit leer. Traces/Screenshots/Videos aus; Artefakt-Scan: 0 Adressen,
0 Tokens.

**Beweismuster „kein Erfolg vor dem gespeicherten Zustand“:** die Journey-Antwort wird im Browser (`page.route` →
`route.fetch`) angehalten; waehrenddessen muss die Datenbank den Vorgang ueber die Vorgangs-ID enthalten und die
Oberflaeche darf die Erfolgsmeldung noch nicht zeigen. Erst dann wird die Antwort unveraendert weitergereicht.

| Journey          | Beweis                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B2B              | `/de/diagnostics` → Service `/de/diagnostics/dental` → Hero-CTA `/de/contact?intent=quote#kontaktformular` → leerer Submit: Fehler, **0 Requests** → Submit mit `Idempotency-Key`, Payload `intent=quote`, `locale=de` → Lead `contact` mit Subjekt, Kontext, Consent; Ereignisse `LEAD_RECEIVED, LEAD_VALIDATED, LEAD_PERSISTED, HANDOFF_PENDING`, Persistenz vor `HANDOFF_ATTEMPT`; Status `FAILED_TERMINAL`/`DRY_RUN`, Oberflaeche „erhalten und registriert“ (keine Zustellbehauptung). Fehlerpfad: 503-Envelope `JOURNEY_UNAVAILABLE` → Wiederholungsmeldung, kein Erfolg, Eingaben bleiben, 0 Leads |
| Epigenetik       | Header → Hub → Panel `healthy-aging` → Musterbefund → Inquiry-Link → Panel vorbelegt → Validierungsfehler → Lead `epigenetics_inquiry` mit `locale=de`, `source=musterbefund`, `panel=healthy-aging`; Status `FAILED_TERMINAL`/`DRY_RUN` und UI „Anfrage sicher gespeichert“, **nicht** „weitergeleitet“                                                                                                                                                                                                                                                                                                  |
| Consumer/Shopify | Landingpage `/de/consumer/vitamin-d3-spray` 200, **kein** Shop-/Checkout-/Warenkorb-Link → Bestellanfrage → Lead `consumer_order`, `productId`, Referenz `PDX-…` = Envelope = sichtbare Vorgangsnummer; Hinweis „Bestellanfrage, kein Kaufvertrag und keine Zahlung“; keine Kaufbehauptung. **Shopify-Outbound: OWNER_BOUND** (CTC-14, keine Shopify-Domain im Repository, nicht erfunden)                                                                                                                                                                                                                |
| Lead-Magnet      | Resource Center → Karte `rsc-epi-019` GATED ohne Datei-URL → Gate ohne Consent: kein Request → Submit → Lead `content_download` + Anspruch (Asset, Lead) in der DB vor dem Erfolg → Download im Browser: Groesse und SHA-256 = Inventar → manipuliertes Token 403, oeffentliche Pfade nicht 200                                                                                                                                                                                                                                                                                                           |
| Support          | Startseite → `/de/support` → Formular mit PDF-Anhang ohne Consent: Fehler, 0 Requests → Submit → Vorgang mit Anhang-Metadaten (Name, MIME, Groesse, opake `storageId`), Datei byte-gleich in der servereigenen Ablage; Status nicht `DELIVERED`, UI „erhalten und registriert“                                                                                                                                                                                                                                                                                                                            |
| Sprachwechsel    | Umschalter: B2B `de→en`, Epigenetik `de→pl`, Consumer `pl→cs`, Content `fr→de`, Ressourcen `it→nl`, Legal `de→es` — gleiche logische Seite, `html lang` = Ziel, Ziel direkt 200. Direktaufruf x10 fuer Service und Legal: 200 ohne `Location` (kein EN-Zwangsredirect)                                                                                                                                                                                                                                                                                                                                    |
| Suche            | Dialog per Tastatur, Fokus im Suchfeld; Abfragen „Epigenetik“, „Dental“, „Vitamin“: jeder Treffer ist Registry-Suchziel und liefert 200 (tote Treffer 0); Navigation zum Treffer per Enter, Dialog schliesst                                                                                                                                                                                                                                                                                                                                                                                              |

**Flake-Status:** 4 Laeufe. Lauf 1 (4 rot) und Lauf 2 (2 rot) waren deterministische Ursachen — falsche Testannahmen
(Ereignisreihenfolge, Statusregion des Dateinamens, `/de`-Href der Startseite, flache Locale-Schluessel, Anhang-Metadaten)
und der Produktdefekt PT273-F1. Lauf 3 und 4: 15/15 ohne Retry. Keine festen Sleeps; gewartet wird auf UI-, Netz- und
DB-Zustaende. `toPass` nur fuer den dokumentierten Hydrations-Klick (Gate, Umschalter, Suche, Bestellformular), begrenzt
auf 20 s, idempotent.

## 13. Handoff PT27.3 → PT27.4

```text
HEAD: 48ca775 (0 Commits; Index durch Dritte gestaged, PT27.3 ungestaged darueber)
Changed files: e2e/pt27.3.config.ts (neu), e2e/pt27.3-core.spec.ts (neu), package.json (test:e2e:core),
  src/api/consumerOrder.ts (PT273-F1), src/api/journeyEnvelope.test.ts (+2 Consumer-Faelle),
  building-docs/TESTING-CONTRACT.md, building-docs/state/AP-STATE.md
E2E COMMAND: npm run test:e2e:core (Node 18 lokal, frischer Build) — 15/15, Wiederholung 15/15
B2B: PASS — Diagnostik → Service → CTA → Validierung → Submit → Lead vor Erfolg; 503-Fehlerpfad ohne Erfolg und ohne Lead
EPIGENETICS: PASS — Hub → Panel → Musterbefund → Inquiry, Kontext locale/source/panel persistiert, ehrlicher Status
CONSUMER/SHOPIFY: PASS als Inquiry (Referenz = gespeichert, kein Kauf, kein erfundener Shop-Link); Shopify-Outbound OWNER_BOUND (CTC-14)
LEAD MAGNET: PASS — Gate → Anspruch vor Erfolg → echte Datei (Groesse + SHA-256), Token-Manipulation 403, kein Bypass
SUPPORT: PASS — Validierung, Anhang (Metadaten + byte-gleiche Ablage), Vorgang vor Erfolg
LANGUAGE SWITCH: PASS — 6 Familien inkl. Legal, x10-Direktaufruf ohne Redirect
SEARCH: PASS — Tastatur, 3 Abfragen, 0 tote Treffer, 0 Registry-Drift, Navigation
SIDE EFFECT ISOLATION: APP_ENV=preview (DRY_RUN), leerer Schluessel, keine Provider-Aufrufe; Artefakte ohne Adressen/Tokens
FLAKE STATUS: 0 flaky in Lauf 3/4; Ursachen der roten Laeufe 1/2 deterministisch und behoben (§12)
PROVEN - DO NOT REDISCOVER: Hold-Muster page.route/route.fetch; Preview-Zustaende FAILED_TERMINAL/DRY_RUN und ihre UI-Texte;
  Contact-Ereignisfolge; formLimiter teilt ein Budget pro IP ueber alle Formulare, X-Forwarded-For wirkt durch den SSR-Proxy;
  consumer.json nutzt flache Schluessel mit Punkt; Support speichert Anhang-Metadaten ohne Hash; Startseiten-Treffer ist `/de`;
  der reale gegatete Asset ist rsc-epi-019 (ZIP); CSP-Produktionsbuild funktioniert ohne bypassCSP fuer alle Journeys
PT27.4 PRIMARY WRITE SET: e2e/pt27.4*.config.ts + Spec (Browser, Network-Evidence), Build-/Backend-Muster aus e2e/pt27.3.config.ts
  mit synthetischer GTM-/GA4-Kennung zur Buildzeit und abgefangenem Provider-Netz (keine Produktions-Property),
  TESTING-CONTRACT-Delta, AP-STATE
OPEN PT27.4 DELTA: vor Consent 0 Provider-Requests, Ablehnung 0, Zustimmung laedt nur erlaubte Container, Widerruf wirksam,
  kein Puffer/Replay nach spaeterer Zustimmung, Konversionsereignisse erst nach 202 (contact/support/epigenetics/lead magnet;
  consumer_order_submit ohne Konversion), keine PII in dataLayer-Payloads, outbound_click-Allowlist; TB-05 (pt23.1) klassifiziert
```

## 14. Befunde PT27.3

| ID       | Befund                                                                                                                                                                                                                                  | Klasse                       | Owner / Stand                                                                            |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------- |
| PT273-F1 | Consumer-Erfolgsansicht zeigte **nie** die Vorgangsnummer: `src/api/consumerOrder.ts` las `orderReference`/`status`, der Server liefert seit AP22 PT22.5 `reference`/`state` (gleiche Klasse wie SEC-20). Lauf 1 schlug genau hier fehl | NEW_REGRESSION (AP22-Drift)  | **FIXED PT27.3** (Altformat bleibt lesbar), Unit-Test +2, E2E vergleicht Referenz mit DB |
| PT273-F2 | Consumer-Client liest bei 400 `fields`, das Envelope liefert `fieldErrors` (Objekte) → feldgenaue Servermeldung faellt auf die allgemeine zurueck; kein falscher Erfolg, Client-Validierung faengt Name/E-Mail vorher ab                | BASELINE_DEBT                | AP21/AP22 (Consumer); nicht geaendert                                                    |
| PT273-F3 | Shopify-Outbound nicht testbar: keine Shopify-Domain im Repository                                                                                                                                                                      | OWNER_BOUND                  | Content/Marketing (CTC-14)                                                               |
| PT273-F4 | `test:e2e:core` ist nicht in CI verdrahtet                                                                                                                                                                                              | LAUNCH_BLOCKER-Voraussetzung | PT27.6                                                                                   |

## 15. Consent-/Tracking-E2E (PT27.4, gemessen 2026-09-15)

**Kommando** `npm run test:e2e:consent` → `e2e/pt27.4.config.ts` + `e2e/pt27.4-consent.spec.ts`, **11/11** (Lauf 2 und
Wiederholung Lauf 3, `retries: 0`, 0 flaky). Unit-Guards `consentState`, `googleConsent`, `tracking`, `trackingBypass`,
`trackingTaxonomy`, `analyticsConfig`, `analyticsIsolation`: **103/103**.

**Testumgebung:** Build in jedem Lauf frisch wie das Preview-Deployment (`VITE_APP_ENV=preview`,
`VITE_GTM_CONTAINER_ID_PREVIEW=GTM-PT274PRV`), zusaetzlich ein **synthetischer Produktions-Container**
`VITE_GTM_CONTAINER_ID=GTM-PT274PRD` deklariert, GA4 ausdruecklich leer (wie der echte Preview-Stand, CONSENT-TRACKING-CONTRACT
§16.1). Backend wie PT27.3 (`APP_ENV=preview`, temporaere DB). **Netz-Isolation:** jede Anfrage an Google-/Marketing-Hosts
wird beobachtet (`context.on('request')`) **und** auf Kontextebene abgefangen (`context.route` → leerer Stub) — sie erreicht
nie das Internet. Beweisebene ist das Netz; der `dataLayer` belegt zusaetzlich Inhalt und Zeitpunkt der Ereignisse. Jeder
Test startet in einem frischen Kontext.

| Vertrag                 | Beweis                                                                                                                                                                                                                                                                                                                |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pre-Consent             | 6 Direktaufrufe (de/en/pl; Home, Contact, Downloads, Consumer, Epigenetik, Service) + 2 SPA-Navigationen + Interaktion: **0** beobachtete, **0** abgefangene Provider-Anfragen; kein `dataLayer`, kein `gtag`, kein Script, **leerer** local-/sessionStorage                                                          |
| Ablehnung               | nach „Nur notwendige“: SPA-Navigation, Kontaktanfrage **202** mit Erfolg, Reload: **0** Provider-Anfragen, kein `dataLayer`, Speicher nur `cookie-consent` (`version 2`, beide `false`), kein erneuter Dialog                                                                                                         |
| Zustimmung              | „Alle akzeptieren“: genau **1** `gtm.js?id=GTM-PT274PRV`, `consent default` + `update` (granted); nach Reload wieder genau ein Script; **0** Anfragen mit der Produktionskennung, **0** GA4-`collect`, keine anderen Provider; ohne GA4-Kennung kein `send_to`                                                        |
| Nur Analyse             | Einstellungen → Schalter „Analyse“ → Speichern: Container laedt, `analytics_storage` granted, `ad_storage`/`ad_user_data`/`ad_personalization` **denied**, gespeichert `analytics: true, marketing: false`                                                                                                            |
| Widerruf                | nach Zustimmung: Fusszeile → „Einwilligung widerrufen“ → Seite laedt neu, Speicher leer, Dialog wieder da; danach SPA-Navigation und Kontaktanfrage: **0** Provider-Anfragen, kein `dataLayer`, kein Script                                                                                                           |
| Konversion              | Antwort von `/api/contact` angehalten: waehrenddessen Lead in der DB **und** 0 `contact_submit`; danach genau **1** `{ event: 'contact_submit' }` ohne Parameter; abgelehnter Vorgang (503) → **0** Konversionen                                                                                                      |
| Kein Puffer             | vor jeder Entscheidung: 2 SPA-Navigationen + gespeicherte Anfrage (202), 0 Anfragen → Zustimmung: `dataLayer` enthaelt **nur** `gtm.js` und die zwei Consent-Aufrufe, **kein** `page_view`, **kein** `contact_submit`; die naechste Navigation wird live genau einmal gemeldet                                        |
| Seitenaufruf            | Erstladen mit gespeicherter Zustimmung: App meldet **0** (der Container zaehlt ihn, §14.4); reiner Query-Wechsel ueber den Router (`/de/contact?intent=quote` → Header-CTA `/de/contact`): **0**; je SPA-Navigation genau **1** `page_view` mit Pfad; kein `virtual_pageview`, kein `page_view` im dataLayer-Push-Weg |
| PII                     | dataLayer-Volltext enthaelt weder synthetische Adresse, Name, Firma noch Nachricht, kein `@`, keine `PDX-`-Referenz, keine Lead-ID                                                                                                                                                                                    |
| Outbound / Shopify-only | nach Zustimmung: Klick auf den LinkedIn-Link → genau `{ event: 'outbound_click', outbound_domain: 'linkedin.com' }` (nur Domain), Ziel-Navigation abgefangen; **kein** `purchase`/`add_to_cart`/`begin_checkout`/`view_item`                                                                                          |
| Produktions-Property    | **0** — jede Provider-Anfrage wurde abgefangen; die Produktionskennung erscheint in keiner Anfrage                                                                                                                                                                                                                    |

**Nicht automatisiert (Operator-Evidenz, §16.3):** das Seitenaufruf-Erstladen und `collect` gegen die echte Preview-Property
laufen im echten Container; hier ist der Container ein Stub. Die Seitenaufruf-Logik der App ist vollstaendig bewiesen.

**Flake-Status:** 3 Laeufe. Lauf 1 (7/11) scheiterte deterministisch an Testannahmen — Startseiten-Link `/de` statt `/de/`,
visuell versteckte Checkbox hinter dem Schalter — und an einer falschen Bundle-Erwartung (Befund PT274-F1). Lauf 2 und 3:
11/11 ohne Retry. Keine festen Sleeps; gewartet wird auf Netz-, Speicher- und dataLayer-Zustaende, `toPass` nur fuer den
Hydrations-Klick (Banner, Links), begrenzt auf 20 s.

## 16. Handoff PT27.4 → PT27.5

```text
HEAD: 48ca775 (0 Commits; Index durch Dritte gestaged, PT27.4 ungestaged darueber)
Changed files: e2e/pt27.4.config.ts (neu), e2e/pt27.4-consent.spec.ts (neu), package.json (test:e2e:consent),
  building-docs/TESTING-CONTRACT.md, building-docs/state/AP-STATE.md
CONSENT E2E COMMAND: npm run test:e2e:consent (Node 18 lokal, frischer Preview-Build) — 11/11, Wiederholung 11/11
PRE-CONSENT REQUESTS: 0 (6 Seiten, 3 Sprachen, 2 SPA-Navigationen, Interaktion); kein dataLayer/gtag/Script/Speicher
REJECT: 0 Requests nach Navigation, Anfrage (202) und Reload; Geschaeftsvorgang funktioniert
GRANT: genau 1 gtm.js mit Preview-Kennung; Produktionskennung 0; GA4-collect 0; nur Analyse → Werbesignale denied
REVOKE: wirksam — Neuladen, Speicher leer, danach 0 Requests, kein dataLayer
CONVERSION TIMING: contact_submit erst nach gespeichertem Vorgang (DB waehrend angehaltener Antwort), genau 1, ohne Parameter; 503 → 0
NO BUFFER: bewiesen — nach spaeterer Zustimmung weder page_view noch contact_submit aus der Zeit davor
PAGE VIEW: Erstladen App 0 (Container zaehlt), Query-Wechsel 0, je SPA-Navigation genau 1, kein virtual_pageview
PII FINDINGS: 0 im dataLayer; Befunde PT274-F1/F2 sind Konfigurationsrisiken, keine PII
PRODUCTION PROPERTY POLLUTION: 0
PROVEN - DO NOT REDISCOVER: Loader-Ausgaenge (keine Zustimmung → nichts; Widerruf mit Provider → Reload); gtag legt Arrays in den
  dataLayer, Konversionen sind Objekte ohne Parameter; GtmPageview ueberspringt den ersten Mount und haengt an pathname;
  Router rendert Startseiten-Links als `/de`; Cookie-Schalter sind sr-only-Checkboxen im Label; Preview-Konfiguration waehlt
  VITE_GTM_CONTAINER_ID_PREVIEW; Kontext-Abfangen mit Stub ist das Isolationsmuster fuer jede Provider-Messung
PT27.5 PRIMARY WRITE SET: e2e/pt27.5*.config.ts (frischer Build nach Muster e2e/pt27.2.config.ts, kein reuseExistingServer), die
  bestehenden Specs url-smoke/seo-head/sitemap als testMatch oder neue Matrix-Spec, TESTING-CONTRACT-Delta, AP-STATE
OPEN PT27.5 DELTA: volle Route×Locale-Matrix (43 Pfade x10) mit echtem Status und Head, alle 30 Redirects x10 ein Hop,
  unbekannte Slugs je Familie x10 echte 404, Legal-Indexierungsregel x10, Sitemap 390 URLs erreichbar und selbstkanonisch,
  lastmod-Wahrheit gegen Inhaltsdaten, keine Preview-Domain, E2E-Server-Identitaet (QD-4) fuer die Alt-Specs
```

## 17. Befunde PT27.4

| ID       | Befund                                                                                                                                                                                                                                                                             | Klasse                          | Owner / Stand                                             |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | --------------------------------------------------------- |
| PT274-F1 | Ein im Build **deklarierter** Produktions-Container wird von Vite ins Preview-Bundle eingebettet und nur zur Laufzeit unterdrueckt. Geladen wird er nie (Netz-Beweis); das Artefakt-Kriterium „Produktions-GTM 0× im Preview-Bundle“ (§16.1) haengt allein an der Build-Umgebung   | BASELINE_DEBT (Konfiguration)   | AP23 / Operator (Preview-Build-Env); Code nicht geaendert |
| PT274-F2 | In einer Vorschau **mit** eigenem Container reicht `resolveAnalyticsConfig` eine deklarierte `VITE_GA4_MEASUREMENT_ID` als `send_to` des `page_view` durch; nur ohne eigenen Container wird sie unterdrueckt. Heute nicht wirksam (Preview-Build setzt keine GA4-Kennung)          | BASELINE_DEBT (Konfiguration)   | AP23 / Operator; nicht geaendert                          |
| PT274-F3 | TB-05 neu eingeordnet: `pt23.1` „Geschaeftsvorgang unabhaengig“ haengt in jener Konfiguration beim Lesen der Antwort (derselbe Vertrag ist hier und in PT27.3 gruen); „Tastatur“ erwartet `aria-controls` am zugeklappten Knopf, das AP24 bewusst nur im geoeffneten Zustand setzt | BASELINE_DEBT (veraltete Tests) | PT27.6                                                    |
| PT274-F4 | `test:e2e:consent` ist nicht in CI verdrahtet                                                                                                                                                                                                                                      | LAUNCH_BLOCKER-Voraussetzung    | PT27.6                                                    |

## 18. Route-/SEO-Regression (PT27.5, gemessen 2026-09-15)

**Kommando** `npm run test:seo:regression` = Guards `check:routes`, `check:search-index`, `check:seo`, `check:befunde-seo`
**und** `e2e/pt27.5.config.ts` mit `url-smoke.spec.ts` (50), `seo-head.spec.ts` (9), `sitemap.spec.ts` (1) und neu
`pt27.5-seo-matrix.spec.ts` (16) — **76/76**, Wiederholung **76/76**, `retries: 0`, 0 flaky (~66 s nach dem Build). Die
drei Alt-Specs laufen damit erstmals gegen einen **in jedem Lauf frisch gebauten** Stand in eigenem Verzeichnis, ohne
`dist`, ohne Retry und mit durchgesetzter CSP (vorher `playwright.config.ts`: gemeinsamer `dist`-Build, `retries: 1`,
`bypassCSP`). Lokal unter Node 22 ausgefuehrt. **Quelle der Matrix:** `src/routing/routeRegistry.ts`
(`getCanonicalRouteEntries`, `getRouteTestMatrix`, Redirect-Register) und `seoRouteSource.ts` — keine Zahl hart kodiert
(Ausnahme Alt-Spec, PT275-F2).

| Vertrag                 | Beweis                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 200                     | jede Registry-Route x10 (43 Pfade → 430 URLs) mit Status 200, ohne `Location`, ohne 404-Marker (url-smoke) **und** mit vollstaendigem Head (Matrix); keine 302, kein 200-Fallback auf unbekannten Pfaden                                                                                                                                                                             |
| 301                     | alle 30 Registry-Redirects x10 mit Query, locale-los nach `/de`, `HEAD` ebenfalls 301, jeweils ein Hop auf 200 (url-smoke); jede kanonische Route locale-los → `/de/…` 301 → 200; Browser: `/de/services/dental?ref=…#ablauf` → genau ein 301, Query bleibt, Fragment bleibt clientseitig                                                                                            |
| 404                     | unbekannte statische und dynamische Pfade je Familie x10, bewusste No-Successor-Pfade x10 (url-smoke); zusaetzlich Events-, Consumer-, Epigenetik-Vertiefungs-, Befund-, Service-, Artikel- und Legacy-Service-Slugs x10 plus locale-los: 404, `noindex, follow`, Statusmarker, **kein** Canonical, **kein** hreflang, **kein** `og:url`                                             |
| Canonical               | fuer alle 430 URLs genau einer, selbstkonsistent = `https://polarisdx.net/{locale}{pfad}`, `og:url` identisch, `og:image` auf dem oeffentlichen Host, kein Preview-/Localhost-Host im Head                                                                                                                                                                                           |
| hreflang                | indexierbare Routen: exakt zehn Sprachen + `x-default` → `de` in der Registry-Reihenfolge; hreflang-Ziele der Sitemap erreichbar und selbstkanonisch (PT27.2 + sitemap-Spec)                                                                                                                                                                                                         |
| Legal                   | `privacy`, `imprint`, `terms`: Registry `NOINDEX_NOFOLLOW`, nicht sitemap-, nicht suchfaehig; ausgeliefert x10 `noindex, nofollow`, Canonical vorhanden, **keine** hreflang-Alternates, **nicht** in der Sitemap (S-08, SD-2); keine noindex-Route ist sitemap- oder suchfaehig                                                                                                      |
| Consumer x10            | 3 Produkte x10: 200, indexierbar, Canonical, hreflang x10 + x-default, produktspezifische OG-/Twitter-Werte, OG-Bild erreichbar, `Product`-JSON-LD ohne `offers`/`sku`/`gtin`/Bewertung, Sitemap (seo-head PT09.3); keine Shop-Kaufbehauptung                                                                                                                                        |
| Epigenetik x10          | Hub, drei Vertiefungen, sechs Musterbefunde x10 im Head-Matrix-Lauf; Guard `check:befunde-seo` 60/60 SSR-Heads mit Canonical, hreflang, Sitemap, Article/BreadcrumbList                                                                                                                                                                                                              |
| lastmod                 | Sitemap-XML des Servers: nur Artikel-URLs tragen `lastmod`, jeweils **genau** das `datePublished` des Artikels (60 URLs), gueltiges Datum, nicht in der Zukunft, so viele verschiedene Werte wie Publikationsdaten; alle anderen 330 URLs ohne `lastmod`                                                                                                                             |
| Search/Sitemap/Registry | ausgelieferte Sitemap = Registry-Ausgabe (Familien = sitemap-faehige Routen, jede `loc` bekannt, eindeutig, oeffentlicher Host, Anzahl = Familien x10); jedes Suchziel ist indexierbar und in allen zehn Sprachen 200; Guards `check:routes` (0 Spiegel in App/Server/Sitemap/Suche) und `check:search-index` gruen; Unit `routeResolution.test.ts` haelt Sitemap = Suche = Registry |
| Meta/Placeholder        | 430 Heads: genau ein Title und eine Description, nicht leer, kein Uebersetzungsschluessel, kein Platzhalter, keine `{{…}}`-Interpolation; `check:seo` Meta-Guard 380 Datensaetze 0 Befunde (1 Laengenwarnung)                                                                                                                                                                        |

## 19. Handoff PT27.5 → PT27.6

```text
HEAD: 48ca775 (0 Commits; Index durch Dritte gestaged, PT27.5 ungestaged darueber)
Changed files: e2e/pt27.5.config.ts (neu), e2e/pt27.5-seo-matrix.spec.ts (neu), package.json (test:seo:regression),
  building-docs/TESTING-CONTRACT.md, building-docs/state/AP-STATE.md
ROUTE REGRESSION COMMAND: npm run test:seo:regression (4 Guards + frischer Build, 76 Tests) — 76/76, Wiederholung 76/76
ROUTE MATRIX SOURCE: src/routing/routeRegistry.ts (43 kanonische Pfade, 39 sitemap, 35 Suche, 30 Redirects) + seoRouteSource.ts
200: PASS — 43 x10, Head vollstaendig, keine 302/Soft-200
301: PASS — 30 Redirects x10 + locale-los + HEAD, ein Hop; Browser: Query bleibt, Fragment clientseitig
404: PASS — alle Familien x10 inkl. Events/Consumer/Epigenetik/Befund/Service/Artikel/Legacy, kein Canonical/hreflang/og:url
CANONICAL: PASS — 430/430 selbstkonsistent, og:url gleich, oeffentlicher Host
HREFLANG: PASS — x10 + x-default de fuer alle indexierbaren Routen; Ziele erreichbar und selbstkanonisch
LEGAL: PASS — noindex, nofollow x10, nicht in Sitemap/Suche, keine Alternates, widerspruchsfrei
CONSUMER X10: PASS — 3x10 indexierbar, Product-/Social-Head ohne Kaufangaben
EPIGENETICS X10: PASS — Hub + 3 Vertiefungen + 6 Musterbefunde x10; check:befunde-seo 60/60
LASTMOD: PASS — 60 Artikel-URLs = datePublished, differenziert, keine Zukunft; 330 bewusst ohne lastmod
SEARCH/SITEMAP DRIFT: PASS — Sitemap = Registry, Suchziele x10 erreichbar, check:routes + check:search-index gruen
PROVEN - DO NOT REDISCOVER: Registry ist die einzige Routenquelle fuer App, SSR, Sitemap, Suche, SEOHead; Legal-Head hat Canonical
  aber keine Alternates; unbekannte locale-lose Pfade antworten direkt 404; Hash erreicht den Server nie; lastmod stammt nur aus
  articles.datePublished; die Alt-Specs url-smoke/seo-head/sitemap sind unter frischem Build und retries 0 gruen
PT27.6 PRIMARY WRITE SET: .github/workflows/ci.yml (additiv, geteilter Hotspot), package.json-Aggregat, ggf. Guard-Self-Tests
  fuer check:routes/check:search-index, Visual/A11y-Broad-Gate-Konfiguration, TESTING-CONTRACT/QUALITY-GATES-Delta, AP-STATE
OPEN PT27.6 DELTA: CI-Verdrahtung aller AP27-Kommandos (test:unit|component|server|guards|integration|integration:http|
  e2e:core|e2e:consent|seo:regression) inkl. Server-Deps (D-12) und eine Node-Version (TB-02); quality ab Lint rot (TB-04);
  E2E-Server-Identitaet der CI-Jobs (QD-4: routing/seo nutzen noch playwright.config.ts mit dist + retries 1); Visual/A11y
  Broad Gate (axe serious/critical 0, Visual ohne neue Art Direction); TB-05/PT274-F3 veraltete pt23.1-Tests; PT275-F1/F2;
  Gate 12 PARTIAL wegen AP26-WAIVER-01
```

## 20. Befunde PT27.5

| ID       | Befund                                                                                                                                                                          | Klasse                       | Owner          |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | -------------- |
| PT275-F1 | `check:routes` und `check:search-index` haben keinen Self-Test (anders als `check:i18n` und `check:seo`); ihre Drift-Erkennung ist nur indirekt ueber Unit-/E2E-Paritaet belegt | BASELINE_DEBT                | PT27.6         |
| PT275-F2 | `sitemap.spec.ts` kodiert die historische Zahl `390` hart; sie stimmt heute mit der Registry ueberein, die PT27.5-Matrix leitet sie ab                                          | BASELINE_DEBT                | PT27.6         |
| PT275-F3 | `check:seo` meldet eine Laengenwarnung (eine Beschreibung zu lang) — kein Fehler                                                                                                | Hinweis                      | Content (AP29) |
| PT275-F4 | `test:seo:regression` ist nicht in CI; die CI-Jobs `routing`/`seo` fuehren Teilmengen gegen `playwright.config.ts` (`dist`-Build, `retries: 1`) aus                             | LAUNCH_BLOCKER-Voraussetzung | PT27.6         |

## 21. Gate-Plattform (PT27.6, gemessen 2026-09-15)

Verbindliche CI-Beschreibung: `CI-CONTRACT.md`; Gate-Eigentum und Launch-Gate-Zuordnung: `QUALITY-GATES.md` §3.2, §12.1.
Jede AP27-Stufe hat genau ein Kommando, genau einen CI-Job und laeuft lokal identisch.

| Stufe                 | Kommando                                                                     | CI-Job                | Lokal (2026-09-15)                                                                                           |
| --------------------- | ---------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------ |
| Typecheck/Lint/Format | `tsc -b --noEmit`, `eslint .`, `prettier --check .`                          | `quality`             | PASS / PASS (0 Fehler, 1 Warnung) / PASS                                                                     |
| Build                 | `npm run build`                                                              | `quality`             | PASS (Node 22: `check:befunde` 60/60, Client + SSR; lokal in eigenes Verzeichnis, PT276-F7)                  |
| Guards                | `test:guards`, `check:befunde-seo`, `check:claims`, `check:visual-changelog` | `ap27-guards`         | PASS (Meta 380 Datensaetze, Befunde 60/60, Claims 0)                                                         |
| Unit/Component        | `test:unit`, `test:component`                                                | `ap27-tests`          | 379/379, 250/250 (Node 22)                                                                                   |
| Server/Integration    | `test:server`, `test:integration`                                            | `ap27-tests`          | 470/470, 16/16 (Node 18, siehe PT276-F5)                                                                     |
| Integration-HTTP      | `test:integration:http`                                                      | `ap27-journeys`       | 12/12 (frischer Build, retries 0)                                                                            |
| E2E Kern              | `test:e2e:core`                                                              | `ap27-journeys`       | 15/15 (frischer Build, retries 0)                                                                            |
| Consent               | `test:e2e:consent`                                                           | `ap27-journeys`       | Lauf 1: 10/11 (1 Flake, PT276-F8); Wiederholungen 11/11, 11/11; Einzeltest 20/20 — nicht maskiert, retries 0 |
| Route/SEO             | `test:seo:regression`                                                        | `ap27-seo-regression` | 76/76 (Guards + frischer Build)                                                                              |
| A11y                  | `a11y:suite` (PT24.1–PT24.6)                                                 | `ap27-a11y`           | 280/280 (118/41/31/20/45/25, Node 22); nach den letzten Code-Fixes PT24.5 45/45, PT24.6 axe 25/25            |
| Visual                | `test:visual` im Image `mcr.microsoft.com/playwright:v1.57.0-noble`          | `ap27-visual`         | 21/21, zwei Bestaetigungslaeufe 21/21; dritter Lauf nach den letzten Code-Fixes 21/21                        |

**Harte Gates:** alle Zeilen; kein `continue-on-error`, AP27-Configs `retries: 0`. **Aggregat:** `ap27-gate` verlangt
zusaetzlich `performance` (AP25) und `security`/`security-runtime` (AP26), ohne deren Schwellen zu veraendern.

**A11y-Regression:** AP24 wird wiederverwendet, nicht neu geschrieben — Skip-Link und `<main>` (PT24.1), Tastatur/Fokus
inkl. Dialoge und Menues (PT24.2/PT24.3), Kontrast/Medien (PT24.4), Reduced Motion (PT24.5), axe-Gate serious/critical
= 0 (PT24.6). WCAG 2.2 AA bleibt **Qualitaetsziel**, keine Zertifizierung; die Screenreader-Checkliste ist manuell und
nicht ausgefuehrt (NOT_RUN_ENVIRONMENT).

## 22. Visual Regression und Baseline-Protokoll

**Zweck:** unbeabsichtigte visuelle Aenderungen repraesentativer Seiten und Zustaende sichtbar machen — nicht jede
Route x Locale, keine neue Art Direction. Light/Sales-Machine ist die visuelle Wahrheit.

**Umfang (`e2e/pt27.6-visual.spec.ts`, 21 Baselines):** Desktop 1280x800 — Home, Diagnostik-Hub, Service-Detail,
IglooPro, Epigenetik-Hub, Musterbefund, Artikel, Resource Center, Kontakt, Support, Datenschutz, Consumer-Spray,
404; Zustaende Epigenetik-Panel, Download-Gate offen, Diagnostik-Mega-Menue offen, Suche offen mit Treffern,
Cookie-Banner. Mobil 390x844 — Home, Navigation offen, Consumer-Spray.

**Determinismus:**

| Quelle              | Massnahme                                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| Plattform/Schriften | nur im gepinnten Image `mcr.microsoft.com/playwright:v1.57.0-noble` (lokal `test:visual:docker`, CI Container) |
| Viewport/Skalierung | feste Viewports, `deviceScaleFactor: 1`, `scale: 'css'`                                                        |
| Bewegung            | `reducedMotion: 'reduce'`, `animations: 'disabled'`, `caret: 'hide'`                                           |
| Zeit/Locale         | `page.clock.setFixedTime(2026-09-15T08:00Z)`, `de-DE`, `Europe/Berlin`                                         |
| Consent             | Entscheidung vorbelegt (alles abgelehnt); nur der Banner-Zustand startet ohne Entscheidung                     |
| Netzwerk            | alle Hosts ausser `127.0.0.1` abgebrochen; Backend tot (`BACKEND_URL` Port 9) — keine Provider-Aufrufe         |
| Laden               | `networkidle`, `document.fonts.ready`, sichtbare Bilder dekodiert; Klicks nach Hydration per Zielzustand       |
| Build               | frischer Client-/SSR-Build in eigenes Cache-Verzeichnis                                                        |
| Toleranz/Retries    | `maxDiffPixels: 0`, `retries: 0`, `workers: 1` — kein Maskieren von Flakes                                     |

**Baseline-Update-Protokoll (verbindlich):**

1. Ein roter Visual-Lauf ist zuerst ein **Befund**: Diff-Artefakt (`ap27-visual-diffs`) ansehen und die Ursache benennen.
2. Unbeabsichtigter Delta → Code korrigieren, Baseline bleibt. `--update-snapshots` ist **nie** eine Fehlerbehebung.
3. Beabsichtigter Delta (genehmigte Design-/Content-Aenderung) → nur die betroffenen Bilder neu aufnehmen, ausschliesslich
   im gepinnten Image: `docker run … mcr.microsoft.com/playwright:v1.57.0-noble npx playwright test --config
e2e/pt27.6-visual.config.ts --update-snapshots -g "<Zustand>"`.
4. Zweiter Lauf **ohne** Update muss gruen sein.
5. Im selben Change einen Eintrag in `DESIGN-SYSTEM-CHANGELOG.md`: Ursache, betroffene Screenshots, Design-Delta, Reviewer.
   `check:visual-changelog` (CI: `--base`) bricht sonst.
6. In CI werden Baselines nie erzeugt oder aktualisiert.

**Flake-Politik (alle AP27-Stufen):** `retries: 0`; ein Test, der nur im zweiten Anlauf gruen wird, ist rot. Kein
`sleep`/`waitForTimeout` als Synchronisation — gewartet wird auf beobachtbare Zustaende (Response, DOM, Netzruhe).
**Testdaten:** ausschliesslich synthetisch (reservierte RFC-2606-Domains `praxis.example`, `polarisdx.example`; feste
Fixture-Inhalte). **Provider-Isolation:**
CRM/Mail ueber skriptierte Transporte bzw. tote Ports, Analytics/Shop-Hosts im Browser abgefangen, keine
Produktions-Credentials in Tests, Reportern oder Snapshots.

## 23. Handoff PT27.6 → AP27-CLOSURE

```text
HEAD: 48ca775 (0 Commits; Index durch Dritte gestaged, PT27.2–PT27.6 ungestaged darueber)
Changed files PT27.6: .github/workflows/ci.yml (Server-Deps in quality; Jobs ap27-tests|guards|journeys|seo-regression|
  a11y|visual + ap27-gate), package.json (test:visual, test:visual:docker, check:visual-changelog, check:claims),
  e2e/pt27.6-visual.config.ts + .spec.ts + 21 Baselines, scripts/check-visual-baseline-changelog.mjs (neu),
  scripts/check-epigenetics-claim-contract.mjs (gated Asset-Pfad), eslint.config.js, .prettierignore,
  src/components/ui/Reveal.tsx, src/pages/consumer/{OrderModal,orderModalContext,MaskPage,SprayPage,shell,PriceBadge}.tsx,
  8 Doku-Dateien prettier-formatiert, building-docs/{CI-CONTRACT (neu),QUALITY-GATES,TESTING-CONTRACT,DESIGN-SYSTEM-CHANGELOG};
  AP-STATE unveraendert (State-Update nur bei PASS)
CI REACH: verdrahtet und lokal reproduziert; remote 0 Laeufe — Branch nicht auf origin, nichts committet; main ohne
  Branch Protection → OWNER_BOUND (Repository-Owner: Commit/Push, Pflichtcheck "AP27 Launch gate aggregate")
PROVEN - DO NOT REDISCOVER: Visual nur im gepinnten Image bitgleich; set-state-in-effect-Fixes ueber useSyncExternalStore
  (Reveal behaelt Early-Return ohne Observer); Claim-Guards liefen nie in CI und der Epigenetik-Guard kannte den
  gated ZIP-Pfad nicht; server/pt08-2-i18n startet unter Node 18 nicht (jsdom), 470/470 trotzdem gruen
OPEN FOR CLOSURE: Remote-CI-Lauf auf dem Relaunch-SHA; TB-02 Node-Pin; TB-05 veraltete pt23.1-Specs; PT275-F1/F2;
  PT276-F1..F8 (F8 Consent-Flake); Gates 1/3/11/12 PARTIAL bzw. OWNER_BOUND (QUALITY-GATES §12.1)
```

## 24. Befunde PT27.6

| ID       | Befund                                                                                                                                                                                                                                                                                                                                                                                        | Klasse                       | Owner                      |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | -------------------------- |
| PT276-F1 | Geoeffnetes Diagnostik-Mega-Menue ragt bei 1280 px links aus dem Viewport; erste Spalte abgeschnitten (Baseline haelt den Ist-Stand)                                                                                                                                                                                                                                                          | Produktbefund (visuell)      | AP06 / Design-Owner        |
| PT276-F2 | Fixierter Header ueberdeckt auf der Startseite die Eyebrow-Zeile des Hero                                                                                                                                                                                                                                                                                                                     | Produktbefund (visuell)      | AP06 / Design-Owner        |
| PT276-F3 | Geoeffneter Download-Gate-Zustand laesst die rechte Rasterspalte leer                                                                                                                                                                                                                                                                                                                         | Produktbefund (visuell)      | AP19 / Design-Owner        |
| PT276-F4 | Relaunch-Linie nicht auf `origin`, nicht committet; `main` ohne Branch Protection — kein CI-Gate kann remote laufen oder erzwungen werden                                                                                                                                                                                                                                                     | LAUNCH_BLOCKER-Voraussetzung | Repository-Owner           |
| PT276-F5 | Lokale Node-18/22-Aufteilung: `server/pt08-2-i18n.test.ts` startet unter Node 18 nicht (`ERR_REQUIRE_ESM`, vitest exit 1 trotz 470/470); CI nutzt Node 22; kein Repo-Pin (TB-02)                                                                                                                                                                                                              | BASELINE_DEBT                | AP27-CLOSURE / Operator    |
| PT276-F6 | Alt-Jobs `quality`/`routing`/`seo` laufen gegen `playwright.config.ts` mit `retries: 1`; die AP27-Jobs pruefen dieselben Specs mit frischem Build und `retries: 0`                                                                                                                                                                                                                            | BASELINE_DEBT                | AP27-CLOSURE               |
| PT276-F7 | Lokales `dist/` (gitignored) gehoert zu 614/618 Dateien `root` (fremder Container-Lauf 2026-09-01); `npm run build` scheitert lokal mit `EACCES` beim Leeren. Nachweis daher mit identischen Build-Schritten in eigenes Verzeichnis; CI-Checkout hat kein `dist/`. Nicht veraendert                                                                                                           | Umgebung                     | Operator (lokale Maschine) |
| PT276-F8 | FLAKE: `pt27.4-consent` „ein abgelehnter Vorgang loest keine Konversion aus" fand im ersten PT27.6-Lauf den Banner-Button „Alle akzeptieren" auf `/de/contact` 20 s lang nicht (1 von 53 Ausfuehrungen; danach 11/11, 11/11 und isoliert 20/20). Ursache ungeklaert, Fehlerkontext vom Folgelauf ueberschrieben. Nicht per Retry/Timeout maskiert; kann `ap27-journeys` sporadisch rot machen | FLAKE (offen)                | AP27-CLOSURE               |

## 25. Aenderungsprotokoll

| Datum      | PT     | Aenderung                                                                                                                                                                                                                        |
| ---------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-09-15 | PT27.1 | Vertrag angelegt: Pyramide, Toolchain-Wahrheit, Kommandos, Vertragsabdeckung, Baselines TB-01..07, CI-Reichweite, Luecken, Handoff                                                                                               |
| 2026-09-15 | PT27.2 | §9 Integrationsstufe (Harness, `test:integration`, `test:integration:http`, Vertragsbeweise), §10 Handoff PT27.3, §11 Befunde PT272-F1..F3; Pyramidenzeile Integration aktualisiert                                              |
| 2026-09-15 | PT27.3 | §12 E2E-Kernjourneys (Kommando `test:e2e:core`, Hold-Beweismuster, Journey-Beweise, Flake-Status), §13 Handoff PT27.4, §14 Befunde PT273-F1..F4 (F1 behoben), Kommando-Tabelle unit 379                                          |
| 2026-09-15 | PT27.4 | §15 Consent-/Tracking-E2E (Kommando `test:e2e:consent`, Netz-Isolation per Stub, Vertragsbeweise, Flake-Status), §16 Handoff PT27.5, §17 Befunde PT274-F1..F4                                                                    |
| 2026-09-15 | PT27.5 | §18 Route-/SEO-Regression (Kommando `test:seo:regression`, Alt-Specs unter frischem Build, 430-Head-Matrix, 404/301/lastmod/Drift), §19 Handoff PT27.6, §20 Befunde PT275-F1..F4                                                 |
| 2026-09-15 | PT27.6 | §21 Gate-Plattform (Stufe → Kommando → CI-Job), §22 Visual Regression + Baseline-Protokoll + Flake-/Daten-/Isolationsregeln, §23 Handoff AP27-CLOSURE, §24 Befunde PT276-F1..F6; Aenderungsprotokoll → §25; `CI-CONTRACT.md` neu |
