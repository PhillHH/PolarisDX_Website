# Textarea

> Single Source of Truth fuer das nackte mehrzeilige `<textarea>`-Feld — mehrzeiliges Gegenstueck zu `Input`. Atomic-Ebene: atom. Quelle (eine Definition, Holy Grail): `src/design-system/core/textarea.tsx`. Live im Styleguide: `/styleguide#textarea`.

## 1. Anatomy

Gerendert wird bewusst **nur** das native `<textarea>`-Element. Es ist ein eigenes Atom (kein `Input`-Klon), weil `<textarea>` ein anderes Host-Element mit eigener Semantik ist. Label/Helper/Error liefert das `FormField`-Molecule (§Phase 2.3) — das Atom bleibt das blanke Feld.

States sind ausschliesslich Properties: `default` / `focus-visible` (Ring) / `disabled` (`cursor-not-allowed`, `opacity-50`) plus die orthogonale `state`-Achse (`default` ↔ `error`).

Token-rein (§1.7): konsumiert nur Component-Tokens (`--input-*`) und Semantic-Tokens (`--color-focus-ring`, `--duration-base`) ueber `[var(--token)]` (§3) — kein Roh-Hex, kein arbitrary-px. Die Mindesthoehe stammt aus dem eigenen Token `--input-textarea-min-height` (groesser als beim einzeiligen `Input`); Schrift ≥ 16px (`--input-font-size`).

| Prop                      | Typ                    | Default     | Zweck                                                                                                              |
| ------------------------- | ---------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------ |
| `state`                   | `'default' \| 'error'` | `'default'` | Validierungs-Optik: `error` setzt Border/Schrift/Ring auf die Danger-Rolle. In `FormField` aus `error` abgeleitet. |
| `className`               | `string`               | –           | Zusatzklassen (per `cn` gemerged) fuer Layout. Nicht fuer Eigen-Optik.                                             |
| `…TextareaHTMLAttributes` | –                      | –           | Alle nativen Textarea-Attribute (`name`, `rows`, `value`, `placeholder`, `required`, `disabled`, `aria-*`, …).     |

## 2. Playground / Galerie

In `/styleguide#textarea` werden gezeigt:

- `state`: `default`, `error`
- Interaktions-States: `default`, `focus-visible` (Ring), `disabled`
- Verschiedene `rows`-Werte (z. B. `rows={3}`, `rows={6}`) zur Hoehensteuerung
- Mit/ohne `placeholder`
- Edge Cases: langer Mehrzeilen-Text (vertikales Scrollen), `aria-invalid` im Error-State, eingebettet in `FormField` (Label + Error)

## 3. Usage

Fuer laengere, mehrzeilige Freitexteingaben (Nachrichten, Anforderungen, Kommentare). In der Praxis ueber das `FormField`-Molecule mit `as="textarea"`.

```ts
import { Textarea } from '~/design-system'
```

```tsx
<Textarea name="message" rows={4} placeholder="Ihre Nachricht…" required />
```

## 4. Do's & Don'ts

✅ **Do**

- Fuer Formulare `FormField` mit `as="textarea"` nutzen (Label + A11y inklusive).
- Die sichtbare Standardhoehe ueber `rows` steuern.
- Den `state` aus der Validierung ableiten (`error` ⇒ `state="error"`).

❌ **Don't**

- Kein `Input` „aufblasen" fuer mehrzeilige Eingabe — dafuer existiert dieses Atom.
- Keine Roh-Hex-/arbitrary-px-Klassen fuer Border/Hoehe/Farbe (§1.7).
- Kein eigenes Error-Styling per `className` — dafuer ist `state="error"` da.

## 5. Code-Snippet (aus echtem Code)

> `Textarea` wird produktiv ueber das `FormField`-Molecule mit `as="textarea"` eingesetzt; FormField rendert intern `<Textarea state … />`.

```tsx
<FormField
  as="textarea"
  id="requirements"
  name="requirements"
  rows={4}
  required
  label={t('contact.form.requirements_label')}
  placeholder={t('contact.form.requirements_placeholder')}
/>
```

Quelle: src/components/sections/ContactForm.tsx:80
