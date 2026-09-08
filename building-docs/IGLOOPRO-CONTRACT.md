# IglooPro Contract

**Status:** AP14 COMPLETE — AP14 Closure PASS

**Verified:** 2026-09-01
**Repository:** `/home/phillip/01polaris-preview`  
**Branch:** `console/10-15-2026-08-28T08-18-27`  
**HEAD:** `8a142173a5e2f89de09af2e76a1ce28ea243782e`

This document is an AP14 evidence and handoff contract. It does not replace the central Route
Registry, `products` locale namespace, AP09 SEO helpers, product components, or any future approved
product-data source.

## 1. Authority and current serial result

- Immediate predecessor: AP13 `COMPLETE`; AP13 Closure `PASS`.
- PT14.1 result: `PASS`.
- PT14.2 result: `PASS`.
- PT14.3 result: `PASS`.
- PT14.4 result: `PASS`.
- PT14.5 result: `PASS`.
- PT14.6 result: `PASS`.
- AP14 Closure result: `PASS` after an independent final-state rerun; C14 is 50/50 and IGLOO is
  40/40. AP15 is the next work package and remains `NOT STARTED`.
- AP15 remains `NOT STARTED`; Decision Locks remain 18/18.
- PT14.1 changed no route, product page, locale, schema, asset, lead, consent, or tracking runtime.
- PT14.2 changes only the shared product-page Hero/proof composition and its `products` x10 copy;
  routes, SEO helpers, Product schema shape, source asset, lead runtime, consent and tracking remain
  unchanged.
- PT14.3 replaces unsupported feature/specification output with an evidence-bounded product context,
  an enquiry/evaluation workflow and a compatibility-validation checklist. It creates no interface,
  device-operation, support-SLA, maintenance or backend capability.
- PT14.4 publishes only the locked `CV < 2 %` product/content decision in an accessible x10 table,
  removes unverified specification amplification from active SEO, and unlinks the owner-bound legacy
  flyer without deleting its audit evidence.
- PT14.5 keeps Product JSON-LD on the existing AP09 schema layer, removes the unsupported
  `PolarisDX` product-brand assertion and emits only locale-aware visible product truth without
  manufacturer, commercial, rating, identifier or quantitative fields.
- PT14.6 retains the real x10 Contact journey as Primary conversion, uses the live Homepage ROI
  calculator as the truthful Secondary conversion, and passes the broad pre-Closure integration
  gate without adding tracking, lead persistence or later-owner runtime.

## 2. Canonical route and locale matrix

The operative route authority is the `igloo-pro` record in
`src/routing/routeRegistry.ts`. Its current properties are:

| Field                  | Current truth                                          |
| ---------------------- | ------------------------------------------------------ |
| Registry ID            | `igloo-pro`                                            |
| Route family/type      | `PRODUCT`                                              |
| Canonical path pattern | `/igloo-pro`                                           |
| Locale behavior        | `LOCALIZED_X10`                                        |
| Shell                  | `B2B`                                                  |
| Indexability           | `INDEX_FOLLOW`                                         |
| Search                 | eligible; metadata binding in `src/hooks/useSearch.ts` |
| Sitemap                | eligible; static, priority 1, monthly                  |
| Legacy alias           | none registered for IglooPro                           |

| Locale | Canonical public URL                 |
| ------ | ------------------------------------ |
| de     | `https://polarisdx.net/de/igloo-pro` |
| en     | `https://polarisdx.net/en/igloo-pro` |
| pl     | `https://polarisdx.net/pl/igloo-pro` |
| fr     | `https://polarisdx.net/fr/igloo-pro` |
| it     | `https://polarisdx.net/it/igloo-pro` |
| es     | `https://polarisdx.net/es/igloo-pro` |
| pt     | `https://polarisdx.net/pt/igloo-pro` |
| da     | `https://polarisdx.net/da/igloo-pro` |
| nl     | `https://polarisdx.net/nl/igloo-pro` |
| cs     | `https://polarisdx.net/cs/igloo-pro` |

Default locale and `x-default` are `de`. The defensive runtime fallback is not a product-content
strategy.

## 3. Positioning baseline

### Safe current positioning

IglooPro is an independent point-of-care reader presented to professional practices and clinics.
The safe value proposition is a compact product path for bringing supported measurement workflows
closer to the point of care and for discussing an appropriate setup with PolarisDX through an
existing sales enquiry.

### Target audience

- Professional practices and clinics evaluating point-of-care workflows.
- Professional teams that need to assess whether a supported test workflow fits their setting.
- Mobile use remains visible in legacy product copy, but PT14.3 does not render that assertion; its
  exact operating conditions remain a product-evidence question for PT14.4.

Consumer buyers are not part of this product-positioning contract.

### Core problem

The current journey addresses the operational distance between a professional care setting and a
measurement result. It offers a dedicated reader path, product information, an enquiry route and a
public product flyer. PT14.1 does not infer diagnostic certainty, clinical equivalence or a medical
outcome from that workflow.

### Value proposition and differentiation

- `VERIFIED_CURRENT`: one dedicated IglooPro product route, a visible point-of-care reader, a
  professional B2B enquiry path and a public German product flyer.
