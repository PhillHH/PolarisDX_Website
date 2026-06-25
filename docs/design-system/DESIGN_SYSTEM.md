# Design-System — Governance

> **Zweck:** Verbindlicher Prozess, wie das Design-System verändert, erweitert
> und zurückgebaut wird (§Phase 7.6). Gilt für `src/design-system/**` (Komponenten +
> Tokens) und die lebende Pattern Library (`/styleguide`).
> Stand **2026-06-25**, Phase 7.

## 1. Team-Modell — Centralized

**ASSUMPTION — needs human confirmation** (EXECUTION-PLAN §E.8, §1.17): Default
**Centralized**.

| Rolle      | Wer                                           | Verantwortung                                                              |
| ---------- | --------------------------------------------- | -------------------------------------------------------------------------- |
| **Makers** | Design-System-Owner (`@design-system-owners`) | Tokens + Komponenten-Quelle besitzen, reviewen, dokumentieren, deprecaten. |
| **Users**  | alle Produkt-/Seiten-Entwickler:innen         | Komponenten über den Barrel `~/design-system` konsumieren; Bedarf melden.  |

Durchgesetzt über [`.github/CODEOWNERS`](../../.github/CODEOWNERS): Änderungen an
`src/design-system/**`, `tailwind.config.js` und dieser Doku erfordern ein Maker-Review.
Alternative Modelle (Solitary / Federated) sind eine Produktentscheidung und erst
sinnvoll, wenn mehrere Teams das System parallel weiterbauen (§1.17).

## 2. Holy Grail — eine Definition pro Komponente

Es gibt **genau eine** TSX-Quelle pro Komponente in `src/design-system/`. App **und**
Pattern Library (`src/pages/StyleguidePage.tsx`) importieren ausschließlich über den
Barrel [`src/design-system/index.ts`](../../src/design-system/index.ts). **Kein**
paralleler Demo-/Klon-Code. Ein PR, der eine Komponente kopiert statt eine Prop-Achse
zu ergänzen, wird abgelehnt (§Phase 2.2 / §1.8).

## 3. Prozess: Modify / Add / Remove

### Modify (bestehende Komponente ändern)

1. Quelle in `src/design-system/<ebene>/<name>.tsx` ändern — Varianten/Sizes/States
   nur über **orthogonale Props** (cva/clsx-Map), nie über Kopien.
2. Token-Pflicht (§1.7): keine Rohwerte (Hex/px/Font/Radius/Shadow) — nur
   Component-/Semantic-Tokens. Neue Werte zuerst als Token (§4).
3. Spezimen in `StyleguidePage.tsx` und die 5-teilige Doku
   (`docs/design-system/components/<name>.md`) mitziehen.
4. `CHANGELOG.md` ergänzen (Pflicht, CI-gegated — §6).
5. Maker-Review (CODEOWNERS) + grüne Gates (§5).

### Add (neue Komponente)

1. **Schwelle:** Eine neue geteilte Komponente erst ab dem **2. Use-Case** anlegen
   (§1.20 — kein Vorab-Generalisieren; ein One-off bleibt lokal). Token analog ab
   **≥3** Verwendungsstellen.
2. Korrekte Atomic-Ebene wählen (`core` / `primitives-layout` / `compound` /
   `feedback`); Import-Richtung top-down (ESLint-`boundaries`), zyklenfrei (`madge`).
3. Industriestandard-/kontextagnostischer Name (`Dialog`/`Card`, nicht `ProductCard`);
   Prop-Konventionen (`disabled` statt `isDisabled`).
4. Im Barrel `index.ts` exportieren; Spezimen + 5-teilige Doku + `PATTERNS.md`/
   `lineage.md`-Eintrag (Uses/Used-by) anlegen.
5. `CHANGELOG.md` (`script · new`), Maker-Review, Gates.

### Remove (zurückbauen)

1. **Kein Hard-Delete** aus `main` ohne Freigabe. Erst als `@deprecated`
   (JSDoc-Tag an der Komponente) markieren, Ersatz im Tag benennen.
2. Kandidat in [`docs/GRAVEYARD.md`](../GRAVEYARD.md) dokumentieren (Grund, leere
   Used-by / 0-Klick-Beleg, Nachfrage §1.17).
3. Nach Freigabe + einem Deprecation-Zyklus entfernen; `lineage.md` aktualisieren;
   `knip`/`ts-prune` müssen 0 toten Code zeigen.

## 4. Tokens

Drei Ebenen, strikt: **Component → nur Semantic → nur Primitive**. Single Source =
[`src/design-system/tokens/tokens.css`](../../src/design-system/tokens/tokens.css);
Prozess, Naming-Convention und One-off-Schwelle in
[`tokens/README.md`](../../src/design-system/tokens/README.md). Ein Component-Token
zeigt **nie** direkt auf einen Rohwert.

## 5. Akzeptanz-Gates (jeder DS-PR)

`npm run build` + `npm run typecheck` (`tsc -b`) + `npm run lint` (inkl.
`boundaries` + `jsx-a11y`) grün; `npx madge --circular src` = 0 Zyklen;
Grep-0 für Rohwerte außerhalb der Token-Quelldateien (Allowlist §1.19);
Holy-Grail-Count = 1 pro Komponente; visuelle Regressionssuite
(`e2e/styleguide-visual.spec.ts`) grün; `CHANGELOG.md` aktualisiert.

## 6. Changelog-Pflicht (CI-gegated)

Jeder PR, der `src/design-system/**` berührt, **muss** `CHANGELOG.md` ändern. Der
CI-Job „Changelog gate" (`.github/workflows/ci.yml`) bricht sonst rot ab. Format:
Änderungstyp **markup/style/script/spec** × Gruppe **new/enhancement/fix/other**,
SemVer + datiert (§1.18).

## 7. Referenzen

- Komponenten-Doku (5-teilig): [`docs/design-system/components/`](./components/)
- Inventar & Naming-Map: [`PATTERNS.md`](./PATTERNS.md)
- Uses/Used-by: [`lineage.md`](./lineage.md)
- Graveyard: [`docs/GRAVEYARD.md`](../GRAVEYARD.md)
- Gesamt-Plan & DoD: [`EXECUTION-PLAN.md`](../../EXECUTION-PLAN.md)
