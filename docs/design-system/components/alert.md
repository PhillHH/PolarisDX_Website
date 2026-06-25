# Alert

> Inline-Statusmeldung fuer Fehler, Erfolg und Hinweise — Feedback laeuft nie ueber Farbe allein, immer mit Icon + Text. Atomic-Ebene: feedback. Quelle (eine Definition, Holy Grail): `src/design-system/feedback/alert.tsx`. Live im Styleguide: `/styleguide#alert`.

## 1. Anatomy

`Alert` rendert ein `<div>` mit Status-Rolle, das ein fuehrendes Icon (`aria-hidden`) und einen Textblock (optionale `<h5>`-Ueberschrift + `children`) in einem Flex-Layout (`items-start`, `gap`) gruppiert. Das Icon wird aus der `variant` abgeleitet: `success` → `CheckCircle`, sonst `AlertCircle`. Tonalitaet laeuft ueber **eine** orthogonale Achse `variant`, nicht ueber Komponenten-Kopien.

Styling ist **token-rein**: Flaeche, Rahmen, Text, Radius, Gap und Padding ausschliesslich ueber `--alert-*`-Component-Tokens in `[var(--token)]`-Form (kein Roh-Hex, kein arbitrary-px).

**A11y:** Die Rolle ist `variant`-abhaengig — `danger` kuendigt assertiv via `role="alert"` an, `default`/`success` hoeflich via `role="status"` (WCAG, §1.11). Da `Alert` `React.HTMLAttributes<HTMLDivElement>` spreadet, lassen sich alle Standard-Div-Attribute (z. B. `id`, `data-*`) durchreichen.

| Prop        | Typ                                    | Default     | Zweck                                                                                                                                 |
| ----------- | -------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`   | `'default' \| 'success' \| 'danger'`   | `'default'` | Tonalitaet + abgeleitetes Icon (`success`→`CheckCircle`, sonst `AlertCircle`) + abgeleitete Rolle (`danger`→`alert`, sonst `status`). |
| `title`     | `string`                               | –           | Optionale fette `<h5>`-Ueberschrift ueber dem Hinweistext.                                                                            |
| `children`  | `React.ReactNode`                      | –           | Hinweistext (gerendert als `<div class="text-sm opacity-90">`).                                                                       |
| `className` | `string`                               | –           | Zusatzklassen, via `cn()` an die CVA-Basis gemergt.                                                                                   |
| `...props`  | `React.HTMLAttributes<HTMLDivElement>` | –           | Durchgereichte Div-Attribute.                                                                                                         |

## 2. Playground / Galerie

Spezimen unter `/styleguide#alert`:

- `variant="default"` — neutraler Hinweis, `role="status"`, `AlertCircle`.
- `variant="success"` — Erfolgsmeldung, `role="status"`, `CheckCircle`.
- `variant="danger"` — Fehlermeldung, `role="alert"`, `AlertCircle`.
- Mit `title` + `children` (zweizeilig: fette Ueberschrift + Detailtext).
- Nur `children` ohne `title` (einzeiliger Hinweis).
- Edge Case: langer mehrzeiliger Text (Icon bleibt top-aligned via `items-start`/`mt-0.5`).
- Edge Case: nur `title` ohne `children`.

## 3. Usage

Einsetzen fuer Inline-Statusmeldungen direkt im Kontext (Formular-Feedback, Lade-/Ladefehler, leere Such-Fehler) — **nicht** fuer transiente Toasts oder Leerzustaende (dafuer `EmptyState`).

```tsx
import { Alert } from '~/design-system'
;<Alert variant="danger" title="Fehler">
  Der Artikel konnte nicht geladen werden.
</Alert>
```

## 4. Do's & Don'ts

- ✅ `variant="danger"` fuer Fehler nutzen — die assertive `role="alert"`-Ankuendigung ist hier korrekt.
- ✅ Immer Text via `children`/`title` mitgeben — Feedback nie ueber Farbe/Icon allein.
- ✅ Layout-Anpassungen (Breite, Abstand) ueber `className` am Aufrufer, nicht ueber neue Varianten.
- ❌ Keine Roh-Hex-/arbitrary-Farben anhaengen — Tonalitaet laeuft ausschliesslich ueber `variant` + `--alert-*`-Tokens.
- ❌ Keine zusaetzlichen Tonalitaets-Kopien (`warning`, `info` …) erfinden — die Achse ist `variant`.
- ❌ Nicht als Leerzustand zweckentfremden — dafuer existiert `EmptyState`.

## 5. Code-Snippet (aus echtem Code)

```tsx
<Alert variant="danger" title={t('common:error', 'Error')}>
  {error.message || t('shop:shop.articleNotFound', 'Article not found')}
</Alert>
```

`Quelle: src/pages/ArticlePage.tsx:64`
