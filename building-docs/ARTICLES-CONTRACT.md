# Articles Contract

## Purpose and ownership

This document records AP17 article inventory and verification evidence. It is not a second route,
search, sitemap, SEO or content source of truth. Public route identity remains the canonical slug
from the AP10 Route Registry; metadata copy remains in the existing locale namespaces and detail
bodies in their slug-specific article content modules.
Long-lived editorial governance remains backlog item DEC-RL-010.

## PT17.1 evidence baseline

- Repository: `/home/phillip/01polaris-preview`
- Branch: `console/10-15-2026-08-28T08-18-27`
- HEAD measured before implementation: `8a142173a5e2f89de09af2e76a1ce28ea243782e`
- Predecessor: AP16 COMPLETE / AP16-CLOSURE PASS
- Supported locales: exactly `de,en,pl,fr,it,es,pt,da,nl,cs`; default and x-default remain `de`
- PT17.1 result: PASS; AP17 remains IN_PROGRESS and AP18 remains NOT STARTED

## Published launch inventory

All six records below are `PUBLISHED_LAUNCH`. Their public projection is consumed by the existing
Registry, Search, Sitemap and UI; internal IDs are never public route identities.

| Internal ID                | Canonical slug                                                  | Locales | Published  | Author         | Image            | Route/Search/Sitemap       |
| -------------------------- | --------------------------------------------------------------- | ------: | ---------- | -------------- | ---------------- | -------------------------- |
| `green_practice`           | `die-gruene-praxis`                                             |   10/10 | 2025-11-28 | PolarisDX Team | `green.png`      | eligible/eligible/eligible |
| `invisible_patient`        | `der-unsichtbare-patient`                                       |   10/10 | 2025-11-30 | PolarisDX Team | `homeclinic.png` | eligible/eligible/eligible |
| `five_minute_diagnosis`    | `die-5-minuten-diagnose`                                        |   10/10 | 2025-12-02 | PolarisDX Team | `makemoney.png`  | eligible/eligible/eligible |
| `ecosystem_of_rapid_tests` | `the-ecosystem-of-rapid-tests-why-compatibility-creates-safety` |   10/10 | 2025-11-25 | PolarisDX Team | `Testbild1.png`  | eligible/eligible/eligible |
| `rapid_setup_formula`      | `die-performance-formel-effizienz-in-der-poc-diagnostik`        |   10/10 | 2025-11-25 | PolarisDX Team | none             | eligible/eligible/eligible |
| `precision_point_of_care`  | `precision-in-point-of-care-the-key-to-patient-safety`          |   10/10 | 2025-11-25 | PolarisDX Team | none             | eligible/eligible/eligible |

Titles, teasers and section bodies are present for every one of the 60 article-locale documents.
Serialized localized documents are distinct across all ten locales per article; the PT17.1 guard
found no exact DE/EN document fallback under another locale. Modified dates, reviewers and a
normalized source inventory are not present in the current structured inventory and are therefore
not displayed or claimed.

## Non-public content evidence

`first_checkup`, `managing_diabetes` and `home_care` still occur as locale-only content remnants in
all ten `articles.json` files. They have no structured article record, canonical Registry family,
Search target or Sitemap target. They are classified `DRAFT_OR_NON_PUBLIC` for PT17.1 and excluded
from the published projection and index. A direct example (`/de/articles/first_checkup`) returns
HTTP 404. They are not promoted merely to make the inventory larger.

The known internal-ID legacy source `/de/articles/green_practice` remains a server-side 301 to
`/de/articles/die-gruene-praxis`; it is not rendered as an index-card target.

## Article index contract

- The index renders exactly the six published launch records and no featured placeholder.
- Each card is a semantic `article` containing one named, locale-aware canonical link.
- Real title and teaser copy come from the active locale. Author and a machine-readable `time`
  element are rendered because those values exist; absent reviewer/modified metadata creates no
  empty slot.
- Four repository-backed images render with fixed intrinsic dimensions, `loading="lazy"` and
  `decoding="async"`. They are decorative within already named links and therefore use empty alt.
  The two image-free records use a decorative category icon rather than a fake image.
- Pagination/filter decision: `NOT_REQUIRED_CURRENT_CONTENT_VOLUME` for six launch records.
- The primary hero CTA is an in-page jump to the real article list.

