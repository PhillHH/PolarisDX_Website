# Pattern Library — Komponenten-Inventar & Naming-Map (Phase 0)

> Vollständiges Komponenten-Inventar mit künftiger Atomic-Ebene, Duplikat-Bezug und
> alt→agnostischem Zielnamen. Quelle der Konsolidierung für Phase 2. Stand **2026-06-24**.
> Begleitdokumente: `docs/interface-inventory.md`, `docs/REFACTOR_BACKLOG.md`,
> später `docs/design-system/lineage.md` (Uses/Used-by, Phase 2).

Spalten: **Datei** · **Zweck** · **Ziel-Ebene** (atom/molecule/organism/template/page/utility) ·
**Duplikat-von?** · **alt → agnostischer Zielname**.

## design-system/ (bereits kanonisch ✅)

### core/ — Atome

| Datei             | Zweck                     | Ebene | Dup? | Name            |
| ----------------- | ------------------------- | ----- | ---- | --------------- |
| core/button.tsx   | Aktions-Button, polymorph | atom  | —    | `Button` (ok)   |
| core/input.tsx    | Texteingabe               | atom  | —    | `Input` (ok)    |
| core/textarea.tsx | Mehrzeilige Eingabe       | atom  | —    | `Textarea` (ok) |
| core/select.tsx   | Native Auswahl            | atom  | —    | `Select` (ok)   |
| core/eyebrow.tsx  | Kicker-Label              | atom  | —    | `Eyebrow` (ok)  |
| core/badge.tsx    | Label-Badge               | atom  | —    | `Badge` (ok)    |
| core/stat.tsx     | Kennzahl + Label          | atom  | —    | `Stat` (ok)     |

### primitives-layout/ — Layout-Atome

| Datei                           | Zweck              | Ebene | Dup? | Name                |
| ------------------------------- | ------------------ | ----- | ---- | ------------------- |
| primitives-layout/container.tsx | Max-Width-Wrapper  | atom  | —    | `Container` (ok)    |
| _(fehlt)_                       | Vertikal-Stack     | atom  | —    | `Stack` → Phase 4   |
| _(fehlt)_                       | Horizontale Gruppe | atom  | —    | `Cluster` → Phase 4 |
| _(fehlt)_                       | 12-Spalten-Grid    | atom  | —    | `Grid` → Phase 4    |

### compound/ — Molecules

| Datei                        | Zweck                       | Ebene    | Dup?      | Name                         |
| ---------------------------- | --------------------------- | -------- | --------- | ---------------------------- |
| compound/card.tsx            | Surface-Card, polymorph     | molecule | kanonisch | `Card` (ok)                  |
| compound/panel.tsx           | Bordered/Elevated-Container | molecule | ⚠️ Card   | `Panel` → ggf. Card-Variante |
| compound/form-field.tsx      | Label+Input                 | molecule | —         | `FormField` (ok)             |
| compound/section-header.tsx  | Eyebrow+H2                  | molecule | —         | `SectionHeader` (ok)         |
| compound/breadcrumbs.tsx     | Breadcrumb-Pfad             | molecule | —         | `Breadcrumbs` (ok)           |
| compound/accordion.tsx       | Disclosure-Items            | molecule | —         | `Accordion` (ok)             |
| compound/author-byline.tsx   | Autor-Meta                  | molecule | —         | `AuthorByline` (ok)          |
| compound/nav-tile.tsx        | Icon+Label-Link             | molecule | —         | `NavTile` (ok)               |
| compound/info-item.tsx       | Icon+Heading+Text           | molecule | —         | `InfoItem` (ok)              |
| compound/media-link.tsx      | Bild+Link                   | molecule | —         | `MediaLink` (ok)             |
| compound/contact-callout.tsx | Kontakt-CTA                 | molecule | —         | `ContactCallout` (ok)        |

### feedback/ — UI-States

