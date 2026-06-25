# SectionHeader

> Komponiert das `Eyebrow`-Atom mit der Abschnitts-Headline (`<h2>`) zu einem einheitlichen Abschnitts-Kopf. Atomic-Ebene: molecule. Quelle (eine Definition, Holy Grail): `src/design-system/compound/section-header.tsx`. Live im Styleguide: `/styleguide#section-header`.

## 1. Anatomy

`SectionHeader` rendert eine `<div class="flex flex-col">` mit zwei Kindern:

- `<Eyebrow>{caption}</Eyebrow>` — das Section-Label (Atom).
- `<h2>{title}</h2>` — die Abschnitts-Headline.

Der Gap zwischen beiden laeuft ueber `--section-header-gap`. Die Ausrichtung steuert `align`: `'center'` → `items-center text-center`, `'left'` → `items-start text-left`. Der Default-Titelstil zieht Groesse/Line-Height/Farbe token-rein aus `--section-header-title-*` (`font-medium tracking-tight`). `titleClassName` ist ein bewusster Escape-Hatch: gesetzt, ersetzt er den Default-Stil komplett. `className` und `id` liegen am Wurzel-`<div>` (z. B. fuer Scroll-Anker).

| Prop             | Typ                  | Default     | Zweck                                                       |
| ---------------- | -------------------- | ----------- | ----------------------------------------------------------- |
| `caption`        | `string`             | — (Pflicht) | Eyebrow-Text (Section-Label), rendert im `Eyebrow`-Atom.    |
| `title`          | `string`             | — (Pflicht) | Abschnitts-Headline, rendert als `<h2>`.                    |
| `align`          | `'left' \| 'center'` | `'center'`  | Achse fuer Ausrichtung von Eyebrow + Titel.                 |
| `titleClassName` | `string`             | `undefined` | Klassen-Override fuer den Titel — ersetzt den Default-Stil. |
| `id`             | `string`             | `undefined` | `id` am Wurzel-`<div>` (z. B. Scroll-Anker).                |
| `className`      | `string`             | `undefined` | Zusaetzliche Klassen am Wurzel-`<div>`.                     |

## 2. Playground / Galerie

Specimens unter `/styleguide#section-header`:

- **Default (center)** — `caption` + `title`, zentriert.
- **Left-aligned** — `align="left"` (typisch fuer Detail-/Service-Seiten).
- **Lange Headline** — mehrzeiliger `title` zur Pruefung von `leading`/`tracking`.
- **Edge-Case Titel-Override** — `titleClassName` ersetzt den Default-Titelstil (byte-stabiler Escape-Hatch fuer Alt-Call-Sites).

## 3. Usage

Einsetzen als Kopf jeder inhaltlichen Sektion (Services, FAQ, Team, …). Garantiert die einheitliche Eyebrow-+-`<h2>`-Kombination ueber App und Pattern-Library hinweg.

Import ueber den Barrel:

```tsx
import { SectionHeader } from '~/design-system'

function Example() {
  return (
    <SectionHeader caption="DIAGNOSTIK-FOKUS" title="Schlüsselbereiche der Präventivdiagnostik" />
  )
}
```

## 4. Do's & Don'ts

- ✅ Fuer jeden Abschnitts-Kopf verwenden — eine Quelle fuer Eyebrow + `<h2>`.
- ✅ `align="left"` fuer Detail-/Listen-Layouts, Default-Center fuer Hero-/Marketing-Sektionen.
- ✅ `id` setzen, wenn die Sektion ein Scroll-Anker sein soll.
- ✅ `caption` als kurzes Label, `title` als vollstaendige Headline formulieren.
- ❌ Kein eigenes `<Eyebrow>` + `<h2>`-Paar von Hand bauen — das ist der Zweck dieser Molecule.
- ❌ `titleClassName` nicht fuer beliebige Layout-Hacks zweckentfremden; es ist ein Escape-Hatch fuer den Titelstil.
- ❌ Die Headline-Ebene nicht aendern (immer `<h2>`) — sonst bricht die Dokument-Outline.
- ❌ Keine Roh-Hex-Farben fuer den Titel — Default ist token-rein.

## 5. Code-Snippet (aus echtem Code)

```tsx
<SectionHeader
  caption={t('services.caption', 'DIAGNOSTIK-FOKUS')}
  title={t('services.title', 'Schlüsselbereiche der Präventivdiagnostik')}
/>
```

Quelle: `src/components/sections/ServicesSection.tsx:12`
