# SERVICE-DETAIL-CONTRACT — AP13 common detail-page system

**Status:** `ACTIVE / AP13_CLOSURE_PASS / 9_OF_9_SERVICE_CONTENT_COMPLETE`, 2026-08-31
**Purpose:** evidence and integration contract for the nine AP13 service-detail pages. This file is
not a Route Registry, service/content SSOT or SEO metadata source.

## 1. Authorities and boundaries

- Canonical service records: `src/data/services.tsx` (`ServiceId` union in `src/types/models.ts`).
- Canonical route truth: AP10 `src/routing/routeRegistry.ts`, dynamic family `service-detail`, source
  `SERVICES`, pattern `/diagnostics/:slug`.
- SEO and Structured Data: AP09 `SEOHead` and helpers in `src/components/seo/`.
- Localized content: productive `services` namespace in exactly
  `de,en,pl,fr,it,es,pt,da,nl,cs`; default/x-default `de`, defensive fallback `en` only.
- AP12 remains owner of `/diagnostics`; AP13 consumes its nine real inlinks and does not redesign the
  Hub. AP14 and later owner scopes remain untouched.

## 2. Canonical service matrix

All rows use Registry ID `service-detail`; no alias or `/services/*` target is created.

| Family ID                     | Translation key               | Canonical slug/path                        | Registry | Search | Template |
| ----------------------------- | ----------------------------- | ------------------------------------------ | -------- | ------ | -------- |
| `dental`                      | `dental`                      | `/diagnostics/dental`                      | ACTIVE   | ACTIVE | COMPLETE |
| `beauty`                      | `beauty`                      | `/diagnostics/beauty`                      | ACTIVE   | ACTIVE | COMPLETE |
| `longevity`                   | `longevity`                   | `/diagnostics/longevity`                   | ACTIVE   | ACTIVE | COMPLETE |
| `poc-systemloesungen`         | `poc_systemloesungen`         | `/diagnostics/poc-systemloesungen`         | ACTIVE   | ACTIVE | COMPLETE |
| `praeventions-checks`         | `praeventions_checks`         | `/diagnostics/praeventions-checks`         | ACTIVE   | ACTIVE | COMPLETE |
| `infektion-entzuendung`       | `infektion_entzuendung`       | `/diagnostics/infektion-entzuendung`       | ACTIVE   | ACTIVE | COMPLETE |
| `stoffwechsel-herz`           | `stoffwechsel_herz`           | `/diagnostics/stoffwechsel-herz`           | ACTIVE   | ACTIVE | COMPLETE |
| `hormon-tests`                | `hormon_tests`                | `/diagnostics/hormon-tests`                | ACTIVE   | ACTIVE | COMPLETE |
| `kompatibilitaet-integration` | `kompatibilitaet_integration` | `/diagnostics/kompatibilitaet-integration` | ACTIVE   | ACTIVE | COMPLETE |

Count 9/9; duplicate family/target 0; direct-URL-only family 0; Consumer and Epigenetics records 0.

## 3. Template architecture

`src/pages/ServicePage.tsx` is now only the slug resolver and 404 boundary. It resolves a canonical
`ServiceDetailEntry`, builds one translated view model and composes these small units:

- `ServiceDetailTemplate` — page/SEO composition and two-column responsive shell;
- `ServiceDetailHero` — Breadcrumb, single H1 and Registry-backed `GENERAL_SALES` action;
- `ServiceDetailSections` — required/optional content slots with semantic H2/H3 and ordered workflow;
- `ServiceDetailSalesCta` — contextual second use of the same sales intent;
- `ServiceDetailNotFound` — localized noindex/404 state without canonical/hreflang;
- `useServiceDetailViewModel` — projection of the existing x10 namespace, not a content source;
- `model.ts` — types only; `structuredData.ts` — AP09-helper composition only;
- existing shared `FAQSection`, `PageSidebar`, `SubpageHero`, `TrustBar`, `Button`, `SEOHead`.
  `PageSidebar` now receives each sibling path from the Registry projection rather than constructing
  `/diagnostics/<id>` locally.

No service-specific slug switch and no nine parallel templates exist. `ServicePage.tsx` was reduced
from the prior monolithic implementation to a thin composition boundary.

## 4. Data model and section rules

Required model fields are canonical family/route entry, Hero title, localized SEO title/description,
labels and primary CTA context. Supported content slots are:

1. Breadcrumb and Hero;
2. problem/value (`problem`);
3. audiences/use cases (`audiences`);
4. diagnostic questions (`questions`);
5. parameter/marker overview (`parameters`, optional/evidence-based);
6. workflow with ordered steps (`workflow`);
7. proof/trust (`proof`, optional/evidence-based);
8. FAQ (`faq`, optional and visible-only);
9. related content and crosslinks (`related`, `crosslinks`, optional and real targets only);
10. conclusion and regulatory/disclaimer note (`conclusion`, `disclaimer`, optional);
11. primary sales action.

