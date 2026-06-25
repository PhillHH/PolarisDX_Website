# Card

> Erhobene, polymorphe Glass-Panel-Karte mit optionalem Hover-Lift und Link-Semantik — die Single Source of Truth fuer die zuvor in `ServiceCard`/`BlogCard` doppelte Oberflaeche. Atomic-Ebene: molecule. Quelle (eine Definition, Holy Grail): `src/design-system/compound/card.tsx`. Live im Styleguide: `/styleguide#card`.

## 1. Anatomy

`Card` ist eine **polymorphe** Glass-Karte (`React.forwardRef`): das Host-Element wird aus den Props abgeleitet — `to` → React-Router-`<Link>`, `href` → `<a>`, sonst `as` (`div`/`article`). Die Flaechen-Logik bleibt fuer alle Elemente identisch. Inhalts-/kontext-agnostisch: der Aufrufer reicht den Inhalt als `children`.

Styling ist **token-gebunden** (kein Roh-Hex/arbitrary-px): die Basis konsumiert ausschliesslich token-gebundene Utilities (`glass-panel`-Component-Class, `rounded-xl`, `shadow-card`, `bg-surface`) sowie die Spacing-Skala (`p-6`). Alle Oberflaechen-States sind Properties: `interactive` aktiviert Hover-Lift (`-translate-y-1`, `shadow-card`, `bg-surface/80`), Active-State und `focus-visible`-Ring (Navy-Ring mit Offset via `--color-focus-ring`, WCAG 2.4.7).

**Abgrenzung zu `Panel`:** `Card` ist die **erhobene, klickbare** Glass-Karte (Hover-Lift, Link-Semantik, `glass-panel`). `Panel` ist die **ruhende**, bordered/elevated Container-Flaeche (`--panel-*`-Tokens, kein Lift, keine Link-Semantik). Bewusst zwei distinkte Containment-Patterns.

| Prop          | Typ                                 | Default | Zweck                                                                              |
| ------------- | ----------------------------------- | ------- | ---------------------------------------------------------------------------------- |
| `padding`     | `'none' \| 'md'`                    | `'md'`  | Innenabstand: `none` (leer), `md` (`p-6`).                                         |
| `interactive` | `boolean`                           | `false` | Aktiviert Hover-Lift, Active-State + `focus-visible`-Ring (fuer klickbare Karten). |
| `to`          | `string`                            | –       | Interner Router-Link → rendert `<Link>`, ganze Karte klickbar.                     |
| `href`        | `string`                            | –       | Externer/absoluter Link → rendert `<a>`.                                           |
| `as`          | `'div' \| 'article'`                | `'div'` | Host-Element ohne Link-Semantik (greift, wenn weder `to` noch `href` gesetzt).     |
| `className`   | `string`                            | –       | Zusatzklassen, via `cn()` an die CVA-Basis gemergt.                                |
| `ref`         | `React.Ref<HTMLElement>`            | –       | Forwarded Ref auf das Host-Element.                                                |
| `...props`    | `React.HTMLAttributes<HTMLElement>` | –       | Durchgereichte Element-Attribute (inkl. `children`).                               |

## 2. Playground / Galerie

Spezimen unter `/styleguide#card`:

- `padding="md"` (Default) vs. `padding="none"` (z. B. fuer randlose Medien/Bild oben).
- `interactive={false}` (ruhend) vs. `interactive` (Hover-Lift + Fokus-Ring).
- Polymorphie: `as="div"`, `as="article"`, `to="…"` (`<Link>`), `href="…"` (`<a>`).
- Edge Case: `as="article" interactive padding="none"` (Blog-Teaser mit Bild + `overflow-hidden`).
- Edge Case: klickbare Karte — `focus-visible`-Ring per Tastatur pruefen.

## 3. Usage

Einsetzen fuer **erhobene, eigenstaendige Inhalts-Karten** in Grids/Listen (Service-, Blog-, Produkt-Teaser). Klickbare Karten mit `interactive` + `to`/`href`. Fuer ruhende Formular-/Info-Flaechen stattdessen `Panel`.

```tsx
import { Card } from '~/design-system'
;<Card to="/articles/foo" interactive padding="none">
  …
</Card>
```

## 4. Do's & Don'ts

- ✅ `interactive` setzen, wenn die ganze Karte klickbar ist — bringt Fokus-Ring + Lift mit.
- ✅ `padding="none"` fuer randlose Medien (Bild oben) und Padding dann innen selbst setzen.
- ✅ Polymorphie nutzen: `to` fuer interne Links, `href` extern, `as="article"` fuer eigenstaendigen Inhalt.
- ❌ Kein Hover-Lift haendisch via `className` — dafuer existiert `interactive`.
- ❌ Nicht fuer ruhende Formular-/Info-Bloecke verwenden — dafuer existiert `Panel`.
- ❌ Keine Roh-Schatten/-Farben anhaengen — die Oberflaeche ist token-gebunden (`glass-panel`, `shadow-card`).

## 5. Code-Snippet (aus echtem Code)

```tsx
<Card as="article" interactive padding="none" className="flex h-full flex-col overflow-hidden">
  …
</Card>
```

`Quelle: src/components/ui/BlogCard.tsx:17`
