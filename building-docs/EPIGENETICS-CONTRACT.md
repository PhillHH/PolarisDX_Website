# Epigenetics Contract

**Status:** AP15 COMPLETE — AP15 Closure PASS
**Verified:** 2026-09-01
**Repository:** `/home/phillip/01polaris-preview`
**Branch:** `console/10-15-2026-08-28T08-18-27`
**HEAD:** `8a142173a5e2f89de09af2e76a1ce28ea243782e`

This file is an AP15 evidence and handoff contract. It does not replace the AP10 Route Registry,
the `epigenetics` locale namespace, the AP09 SEO layer, Search metadata, navigation components or
later AP15 content/runtime owners.

## 1. Serial authority

- Immediate predecessor: AP14 `COMPLETE`; AP14 Closure `PASS`.
- PT15.1 through PT15.7: `PASS`.
- AP15 is `COMPLETE`; AP15 Closure is `PASS`. The minimum shared foundation dependency is available
  and the dedicated `epigenetics_inquiry` vertical slice is integrated.
- AP16 is the next work package and remains `NOT STARTED`.
- Decision Locks remain 18/18.

## 2. Canonical hub route

The operative authority is the `epigenetics` record in `src/routing/routeRegistry.ts`.

| Field           | Current truth                                                  |
| --------------- | -------------------------------------------------------------- |
| Registry ID     | `epigenetics`                                                  |
| Canonical path  | `/epigenetics`                                                 |
| Route type      | `EPIGENETICS`                                                  |
| Locale behavior | `LOCALIZED_X10`                                                |
| Shell           | `B2B`                                                          |
| Indexability    | `INDEX_FOLLOW`                                                 |
| Search          | eligible; current metadata binding in `src/hooks/useSearch.ts` |
| Sitemap         | eligible; static, priority 0.8, monthly                        |
| Redirect source | none for the canonical hub                                     |

| Locale | Canonical public URL                   |
| ------ | -------------------------------------- |
| de     | `https://polarisdx.net/de/epigenetics` |
| en     | `https://polarisdx.net/en/epigenetics` |
| pl     | `https://polarisdx.net/pl/epigenetics` |
| fr     | `https://polarisdx.net/fr/epigenetics` |
| it     | `https://polarisdx.net/it/epigenetics` |
| es     | `https://polarisdx.net/es/epigenetics` |
| pt     | `https://polarisdx.net/pt/epigenetics` |
| da     | `https://polarisdx.net/da/epigenetics` |
| nl     | `https://polarisdx.net/nl/epigenetics` |
| cs     | `https://polarisdx.net/cs/epigenetics` |

Fresh PT15.1 SSR checks return HTTP 200 without redirect for all ten URLs, render the matching
`html lang`, one translated H1, locale-aware navigation and the canonical hub marker. Default and
`x-default` remain `de`; the public host remains `https://polarisdx.net`.

## 3. IA entry points

### Header

- `Header.tsx` exposes Epigenetics as a standalone top-level item in desktop and mobile navigation.
- Its target is `/epigenetics`; the locale router emits the current locale prefix.
- The Diagnostics mega menu retains a visually separated contextual crosslink, but no
  `/diagnostics/epigenetics` route or Diagnostics active-state ownership is introduced.
- Existing focus rings, 44 px targets, keyboard-accessible mobile menu and active state remain.

### Footer

- `Footer.tsx` has a dedicated Epigenetics column with the hub, three registered deepening routes
  and the published report-entry anchor.
- All labels come from the x10 `common` namespace; no `/services*`, redirect-source or dead target is
  emitted.

### Homepage

- `BusinessPillarsSection.tsx` resolves Registry ID `epigenetics` and presents it alongside
  Diagnostics and IglooPro as one of three equal business pillars.
- The x10 Homepage content and canonical target were rechecked without redesigning AP11 output.

## 4. Hub orientation journey

The current hub keeps one coherent orientation route:

1. Hero and independent-pillar positioning.
2. Audience/question selection through the comparison filter.
3. Six panels and six real report entry points.
4. Evidence-bounded workflow and consultation context.
5. Visible FAQ.
6. Existing documents/resources with truthful language disclosure.
7. Registry-backed deepening entries for Grundlagen, Studienlage and Unterlagen.
8. Real `GENERAL_SALES` contact route with `source=epigenetics`.

PT15.1 does not deepen panel claims, build AP16 report pages, create an AP19 resource platform or
implement an AP22 inquiry backend.

## 5. Diagnostics crosslinks and Search

- Diagnostics uses Registry target `epigenetics` as an explicitly separated context link, never as
  one of the nine Diagnostics service families.
- The Hub links back to the canonical Longevity Diagnostics route and the real Downloads route.
- Search consumes the Registry-eligible hub and three existing deepening targets; the hub is not
  direct-URL-only.
- Route, Search and internal-findability guards pass with 0 canonical `/services*` targets.

## 6. Locale, accessibility and responsive evidence

- Locale coverage: `de,en,pl,fr,it,es,pt,da,nl,cs` (10/10).
- Each `epigenetics.json` has the same 191 visible leaf values and no `_translationStatus` fallback
  marker. Non-DE/EN Hero objects differ from both German and English; SSR renders each locale's own
  title and CTA.
- The stale Hub-only English-fallback wrapper was removed; the global defensive English fallback
  mechanism remains unchanged for namespaces that explicitly declare it.
- The horizontally scrollable comparison table is a named, keyboard-focusable region with visible
  focus. Workflow animation wrappers no longer break direct `ol`/`li` semantics.
- PT15.1 mobile CS smoke: no horizontal overflow, standalone Header entry focusable, Axe
  serious/critical on the settled Hub `main` = 0.
- Existing Header/Footer component tests remain 51/51 PASS; Business Pillars, Search, Diagnostics
  crosslinks and Sitemap bring the focused unit/component total to 87/87.

## 7. Test evidence and baseline note

- Typecheck: PASS with Node 22.
- Scoped ESLint: 0 errors. The unchanged Header retains one pre-existing exhaustive-deps warning;
  no Header/Footer production code changed in PT15.1.