Undefined slots render nothing. No placeholder, dummy FAQ, proof, marker, disclaimer or crosslink is
generated. Existing generic translated sections remain available as `detailSections` until their
own PT13.2–PT13.10 content task maps them into the more specific slots.

`Service.detailParameterKey`, `Service.detailTitleSource` and optional `detailCrosslinks` are minimal
template metadata on the canonical service record. Crosslinks carry Registry IDs, never local path
mirrors. They replace former slug/path maps in page code and do not introduce a second family list or
route truth.

## 5. i18n pattern

- Existing content root: `services:<service.translationKey>.*`.
- Existing shared template labels: `services:overview.page.*`, `services:overview.hero.*`, and the
  locked shared CTA keys in `home`/`common`.
- Service-specific slots are added below `services:<service>.detail` by the owning content PT and in
  all ten locale files in that same task. Dental, Beauty, Longevity, POC-Systemlösungen,
  Präventions-Checks, Infektion & Entzündung, Stoffwechsel & Herz, Hormon-Tests and Kompatibilität &
  Integration are complete 10/10 through PT13.10.
- Runtime reads optional fields with `fallbackLng: false`; absence produces omission, not broad
  English/German production copy.
- PT13.1 adds no visible locale key and changes no locale file. G4 remains PASS.

## 6. Routing, SEO and Structured Data

- `src/data/serviceDetail.ts` projects the nine service records onto Registry family
  `service-detail`; it throws if any record lacks its Registry target.
- Context routes Home, Diagnostics and Contact are also resolved from the Registry. The primary
  target is the existing `/contact?intent=quote#kontaktformular`; Browser/StaticRouter basenames keep
  it locale-aware.
- `SEOHead` remains the only metadata renderer: index/follow, self-canonical, x10 hreflang,
  x-default=de, OG/Twitter and Sitemap policy stay Registry/AP09-owned.
- Structured Data uses existing `createServiceSchema` and `createBreadcrumbSchema`. `FAQPage` is
  emitted only from the same non-empty `content.faq.items` rendered by `FAQSection`.
- Product, Offer, Price, Rating, Review and uncontracted Medical schema are not produced.
- Dental related-article and context targets are resolved against Registry families `article-detail`
  and static IDs `implantology` / `igloo-pro`. Beauty uses only the contextual static Registry ID
  `igloo-pro`. Longevity resolves its published article plus static Registry ID `epigenetics`;
  POC-Systemlösungen resolves three of its four source-mapped published articles plus static Registry
  ID `igloo-pro`. Präventions-Checks resolves its two source-mapped published articles and adds no
  unsupported contextual crosslink. Infektion & Entzündung resolves its one source-mapped published
  article and likewise adds no unsupported contextual crosslink. Locale files contain labels, not
  paths. Stoffwechsel & Herz and Hormon-Tests have no source-mapped published article or supported
  contextual crosslink; both optional projections are therefore absent for these families.
  Kompatibilität & Integration resolves its one source-mapped published article and adds no
  unsupported contextual crosslink.

## 7. CTA and claim safety

- Intent: `GENERAL_SALES`; German visible label: exactly `Angebot anfragen`.
- Deterministic element context: `source=service_detail`, `journey=general_sales`, section and canonical
  service family are explicit data attributes; nothing is inferred from localized button text.
- The existing Contact runtime owns processing. PT13.1 creates no Lead API, persistence, CRM, mail or
  tracking path.
- PT13.1 reuses current published service copy and does not add tests, markers, outcomes, guarantees,
  certifications, customer/partner figures, prices, availability or medical assertions.
- If `CV < 2 %` remains visible through existing approved shared Hero copy, its locked spelling and
  meaning are unchanged. Stronger variants remain forbidden.

### PT13.2 Dental claim decision

Dental uses a reduced, service-specific professional orientation derived from the existing Dental,
Hub and Specialty context. Visible content names only the already established parameters Vitamin D,
CRP, HbA1c and Ferritin and explicitly requires clinical contextualization. Proof is intentionally
omitted: no current AP13-approved testimonial, outcome, revenue, price, certification or customer
reference was required to make the page useful. The former long `richContent` record remains in the
existing locale source for later governance but is no longer rendered for Dental; its outcome,
margin, amortization and guarantee-adjacent passages are therefore absent from the productive page.

### PT13.3 Beauty claim decision

Beauty uses a reduced professional medical-aesthetics orientation derived from the existing Beauty
service, Hub and Specialty context. Visible content names only the already established measurements
Vitamin D, Ferritin, TSH and CRP and separates diagnostic orientation from cosmetic outcomes.
Proof and Related Content are intentionally omitted because no Beauty-specific AP13-approved proof
or published article mapping exists. The prior result, anti-aging, billing, willingness-to-pay and
speed claims remain in the legacy locale source for later governance but are no longer rendered
when the structured `beauty.detail` model is present.

### PT13.4 Longevity claim decision

Longevity uses a preventive diagnostic and longitudinal-monitoring orientation derived from the
existing Longevity service, Hub and Specialty context. Visible content names only the already
established measurements HbA1c, lipid values, CRP, TSH and Vitamin D. Repeated measurements are
framed as contextual trend information, not proof of intervention effect, health outcome,
individual risk or longer life. Proof is intentionally omitted. Legacy optimization, anti-aging,
fixed-interval, real-time effect, billing and revenue claims are not rendered once the structured
`longevity.detail` model is present.

