# Breadcrumbs

> Komponiert Router-`Link` + Trenner-Icon zu einer A11y-konformen Pfad-Anzeige. Atomic-Ebene: molecule. Quelle (eine Definition, Holy Grail): `src/design-system/compound/breadcrumbs.tsx`. Live im Styleguide: `/styleguide#breadcrumbs`.

## 1. Anatomy

`Breadcrumbs` rendert eine `<nav aria-label="Breadcrumb">` mit einer geordneten `<ol>`. Jeder Eintrag in `items` wird zu einem `<li>`:

- Ab dem zweiten Eintrag steht davor ein dekoratives `ChevronRight`-Icon (`aria-hidden`, `--breadcrumb-separator`).
- Der **letzte** Eintrag (oder jeder Eintrag ohne `href`) rendert als `<span>`; der letzte traegt zusaetzlich `aria-current="page"`.
- Alle uebrigen Eintraege mit `href` rendern als Router-`<Link>` mit Hover-/Focus-States.

Jedes `item` hat die Form `{ label: string; href?: string }`. Ohne `href` ist der Eintrag nicht-verlinkt (auch ausserhalb der letzten Position). **Empty-State**: ist `items` leer, rendert die Komponente `null` statt eines toten, leeren Landmarks.

Token-rein: Farben ausschliesslich ueber `--breadcrumb-fg`, `--breadcrumb-separator`, `--breadcrumb-link-hover`. Sichtbarer Tastatur-Fokus ueber den on-dark Ring `--color-focus-ring-on-dark` (lebt auf dunklem Hero-Grund). Keine `variant`-Achse — alle Call-Sites sind on-dark.

| Prop        | Typ                | Default     | Zweck                            |
| ----------- | ------------------ | ----------- | -------------------------------- |
| `items`     | `BreadcrumbItem[]` | — (Pflicht) | Pfad-Eintraege; leer ⇒ `null`.   |
| `className` | `string`           | `undefined` | Zusaetzliche Klassen am `<nav>`. |

`BreadcrumbItem`:

| Feld    | Typ      | Default     | Zweck                                                                        |
| ------- | -------- | ----------- | ---------------------------------------------------------------------------- |
| `label` | `string` | — (Pflicht) | Sichtbarer Text des Eintrags.                                                |
| `href`  | `string` | `undefined` | Zielpfad (Router-`Link`); ohne `href` rendert ein nicht-verlinktes `<span>`. |

## 2. Playground / Galerie

Specimens unter `/styleguide#breadcrumbs`:

- **Multi-Level** — `Home / Bereich / Seite` mit Trenner-Chevrons, letzter Eintrag `aria-current="page"`.
- **Single** — nur ein Eintrag (kein Trenner, sofort `aria-current`).
- **Eintrag ohne `href`** — Zwischen-Eintrag als nicht-verlinkter `<span>`.
- **Edge-Case Empty** — `items={[]}` → rendert nichts (kein leerer Landmark).
- **Fokus/Hover** — Tastatur-Fokus zeigt den on-dark Ring; Hover faerbt via `--breadcrumb-link-hover`.

## 3. Usage

Einsetzen fuer die Pfad-Navigation oben auf Unterseiten (typisch im dunklen Hero). Der letzte Eintrag ist die aktuelle Seite und bekommt **kein** `href`.

Import ueber den Barrel:

```tsx
import { Breadcrumbs } from '~/design-system'

function Example() {
  return <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Über uns' }]} />
}
```

## 4. Do's & Don'ts

- ✅ Den aktuellen (letzten) Eintrag ohne `href` lassen — er wird automatisch `aria-current="page"`.
- ✅ Auf dunklem Hero-Grund verwenden (dafuer ist die on-dark Tonalitaet gedacht).
- ✅ Bei leerem Pfad einfach `items={[]}` uebergeben — die Komponente rendert sicher `null`.
- ✅ `label`-Texte via i18n uebergeben.
- ❌ Keine eigene `<nav>`/`<ol>`-Struktur oder Trenner von Hand bauen.
- ❌ Dem letzten Eintrag kein `href` geben — er ist die aktive Seite, kein Link.
- ❌ Keine Roh-Farben (`text-white` o. ae.) erwarten — alles laeuft ueber `--breadcrumb-*`-Tokens.
- ❌ Nicht auf hellem Grund einsetzen, ohne die Tonalitaet zu pruefen (kein `light`-Mode vorhanden).

## 5. Code-Snippet (aus echtem Code)

```tsx
<Breadcrumbs
  items={[{ label: 'Home', href: '/' }, { label: t('about:hero.caption', 'Über uns') }]}
/>
```

Quelle: `src/pages/AboutPage.tsx:38`