## Route, Search, Sitemap and x10 evidence

- Published index projection: 6/6 canonical slugs, unique IDs and unique slugs.
- Browser card matrix: 6 articles x 10 locales = 60/60 HTTP 200 without redirect.
- AP10 G1: PASS; Search guard: 6/6 article families and ten locales PASS.
- Sitemap/Registry targeted tests: PASS; redirect-source and draft records are absent.
- G4: PASS for 15 namespaces x10; targeted content completeness and fallback guards PASS.
- Preview-host findings: 0 in the PT17.1 browser matrix.

## Accessibility, responsive and performance evidence

- Production-like browser tests at 390 px (`cs`), 768 px (`pl`) and 1440 px (`fr`) report no
  horizontal overflow and Axe serious/critical = 0.
- Card links have localized accessible names, valid focus behavior from the existing Card contract
  and no nested interactive controls. Small metadata/chip colors use the AA-safe strong tokens.
- Client production chunk `ArticlesIndexPage`: approximately 5.4 kB (2.3 kB gzip).
- Four real card images are lazy; no PDF or non-essential provider is prefetched by the index.
- The index data module and active-locale `articles` namespace carry index/SEO metadata, not article
  bodies. PT17.2 moved the unchanged bodies into six slug-specific x10 route chunks, so the index
  and unrelated article routes no longer load them eagerly.

## Open later-owner items

- Future editorial ownership: source, reviewer and modified-date fields remain absent until approved
  metadata becomes available; omission is the truthful launch state.
- DEC-RL-010 backlog: durable editorial workflow/governance; no CMS was built in PT17.1.
- AP19/AP22 remain owners of generic gated resources and shared lead/CRM platform work.

## PT17.2 article-template contract

All six `PUBLISHED_LAUNCH` routes use one semantic `ArticlePage` template with this stable order:
real Breadcrumb, one H1, locale lead, visible-truth metadata, lazy hero image when present, body
sections, an optional sources section, taxonomy-derived related articles/services, an optional
taxonomy-backed Epigenetics crosslink, and the existing general-sales CTA. There are no per-article
layout forks and no new lead/API path.

### Metadata and reading time

- The stored publication dates and author values from the current inventory are rendered through
  `<time datetime>` and Article JSON-LD. The view does not synthesize `new Date()` or a build date.
- No current launch record has an approved modified date or reviewer, so both fields are omitted
  from visible metadata and schema. No empty label or generic reviewer is rendered.
- Reading time is calculated deterministically from visible lead and localized body prose at 200
  Unicode words per minute, rounded up with a one-minute minimum. Structural discriminators,
  image paths and URLs do not enter the count. The locale-specific display uses the ten approved
  `detail.read_time` strings.

### Body, images and sources

- The renderer produces one H1, section H2s and key-point H3s, semantic paragraphs/lists, and
  captioned column-header tables. The six current content families use the same renderer.
- Four real repository WebP assets use their measured intrinsic dimensions, responsive `sizes`,
  lazy loading and async decoding. Current source data has no approved captions or informative alt
  copy, so the images are truthfully treated as decorative with empty alt; the other two articles
  render no fake image. Caption/alt fields render only when real source metadata is supplied.
- Current structured records contain zero normalized sources. Therefore no source block, DOI,
  journal, author or link is invented. The template supports a sources list only for explicit
  records and its heading is present in all ten UI locales.

### Related content, CTA and route truth

- Related articles are deterministic: they share at least one explicit `relatedServiceIds` taxonomy
  value with the current article, exclude self, and use canonical Registry article targets.
- Related services resolve through `serviceDetailEntries`; no `/diagnostics/${id}` path mirror is
  constructed in the template. The Epigenetics link appears only when the related service taxonomy
  already declares that Registry crosslink.
- The localized primary CTA uses `common.nav.cta_quote` (German: `Angebot anfragen`) and the existing
  Registry-backed general-sales target `/contact?intent=quote#kontaktformular`. It creates no new
  contact, inquiry, persistence or CRM path.
- Breadcrumb UI and BreadcrumbList schema share the real Home -> Articles -> current canonical
  article IA.

### Article schema mapping

