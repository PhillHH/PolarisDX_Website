# ROUTING-CONTRACT

**Guard-Level: G1/G3.** Wer eine der in §3 genannten Kerndateien ändert, folgt zwingend der
Kontextpflicht in §7. Blindes Editieren ist untersagt.

---

## 1. Purpose

Dieser Vertrag legt fest, wie URLs in der PolarisDX-Relaunch-Site funktionieren müssen — welche
Zusagen niemals gebrochen werden dürfen, welche Dateien heute daran beteiligt sind, und welche
Prüfungen eine Routing-Änderung bestehen muss.

Er ist **kein Audit**. Die zugrundeliegenden Messungen stehen in `QUALITY-BASELINE-LIVE.md` §13.3 und
`IMPLEMENTATION-HOTSPOTS.md` §4.1/§4.2/§6; hier steht nur, was daraus als Regel folgt.

---

## 2. Authority

Verbindlich in dieser Reihenfolge (`PROJECT-CONSTRAINTS.md`):
`scope/MASTER-SCOPE.md` → `PROJECT-CONSTRAINTS.md` → Repository-Evidenz → `BRANCH-RECONCILIATION-MAP.md`
→ `REPO-BASELINE.md` → historische Dokumentation.

**Zuständige APs:** **AP10** (Eigentümer), AP02 PT02.2 (Zielbild), AP03 (IA/Inventar), AP06 (Shell-Links),
AP07 (Such-Index), AP09 (SEO-Ableitung), AP15/AP16 (Epigenetik-Routen), AP17/AP18 (Artikel/Events),
AP20 (Legal/Contact), AP21 (Consumer × 10), AP27 (Guards), AP29 (Migration), AP30 (RC-Abnahme).

**Stand AP02 PT02.2 (2026-08-24):** Das Routing-Zielbild ist festgeschrieben — Ist-Erhebung in **§3.1**,
Zielinvarianten **R-17 bis R-53** (URL-/Locale-Vertrag, Route-Klassen, Route Registry, dynamische
Ressourcen, Redirects, Status, Canonical/hreflang, Konsumenten, Consumer × 10, Epigenetik), Schulden
**RD-8 bis RD-14**, Regeln **M-06 bis M-08**, Nachweise **T-11 bis T-20** mit RTG-Zuordnung, Owner-Grenzen
**§10.1**. PT02.2 ist ein reiner **Dokumentationsschritt**: keine Quell-, Laufzeit-, Konfigurations- oder
Abhängigkeitsdatei wurde geändert, **keine Route Registry implementiert**, keine AP03-/AP06-/AP07-/AP09-/
AP10-/AP15-/AP16-/AP21-/AP27-Arbeit vorgezogen. Der SSR-/Rendering-Vertrag aus **AP02 PT02.1**
(`RUNTIME-CONTRACT.md` RT-38–RT-70) gilt unverändert und wird hier nicht neu verhandelt.

**Baseline:** `feat/home-leadmagnet@961f65d`. **Decision Locks unverändert** — dieser Vertrag setzt
`DEC-RL-001` (10 Sprachen), `DEC-RL-006` (Consumer indexierbar) und `REST-03` (Consumer × 10) um, er
verhandelt sie nicht.

### 2.1 PT10.1 operational redirect contract (2026-08-28)

**Verified context:** Branch `console/10-15-2026-08-28T08-18-27`, start HEAD
`a52ba7ea3a3ba3b4ded45969eb48895b02bbd439`, clean start tree, AP09 Closure `PASS`, Decision Locks
`18/18`. This subsection remains the PT10.1 primary-redirect baseline. The complete currently-known
legacy classification is now recorded in §2.2; only the central Route Registry remains PT10.3.

**Redirect status contract:** public migration sources answer `301 Moved Permanently` on `GET` and
`HEAD`. Their `Location` is the final locale-aware canonical path; the request query string is retained
byte-for-byte. Targets answer 200 without another `Location`. Redirect sources are not app routes,
canonical URLs, sitemap entries, search targets, or Known Paths. HTTP never receives fragments, so no
server-side fragment migration is claimed.

**Initial primary redirect map:**

| Source pattern                                            | Decision / direct target                    | Status | Hops | Target evidence                      |
| --------------------------------------------------------- | ------------------------------------------- | ------ | ---- | ------------------------------------ |
| `/`                                                       | `/de/`                                      | 301    | 1    | 200                                  |
| `/<known-public-path>`                                    | `/de/<known-public-path>`                   | 301    | 1    | 200                                  |
| `/services`                                               | `/de/diagnostics`                           | 301    | 1    | 200                                  |
| `/<locale>/services`                                      | `/<locale>/diagnostics`                     | 301    | 1    | 200                                  |
| `/services/<real-service-slug>`                           | `/de/diagnostics/<real-service-slug>`       | 301    | 1    | 200                                  |
| `/<locale>/services/<real-service-slug>`                  | `/<locale>/diagnostics/<real-service-slug>` | 301    | 1    | 200                                  |
| `/agb`                                                    | `/de/terms`                                 | 301    | 1    | 200                                  |
| `/<locale>/agb`                                           | `/<locale>/terms`                           | 301    | 1    | 200                                  |
| `/s3-leitlinie`                                           | `/de/s3_leitlinie`                          | 301    | 1    | 200                                  |
| `/<locale>/s3-leitlinie`                                  | `/<locale>/s3_leitlinie`                    | 301    | 1    | 200                                  |
| `/services/<unknown-slug>` and locale-prefixed equivalent | intentional direct 404; no migration target | 404    | 0    | no `Location`, no soft-home redirect |

`<real-service-slug>` is validated against `src/data/services.tsx`; a URL is not accepted merely
because it matches `/services/:slug`. Unknown unprefixed paths are internally rendered in the default
locale and answer 404 at their original URL, avoiding 301-to-404 chains.

**Locale and specialty hard guards:** the canonical Consumer families, `/s3_leitlinie`, and
`/vitamin-d3-implantologie` answer 200 directly in each of `de en pl fr it es pt da nl cs`. No
Consumer-to-EN or S3/Implantology-to-DE force redirect exists. A locale prefix is never duplicated.

**PT10.1 evidence:** `e2e/url-smoke.spec.ts` now asserts status, exact `Location`, query retention,
one-hop target 200, all 9 real service slugs × 10 locales, unknown-service 404, and 30/30 direct
specialty cases. It also verifies all 39 sitemap families plus 4 unsitemapped known paths as direct
unprefixed→DE migrations. Production Playwright passed URL smoke 31/31 and the unchanged AP08 routing
regression 35/35. The independent HTTP matrix passed all 10 representative redirect sources, 3 direct
404 cases and 30/30 specialty routes. Loops: 0. Unnecessary chains: 0. Redirect targets below 200: 0.

### 2.2 PT10.2 complete currently-known legacy URL map (2026-08-28)

**Scope and status vocabulary.** This map classifies every relevant URL candidate found in the current
repository, its canonical context documents, the stale prerender catalogue, the inactive Vercel
configuration, route audits, content data and current link targets. It does not invent external
backlinks. Each row has exactly one decision:

- `REDIRECT_301` — a real predecessor has a truthful canonical successor and redirects there directly;
- `GONE_OR_404_INTENTIONAL` — no truthful successor exists, so the source remains a direct 404;
- `CURRENT_CANONICAL` — the investigated URL is already the current public path and is not a redirect
  source;
- `DEFERRED_MIGRATION_DISCOVERY` — discovery requires external crawl, Search Console or backlink data
  that is not present in this repository. Owner: **AP29**.

All path rows are locale families: a supported `/<locale>` prefix is preserved; an unprefixed source
uses `de`. Redirects retain the request query and reach a 200 canonical target in one hop. A source not
listed or not validated by its real data source is not accepted merely because it matches a dynamic
pattern. No row redirects to `/` as a substitute for missing content.

#### Evidence inventory and authority

| Evidence source                                                           | Finding                                                                                               | Decision use                                                                 |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `server.ts` and `src/routing/legacyRedirects.ts`                          | active HTTP aliases, real-service validation, article-ID and service-key migrations                   | active `REDIRECT_301` execution                                              |
| `src/App.tsx`                                                             | no remaining client `/services*` redirect; current canonical route patterns; `ScrollToHash`           | `CURRENT_CANONICAL`; HTTP remains primary                                    |
| `scripts/prerender.mjs` plus `projektverzeichnis/10-befunde.md` §1        | 6 article IDs, 3 removed article IDs and 6 underscore service keys                                    | redirect or intentional-404 rows below                                       |
| `vercel.json` plus `projektverzeichnis/10-befunde.md` §4                  | inactive pre-SSR `/services*` wildcard, not a current deploy path                                     | evidence for the known namespace only; it does not override slug validation  |
| production static serving of `public/downloads/`                          | asset-directory name collides with the current `/downloads` page                                      | directory redirects disabled; page canonicalizes directly, files stay served |
| `src/data/articles.ts`                                                    | 6 real ID→slug pairs; 3 stale IDs absent                                                              | article migration target truth                                               |
| `src/data/services.tsx`                                                   | 9 real canonical IDs; 6 translation keys use old underscores                                          | service migration target truth                                               |
| `src/content/befunde/meta.ts`, `legacyAnchors.ts`, `MusterbefundPage.tsx` | 6 canonical Befund slugs and explicit client-only old-anchor compatibility                            | path/fragment decisions below                                                |
| `IA-INVENTORY.md`, `CONTENT-MATRIX.md`, AP07 findability guards           | Case Study, Shop, Deal and Voucher are locked backlog/non-routes; `/consumer` hub is not required     | intentional 404, never Home soft-migration                                   |
| current content/locales and repository link sweep                         | no productive internal `/services*`, article-ID, underscore-route or obsolete Terms/S3 target remains | migration sources stay sources, not current links                            |

`scripts/prerender.mjs` is now explicitly `LEGACY_NON_AUTHORITATIVE`, disabled and route-list-free;
the former competing catalogue was eliminated in PT10.3. `vercel.json` remains an inactive deployment
remnant; the Express SSR path is authoritative for the current deployment.

#### `REDIRECT_301` — complete active migration sources

