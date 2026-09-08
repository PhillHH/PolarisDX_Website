# DIAGNOSTICS-HUB-CONTRACT

**Owner:** AP12
**Evidence status:** AP12 Closure PASS (2026-08-28)
**Canonical sources:** `src/data/services.tsx` (service truth), `src/routing/routeRegistry.ts`
(route truth), `src/hooks/useSearch.ts` (search metadata consumer)

This document records the Diagnostics Hub information architecture and its coverage evidence. It is
not a Route Registry, service-content source, SEO source, or replacement for the nine AP13 detail
pages.

## 1. PT12.1 inventory

- Canonical hub: Registry ID `diagnostics`, path `/diagnostics`, `LOCALIZED_X10`, indexable,
  sitemap- and search-eligible.
- Productive service source: `src/data/services.tsx`; exactly nine records in the order shown below.
- Dynamic route family: Registry ID `service-detail`, path pattern `/diagnostics/:slug`, source
  `SERVICES`; every concrete path is expanded from the service source.
- Hub implementation at task start: `ServicesOverviewPage` composed `DiagnosticsHero`, three
  specialty cards, six focus cards, an Epigenetics boundary teaser, and the final CTA. The two card
  components each maintained their own service/route list and did not explain POC versus extended or
  laboratory diagnostics.
- Current teaser source after PT12.1: titles remain localized service titles; claim-safe hub teasers
  live under `services:overview.ia.cards.*` in all ten locales. Deep service content remains AP13.
- Search: hub and all nine service targets are registry-derived and search-eligible; AP07 guard
  evidence reports 9/9.
- Homepage: `/diagnostics` has a primary business-pillar inlink. Dental, Beauty and Longevity have
  additional homepage core-service inlinks and therefore provide the evidence-backed priority set.
- Internal links: Header and Footer expose all nine service families; the Hub itself now derives all
  nine links from the service source plus Registry rather than local route mirrors.

## 2. Information hierarchy

The current page order through PT12.5 is:

1. Diagnostics entry Hero with visible Breadcrumb, one H1, GENERAL_SALES and a service-overview jump,
2. POC / extended-diagnostics orientation,
3. three priority practice-context entries,
4. six workflow / diagnostic-question entries,
5. six focus/use-case entries mapped to real service families,
6. separate IglooPro system-context and Epigenetics business-pillar boundaries,
7. three real published related articles plus a canonical knowledge-hub entry,
8. final conversion area.

The two groups are user-oriented:

- `PRACTICE_CONTEXT`: choose by professional field of use;
- `DIAGNOSTIC_WORKFLOW`: choose by prevention, clinical question, system workflow or integration.

POC is described as measurement close to the place of care. Extended investigations and established
laboratory pathways are explicitly complementary depending on context; no blanket replacement,
superiority, automatic decision, treatment outcome, revenue, or guarantee is claimed.

## 3. PT12.2 Hero and entry contract

- **Positioning:** the x10 H1 and framing name Point-of-Care plus complementary diagnostics and the
  professional audience (practices, medical facilities and professional users). The copy routes by
  specialty, diagnostic question and workflow rather than promising a result.
- **Primary entry:** `GENERAL_SALES`, German wording exactly `Angebot anfragen`; the target is derived
  from Registry ID `contact` and resolves locale-aware to
  `/<locale>/contact?intent=quote#kontaktformular`. The existing Contact runtime owns processing;
  PT12.2 adds no API, mail, persistence or tracking runtime.
- **Secondary entry:** visible x10 navigation to the real `#diagnostics-services` target, which starts
  the Registry-/service-source-derived 3+6 overview. It carries no competing sales intent.
- **Breadcrumb:** visible Home → Diagnostics hierarchy with localized labels and accessible navigation
  name; the existing AP09 `BreadcrumbList` remains the only schema implementation and uses
  `/diagnostics`, never `/services`.
- **Trust/context truth:** the three signals are source-bound facts: nine service records from
  `services.tsx`; the existing professional B2B audience; and the PT12.1 POC/complementary-diagnostics
  landscape. Logos, partners, customers, certifications, outcome figures and testimonials rendered:
  **0**.