Article JSON-LD is limited to visible truth: localized headline/description, canonical page URL,
real image when present, stored publication date, stored author, publisher from the existing AP09
helper, and active language. `dateModified` and reviewer are absent because current content has no
approved values. No source metadata is fabricated.

### Detail content loading and quality evidence

- The active-locale metadata namespace contains titles, excerpts and SEO metadata only. Body and
  key-stat content was mechanically moved without rewriting into six slug-specific x10 JSON
  modules under `src/content/articles/`.
- Six explicit lazy route modules are derived from the AP10 Registry article entries. A production
  request loads the current article chunk plus the shared ~11.8 kB ArticlePage renderer, not the
  other five article-body chunks. Unknown slugs still use the existing generic family route and
  return real HTTP 404.
- Typecheck and task-scoped ESLint/Prettier: PASS. Unit: 8/8. Registry/Sitemap/Structured Data:
  25/25 under the Node test environment. G1/G3/G4/Search/Findability: PASS.
- Isolated production client and SSR builds: PASS. The build emits six independently named article
  chunks (about 38-68 kB uncompressed each) instead of one all-body payload.
- Production SSR: 60/60 article-locale URLs HTTP 200 with the shared template; unknown slug HTTP 404. PT17.2 Playwright: 6/6, covering all six article types, x10 deterministic reading time,
  canonical internal targets, CTA, schema truth, pre-consent network, 390/768/1440 responsive
  layouts and targeted Axe serious/critical = 0.

PT17.2 result: PASS. AP17 remains IN_PROGRESS, PT17.3 is next, AP18 remains NOT STARTED.

## PT17.3 public slug, redirect and 404 contract

The public article identity is the canonical slug already held by the AP10 Route Registry. Internal
IDs remain content lookup keys and are neither canonical paths nor Search/Sitemap targets. This
document records verification evidence; it does not add another route list.

| Internal ID                | Public canonical path                                                     | Historical source behavior |
| -------------------------- | ------------------------------------------------------------------------- | -------------------------- |
| `green_practice`           | `/articles/die-gruene-praxis`                                             | ID path -> 301, one hop    |
| `invisible_patient`        | `/articles/der-unsichtbare-patient`                                       | ID path -> 301, one hop    |
| `five_minute_diagnosis`    | `/articles/die-5-minuten-diagnose`                                        | ID path -> 301, one hop    |
| `ecosystem_of_rapid_tests` | `/articles/the-ecosystem-of-rapid-tests-why-compatibility-creates-safety` | ID path -> 301, one hop    |
| `rapid_setup_formula`      | `/articles/die-performance-formel-effizienz-in-der-poc-diagnostik`        | ID path -> 301, one hop    |
| `precision_point_of_care`  | `/articles/precision-in-point-of-care-the-key-to-patient-safety`          | ID path -> 301, one hop    |

The six ID migrations are evidenced legacy sources from the existing routing contract. They retain
the supported source locale and query string, terminate directly at the slug target and never form
a canonical or competing public ID route. There are no further evidenced slug changes. In
particular, `first_checkup`, `managing_diabetes` and `home_care` have no truthful public successor;
their locale-only remnants stay direct 404 and are not turned into speculative redirects.

### Registry, prerender, Search, Sitemap and internal links

- Registry expansion consumes only the published `articles` projection and emits six slug paths.
  Redirect sources are classified separately and their targets resolve directly to canonical
  Registry entries.
- The former `scripts/prerender.mjs` route catalogue is disabled as `LEGACY_NON_AUTHORITATIVE`,
  exits non-zero and contains no route/path list. Production rendering remains Express SSR.
- Search exposes 6/6 published article slug targets and no internal ID. Sitemap exposes exactly
  6 x 10 = 60 canonical article URLs, with neither ID redirect sources nor retired records.
- The targeted code sweep found no productive internal link to an article ID or redirect source.
  Index cards, Related Articles, sidebar/home references and direct content links resolve to the
  current slug target or through Registry-backed helpers.
- Unknown article slugs produce HTTP 404 plus `noindex, follow`; canonical, hreflang and Article
  schema are absent. This is server status truth, not a 200 NotFound UI.

### PT17.3 reproducible evidence

