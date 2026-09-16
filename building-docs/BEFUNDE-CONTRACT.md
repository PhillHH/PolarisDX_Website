# Befunde Contract

**Status:** AP16 COMPLETE — PT16.1–PT16.5 PASS; AP16 Closure PASS
**Verified:** 2026-09-01  
**Repository:** `/home/phillip/01polaris-preview`  
**Branch:** `console/10-15-2026-08-28T08-18-27`  
**HEAD:** `8a142173a5e2f89de09af2e76a1ce28ea243782e`

This is an AP16 evidence and interface contract. It does not replace the AP10 Route Registry,
the report JSON files, AP09 SEO sources, AP08 i18n configuration or the AP15 Epigenetics contract.

## 1. Serial authority

- AP15 is `COMPLETE`; AP15 Closure is `PASS`; PT15.1 through PT15.7 remain `PASS`.
- AP16 is `COMPLETE`; PT16.1 through PT16.5 and AP16 Closure are `PASS`.
- AP17 remains `NOT STARTED`; Decision Locks remain 18/18.
- PT16.5 changed no report values, claims, PDFs, Route Registry or Lead Foundation. It added only
  the broad integration harness and aligned the predecessor Golden-Path expectation with the
  already implemented `source=musterbefund` report provenance.

## 2. Canonical families, order and Registry mapping

`src/content/befunde/meta.ts` owns the JSON-free family order. The AP10 Registry consumes that order
as the dynamic source of its single `report-detail` family; no second Known-Path, Sitemap, Search or
test route list was introduced.

| Order | Slug                    | DE panel / EN panel                          | Registry family | Canonical path                                    |
| ----- | ----------------------- | -------------------------------------------- | --------------- | ------------------------------------------------- |
| 1     | `metabolic-health`      | Metabolic Health                             | `report-detail` | `/epigenetics/musterbefund/metabolic-health`      |
| 2     | `healthy-aging`         | Healthy Aging                                | `report-detail` | `/epigenetics/musterbefund/healthy-aging`         |
| 3     | `biologische-altersuhr` | Biologische Altersuhr / Biological Age Clock | `report-detail` | `/epigenetics/musterbefund/biologische-altersuhr` |
| 4     | `telomer-analyse`       | Telomer-Analyse / Telomere Analysis          | `report-detail` | `/epigenetics/musterbefund/telomer-analyse`       |
| 5     | `stress-monitor`        | Stress Monitor                               | `report-detail` | `/epigenetics/musterbefund/stress-monitor`        |
| 6     | `healthy-sport`         | Healthy Sport                                | `report-detail` | `/epigenetics/musterbefund/healthy-sport`         |

`BEFUND_PANEL_NAMES` is a compile-time-complete record keyed by the `BEFUND_ORDER` slug union. The
URL-context allowlist derives its ordered entries from these JSON-free metadata and no longer needs
the historical eager DE/EN `BEFUNDE` content import.

## 3. Canonical data model and validation

`src/content/befunde/model.ts` defines:

- `BefundSlug` and the exact x10 `BefundSprachen` mapping;
- a discriminated `BefundBlock` union for every currently productive block type;
- normalized document metadata (`slug`, `panel`, `title`, `introduction`, `blocks`);
- runtime/build validation through `defineBefundFamily` (guards) / `loadBefundFamily` (route modules since AP25 PT25.2: server validates all ten locales, the browser loads and validates only the URL locale), `validateBefund` and
  `validateBefundInventory`;
- a named `BefundValidationError` hard-failure contract.

The validator rejects a missing/wrong/duplicate slug, a missing or foreign locale, empty required
title/introduction/block data, an unknown block type, missing block-specific required fields,
duplicate block IDs, empty required arrays, non-finite numbers, table row/column mismatches and
radar label/vector dimension mismatches. Cover title/claim are the validated title/introduction
source; no content value is synthesized.

`npm run check:befunde` reads the real 60 JSON documents, validates the exact filesystem inventory,
the six ordered Registry records and all six explicit lazy route modules. The production `build`
runs this guard before Vite, so invalid launch data exits non-zero before output is produced.

## 4. Current block catalogue preview

PT16.1 models and validates these 14 existing discriminators:

`cover`, `principle`, `callout`, `resultTable`, `evaluations`, `markers`, `table`, `summary`,
`contact`, `ageDots`, `radar`, `bigResult`, `trend`, `science`.