- Scoped Prettier: PASS.
- G1 Route Registry, G3 SEO, G4 i18n, Search and internal-findability guards: PASS.
- Production client and SSR builds: PASS through the Playwright web server.
- PT15.1-owned browser suite: 3/3 PASS without retries.
- Adjacent Header/Footer/Home/Diagnostics browser set: 64/65 PASS without retries. The sole failure
  is the pre-existing first-hydration timing race in the old desktop mega-menu keyboard test: an
  isolated `repeat-each=2` run alternates 1 FAIL / 1 PASS while the unchanged Header unit keyboard
  contract passes. No PT15.1 code path caused or worsened it; PT15.1's mobile keyboard/focus and
  standalone Epigenetics navigation checks pass.

## 8. PT15.2 deep-route families and selective import

The three deepening pages are selective AP01 reimplementations of candidates A1–A4 from
`BRANCH-RECONCILIATION-MAP.md`, originally sourced from `main@543fe41`. No branch merge, wholesale
file checkout or legacy Router/Shell/Footer/SEO/404 implementation was used. The current versions
retain the Sales-Machine/Light tokens, the consent-bound tracking contract, the AP09 SEO layer and
the AP10 registry-driven App/SSR architecture.

| Registry ID               | Canonical path             | Purpose / current content source                                      |
| ------------------------- | -------------------------- | --------------------------------------------------------------------- |
| `epigenetics-grundlagen`  | `/epigenetics/grundlagen`  | Existing x10 `principle.*` and `basics.*` keys; no new science claims |
| `epigenetics-studienlage` | `/epigenetics/studienlage` | Existing x10 `evidence.*` / `compare.caveats`; conservative limits    |
| `epigenetics-unterlagen`  | `/epigenetics/unterlagen`  | Existing x10 orientation copy and real DE/EN download references      |

`EpiSubpage` now resolves each path from these AP10 Registry IDs and hard-fails an invalid ID,
route type or indexability binding. The old page-level path props and the stale claim that eight
locales rendered English body fallback were removed. The shared frame emits stable family/route
evidence markers, one H1, locale-aware Breadcrumb JSON-LD, a real Hub return and the existing
`GENERAL_SALES` contact target. No parallel route, SEO, Search, Sitemap or content SSOT was added.

The Studienlage download and all Unterlagen assets disclose their actual resource language. The
web page copy is x10; the files themselves remain truthfully limited to real DE/EN assets. PT15.2
created no missing file or locale claim. PT15.5 retains ownership of the final asset/download hard
gate.

## 9. PT15.2 3×10 route matrix

| Family      | Locales                               | HTTP  | Canonical / hreflang                  | Sitemap | Search | Result |
| ----------- | ------------------------------------- | ----- | ------------------------------------- | ------- | ------ | ------ |
| Grundlagen  | de,en,pl,fr,it,es,pt,da,nl,cs (10/10) | 10/10 | self 10/10 · x10 + x-default=de 10/10 | 10/10   | PASS   | PASS   |
| Studienlage | de,en,pl,fr,it,es,pt,da,nl,cs (10/10) | 10/10 | self 10/10 · x10 + x-default=de 10/10 | 10/10   | PASS   | PASS   |
| Unterlagen  | de,en,pl,fr,it,es,pt,da,nl,cs (10/10) | 10/10 | self 10/10 · x10 + x-default=de 10/10 | 10/10   | PASS   | PASS   |

Fresh production SSR evidence confirms 30/30 HTTP 200 without redirect, matching `html lang`, one
translated H1 and lead, `index, follow`, one self-canonical, 10 alternates plus German x-default,
Sitemap membership, OG/Twitter metadata, Breadcrumb JSON-LD, real Inquiry/Hub links, zero visible
translation keys, zero Preview/dev hosts and zero `/services*` targets. Unknown deep paths return a
real HTTP 404 with no canonical in DE/EN/CS samples. Search consumes all three registry-eligible
targets.

## 10. PT15.2 accessibility, responsive and quality evidence

- Production browser matrix: 5/5 PASS without retries, including the complete 30-URL SSR/SEO matrix,
  unknown-deep-route 404 and DE/PL/CS page-level browser smokes.
- Axe serious/critical: 0 on Grundlagen mobile, Studienlage tablet and Unterlagen desktop.
- The first Unterlagen run exposed 14 px `text-gray-500` PDF metadata at 3.37:1 on white; PT15.2
  changed that existing token usage to `text-gray-600`, after which the unmodified Axe rule passed.
- Keyboard focus reaches the persistent Inquiry CTA; horizontal overflow is at most 1 px.
- Node 22 Typecheck, scoped ESLint/Prettier, Registry/Search/Findability, G3 SEO, G4 i18n,
  resource-asset guards and focused Unit/Component/Schema tests pass. The Playwright server completed
  the production Client/SSR build successfully.

## 11. Deferred owner-bound items

- PT15.6: Inquiry flow, subject to the AP22 persistent lead-platform contract.
- PT15.7 and AP15 Closure: broad integration and independent package verification.
- AP16, AP19, AP22 and AP23 remain outside PT15.1–PT15.3 and were not started.

## 12. PT15.3 panel and report-entry matrix

The existing `epigenetics` locale namespace remains the content authority. PT15.3 did not add a
panel/content SSOT or change scientific, medical, regulatory, commercial or turnaround copy. Each
row below is projected from `analyses.items`, `compare.rows` and `samples.items`; the report slug
comes from `BEFUND_ORDER` and the AP10 dynamic Registry family `report-detail`.