### PT13.5 POC-Systemlösungen claim decision

POC-Systemlösungen uses a system/workflow orientation derived from the canonical service record,
AP12 system-solution/integration mapping and existing published article mappings. The productive
view explains device, compatible tests, sampling, documentation, quality responsibility and the
need to verify software/interface compatibility for the concrete environment. Proof and medical
marker lists are intentionally omitted. Legacy turnkey, seamless integration, fixed setup-time,
automatic transfer, availability, speed, laboratory-superiority, certification and guarantee
claims are not rendered once the structured `poc_systemloesungen.detail` model is present.

### PT13.6 Präventions-Checks claim decision

Präventions-Checks uses a diagnostic-information orientation derived from the canonical service
record, the AP12 Prevention specialty mapping and the existing service evidence. The productive
view names only the already established measurements HbA1c, lipid values, CRP, Vitamin D, TSH and
Ferritin. Results are framed as contextual information requiring appropriate professional review,
not as diagnosis, exclusion, individual recommendation, reliable early detection or disease
prevention. Proof and invented check packages are intentionally omitted. Legacy efficiency,
revenue, billing, speed, accuracy and early-detection claims are not rendered once the structured
`praeventions_checks.detail` model is present.

### PT13.7 Infektion & Entzündung claim decision

Infektion & Entzündung uses a marker-and-context orientation derived from the canonical service
record, the AP12 clinical-question mapping and the existing service evidence. The productive view
names only CRP, PCT, IL-6 and Ferritin and explicitly requires configuration-specific capability
verification. A marker is framed as contextual information rather than proof of infection,
inflammation cause, urgency or treatment choice. Proof and unsupported crosslinks are intentionally
omitted. Legacy threshold, viral/bacterial differentiation, sepsis, real-time therapy-monitoring,
antibiotic-outcome, speed, laboratory-equivalence, integration, setup-time and support claims are
not rendered once the structured `infektion_entzuendung.detail` model is present.

### PT13.8 Stoffwechsel & Herz claim decision

Stoffwechsel & Herz uses a metabolic/cardiovascular question-and-monitoring orientation derived
from the canonical service record, the AP12 clinical-question/prevention mapping and the existing
service/Hub evidence. The productive view names only HbA1c, cholesterol and D-dimer and requires
configuration-specific capability verification. Single and repeated measurements are framed as
contextual information rather than a diagnosis, individual risk prediction, treatment instruction
or guaranteed health outcome. Proof, Related Content and unsupported crosslinks are intentionally
omitted. Legacy reference-range, Troponin, NT-proBNP, acute exclusion, immediate risk assessment,
treatment-adjustment, speed, laboratory-equivalence, multiplex, billing, revenue, guarantee and
validation claims are not rendered once the structured `stoffwechsel_herz.detail` model is present.

### PT13.9 Hormon-Tests claim decision

Hormon-Tests uses an endocrine-question and professional-care orientation derived from the
canonical service record, the AP12 clinical-question mapping and the existing service/Hub evidence.
The productive view names only TSH and AMH and requires configuration-specific capability
verification. Values are framed as contextual diagnostic information rather than proof of a
condition or a basis for treatment, medication or dosage decisions. Proof, Related Content and
unsupported crosslinks are intentionally omitted. Legacy Cortisol, testosterone, progesterone,
FSH, fT3/fT4, fertility/PCOS interpretation, treatment-monitoring, medication-adjustment, speed,
laboratory-equivalence, IVDR, accuracy, compatibility, guarantee and validation claims are not
rendered once the structured `hormon_tests.detail` model is present.

### PT13.10 Kompatibilität & Integration claim decision

Kompatibilität & Integration uses a requirements-and-verification orientation derived from the
canonical service record, the AP12 system-solution/integration mapping and its one real published
article mapping. The productive view frames compatibility as something to verify for the intended
test, system/software version, documentation path, data handover and operating responsibilities.
Proof is intentionally omitted. Legacy universal/90-percent compatibility, automatic interfaces
and transfers, USB/Wi-Fi/Bluetooth, fixed setup time, result-volume, LIS/HIS, centralized-network,
security, availability, performance, certification and guarantee claims are not rendered once the
structured `kompatibilitaet_integration.detail` model is present.

## 8. Accessibility and performance

- One H1 comes only from `SubpageHero`; content slots use H2 and workflow steps H3 in DOM order.
- Breadcrumb, CTA and crosslinks are real links; workflow is an ordered list; icons/numbers that
  duplicate text are decorative; FAQ preserves button/region/expanded semantics.
- All new links retain visible focus and >=44 px Button targets; Hover is not the only state.
- Layout is mobile-first and uses existing responsive grids. Browser checks at 390 and 1440 px found
  no horizontal overflow.
