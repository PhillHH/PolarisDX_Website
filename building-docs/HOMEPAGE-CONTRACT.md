# Homepage Contract

## 1. Status und Scope

- Work Package: **AP11 — Startseite / B2B Sales-Machine Homepage**
- Current implementation: **AP11 COMPLETE / AP11 Closure PASS** after PT11.1 Hero, PT11.2 Trust &
  Proof, PT11.3 Business Pillars, PT11.4 Process & Benefits, PT11.5 Conversion and PT11.6
  FAQ/SEO/Integration
- Public route family: Registry ID `home`, `/{locale}/`, HTTP 200 in all project locales
- Supported locales: `de`, `en`, `pl`, `fr`, `it`, `es`, `pt`, `da`, `nl`, `cs`
- Default locale: `de`; defensive runtime fallback: `en` (not a content substitute)
- Art direction: existing Sales-Machine design system, Light Theme

This document records Homepage composition, conversion, claims and evidence. It does not create a
route, SEO, translation, tracking, consent or lead-data source of truth; those remain in their
respective canonical contracts.

## 2. PT11.1 Hero contract

The Hero is a static, SSR-first B2B positioning surface. The first viewport identifies PolarisDX,
names practices/medical facilities and professional users, explains the practical Point-of-Care role
with IglooPro, and exposes one dominant sales next step plus a distinct knowledge/product-navigation
step. There is one H1 and no carousel, autoplay or client-JavaScript dependency for the message.

### 2.1 Conversion contract

| Role      | Intent                | German label           | Target                                                                                                                  | Context                                                            | State               |
| --------- | --------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------- |
| Primary   | `GENERAL_SALES`       | `Angebot anfragen`     | Registry `contact`, `/{locale}/contact?intent=quote&source=homepage&journey=general_sales&section=hero#kontaktformular` | Explicit allowlisted lead context, not consent-bypassing telemetry | ACTIVE / target 200 |
| Secondary | Diagnostics discovery | `Diagnostik entdecken` | Registry `diagnostics`, `/{locale}/diagnostics`                                                                         | Navigation only; deliberately not a second sales action            | ACTIVE / target 200 |

The existing Button/Router basename adapter owns locale prefixing. The Hero contains no direct
`gtag`, `dataLayer`, analytics or marketing call. PT11.5 transports the allowlisted context through
the existing contact payload and mail endpoint; lead persistence, CRM delivery and platform
hardening remain AP22-owned and are not claimed as complete.

### 2.2 Visual and LCP strategy

- Asset: existing approved product cutout `src/assets/Igloo-pro-frontal.webp`.
- The visual shows the actual IglooPro reader; no decorative stock image or generated asset is used.
- One image is rendered and one matching image is preloaded by `SEOHead`; the former mismatched
  `hero_doctor.webp` preload and four-slide carousel were removed. React 19 derives the preload from
  the eager, high-priority image during SSR; `HomePage` carries no duplicate manual preload list.
- Intrinsic `650 × 650` dimensions reserve the square image area; `object-contain` preserves it.
- Only this visible Hero image uses `loading=eager` and `fetchPriority=high`; no competing eager Hero
  media, slider timers or animation dependencies remain.
- The asset is a compressed WebP (repository evidence: approximately 19 kB).

### 2.3 Mobile and accessibility hierarchy

DOM and mobile order are: caption → H1 → core benefit → primary CTA → secondary CTA → visual.
Content therefore precedes media at every breakpoint. Both actions are semantic links, inherit the
Button component's minimum 44 px target and focus-visible styling, and have distinct accessible
names. The product image has locale-aware alt text. Decorative glows are non-interactive and hidden
from pointer input. No carousel roles, controls, keyboard traps or motion exist in the Hero.

## 3. PT11.2 Trust and Proof contract

The light TrustBar directly below the Hero is a semantic list of four sourced product signals, not a
logo or badge wall. Each visible signal maps to the Claim Register. The former persistent Nobel
Biocare “Premium Partner” label is not used: current repository evidence establishes named event
associations but does not establish a release basis for a global Homepage relationship claim. The
former numeric LFA claim is reduced to the existing non-quantitative cross-manufacturer compatibility
statement.

