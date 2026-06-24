# Pattern-Lineage — Uses / Used-by (§Phase 2.11)

> **Zweck:** Für jede Design-System-Komponente die Abhängigkeitsrichtung
> dokumentieren — **Uses** (worauf sie nach unten zugreift) und **Used-by** (wer
> sie nach oben konsumiert). Leere **Used-by** = toter Code → `DROP` (Graveyard,
> Nachfrage §1.17). Import-Richtung ist top-down maschinell erzwungen
> (`eslint-plugin-boundaries`) und zyklenfrei (`madge --circular src`).
>
> **Reproduzierbar** (Stand 2026-06-24):
>
> ```bash
> # Used-by einer Komponente <C>:
> rg -l "<C[ />]|[, {]<C[,} ]" src --glob '!**/design-system/**' --glob '!**/*.test.tsx'
> # Uses (interne DS-Kanten):
> rg -oN "from '\.\.?/[^']*'" src/design-system/**/*.tsx | rg -v 'tokens|lib/utils'
> # Zyklencheck:
> npx madge --circular src        # ✔ No circular dependency found
> ```

## Schichten-Hierarchie (erlaubte Importrichtung)

```
page → template → organism → app-ui → molecule / feedback → atom → token
src/pages   src/components/layout   src/components/sections   src/components/ui
            └────────────── src/design-system/* (Barrel: index.ts) ───────────┘
```

Quelle der Wahrheit für die Richtung: `eslint.config.js`
(`boundaries/element-types`). Tokens sind das Blatt; jede Komponente bezieht
visuelle Werte ausschließlich aus `tokens/` (§1.7).

---

## Atoms — `src/design-system/core/` + `primitives-layout/`

| Komponente  | Uses (DS-intern)            | Used-by                                                                           |
| ----------- | --------------------------- | --------------------------------------------------------------------------------- |
| `Container` | — (nur `lib/utils`, Tokens) | Footer, AboutSection, IglooWidgetSection, TeamSection, SearchModal + 11 Pages     |
| `Button`    | —                           | Header + 7 Sections + 4 Pages (AboutPage, ArticlePage, IglooProPage, ServicePage) |
| `Input`     | —                           | SearchModal, **FormField** (molecule)                                             |
| `Textarea`  | —                           | **FormField** (`as="textarea"`)                                                   |
| `Select`    | —                           | **FormField** (`as="select"`)                                                     |
| `Eyebrow`   | —                           | **SectionHeader** (molecule), IglooWidgetSection + 5 Pages                        |
| `Badge`     | —                           | EventsPage, NotFoundPage, VitaminD3SprayPage                                      |
| `Stat`      | —                           | HeroSection                                                                       |

Alle Atome sind Blätter (keine DS-internen `Uses`); jedes hat ≥1 Used-by →
**kein** DROP-Kandidat.

## Molecules — `src/design-system/compound/`

| Komponente       | Uses (DS-intern)              | Used-by                                                                                                                     |
| ---------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `Accordion`      | —                             | FAQSection                                                                                                                  |
| `AuthorByline`   | —                             | S3LeitliniePage, VitaminD3ImplantologyPage                                                                                  |
| `Breadcrumbs`    | —                             | 9 Pages (About, Article, ArticlesIndex, Contact, Downloads, Events, Service, ServicesOverview, Support)                     |
| `Card`           | —                             | ServicesSection, TestimonialsSection, SEOHead, BlogCard, ServiceCard + Consumer-LPs (Duo/Mask/Spray/shell) + Events/Support |
| `ContactCallout` | —                             | S3LeitliniePage, VitaminD3ImplantologyPage, VitaminD3SprayPage                                                              |
| `FormField`      | `Input`, `Textarea`, `Select` | ContactForm, SupportForm                                                                                                    |
| `InfoItem`       | —                             | ContactPage, SupportPage                                                                                                    |
| `MediaLink`      | —                             | S3LeitliniePage, VitaminD3ImplantologyPage, VitaminD3SprayPage                                                              |
| `NavTile`        | —                             | ArticlePage, ServicePage                                                                                                    |
| `Panel`          | —                             | CookieBanner, ArticlePage + 6 Pages                                                                                         |
| `SectionHeader`  | `Eyebrow`                     | 6 Sections + 8 Pages                                                                                                        |

## Feedback — `src/design-system/feedback/` (UI-States)