- Article identity/Registry/Search/Sitemap unit matrix: 37/37 targeted tests PASS.
- G1 Route Registry: PASS (25 families, 43 canonical paths, 30 classified redirects, 0 mirrors).
- G3 SEO/Sitemap: PASS (39 families, 390 public URLs, 60 truthful article lastmod entries); Search
  guard PASS with 6/6 articles and ten locales. The French index description emits one non-blocking
  length heuristic warning but no missing, placeholder or duplicate metadata finding.
- Fresh isolated client and SSR production builds: PASS under `/tmp`; the repository `dist/client`
  attempt was not used because a predecessor-owned generated asset was not writable.
- Production SSR article gate: 4/4 PASS, covering 60/60 slug routes/self-canonicals, all 60
  locale-specific internal-ID redirects with query preservation and direct 200 targets, unknown and
  retired 404 SEO, and Sitemap exclusion of every ID/redirect source.
- Typecheck, task-scoped ESLint and task-scoped Prettier: PASS. G9 article redirect chains: 0.

PT17.3 result: PASS. AP17 remains IN_PROGRESS, PT17.4 is next, AP18 remains NOT STARTED.

## PT17.4 launch metadata and integration evidence

The final launch projection remains six `PUBLISHED_LAUNCH` records, three locale-only non-public
remnants and six evidenced internal-ID redirect sources. No record was promoted or metadata added
to satisfy the gate. The six publication dates are now stored as canonical ISO calendar dates in
the shared Article model and are used unchanged by visible `<time>` elements, Article JSON-LD and
Registry-derived Sitemap `lastmod`. A productive metadata validator hard-fails invalid calendar
dates, modified dates before publication, missing authors, empty optional reviewer/source fields
and malformed source URLs. Current records truthfully omit `dateModified`, reviewer and normalized
sources; their schema and UI omit the same fields.

### Final x10, SEO and discovery matrix

- Six articles x ten locales = 60/60 production SSR routes with locale-specific title, teaser and
  body, one self-canonical, ten hreflang alternates plus x-default `de`, localized OG/Twitter
  metadata and no Preview host.
- Article JSON-LD on 60/60 pages matches visible headline, teaser, canonical URL, real publication
  date, stored author, publisher and `inLanguage`; absent modified/reviewer/source metadata is not
  amplified.
- The index renders the same six records in the canonical inventory order for every locale. Search
  exposes 6/6 published slug targets; Sitemap exposes exactly 60 article URLs and no draft,
  internal-ID or redirect-source target.
- Registry G1, SEO G3, i18n G4, Search and internal-findability guards pass. The only SEO diagnostic
  is the already documented non-blocking French index-description length warning; metadata is
  present, localized and unique.

### Template, links, conversion and quality gate

- All six articles retain the common Article template, taxonomy-derived related content,
  Registry-backed service/Epigenetics links and the existing general-sales CTA. The production-like
  browser crawl found zero broken or redirect-source links inside the Article template.
- Targeted unit/contract matrix: 49/49 PASS, plus the metadata validator's positive and negative
  cases. Typecheck and task-scoped ESLint/Prettier pass.
- Fresh isolated client and SSR production builds pass. The client continues to emit six separate
  slug body chunks (approximately 38-68 kB uncompressed), a lightweight index chunk (~5.4 kB) and
  shared ArticlePage renderer (~11.8 kB); loading one detail did not request sibling body chunks or
  a pre-consent analytics/marketing provider.
- Final Playwright gate: 20/20 PASS. It covers the x10 index, 60/60 HTTP/SEO metadata, 60/60 schema
  parity, canonical slug/redirect/404 semantics, deterministic reading time, related/CTA/internal
  links, and responsive/Axe checks at 390/768/1440 px. Axe serious/critical findings are 0 and
  horizontal overflow is <= 1 px. Independent screenshots of a Czech mobile index, Polish tablet
  detail and French desktop detail show no clipped cards, metadata, images or CTA.

DEC-RL-010 remains BACKLOG for durable editorial workflow, future metadata approval/maintenance,
review/reconciliation and governance. PT17.4 did not build a CMS, AP19 resource platform, AP22 lead
platform or any AP18 functionality.

PT17.4 result: PASS. AP17 remains IN_PROGRESS, AP17-CLOSURE is next, AP18 remains NOT STARTED.

## AP17-CLOSURE independent package evidence

