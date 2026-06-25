# Stat

> Einzelne Kennzahl (großer Wert + optionaler Suffix + Label) für dunkle Hero-Flächen. Atomic-Ebene: atom. Quelle (eine Definition, Holy Grail): `src/design-system/core/stat.tsx`. Live im Styleguide: `/styleguide#stat`.

## 1. Anatomy

Ein äußeres `<div>` (`space-y-1`) gruppiert zwei Zeilen: eine Wert-Zeile (`flex items-baseline gap-1`) mit dem großen `value`-`<span>` und optionalem kleinerem `suffix`-`<span>`, darunter ein `<p>` mit dem `label`. Industriestandard-/agnostischer Name (§Phase 2.7/2.8): „Stat" statt des Orts-Suffix „StatItem".

```
<div>
  <div>  <span value> [<span suffix>] </div>
  <p label>
</div>
```

| Prop        | Typ                                    | Default | Zweck                                                                       |
| ----------- | -------------------------------------- | ------- | --------------------------------------------------------------------------- |
| `value`     | `string`                               | –       | Die Kennzahl, z. B. `"48h"` (Pflicht).                                      |
| `suffix`    | `string`                               | –       | Optionaler nachgestellter Zusatz, z. B. `"%"`. Wird nur bei Wert gerendert. |
| `label`     | `string`                               | –       | Beschriftung unter dem Wert (Pflicht).                                      |
| `className` | `string`                               | –       | Passthrough am äußeren `<div>`, via `cn()` gemerged.                        |
| `...props`  | `React.HTMLAttributes<HTMLDivElement>` | –       | Standard-Div-Attribute.                                                     |

Bewusst **keine** `size`-Achse: der einzige Use-Case (Hero) nutzt eine Größe — keine API ohne Use (§1.20). Token-rein (§1.7): Farben ausschließlich über `--stat-*`-Component-Tokens (`--stat-value-color`, `--stat-suffix-color`, `--stat-label-color`) — kein Roh-`text-white`. Schriftgrößen über die rem-basierte Tailwind-Skala (`text-2xl sm:text-3xl`, `text-xxs sm:text-xs`).

## 2. Playground / Galerie

Specimens in `/styleguide#stat` — auf dunkler Surface gerendert (on-dark-Tonalitäten):

- Basis: `value` + `label` (ohne Suffix)
- Mit `suffix` (z. B. Wert `"99"` + Suffix `"%"`)
- Edge-Case: nicht-numerischer Wert (z. B. `"CV < 2%"`)
- Edge-Case: langes `label` (zweizeilig)
- Edge-Case: skaliert via `className` (z. B. `scale-75 origin-top-left`)

## 3. Usage

Für einzelne, prominente Kennzahlen auf dunklem Grund (Hero, Trust-/KPI-Reihen). Mehrere Stats nebeneinander über ein Flex-/Grid-Layout im Aufrufer anordnen. Nicht auf hellen Flächen verwenden (Farben sind on-dark).

```tsx
import { Stat } from '~/design-system'
;<Stat value="99" suffix="%" label="Reinheit" />
```

## 4. Do's & Don'ts

- ✅ Auf dunklen Surfaces einsetzen — die `--stat-*`-Tokens sind on-dark abgestimmt.
- ✅ Einheiten/Suffixe über `suffix` statt im `value`-String, wenn typografisch getrennt.
- ✅ Mehrere Stats über ein eigenes Layout (`flex gap-*`) im Aufrufer reihen.
- ❌ Keine `size`-Variante erwarten — bei zweitem Use-Case als orthogonaler Prop ergänzen, nicht via `className` faken.
- ❌ Farben nicht überschreiben (`text-white`) — Token-Rolle nutzen.
- ❌ Nicht auf hellem Grund verwenden (Kontrast für dunkle Flächen ausgelegt).

## 5. Code-Snippet (aus echtem Code)

```tsx
<Stat
  value={t('hero.stat1.value', '48h')}
  label={t('hero.stat1.label', 'Einsatzbereit nach Bestellung')}
  className="scale-75 origin-top-left py-0"
/>
```

Quelle: `src/components/sections/HeroSection.tsx:146`