The Proof section shows one named existing practice reference: Dr. Bastian Wessing, Medical Director,
MVZ Zahnkultur Berlin Brandenburg. Its name, practice and real 300 × 300 WebP portrait already formed
part of the productive repository. Only the existing training/support sentence is surfaced. This
avoids treatment-outcome, safety, speed, rating or review-count amplification. Four additional source
records remain in the content layer but are intentionally absent from productive Homepage output
because the repository does not carry equally strong release evidence for this new Trust surface.

| Evidence candidate               | Repository evidence                                                             | PT11.2 decision                                               | Productive output |
| -------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------- |
| IglooPro `CV < 2 %`              | Decision Lock `DEC-RL-008`; existing Product/Content-Matrix `S-01`              | Use exact locked value; no accuracy paraphrase                | TrustBar          |
| IVDR/CE                          | Existing Product/Legal copy; Content-Matrix `S-02` existing sensitive statement | Retain compact existing statement; no certification expansion | TrustBar          |
| Results in minutes               | Existing visible IglooPro Product copy states 3–15 minutes                      | Use only the broader, supported wording                       | TrustBar          |
| Cross-manufacturer compatibility | Existing visible IglooPro Product feature                                       | Use without the former Homepage percentage                    | TrustBar          |
| Nobel Biocare                    | Named event associations in `src/data/events.ts`                                | Insufficient for persistent global Premium-Partner claim      | NOT USED          |
| Bastian Wessing / MVZ Zahnkultur | Existing productive testimonial data, localized copy and real portrait          | Use one claim-reduced training/support excerpt                | Proof section     |
| Four other testimonial records   | Existing data/copy/assets, but no equally strong PT11.2 release evidence        | Preserve source records; do not surface                       | NOT USED          |

TrustBar and Proof are static/SSR-safe. The reference uses `figure`, `blockquote` and `figcaption`; its
portrait is decorative beside the fully named caption (`alt=""`), dimensioned, lazy-loaded and not an
LCP competitor. There is no autoplay, carousel role, rating UI, logo, CTA or keyboard interaction in
either section.

## 4. PT11.3 Business pillars and selected service entry points

The Homepage now presents Diagnostics, IglooPro and Epigenetics in one shared, equally weighted
three-column surface immediately after Trust/Proof. Each card is one semantic link, uses the same
design-system card recipe, and derives its canonical target from `src/routing/routeRegistry.ts` via
`getCanonicalRouteEntries()`. Epigenetics therefore has its own heading, description, icon and route;
it is not nested under Diagnostics.

The former Homepage combination of a detailed IglooPro performance setup, a separate specialty
widget and a large Epigenetics programme teaser is no longer rendered. Those sections mixed three
different visual weights and duplicated content owned by AP12, AP14 and AP15. PT11.3 replaces them
with short navigational copy that reflects existing route/product truth without treatment, outcome,
revenue, delivery-time or new scientific claims.

Below the pillars, exactly three existing service-source records are prioritized: `dental`, `beauty`
and `longevity`. Their IDs come from `src/data/services.tsx`; their canonical targets come from the
Registry dynamic source expansion. Only the existing localized title, biomarker line and CTA are
shown. The complete nine-service portfolio remains owned by the Diagnostics hub and AP12/AP13.

The layout is a one-column stack below `md` and a three-column grid from `md`; all six cards are
keyboard-focusable links with the established visible focus ring and motion-reduced hover behavior.
The section adds no images, script, timers, tracking or third-party dependency.

## 5. PT11.4 Point-of-Care process and benefits

Immediately after the business/service entry points, the Why-POC section describes three operational
dimensions: access to measurements after the test-specific processing time, integration of
application/measurement/documentation into the practice workflow, and use of available values as a
possible basis for professional discussion. The ordered process follows it directly, before later
Proof and conversion-owned sections. The copy does not promise an immediate result for every test,
eliminate professional interpretation or claim a treatment, prevention, patient-outcome, revenue,
profit or amortization effect.

Practice benefit and patient/user benefit are explicitly separate semantic articles. The practice
copy addresses structured information availability within consultation and care. The patient copy
addresses understandable discussion in the care context and explicitly states that the test
complements rather than replaces professional assessment, diagnosis or treatment.

The following process is one ordered list in both DOM and visual order:

1. application/sample preparation and measurement according to the respective instructions;
2. result availability after the test-specific processing time, without an automated medical
   conclusion;
