# Komponenten-Dokumentation

> 5-teilige Usage-Doku je öffentlicher Design-System-Komponente (§Phase 7.2):
> **Anatomy · Playground/Galerie · Usage · Do's & Don'ts · Code-Snippet aus echtem Code**.
> Lebende, interaktive Galerie: [`/styleguide`](../../../src/pages/StyleguidePage.tsx)
> (Anker `#<id>` matchen die Dateinamen). Alle Komponenten stammen aus genau **einer**
> Quelle und werden über den Barrel [`~/design-system`](../../../src/design-system/index.ts)
> importiert (Holy Grail §7.8).

Governance/Prozess: [`../DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) ·
Inventar: [`../PATTERNS.md`](../PATTERNS.md) · Uses/Used-by: [`../lineage.md`](../lineage.md) ·
Tokens: [`../../../src/design-system/tokens/README.md`](../../../src/design-system/tokens/README.md)

## Layout-Atome — `primitives-layout/`

- [Container](./container.md) — zentrierter Inhalts-Rahmen (max-w-container)
- [Stack](./stack.md) — vertikaler Fluss mit 8pt-Gap
- [Cluster](./cluster.md) — horizontale, umbrechende Gruppe
- [Grid](./grid.md) — responsives Karten-Raster (cols teilt 12)

## Core-Atome — `core/`

- [Button](./button.md) — polymorphe Aktion (button/Link/a)
- [Input](./input.md) — einzeiliges Eingabefeld
- [Textarea](./textarea.md) — mehrzeiliges Eingabefeld
- [Select](./select.md) — natives Auswahlfeld
- [Eyebrow](./eyebrow.md) — gradient-umrandete Section-Label-Pill
- [Badge](./badge.md) — Status-/Kategorie-Pill
- [Stat](./stat.md) — Kennzahl (on-dark)

## Molecules — `compound/`

- [SectionHeader](./section-header.md) — Eyebrow + H2
- [FormField](./form-field.md) — Label + Atom (input/textarea/select) + Error/Helper
- [Card](./card.md) — Glass-Panel-Fläche, polymorph/interaktiv
- [Panel](./panel.md) — bordered/elevated Container
- [Accordion](./accordion.md) — Disclosure-Items
- [Breadcrumbs](./breadcrumbs.md) — Breadcrumb-Pfad
- [AuthorByline](./author-byline.md) — Autor-Meta mit Avatar
- [NavTile](./nav-tile.md) — Icon + Label-Link-Kachel
- [InfoItem](./info-item.md) — Icon + Label + Wert
- [MediaLink](./media-link.md) — Icon-Kachel + Titel + Beschreibung-Link
- [ContactCallout](./contact-callout.md) — Kontakt-CTA mit Telefon-Aktion

## Feedback / UI-States — `feedback/`

- [Alert](./alert.md) — Inline-Status (default/success/danger)
- [EmptyState](./empty-state.md) — Leerzustand (plain/outlined)
- [Spinner](./spinner.md) — Lade-Indikator

---

**25 öffentliche Komponenten** — deckungsgleich mit den Barrel-Exports in
`src/design-system/index.ts` und den Spezimen in `/styleguide`.