| Datei                    | Zweck                 | Ebene    | Dup? | Name              |
| ------------------------ | --------------------- | -------- | ---- | ----------------- |
| feedback/alert.tsx       | Status-/Fehlermeldung | molecule | —    | `Alert` (ok)      |
| feedback/spinner.tsx     | Ladeindikator         | atom     | —    | `Spinner` (ok)    |
| feedback/empty-state.tsx | Leerzustand           | molecule | —    | `EmptyState` (ok) |

## Legacy src/components/ (zu migrieren/konsolidieren in Phase 2)

### components/ui/

| Datei                | Zweck                 | Ziel-Ebene | Dup?           | alt → Zielname                              |
| -------------------- | --------------------- | ---------- | -------------- | ------------------------------------------- |
| BlogCard.tsx         | Artikel-Vorschaukarte | molecule   | ⚠️ ServiceCard | `BlogCard` → `Card` (Variante `article`)    |
| ServiceCard.tsx      | Service-Kachel        | molecule   | ⚠️ BlogCard    | `ServiceCard` → `Card` (Variante `service`) |
| CookieBanner.tsx     | Cookie-Consent        | organism   | —              | `CookieBanner` (ok; behalten)               |
| ChatWidget.tsx       | Chat-Embed            | organism   | —              | `ChatWidget` (Tabu §5)                      |
| MobileCallButton.tsx | Floating Call         | molecule   | —              | `MobileCallButton` (ok)                     |
| SearchModal.tsx      | Such-Overlay          | organism   | —              | `SearchModal` (nutzt künftig `Dialog`)      |
| LanguageSwitcher.tsx | Locale-Dropdown       | molecule   | —              | `LanguageSwitcher` (ok)                     |
| PageTransition.tsx   | Mount-Animation       | utility    | —              | `PageTransition` (ok)                       |
| Reveal.tsx           | Scroll-Reveal         | utility    | —              | `Reveal` (ok)                               |
| FlagIcon.tsx         | Flaggen-SVG           | atom       | —              | `FlagIcon` (Roh-Hex → Phase 3)              |
| icons/Tooth.tsx      | Custom-Icon           | atom       | —              | `ToothIcon`                                 |

### components/sections/ → künftig design-system/sections/ (Organisms)

| Datei                   | Zweck                    | Ziel-Ebene | Dup?              | alt → Zielname                           |
| ----------------------- | ------------------------ | ---------- | ----------------- | ---------------------------------------- |
| HeroSection.tsx         | Homepage-Hero+Carousel   | organism   | —                 | `Hero`                                   |
| AboutSection.tsx        | Über-uns-Block           | organism   | —                 | `AboutSection`                           |
| DoctorsSection.tsx      | Team/Ärzte-Grid          | organism   | ⚠️ TeamSection    | `DoctorsSection` → `TeamSection` (merge) |
| TeamSection.tsx         | Team-Grid                | organism   | ⚠️ DoctorsSection | `TeamSection` (kanonisch)                |
| IglooWidgetSection.tsx  | Produkt-Widget           | organism   | —                 | `IglooWidgetSection` (Roh-Hex → Phase 3) |
| FeaturedCaseStudy.tsx   | Case-Study (deaktiviert) | organism   | —                 | DROP-Kandidat (Graveyard prüfen)         |
| TestimonialsSection.tsx | Testimonials-Carousel    | organism   | —                 | `TestimonialsSection`                    |
| BlogSection.tsx         | Featured + Blog-Grid     | organism   | —                 | `BlogSection`                            |
| FAQSection.tsx          | FAQ-Accordion            | organism   | —                 | `FaqSection`                             |
| ServicesSection.tsx     | Service-Grid             | organism   | —                 | `ServicesSection`                        |
| ContactForm.tsx         | Kontaktformular          | organism   | ⚠️ SupportForm    | `ContactForm` → gemeinsamer Form-Core    |
| SupportForm.tsx         | Supportformular          | organism   | ⚠️ ContactForm    | `SupportForm` → gemeinsamer Form-Core    |
| CtaSection.tsx          | CTA-Block                | organism   | —                 | `CtaSection`                             |

### components/layout/

