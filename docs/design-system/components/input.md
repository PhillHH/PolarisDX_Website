# Input

> Single Source of Truth fuer das nackte einzeilige `<input>`-Feld — Label/Helper/Error liefert das `FormField`-Molecule. Atomic-Ebene: atom. Quelle (eine Definition, Holy Grail): `src/design-system/core/input.tsx`. Live im Styleguide: `/styleguide#input`.

## 1. Anatomy

Gerendert wird bewusst **nur** das native `<input>`-Element — kein Label, kein Helper-, kein Error-Text. Diese gehoeren in das `FormField`-Molecule (§Phase 2.3: Atom = `Input`, Molecule = `FormField`). Dadurch bleibt das Atom fuer alle Eingabetypen (`text`, `email`, `tel`, `password`, …) wiederverwendbar.

States sind ausschliesslich Properties: `default` / `focus-visible` (Ring) / `disabled` (`cursor-not-allowed`, `opacity-50`) plus die orthogonale `state`-Achse (`default` ↔ `error`).

Token-rein (§1.7): konsumiert ausschliesslich Component-Tokens (`--input-*`) und Semantic-Tokens (`--color-focus-ring`, `--duration-base`) ueber die erlaubte `[var(--token)]`-Form (§3) — kein Roh-Hex, kein arbitrary-px. Schrift ≥ 16px (`--input-font-size`, verhindert iOS-Auto-Zoom) und Tap-Target ≥ 44px (`--input-min-height`) sind per Token garantiert (§1.11 / §FIL).

| Prop                                 | Typ                    | Default     | Zweck                                                                                                                                                                                              |
| ------------------------------------ | ---------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `state`                              | `'default' \| 'error'` | `'default'` | Validierungs-Optik: `error` setzt Border/Schrift/Ring auf die Danger-Rolle. Wird in `FormField` automatisch aus `error` abgeleitet.                                                                |
| `className`                          | `string`               | –           | Zusatzklassen (per `cn` gemerged) fuer Layout. Nicht fuer Eigen-Optik.                                                                                                                             |
| `…InputHTMLAttributes` (ohne `size`) | –                      | –           | Alle nativen Input-Attribute (`type`, `name`, `value`, `placeholder`, `required`, `disabled`, `aria-*`, …). `size` ist bewusst `Omit`-tet, um Kollision mit der HTML-`size`-Property zu vermeiden. |

## 2. Playground / Galerie

In `/styleguide#input` werden gezeigt:

- `state`: `default`, `error`
- Interaktions-States: `default`, `focus-visible` (Ring), `disabled`
- Mit/ohne `placeholder` (Placeholder ist nie Label-Ersatz)
- Verschiedene `type`-Werte: `text`, `email`, `tel`, `password`
- Edge Cases: sehr langer Wert (Overflow/Ellipsis), `aria-invalid` im Error-State, eingebettet in `FormField` (Label + Helper + Error)

## 3. Usage

Fuer jedes einzeilige Texteingabe-Feld. In der Praxis fast immer ueber das `FormField`-Molecule (Default `as="input"`), das Label/Helper/Error und die A11y-Verdrahtung beisteuert. Das blanke `Input` nur dort direkt nutzen, wo kein sichtbares Label noetig ist (z. B. Such-Eingabe in einem Modal).

```ts
import { Input } from '~/design-system'
```

```tsx
<Input type="email" name="email" placeholder="you@example.com" required />
```

## 4. Do's & Don'ts

✅ **Do**

- Fuer Formulare das `FormField`-Molecule verwenden (liefert Label + A11y).
- Den `state` aus dem Validierungsergebnis ableiten (`error` ⇒ `state="error"`).
- Eingabetyp ueber das native `type`-Attribut steuern.
- Mindestschrift/Tap-Target (Tokens) unangetastet lassen.

❌ **Don't**

- Keinen Placeholder als Label missbrauchen — Label gehoert ins `FormField`.
- Keine Roh-Hex-/arbitrary-px-Klassen fuer Border/Hoehe/Farbe (§1.7).
- Kein eigenes „Error"-Styling per `className` — dafuer ist `state="error"` da.
- Die `size`-HTML-Property nicht erzwingen — sie ist bewusst entfernt.

## 5. Code-Snippet (aus echtem Code)

> `Input` wird produktiv ueber das `FormField`-Molecule (Default `as="input"`) eingesetzt; FormField rendert intern `<Input state … />`.

```tsx
<FormField
  id="email"
  name="email"
  type="email"
  required
  label={t('contact.form.email')}
  placeholder={t('contact.form.email_placeholder')}
/>
```

Quelle: src/components/sections/ContactForm.tsx:63