3. individual interpretation and any appropriate next-step discussion by the responsible
   professional.

Visible numbers make the sequence independent of icons or colour. Desktop presents the same order in
three columns; mobile retains it as a stack. Both sections are static and non-interactive, add no
image, CTA, script, tracking or third-party dependency, and therefore do not pre-empt PT11.5 or create
an additional below-fold media candidate.

## 6. PT11.5 conversion and secondary conversion

The Homepage now has exactly three deliberate `GENERAL_SALES` entry points: Hero, the ROI context
area and Final CTA. All use the natural x10 equivalent of `Angebot anfragen` and the same typed helper
to build `intent=quote`, `source=homepage`, `journey=general_sales`, the current locale and an
allowlisted `section` (`hero`, `roi`, `final_cta`). ContactForm forwards these structured values to
the existing `/api/contact` request; the mail service validates the vocabulary before including it
in the team notification. Attribution is not inferred from localized button text and does not call
analytics. Direct `gtag`, `dataLayer.push`, new trackers and new tracking-event vocabulary added by
PT11.5: 0.

The existing ROI calculator is the contextual secondary conversion. Its result is calculated only
from visitor-provided inputs, visibly marked as a non-binding example and expressly not a revenue or
profit commitment. The optional report form remains a real `/api/roi-report` flow with email
validation, honeypot, explicit consent, locale-aware privacy link, runtime PDF and mail handling; it
now carries `source=homepage`, `journey=roi_report`, `section=roi`. No fake file, mail, CRM persistence
or success state was introduced. The real Article source supplies three Homepage knowledge teasers;
their detail paths and the Article hub path are resolved against the central Route Registry.

Final CTA response-under-24-hours and delivery-in-3–5-days promises were removed across all ten
resources. The closing surface now offers a non-binding enquiry, personal consultation, the factual
x10 language availability and the real in-page ROI anchor. Its Homepage attribution is opt-in via the
component prop, so uses of the shared Final CTA on other routes are not falsely labelled `homepage`.

### DG11-01 — HOMEPAGE_SECONDARY_CONVERSION_FINAL_INTEGRATION

- Type: `CROSS_AP_PRODUCT_INTEGRATION`
- Owner: **AP19**
- Status: **READY_FOR_OWNER**
- Required before: **AP19 Closure / Launch if the gated Homepage secondary conversion remains a
  launch requirement**
- AP11 Closure blocker: **NO**, while the safe state below remains true
- Launch relevance: **YES**, according to the AP19 launch decision
- Safe current state: the in-page ROI model and consent-gated `/api/roi-report` runtime are real and
  functional; the Article hub is a real ungated Knowledge entry. The Homepage does not claim a
  Resource Center, durable lead persistence, CRM handoff or a finished AP19 delivery platform.
- Boundary: AP19 owns final resource/gating/delivery integration; AP22 retains persistence, CRM,
  queue/retry and lead-platform ownership; AP23 retains final consent/tracking hardening.

## 7. PT11.6 FAQ, SEO and page integration

The visible Homepage FAQ contains four questions per locale. They follow the visible positioning,
three-pillar navigation and Point-of-Care process instead of creating search-only material. The
answers deliberately avoid revenue, delivery-time, approval, treatment or outcome amplification and
state that test information does not replace qualified interpretation. `HomePage` passes the exact
same `faq.items` array to `FAQSection` and the AP09 `createFAQSchema` builder; hidden schema-only
questions are therefore structurally impossible in this page composition. Each accordion button has
a stable SSR-safe control/region relationship, a visible focus state and a truly hidden closed panel.

Homepage metadata is complete in all ten `home.json` resources:

- locale-aware title and description mirror the visible PolarisDX/Point-of-Care positioning;
- one self-canonical per locale, ten hreflang alternates and German `x-default` come from SEOHead and
  the central Route Registry contract;
- Open Graph and Twitter reuse title, description and canonical URL, with the real productive
  `public/og-image.jpg` (`1200 × 630`) and localized image alt text;
- productive Preview/Dev host references, manual hreflang lists and secondary JSON-LD output are 0.