- Shared sections replace nine redundant implementations. No new media, third party, tracker, heavy
  client interaction or service-specific bundle was added. Existing Hero media behavior is unchanged.

## 9. PT13.1 evidence

- Typecheck PASS; task-scoped ESLint and Prettier PASS; `diff --check` PASS.
- Node-22 targeted Unit/Component/SEO/Registry suite 28/28 PASS. The Template subset is 8/8 and
  covers required/optional sections, semantic ordering, CTA/focus, visible-only FAQ schema, x10
  service/SEO keys and the 9/9 Registry projection. Node 22 was invoked without modifying package or
  lock files because the host default Node 18 has the documented jsdom ESM/CJS mismatch.
- Production client/SSR build PASS through the targeted Playwright web server.
- Final targeted Playwright run: 10/10 PASS serially with retries disabled. An earlier
  infrastructure-only Chromium launch crash was cleared by an isolated no-retry rerun before the
  complete final run. Evidence covers three real slugs, structured vs legacy-safe composition,
  visible FAQ/schema parity, x10 Beauty SSR, Mobile/Desktop overflow, canonical/sales CTA and an
  unknown-slug noindex HTTP 404.
- G1 Route Registry, G4 i18n, Search and internal-findability guards PASS: 9/9 services and 0 legacy
  `/services/*` targets.

## 10. Owner-bound items

- `SD13-01 — SERVICE_CONTENT_NORMALIZATION`: PT13.2–PT13.10 own family-specific evidence review and
  mapping from existing generic sections into problem/audience/question/parameter/workflow/proof/
  FAQ slots. Required before each respective service task PASS.
- `SD13-02 — DENTAL_LEGACY_RICH_CONTENT`: **RESOLVED PT13.2.** Dental renders the normalized
  `detail` model x10; `legacyRichContent` is suppressed whenever that model exists. No other family
  was normalized or advanced.
- `SD13-03 — BEAUTY_LEGACY_CONTENT`: **RESOLVED PT13.3.** Beauty renders the normalized `detail`
  model x10; generic legacy sections and FAQ are suppressed. No PT13.4+ family was normalized.
- `SD13-04 — LONGEVITY_LEGACY_CONTENT`: **RESOLVED PT13.4.** Longevity renders the normalized
  `detail` model x10; generic legacy sections and FAQ are suppressed. No PT13.5+ family was
  normalized.
- `SD13-05 — POC_SYSTEM_LEGACY_CONTENT`: **RESOLVED PT13.5.** POC-Systemlösungen renders the
  normalized `detail` model x10; generic legacy sections and FAQ are suppressed. No PT13.6+ family
  was normalized.
- `SD13-06 — PREVENTION_LEGACY_CONTENT`: **RESOLVED PT13.6.** Präventions-Checks renders the
  normalized `detail` model x10; generic claim-risky legacy sections and FAQ are suppressed. No
  PT13.7+ family was normalized.
- `SD13-07 — INFECTION_INFLAMMATION_LEGACY_CONTENT`: **RESOLVED PT13.7.** Infektion & Entzündung
  renders the normalized `detail` model x10; claim-risky legacy sections and FAQ are suppressed. No
  PT13.8+ family was normalized.
- `SD13-08 — METABOLIC_CARDIAC_LEGACY_CONTENT`: **RESOLVED PT13.8.** Stoffwechsel & Herz renders the
  normalized `detail` model x10; claim-risky legacy sections and FAQ are suppressed. No PT13.9+
  family was normalized.
- `SD13-09 — HORMONE_TESTS_LEGACY_CONTENT`: **RESOLVED PT13.9.** Hormon-Tests renders the normalized
  `detail` model x10; claim-risky legacy sections and FAQ are suppressed. No PT13.10 family was
  normalized.
- `SD13-10 — COMPATIBILITY_INTEGRATION_LEGACY_CONTENT`: **RESOLVED PT13.10.** Kompatibilität &
  Integration renders the normalized `detail` model x10; claim-risky legacy sections and FAQ are
  suppressed. All 9/9 families now use the structured detail model.
- Final sitewide WCAG/performance/security programmes remain AP24–AP27. AP13 still owns clean page
  behavior within its scope.

## 11. PT13.2 Dental evidence

- Family/slug/Registry: `dental` / `/diagnostics/dental` / `service-detail`; AP12 Hub and AP07 Search
  remain canonical inlinks, with no `/services/*` target and no direct-URL-only finding.
- Content x10: service-specific Hero, problem context, three audience/use-case entries, three
  diagnostic questions, four evidence-backed parameter labels, three workflow steps, three visible
  FAQs, contextual CTA, disclaimer and unique SEO/Social alt in all ten locale records. No runtime
  EN/DE fallback or visible key.
- Related content: existing published `green_practice` and `five_minute_diagnosis` article records.
  Crosslinks: Registry-backed `/vitamin-d3-implantologie` and `/igloo-pro`; neither owner page is
  duplicated.
- SEO/Schema: `SEOHead`, Service + BreadcrumbList and visible-only FAQPage; x10 self-canonical,
  10 hreflang plus x-default `de`, index/follow, Sitemap and OG/Twitter remain AP09/Registry-owned.