- `VISIBLE_BUT_NEEDS_OWNER_CONFIRMATION`: portability, multi-method/test-menu breadth,
  manufacturer-independent positioning, battery operation, concrete interfaces and connectivity,
  record capacity, timings, sample materials, IVDR/CE, validation wording and claimed integration
  with practice systems.
- `NOT_SUPPORTED` for PT14.1 positioning: guaranteed accuracy, laboratory equivalence, automatic or
  seamless integration, diagnosis/treatment/outcome guarantees, promised response/delivery times,
  commercial availability, pricing, ratings, reviews or customer/partner counts.

### Missing decision information

Before the complete AP14 product journey can be declared ready, an accountable product owner must
confirm the technical specification source, supported test/menu scope, interface and compatibility
matrix, regulatory wording, service/support commitments, commercial availability, product
ownership/brand semantics and the public flyer's current version and claim content. These items are
serially owned by PT14.3–PT14.6 and are not completed by this baseline.

## 4. Product ownership, brand and organization evidence

| Statement                                                                    | Classification                         | Evidence and consequence                                                                                                                                  |
| ---------------------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Polaris Diagnostics Europe GmbH operates the PolarisDX website/legal imprint | `VERIFIED_CURRENT`                     | x10 legal imprint and AP09 Organization schema identify this legal entity.                                                                                |
| PolarisDX acts as European distributor/support contact for IglooPro          | `VISIBLE_BUT_NEEDS_OWNER_CONFIRMATION` | x10 `about.json` states a DX365 distribution partnership; retain defensively until an accountable owner confirms current scope.                           |
| IglooPro is a product of DX365 GmbH                                          | `VISIBLE_BUT_NEEDS_OWNER_CONFIRMATION` | x10 footer `common.json` and x10 product manufacturer notes say this; the AP14 contract explicitly forbids treating historical copy as independent proof. |
| DX365 GmbH is the manufacturer                                               | `VISIBLE_BUT_NEEDS_OWNER_CONFIRMATION` | x10 `products.json` says “manufactured by”; no approved manufacturer document was identified during PT14.1.                                               |
| PolarisDX is the product brand                                               | `NOT_SUPPORTED`                        | PT14.5 removed the former `brand: PolarisDX` Product JSON-LD field. No replacement brand is inferred while ownership evidence remains unresolved.         |
| IglooPro is the displayed product name                                       | `VERIFIED_CURRENT`                     | consistent page heading/context, navigation, Registry ID and x10 product namespace. This does not by itself establish legal brand ownership.              |

Visible page copy and Product JSON-LD now share only the verified product name and locale-aware
visible description. Brand and manufacturer remain omitted until accountable owner evidence exists;
the global website Organization contract is unchanged and is not silently reinterpreted as product
ownership.

## 5. Conversion contract

### Primary conversion

| Field               | Current truth                                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Intent              | `GENERAL_SALES`                                                                                                                            |
| German label        | `Angebot anfragen`                                                                                                                         |
| Current target      | Registry route `contact`, rendered locale-aware as `/<locale>/contact`                                                                     |
| Form runtime        | Existing Contact page/form and `/api/contact`; no new AP22 runtime                                                                         |
| Current attribution | IglooPro links currently carry no product-specific query attribution; PT14.1 preserves this truth rather than inventing backend semantics. |

The target is real and reachable. PT14.6 verified product-specific conversion while preserving the
existing attribution contract; it did not build AP22 persistence, queueing or CRM behavior.

### Secondary conversion inventory

| Target                                      | Classification        | Current state                                                                                                                                                     |
| ------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/downloads/igloo-pro-flyer.pdf`            | `OWNER_BOUND_AP14`    | Physical audit evidence remains, but PT14.4 removed it from `src/content/downloads.json`; no productive page links the unapproved flyer.                          |
| `/<locale>/downloads`                       | `SAFE_CURRENT_TARGET` | Registry-valid, search/sitemap-eligible resource page; after PT14.4 it exposes only the two catalogued Vitamin D3+K2 flyers and makes no IglooPro-document claim. |
| `/<locale>#roi-rechner`                     | `REAL_AND_USABLE`     | Existing homepage calculator and `/api/roi-report` journey; PT14.6 uses it as the truthful locale-aware secondary conversion target.                              |
| Future gated product download / lead magnet | `OWNER_BOUND_AP19`    | No entitlement/gating platform exists; do not simulate one in AP14.                                                                                               |
| New CRM/persistent product-lead pipeline    | `NOT_SUPPORTED`       | AP22-owned; no new runtime is claimed or created.                                                                                                                 |

## 6. Initial claim matrix

The locked canonical content decision is exactly **`CV < 2 %`**. The repository verifies content
consistency only; it does **not** independently validate the scientific correctness of this claim.

