# Spinner

> Lade-Indikator — der Loading-State der Feedback-Familie. Atomic-Ebene: feedback. Quelle (eine Definition, Holy Grail): `src/design-system/feedback/spinner.tsx`. Live im Styleguide: `/styleguide#spinner`.

## 1. Anatomy

`Spinner` ist die Single Source of Truth fuer den **Lade-Status** (Industriestandard-Name, ohne `Loading`-Praefix). Struktur: ein `<span role="status">` mit `inline-flex`, darin das rotierende `Loader2`-Icon (`lucide-react`, `animate-spin`, `aria-hidden`) und optional ein `<span className="sr-only">` mit der `label`-Statusbeschriftung. Styling ist token-rein: die Farbe laeuft ueber das CSS-Custom-Property `--spinner-color` (`text-[var(--spinner-color)]`), die Groessen ueber die Tailwind-Skala — kein Roh-Hex, keine arbitrary-px. A11y: `role="status"` macht den Ladezustand fuer Screenreader ansagbar; das Icon ist `aria-hidden`, die sichtbar-versteckte `label`-Prop liefert den Text (i18n bleibt Sache des Aufrufers, kein Literal hier).

| Prop        | Typ                    | Default | Zweck                                                                                              |
| ----------- | ---------------------- | ------- | -------------------------------------------------------------------------------------------------- |
| `size`      | `'sm' \| 'md' \| 'lg'` | `'md'`  | Icon-Groesse: `sm`=h-4/w-4 (16px), `md`=h-8/w-8 (32px), `lg`=h-12/w-12 (48px).                     |
| `label`     | `string`               | –       | Sichtbar-versteckte (`sr-only`) Statusbeschriftung fuer Screenreader; nur gerendert, wenn gesetzt. |
| `className` | `string`               | –       | Zusatz-Klassen am Icon, via `cn()` zusammengefuehrt.                                               |

UI-State: `Spinner` **ist** der loading-State der Feedback-Familie — anders als die Layout-Primitives (Stack/Cluster/Grid), die bewusst keine UI-States haben. Er hat selbst keine weiteren empty/error/success-Varianten; das sind Aufgaben anderer Feedback-Komponenten.

## 2. Playground / Galerie

Im Styleguide unter `/styleguide#spinner`:

- Default (`size="md"`) — 32px-Lade-Indikator.
- `size`-Galerie: `sm` (16px), `md` (32px), `lg` (48px).
- Mit `label` (z. B. `label="Lade …"`) — `sr-only`-Beschriftung fuer Screenreader (visuell identisch, im Accessibility-Tree praesent).
- Ohne `label` — nur `role="status"`, kein `sr-only`-Span.
- Edge Case: Farbe ueber `--spinner-color` in unterschiedlichen Kontexten (Light/Dark).
- Edge Case: zentriert in einem Full-Height-Container (typischer Seiten-Ladezustand).

## 3. Usage

Verwenden als Loading-State, waehrend Daten oder eine Seite laden — zentriert in einem Container oder inline in einem Button/Suchfeld. Eine `label`-Prop fuer Screenreader setzen, wenn der Spinner allein steht.

```tsx
import { Spinner } from '~/design-system'

export function LadeBereich({ loading }: { loading: boolean }) {
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" label="Lade …" />
      </div>
    )
  }
  return null
}
```

## 4. Do's & Don'ts

- ✅ `size` aus `sm/md/lg` waehlen — Groessen rasten auf die Tailwind-Skala.
- ✅ `label` setzen, wenn der Spinner allein einen Ladezustand ankuendigt (A11y, `role="status"`).
- ✅ Den i18n-Text fuer `label` aufruferseitig liefern — die Komponente haelt keine Literale.
- ❌ Keine Roh-Hex/arbitrary-px-Farben — die Farbe kommt aus `--spinner-color`.
- ❌ Kein `Loading`-Praefix erfinden — die Komponente heisst `Spinner` (Industriestandard).
- ❌ Den Spinner nicht fuer empty/error/success zweckentfremden — er ist ausschliesslich der loading-State.

## 5. Code-Snippet (aus echtem Code)

```tsx
// Handle Loading
if (loading) {
  return (
    <div className="flex h-screen items-center justify-center bg-bg">
      <Spinner size="lg" />
    </div>
  )
}
```

Quelle: `src/pages/ArticlePage.tsx:53`
