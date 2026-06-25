# Eyebrow

> Gradient-umrandete Section-Label-Pill als Kicker über Titeln. Atomic-Ebene: atom. Quelle (eine Definition, Holy Grail): `src/design-system/core/eyebrow.tsx`. Live im Styleguide: `/styleguide#eyebrow`.

## 1. Anatomy

Drei verschachtelte Ebenen: ein äußeres `<div>` trägt den Gradient-Rand (`p-px` + `bg-gradient-to-r`, gerundet), ein inneres `<div>` füllt die Fläche (`--eyebrow-bg`) und definiert das Padding, ein `<span>` rendert das Label in Caption-Typo. Bewusst kontext-/inhaltsagnostisch (§Phase 2.7): kein erzwungenes `<h2>`, keine Titelfarbe — nur die Pill.

```
<div gradient-border>
  <div surface>
    <span caption>{children}</span>
  </div>
</div>
```

| Prop        | Typ                 | Default     | Zweck                                                                                                |
| ----------- | ------------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| `children`  | `React.ReactNode`   | –           | Label-Inhalt der Pill (Pflicht).                                                                     |
| `size`      | `'default' \| 'sm'` | `'default'` | Orthogonale Größen-Achse — reproduziert die zwei live gefundenen Varianten (Padding + Schriftgröße). |
| `className` | `string`            | –           | Passthrough am äußeren Wrapper, typ. Layout-Margins (`mb-2`, `mb-8`).                                |

Token-rein (§1.7): Fläche, Schrift und Radius über `--eyebrow-*`-Component-Tokens (`--eyebrow-radius`, `--eyebrow-bg`, `--eyebrow-fg`); der Gradient-Rand läuft über die token-gebundenen `brand-*`-Config-Keys (`from-brand-secondary via-brand-primary to-brand-deep`) plus `shadow-glow-primary` — kein Roh-Hex, kein arbitrary-px.

## 2. Playground / Galerie

Specimens in `/styleguide#eyebrow`:

- `size="default"` (größeres Padding `px-4 py-2`, responsiv `lg:px-3 lg:py-1`, `text-sm` → `lg:text-xs`)
- `size="sm"` (`px-3 py-1`, `text-xs`)
- Edge-Case: kurzes vs. langes Label (Pill bleibt `inline-block`)
- Edge-Case: mit Layout-Margin via `className` (`mb-8`)
- Sichtbar: Gradient-Rand + `shadow-glow-primary` auf hellem und dunklem Grund

## 3. Usage

Als Kicker/Overline über Section-Titeln einsetzen (Hero, Widget-Sektionen, `SectionHeader`-Molecule). Nicht als eigenständige Überschrift und nicht für längere Texte verwenden.

```tsx
import { Eyebrow } from '~/design-system'
;<Eyebrow size="sm" className="mb-2">
  Über uns
</Eyebrow>
```

## 4. Do's & Don'ts

- ✅ Über einem Titel als Overline platzieren und Abstand via `className`-Margin steuern.
- ✅ `size="default"` für Hero-/Hauptsektionen, `size="sm"` für kompaktere Kontexte.
- ✅ Kurze, prägnante Labels nutzen (das `span` ist `uppercase tracking-wide`).
- ❌ Nicht als semantische Überschrift (`<h2>`) zweckentfremden — Eyebrow rendert keine Heading.
- ❌ Gradient-Rand/Glow nicht via `className` überschreiben.
- ❌ Keine eigene Pill mit gleichem Gradient-Border nachbauen — diese Definition nutzen.

## 5. Code-Snippet (aus echtem Code)

```tsx
<Container className="text-center mb-16 relative z-10">
  <Eyebrow size="default" className="mb-8">
    {t('igloo_widget.title', 'Anwendungsbereiche')}
  </Eyebrow>
</Container>
```

Quelle: `src/components/sections/IglooWidgetSection.tsx:48`