| Surface                     | PT14.1 baseline                                                                                                    | Classification / next owner                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| x10 `products.json`         | `CV < 2 %` present in all ten locale files                                                                         | `CANONICAL_CV_LT_2`; PT14.4 performs final semantic/context review.                                                    |
| Product components          | fallback in `IglooSpecsSection.tsx` uses `CV < 2 %`                                                                | `CANONICAL_CV_LT_2`.                                                                                                   |
| Product SEO descriptions    | all ten include `CV < 2 %`                                                                                         | consistent value, but accuracy/lab-quality context needs PT14.4 review.                                                |
| Other locale surfaces       | current Home/Services/Specialty copy contains the same value plus stronger accuracy/reproducibility claims         | value consistent; wording is `AMBIGUOUS_REVIEW_REQUIRED` for PT14.4.                                                   |
| Product JSON-LD             | description inherits visible locale Hero copy; no brand, manufacturer or quantitative property is emitted          | PT14.5 PASS; no `<5 %`, commercial field or claim amplification detected.                                              |
| Productive text/code `<5 %` | 0 findings in `src/**` and `public/locales/**`                                                                     | PASS baseline.                                                                                                         |
| Documentation `<5 %`        | 38 occurrences in 12 documentation files                                                                           | `NON_PRODUCTIVE_HISTORICAL`: prohibitions, tests, historical notes and acceptance criteria, not active product output. |
| Public flyer                | image-only PDF visually audited in PT14.4; contains many unapproved technical, regulatory and ownership statements | `OWNER_BOUND`; removed from every productive catalog/link while retained as versioned audit evidence.                  |

Initial wording risks found alongside IglooPro include “lab-grade/laboratory quality”, “validated”,
accuracy/precision wording, reproducibility/inter-reader language, IVDR/CE, concrete timing,
interface and test-menu assertions. They are inventory findings, not PT14.1-approved claims.

## 7. Initial PDF/download inventory

| Asset                                  | Language | Repository evidence                                                                                                                          | Publicly linked                                 | Status                                                                      |
| -------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| `public/downloads/igloo-pro-flyer.pdf` | de       | PDF 1.7, 484 KiB, two full-page JPEGs, SHA-256 `ae726928cf750b21df3d409469df97c5f5e55cd11a0b25c938fda680b24a8f7b`; catalog date `2025-01-20` | No productive catalog or page link after PT14.4 | `REMOVE_LINK` completed; `OWNER_BOUND` until an approved replacement exists |

No separate IglooPro datasheet, certificate, English flyer or gated IglooPro document was found in
the current public asset inventory. Locale CTAs correctly disclose that the linked PDF is German.
The catalog calls the file a flyer; visible CTA copy sometimes calls it a datasheet. That document
type mismatch remains owner-bound for PT14.4/AP19 and must not be presented as resolved.

## 8. x10 and SEO readiness baseline

- Namespace: `products`; ten files exist for `de,en,pl,fr,it,es,pt,da,nl,cs`.
- Core product keys needed by the current page exist x10; German primary CTA is exact and the nine
  other locales use natural quote-request labels.
- Current page consumes AP09 `SEOHead`, Product and Breadcrumb helpers; it creates no second SEO
  layer.
- Registry makes the route Search- and Sitemap-eligible. Canonical/hreflang are derived from AP09
  and default/x-default remain German.
- PT14.1 records the positioning baseline, PT14.2 owns the productive Hero/proof entry and PT14.3
  owns the evidence-bounded feature/workflow/compatibility entry. PT14.4, PT14.5 and PT14.6 own the
  final specification/claim, Product schema and conversion-integration truth. AP14 Closure was run
  independently after those serial tasks; its final evidence is recorded in section 16.

## 9. PT14.1 evidence and guards

- Git/start gate: AP13 Closure PASS; AP14 startable; no merge/rebase/cherry-pick/revert operation.
- Protected working-tree baseline was retained; PT14.1 does not stage, reset or overwrite predecessor
  work.
- Registry lookup, x10 locale-file/key checks, Search/Sitemap eligibility, CTA target, public
  download target, claim sweep and contract/state consistency were measured against the current
  repository.
- No route, locale, Product schema, consent, tracking, lead backend or page implementation changed.

## 10. PT14.2 Hero and proof contract

### Product entry and conversion

- `IglooProHero` is the single claim-safe, SSR-first product entry. It states product name,
  professional practice/clinic audience, standalone Point-of-Care reader context and the supported-
  setup enquiry proposition without a specification wall.
- Primary CTA: locale-aware Registry contact route, intent `GENERAL_SALES`; German label exactly
  `Angebot anfragen`. PT14.6 changed the secondary CTA from the generic `/downloads` route to the
  real locale-aware Homepage `#roi-rechner`, because no approved IglooPro document is available.
- Neither action simulates booking, checkout, CRM persistence or a gated lead-magnet runtime.

### Visual and media behavior

- Product asset: existing real `src/assets/Igloo-pro-frontal.webp`, 18,512 bytes, rendered at
  intrinsic `650 × 650`, eager/high-priority and dimension-reserved as the Hero LCP candidate.
- The product is visible on mobile through wide desktop; the visual is non-interactive, uses a
  localized alt text plus an accessible figure caption, and has no carousel or motion dependency.
- PT14.2 generated and inspected DE 360 px, PL 768 px, FR 1280 px and CS 1920 px screenshots. The
  Browser guard measured horizontal overflow `≤ 1 px` and CLS `< 0.1` for each case.

### Proof decision

The immediate `IglooProductProof` section contains exactly three defensible context signals:

