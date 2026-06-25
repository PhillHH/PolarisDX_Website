# Badge

> Kompakte Status-/Kategorie-Pill für Tags, Labels und Hinweise. Atomic-Ebene: atom. Quelle (eine Definition, Holy Grail): `src/design-system/core/badge.tsx`. Live im Styleguide: `/styleguide#badge`.

## 1. Anatomy

Gerendert wird ein einzelnes `<span>` mit `inline-flex`, das den `children`-Inhalt zentriert (`items-center gap-1.5`) aufnimmt. Dadurch trägt ein optional vorangestelltes Icon (z. B. `<Award />`) automatisch mit; die Badge selbst ist inhaltsagnostisch (§Phase 2.7) und reicht den Inhalt durch.

```
<span class="badge">[Icon?] Label</span>
```

| Prop        | Typ                                     | Default   | Zweck                                                                                                                  |
| ----------- | --------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------- |
| `variant`   | `'brand' \| 'accent' \| 'success'`      | `'brand'` | Rollenbasierte Farb-Achse (Fläche + Vordergrund über `--badge-<variant>-bg/-fg`). Eine orthogonale Achse statt Kopien. |
| `uppercase` | `boolean`                               | `false`   | Zweite orthogonale Achse für Label-/Kategorie-Optik (`uppercase tracking-wider`).                                      |
| `className` | `string`                                | –         | Passthrough, via `cn()` gemerged.                                                                                      |
| `...props`  | `React.HTMLAttributes<HTMLSpanElement>` | –         | Standard-Span-Attribute (z. B. `key`, `title`, `aria-*`).                                                              |

Token-rein (§1.7): Fläche, Farbe und Radius laufen ausschließlich über `--badge-*`-Component-Tokens (`rounded-[var(--badge-radius)]`, `bg-[var(--badge-brand-bg)]` …) — kein Roh-Hex, kein arbitrary-px. Padding/Gap/Schriftgröße nutzen die rem-basierte Tailwind-Skala (`px-3 py-1 text-xs`).

## 2. Playground / Galerie

Specimens in `/styleguide#badge`:

- `variant="brand"` (Default)
- `variant="accent"`
- `variant="success"`
- `uppercase` an / aus je Variante
- Edge-Case: Badge mit vorangestelltem Icon (`<Icon /> + Text` über `gap-1.5`)
- Edge-Case: langer Label-Text (Pill bleibt `inline-flex`, kein Umbruch erzwungen)
- Edge-Case: nur-Icon-Inhalt

## 3. Usage

Einsetzen für kurze, statusartige oder kategorisierende Labels (Tags, Partner-Hinweise, Erfolgsmeldungen). Nicht für interaktive Aktionen (dafür Button) oder längere Fließtexte.

```tsx
import { Badge } from '~/design-system'
;<Badge variant="success" uppercase>
  Verfügbar
</Badge>
```

## 4. Do's & Don'ts

- ✅ Variante nach Rolle wählen (`success` für positive Zustände, `accent` für Hervorhebung).
- ✅ Icon als erstes `children`-Element übergeben — das Basis-`gap` trägt es mit.
- ✅ `uppercase` für Kategorie-/Label-Optik nutzen, konsistent pro Sektion.
- ❌ Keine Roh-Farben via `className` (`bg-[#…]`) überschreiben — Farbe nur über `variant`.
- ❌ Nicht als Button/Link missbrauchen (keine Click-States definiert).
- ❌ Keine variantenfremden Kopien anlegen — neue Bedeutung als neue `variant`-Rolle.

## 5. Code-Snippet (aus echtem Code)

```tsx
{
  event.tag && (
    <Badge variant="brand" uppercase>
      {event.tag}
    </Badge>
  )
}
{
  event.partner && (
    <Badge variant="accent">
      <Award className="w-3 h-3" />
      {event.partner}
    </Badge>
  )
}
```

Quelle: `src/pages/EventsPage.tsx:169`
