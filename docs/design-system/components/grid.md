# Grid

> Responsives, gleichspaltiges Karten-Raster (mobile-first eine Spalte, hochskalierend zur Zielzahl). Atomic-Ebene: layout-atom. Quelle (eine Definition, Holy Grail): `src/design-system/primitives-layout/grid.tsx`. Live im Styleguide: `/styleguide#grid`.

## 1. Anatomy

`Grid` ist ein inhalts-/kontext-agnostisches Layout-Primitive: ein `<div>` mit `grid`, das seine `children` in ein responsives, gleichspaltiges Raster legt. Mobile-first **eine** Spalte, ab `sm` zwei, ab `lg` die Zielzahl — so bricht das Layout auf schmalen Viewports nicht und scrollt nicht horizontal. Es konsolidiert die zuvor lokal in `pages/consumer/shell.tsx` definierte `Grid`-Funktion in die Design-System-Schicht; `shell.tsx` **re-exportiert** von hier (`export { Grid }`), sodass es genau **eine** Definition gibt. Styling ist token-rein: der `gap` laeuft ueber die rem-basierte Tailwind-Skala = **8pt-Soft-Grid** (`gap-6`=24px … = `--space-*`) — **keine** arbitrary-px. Die Spaltenzahlen teilen 12 sauber (2/3/4, **nie** 5/7/11). Alle weiteren `HTMLDivElement`-Props werden durchgereicht; `ref` ist via `forwardRef` angebunden.

| Prop        | Typ                                    | Default | Zweck                                                                                    |
| ----------- | -------------------------------------- | ------- | ---------------------------------------------------------------------------------------- |
| `cols`      | `2 \| 3 \| 4`                          | `3`     | Ziel-Spaltenzahl ab `lg`; darunter mobile-first 1 Spalte, ab `sm` 2. Teilt 12 sauber.    |
| `gap`       | `4 \| 6 \| 8 \| 10 \| 12`              | `6`     | Abstand zwischen Zellen (Reihen und Spalten) auf der 8pt-Soft-Grid-Skala (`gap-6`=24px). |
| `className` | `string`                               | –       | Zusatz-Klassen, via `cn()` zusammengefuehrt (Escape-Hatch).                              |
| `...props`  | `React.HTMLAttributes<HTMLDivElement>` | –       | Standard-DOM-Attribute am Wurzel-`div`.                                                  |

Hinweis: Asymmetrische, **inhaltsabhaengige** Tracks (`grid-cols-[1fr_320px]`) bleiben bewusst call-site-spezifisch — dieses Primitive deckt das gleichspaltige Karten-Raster, nicht jedes denkbare Grid.

UI-States: `Grid` hat bewusst **keine** loading/empty/error/success-States — n. a. fuer ein strukturelles Layout-Primitive ohne Datenbezug.

## 2. Playground / Galerie

Im Styleguide unter `/styleguide#grid`:

- Default (`cols={3}`, `gap={6}`) — Drei-Spalten-Karten-Raster.
- `cols`-Galerie: `2`, `3`, `4` (jeweils mobile-first 1 → `sm` 2 → `lg` Zielzahl).
- `gap`-Galerie: `4`, `6`, `8`, `10`, `12` als 8pt-Soft-Grid-Stufen.
- Edge Case: responsives Verhalten — Viewport-Resize von mobil (1 Spalte) bis `lg` (Zielzahl).
- Edge Case: ungerade Kinderzahl (letzte Reihe nicht voll besetzt).
- Edge Case: gleichspaltig vs. die bewusst nicht abgedeckten asymmetrischen Tracks (call-site-spezifisch).

## 3. Usage

Verwenden fuer gleichspaltige **Karten-Raster** (Benefits, Steps, Feature-Karten). Mobile-first eine Spalte, ab `lg` die Zielzahl. Fuer vertikalen Fluss `Stack`, fuer umbrechende Chip-Reihen `Cluster`. Asymmetrische, inhaltsabhaengige Layouts bleiben call-site-spezifisch (kein Vorab-Generalisieren).

```tsx
import { Grid } from '~/design-system'

export function Cards({ items }: { items: { title: string }[] }) {
  return (
    <Grid cols={3} gap={6}>
      {items.map((c) => (
        <Card key={c.title}>{c.title}</Card>
      ))}
    </Grid>
  )
}
```

## 4. Do's & Don'ts

- ✅ `cols` nur aus `2/3/4` waehlen — teilt 12 sauber, nie 5/7/11.
- ✅ `gap` nur aus der Skala (`4/6/8/10/12`) — 8pt-Soft-Grid.
- ✅ Fuer Karten-Raster `Grid` statt rohem `grid grid-cols-N` (eine Definition, re-exportiert via `shell.tsx`).
- ❌ Keine arbitrary-px-Abstaende und keine inhaltsabhaengigen Tracks (`grid-cols-[1fr_320px]`) hierdrueber erzwingen — die bleiben call-site-spezifisch.
- ❌ Keine Spaltenzahlen, die 12 nicht teilen (5/7/11).
- ❌ Keinen loading/empty/error-State erwarten — Layout-Primitive haben keine UI-States.

## 5. Code-Snippet (aus echtem Code)

```tsx
<Grid cols={4}>
  {BENEFITS.map((b) => (
    <Card key={b.title}>
      <h3 className="text-xl font-semibold text-fg-heading">{b.title}</h3>
      <p className="mt-3 leading-relaxed text-fg">{b.body}</p>
    </Card>
  ))}
</Grid>
```

Quelle: `src/pages/consumer/MaskPage.tsx:170`
