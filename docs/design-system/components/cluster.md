# Cluster

> Horizontale, bei Bedarf umbrechende Gruppe (Tags, Buttons, Meta-Chips) mit konsistentem Abstand. Atomic-Ebene: layout-atom. Quelle (eine Definition, Holy Grail): `src/design-system/primitives-layout/cluster.tsx`. Live im Styleguide: `/styleguide#cluster`.

## 1. Anatomy

`Cluster` ist ein inhalts-/kontext-agnostisches Layout-Primitive: ein `<div>` mit `flex flex-wrap`, das seine `children` horizontal anordnet und auf schmalen Viewports per Default-`flex-wrap` umbricht — kein Horizontal-Scroll. Es kapselt die roh wiederholte Signatur `flex flex-wrap gap-N items-…` an genau einer Stelle. Styling ist token-rein: der `gap` laeuft ueber die rem-basierte Tailwind-Skala = **8pt-Soft-Grid** (`gap-2`=8px, `gap-3`=12px, `gap-4`=16px … = `--space-*`) — **keine** arbitrary-px, nur Skalen-Stufen. Drei orthogonale Achsen (`gap`, `align`, `justify`) statt Kopien. Alle weiteren `HTMLDivElement`-Props werden durchgereicht; `ref` ist via `forwardRef` angebunden.

| Prop        | Typ                                          | Default    | Zweck                                                                                           |
| ----------- | -------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------- |
| `gap`       | `1 \| 2 \| 3 \| 4 \| 6 \| 8`                 | `3`        | Abstand zwischen den Elementen (Zeilen und Spalten) auf der 8pt-Soft-Grid-Skala (`gap-3`=12px). |
| `align`     | `'start' \| 'center' \| 'end' \| 'baseline'` | `'center'` | Cross-Axis-Ausrichtung der Kinder (`items-*`).                                                  |
| `justify`   | `'start' \| 'center' \| 'between' \| 'end'`  | `'start'`  | Verteilung entlang der Hauptachse (`justify-*`).                                                |
| `className` | `string`                                     | –          | Zusatz-Klassen, via `cn()` zusammengefuehrt (Escape-Hatch).                                     |
| `...props`  | `React.HTMLAttributes<HTMLDivElement>`       | –          | Standard-DOM-Attribute am Wurzel-`div`.                                                         |

UI-States: `Cluster` hat bewusst **keine** loading/empty/error/success-States — n. a. fuer ein strukturelles Layout-Primitive ohne Datenbezug.

## 2. Playground / Galerie

Im Styleguide unter `/styleguide#cluster`:

- Default (`gap={3}`, `align="center"`, `justify="start"`) — Standard-Chip-Reihe.
- `gap`-Galerie: `1`, `2`, `3`, `4`, `6`, `8` als 8pt-Soft-Grid-Stufen.
- `align`-Varianten: `start`, `center`, `end`, `baseline` (Letzteres mit unterschiedlichen Schriftgroessen).
- `justify`-Varianten: `start`, `center`, `between`, `end`.
- Edge Case: viele Kinder in schmalem Container → automatischer `flex-wrap`-Umbruch ohne Horizontal-Scroll.
- Edge Case: gemischte Elementhoehen (Buttons + Chips).

## 3. Usage

Verwenden fuer **horizontale** Gruppen, die umbrechen duerfen: Tag-/Pill-Reihen, Button-Gruppen, Meta-Chips. Ersetzt rohes `flex flex-wrap gap-N items-…`. Fuer vertikalen Fluss `Stack`, fuer gleichspaltige Karten-Raster `Grid`.

```tsx
import { Cluster } from '~/design-system'

export function Tags({ items }: { items: string[] }) {
  return (
    <Cluster gap={2} justify="start">
      {items.map((t) => (
        <span key={t} className="rounded-full px-3 py-1">
          {t}
        </span>
      ))}
    </Cluster>
  )
}
```

## 4. Do's & Don'ts

- ✅ `gap` nur aus der Skala (`1/2/3/4/6/8`) waehlen — 8pt-Soft-Grid.
- ✅ Den Default-`flex-wrap` nutzen, damit schmale Viewports umbrechen statt scrollen.
- ✅ `justify="between"` fuer verteilte Toolbars statt manueller Spacer.
- ❌ Keine arbitrary-px-Abstaende (`className="gap-[10px]"`) — verletzt Token-Reinheit.
- ❌ Nicht fuer vertikale Stapel zweckentfremden — dafuer `Stack`.
- ❌ Keinen loading/empty/error-State erwarten — Layout-Primitive haben keine UI-States.

## 5. Code-Snippet (aus echtem Code)

```tsx
<Cluster gap={2}>
  {items.map((p, i) => (
    <span
      key={i}
      className="rounded-full border border-accent-border bg-accent-soft px-4 py-2 text-sm font-medium text-accent-deep"
    >
      {p}
    </span>
  ))}
</Cluster>
```

Quelle: `src/pages/consumer/shell.tsx:521`
