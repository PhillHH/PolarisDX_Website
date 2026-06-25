# Button

> Single Source of Truth fuer jede klickbare Aktion (Button/Link), polymorph ueber `to`/`href`. Atomic-Ebene: atom. Quelle (eine Definition, Holy Grail): `src/design-system/core/button.tsx`. Live im Styleguide: `/styleguide#button`.

## 1. Anatomy

Gerendert wird **ein** Host-Element, das der Aufrufer nicht selbst waehlt, sondern das sich aus den Props ergibt (Polymorphie, §Phase 7.8):

- `to` gesetzt → React-Router-`<Link>` (interne Navigation)
- `href` gesetzt → natives `<a>` (externer/absoluter Link)
- sonst → natives `<button>`

Die komplette Variant-/Size-/State-Logik (`cva`) ist fuer alle drei Host-Elemente identisch — es gibt keine Kopie pro Element. Interaktions-States sind ausschliesslich Properties: `default` / `hover` / `focus-visible` (Ring via `--color-focus-ring`) / `active` / `disabled` (`opacity-50`, `pointer-events-none`). Inhalt (Text, Icon) kommt als `children`; `gap-2` setzt den Abstand Icon ↔ Label.

Token-rein (§1.7): keine Roh-Hex-Werte, keine arbitrary-px — nur Component-Tokens (`--button-*`) und Semantic-Tokens (`--color-*`, `--duration-base`). Tap-Target ≥ 44px (§1.11) ist ueber `--button-min-height` garantiert.

| Prop                    | Typ                                     | Default     | Zweck                                                                                                                                                                               |
| ----------------------- | --------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`               | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | Visuelle Rolle: `primary` = Solid Navy (dominante Aktion, §3.1), `secondary` = Line/Ghost auf hellem Grund, `outline` = weisse Border/Schrift auf dunklem Grund (Hero/Navy-Header). |
| `size`                  | `'default' \| 'sm' \| 'lg' \| 'icon'`   | `'default'` | Groessenachse: `default` (px-8/py-4), `sm` (px-6/py-3), `lg` (px-10/py-5), `icon` (quadratisch, `--button-min-height`).                                                             |
| `to`                    | `string`                                | –           | Interner Router-Link ⇒ rendert `<Link>`.                                                                                                                                            |
| `href`                  | `string`                                | –           | Externer/absoluter Link ⇒ rendert `<a>`.                                                                                                                                            |
| `className`             | `string`                                | –           | Zusatzklassen (per `cn` gemerged) fuer Layout-Anpassung am Einsatzort (z. B. `w-full justify-center`). Nicht fuer neue Optik missbrauchen.                                          |
| `…ButtonHTMLAttributes` | –                                       | –           | Alle nativen Button-Attribute (`type`, `disabled`, `onClick`, `aria-*`, …) werden durchgereicht.                                                                                    |

## 2. Playground / Galerie

In `/styleguide#button` werden alle orthogonalen Achsen vollstaendig auskombiniert:

- Varianten: `primary`, `secondary`, `outline` — `outline` auf dunklem Navy-Panel (sonst unsichtbar)
- Sizes: `default`, `sm`, `lg`, `icon` (Icon-only mit `aria-label`)
- States je Variante: `default`, `hover`, `focus-visible` (Ring), `active`, `disabled`
- Polymorphie-Spezimen: `<button>` (Default), `to="…"` (Router-Link), `href="…"` (`<a>`)
- Edge Cases: Button mit fuehrendem Icon (`gap-2`), `className="w-full"` (Full-Width), langer Label mit Umbruch-Verhalten

## 3. Usage

Fuer jede klickbare Aktion bzw. Call-to-Action verwenden — egal ob `<button>`, interner oder externer Link. Niemals ein rohes `<button>`/`<a>` mit eigener Optik bauen.

```ts
import { Button } from '~/design-system'
```

```tsx
<Button variant="primary" onClick={save}>
  Speichern
</Button>

<Button to="/contact" variant="secondary" size="sm">
  Kontakt
</Button>
```

## 4. Do's & Don'ts

✅ **Do**

- Variante/Size ueber die orthogonalen Props `variant`/`size` waehlen.
- Fuer interne Navigation `to`, fuer externe Links `href` setzen — kein manuelles `<Link>`/`<a>`.
- `outline` nur auf dunklem Grund einsetzen (Hero/Navy-Header).
- Icon-only-Buttons mit `size="icon"` und einem `aria-label` versehen.

❌ **Don't**

- Keine Roh-Hex-/arbitrary-px-Klassen fuer Farbe/Hoehe — das verletzt die Token-Reinheit (§1.7).
- Keine Kopie der Komponente fuer eine „neue" Variante anlegen — Achse in der Quelle ergaenzen.
- `className` nicht fuer eine eigene Farb-/Form-Optik missbrauchen (nur Layout/Position).
- Tap-Target nicht per Override unter 44px druecken (§1.11).

## 5. Code-Snippet (aus echtem Code)

```tsx
<Button
  type="submit"
  variant="primary"
  className="w-full justify-center md:w-auto"
  disabled={isSubmitting}
>
  {isSubmitting ? 'Sende...' : t('contact.form.submit')}
</Button>
```

Quelle: src/components/sections/ContactForm.tsx:124