| Family                | Blocks | Productive block types                                                                                 |
| --------------------- | -----: | ------------------------------------------------------------------------------------------------------ |
| metabolic-health      |     22 | cover, principle, callout, resultTable, evaluations, markers, table, summary, contact                  |
| healthy-aging         |     11 | cover, principle, callout, resultTable, ageDots, markers, radar, table, summary, contact               |
| biologische-altersuhr |     15 | cover, principle, callout, bigResult, ageDots, markers, radar, table, trend, summary, science, contact |
| telomer-analyse       |     13 | cover, principle, callout, bigResult, ageDots, radar, table, trend, summary, science, contact          |
| stress-monitor        |     17 | cover, principle, callout, markers, resultTable, bigResult, table, trend, summary, contact             |
| healthy-sport         |     18 | cover, principle, callout, evaluations, table, markers, radar, trend, summary, contact                 |

`BefundBlock` handles all 14 discriminators in an exhaustive switch and ends in `assertNever`;
unknown productive types therefore fail in validation and cannot silently become an empty render.
Semantic rendering is mapped as follows: headings remain hierarchical; steps, bullets,
evaluations and trend rows use real lists; metadata, result comparisons and chart alternatives use
`dl/dt/dd`; data grids use named tables with `caption`, column `th scope=col` and row
`th scope=row`. Mobile-width tables retain an explicitly named, focusable keyboard scroll region.

## 5. Chart/source truth

The 60 localized JSON files remain the current report-content source. Existing numeric values are
unchanged. `RADAR_VALUES` remains JSON-free metadata for the four families that render a lifestyle
radar; validation requires finite vectors and exact label/vector dimensions. PT16.2 renders both
the SVG polygon and its `dl` alternative from those same arrays; automated parity checks compare
the rendered values with the canonical vectors. The historical source note remains authoritative:
these vectors were reconstructed from the approved vector source and must not be re-estimated.

## 5.1 Complete chart/visual catalogue

| Visual                    | Source                                                     | Non-visual / non-colour contract                                                   |
| ------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Scale ramp / scale bar    | block `kind`, `value`, ticks, display, status, zone labels | value/status/ticks remain visible; marker and wording carry meaning beyond colour  |
| Age dots                  | `ageDots` chronology, range and item values                | semantic list, visible exact value/delta and dashed chronology reference           |
| Radar / network diagram   | `RADAR_VALUES` plus localized block axes/series labels     | solid vs dashed series; exact per-axis profile/reference `dl` alternative          |
| Trend                     | `trend.items` first/second values and displays             | hollow vs filled points; real list and visible first → second values/status        |
| Evaluation bars           | `evaluations.items` values/status                          | real list with explicit value `/9` and status; colour is supplementary             |
| Report miniature/overview | already validated report block values                      | summary labels/values remain text; no separate estimated numeric source introduced |

Radar labels are non-empty and dimension-aligned for every applicable family in all ten locales.
No chart value, range, unit, threshold or comparison value was introduced by PT16.2.

## 6. x10 content matrix and HTTP basis

Each family has real files for exactly `de,en,pl,fr,it,es,pt,da,nl,cs`: **60/60 validated**. Content
stays outside global i18n bundles and no silent DE/EN fallback is used by the family modules.

Fresh production SSR evidence on 2026-09-01:

- Registry derivation: 6/6 families and 60/60 unique locale paths.
- Known routes: 60/60 direct HTTP 200, matching URL-locale `html lang`, redirects 0.
- Unknown `/de/epigenetics/musterbefund/not-a-real-report`: HTTP 404, `noindex`, Canonical 0.
- G1 Route Registry, G3 SEO and G4 i18n targeted guards: PASS.

## 7. Lazy loading and chunks

`App.tsx` owns six explicit `React.lazy` imports. Each route module imports and validates only its own
ten locale documents. The App shell and metadata index import no report JSON. The Node-20 production
build emits six separate client chunks and six separate SSR chunks named for the family slugs;
loading one report therefore does not load the other five content families. PDFs are URL assets and
are not imported or prefetched by this model.

## 8. Download references

The current report download references are the six real German PDFs
`de/10_Musterbefund_Metabolic_Health_PolarisDX.pdf` through
`de/15_Musterbefund_Healthy_Sport_PolarisDX.pdf`, plus
`PolarisDX_Musterbefunde_DE.zip`. Web content remains x10 while these assets remain truthfully DE.
PT16.1 changed neither files nor locale disclosure; PT16.5 owns the final PDF/Web hard gate.

