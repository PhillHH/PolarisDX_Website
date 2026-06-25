# InfoItem

> Kompakte, rahmenlose Kontakt-Kanal-Zeile: fuehrendes Icon-Medaillon plus uppercase-Label plus Wert — ruhende Detail-/Metadaten-Anzeige ohne Link. Atomic-Ebene: molecule. Quelle (eine Definition, Holy Grail): `src/design-system/compound/info-item.tsx`. Live im Styleguide: `/styleguide#info-item`.

## 1. Anatomy

InfoItem ist eine flache, rahmenlose Zeile (`flex items-center gap-3`) aus drei Teilen:

- **Icon-Medaillon** — `<span>`, `h-8 w-8`, `rounded-full`, getoenter Hintergrund, `aria-hidden="true"`; nimmt das `icon` (Glyph/ReactNode) auf.
- **Label** — `<p>`, `text-xs`, `uppercase`, `tracking-overline`; traegt die zugaengliche Information.
- **Wert** — `<p>` mit `children`; die Schriftgroesse wird **nicht** gesetzt und erbt vom Aufrufer-Kontext (byte-identisch zur bisherigen `text-sm`-Kaskade).

`forwardRef` leitet auf das aeussere `<div>` (`HTMLDivElement`); native `div`-Attribute werden via Spread durchgereicht. Inhalts-/kontext-agnostisch: die Zeile kennt weder E-Mail noch Telefonnummer.

Token-rein (§1.7): Farben ausschliesslich ueber `--info-item-*`-Component-Tokens (`--info-item-icon-bg`, `--info-item-icon-fg`, `--info-item-label-fg`, `--info-item-value-fg`) in der erlaubten `[var(--token)]`-Form — 0 Roh-Hex/arbitrary-px. Struktur/Spacing/Radius ueber die rem-basierte Tailwind-Skala. UI-States (loading/empty/error/success) sind ohne Datenbezug nicht anwendbar (analog ContactCallout/AuthorByline). `icon`, `label` und Wert (`children`) sind verpflichtend.

| Prop        | Typ                                    | Default     | Zweck                                                            |
| ----------- | -------------------------------------- | ----------- | ---------------------------------------------------------------- |
| `icon`      | `React.ReactNode`                      | — (Pflicht) | Fuehrendes Icon im Medaillon (Glyph/ReactNode; Farbe per Token). |
| `label`     | `React.ReactNode`                      | — (Pflicht) | Uppercase-Label ueber dem Wert (z. B. „E-Mail").                 |
| `children`  | `React.ReactNode`                      | — (Pflicht) | Der Wert (z. B. die E-Mail-Adresse).                             |
| `className` | `string`                               | `undefined` | Zusatz-Klassen, via twMerge gemerged.                            |
| `...props`  | `React.HTMLAttributes<HTMLDivElement>` | —           | Durchgereichte native `div`-Attribute.                           |

## 2. Playground / Galerie

Specimens unter `/styleguide#info-item`:

- **E-Mail** — `✉`-Glyph, Label „E-Mail", Adresse als Wert.
- **Telefon** — `☎`-Glyph, Label „Telefon", Nummer als Wert.
- **lucide-Icon** — Icon-Instanz statt Glyph als `icon`.
- **Langer Wert** — Umbruch-/Layoutverhalten bei langer Adresse.
- **Im Flow** — mehrere InfoItems in einer Zeilen-/Spalten-Anordnung.

## 3. Usage

Verwenden fuer eine einzelne, rahmenlose Label/Wert-Zeile mit fuehrendem Medaillon (Kontakt-/Metadaten-Anzeige). Fuer eine navigierbare Zeile stattdessen `MediaLink`, fuer eine gerahmte Box mit Tel-Aktion `ContactCallout`.

```tsx
import { InfoItem } from '~/design-system'
;<InfoItem icon="✉" label="E-Mail">
  contact@polarisdx.net
</InfoItem>
```

## 4. Do's & Don'ts

- ✅ Das Label kurz und beschreibend halten (es wird uppercase dargestellt).
- ✅ Die Schriftgroesse des Werts ueber den Aufrufer-Kontext vererben lassen.
- ✅ Mehrere Zeilen in einem `flex`-Container (Spalte/Zeile) gruppieren.
- ❌ Keine Links/Aktionen in die Zeile legen — dafuer `MediaLink`/`ContactCallout`.
- ❌ Das Icon nicht als alleinigen Informationstraeger nutzen (Medaillon ist `aria-hidden`).
- ❌ Keine `value`-Prop erwarten — der Wert kommt als `children`.

## 5. Code-Snippet (aus echtem Code)

```tsx
<InfoItem icon="✉" label={t('contact.info.email_label')}>
  contact@polarisdx.net
</InfoItem>
```

Quelle: `src/pages/ContactPage.tsx:67`
