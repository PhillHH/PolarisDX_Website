# Gesamt-Ausführungsplan — Paradigmen-Refactoring (Phasen 0 → 7)

> **Quelle der Wahrheit:** `knowledge/REFACTORING-ANWEISUNG.md` (Spec v2). Dieser Plan leitet daraus
> die 8 Phasen-Workflows ab, in der verbindlichen Reihenfolge/Abhängigkeit aus **§4**, je Phase mit
> **Tasks** (aus den nummerierten Anweisungen), **Definition of Done** (DoD) und den auszuführenden
> **Verifikations-Checks**. Vorab-Fakten: `knowledge/PROJECT-DECISIONS.md`.
>
> **Realer Stack (verbindlich, nicht wechseln — §1.16):** Vite-Build + **Express-SSR** (`server.ts`
> via `tsx`, `entry-server.tsx`/`entry-client.tsx`), **react-router-dom 7**, **Tailwind** (+ cva/clsx/
> tailwind-merge), **i18next/react-i18next** (10 Locales), **@fontsource-variable/inter**, lucide-react,
> sharp, vitest, playwright. ESLint hat bereits `eslint-plugin-boundaries` + `jsx-a11y`. Token-Setup =
> **CSS-first (§3.0 A)**.
>
> **Harte Leitplanke:** **Keine** Änderungen an Infra/Deployment (`Dockerfile*`, `docker-compose.yml`,
> `nginx.conf`, `vercel.json`, `deploy.sh`, `server/`, CSP/Security-Header) und nicht an den
> Tabu-Bereichen aus PROJECT-DECISIONS §5 (Consumer-Checkout, Chat, i18n-Routing-Infra). Nur
> **Feature-Branch + PR**, nie direkt auf `main`.

---

## A. Reihenfolge & Abhängigkeiten (§4)

```
0 Audit/Baseline → 1 Tokens → 2 Atomic → {3 Visual-Craft, 4 Grid/Layout} → 5 A11y/Humanity → 6 UX-Validierung → 7 Doku/Governance
```