1. IglooPro is displayed as a standalone Point-of-Care reader.
2. The product journey addresses professional practices and clinics.
3. The enquiry uses the existing contact form rather than a simulated booking or checkout.

No customer logo/count, study, certification, accreditation, rating, review, interface, timing,
weight, accuracy or commercial proof is rendered in Hero/proof. The locked `CV < 2 %` value is
intentionally absent there: PT14.2 does not turn the content lock into scientific or outcome proof.
The older specification/parameter locale evidence and its initial claim inventory remain owned by
PT14.4; the Hero task does not claim that those later surfaces are resolved.

### x10 and accessibility evidence

- `hero.caption/title/description/cta_order/cta_secondary/subline/visual.device_alt/context` and the
  complete `proof` object are productive in exactly `de,en,pl,fr,it,es,pt,da,nl,cs` with no Hero/
  proof fallback copy or visible translation keys.
- The composition exposes exactly one H1, a labelled Hero, an H2-led proof section, semantic links,
  three semantic list items, keyboard-reachable actions and visible Design-System focus styles.
- Targeted Axe WCAG A/AA testing found zero serious/critical Hero/proof violations.
- Fresh Production Client/SSR build plus x10 SSR and four-viewport Browser checks passed 6/6.
- The Node-22 Hero/proof component and x10 content guards passed 4/4. The system Node 18 remains
  incompatible with the current Vite/jsdom toolchain and was not treated as project-test evidence.

## 11. PT14.3 features, workflow and compatibility contract

### Product feature inventory

| Product statement                                                                                                         | Classification                         | PT14.3 consequence                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| IglooPro is a standalone Point-of-Care reader                                                                             | `VERIFIED_CURRENT`                     | Rendered as a concrete product characteristic.                                                                       |
| Product path addresses professional practices, clinics and teams                                                          | `VERIFIED_CURRENT`                     | Rendered as professional operating context, not Consumer positioning.                                                |
| Supported setup and test scope are clarified in an enquiry                                                                | `VERIFIED_CURRENT`                     | Rendered as a decision boundary; no standard package is implied.                                                     |
| Portability, battery operation, methods/test menu, timing, weight, storage and sample materials                           | `VISIBLE_BUT_NEEDS_OWNER_CONFIRMATION` | Removed from active product-page feature/spec output; retained only as PT14.4 evidence work.                         |
| Wi-Fi/LAN/USB, LIS/HIS, software or other concrete interfaces/integrations                                                | `VISIBLE_BUT_NEEDS_OWNER_CONFIRMATION` | No compatibility assertion; represented only by a question about required and currently confirmed data/system paths. |
| Validation, laboratory equivalence, IVDR/CE and accuracy/reproducibility interpretation                                   | `VISIBLE_BUT_NEEDS_OWNER_CONFIRMATION` | Not rendered in PT14.3 sections. The locked `CV < 2 %` remains a PT14.4 content decision, not PT14.3 proof.          |
| Seamless/automatic integration, guaranteed performance, full-day battery, support/delivery SLA or lab-equivalent accuracy | `NOT_SUPPORTED`                        | Removed from the active product journey.                                                                             |

The legacy `IglooSpecsSection`, `IglooParametersSection` and generic Diagnostics specialty block are
no longer composed into `IglooProPage`. Their source and old locale keys remain protected evidence
for PT14.4; their presence in the repository is not an active product claim.

### Workflow truth

The visible three-step flow is deliberately an **enquiry and suitability-evaluation workflow**, not
a device operating manual:

1. describe the professional setting and intended Point-of-Care context;
2. confirm supported setup, test scope and relevant operating questions;
3. use the existing contact path to agree an appropriate next step and, where applicable, a quote.

Operation, sample handling and result processing are explicitly deferred to approved product
documentation. PT14.3 claims no automation, result interpretation or integration runtime.

### Compatibility and service-source matrix

| Validation topic           | Current evidence                                                           | Product-page treatment                                                                     |
| -------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Test portfolio/materials   | Old product copy exists; no approved current matrix                        | Open validation question; no supported menu asserted.                                      |
| Practice/operating setting | Professional audience is verified; concrete operating requirements are not | Open requirements question.                                                                |
| Data/system path           | Historical interface/integration copy only                                 | Open question about needed and currently confirmed connections; no API/interface asserted. |
| Support/operation          | Registry-valid `/support` and `/contact` routes exist                      | Real request routes linked; no onboarding, maintenance, response-time or SLA promise.      |

Related targets are derived from the central Registry and localized at render time:
`service-detail:poc-systemloesungen`, `service-detail:kompatibilitaet-integration`, `downloads`,
`support` and `contact`. No legacy or redirect-source target is introduced.

### x10, accessibility and verification evidence

- `product_story`, `workflow`, `compatibility` and the revised final CTA are complete in exactly
  `de,en,pl,fr,it,es,pt,da,nl,cs`; no runtime EN/DE fallback copy is used.
- Three product characteristics, three ordered workflow steps, four compatibility questions and five
  Registry-derived related links share one SSR-first page composition without client-only behavior.
- Feature/workflow/compatibility sections use labelled regions, semantic lists/headings/navigation,
  keyboard links, visible Design-System focus and reduced-motion-safe transitions.