| Datei           | Zweck       | Ziel-Ebene | alt → Zielname                            |
| --------------- | ----------- | ---------- | ----------------------------------------- |
| Header.tsx      | B2B-Header  | organism   | `Header` (Roh-`font-light` → Phase 3)     |
| Footer.tsx      | Footer      | organism   | `Footer`                                  |
| Layout.tsx      | App-Shell   | template   | `MainLayout` → `src/templates/` (Phase 2) |
| ScrollToTop.tsx | Scroll-Util | utility    | `ScrollToTop`                             |

### components/analytics/ + seo/

| Datei                     | Zweck           | Ebene   |
| ------------------------- | --------------- | ------- |
| analytics/GtmPageview.tsx | GA4 page_view   | utility |
| seo/SEOHead.tsx           | Helmet-Meta     | utility |
| seo/structuredData.ts     | JSON-LD-Builder | utility |

### pages/consumer/ (Tabu §5 — nicht refactoren, nur dokumentiert)

shell.tsx, OrderForm.tsx, OrderModal.tsx, PriceBadge.tsx, tracking.ts.

## Shared-Vocabulary-Regeln (Phase 2 verbindlich)

- PascalCase Komponentennamen; eine Achse = ein Prop-Name (`disabled` statt `isDisabled`).
- Struktur-/content-agnostisch (`HomepageCarousel → Carousel`, `ProductCard → Card`).
- Industriestandard (`Dialog`/`Tooltip`/`Accordion`/`Input`).
- Genau **eine** Definition pro Komponente (Holy Grail); Varianten via Prop, nie Kopie.

---

## Finalisierung (Phase 7, Stand 2026-06-25)

Die oben skizzierte Konsolidierung ist umgesetzt. **Endzustand der kanonischen
Pattern Library — 25 öffentliche Komponenten** (Barrel
[`src/design-system/index.ts`](../../src/design-system/index.ts)), je mit
5-teiliger Usage-Doku in [`components/`](./components/) und live im
[`/styleguide`](../../src/pages/StyleguidePage.tsx):

| Ebene            | Ordner               | Komponenten                                                                                                                                     |
| ---------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout-Atome (4) | `primitives-layout/` | `Container`, `Stack`, `Cluster`, `Grid`                                                                                                         |
| Core-Atome (7)   | `core/`              | `Button`, `Input`, `Textarea`, `Select`, `Eyebrow`, `Badge`, `Stat`                                                                             |
| Molecules (11)   | `compound/`          | `SectionHeader`, `FormField`, `Card`, `Panel`, `Accordion`, `Breadcrumbs`, `AuthorByline`, `NavTile`, `InfoItem`, `MediaLink`, `ContactCallout` |
| Feedback (3)     | `feedback/`          | `Alert`, `EmptyState`, `Spinner`                                                                                                                |

**Gegenüber dem Phase-0-Plan:**

- `Stack`/`Cluster`/`Grid` in Phase 4 ergänzt (Layout-Primitives, §4.4); `Grid`
  konsolidiert die zuvor in `consumer/shell.tsx` lokal duplizierte Definition
  (eine Quelle, shell re-exportiert).
- `Panel` blieb als eigenes Molecule erhalten (Bordered/Elevated-Container) und
  wurde **nicht** in `Card` gemergt — beide live belegt, getrennte Rollen (Card =
  Glass-Panel/interaktiv, Panel = ruhende Fläche). Distinktion in den Docs.
- `BlogCard`/`ServiceCard` konsumieren das kanonische `Card`-Atom statt eigener
  Surface-Logik (App-UI-Komposita, `lineage.md`).
- **Organismen/Templates** (`src/components/sections`, `src/components/layout`)
  bleiben physisch an Ort und Stelle, sind aber per `eslint-plugin-boundaries`
  als `organism`/`template` klassifiziert und richtungsgeprüft (Architektur-
  `ASSUMPTION` §1.16/§1.8, EXECUTION-PLAN Phase 2 „Status IST"). Keine
  ungenutzten Patterns → keine Graveyard-Migration nötig (`lineage.md` › Befund).

Naming-Map und Uses/Used-by sind in [`lineage.md`](./lineage.md) fortgeschrieben;
Governance (Modify/Add/Remove, Team-Modell) in [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).
