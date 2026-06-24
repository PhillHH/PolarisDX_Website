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

## Befund

- **Used-by-Vollständigkeit:** Jede der 22 öffentlichen DS-Komponenten hat ≥1
  Konsument → **kein** toter Export, **keine** Graveyard-Migration nötig
  (`docs/GRAVEYARD.md` bleibt für Phase-6-Kandidaten reserviert).
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
