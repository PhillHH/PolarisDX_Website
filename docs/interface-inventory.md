# Interface Inventory — Phase 0 Baseline

> Erfasst alle einzigartigen UI-Patterns der App (Vite + Express-SSR, react-router-dom 7, Tailwind),
> gruppiert nach **16 Kategorien**. Duplikate stehen sichtbar nebeneinander und sind mit ⚠️ markiert.
> Stand: **2026-06-24** (Phase 0). Quelle: statischer Code-Scan `src/**`.
> Folge-Konsolidierung: siehe `docs/REFACTOR_BACKLOG.md` (KEEP/MERGE/DROP) und
> `docs/design-system/PATTERNS.md` (Naming-Map).

Legende: ✅ bereits im `design-system/` kanonisiert · 🟡 Legacy in `src/components/*` · ⚠️ Duplikat-Kandidat.

---

## 1. Navigation

- `components/layout/Header.tsx` 🟡 — B2B-Hauptnavigation (Desktop-Nav, Mobile-Menü, Sprachschalter, Such-Trigger).
- `components/ui/LanguageSwitcher.tsx` 🟡 — Locale-Dropdown (10 Sprachen, URL-Prefix `/<lang>/`).
- `compound/breadcrumbs.tsx` ✅ — verlinkter Breadcrumb-Pfad.
- `compound/nav-tile.tsx` ✅ — Icon+Label-Navigationskachel.
- `pages/consumer/shell.tsx` (ConsumerHeader) 🟡 ⚠️ — eigenständige Consumer-Navigation (Tabu-Bereich, bleibt isoliert).

## 2. Buttons & Aktionen

- `core/button.tsx` ✅ — kanonisches Atom, Varianten primary/secondary/outline, Größen default/sm/lg/icon, polymorph (`as`/`to`/`href`).
- `components/ui/MobileCallButton.tsx` 🟡 — Floating `tel:`-Button.
- `pages/consumer/shell.tsx` (CTA) 🟡 ⚠️ — Consumer-CTA-Button (eigener Stil, Tabu).

## 3. Formulare & Eingaben

- `core/input.tsx` ✅ · `core/textarea.tsx` ✅ · `core/select.tsx` ✅ — Eingabe-Atome.
- `compound/form-field.tsx` ✅ — Label+Input/Select-Molecule (a11y-verknüpft).
- `components/sections/ContactForm.tsx` 🟡 ⚠️ — Kontaktformular (nutzt FormField).
- `components/sections/SupportForm.tsx` 🟡 ⚠️ — Supportformular (Struktur ~identisch zu ContactForm → MERGE-Kandidat).
- `pages/consumer/OrderForm.tsx` 🟡 — Bestellformular (Tabu-Bereich Checkout).

## 4. Cards & Kacheln

- `compound/card.tsx` ✅ — kanonische Surface-Card, polymorph, interaktiv.
- `compound/panel.tsx` ✅ ⚠️ — bordered/elevated Container (Überschneidung mit Card → prüfen).
- `components/ui/BlogCard.tsx` 🟡 ⚠️ — Artikel-Vorschau (nutzt Card-Basis).
- `components/ui/ServiceCard.tsx` 🟡 ⚠️ — Service-Kachel (nutzt Card-Basis; Slot-Layout abweichend → konsolidieren via Props).
- `compound/media-link.tsx` ✅ — Bild+Link-Vorschau.
- `compound/info-item.tsx` ✅ — Icon+Heading+Text-Infoblock.

## 5. Typografie & Text

- `core/eyebrow.tsx` ✅ — kleines Kicker-Label.
- `compound/section-header.tsx` ✅ — Eyebrow+H2-Block.
- Heading-/Body-Stufen: über Tokens (`--font-size-100…900`), kein dediziertes Heading-Atom (Tailwind-Utilities in Pages).

## 6. Medien & Bilder

- `<img>`-Direktnutzung in Pages/Sections (kein Wrapper-Atom; teils `loading="lazy"`, ohne `srcset`/`width`/`height` → Phase 5).
- `assets/articleImages.ts` — SSR-sicheres Bild-URL-Mapping.
- `compound/media-link.tsx` ✅ — Bild im Link-Kontext.

## 7. Feedback & Status

- `feedback/alert.tsx` ✅ — Status/Erfolg/Fehler (role-basiert).
- `feedback/spinner.tsx` ✅ — Ladeindikator (sm/md/lg).
- `feedback/empty-state.tsx` ✅ — Leerzustand (Text + CTA).
- **not-found:** `pages/NotFoundPage.tsx` 🟡 (Catch-all `path="*"`).
- **error:** ⚠️ **fehlt** — kein RR7 `errorElement`/`useRouteError` (Phase 5 Pflicht).
- **loading (Route):** `App.tsx` nutzt `<Suspense fallback={null}>` (kein Skeleton → Phase 5/6).
- **success:** Inline-/Toast-Rückmeldung in ContactForm/SupportForm (submitStatus).

## 8. Overlays (Modal/Dialog/Popover)