- **Claim reduction:** the Hub Hero no longer renders the former contextless `3 min`, `90 %`, gauge or
  example result values. It introduces no accuracy, availability, revenue, efficacy, guarantee or
  superiority statement. The old keys remain untouched because current AP13-owned detail-page output
  still consumes them; PT12.2 does not change that later-owner surface.
- **Visual/LCP strategy:** one existing, real IglooPro WebP (`650×650`, 18,512 bytes) is the only eager
  Hero medium, with intrinsic dimensions, `fetchPriority=high`, localized alt and no slider, autoplay,
  third party or text embedded in the image. Browser evidence reports CLS `0–0.0064` and horizontal
  overflow `0` at 1440, 768, 390 and 360 px.
- **Accessibility/visual evidence:** exactly one page H1; semantic links; 44-px Button contract;
  localized Breadcrumb name and alt x10; visible focus; DOM/mobile order content → Primary → Secondary
  → trust → visual; reduced-motion browser mode; Axe serious/critical **0**. Visual inspection passed
  for DE desktop/tablet and the longer PL/CS mobile layouts.

## 4. PT12.3 service-card contract

- **Single projection and component:** both the three `PRACTICE_CONTEXT` entries and the six
  `DIAGNOSTIC_WORKFLOW` entries render through `DiagnosticsServiceGrid` /
  `DiagnosticsServiceCard`. Card content comes from `src/data/services.tsx`, claim-safe x10 Hub
  teasers, and the `diagnosticsHubServices` Registry projection; no nine-card or route mirror exists.
- **Semantic interaction:** every card is one React Router link with a localized accessible name,
  visible design-system focus ring, DOM-order keyboard navigation and no nested interactive element.
  The service icon and arrow use one Lucide SVG system and are consistently decorative.
- **Presentation:** all cards share radius, border, 280-px minimum height, spacing, icon scale,
  heading/teaser/CTA hierarchy and hover/focus behavior. `PRIMARY` versus `STANDARD` is a bounded
  border/badge treatment inside the same system, not a separate product language.
- **Responsive contract:** each group uses one-column mobile, two-column tablet and three-column
  desktop/wide grids. Production-browser evidence at 390, 768, 1024 and 1440 px shows nine visible
  cards, unclipped titles and horizontal overflow 0; DE mobile and longer PL wide screenshots pass.
- **Route/locale integrity:** 9/9 unique canonical targets are Registry-derived, preserve the current
  locale, contain no `/services/*` source and return HTTP 200 in the representative direct-target
  matrix. Switching DE → PL preserves `/diagnostics`, card order and all nine localized targets.
- **A11y/performance evidence:** targeted main-landmark Axe serious/critical findings 0 for DE mobile
  and PL wide; cards contain no raster media, slider, custom client interaction state or third-party
  dependency. Observed page CLS was 0–0.0053 and reduced-motion mode remained active.

## 5. PT12.4 focus / specialty contract

- **Six required entries:** `dental`, `beauty`, `longevity`, `prevention`, `system-solutions` and
  `integration` are visible as equal semantic article blocks. Their content stays at Hub-teaser depth:
  user context, compact orientation and one real service-family link.
- **Single service projection:** `diagnosticsFocusAreas` resolves each focus entry from
  `diagnosticsHubServices`, validates its required source specialty tag and derives its target through
  Registry ID `service-detail`. It adds neither a service record nor a route mirror.
- **Claim safety:** titles reuse the existing x10 service-family truth and descriptions reuse the
  claim-safe PT12.1 Hub teasers. No treatment, cosmetic-effect, anti-ageing, prevention guarantee,
  interface capability, revenue or superiority claim is added.
- **Boundaries:** IglooPro is a separate system-context link to Registry ID `igloo-pro`; Epigenetics
  is a separate business-pillar link to Registry ID `epigenetics` and remains absent from the nine
  service records. Neither block duplicates AP14 or AP15 depth.
- **Locale/accessibility:** the focus heading and orientation are explicit in all ten locales; service
  and boundary copy is sourced from existing x10 namespaces. Each block has a semantic heading and
  real link with visible focus; icons are decorative. The grid is 1/2/3 columns at mobile/tablet/
  desktop, with horizontal overflow 0 and no color-only interaction state.