| Source path without locale                                                                                                                                     | Direct canonical target                                                   | Evidence                              | Hops |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------- | ---- |
| `/agb`                                                                                                                                                         | `/terms`                                                                  | primary Terms alias                   | 1    |
| `/s3-leitlinie`                                                                                                                                                | `/s3_leitlinie`                                                           | primary spelling alias                | 1    |
| `/services`                                                                                                                                                    | `/diagnostics`                                                            | structural predecessor                | 1    |
| `/services/{dental,beauty,longevity,poc-systemloesungen,praeventions-checks,infektion-entzuendung,stoffwechsel-herz,hormon-tests,kompatibilitaet-integration}` | matching `/diagnostics/<real-id>`                                         | 9 real `services.tsx` IDs             | 1    |
| `/articles/green_practice`                                                                                                                                     | `/articles/die-gruene-praxis`                                             | `articles.ts` ID→slug                 | 1    |
| `/articles/invisible_patient`                                                                                                                                  | `/articles/der-unsichtbare-patient`                                       | `articles.ts` ID→slug                 | 1    |
| `/articles/five_minute_diagnosis`                                                                                                                              | `/articles/die-5-minuten-diagnose`                                        | `articles.ts` ID→slug                 | 1    |
| `/articles/ecosystem_of_rapid_tests`                                                                                                                           | `/articles/the-ecosystem-of-rapid-tests-why-compatibility-creates-safety` | `articles.ts` ID→slug                 | 1    |
| `/articles/rapid_setup_formula`                                                                                                                                | `/articles/die-performance-formel-effizienz-in-der-poc-diagnostik`        | `articles.ts` ID→slug                 | 1    |
| `/articles/precision_point_of_care`                                                                                                                            | `/articles/precision-in-point-of-care-the-key-to-patient-safety`          | `articles.ts` ID→slug                 | 1    |
| `/diagnostics/poc_systemloesungen` and `/services/poc_systemloesungen`                                                                                         | `/diagnostics/poc-systemloesungen`                                        | stale prerender key and old namespace | 1    |
| `/diagnostics/praeventions_checks` and `/services/praeventions_checks`                                                                                         | `/diagnostics/praeventions-checks`                                        | stale prerender key and old namespace | 1    |
| `/diagnostics/infektion_entzuendung` and `/services/infektion_entzuendung`                                                                                     | `/diagnostics/infektion-entzuendung`                                      | stale prerender key and old namespace | 1    |
| `/diagnostics/stoffwechsel_herz` and `/services/stoffwechsel_herz`                                                                                             | `/diagnostics/stoffwechsel-herz`                                          | stale prerender key and old namespace | 1    |
| `/diagnostics/hormon_tests` and `/services/hormon_tests`                                                                                                       | `/diagnostics/hormon-tests`                                               | stale prerender key and old namespace | 1    |
| `/diagnostics/kompatibilitaet_integration` and `/services/kompatibilitaet_integration`                                                                         | `/diagnostics/kompatibilitaet-integration`                                | stale prerender key and old namespace | 1    |
| any current public path without locale                                                                                                                         | same canonical path under `/de`                                           | PT10.1 locale canonicalization        | 1    |

The fixed/content migration evidence subset remains the typed `LEGACY_REDIRECT_MIGRATIONS` array.
The central Registry classifies it together with structural `/services*` sources, derives the complete
30-source redirect matrix and G1-validates every target against canonical route truth.

#### `GONE_OR_404_INTENTIONAL` — known candidates without a truthful successor

| Source path without locale                            | Reason                                                                   | HTTP / redirect   |
| ----------------------------------------------------- | ------------------------------------------------------------------------ | ----------------- |
| `/articles/first_checkup`                             | stale prerender ID; absent from current article data; no named successor | direct 404 / none |
| `/articles/managing_diabetes`                         | stale prerender ID; absent from current article data; no named successor | direct 404 / none |
| `/articles/home_care`                                 | stale prerender ID; absent from current article data; no named successor | direct 404 / none |
| `/services/<unknown-slug>`                            | pattern alone is not resource evidence                                   | direct 404 / none |
| `/consumer`                                           | `CONSUMER_HUB = NOT_REQUIRED`; the 3 product pages remain current        | direct 404 / none |
| `/shop`                                               | Decision Lock backlog, no current product route                          | direct 404 / none |
| `/casestudys/32reasons` and `/case-studies/32reasons` | disabled/backlog Case Study spellings; no current page                   | direct 404 / none |
| `/deal`, `/voucher`                                   | Decision Lock backlog, no current page                                   | direct 404 / none |
| every other unknown static/dynamic path               | no repository-backed successor                                           | direct 404 / none |

These decisions explicitly prohibit Homepage redirects and preserve the source locale on the 404
request URL. They do not create `410 Gone`; the current runtime's truthful absent-resource semantic is 404.

#### `CURRENT_CANONICAL` — investigated paths that stay current

| Current family                                                                              | Canonical source of truth / decision                                  |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `/diagnostics` and all 9 `/diagnostics/<service.id>` paths                                  | current service routes from `services.tsx`; hyphen IDs stay canonical |
| `/articles` and all 6 `/articles/<article.slug>` paths                                      | current article routes from `articles.ts`; IDs are not paths          |
| `/terms`, `/s3_leitlinie`                                                                   | verified current App routes; alias spellings redirect to these        |
| `/epigenetics`, its 3 deepening paths, and `/epigenetics/musterbefund/<6 real slugs>`       | current Epigenetics/Befund family from current route/content data     |
| `/epigenetics#musterbefunde`, `#analysen`, `#vergleich`, `#studienlage`, `#werte-verstehen` | real current in-app anchors; fragments never reach HTTP               |
| stable anchors emitted by the 6 current Musterbefund documents                              | current client targets; no path redirect                              |
| the remaining active static paths in the stale prerender list                               | still current App paths; no migration is performed                    |

The canonical `/downloads` page shares its first segment with the real public asset directory.
Production `express.static` therefore runs with `redirect: false`: otherwise Express would emit an
unrelated slash redirect before routing and create `/downloads` → `/downloads/` → `/de/downloads/`.
The application URL now follows the normal one-hop locale rule; concrete `/downloads/<file>` assets
remain directly readable.

#### Epigenetics / Befund fragment compatibility

HTTP sees only the path and query, never `#fragment`; therefore PT10.2 claims no server-side hash
redirect. `src/content/befunde/legacyAnchors.ts` is the evidence-backed compatibility map for old DE/EN
heading-derived anchors on all 6 real Befund slugs. `MusterbefundPage.tsx` replaces a known obsolete
fragment with its stable current anchor after hydration and scrolls to the real target. Unknown
fragments are left unchanged. A browser regression test covers a real old
`metabolic-health#adipositas-und-diabetes-veranlagung-13` link becoming `#marker-4` while the path
stays 200.

#### `DEFERRED_MIGRATION_DISCOVERY` — AP29 handoff

| Discovery set                                                                                                                                             | Status                         | Owner    | AP10 closure blocker |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | -------- | -------------------- |
| URLs discoverable only through production crawl history, Search Console exports, access logs or external backlink datasets not present in this repository | `DEFERRED_MIGRATION_DISCOVERY` | **AP29** | **NO**               |

AP29 must compare those external observations with this classified map and return genuinely new
sources for an explicit redirect-or-gone decision. Absence of external data is not represented as a
claim that no additional historic backlinks exist.

#### PT10.2 regression contract

`src/routing/legacyRedirects.test.ts` checks unique sources, real non-Home targets, all article ID→slug
pairs, all 6 underscore service changes across both known namespaces, all active stale-prerender paths
classified, all four decision statuses present and the AP29 owner handoff. `e2e/url-smoke.spec.ts`
executes every `REDIRECT_301` content/alias source over all 10 locales plus its unprefixed DE form,
asserts exact status and `Location`, query retention, direct target 200 and no target `Location`; it
also asserts every explicit intentional-404 candidate stays a direct non-Home 404 and verifies one
real old Befund anchor in the browser. Therefore loops and unnecessary redirect chains are both hard
failures.

**Measured PT10.2 result:** typed map/unit plus sitemap parity **19/19** in the targeted run and
**291/291** in the complete test run; production URL/redirect matrix **54/54**; unchanged AP08
locale/specialty matrix **35/35**; Typecheck, task-file ESLint/Prettier, production build, G3 SEO,
Search and internal-findability guards `PASS`. Every map target returned 200 without `Location`;
redirect loops **0**, unnecessary chains **0**, Home soft-migrations **0**, locale distortions **0**.
The repository-wide pre-existing quality baseline remains exactly **120 ESLint errors + 3 warnings**
and **34 Prettier files**; no changed PT10.2 file contributes a finding.

### 2.3 PT10.3 central Route Registry (2026-08-28)

**Verified start context:** Branch `console/10-15-2026-08-28T08-18-27`, HEAD
`8a142173a5e2f89de09af2e76a1ce28ea243782e`, clean start tree, PT10.1/10.2 `PASS`, Decision Locks
`18/18`, AP11 `NOT STARTED`.

**Registry path and schema:** `src/routing/routeRegistry.ts` is the single operative route-metadata
truth. It models stable ID, path pattern, route type, x10 locale behavior, indexability, sitemap
policy, search eligibility, Known-Path/App eligibility, shell, dynamic source and optional truthful
`lastmod`. Redirect sources are explicitly classified with 301 status and final target. The registry
contains **25 route families** (22 static, 3 dynamic) and expands to **43 concrete canonical paths**;
it is metadata, not a content database.

**Dynamic sources:** `SERVICES` reads 9 IDs from `src/data/services.tsx`; `ARTICLES` reads 6 real
slugs/IDs and publication dates from `src/data/articles.ts`; `BEFUNDE` reads 6 slugs from
`src/content/befunde/meta.ts`. No slug list is copied into the Registry.

**Consumer mapping:** the three canonical families `vitamin-d3-spray`, `hydrating-masks` and
`inside-out-duo` are `CONSUMER_PRODUCT`, `LOCALIZED_X10`, `INDEX_FOLLOW`, sitemap-eligible and use the
Consumer shell. They remain non-EN-forced and are not silently promoted into the B2B navigation.

**Consumer mapping and mirror elimination:**

