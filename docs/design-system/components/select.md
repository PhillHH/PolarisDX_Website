# Select

> Single Source of Truth fuer das nackte einzeilige `<select>`-Auswahlfeld — drittes Eingabe-Atom neben `Input`/`Textarea`. Atomic-Ebene: atom. Quelle (eine Definition, Holy Grail): `src/design-system/core/select.tsx`. Live im Styleguide: `/styleguide#select`.

## 1. Anatomy

Gerendert wird bewusst **nur** das native `<select>`-Element. Es ist ein eigenes Atom, weil `<select>` ein eigenes Host-Element mit eigener Semantik ist. Die Optionen reicht der Aufrufer als `children` (`<option>`) durch; das native Dropdown-Verhalten — inkl. OS-Pfeil und Tastatur-Steuerung — bleibt erhalten (§1.6, A11y §1.11). Label/Helper/Error liefert das `FormField`-Molecule (§Phase 2.3).

States sind ausschliesslich Properties: `default` / `focus-visible` (Ring) / `disabled` (`cursor-not-allowed`, `opacity-50`) plus die orthogonale `state`-Achse (`default` ↔ `error`).

Token-rein (§1.7): teilt die Feld-Familie und konsumiert ausschliesslich die `--input-*`-Component-Tokens ueber `[var(--token)]` (§3) — kein Roh-Hex, kein arbitrary-px. Schrift ≥ 16px (`--input-font-size`, verhindert iOS-Auto-Zoom) und Tap-Target ≥ 44px (`--input-min-height`) per Token (§1.11 / §FIL).

| Prop                                  | Typ                    | Default     | Zweck                                                                                                                                                                                                    |
| ------------------------------------- | ---------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `state`                               | `'default' \| 'error'` | `'default'` | Validierungs-Optik: `error` setzt Border/Schrift/Ring auf die Danger-Rolle. In `FormField` aus `error` abgeleitet.                                                                                       |
| `children`                            | `React.ReactNode`      | –           | Die `<option>`-Elemente (inkl. optionalem `<optgroup>`). Vom Aufrufer durchgereicht — natives Dropdown bleibt erhalten.                                                                                  |
| `className`                           | `string`               | –           | Zusatzklassen (per `cn` gemerged) fuer Layout. Nicht fuer Eigen-Optik.                                                                                                                                   |
| `…SelectHTMLAttributes` (ohne `size`) | –                      | –           | Alle nativen Select-Attribute (`name`, `value`, `defaultValue`, `required`, `disabled`, `multiple`, `aria-*`, …). `size` ist bewusst `Omit`-tet, um Kollision mit der HTML-`size`-Property zu vermeiden. |

## 2. Playground / Galerie

In `/styleguide#select` werden gezeigt:

- `state`: `default`, `error`
- Interaktions-States: `default`, `focus-visible` (Ring), `disabled`
- Mit Platzhalter-Option (`<option value="" disabled>`) vs. vorausgewaehlter Option
- Wenige vs. viele Optionen (OS-Pfeil + Tastatur-Steuerung)
- Edge Cases: lange Option-Labels, `aria-invalid` im Error-State, eingebettet in `FormField` (Label + Error)

## 3. Usage

Fuer eine Auswahl aus einer fixen Liste (Kategorie, Land, Bereich). In der Praxis ueber das `FormField`-Molecule mit `as="select"`; die `<option>`-Kinder kommen vom Aufrufer.

```ts
import { Select } from '~/design-system'
```

```tsx
<Select name="area" defaultValue="">
  <option value="" disabled>
    Bitte waehlen…
  </option>
  <option value="pharmacy">Apotheke</option>
  <option value="practice">Praxis</option>
</Select>
```

## 4. Do's & Don'ts

✅ **Do**

- Fuer Formulare `FormField` mit `as="select"` nutzen (Label + A11y inklusive).
- Optionen als native `<option>`-`children` durchreichen (Tastatur/OS-Verhalten erhalten).
- Den `state` aus der Validierung ableiten (`error` ⇒ `state="error"`).

❌ **Don't**

- Kein eigenes JS-Dropdown nachbauen, wenn eine fixe Liste genuegt — natives `<select>` ist zugaenglich (§1.6).
- Keine Roh-Hex-/arbitrary-px-Klassen fuer Border/Hoehe/Farbe (§1.7).
- Den OS-Pfeil nicht „wegstylen" und durch ein nicht-fokussierbares Eigen-Icon ersetzen.

## 5. Code-Snippet (aus echtem Code)

> `Select` wird produktiv ueber das `FormField`-Molecule mit `as="select"` eingesetzt; FormField rendert intern `<Select state … >{children}</Select>`.

```tsx
<FormField as="select" id="area" name="area" label={t('contact.form.area_label')}>
  <option value="pharmacy">{t('contact.form.area_options.pharmacy')}</option>
  <option value="practice">{t('contact.form.area_options.practice')}</option>
  <option value="vet">{t('contact.form.area_options.vet')}</option>
  <option value="lab">{t('contact.form.area_options.lab')}</option>
  <option value="other">{t('contact.form.area_options.other')}</option>
</FormField>
```

Quelle: src/components/sections/ContactForm.tsx:72
