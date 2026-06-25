# Stack

> Vertikaler Fluss (Spalte) mit konsistentem Abstand zwischen den Kindern. Atomic-Ebene: layout-atom. Quelle (eine Definition, Holy Grail): `src/design-system/primitives-layout/stack.tsx`. Live im Styleguide: `/styleguide#stack`.

## 1. Anatomy

`Stack` ist ein inhalts-/kontext-agnostisches Layout-Primitive: ein `<div>` mit `flex flex-col`, das seine `children` vertikal stapelt und den Abstand zwischen ihnen ueber eine orthogonale `gap`-Achse steuert. Es kapselt die zuvor roh wiederholte Signatur `flex flex-col gap-N` an genau einer Stelle. Styling ist token-rein: der `gap` laeuft ueber die rem-basierte Tailwind-Skala, die auf das **8pt-Soft-Grid** der Tokens rastet (`gap-2`=8px, `gap-4`=16px, `gap-6`=24px … = `--space-*`) — **keine** arbitrary-px (`gap-[13px]`), nur Skalen-Stufen. Pro Entscheidung eine Achse (`gap`, `align`), keine Kopien. Alle weiteren `HTMLDivElement`-Props (`className`, `id`, `role`, Event-Handler) werden durchgereicht; `ref` ist via `forwardRef` angebunden.

| Prop        | Typ                                           | Default     | Zweck                                                                                       |
| ----------- | --------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| `gap`       | `0 \| 1 \| 2 \| 3 \| 4 \| 6 \| 8 \| 10 \| 12` | `4`         | Vertikaler Abstand zwischen Kindern auf der 8pt-Soft-Grid-Skala (`gap-4`=16px).             |
| `align`     | `'start' \| 'center' \| 'end' \| 'stretch'`   | `'stretch'` | Cross-Axis-Ausrichtung der Kinder (`items-*`).                                              |
| `className` | `string`                                      | –           | Zusatz-Klassen, via `cn()` zusammengefuehrt (Escape-Hatch, nicht fuer Tokens missbrauchen). |
| `...props`  | `React.HTMLAttributes<HTMLDivElement>`        | –           | Standard-DOM-Attribute (`id`, `role`, `onClick`, …) am Wurzel-`div`.                        |

UI-States: `Stack` hat bewusst **keine** loading/empty/error/success-States — ein rein strukturelles Layout-Primitive hat keinen Datenbezug, daher kein erfundener State.

## 2. Playground / Galerie

Im Styleguide unter `/styleguide#stack`:

- Default (`gap={4}`, `align="stretch"`) — Standard-Vertikalfluss.
- `gap`-Galerie: `0`, `1`, `2`, `3`, `4`, `6`, `8`, `10`, `12` als Stufen des 8pt-Soft-Grids.
- `align`-Varianten: `start`, `center`, `end`, `stretch` mit unterschiedlich breiten Kindern.
- Edge Case: `gap={0}` (anliegende Kinder, kein Abstand).
- Edge Case: Verschachtelung (`Stack` in `Stack`) zur Demo orthogonaler Achsen.
- Edge Case: einzelnes Kind (gap ohne Wirkung).

## 3. Usage

Verwenden, wann immer Elemente **vertikal** mit konsistentem Abstand gestapelt werden — Formularzeilen, Absatzgruppen, Karten-Inhalte. Ersetzt rohes `flex flex-col gap-N`. Fuer horizontale, umbrechende Gruppen `Cluster`, fuer Karten-Raster `Grid`.

```tsx
import { Stack } from '~/design-system'

export function Beispiel() {
  return (
    <Stack gap={6} align="start">
      <h2>Titel</h2>
      <p>Erster Absatz.</p>
      <p>Zweiter Absatz.</p>
    </Stack>
  )
}
```

## 4. Do's & Don'ts

- ✅ `gap` nur aus der Skala waehlen (`0/1/2/3/4/6/8/10/12`) — sie rastet auf das 8pt-Soft-Grid.
- ✅ Fuer vertikalen Fluss `Stack` statt rohem `flex flex-col gap-N` nutzen (eine Definition, Holy Grail).
- ✅ `align` als orthogonale Achse einsetzen statt das Markup zu kopieren.
- ❌ Keine arbitrary-px-Abstaende (`className="gap-[13px]"`) — bricht die Token-Reinheit.
- ❌ Keinen loading/empty/error-State erwarten — Layout-Primitive haben keine UI-States.
- ❌ Nicht fuer **horizontale** Gruppen zweckentfremden — dafuer `Cluster`.

## 5. Code-Snippet (aus echtem Code)

```tsx
<Stack gap={3}>
  <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6">
    <Button to="/contact" variant="primary" size="sm" /* … */>
      {t('hero.cta', 'Termin buchen')}
    </Button>
    <Button to="/downloads" variant="outline" size="sm" /* … */ />
  </div>
</Stack>
```

Quelle: `src/components/sections/HeroSection.tsx:125`