The page has exactly one H1 and a continuous H1–H4 hierarchy. Diagnostics, IglooPro and Epigenetics
remain registry-valid HTTP-200 links in every locale. Page-level checks cover landmarks, focus,
dimensioned/high-priority Hero media, one eager main image, reduced motion, no horizontal overflow,
no serious/critical axe findings within `main`, and no new third-party host outside the existing
consent/tracking facade. Visual QA was performed after sequential real-page scrolling at 1440×900 DE,
1280×800 PL, 1024×768 DE, 768×1024 DE, 390×844 PL and 360×800 PL, including the FAQ
hover/focus/open state and long copy.

## 8. Homepage deep-link matrix (current through PT11.6)

| Source section       | CTA/link              | Target route ID             | Locale behavior                                                                   | Target status                  | Owner              |
| -------------------- | --------------------- | --------------------------- | --------------------------------------------------------------------------------- | ------------------------------ | ------------------ |
| Hero                 | Primary quote request | `contact`                   | current locale through router basename; `#kontaktformular` retained               | Registry-valid, HTTP 200 ×10   | AP11 PT11.1        |
| Hero                 | Diagnostics discovery | `diagnostics`               | current locale through router basename                                            | Registry-valid, HTTP 200 ×10   | AP11 PT11.1        |
| Business pillar      | Diagnostics           | `diagnostics`               | current locale through router basename                                            | Registry-derived, HTTP 200 ×10 | AP11 PT11.3        |
| Business pillar      | IglooPro              | `igloo-pro`                 | current locale through router basename                                            | Registry-derived, HTTP 200 ×10 | AP11 PT11.3        |
| Business pillar      | Epigenetics           | `epigenetics`               | current locale through router basename                                            | Registry-derived, HTTP 200 ×10 | AP11 PT11.3        |
| Selected application | Dental                | `service-detail:dental`     | current locale; dynamic service target from Registry/source                       | Registry-derived, HTTP 200 ×10 | AP11 PT11.3        |
| Selected application | Beauty                | `service-detail:beauty`     | current locale; dynamic service target from Registry/source                       | Registry-derived, HTTP 200 ×10 | AP11 PT11.3        |
| Selected application | Longevity             | `service-detail:longevity`  | current locale; dynamic service target from Registry/source                       | Registry-derived, HTTP 200 ×10 | AP11 PT11.3        |
| ROI context          | Primary quote request | `contact`                   | current locale; structured `homepage/general_sales/roi` query + form anchor       | Registry-valid, HTTP 200 ×10   | AP11 PT11.5        |
| ROI context          | ROI report            | in-page / `/api/roi-report` | locale in validated report payload; no route change                               | Real consent-gated runtime     | AP11 PT11.5 / AP19 |
| Knowledge teaser     | Three Article details | `article-detail:*`          | current locale; real Article source + Registry dynamic targets                    | Registry-derived, HTTP 200 ×10 | AP11 PT11.5        |
| Knowledge teaser     | All articles          | `articles`                  | current locale through router basename                                            | Registry-derived, HTTP 200 ×10 | AP11 PT11.5        |
| Final CTA            | Primary quote request | `contact`                   | current locale; structured `homepage/general_sales/final_cta` query + form anchor | Registry-valid, HTTP 200 ×10   | AP11 PT11.5        |
| Final CTA            | ROI calculator        | `home#roi-rechner`          | current locale; real in-page target                                               | Attached ×10                   | AP11 PT11.5        |
| FAQ footer           | Diagnostics           | `diagnostics`               | current locale through router basename                                            | Registry-valid, HTTP 200 ×10   | AP11 PT11.6        |
| FAQ footer           | Contact               | `contact`                   | current locale through router basename                                            | Registry-valid, HTTP 200 ×10   | AP11 PT11.6        |

Later Homepage sections will extend this matrix in their owning PTs. It is a Homepage link-evidence
matrix, not a competing route registry.

## 9. Claim register

