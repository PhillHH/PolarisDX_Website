# Container

> Horizontal zentrierter Inhalts-Rahmen (Max-Breite + seitliche Gutter). Atomic-Ebene: layout-atom. Quelle (eine Definition, Holy Grail): `src/design-system/primitives-layout/container.tsx`. Live im Styleguide: `/styleguide#container`.

## 1. Anatomy

Rendert ein neutrales `<div>` mit der zentrierenden Wrapper-Signatur `mx-auto max-w-container px-4 lg:px-0`. Diese zuvor über ~12 Seiten/Sektionen roh wiederholte Signatur lebt jetzt einmal hier. Inhalts-/kontextagnostisch (§Phase 2.7) — nur der Rahmen; der Aufrufer reicht den Inhalt als `children`. Per `forwardRef` ref-fähig.

```
<div mx-auto max-w-container px-4 lg:px-0>
  {children}
</div>
```

| Prop        | Typ                                    | Default | Zweck                                                                                                  |
| ----------- | -------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| `className` | `string`                               | –       | Call-site-spezifische Layout-Extras (`py-*`, `text-center`, `relative`, `z-*` …), via `cn()` gemerged. |
| `ref`       | `React.Ref<HTMLDivElement>`            | –       | Weitergereicht an das `<div>` (`forwardRef`).                                                          |
| `...props`  | `React.HTMLAttributes<HTMLDivElement>` | –       | Standard-Div-Attribute.                                                                                |

Container ist ein rein struktureller Layout-Atom: **keine** UI-States (§Phase 6.1) — loading/empty/error/success sind ohne Datenbezug nicht anwendbar (analog `Breadcrumbs`/`Stat`). Token-rein (§1.7): ausschließlich token-/config-gebundene Tailwind-Utilities (`max-w-container` aus der Config, `px-4`/`lg:px-0` auf der rem-basierten Spacing-Skala) — 0 Roh-Hex/arbitrary-px. Vertikale Abstände bleiben bewusst call-site-spezifisch über `className` (kein verfrühtes Generalisieren, §1.20).

## 2. Playground / Galerie

Specimens in `/styleguide#container`:

- Basis: zentrierter Rahmen mit Default-Gutter (`px-4 lg:px-0`)
- Mit `className="text-center"` (zentrierter Inhalt)
- Mit vertikalem Spacing via `className` (`py-12 lg:py-16`)
- Mit Positionierungs-Extras (`relative z-10`)
- Visualisierung der `max-w-container`-Grenze bei breitem Viewport

## 3. Usage

Als äußerer Wrapper jeder Seiten-/Sektions-Inhaltsfläche einsetzen, um konsistente Max-Breite und seitliche Gutter zu garantieren. Vertikale Abstände, Zentrierung und Stacking nicht in den Container bauen — als `className` am Call-Site mitgeben.

```tsx
import { Container } from '~/design-system'
;<Container className="py-12 lg:py-16">{children}</Container>
```

## 4. Do's & Don'ts

- ✅ Als strukturellen Outer-Wrapper für Seiten-/Sektionsinhalte nutzen.
- ✅ Vertikale Abstände (`py-*`) und Layout-Extras (`text-center`, `relative`) über `className` geben.
- ✅ `ref` nutzen, wenn das Wrapper-`<div>` referenziert werden muss.
- ❌ Keine eigene `mx-auto max-w-container px-4`-Signatur roh wiederholen — diesen Container verwenden.
- ❌ Max-Breite/Gutter nicht via `className` überschreiben (`max-w-*`, `px-*`).
- ❌ Keine UI-States erwarten — Container ist rein strukturell, ohne Datenbezug.

## 5. Code-Snippet (aus echtem Code)

```tsx
<Container className="text-center mb-16 relative z-10">
  <Eyebrow size="default" className="mb-8">
    {t('igloo_widget.title', 'Anwendungsbereiche')}
  </Eyebrow>
</Container>
```

Quelle: `src/components/sections/IglooWidgetSection.tsx:47`