| Consumer                         | Registry derivation                                                                                                           |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `src/App.tsx`                    | renders static/dynamic definitions; exhaustive typed component Records retain lazy-import/UI separation                       |
| `server.ts`                      | `isKnownCanonicalPath` and `getRegistryRedirectTarget`; no `EXTRA_KNOWN_PATHS`, sitemap-derived Known Paths or service mirror |
| `src/components/seo/sitemap.ts`  | maps the 39 registry sitemap entries; no manual static/dynamic family table                                                   |
| `src/hooks/useSearch.ts`         | maps the 35 registry-search-eligible paths; Search retains only copy/type/priority metadata keyed by route family             |
| `src/components/seo/SEOHead.tsx` | resolves the current concrete Registry route and hard-fails known-route indexability contradictions                           |
| Redirect/runtime tests           | `getRouteTestMatrix()` supplies static, dynamic, sitemap, search, redirect, noindex and intentional-404 classifications       |
| Header/Footer target validation  | G1 validates curated IA targets against concrete Registry Known Paths; navigation order/content remains an IA concern         |
| `scripts/prerender.mjs`          | `LEGACY_NON_AUTHORITATIVE`, deliberately disabled, contains no route catalogue                                                |

**G1 — Route Registry Parity:** canonical command `npm run check:routes`. It hard-fails App/Registry,
Known-Path, Sitemap, Search, SEO-awareness or redirect-target drift; invalid dynamic sources;
duplicate IDs/patterns/canonical paths; stale mirrors; and invalid Header/Footer targets. Current
result: **PASS** — 25 families, 43 canonical paths, 39 sitemap paths, 35 Search paths, 30 classified
redirect sources, 0 stale mirrors. `.github/workflows/ci.yml` executes G1 in the independent `routing`
job (not gated behind the repository-wide lint baseline) for `main`, `feat/home-leadmagnet` and
`console/**` pull requests and pushes: **CI ACTIVE**.

**Runtime/test evidence:** Typecheck PASS; targeted Registry/Redirect/Sitemap/SEOHead/Search unit
tests **37/37 PASS**, complete Unit/Component suite **296/296 PASS**; G1, G3, Search and
internal-findability guards PASS; production client/SSR build PASS; Registry-derived URL/redirect
smoke **80/80 PASS**; AP08 x10 plus AP09 SEO/Sitemap regression **45/45 PASS**. Sitemap invariants
remain 39 families × 10 = 390 unique public canonical URLs, no noindex/redirect/404 source, with 60
truthful article lastmods.

**DG09-01 — ROUTE_REGISTRY_INTEGRATION:** `RESOLVED` by AP10 PT10.3. Sitemap uses the Registry;
Search path truth uses the Registry; SEOHead is Registry-compatible; Known Paths and redirect targets
are Registry-driven; tests derive their matrix from the Registry; and no competing authoritative
route mirror remains. It is no longer a launch blocker. PT10.4 remains owner of the broader integrated
HTTP status matrix, now resolved in §2.4; no PT10.4 work or later page AP was pulled forward in
PT10.3.

### 2.4 PT10.4 integrated HTTP status regression (2026-08-28)

**Verified start context:** Branch `console/10-15-2026-08-28T08-18-27`, HEAD
`8a142173a5e2f89de09af2e76a1ce28ea243782e`, PT10.1–PT10.3 `PASS`, Decision Locks `18/18`, AP11
`NOT STARTED`. The already staged predecessor delta and the separately staged foreign
`building-docs/work-packages/AP11.md` were not reset, reformatted or modified by PT10.4.

**Canonical HTTP matrix:** `getRouteTestMatrix()` now derives safe unknown-static and unknown-dynamic
test cases alongside all canonical/redirect/noindex/intentional-404 classifications. The canonical
command `npm run check:http-status` runs the existing `e2e/url-smoke.spec.ts` against the production
SSR build and is the combined HTTP gate:

- **G2 — real HTTP 404/status synchronization:** all 43 concrete Registry paths × all 10 Locales =
  **430/430 HTTP 200**, including 9 Services, 6 Articles, 6 Musterbefunde and all Consumer/specialty
  pages. One safe unknown static path plus one generated unknown slug for each of the three dynamic
  families × 10 = **40/40 HTTP 404**. All 9 repository-known intentional no-successor paths × 10 =
  **90/90 HTTP 404**. Every 404 carries `noindex, follow` and the server marker, with Canonical 0,
  hreflang 0, x-default 0, `Location` 0 and Sitemap membership 0. Known pages carry no NotFound
  marker; browser navigation observes the real 404 status. Soft-404 findings: **0**.
- **G9 — permanent redirect status:** every unprefixed canonical route and all 30 Registry redirect
  sources across 10 Locales answer exact **301**, preserve query and locale, and point directly to a
  real 200 target without another `Location`. GET/HEAD coverage remains present. Redirect loops: **0**;
  unnecessary chains: **0**; JS-only/302/200 redirect sources: **0**.