- **Runtime evidence:** x10 production-browser paths pass 15/15, all six focus targets plus IglooPro
  and Epigenetics return direct HTTP 200, Axe WCAG A/AA violations are 0 for DE mobile and PL wide,
  observed CLS is 0 and the section introduces no raster image, slider, client interaction state,
  third-party dependency or tracking call.

| Focus ID           | Required tag      | Service source ID             | Canonical target                           | Status | Owner                  |
| ------------------ | ----------------- | ----------------------------- | ------------------------------------------ | ------ | ---------------------- |
| `dental`           | `DENTAL`          | `dental`                      | `/diagnostics/dental`                      | ACTIVE | AP12 hub / AP13 detail |
| `beauty`           | `BEAUTY`          | `beauty`                      | `/diagnostics/beauty`                      | ACTIVE | AP12 hub / AP13 detail |
| `longevity`        | `LONGEVITY`       | `longevity`                   | `/diagnostics/longevity`                   | ACTIVE | AP12 hub / AP13 detail |
| `prevention`       | `PREVENTION`      | `praeventions-checks`         | `/diagnostics/praeventions-checks`         | ACTIVE | AP12 hub / AP13 detail |
| `system-solutions` | `SYSTEM_SOLUTION` | `poc-systemloesungen`         | `/diagnostics/poc-systemloesungen`         | ACTIVE | AP12 hub / AP13 detail |
| `integration`      | `INTEGRATION`     | `kompatibilitaet-integration` | `/diagnostics/kompatibilitaet-integration` | ACTIVE | AP12 hub / AP13 detail |

## 6. PT12.5 SEO, findability and integration contract

- **Metadata:** `SEOHead` remains the only head platform. Hub title, description and social-image alt
  are specific, claim-safe and present in all ten locale resources. The earlier German-only keyword
  array is removed. The real IglooPro WebP is the public OG/Twitter asset with intrinsic `650×650`
  dimensions; preview/development hosts and a second metadata implementation are absent.
- **Canonical language cluster:** production SSR emits exactly one self-canonical on
  `https://polarisdx.net/<locale>/diagnostics`, ten project-language alternates plus `x-default = de`,
  and `index, follow` in every locale. All ten Hub URLs are present in the Registry-derived sitemap,
  return HTTP 200 and are not redirect sources. The only structured data is the existing AP09
  `BreadcrumbList`, now with localized visible labels and canonical public items; invented Medical
  schemas are absent.
- **Service depth and inlinks:** all 9/9 visible Hub cards retain unique locale-aware Registry targets;
  legacy `/services/*` targets remain 0. Homepage, Header and Footer link to the Hub, while the three
  selected published articles and IglooPro provide existing Diagnostics-context inlinks. AP07 guards
  report Hub plus service search coverage 9/9 and findability 9/9.
- **Related knowledge safe state:** `green_practice`, `invisible_patient` and
  `ecosystem_of_rapid_tests` are real published `articles.ts` records, have Diagnostics service
  relationships, x10 article metadata, Registry-valid detail routes and direct HTTP 200 responses.
  Their Hub cards are a bounded projection from those sources, use lazy WebP media and link to the
  canonical articles hub. Draft, guessed and dead article records rendered: **0**; no AP17 platform
  work is introduced.
- **Conversion and semantics:** Hero `GENERAL_SALES` still resolves through Registry to
  `/<locale>/contact?intent=quote#kontaktformular`; German wording remains `Angebot anfragen`.
  Heading order is one H1 followed by semantic H2/H3 sections. Related-card links, service links,
  Breadcrumb and conversion links have semantic names and visible keyboard focus.
- **Page-level evidence:** production-browser integration passes x10 SEO/route/content checks and the
  five required viewport/locale scenarios (DE 390, EN 768, PL 1024, FR 1280, CS 1440). Horizontal
  overflow and observed CLS are 0; related images are lazy, below fold and not LCP candidates. Full
  `main` Axe WCAG A/AA findings are 0 for DE mobile and CS wide; visual inspection passes all five
  screenshots including long Polish, French and Czech copy.
- **Tracking/consent boundary:** PT12.5 adds no tracker, direct `gtag`, `dataLayer.push`, interaction
  event or third party. A fresh no-consent request probe reproduces the repository-wide pre-existing
  GTM load documented as `NON_COMPLIANT` / `TD-*` in `TRACKING-CONTRACT.md`; PT12.5 neither causes nor
  worsens it. Remediation remains explicitly owned by AP23 and is not falsely marked ready here.

