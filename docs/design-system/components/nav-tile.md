# NavTile

> Kompakte, icon-gefuehrte Navigations-Kachel mit Hover-Lift; die ganze Flaeche ist ein interner Router-Link. Atomic-Ebene: molecule. Quelle (eine Definition, Holy Grail): `src/design-system/compound/nav-tile.tsx`. Live im Styleguide: `/styleguide#nav-tile`.

## 1. Anatomy

NavTile rendert einen react-router `<Link to>`, dessen gesamte Flaeche klickbar ist (`group flex items-center justify-between`, `rounded-xl`, `p-4`, `transition-all`). Innenstruktur:

- **Icon-Tile** — `h-10 w-10`, `rounded-lg`, getoenter Hintergrund; nimmt das `icon` (eine `lucide-react`-Icon-Instanz als ReactNode) zentriert auf.
- **Label** — `<span>` mit `children`, `font-medium`.

`forwardRef` leitet auf das `<a>`-Element (`HTMLAnchorElement`). Ueber `Omit<React.ComponentPropsWithoutRef<typeof Link>, 'to'>` werden alle weiteren Link-Props (z. B. `aria-label`, `onClick`) durchgereicht. Inhalts-/kontext-agnostisch: der Aufrufer reicht Ziel, Icon und Label.

UI-States als Properties: **default**, **hover** (`hover:scale-[1.02]`, Border-/Schatten-Wechsel, Icon-/Label-Akzent via `group-hover`), **active** (`active:scale-[1.01]`) und **focus-visible** (Navy-Ring mit Offset, §1.11 WCAG 2.4.7, `--color-focus-ring`). `disabled` ist fuer einen nativen Navigations-Link nicht anwendbar.

Token-rein (§1.7): Farben/Schatten ausschliesslich ueber `--navtile-*`-Component-Tokens (Border, `bg-from`/`bg-to`, Shadow, Icon-/Label-FG/BG inkl. `-hover`) in der erlaubten `[var(--token)]`-Form — 0 Roh-Hex/arbitrary-px. Struktur/Spacing/Radius ueber die rem-basierte Tailwind-Skala.

| Prop        | Typ                                                 | Default     | Zweck                                                           |
| ----------- | --------------------------------------------------- | ----------- | --------------------------------------------------------------- |
| `to`        | `string`                                            | — (Pflicht) | Internes Router-Ziel; ganze Kachel klickbar.                    |
| `icon`      | `React.ReactNode`                                   | — (Pflicht) | Fuehrendes Icon (lucide-react-Instanz), im Icon-Tile zentriert. |
| `children`  | `React.ReactNode`                                   | `undefined` | Label-Text der Kachel.                                          |
| `className` | `string`                                            | `undefined` | Zusatz-Klassen, via twMerge gemerged.                           |
| `...props`  | `Omit<ComponentPropsWithoutRef<typeof Link>, 'to'>` | —           | Weitere Link-Props (`aria-label`, `onClick`, …).                |

## 2. Playground / Galerie

Specimens unter `/styleguide#nav-tile`:

- **Default** — Icon + kurzes Label.
- **Hover/Active** — Lift (scale + Schatten/Border), Icon-/Label-Akzent.
- **Focus-visible** — Navy-Ring mit Offset (Tastatur-Fokus).
- **Langes Label** — Umbruch-/Truncation-Verhalten.
- **Liste** — mehrere NavTiles in `space-y-3` (Sidebar-Listen-Pattern).

## 3. Usage

Verwenden fuer eine schlanke, icon-gefuehrte Navigations-Zeile in einer Sidebar-Liste (z. B. verwandte Services). Fuer eine zweizeilige Listenzeile mit Beschreibung stattdessen `MediaLink`, fuer eine erhobene Inhalts-Karte `Card`.

```tsx
import { NavTile } from '~/design-system'
import { Microscope } from 'lucide-react'
;<NavTile to="/diagnostics/vitamin-d3" icon={<Microscope className="h-5 w-5" />}>
  Vitamin-D3-Diagnostik
</NavTile>
```

## 4. Do's & Don'ts

- ✅ Eine `lucide-react`-Icon-Instanz an `icon` uebergeben (nicht die Komponente selbst).
- ✅ Interne Ziele via `to` setzen — die ganze Kachel wird zum Link.
- ✅ Mehrere Kacheln in `space-y-3` stapeln (Listen-Pattern).
- ❌ NavTile nicht fuer zweizeilige Eintraege (Titel + Beschreibung) verwenden — dafuer `MediaLink`.
- ❌ Kein `disabled` erwarten — gesperrte Ziele gar nicht erst rendern.
- ❌ Hover-Lift/Focus-Ring nicht per `className` ueberschreiben.

## 5. Code-Snippet (aus echtem Code)

```tsx
{
  relatedServices.map((s) => (
    <NavTile key={s.id} to={`/diagnostics/${s.id}`} icon={s.icon}>
      {t(`home:services.${s.translationKey}.title`, s.title)}
    </NavTile>
  ))
}
```

Quelle: `src/pages/ArticlePage.tsx:417`