| Order | Stable panel key        | Differentiation source               | Real report target                                | x10 / HTTP | Inquiry handoff | AP16 boundary |
| ----- | ----------------------- | ------------------------------------ | ------------------------------------------------- | ---------- | --------------- | ------------- |
| 01    | `metabolic-health`      | locale subtitle/audience/compare row | `/epigenetics/musterbefund/metabolic-health`      | 10/10 PASS | ready           | entry only    |
| 02    | `healthy-aging`         | locale subtitle/audience/compare row | `/epigenetics/musterbefund/healthy-aging`         | 10/10 PASS | ready           | entry only    |
| 03    | `biologische-altersuhr` | locale subtitle/audience/compare row | `/epigenetics/musterbefund/biologische-altersuhr` | 10/10 PASS | ready           | entry only    |
| 04    | `telomer-analyse`       | locale subtitle/audience/compare row | `/epigenetics/musterbefund/telomer-analyse`       | 10/10 PASS | ready           | entry only    |
| 05    | `stress-monitor`        | locale subtitle/audience/compare row | `/epigenetics/musterbefund/stress-monitor`        | 10/10 PASS | ready           | entry only    |
| 06    | `healthy-sport`         | locale subtitle/audience/compare row | `/epigenetics/musterbefund/healthy-sport`         | 10/10 PASS | ready           | entry only    |

Fresh guards confirm the stable six-item order in all ten locales, six non-empty and distinct
locale-level subtitles per locale, complete audience entries and six complete comparison rows.
The production request matrix returns 60/60 report HTTP 200 responses without redirect. The Hub
continues to render all 6/6 cards and 6/6 real report entrances; no seventh family, `/services*`
target or AP16 route was introduced.

## 13. PT15.3 URL and Inquiry context

`src/lib/epigeneticsContext.ts` is a small allowlisted query adapter, not a route or content source:

- `panel` accepts only the six `BEFUND_ORDER` slugs.
- `focus` accepts only `longevity`, `nutrition`, `sports`, `bgm` and `practice`, matching the existing
  x10 Hub filter keys.
- Direct Hub URLs reconstruct both selection states after reload. Unknown values render neither a
  selected card nor user-controlled false context.
- Hub report links carry their canonical panel slug; report switchers retain the valid `focus`;
  report-to-Hub links return to the selected panel.
- Report-to-Inquiry links send the visible locale panel name through the existing
  `source=epigenetics` Contact contract. `ContactForm` continues to validate it against
  `panelNames.ts` before display or prefill.
- Canonical, hreflang and Sitemap URLs remain query-free. The parameters are noncanonical UI
  context on already registered routes, not new route families.

The optional local-only Merkliste remains unchanged, but no longer carries route responsibility: a
shared URL alone reconstructs the Hub state. PT15.6 still owns the Inquiry experience and AP22 still
owns persistence/CRM/retry; PT15.3 created none of those runtime claims.

## 14. PT15.3 accessibility, performance and test evidence

- Selected cards expose stable slug/selection evidence and a non-color-only border, ring and shadow
  state while retaining semantic article, heading, definition-list, link and button behavior.
- A PL mobile production smoke reports horizontal overflow <= 1 px and Axe serious/critical 0.
  Existing small Hub text roles found by the unmodified Axe run now use the established
  `text-gray-600` contrast token instead of `text-gray-500`.
- The Hub imports only report metadata and responsive cover images. Browser resource evidence shows
  none of the six slug-specific report JavaScript payloads loaded on Hub entry; navigation remains
  lazy and no PDF prefetch was added.
- Node 22 Typecheck, scoped ESLint/Prettier, G1/G3/G4/Search/Findability/Nav guards and 20 focused
  Unit/Registry/Search tests pass. Production Client/SSR build passes through Playwright.
- PT15.3-owned browser suite: 4/4 PASS without retry. PT15.1 Hub/navigation plus AP07 Findability
  regression: 7/7 PASS without retry. The task-relevant HTTP/unknown-route subset remains PASS.

AP16 report content, charts, visualization architecture, chunk redesign and deep report A11y remain
untouched and owner-bound. AP16 remains `NOT STARTED`.

## 15. PT15.4 claim and regulatory matrix

PT15.4 changed no approved product or legal wording. The existing `epigenetics` namespace remains the
content authority; the new guard validates it and the report JSON instead of copying claim text into
another SSOT.

| Context               | Current productive truth                                                                                                                                                                  | Locale coverage | Result |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ------ |
| GenDG                 | `compare.gendg`, `contact.note` and report legal blocks identify the German physician-responsibility, information/consent and counselling boundary for genetic analyses                   | 10/10           | PASS   |
| Example data          | `samples.note` and all 60 report legal blocks identify values, genotypes and personal data as fictitious examples, not real findings                                                      | 10/10 + 60/60   | PASS   |
| Diagnosis / treatment | Consultation and monitoring are separated from clinical diagnosis; no diagnosis, treatment, cure, prevention or outcome guarantee pattern is active                                       | 10/10 + 60/60   | PASS   |
| CE / IVDR             | The copy assigns no CE/IVDR status to the laboratory service; it expressly distinguishes the service from CE-marked IVD products                                                          | 10/10 + 60/60   | PASS   |
| Laboratory partner    | No external laboratory partner is named; `Kooperationspartner` remains neutral. Polaris Diagnostics Europe GmbH is identified only for distribution/support in report legal copy          | 10/10           | PASS   |
| Price                 | No currency amount or public price is present; only truthful B2B terms on request remain                                                                                                  | 10/10           | PASS   |
| Turnaround            | No report-delivery/turnaround duration is present. Follow-up measurement intervals are not represented as service turnaround                                                              | 10/10           | PASS   |
| Schema                | Hub uses visible `BreadcrumbList`/`FAQPage`, deep pages `BreadcrumbList`, sample reports `Article`/`BreadcrumbList`; no Product, Offer, MedicalTest, MedicalCondition or commercial field | 10/10 SSR       | PASS   |
| Social metadata       | OG/Twitter reuse the locale-aware visible SEO title/description and do not strengthen body claims                                                                                         | 10/10 SSR       | PASS   |

The evidence copy retains concrete, traceable references rather than invented bibliographic detail:
Fitzgerald et al. (`Aging`, 2021), Olivieri et al. (2012), Food4Me and the published `n = 539`
microRNA age model. The GenDG wording is aligned to the expressly cited §§ 7 and 10. PT15.4 does not
claim that the repository independently validates the laboratory's product evidence.

