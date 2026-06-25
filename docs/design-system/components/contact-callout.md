# ContactCallout

> Kompakte, gerahmte Sidebar-Telefon-Kontaktbox: Icon-Medaillon plus Titel/Subtitel plus dedizierte `tel:`-Aktion plus Hinweiszeile. Atomic-Ebene: molecule. Quelle (eine Definition, Holy Grail): `src/design-system/compound/contact-callout.tsx`. Live im Styleguide: `/styleguide#contact-callout`.

## 1. Anatomy

ContactCallout ist eine ruhende, gerahmte Box (`rounded-xl`, `border`, `p-5`, `shadow`) mit **einer** dedizierten Tel-Aktion. Aufbau:

- **Kopf** — Icon-Medaillon (`h-10 w-10`, `rounded-full`, `aria-hidden="true"`) plus Titel (`text-sm font-medium`) und optionalem Subtitel (`text-xs`, gedaempft).
- **Tel-Aktion** — nativer `<a href={phoneHref}>` (`tel:…`), zentriert, `font-semibold`, mit `min-h-[var(--tap-target-min)]` als Tap-Target ≥44px (WCAG). Inhalt ist `phoneLabel` (typischerweise Icon + Nummer).
- **Hinweis** — optionaler `note`-Text (`text-xs`, zentriert) unter dem Button.

`forwardRef` leitet auf das aeussere `<div>` (`HTMLDivElement`). Da `title` als eigene Prop dient, ist das HTML-`title`-Attribut via `Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>` ausgenommen. Inhalts-/kontext-agnostisch: die Box kennt keine Telefonnummer.

A11y (§1.11): das Icon ist dekorativ (`aria-hidden`); der Tel-Link ist nativ (tastatur-/screenreader-bedienbar) mit sichtbarem Fokus (Navy-Ring mit Offset, `--color-focus-ring`, WCAG 2.4.7) und hover/active.

Token-rein (§1.7): Farben/Schatten ausschliesslich ueber `--callout-*`-Component-Tokens (Border, BG, Shadow, Icon-BG/FG, Title-FG, Muted-FG, Action-BG/FG inkl. `-hover`) in der erlaubten `[var(--token)]`-Form — 0 Roh-Hex/arbitrary-px. Struktur/Spacing/Radius ueber die rem-basierte Tailwind-Skala. UI-States (loading/empty/error/success) sind ohne Datenbezug nicht anwendbar (analog NavTile/Container). Pflicht-Inhalte: `title`, `phoneHref`, `phoneLabel`.

| Prop         | Typ                                                   | Default     | Zweck                                                                 |
| ------------ | ----------------------------------------------------- | ----------- | --------------------------------------------------------------------- |
| `icon`       | `React.ReactNode`                                     | — (Pflicht) | Fuehrendes Icon im Medaillon (Groesse vom Aufrufer, Farbe per Token). |
| `title`      | `React.ReactNode`                                     | — (Pflicht) | Ueberschrift der Box (z. B. „Fragen zur Bestellung?").                |
| `subtitle`   | `React.ReactNode`                                     | `undefined` | Erlaeuternder Subtitel unter der Ueberschrift.                        |
| `phoneHref`  | `string`                                              | — (Pflicht) | Telefon-Ziel (`tel:…`) des Buttons.                                   |
| `phoneLabel` | `React.ReactNode`                                     | — (Pflicht) | Inhalt des Tel-Buttons (Icon + Nummer als ReactNode).                 |
| `note`       | `React.ReactNode`                                     | `undefined` | Hinweiszeile unter dem Button (z. B. Erreichbarkeit).                 |
| `className`  | `string`                                              | `undefined` | Zusatz-Klassen, via twMerge gemerged.                                 |
| `...props`   | `Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>` | —           | Durchgereichte native `div`-Attribute (ohne `title`).                 |

## 2. Playground / Galerie

Specimens unter `/styleguide#contact-callout`:

- **Voll** — Icon, Titel, Subtitel, Tel-Button, Hinweis.
- **Minimal** — nur Pflicht-Props (`icon`, `title`, `phoneHref`, `phoneLabel`).
- **Tel-Button Hover/Active/Focus** — Action-Akzent + Navy-Ring mit Offset.
- **Tap-Target ≥44px** — Button mit `min-h-[var(--tap-target-min)]` (Touch-Nachweis).
- **phoneLabel als Fragment** — Icon + Nummer kombiniert.

## 3. Usage

Verwenden fuer eine gerahmte Kontakt-Aufforderung mit genau einer Telefon-Aktion (Sidebar). Fuer eine reine Label/Wert-Anzeige ohne Aktion stattdessen `InfoItem`, fuer eine ganzflaechig verlinkte Nav-Kachel `NavTile`, fuer eine generische Inhalts-Flaeche `Panel`.

```tsx
import { ContactCallout } from '~/design-system'
import { Phone } from 'lucide-react'
;<ContactCallout
  icon={<Phone className="h-5 w-5" />}
  title="Fragen zur Bestellung?"
  phoneHref="tel:+4915159878599"
  phoneLabel={
    <>
      <Phone className="h-4 w-4" />
      +49 151 59878599
    </>
  }
/>
```

## 4. Do's & Don'ts

- ✅ `phoneHref` immer als `tel:…`-URI setzen (native Tel-Aktion).
- ✅ Das Tap-Target ≥44px ueber `min-h-[var(--tap-target-min)]` beibehalten.
- ✅ Nummer/Icon in `phoneLabel` kombinieren (ReactNode-Fragment).
- ❌ Keine zweite Aktion/CTA in die Box legen — sie traegt genau eine Tel-Aktion.
- ❌ Kein HTML-`title`-Attribut erwarten — `title` ist hier die Ueberschrift.
- ❌ Den Tel-Link nicht zu `<button>`/`onClick` umbauen (bricht native Tel-A11y).

## 5. Code-Snippet (aus echtem Code)

```tsx
<ContactCallout
  icon={<Phone className="h-5 w-5" />}
  title={t('vitd3spray:contact.question')}
  subtitle={t('vitd3spray:contact.advice')}
  phoneHref="tel:+4915159878599"
  phoneLabel={
    <>
      <Phone className="h-4 w-4" />
      {t('vitd3spray:contact.phone')}
    </>
  }
  note={
    <>
      {t('vitd3spray:contact.name')} · {t('vitd3spray:contact.hours')}
    </>
  }
/>
```

Quelle: `src/pages/VitaminD3SprayPage.tsx:544`