- Fresh DE 360 px, PL 768 px, FR 1280 px and CS 1920 px browser captures passed with horizontal
  overflow `<= 1 px`, CLS `< 0.1` and zero serious/critical Axe findings after the workflow step
  marker was moved to the approved `ui-field` contrast token.
- Node-22 component/x10 guards passed 9/9; Registry, i18n, Search and internal-findability guards,
  Production Client/SSR build, x10 SSR, five related-target HTTP checks and final Browser suite 6/6
  passed without retry.

## 12. PT14.4 specification, claim and download gate

### Productive claim contract

- Canonical active value: exactly **`CV < 2 %`**.
- Classification: locked product/content decision. Repository consistency is verified; scientific
  correctness is explicitly **not** independently validated.
- Productive occurrences: 20 — ten x10 product specification rows plus ten x10 Homepage trust-bar
  values carrying explicit `IglooPro` context. Product SEO, OG/Twitter description and Product
  JSON-LD do not repeat or reinterpret the metric.
- Reproducible text sweep: 157 exact `CV < 2 %` source occurrences across `src/**` and
  `public/locales/**`; 20 are productive and 137 belong to non-composed legacy locale/component or
  test evidence. The legacy bodies are not imported by the current Product page and do not become
  approved specifications through their presence.
- Productive/source `CV < 5 %` findings: 0. The hard-failure detector passes its injected
  `IglooPro CV < 5 %` negative self-test.
- Inter-/intra-reader language is not treated as interchangeable: the active page names only the
  coefficient of variation, while the flyer-specific Inter-/Intra-Reader qualifiers remain
  owner-bound and productively unlinked.

### Specification matrix

Only row 1 is visible. Rows 2–12 are audit findings, not approved product truth.

|   # | Specification              | Value/range and unit found                                                             | Visible product context                                                                     | Evidence                                            | Locale status           | Structured Data   | Consistency / owner                                    |
| --: | -------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------- | ----------------------- | ----------------- | ------------------------------------------------------ |
|   1 | Coefficient of variation   | `CV < 2 %`                                                                             | Locked product/content claim; no accuracy, reproducibility, regulatory or outcome inference | Decision lock and x10 `products.specification`      | x10 active              | omitted by design | active format consistent; scientific truth owner-bound |
|   2 | Intra-reader CV            | `CV < 3 %`                                                                             | Flyer accuracy row only                                                                     | visual PDF page 2                                   | de asset only; unlinked | omitted           | not equated with row 1; product owner                  |
|   3 | Methods                    | colorimetry, immunofluorescence, microfluidics, multiplex, quantum dots, dry chemistry | Flyer datasheet                                                                             | visual PDF page 2; different legacy locale copy     | not active              | omitted           | owner confirmation required                            |
|   4 | Sample materials           | serum, plasma, whole/capillary blood, saliva, hair, urine, stool                       | Flyer datasheet                                                                             | visual PDF page 2; narrower legacy locale copy      | not active              | omitted           | owner confirmation required                            |
|   5 | Weight                     | approx. `290 g` in flyer; `600 g` in legacy locale copy                                | Flyer/legacy specs                                                                          | visual PDF page 2 and non-composed `products.specs` | not active              | omitted           | **conflict**; product owner                            |
|   6 | Dimensions                 | `87.5 mm × 87.5 mm × 91 mm` (`L×W×H`)                                                  | Flyer datasheet                                                                             | visual PDF page 2                                   | de asset only; unlinked | omitted           | owner confirmation required                            |
|   7 | Test speed                 | “few seconds, excluding incubation” in flyer; `3–15 min` in legacy locale copy         | Flyer/legacy specs                                                                          | visual PDF page 2 and non-composed locale evidence  | not active              | omitted           | **conflict/context mismatch**; product owner           |
|   8 | Data storage               | `10,000` results/patient records                                                       | Flyer/legacy specs                                                                          | visual PDF page 2 and non-composed locale evidence  | not active              | omitted           | wording/scope owner-bound                              |
|   9 | Battery                    | lithium battery, up to `24 h` continuous operation per charge                          | Flyer                                                                                       | visual PDF page 2                                   | de asset only; unlinked | omitted           | owner confirmation required                            |
|  10 | Communication              | USB-C, LIMS, Wi-Fi, Bluetooth, API; legacy copy instead names USB/LAN/WLAN/LIS/HIS     | Flyer/legacy specs                                                                          | visual PDF page 2 and non-composed locale evidence  | not active              | omitted           | **conflict**; product/IT owner                         |
|  11 | Test menu                  | flyer examples Vitamin D, ferritin, CRP, cortisol, HbA1c, TSH; wider legacy list       | Flyer/legacy parameters                                                                     | visual PDF page 2 and non-composed locale evidence  | not active              | omitted           | no supported menu claimed; product owner               |
|  12 | Format/capacity statements | up to `24 h` testing per charge; formats up to `8` lines or `100` points/strip         | Flyer feature copy                                                                          | visual PDF page 2                                   | de asset only; unlinked | omitted           | owner confirmation required                            |

