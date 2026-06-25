# FormField

> Komponiert genau ein Eingabe-Atom mit Label, optionalem Helper- und Error-Text zu einer funktionalen Einheit. Atomic-Ebene: molecule. Quelle (eine Definition, Holy Grail): `src/design-system/compound/form-field.tsx`. Live im Styleguide: `/styleguide#form-field`.

## 1. Anatomy

`FormField` wrappt **ein** Eingabe-Atom (`Input` / `Textarea` / `Select`) in eine `<div class="grid gap-1.5">` und ergaenzt:

- `<label htmlFor={fieldId}>` — sichtbares, mit dem Feld verknuepftes Label (Pflicht, kein Placeholder-as-Label).
- Das Host-Element, gewaehlt ueber die orthogonale `as`-Achse (kein Klon pro Variante).
- `<p role="alert">` (Error) **oder** `<p>` (Helper) — sich gegenseitig ausschliessend.

Die Feld-`id` wird aus `id` oder `React.useId()` abgeleitet. Daraus entstehen `${id}-error` und `${id}-helper`. A11y-Verdrahtung: `aria-invalid` ist im Error-State `true`, `aria-describedby` referenziert die aktive Error-/Helper-`id`, die Fehlermeldung traegt `role="alert"`. Der State (`default` ↔ `error`) leitet sich allein aus `error` ab und wird an das Atom durchgereicht.

`as` ist eine diskriminierte Union — je nach Wert erbt `FormField` zusaetzlich `InputProps` / `TextareaProps` / `SelectProps` (z. B. `type`, `placeholder`, `required`, `disabled`, `name`, `value`, `onChange`). Diese werden via `...rest` an das jeweilige Atom durchgereicht.

| Prop         | Typ                                          | Default         | Zweck                                                                                            |
| ------------ | -------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------ |
| `label`      | `string`                                     | — (Pflicht)     | Sichtbares, per `htmlFor`/`id` verknuepftes Label.                                               |
| `error`      | `string`                                     | `undefined`     | Klartext-Fehlermeldung; gesetzt ⇒ Feld geht in den Error-State (`aria-invalid`, `role="alert"`). |
| `helperText` | `React.ReactNode`                            | `undefined`     | Unterstuetzender Hinweis; wird ausgeblendet, sobald `error` anliegt.                             |
| `as`         | `'input' \| 'textarea' \| 'select'`          | `'input'`       | Waehlt das Host-Atom (orthogonale Achse).                                                        |
| `id`         | `string`                                     | `React.useId()` | Feld-`id`; Basis fuer Error-/Helper-`id`.                                                        |
| `className`  | `string`                                     | `undefined`     | Klassen-Override fuer das Eingabe-Atom.                                                          |
| `...rest`    | `InputProps \| TextareaProps \| SelectProps` | —               | An das gewaehlte Atom durchgereichte Props (`type`, `required`, `disabled`, `name`, …).          |

## 2. Playground / Galerie

Specimens unter `/styleguide#form-field`:

- **Default** — `as="input"`, nur `label` + `placeholder`.
- **Helper** — mit `helperText` (untergeordneter Hinweis).
- **Error** — mit `error` (Helper verschwindet, `role="alert"`, `aria-invalid`).
- **Disabled** — durchgereichtes `disabled`.
- **Varianten der `as`-Achse** — `as="textarea"` (mehrzeilig) und `as="select"` (Optionen als Children).
- **Edge-Case Error vs. Helper** — beide gesetzt: nur `error` rendert (gegenseitiger Ausschluss).

## 3. Usage

Einsetzen, wann immer ein einzelnes Formularfeld mit Label benoetigt wird — nie Label/Error von Hand bauen. `FormField` ist die Single Source of Truth fuer die Verdrahtung von Label, Feld und Statusmeldung.

Import ueber den Barrel:

```tsx
import { FormField } from '~/design-system'

function Example() {
  return (
    <FormField
      label="E-Mail"
      type="email"
      required
      helperText="Wir antworten innerhalb eines Werktags."
    />
  )
}
```

## 4. Do's & Don'ts

- ✅ `label` immer setzen — es ist Pflicht und wird per `htmlFor` verdrahtet.
- ✅ `error` als Klartext setzen; die A11y-Verdrahtung (`aria-invalid`, `role="alert"`, `aria-describedby`) passiert automatisch.
- ✅ Feldtyp ueber `as` waehlen (`'textarea'` / `'select'`) statt eine zweite Komponente zu bauen.
- ✅ Form-spezifische Props (`required`, `disabled`, `name`) einfach durchreichen — sie landen am Atom.
- ❌ Kein eigenes `<label>` oder `<p role="alert">` daneben bauen — das ist genau die Aufgabe dieser Molecule.
- ❌ Placeholder nicht als Label-Ersatz missbrauchen.
- ❌ `error` und `helperText` nicht gleichzeitig erwarten — `error` gewinnt, Helper wird ausgeblendet.
- ❌ Die rohen Atome (`Input`/`Textarea`/`Select`) nicht direkt in Formularen verwenden, wenn ein Label gebraucht wird.

## 5. Code-Snippet (aus echtem Code)

```tsx
<FormField
  id="name"
  name="name"
  type="text"
  required
  label={t('contact.form.name')}
  placeholder={t('contact.form.name_placeholder')}
/>
```

Quelle: `src/components/sections/ContactForm.tsx:46`