## 7. Service coverage matrix

| ID    | Family / source ID            | Canonical path                             | Hub category          | Priority   | Specialty mapping                 | Registry | Search | Homepage inlink | Hub card | Owner                  |
| ----- | ----------------------------- | ------------------------------------------ | --------------------- | ---------- | --------------------------------- | -------- | ------ | --------------- | -------- | ---------------------- |
| DX-01 | `dental`                      | `/diagnostics/dental`                      | `PRACTICE_CONTEXT`    | `PRIMARY`  | `DENTAL`, `PREVENTION`            | ACTIVE   | ACTIVE | DIRECT          | ACTIVE   | AP12 hub / AP13 detail |
| DX-02 | `beauty`                      | `/diagnostics/beauty`                      | `PRACTICE_CONTEXT`    | `PRIMARY`  | `BEAUTY`, `PREVENTION`            | ACTIVE   | ACTIVE | DIRECT          | ACTIVE   | AP12 hub / AP13 detail |
| DX-03 | `longevity`                   | `/diagnostics/longevity`                   | `PRACTICE_CONTEXT`    | `PRIMARY`  | `LONGEVITY`, `PREVENTION`         | ACTIVE   | ACTIVE | DIRECT          | ACTIVE   | AP12 hub / AP13 detail |
| DX-04 | `poc-systemloesungen`         | `/diagnostics/poc-systemloesungen`         | `DIAGNOSTIC_WORKFLOW` | `STANDARD` | `SYSTEM_SOLUTION`, `INTEGRATION`  | ACTIVE   | ACTIVE | VIA HUB         | ACTIVE   | AP12 hub / AP13 detail |
| DX-05 | `praeventions-checks`         | `/diagnostics/praeventions-checks`         | `DIAGNOSTIC_WORKFLOW` | `STANDARD` | `PREVENTION`                      | ACTIVE   | ACTIVE | VIA HUB         | ACTIVE   | AP12 hub / AP13 detail |
| DX-06 | `infektion-entzuendung`       | `/diagnostics/infektion-entzuendung`       | `DIAGNOSTIC_WORKFLOW` | `STANDARD` | `CLINICAL_QUESTION`               | ACTIVE   | ACTIVE | VIA HUB         | ACTIVE   | AP12 hub / AP13 detail |
| DX-07 | `stoffwechsel-herz`           | `/diagnostics/stoffwechsel-herz`           | `DIAGNOSTIC_WORKFLOW` | `STANDARD` | `CLINICAL_QUESTION`, `PREVENTION` | ACTIVE   | ACTIVE | VIA HUB         | ACTIVE   | AP12 hub / AP13 detail |
| DX-08 | `hormon-tests`                | `/diagnostics/hormon-tests`                | `DIAGNOSTIC_WORKFLOW` | `STANDARD` | `CLINICAL_QUESTION`               | ACTIVE   | ACTIVE | VIA HUB         | ACTIVE   | AP12 hub / AP13 detail |
| DX-09 | `kompatibilitaet-integration` | `/diagnostics/kompatibilitaet-integration` | `DIAGNOSTIC_WORKFLOW` | `STANDARD` | `SYSTEM_SOLUTION`, `INTEGRATION`  | ACTIVE   | ACTIVE | VIA HUB         | ACTIVE   | AP12 hub / AP13 detail |

Repository terminology differs slightly from the Master-Scope labels for four records:
`Präventions-Checks` uses slug `praeventions-checks`; `Infektion & Entzündung` uses
`infektion-entzuendung`; `Stoffwechsel & Herz` uses `stoffwechsel-herz`; and `Kompatibilität &
Integration` uses `kompatibilitaet-integration`. These are the current canonical service-source and
Registry slugs; no aliases or guessed slugs are introduced.

## 8. Contracts and boundaries

- Service count: 9/9; duplicate families: 0; missing families: 0.
- Canonical service targets: 9/9 Registry-valid and locale-preserving.
- Hub legacy `/services/*` targets: 0.
- Locale coverage: `de`, `en`, `pl`, `fr`, `it`, `es`, `pt`, `da`, `nl`, `cs`; IA, Hero, service,
  specialty, related-knowledge and Hub SEO strings are present in every locale. Default/x-default
  remains `de`, defensive fallback remains `en`.