Active table semantics: one caption, three column headers, one row header and a fixed, wrapping
column layout that needs no horizontal interaction on narrow screens. Decimal and percentage
spelling is locale-neutral only for the locked technical value; no conversion or inferred unit is
added.

### Flyer/download disposition

The two-page German PDF is image-only and therefore not a maintainable text source in the current
repository. Visual inspection found the specifications above plus CE/IVDR marks, DX365 wording,
Polaris Diagnostics Limited distribution details, claimed manufacturer-independence, API/software
integration, automatic calibration, diagnostic breadth and performance language. None is promoted
to verified truth by PT14.4. The file remains at its existing path solely as owner-bound audit
evidence, but the catalog record and all productive links were removed. The x10 Downloads SEO and
intro now describe only the two files actually catalogued.

### PT14.4 verification evidence

- `scripts/check-igloo-claim-contract.mjs`: x10 matrix, active SEO amplification guard, source
  `<5 %` sweep, structured catalog exclusion, flyer hash and injected hard-failure self-test.
- `IglooSpecsSection.test.tsx`: semantic table, x10 value/context parity and claim-safe Product
  structured-data smoke.
- Product journey E2E now requires one visible claim row per locale and rejects stale values and
  unverified weight/timing/interface/regulatory output.
- Resource inventory explicitly classifies 31 productive references plus one owner-bound unlinked
  flyer; the physical asset is not silently orphaned.

## 13. PT14.5 Product Structured Data gate

### Existing schema layer and visible fields

- `IglooProPage` uses the existing AP09 `createProductSchema` helper and the single `SEOHead`
  renderer. No page-local JSON-LD serializer, second helper or competing schema source was added.
- Product is emitted only on each canonical `/<locale>/igloo-pro` page. Representative generic
  Diagnostics and Downloads SSR responses contain zero Product entities.
- The emitted visible-truth fields are `name: IglooPro`, the locale's visible Hero description,
  self-canonical `url`, the existing real `Igloo-pro-frontal.webp` image on
  `https://polarisdx.net`, `mainEntityOfPage`, and `inLanguage`.
- The ten Product IDs are unique and deterministic: each self-canonical URL plus `#product`.

### Brand, organization, commercial and claim safety

- Product `brand` is omitted because `PolarisDX` as product brand is `NOT_SUPPORTED`.
- Product `manufacturer` is omitted because DX365 ownership/manufacturer wording remains
  `VISIBLE_BUT_NEEDS_OWNER_CONFIRMATION`. The verified global website Organization remains Polaris
  Diagnostics Europe GmbH and is neither changed nor injected as a guessed product manufacturer.
- `offers`, price, availability, rating/review, aggregate rating, SKU/GTIN, discount, seller and
  other commercial fields are absent. No `QuantitativeValue` or `additionalProperty` is emitted.
- The locked `CV < 2 %` value remains visible in the PT14.4 specification table but is intentionally
  absent from Product JSON-LD. Schema output therefore neither contradicts nor amplifies it into an
  accuracy, diagnostic, therapy, outcome, approval or certification statement.

### PT14.5 verification evidence

- Central Structured Data unit/specification tests: 10/10 PASS.
- AP09 SEO guard: 39 route families / 390 URLs PASS, including the new IglooPro source guard.
- Production Client/SSR build and x10 Product-schema E2E: 2/2 PASS without retry; ten locale-aware
  Product entities, ten unique IDs, real public image URLs, zero preview/dev hosts and zero Product
  entities on the representative generic Diagnostics/Downloads pages.
- Typecheck, task-scoped ESLint and Prettier PASS. Consent, tracking, lead runtime, routes, locale
  content and later AP14/AP15 owner scope are unchanged.

## 14. Open owner-bound items

1. Product owner: confirm DX365 product/manufacturer statement and current legal wording.
2. Brand/ownership: confirm IglooPro/DX365/PolarisDX semantics before any Product brand or
   manufacturer field may be introduced; PT14.5 safely omits both.
3. Product evidence: approve or reject rows 2–12 of the PT14.4 matrix before any value becomes
   visible product truth.
4. Claim evidence: independently substantiate the locked `CV < 2 %` decision and determine whether
   Inter-/Intra-Reader qualifiers may be published; PT14.4 deliberately does neither.
5. Flyer: provide an approved, editable replacement with current legal entity, regulatory and
   specification truth before restoring any productive IglooPro download link.
6. Conversion: the real Homepage ROI calculator is the active secondary path; gated product
   documents remain AP19-owned and persistent lead/CRM behavior remains AP22-owned.
7. Consent/tracking: Basic Mode now prevents Google provider loading and measurement before an
   explicit Analytics grant. Full event-taxonomy, revocation and provider governance remain
   AP23-owned.
8. Contact content: the existing global Contact page contains response-time, IVDR/CE, speed,
   compatibility and demo wording that is not approved by this product contract. Its complete
   content policy is AP20-owned; PT14.6 neither repeats nor promotes those statements on IglooPro.
9. Contact accessibility remediation is complete for the two Closure findings: the visible
   progressbar is named, progress text uses the existing accessible `ui-field` token, and the final
   production Axe rerun reports zero serious/critical findings on both Contact and IglooPro. Broader
   site-wide accessibility governance remains AP24-owned.