- **Abhängigkeitsgraph:** `0 → 1 → 2 → {3,4} → 5 → 6 → 7`.
- **Strikt sequenziell**, mit **einer** Ausnahme: **Phasen 3 & 4 dürfen pro Komponente verschränkt**
  laufen (vertikales Iterieren je Sektion: Atom→Molecule→Organism gestalten + Layout, statt „erst
  alle Atoms"). Alles andere wird erst begonnen, wenn die Vorphase ihre DoD grün belegt hat.
- **Fail-fast-Schleife (zweifach, §4):** Nutzervalidierung in **Phase 0** (Lo-Fi, _vor_ Phase-2-Code)
  **und** in **Phase 6** (finale Lösung). Risikoreiche Varianten hinter `lib/flags.ts`.
- **Fidelity-Treppe (durchgehend):** Lo-Fi (Outline) → Mid-Fi (Typo/Spacing/Token) → Hi-Fi (Microcopy/
  Bilder/Animation, **nur Politur**, keine Struktur-/Routing-/Datenfluss-Umbauten in Hi-Fi-PRs).

### Stopp-Bedingung (Abbruchbedingung „bis es passt")

Der Lauf ist fertig, wenn **alle** Per-Phase-DoD **und** die **globale DoD (§5)** durch
**ausgeführte** Verifikations-Checks (§1.15) grün sind **und** dieser Zustand über **≥2
aufeinanderfolgende Runden stabil** bleibt (keine neuen Verstöße, keine Regression). Niemals auf
„gefühlt fertig" stoppen.

---

## B. Querschnitt-Regeln (gelten in JEDER Phase — Operating Contract §1)

Diese Regeln sind Akzeptanz-Gate jeder Einheit, nicht nur Phasen-Inhalt:

| Regel                              | Kurz                                                                                                                                                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **§1.4 Build nie rot**             | Nach jeder logischen Einheit `build` + `typecheck` (`tsc -b`) + `lint` grün. Rot = sofort fixen.                                                                                                              |
| **§1.5 Inkrementell/atomar**       | Ein Change = ein revertierbarer Commit (`refactor(scope): …`); Fix-Commits mit `Symptom:`/`Root cause:`. Kein Big-Bang.                                                                                       |
| **§1.7 Token-Pflicht**             | Ab Ende Phase 1: keine Rohwerte (Hex/px/Font/Radius/Shadow) in Komponenten; nur Semantic-/Component-Tokens. Allowlist §1.19 ist Mess-Ausnahme, keine Erlaubnis.                                               |
| **§1.8 Keine Duplikate**           | Vermeiden > Wiederverwenden > Umbauen. Toter Code/Export/Dep wird entfernt (`knip`/`ts-prune`/`depcheck`).                                                                                                    |
| **§1.11 A11y**                     | WCAG 2.2 AA, voll tastaturbedienbar, Klartext-Fehler. Maschinell via `jsx-a11y`.                                                                                                                              |
| **§1.15 Verifizieren ≠ behaupten** | Jede „erledigt"-Aussage durch ausgeführten Befehl + Ergebnis belegen; vor Änderung an geteiltem Symbol Impact-Map (`rg -l "<X[ />]" src`).                                                                    |
| **§1.17 Nachfrage-Schwelle**       | Produktentscheidungen → PROJECT-DECISIONS. Offene Punkte dort: begründeter Default, markiert **`ASSUMPTION — needs human confirmation`** im Code-Kommentar **und** PR-Text; weiterarbeiten, nicht blockieren. |
| **§1.18 Fortschritt sichtbar**     | `REFACTOR-LOG.md` + `CHANGELOG.md` (markup/style/script/spec × new/enhancement/fix) pflegen; gestrichene Features → `docs/GRAVEYARD.md`.                                                                      |

**Mess-Norm (§1.19/§7):** Alle Wert-Audits nutzen wortgleich die Allowlist
`--glob '!**/tokens.json' --glob '!**/tokens.css' --glob '!**/tokens.ts' --glob '!**/tailwind.config.*'`;
Treffer mit `rg --count-matches`, Dateien mit `rg -l … | wc -l`.

**Audit-Server (für axe/lighthouse/Playwright):** `npm run build` → `npm run start` (SSR, `PORT=3000`)
→ auf Ready warten → `URL=http://localhost:3000` → auditieren. Reines Code-Lesen erfüllt diese Gates nicht.

---

## C. Phasen 0 → 7

Legende **Status (IST 2026-06-24):** ✅ erledigt · 🟡 teilweise · ⬜ offen. Abgeleitet aus dem realen
Repo-Zustand (Commit „Phasen 0-3" vorhanden, aber mehrere Artefakte/Strukturen fehlen noch).

---

### Phase 0 — Audit, Baseline, Problemdefinition & frühe Lo-Fi-Validierung `[BEC][NOR][FRO]` — 🟡

**Abhängigkeit:** keine (Startpunkt). Blockiert alle weiteren Phasen.

**Tasks**

1. `docs/interface-inventory.md`: alle einzigartigen UI-Patterns scannen, nach **16 Kategorien** gruppieren (inkl. `routing/*`, Legal/FAQ); Duplikate sichtbar nebeneinander.
2. Komponenten-Inventar + Naming-Map in `REFACTOR-LOG.md` (Datei · Zweck · künftige Atomic-Ebene · Duplikat-von? · alt→agnostischer Zielname) → `docs/design-system/PATTERNS.md`.
3. Werte-Audit: hartkodierte Hex/px/Font/Radius/Shadow per `rg --count-matches` zählen → Token-Migrations-Liste.
4. Tooling-Inventar: `build`/`typecheck`/`lint`/`test`/`build-storybook`-Scripts prüfen, fehlende anlegen oder `npx`-Fallback festlegen.
5. `docs/ux/problem-statements.md` (v2-Template, kundenfokussiert) je Router-Segment.
6. `docs/personas/<name>.md`: 2–4 Proto-Personas (4 Quadranten, „assumption"), 3-Akt-Stories, narrative Akzeptanzkriterien.
7. `docs/ux/insights.md`: lösungsfreie Mad-Libs-Insights.
8. `docs/ux/research-summary.md`: Executive Summary + Quote-Cluster.
9. Baseline-Screenshots sm/md/lg/xl (Playwright §7.4).
10. Baseline-Metriken ins Log: Lighthouse, axe, First-Load-JS/Route, typecheck/lint-Fehlerzahl, `depcheck`/`knip`/`ts-prune`, `madge --circular`.
11. Analytics-/Metrik-Audit: GTM/GA4-Events listen, Vanity-Metriken markieren, Aggregat-Score prüfen.
12. Tech-Bestandsaufnahme: Styling/Router/TS/Tests/Storybook/Datenverträge.
13. Frühe **Lo-Fi-Validierung** mit ≥1 echtem Nutzer für größere Flow-Änderungen → `insights.md`.
14. `docs/REFACTOR_BACKLOG.md`: nach Impact/Feasibility geordnet, je Pattern KEEP/MERGE/DROP.
15. `git tag pre-refactor-baseline` (§1.4).

**Definition of Done**

- [ ] `interface-inventory.md` deckt alle 16 Kategorien (leer = explizit „keine") inkl. not-found/error/loading; Duplikate markiert.
- [ ] Komponenten-Inventar + Naming-Map (`PATTERNS.md`) vollständig.
- [ ] Zähler hartkodierter Werte dokumentiert (`--count-matches`).
- [ ] Tooling-Inventar im Log; fehlende Scripts angelegt oder Fallbacks fixiert.
- [ ] `problem-statements.md` (v2) je Segment; `personas/*`, 3-Akt-Stories, narrative Kriterien, lösungsfreie Insights, `research-summary.md`.
- [ ] Baseline-Screenshots (sm/md/lg/xl) + Metriken abgelegt.
- [ ] Vanity-Metriken markiert; Aggregat-Score erfasst; Datenverträge dokumentiert.
- [ ] Lo-Fi-Validierung (größere Flows) protokolliert.
- [ ] `REFACTOR_BACKLOG.md` mit KEEP/MERGE/DROP; `git tag pre-refactor-baseline` gesetzt.

**Verifikation (Auszug):** `rg --count-matches "#…" src`; `npm run build` (Route-Sizes notieren);
`npx depcheck; npx knip||npx ts-prune; npx madge --circular src`; `test -f docs/...`;
`git tag | rg -q '^pre-refactor-baseline$'`.

**Status IST:** `REFACTOR-LOG.md`, `AUDIT_I18N_ROUTING.md` vorhanden; **offen:** `docs/interface-inventory.md`,
`docs/REFACTOR_BACKLOG.md`, `docs/ux/*`, `docs/personas/*`, `docs/design-system/PATTERNS.md`,
`build-storybook`-Script, **`git tag pre-refactor-baseline`**. → Phase 0 vor Weiterbau formal schließen.

---

### Phase 1 — Foundations / Design Tokens `[BUD][FIL][BEC]` — ✅ (Rest-DoD verifizieren)

**Abhängigkeit:** nach 0. **Foundational-first (§1.3)** — blockiert 2–7.

**Tasks**

1. `tokens.css` 3-Ebenen vollständig (Grayscale 9–10, Primary/Secondary 50–900 HSL, Feedback 5–6, 8pt-Soft-Grid non-linear, handgebaute Typo ~7–8 Stufen Body ≥16px, Line-Heights, Radii, Shadows ohne `#000`, Grid/Breakpoints, Z, Motion, Reading-Width, Tap-Target).
2. Semantic-Layer rollenbasiert (`--color-bg`/`-fg`/`-action-*`/`-focus-ring`, `--text-*`, `--space-section-gap`).
3. Component-Layer initial für **Button** (erbt nur von Semantic; One-off ≥3 §1.20).
4. Naming-Convention `category-property-item-variant-state`; `tokens/README.md` inkl. Pipeline (CSS-first) + One-off-Schwelle.
5. Theming `[data-theme="dark"]` — nur Semantic neu binden, kein FOUC (Anti-Flash-Script). **Default-Theme je Bereich** lt. PROJECT-DECISIONS §1 (Main=dark, Consumer=light) → `ASSUMPTION`.
6. `tokens.ts` typsichere Spiegelung (nur Logik-Werte).
7. `index.css` Tailwind-Direktiven + Reset + Basistypografie; **Inter** via `@fontsource-variable/inter` (Import in `entry-client.tsx` vor `index.css`); `tailwind.config.js` `fontFamily.sans` = Inter-Stack.
8. Markenwerte (Primärfarbe/Schrift) bestätigen → aus PROJECT-DECISIONS §1/§2 (Navy/Inter), Platzhalter als `ASSUMPTION` markiert.
9. Tailwind: Token-Werte unter `theme.extend` (kein Top-Level-Override), arbitrary values verbieten.
10. `lib/flags.ts` + `lib/metrics/{definitions,thresholds,aggregate}.ts` als Stubs.

**Definition of Done**

- [ ] `tokens.css` deckt alle Phase-0-Wertkategorien; Skala non-linear, keine ungeraden Werte (3/5/7px).
- [ ] Component→nur Semantic, Semantic→nur Primitive; kein Component-Token auf Rohwert/Primitive.
- [ ] Namen matchen Convention; `tokens/README.md` inkl. Pipeline + One-off.
- [ ] `[data-theme]` funktionsfähig (Light/Dark identische Namen, kein FOUC); genau **ein** Typeface (`@fontsource-variable/inter`); `fontFamily.sans` referenziert Inter-Stack.
- [ ] Body/Input ≥16px; kein `#000`/`#000000` (auch Space-Syntax) als Token-Wert.
- [ ] Tailwind-Token unter `theme.extend`; Defaults (`transparent`/`current`/`shadow-none`) erhalten.
- [ ] `lib/flags.ts` + `lib/metrics/*` als Stubs vorhanden.

**Verifikation (Auszug):** `npm run build && npm run typecheck && npm run lint`;
`rg -ni "#000\b|#000000|rgb\(\s*0[ ,]+0[ ,]+0" …/tokens.css` (Soll leer);
`rg -n "@fontsource-variable/inter" src/entry-client.tsx`; `rg -n "'Inter Variable'" tailwind.config.*`;
`rg -n "font-size-300:\s*1rem" …/tokens.css`; `rg -n "theme:\s*\{\s*extend" tailwind.config.*`.

**Status IST:** `tokens.css/ts/README`, `index.ts`, `lib/flags.ts`, `lib/metrics/*` vorhanden; CSS-first
mit Kanal-Tripeln umgesetzt. → Rest-DoD (Theming Dark/Light beider Bereiche, `#000`-Check, Convention-Audit) **verifizieren & belegen**.

---

### Phase 2 — Atomic-Restrukturierung & Inventory-Konsolidierung `[FRO][BUD]` — ✅ (DoD belegt 2026-06-24)

**Abhängigkeit:** nach 1. Blockiert 3–7. **Vertikal pro Sektion** iterieren (nicht „erst alle Atoms").

**Tasks**

1. Jede Phase-0-Komponente einer Ebene zuordnen, in Zielordner (`core`/`compound`/`sections`/`feedback`/`templates`) verschieben; Duplikate auf je ein kanonisches Atom/Molecule konsolidieren (KEEP/MERGE/DROP); DROP löschen.
2. **Atome zuerst (Button voran):** minimale Props-API, Varianten über **orthogonale Props** (cva/clsx-Map), **alle** States (default/hover/focus-visible/active/disabled), Touch-Target ≥44px.
3. **Molecules** aus Atomen (Single-Responsibility): Atom = `Input`, Molecule = `FormField`.
4. **Organisms** (`sections/`: Header, Footer, Hero, ContactForm) aus Molecules/Atomen/Organismen.
5. **Templates** = reine Layout-Gerüste mit Slots/`children` + Content-Guardrails (zod `.max`, Bild-`aspect-ratio` via `width`/`height`), **kein** finaler Content; Datenbeschaffung von Layout trennen.
6. **Pages** (`src/pages/*.tsx`) = Template + echte Daten.
7. Kontext-/content-agnostische Namen (`ProductCard→Card`, `HomepageCarousel→Carousel`).
8. Industriestandard-Namen (`Dialog`/`Tooltip`/`Accordion`/`Input`); Synonym-Dubletten konsolidieren.
9. Shared Vocabulary: PascalCase, konsistente Prop-Namen (eine Achse = ein Prop-Name; `disabled` statt `isDisabled`).
10. **Connect tokens:** jede migrierte Komponente nur Semantic-/Component-Tokens (§1.7).
11. **Pattern-Lineage** `docs/design-system/lineage.md` (Uses/Used-by, reproduzierbar via `rg -l`); leere Used-by = toter Code → DROP (Graveyard, Nachfrage §1.17).
12. **SSR/Hydration & Code-Splitting (§2.3):** isomorphes React (kein `use client/server`); Resilienz über RR7-`errorElement`/`useRouteError`; schwere Seiten `React.lazy()`, HomePage/Consumer-LPs eager; Barrel `design-system/index.ts`; Holy Grail (eine Definition pro Komponente).
13. Keine Zirkular-Abhängigkeiten / kein God-Module (`madge --circular`).

**Definition of Done**

- [ ] Jede Komponente in korrekter Ebene; keine verwaisten Ad-hoc-Komponenten.
- [ ] Import-Richtung strikt top-down auf **allen** Ebenen (ESLint-`boundaries` grün); **0** Zyklen (`madge`).
- [ ] Keine Duplikate; je Kategorie ein kanonisches Atom; Variante via Prop, nicht Kopie; genau **eine** Definition pro Komponente (Holy Grail).
- [ ] Namen struktur-/content-agnostisch + Industriestandard; Prop-Konventionen einheitlich.
- [ ] `lineage.md` (Uses/Used-by); tote Patterns → `GRAVEYARD.md`; Browser-only-Effekte nur in `useEffect`; Server-/Client-Baum identisch (kein Hydration-Mismatch).
- [ ] Templates ohne Inhalts-Literale; Content-Guardrails (zod-maxLength / Bild-aspect-ratio) vorhanden.

**Verifikation (Auszug):** `npm run build && typecheck && lint`; `npx madge --circular src`;
Import-Richtung pro Ebene per `rg` (kein Treffer = gut); `rg -ni "homepage…|productCard|blogHero" src` (leer);
`rg -n "use client|use server|next/(font|image|dynamic|link)|next-intl" src` (leer); Holy-Grail-Count je Komponente = 1.

**Status IST (2026-06-24, DoD belegt):** Alle DoD-Punkte ausgeführt verifiziert (REFACTOR-LOG
„Phase 2 — DoD formal geschlossen"). **Architektur-Entscheidung (§1.17 `ASSUMPTION`):** Organismen
bleiben in `src/components/sections`, Templates in `src/components/layout` — maschinell als
`organism`/`template` via `eslint-plugin-boundaries` klassifiziert + richtungsgeprüft
(`eslint.config.js:67–92`), **nicht** nach `design-system/sections` verschoben (§1.16/§1.8). Belege:
`lint` 0 errors (boundaries-Gate), `madge --circular` 0 Zyklen, Holy-Grail = 1 reale Definition je
Komponente, `lineage.md` über alle Schichten (kein toter Code), Templates literalfrei + Bild-aspect-ratio.
Content-Guardrail via Bild-aspect-ratio (zod bewusst nicht eingeführt, §1.16).

---

### Phase 3 — Visueller-Craft-Pass `[FIL]` — 🟡 _(mit Phase 4 pro Komponente verschränkbar)_

**Abhängigkeit:** nach 2; **verschränkt mit 4** pro Komponente.

**Tasks**

1. Genau **EIN** dominantes Element pro View (Größe + Primary-Farbe + Vordergrund + oben/links gebündelt); Squint-Test.
2. Größe: Wichtiges größer, konsequente Typo-Skala; H1/CTA messbar größer als Sekundäres.
3. Farbe/Kontrast rollenbasiert (Bg=hellstes, Text=dunkelstes, Primary nur Aktion/Focus); **keine** 60-30-10; max. 1 Primary-Button/Sektion; WCAG AA; Text-über-Bild mit Overlay.
4. Position & Proximity: Wichtiges oben/links (logische CSS-Props für RTL), intra<inter-Group-Abstand.
5. Alignment am Grid/an gemeinsamen Kanten.
6. Common Region & Figure-Ground (Card/Section, Vordergrund interaktiv).
7. Typografie: ein Typeface, Hierarchie über Größe+Gewicht (≥2 Stufen Skip), **kein** Light-Gewicht für kleinen Text, Body ≥16px, Fließtext linksbündig + `--reading-width`.
8. Buttons primary/secondary/tertiary, alle States, Min-Höhe 40–60px, Tap ≥44px, Text ≥16px, ein Radius-Token.
9. Schatten/Radius/Border: weiche Schatten nur interaktiv/erhoben, nie auf Text/disabled; Dark-Mode keine weißen Schatten; Inner-Stroke-Border.
10. Alle visuellen Werte nur aus Tokens (§1.7, Allowlist §1.19).

**Definition of Done**

- [ ] Genau **ein** dominantes Element/CTA pro View; Farben rollenbasiert; max. 1 Primary/Sektion.
- [ ] Texte folgen Typo-Skala; kein Ad-hoc-`font-size`; Body ≥16px; Fließtext linksbündig + begrenzte Breite; kein Light-Gewicht für kleinen Text; Header-Body-Gewicht ≥2 Stufen.
- [x] Alle interaktiven Atome haben hover/**focus-visible**/active/disabled. _(belegt 2026-06-25, Einheit 3u — alle interaktiven DS-Komponenten (`button`, `card[interactive]`, `nav-tile`, `media-link`, `breadcrumbs`, `contact-callout`, `accordion`, `input`/`select`/`textarea`) tragen die semantisch anwendbaren States; **focus-visible** (WCAG 2.4.7) jetzt lückenlos — Grep „interaktiv ohne focus-visible" = ∅; on-dark Fokus-Ring-Token `--color-focus-ring-on-dark` ergänzt; build/typecheck/lint grün.)_
- [ ] Schatten nur interaktiv/erhoben; keine weißen Schatten im Dark-Mode; disabled ohne Schatten.
- [x] **0** hartkodierte visuelle Werte außerhalb der Token-Quelldateien (Grep §1.19). _(belegt 2026-06-25, Einheit 3t — `rg` Palette+Hex über gesamte `src` → nur `FlagIcon.tsx` (akzeptierte Flaggen-Inhalts-Ausnahme §1.17/§1.19); build/typecheck/lint grün.)_

**Verifikation (Auszug):** `rg -n "#…|\b[0-9]+px\b" src/design-system <Allowlist>` (Soll 0);
`rg -n "hover:|active:|disabled:|focus-visible:" src/design-system/core`;
`rg -ni "font-(thin|extralight|light)\b|font-weight…(100|200|300)…" src/design-system` (leer);
`npx @axe-core/cli "$URL" --tags wcag2aa`.

**Status IST:** Atomic-Komponenten haben tokenisierte States (Commit „Visual-Craft-Pass"); **offen:**
Craft-Pass auf Organisms/Pages (existieren als `sections/` noch nicht), Grep-0 für gesamte `src`,
axe-WCAG-AA gegen laufende Instanz belegen.

---

### Phase 4 — Grid, Layout & Responsiveness `[FIL]` — ⬜ _(mit Phase 3 verschränkbar)_

**Abhängigkeit:** nach 2; **verschränkt mit 3** pro Komponente.

**Tasks**

1. 8pt-Soft-Grid: alle Margins/Paddings/Gaps = `--space-*`; keine arbitrary px (Eigengrößen dürfen inhaltsabhängig sein).
2. 12-Spalten-Grid (teilbar 6/4/3/2, nie 5/7/11; Gutter 12–16px; `--grid-max` ~1240px) als `Grid`/`Container` (`primitives-layout/`) kapseln.
3. Fluid vs. Fixed: Marketing = `max-w-layout` fluid; **Forms/Artikel = `max-w-reading` schmal**; Header/Footer = Full-Bleed-Hybrid.
4. Layout-Primitives `Stack`/`Cluster`/`Container`; Layout-Logik aus Organismen in Templates ziehen.
5. Responsive mobile-first an Token-Breakpoints; `grid-cols-12` kollabiert; keine Horizontal-Scrollbars; mobile Safe-Space-Margins 16–24px; Touch ≥44px.

**Definition of Done**

- [ ] Konsistentes Grid/Container-System; keine wilden margin/padding-px; `col-span` teilt 12 sauber.
- [ ] Forms/Artikel in schmalem Fixed-Container (Reading-Width).
- [ ] Alle Hauptseiten sm/md/lg/xl ohne Layout-Bruch & ohne Horizontal-Scroll; mobile Safe-Space 16–24px; Touch ≥44px.

**Verifikation (Auszug):** `rg -nP "\b[pm][trblxy]?-\[(?!var\()" src` (leer — Tailwind-arbitrary-spacing);
`rg -n "col-span-(5|7|11)\b" src` (leer); `rg -n "grid-cols-(1|2|4|8|12)" src`;
`rg -n "max-w-reading|--reading-width" src`; Responsiv-Screenshots vs. Baseline + Overflow-Assert (Playwright §7.4).

**Status IST:** `primitives-layout/container.tsx` vorhanden; **offen:** `Grid`/`Stack`/`Cluster`,
flächendeckende Umstellung der Seiten auf Container/Grid, Responsiv-Regress gegen Baseline.

---

### Phase 5 — A11y, Humanity-Centered & Sustainability `[NOR][BEC]` — ⬜

**Abhängigkeit:** nach {3,4}. **Maturity-Reihenfolge:** Usability → A11y (Pflicht) → erst dann Delight.

**Tasks**

1. Semantisches HTML (button/a/nav/main/header/footer, Heading-Hierarchie, Skip-Link, alt/Labels); keine `div`-Buttons.
2. Tastatur: alles fokussierbar, logische Tab-Reihenfolge, sichtbarer `:focus-visible`-Ring, keine Hover-only; Modals mit Esc/Close.
3. ARIA nur wo nötig; Input-Labels; Formfehler programmatisch verknüpft (`aria-describedby`/`role="alert"`); `aria-busy`.
4. Kontrast WCAG 2.2 AA; `prefers-reduced-motion` (Dauer→0); `prefers-color-scheme` als Theme-Default.
5. Kein WEIRD-Bias: i18n (`<html lang>` je Request, kein stilles `en`), `Intl.*` mit request-locale, **ein** `fullName`-Feld, kulturneutrale Beispiele.
6. Verständliche Sprache: alle Strings über i18next-Namespaces; kein Jargon/ALL-CAPS; Klartext-Fehler + Lösung; Voice konstant, Tone szenarioabhängig.
7. Ehrliche Metriken: Vanity→**Outcome-Events** in `lib/metrics/definitions.ts` (`{name,hypothesis,whatItProxies,validityCaveat,scaleType,story}`); ordinal→**Median** (`aggregate.ts` + Test); **kein** Aggregat-Score in nutzersichtbaren Status-UIs (qualitativer Überblick + Drilldown); ≥1 subjektive Qualitätsmetrik.
8. Sustainability: toter Code/Deps = 0 (`knip`/`ts-prune`/`depcheck`, keine npm-Duplikate); `React.lazy()`+`Suspense`; Bilder build-time via **sharp** zu AVIF/WebP (`srcset`/`sizes`, `width`/`height`, `loading="lazy"`, LCP `fetchpriority="high"`); self-hosted Inter; Vendor-Chunks in `vite.config.ts`; First-Load-JS/Route ≤ Baseline.
9. Resilienz/lose Kopplung: pro Route `errorElement` (RR7 `useRouteError`) + `<Suspense fallback>`-Skeleton + Catch-all (`path="*"`); jeder externe Fetch defensiv (try/catch + Fallback + Timeout) hinter `lib/`-Adapter; Progressive Enhancement (SSR-Kerninhalt).
10. Selbstbeobachtung: Boundaries melden an Monitoring (Details nur serverseitig); Web-Vitals (`web-vitals` onCLS/onLCP/onINP); CI Bundle/Lighthouse-Budget-Gate.

**Definition of Done**

- [ ] **0** kritische axe-Verstöße auf allen Hauptseiten; voll tastaturbedienbar; Fokus sichtbar; Lighthouse-A11y ≥95.
- [ ] WCAG 2.2 AA-Kontraste; `prefers-reduced-motion` + `prefers-color-scheme`.
- [ ] i18n/`Intl.*` mit request-locale, `fullName`; keine WEIRD-Hardcodings.
- [ ] Alle Strings lokalisiert; kein ALL-CAPS/Jargon; Klartext-Fehler + Lösung; Voice/Tone dokumentiert.
- [ ] Outcome-Events mit `definitions.ts`; ordinal→Median (Test grün); ≥1 subjektive Metrik; kein Aggregat-Score in nutzersichtbaren UIs.
- [ ] Dark-Pattern-Checkliste je Flow grün.
- [ ] Kein toter Code/Deps; Code-Splitting; Bilder optimiert; Inter self-hosted; First-Load-JS/Route ≤ Baseline ohne dokumentierte Begründung.
- [ ] Jede Route: `errorElement` + `<Suspense fallback>` + Catch-all-404; externer Ausfall degradiert nur Segment; Monitoring + Web-Vitals in Boundaries.

**Verifikation (Auszug):** `npx @axe-core/cli "$URL" --tags wcag2a,wcag2aa` (0);
Lighthouse-A11y-Gate `node -e "…score>=0.95…"`; `rg -n "errorElement|useRouteError|<Suspense" src/routing src/App.tsx`;
`rg -n "<div[^>]*onClick" src` (leer); `rg -n "'en-US'|toLocaleString\(\)|firstName|lastName" src` (leer/begründet);
`npm test -- aggregate`; `npx knip||npx ts-prune; npx depcheck`.

**Status IST:** **offen** — `src/routing/*` (SegmentErrorBoundary/RootErrorBoundary/RouteFallback/NotFound)
fehlt; `App.tsx` nutzt `Suspense fallback={null}` (kein Skeleton) + `path="*"`, aber **kein** `errorElement`/
`useRouteError`; Web-Vitals/Monitoring, sharp-Bildpipeline, Outcome-Events-Verdrahtung noch zu erbringen.

---

### Phase 6 — UX-Validierung: States, Content, Maturity & Resilienz `[BEC][NOR]` — ⬜

**Abhängigkeit:** nach 5.

**Tasks**

1. **Alle UI-States** je datengetriebener Komponente: loading (Suspense-Skeleton + `aria-busy` / `isPending`) / empty (Text + CTA, kein Lorem) / error (RR7 `errorElement`, Klartext + Retry) / success (Toast/Inline + aktualisierter Zustand). Keine „nur Happy Path".
2. Content-First: Inhalte aus `content/`/i18next; pro `page.tsx` zuerst Inhalts-Outline als Kommentar, dann Layout; generische Platzhalter durch echten Inhalt.
3. Fehlerprävention & User Control: clientseitige Validierung (zod + react-hook-form) inline; destruktive Aktionen mit Bestätigung; Modals mit Esc/Close; Undo wo möglich; kein Datenverlust.
4. Extrem-Content testen (leer / 1 / viele / sehr lang/kurz / Rollen / fehlende Bilder) ohne Layout-Bruch; auf atomarerer Ebene fixen.
5. `docs/ux/heuristics-audit.md` (Nielsen 10) je Seite → Tickets.
6. `docs/ux/maturity-audit.md` bottom-up (usable→useful→desirable→delightful); Mindestziel usable+useful; Delight nicht vor A11y.
7. Aufgaben-Orientierung & Story: zentrale Nutzeraufgabe je Seite; primärer CTA unterstützt sie; narratives Akzeptanzkriterium erfüllt; KPI-Ansichten mit „Was bedeutet das"-Narrativ.
8. Feature-Graveyard prüfen (leere Used-by/0-Klick) → `docs/GRAVEYARD.md` + Nachfrage §1.17; Code aus `main` nur nach Freigabe entfernen.
9. Scope-Wirkung messen: vor Erweiterung Bundle-/Render-/Datenkosten; kleinere zielerfüllende Variante; Web Vitals nicht verschlechtern.
10. **Fail fast mit echten Nutzern:** Preview-Deploy + ≥1 Usability-Runde (reale Nutzer) → `docs/ux/user-testing.md`; offene Annahmen → `insights.md` + Feature-Flag.

**Definition of Done**

- [ ] Jede datengetriebene Komponente: loading/empty/error/success (+partial); kein Lorem/`placeholder.png`/Stacktrace ausgeliefert.
- [ ] Layout hält mit realen, extremen Inhalten.
- [ ] Destruktive Aktionen mit Bestätigung; Modals mit Esc/Close; Forms validiert; Undo/abbrechbar.
- [ ] `heuristics-audit.md` + `maturity-audit.md` je Hauptseite; Findings als Tickets; Delight nicht vor A11y.
- [ ] Primärer CTA eindeutig & aufgabenunterstützend; narratives Kriterium erfüllt; KPI-Ansichten mit Narrativ.
- [ ] Graveyard-Kandidaten in `GRAVEYARD.md`; ggf. nach Nachfrage entfernt.
- [ ] ≥1 Usability-Runde in `user-testing.md`; offene Hypothesen in `insights.md`.

**Verifikation (Auszug):** `npm test`; `rg -ni "lorem|placeholder\.(png|jpg)|TODO" src` (leer);
`rg -n "stack\b|stacktrace" src/routing src/pages`; `test -f docs/ux/heuristics-audit.md … user-testing.md … GRAVEYARD.md`;
manuell: invalide Formulareingaben → Klartext-Fehler inline, kein Datenverlust.

**Status IST:** **offen** — `feedback/empty-state` + `spinner` als Bausteine vorhanden; State-Vollständigkeit
je Seite, Extrem-Content-Tests, Nielsen-/Maturity-Audits, User-Testing-Protokoll noch zu erstellen.

---

### Phase 7 — Doku, Pattern Library & Governance `[BUD][FRO]` — ⬜

**Abhängigkeit:** nach 6 (Abschluss).

**Tasks**

1. Lebende Pattern Library (Storybook **oder** `/styleguide`-Route), importiert **dieselben** Komponenten wie die App (Holy Grail); jedes Atom/Molecule/Organism isoliert mit allen Variants/Sizes/States + Edge-Cases. → **Tool-Entscheidung** (Storybook nicht installiert): `ASSUMPTION` = leichtgewichtige `/styleguide`-Route (kein neues Build-Tool, §1.16), Storybook nur auf Freigabe.
2. Komponenten-Doku (5 Pflichtteile) je Komponente (MDX/co-located): Anatomy · Playground/Galerie · Usage · Do's & Don'ts · Code-Snippet aus echtem Code.
3. Komponenten-Test/Abnahme + **visuelle Regressionssuite** (Playwright-Screenshots §7.4) im CI grün.
4. Token-Doku finalisieren (`tokens/README.md`: Convention, Ebenen, One-off, Pipeline, Token→Verwendung).
5. `PATTERNS.md` + `lineage.md` finalisieren (Uses/Used-by; ungenutzte entfernt).
6. Governance `docs/design-system/DESIGN_SYSTEM.md`: Modify/Add/Remove-Prozess (Add ab 2. Use-Case; Remove als `@deprecated` statt Hard-Delete); **Team-Modell** (Solitary/Centralized/Federated + Makers/Users) via `.github/CODEOWNERS` (`tokens/**` + `design-system/**`) → bei Unklarheit `ASSUMPTION`; Changelog-Pflicht-CI.
7. `CHANGELOG.md` (markup/style/script/spec × new/enhancement/fix, SemVer + datiert).
8. Holy Grail: Library + Produktion teilen dieselben TSX-Komponenten; genau eine Definition.
9. `REFACTOR-LOG.md` abschließen: Vorher/Nachher-Metriken (Phase 0 vs. final).

**Definition of Done**

- [ ] Pattern Library deckt alle öffentlichen Komponenten + States + Edge-Cases; baut fehlerfrei; importiert dieselbe Quelle; visuelle Regressionssuite grün.
- [ ] Jede öffentliche Komponente hat 5-teilige Usage-Doku.
- [ ] `tokens/README.md`, `PATTERNS.md`, `lineage.md`, `DESIGN_SYSTEM.md`, `CHANGELOG.md`, `.github/CODEOWNERS` vollständig.
- [ ] Library + Produktion teilen Komponenten (genau eine Definition); `knip`/`ts-prune` = 0.
- [ ] Abschluss-Metriken im Log; alle Gates (§5 Globale DoD) erfüllt.

**Verifikation (Auszug):** `npm run build-storybook` (falls Storybook) bzw. `/styleguide`-Build;
`npm run build && typecheck && lint`; Doku-Vollständigkeitsschleife (jede Komponente hat `.mdx`/`.md`);
Holy-Grail-Count = 1; `test -f docs/design-system/DESIGN_SYSTEM.md CHANGELOG.md lineage.md PATTERNS.md tokens/README.md .github/CODEOWNERS`.

**Status IST:** **offen** — `CHANGELOG.md` existiert (Format/Vollständigkeit prüfen); kein Storybook/Styleguide,
keine 5-teilige Komponenten-Doku, keine `DESIGN_SYSTEM.md`/`CODEOWNERS`/`lineage.md`/`PATTERNS.md`,
keine visuelle Regressionssuite.

---

## D. Globale Definition of Done (§5) — projektweit, vor Abschluss

- [ ] **0** hartkodierte Design-Werte außerhalb der Token-Quelldateien (Grep-Beweis, Allowlist §1.19).
- [ ] Vollständige Atomic-Struktur; Import-Richtung top-down (ESLint-`boundaries`); **0** Zyklen (`madge`); keine Duplikate; agnostische + Industriestandard-Namen.
- [ ] Drei Token-Ebenen sauber (Component→Semantic→Primitive).
- [ ] Theming über Token-Sets (kein FOUC); ein Typeface (self-hosted Inter); Body/Input ≥16px.
- [ ] Ein dominantes Element/View; max. 1 Primary/Sektion; rollenbasierte Farbe; Typo-Skala/8pt-Soft-Grid; Schatten nur interaktiv.
- [ ] Forms/Artikel in Reading-Width; 12-Spalten-Grid responsiv ohne Bruch; Touch ≥44px.
- [ ] WCAG 2.2 AA; tastaturbedienbar; 0 kritische axe; Lighthouse-A11y ≥95; reduced-motion + color-scheme; i18n/`Intl.*`/`fullName`.
- [ ] Alle Strings lokalisiert; Klartext-Fehler; keine Dark Patterns.
- [ ] Outcome-Events (`definitions.ts`); ordinal→Median; ≥1 subjektive Metrik; kein Aggregat-Score in nutzersichtbaren UIs.
- [ ] Kein toter Code/Deps; `React.lazy` + sharp-Bilder + self-hosted Fonts; First-Load-JS/Route ≤ Baseline; Budget-Gate aktiv.
- [ ] Jede Route: `errorElement` + `<Suspense fallback>` + Catch-all-404; externer Fetch hinter `lib/`-Adapter; Monitoring + Web-Vitals.
- [ ] Alle datengetriebenen UIs mit loading/empty/error/success; Extrem-Content getestet; kein Lorem/Stacktrace.
- [ ] Alle Artefakte vorhanden (inventory, backlog, problem-statements, personas+stories, insights, research-summary, heuristics-audit, maturity-audit, user-testing, GRAVEYARD, PATTERNS, lineage, Governance+CODEOWNERS, Changelog).
- [ ] `build` + `typecheck` + `lint` + Pattern-Library + visuelle Regression grün; 5-teilige Usage-Doku + Token-Doku; genau eine Definition pro Komponente.
- [ ] `REFACTOR-LOG.md` mit Vorher/Nachher-Metriken; `pre-refactor-baseline`-Tag erhalten.

**STOPP erst**, wenn alle Per-Phase-DoD **und** diese globale DoD über **≥2 stabile Runden** grün belegt sind.

---

## E. Offene ASSUMPTIONS (in jeden betroffenen PR-Text übernehmen)

Diese Defaults wurden für `TODO`-Felder gewählt (PROJECT-DECISIONS) und sind menschlich zu bestätigen —
sie blockieren den Lauf nicht (§1.17). In Code-Kommentar **und** PR-Body als
`ASSUMPTION — needs human confirmation` markieren:

1. **Primärfarbe = Navy `#083358`** (CTA), Sekundär `#0d527f`, Consumer-Akzent teal-600. _(Code-abgeleitet, aber Marken-Entscheidung.)_
2. **Theme-Split:** Main-Site default **dark**, Consumer **light**; expliziter UI-Theme-Toggle nur auf Freigabe.
3. **Tonalität:** Main = sachlich-vertrauensvoll B2B; Consumer = direkter/wärmer.
4. **Scope „bleibt":** alle aktuellen Routen bleiben; Streichungen nur nach Freigabe via GRAVEYARD.
5. **Tabu/Infra:** Consumer-Checkout, Chat, i18n-Routing-Infra, gesamte Deployment-Infra **unangetastet**.
6. **Performance-Budget:** ≤ Phase-0-Baseline/Route, Ziel <100 KB gz; Überschreitung nur dokumentiert.
7. **Pattern-Library-Tool:** leichtgewichtige `/styleguide`-Route statt Storybook (kein neues Build-Tool, §1.16) — Storybook nur auf Freigabe.
8. **Governance-Team-Modell:** Default **Centralized** (Makers = Design-System-Owner via CODEOWNERS auf `tokens/**` + `design-system/**`); Users konsumieren.