- `components/ui/SearchModal.tsx` 🟡 — Vollbild-Suchoverlay (Input + Ergebnisse, useSearch).
- `pages/consumer/OrderModal.tsx` 🟡 — Bestell-Modal + Context (Tabu-Bereich).
- `pages/consumer/PriceBadge.tsx` 🟡 — Popover-Preisanzeige (Tabu).
- ⚠️ Kein generisches `Dialog`/`Popover`-Molecule im design-system (Industriestandard-Name fehlt → Phase 2).

## 9. Data Display

- `core/stat.tsx` ✅ — Kennzahl + Label.
- `core/badge.tsx` ✅ — Label-Badge (default/primary/secondary/outline).
- `compound/author-byline.tsx` ✅ — Autor + Metadaten.
- Keine Tabellen-Komponente (kein Tabellen-Pattern im UI).

## 10. Sektionen / Layout-Blöcke (Organisms)

- `components/sections/`: HeroSection, AboutSection, DoctorsSection, IglooWidgetSection, FeaturedCaseStudy (deaktiviert), TestimonialsSection, BlogSection, FAQSection, ServicesSection, CtaSection, TeamSection 🟡 ⚠️
  - ⚠️ DoctorsSection vs. TeamSection (Team-Grid-Duplikat → MERGE prüfen).
  - ⚠️ Uneinheitlicher Section-Wrapper (`<section>` vs. `<div>`, kein gemeinsames Container/Padding → Phase 4 `Section`-Primitive).
- **offen:** `design-system/sections/` (kanonische Organisms) existiert noch nicht (Phase 2).

## 11. Disclosure (Accordion/Tabs)

- `compound/accordion.tsx` ✅ — aufklappbare Items (controlled/uncontrolled).
- Keine Tabs-Komponente (kein Tab-Pattern vorhanden — explizit „keine").

## 12. Hero / CTA

- `components/sections/HeroSection.tsx` 🟡 — Homepage-Hero mit Slide-Carousel (SSR-sicher).
- `components/sections/CtaSection.tsx` 🟡 — generischer CTA-Block.
- `compound/contact-callout.tsx` ✅ — Kontakt-CTA-Block (E-Mail/Telefon).

## 13. Routing-States (404 / error / loading)

- **404:** `pages/NotFoundPage.tsx` 🟡 via `path="*"`.
- **error:** ⚠️ **fehlt komplett** — kein `errorElement`, kein `RootErrorBoundary`/`SegmentErrorBoundary` (Phase 5).
- **loading:** `<Suspense fallback={null}>` (kein Skeleton-Fallback → Phase 5/6).
- **redirects:** `/services → /diagnostics`, `/services/:slug → /diagnostics/:slug` (301, beibehalten).

## 14. Legal & FAQ

- `pages/PrivacyPage.tsx`, `pages/TermsPage.tsx`, `pages/ImprintPage.tsx` 🟡 — statische Rechtsseiten.
- `components/sections/FAQSection.tsx` 🟡 — FAQ-Accordion (nutzt accordion-Pattern; FAQ-Schema via SEOHead).

## 15. Icons & Dekoration

- `components/ui/FlagIcon.tsx` 🟡 ⚠️ — Flaggen-SVG (enthält Roh-Hex → Token/Asset-Migration Phase 3).
- `components/ui/icons/Tooth.tsx` 🟡 — Custom-SVG-Icon.
- `lucide-react` — Icon-Bibliothek (Standardquelle für UI-Icons).

## 16. Consumer-spezifische Patterns (Tabu — bleibt isoliert, §5)

- `pages/consumer/shell.tsx` 🟡 — ConsumerHeader, Hero, CTA, Section, Card, Pills, Steps (proprietäre Light/Teal-Variante).
- `pages/consumer/{OrderForm,OrderModal,PriceBadge}.tsx`, `tracking.ts` 🟡 — Checkout/Tracking (PROJECT-DECISIONS §5 Tabu — **nicht refactoren**).

---

## Duplikat-Übersicht (Konsolidierungs-Eingang für Phase 2)

| Cluster         | Dateien                                | Maßnahme                                                      |
| --------------- | -------------------------------------- | ------------------------------------------------------------- |
| Card-Layouts    | BlogCard, ServiceCard, (Panel)         | MERGE → `Card` mit Slot-/Variant-Props                        |
| Forms           | ContactForm, SupportForm               | MERGE → gemeinsamer Form-Container                            |
| Team-Grids      | DoctorsSection, TeamSection            | MERGE prüfen → ein Organism                                   |
| Section-Wrapper | alle `sections/*` + consumer `Section` | Phase 4 `Section`/`Container`-Primitive                       |
| Modal/Popover   | SearchModal, OrderModal, PriceBadge    | Phase 2 generisches `Dialog`/`Popover` (consumer bleibt Tabu) |

## Abdeckung der 16 Kategorien

Alle 16 Kategorien adressiert; **leer = explizit „keine"**: Tabs (Kat. 11), Tabellen (Kat. 9).
not-found/error/loading-States: not-found ✅, loading 🟡 (kein Skeleton), **error ⚠️ fehlt** → Phase 5.