### Public document parity

- 29 unique productive download targets resolve to real files: 26 PDFs and 3 ZIP archives.
- The local ReportLab stream inspection can text-check 18/26 linked PDFs; those contain zero positive
  CE/IVDR classification, numeric price, diagnosis/treatment guarantee or Preview/dev host finding.
- Eight linked PDFs use content streams outside that narrow decoder. Their existence, productive link
  target and language disclosure are verified, but their full semantic inventory remains explicitly
  PT15.5-owned. PT15.4 makes no false claim that those eight files were fully text-extracted.

### Reproducible evidence

- `scripts/check-epigenetics-claim-contract.mjs`: 10 locales, required-text matrix 40/40, reports
  60/60, linked assets 29/29, unsubstantiated hard-claim findings 0, schema amplification findings 0;
  medical-guarantee, CE-misclassification, price and turnaround negative self-tests all PASS.
- `e2e/epigenetics-claims-regulatory.spec.ts`: production build/SSR required-text and schema matrix
  across all ten locales plus DE-mobile and CS-desktop responsive/Axe smokes, 3/3 PASS without retry;
  Axe serious/critical 0 and horizontal overflow <= 1 px.
- Node 22 Typecheck, scoped ESLint/Prettier, 25 focused Unit/Schema tests and G1/G3/G4/Search all PASS.

### Deferred owners after PT15.4

- PT15.6/AP22 owns Inquiry persistence/CRM/retry; AP19 owns general gated-resource runtime; AP23 owns
  tracking governance. None was implemented or claimed by PT15.4.
- AP16 remains owner of the deep sample-report platform and remains `NOT STARTED`.

## 16. PT15.5 resource and download inventory

The filesystem and the productive `epigenetics` locale references were measured afresh. This table
is closure evidence and an AP19 handoff, not a second operational resource SSOT: file/link identity
continues to come from the existing assets and locale structures until AP19 owns the general resource
model. Exact byte size is read by `scripts/check-epigenetics-resources.mjs`, not maintained as UI copy.
None of the files has explicit trustworthy version metadata; that absence is preserved for AP19 rather
than inferred from filenames or ZIP timestamps. The source for every row is the measured public
filesystem plus productive locale references; current UI ownership is AP15 and future general
resource metadata/gating ownership is AP19.

| Asset                                                    | Language | Type / exact size | Category             | Visibility     | Current class | Claim/link status |
| -------------------------------------------------------- | -------- | ----------------- | -------------------- | -------------- | ------------- | ----------------- |
| `de/00_Portfolio_Uebersicht_PolarisDX.pdf`               | de       | PDF · 80798 B     | INFO_SHEET           | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `de/01_Metabolic_Health_PolarisDX.pdf`                   | de       | PDF · 82637 B     | INFO_SHEET           | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `de/02_Healthy_Aging_PolarisDX.pdf`                      | de       | PDF · 75500 B     | INFO_SHEET           | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `de/03_Biologisches_Alter_PolarisDX.pdf`                 | de       | PDF · 81378 B     | INFO_SHEET           | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `de/04_Telomer_Analyse_PolarisDX.pdf`                    | de       | PDF · 74794 B     | INFO_SHEET           | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `de/05_Stress_Monitor_PolarisDX.pdf`                     | de       | PDF · 80758 B     | INFO_SHEET           | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `de/06_Healthy_Sport_PolarisDX.pdf`                      | de       | PDF · 82939 B     | INFO_SHEET           | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `de/07_Konditionen_Anfrage_PolarisDX.pdf`                | de       | PDF · 71642 B     | INFO_SHEET           | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `de/08_Evidenz_Studienlage_PolarisDX.pdf`                | de       | PDF · 81339 B     | INFO_SHEET           | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `de/10_Musterbefund_Metabolic_Health_PolarisDX.pdf`      | de       | PDF · 1018990 B   | SAMPLE_REPORT        | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `de/11_Musterbefund_Healthy_Aging_PolarisDX.pdf`         | de       | PDF · 725693 B    | SAMPLE_REPORT        | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `de/12_Musterbefund_Biologische_Altersuhr_PolarisDX.pdf` | de       | PDF · 699325 B    | SAMPLE_REPORT        | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `de/13_Musterbefund_Telomer_Analyse_PolarisDX.pdf`       | de       | PDF · 640247 B    | SAMPLE_REPORT        | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `de/14_Musterbefund_Stress_Monitor_PolarisDX.pdf`        | de       | PDF · 716851 B    | SAMPLE_REPORT        | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `de/15_Musterbefund_Healthy_Sport_PolarisDX.pdf`         | de       | PDF · 842658 B    | SAMPLE_REPORT        | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `de/16_Parameteruebersicht_PolarisDX.pdf`                | de       | PDF · 322248 B    | PARAMETER_GUIDE      | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `de/17_Werte_verstehen_PolarisDX.pdf`                    | de       | PDF · 400320 B    | VALUES_GUIDE         | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `en/00_Portfolio_Overview_PolarisDX.pdf`                 | en       | PDF · 80231 B     | INFO_SHEET           | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `en/01_Metabolic_Health_PolarisDX.pdf`                   | en       | PDF · 81560 B     | INFO_SHEET           | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `en/02_Healthy_Aging_PolarisDX.pdf`                      | en       | PDF · 74331 B     | INFO_SHEET           | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `en/03_Biological_Age_PolarisDX.pdf`                     | en       | PDF · 80636 B     | INFO_SHEET           | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `en/04_Telomere_Analysis_PolarisDX.pdf`                  | en       | PDF · 74037 B     | INFO_SHEET           | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `en/05_Stress_Monitor_PolarisDX.pdf`                     | en       | PDF · 80126 B     | INFO_SHEET           | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `en/06_Healthy_Sport_PolarisDX.pdf`                      | en       | PDF · 82076 B     | INFO_SHEET           | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `en/07_Terms_Enquiry_PolarisDX.pdf`                      | en       | PDF · 71358 B     | INFO_SHEET           | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `en/08_Evidence_Base_PolarisDX.pdf`                      | en       | PDF · 79858 B     | INFO_SHEET           | LAUNCH_VISIBLE | FREE_PUBLIC   | PDF audit PASS    |
| `PolarisDX_Musterbefunde_DE.zip`                         | de       | ZIP · 4262171 B   | SAMPLE_REPORT_BUNDLE | LAUNCH_VISIBLE | FREE_PUBLIC   | 8/8 members match |
| `PolarisDX_Unterlagen_DE.zip`                            | de       | ZIP · 603986 B    | INFO_SHEET_BUNDLE    | LAUNCH_VISIBLE | FREE_PUBLIC   | 9/9 members match |
| `PolarisDX_Unterlagen_EN.zip`                            | en       | ZIP · 595985 B    | INFO_SHEET_BUNDLE    | LAUNCH_VISIBLE | FREE_PUBLIC   | 9/9 members match |