## 9. Legacy anchor inventory

Existing aliases remain in `src/content/befunde/legacyAnchors.ts`: metabolic-health 33,
healthy-aging 18, biologische-altersuhr 20, telomer-analyse 18, stress-monitor 26 and healthy-sport
24 aliases. Stable targets remain validated block `id` values. PT16.3 retains each evidenced alias
as a client-side hash mapping (HTTP never sees fragments), rewrites it to the stable ID, opens a
collapsed target chapter and scrolls after layout. One real alias per family passed direct-load
browser validation; unknown hashes remain unchanged and safe. No speculative alias was added.

## 10. PT16.1 evidence

- Typecheck: PASS.
- Scoped ESLint and Prettier: PASS.
- Model/negative/panel/routing tests: 17/17 PASS; inline negative fixtures cover unknown block,
  missing required field, wrong radar dimension, NaN, missing locale and duplicate slug.
- `check:befunde`: 6/6 families, 60/60 documents, 6/6 Registry routes, 6/6 lazy modules PASS.
- G1/G3/G4: PASS; Preview-host and parallel-route findings 0 through existing guards.
- Production client/SSR build under Node 20: PASS; family-specific chunks 6/6 in each output.
- Production SSR/HTTP: 60/60 known 200; representative unknown slug true 404.

## 11. PT16.2 rendering, accessibility, responsive and print evidence

- Component/model tests: 10/10 PASS, including unknown-renderer hard failure, exact Radar vector
  alternative, and the applicable family × ten-locale chart-label/dimension matrix.
- Browser block catalogue: all 14/14 productive types found and all non-cover block IDs rendered
  across the six German representative report pages.
- Table semantics: every tested report table has a caption, column headers and row headers; its
  named focusable overflow region preserves keyboard and mobile access.
- Chart/data parity: Healthy Aging's rendered profile/reference alternative matches every
  canonical `RADAR_VALUES` entry; all other source vectors retain build-time dimension validation.
- Non-colour cues: Radar reference is dashed while the profile is solid; trend series use hollow
  versus filled markers; exact numeric/status text remains present for all chart families.
- Responsive/visual smoke: Chromium at 390, 768 and 1440 px on Healthy Aging, Biological Age Clock
  and Metabolic Health; horizontal overflow 0 and task-owned screenshots produced.
- Accessibility: representative Axe serious/critical findings 0 at all three widths.
- Print: native `beforeprint` opens closed report chapters temporarily and `afterprint` restores
  them; global navigation/actions are suppressed while notices, tables, SVGs and chart alternatives
  remain visible. Wide tables use printable width and static row/column headers.
- Performance: `BefundCharts` remains report-only and separately chunked; six report-family chunks
  remain separate. No chart library, PDF import/prefetch or second data source was added.
- Typecheck, scoped ESLint and Prettier: PASS. Fresh client and SSR production graph build: PASS in
  isolated output; the repository `dist/client` output itself remains protected predecessor state
  and rejected Vite cleanup with `EACCES`, so it was not overwritten.

## 12. PT16.3 navigation and Inquiry-context evidence

- Navigation order: `getBefundNeighbors` derives a linear, non-wrapping Previous/Next pair only
  from canonical `BEFUND_ORDER`. The first report has no Previous target and the last no Next target;
  unit evidence covers all six positions and off-by-one boundaries.
- Siblings: every report exposes exactly the other five canonical families, excludes itself and
  preserves locale, optional Focus and Campaign. The Chapter switcher uses the same URL builder.
- IA: the existing locale-aware Breadcrumb remains `Home → Epigenetics → Musterbefunde → current`;
  both the chapter bar and report close provide a real Hub return with panel/focus/campaign context.
- Inquiry handoff: report CTAs reuse the AP15 `/epigenetics#inquiry` UI and the existing
  `epigenetics_inquiry` journey. They carry `source=musterbefund`, canonical report slug as `panel`,
  `focus`, `campaign` and URL-derived language. The existing shared store persists these fields and
  routes the journey through the unchanged central `epigenetics` CRM target. No Form/API/Outbox/CRM
  platform was added.