- **Narrow header non-regression:** representative 200/404 HTML retains `text/html`, `no-store`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` and no
  `X-Powered-By`; the representative 301 retains the shared security headers. No AP26 cache/security
  redesign was performed.

**Measured package gate:** G1 PASS (25 families, 43 canonical paths, 30 redirects); G2/G9 Playwright
**50/50 PASS**; Typecheck PASS; complete Unit/Component **296/296 PASS**; production client/SSR Build
PASS; G3/Search/internal-findability PASS; AP08 locale plus AP09 SEO/Sitemap/Search/Findability
Playwright **54/54 PASS**. All PT10.4 files pass targeted ESLint and Prettier. The unrelated full-tree
baseline remains **120 ESLint errors + 3 warnings** and currently **35 Prettier files**, none in the
PT10.4 delta.

**CI status:** the existing independent `routing` job runs G1, builds the production SSR artifacts,
installs Chromium and executes `npm run check:http-status` for `main`, `feat/home-leadmagnet` and
`console/**` pull requests/pushes. G1/G2/G9 are therefore reachable in the current Relaunch CI without
weakening the global quality job. AP10 remains `IN_PROGRESS`; the next serial task is AP10-CLOSURE.
AP11 remains `NOT STARTED`.

### 2.5 AP10 Closure — independent final package gate (2026-08-28)

**Final context:** Branch `console/10-15-2026-08-28T08-18-27`, HEAD
`8a142173a5e2f89de09af2e76a1ce28ea243782e`. AP09 is `COMPLETE / Closure PASS`; PT10.1–PT10.4 are
`PASS`; Decision Locks remain `18/18`; AP11 remains `NOT STARTED`. The Closure re-read the operative
consumers and reran the package gates against the final worktree instead of inheriting PT reports.

**Closure result:** `C10-01`–`C10-50` **50/50 PASS** and `ROUTE-01`–`ROUTE-40` **40/40 PASS**. The 12
AP10 risks are mitigated; external legacy discovery (`R10-11`) is intentionally owner-bound to AP29.
There is no AP10-owned blocker. DG09-01 is `RESOLVED` because App routing, SSR Known Paths, Sitemap,
Search route eligibility, Redirect target validation, SEO route awareness and the HTTP test matrix
all consume the central Registry contract.

**Fresh measured evidence:**

- `npm run check:routes`: G1 PASS — 25 families, 43 canonical paths, 39 sitemap entries, 35 search
  targets, 30 redirect sources, duplicate IDs/patterns/paths 0 and stale mirrors 0;
- `env -u NODE_ENV npm test`: 30 files and **296/296** tests PASS, including Registry and Redirect
  units; `npm run typecheck` PASS;
- `npm run check:http-status`: G2/G9 Playwright **50/50 PASS** — 43 paths × 10 locales = **430/430**
  real 200 responses, systematic static/dynamic and intentional 404 cases, all repository-known
  migrations as exact one-hop 301 with query/locale retention and final 200; Soft-404, loops and
  unnecessary chains each 0; 404 robots `noindex, follow`, Canonical/hreflang/x-default each 0;
- AP08 locale plus AP09 SEO/Sitemap/Search/Findability Playwright: **54/54 scenarios PASS**. One
  language-switch locator timed out once and passed its retry; the isolated no-retry rerun passed
  **1/1**, so no reproducible regression remains;
- Search 35/35, services 9/9, articles 6/6, reports 6/6 and 10 locales PASS; internal findability and
  G3 PASS; Sitemap remains 39 families / 390 unique public canonical URLs, Consumer 3×10;
- production client and SSR build PASS; AP10 files pass targeted ESLint and Prettier. The unchanged
  repository baseline is 120 ESLint errors + 3 warnings and 34 Prettier files, all outside AP10.
  `diff --check` passes for the AP10 delta; trailing-space findings belong only to separately staged,
  foreign AP11/AP12 specification files and were not modified by AP10 Closure.

**CI and lifecycle:** `.github/workflows/ci.yml` has an independently reachable `routing` job on the
current Relaunch branch/PR line: install → G1 → production build → Chromium → G2/G9. SEO/Search
regression gates remain reachable through their existing jobs. The currently-known migration map is
verified; unknown external URLs remain `DEFERRED_MIGRATION_DISCOVERY`, owner **AP29**, launch-relevant
and not guessed here. AP10 is `COMPLETE`, AP10 Closure is `PASS`, and AP11 is the next work package but
remains `NOT STARTED`.

---

## 3. Current Participating Files

**Eine Registry mit abgeleiteten Konsumenten:**

| Datei                             | Rolle                                                                                                                   | Guard        |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------ |
| `src/routing/routeRegistry.ts`    | zentrale typisierte Metadatenwahrheit, dynamische Source-Adapter, Known-Path-/Redirect-/200-/404-Testmatrix-Ableitung   | **G1/G2/G3** |
| `src/App.tsx`                     | Registry-getriebene Route-Ausgabe plus exhaustive Komponentenbindung, Lazy-Grenzen, Shell und Catch-all                 | **G1/G3**    |
| `server.ts`                       | Registry-Known-Path-/Redirect-Ausführung plus `NOT_FOUND_MARKER`; Sitemap-Auslieferung                                  | **G1/G3**    |
| `src/routing/legacyRedirects.ts`  | fachliche PT10.2-Evidenzquelle für feste/content-derived Legacy-Migrationen; Targets werden durch Registry/G1 validiert | **G1/G3**    |
| `src/hooks/useSearch.ts`          | Search-Copy und Gewichtung; Pfad/Existenz/Eignung kommen aus der Registry                                               | **G1/G2**    |
| `src/components/seo/sitemap.ts`   | x10-XML-Ableitung aus den Registry-sitemap-eligible Entries                                                             | **G1/G3**    |
| `src/components/seo/SEOHead.tsx`  | Canonical-/hreflang-Ausgabe plus Registry-Indexability-Parität und `notFound`-Statusvertrag                             | **G1/G3**    |
| `scripts/check-route-registry.ts` | kanonischer G1-Paritätsguard inklusive Navigation, Redirect Targets, dynamische Sources, Duplikate und stale Mirrors    | **G1**       |

**Mitbeteiligt:**
`e2e/url-smoke.spec.ts` (kanonischer G2/G9 HTTP-Status-/Soft-404-/Hop-/Query-Redirect-Guard) · `e2e/pt08-4-routing.spec.ts`
(x10 Locale-/Spezialseiten-Regression) · `src/components/layout/Header.tsx` (`navItems`) ·
`src/components/layout/Footer.tsx` (hartkodierte Links) · `src/data/services.tsx` (9 Service-IDs) ·
`src/data/articles.ts` (6 Artikel-Slugs) · `src/content/befunde/index.ts` (6 Panel-Slugs) ·
`src/content/befunde/legacyAnchors.ts` (Alt-Anker) · `public/robots.txt`.

### 3.1 Ist-Zustand Routing (AP02 PT02.2, read-only erhoben 2026-08-24)

**Gemessener IST-Zustand, nicht das SOLL.** Er begründet die Zielinvarianten in §4 und die Schulden
`RD-8`–`RD-14` in §5, ist **keine** Freigabe und **kein** zulässiges Zielverhalten. Erhebung durch
Quelllesung ohne Änderung.

**Die Routing-Wahrheit wird heute an acht Stellen von Hand geführt** — §3 nennt vier, gezählt sind es
acht:

| #     | Spiegel                  | Datei                            | Ist-Befund                                                                                                                                                                                                          |
| ----- | ------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A** | React Router             | `src/App.tsx`                    | **37 `<Route>`-Elemente**, 33 konkrete Pfadmuster plus Catch-all `*`; explizite Pfade stehen korrekt vor ihren `:slug`-Auffangpfaden; `/services` und `/services/:slug` lösen ein clientseitiges `<Navigate>` aus   |
| **B** | Known Paths / 404-Status | `server.ts`                      | `KNOWN_PATHS = SITEMAP_ROUTES ∪ EXTRA_KNOWN_PATHS`; `EXTRA_KNOWN_PATHS` hat **6 Handausnahmen + 2 German-only**; `isKnownPath` lässt `/services/<x>` zusätzlich per Pattern durch; Soft-404 über `NOT_FOUND_MARKER` |
| **C** | Sitemap                  | `server.ts`                      | **drei** Handtabellen: `SITEMAP_ROUTES` (**36 Pfade**, × 10 Sprachen), `CONSUMER_SITEMAP_ROUTES` (**3, nur `/en/`**), `GERMAN_ONLY_SITEMAP_ROUTES` (**2, nur `/de/`**)                                              |
| **D** | Search-Index             | `src/hooks/useSearch.ts`         | **6 handgeschriebene statische Pfade**, ein auskommentierter `/casestudys/32reasons`, vier Service-IDs — darunter **`sports`, für das keine Route existiert**; Artikel werden aus `articles.ts` abgeleitet          |
| **E** | Redirects                | `server.ts`                      | `LEGACY_PATH_REDIRECTS` (`/agb`, `/s3-leitlinie`), Locale-Canonicalization-Kette, **zwei Consumer-Zweige, die alles auf `/en/…` zwingen**, German-only auf `/de/…`; `/services*` **nicht** auf HTTP-Ebene           |
| **F** | Canonical/hreflang       | `src/components/seo/SEOHead.tsx` | eigene Kopie von `GERMAN_ONLY_PATHS`, Canonical aus der URL-Sprache, hreflang über die Sprachliste, `notFound`-Unterdrückung — kennt die Routenmenge selbst nicht                                                   |
| **G** | Navigation               | `Header.tsx`, `Footer.tsx`       | `navItems` von Hand, **Epigenetik als Kind des `/diagnostics`-Menüpunkts**, ein Ziel mit Fragment (`/epigenetics#musterbefunde`), zwei tote auskommentierte Einträge; Footer mit **17 hartkodierten Links**         |
| **H** | Tests                    | `e2e/url-smoke.spec.ts`          | **15 statische + 2 dynamische Routen + 2 Redirects** von Hand; Zusicherung `status < 400` bzw. „URL enthält Ziel" — ein 301 statt 200 und eine Soft-404 bestünden den Guard                                         |

**Strukturell entscheidender Befund:** `KNOWN_PATHS` wird **aus der Sitemap abgeleitet**. Damit ist
_„nicht in der Sitemap = unbekannte Route"_ heute die tatsächliche Architektur — notdürftig repariert
durch acht Handausnahmen in `EXTRA_KNOWN_PATHS`. Genau diese Annahme verbietet das Zielbild (R-40, R-48).

**Weitere Ist-Fakten:**

- Dynamische Slugs sind **doppelt geführt**: 9 Services (`src/data/services.tsx`), 6 Artikel
  (`src/data/articles.ts`) und 6 Musterbefunde (`src/content/befunde/`) existieren als Datensätze **und**
  noch einmal als Handzeilen in `SITEMAP_ROUTES`.
- Musterbefund-Inhalte liegen als JSON nur in **`de` und `en`** vor, während die Routen × 10 in der
  Sitemap stehen.
- Epigenetik ist **routenseitig** bereits eine eigene Familie (Hub + 3 Vertiefungen + 6 Musterbefunde +
  `:slug`-Auffang) — die Unterordnung besteht nur in der Navigation.
- Consumer-Routen existieren dreimal in `App.tsx` und sind eager importiert (`RUNTIME-CONTRACT.md` §3.1),
  werden aber serverseitig auf `/en/` gezwungen.

---

## 4. Target Invariants

**R-01 · Sprachpräfix ist Pflicht.** Jede öffentliche URL trägt genau ein Präfix aus
`de en pl fr it es pt da nl cs`. Kein Inhalt ist ohne Präfix erreichbar. _(AP02 PT02.2.1)_

**R-02 · Default-Locale ist `de`.** Unpräfixierte URLs existieren ausschließlich als **301-Ziel**, nie
als auslieferbare Seite. _(AP02 PT02.2.2, AP10 PT10.1.1)_

**R-03 · Redirects sind echte HTTP 301.** Kein 302, kein clientseitiger `<Navigate>` als Ersatz für eine
Migrationszusage. _(AP10 PT10.1, AP27 PT27.5.1)_

**R-04 · Ein Hop.** Jede Alt-URL erreicht ihr Ziel in genau einer Umleitung. Keine Ketten, keine
Schleifen. _(AP10 PT10.1.4)_

**R-05 · Unbekannte Pfade antworten echt 404.** Statisch unbekannte Pfade **und** unbekannte dynamische
Slugs. Keine Soft-404. _(AP10 PT10.4, AP09 PT09.1.6)_

**R-06 · Der 404-Handshake bleibt intakt.** `SEOHead notFound` emittiert
`<meta name="prerender-status-code" content="404">`; `server.ts` liest genau diesen String über
`NOT_FOUND_MARKER`. **Beide Seiten sind byte-identisch zu halten.** _(Baseline-Härtung, `N2`/`N1`)_

**R-07 · Route Registry wird die einzige Wahrheit.** Ab AP10 PT10.3 leiten sich App-Routen, Known Paths,
Sitemap, Search, Redirects, SEOHead und Tests **aus derselben Quelle** ab. Danach ist jede parallele
Handtabelle verboten.

**R-08 · Explizite Slugs vor Catch-all.** In `App.tsx` stehen konkrete Pfade **vor** ihrem
`:slug`-Auffangpfad, sonst fängt der Catch-all sie ab. _(AP16 PT16.1.3)_

**R-09 · Consumer-Routen in allen 10 Sprachen, indexierbar.** `/[lang]/consumer/{vitamin-d3-spray,
hydrating-masks, inside-out-duo}`. **Kein EN-Zwangsredirect.** Kein `noindex`, keine Basic Auth.
_(`REST-03`, `DEC-RL-006`, AP21 PT21.1.8/PT21.6)_

**R-10 · Epigenetik ist eine eigene Routenfamilie.** Hub `/[lang]/epigenetics`, drei Vertiefungsseiten
`…/grundlagen|studienlage|unterlagen`, sechs Musterbefunde
`…/musterbefund/{metabolic-health, healthy-aging, biologische-altersuhr, telomer-analyse,
stress-monitor, healthy-sport}` — alle × 10 Sprachen. _(`DEC-RL-005`, AP15 PT15.7.1, AP16)_

**R-11 · Dynamische Slugs stammen aus genau einer Datenquelle.** Services aus `src/data/services.tsx`
(9), Artikel aus `src/data/articles.ts` (6), Musterbefunde aus `src/content/befunde/` (6). Ein Slug
ohne Datensatz **muss** 404 liefern. _(AP02 PT02.3.2)_

**R-12 · Legacy-Pfade bleiben bedient.** `/[lang]/agb` → `/[lang]/terms`;
`/[lang]/s3-leitlinie` → `/[lang]/s3_leitlinie`; unpräfixierte Quellen gehen direkt auf das jeweilige
DE-Ziel. Alle in einem Hop. Entfernen ist nur nach AP29 PT29.2 zulässig. _(AP10 PT10.1/PT10.2)_

**R-13 · `/services*` wird eine echte serverseitige 301-Brücke** auf `/[lang]/diagnostics*`.
_(AP10 PT10.1.2, Master-Scope §5 Altlast 1)_

**R-14 · Historische Anker bleiben erreichbar.** `src/content/befunde/legacyAnchors.ts` bildet alte,
aus übersetzten Überschriften erzeugte Sprungmarken auf feste IDs ab. Nicht ersatzlos entfernen.
_(AP16 PT16.3.7)_

**R-15 · Spezialseiten bleiben locale-treu.** Seit AP08 PT08.4 existieren `/s3_leitlinie` und
`/vitamin-d3-implantologie` in allen zehn Locales. Weder Runtime noch Redirects dürfen diese Seiten
auf DE zwingen; Consumer darf entsprechend nicht auf EN gezwungen werden. PT10.1 bestätigt 30/30
direkte Locale-Antworten.

**R-16 · Jede navigierbare Seite hat einen Einstieg.** Eine Route ohne Eintrag in Navigation, Footer
oder Suche ist nur per Direkt-URL erreichbar; das schließt AP07 DoD aus. Bewusste Ausnahmen werden in
der Registry-Policy und im Findability-Vertrag begründet (Vorbild: `/support`, sitemap-bewusst aus).

### URL- und Locale-Vertrag (AP02 PT02.2)

**R-17 · Die Sprachmenge ist abschließend:** `de`, `en`, `pl`, `fr`, `it`, `es`, `pt`, `da`, `nl`, `cs`.
Sie ist Decision Lock (`DEC-RL-001`), keine Konfigurationsfrage. Eine elfte Sprache oder eine reduzierte
Menge ist eine Scope-Änderung über `SCOPE-CHANGELOG.md`, nicht eine Routing-Entscheidung.

**R-18 · Die Locale ist deterministisch aus der URL ableitbar** — aus dem Präfix und aus nichts sonst.
Weder `Accept-Language` noch Cookie, `localStorage` oder ein Geo-Signal erzeugt eine zweite
Routing-Wahrheit. _(`MASTER-SCOPE.md` §1.1, `RUNTIME-CONTRACT.md` RT-45)_

**R-19 · Default- und `x-default`-Locale ist `de`**, solange `SEO-CONTRACT.md` S-02 nichts anderes
festlegt. _(präzisiert R-02)_

**R-20 · Unpräfixierte Seiten-URLs sind ausschließlich Redirect-Einstiegspunkte.** Sie sind kein zweiter
Content-Origin, keine kanonische URL, kein Sitemap-Eintrag und kein Canonical- oder hreflang-Ziel.
_(präzisiert R-02)_

**R-21 · Route-Identität ist Locale + Pfadmuster + aufgelöste dynamische Parameter.** Query-String und
Fragment gehören **nicht** zur Route-Identität: sie erzeugen keine zweite Route, keinen eigenen
Canonical und keinen eigenen Sitemap-Eintrag. Wie ein Redirect Query und Fragment behandelt, ist eine
ausdrückliche Regel des Redirect-Vertrags (R-35), keine Nebenwirkung.

**R-22 · Seitenrouten, technische Pfade und Assets sind eindeutig unterscheidbar.** `/api/*`, statische
Assets, Locale-Dateien, `robots.txt`, `sitemap.xml` und Health-/Monitoring-Pfade sind keine Seitenrouten:
keine Locale-Weiche, kein Präfixzwang, kein Seiten-404-Handshake, kein Canonical.
_(`RUNTIME-CONTRACT.md` RT-20/RT-21)_

### Route-Klassen (AP02 PT02.2)

**R-23 · Jede Route gehört genau einer Klasse an, und die Klasse bestimmt ihre Policies.** Eine Route
ohne Klasse ist keine beschlossene Route.

| #      | Klasse                           | Pfadform (Ist-Beispiel)                                       | Locale-Policy         | Sitemap                                | Status                        |
| ------ | -------------------------------- | ------------------------------------------------------------- | --------------------- | -------------------------------------- | ----------------------------- |
| **1**  | reguläre B2B-Seite               | `/[lang]/about`, `/[lang]/diagnostics`                        | 10                    | ja                                     | 200                           |
| **2**  | dynamische Service-Route         | `/[lang]/diagnostics/:slug`                                   | 10                    | ja, aus der Slug-Quelle                | 200 · **404** bei unbek. Slug |
| **3**  | Artikel-Route                    | `/[lang]/articles/:slug`                                      | 10 (Umfang AP08/AP17) | ja, aus der Slug-Quelle                | 200 · **404** bei unbek. Slug |
| **4**  | Epigenetik-Hub                   | `/[lang]/epigenetics`                                         | 10                    | ja                                     | 200                           |
| **5**  | Epigenetik-Vertiefung            | `/[lang]/epigenetics/{grundlagen,studienlage,unterlagen}`     | 10                    | ja                                     | 200                           |
| **6**  | Musterbefund                     | `/[lang]/epigenetics/musterbefund/:slug`                      | 10                    | ja, aus der Slug-Quelle                | 200 · **404** bei unbek. Slug |
| **7**  | Consumer-Landingpage             | `/[lang]/consumer/:produkt`                                   | **10** (`REST-03`)    | ja, × 10                               | 200                           |
| **8**  | Legal                            | `/[lang]/{privacy,imprint,terms}`                             | 10                    | folgt der Indexierbarkeits-Policy      | 200                           |
| **9**  | Support-/sonstige bekannte Seite | `/[lang]/support`                                             | 10                    | **bewusst nein** — bleibt trotzdem 200 | 200                           |
| **10** | locale-aware Spezialseite        | `/[lang]/s3_leitlinie`, `/[lang]/vitamin-d3-implantologie`    | 10                    | ja, × 10                               | 200                           |
| **11** | Legacy Redirect Source           | `/agb`, `/s3-leitlinie`, `/services`, `/services/:slug`       | n/a                   | **nie**                                | **301**                       |
| **12** | technischer Nicht-Seitenpfad     | `/api/*`, Assets, Locale-Dateien, `robots.txt`, `sitemap.xml` | n/a                   | **nie**                                | eigene Semantik               |
| **13** | unbekannter Pfad                 | alles übrige                                                  | n/a                   | **nie**                                | **404**                       |

Zu Klasse **8**: ob Legal indexierbar ist, ist eine offene Produktentscheidung — der heutige Widerspruch
(Sitemap-Eintrag bei gesetztem `noindex`) ist `SEO-CONTRACT.md` SD-2, Owner **AP20 PT20.4.8**. PT02.2
verlangt nur, dass die Policy **deklariert** ist und Sitemap und Indexierbarkeit ihr gemeinsam folgen.

Zu Klasse **10**: die historische German-only-Sonderlogik wurde in AP08 PT08.4 entfernt. Die beiden
Seiten folgen heute derselben x10 Locale-Policy wie andere vollständig veröffentlichte Familien.

### Route Registry als Single Source of Truth (AP02 PT02.2)

**R-24 · Es gibt genau eine kanonische Routing-Wahrheit.** Sie beantwortet, welche Routen existieren,
in welchen Sprachen und mit welchen Policies. _(schärft R-07)_

**R-25 · Pflichtkonsumenten leiten ab, sie pflegen nicht mit.** Aus derselben Wahrheit stammen
mindestens: React-Router-Routen · serverseitige Known-Path-/404-Entscheidung · Sitemap ·
Canonical/hreflang · Search-Index · Redirect-Mapping · Validierung der Navigations-Linkziele ·
Route-/Status-Tests. **Kein Konsument führt eine eigene Vorstellung davon, welche URLs existieren.**

**R-26 · Ableitung heißt nicht Generierung aus einer Datei.** Ein Konsument darf eigene
Darstellungsdaten führen — Sitemap-Priorität und `changefreq`, Suchgewicht und Snippet, Menütitel und
Reihenfolge, Testauswahl. Verbindlich geprüft wird die **Pfad- und Locale-Menge**, nicht die Form der
Konfiguration.

**R-27 · Die Registry führt mindestens diese konzeptionellen Felder.** Es sind **Architekturfelder,
keine Property-Namen**; die konkrete Form entscheidet **AP10 PT10.3**.

| Feld                         | Beantwortet                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------- |
| Route-ID                     | stabile Identität, unabhängig von Übersetzung und Pfadkosmetik               |
| Pfadmuster                   | die präfixlose Form, inklusive dynamischer Parameter                         |
| Route-Klasse / Seitentyp     | welche Policies gelten (R-23)                                                |
| Locale-Policy                | in welchen der zehn Sprachen die Route existiert                             |
| Indexierbarkeit              | ob Suchmaschinen sie indexieren sollen                                       |
| Sitemap-Teilnahme            | ob sie in die Sitemap gehört — **getrennt** von Existenz und Indexierbarkeit |
| Canonical-Policy             | wie die kanonische URL gebildet wird                                         |
| hreflang-Policy              | welche Alternates beworben werden dürfen                                     |
| Status-Semantik              | erwarteter Statuscode und Not-Found-Verhalten                                |
| Redirect-Semantik            | ob die Route Redirect-Quelle oder -Ziel ist, mit Status                      |
| Search-Eignung               | ob sie ein Suchziel sein darf                                                |
| Navigations-Eignung          | ob sie überhaupt navigierbar ist — **nicht**, wo sie im Menü steht           |
| Quelle dynamischer Parameter | welche fachliche Datenquelle die gültigen Slugs besitzt                      |
| Test-/Smoke-Relevanz         | ob die Route in die automatisierte Statusmatrix gehört                       |

**R-28 · Die Route Registry ist keine Content-Datenbank.** Sie kennt Existenz und Policy einer Route,
nicht deren Inhalt. Die fachlichen Datenquellen — Services, Artikel, Musterbefunde, Events und weitere
dynamische Inhalte — bleiben Eigentümer ihrer Datensätze **und ihrer gültigen Slugs**. Die Registry
**referenziert** die Quelle, sie kopiert sie nicht.

**R-29 · Es entsteht keine zentrale Mega-Konfigurationsdatei als Selbstzweck.** Verbindlich ist die
**Ableitbarkeit und die Prüfbarkeit der Drift**, nicht ein bestimmtes Dateilayout. Ob die Wahrheit ein
Modul, mehrere domänennahe Module mit einem gemeinsamen Aggregat oder ein generiertes Manifest ist,
entscheidet **AP10**.

### Dynamische Ressourcen (AP02 PT02.2)

**R-30 · Ein Pattern-Treffer ist keine Ressourcen-Existenz.** Dass `/[lang]/articles/:slug` matcht, sagt
nichts darüber, ob dieser Slug existiert.

**R-31 · Ein dynamischer Slug ohne Datensatz erzeugt eine echte 404** — auf HTTP-Ebene, nicht nur als
sichtbare Fehlerseite. _(schärft R-05, R-11)_

**R-32 · Die Parameterauflösung gehört zur Routenauflösung, nicht zur Seitendarstellung.** Die
Statusentscheidung darf nicht davon abhängen, ob und wann die Seitenkomponente gerendert hat.
_(`RUNTIME-CONTRACT.md` RT-52/RT-56 und `RD-12` dort)_

**R-33 · Jede dynamische Route benennt genau eine Slug-Quelle.** Zwei Quellen für dieselbe Route — etwa
eine Datendatei **und** eine Handliste in der Sitemap — sind verboten. _(schärft R-11)_

### Redirect-Vertrag (AP02 PT02.2)

**R-34 · Redirects gehören genau einer Klasse an:**

| Klasse | Zweck                    | Beispiel (Ist)                                  |
| ------ | ------------------------ | ----------------------------------------------- |
| **A**  | Locale-Canonicalization  | `/about` → `/de/about`                          |
| **B**  | Legacy Route Migration   | `/agb` → `/[lang]/terms`                        |
| **C**  | Alias-/Schreibweisen-URL | `/[lang]/s3-leitlinie` → `/[lang]/s3_leitlinie` |
| **D**  | Struktur-Brücke          | `/services*` → `/[lang]/diagnostics*`           |

Ein sprachpolitischer Zwangsredirect ist keine aktive Redirect-Klasse: Consumer→EN sowie
S3/Implantology→DE sind unzulässig (R-15/R-52).

**R-35 · Jeder Redirect deklariert Quelle, Ziel, Status und das Verhalten für Query und Fragment
ausdrücklich.** Kein implizites Verschlucken, kein implizites Anhängen.

**R-36 · Jedes Redirect-Ziel ist eine bekannte kanonische Route der Registry** — und ist selbst keine
Redirect-Quelle. Damit sind Ketten und Schleifen strukturell ausgeschlossen. _(stützt R-04)_

**R-37 · Redirect-Quellen sind keine kanonischen Seiten.** Sie tragen keinen Canonical, kein hreflang,
keinen Sitemap-Eintrag und keinen Search-Treffer — und sie antworten nicht 404, sondern mit ihrem
Redirect-Status.

**R-38 · `/services*` ist eine echte serverseitige 301-Brücke.** `/services` → `/[lang]/diagnostics`,
`/services/:slug` → `/[lang]/diagnostics/:slug`: auf HTTP-Ebene, in **einem** Hop, ohne
200-Zwischenzustand, ohne clientseitiges `<Navigate>` als Ersatz. Die Locale der Anfrage bleibt
erhalten. Ob das Ziel existiert, entscheidet danach die Zielroute (R-30/R-31) — die Brücke selbst prüft
keinen Slug. Die Brücke muss aus der zentralen Routing-Wahrheit prüfbar sein. _(schärft R-13; Owner
**AP10 PT10.1.2**)_

### 404- und Status-Vertrag (AP02 PT02.2)

**R-39 · Die Statusmatrix ist verbindlich:**

| Situation                                           | Status  | Canonical/hreflang | Sitemap |
| --------------------------------------------------- | ------- | ------------------ | ------- |
| bekannte Route, Ressource vorhanden                 | **200** | ja                 | policy  |
| bekannte Route, bewusst nicht in der Sitemap        | **200** | ja                 | nein    |
| bekannte dynamische Route, Slug unbekannt           | **404** | **keine**          | nein    |
| unbekannter statischer Pfad                         | **404** | **keine**          | nein    |
| Redirect-Quelle                                     | **301** | am Ziel            | nein    |
| bekannte Route, Verarbeitung/Rendering schlägt fehl | **5xx** | —                  | —       |

**R-40 · Route-Existenz ist unabhängig von Sitemap-, Search- und Navigations-Teilnahme.** Es sind vier
getrennte Eigenschaften: **Existenz** · **Indexierbarkeit/Sitemap** · **Auffindbarkeit in der Suche** ·
**Navigationsplatzierung**. Ausdrücklich ausgeschlossen sind die Architekturannahmen
_„nicht in der Sitemap = unbekannte Route"_ und _„nicht in der Navigation = unbekannte Route"_.

**R-41 · Ein Laufzeitfehler einer bekannten Route wird nicht als 404 ausgewiesen.**
_(`RUNTIME-CONTRACT.md` RT-57/RT-58; die Fehlerklassen-Tabelle dort §5.5 gilt unverändert)_

**R-42 · Eine neue Route antwortet nicht deshalb 404, weil ein Spiegel vergessen wurde.** Nach der
Registry ist dieser Fehlerfall strukturell ausgeschlossen; bis dahin gilt die Spiegelpflicht M-01/M-06.

### Canonical- und hreflang-Ableitung (AP02 PT02.2)

**R-43 · Canonical entsteht aus Route-Identität und Locale-Policy** — nicht aus einer zweiten
Routentabelle in der SEO-Schicht. _(`SEO-CONTRACT.md` S-01)_

**R-44 · hreflang bewirbt genau die Locale-Varianten, die die Locale-Policy der Route zusagt und die
tatsächlich ausgeliefert werden.** _(`SEO-CONTRACT.md` S-02/S-03)_

**R-45 · Sprachliche Sonderfälle sind deklarierte Policies, keine implizite Sonderlogik.** Die
historischen S3-/Implantology-Sonderfälle sind seit AP08 x10. Eine künftig wirklich einsprachige Route
müsste eine erklärte Locale-Policy tragen — nie eine verdeckte Redirect-/SEO-Pfadliste.

**R-46 · 404-Antworten und Redirect-Quellen publizieren keinen Canonical und kein hreflang.**
_(`SEO-CONTRACT.md` S-04, hier R-37)_

**R-47 · Die SEO-Schicht pflegt keine eigene Routenwahrheit.** Sie erhält Route-Identität und
Locale-Policy aus der Registry und leitet daraus ab. Owner der Umsetzung: **AP09** mit **AP10**.

### Konsumenten: Sitemap, Search, Navigation (AP02 PT02.2)

**R-48 · Die Sitemap ist Konsument, nicht Quelle.** Sie ist keine separate Liste existierender Seiten.
**Insbesondere dürfen Known Paths niemals aus der Sitemap abgeleitet werden** — das ist die heutige
Richtung und im Zielmodell verboten (`RD-8`).

**R-49 · Die Sitemap enthält ausschließlich indexierbare kanonische Ziel-URLs.** Keine Redirect-Quellen,
keine 404, keine `noindex`-Seiten (`SEO-CONTRACT.md` S-08). Dynamische Einträge entstehen aus
Routendefinition **und** realer Datenquelle. Consumer × 10 muss abbildbar sein; die hreflang-Angaben der
Sitemap entsprechen der Locale-Policy der Route.

**R-50 · Search ist Konsument.** Kein eigener Pfadkatalog, keine erfundenen Ziele: jeder Treffer zeigt
auf eine bekannte Route in der aktiven Locale. Search darf eigene Metadaten führen — Gewichtung,
Snippet, Synonyme, Gruppierung — aber keine eigenen Pfade. Tote Treffer sind durch Ableitung strukturell
verhinderbar. Owner: **AP07**.

**R-51 · Navigation ist Konsument und nicht die Registry.** Header, Footer und Kapitelnavigationen
konfigurieren Auswahl, Reihenfolge und Beschriftung; ihre Linkziele müssen gegen die Routing-Wahrheit
validierbar sein (Fragment abgetrennt geprüft, R-21). **Nicht jede Route muss navigierbar sein**, und
Navigationszugehörigkeit begründet keine Route. Hierarchie und Platzierung entscheiden **AP03** und
**AP06**; die Registry entscheidet Existenz und Policy. _(bestehendes R-16 bleibt gültig)_

### Consumer und Epigenetik (AP02 PT02.2)

**R-52 · Consumer × 10 ist das Routing-Zielbild.** `/[lang]/consumer/{vitamin-d3-spray,
hydrating-masks, inside-out-duo}` in **allen zehn Sprachen**: öffentlich indexierbar, im Canonical-,
hreflang- und Sitemap-Modell, ohne Basic Auth, ohne `noindex`, ohne eigenen SPA-Router und ohne
Sonderarchitektur. `/en/consumer/*` ist **eine Sprachvariante unter zehn**. Eine Regel, die alle
Consumer-Sprachen nach `/en/` zwingt, ist im Zielmodell unzulässig. Es gelten die normalen 404-, Status-
und SSR-Verträge. _(`REST-03`, `DEC-RL-006`; schärft R-09; `RUNTIME-CONTRACT.md` RT-67/RT-68; Owner
**AP21** mit AP08/AP09/AP10)_

**R-53 · Epigenetik ist routenseitig eine eigenständige Säule, keine Untergruppe von `/diagnostics`.**
Eigene Routenfamilie — Hub, drei Vertiefungsseiten, sechs Musterbefunde, alle × 10 —, eigene
SEO-Identität, eigene Findability, dieselben SSR-, 404-, Canonical- und hreflang-Verträge wie jede
andere Seite. Eine Modellierung als Diagnostik-Unterpunkt ist ausgeschlossen. _(`DEC-RL-005`; stützt
R-10; `RUNTIME-CONTRACT.md` RT-69; Owner **AP15**/**AP16**, IA-Seite **AP03**/**AP06**)_

---

## 5. Current Known Debt

| ID       | Schuld                                                                                                                                                                               | Beleg                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| **RD-1** | **RESOLVED PT10.3.** App, Server, Search, SEOHead und Sitemap konsumieren `routeRegistry.ts`; G1 erzwingt Parität und verbietet die alten Spiegel.                                   | `npm run check:routes`       |
| **RD-2** | **RESOLVED PT10.1.** `/services*` liefert für den Hub und reale Service-Slugs direkte serverseitige 301 auf locale-aware `/diagnostics*`; die Client-`Navigate`-Brücke ist entfernt. | `e2e/url-smoke.spec.ts`      |
| **RD-3** | **RESOLVED PT10.4.** Registry-generierte x10-200-, 301- und systematische statische/dynamische 404-Klassen sind gegen Production SSR gegated; Soft-404 0.                            | G2/G9 / `check:http-status`  |
| **RD-4** | **RESOLVED AP05.** Playwright nutzt einen dedizierten Port und `reuseExistingServer: false`; keine fremde Anwendung wird wiederverwendet.                                            | `playwright.config.ts`       |
| **RD-5** | **RESOLVED AP07/PT10.3.** Search deckt 35 Registry-eligible Ziele ab; 9/9 Services, 6/6 Articles und 6/6 Befunde; kein `sports`.                                                     | Search-Guard und G1          |
| **RD-6** | **RESOLVED AP08/AP09; PT10.1 regressionsgeprüft.** Consumer bleibt x10 locale-treu, indexierbar und sitemap-geführt; kein EN-Zwang.                                                  | `e2e/pt08-4-routing.spec.ts` |
| **RD-7** | **RESOLVED AP09/PT10.3.** Sitemap-Output und Server-Kommentar verwenden 39 Registry-Familien × 10 = 390 URLs; G3 prüft die Zahl reproduzierbar.                                      | G3 / `server.ts`             |

Offene Zeilen sind **Ist-Zustand**, kein erlaubtes Zielverhalten. RD-2, RD-3 und RD-6 sind geschlossen.

### 5.1 Routing-Schulden aus AP02 PT02.2 (erhoben 2026-08-24)

Ist-Zustand aus §3.1. **Kein zulässiges Zielverhalten**; in PT02.2 bewusst **nicht** repariert.

| ID        | Schuld                                                                                                                                                                                                            | Verletzt           | Owner        |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------ |
| **RD-8**  | **RESOLVED PT10.3.** Known Paths werden direkt aus konkreten Registry-Einträgen abgeleitet; Sitemap-Teilnahme ist eine separate Policy; `EXTRA_KNOWN_PATHS` ist entfernt.                                         | R-40, R-48, R-24   | **RESOLVED** |
| **RD-9**  | **RESOLVED PT10.3.** Sitemap expandiert dynamische Registry-Familien aus den realen Service-/Article-/Befund-Sources; kein Slug-Handspiegel bleibt.                                                               | R-33, R-49         | **RESOLVED** |
| **RD-10** | **RESOLVED PT10.3.** App, Known Paths, Sitemap, Search, SEOHead, Redirect-Ziele, Navigation-Validierung und URL-Tests leiten Pfadwahrheit aus der Registry ab; G1 verbietet stale Mirrors.                        | R-24, R-25         | **RESOLVED** |
| **RD-11** | **RESOLVED AP06.** Epigenetik besitzt einen eigenen Header-/Footer-Bereich und eine eigenständige Registry-Routenklasse; Diagnostik modelliert sie nicht als Service.                                             | R-53, `DEC-RL-005` | **RESOLVED** |
| **RD-12** | **RESOLVED AP07/PT10.3.** Search-Copy bleibt domänennah; seine 35 Pfade und Eligibility werden vollständig aus der Registry bezogen und G1-verifiziert.                                                           | R-50               | **RESOLVED** |
| **RD-13** | **RESOLVED PT10.4.** `getRouteTestMatrix()` speist 43 konkrete 200-Pfade, 30 Redirect-Quellen sowie sichere unbekannte statische/dynamische und intentional-404-Klassen; G2/G9 laufen gegen Production SSR in CI. | R-25, T-11         | **RESOLVED** |
| **RD-14** | **RESOLVED AP08.** Alle sechs Befund-Familien besitzen zehn JSON-Sprachfassungen und werden x10 geroutet, indexiert und G3-/Registry-validiert.                                                                   | R-44, `DEC-RL-001` | **RESOLVED** |

Auch diese Schulden sind **Ist-Zustand**, kein erlaubtes Zielverhalten. Die ehemals zugehörigen
Laufzeitverletzungen RD-2 (`/services*`) und RD-6 (Consumer→EN) sind inzwischen aufgelöst; die
Registry-/Spiegel-Schulden RD-8–RD-10/RD-12 sind in PT10.3 geschlossen. Die breite integrierte
Statusmatrix aus RD-13 ist in PT10.4 geschlossen.

---

## 6. Modification Rules

**M-01 — Die Kerninvariante.** _Eine Route wird in `src/routing/routeRegistry.ts` klassifiziert; die
Konsumenten leiten Pfade daraus ab._ Dynamische Datensätze bleiben ausschließlich in:

```
src/data/services.tsx      (Services)
src/data/articles.ts       (Artikel)
src/content/befunde/meta.ts  (Musterbefunde)
```

**M-02 — Checkliste beim Anlegen einer Route.** Registry-Metadaten und Komponentenbindung · echte
dynamische Source, falls erforderlich · bewusste Sitemap-/Search-/Indexability-Entscheidung ·
Navigation-/Footer-Einstieg oder begründete Findability-Ausnahme · `npm run check:routes`. Keine
manuelle Pfadzeile in Server, Sitemap, Search oder URL-Testmatrix.

**M-03 — Beim Entfernen einer Route** dieselben Stellen rückbauen **und** eine Redirect-Entscheidung
treffen (AP29 PT29.2). Eine entfernte Route, die in der Sitemap bleibt, erzeugt eine gecrawlte Soft-404.

**M-04 — `server.ts` und `App.tsx` niemals aus `main` übernehmen.** `BRANCH-RECONCILIATION-MAP.md`
**N1** und **N12**: `main`s Fassungen verlieren `isKnownPath`, `NOT_FOUND_MARKER`, `no-store`, die
Legacy-Redirects und den `GermanOnlyPage`-Guard. Nur Hunks, nie Dateien.

**M-05 — Parallele Handtabellen sind verboten.** Wer eine zweite Routenliste anlegt, verletzt R-07;
G1 muss dies als stale Mirror ablehnen.

**M-06 — Header/Footer bleiben kuratierte IA, keine Registry.** Ihre Targets müssen aber
Registry-known, kanonisch und frei von Redirect-/Backlog-/Chat-Zielen sein; G1 prüft das.

**M-07 — Eine Route wird nicht über die Sitemap „bekannt gemacht".** `knownPath`, Indexierbarkeit und
Sitemap-Teilnahme sind getrennte Registry-Entscheidungen (R-40).

**M-08 — Redirect-Ziele werden gegen die Routenwahrheit geprüft, nicht angenommen.** Ein Ziel, das keine
bekannte kanonische Route ist, ist ein Fehler — auch wenn der Redirect „funktioniert" (R-36).

---

## 7. Required Agent Context

**Dieser Vertrag ist G3.** Vor jeder Änderung an `App.tsx`, `server.ts`, `SEOHead.tsx` oder
`useSearch.ts` liest ein Agent in dieser Reihenfolge:

1. `building-docs/AGENT-CONTRACT.md`
2. `building-docs/PROJECT-CONSTRAINTS.md`
3. den zuständigen AP-Abschnitt in `building-docs/scope/MASTER-SCOPE.md` (mindestens AP10)
4. **diesen Vertrag**
5. `building-docs/state/AP-STATE.md`
6. die aktuellen Quell- und Testdateien aus §3
7. `git diff -- <Datei>` **vor** der Änderung
8. danach: gezielte Regressionstests aus §8

Zusätzlich bei branch-abgeleiteter Arbeit: `building-docs/BRANCH-RECONCILIATION-MAP.md`
(**A4**, **A5**, **A9**, **A10**, **N1**, **N12**).

---

## 8. Required Tests / Guards

Mindestumfang, den eine Routing-Änderung bestehen muss. Bis die Guards existieren, gilt derselbe Umfang
als **manuelle** Abnahmepflicht (Vorbild: `QUALITY-BASELINE-LIVE.md` §13.3).

| #    | Prüfung                  | Erwartung                                                                                               | AP            |
| ---- | ------------------------ | ------------------------------------------------------------------------------------------------------- | ------------- |
| T-1  | **Registry-Parität**     | jede `<Route>` hat Known-Path-Eintrag und umgekehrt; Such-Index enthält nur existierende Ziele          | AP10 PT10.3   |
| T-2  | **200 für reale Seiten** | alle Sitemap-Pfade × alle Sprachen                                                                      | AP10 PT10.4.1 |
| T-3  | **301 für Migrationen**  | `/services`, `/services/:slug`, `/agb`, `/s3-leitlinie`, Präfix-Einfügung — Status **explizit** geprüft | AP10 PT10.4.2 |
| T-4  | **Ein-Hop-Nachweis**     | kein Ziel löst eine weitere Umleitung aus                                                               | AP10 PT10.1.4 |
| T-5  | **Echte 404**            | unbekannter statischer Pfad **und** unbekannter dynamischer Slug ⇒ `status === 404`                     | AP10 PT10.4.3 |
| T-6  | **Keine Soft-404**       | keine unbekannte URL antwortet 200; 404-Seiten tragen keinen Canonical                                  | AP10 PT10.4.5 |
| T-7  | **10-Sprachen-Matrix**   | repräsentative Routen × 10                                                                              | AP10 PT10.4.6 |
| T-8  | **Consumer × 10**        | alle drei Produkte in allen zehn Sprachen erreichbar und indexierbar                                    | AP21 PT21.6   |
| T-9  | **Sitemap-Abdeckung**    | jeder Registry-Pfad steht in der Sitemap und umgekehrt                                                  | AP09 PT09.2.8 |
| T-10 | **Epigenetik-Familie**   | Hub + 3 Vertiefungen + 6 Musterbefunde × 10                                                             | AP15 PT15.7   |

**Ausführungshinweis:** Vitest ist in dieser Umgebung nutzbar (`QUALITY-BASELINE-LIVE.md` §9.2 —
die frühere Blockade-Annahme war ein Aufrufparameterfehler). Guards, die einen echten Server brauchen
(T-2 bis T-9), gehören dennoch nach Playwright; reine Struktur-Guards (T-1) laufen als Node-Skript oder
Vitest. Vor jeder Playwright-Nutzung ist **RD-4** zu beachten.

### 8.1 Zielnachweise aus AP02 PT02.2

| #        | Prüfung                      | Erwartung                                                                                                                                                            | AP                        |
| -------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **T-11** | **Konsumenten-Ableitung**    | die Pfad-/Locale-Menge jedes Konsumenten (App-Routen, Known Paths, Sitemap, Search, Navigation, Tests) ist aus der Routing-Wahrheit ableitbar; Drift bricht das Gate | AP10 PT10.3 · AP27 PT27.5 |
| **T-12** | **Sitemap ist nicht Quelle** | Known Paths werden **nicht** aus der Sitemap abgeleitet; eine bekannte, bewusst nicht gelistete Route antwortet 200                                                  | AP10 PT10.3               |
| **T-13** | **Query/Fragment**           | dieselbe Route mit Query oder Fragment erzeugt keinen zweiten Canonical und keinen zweiten Sitemap-Eintrag                                                           | AP09 PT09.1 · AP10        |
| **T-14** | **Technische Pfade**         | `/api/*`, Assets, Locale-Dateien, `robots.txt`, `sitemap.xml` unterliegen keiner Locale-Weiche und keinem Seiten-404-Handshake                                       | AP10 PT10.4               |
| **T-15** | **`/services*`-Brücke**      | `/services` und `/services/:slug` liefern **serverseitig 301** auf `/[lang]/diagnostics*`, ein Hop, kein 200-Zwischenzustand                                         | AP10 PT10.1.2             |
| **T-16** | **Redirect-Ziel-Integrität** | jedes Redirect-Ziel ist eine bekannte kanonische Route; kein Ziel ist selbst Redirect-Quelle                                                                         | AP10 PT10.1.4             |
| **T-17** | **Search-Integrität**        | jeder Suchtreffer zeigt auf eine bekannte Route in der aktiven Locale; **keine toten Ziele**                                                                         | AP07 PT07.1 · AP27        |
| **T-18** | **Navigations-Integrität**   | jedes Header-, Footer- und ChapterNav-Ziel ist eine bekannte Route (Fragment abgetrennt geprüft)                                                                     | AP06 PT06.5 · AP27        |
| **T-19** | **Fehlerklassen-Trennung**   | ein Laufzeitfehler einer bekannten Route liefert 5xx, nie 404 (Gegenstück zu `RUNTIME-CONTRACT.md` RT-T20)                                                           | AP10 PT10.4 · AP27        |
| **T-20** | **Locale-Determinismus**     | `Accept-Language`, Cookie oder gespeicherter Sprachwunsch ändern weder Zielroute noch Status                                                                         | AP08 PT08.4 · AP10 PT10.4 |

### 8.2 Zuordnung der PT02.2-Zielinvarianten

Die Aufgabenstellung von PT02.2 nennt Invarianten als `RTG-xx`. Dieser Vertrag führt **keine parallele
ID-Systematik** ein; die Zuordnung auf die bestehende `R-`/`T-`-Konvention ist:

| RTG        | Inhalt                                                  | hier                                      |
| ---------- | ------------------------------------------------------- | ----------------------------------------- |
| **RTG-01** | jede kanonische Seiten-URL hat eine gültige Locale      | R-01, R-17, R-18 · T-7                    |
| **RTG-02** | unpräfixierte URL liefert Redirect statt parallelem 200 | R-02, R-20 · T-3                          |
| **RTG-03** | jede gerenderte Route ist serverseitig bekannt          | R-24, R-25, R-42 · T-1, T-11              |
| **RTG-04** | jede Sitemap-URL ist bekannte indexierbare Route        | R-48, R-49 · T-9, T-12                    |
| **RTG-05** | jeder Search-Link zeigt auf eine bekannte Route         | R-50 · T-17                               |
| **RTG-06** | jedes Redirect-Target ist bekannte kanonische Route     | R-36 · T-16                               |
| **RTG-07** | unbekannter statischer Pfad liefert 404                 | R-05, R-39 · T-5                          |
| **RTG-08** | unbekannter dynamischer Slug liefert 404                | R-30, R-31, R-39 · T-5                    |
| **RTG-09** | Runtime Error wird nicht als 404 maskiert               | R-41 · T-19                               |
| **RTG-10** | 404 erzeugt keinen Canonical-/hreflang-Surface          | R-46 · T-6                                |
| **RTG-11** | `/services*` wird serverseitig permanent umgeleitet     | R-13, R-38 · T-3, T-15                    |
| **RTG-12** | Consumer besitzt zehn Locale-Varianten                  | R-09, R-52 · T-8                          |
| **RTG-13** | Epigenetik ist routenseitig eigenständige Säule         | R-10, R-53 · T-10                         |
| **RTG-14** | Navigation/Sitemap/Search erfinden keine Pfade          | R-25, R-48, R-50, R-51 · T-11, T-17, T-18 |

---

## 9. Forbidden Regressions

- ❌ `isKnownPath`, `KNOWN_PATHS`, `NOT_FOUND_MARKER` oder `Cache-Control: no-store` entfernen oder umbenennen
- ❌ Den `prerender-status-code`-String auf einer der beiden Seiten ändern, ohne die andere mitzuändern
- ❌ `server.ts` oder `App.tsx` als Datei aus `main` übernehmen (**N1**, **N12**)
- ❌ `GermanOnlyPage` entfernen außerhalb von AP08 PT08.4.3
- ❌ Eine Route nur in `App.tsx` anlegen (rendert, antwortet 404)
- ❌ Einen `:slug`-Catch-all **vor** seine expliziten Pfade stellen
- ❌ Consumer-Routen auf `/en/` zwingen, `noindex` setzen oder mit Basic Auth schützen (`DEC-RL-006`, `REST-03`)
- ❌ Eine clientseitige `<Navigate>` als Ersatz für eine zugesagte 301
- ❌ Redirect-Ketten oder -Schleifen erzeugen
- ❌ `legacyAnchors.ts` ersatzlos löschen
- ❌ Nach AP10 PT10.3 eine parallele Routentabelle anlegen

**Aus AP02 PT02.2 zusätzlich:**

- ❌ **Known Paths aus der Sitemap ableiten** — oder umgekehrt Route-Existenz an einen Sitemap-Eintrag binden
- ❌ **„Nicht in der Sitemap" oder „nicht in der Navigation" als „unbekannte Route" behandeln**
- ❌ Eine unpräfixierte Seiten-URL als zweite kanonische URL, Sitemap-Eintrag oder Canonical-Ziel führen
- ❌ Die Locale aus `Accept-Language`, Cookie oder gespeichertem Wunsch statt aus der URL ableiten
- ❌ Query-String oder Fragment zum Bestandteil der Route-Identität machen
- ❌ Eine Seiten-Locale-Weiche oder den Seiten-404-Handshake auf `/api/*`, Assets oder Locale-Dateien anwenden
- ❌ Einen dynamischen Slug allein deshalb mit 200 beantworten, weil das Pfadmuster passt
- ❌ Die Statusentscheidung davon abhängig machen, ob die Seitenkomponente gerendert hat
- ❌ **Für dieselbe dynamische Route zwei Slug-Quellen führen**
- ❌ Ein Redirect-Ziel setzen, das keine bekannte kanonische Route ist oder selbst Redirect-Quelle ist
- ❌ Einer Redirect-Quelle einen Canonical, ein hreflang, einen Sitemap-Eintrag oder einen Search-Treffer geben
- ❌ Die Route Registry zur Content-Datenbank machen oder Slug-Listen aus ihrer fachlichen Quelle abschreiben
- ❌ Einen sprachlichen Sonderfall als implizite Pfadliste in zwei Dateien statt als deklarierte Locale-Policy führen
- ❌ **Epigenetik routenseitig oder IA-seitig als Untergruppe von `/diagnostics` modellieren** (`DEC-RL-005`)
- ❌ Eine Navigationsentscheidung als Routen-Existenzentscheidung behandeln

---

## 10. AP Ownership / Lifecycle

| Phase                  | AP                                  | Ergebnis                                                                                                                                               |
| ---------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Definition             | **AP02 PT02.2**                     | Routing-Zielbild, Registry als Single Source of Truth — **festgeschrieben 2026-08-24** (§3.1, R-17–R-53, §5.1 RD-8–RD-14, M-06–M-08, §8.1/§8.2, §10.1) |
| Inventar               | **AP03 PT03.1**                     | vollständiges Seiten-/Routeninventar                                                                                                                   |
| **Umsetzung/Eigentum** | **AP10**                            | Registry (PT10.3), Redirects (PT10.1), Alt-URL-Migration (PT10.2), Statusmatrix (PT10.4)                                                               |
| Konsum                 | AP06, AP07, AP09, AP11–AP21         | Navigation, Suche, SEO-Artefakte, Seiten leiten sich ab                                                                                                |
| Absicherung            | **AP27 PT27.5**                     | Route-/Statusregression in CI                                                                                                                          |
| Migration              | **AP29 PT29.2**                     | finale Redirect Map vor Go-live                                                                                                                        |
| Abnahme                | **AP30 PT30.1**, **AP31 PT31.2–.3** | Funktions-QA und Produktions-Smoke                                                                                                                     |
| Wartungsregeln         | **AP33 PT33.3.1**                   | „neue Route" als dauerhafte Prozedur                                                                                                                   |

### 10.1 Owner-Grenzen des Routing-Zielbilds (AP02 PT02.2)

PT02.2 legt **Architektur** fest und implementiert sie **nicht**. Die Umsetzung liegt bei:

| Owner-AP      | Verantwortet                                                                                                                  | Bezug                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **AP03**      | Informationsarchitektur, Seitentypen, Navigationskontext — welche Route wo im IA-Modell steht                                 | R-23, R-51, `RD-11`                    |
| **AP06**      | Header, Footer und globale Navigation als Konsument der Routenwahrheit                                                        | R-51 · T-18                            |
| **AP07**      | Suche und interne Findability als Konsument; Beseitigung toter Suchziele                                                      | R-50 · T-17 · `RD-12`                  |
| **AP08**      | Locale-Auflösung, 10-Sprachen-Parität, Abbau der German-only-Sonderlogik (PT08.4.3)                                           | R-17, R-18, R-45 · `RD-14`             |
| **AP09**      | SEO-Plattform: Canonical, hreflang, Sitemap aus der Registry                                                                  | R-43–R-49 · T-9, T-12, T-13            |
| **AP10**      | **Eigentümer der Umsetzung** — Route Registry (PT10.3), Redirects (PT10.1), Alt-URL-Migration (PT10.2), Statusmatrix (PT10.4) | R-24–R-42 · T-11–T-16, T-19, T-20      |
| **AP15/AP16** | Epigenetik-Säule und Musterbefunde als Nutzer der Routing-Plattform                                                           | R-53 · T-10                            |
| **AP21**      | Consumer × 10, Auflösung des `/en/`-Zwangs                                                                                    | R-52 · T-8 · `RD-6`                    |
| **AP20**      | Indexierbarkeits-Policy der Legal-Seiten (PT20.4.8)                                                                           | R-23 Klasse 8 · `SEO-CONTRACT.md` SD-2 |
| **AP27**      | automatisierte Guards und CI-Verankerung aller Nachweise aus §8/§8.1                                                          | T-11–T-20 · `RD-13`                    |
| **AP29**      | finale Redirect Map vor Go-live                                                                                               | R-34–R-37                              |

**Änderungen an diesem Vertrag** verantwortet AP10; jede Anpassung braucht einen Beleg aus dem
Master-Scope. Decision Locks werden hier nie geändert.