### Language, access and runtime truth

- Complete inventory: 29/29 launch-visible assets, comprising 26 PDFs and three ZIP bundles; 19 are
  actually German and 10 actually English. Broken visible links and empty files are 0.
- Web UI remains x10 while assets remain DE/EN. DE selects the real DE information sheets; EN and the
  other eight locales select the real EN sheets; all sample reports, supplementary guides and their
  bundle are visibly disclosed as German. Fake PDF locale parity is 0.
- Every current file is directly reachable below `/downloads/epigenetics/`; therefore every current
  class is exactly `FREE_PUBLIC`. `GATED_EXISTING_RUNTIME`, current `GATED_FUTURE_AP19` and
  `NOT_LAUNCH_VISIBLE` are all 0. The Unterlagen page displays the existing x10 `downloads.chip_free`
  disclosure and marks its direct download targets `FREE_PUBLIC`.
- No PDF/ZIP is imported into JavaScript or prefetched. A fresh browser session loads no document
  before user action. A real download click emits zero Google/Analytics provider requests before
  consent; no tracking implementation was added or changed.
- The PT15.4 ReportLab inspection now supports both used stream encodings. It text-checks 26/26 PDFs;
  unsubstantiated hard claims, schema amplification, unapproved organization findings and Preview/dev
  hosts remain 0. This is a repository content sweep, not independent scientific validation.

### AP19 handoff

The information-sheet bundles, sample-report bundle and the two German supplementary guides are real
lead-magnet candidates for professional users. Their current safe state remains `FREE_PUBLIC`.
Desired future class `GATED_FUTURE_AP19` is only a candidate: AP19 must assign stable resource IDs,
version metadata, localized gate copy, entitlement and protected delivery before any file can be
called gated. Direct `/downloads/` URLs are not protection. AP15 added no form, token, email delivery,
CRM, persistence, retry, entitlement or Resource Center platform.

### Reproducible PT15.5 evidence

- `npm run check:epigenetics-resources`: 29 assets, 29 visible, 26 PDFs, three ZIPs, 0 broken links,
  DE 19 / EN 10, 10/10 locale disclosure, 3/3 bundle parity and exactly 29 `FREE_PUBLIC` classes.
- `node scripts/check-epigenetics-claim-contract.mjs`: 26/26 PDF text inspection and hard findings 0.
- Production browser evidence: PT15.5 5/5 without retry; adjacent deep-page/claim suites 12/12 in the
  same final build. DE/EN/CS responsive/Axe serious-critical findings 0; eager document requests and
  pre-consent provider requests 0.
- Typecheck, scoped ESLint/Prettier, G1 Registry, G3 SEO, G4 i18n, Search and the existing asset guard
  pass. Production Client/SSR build passes through the Playwright server.

PT15.6 remains the next serial task and must apply the AP22 dependency gate. AP16 remains
`NOT STARTED`.

## 17. PT15.6 Lead/CRM capability gate — historical BLOCKED_DEPENDENCY

PT15.6 performed read-only capability discovery before changing any productive form or backend code.
At that point the repository could not satisfy the mandatory persistence/retry/audit/CRM acceptance
contract, so PT15.6 correctly returned `BLOCKED_DEPENDENCY`, owner **AP22 Lead Platform**. This section
preserves the measured pre-recovery state; §18 records the subsequent minimal shared recovery.

### Current capability matrix

| Capability                                    | Current result | Code/data/test/runtime evidence                                                                                                                                                                                 |
| --------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A. Persistent lead storage                    | **MISSING**    | `server/package.json` has six runtime dependencies and no database/ORM/storage dependency; no persistent lead model or filesystem write path exists. `LEAD-DATA-CONTRACT.md` §3 records the same current state. |
| B. Persist before external handoff            | **MISSING**    | `server/server.js` `/api/contact` constructs a mail and awaits `sgMail.send(msg)` directly; no lead is stored before the provider call.                                                                         |
| C. Retry-capable handoff/outbox/queue         | **MISSING**    | No queue/outbox/worker dependency or runtime path exists. Provider failure returns `DELIVERY_FAILED`; there is no durable retry or dead-letter path.                                                            |
| D. Audit/status model                         | **MISSING**    | No lead ID, correlation ID, persisted state machine, attempt record or audit table/model exists.                                                                                                                |
| E. Idempotency                                | **MISSING**    | No server-side idempotency key, request identity store or replay response exists. Client loading/disabled-button behavior is not durable idempotency.                                                           |
| F. CRM adapter/routing                        | **MISSING**    | SendGrid is the only external provider in the backend. There is no CRM port, adapter, mapping, provider library or integration test.                                                                            |
| G. Dedicated journey type                     | **MISSING**    | No runtime identifier equivalent to `epigenetics_inquiry` exists. The final identifier is explicitly AP22-owned by `LEAD-DATA-CONTRACT.md`.                                                                     |
| H. Source/campaign/panel/language persistence | **MISSING**    | The current contact mail can carry allowlisted source/journey/section and locale, but stores none of them; campaign and structured panel/focus fields are not modeled as durable lead data.                     |
| I. Failure/recovery without silent lead loss  | **MISSING**    | A SendGrid exception produces HTTP 500 after no persistence; endpoint tests cover neither provider failure nor recovery. There is no retry-success or replay path.                                              |

