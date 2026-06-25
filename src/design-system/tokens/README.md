# Design Tokens

Die **Single Source of Truth** aller Design-Werte ist [`tokens.css`](./tokens.css).
Werte werden **einmal** dort geaendert und propagieren ueberall (`[BUD]`).

## Pipeline-Setup: CSS-first (§3.0 A)

- `tokens.css` ist die Quelle (CSS Custom Properties, 3 Ebenen).
- `tokens.ts` spiegelt **nur** Logik-relevante Werte (Breakpoint-Zahlen,
  Varianten-Unions) — **keine** Farb-/Spacing-Rohwerte.
- `tailwind.config.js` referenziert **ausschliesslich** `var(--token)`,
  niemals Rohwerte (Ausnahme: `screens`/Breakpoints als px-Literale, weil
  CSS-Variablen in `@media`-Bedingungen nicht funktionieren — bewusster
  Parallelwert, in `tokens.css` als `--breakpoint-*` gespiegelt).

### Farben als Kanal-Tripel

Farb-**Rohwerte** leben als Kanal-Tripel `"R G B"` (z. B. `--brand-navy-rgb: 8 51 88`)
— die **alleinige** Quelle. Konsumiert wird via `rgb(var(--x-rgb) / <alpha>)`:

- In `tailwind.config.js` als `rgb(var(--brand-navy-rgb) / <alpha-value>)`, damit
  Opacity-Modifier (`bg-brand-navy/85`) funktionieren, **ohne** den Hex-Wert ein
  zweites Mal im Config zu pflegen (Single Source, §3.4 / §1.8).
- In `tokens.css` selbst stellt jede Semantic-Rolle den Kanal (`--color-bg-rgb`)
  **und** die fertige Farbe (`--color-bg: rgb(var(--color-bg-rgb))`) bereit.
  Theming bindet **nur** die Kanaele neu; die Farb-Tokens leiten automatisch ab.

> JSON-first + Style Dictionary (§3.0 B) ist **nicht** eingerichtet. Eine
> Umstellung ist eine Produktentscheidung (Build-Tool, §1.17) und erst sinnvoll,
> sobald >1 Plattform/Output oder grosse Theming-Skalierung absehbar ist.

## Die drei Ebenen

1. **Primitive / Global** — rohe, kontextfreie Werte; Farben als Kanal-Tripel
   (`--neutral-500-rgb`, `--brand-navy-rgb`), sonst direkt (`--space-4`,
   `--font-size-300`). „Was es ist."
2. **Semantic / Alias** — rollengebunden (`--color-bg`, `--color-fg`,
   `--color-action-primary`). „Was es tut." Erbt **nur** von Primitives.
3. **Component-specific** — komponentengebunden (`--button-primary-bg`,
   `--card-padding`). Erbt **nur** von Semantic, isoliert je Komponente.

**Regel:** Component → nur Semantic, Semantic → nur Primitive. Ein
Component-Token zeigt **nie** direkt auf einen Rohwert oder ein Primitive.

## Naming-Convention

Feste Reihenfolge, kebab-case:

```
category-property-item-variant-state
```

z. B. `--color-action-primary-hover`, `--button-primary-bg`. Optionale Stufen
(variant/state) weglassen, wenn nicht noetig. Globale Farb-/Skalenstufen
numerisch (50 = hellster … 900 = dunkelster).

## Einen Token hinzufuegen

1. **One-off-Schwelle (§1.20):** Einen neuen Token erst ab **≥3**
   Verwendungsstellen anlegen — sonst Wert lokal in der Komponente belassen.
2. Primitive nur ergaenzen, wenn ein wirklich neuer Rohwert noetig ist (Skala
   bleibt non-linear, **keine** ungeraden px-Werte wie 3/5/7).
3. Semantic-Token anlegen, der den **Zweck** benennt, und auf das Primitive
   zeigen lassen — Komponenten konsumieren **nie** Primitives direkt.
4. Falls in Tailwind nutzbar: Key unter `theme.extend` ergaenzen, Wert
   `var(--token)`. **Kein** Rohwert im Config.