- Quality: Typecheck, task ESLint/Prettier, G1/G4/G3/Search/Findability and Node-22 targeted
  Unit/Component/SEO/Registry 16/16 PASS. Production Client/SSR build was exercised by Playwright;
  final PT13.2 browser matrix 14/14 PASS plus updated shared-template regression 10/10 PASS. Evidence
  includes HTTP 200 x10, html lang, H1, structured slots, FAQ/schema parity, Registry crosslinks,
  GENERAL_SALES, canonical/hreflang/x-default, mobile/desktop overflow and focus.

Open PT13.2-owned blockers: **none**. Remaining family normalization is serially owned by
PT13.3–PT13.10. AP14 remains `NOT STARTED`.

## 12. PT13.3 Beauty evidence

- Family/slug/Registry: `beauty` / `/diagnostics/beauty` / `service-detail`; AP12 Hub, Header/Footer
  and AP07 Search remain canonical inlinks, with no `/services/*` target or direct-URL-only finding.
- Content x10: independent Hero and value proposition, professional problem context, three
  audience/use-case entries, three diagnostic questions, four evidence-backed measurement labels,
  three workflow steps, three visible FAQs, contextual CTA, disclaimer and unique SEO/Social alt.
  No runtime EN/DE fallback or visible key is used.
- Proof/Related Content: intentionally omitted. Crosslink: Registry-backed `/igloo-pro` only; AP14
  product detail, capabilities and proof are not duplicated.
- Claim safety: no cosmetic, rejuvenation, anti-aging, outcome, revenue, billing, speed, efficacy or
  availability promise is present in the productive structured view. Diagnostic values are always
  framed as complementary information requiring professional clinical interpretation.
- SEO/Schema: existing `SEOHead`, Service + BreadcrumbList and visible-only FAQPage; x10
  self-canonical, 10 hreflang plus x-default `de`, index/follow, Sitemap and OG/Twitter remain
  AP09/Registry-owned.
- Quality: Typecheck, task ESLint/Prettier, G1/G4/G3/Search/Findability and Node-22 targeted
  Unit/Component/SEO/Registry 15/15 PASS. Production Client/SSR build was exercised by Playwright;
  final Beauty plus shared-template browser matrix 24/24 PASS. Evidence includes HTTP 200 and html
  lang x10, H1, structured slots, FAQ/schema parity, GENERAL_SALES, Registry crosslink,
  canonical/hreflang/x-default, mobile/desktop overflow and focus.

Open PT13.3-owned blockers: **none**. Remaining family normalization is serially owned by
PT13.4–PT13.10. AP14 remains `NOT STARTED`.

## 13. PT13.4 Longevity evidence

- Family/slug/Registry: `longevity` / `/diagnostics/longevity` / `service-detail`; AP12 Hub,
  Header/Footer and AP07 Search remain canonical inlinks, with no `/services/*` target or
  direct-URL-only finding.
- Content x10: independent preventive Hero and value proposition, longitudinal problem context,
  three audience/use-case entries, three diagnostic questions, five evidence-backed measurement
  labels, three monitoring steps, three visible FAQs, contextual CTA, disclaimer and unique
  SEO/Social alt. No runtime EN/DE fallback or visible key is used.
- Proof: intentionally omitted. Related Content: existing published `green_practice` record.
  Crosslink: Registry-backed `/epigenetics`; AP15 specialist content, sample-report and inquiry
  journeys are not duplicated.
- Claim safety: no life-extension, anti-aging, disease-prevention, health-outcome, individual-risk,
  fixed-interval, intervention-effect, revenue, billing, speed or availability promise is present in
  the productive structured view. Monitoring supports comparison and clinical context only.
- SEO/Schema: existing `SEOHead`, Service + BreadcrumbList and visible-only FAQPage; x10
  self-canonical, 10 hreflang plus x-default `de`, index/follow, Sitemap and OG/Twitter remain
  AP09/Registry-owned.
- Quality: Typecheck, task ESLint/Prettier, G1/G4/G3/Search/Findability and Node-22 targeted
  Unit/Component/SEO/Registry 16/16 PASS. Production Client/SSR build was exercised by Playwright;
  final Longevity plus shared-template browser matrix 24/24 PASS. Evidence includes HTTP 200 and html
  lang x10, H1, structured slots, FAQ/schema parity, GENERAL_SALES, published article and Registry
  crosslink, canonical/hreflang/x-default, mobile/desktop overflow and focus.

Open PT13.4-owned blockers: **none**. Remaining family normalization is serially owned by
PT13.5–PT13.10. AP14 remains `NOT STARTED`.

## 14. PT13.5 POC-Systemlösungen evidence

- Family/slug/Registry: `poc-systemloesungen` / `/diagnostics/poc-systemloesungen` /
  `service-detail`; AP12 Hub, Header/Footer and AP07 Search remain canonical inlinks, with no
  `/services/*` target or direct-URL-only finding.