| Komponente   | Uses (DS-intern) | Used-by                                                                  |
| ------------ | ---------------- | ------------------------------------------------------------------------ |
| `Alert`      | —                | ContactForm, SupportForm, SearchModal, ArticlePage (error/success-State) |
| `EmptyState` | —                | SearchModal, DownloadsPage (empty-State)                                 |
| `Spinner`    | —                | SearchModal, ArticlePage (loading-State)                                 |

---

## Organisms — `src/components/sections/` (per `boundaries` = `organism`)

> Used-by importbasiert ermittelt (`rg -l "import .*<C>.*from"`), Stand 2026-06-24.

| Organism              | Used-by (Importeur)   |
| --------------------- | --------------------- |
| `HeroSection`         | HomePage              |
| `AboutSection`        | HomePage              |
| `BlogSection`         | HomePage              |
| `DoctorsSection`      | HomePage              |
| `FeaturedCaseStudy`   | HomePage              |
| `IglooWidgetSection`  | HomePage              |
| `TestimonialsSection` | HomePage              |
| `FAQSection`          | HomePage, ServicePage |
| `ServicesSection`     | ServicesOverviewPage  |
| `CtaSection`          | Footer (Template)     |
| `ContactForm`         | ContactPage           |
| `SupportForm`         | SupportPage           |
| `TeamSection`         | AboutPage             |

## App-UI-Komposita — `src/components/ui/` (per `boundaries` = `app-ui`)

| Komponente         | Used-by (Importeur)                                    |
| ------------------ | ------------------------------------------------------ |
| `Reveal`           | alle Pages + FeaturedCaseStudy (Scroll-Reveal-Wrapper) |
| `PageTransition`   | alle Pages (Route-Transition-Wrapper)                  |
| `BlogCard`         | ArticlesIndexPage, BlogSection                         |
| `ServiceCard`      | ServicesSection                                        |
| `SearchModal`      | Header (Template)                                      |
| `LanguageSwitcher` | Header (Template)                                      |
| `FlagIcon`         | LanguageSwitcher                                       |
| `ChatWidget`       | App                                                    |
| `CookieBanner`     | App                                                    |
| `MobileCallButton` | App                                                    |

## Templates — `src/components/layout/` (per `boundaries` = `template`)

| Template      | Uses (Organism/App-UI)        | Used-by                                |
| ------------- | ----------------------------- | -------------------------------------- |
| `Layout`      | Header, Footer, ScrollToTop   | App                                    |
| `Header`      | LanguageSwitcher, SearchModal | Layout                                 |
| `Footer`      | CtaSection                    | Layout + Consumer-LPs (Duo/Mask/Spray) |
| `ScrollToTop` | — (Routing-Effekt)            | Layout                                 |

---

## Befund

- **Used-by-Vollständigkeit:** Jede der 22 öffentlichen DS-Komponenten hat ≥1
  Konsument → **kein** toter Export, **keine** Graveyard-Migration nötig
  (`docs/GRAVEYARD.md` bleibt für Phase-6-Kandidaten reserviert).
- **Used-by über ALLE Schichten (2026-06-24):** auch jede der 13 Organismen,
  10 App-UI-Komposita und 4 Templates hat ≥1 **realen Importeur** (importbasiert
  via `rg -l "import .*<C>.*from"` verifiziert, alle Singletons auf eine
  Page/Parent-`.tsx` aufgelöst) → **kein toter Code**, **keine** DROP-Kandidaten
  in Phase 2 (§1.8 / §Phase 2.11).
- **DS-interne Kanten:** nur `FormField → {Input,Textarea,Select}` und
  `SectionHeader → Eyebrow` — beide strikt molecule→atom, top-down, zyklenfrei.
- **Holy Grail:** Jede Komponente existiert genau einmal (eine `.tsx` je
  Komponente in `design-system/`); App und (künftige) Pattern-Library
  importieren dieselbe Quelle über den Barrel `design-system/index.ts`.
- **Offen (Phase 2 fortlaufend):** Legacy-Organismen leben noch in
  `src/components/sections` und App-Komposita in `src/components/ui` — per
  `boundaries`-Config bereits als `organism`/`app-ui` klassifiziert und
  richtungsgeprüft; physische Verschiebung nach `design-system/sections` ist
  optional und wird hier nachgezogen, sobald sie ohne Regression möglich ist.
