# Refactor Backlog — Phase 0

> Nach **Impact × Feasibility** geordnet; je Pattern eine Entscheidung **KEEP / MERGE / DROP**.
> Quelle: `interface-inventory.md`, `design-system/PATTERNS.md`, `ux/*`. Stand **2026-06-24**.
> DROP wird **nie ohne Freigabe** aus `main` entfernt → erst `docs/GRAVEYARD.md` + Nachfrage §1.17.

## Priorisierung (Impact hoch → niedrig, bei gleichem Impact Feasibility hoch zuerst)

| #   | Pattern / Aufgabe                                                                                            | Phase | Entscheidung   | Impact  | Feasibility                  |
| --- | ------------------------------------------------------------------------------------------------------------ | ----- | -------------- | ------- | ---------------------------- |
| 1   | Rest-DoD Tokens verifizieren (Dark/Light beider Bereiche, `#000`-Check, Naming-Audit)                        | 1     | KEEP           | hoch    | hoch                         |
| 2   | Legacy `components/{ui,sections,layout}` → `design-system/{sections,...}` + `src/templates/` migrieren       | 2     | MERGE          | hoch    | mittel                       |
| 3   | Card-Cluster (BlogCard, ServiceCard, Panel) → **ein** `Card` mit Varianten                                   | 2     | MERGE          | hoch    | hoch                         |
| 4   | Form-Cluster (ContactForm, SupportForm) → gemeinsamer Form-Core                                              | 2     | MERGE          | mittel  | mittel                       |
| 5   | Team-Grids (DoctorsSection, TeamSection) → ein Organism                                                      | 2     | MERGE          | mittel  | hoch                         |
| 6   | `lineage.md` (Uses/Used-by) erzeugen; leere Used-by → Graveyard                                              | 2     | KEEP           | mittel  | hoch                         |
| 7   | Roh-Werte tilgen: FlagIcon, IglooWidgetSection (Hex), Header (`font-light`), Page-px                         | 3     | KEEP           | hoch    | mittel                       |
| 8   | Ein dominantes Element/CTA pro View; rollenbasierte Farbe; Squint-Test                                       | 3     | KEEP           | hoch    | mittel                       |
| 9   | Layout-Primitives `Grid`/`Stack`/`Cluster`; Seiten auf Container/Grid; Reading-Width für Artikel/Forms/Legal | 4     | KEEP           | hoch    | mittel                       |
| 10  | Routing-Resilienz: `errorElement`/`useRouteError`, Skeleton-`Suspense`, Catch-all (existiert)                | 5     | KEEP           | hoch    | mittel                       |
| 11  | A11y: 0 kritische axe, Fokus sichtbar, Kontrast AA, reduced-motion/color-scheme                              | 5     | KEEP           | hoch    | mittel                       |
| 12  | Bild-Pipeline (sharp → AVIF/WebP, srcset/sizes/width/height/lazy, LCP fetchpriority)                         | 5     | KEEP           | mittel  | mittel                       |
| 13  | Outcome-Events + ordinal→Median; ≥1 subjektive Metrik; kein Aggregat-Score in UI                             | 5     | KEEP           | mittel  | hoch                         |
| 14  | Alle UI-States je datengetriebener Komponente (loading/empty/error/success)                                  | 6     | KEEP           | hoch    | mittel                       |
| 15  | Pattern Library `/styleguide` + 5-teilige Doku + visuelle Regression                                         | 7     | KEEP           | mittel  | mittel                       |
| 16  | Governance: `DESIGN_SYSTEM.md`, `.github/CODEOWNERS`, Changelog-CI                                           | 7     | KEEP           | mittel  | hoch                         |
| D1  | `FeaturedCaseStudy.tsx` (deaktiviert)                                                                        | 2/6   | DROP-Kandidat  | niedrig | hoch — Graveyard + Nachfrage |
| T1  | Consumer-Checkout, Chat, i18n-Routing, Infra/Deployment                                                      | —     | KEEP (Tabu §5) | —       | nicht anfassen               |

## Hinweise

- DROP-Kandidaten (D1) zuerst Lineage prüfen (leere Used-by?), dann `GRAVEYARD.md` + Freigabe.
- Tabu-Bereiche (T1) bleiben unverändert (PROJECT-DECISIONS §5).