| Claim ID  | Visible claim                                                                                                              | Section                          | Source/evidence                                                                                                                                                               | Owner       | Status                        | Locale coverage |
| --------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ----------------------------- | --------------- |
| `HCL-001` | PolarisDX supports professional users in integrating Point-of-Care diagnostics with IglooPro into existing workflows.      | Hero                             | Existing product/diagnostics positioning and visible Hero copy; descriptive integration statement without efficacy, revenue, certification, delivery-time or accuracy promise | AP11 PT11.1 | APPROVED_SAFE_STATE           | x10             |
| `HCL-002` | `CV < 2 %` laboratory precision                                                                                            | TrustBar                         | Decision Lock `DEC-RL-008`; Content-Matrix `S-01`; existing Product copy                                                                                                      | AP11 PT11.2 | LOCKED_EXISTING               | x10             |
| `HCL-003` | IVDR/CE conformity                                                                                                         | TrustBar                         | Existing Product/Legal copy; Content-Matrix `S-02`; retained without broader certification claim                                                                              | AP11 PT11.2 | EXISTING_SENSITIVE_SAFE_STATE | x10             |
| `HCL-004` | Results in minutes                                                                                                         | TrustBar                         | Existing Product copy states a 3–15 minute result range; TrustBar uses no stronger value                                                                                      | AP11 PT11.2 | APPROVED_SAFE_STATE           | x10             |
| `HCL-005` | Cross-manufacturer compatibility                                                                                           | TrustBar                         | Existing Product feature; former Homepage `90 %` wording intentionally not surfaced                                                                                           | AP11 PT11.2 | APPROVED_SAFE_STATE           | x10             |
| `HCL-006` | Training and support from PolarisDX are straightforward; the device is part of everyday practice.                          | Proof / named practice reference | Existing productive `bastian_wessing` record, localized original quote and real portrait; claim-reduced excerpt                                                               | AP11 PT11.2 | EXISTING_PRODUCTIVE_REFERENCE | x10             |
| `HCL-007` | PolarisDX provides a Diagnostics area with Point-of-Care and specialty application entry points for professional settings. | Diagnostics business pillar      | Existing Registry `diagnostics`; nine real service records and published Diagnostics hub; descriptive navigation copy only                                                    | AP11 PT11.3 | APPROVED_SAFE_STATE           | x10             |
| `HCL-008` | The IglooPro reader evaluates compatible rapid tests at the Point of Care.                                                 | IglooPro business pillar         | Existing IglooPro product identity and cross-manufacturer compatibility evidence already recorded by `HCL-005`; no numeric compatibility/accuracy expansion                   | AP11 PT11.3 | APPROVED_SAFE_STATE           | x10             |
| `HCL-009` | Epigenetics is an independent area for epigenetic/genetic analyses and related sample reports.                             | Epigenetics business pillar      | Decision Lock `DEC-RL-005`; existing Registry family, Epigenetics hub and six real sample-report families; no new analysis/outcome claim                                      | AP11 PT11.3 | LOCKED_EXISTING_SAFE_STATE    | x10             |
| `HCL-010` | Measurements are available at the Point of Care after the test-specific processing time.                                   | Why POC / direct information     | Existing Product evidence and broader `HCL-004` “results in minutes”; deliberately avoids a universal exact time or immediacy promise                                         | AP11 PT11.4 | APPROVED_SAFE_STATE           | x10             |
| `HCL-011` | Available values can support professional consultation and discussion of appropriate next steps.                           | Why POC / discussion             | Existing Point-of-Care workflow positioning; conditional support statement, no automated decision, treatment result or outcome promise                                        | AP11 PT11.4 | APPROVED_SAFE_STATE           | x10             |
| `HCL-012` | The test complements professional assessment and replaces neither diagnosis nor treatment.                                 | Patient/user benefit + process   | Claim-safety qualifier required by AP11 §10; expressly limits the role of measurement information rather than asserting medical efficacy                                      | AP11 PT11.4 | REQUIRED_SAFETY_QUALIFIER     | x10             |
| `HCL-013` | Homepage consultation and conversion copy is available in ten project languages.                                           | Final CTA                        | Canonical i18n contract and ten complete `home.json` resources; exact locale parity verified by PT11.5 tests                                                                  | AP11 PT11.5 | VERIFIED_FACTUAL              | x10             |
| `HCL-014` | ROI output is a non-binding example based on the visitor's own inputs, not a revenue or profit commitment.                 | ROI calculator                   | Existing visible formula/input implementation and x10 disclaimer; no PolarisDX performance constant or guaranteed outcome                                                     | AP11 PT11.5 | REQUIRED_SAFETY_QUALIFIER     | x10             |

The implementation through PT11.6 introduces no therapeutic, preventive, guaranteed revenue,
profit, outcome, response-time, delivery-time or performance claim. The Hero does not use a
precision claim; TrustBar retains the locked `CV < 2 %` value exactly. ROI values are visibly
user-input-derived examples and not promises.