The measured backend exposes five mail/PDF-oriented `POST /api/*` routes. `server/server.test.js`
tests escaping and Homepage attribution helpers only; endpoint integration, persistence failure,
provider retry, idempotency and CRM routing tests are absent. `DRY_RUN` suppresses email only and is
not evidence of a queue, CRM adapter or recovery mechanism.

### UI/schema discovery readiness

- PT15.3 already provides allowlisted, bookmarkable `panel`/`focus` URL context for the six panels.
- The existing x10 Contact UI provides reusable accessible form, validation, loading, success and
  error patterns, but it is not a dedicated Epigenetics Inquiry and is not a persistent journey.
- The existing API payload can transport locale and limited attribution into one email. It must not
  be described as CRM-bound, retry-capable, audited or durable.
- No dedicated form, new journey identifier, qualification field, tracking event or backend endpoint
  was added because doing so before AP22 would create a competing lead-contract truth.

### Minimum AP22 interfaces required before PT15.6 can resume

1. A canonical journey-type registry/API contract with an AP22-chosen identifier for the dedicated
   Epigenetics inquiry and validated journey-specific fields.
2. Durable lead persistence returning a stable lead/request identity before any external handoff,
   including consent evidence and source, campaign, panel/focus and language fields.
3. Server-side idempotency covering repeated submits and retries.
4. A transactional outbox or equivalent durable delivery job with attempt state, retry/backoff,
   terminal/dead-letter handling and safe replay.
5. A provider-neutral CRM adapter and AP22-owned routing/mapping for the Epigenetics journey; preview
   and test operation must not create productive CRM side effects.
6. Persisted audit/status evidence and PII-safe logging for received, persisted, pending/queued,
   attempt, success, retryable failure and terminal failure states using AP22's final vocabulary.
7. Integration tests for validation, persistence failure, temporary provider failure, retry success,
   repeated/idempotent submit, malformed panel context, missing consent and analytics-denied business
   processing.

At discovery time the safe runtime remained the existing general Contact path without a claim of
dedicated persistence or CRM delivery. No mail-only, in-memory, filesystem or Epigenetics-specific
persistence substitute was built by PT15.6.

## 18. Early Shared Foundation implemented during AP15 unblock

`AP15-LEAD-FOUNDATION-UNBLOCK` implements the minimum reusable, journey-neutral foundation required
to rerun PT15.6. It is an early shared infrastructure slice, not AP22 completion and not an
Epigenetics Inquiry implementation. Existing Contact, Support, Consumer and Lead-Magnet journeys are
not migrated by this recovery.

### Implemented early

| Capability                 | Implemented truth                                                                                                                                                                           | Primary evidence                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Durable Lead Store         | SQLite file store through `better-sqlite3`; production requires `LEAD_DB_PATH`; root and backend Compose mount named volume `lead-data` at `/var/lib/polarisdx`                             | `server/lead-foundation/database.js`, migration `001_shared_lead_foundation.sql`, Compose configuration |
| Journey Model              | Shared allowlisted journey mechanism supports `contact`, `support`, `consumer_order`, `content_download` and `epigenetics_inquiry` without journey-specific storage classes                 | `constants.js`                                                                                          |
| Lead Status                | `RECEIVED`, `PERSISTED`, `PENDING_HANDOFF`, `PROCESSING`, `DELIVERED`, `RETRY_PENDING`, `FAILED_TERMINAL` with persistent event history                                                     | migration, `repository.js`                                                                              |
| Persist-before-Handoff     | Lead, consent/context, events and outbox are committed in one immediate transaction before a worker can claim provider work                                                                 | `LeadRepository.createLead`, integration test                                                           |
| Outbox/Retry               | Durable `lead_outbox` records channel, attempts, availability, claim lease, last attempt and error class; known transient failures schedule a bounded retry                                 | migration, repository/worker tests                                                                      |
| Terminal/dead-letter state | Exhausted, non-retryable, unconfigured-provider and unknown-result failures remain `FAILED_TERMINAL` with reason, attempts and timestamp; nothing is silently deleted                       | repository/worker tests                                                                                 |
| Idempotency                | Durable unique `idempotency_key` plus canonical request hash; identical replay returns one logical lead, conflicting replay fails                                                           | schema unique constraint, `IdempotencyConflictError` tests                                              |
| Audit/Attempt state        | Append-only lead events plus current lead/outbox status, timestamps, attempts and last error class                                                                                          | `lead_events`, repository tests                                                                         |
| Consent Evidence           | Processing state, accepted-at timestamp, policy/version identifier and separate marketing state are validated and persisted                                                                 | `normalizeConsent`, reopen test                                                                         |
| Context Persistence        | Locale, source, campaign, panel, focus and origin route are normalized and persisted as structured journey context, not mail text                                                           | `normalizeContext`, reopen/routing tests                                                                |
| CRM Adapter Boundary       | Exported `CrmAdapter`, `CrmRouter` and explicit `NoProviderConfiguredCrmAdapter`; missing provider becomes terminal `NO_PROVIDER_CONFIGURED`, never success                                 | `crm.js`, worker tests                                                                                  |
| Provider Routing           | Every shared journey has a central target; the worker passes normalized lead/context and a stable outbox delivery key to the selected adapter                                               | `DEFAULT_JOURNEY_ROUTES`, routing test                                                                  |
| Mail Decoupling            | `MAIL` is a separate durable outbox channel processed only after lead persistence; shared worker behavior is proven without migrating legacy endpoints                                      | two-channel outbox test                                                                                 |
| Race/Replay Safety         | SQLite immediate transactions, unique constraints, atomic claims, worker/attempt ownership checks and stable delivery keys prevent duplicate lead creation and stale-worker state overwrite | race, stale-claim and replay tests                                                                      |
| Logging/Privacy            | Worker logs contain lead ID, journey, status, attempt, target and error class only; contact payload, consent text and secrets are absent                                                    | logger privacy test                                                                                     |

