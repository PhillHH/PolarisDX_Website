# MediaLink

> Flache, zweizeilige Related-/Weiterfuehrend-Link-Zeile: Icon-Tile plus Titel plus Beschreibung; die ganze Zeile ist ein interner Router-Link mit dezentem Row-Hover. Atomic-Ebene: molecule. Quelle (eine Definition, Holy Grail): `src/design-system/compound/media-link.tsx`. Live im Styleguide: `/styleguide#media-link`.

## 1. Anatomy

MediaLink rendert einen react-router `<Link to>`, dessen gesamte Zeile klickbar ist (`group flex items-start gap-3`, `rounded-lg`, `p-2`, `transition-colors`). Innenstruktur:

- **Icon-Tile** — `h-8 w-8`, `rounded-md`, `shrink-0`; nimmt das `icon` (eine `lucide-react`-Icon-Instanz als ReactNode) auf. Hintergrund/Vordergrund kommen aus der `accent`-Map.
- **Titel** — `<p>`, `text-sm`, `font-medium`; mit `group-hover`-Akzent.
- **Beschreibung** — `<p>`, `text-xs`, gedaempft.

`forwardRef` leitet auf das `<a>`-Element (`HTMLAnchorElement`). Ueber `Omit<React.ComponentPropsWithoutRef<typeof Link>, 'to' | 'title'>` werden weitere Link-Props durchgereicht; `title` ist bewusst ausgenommen, da es hier die Primaerzeile ist (nicht das HTML-`title`-Attribut). Inhalts-/kontext-agnostisch.

`accent` ist eine Union `'primary' | 'success'` und waehlt ueber die interne `accentTile`-Map die Icon-Tile-Tokens (`--media-link-icon-primary-*` bzw. `--media-link-icon-success-*`); Default ist `primary` (Navy).

UI-States als Properties: **default**, **hover/active** (Row-Tint via `--media-link-hover-bg`, Titel-/Icon-Akzent) und **focus-visible** (Inset-Navy-Ring, §1.11 WCAG 2.4.7, `--color-focus-ring`). `disabled` ist fuer einen nativen Navigations-Link nicht anwendbar.

Token-rein (§1.7): Farben ausschliesslich ueber `--media-link-*`-Component-Tokens in der erlaubten `[var(--token)]`-Form — 0 Roh-Hex/arbitrary-px. Struktur/Spacing/Radius ueber die rem-basierte Tailwind-Skala.

| Prop          | Typ                                                            | Default     | Zweck                                                           |
| ------------- | -------------------------------------------------------------- | ----------- | --------------------------------------------------------------- |
| `to`          | `string`                                                       | — (Pflicht) | Internes Router-Ziel; ganze Zeile klickbar.                     |
| `icon`        | `React.ReactNode`                                              | — (Pflicht) | Fuehrendes Icon (lucide-react-Instanz), im Icon-Tile zentriert. |
| `title`       | `React.ReactNode`                                              | — (Pflicht) | Primaerzeile (fett).                                            |
| `description` | `React.ReactNode`                                              | — (Pflicht) | Sekundaerzeile (gedaempfter Beschreibungstext).                 |
| `accent`      | `'primary' \| 'success'`                                       | `'primary'` | Rollenbasierter Icon-Tile-Akzent.                               |
| `className`   | `string`                                                       | `undefined` | Zusatz-Klassen, via twMerge gemerged.                           |
| `...props`    | `Omit<ComponentPropsWithoutRef<typeof Link>, 'to' \| 'title'>` | —           | Weitere Link-Props (`aria-label`, `onClick`, …).                |

## 2. Playground / Galerie

Specimens unter `/styleguide#media-link`:

- **Default (primary)** — Navy-Icon-Tile, Titel + Beschreibung.
- **accent="success"** — gruener Icon-Tile als zweite Rolle.
- **Hover/Active** — Row-Tint + Titel-/Icon-Akzent.
- **Focus-visible** — Inset-Navy-Ring (Tastatur-Fokus).
- **Langer Titel/Beschreibung** — Umbruch-/Layoutverhalten der zwei Zeilen.

## 3. Usage

Verwenden fuer eine zweizeilige, navigierbare Listenzeile (verwandte Artikel/Services mit Beschreibung). Fuer eine einzeilige erhobene Nav-Kachel stattdessen `NavTile`, fuer eine ruhende Anzeige ohne Link `InfoItem`.

```tsx
import { MediaLink } from '~/design-system'
import { FileText } from 'lucide-react'
;<MediaLink
  to="/vitamin-d3-implantologie"
  icon={<FileText className="h-4 w-4" />}
  title="Vitamin D3 in der Implantologie"
  description="Studienlage und Praxisrelevanz"
/>
```

## 4. Do's & Don'ts

- ✅ Eine `lucide-react`-Icon-Instanz an `icon` uebergeben.
- ✅ `accent="success"` nur fuer die definierte Erfolgs-/Positiv-Rolle nutzen.
- ✅ Titel und Beschreibung beide setzen (zweizeiliges Pattern).
- ❌ MediaLink nicht fuer einzeilige Nav-Kacheln verwenden — dafuer `NavTile`.
- ❌ Kein HTML-`title`-Attribut erwarten — `title` ist hier die Primaerzeile.
- ❌ Keine eigenen Hover-/Focus-Farben per `className` einschleusen.

## 5. Code-Snippet (aus echtem Code)

```tsx
<MediaLink
  to="/vitamin-d3-implantologie"
  icon={<FileText className="h-4 w-4" />}
  title={t('vitd3spray:related.implantology_title')}
  description={t('vitd3spray:related.implantology_desc')}
/>
```

Quelle: `src/pages/VitaminD3SprayPage.tsx:603`