## 10. Section ownership and safe state

PT11.1 owns the Hero, PT11.2 owns Trust/Proof, PT11.3 owns the three business pillars plus the three
selected service entry points, PT11.4 owns Why POC plus the three-step information process, and
PT11.5 owns the current conversion hierarchy, safe ROI/Knowledge entry and Final CTA. PT11.6 owns the
visible/schema-parity FAQ, Homepage metadata, page-level structure, accessibility/performance smoke
and current visual QA. All six primary-task surfaces are implemented and the independent AP11
Closure gate is `PASS`; AP11 is `COMPLETE`.

- Final secondary-conversion integration: owner AP19 via `DG11-01`; current real safe state above.
- Final Epigenetics fachcopy alignment remains owner AP15. PT11.3 uses conservative, existing route
  and portfolio truth, so no blocking `DG11-02` is required for the current safe teaser.
- Final event-feed model remains AP18-owned. PT11.6 uses the existing real Article source only and
  creates no event-feed claim or runtime, so no `DG11-03` is required for the current safe state.

## 11. AP11 evidence

### 11.1 PT11.1

- Component contract: `src/components/sections/HeroSection.test.tsx`
- Browser/SSR, x10 deep links, image load, mobile order/focus/overflow: `e2e/home-hero.spec.ts`
- Task gate: TypeScript, task-scoped ESLint/Prettier, targeted unit/component and browser tests
- Decision locks preserved: 18/18; no chat, guarantee band, Deal, Voucher, Case Studies or Shop work;
  no AP12+ implementation.

### 11.2 PT11.2

- Component/claim/x10 contract: `src/components/sections/TrustProof.test.tsx`
- Production SSR/browser, x10 content, semantic structure and mobile overflow:
  `e2e/home-trust-proof.spec.ts`
- TrustBar: 4 sourced signals, stable claim IDs, partner/logo output 0
- Proof: 1 named existing reference, real portrait, rating/review UI 0, carousel/autoplay 0
- Claim register current through `HCL-006`; `CV < 2 %` exact in 10/10 TrustBar resources
- Decision locks preserved: 18/18; no PT11.3+, AP12 or later-owner implementation

### 11.3 PT11.3

- Component/Registry/x10 contract: `src/components/sections/BusinessPillarsSection.test.tsx`
- Production SSR/browser, target HTTP status, x10 copy, keyboard and mobile overflow:
  `e2e/home-business-pillars.spec.ts`
- Business pillars: exactly 3 (`diagnostics`, `igloo-pro`, `epigenetics`), equal card semantics;
  Epigenetics is independently headed and linked
- Selected services: exactly 3 real `services.tsx` source records with Registry dynamic targets;
  full nine-service content remains outside the Homepage
- Productive Homepage legacy `/services*` targets: 0; broken PT11.3 deep links: 0
- Visual evidence: `/tmp/pt11-3-desktop.png`, `/tmp/pt11-3-mobile.png`; desktop grid and mobile stack
  reviewed without horizontal overflow
- Decision locks preserved: 18/18; no PT11.4+, AP12 or AP13–AP15 detail implementation

### 11.4 PT11.4

- Component/x10/claim-safety contract: `src/components/sections/ProcessBenefitsSection.test.tsx`
- Production SSR/browser, x10 semantic structure and mobile order/overflow:
  `e2e/home-process-benefits.spec.ts`
- Why POC: three operational information dimensions; practice and patient/user benefits explicitly
  separated; links/buttons/images 0
- Process: one ordered DOM list with exactly application → result → professional interpretation;
  automated medical conclusion, revenue, profit and guarantee claims 0
- Claim register current through `HCL-012`; G4 10/10, unit 3/3, production browser 11/11
- Visual evidence: `/tmp/pt11-4-desktop.png`, `/tmp/pt11-4-mobile.png`; desktop order and mobile stack
  reviewed without horizontal overflow
- Decision locks preserved: 18/18; no PT11.5+, AP12 or later-owner implementation

### 11.5 PT11.5