- Server truth: the vertical slice allowlists `epigenetics | musterbefund`, rejects foreign source
  values, and persists report provenance before the existing handoff. A backend integration test
  verifies stored/routed source, panel and origin route on the real shared repository.
- x10 navigation: `befund.previous` and `befund.next` contain real localized labels for exactly
  `de,en,pl,fr,it,es,pt,da,nl,cs`; G4 reports zero missing/empty keys.
- Runtime matrix: isolated Node-22 production client and SSR graph build PASS. The production-built
  Chromium suite covers 60/60 locale/report cases, all Previous/Next positions, five siblings per
  report, Hub/Breadcrumb/Inquiry links, reload and context payload, one legacy alias per family,
  unknown-hash safety and 60/60 live internal report targets. Four task E2E scenarios PASS.
- Regression gates: typecheck; scoped ESLint/Prettier; 14 focused unit/backend tests; `check:befunde`;
  G1; G4; Search and Internal Findability all PASS. Dead/redirect-source/legacy `/services` report
  targets and Preview-host findings are 0.

## 13. PT16.4 SEO, Search, Sitemap and Structured Data evidence

- Metadata source: every `epigenetics.json` contains six distinct, locale-specific
  `befund.seo.<slug>.title/description` pairs. The 6×10 SSR matrix resolves all 60 without a
  translation key or generic-family fallback. Titles and descriptions remain example-oriented and
  do not introduce diagnoses, therapies, parameters, prices or result promises.
- Search: the six report entries now consume those same approved family metadata keys instead of a
  separate generic Search description. The central Registry still exclusively owns path and
  eligibility. `check:search-index` verifies 6/6 reports in every locale and canonical 200 targets.
- Canonical/hreflang: all 60 SSR heads contain exactly one self-canonical on
  `https://polarisdx.net`, ten real locale alternates and `x-default` to the German sibling.
- Sitemap: Registry-derived kind `befund` contains exactly 60/60 locale URLs; every entry carries
  ten alternates plus German x-default. Redirect, noindex, unknown and Preview targets are absent.
- Social metadata: each family uses its real 1200×800 report cover crop for OG and Twitter, with
  explicit locale-aware alt text from the family title. The isolated production build emits hashed
  assets for all six families; `/src/`, Preview and Dev host leakage are 0 in built SSR output.
- Structured Data decision: report pages emit only claim-safe `Article` and `BreadcrumbList`
  entities. Headline, description, URL, image and language match the visible metadata. No
  `MedicalTest`, `MedicalCondition`, `Product`, `Offer`, `Review`, price, availability, diagnosis or
  treatment entity/field is present.
- 404 SEO: an unknown report slug is outside Registry Known Paths, returns real HTTP 404 and emits
  `noindex, follow`, Canonical 0, hreflang 0 and JSON-LD 0.
- Reproducible guard: `npm run check:befunde-seo` performs the 60/60 source-SSR matrix, Search and
  Sitemap parity, social/schema safety, Preview-host sweep and unknown-slug negative control.
  Typecheck, scoped ESLint/Prettier, 29 focused unit tests, `check:befunde`, G1, G3, G4 and Search
  pass. Isolated production client/SSR builds and a 60/60 HTTP smoke also pass.

## 14. PT16.5 broad integration evidence

- Full web matrix: all six families in exactly `de,en,pl,fr,it,es,pt,da,nl,cs` render 60/60 with
  HTTP 200, URL/body locale truth, localized report title, productive blocks, visible regulatory
  notice, report-context Inquiry target and no Preview link. The 100-route package matrix also
  reverified Hub, three deep routes and all six report families across x10.
- Data/chart truth: every non-cover productive block ID renders on all six German source reports.
  All explicit result displays, table cells, evaluation displays, age values and trend deltas are
  compared with the canonical JSON source after presentation whitespace normalization. Every Radar
  axis and every profile/reference value is compared with the canonical `RADAR_VALUES` vector.
  `NaN`/`Infinity` findings are 0; all 14 productive block types remain exhaustively covered.
- PDF/Web truth: the six report pages point to the six matching real German Musterbefund PDFs, each
  responds 200 as `application/pdf` and exceeds 50 kB. Every locale declares `hreflang=de`; all
  non-DE pages expose the localized German-asset disclosure. The resource/claim guards inventory
  29/29 launch-visible files, text-inspect 26/26 PDFs and report zero broken links or contradictory
  hard claims. No fake PDF x10 parity or AP19 gate was introduced.
