# Panel

> Ruhende, bordered/elevated Inhalts-Flaeche fuer Formular- und Info-Bloecke — die Single Source of Truth fuer die zuvor in `ContactPage`/`SupportPage` roh gepflegte weisse Form-/Info-Flaeche. Atomic-Ebene: molecule. Quelle (eine Definition, Holy Grail): `src/design-system/compound/panel.tsx`. Live im Styleguide: `/styleguide#panel`.

## 1. Anatomy

`Panel` ist die **statische** Inhalts-Flaeche (`React.forwardRef`) und rendert standardmaessig ein semantisches `<section>`; ueber `as` waehlbar `div` fuer eingebettete Boxen ohne eigenen Dokument-Outline-Abschnitt. Inhalts-/kontext-agnostisch: der Aufrufer reicht den Inhalt als `children`.

Styling ist **token-rein**: Flaeche/Radius/Schatten/Rahmen ausschliesslich ueber `--panel-*`-Component-Tokens in `[var(--token)]`-Form (0 Roh-Hex/arbitrary-px). Padding laeuft bewusst ueber die rem-basierte Tailwind-Skala (nicht token-remappt). Drei orthogonale Achsen plus `as`: `padding` (`sm`/`md`/`lg`), `bordered`, `radius` (`md`/`lg`).

**Radius-Detail:** `lg` (Default) = `--panel-radius`-Token (16px); `md` = `rounded-xl` (12px) ueber die Tailwind-Skala — bewusst **nicht** auf ein Token remappt, da `--radius-md` 8px ist und ein Remap ein stiller Wertewechsel waere.

**Abgrenzung zu `Card`:** `Panel` ist die **ruhende** Flaeche (kein Hover-Lift, keine Link-Semantik) fuer Formular-/Info-Bloecke; `Card` ist die **erhobene, klickbare** Glass-Karte. Bewusst zwei distinkte Containment-Patterns, nicht eine ueberladene Komponente.

| Prop        | Typ                                 | Default     | Zweck                                                                                      |
| ----------- | ----------------------------------- | ----------- | ------------------------------------------------------------------------------------------ |
| `padding`   | `'sm' \| 'md' \| 'lg'`              | `'md'`      | Innenabstand: `sm` (`p-5`, Sidebar-Widget), `md` (`p-6`, Info), `lg` (`p-6 lg:p-8`, Form). |
| `bordered`  | `boolean`                           | `false`     | Rahmen-Achse: `border` ueber rollenbasierten `--panel-border`-Token.                       |
| `radius`    | `'md' \| 'lg'`                      | `'lg'`      | Radius: `lg` = `--panel-radius`-Token (16px), `md` = `rounded-xl` (12px, Tailwind-Skala).  |
| `as`        | `'section' \| 'div'`                | `'section'` | Host-Element: `section` (eigener Outline-Abschnitt) oder `div` (eingebettete Box).         |
| `className` | `string`                            | –           | Zusatzklassen, via `cn()` an die CVA-Basis gemergt.                                        |
| `ref`       | `React.Ref<HTMLElement>`            | –           | Forwarded Ref auf das Host-Element.                                                        |
| `...props`  | `React.HTMLAttributes<HTMLElement>` | –           | Durchgereichte Element-Attribute (inkl. `children`).                                       |

## 2. Playground / Galerie

Spezimen unter `/styleguide#panel`:

- `padding="sm"` / `"md"` / `"lg"` (Sidebar-Widget vs. Info-Panel vs. Formular).
- `bordered={false}` (Default, nur Schatten) vs. `bordered` (Rahmen + Schatten).
- `radius="lg"` (Token, 16px) vs. `radius="md"` (`rounded-xl`, 12px) — fuer engere Related-/Download-Boxen.
- Polymorphie: `as="section"` (Default) vs. `as="div"` (eingebettete Box).
- Edge Case: `as="div" bordered padding="sm" radius="md"` (Sidebar-/Related-Widget).
- Edge Case: `padding="lg"` Form-Panel mit `className="space-y-6"`.

## 3. Usage

Einsetzen fuer **ruhende** Container — Formular-Karten, Info-/Kontaktbloecke, Sidebar-Widgets, Related-/Download-Boxen. Fuer erhobene, klickbare Karten in Grids stattdessen `Card`.

```tsx
import { Panel } from '~/design-system'
;<Panel padding="lg" className="space-y-6">
  …
</Panel>
```

## 4. Do's & Don'ts

- ✅ `padding="lg"` fuer Formular-Karten, `sm` fuer kompakte Sidebar-Widgets.
- ✅ `as="div"` fuer eingebettete Boxen, die keinen eigenen Dokument-Outline-Abschnitt brauchen.
- ✅ `radius="md"` bewusst fuer engere Related-/Download-Boxen — der 12px/16px-Unterschied ist intendiert.
- ❌ Keinen Hover-Lift/keine Link-Semantik nachruesten — dafuer existiert `Card`.
- ❌ Keine Roh-Rahmen/-Schatten via arbitrary-px — Flaeche laeuft ueber `--panel-*`-Tokens.
- ❌ `radius="md"` nicht als „dasselbe wie `--radius-md`" annehmen — es ist `rounded-xl` (12px), nicht 8px.

## 5. Code-Snippet (aus echtem Code)

```tsx
<Panel padding="lg" className="space-y-6">
  …
</Panel>
```

`Quelle: src/pages/SupportPage.tsx:63`