## 15. PT14.6 conversion and integration gate

### Conversion truth

- Primary conversion remains the existing locale-aware `/<locale>/contact` route with two visible
  `GENERAL_SALES` actions. The German label remains exactly `Angebot anfragen`; all ten routes and
  forms respond directly with HTTP 200 and no redirect chain.
- The existing Contact runtime posts to `/api/contact` after its current consent and validation
  checks. PT14.6 does not claim CRM persistence, queueing, retry or delivery guarantees; those stay
  AP22-owned. Existing Homepage/Epigenetics allowlisted attribution and server-side attribution
  tests remain unchanged and pass. IglooPro adds no synthetic query attribution.
- Hero and final secondary actions now use the live locale-aware Homepage ROI calculator. The x10
  labels describe that exact destination, replacing the false-ready “product resources” wording.
  The existing calculator and `/api/roi-report` runtime are reused; no product-specific result or
  ROI guarantee is introduced.
- The compatibility section retains a transparent generic Downloads link and a real Support link.
  No IglooPro flyer or gated download is presented, and no support SLA is added.

### Final primary-task evidence

- Matrix: all ten canonical IglooPro routes, ten Contact targets and ten Homepage ROI targets return
  HTTP 200 without redirects. All ten product renders retain Hero, Features, Workflow,
  Specification, x10 CTA copy and mobile overflow `<= 1 px`; unknown IglooPro variants return real
  HTTP 404 in DE/EN/CS.
- SEO/platform: central Route Registry, Search, internal findability, i18n and AP09 SEO guards pass;
  Product routes remain self-canonical with 10 hreflang alternates plus German x-default, complete
  sitemap membership, public OG/Twitter/Product image URLs and no preview/dev host.
- Product schema: ten locale-aware Product entities remain on Product pages only, with no brand,
  manufacturer, commercial, rating, identifier or `QuantitativeValue` fields and no claim
  amplification.
- Claim gate: 20 productive `CV < 2 %` occurrences, zero productive `<5 %`, zero linked IglooPro
  downloads and a passing injected hard-failure self-test. The repository still does not claim
  independent scientific validation.
- Consent/tracking: no product-local tracking call, event or synthetic attribution was added.
  The Closure remediation centrally gates Google provider loading behind explicit Analytics
  consent; broader AP23 event and provider governance remains deferred.
- Accessibility/visual: IglooPro and the linked Contact form both have zero serious/critical Axe
  findings; DE/EN/PL/FR/CS cover mobile/tablet/desktop/wide screenshots, all ten locales pass
  automated mobile overflow and the real Hero asset remains dimension-reserved.
- Quality: Node-22 typecheck, task-scoped ESLint/Prettier, all Unit/Component/Server tests, route,
  Search, findability, i18n, SEO and claim guards, Production Client/SSR build and the focused
  Chromium integration suite pass on the final PT14.6 state.

PT14.6 does not set AP14 complete. The next and only released task is `AP14-CLOSURE`; AP15 remains
`NOT STARTED`.

## 16. AP14 Closure — independent final evidence

The Closure reran the final repository and production-build gates independently of PT14.1–PT14.6.
It did not add product runtime, content, schema, route, lead or tracking architecture.

### Final x10 product matrix

- Registry authority remains the single `igloo-pro` `PRODUCT` record with canonical pattern
  `/<locale>/igloo-pro`; all ten canonical locale routes return direct HTTP 200 and unknown
  IglooPro variants return real HTTP 404.
- All ten SSR outputs contain locale-correct Hero, three product characteristics, the three-step
  enquiry/evaluation workflow, compatibility questions, the accessible specification table,
  locale-aware Primary and Secondary CTAs, one self-canonical, ten locale alternates plus German
  x-default, index/follow metadata, sitemap membership, public OG/Twitter image and alt, and one
  claim-safe Product entity.
- Registry, Search, internal findability, i18n, SEO and asset guards pass. Homepage, Diagnostics,
  Search and product-related links resolve to canonical current targets; no direct-URL-only or
  preview/dev-host finding exists for IglooPro.

### Final claim, document and schema matrix

- Productive canonical occurrences: 20 (`CV < 2 %` in ten Product specification rows and ten
  Homepage trust-bar records). The final `src/**` plus `public/locales/**` source sweep finds 157
  exact occurrences; 137 are non-composed legacy/content-test evidence and do not become approved
  specifications.
- Productive stale `<5 %` findings: 0. Three literal `CV < 5 %` strings are explicitly
  `NON_PRODUCTIVE_HISTORICAL`: two descriptions of the negative gate in this evidence contract and
  one injected hard-failure fixture. Ambiguous productive findings: 0; the injected hard-failure
  self-test passes.
- Publicly linked IglooPro downloads: 0. The one existing two-page German flyer remains physically
  present, hash-guarded and owner-bound but productively unlinked. Its unapproved and partly
  conflicting claims/specifications cannot reach the product journey.
- Product JSON-LD passes x10 with visible locale-aware truth, self URL and real public image. Brand,
  manufacturer, commercial, rating, identifier and `QuantitativeValue` fields remain omitted; the
  visible claim is neither repeated nor amplified in schema.