- Content x10: independent system/workflow Hero and value proposition, three professional use
  contexts, three pre-selection questions, four non-medical system components, three implementation
  steps, three visible FAQs, contextual CTA, disclaimer and unique SEO/Social alt. No runtime EN/DE
  fallback or visible key is used.
- Proof: intentionally omitted. Related Content: the common projection renders the first three real
  published records from the four canonical service mappings (`invisible_patient`,
  `five_minute_diagnosis`, `ecosystem_of_rapid_tests`). Crosslink: Registry-backed `/igloo-pro`;
  AP14 product details, specifications and proof are not duplicated.
- Claim safety: no turnkey, seamless/automatic integration, fixed setup time, SLA, availability,
  speed, accuracy, laboratory superiority, certification or diagnostic-performance promise is
  present in the productive structured view. Software and interfaces are explicitly subject to
  environment-specific verification; no Demo/Booking or AP22 runtime is claimed.
- SEO/Schema: existing `SEOHead`, Service + BreadcrumbList and visible-only FAQPage; x10
  self-canonical, 10 hreflang plus x-default `de`, index/follow, Sitemap and OG/Twitter remain
  AP09/Registry-owned.
- Quality: Typecheck, task ESLint/Prettier, G1/G4/G3/Search/Findability and Node-22 targeted
  Unit/Component/SEO/Registry 17/17 PASS. Production Client/SSR build was exercised by Playwright;
  final POC plus shared-template browser matrix 24/24 PASS. Evidence includes HTTP 200 and html lang
  x10, H1, structured slots, FAQ/schema parity, GENERAL_SALES, three published articles and Registry
  crosslink, canonical/hreflang/x-default, mobile/desktop overflow and focus.

Open PT13.5-owned blockers: **none**. Remaining family normalization is serially owned by
PT13.6–PT13.10. AP14 remains `NOT STARTED`.

## 15. PT13.6 Präventions-Checks evidence

- Family/slug/Registry: `praeventions-checks` / `/diagnostics/praeventions-checks` /
  `service-detail`; AP12 Hub and AP07 Search remain canonical inlinks, with no `/services/*` target
  or direct-URL-only finding.
- Content x10: independent prevention Hero and value proposition, three professional use contexts,
  three questions for responsible check selection, six established measurements, three workflow
  steps, three visible FAQs, contextual CTA, disclaimer and unique SEO/Social alt. No runtime EN/DE
  fallback or visible key is used.
- Proof and Crosslinks: intentionally omitted. Related Content: the common projection renders the
  two real published records from the canonical service mapping (`invisible_patient`,
  `precision_point_of_care`). No draft, dead or owner-scope route is introduced.
- Claim safety: no prevention, exclusion, early-detection, diagnosis, therapy, individual-risk,
  efficiency, revenue, billing, speed, accuracy or check-package promise is present in the
  productive structured view. The disclaimer expressly states that checks guarantee neither
  detection, exclusion nor prevention of disease.
- SEO/Schema: existing `SEOHead`, Service + BreadcrumbList and visible-only FAQPage; x10
  self-canonical, 10 hreflang plus x-default `de`, index/follow, Sitemap and OG/Twitter remain
  AP09/Registry-owned.
- Quality: Typecheck, task ESLint/Prettier, G1/G4/G3/Search/Findability and Node-22 targeted
  Unit/Component/SEO/Registry 18/18 PASS. Production Client/SSR build was exercised by Playwright;
  final Präventions-Checks plus shared-template browser matrix 24/24 PASS. Evidence includes HTTP
  200 and html lang x10, H1, structured slots, FAQ/schema parity, GENERAL_SALES, two published
  articles, canonical/hreflang/x-default, mobile/desktop overflow and focus.

Open PT13.6-owned blockers: **none**. Remaining family normalization is serially owned by
PT13.7–PT13.10. AP14 remains `NOT STARTED`.

## 16. PT13.7 Infektion & Entzündung evidence

- Family/slug/Registry: `infektion-entzuendung` / `/diagnostics/infektion-entzuendung` /
  `service-detail`; AP12 Hub and AP07 Search remain canonical inlinks, with no `/services/*` target
  or direct-URL-only finding.
- Content x10: independent marker-context Hero and value proposition, three professional care
  contexts, three questions for responsible marker selection, four established marker labels,
  three workflow steps, three visible FAQs, contextual CTA, disclaimer and unique SEO/Social alt.
  No runtime EN/DE fallback or visible key is used.
- Proof and Crosslinks: intentionally omitted. Related Content: the common projection renders the
  one real published record from the canonical service mapping (`precision_point_of_care`). No
  draft, dead or owner-scope route is introduced.
- Claim safety: no diagnosis, treatment, clinical-urgency, threshold, bacterial/viral certainty,
  sepsis, antibiotic-outcome, real-time monitoring, speed, accuracy, laboratory-equivalence,
  automatic integration, fixed setup-time or support promise is present in the productive view.
  Concrete test capability is explicitly subject to configuration-specific verification.
- SEO/Schema: existing `SEOHead`, Service + BreadcrumbList and visible-only FAQPage; x10
  self-canonical, 10 hreflang plus x-default `de`, index/follow, Sitemap and OG/Twitter remain
  AP09/Registry-owned.