- Priority is not invented: only Dental, Beauty and Longevity are `PRIMARY`, matching the AP11
  homepage core-service hierarchy and the pre-existing top Hub section.
- Epigenetics is not a service record and remains an independent business pillar. IglooPro and
  Consumer are not among the nine service families.
- AP13 remains owner of parameters, deep workflows, service-specific FAQs, proof and literature.
  PT12.1 adds no detail route and no detail-page content model.
- PT12.5 consumes the existing SEO, Route, Search, sitemap and article sources; it adds no replacement
  platform, AP13 detail content, AP14 product depth, AP15 Fachjourney or AP17 editorial expansion.

## 9. Closure evidence ledger

| Evidence                                                     | Current status | Later owner           |
| ------------------------------------------------------------ | -------------- | --------------------- |
| Service-source / Registry / Search consistency test          | PASS           | AP12 Closure verified |
| x10 visible copy and Hub metadata parity                     | PASS           | AP12 Closure verified |
| POC / extended-diagnostics visible hierarchy                 | PASS           | AP12 Closure verified |
| Hero x10 / H1 / CTA / Breadcrumb / trust contract            | PASS           | AP12 Closure verified |
| Hero visual / responsive / Axe / CLS evidence                | PASS           | AP12 Closure verified |
| Nine derived Hub targets, no legacy target                   | PASS           | AP12 Closure verified |
| Unified semantic card / responsive / x10 browser matrix      | PASS           | AP12 Closure verified |
| Six focus paths and real service mapping                     | PASS           | AP12 Closure verified |
| IglooPro / Epigenetics ownership boundaries                  | PASS           | AP12 Closure verified |
| Hub SEO / related knowledge / full internal-link integration | PASS           | AP12 Closure verified |
| Existing global pre-consent tracking debt                    | OWNER-BOUND    | AP23                  |
| AP13 service-detail depth                                    | NOT STARTED    | AP13                  |

## 10. AP12 Closure evidence

- **Independent current-state gate:** `HUB-01`–`HUB-40` are 40/40 PASS,
  `C12-01`–`C12-50` are 50/50 PASS, and `R12-01`–`R12-12` are mitigated or retained at their explicit
  later owner. False-ready findings and open AP12-owned P0/P1 blockers are 0.
- **Production/browser matrix:** a fresh Client/SSR production build and the serial no-retry AP12
  suite pass 141/141 cases. Evidence includes ten Hub locales, all 90 locale/service combinations as
  direct HTTP 200, nine cards and six specialty entries, canonical/hreflang/sitemap, G2/G9,
  Breadcrumb/history/language interactions, and real Related-Article targets.
- **Accessibility/performance:** full-main Axe WCAG A/AA reports 0 violations for DE 390 and CS 1920
  after the light-Breadcrumb contrast correction. Six fresh viewports (360, 390, 768, 1024, 1440, 1920) have no horizontal overflow, observed CLS below 0.1, one dimensioned eager Hero WebP and
  three lazy below-fold Related-Article WebPs.
- **Visual QA:** the six fresh screenshots for DE, PL, EN, FR and CS were inspected. Hero, 3+6 cards,
  six focus entries, boundary links, articles, CTA and footer remain readable without clipping across
  mobile, tablet, desktop and wide desktop.
- **Code and guards:** Node-22 typecheck, targeted AP12/Closure ESLint and Prettier, 338/338 full
  Unit/Component/Server tests, Registry, Search, Findability, x10 namespace, asset and SEO guards all
  pass. Full-repository lint/format still reproduce pre-existing findings; AP12 implementation and
  Closure-edited evidence files are clean. The pre-staged canonical `work-packages/AP12.md` retains
  its deliberate Markdown hard-break whitespace, and the current global counts are lower than the
  documented predecessor baseline.
- **Ownership honesty:** AP12 adds no route/SEO/tracking platform and no AP13 detail content. The
  repository-wide pre-consent GTM debt remains AP23-owned; publication is deliberately deferred to
  `AP12-PUBLISH-PREVIEW`. AP13 remains `NOT STARTED`.