Unknown external results such as an unclassified provider timeout are not automatically replayed;
they become terminal `PROVIDER_RESULT_UNKNOWN` for later AP22 reconciliation. Explicitly classified
transient failures remain retryable. A real provider adapter must use the stable `deliveryKey` as its
external idempotency/upsert identity.

### Runtime and validation evidence

- Migration command: `npm --prefix server run migrate:leads`; applying it twice leaves exactly one
  recorded migration. Production without `LEAD_DB_PATH` fails closed.
- Root command: `npm run check:lead-foundation`; 13/13 persistence, retry, terminal, idempotency,
  race/replay, adapter, consent, context and logging tests PASS against real temporary SQLite files.
- Relevant existing backend tests: 50/50 PASS plus the isolated Node-environment i18n suite 12/12.
- Node syntax checks and scoped ESLint PASS; root Typecheck PASS.
- Both Compose files validate. The Node 20 backend image builds successfully with the native SQLite
  dependency and executes the migration. `server/.dockerignore` excludes host `node_modules`, `.env`
  and lead database files from the image, preventing native-ABI overwrite and secret/runtime-data
  inclusion. npm audit reports the existing Express/SendGrid dependency-chain findings and no finding
  through `better-sqlite3`; critical findings are 0.

### AP22 boundary retained

AP22 remains `NOT STARTED` and is still the canonical owner of the complete Lead Platform. AP22 must
extend and reverify this shared foundation rather than build a parallel one. The following work
remains AP22-owned:

- migration and normalization of all existing Contact, Support, Consumer and Content journeys;
- final provider selection/configuration, production adapter hardening and cross-journey CRM mapping;
- operational dashboard, dead-letter/replay UI, reconciliation and reporting;
- retention/deletion automation, monitoring/alerting, backup/restore and operations hardening;
- complete cross-journey endpoint, security, rate-limit and integration-test migration.

At the recovery handoff, PT15.6 was released to add only its dedicated Inquiry journey/UI/API
composition on this shared foundation, with `NO_PROVIDER_CONFIGURED` explicitly forbidden from being
reported as delivered. Section 19 records the completed rerun and current serial state.

## 19. PT15.6 Epigenetics Inquiry vertical slice

PT15.6 reuses the shared Lead Foundation without changing its schema, repository, outbox, worker or
CRM routing core. The former Epigenetics-to-Contact mail path is replaced at all Hub, deep-page,
sample-report and saved-panel entry points by the dedicated Hub anchor `#inquiry`. The URL carries
only allowlisted canonical `panel`/`focus` values plus optional campaign context.

### Journey and persisted contract

| Field/capability     | Current truth                                                                                                                                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Journey              | Exactly `epigenetics_inquiry`; central `CrmRouter` target `epigenetics`                                                                                                                                         |
| Contact identity     | Name, normalized email, organization and facility type are server-validated and persisted in the lead subject                                                                                                   |
| Qualification        | Optional cases/month range and message; UI expressly prohibits health data/report submission                                                                                                                    |
| Context              | Locale, fixed source `epigenetics`, campaign, allowlisted panel/focus and origin route persist structurally                                                                                                     |
| Consent              | Processing consent is required with timestamp and policy version `epigenetics-inquiry-2026-09`; marketing remains separately persisted as `DENIED` because this flow solicits no marketing opt-in               |
| Persistence/order    | `LeadRepository.createLead` commits lead, consent/context, audit events and durable CRM outbox before `LeadHandoffWorker` can resolve an adapter                                                                |
| Idempotency          | The UI supplies one stable `Idempotency-Key` per logical submission; durable uniqueness/hash protects double click, browser/API replay and worker replay                                                        |
| CRM/provider truth   | The real shared adapter/router path is used. With no configured CRM provider, the lead remains durably `FAILED_TERMINAL / NO_PROVIDER_CONFIGURED`; UI says stored/manual follow-up and never claims CRM success |
| Retry/unknown result | Classified transient failure remains `RETRY_PENDING` and later updates the same lead to `DELIVERED`; an unknown provider result remains terminal and is not blindly replayed                                    |
| Mail                 | No synchronous SendGrid call and no mail-only source of truth exist in the dedicated endpoint; optional mail remains a later durable side effect                                                                |
| Analytics            | Business submission does not depend on analytics consent and emits no analytics/marketing provider request before consent                                                                                       |

### x10 and UI truth

The dedicated form is productive in `de,en,pl,fr,it,es,pt,da,nl,cs`. Labels, qualification choices,
validation, loading and durable-state messages are localized in the existing `epigenetics`
namespace. The previously approved x10 Contact processing-consent wording is reused rather than
inventing new legal translations. Panel/focus direct URLs reconstruct selection; foreign panel,
focus, facility, volume or locale values fail server validation.

### Reproducible PT15.6 evidence

- `npx vitest run server/epigenetics-inquiry.test.js server/epigenetics-inquiry.endpoint.test.js
src/lib/epigeneticsContext.test.ts`: 12/12 PASS against real temporary SQLite files and a real
  HTTP listener. Covers validation, required consent, persist-before-handoff, context/consent,
  central CRM routing, no-provider truth, transient retry/success, unknown-result terminal state,
  duplicate/API/worker replay and all ten locales without analytics/marketing consent.
- `npx playwright test --config=e2e/pt15.6.config.ts`: 2/2 PASS against the Node-20 dev runtime;
  x10 form copy/controls, canonical panel/focus/campaign payload, Idempotency header, no-consent
  business submission, provider-unavailable UI truth, pre-consent Google-provider requests 0 and
  Axe serious/critical 0 in `#inquiry`.
- Root Typecheck, scoped ESLint and scoped Prettier PASS. No full build was run because PT15.6 changed
  no SSR/build infrastructure; the broad production build remains PT15.7-owned.