- Closure date: 2026-09-01
- Repository: `/home/phillip/01polaris-preview`
- Branch: `console/10-15-2026-08-28T08-18-27`
- HEAD: `8a142173a5e2f89de09af2e76a1ce28ea243782e`
- Start gate: AP16 COMPLETE / Closure PASS; PT17.1-PT17.4 PASS; AP18 NOT STARTED;
  Decision Locks 18/18
- Working-tree protection: the complete predecessor chain was staged at Closure start; Closure
  changed only this contract and the global state, without staging, overwriting or cleaning it.

### Independently remeasured inventory and content truth

- The productive structured inventory contains exactly six `PUBLISHED_LAUNCH` records. Three
  locale-only remnants (`first_checkup`, `managing_diabetes`, `home_care`) remain non-public and
  direct 404; the six internal IDs remain classified one-hop redirect sources rather than public
  identities. Deferred launch articles: zero.
- All six slug-local body sources contain exactly the ten canonical locales and non-empty section
  arrays. The content guard reports 60/60 complete article-locale documents and no exact DE/EN body
  reuse masquerading as another locale. Index metadata is present for the same 60 cases.
- Four referenced WebP files exist with their declared 1200x800 or 1024x1024 dimensions. They are
  decorative in already named article contexts and correctly use empty alt; two records have no
  invented image. Captions are absent because none are approved.
- The six ISO publication dates and stored `PolarisDX Team` author values remain the only visible
  launch metadata. Modified dates, reviewers and normalized source records are absent from data,
  UI and schema. Reading time remains deterministic from the active locale body at 200 words/minute.

### Runtime, discovery and schema truth

- Fresh production Runtime: 60/60 canonical article-locale URLs return 200; all 60 locale-aware
  internal-ID sources return direct 301 with query preservation and direct 200 targets; four
  representative unknown/retired paths return true HTTP 404 without canonical, hreflang or Article
  schema. Redirect chains: zero.
- Registry G1 passes with 25 families, 43 canonical paths, 30 redirects and zero stale mirrors.
  Search exposes 6/6 published articles across ten locales; internal findability exposes 6/6
  mappings. Sitemap contains exactly 60 canonical article URLs and no ID, retired or draft target.
- G3 passes for 390 unique public URLs and 60 truthful article `lastmod` values. The documented
  French index-description length heuristic remains the only non-blocking warning; missing,
  placeholder and duplicate metadata findings are zero. G4 passes for 15 namespaces x10 with zero
  missing/empty keys.
- Runtime Article JSON-LD on all 60 pages matches visible headline, teaser, URL/mainEntityOfPage,
  real image where present, publication date, author, publisher and language. Body/schema
  contradictions, invented optional metadata and Preview/Dev leakage are zero.

### Independent quality and scope gate

- Targeted Unit/Contract matrix: 49/49 PASS. Typecheck, task-scoped ESLint and task-scoped Prettier:
  PASS. Metadata hard-failure cases cover invalid dates, modified-before-published, empty optional
  fields and invalid source URLs.
- Fresh isolated client and SSR build: PASS under `/tmp/polaris-ap17-closure.UFBuWV`. It emits the
  lightweight ~5.4 kB index, shared ~11.8 kB ArticlePage and six separate 38-68 kB article-body
  chunks. Loading one detail requests neither the other five bodies nor a pre-consent analytics or
  marketing provider.
- Fresh production-like Playwright matrix: 20/20 PASS, including index/detail x10, 60/60 SEO and
  schema, redirect/404 behavior, links, CTA, reading time, responsive layouts and Axe. Serious or
  critical Axe findings: zero. Keyboard traversal reaches Index, Related Article, Service and the
  existing general-sales CTA. Fresh screenshots at 390, 768 and 1440 px show no article-scope
  overflow, clipping or CTA overlap.
- False-ready findings: zero. ART-01 through ART-40 PASS; R17-01 through R17-12 are mitigated with no
  open AP17-critical risk; C17-01 through C17-50 PASS. No AP18+ platform, CMS or permanent editorial
  workflow was pulled forward. DEC-RL-010 remains explicitly BACKLOG.

AP17-CLOSURE result: PASS. AP17 is COMPLETE. AP18 is the next work package and remains NOT STARTED.