- Quality: Node-22 Typecheck, task ESLint/Prettier, G1/G4/G3/Search/Findability and targeted
  Unit/Component/SEO/Registry 27/27 PASS. Production Client/SSR build was exercised by Playwright;
  final Infektion & Entzündung plus shared-template browser matrix 24/24 PASS. Evidence includes
  HTTP 200 and html lang x10, H1, structured slots, FAQ/schema parity, GENERAL_SALES, one published
  article, canonical/hreflang/x-default, mobile/desktop overflow and focus.

Open PT13.7-owned blockers: **none**. Remaining family normalization is serially owned by
PT13.8–PT13.10. AP14 remains `NOT STARTED`.

## 17. PT13.8 Stoffwechsel & Herz evidence

- Family/slug/Registry: `stoffwechsel-herz` / `/diagnostics/stoffwechsel-herz` /
  `service-detail`; AP12 Hub and AP07 Search remain canonical inlinks, with no `/services/*` target
  or direct-URL-only finding.
- Content x10: independent metabolic/cardiovascular monitoring Hero and value proposition, three
  professional use contexts, three questions for responsible marker selection, three established
  marker labels, three workflow steps, three visible FAQs, contextual CTA, disclaimer and unique
  SEO/Social alt. No runtime EN/DE fallback or visible key is used.
- Proof, Related Content and Crosslinks: intentionally omitted because the canonical service record
  has no published-article mapping or supported contextual target. No draft, dead or owner-scope
  route is introduced.
- Claim safety: no diagnosis, individual risk prediction, treatment, outcome, reference-range,
  acute exclusion, Troponin/NT-proBNP capability, speed, accuracy, laboratory-equivalence, multiplex,
  billing, revenue, guarantee or validation promise is present in the productive structured view.
  Concrete test capability is explicitly subject to configuration-specific verification.
- SEO/Schema: existing `SEOHead`, Service + BreadcrumbList and visible-only FAQPage; x10
  self-canonical, 10 hreflang plus x-default `de`, index/follow, Sitemap and OG/Twitter remain
  AP09/Registry-owned.
- Quality: Node-22 Typecheck, task ESLint/Prettier, G1/G4/G3/Search/Findability and targeted
  Unit/Component/SEO/Registry 28/28 PASS. Production Client/SSR build was exercised by Playwright;
  final Stoffwechsel & Herz plus shared-template browser matrix 24/24 PASS. Evidence includes HTTP
  200 and html lang x10, H1, structured slots, FAQ/schema parity, GENERAL_SALES, honest omission of
  unsupported related links, canonical/hreflang/x-default, mobile/desktop overflow and focus.

Open PT13.8-owned blockers: **none**. Remaining family normalization is serially owned by
PT13.9–PT13.10. AP14 remains `NOT STARTED`.

## 18. PT13.9 Hormon-Tests evidence

- Family/slug/Registry: `hormon-tests` / `/diagnostics/hormon-tests` / `service-detail`; AP12 Hub
  and AP07 Search remain canonical inlinks, with no `/services/*` target or direct-URL-only finding.
- Content x10: independent endocrine-question Hero and value proposition, three professional use
  contexts, three questions for responsible test selection, two established parameter labels,
  three workflow steps, three visible FAQs, contextual CTA, disclaimer and unique SEO/Social alt.
  No runtime EN/DE fallback or visible key is used.
- Proof, Related Content and Crosslinks: intentionally omitted because the canonical service record
  has no published-article mapping or supported contextual target. No draft, dead or owner-scope
  route is introduced.
- Claim safety: no diagnosis, treatment, medication, dosage, outcome, fertility/PCOS
  interpretation, Cortisol/testosterone/progesterone/FSH/fT3/fT4 capability, speed, accuracy,
  laboratory-equivalence, IVDR, compatibility, guarantee or validation promise is present in the
  productive structured view. Concrete test capability is explicitly subject to
  configuration-specific verification.
- SEO/Schema: existing `SEOHead`, Service + BreadcrumbList and visible-only FAQPage; x10
  self-canonical, 10 hreflang plus x-default `de`, index/follow, Sitemap and OG/Twitter remain
  AP09/Registry-owned.
- Quality: Node-22 Typecheck, task ESLint/Prettier, G1/G4/G3/Search/Findability and targeted
  Unit/Component/SEO/Registry 29/29 PASS. Production Client/SSR build was exercised by Playwright;
  final Hormon-Tests plus shared-template browser matrix 24/24 PASS. Evidence includes HTTP 200 and
  html lang x10, H1, structured slots, FAQ/schema parity, GENERAL_SALES, honest omission of
  unsupported related links, canonical/hreflang/x-default, mobile/desktop overflow and focus.

Open PT13.9-owned blockers: **none**. Remaining family normalization and broad AP13 integration are
serially owned by PT13.10. AP14 remains `NOT STARTED`.

## 19. PT13.10 Kompatibilität & Integration and pre-closure evidence