### Accessibility, visual, performance and conversion evidence

- IglooPro main-content Axe serious/critical findings: 0. Contact-form serious/critical findings: 0;
  `aria-progressbar-name`: 0; `color-contrast`: 0. Keyboard/focus, headings, image alt, semantic
  feature/workflow lists, table caption/row/column headers, links and reduced-motion-safe behavior
  pass.
- DE/EN/PL/FR/CS visual checks cover mobile, tablet, desktop and wide desktop. All ten locales pass
  automated mobile overflow (`<= 1 px`); representative CLS remains `< 0.1`. The dimension-reserved
  650 x 650 Hero WebP is 18.51 kB in the final build, and the IglooPro client chunk is 15.50 kB
  (4.11 kB gzip), with no heavy product widget introduced.
- Primary `GENERAL_SALES` and the real Contact form are reachable x10 without redirects; German is
  exactly `Angebot anfragen`. The truthful secondary path is the existing Homepage ROI calculator.
  Support and Downloads links resolve; no IglooPro flyer, fake gated journey, CRM persistence or
  product-specific attribution is presented.
- Fresh production-browser traces confirm provider/GA requests are 0 before a decision and 0 after
  explicit denial. Explicit grant loads GTM and gtag once and emits one expected collect request;
  client-side navigation does not duplicate the bootstrap. No request is mocked, filtered or
  ignored by the network gate.

### Final quality and scope result

- Node 22 typecheck, task-scoped ESLint and Prettier pass; all 370 Unit/Component/Server tests pass.
- Production Client and SSR builds pass. The independent serial no-retry Chromium suite passes
  89/89, including x10
  product/CTA/schema/SEO/HTTP output, sitemap, Search, real 404 semantics, representative Axe and
  four-viewport visual captures, Fresh/Denied/Granted network evidence and both Axe surfaces.
- C14-01–C14-50: 50/50 PASS. IGLOO-01–IGLOO-40: 40/40 PASS. AP14-owned P0/P1 blockers: 0.
- Risks R14-01, R14-02, R14-05, R14-06, R14-07, R14-08, R14-10 and R14-11 are `MITIGATED`.
  R14-03 and R14-04 are `ACCEPTED_OWNER_BOUND` with safe current omissions; R14-09 and R14-12 are
  `MITIGATED`. No later-owner platform was pulled forward.
- Scope audit: no AP15, AP19, AP22 or AP23 platform, second route/product/SEO/schema SSOT, Consumer
  product journey, commercial runtime or scientific-validation system was pulled forward.

AP14 is `COMPLETE`; AP14 Closure is `PASS`. AP15 is the next work package and remains `NOT STARTED`.

## 17. AP14 Closure remediation — 2026-09-01

This historical repair record addresses only the two independently measured blockers. At its
handoff it did not declare AP14 Closure PASS and did not start AP15; the independent result in
section 16 now supersedes that interim state.

### IGLOO-24 — Basic Consent Mode

- Root cause: `index.html` unconditionally created `dataLayer`, restored denied/granted signals,
  injected `gtm.js` and exposed a GTM `noscript` iframe before a user decision. The container then
  loaded GA and emitted a consent-denied `collect` request. `GtmPageview` also wrote navigation
  events without checking the stored Analytics decision.
- Repair: the static Google bootstrap and iframe were removed. `src/lib/googleConsent.ts` is the
  one minimal provider lifecycle: missing or rejected consent returns before creating a dataLayer
  or script; an explicit grant establishes Consent Mode signals and injects GTM once. The banner
  applies saved/new decisions through that helper, and `GtmPageview` discards pre-consent events.
- Production-browser evidence (`e2e/consent-basic-remediation.spec.ts`): fresh session provider
  requests 0 / GA collect 0; explicit denial provider requests 0 / GA collect 0; explicit grant
  produces three expected Google requests (one GTM loader, one gtag loader, one GA collect) and
  retains one GTM bootstrap across a client-side navigation. No pre-consent request is filtered or
  mocked.

### IGLOO-35 — linked Contact form

- `aria-progressbar-name` root cause: the visible completion meter had `role="progressbar"` and
  numeric ARIA values but no accessible name. It now uses `aria-labelledby` pointing to the visible,
  localized progress message.
- `color-contrast` root cause under reduced motion: the progress message used `gray-500` (`#868c98`
  on white, 3.37:1), while the progress counter and microcopy used `gray-400` (`#9ca3af` on white,
  2.53:1); small text requires 4.5:1. Those three roles now use the existing `ui-field` token
  (`#6b7280`, 4.83:1 on white), without a new color or redesign.
- Production Axe evidence: IglooPro serious/critical 0; Contact form serious/critical 0;
  `aria-progressbar-name` 0; `color-contrast` 0. The x10 Contact and IglooPro route/CTA smokes remain
  green.

Repair validation: Node-22 typecheck, changed-file ESLint/Prettier, 25/25 focused
consent/component/form tests, Production Client/SSR build and 8/8 focused Playwright
network/route/Axe tests PASS. At the remediation handoff AP14 remained `IN_PROGRESS` and Closure
required a rerun. Section 16 records the subsequent independent Closure PASS; AP15 remains
`NOT STARTED`.
