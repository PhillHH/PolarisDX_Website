# Accordion

> Single-Open Disclosure-Liste, die je Eintrag Trigger + aufklappbaren Inhalt rendert. Atomic-Ebene: molecule. Quelle (eine Definition, Holy Grail): `src/design-system/compound/accordion.tsx`. Live im Styleguide: `/styleguide#accordion`.

## 1. Anatomy

`Accordion` rendert eine `<div>` mit Rahmen/Radius/Schatten und `divide-y`-Trennern. Pro Eintrag in `items` entsteht ein Paar aus:

- `<button>` (Trigger) mit `aria-expanded` und `aria-controls`; zeigt `item.trigger` und ein dekoratives `ChevronDown` (`aria-hidden`, rotiert bei `open`).
- `<div role="region" aria-labelledby={triggerId}>` (Panel) mit `item.content`; auf-/zuklappend ueber `grid-rows-[1fr|0fr]` + Opacity-Transition.

Verhalten: **Single-Open** — maximal ein Eintrag ist offen; ein Klick auf den offenen Eintrag schliesst ihn (`openId` State). Keine `allowMultiple`-Achse. Die Schluessel/`id`s leiten sich aus `item.id` oder `${React.useId()}-${index}` ab; daraus entstehen `${key}-trigger` und `${key}-region` fuer die A11y-Verdrahtung.

**Empty-State**: ist `items` kein Array oder leer, rendert die Komponente `null` statt einer toten Panel-Flaeche. Token-rein: alle Farben/Radius/Schatten ueber `--accordion-*`; Fokus ueber `--color-focus-ring`. `...rest` (HTML-Div-Attribute) liegen am Wurzel-`<div>`.

| Prop        | Typ                                    | Default     | Zweck                                                |
| ----------- | -------------------------------------- | ----------- | ---------------------------------------------------- |
| `items`     | `AccordionItem[]`                      | — (Pflicht) | Disclosure-Eintraege; leer/kein Array ⇒ `null`.      |
| `className` | `string`                               | `undefined` | Zusaetzliche Klassen am Wurzel-`<div>`.              |
| `...rest`   | `React.HTMLAttributes<HTMLDivElement>` | —           | Durchgereichte Div-Attribute (z. B. `id`, `data-*`). |

`AccordionItem`:

| Feld      | Typ               | Default       | Zweck                                                              |
| --------- | ----------------- | ------------- | ------------------------------------------------------------------ |
| `id`      | `string`          | index-basiert | Stabiler Schluessel; Basis fuer `aria-controls`/`aria-labelledby`. |
| `trigger` | `React.ReactNode` | — (Pflicht)   | Trigger-/Frage-Inhalt (im `<button>`).                             |
| `content` | `React.ReactNode` | — (Pflicht)   | Aufklappbarer Inhalt (im `role="region"`).                         |

## 2. Playground / Galerie

Specimens unter `/styleguide#accordion`:

- **Closed (default)** — alle Eintraege zu (`openId === null`).
- **Open** — ein Eintrag offen, Chevron rotiert 180°, Panel expandiert.
- **Single-Open Wechsel** — Klick auf einen anderen Eintrag schliesst den vorherigen.
- **Toggle-Close** — erneuter Klick auf den offenen Eintrag schliesst ihn.
- **Edge-Case Empty** — `items={[]}` → rendert nichts (keine leere Panel-Flaeche).
- **Fokus** — Tastatur-Fokus zeigt den Inset-Ring `--color-focus-ring`.

## 3. Usage

Einsetzen fuer aufklappbare Frage/Antwort- bzw. Disclosure-Listen (z. B. FAQ). Inhalts-agnostisch — der Aufrufer mappt seine Daten auf `{ id, trigger, content }`.

Import ueber den Barrel:

```tsx
import { Accordion } from '~/design-system'

function Example() {
  return (
    <Accordion
      items={[
        { id: 'a', trigger: 'Frage 1?', content: 'Antwort 1.' },
        { id: 'b', trigger: 'Frage 2?', content: 'Antwort 2.' },
      ]}
    />
  )
}
```

## 4. Do's & Don'ts

- ✅ Eigene Daten auf `{ id, trigger, content }` mappen, bevor sie an `items` gehen.
- ✅ Stabile `id`s setzen, damit Keys/A11y-Verdrahtung ueber Re-Renders konstant bleiben.
- ✅ Bei fehlenden Daten leeres Array uebergeben — die Komponente rendert sicher `null`.
- ✅ `trigger`/`content` als `ReactNode` nutzen (auch Rich-Content moeglich).
- ❌ Kein eigenes Disclosure-Widget mit `useState` + `aria-expanded` von Hand bauen.
- ❌ Nicht erwarten, dass mehrere Eintraege gleichzeitig offen sind — Verhalten ist Single-Open.
- ❌ Keine Roh-Hex-Farben/arbitrary-px hineinreichen — Optik laeuft ueber `--accordion-*`-Tokens.
- ❌ Den dekorativen Chevron nicht semantisch missbrauchen (er ist `aria-hidden`).

## 5. Code-Snippet (aus echtem Code)

```tsx
const accordionItems = Array.isArray(faqItems)
  ? faqItems.map((item, index) => ({
      id: `faq-${index}`,
      trigger: item.question,
      content: item.answer,
    }))
  : []

// …
<Accordion items={accordionItems} />
```

Quelle: `src/components/sections/FAQSection.tsx:53`