AP22 remains `NOT STARTED`. Cross-journey migration, production CRM provider configuration,
operational retry/dead-letter tooling, reconciliation and platform hardening remain AP22-owned.
At the PT15.6 handoff, PT15.7 was the next serial task; AP16 remained `NOT STARTED`.

## 20. PT15.7 x10 integration and production Golden Path

PT15.7 measured the final primary-task state as one production system. The explicit matrix covers
ten canonical Epigenetics families — Hub, three deepening pages and six sample-report entrances —
in every project locale. All **100/100** cases return HTTP 200 without redirect, render the URL
locale, emit one self-canonical, ten locale alternates plus `x-default=de`, remain indexable and are
members of the public sitemap. Unknown deep paths remain real 404 responses. Search resolves the
locale-aware canonical Hub target and the existing Header, Footer, Homepage, deep-page and report
crosslinks remain registry-valid without `/services*` targets.

The production Golden Path runs through Homepage/Header → Hub → `healthy-aging` panel → sample
report → dedicated Inquiry. It uses the real SSR application, the real `/api/epigenetics-inquiry`
endpoint, the shared SQLite Lead Repository, durable outbox and audit model, and the central
`CrmRouter`. A test-only local HTTP CRM receiver proves the external adapter boundary without a
browser route mock: exactly one `epigenetics_inquiry` lead reaches `DELIVERED`, with persisted
locale/source/panel/origin-route and processing-consent evidence, one handoff attempt and one
external delivery. Analytics/marketing provider requests before consent remain zero. Product
runtime and the AP22-owned provider/platform scope are unchanged.

### Fresh integration evidence

- `npx playwright test --config=e2e/pt15.7.config.ts`: **34/34 PASS** without retry on fresh
  production SSR/backend processes. This includes all predecessor AP15 page suites, x10 Inquiry,
  Search, internal findability, the real persistent Golden Path, representative Axe checks and five
  saved visual smokes (390/768/1024/1440 px, including long Czech/Polish/French copy).
- The explicit matrix is **100/100 PASS** for HTTP, canonical, hreflang and sitemap: 10 Hub, 30 deep
  and 60 report cases. Claim guard remains 40/40 required texts and 60/60 report notices with hard
  claim findings 0. Resource guard remains 29/29 assets, broken links 0, disclosure 10/10 and eager
  document loads 0.
- G1 Registry (25 families, 0 mirrors), G3 SEO (390 artifact URLs), G4 i18n (15 namespaces ×10),
  Search (35 targets including 6/6 reports), internal findability, navigation targets, Claim and
  Resource guards all PASS. Relevant Unit/Integration tests are PASS; Typecheck, scoped ESLint and
  scoped Prettier are PASS.
- Production client + SSR build and Visual Gallery are PASS. Epigenetics report payloads remain
  separate lazy chunks and resource PDFs/ZIPs are not prefetched.

PT15.7 reproduced the repository-wide cold-render debt on the unrelated `/de/articles` URL when the
optional 390-URL browser sitemap suite was run against a cold process. This is the documented
`RUNTIME-CONTRACT.md` `RD-11` baseline, owner AP25/AP27, and is not worsened by PT15.7. The existing
bounded render retry receives a longer budget only for `/${locale}/epigenetics*`; the final AP15
cold-process suite and explicit 100-case matrix pass. No AP16/AP19/AP22/AP23 implementation was
pulled forward. This PT15.7 handoff was superseded by the independent Closure evidence below.

## 21. AP15 Closure — independent package reverification

AP15 Closure independently remeasured the final staged repository and fresh production-like
runtime on 2026-09-01. It did not infer PASS from the seven primary-task handoffs.

- Start gate: AP14 Closure PASS; PT15.1–PT15.7 PASS; Decision Locks 18/18; AP16 and AP22 NOT STARTED.
- G1/G3/G4, Search, internal findability and navigation guards PASS: 25 Registry families, 43
  canonical paths, 390 SEO URLs, 15 namespaces ×10, six reports ×10, 35 Search targets and zero
  stale route mirrors or canonical `/services*` targets.
- The fresh browser matrix is 34/34 PASS after a Closure-owned test synchronization fix waits for
  settled hydration before operating the mobile navigation. The explicit production matrix is
  100/100 (Hub 10, three deep families 30, six report entrances 60), including HTTP, locale body,
  self-canonical, hreflang ×10, `x-default=de`, Sitemap and real unknown-route 404 behavior.
- The production Golden Path reaches exactly one persisted `epigenetics_inquiry`, durable outbox and
  audit state, central CRM routing and one HTTP adapter delivery. Fresh Foundation 13/13 and Inquiry
  12/12 tests independently cover persist-before-handoff, transient retry, terminal unknown result,
  durable idempotency/replay, consent/context persistence and PII-safe logging.
- Claim/regulatory guard: required texts 40/40, report notices 60/60, linked assets 29/29 and hard
  findings 0. Resource guard: 29 visible files (26 PDF, three ZIP; DE 19, EN 10), broken links 0,
  truthful locale disclosure 10/10, all currently `FREE_PUBLIC`, eager document loads 0.
- Consent network: Fresh 0 provider requests, explicit Denied 0, Granted exactly one Google
  bootstrap without duplicate initialization (3/3 PASS). Inquiry processing remains independent of
  Analytics consent.
- Representative AP15 Axe serious/critical findings are 0; mobile/tablet/desktop/wide and long-locale
  visual/overflow smokes PASS. Typecheck, scoped ESLint/Prettier, focused Unit tests, production
  client/SSR build and Visual Gallery PASS.
- EPI-01–EPI-40 and C15-01–C15-50 PASS; R15-01–R15-12 are mitigated; false-ready findings and
  AP15-owned critical blockers are 0. No AP16/AP19/AP22/AP23 platform scope was duplicated.

AP22 remains the later owner of cross-journey migration, production-provider hardening,
reconciliation, operations UI, retention and monitoring. AP16 remains `NOT STARTED`.