- Family/slug/Registry: `kompatibilitaet-integration` /
  `/diagnostics/kompatibilitaet-integration` / `service-detail`; AP12 Hub and AP07 Search remain
  canonical inlinks, with no `/services/*` target or direct-URL-only finding.
- Content x10: independent compatibility/integration Hero and value proposition, three professional
  integration contexts, three requirements questions, four evidence-bounded technical/
  organizational review topics, three verification/documentation workflow steps, three visible
  FAQs, contextual CTA, disclaimer and unique SEO/Social alt. No runtime EN/DE fallback or visible
  key is used.
- Proof and Crosslinks: intentionally omitted. Related Content resolves the one real published
  `ecosystem_of_rapid_tests` article through the Registry; no draft, dead or local path is added.
- CTA/SEO/Schema: Registry-backed `GENERAL_SALES`, German `Angebot anfragen`, self-canonical,
  ten hreflang alternates plus x-default=de, sitemap membership, index/follow, OG/Twitter alt,
  Service/Breadcrumb and visible-only FAQPage. Product/Offer/Rating/Review schema is absent.
- Integration evidence: G1/G4/G3/Search/Findability PASS; full Node-22 Unit/Component suite 356/356
  PASS. The serial no-retry route gate is 99/99 PASS: all 90 canonical service-locale responses,
  one 90-URL sitemap assertion, three real noindex unknown-slug 404 cases and five representative
  viewport/locale cases (de 360, en 768, pl 1024, fr 1440, cs 1920). The focused Compatibility plus
  shared-template browser gate is 24/24 PASS; the serial no-retry family-specific browser gate is
  126/126 PASS across all nine families. Production client and SSR builds PASS.

Open PT13.10-owned blockers: **none**. All 9/9 families are normalized and the 90/90 pre-closure
matrix is PASS. At the PT13.10 handoff AP13 remained `IN_PROGRESS` and AP13-CLOSURE was next; this
historical transition is superseded by the independent result in section 20. AP14 remains
`NOT STARTED`.

## 20. AP13 Closure evidence

- Independent package result: **PASS** on 2026-08-31. `C13-01`–`C13-50` are 50/50 PASS;
  `SERV-01`–`SERV-40` are 40/40 PASS; `R13-01`–`R13-12` are MITIGATED; false-ready findings and
  AP13-owned P0/P1 blockers are 0.
- Canonical coverage: 9/9 records from `src/data/services.tsx`, one Registry family
  `service-detail`, 10/10 locales and 90/90 direct HTTP 200 responses. Three representative unknown
  slugs return real noindex HTTP 404 responses. Hub and Search cover 9/9; direct-URL-only families
  and canonical `/services/*` links are 0.
- Content/claim review: all nine structured models remain semantically differentiated. Parameters,
  workflows, FAQ, published related content and optional crosslinks match the evidence decisions in
  sections 7 and 11–19. Unsupported proof is omitted; invented claims, parameters,
  partner/customer figures and certification claims are 0.
- SEO/i18n/schema: the fresh G1/G3/G4/Search/Findability gates PASS. The 90-route browser matrix
  verifies locale/lang, one H1, Breadcrumb, localized content/CTA, index/follow, self-canonical,
  10 hreflang plus x-default `de`, Sitemap membership, OG/Twitter alt and zero SEO-managed
  preview/dev-host leakage. Service/Breadcrumb and visible-only FAQPage remain AP09-helper output;
  Product/Offer/Rating/Review schema is absent.
- Accessibility/visual/performance: the global Layout supplies the single Main landmark; the AP13
  shell no longer nests a second Main. The nine-family Axe WCAG A/AA matrix reports zero violations
  after all Reveal content is visible. Fresh screenshots for `de`, `en`, `pl`, `fr`, `cs` at
  360/768/1024/1440/1920 px pass visual inspection, overflow is 0 and measured CLS is below 0.1.
  Small shared label/link contrast regressions were corrected. The final ServicePage remains one
  18.24 kB client chunk (5.41 kB gzip), with no nine-way parallel bundle or new media/dependency.
- Fresh quality result: Node-22 Typecheck PASS; AP13-scoped ESLint and Prettier PASS; full
  Unit/Component/Server suite 356/356 PASS; Production Client and SSR builds PASS; final serial
  no-retry AP13 Playwright suite 249/249 PASS, including the 90-route matrix, family suites,
  template/schema tests, unknown-slug 404, Axe and viewport/visual checks.
- Consent/tracking: AP13 source contains no new `gtag`, `dataLayer`, Analytics or Marketing call and
  does not alter the existing Consent Mode Basic contract. The already documented global AP23
  tracking baseline remains owner-bound and is not an AP13 regression.
- Open owner-bound items: the existing French article-index meta-length warning remains AP17-owned;
  the global tracking programme remains AP23-owned; sitewide WCAG/performance/security/final-QA
  programmes remain AP24–AP27. None is an AP13-owned closure blocker.

AP13 is `COMPLETE`; AP13 Closure is `PASS`. AP14 remains `NOT STARTED` and is the next work package.