- Navigation: the 60-case Previous/Next/sibling matrix, Hub return, Breadcrumb/Inquiry targets,
  direct reload, one evidenced legacy alias per family and unknown-hash safety all pass. The real
  production Golden Path is Header/Home → Hub → Healthy Aging report → existing AP15 Inquiry →
  persisted `epigenetics_inquiry` → CRM adapter delivery. SQLite evidence is `DELIVERED` with one
  attempt and persisted `source=musterbefund`, panel, locale, origin route and processing consent;
  no analytics provider request occurred before consent.
- Accessibility/responsive/print: Axe serious/critical is 0 on all six families with all chapters
  expanded. Eighteen family/viewport cases cover 390 px Czech, 768 px Polish and 1440 px French;
  horizontal overflow is 0 and notices/CTA remain visible. Native print lifecycle passes on Healthy
  Aging, Stress Monitor and Healthy Sport: chapters and chart alternatives are visible, notices are
  retained, tables are unclipped and global navigation is suppressed.
- Performance/build: Home plus one report generates no PDF prefetch, Google provider request or
  request for any of the other five report payloads. Isolated production client and SSR builds pass.
  The client emits six distinct family chunks (153–331 kB raw); `BefundCharts` remains a separate
  report-only chunk and no chart library was added to the site shell.
- Quality: typecheck, scoped ESLint/Prettier, 22 Befund unit tests, 23 Inquiry/Foundation tests,
  `check:befunde`, G1, G3/report SEO, G4, Search, Internal Findability, Claim and Resource guards
  pass. The final production-like Playwright gate passes 33/33.
- Toolchain note: the host Node 18 runtime is below Vite 7's supported Node range and requires a
  process-local `crypto.hash` compatibility shim for the isolated build; no repository dependency or
  production source was changed for this host condition. Two older jsdom route test workers also
  cannot initialize under this installed Node/jsdom combination, while their executable G1 route
  guard and all PT16-specific route/SSR/browser assertions pass.

## 15. AP16 Closure independent evidence

- Closure independently reran the positive and negative model suite: 22/22 focused Befund tests
  pass, including duplicate slug, invalid/unknown block, missing required data, bad Radar vector,
  non-finite numbers and missing locale. The production `check:befunde` guard revalidated 6/6
  families, 60/60 locale documents, Registry parity and six lazy route modules.
- Fresh static gates pass: TypeScript, scoped ESLint/Prettier, G1 Route Registry, G3/report SEO, G4
  i18n, Search, Internal Findability, Regulatory/Claim and Resource guards. The current inventories
  are 14/14 productive block types, 29/29 visible assets, 26/26 text-inspected PDFs and zero broken
  visible links, Preview leakage, hard-claim findings or schema amplification.
- Fresh isolated production client and SSR builds pass. They emit six distinct family chunks
  (153–331 kB raw), a report-only chart chunk and no PDF payload. Three independently requested
  unknown report slugs return HTTP 404/noindex with zero Canonical and zero hreflang entries.
- The fresh production-like Browser gate passes 33/33 after hardening its SSR-hydration boundary.
  It covers 60/60 locale-report cases, all six canonical data/chart surfaces, Axe on 6/6 reports,
  18 responsive cases, three Print variants, lazy/pre-consent network behavior, 60 deterministic
  navigation cases, context handoff, evidenced Legacy anchors and the real Inquiry Golden Path.
- A fresh isolated SQLite/CRM run contains exactly one logical `epigenetics_inquiry`, persisted
  before handoff and ending `DELIVERED` after one CRM attempt. Its durable context records
  `source=musterbefund`, `panel=healthy-aging`, `locale=de`, origin route and processing consent;
  the outbox and five audit events remain present. No application log emitted PII or secrets.
- BEF-01–BEF-40 and C16-01–C16-50 are Closure-verified PASS. False-ready findings and AP16-owned
  blockers are zero. AP17 was not started and no AP19/AP22/AP24/AP25 platform was duplicated.

## 16. Open later-owner items

- AP17 is the next work package and remains `NOT STARTED` until explicitly started.
- AP19/AP22/AP24/AP25 retain their platform ownership; none was started or duplicated by AP16.
- The repository toolchain should align its execution host with Vite 7's supported Node range;
  Closure used an isolated process-local compatibility shim and changed no production source or
  dependency for the current Node 18 host condition.