5. `tokens.ts` nur erweitern, wenn JS/TS den Wert als Logik braucht.

## Theming (`[data-theme]`)

Dark-Mode bindet in `tokens.css` **nur die Semantic-Ebene** neu (identische
Variablennamen, andere Werte) — keine Komponenten-Duplikate. Der Block
`[data-theme='dark']` ist **ruhende Infrastruktur**: aktiv erst, wenn
`<html data-theme="dark">` gesetzt wird.

> Ein nutzersichtbarer Dark-/Theme-Toggle ist eine **offene Produktentscheidung**
> (§1.17, `knowledge/PROJECT-DECISIONS.md` › „Light/Dark/Brand-Themes gewuenscht?"
> = TODO) und wird **nicht** automatisch aktiviert. Default bleibt Light. Beim
> Aktivieren: Anti-FOUC-Inline-Script im `index.html`-Template setzen (§Phase 1.5).

## Token → Verwendung (§Phase 7.4)

Wo die wichtigsten Semantic-/Component-Token-Familien konsumiert werden — als
Orientierung vor einer Aenderung (Impact, §1.15). Vollstaendige Belege jederzeit
reproduzierbar via `rg -n "<token>" src`.

| Token-Familie                                                                                                                 | Ebene     | Konsumiert von (Beispiele)                                                             |
| ----------------------------------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------- |
| `--color-bg` / `--color-fg` (+`-rgb`)                                                                                         | Semantic  | global (`index.css` Reset), Tailwind `bg`/`fg`, alle Seiten/Sektionen                  |
| `--color-action-primary(-hover)`                                                                                              | Semantic  | `Button` (primary), Tailwind `primary`, CTA-Flaechen                                   |
| `--color-focus-ring(-on-dark)`                                                                                                | Semantic  | jedes interaktive Atom (`focus-visible:ring-*`) — Button/Input/Card/NavTile …          |
| `--color-border(-strong)`                                                                                                     | Semantic  | `Button` (secondary), `Panel`, Form-Sections, `Specimen`-Trenner                       |
| `--button-*` (`-bg`/`-fg`/`-radius`/`-min-height`)                                                                            | Component | nur `core/button.tsx`                                                                  |
| `--input-*` (`-bg`/`-border`/`-font-size`/`-min-height`)                                                                      | Component | `core/{input,textarea,select}.tsx` (geteilte Feld-Familie)                             |
| `--badge-*`, `--eyebrow-*`, `--stat-*`                                                                                        | Component | je `core/{badge,eyebrow,stat}.tsx`                                                     |
| `--alert-*`, `--empty-state-*`, `--spinner-color`                                                                             | Component | je `feedback/{alert,empty-state,spinner}.tsx`                                          |
| `--panel-*`, `--accordion-*`, `--callout-*`, `--navtile-*`, `--media-link-*`, `--author-*`, `--info-item-*`, `--breadcrumb-*` | Component | je zugehoeriges `compound/<name>.tsx` (1:1)                                            |
| `--space-*` (8pt-Soft-Grid)                                                                                                   | Primitive | Tailwind-Spacing-Skala (`p-*`/`m-*`/`gap-*`) → `Stack`/`Cluster`/`Grid` + alle Layouts |
| `--reading-width`                                                                                                             | Primitive | Tailwind `max-w-reading` → Artikel/Forms (PrivacyPage, ArticlePage, ServicePage …)     |
| `--tap-target-min` (44px)                                                                                                     | Primitive | Button/Input-Min-Height + alle rohen interaktiven Controls (A11y §1.11)                |

**Regel zum Aendern:** Component-Token aendern = lokal (eine Komponente).
Semantic-Token aendern = systemweit (Impact-Map vor der Aenderung). Primitive
aendern = breiteste Wirkung — nur mit Bedacht und Grep-Beleg.

Pro-Komponente-Detail (Anatomy mit Token-Liste): siehe die 5-teilige Doku in
[`docs/design-system/components/`](../../../docs/design-system/components/).
