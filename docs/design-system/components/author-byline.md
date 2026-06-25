# AuthorByline

> Redaktionelle Autoren-Attribution (E-E-A-T-Signal): Initialen-Medaillon plus Autorenname als ruhende Box ohne Aktion. Atomic-Ebene: molecule. Quelle (eine Definition, Holy Grail): `src/design-system/compound/author-byline.tsx`. Live im Styleguide: `/styleguide#author-byline`.

## 1. Anatomy

AuthorByline ist eine horizontale Box (`flex items-center gap-4`, `rounded-lg`, `border`, `p-4`) aus zwei Elementen:

- **Initialen-Medaillon** — dekorativer Kreis (`h-12 w-12`, `rounded-full`), `aria-hidden="true"`, zeigt die durchgereichten `initials` zentriert.
- **Autorenname** — `<p>` mit `name`, traegt die zugaengliche Information.

Die Komponente leitet ueber `forwardRef` auf das aeussere `<div>` weiter und nimmt via Spread alle nativen `HTMLAttributes<HTMLDivElement>` entgegen (z. B. `id`). Call-site-spezifisches Aussen-Spacing (etwa `mb-10`) kommt byte-stabil ueber `className` (twMerge) hinzu. Inhalts-/kontext-agnostisch: die Box kennt keinen konkreten Autor.

Token-rein (§1.7): Farben ausschliesslich ueber `--author-*`-Component-Tokens (`--author-border`, `--author-bg`, `--author-avatar-bg`, `--author-avatar-fg`, `--author-name-fg`) in der erlaubten `[var(--token)]`-Form — 0 Roh-Hex. Struktur/Spacing/Radius ueber die rem-basierte Tailwind-Skala. UI-States (loading/empty/error/success) sind ohne Datenbezug nicht anwendbar (analog ContactCallout/NavTile).

| Prop        | Typ                                    | Default     | Zweck                                                        |
| ----------- | -------------------------------------- | ----------- | ------------------------------------------------------------ |
| `initials`  | `React.ReactNode`                      | — (Pflicht) | Initialen im dekorativen Medaillon (z. B. „PX").             |
| `name`      | `React.ReactNode`                      | — (Pflicht) | Autoren-/Redaktionsname (zugaengliche Information).          |
| `className` | `string`                               | `undefined` | Zusatz-Klassen, via twMerge gemerged (z. B. Aussen-Spacing). |
| `...props`  | `React.HTMLAttributes<HTMLDivElement>` | —           | Durchgereichte native `div`-Attribute (`id`, `data-*`, …).   |

## 2. Playground / Galerie

Specimens unter `/styleguide#author-byline`:

- **Default** — zweistellige Initialen, Standard-Redaktionsname.
- **Langer Name** — mehrteiliger Name (Umbruch-/Layoutverhalten).
- **Einbuchstabige Initialen** — Edge Case fuer die Medaillon-Zentrierung.
- **ReactNode statt String** — Initialen/Name als gestyltes Fragment.
- **Mit Aussen-Spacing** — Specimen mit `className="mb-10"` (call-site-Pattern).

## 3. Usage

Verwenden, wenn unter einem redaktionellen Inhalt eine ruhende Autoren-Attribution (E-E-A-T) gesetzt werden soll — ohne Link oder Aktion. Fuer eine Kontakt-Aufforderung mit Tel-Aktion stattdessen `ContactCallout` nutzen.

```tsx
import { AuthorByline } from '~/design-system'
;<AuthorByline initials="PX" name="PolarisDX Redaktionsteam" />
```

## 4. Do's & Don'ts

- ✅ Initialen kurz halten (1–3 Zeichen), damit das Medaillon zentriert bleibt.
- ✅ Aussen-Spacing ueber `className` (z. B. `mb-10`) statt Wrapper-`<div>`.
- ✅ Farben ausschliesslich ueber `--author-*`-Tokens beziehen.
- ❌ Keine interaktiven Elemente (Link/Button) in die Box legen — dafuer `ContactCallout`/`MediaLink`.
- ❌ Die Initialen nicht als alleinigen Informationstraeger nutzen (Medaillon ist `aria-hidden`).
- ❌ Keine Roh-Hex-Farben oder arbitrary-px via `className` einschleusen.

## 5. Code-Snippet (aus echtem Code)

```tsx
<AuthorByline className="mb-10" initials="PX" name="PolarisDX Redaktionsteam" />
```

Quelle: `src/pages/S3LeitliniePage.tsx:220`