- Typed target/context contract and validation: `src/lib/homepageConversion.test.ts`
- Conversion, x10 CTA parity, real ROI/Knowledge safe state: `src/components/sections/HomeConversion.test.tsx`
- Existing contact-payload transport: `src/hooks/useContactForm.test.ts`
- Mail-service context allowlist: `server/server.test.js`
- Production SSR/browser x10, target HTTP 200, contact preselection, consent gate, focus and mobile
  overflow: `e2e/home-conversion.spec.ts` (**11/11 PASS**)
- Targeted Unit/Component/Server: **19/19 PASS**; Typecheck, task-scoped ESLint and Prettier PASS;
  Production Client/SSR Build PASS as part of the Playwright webserver gate
- Homepage `GENERAL_SALES`: exactly 3 explicit actions; direct tracking bypasses added: 0; fake
  resource/mail/CRM runtime added: 0; response-/delivery-time promises in Final CTA: 0
- Decision locks preserved: 18/18; no PT11.6, AP12, AP19 platform, AP22 platform or AP23 tracking
  architecture implementation

### 11.6 PT11.6

- x10 FAQ/SEO/heading/deep-link parity, AP09 FAQ schema and page-level accessibility/performance:
  `e2e/home-faq-seo-integration.spec.ts`
- Updated predecessor Hero test now asserts the PT11.5 deterministic `homepage/general_sales/hero`
  target instead of the superseded anchor-only target: `e2e/home-hero.spec.ts`
- SEOHead/Structured Data unit regression plus AP11 component suite: **39/39 PASS**
- G4 i18n: **15 namespaces ×10, 6 Befunde ×10, missing/empty keys 0**
- G3 SEO: **39 families, 390 unique URLs**, meta/host/structured-data hard-failure checks PASS
- Production Client/SSR build and browser integration: **79/79 PASS** across PT11.1–PT11.6 plus
  representative AP09 SEO regression; Homepage PT11.6 x10 cases **10/10 PASS**
- Visual QA: six viewport/locale combinations reviewed; horizontal overflow 0, long PL copy intact,
  Proof/ROI/Knowledge/FAQ/Final CTA visible, FAQ focus/hover/open state checked
- Decision locks preserved: 18/18; AP12, AP19 platform, AP22 platform and AP23 architecture not started

### 11.7 AP11 Closure

- Independent package gate: **C11-01–C11-50 50/50 PASS**, **HOME-01–HOME-40 40/40 PASS** and
  **R11-01–R11-12 12/12 mitigated or explicitly later-owner-bound**.
- Node 22.23.2: Typecheck PASS; full Unit/Component/Server **319/319 PASS**; G1 route, navigation,
  Search, Findability, G4 i18n, G3 SEO and Asset guards PASS; Production Client/SSR Build PASS.
- Production Browser/SSR package matrix: **144/144 PASS with retries disabled** across PT11.1–PT11.6,
  SEOHead, Sitemap, i18n core and real 200/301/404 routing. Direct x10 SSR smoke confirms ten Home
  HTTP-200 responses, one H1 and one self-canonical per locale; Diagnostics, IglooPro and
  Epigenetics targets return 200; unknown route returns 404; Hero asset returns 200 at 18,512 bytes.
- Homepage `main` accessibility smoke: axe serious/critical **0**, keyboard/focus/FAQ relationships
  PASS, reduced-motion contract present and horizontal overflow **0**. The broader AP01 audit still
  reports inherited Header/Footer contrast and later-page findings; none is in the AP11-owned
  `main`, and the final sitewide audit remains AP24-owned without a false-ready claim.
- Visual QA: **6/6** full-page captures reviewed at 1440, 1280, 1024, 768, 390 and 360 px across DE
  and long-copy PL; content order, pillar equality, FAQ open/focus state and Final CTA remain intact.
- Full repository ESLint reproduces the registered archive/live baseline at **115 errors / 3
  warnings** and full Prettier reproduces **34 historical files**. The AP11 file set itself has zero
  ESLint errors and is fully Prettier-clean; no AP11-owned regression is hidden by that baseline.
- Tracking/consent delta: Homepage sections add **0** direct `gtag` or `dataLayer` calls and create no
  new event vocabulary or pre-consent transmission. The known sitewide GTM/Consent hardening debt is
  unchanged and remains explicitly AP23-owned; Closure does not claim that later platform complete.
- `DG11-01` remains `READY_FOR_OWNER / AP19` in its documented real safe state. AP12, AP19 platform,
  AP22 platform and AP23 architecture remain not started by AP11.
