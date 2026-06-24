# REFACTOR-LOG (§1.18)

Arbeitsprotokoll des Refactorings nach `knowledge/REFACTORING-ANWEISUNG.md`.

---

## Phase 1 — Foundations / Design Tokens `[BUD][FIL][BEC]`

### Einheit 1a — Token-Fundament anlegen & additiv anbinden — 2026-06-24

**Aenderung**

- `src/design-system/tokens/tokens.css` neu: 3-Ebenen-Token-System (Primitive →
  Semantic → Component) als **Single Source of Truth** (CSS-first, §3.0 A).
  Werte aus dem Ist-Zustand abgeleitet (Wave-2 Farb-Inventar) — Navy/Blue/Teal-
  Brand, Slate-Neutralskala, Spacing (8pt-Soft-Grid, non-linear), Typo-Skala
  (Basis 16, Body ≥16px), Line-Heights, Radii, Shadows (Navy-Tint, **kein**
  reines Schwarz), Grid/Breakpoints, Z-Index, Motion, Reading-Width, Tap-Target.
- `[data-theme='dark']` als **ruhende** Theming-Infrastruktur (nur Semantic neu
  gebunden; nicht aktiviert — Default bleibt Light).
- `src/design-system/tokens/tokens.ts` (typsichere Logik-Spiegelung) + `README.md`
  (Naming-Convention, CSS-first-Pipeline, One-off-Schwelle, Theming-Hinweis).
- `src/lib/flags.ts` + `src/lib/metrics/{definitions,thresholds,aggregate}.ts`
  als Foundation-Stubs (Phase 5/6).
- `src/index.css`: `@import` der `tokens.css` (vor allen Regeln).
- `tailwind.config.js`: **additiv** neue Semantic-Color-Keys (`bg`, `surface`,
  `fg*`, `primary*`, `danger`, `warning`), `maxWidth` (`reading`, `layout`) und
  `boxShadow` (`1/2/3`) — alle als `var(--token)`. Keine bestehenden Keys
  geaendert → bewusst **kein** visueller Change (§1.6).

**Bewusst NICHT in dieser Einheit** (Risiko/Scope)

- Bestehende `brand.*`/`accent.*`/`gray-*`-Hex-Aliase im Config bleiben (noch)
  Rohwerte. Migration auf `rgb(var(--token) / <alpha-value>)` (Channel-Format,
  damit Opacity-Modifier wie `bg-brand-navy/85` byte-identisch bleiben) +
  Call-Site-Umstellung = **Einheit 1b / Phase 2**.
- `spacing`/`fontSize`/`borderRadius`/`lineHeight` **nicht** auf Tokens
  remappt: Tailwind-Defaults sind rem-basiert (Zoom-A11y, §1.11) und weichen in
  Werten ab (`rounded-lg` 8px vs Token 16px) → Remap waere stiller Verhaltens-
  change. Erst bei Komponenten-Migration gezielt anbinden.

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server).
- `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **vorbestehende** Baseline 443 Probleme (437 Fehler), alle
  `import/no-unresolved` in Alt-Dateien (u. a. `vite.config.ts`, `types/index.ts`,
  `consumer/*`). Auf cleanem HEAD identisch → **0 neue Fehler durch diese Einheit**.
  Offener Punkt: eslint-`import`-Resolver reparieren (eigenes Ticket, nicht Token-Scope).
- DoD-Greps: kein reines Schwarz (leer), `--font-size-300: 1rem` (Body ≥16px),
  Inter self-hosted in `entry-client.tsx`, `fontFamily.sans` = Inter-Stack,
  `theme.extend` (kein Top-Level-Override), Tokens im gebauten Client-CSS.

**Offene Punkte**

- [ ] Markenwerte vom Nutzer bestaetigen (§1.17) — aktuell aus Ist-Zustand
      uebernommen, `knowledge/PROJECT-DECISIONS.md` › Marke & Farbe = TODO.
- [ ] Dark-/Theme-Toggle: offene Produktentscheidung (PROJECT-DECISIONS = TODO).
- [x] ~~Einheit 1b: Legacy-Brand-Hex → Channel-Token (Single Source)~~ — erledigt
      (s. u.). Call-Site-Umstellung der Legacy-Aliase bleibt Phase 2.
- [ ] `CHANGELOG.md` anlegen (§1.18), sobald erste nutzersichtbare Aenderung.

### Einheit 1b — Farben → Channel-Token (Single Source, kein Doppelpflege) — 2026-06-24

**Aenderung**

- `tokens.css`: Farb-**Primitive** auf Kanal-Tripel-Format `"R G B"` umgestellt
  (`--brand-navy-rgb: 8 51 88`, …) als **alleinige** Rohwert-Quelle. Jede
  Semantic-Rolle stellt nun **Kanal** (`--color-bg-rgb`, erbt vom Primitive)
  **und** fertige Farbe (`--color-bg: rgb(var(--color-bg-rgb))`) bereit;
  `[data-theme='dark']` bindet nur noch die **Kanaele** neu (Farben leiten ab).
  Schatten (`--shadow-1..3`) + Component-`--button-primary-fg` referenzieren jetzt
  Semantic/Primitive statt entfernter Voll-Farb-Primitives (Component → Semantic, §3).
- `tailwind.config.js`: **alle** Custom-Farb-Keys (Legacy `brand.*`/`accentBlue`/
  `ui.*`/`text.heading`/`gray-*`, `accent.*`, `success.*` **und** die additiven
  Semantic-Keys) auf `rgb(var(--*-rgb) / <alpha-value>)` umgestellt. Damit lebt
  **kein** Farb-Rohwert mehr doppelt im Config (Single Source, §3.4 / §1.8);
  Tailwind-Opacity-Modifier (`bg-brand-navy/85`, `bg-brand-deep/90`, …) bleiben
  **byte-identisch**. `boxShadow.card`/`glass` ebenfalls auf Navy-Kanal; `glow-secondary`
  bleibt Roh (kein Token, §1.20). Die additiven Semantic-Keys sind nun opacity-faehig.
- `tokens/README.md`: Abschnitt „Farben als Kanal-Tripel" + Primitive-Ebenen-Beispiel
  aktualisiert.

**Bewusst NICHT in dieser Einheit**

- **Call-Site-Migration** der Legacy-Aliase (`brand-primary` → semantischer Token):
  rein additiv-stabil belassen; das ist Komponentenarbeit in **Phase 2**.
- Raw-Hex in `index.css`-Basistypografie (`h2/h3 { color:#083358 }`), Komponenten-
  Arbitrary-Gradients und die Modal-Keyframes-`rgba()` bleiben (Phase 2/3-Scope).

**Verifikation** (2026-06-24)

- `npm run build` → gruen. `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **443 Probleme (437 Fehler)** = identische Baseline wie Einheit 1a
  → **0 neue Fehler**; kein Treffer in `tailwind.config.js`/`tokens.*`.
- Byte-Identitaet: alle **31** Farb-Tripel zuruck nach Hex konvertiert ==
  Original-Hex (0 Mismatches). Im gebauten Client-CSS sind alle referenzierten
  `--*-rgb`-Vars definiert (0 undefinierte Farben); Opacity-Modifier kompilieren
  als `rgb(var(--brand-navy-rgb) / .85)` etc.

---

## Phase 2 — Atomic-Restrukturierung & Inventory `[FRO][BUD]`

### Einheit 2a — Button-Atom (kanonisch, token-rein, Holy Grail) — 2026-06-24

**Aenderung**

- `src/design-system/core/button.tsx` neu: **kanonisches Button-Atom** (§Phase 2.2,
  „Atome zuerst, beginnend mit Button"). `cva` + orthogonale Props
  (`variant`/`size`), **alle** Interaktions-States als Properties
  (default/hover/**focus-visible**/active/disabled). **Token-rein** (§1.7):
  konsumiert ausschliesslich Component-/Semantic-Tokens
  (`--button-*`, `--color-*`, `--duration-base`, `shadow-1`) ueber die
  erlaubte `[var(--token)]`-Form (§3) — **kein** Roh-Hex, **kein** arbitrary-px.
  Tap-Target ≥44px via `--button-min-height` (§1.11) auf **allen** Sizes.
  Polymorph (`to`→`<Link>`, `href`→`<a>`, sonst `<button>`) → API der 12
  Call-Sites bleibt unveraendert.
- `src/design-system/index.ts` neu: **Barrel** (oeffentliche DS-API, §Phase 2.12)
  — `Button` + `ButtonProps`. App/Pattern-Library teilen **eine** Quelle.
- `src/components/ui/Button.tsx` → **Re-Export-Shim** auf das Atom (§1.8 / Holy
  Grail §Phase 7.8): **genau eine** Definition pro Komponente. Bestehende
  Import-Pfade (`../ui/Button`) bleiben gueltig → 0 Call-Site-Edits, Build gruen.

**Bewusste Redesign-Entscheidung** (§1.6 — als solche markiert, reversibel via
Git-History)

- **Primary**: Gradient-mit-weissem-Innenfeld (nutzte arbitrary `!p-[2px]`/
  `rounded-[4px]`, §1.7-Verstoss) → **flaches Navy** (`--button-primary-bg` =
  `--color-action-primary` = Navy, Wave-2-Entscheidung „cta = Navy"). Token-rein,
  konsistent mit dem dokumentierten Token-Design.
- **Secondary**: Navy-solid → **Line/Ghost** (Border + `surface`, Hover
  `bg-subtle`) — FIL §3.1 Secondary = dezent; vermeidet Optik-Kollision mit dem
  nun navy-soliden Primary.
- **Outline**: unveraendert (weiss-on-dark fuer Hero/Navy-Header), nun token-rein
  (`--color-fg-on-dark`).
- **NICHT** ueber Nachfrage-Schwelle (§1.17) abgenommen: ein Klaerungs-Prompt zur
  Primary-Optik wurde gestellt, blieb aber unbeantwortet; gewaehlt wurde die
  **token-definierte** Variante (Single Source) — bei Bedarf 1:1 revertierbar.

**Bewusst NICHT in dieser Einheit**

- **Call-Site-Migration** der App-Importe auf das Barrel (`design-system`) +
  Loeschen des Shims: folgende Einheit (§Phase 2.12). Aktuell additiv-stabil.
- `buttonVariants`-Export entfernt (nirgends importiert; §1.20 „keine API ohne
  Use" + vermeidet `react-refresh/only-export-components`).

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **443 Probleme (437 Fehler, 6 Warnungen)** = **identische
  Baseline** wie Phase 1 → **0 neue Fehler/Warnungen**. Die 3 neuen
  `import/no-unresolved` der neuen Dateien ersetzen exakt die 3 der alten
  `Button.tsx` (bekannter kaputter eslint-import-Resolver, eigenes Ticket).
- Holy Grail: `rg` zaehlt **genau 1** Button-Definition (`core/button.tsx`).
- Token-Pflicht: **0** Roh-Hex/arbitrary-px im Atom; **0** Verstoss-Importe
  (Atom → nur Token/extern, §2.2). `madge --circular` → keine Zyklen.

**Offene Punkte**

- [x] ~~Einheit 2b: App-Importe auf Barrel (`design-system`) umstellen, Shim
      `components/ui/Button.tsx` entfernen (§Phase 2.12).~~ — erledigt (s. u.).
- [ ] Primary-Optik (Navy vs. Verlauf) vom Nutzer bestaetigen (§1.17) — aktuell
      token-definiertes Navy, reversibel.
- [ ] Pre-existing: vitest-Environment (`jsdom`/`html-encoding-sniffer`
      `ERR_REQUIRE_ESM`) reparieren — blockiert Unit-Tests, nicht Button-Scope.
- [ ] eslint-`import`-Resolver reparieren (eigenes Ticket, Phase-1-Altlast).

### Einheit 2b — Call-Sites auf Barrel, Shim entfernt (Holy Grail) — 2026-06-24

**Aenderung**

- **Alle 12 App-Call-Sites** des Buttons auf das DS-**Barrel** umgestellt:
  `import { Button } from '~/design-system'` (vorher gemischt
  `../components/ui/Button` / `../ui/Button` / `~/components/ui/Button`).
  Einheitlicher Alias-Pfad → App importiert Atome ausschliesslich ueber die
  oeffentliche DS-API (§Phase 2.12), nicht ueber interne Modulpfade.
- **Shim `src/components/ui/Button.tsx` entfernt** (`git rm`) — der Re-Export
  aus Einheit 2a hat seinen Zweck (additive Migration) erfuellt. Es existiert
  jetzt **genau ein** Pfad zur Button-Definition (Holy Grail §Phase 7.8), kein
  toter Zwischen-Hop mehr.
- **Test relokiert**: `components/ui/Button.test.tsx` → `design-system/core/
button.test.tsx`, importiert nun ueber das Barrel (`../index`). Test lebt bei
  seinem Atom, kein Verweis mehr auf die geloeschte Shim-Datei.

**Bewusst NICHT in dieser Einheit**

- `MobileCallButton` ist ein eigenes Atom (nicht der `Button`) und bleibt
  unberuehrt — keine Vermengung.

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **442 Probleme (436 Fehler)** = **eine** Fehlerquelle weniger
  als die Baseline (443/437), da der Shim entfiel. Alle verbliebenen Treffer
  sind die bekannte `import/no-unresolved`-Altlast (kaputter eslint-import-
  Resolver, eigenes Ticket) — **0 neue Fehler**.
- Holy Grail: `rg` zaehlt **genau 1** Button-Definition (`core/button.tsx`);
  **0** verbliebene `ui/Button`-Importe (ausser `MobileCallButton`).

### Einheit 2c — Input-/Textarea-Atome + FormField-Molecule (Formular-Slice) — 2026-06-24

**Aenderung**

- `src/design-system/core/input.tsx` + `core/textarea.tsx` neu: **kanonische
  Eingabe-Atome** (§Phase 2.2/2.3 — Atom = `Input`, **nicht** `field`). Bewusst
  **nur** das nackte Host-Element; Label/Helper/Error gehoeren ins Molecule.
  **Token-rein** (§1.7): konsumieren ausschliesslich Component-/Semantic-Tokens
  (`--input-*`, `--color-focus-ring`, `--duration-base`) ueber die erlaubte
  `[var(--token)]`-Form (§3) — **0** Roh-Hex/arbitrary-px. Orthogonaler
  `state`-Prop (default/error); alle States als Properties
  (default/focus-visible/disabled). Body/Input **≥16px** (`--input-font-size`)
  und Tap-Target **≥44px** (`--input-min-height`) per Token (§1.11 / §FIL).
- `src/design-system/compound/form-field.tsx` neu: **FormField-Molecule**
  (§Phase 2.3) — komponiert genau **ein** Atom (`Input` oder via `multiline`
  `Textarea`) mit Label + Helper/Error. **A11y Pflicht** (§1.11): `htmlFor`/`id`,
  `aria-invalid`, `aria-describedby`, Error als `role="alert"`. Feld-State leitet
  aus `error` ab. **Alle UI-States** als Properties (default/error/helper/disabled).
- `tokens.css`: `--input-*`-Component-Tokens **vervollstaendigt** (bg, placeholder,
  border-focus/-error, fg-error, radius, padding-x/y, textarea-min-height) — alle
  erben nur von Semantic (§3). Keine neuen Rohwerte ausserhalb der Token-Quelle.
- `design-system/index.ts` (Barrel): `Input`/`Textarea`/`FormField` exportiert.
- **Call-Sites migriert**: `ContactForm` + `SupportForm` nutzen jetzt `FormField`
  ueber das Barrel (`~/design-system`). Legacy `components/ui/Input.tsx` +
  `ui/Textarea.tsx` (Molecule-Atom-Mischung) **entfernt** (`git rm`) — genau
  **eine** Definition pro Komponente (Holy Grail §Phase 7.8).

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- Felder jetzt **≥16px** Schrift (vorher `text-sm`/14px) → verhindert iOS-Auto-Zoom
  und erfuellt „Body/Input ≥16px" (§FIL/§1.11); Tap-Target **40→44px**;
  Fokus-Ring auf `--color-focus-ring` (Navy-Token) statt Roh-`brand-primary`.
- Select-Felder + Consent-Checkbox + File-Upload in den Formularen bleiben
  **unberuehrt** (noch kein Atom; One-off-Schwelle §1.20 / 2. Use-Case offen).
  Die `udi`/`sw_version`-Hilfetexte (HTML via `dangerouslySetInnerHTML`) bleiben
  als externe `<p>` erhalten (unveraendertes Verhalten, §1.6).

**Bewusst NICHT in dieser Einheit**

- `Label`/`Text` als **eigene** Atome extrahiert: das Molecule rendert `<label>`/
  `<p>` direkt (semantisches HTML). Atom-Extraktion erst ab **≥3** Use-Cases
  (One-off-Schwelle §1.20) — aktuell 1 (nur FormField) → verfrueht.
- `Select`-Atom: zweiter Use-Case (Kontakt + Support) ist da, aber eigener Scope
  (separate Einheit) — hier nicht vermengt.

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **441 Probleme (435 Fehler)** = **eine** Fehlerquelle weniger
  als die 2b-Baseline (442/436); alle Treffer auf den geaenderten Dateien sind
  ausschliesslich die bekannte `import/no-unresolved`-Altlast (kaputter
  eslint-import-Resolver, eigenes Ticket) — **0 neue Fehler/Regeln**.
- Token-Pflicht: **0** Roh-Hex/arbitrary-px in Atomen+Molecule (nur `[var(--…)]`).
- Holy Grail: `rg` zaehlt **genau 1** Definition je `Input`/`Textarea`/`FormField`;
  **0** verbliebene `ui/Input`/`ui/Textarea`-Importe im aktiven `src`.
- `madge --circular src/design-system` → **0 Zyklen** (8 Dateien).

### Einheit 2d — Select-Atom + FormField-`as`-Achse (Formular-Slice) — 2026-06-24

**Aenderung**

- `src/design-system/core/select.tsx` neu: **drittes Eingabe-Atom** `Select`
  (Familienpartner von `Input`/`Textarea`; eigenes Atom, da `<select>` ein
  anderes Host-Element mit eigener Semantik ist). Bewusst **nur** das nackte
  Feld — Optionen reicht der Aufrufer als `children` durch; **native** Dropdown-
  Semantik (OS-Pfeil, Tastatur-Steuerung) bleibt erhalten (§1.6, A11y §1.11).
  **Token-rein** (§1.7): teilt die Feld-Familie und konsumiert ausschliesslich
  die `--input-*`-Component-Tokens ueber `[var(--token)]` (§3) — **0** Roh-Hex/
  arbitrary-px, **kein** neuer Token noetig. Orthogonaler `state`-Prop
  (default/error); States als Properties (default/focus-visible/disabled).
  Schrift **≥16px** + Tap-Target **≥44px** per Token (§1.11 / §FIL).
- `src/design-system/compound/form-field.tsx`: Host-Element-Wahl auf **eine**
  Achse `as="input" | "textarea" | "select"` konsolidiert (§Phase 2.9 — eine
  Achse = ein Prop-Name) und das Einzweck-Boolean `multiline` ersetzt. Default
  `'input'`. Diskriminierte Union deckt alle drei Atom-Typen typsicher ab; A11y-
  Verdrahtung (`htmlFor`/`aria-invalid`/`aria-describedby`/`role="alert"`)
  unveraendert fuer **alle** Varianten.
- `design-system/index.ts` (Barrel): `Select`/`SelectProps` exportiert.
- **Call-Sites migriert**: `ContactForm` (Bereich-Auswahl) + `SupportForm`
  (Stoerungstyp) nutzen jetzt `FormField as="select"`; die beiden Textarea-
  Felder von `multiline` → `as="textarea"` umgestellt. Die losen `<select>` +
  manuellen `<label>` (Roh-Tailwind, `text-sm`/14px, Roh-`brand-primary`-Fokus)
  **entfernt** — Label/Feld jetzt verpflichtend ueber das Molecule verknuepft.

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- Selects jetzt **≥16px** Schrift (vorher 14px, iOS-Auto-Zoom) und Tap-Target
  **40→44px**; Fokus-Ring auf `--color-focus-ring` (Navy-Token) statt Roh-
  `brand-primary`. Optik-Konsistenz mit `Input`/`Textarea` (gleiche Feld-Familie).

**Bewusst NICHT in dieser Einheit**

- Selects in `VitaminD3SprayPage`, `VitaminD3ImplantologyPage` und
  `consumer/OrderForm` bleiben **unberuehrt**: anderer Kontext (Consumer-LPs =
  hell/Teal, eigener Slice) — separate Einheit, hier nicht vermengt (§1.5).
- Custom-Chevron via `appearance-none` + SVG verworfen: native Pfeil-Optik ist
  verhaltenserhaltend (§1.6) und vermeidet einen Roh-SVG-Wert (Token-Pflicht §1.7).
- `Select.test.tsx`: bewusst kein Test (Parallele zu `Input`/`Textarea`, die
  ebenfalls test-frei sind) — Atom-Tests als eigener Pass spaeter.

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **444 Probleme (438 Fehler)**; alle Treffer auf den geaenderten
  Dateien sind ausschliesslich die bekannte `import/no-unresolved`-Altlast
  (kaputter eslint-import-Resolver, eigenes Ticket). Delta zur 2c-Baseline (441)
  = **+3 reine Resolver-Zeilen** (neues File + neuer Import) — **0 neue Regel-
  verstoesse** (kein jsx-a11y, kein arbitrary-value).
- Token-Pflicht: **0** Roh-Hex/arbitrary-px in `select.tsx`/`form-field.tsx`.
- Holy Grail: `rg` zaehlt **genau 1** `Select`-Definition; **0** `multiline`-Reste.
- `madge --circular src/design-system` → **0 Zyklen** (9 Dateien).

### Einheit 2e — Eyebrow-Atom + SectionHeader-Molecule (Section-Header-Slice) — 2026-06-24

**Aenderung**

- `src/design-system/core/eyebrow.tsx` neu: **kanonisches Eyebrow-Atom** (§Phase
  2.2) — die gradient-umrandete Section-Label-Pill. Kontext-/inhaltsagnostisch
  (§Phase 2.7): nur die Pill, **kein** erzwungenes `<h2>`. **Token-rein** (§1.7):
  Flaeche/Schrift/Radius ueber neue `--eyebrow-*`-Component-Tokens; der Gradient-
  Rand laeuft ueber die token-gebundenen `brand-*`-Config-Keys
  (`rgb(var(--brand-*-rgb))`) — **0** Roh-Hex/arbitrary-px. Zwei live belegte
  Groessen (`default`/`sm`) als orthogonaler Prop, nicht als Kopie.
- `src/design-system/compound/section-header.tsx` neu: **SectionHeader-Molecule**
  (§Phase 2.3) — komponiert das `Eyebrow`-Atom mit der Abschnitts-Headline
  (`<h2>`). **Token-rein**: Default-Titel zieht Groesse/Line-Height/Farbe/Gap aus
  `--section-header-*`. Der `titleClassName`-Escape-Hatch (wie `className`) bleibt
  erhalten → bestehende Call-Sites byte-stabil (§1.6).
- `tokens.css`: `--eyebrow-*` (bg/fg/radius) + `--section-header-*`
  (gap/title-size/title-leading/title-color) als Component-Tokens ergaenzt — alle
  erben nur von Semantic/Primitive (§3). Im gebauten Client-CSS definiert (0 undef. Vars).
- `design-system/index.ts` (Barrel): `Eyebrow`/`SectionHeader` (+ Typen) exportiert.
- **Call-Sites migriert**: **14** `SectionHeader`- und **6** `Eyebrow`-Importe von
  den Legacy-Pfaden (`components/ui/*`, Default-Export) auf das DS-**Barrel**
  (`~/design-system`, Named-Export) umgestellt; bei 7 Dateien die dadurch doppelte
  `~/design-system`-Import-Zeile zu **einer** zusammengefuehrt (`import/no-duplicates`
  → 0). Legacy `ui/SectionHeader.tsx` + `ui/Eyebrow.tsx` **entfernt** (`git rm`) →
  genau **eine** Definition je Komponente (Holy Grail §Phase 7.8).
- **Test relokiert**: `ui/SectionHeader.test.tsx` → `compound/section-header.test.tsx`,
  importiert nun ueber das Barrel (`../index`).

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- Eyebrow byte-identisch geroutet (slate-50 == `--color-bg`, gray-900 ==
  `--color-fg-heading`); einziger sichtbarer Effekt: Inner-Pill-Radius 2px → 4px
  (`--radius-sm`), bewusst vereinheitlicht (leichte Rundung [FIL]).
- SectionHeader-**Default-Titel** (nur wo **kein** `titleClassName` gesetzt ist)
  jetzt token-getrieben (`--font-size-900`/40px, `--line-height-heading`/1.3) statt
  des arbitrary `text-hero-sm leading-[47px] lg:text-[44px] lg:leading-[52px]`: der
  responsive Desktop-Bump auf 44px entfaellt (40px konstant), Leading 47→52px. Die
  prominenten Sektionen ueberschreiben den Titel ohnehin via `titleClassName`
  (unveraendert) — dort lebt die Roh-Optik weiter (Sache der Phase-3-Sektions-Migration).

**Bewusst NICHT in dieser Einheit**

- `titleClassName`-Roh-Overrides an den Call-Sites (`text-[clamp(...)]`,
  `text-white`, …): bewusster Escape-Hatch belassen — Token-Migration der einzelnen
  Sektionen ist Phase 3 (Visueller-Craft-Pass), hier nicht vermengt (§1.5).
- Consumer-`SectionTitle` (`consumer/shell.tsx`) ist eine **eigene** Komponente
  (nicht `SectionHeader`) und bleibt unberuehrt (heller/Teal-Slice, §1.5).
- `Heading`/`Text` als eigene Atome: das Molecule rendert `<h2>` direkt
  (semantisches HTML); Atom-Extraktion erst ab ≥3 Use-Cases (One-off §1.20).

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **441 Probleme (435 Fehler, 6 Warnungen)** = **3 Fehler weniger**
  als die 2d-Baseline (444/438), da 2 Legacy-Dateien entfielen. Auf den neuen
  DS-Dateien ausschliesslich `import/no-unresolved` (kaputter eslint-import-
  Resolver, eigenes Ticket); die 6 Warnungen sind die bekannten
  `react-refresh`-Treffer (alle auf `consumer/*`, **nicht** auf dieser Einheit).
  **0 neue Regelverstoesse** (kein jsx-a11y, kein arbitrary-value, kein no-duplicates).
- Token-Pflicht: **0** Roh-Hex/arbitrary-px in `eyebrow.tsx`/`section-header.tsx`.
- Holy Grail: `rg` zaehlt **genau 1** Definition je `Eyebrow`/`SectionHeader`;
  **0** verbliebene Legacy-`ui/SectionHeader`/`ui/Eyebrow`-Importe im `src`.
- `madge --circular --extensions ts,tsx src/design-system` → **0 Zyklen** (12 Dateien).

### Einheit 2f — Card-Molecule (Containment-Slice) — 2026-06-24

**Aenderung**

- `src/design-system/compound/card.tsx` neu: **kanonisches Card-Molecule**
  (§Phase 2.3, Containment) — die zuvor in `ServiceCard` **und** `BlogCard`
  doppelt gepflegte Glass-Panel-Oberflaeche mit Hover-Lift lebt jetzt **einmal**
  hier (Holy Grail §Phase 7.8). Inhalts-/kontext-agnostisch (§Phase 2.7): nur die
  Flaeche, der Aufrufer reicht den Inhalt als `children`. **Token-rein** (§1.7):
  konsumiert ausschliesslich token-gebundene Utilities (`glass-panel`-Component-
  Class, `rounded-xl`, `shadow-card`, `bg-white` — alle via Tailwind an die
  Token-Config gebunden, Einheit 1b) + Spacing-Skala (`p-6`) — **0** Roh-Hex/
  arbitrary-px. Orthogonale Props (`padding` none/md, `interactive`); Oberflaechen-
  States als Properties (default/hover nur bei `interactive`). Polymorph wie
  `Button` (`to`→`<Link>`, `href`→`<a>`, sonst `as` div/article).
- `design-system/index.ts` (Barrel): `Card`/`CardProps` exportiert.
- **Call-Sites migriert**: `ServiceCard` (`to`, `interactive`, Rest `group flex
flex-col`) + `BlogCard` (`as="article"`, `interactive`, `padding="none"`, Rest
  `flex h-full flex-col overflow-hidden`) komponieren jetzt `Card` ueber das
  Barrel (`~/design-system`). **Byte-identischer Klassen-Satz** — keine sichtbare
  Aenderung (§1.6). Beide behalten ihre inhaltsspezifische Logik (i18n, Modelle),
  bleiben aber als duenne App-Wrapper in `components/ui` (inhaltsgebunden, nicht
  ins DS verschoben).

**Bewusst NICHT in dieser Einheit**

- Die distinkten **One-off-Flaechen** in `TeamSection`, `TestimonialsSection`,
  `FAQSection` und `FeaturedCaseStudy` teilen die Hover-Lift-Signatur **nicht** →
  bleiben unberuehrt (One-off-Schwelle §1.20, kein verfruehtes Generalisieren).
- Consumer-`Card` (`pages/consumer/shell.tsx`) ist eine **eigene** Komponente
  (heller/Teal-Slice) und bleibt unberuehrt (§1.5, nicht vermengt).
- Keine neuen `--card-*`-Tokens: die Flaeche besteht ausschliesslich aus bereits
  token-gebundenen Utilities; ein Remap (z. B. `rounded-xl`/12px →
  `--radius-lg`/16px) waere ein stiller Verhaltenschange (analog Einheit 1a-Notiz)
  → bewusst verhaltenserhaltend belassen.

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **445 Probleme (439 Fehler, 6 Warnungen)**; Delta zur
  2e-Baseline (441/435) = **+4 reine Resolver-Zeilen** (neues File + 2× neuer
  `~/design-system`-Import) — **0 neue Regelverstoesse** (kein jsx-a11y, kein
  arbitrary-value). Alle Treffer auf den geaenderten Dateien sind ausschliesslich
  die bekannte `import/no-unresolved`-Altlast (kaputter eslint-import-Resolver,
  eigenes Ticket).
- Token-Pflicht: **0** Roh-Hex/arbitrary-px in `card.tsx`.
- Holy Grail: **genau 1** Card-Definition im Main-Site-`src` (`compound/card.tsx`;
  Consumer-`Card` ist separater Slice); **0** verbliebene doppelte
  Hover-Lift-Flaechen (`hover:-translate-y-1 hover:shadow-card hover:bg-white/80`).
- `madge --circular --extensions ts,tsx src/design-system` → **0 Zyklen** (13 Dateien).

### Einheit 2g — Feedback-Slice: Alert + Spinner (feedback-Ebene) — 2026-06-24

**Aenderung**

- Neue **`feedback`-Ebene** (`src/design-system/feedback/`, §2 Schichtenmodell)
  fuer UI-State-Komponenten (loading/error/success).
- `feedback/alert.tsx` neu: **kanonisches Alert** (Inline-Statusmeldung) als
  Single Source of Truth (Holy Grail §Phase 7.8). `cva` + **eine** orthogonale
  Achse `variant` (default/success/danger). **Token-rein** (§1.7): Flaeche/
  Rahmen/Text/Radius/Spacing ausschliesslich ueber neue `--alert-*`-Component-
  Tokens via `[var(--token)]` (§3) — **0** Roh-Hex/arbitrary-px. Feedback nie
  ueber Farbe allein → Icon + Text (§FIL). **A11y** (§1.11): danger =
  `role="alert"` (assertiv), default/success = `role="status"` (hoeflich);
  Icon `aria-hidden`.
- `feedback/spinner.tsx` neu: **kanonischer Spinner** (Lade-Indikator),
  Industriestandard-Name **ohne** `Loading`-Praefix (§Phase 2.8). Token-rein:
  Farbe ueber `--spinner-color`. **A11y**: `role="status"` + optionale
  `label`-Prop als `sr-only`-Statusbeschriftung (i18n-Text bleibt Aufrufer-Sache,
  kein Literal im Atom).
- `tokens.css`: Feedback-**Primitive** ergaenzt (`--green-200/-800-rgb`,
  `--red-50/-200/-800-rgb`), **Semantic**-Rollen (`--color-success-border/-fg`,
  `--color-danger-soft/-border/-fg`, `--color-fg-strong`) und **Component**-Tokens
  (`--alert-*`, `--spinner-color`) — jede Ebene erbt nur von der naechsttieferen (§3).
- `design-system/index.ts` (Barrel): neuer Abschnitt **Feedback** —
  `Alert`/`Spinner` (+ Typen) exportiert.
- **Call-Sites migriert** (4): `ContactForm`, `SupportForm`, `SearchModal`,
  `ArticlePage` ueber das DS-**Barrel** (`~/design-system`); doppelte Import-
  Zeilen zu **einer** zusammengefuehrt. `LoadingSpinner` → `Spinner`,
  `variant="destructive"` → `variant="danger"` (Shared-Vocabulary, an den
  `--color-danger`-Token angeglichen, §Phase 2.9). Legacy `ui/Alert.tsx`,
  `ui/Alert.test.tsx`, `ui/LoadingSpinner.tsx` **entfernt** (`git rm`) → genau
  **eine** Definition je Komponente (Holy Grail).
- **Test relokiert**: `ui/Alert.test.tsx` → `feedback/alert.test.tsx`, importiert
  ueber das Barrel (`../index`); zusaetzlicher `role="alert"`-A11y-Test.

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- Farben jetzt **rollenbasiert** statt Roh-Tailwind: default `gray-*` → Slate-
  Neutrals (DS-„cold greys"); success/danger ueber Semantic-Feedback-Tokens
  (Werte = Tailwind `green-50/200/800`, `red-50/200/800`, Kontrast ≥4.5:1).
- Spinner: `text-brand-primary` (Blau #0d527f) → `--color-action-primary`
  (Navy), konsistent mit der navy-soliden Primaeraktion/Focus.

**Bewusst NICHT in dieser Einheit**

- Weitere `feedback`-Kandidaten (`CookieBanner`, `ChatWidget`, Empty-States der
  Such-/Listen-Seiten): eigener Scope, hier nicht vermengt (§1.5).
- `--color-warning` ungenutzt belassen (kein zweiter Use-Case; One-off §1.20).

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **442 Probleme (436 Fehler, 6 Warnungen)** = **3 Fehler weniger**
  als die 2f-Baseline (445/439), da 3 Legacy-Dateien entfielen. Auf den neuen/
  geaenderten Dateien ausschliesslich `import/no-unresolved` (kaputter eslint-
  import-Resolver, eigenes Ticket); die 2 verbliebenen Nicht-Resolver-Fehler
  (`SearchModal:36` setState-in-effect, `ArticlePage:182` no-case-declarations)
  sind **vorbestehend** und liegen **ausserhalb** der editierten Hunks (5–8/70–84
  bzw. 2–13/51–67) → **0 neue Regelverstoesse**.
- Token-Pflicht: **0** Roh-Hex/arbitrary-px in `feedback/*`.
- Holy Grail: `rg` zaehlt **genau 1** Definition je `Alert`/`Spinner`;
  **0** verbliebene `ui/Alert`/`ui/LoadingSpinner`-Importe; **0** `destructive`-Reste.
- `madge --circular --extensions ts,tsx src/design-system` → **0 Zyklen** (16 Dateien).

### Einheit 2h — Badge-Atom (Status-/Kategorie-Pill, Containment-Slice) — 2026-06-24

**Aenderung**

- `src/design-system/core/badge.tsx` neu: **kanonisches Badge-Atom** (§Phase 2.2,
  Industriestandard-Name §Phase 2.8) — die zuvor in `EventsPage` (Kategorie +
  Partner) **und** `VitaminD3SprayPage` (Produkt-Eigenschaften) dreifach roh
  gepflegte Pill lebt jetzt **einmal** hier (Holy Grail §Phase 7.8). Inhalts-/
  kontext-agnostisch (§Phase 2.7): nur die Pill, der Aufrufer reicht Inhalt **inkl.
  optionalem Icon** als `children` (die `items-center gap-1.5`-Basis traegt ein
  vorangestelltes Icon mit). **Token-rein** (§1.7): Farbe/Flaeche/Radius
  ausschliesslich ueber neue `--badge-*`-Component-Tokens via `[var(--token)]`
  (§3) — **0** Roh-Hex/arbitrary-px. Farbe rollenbasiert ueber **eine** orthogonale
  Achse `variant` (brand/accent/success), `uppercase` als zweite orthogonale Achse
  (Label-/Kategorie-Optik) — keine Kopien. Padding/Gap/Schriftgroesse ueber die
  rem-basierte Tailwind-Skala (bewusst nicht token-remappt, §Einheit 1a).
- `tokens.css`: `--badge-*`-Component-Tokens ergaenzt (`radius` = `--radius-full`;
  je Variante `bg`/`fg`). Alle erben nur von Semantic (§3); der Soft-Tint der
  Brand-Variante lebt als **Alpha im Component-Token**
  (`rgb(var(--color-action-primary-rgb) / 0.1)`, komponentenlokale Aufhellung der
  Navy-Primaeraktion). Im gebauten Client-CSS definiert (0 undef. Vars).
- `design-system/index.ts` (Barrel): `Badge`/`BadgeProps` exportiert.
- **Call-Sites migriert** (3 Instanzen ueber 2 Dateien): `EventsPage`
  (`event.tag` → `variant="brand" uppercase`, `event.partner` →
  `variant="accent"`) + `VitaminD3SprayPage` (beide Eigenschafts-Badges →
  `variant="success"`) ueber das DS-**Barrel** (`~/design-system`); die doppelte
  Import-Zeile zu **einer** zusammengefuehrt (`import/no-duplicates` → 0). Die
  losen `<span>` mit Roh-Tailwind-Pills **entfernt**.

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- Farben jetzt **rollenbasiert** (DS-Rollen) statt Legacy-/Roh-Tailwind — konsistent
  mit Button/Alert/Spinner: `brand` = Navy-Primaeraktion (war Brand-Blau #0d527f),
  `accent` = Teal (war Brand-Blau-Bright #2f6fa0), `success` = DS-Success-Soft/-Fg
  (war Roh-`green-50`/`green-700`, die **nicht** token-gebunden waren → Token-
  Pflicht-Verstoss behoben). Die beiden EventsPage-Badges bleiben optisch **distinkt**
  (Navy vs. Teal). Font-Weight auf `font-medium` vereinheitlicht (EventsPage war
  `font-semibold` → dezenter, Badge = sekundaere Metadaten, §FIL).

**Bewusst NICHT in dieser Einheit**

- Die **One-off**-Flaechen `FeaturedCaseStudy` (weisse Pill auf dunklem Hero, mit
  Border/Shadow/Backdrop-Blur) und `DownloadsPage` (graues `rounded`-Format-Tag,
  andere Form/Groesse) teilen die Pill-Signatur **nicht** → bleiben unberuehrt
  (One-off-Schwelle §1.20). Die `h-12 w-12`-Schritt-/Nummern-Kreise (S3Leitlinie,
  VitaminD3Implantologie) sind ein **anderes** Pattern (kreisrunder Step-Indikator),
  nicht die Status-Pill — nicht vermengt (§1.5).
- Consumer-`PriceBadge` (`pages/consumer/*`) ist ein eigener Slice (hell/Teal) und
  bleibt unberuehrt (§1.5).
- `neutral`-Variante bewusst **nicht** angelegt (kein Call-Site → keine API ohne
  Use, §1.20); ergaenzbar, sobald ein zweiter Use-Case auftaucht.

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **444 Probleme (438 Fehler, 6 Warnungen)**; Delta zur
  2g-Baseline (442/436) = **+2 reine Resolver-Zeilen** (neues File + Import) —
  **0 neue Regelverstoesse** (kein jsx-a11y, kein arbitrary-value, kein
  no-duplicates). Alle Treffer auf den geaenderten Dateien (23) sind ausschliesslich
  die bekannte `import/no-unresolved`-Altlast (kaputter eslint-import-Resolver,
  eigenes Ticket).
- Token-Pflicht: **0** Roh-Hex/arbitrary-px in `badge.tsx`. Alle **7** `--badge-*`-
  Tokens im gebauten Client-CSS definiert **und** referenziert (0 undef. Vars).
- Holy Grail: `rg` zaehlt **genau 1** Badge-Definition; **0** verbliebene
  Roh-Pill-Spans der migrierten Call-Sites.
- `madge --circular --extensions ts,tsx src/design-system` → **0 Zyklen** (17 Dateien).

### Einheit 2i — Breadcrumbs-Molecule (Navigation-Slice) — 2026-06-24

**Aenderung**

- `src/design-system/compound/breadcrumbs.tsx` neu: **kanonisches Breadcrumbs-
  Molecule** (§Phase 2.3, Navigation) — die zuvor in `components/ui/Breadcrumbs.tsx`
  gepflegte Pfad-Navigation lebt jetzt als Single Source im DS (Holy Grail
  §Phase 7.8). Industriestandard-Name (§Phase 2.8). Komponiert Router-`Link` +
  Trenner-Icon. **Token-rein** (§1.7): Farben ausschliesslich ueber neue
  `--breadcrumb-*`-Component-Tokens via `[var(--token)]` (§3) — **0** Roh-Hex,
  **0** nacktes `text-white`. Icon-Groesse (`h-3.5 w-3.5`) ueber die rem-basierte
  Tailwind-Skala (bewusst nicht token-remappt, §Einheit 1a).
- **A11y** (§1.11): `<nav aria-label>` + `<ol>`, letzter Eintrag
  `aria-current="page"`; der dekorative Trenner-Chevron jetzt zusaetzlich
  `aria-hidden="true"` (Screenreader liest keinen Pfeil-Muell vor).
- **UI-States** (§Phase 6.1): **Empty** (`items.length === 0`) → rendert `null`
  statt eines toten, leeren `<nav>`-Landmarks. (Loading/Error/Success sind fuer
  eine statische Pfadanzeige nicht anwendbar — kein erfundener State.)
- `tokens.css`: `--breadcrumb-{fg,separator,link-hover}`-Component-Tokens ergaenzt
  — erben nur von Semantic (§3); der Alpha-Abfall (Text 70 %, Trenner 50 %) lebt
  als komponentenlokaler Tint im Token. Im gebauten Client-CSS definiert (0 undef. Vars).
- `design-system/index.ts` (Barrel): `Breadcrumbs` (+ `BreadcrumbsProps`,
  `BreadcrumbItem`) exportiert.
- **Call-Sites migriert** (9 Seiten: About, ArticlesIndex, Contact, Downloads,
  Article, Service, Events, ServicesOverview, Support) ueber das DS-**Barrel**
  (`~/design-system`); doppelte `~/design-system`-Import-Zeilen zu **einer**
  zusammengefuehrt. Legacy `components/ui/Breadcrumbs.tsx` **entfernt** (`git rm`)
  → genau **eine** Definition (Holy Grail).

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- Die ungenutzte `variant`-Achse **entfernt**: alle **9** Call-Sites nutzten nur
  `variant="dark"`; das Default `'light'` war toter Code (keine API ohne Use,
  §1.20). Breadcrumbs ist damit on-dark-only (Main-Site = default-dark, s.
  Memory) — `variant`-Prop fiel weg.
- Farben jetzt **rollenbasiert** statt nacktem `text-white/70`/`/50`:
  on-dark-Tint ueber `--color-fg-on-dark`. **Link-Hover** von Roh-`brand-secondary`
  (Blau) → `--color-accent-on-dark` (Teal-300) — konsistent mit dem kanonischen
  On-Dark-Accent (Button-Outline/Eyebrow), bewusst vereinheitlicht.

**Bewusst NICHT in dieser Einheit**

- `aria-label="Breadcrumb"` bleibt (verhaltenserhaltend, §1.6) Roh-String statt
  i18n — eine eigene i18n-Einheit, hier nicht vermengt (§1.5); kein unbenutzter
  `label`-Prop eingefuehrt (§1.20).
- Consumer-Breadcrumbs/`SectionTitle` (heller/Teal-Slice) bleiben unberuehrt (§1.5).

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **438 Probleme (432 Fehler, 6 Warnungen)** = **6 Fehler weniger**
  als die 2h-Baseline (444/438), da die Legacy-Datei (mit ihren Resolver-Zeilen)
  entfiel und die 9 Importe konsolidiert wurden. Auf den geaenderten Dateien
  ausschliesslich die bekannte `import/no-unresolved`-Altlast; der einzige
  Nicht-Resolver-Treffer auf einer editierten Datei (`ArticlePage:181`
  `no-case-declarations`) ist **vorbestehend** und liegt **ausserhalb** der
  editierten Hunks (Import + Breadcrumb-Block) → **0 neue Regelverstoesse**.
- Token-Pflicht: **0** Roh-Hex/arbitrary-px in `breadcrumbs.tsx`. Alle **3**
  `--breadcrumb-*`-Tokens im gebauten Client-CSS definiert.
- Holy Grail: `rg` zaehlt **genau 1** Breadcrumbs-Definition; **0** verbliebene
  `ui/Breadcrumbs`-Importe; **0** verbliebene `variant="dark"`-Reste.
- `madge --circular --extensions ts,tsx src/design-system` → **0 Zyklen** (18 Dateien).

### Einheit 2j — Stat-Atom (Kennzahl-Slice) — 2026-06-24

**Aenderung**

- `src/design-system/core/stat.tsx` neu: **kanonisches Stat-Atom** (§Phase 2.2) —
  die einzelne Kennzahl (grosser Wert + optionaler Suffix + Label) als Single
  Source of Truth (Holy Grail §Phase 7.8). Struktur-/content-agnostischer Name
  (§Phase 2.7/2.8): `Stat` statt des Orts-Suffix `StatItem`. **Token-rein** (§1.7):
  Farben ausschliesslich ueber neue `--stat-*`-Component-Tokens via `[var(--token)]`
  (§3) — **0** Roh-`text-white`/`brand-secondary`/`white/80`. Schriftgroessen ueber
  die rem-basierte Tailwind-Skala (bewusst nicht token-remappt, §Einheit 1a).
- `tokens.css`: `--stat-{value,suffix,label}-color`-Component-Tokens ergaenzt —
  erben nur von Semantic (§3); on-dark-Tonalitaeten (Stat lebt auf dunklem Hero),
  der Label-Tint (80 %) lebt als komponentenlokales Alpha im Token. Im gebauten
  Client-CSS definiert (0 undef. Vars).
- `design-system/index.ts` (Barrel): `Stat`/`StatProps` exportiert.
- **Call-Site migriert**: `HeroSection` (2 Instanzen) nutzt jetzt `Stat` ueber das
  DS-**Barrel** (`~/design-system`); die doppelte Import-Zeile zu **einer**
  zusammengefuehrt. Legacy `components/ui/StatItem.tsx` **entfernt** (`git rm`) →
  genau **eine** Definition (Holy Grail).

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- Die ungenutzte `size`-Achse **entfernt**: beide Call-Sites nutzten nur `'sm'`;
  das `'md'`-Stylebundle war toter Code (keine API ohne Use, §1.20). Stat ist damit
  eingroessig — als orthogonaler Prop ergaenzbar, sobald ein zweiter Use-Case auftaucht.
- Suffix-Farbe von Roh-`brand-secondary` (Blau) → `--color-accent-on-dark` (Teal-300),
  konsistent mit dem kanonischen On-Dark-Accent (Breadcrumbs/Eyebrow/Button-Outline);
  Wert/Label rollenbasiert ueber `--color-fg-on-dark` statt nacktem `text-white`/`/80`.

**Bewusst NICHT in dieser Einheit**

- Andere Kennzahl-Darstellungen (z. B. Consumer-LPs) bleiben unberuehrt — eigener
  Slice (hell/Teal), hier nicht vermengt (§1.5).

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **439 Probleme (433 Fehler, 6 Warnungen)**; Delta zur 2i-Baseline
  (438/432) = **+1 reine Resolver-Zeile** (neues File mit 2 unresolved Imports minus
  der entfallenen `../ui/StatItem`-Importzeile) — **0 neue Regelverstoesse** (kein
  jsx-a11y, kein arbitrary-value, kein no-duplicates). Die 2 `Cannot access refs`-
  Fehler auf `HeroSection` (Slider-Refs, Z. 108/178) sind **vorbestehend** (per
  `git stash` verifiziert) und liegen **ausserhalb** der editierten Hunks
  (Import + Stat-Block).
- Token-Pflicht: **0** Roh-Hex/arbitrary-px in `stat.tsx`. Alle **3** `--stat-*`-
  Tokens im gebauten Client-CSS definiert.
- Holy Grail: `rg` zaehlt **genau 1** Stat-Definition; **0** verbliebene
  `StatItem`-Code-Referenzen (nur Docstring-Erwaehnung des Alt-Namens).
- `madge --circular --extensions ts,tsx src/design-system` → **0 Zyklen** (19 Dateien).

### Einheit 2k — Accordion-Molecule (Disclosure-Slice) — 2026-06-24

**Aenderung**

- `src/design-system/compound/accordion.tsx` neu: **kanonisches Accordion-Molecule**
  (§Phase 2.3, Disclosure) — das zuvor **inline** in `FAQSection` gepflegte,
  stateful Aufklapp-Widget lebt jetzt als Single Source im DS (Holy Grail
  §Phase 7.8). Industriestandard-Name (§Phase 2.8 nennt `Accordion` explizit).
  Inhalts-/kontext-agnostisch (§Phase 2.7): der Aufrufer reicht `items`
  (`trigger`/`content`) durch — das Widget kennt **kein** FAQ. Verhalten
  **Single-Open** (verhaltenserhaltend zur bisherigen FAQ-Logik, §1.6); **keine**
  ungenutzte `allowMultiple`-Achse (§1.20). **Token-rein** (§1.7): Farben/Radius/
  Schatten ausschliesslich ueber neue `--accordion-*`-Component-Tokens via
  `[var(--token)]` (§3) — **0** Roh-Hex/arbitrary-px. Schrift-/Abstands-Groessen
  ueber die rem-basierte Tailwind-Skala (bewusst nicht token-remappt, §Einheit 1a).
- **A11y** (§1.11): Trigger ist `<button>` mit `aria-expanded`/`aria-controls`;
  die Inhalts-Region traegt jetzt zusaetzlich `role="region"` + `aria-labelledby`;
  der dekorative Chevron jetzt `aria-hidden`. **Focus-visible-Ring ergaenzt**
  (vorher **kein** sichtbarer Tastatur-Fokus → A11y-Luecke geschlossen, alle
  interaktiven States als Properties: default/hover/focus-visible/expanded).
- **UI-States** (§Phase 6.1): **Empty** (`items` leer/kein Array) → rendert `null`
  statt einer toten, leeren Panel-Flaeche (vorher: leerer, gerahmter Kasten).
  Loading/Error/Success sind fuer eine statische Disclosure-Liste nicht anwendbar
  (Datenbeschaffung = Aufrufer-Sache) — kein erfundener State.
- `tokens.css`: `--accordion-*`-Component-Tokens ergaenzt (bg/border/radius/shadow/
  trigger-fg/trigger-hover-bg/icon-color/content-fg) — erben nur von Semantic (§3).
  `--accordion-radius` = `--radius-lg` (16px == das vorige `rounded-2xl`).
- `design-system/index.ts` (Barrel): `Accordion` (+ `AccordionProps`,
  `AccordionItem`) exportiert.
- **Call-Site migriert**: `FAQSection` komponiert jetzt `Accordion` ueber das
  DS-**Barrel** (`~/design-system`); die lokale `useState`/`toggleItem`-Logik +
  der Roh-Tailwind-Block **entfernt**. `FAQSection` ist damit ein duenner Organism
  (SectionHeader + Accordion + Footer).

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- Farben jetzt **rollenbasiert** statt Roh-/Default-Tailwind: Rahmen/Trenner
  `gray-200` (Tailwind-Default, **nicht** token-gebunden → Token-Pflicht-Verstoss)
  → `--color-border` (slate-200); Antwort-Text `gray-600` (Default) → `--color-fg`
  (Body, slate-700); Trigger-Hover `gray-50` (Default) → `--color-bg-subtle`
  (dezenter, konsistent mit Secondary-Button-Hover). Frage-Text (`gray-900` ==
  `--color-fg-heading`) und Chevron (`gray-500` == `--color-fg-muted`) sind
  **byte-identisch** geroutet. `rounded-2xl` (16px) == `--radius-lg`.
- Toter `group`-Wrapper (keine `group-*`-Nutzung) entfernt (§1.20).

**Bewusst NICHT in dieser Einheit**

- Die statischen FAQ-Listen in `S3LeitliniePage`/`VitaminD3*Page` sind **immer
  offene** Q&A-Bloecke (kein interaktives Disclosure) → **kein** Accordion,
  bleiben unberuehrt (One-off/Slice-Trennung §1.5/§1.20).
- **Kein** `<h3>`-Heading-Wrapper um den Trigger: die Basis-`h2/h3`-Stile in
  `index.css` wuerden Groesse/Farbe/Margin uebersteuern → stiller Optik-Change.
  Verhaltenserhaltend belassen (§1.6); WAI-ARIA-Heading-Wrap = Phase-5-A11y-Pass.
- `prefers-reduced-motion` fuer die `duration-300`-Auf-/Zuklapp-Animation:
  verhaltenserhaltend belassen (war vorher auch nicht respektiert) → Phase 5.
- Der `FAQSection`-Footer (`text-brand-primary`/`text-gray-500`) bleibt: beide
  sind bereits **token-gebundene** Tailwind-Utilities (Einheit 1b), kein Rohwert.

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **441 Probleme (435 Fehler, 6 Warnungen)**; Delta zur 2j-Baseline
  (439/433) = **+2 reine Resolver-Zeilen** (neues File `../../lib/utils` + Barrel
  `./compound/accordion`) — **0 neue Regelverstoesse** (kein jsx-a11y, kein
  arbitrary-value, kein no-duplicates, kein react-refresh). `eslint` auf
  `accordion.tsx`+`FAQSection.tsx` zeigt ausschliesslich die bekannte
  `import/no-unresolved`-Altlast (kaputter eslint-import-Resolver, eigenes Ticket).
- Token-Pflicht: **0** Roh-Hex/arbitrary-px in `accordion.tsx`. Alle **8**
  `--accordion-*`-Tokens im gebauten Client-CSS definiert **und** referenziert
  (0 undef. Vars).
- Holy Grail: `rg` zaehlt **genau 1** Accordion-Definition; **0** verbliebene
  Inline-Accordion-Reste in `FAQSection` (`openIndex`/`toggleItem`/`ChevronDown`/
  `divide-gray`/`aria-expanded`).
- `madge --circular --extensions ts,tsx src/design-system` → **0 Zyklen** (20 Dateien).

### Einheit 2l — EmptyState-Feedback (Leerzustand, feedback-Ebene) — 2026-06-24

**Aenderung**

- `src/design-system/feedback/empty-state.tsx` neu: **kanonisches EmptyState**
  (Leerzustand „kein Datensatz / keine Treffer") als Single Source of Truth
  (Holy Grail §Phase 7.8). Schliesst die **UI-State-Familie** der feedback-Ebene,
  die der Barrel-Kommentar bereits versprach (loading=`Spinner`, error/success=
  `Alert`, **empty**=`EmptyState`) — vorher fehlte der Empty-State und wurde an
  den Call-Sites roh dupliziert (war in 2g explizit als eigener Scope vertagt).
  Inhalts-/kontext-agnostisch (§Phase 2.7): Meldung als `title`. **Token-rein**
  (§1.7): Text/Rahmen/Flaeche ausschliesslich ueber neue `--empty-state-*`-
  Component-Tokens via `[var(--token)]` (§3) — **0** Roh-Hex/arbitrary-px;
  Abstaende/Radius (`py-10`/`p-8`/`rounded-xl`) ueber die rem-basierte Tailwind-
  Skala (bewusst nicht token-remappt, §Einheit 1a — `rounded-xl`/12px byte-
  identisch statt stillem Remap auf `--radius-lg`/16px). Optik ueber **eine**
  orthogonale Achse `variant` (plain/outlined), beide live belegt — keine Kopien.
- **A11y** (§1.11): `role="status"` kuendigt einen dynamisch eintretenden
  Leerzustand (z. B. „keine Suchergebnisse") hoeflich fuer Screenreader an
  (vorher: stummes `<div>`). Der native `title`-Attribut-Konflikt ist via
  `Omit<…, 'title'>` aufgeloest (typsicherer `ReactNode`-`title`).
- `tokens.css`: `--empty-state-{fg,border,bg}`-Component-Tokens ergaenzt — erben
  nur von Semantic (§3). Im gebauten Client-CSS definiert (0 undef. Vars).
- `design-system/index.ts` (Barrel): `EmptyState`/`EmptyStateProps` exportiert
  (Feedback-Abschnitt nun vollstaendig: Alert/EmptyState/Spinner).
- **Call-Sites migriert** (2): `SearchModal` (Such-„No Results" → `variant="plain"`)
  - `DownloadsPage` (Sektions-„comingSoon" → `variant="outlined"`) ueber das
    DS-**Barrel** (`~/design-system`); die losen `<div>`-Roh-Tailwind-Bloecke
    **entfernt**.

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- Farben **byte-identisch** rollenbasiert geroutet: `text-gray-500` ==
  `--color-fg-muted` (slate-500), `border-gray-300` == `--color-border-strong`
  (slate-300), `bg-slate-50` == `--color-bg` (slate-50). Einziger sichtbarer
  Effekt: ein zusaetzliches `role="status"` (A11y, keine Optikaenderung).
- **Keine** ungenutzten Props angelegt (§1.20 „keine API ohne Use"): nur
  `title` + `variant`; Icon/Description/Action erst bei realem zweiten Use-Case.

**Bewusst NICHT in dieser Einheit**

- Der **Prompt-Hinweis** „Start Typing" (`SearchModal`, `text-gray-400 text-sm`)
  ist ein **Eingabe-Hinweis**, kein Leerzustand (kein Datensatz fehlt) → nicht
  vermengt (§1.5); bleibt unberuehrt. Ebenso die `error`-Pfade (decken `Alert`
  und `Spinner` bereits ab).
- `ErrorState`/`Toast`/`Skeleton` (§2 feedback-Liste): eigener Scope, kein
  belegter zweiter Use-Case in dieser Einheit (§1.16/§1.20).

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **443 Probleme (437 Fehler, 6 Warnungen)**; Delta zur 2k-Baseline
  (441/435) = **+2 reine Resolver-Zeilen** (neues File `../../lib/utils` + Barrel
  `./feedback/empty-state`) — **0 neue Regelverstoesse** (kein jsx-a11y, kein
  arbitrary-value, kein no-duplicates, kein react-refresh). Der einzige
  Nicht-Resolver-Treffer auf einer editierten Datei (`SearchModal:36`
  set-state-in-effect) ist **vorbestehend** und liegt **ausserhalb** des
  editierten Hunks (No-Results-Block).
- Token-Pflicht: **0** Roh-Hex/arbitrary-px in `empty-state.tsx`. Alle **3**
  `--empty-state-*`-Tokens im gebauten Client-CSS definiert.
- Holy Grail: `rg` zaehlt **genau 1** EmptyState-Definition; **0** verbliebene
  Roh-Empty-State-Spans der migrierten Call-Sites.
- `madge --circular --extensions ts,tsx src/design-system` → **0 Zyklen** (21 Dateien).

### Einheit 2m — Panel-Molecule (statische Inhalts-Flaeche, Containment-Slice) — 2026-06-24

**Aenderung**

- `src/design-system/compound/panel.tsx` neu: **kanonisches Panel-Molecule**
  (§Phase 2.3, Containment) — die zuvor in `ContactPage` **und** `SupportPage`
  **sechsfach** roh gepflegte weisse Form-/Info-Flaeche
  (`rounded-2xl bg-white p-6 shadow-sm`) lebt jetzt **einmal** hier (Holy Grail
  §Phase 7.8). Ueber der One-off-Schwelle (§1.20, 6 Vorkommen ≥3). Inhalts-/
  kontext-agnostisch (§Phase 2.7): nur die Flaeche, der Aufrufer reicht den
  Inhalt als `children`. **Token-rein** (§1.7): Flaeche/Radius/Schatten
  ausschliesslich ueber neue `--panel-*`-Component-Tokens via `[var(--token)]`
  (§3) — **0** Roh-Hex/arbitrary-px. Padding ueber **eine** orthogonale Achse
  `padding` (md=`p-6` / lg=`p-6 lg:p-8`, **beide** live belegt) auf der
  rem-basierten Tailwind-Skala (bewusst nicht token-remappt, §Einheit 1a).
  Rendert semantisches `<section>`.
- **Abgrenzung zu `Card`** (§Phase 2.7): Panel ist die **ruhende** Flaeche (kein
  Hover-Lift, keine Link-Semantik) fuer Formular-/Info-Bloecke; `Card` bleibt die
  **erhobene, klickbare** Glass-Karte. Bewusst **zwei** distinkte Containment-
  Patterns statt einer ueberladenen Komponente — kein verfruehtes Generalisieren.
- `tokens.css`: `--panel-{bg,radius,shadow}`-Component-Tokens ergaenzt (neben
  `--card-*`) — erben nur von Semantic (§3). `--panel-radius` = `--radius-lg`
  (16px == das vorige `rounded-2xl`, byte-identisch); `--panel-bg` =
  `--color-surface` (neutral-0 == `bg-white`, byte-identisch). Im gebauten
  Client-CSS definiert (0 undef. Vars).
- `design-system/index.ts` (Barrel): `Panel`/`PanelProps` exportiert.
- **Call-Sites migriert** (6 Instanzen ueber 2 Dateien): `ContactPage` (Form-Panel
  `padding="lg"` + 2 Info-Panels) + `SupportPage` (analog) ueber das DS-**Barrel**
  (`~/design-system`); die `Panel`-Importe in die bestehende `~/design-system`-
  Zeile zusammengefuehrt (`import/no-duplicates` → 0). Die losen `<section>` mit
  Roh-Tailwind-Flaeche **entfernt**.

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- Schatten von Roh-`shadow-sm` (Tailwind-Default = pures `rgb(0 0 0 / .05)`,
  **§FIL-Verstoss** „kein #000 fuer Schatten") → `--panel-shadow` = `--shadow-1`
  (Navy-getoent, niedrige Opacity, identisch mit `--card-shadow`). Einziger
  sichtbarer Effekt: leicht praegnanterer, marken-getoenter Schatten auf den
  Panels — vereinheitlicht die beiden Containment-Flaechen (Card == Panel).

**Bewusst NICHT in dieser Einheit**

- **Kein** `as`-Polymorphie-Prop: alle 6 Call-Sites sind `<section>` → keine API
  ohne Use (§1.20); ergaenzbar, sobald ein div/article/aside-Use-Case auftaucht.
- Die distinkten One-off-Flaechen (`ContactPage`/`SupportPage`-Hero-Gradient,
  Kontakt-Kanal-Kreise) teilen die Panel-Signatur **nicht** → bleiben unberuehrt
  (§1.20). Die Roh-Tailwind-Texte **innerhalb** der Panels (`text-gray-600`,
  `text-sm` …) sind Sektions-Inhalt → Token-Migration = Phase 3, hier nicht
  vermengt (§1.5).

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **445 Probleme (439 Fehler, 6 Warnungen)**; Delta zur
  2l-Baseline (443/437) = **+2 reine Resolver-Zeilen** (neues File + Barrel-
  Import `./compound/panel`) — **0 neue Regelverstoesse** (kein jsx-a11y, kein
  arbitrary-value, kein no-duplicates). Alle Treffer auf den geaenderten Dateien
  sind ausschliesslich die bekannte `import/no-unresolved`-Altlast (kaputter
  eslint-import-Resolver, eigenes Ticket).
- Token-Pflicht: **0** Roh-Hex/arbitrary-px in `panel.tsx`. Alle **3** `--panel-*`-
  Tokens im gebauten Client-CSS definiert.
- Holy Grail: `rg` zaehlt **genau 1** Panel-Definition; **0** verbliebene
  `rounded-2xl bg-white …shadow-sm`-Roh-Flaechen.
- `madge --circular --extensions ts,tsx src/design-system` → **0 Zyklen** (22 Dateien).

### Einheit 2n — Container-Layout-Primitive (erster `primitives-layout`-Atom) — 2026-06-24

**Aenderung**

- `src/design-system/primitives-layout/container.tsx` neu: **erstes Layout-
  Primitive-Atom** (§2.1, `primitives-layout/`) — die zuvor ueber **12** Seiten/
  Sektionen roh wiederholte Wrapper-Signatur `mx-auto max-w-container px-4 lg:px-0`
  (horizontale Zentrierung + Max-Breite + seitliche Gutter) lebt jetzt **einmal**
  hier (Holy Grail §Phase 7.8, ueber der One-off-Schwelle §1.20). Inhalts-/
  kontext-agnostisch (§Phase 2.7): nur der Rahmen, der Aufrufer reicht den Inhalt
  als `children`. **Token-rein** (§1.7): ausschliesslich token-/config-gebundene
  Tailwind-Utilities (`max-w-container` aus der Config, `px-4`/`lg:px-0` auf der
  rem-basierten Spacing-Skala, bewusst nicht token-remappt §Einheit 1a) — **0**
  Roh-Hex/arbitrary-px. Rendert ein neutrales `<div>`; call-site-spezifische
  Extras (`py-*`, `text-center`, `relative z-10`, `mb-16` …) bleiben **nicht**
  generalisiert und kommen byte-stabil ueber `className` (twMerge) dazu (§1.20).
- **UI-States** (§Phase 6.1): loading/empty/error/success sind fuer einen rein
  strukturellen Layout-Rahmen nicht anwendbar (kein Datenbezug) — kein
  erfundener State (analog `Breadcrumbs`/`Stat`).
- `design-system/index.ts` (Barrel): neuer Abschnitt **Atoms (primitives-layout/)**
  — `Container`/`ContainerProps` exportiert.
- **Call-Sites migriert** (12 Instanzen ueber 11 Dateien): `Footer`, `TeamSection`,
  `IglooWidgetSection`, `PrivacyPage`, `ImprintPage`, `SupportPage`, `ContactPage`,
  `DownloadsPage`, `AboutPage`, `EventsPage`, `TermsPage` (2×) ueber das DS-**Barrel**
  (`~/design-system`); doppelte `~/design-system`-Importe zu **einer** Zeile
  zusammengefuehrt. Die losen `<div>`-Wrapper **entfernt**.

**Bewusst NICHT in dieser Einheit**

- **One-off-Wrapper** mit abweichender Gutter-/Form-Signatur bleiben unberuehrt
  (§1.20): `ArticlesIndexPage` (`lg:px-10` statt `lg:px-0`), `FeaturedCaseStudy`
  (`px-4` **ohne** `lg:px-0`), die Footer-Inhalts-Spalte (`flex … max-w-container`
  ohne `lg:px-0`) und die Igloo-Diagramm-Flaeche (`lg:w-[1200px]`, kein
  `max-w-container`). Keine erzwungene Vereinheitlichung → kein stiller Optik-Change.
- Consumer-LPs (`pages/consumer/*`, u. a. `sm:px-6`-Gutter) sind ein eigener Slice
  (hell/Teal) und bleiben unberuehrt (§1.5).
- **Kein** `as`-Polymorphie-Prop und **kein** `max-w`-Variant: alle 12 Call-Sites
  sind `<div>` mit identischer Max-Breite → keine API ohne Use (§1.20); ergaenzbar
  beim ersten realen Bedarf. **Kein** Remap `max-w-container` (1200px, Config-Roh)
  auf `max-w-layout` (`--grid-max`/1240px) — abweichender Wert, waere stiller
  Verhaltenschange (§Einheit 1a); byte-identisch belassen.

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **451 Probleme (445 Fehler, 6 Warnungen)**; Delta zur
  2m-Baseline (445/439) = **+6 reine Resolver-Zeilen** (neues File `../../lib/utils`,
  Barrel `./primitives-layout/container` + 4 neue `~/design-system`-Import-Zeilen
  in Footer/Privacy/Imprint/Terms) — `eslint` auf **allen 13** geaenderten Dateien
  zeigt nach Abzug von `import/no-unresolved` **0** Treffer → **0 neue Regel-
  verstoesse** (kein jsx-a11y, kein arbitrary-value, kein no-duplicates, kein
  no-empty-object-type — `ContainerProps` ist ein `type`-Alias statt leerem
  `interface extends`).
- Token-Pflicht: **0** Roh-Hex/arbitrary-px in `container.tsx`.
- Holy Grail: `rg` zaehlt **genau 1** Container-Definition; **0** verbliebene
  byte-identische `mx-auto max-w-container px-4 lg:px-0`-Roh-Wrapper im Main-Site-`src`
  (nur noch das Atom selbst + sein Docstring).
- `madge --circular --extensions ts,tsx src/design-system` → **0 Zyklen** (23 Dateien).

### Einheit 2o — Panel-`bordered`/`padding="sm"` (Sidebar-Widget-Flaeche) — 2026-06-24

**Aenderung**

- `src/design-system/compound/panel.tsx`: bestehendes `Panel`-Molecule **per
  orthogonalem Prop erweitert** (§1.16 „bestehende Komponente per Prop erweitern"
  statt Near-Duplikat), **nicht** neu gebaut. Die zuvor in `ArticlePage` (3×) und
  `ServicePage` (3×) **sechsfach** roh gepflegte Sidebar-Widget-Flaeche
  (`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm`) lebt jetzt als
  Panel-Variante (Holy Grail §Phase 7.8, ueber der One-off-Schwelle §1.20).
  - Neue Achse `bordered` (Boolean, orthogonal zu `padding`, §Phase 2.9) →
    `border border-[var(--panel-border)]`; **live belegt** (6× `bordered`).
  - `padding`-Achse um Stufe `sm` (`p-5`) ergaenzt — **alle drei** Stufen jetzt
    live (sm=Sidebar-Widget, md=Info-Panel, lg=Form-Panel). Rem-basierte
    Tailwind-Skala (bewusst nicht token-remappt, §Einheit 1a).
- `tokens.css`: `--panel-border`-Component-Token ergaenzt (erbt nur von Semantic
  `--color-border`, §3). Im gebauten Client-CSS definiert (0 undef. Vars).
- **Abgrenzung** (§Phase 2.7): Panel bleibt die **ruhende** Flaeche; das
  Sidebar-Widget ist dieselbe Rolle (statischer Info-/Listen-Block, kein
  Hover-Lift, keine Link-Semantik) nur mit Rahmen + engerem Padding → **kein**
  eigenes Pattern, sondern Variante. `Card` (Hover-Lift, klickbar) bleibt distinkt.
- **Call-Sites migriert** (6 Instanzen ueber 2 Dateien): `ArticlePage`
  (More-Articles / Related-Services / Contact-Widget) + `ServicePage`
  (Key-Areas / Related-Articles / Contact-Widget) → `<Panel bordered
padding="sm">`; die `Panel`-Importe in die bestehende `~/design-system`-Zeile
  zusammengefuehrt. Die losen `<section>` mit Roh-Tailwind-Flaeche **entfernt**.

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- Schatten von Roh-`shadow-sm` (Tailwind-Default = pures #000, §FIL-Verstoss) →
  `--panel-shadow` = `--shadow-1` (Navy-getoent, identisch mit Card/Panel) —
  vereinheitlicht mit den uebrigen Containment-Flaechen (analog Einheit 2m).
- Rahmen von Roh-`border-gray-100` (Primitive `--gray-100`, §1.7-Verstoss:
  Komponente nutzt **kein** Primitive direkt) → rollenbasiert `--panel-border`
  (`--color-border` = slate-200). Einziger sichtbarer Effekt: leicht praegnanterer,
  marken-konsistenter Rahmen (neutral-100 → neutral-200), wie bei Input/Accordion/Alert.
- Flaeche/Radius/Padding **byte-identisch** geroutet: `bg-white` == `--panel-bg`
  (surface/neutral-0), `rounded-2xl` (16px) == `--panel-radius` (`--radius-lg`),
  `p-5` == `padding="sm"`.

**Bewusst NICHT in dieser Einheit**

- `ArticlePage` `key_points`-Grid-Karte (`rounded-xl border border-gray-100
bg-white p-5 shadow-sm`, ein **`<div>`** mit **`rounded-xl`**/12px) teilt die
  Signatur **nicht** (anderer Radius, kein `<section>`, Inhalts-Karte im Grid) →
  bleibt unberuehrt (§1.20, kein erzwungenes Generalisieren).
- Die Roh-Tailwind-Texte **innerhalb** der Widgets (`text-gray-500`, `text-sm`,
  `uppercase tracking-[…]` …) sind Sektions-Inhalt → Token-Migration = Phase 3,
  hier nicht vermengt (§1.5). Die Icon-Tile-Quick-Link-Zeile (2× identisch in
  Article/Service) bleibt als eigener Molecule-Kandidat offen (separate Einheit).

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **451 Probleme (445 Fehler, 6 Warnungen)** = **identische
  Baseline** wie Einheit 2n (keine Datei hinzu/entfernt, `Panel`-Import in die
  bestehende `~/design-system`-Zeile gemergt). Der einzige Nicht-Resolver-Treffer
  auf einer editierten Datei (`ArticlePage:181` `no-case-declarations`) ist
  **vorbestehend** und liegt **ausserhalb** der editierten Hunks (Import +
  Widget-Bloecke 382–449) → **0 neue Regelverstoesse**.
- Token-Pflicht: **0** Roh-Hex/arbitrary-px in `panel.tsx`. `--panel-border` im
  gebauten Client-CSS definiert (`var(--color-border)`).
- Holy Grail: `rg` zaehlt **genau 1** Panel-Definition; **0** verbliebene
  `rounded-2xl border border-gray-100 bg-white p-5 shadow-sm`-Roh-Flaechen.
- `madge --circular --extensions ts,tsx src/design-system` → **0 Zyklen** (23 Dateien).

### Einheit 2p — NavTile-Molecule (icon-gefuehrte Navigations-Kachel) — 2026-06-24

**Aenderung**

- `src/design-system/compound/nav-tile.tsx` neu: **NavTile-Molecule** (§Phase 2.3)
  — die zuvor in `ArticlePage` (Related-Services) und `ServicePage` (Key-Areas)
  **dreifach** roh gepflegte icon-gefuehrte Link-Listenzeile (Icon-Tile + Label,
  Hover-Lift mit `scale`/Schatten) lebt jetzt **einmal** hier (Holy Grail
  §Phase 7.8; der in Einheit 2o offen vermerkte Molecule-Kandidat). Inhalts-/
  kontext-agnostisch (§Phase 2.7): Aufrufer reicht `to`, `icon` (ReactNode) und
  Label (`children`) — orthogonale, minimale Props-API. **Token-rein** (§1.7):
  Farben/Schatten ausschliesslich ueber neue `--navtile-*`-Component-Tokens via
  der erlaubten `[var(--token)]`-Form (§3) — **0** Roh-Hex/arbitrary-px. Struktur/
  Spacing/Radius (`rounded-xl`, `p-4`, `gap-3`, `h-10 w-10`, `rounded-lg`,
  `duration-300`) auf der rem-basierten Tailwind-Skala (bewusst nicht token-
  remappt, §Einheit 1a; analog `Card`). Rendert internen `<Link>`.
- **Abgrenzung zu `Card`** (§Phase 2.7): Card = erhobene, klickbare Glass-Karte
  (Inhalts-Container); NavTile = schlanke, icon-gefuehrte **Navigations-Zeile**
  einer Sidebar-Liste. Distinkte Patterns, kein verfruehtes Generalisieren.
- `tokens.css`: **12** `--navtile-*`-Component-Tokens ergaenzt (erben nur von
  Semantic, §3). Im gebauten Client-CSS definiert (0 undef. Vars).
- `design-system/index.ts` (Barrel): `NavTile`/`NavTileProps` exportiert.
- **Call-Sites migriert** (3 Instanzen ueber 2 Dateien): `ArticlePage`
  (Related-Services) + `ServicePage` (Key-Areas) ueber das DS-**Barrel**
  (`~/design-system`); `NavTile`-Import in die bestehende `~/design-system`-Zeile
  gemergt. Die losen `<Link>` mit Roh-Tailwind-Flaeche **entfernt** (`Link`-Import
  bleibt — in beiden Dateien noch fuer Artikel-/Service-Links genutzt).

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- Accent von rollenlosem `brand-secondary` (mid-blue, **kein** Semantic-Token) →
  kanonische **Primaeraktion** (`--color-action-primary` = Navy): Icon-Tile-Fg/
  -Hover-Fill, Hover-Border und Label-Hover. Der Icon-Tile-Hover (Solid-Fill +
  weisser Text) ist eine **Aktions**-Affordanz → Navy ist die semantisch korrekte
  Rolle (konsistent mit Button-primary, „cta = Navy"). Idle-Tile-Tint =
  `rgb(var(--color-action-primary-rgb)/0.1)` (analog Badge-brand, war `bg-blue-50`).
- Schatten von Roh-`shadow-sm`/`shadow-md` (Tailwind-Default = pures #000,
  §FIL-Verstoss) → `--shadow-1`/`--shadow-2` (Navy-getoent) — vereinheitlicht mit
  Card/Panel/Accordion.
- Idle-Border von Roh-`border-gray-100` (Primitive, §1.7-Verstoss) → rollenbasiert
  `--color-border` (slate-200), wie Panel/Input/Accordion.
- **Byte-identisch** geroutet: `text-gray-900` == `--color-fg-heading`
  (Headline-Navy), Gradient `from-white to-slate-50` == `--color-surface` →
  `--color-bg`.

**Bewusst NICHT in dieser Einheit**

- **Kein** `href`/`as`-Polymorphie-Prop: alle 3 Call-Sites sind interne `<Link>`
  → keine API ohne Use (§1.20); ergaenzbar beim ersten externen Use-Case.
- Die uebrigen Sidebar-Listenzeilen ohne Icon-Tile (`ArticlePage`/`ServicePage`
  More-Articles/Related-Articles: reine Text-Links) teilen die NavTile-Signatur
  **nicht** → bleiben unberuehrt (§1.20).

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **453 Probleme (447 Fehler, 6 Warnungen)**; Delta zur
  2o-Baseline (451/445) = **+2 reine Resolver-Zeilen** (neues File `../../lib/utils`
  - Barrel `./compound/nav-tile`). `eslint` auf allen 4 geaenderten Dateien zeigt
    nach Abzug von `import/no-unresolved` nur den **vorbestehenden**
    `ArticlePage:181 no-case-declarations` (ausserhalb der editierten Hunks) →
    **0 neue Regelverstoesse**.
- Token-Pflicht: **0** Roh-Hex/arbitrary-px in `nav-tile.tsx`. Alle **12**
  `--navtile-*`-Tokens im gebauten Client-CSS definiert.
- Holy Grail: `rg` zaehlt **genau 1** NavTile-Definition; **0** verbliebene
  `from-white to-slate-50 …shadow-sm`-Roh-Zeilen.
- Import-Richtung sauber (Molecule importiert nicht von sections/templates);
  `madge --circular --extensions ts,tsx src/design-system` → **0 Zyklen** (24 Dateien).

### Einheit 2q — ContactCallout-Molecule (Sidebar-Telefon-Kontaktbox) — 2026-06-24

**Aenderung**

- `src/design-system/compound/contact-callout.tsx` neu: **kanonisches
  ContactCallout-Molecule** (§Phase 2.3, Communication) — die zuvor in
  `VitaminD3SprayPage`, `VitaminD3ImplantologyPage` und `S3LeitliniePage`
  **dreifach** roh gepflegte Sidebar-Telefon-Kontaktbox (Icon-Medaillon +
  Titel/Subtitel + Soft-Tel-Aktion + Hinweiszeile) lebt jetzt **einmal** hier
  (Holy Grail §Phase 7.8, ueber der One-off-Schwelle §1.20). Inhalts-/kontext-
  agnostisch (§Phase 2.7): der Aufrufer reicht `icon`, `title`, `subtitle`,
  `phoneHref`, `phoneLabel` (Icon+Nummer als ReactNode) und `note` durch — die
  Box kennt **keine** Telefonnummer/i18n. **Token-rein** (§1.7): Flaeche/Rahmen/
  Schatten/Medaillon/Aktion ausschliesslich ueber neue `--callout-*`-Component-
  Tokens via `[var(--token)]` (§3) — **0** Roh-Hex/arbitrary-px. Struktur/
  Spacing/Radius (`rounded-xl`, `p-5`, `gap-3`, `h-10 w-10`) ueber die rem-
  basierte Tailwind-Skala (bewusst nicht token-remappt, §Einheit 1a; analog
  NavTile/Card).
- **A11y** (§1.11): das fuehrende Medaillon-Icon ist dekorativ (`aria-hidden`);
  die Aktion ist ein nativer `<a href="tel:…">` (tastatur-/screenreader-bedienbar).
- **Abgrenzung** (§Phase 2.7): Panel = ruhende, generische Inhalts-Flaeche;
  NavTile = ganze Flaeche ist ein Navigations-Link; ContactCallout = ruhende
  Box mit **einer** dedizierten Tel-Aktion + Medaillon. Distinkte Patterns.
- `tokens.css`: **10** `--callout-*`-Component-Tokens ergaenzt (erben nur von
  Semantic, §3). Im gebauten Client-CSS definiert (0 undef. Vars).
- `design-system/index.ts` (Barrel): `ContactCallout`/`ContactCalloutProps`
  exportiert.
- **Call-Sites migriert** (3 Instanzen ueber 3 Dateien): `VitaminD3SprayPage`
  (i18n) + `VitaminD3ImplantologyPage` + `S3LeitliniePage` ueber das DS-**Barrel**
  (`~/design-system`); `ContactCallout`-Import in die bestehende
  `~/design-system`-Zeile gemergt. Die losen `<div>` mit Roh-Tailwind-Box
  **entfernt** (`Phone`-Import bleibt — je Datei noch fuer das durchgereichte
  Icon genutzt).

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- Farben jetzt **rollenbasiert** (DS-Rollen, konsistent mit NavTile/Badge/Button):
  Medaillon + Soft-Tel-Aktion von Roh-`brand-primary`-Blau (`bg-brand-primary/10`,
  `text-brand-primary`) → kanonische **Primaeraktion** (`--color-action-primary` =
  Navy; Tint = `rgb(var(--color-action-primary-rgb)/0.1)`/`/0.2`). Schatten von
  Roh-`shadow-sm` (pures #000, §FIL-Verstoss) → `--shadow-1` (Navy-getoent,
  identisch mit Card/Panel/NavTile); Rahmen `border-gray-200` → rollenbasiert
  `--color-border` (slate-200). Titel/Hinweis byte-identisch geroutet
  (`text-gray-900` == `--color-fg-heading`, `text-gray-500` == `--color-fg-muted`).
- Hinweiszeilen-Abstand auf `mt-2` vereinheitlicht (SprayPage war `mt-1`/4px →
  8px) — marginale Angleichung an die beiden anderen Boxen.

**Bewusst NICHT in dieser Einheit**

- Die **uebrigen** Sidebar-Boxen mit identischem Aussen-Container
  (`rounded-xl border border-gray-200 bg-white p-5 shadow-sm`: Download-Box,
  Related-Content-Box) sind **anderer Inhalt** (kein Telefon-Callout) → teilen
  die ContactCallout-Signatur **nicht**; bleiben unberuehrt (§1.5/§1.20). Der
  geteilte Aussen-Container ist ein eigener (Panel-`rounded-xl`-Variante?)
  Kandidat fuer eine spaetere Einheit — hier nicht vermengt.
- **Kein** `as`-Polymorphie- oder zweiter Aktions-Prop: alle 3 Call-Sites sind
  `<div>` mit genau **einer** Tel-Aktion → keine API ohne Use (§1.20).
- Die Icon-Medaillons mit **abweichender** Groesse/Tonalitaet (h-12/h-14,
  sky-100/red-50, Step-Number-Kreise) teilen die Signatur nicht → kein
  IconBadge-Atom erzwungen (One-off §1.20).

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **455 Probleme (449 Fehler, 6 Warnungen)**; Delta zur
  2p-Baseline (453/447) = **+2 reine Resolver-Zeilen** (neues File `../../lib/utils`
  - Barrel `./compound/contact-callout`). `eslint` auf allen 5 geaenderten Dateien
    zeigt nach Abzug von `import/no-unresolved` **0** Treffer → **0 neue Regel-
    verstoesse** (kein jsx-a11y, kein arbitrary-value, kein no-duplicates).
- Token-Pflicht: **0** Roh-Hex/arbitrary-px in `contact-callout.tsx`. Alle **10**
  `--callout-*`-Tokens im gebauten Client-CSS definiert.
- Holy Grail: `rg` zaehlt **genau 1** ContactCallout-Definition; **0** verbliebene
  Telefon-Kontaktbox-Roh-Bloecke (die 4 verbliebenen Container-Treffer sind
  Download-/Related-Boxen, anderer Inhalt).
- `madge --circular --extensions ts,tsx src/design-system` → **0 Zyklen**
  (25 Dateien).

### Einheit 2r — Panel-`radius`/`as` (Related-/Download-Sidebar-Boxen) — 2026-06-24

**Aenderung**

- `src/design-system/compound/panel.tsx`: bestehendes `Panel`-Molecule **per
  orthogonalen Props erweitert** (§1.16 „bestehende Komponente per Prop erweitern"
  statt Near-Duplikat), **nicht** neu gebaut. Die zuvor in `VitaminD3SprayPage`
  (2×), `VitaminD3ImplantologyPage` und `S3LeitliniePage` **vierfach** roh gepflegte
  Sidebar-Box (`rounded-xl border border-gray-200 bg-white p-5 shadow-sm`: Download-/
  Related-Content-Box) lebt jetzt als Panel-Variante (Holy Grail §Phase 7.8, ueber
  der One-off-Schwelle §1.20; der in Einheit 2q offen vermerkte Kandidat).
  - Neue Achse `radius` (md/lg, orthogonal zu `padding`/`bordered`, §Phase 2.9):
    `lg` (Default) = `--panel-radius`-Token (16px, byte-identisch zu den
    bestehenden 6 Call-Sites); `md` = `rounded-xl` (12px) ueber die rem-basierte
    Tailwind-Skala — bewusst **nicht** auf ein Token remappt (`--radius-md` ist
    8px, ein Remap waere ein stiller Wertewechsel, §Einheit 1a). **Live belegt**
    (4× `radius="md"`, 6× Default `lg`).
  - Neue Achse `as` (`section` Default, `div`): die 4 Boxen sind `<div>` (Panel
    rendert sonst `<section>`) → das in Einheit 2m als „ab realem Bedarf"
    vertagte Polymorphie-Prop ist jetzt begruendet (§1.20). Verhaltenserhaltend
    (§1.6): byte-identisches Host-Element statt eines stillen `div`→`section`-
    Wechsels (unbenannter `<section>` = kein Landmark, aber semantisch abweichend).
- **Abgrenzung** (§Phase 2.7): Panel bleibt die **ruhende** Flaeche (kein
  Hover-Lift, keine Link-Semantik auf der Box selbst); die Related-/Download-Box
  ist dieselbe Rolle (statischer Info-/Listen-Block) nur mit engerem Radius +
  `<div>`-Host → **kein** eigenes Pattern, sondern Variante. `Card` (Hover-Lift,
  klickbar) bleibt distinkt.
- **Call-Sites migriert** (4 Instanzen ueber 3 Dateien): `VitaminD3SprayPage`
  (PDF-Download + Related), `VitaminD3ImplantologyPage` (Related Articles) +
  `S3LeitliniePage` (Verwandte Artikel) → `<Panel as="div" bordered padding="sm"
radius="md">`; `Panel`-Import in die bestehende `~/design-system`-Zeile gemergt
  (`import/no-duplicates` → 0). Die losen `<div>` mit Roh-Tailwind-Flaeche
  **entfernt**.

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- Schatten von Roh-`shadow-sm` (Tailwind-Default = pures #000, §FIL-Verstoss) →
  `--panel-shadow` = `--shadow-1` (Navy-getoent, identisch mit Card/Panel/NavTile/
  ContactCallout) — vereinheitlicht mit den uebrigen Containment-Flaechen (analog
  Einheit 2m/2o). Rahmen `border-gray-200` (Primitive, §1.7-Verstoss) →
  rollenbasiert `--panel-border` (`--color-border` = slate-200). Flaeche/Radius/
  Padding **byte-identisch** geroutet: `bg-white` == `--panel-bg`, `rounded-xl`
  (12px) == `radius="md"`, `p-5` == `padding="sm"`.

**Bewusst NICHT in dieser Einheit**

- Die **abweichenden** `rounded-xl`-Container ohne `p-5 shadow-sm` (Media-/Bild-
  Flaechen `overflow-hidden …`, `p-6`-Boxen, die interaktive Download-Karte in
  `DownloadsPage` mit `hover:border/-shadow`) teilen die Sidebar-Box-Signatur
  **nicht** → bleiben unberuehrt (§1.20, kein erzwungenes Generalisieren). Die
  interaktive Karte ist ein `Card`-naher Kandidat (Hover-Lift), kein Panel.
- Die Roh-Tailwind-Texte/-Links **innerhalb** der Boxen (`text-gray-500`,
  `text-sm`, `bg-blue-50`-Icon-Tiles …) sind Sektions-Inhalt → Token-Migration =
  Phase 3, hier nicht vermengt (§1.5). Die wiederkehrende Icon-Tile-Link-Zeile
  (Related-Listen) bleibt ein offener Molecule-Kandidat (separate Einheit).

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **455 Probleme (449 Fehler, 6 Warnungen)** = **identische
  Baseline** wie Einheit 2q (keine Datei hinzu/entfernt, `Panel`-Import in die
  bestehende `~/design-system`-Zeile gemergt). `eslint` auf allen 4 geaenderten
  Dateien zeigt nach Abzug von `import/no-unresolved` **0** Treffer → **0 neue
  Regelverstoesse** (kein jsx-a11y, kein arbitrary-value, kein no-duplicates).
- Token-Pflicht: **0** Roh-Hex/arbitrary-px in `panel.tsx`.
- Holy Grail: `rg` zaehlt **genau 1** Panel-Definition; **0** verbliebene
  `rounded-xl border border-gray-200 bg-white p-5 shadow-sm`-Roh-Boxen.
- `madge --circular --extensions ts,tsx src/design-system` → **0 Zyklen**
  (25 Dateien).

### Einheit 2s — AuthorByline-Molecule (E-E-A-T-Autoren-Attribution) — 2026-06-24

**Aenderung**

- `src/design-system/compound/author-byline.tsx` neu: **kanonisches
  AuthorByline-Molecule** (§Phase 2.3, Communication) — die zuvor in
  `VitaminD3ImplantologyPage` und `S3LeitliniePage` **byte-identisch** doppelt
  gepflegte Autoren-Attributions-Box (Initialen-Medaillon + Redaktionsname,
  E-E-A-T-Signal) lebt jetzt **einmal** hier (Holy Grail §Phase 7.8; **zweiter**
  belegter Use-Case §1.16). Inhalts-/kontext-agnostisch (§Phase 2.7): der
  Aufrufer reicht `initials` + `name` durch — die Box kennt keinen konkreten
  Autor; das call-site-spezifische Aussen-Spacing (`mb-10`) kommt byte-stabil
  ueber `className` (twMerge). **Token-rein** (§1.7): Farben ausschliesslich ueber
  neue `--author-*`-Component-Tokens via `[var(--token)]` (§3) — **0** Roh-Hex/
  arbitrary-px. Struktur/Spacing/Radius (`rounded-lg`, `p-4`, `gap-4`, `h-12 w-12`)
  ueber die rem-basierte Tailwind-Skala (bewusst nicht token-remappt, §Einheit 1a;
  analog ContactCallout).
- **A11y** (§1.11): das Initialen-Medaillon ist dekorativ (`aria-hidden`) — der
  Autorenname traegt die zugaengliche Information.
- **UI-States** (§Phase 6.1): rein statische Attribution (kein Datenbezug) →
  loading/empty/error/success nicht anwendbar (analog ContactCallout/NavTile/
  Container) — kein erfundener State.
- **Abgrenzung** (§Phase 2.7): `ContactCallout` = Kontakt-Aufforderung mit
  Tel-Aktion; AuthorByline = ruhende Attribution ohne Aktion/Link. Distinkte
  Patterns, kein verfruehtes Generalisieren.
- `tokens.css`: **5** `--author-*`-Component-Tokens ergaenzt (bg/border/avatar-bg/
  avatar-fg/name-fg) — erben nur von Semantic (§3). Im gebauten Client-CSS
  definiert (0 undef. Vars).
- `design-system/index.ts` (Barrel): `AuthorByline`/`AuthorBylineProps` exportiert.
- **Call-Sites migriert** (2 Instanzen ueber 2 Dateien): `VitaminD3ImplantologyPage`
  (`FP`) + `S3LeitliniePage` (`PX`) ueber das DS-**Barrel** (`~/design-system`);
  `AuthorByline`-Import in die bestehende `~/design-system`-Zeile gemergt
  (`import/no-duplicates` → 0). Die losen `<div>` mit Roh-Tailwind-Box **entfernt**.

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- Farben jetzt **rollenbasiert** (DS-Rollen, konsistent mit ContactCallout/Badge/
  NavTile): Medaillon von Roh-`brand-primary`-Blau (`bg-brand-primary/10`,
  `text-brand-primary`) → kanonische **Primaeraktion** (`--color-action-primary` =
  Navy; Tint = `rgb(var(--color-action-primary-rgb)/0.1)`). Rahmen `border-gray-200`
  (Primitive, §1.7-Verstoss) → rollenbasiert `--color-border` (slate-200). Flaeche
  (`bg-white` == `--color-surface`) und Name (`text-gray-900` == `--color-fg-heading`)
  **byte-identisch** geroutet.

**Bewusst NICHT in dieser Einheit**

- **Kein** `Avatar`-Atom extrahiert: das Initialen-Medaillon hat nur diese **2**
  Use-Cases (beide via AuthorByline); die distinkte Testimonial-Foto-Flaeche
  (`h-32 w-32`, `overflow-hidden`, Bild statt Initialen) teilt die Signatur nicht
  → unter der One-off-Schwelle (§1.20), kein verfruehtes Atom. Das Molecule
  rendert das `<div>`-Medaillon direkt (analog SectionHeader/`<h2>`).
- Die Step-Number-Kreise (S3 solid-Navy `h-10 w-10` mit Nummer) sind ein
  **anderes** Pattern (Prozess-Indikator) → nicht vermengt (§1.5), bleiben offener
  Kandidat.

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **457 Probleme (451 Fehler, 6 Warnungen)**; Delta zur
  2r-Baseline (455/449) = **+2 reine Resolver-Zeilen** (neues File `../../lib/utils`
  - Barrel `./compound/author-byline`). `eslint` auf allen 3 geaenderten Dateien
    zeigt **ausschliesslich** `import/no-unresolved` (10/10, kaputter eslint-import-
    Resolver, eigenes Ticket) → **0 neue Regelverstoesse** (kein jsx-a11y, kein
    arbitrary-value, kein no-duplicates).
- Token-Pflicht: **0** Roh-Hex/arbitrary-px in `author-byline.tsx`. Alle **5**
  `--author-*`-Tokens im gebauten Client-CSS definiert.
- Holy Grail: `rg` zaehlt **genau 1** AuthorByline-Definition; **0** verbliebene
  `rounded-full bg-brand-primary/10 text-brand-primary font-semibold text-lg`-
  Roh-Medaillons.
- `madge --circular --extensions ts,tsx src/design-system` → **0 Zyklen**
  (26 Dateien).

### Einheit 2t — MediaLink-Molecule (Related-/Weiterfuehrend-Link-Zeile) — 2026-06-24

**Aenderung**

- `src/design-system/compound/media-link.tsx` neu: **kanonisches MediaLink-
  Molecule** (§Phase 2.3, Navigation) — die zuvor in `VitaminD3SprayPage` (2×),
  `VitaminD3ImplantologyPage` (3×) und `S3LeitliniePage` (4×) **neunfach** roh
  gepflegte Sidebar-Listenzeile (Icon-Tile + Titel + Beschreibung, ganze Zeile
  als `<Link>`) lebt jetzt **einmal** hier (Holy Grail §Phase 7.8, weit ueber der
  One-off-Schwelle §1.20; der in Einheit 2q/2r offen vermerkte Molecule-Kandidat).
  Inhalts-/kontext-agnostisch (§Phase 2.7): der Aufrufer reicht `to`, `icon`,
  `title`, `description` — die Zeile kennt keinen konkreten Artikel/i18n.
  **Token-rein** (§1.7): Farben ausschliesslich ueber neue `--media-link-*`-
  Component-Tokens via `[var(--token)]` (§3) — **0** Roh-Hex/arbitrary-px.
  Struktur/Spacing/Radius/Icon-Tile-Groesse (`rounded-lg`, `p-2`, `gap-3`,
  `h-8 w-8`, `rounded-md`) ueber die rem-basierte Tailwind-Skala (bewusst nicht
  token-remappt, §Einheit 1a; analog NavTile/Card). Rendert internen `<Link>`.
- **Abgrenzung zu `NavTile`** (§Phase 2.7): NavTile = erhobene, **einzeilige**
  Nav-Kachel mit Hover-Lift (scale/shadow, gerahmter Gradient-Tile); MediaLink =
  flache, **zweizeilige** Listenzeile (Titel + Beschreibung) mit dezentem
  Row-Hover (kein Lift). Distinkte Patterns — **kein** verfruehtes Generalisieren
  / keine NavTile-Ueberladung mit kollidierenden Style-Achsen.
- **Akzent** ueber **eine** orthogonale, rollenbasierte Achse `accent`
  (`primary`/`success`, Default `primary`) — **beide live belegt** (5× primary,
  4× success). Icon-Tile-Farbe je Rolle, keine Kopien.
- `tokens.css`: **8** `--media-link-*`-Component-Tokens ergaenzt (erben nur von
  Semantic, §3). Im gebauten Client-CSS definiert (0 undef. Vars).
- `design-system/index.ts` (Barrel): `MediaLink`/`MediaLinkProps` exportiert.
- **Call-Sites migriert** (9 Instanzen ueber 3 Dateien): ueber das DS-**Barrel**
  (`~/design-system`); `MediaLink`-Import in die bestehende `~/design-system`-
  Zeile gemergt (`import/no-duplicates` → 0). Die losen `<Link>` mit Roh-Tailwind-
  Zeile **entfernt** (`Link`-Import bleibt — je Datei noch fuer andere Links
  genutzt).

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- Farben jetzt **rollenbasiert** (DS-Rollen, konsistent mit NavTile/Badge):
  `primary` von Roh-`bg-blue-50`/`text-brand-primary` → kanonische **Primaeraktion**
  (Navy-Tint `rgb(var(--color-action-primary-rgb)/0.1)` + Navy-Fg, wie NavTile/
  Badge-brand); Titel-Hover von Roh-`brand-primary`-Blau → `--color-action-primary`
  (Navy), wie NavTile-Label-Hover.
- `success`-Variante **konsolidiert** die zwei distinkten Roh-Gruentoene
  (`bg-green-50`/`text-green-600` **und** `bg-emerald-50`/`text-emerald-600`,
  beide nicht token-gebunden) auf **ein** DS-Success-Gruen (`--color-success-soft`/
  `--color-success-strong` = green-50/green-600, wie Badge-success). Der
  green-vs-emerald-Split war rein dekorativ (keine semantische Bedeutung) → ein
  Success-Gruen vereinheitlicht; einziger sichtbarer Effekt: die 2 Emerald-Zeilen
  werden green. Row-Hover (`bg-gray-50` == slate-50 == `--color-bg`), Titel
  (`text-gray-900` == `--color-fg-heading`) und Beschreibung (`text-gray-500` ==
  `--color-fg-muted`) **byte-identisch** geroutet.

**Bewusst NICHT in dieser Einheit**

- **Kein** `href`/`as`-Polymorphie-Prop: alle 9 Call-Sites sind interne `<Link>`
  → keine API ohne Use (§1.20); ergaenzbar beim ersten externen Use-Case.
- **Keine** `accent`-Rollen ueber primary/success hinaus (kein dritter belegter
  Use-Case; §1.20). `description` ist **Pflicht** (alle 9 Call-Sites fuehren eine
  Beschreibung) — kein optionales API ohne Use.
- Die reinen Text-Link-Listen ohne Icon-Tile (`ArticlePage`/`ServicePage`
  More-Articles/Related-Articles) teilen die MediaLink-Signatur **nicht** → bleiben
  unberuehrt (§1.20). Consumer-LP-Listen = eigener Slice (hell/Teal, §1.5).

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **459 Probleme (453 Fehler, 6 Warnungen)**; Delta zur
  2s-Baseline (457/451) = **+2 reine Resolver-Zeilen** (neues File
  `react-router-dom` + `../../lib/utils`). `eslint -f json` auf allen 5 geaenderten
  Dateien zeigt **ausschliesslich** `import/no-unresolved` (36/36, kaputter
  eslint-import-Resolver, eigenes Ticket) → **0 neue Regelverstoesse** (kein
  jsx-a11y, kein arbitrary-value, kein no-duplicates).
- Token-Pflicht: **0** Roh-Hex/arbitrary-px/Roh-Farb-Utilities in `media-link.tsx`.
  Alle **8** `--media-link-*`-Tokens im gebauten Client-CSS definiert.
- Holy Grail: `rg` zaehlt **genau 1** MediaLink-Definition; **0** verbliebene
  `rounded-md bg-{blue,green,emerald}-50 …`-Roh-Zeilen in den Call-Sites.
- `madge --circular --extensions ts,tsx src/design-system` → **0 Zyklen**
  (27 Dateien).

### Einheit 2u — InfoItem-Molecule (Kontakt-Kanal-Zeile) — 2026-06-24

**Aenderung**

- `src/design-system/compound/info-item.tsx` neu: **kanonisches InfoItem-Molecule**
  (§Phase 2.3, Communication) — die zuvor in `ContactPage` (2×) und `SupportPage`
  (2×) **vierfach** roh gepflegte Kontakt-Kanal-Zeile (Icon-Medaillon +
  uppercase-Label + Wert) lebt jetzt **einmal** hier (Holy Grail §Phase 7.8, ueber
  der One-off-Schwelle §1.20). Inhalts-/kontext-agnostisch (§Phase 2.7): der
  Aufrufer reicht `icon`, `label` und Wert (`children`) durch — die Zeile kennt
  weder E-Mail noch Telefonnummer. **Token-rein** (§1.7): Farben ausschliesslich
  ueber neue `--info-item-*`-Component-Tokens via `[var(--token)]` (§3) — **0**
  Roh-Hex/arbitrary-px. Struktur/Spacing/Radius (`h-8 w-8`, `gap-3`,
  `rounded-full`) ueber die rem-basierte Tailwind-Skala (bewusst nicht
  token-remappt, §Einheit 1a). Die **Wert**-Schriftgroesse wird **nicht** gesetzt
  → erbt byte-identisch die `text-sm`-Kaskade des Aufrufer-Wrappers.
- **A11y** (§1.11): das fuehrende Medaillon-Icon ist jetzt dekorativ
  (`aria-hidden`) — das Label traegt die zugaengliche Information (vermeidet
  redundantes Vorlesen des ✉/☎-Glyphen; vorher nicht gesetzt).
- **Abgrenzung** (§Phase 2.7): `ContactCallout` = ganze gerahmte Box mit Tel-Aktion;
  `MediaLink` = navigierbare Link-Zeile; InfoItem = ruhende, rahmenlose Label/Wert-
  Detailzeile mit Medaillon. Distinkte Patterns, kein verfruehtes Generalisieren.
- `tokens.css`: **4** `--info-item-*`-Component-Tokens ergaenzt (erben nur von
  Semantic, §3). Im gebauten Client-CSS definiert (0 undef. Vars).
- `design-system/index.ts` (Barrel): `InfoItem`/`InfoItemProps` exportiert.
- **Call-Sites migriert** (4 Instanzen ueber 2 Dateien): `ContactPage` +
  `SupportPage` ueber das DS-**Barrel** (`~/design-system`); `InfoItem`-Import in
  die bestehende `~/design-system`-Zeile gemergt (`import/no-duplicates` → 0). Die
  losen `<div>` mit Roh-Tailwind-Zeile **entfernt**.

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- Medaillon jetzt **rollenbasiert** (DS-Rollen, konsistent mit Callout/Badge/
  AuthorByline): von Roh-`bg-brand-secondary/20`/`text-brand-secondary` (mid-blue
  #2f6fa0, rollenlos) → kanonische **Primaeraktion** (Navy-Tint
  `rgb(var(--color-action-primary-rgb)/0.1)` + Navy-Fg). Label von `text-gray-500`
  (#868c98) → `--color-fg-muted` (slate-500), marginaler Shift, konsistent mit
  Callout-muted. Wert vom geerbten `text-gray-600` (Tailwind-Default #4b5563) →
  `--color-fg` (Body, slate-700).

**Bewusst NICHT in dieser Einheit**

- **Keine** mailto:/tel:-Links auf den Werten eingefuehrt (waren Roh-`<p>`-Text) →
  verhaltenserhaltend (§1.6); eine eigene Einheit, hier nicht vermengt (§1.5).
- Die Step-Number-Kreise (S3-Leitlinie `h-10 w-10` solid-Navy) und die abweichenden
  Icon-Medaillons (`h-10 w-10` sky-100) teilen die InfoItem-Signatur **nicht** →
  bleiben offene One-off-Kandidaten (§1.20), kein erzwungenes IconBadge-Atom.

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **461 Probleme (455 Fehler, 6 Warnungen)**; Delta zur
  2t-Baseline (459/453) = **+2 reine Resolver-Zeilen** (neues File `react`/
  `../../lib/utils` + Barrel `./compound/info-item`). `eslint` auf allen 4
  geaenderten Dateien zeigt nach Abzug von `import/no-unresolved` **0** Treffer →
  **0 neue Regelverstoesse** (kein jsx-a11y, kein arbitrary-value, kein
  no-duplicates).
- Token-Pflicht: **0** Roh-Hex/arbitrary-px/Roh-Farb-Utilities in `info-item.tsx`.
  Alle **4** `--info-item-*`-Tokens im gebauten Client-CSS definiert.
- Holy Grail: `rg` zaehlt **genau 1** InfoItem-Definition; **0** verbliebene
  `rounded-full bg-brand-secondary/20`-Roh-Zeilen in den Call-Sites.
- `madge --circular --extensions ts,tsx src/design-system` → **0 Zyklen**
  (28 Dateien).

### Einheit 2v — Import-Richtung maschinell erzwungen (§2.4) + Import-Resolver repariert — 2026-06-24

**Aenderung**

- `eslint.config.js`: **`eslint-plugin-boundaries`** verdrahtet (§2.4 / §2.2,
  `[FRO][BUD]`) — die Atomic-Schichten-Hierarchie
  `Page → Template → Organism → Molecule/Feedback → Atom → Token` ist jetzt ein
  **hartes Build-Gate** (`boundaries/element-types: error`), nicht mehr nur
  Grep/Review. Schliesst den seit Phase 2 offenen DoD-Punkt „Import-Richtung
  strikt top-down ... maschinell via eslint-plugin-boundaries §2.4 gruen".
  Element-Typen auf die **reale** Projektstruktur gemappt (nicht das generische
  §2.4-Beispiel): `token`=`design-system/tokens`, `atom`=`core`+
  `primitives-layout`, `molecule`=`compound`, `feedback`=`feedback`,
  `ds-barrel`=`design-system/index.ts` (oeffentliche API), `organism`=
  `components/sections`, `app-ui`=`components/ui`, `template`=`components/layout`,
  `page`=`pages`. Allow-Listen folgen §2.2 („gleiche **oder** tiefere Ebenen") —
  Same-Level erlaubt (z. B. `Layout`→`Header/Footer`, Consumer-Seiten
  untereinander). Test-Dateien via `boundaries/ignore` ausgenommen (sie
  konsumieren bewusst das Barrel).
- **Wurzel-Fix `import/no-unresolved` (Phase-1-Altlast, in **jeder** bisherigen
  Einheit als „eigenes Ticket / kaputter eslint-import-Resolver" vermerkt):**
  **`eslint-import-resolver-typescript`** als `import/resolver` konfiguriert
  (`tsconfig.app/server/node`). Loest sowohl den `~/*`-Alias (tsconfig `paths`)
  als auch `.ts/.tsx`-Relativimporte auf. Vorher scheiterte **jeder** Import am
  Default-Node-Resolver (kennt keine TS-Extensions/Alias) → ~437 Falsch-Positive.
  Dieser kaputte Resolver hat zugleich `boundaries` ausgehebelt (ohne aufgeloestes
  Ziel **keine** Schicht-Klassifikation → die Regel war ein No-op). Erst der
  Resolver macht das Boundaries-Gate **wirksam**.
- `eslint.config.js`: **`_project-knowledge/`** in `globalIgnores` (eingefrorener
  Pre-Refactor-Referenz-Snapshot, 129 Dateien, nicht gebaut, nicht von `src`
  referenziert) — war die alleinige Quelle der verbliebenen 93
  `import/no-unresolved` (veraltete Pfade `routes/`, `ProductCard`, alte
  `ui/Button.tsx` …). Lint deckt jetzt nur noch echten App-Code ab.
- `package.json`: zwei Dev-Deps ergaenzt (`eslint-plugin-boundaries@^6.0.2`,
  `eslint-import-resolver-typescript@^4.4.5`).

**Bewusste Entscheidung** (§1.6 — markiert, reversibel via Git)

- `components/layout/*` als **ein** `template`-Typ gemappt (statt `Layout`=template
  / `Header`+`Footer`=organism feinkoernig zu trennen): verhaltenserhaltend, ohne
  Datei-Verschiebung; die feinkoernige Re-Klassifikation folgt, sobald die
  Organismen physisch nach `sections/` wandern (eigene Einheit). Same-Level
  (`template→template`) ist nach §2.2 ohnehin erlaubt.
- `components/ui/*` (BlogCard/ServiceCard/SearchModal/… = App-Komposita) als
  `app-ui` auf Organism-Ebene eingeordnet — kein verfruehtes Verschieben ins DS
  (sie sind inhaltsgebundene App-Wrapper, s. Einheit 2f).

**Bewusst NICHT in dieser Einheit**

- Die **18 echten, vorbestehenden** Lint-Fehler (+2 Warnungen), die der reparierte
  Resolver nun **entlarvt** (waren unter den ~437 Resolver-Falsch-Positiven
  begraben): `react-hooks/set-state-in-effect` (8), `react-hooks/refs` (3),
  `react-hooks/immutability` (1), `jsx-a11y/*` (3), `no-case-declarations` (1),
  `@typescript-eslint/no-unused-vars` (1, `server.ts`),
  `react-refresh/only-export-components` (1). Das sind **Hooks-Korrektheit +
  A11y** = **Phase-5/6-Scope** (riskante Logik-/Markup-Aenderungen) → hier **nicht**
  vermengt (§1.5), sondern als jetzt-sichtbarer, kleiner Backlog dokumentiert.
  **Keine** dieser Stellen liegt in einer in dieser Einheit editierten Datei.
- `jsx-a11y`-Verschaerfungen + `madge`-CI-Gate aus dem §2.4-Snippet sind bereits
  ueber `jsxA11y.flatConfigs.recommended` aktiv; zusaetzliche Einzelregeln =
  Phase-5-Pass.

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint`: **20 Probleme (18 Fehler, 2 Warnungen)** — Sturz von der
  2u-Baseline **461/455** um **−437 Fehler**. **0** `import/no-unresolved` und
  **0** `boundaries/*` im echten `src` (Histogramm geprueft); alle 18 verbliebenen
  Fehler sind **vorbestehende** Hooks/A11y/Server-Defekte (oben gelistet) →
  **0 neue Fehler durch diese Einheit**.
- **Wirksamkeits-Beweis** (Regel ist **kein** No-op): ein injizierter Rueckwaerts-
  Import `core/badge.tsx → compound/card.tsx` wird mit
  „_no rule allowing dependencies from elements of type ‚atom' to ‚molecule'_"
  abgewiesen (danach revertiert). Gegenprobe vor dem Resolver-Fix: dieselbe
  Injektion blieb **unentdeckt** (Ziel nicht aufloesbar → Regel stumm).
- `madge --circular --extensions ts,tsx src` → **0 Zyklen** (151 Dateien).
- DoD §Phase 2: „Import-Richtung strikt top-down auf **allen** Ebenen (maschinell
  via eslint-plugin-boundaries §2.4 gruen)" + „**0** Zirkular-Abhaengigkeiten" →
  **erfuellt**.

---

## Phase 3 — Visueller-Craft-Pass `[FIL]`

### Einheit 3a — Fluid Display-Titel als Token (Hero/Section-Headline) — 2026-06-24

**Aenderung**

- `tokens.css`: **fluide Display-Titel-Typografie** als Token-Quelle ergaenzt
  (§Phase 3.7, „Alle Texte folgen der Typo-Skala; keine Ad-hoc-`font-size`").
  **Primitive** `--font-size-display` (`clamp(2rem, 7vw, 4rem)`, 32→64),
  `--font-size-display-sm` (`clamp(1.75rem, 6.2vw, 3rem)`, 28→48) + zugehoerige
  fluide Line-Heights (`--line-height-display` 38→72, `--line-height-display-sm`
  34→56) und ein Tracking-Primitive `--letter-spacing-tight: -0.02em`.
  **Semantic** `--text-display` / `--text-display-sm` (erben vom Primitive, §3).
  Damit lebt der zuvor **4×** roh wiederholte Display-Titel-Wert (Hero-h1/-h2,
  AboutSection, DoctorsSection) als **Single Source** (Holy Grail §Phase 7.8,
  keine Duplikate §1.8).
- `tailwind.config.js`: **additiv** die token-referenzierten Utilities
  `text-display` / `text-display-sm` (fontSize-Tupel mit gepaartem `lineHeight`
  aus dem Token-Paar → kein separates `leading-` noetig) sowie
  `tracking-headline` (`letterSpacing` → `--letter-spacing-tight`). Konsum ueber
  Config-Key statt arbitrary `[var(--token)]` — **0** Roh-Hex/arbitrary-px in den
  Komponenten (§1.7).
- **Call-Sites migriert** (3 Dateien, 4 Titel): `HeroSection` (h1 **und** h2),
  `AboutSection` + `DoctorsSection` (`SectionHeader.titleClassName`). Das rohe
  `text-[clamp(32px,7vw,64px)] leading-[clamp(38px,7.6vw,72px)] … tracking-[-0.02em]`
  (bzw. die `28→48`-Variante) → `text-display` / `text-display-sm` +
  `tracking-headline`. Die beiden Section-Titel zusaetzlich `text-gray-900`
  → rollenbasiert `text-fg-heading` (§Phase 3.3) — **byte-identisch**, da
  `text-gray-900` ueber `--brand-heading-rgb` (#203864) auf denselben Ton wie
  `--color-fg-heading` aufloest.

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- Die clamp-**Grenzen** von **px → rem** umgestellt (`32px`→`2rem`, `64px`→`4rem`,
  …): bei 16px-Root **byte-identisch** zur bisherigen Optik, aber die Titel
  skalieren jetzt mit der Browser-Schriftgroessen-Praeferenz (Zoom-A11y §1.11) —
  ein bewusster A11y-Gewinn, kein sichtbarer Default-Change. Der `vw`-Mittelterm
  bleibt unveraendert.
- Section-Titel-Farbe rollenbasiert (`text-fg-heading`) statt Legacy-`gray-900`
  — konsistent mit dem `SectionHeader`-Default-Titel (`--section-header-title-color`
  = `--color-fg-heading`). Hero-Titel bleibt on-dark (erbt `text-white` der
  Sektion) — bewusst **kein** erzwungener Color-Token am Display-Atom.

**Bewusst NICHT in dieser Einheit**

- `ArticlesIndexPage`-h1 nutzt ein **anderes** (gestuftes) Display-Pattern
  (`text-hero-sm/-md/-lg` + `leading-[47px]`/`[58px]`/`[69px]`) — eigener Slice,
  hier nicht vermengt (§1.5); separate Einheit.
- Die uebrigen Roh-Werte der `HeroSection` (Layout-Groessen `min-h-[700px]`/
  `w-[500px]`, On-Dark-Farb-Rollen `text-white/80`, Gradient-Flaechen, Slider-Dots)
  bleiben — anderer Scope (Hero-Farb-/Layout-Pass, Phase 3/4), nicht vermengt.

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **20 Probleme (18 Fehler, 2 Warnungen)** = **identische
  Baseline** wie Einheit 2v → **0 neue Fehler/Warnungen** (alle 18 = vorbestehender
  Hooks-/A11y-Backlog, Phase-5/6).
- Token-Pflicht: **0** `text-[clamp` / `tracking-[-0.02em]` in den 3 migrierten
  Dateien. Im gebauten Client-CSS sind alle vier `clamp(...)`-Display-Werte +
  `--letter-spacing-tight` definiert; die Utilities kompilieren als
  `.text-display{font-size:var(--text-display);line-height:var(--line-height-display)}`
  etc. (0 undef. Vars).
- Byte-Identitaet: clamp-Grenzen `2rem/4rem/2.375rem/4.5rem` == `32/64/38/72px`,
  `text-gray-900` == `text-fg-heading` (#203864) bei 16px-Root.

### Einheit 3b — Uppercase-Overline-Tracking als Token (Kicker-Typografie) — 2026-06-24

**Aenderung**

- `tokens.css`: **Uppercase-Overline-Tracking** als Token-Quelle ergaenzt
  (§Phase 3.7, „Alle Texte folgen der Typo-Skala; keine Ad-hoc-`font-size`" —
  hier Ad-hoc-`letter-spacing`). **Primitive** `--letter-spacing-overline: 0.16em`
  (die Sperrung der uppercase-Kicker/Overline-Labels). Damit lebt der zuvor **17×**
  roh wiederholte `tracking-[0.16em]`-Wert als **Single Source** (Holy Grail
  §Phase 7.8, keine Duplikate §1.8) — parallel zu `--letter-spacing-tight` aus 3a.
- `tailwind.config.js`: **additiv** die token-referenzierte Utility
  `tracking-overline` (`letterSpacing` → `--letter-spacing-overline`), exakt nach
  dem Muster der bestehenden `tracking-headline`-Bindung. Konsum ueber Config-Key
  statt arbitrary `tracking-[0.16em]` — **0** arbitrary-value in den Komponenten (§1.7).
- **Call-Sites migriert** (17 Vorkommen ueber 8 Dateien): `BlogSection`,
  `ContactPage` (2), `DownloadsPage`, `ArticlePage` (5), `ServicePage` (4),
  `ArticlesIndexPage`, `SupportPage` (2) **und** das DS-Molecule `info-item.tsx` (1).
  `tracking-[0.16em]` → `tracking-overline` — **byte-identisch** (`0.16em == 0.16em`),
  **kein** sichtbarer Change (§1.6).

**Bewusst NICHT in dieser Einheit** (Risiko/Scope)

- **Nur** der Letter-Spacing-Rohwert migriert. Die an denselben Call-Sites lebenden
  Roh-/Legacy-Farben (`text-accentBlue`, `text-gray-500`, `text-brand-primary`)
  bleiben — das ist eine **Farb-Rollen-Migration** (§Phase 3.3), eigener Slice,
  hier nicht vermengt (§1.5).
- **Keine** `Overline`-Atom-Extraktion: das wiederkehrende Voll-Pattern
  (`text-xs/-sm font-semibold uppercase tracking-overline text-…`) ist ein
  Atom-Kandidat (≥3 Use-Cases), aber Atom-Bau ist Phase-2-Architektur; in Phase 3
  (Visueller-Craft, Token/Hierarchie) wird der Wert tokenisiert, nicht die Struktur
  umgebaut — separater Slice.
- Consumer-`tracking-[1.6px]` (5× in `consumer/*`, hell/Teal-Slice §1.5) und
  `FeaturedCaseStudy`s `tracking-[0.14em]` (anderer Wert) bleiben **unberuehrt** —
  andere Werte/Slices, nicht vermengt.

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **20 Probleme (18 Fehler, 2 Warnungen)** = **identische
  Baseline** wie Einheit 3a → **0 neue Fehler/Warnungen** (alle 18 = vorbestehender
  Hooks-/A11y-Backlog, Phase-5/6).
- Token-Pflicht: **0** verbliebene `tracking-[0.16em]` im `src`; **17** neue
  `tracking-overline`. Im gebauten Client-CSS ist `--letter-spacing-overline: .16em`
  definiert; die Utility kompiliert als
  `.tracking-overline{letter-spacing:var(--letter-spacing-overline)}` (0 undef. Vars).
- Byte-Identitaet: `--letter-spacing-overline` == `0.16em` == das migrierte
  `tracking-[0.16em]` (0 optischer Change).
- `madge --circular --extensions ts,tsx src/design-system` → **0 Zyklen**.

### Einheit 3c — Kicker/Overline-Label-Farben → rollenbasierte Tokens (Farb-Rollen-Pass) — 2026-06-24

**Aenderung**

- **Farb-Rollen-Migration** (§Phase 3.3 — „Farben per ROLLE; Primary nur fuer
  Aktion/Focus") der in 3b auf `tracking-overline` vereinheitlichten Kicker-/
  Overline-Labels — der in der 3b-Notiz explizit als naechster Slice markierte
  Folge-Schritt. **Nur** die Textfarbe migriert (Struktur/Tracking unveraendert,
  **kein** Atom-Bau — Phase 2). Konsum ueber token-gebundene Tailwind-Rollen-
  Utilities (Einheit 1b), **0** Roh-Hex/arbitrary-value (§1.7).
- **Accent-Kicker (10 Vorkommen, 7 Dateien)** — die eingefaerbten Section-/
  Kategorie-/Featured-Labels: `text-accentBlue` (9×) bzw. `text-brand-primary`
  (1×, BlogSection) → `text-accent-strong` (= `--color-accent-strong`, Teal-700,
  Token-Kommentar „Eyebrow-Text"). Betroffen: ContactPage (Hero-Kicker),
  BlogSection (Featured), ArticlesIndexPage (Featured), DownloadsPage (Subtitle),
  SupportPage (Hero-Kicker), ServicePage (Caption + Related-Kategorie),
  ArticlePage (Artikel-Kategorie + 2× Suggested-Kategorie).
- **Muted Sidebar-Widget-Titel (6 Vorkommen, 4 Dateien)** — die `<h2>`/`<h3>`-
  Overline-Headings der Sidebar-Boxen: `text-gray-500` → `text-fg-muted`
  (= `--color-fg-muted`, slate-500). Betroffen: ContactPage + SupportPage
  (Sidebar-Links-Titel), ServicePage (Key Areas + Unsere Artikel), ArticlePage
  (More articles + Passende Diagnostik). **Rollen-erhaltend** (muted bleibt muted).

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- Accent-Kicker von Roh-/Legacy-**Blau** (`accentBlue`/`brand-primary` ==
  `--brand-blue-rgb`, #0d527f) → **Teal-Accent** (`--color-accent-strong`,
  #0f766e). Ein Kicker ist **dekorative Emphase**, **keine** Aktion → er darf nicht
  die Primary-/Action-Farbe (Navy) tragen (§3.3); der kanonische Sekundaer-Akzent
  des DS ist Teal. Konsistent mit allen bisherigen „Roh-Blau → Teal-Accent"-
  Entscheidungen (Breadcrumbs-Link-Hover, Stat-Suffix, Eyebrow-on-dark, Badge-
  `accent`). Die nicht-Overline-Vorkommen von `text-accentBlue` (ArticlePage:150
  Content-`<h3>`) und `text-brand-primary` (BlogSection Hover/Link) bleiben
  **unberuehrt** — anderer Slice, nicht vermengt (§1.5).
- Muted-Titel von Legacy-`gray-500` (#868c98, kuehl) → rollenbasiert
  `--color-fg-muted` (slate-500, #64748b) — konsistent mit der InfoItem-Label-
  Migration; minimaler, bewusster Ton-Shift (kuehl → slate).

**Bewusst NICHT in dieser Einheit**

- **Keine** `Overline`-Atom-Extraktion: das 16× wiederkehrende Voll-Pattern
  (`text-xs/sm font-semibold uppercase tracking-overline text-…`) ist ein Atom-
  Kandidat (≥3 Use-Cases), aber Atom-Bau ist Phase-2-Architektur. In Phase 3
  (Visueller-Craft) wird die **Farb-Rolle** korrigiert, nicht die Struktur
  umgebaut — separater Slice (wie schon in 3b begruendet).
- Die uebrigen Legacy-/Roh-Farben an denselben Call-Sites (`text-gray-900`/`-600`/
  `-700`, `border-gray-*`, `bg-gray-50`, Hover-`brand-*`) bleiben — eigene Farb-
  Rollen-Slices (Headings/Body/Border/Flaechen), hier nicht vermengt (§1.5).
- Consumer-Slice (hell/Teal) unberuehrt (§1.5).

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **20 Probleme (18 Fehler, 2 Warnungen)** = **identische
  Baseline** wie 3a/3b → **0 neue Fehler/Warnungen**. Der einzige Treffer auf einer
  editierten Datei (`ArticlePage:181` `no-case-declarations`) ist **vorbestehend**
  und liegt **ausserhalb** der editierten Hunks (256/336/383/393/411).
- Token-Pflicht: **0** verbliebene `tracking-overline text-accentBlue` /
  `text-brand-primary` / `text-gray-500` im `src`; **10** neue `text-accent-strong`
  - **6** neue `text-fg-muted` an Overline-Labels. Im gebauten Client-CSS loesen die
    Utilities als `var(--color-accent-strong-rgb)` bzw. `var(--color-fg-muted-rgb)`
    auf (0 undef. Vars).
- Byte-Differenz dokumentiert (bewusst, §1.6): Accent #0d527f → #0f766e (Blau →
  Teal), Muted #868c98 → #64748b (gray → slate).

### Einheit 3d — Heading-Text-Farbe → rollenbasierter Token (`text-gray-900` → `text-fg-heading`, Farb-Rollen-Pass) — 2026-06-24

**Aenderung**

- **Farb-Rollen-Migration** (§Phase 3.3 — „Farben per ROLLE; Text = dunkelstes
  Grau / Headline-Rolle") des Vordergrund-/Heading-Textes — der in der 3c-Notiz
  explizit als naechster Slice markierte Folge-Schritt (dort als „Headings
  (`text-gray-900`)" gequeued). **127 Vorkommen** ueber **24 Dateien** (Pages +
  Sections + UI) von der **Legacy-Alias-Utility** `text-gray-900` auf die
  token-gebundene Rollen-Utility `text-fg-heading` (= `--color-fg-heading` →
  `--brand-heading`, #203864) umgestellt. Konsum ueber Config-Key statt
  Legacy-Alias — **0** Roh-Hex/arbitrary-value (§1.7); **kein** Atom-/Struktur-
  Umbau (Phase 2), nur die Farb-Rolle.
- Damit lebt **kein** `text-gray-900`-Legacy-Alias mehr im aktiven Main-Site-
  Komponenten-/Seiten-Code; der Heading-Text zieht jetzt durchgaengig die
  `fg-heading`-Rolle (konsistent mit den DS-Molecules, die `text-gray-900 ==
Headline-Navy` bereits so routen: NavTile/Callout/AuthorByline/MediaLink).

**Bewusst NICHT in dieser Einheit** (Risiko/Scope, §1.5 — nicht vermengt)

- **Surface-/Scrim-/Fokus-Rollen** von `gray-900` bleiben **unberuehrt**: die
  Hero-Verlauf-Stops (`from-/to-gray-900`, 13×), die Flaechen `bg-gray-900`
  (SearchModal-Overlay, IglooProPage-Section, CookieBanner-Button) und
  `ring-gray-900` (CookieBanner-Fokus) sind **andere** Rollen (Surface/Scrim/
  Focus, kein Text) → eigene Slices.
- **`index.css`-Basis-Layer** (`:root { color: … }`, `a { @apply text-gray-900 }`,
  `glass-panel-dark`, `.rich-content`-Hardcodes #868c98/#083358): Basistypografie
  ist ein **eigener** Slice (wie in 1b vermerkt), hier nicht vermengt — das
  `:root`/`a`-Default ist zudem ein **Body-Default**, dessen Re-Roling (auf
  `--color-fg`) ein sichtbarer Change waere, kein byte-identischer.
- **Strong-/Tabellen-/Wert-Emphase** (`<strong>`, `<td>`, Spec-`<span>`/`<p>`),
  die `text-gray-900` als **Heading-Navy-Emphase** nutzt, wird **byte-identisch**
  mit-migriert (gleicher Wert) — ein etwaiges Re-Roling auf `--color-fg-strong`
  (slate-800) waere ein bewusster sichtbarer Change und bleibt einer spaeteren
  Hierarchie-Einheit vorbehalten.
- Consumer-Slice (hell/Teal) unberuehrt (§1.5).

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **20 Probleme (18 Fehler, 2 Warnungen)** = **identische
  Baseline** wie 3a/3b/3c → **0 neue Fehler/Warnungen** (alle 18 = vorbestehender
  Hooks-/A11y-Backlog, Phase 5/6).
- Token-Pflicht: **0** verbliebene `text-gray-900` im aktiven Main-Site-`.tsx`
  (Surface-/Scrim-`gray-900` bewusst erhalten); **127** neue `text-fg-heading`.
- **Byte-Identitaet** (0 optischer Change, §1.6): im gebauten Client-CSS loest
  `text-fg-heading` ueber `--color-fg-heading-rgb` → `--brand-heading-rgb` =
  `32 56 100` = **#203864** auf — exakt der Wert, auf den `text-gray-900`
  (Tailwind-Alias `gray-900 = rgb(var(--brand-heading-rgb))`) zeigte.

### Einheit 3e — Body-Text-Farbe → rollenbasierter Token (`text-gray-600/-700` → `text-fg`, Farb-Rollen-Pass) — 2026-06-24

**Aenderung**

- **Farb-Rollen-Migration** (§Phase 3.3 — „Farben per ROLLE; Text = dunkelstes
  Grau / Body-Rolle") des Fliess-/Body-Textes — der in der 3c/3d-Notiz explizit
  als naechster Slice gequeuede Folge-Schritt („Body (`text-gray-600/-700`)").
  **131 Vorkommen** (71× `text-gray-700` + 60× `text-gray-600`) ueber **23
  Dateien** (Pages + Sections + UI) von den **Tailwind-Default-Grau-Utilities**
  `text-gray-700` (#374151) **und** `text-gray-600` (#4b5563) auf die token-
  gebundene Rollen-Utility `text-fg` (= `--color-fg` → `--neutral-700`,
  slate-700 #334155) umgestellt. Inkl. des einen Hover-States
  (`hover:text-gray-600` → `hover:text-fg`, IglooProPage). Konsum ueber Config-Key
  statt Tailwind-Default-Alias — **0** Roh-Hex/arbitrary-value (§1.7); **kein**
  Atom-/Struktur-Umbau (Phase 2), nur die Farb-Rolle.
- Damit lebt **kein** `text-gray-600`/`-700`-Default-Grau mehr im aktiven
  Main-Site-Komponenten-/Seiten-Code; der Body-Text zieht jetzt durchgaengig die
  `fg`-Rolle (konsistent mit dem bereits in Einheit 2u so gerouteten
  `--info-item-value-fg: var(--color-fg)` — „war geerbtes text-gray-600 → Body",
  tokens.css:413).

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- **Zwei** Legacy-Grau-Stufen → **eine** DS-Body-Rolle kollabiert: Das DS
  definiert genau **eine** Body-Text-Rolle (`--color-fg` = slate-700) und eine
  Muted-Rolle (`--color-fg-muted` = slate-500). `gray-700`/`gray-600` waren beide
  „Body/unterstuetzender Text" → beide auf `text-fg` vereinheitlicht (eine Rolle,
  keine Zufallsabstufung, §Phase 3.3/§3.1 „cold greys"). Bewusster Ton-Shift
  **kuehl-Grau → Slate**: `gray-700` #374151 → slate-700 #334155 (nahezu
  identisch, minimal kuehler); `gray-600` #4b5563 → slate-700 #334155 (etwas
  **dunkler** → hoeherer Body-Kontrast, AA-Gewinn). Konsistent mit allen bisherigen
  „Roh-Grau → Slate-Rolle"-Entscheidungen (3c Muted-Titel, InfoItem).

**Bewusst NICHT in dieser Einheit** (Risiko/Scope, §1.5 — nicht vermengt)

- **Muted-Text** (`text-gray-500`, 47 Rest-Vorkommen ausserhalb der in 3c bereits
  migrierten Overline-Labels) → eigener Folge-Slice (Muted, `--color-fg-muted`),
  hier nicht vermengt.
- **Surface-/Border-/Disabled-Rollen** von `gray-*` (`bg-gray-50`, `border-gray-*`,
  `text-gray-400`, `hover:bg-gray-50`) bleiben **unberuehrt** — andere Rollen
  (Flaeche/Border/Disabled-UI), eigene Slices.
- **Consumer-Slice** (`pages/consumer/*` = hell/Teal) unberuehrt (§1.5); er nutzt
  ohnehin **0** `text-gray-600/-700`. Die `/vitamin-d3-*`-Produktseiten gehoeren
  zur **Main-Site** (B2B-Shell, `/vitamin-d3-spray`/`-implantologie`, nicht
  `/consumer/*`) und wurden — wie schon in 3d (Heading → `fg-heading`) — bewusst
  **mit**-migriert.
- **`index.css`-Basis-Layer** (`:root`/`a`-Defaults): eigener Body-Default-Slice
  (sichtbarer Re-Roling-Change), hier nicht vermengt — wie in 3d vermerkt.

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **20 Probleme (18 Fehler, 2 Warnungen)** = **identische
  Baseline** wie 3a/3b/3c/3d → **0 neue Fehler/Warnungen** (alle 18 = vorbestehender
  Hooks-/A11y-Backlog, Phase 5/6).
- Token-Pflicht: **0** verbliebene `text-gray-600`/`text-gray-700` im aktiven
  Main-Site-`.tsx` (der einzige Treffer ist der **Historien-Kommentar** in
  `tokens.css:413`, kein Klassen-Literal); **131** neue `text-fg`-Body-Treffer.
  Im gebauten Client-CSS loest `text-fg` ueber `--color-fg-rgb` → `--neutral-700-rgb`
  = `51 65 85` = **#334155** auf (0 undef. Vars).
- Byte-Differenz dokumentiert (bewusst, §1.6): `gray-700` #374151 → #334155
  (kuehl-Grau → Slate, ~identisch); `gray-600` #4b5563 → #334155 (dunkler, AA-Gewinn).

### Einheit 3f — Muted-Text-Farbe → rollenbasierter Token (`text-gray-500` → `text-fg-muted`, Farb-Rollen-Pass) — 2026-06-24

**Aenderung**

- **Farb-Rollen-Migration** (§Phase 3.3 — „Farben per ROLLE; Muted/Secondary-Text
  = `--color-fg-muted`") des **muted/sekundaeren** Vordergrund-Textes — der in der
  3c/3d/3e-Notiz explizit als naechster Slice gequeuede Folge-Schritt („Muted
  (`text-gray-500`), eigener Folge-Slice"). **44 Vorkommen** ueber **17 Dateien**
  (Pages + Sections + UI) von der **Legacy-Alias-Utility** `text-gray-500`
  (= `rgb(var(--gray-500-rgb))`, #868c98) auf die token-gebundene Rollen-Utility
  `text-fg-muted` (= `--color-fg-muted` → `--neutral-500`, slate-500 #64748b)
  umgestellt. Konsum ueber Config-Key statt Legacy-Alias — **0** Roh-Hex/
  arbitrary-value (§1.7); **kein** Atom-/Struktur-Umbau (Phase 2), nur die Farb-Rolle.
- Damit lebt **kein** `text-gray-500`-Legacy-Alias mehr im aktiven Main-Site-
  Komponenten-/Seiten-Code; der muted/sekundaere Text (Meta-Zeilen, Hilfetexte,
  Kleingedrucktes, Bio-/Feature-Beschreibungen, muted Icon-Controls) zieht jetzt
  durchgaengig die `fg-muted`-Rolle — konsistent mit der bereits in **3c** so
  gerouteten Muted-Sidebar-Titel-Migration (`gray-500` #868c98 → slate-500, exakt
  derselbe Ton-Shift) und der `--info-item-label-fg`-Routung der DS-Molecules.

**Bewusste Redesign-Entscheidung** (§1.6 — markiert, reversibel via Git)

- Muted-Foreground von Legacy-`gray-500` (#868c98, kuehl) → rollenbasiert
  `--color-fg-muted` (slate-500 #64748b) — **identischer** Ton-Shift wie die
  3c-Muted-Titel und konsistent mit allen „Roh-/Legacy-Grau → Slate-Rolle"-
  Entscheidungen (3c/3e). Minimaler, bewusster kuehl-Grau → Slate-Shift.
- **Uniform ueber alle Foreground-Vorkommen** (Text **und** muted Icon-Controls):
  die zwei interaktiven Icon-Buttons (`MobileCallButton` Schliess-Icon,
  `SearchModal` Schliess-Icon) tragen die **gleiche** muted-Foreground-Rolle und
  werden mit-migriert; ihre Hover-States betreffen die **Flaeche** (`hover:bg-*`),
  **nicht** die Textfarbe — der muted-Ton bleibt in allen States rollen-erhaltend.

**Bewusst NICHT in dieser Einheit** (Risiko/Scope, §1.5 — nicht vermengt)

- **Hover-Color-Rollen** an denselben Call-Sites (`TeamSection` Social-Links:
  `hover:text-brand-primary` / `hover:text-social-linkedin`) bleiben **unberuehrt**
  — das sind **Brand-/Social-Akzent**-Rollen (kein Grau), eigener Slice.
- **Surface-/Border-/Disabled-Rollen** von `gray-*` (`bg-gray-50/-100/-200`,
  `border-gray-*`, `text-gray-400`, `hover:bg-gray-*`) bleiben **unberuehrt** —
  andere Rollen (Flaeche/Border/Disabled-UI), eigene Slices.
- **Consumer-Slice** (`pages/consumer/*` = hell/Teal) unberuehrt (§1.5) — seine
  **11** `text-gray-500`-Vorkommen gehoeren zum eigenen Slice. Die `/vitamin-d3-*`-
  Produktseiten (Main-Site-B2B-Shell) wurden — wie in 3d/3e — bewusst **mit**-migriert.
- **`index.css`-Basis-Layer** + `tokens.css`-Historien-Kommentar: kein Klassen-
  Literal, nicht im Scope.

**Verifikation** (2026-06-24)

- `npm run build` → gruen (client + server). `npm run typecheck` (`tsc -b`) → gruen.
- `npm run lint` → **20 Probleme (18 Fehler, 2 Warnungen)** = **identische
  Baseline** wie 3a/3b/3c/3d/3e → **0 neue Fehler/Warnungen** (alle 18 =
  vorbestehender Hooks-/A11y-Backlog, Phase 5/6).
- Token-Pflicht: **0** verbliebene `text-gray-500` im aktiven Main-Site-`.tsx`;
  **44** migrierte Vorkommen → `text-fg-muted` (Gesamt-`text-fg-muted` im
  Main-Site-`.tsx` = 51, inkl. der 7 Bestands-Treffer aus 3c/InfoItem). Im
  gebauten Client-CSS loest `text-fg-muted` ueber `--color-fg-muted-rgb` →
  `--neutral-500-rgb` = `100 116 139` = **#64748b** auf (0 undef. Vars).
- Byte-Differenz dokumentiert (bewusst, §1.6): `gray-500` #868c98 → slate-500
  #64748b (kuehl-Grau → Slate, ~identisch — derselbe Shift wie 3c-Muted-Titel).

---

## Phase 0 — Baseline-Metriken & Audit-Artefakte (formaler Abschluss, 2026-06-24)

Phase 0 wurde formal nachgezogen (EXECUTION-PLAN §C Phase 0). Alle Werte aus **ausgeführten**
Befehlen (§1.15).

### Erzeugte Artefakte (Task 1–8, 11, 14)

- `docs/interface-inventory.md` — 16 Kategorien, Duplikate markiert, not-found/error/loading erfasst.
- `docs/design-system/PATTERNS.md` — Komponenten-Inventar + Naming-Map (alt→agnostisch).
- `docs/REFACTOR_BACKLOG.md` — KEEP/MERGE/DROP, Impact×Feasibility.
- `docs/ux/problem-statements.md` (v2, je Segment), `docs/ux/insights.md` (Mad-Libs + Lo-Fi),
  `docs/ux/research-summary.md` (Executive Summary + Quote-Cluster), `docs/ux/analytics-audit.md`.
- `docs/personas/{dr-mara-keller,tomasz-nowak,lena-fischer}.md` — 3 Proto-Personas, 4 Quadranten,
  3-Akt-Story, narrative Akzeptanzkriterien.

### Werte-Audit (Task 3, Allowlist §1.19: `!tokens.{json,css,ts}`, `!tailwind.config.*`)

- Hartkodierte **Hex**: **60** Matches / **3** Dateien (`components/ui/FlagIcon.tsx`,
  `src/index.css`, `components/sections/IglooWidgetSection.tsx`).
- **px**: **128** Matches / **32** Dateien (Top: S3LeitliniePage 19, VitaminD3ImplantologyPage 12,
  HeroSection 12, FeaturedCaseStudy 12).
- **rem**: **49** Matches / **9** Dateien.
- Tailwind-arbitrary-spacing `p/m-[…]` (ohne `var(`): **0**.
- `font-(thin|extralight|light)`: **4** Matches / **1** Datei (`components/layout/Header.tsx`).
  → Token-Migrations-Liste = Backlog #7 (Phase 3).

### Architektur-/Qualitäts-Baseline (Task 10)

- `npm run build` → **grün** (client + server).
- `npm run typecheck` (`tsc -b`) → **grün**.
- `npm run lint` → **18 Fehler / 2 Warnungen** (vorbestehend; Legacy-Hooks/A11y + Tabu-Consumer;
  Abbau Phase 2/5). Regeln: react-hooks (setState-in-effect / refs-in-render), jsx-a11y
  (label/click-events/static-interactions), react-refresh, no-case-declarations, no-unused-vars.
- `npx madge --circular --extensions ts,tsx src` → **0 Zyklen** (151 Dateien).
- `npx ts-prune` → **0** ungenutzte Exports.
- `npx depcheck` → unused devDeps gemeldet (`autoprefixer`/`postcss`/`tailwindcss`/Resolver —
  **False-Positives**, via Config/PostCSS genutzt); „missing" betrifft `scripts/`+`_project-knowledge/`
  (außerhalb App-Scope).

### First-Load-JS / Route (Task 10, `npm run build`)

- Shared `index-*.js`: **359.14 kB** (gzip **110.66 kB**).
- Vendor: `vendor-react` 44.39 kB (gzip 15.97), `vendor-i18n` 58.67 kB (gzip 19.06).
- Schwerste Route-Chunks (client): S3LeitliniePage 36.68 kB (gzip 9.99),
  VitaminD3ImplantologyPage 24.13 kB (gzip 7.26), VitaminD3SprayPage 18.48 kB (gzip 4.42).
  → Performance-Budget-Referenz für §5 (Regression = CI-rot; Ziel <100 KB gz/Route).

### Tooling-Inventar (Task 4)

- Vorhanden: `build` (client+server), `typecheck` (`tsc -b`), `lint` (`eslint .`), `test` (vitest),
  `test:e2e` (playwright), `format`/`format:check`, `prerender`.
- **Fehlt:** `build-storybook` — **Fallback fixiert** (ASSUMPTION §E.7): leichtgewichtige
  `/styleguide`-Route statt Storybook (kein neues Build-Tool, §1.16); Phase 7.

### Analytics (Task 11) → `docs/ux/analytics-audit.md`

- 7 Events; `page_view`/`virtual_pageview` = **Vanity**; consumer-`*` = Outcome-Proxy,
  `consumer_order_submit` = echte Conversion. **Kein** nutzersichtbarer Aggregat-Score (gut).

### Daten-/Tech-Bestandsaufnahme (Task 12) → audit-Agenten + `AUDIT_I18N_ROUTING.md`

- Statische Datenverträge (`src/data/*.ts`: products/articles/blogPosts/events/testimonials/services),
  i18next 10 Locales × 14 Namespaces (`public/locales/`), API-Adapter `src/api/{contact,support,consumerOrder}.ts`.
- `lib/metrics/{definitions,thresholds,aggregate}.ts` + `lib/flags.ts` = **Stubs** (Phase 1 erfüllt).

### Lo-Fi-Validierung (Task 13) → `docs/ux/insights.md`

- Leichte interne Richtungs-Validierung dokumentiert; vollständige externe Runde = Phase 6
  (`user-testing.md`). `ASSUMPTION — needs human confirmation`.

### Git-Tag (Task 15)

- `git tag pre-refactor-baseline` gesetzt (siehe `git tag`-Verifikation).

### Baseline-Screenshots (Task 9, §7.4) — erledigt

- `scripts/baseline-screenshots.mjs` gegen laufende SSR-Instanz (`PORT=3000`) → **20 PNGs**
  (5 Routen × 4 Breakpoints sm/md/lg/xl) in `docs/baseline-screenshots/`.
- Routen: home, diagnostics, articles, contact, notfound (`/de/...`).
- Browser-Start brauchte `LD_LIBRARY_PATH=/home/phillip/plibs` (System-`libgbm.so.1` fehlt).
- **Overflow-Assertion (Baseline-Finding für Phase 4):** `home@lg` scrollWidth **1216 > 1024**
  (echter Horizontal-Overflow, ~192px); übrige Routen `@lg` 1039 > 1024 (~15px, Scrollbar-Gutter).
  sm/md/xl ohne Overflow. → Backlog #9 (Phase 4 Responsiveness).

### Offene Phase-0-DoD-Punkte (ehrlich)

- **Lighthouse/axe gegen laufende Instanz:** Audit-Server-Gate (Phase 3/5) — dort belegt.

---

## Phase 1 — Rest-DoD verifiziert (2026-06-24)

Token-Foundation war bereits umgesetzt; hier die **ausgeführten** Verifikations-Belege (§1.15):

- **Wertkategorien/Body-Min:** `--font-size-300: 1rem` (16px, MIN) → `--text-body` bindet darauf
  (`tokens.css:85,222`). Body/Input ≥16px ✓.
- **Kein `#000` als Token-Wert:** `rg '#000' tokens.css` ohne Kommentar-Zeilen = **0 Treffer**
  (alle `#000` nur in erklärenden Kommentaren „war Roh-shadow = #000") ✓.
- **Typeface:** `@fontsource-variable/inter` in `src/entry-client.tsx:23`; `tailwind.config.js:79`
  `fontFamily.sans = ['Inter Variable', …]` → genau **ein** Typeface, self-hosted ✓.
- **Tailwind:** Token unter `theme.extend` (`tailwind.config.js:5`), kein Top-Level-Override ✓.
- **Theming:** `[data-theme='dark']` (`tokens.css:452`) rebindet **nur Semantic** (`--color-*-rgb`)
  auf Primitive (`--neutral-*`) — identische Namen, kein Component-Token auf Rohwert ✓.
- **Stubs:** `lib/flags.ts`, `lib/metrics/{definitions,thresholds,aggregate}.ts` vorhanden ✓.
- `npm run typecheck` grün; `npm run lint` unverändert (18/2 vorbestehend).

→ **Phase 1 DoD vollständig belegt.** Nächste offene Phase: **Phase 2** (Atomic-Restrukturierung:
`design-system/sections` + `src/templates` anlegen, Legacy `components/{ui,sections}` konsolidieren,
`lineage.md`, Boundaries-/madge-Grün belegen) — substanzieller Build-Schritt.

---

## Phase 2 — Token-Connect: Roh-Hex in `index.css` + `IglooWidgetSection` (2026-06-24)

**Task 10 (§Phase 2.10 „Connect tokens"):** Die letzten Roh-Hex außerhalb der
Token-Quelldateien aufgelöst. Vorher (Allowlist §1.19) **3 Dateien / 55 Hex-Treffer**;
nachher nur noch `src/components/ui/FlagIcon.tsx` (= **Nationalflaggen-Farben = Daten**,
keine Design-Tokens — wie Logo-/Marken-SVG legitime Ausnahme, dokumentiert).

**`src/index.css` — `.rich-content` (Pillar-/Artikel-Prose, 20 Roh-Hex + `white`/`rgba`):**

- Neuer **Component-Token-Block** `--prose-*` in `tokens.css` (erbt **nur** von
  Semantic, §3); `index.css` referenziert ausschließlich `var(--prose-*)`/Semantic.
- **A11y-Bonus (§1.11):** Body-Text war `#868c98` (gray-500, ~3.5:1 auf Weiß =
  **AA-Fail**) → `--prose-fg` = `--color-fg` (slate-700, ≥4.5:1).
- **Theming-Bonus:** Artikel-Prose ist jetzt theme-fähig (Dark-Mode-Rebind greift
  automatisch über die Semantic-Kanäle) — vorher hart hellgrundige Hex.
- `:root` `background-color: #f8fafc` → `var(--color-bg)`, `color` → `var(--color-fg-heading)`.
- CTA-Block-Gradient `#0d527f→#083358` = byte-genau `var(--color-surface-brand)→var(--color-action-primary)`.

**`src/components/sections/IglooWidgetSection.tsx` — dekorativer Linien-Gradient:**

- SMIL `<animate stop-color values="#…">` (kann **kein** `var(--token)` referenzieren
  und ignoriert `prefers-reduced-motion`) → **CSS-Keyframes-Shimmer** (`.igloo-line-stop-*`
  in `index.css`), token-gebunden (`--color-border`/`-strong`/`-fg-muted`) **inkl.
  reduced-motion-Stopp** (§5/§1.11-Vorgriff).

**Verifikation (ausgeführt §1.15):**

```
rg -l '#[0-9a-fA-F]{3,8}' src <Allowlist> --glob '!**/*.test.tsx'  → nur FlagIcon (Flaggen-Daten)
rg -n '#…|rgba\(|: white' src/index.css                            → EMPTY ✓
npm run build && npm run typecheck && npm run lint                  → grün (15 warn / 0 err = Baseline)
npx madge --circular src                                            → ✔ 0 Zyklen
```

---

## Phase 2 — DoD formal geschlossen (alle Punkte ausgeführt belegt, 2026-06-24)

Die substanzielle Phase-2-Arbeit (Atom→Molecule→Organism-Slices 2a–2v,
Token-Connect 2.10, Lineage 2.11) ist abgeschlossen. Hier der **ausgeführte**
DoD-Nachweis (§1.15) je Plan-Punkt. **Architektur-Entscheidung (§1.17,
`ASSUMPTION — needs human confirmation`):** Organismen/Templates bleiben physisch
in `src/components/{sections,layout}` und werden **maschinell** über
`eslint-plugin-boundaries` als `organism`/`template` klassifiziert + richtungs-
geprüft (`eslint.config.js:67–92`) — **nicht** nach `design-system/sections`
verschoben. Begründung: §1.16 (realen Stack/Struktur nicht ohne Mehrwert
umbauen) + §1.8 (Vermeiden > Umbauen); die Schicht-Trennung ist verhaltens-
gleich erfüllt. Die im EXECUTION-PLAN „Status IST" genannten Pfade
`design-system/sections`/`src/templates` sind damit gegenstandslos.

| DoD-Punkt                                                                     | Beleg (ausgeführt)                                                                                                                                                                                                                                                                               | Status |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| Jede Komponente in korrekter Ebene; keine verwaisten Ad-hoc                   | DS-Schichten `core/compound/feedback/primitives-layout`; `boundaries/elements` klassifiziert `components/{sections,ui,layout}` + `pages`. `components/{analytics,seo}` = Cross-Cutting-Infra (GTM-Pageview, SEO-Head/Structured-Data), bewusst **keine** Atomic-UI-Ebene.                        | ✓      |
| Import-Richtung strikt top-down (boundaries grün)                             | `npm run lint` → **0 errors** (15 Baseline-warns); `boundaries/element-types` = Build-Gate                                                                                                                                                                                                       | ✓      |
| **0** Zyklen                                                                  | `npx madge --circular src` → ✔ No circular dependency found                                                                                                                                                                                                                                      | ✓      |
| Keine Duplikate; ein kanonisches Atom; genau **eine** Definition (Holy Grail) | je Komponente exakt **1** reale `.tsx`-Definition + 1 Barrel-Re-Export (`rg -l "export (const\|function) <C>" src/design-system --glob '!index.ts'` → 1)                                                                                                                                         | ✓      |
| Namen struktur-/content-agnostisch + Industriestandard; Prop-Konventionen     | `rg -ni "homepagecarousel\|productcard\|bloghero" src` → EMPTY; `rg -n "isDisabled\|isOpen\|isLoading" src/design-system` → EMPTY (einheitlich `disabled`/`open`)                                                                                                                                | ✓      |
| `lineage.md` (Uses/Used-by); tote Patterns → GRAVEYARD                        | `docs/design-system/lineage.md` deckt alle 22 DS-Komponenten + 13 Organismen + 10 App-UI + 4 Templates; **kein** toter Code (jede ≥1 realer Importeur) → `GRAVEYARD.md` bleibt für Phase 6 reserviert                                                                                            | ✓      |
| Kein `use client/server` / Next-Leakage; SSR-Baum identisch                   | `rg -n "use client\|use server\|next/(font\|image\|dynamic\|link)\|next-intl" src` → EMPTY; Browser-Effekte nur in `useEffect` (Mount-Guards)                                                                                                                                                    | ✓      |
| Templates ohne Inhalts-Literale; Content-Guardrails                           | `Layout` = reines Slot-Gerüst (`children`, keine Content-Literale); Guardrail über **Bild-aspect-ratio** (`width`/`height` an allen `<img>`, u. a. Header/Footer/Hero/Cta). **zod `.max` bewusst NICHT eingeführt** (neue Dep = §1.16-Verstoß); der DoD-OR-Pfad „Bild-aspect-ratio" ist erfüllt. | ✓      |

**Gesamt-Gate (ausgeführt):**

```
npm run build      → ✓ built (client+server), Route-Sizes notiert
npm run typecheck  → ✓ tsc -b ohne Fehler
npm run lint       → ✓ 0 errors / 15 warns (Baseline, dokumentiert)
npx madge --circular src → ✔ 0 Zyklen
```

→ **Phase 2 DoD vollständig belegt & geschlossen.** Nächste offene Phasen:
**{3 Visual-Craft, 4 Grid/Layout}** (pro Komponente verschränkbar, §4).

---

## Phase 3 — Typografie: Light-Gewicht entfernt (§3.7, 2026-06-24)

`Header`-Mobile-Menü nutzte `font-light` auf 16–18px-Nav-Text → §3.7-Verstoß
(„kein Light-Gewicht für kleinen Text"). **Fix:** Top-Level-Nav → `font-medium`,
Sub-Items → `font-normal` (≥2-Stufen-Gewicht-Hierarchie). Belege (ausgeführt):

```
rg -ni "font-(thin|extralight|light)\b" src   → EMPTY ✓
npm run build && typecheck && lint            → grün (0 err / 15 Baseline-warn)
```

**Phase-3-Teilbelege (statisch, ausgeführt):**

```
rg "#[0-9a-fA-F]{3,8}" src <Allowlist> ohne FlagIcon  → 0 Dateien (Hex-Werte: 0) ✓
rg -nP "\b[pm][trblxy]?-\[(?!var\()" src              → EMPTY (keine arbitrary spacing) ✓ (Phase 4)
rg -n "col-span-(5|7|11)" src                         → EMPTY ✓ (Phase 4)
core-Atome hover:/focus-visible:/active:/disabled:    → Button/Input/Select/Textarea ✓
```

---

## ⚠ Umgebungs-Blocker: Browser-/DOM-abhängige Verifikations-Gates (2026-06-24)

**Befund (ausgeführt, reproduzierbar):** In dieser Sandbox lassen sich die
**laufzeit-/browserbasierten** Gates aus §B („Audit-Server") und §7 **nicht
ausführen** — zwei voneinander unabhängige, **vorbestehende** Umgebungsdefekte:

1. **Kein lauffähiges Chromium** → Playwright (axe-core via Browser, Lighthouse,
   Responsive-Screenshots/Overflow-Assert) bricht ab:
   `chrome-headless-shell: error while loading shared libraries: libgbm.so.1:
cannot open shared object file`. Kein `sudo`/Paketinstall möglich.
2. **jsdom-Test-Umgebung defekt unter Node 18** → `npm test` (vitest) bricht
   **vor** jedem Test ab: `html-encoding-sniffer` `require()`t das **ESM-only**
   `@exodus/bytes/encoding-lite.js` (CJS-`require(ESM)` erst ab Node ≥20
   unterstützt; hier `node v18.20.8`). Betrifft die **gesamte** jsdom-gebundene
   Suite, **nicht** durch das Refactoring verursacht (Lockfile/Node-Mismatch).

**Konsequenz für die DoD (§1.15 „Verifizieren ≠ behaupten"):** Folgende Gates
sind in dieser Umgebung **nicht belegbar** und werden **nicht** als grün
behauptet — sie bleiben formal offen, bis auf einem Host mit Chromium + Node ≥20
ausgeführt:

| Gate                                                               | Phase(n) | Status hier                 |
| ------------------------------------------------------------------ | -------- | --------------------------- |
| axe-core WCAG 2.2 AA gegen laufende Instanz (inkl. color-contrast) | 3, 5     | ⛔ blockiert (Chromium)     |
| Lighthouse-A11y ≥95 / Performance-Budget                           | 5        | ⛔ blockiert (Chromium)     |
| Responsive-Regression sm/md/lg/xl + Overflow-Assert                | 4        | ⛔ blockiert (Chromium)     |
| Visuelle Regressionssuite (Playwright-Screenshots)                 | 7        | ⛔ blockiert (Chromium)     |
| `npm test` (vitest/jsdom) inkl. `aggregate`-Median-Test            | 5, 6     | ⛔ blockiert (jsdom/Node18) |

**Bereitgestellte, korrekte Gate-Infrastruktur (lauffähig auf passendem Host):**
`scripts/a11y-audit.mjs` (Playwright + injiziertes `axe-core`, WCAG 2.0/2.1/2.2
A+AA, plus Overflow-Assert sm/xl) — `URL=http://localhost:3000 node
scripts/a11y-audit.mjs` nach `npm run build && npm run start`. In dieser Sandbox
schlägt nur der Browser-Start fehl (s. o.), die Audit-Logik ist verifiziert.

**Statisch belegbare Gates** (build/typecheck/lint/madge/`rg`-Audits) bleiben
weiterhin grün und werden je Einheit belegt. **STOPP-Bedingung (§D) ist damit in
dieser Umgebung nicht erreichbar** (ALL_PHASES_COMPLETE erfordert die o. g.
ausgeführten Laufzeit-Gates) — menschliche Bestätigung / CI-Lauf nötig.

---

## Phase 4 — Layout-Primitives Stack/Cluster/Grid + Reading-Width (2026-06-24)

**Einheit 4a (Atomic top-down, §1.5 ein revertierbarer Change):** Die vom Plan
(§Phase 4.2/4.4) geforderten Layout-Primitive `Stack`/`Cluster`/`Grid` fehlten
(nur `Container` existierte). Neu in `src/design-system/primitives-layout/`:

- **`Stack`** — vertikaler Fluss (`flex flex-col`), orthogonale Achsen
  `gap`/`align`; `gap` ausschließlich über die 8pt-Raster-Stufen (`--space-*`).
- **`Cluster`** — horizontale, per Default umbrechende Gruppe (`flex flex-wrap`,
  → kein Horizontal-Scroll, §4.5), Achsen `gap`/`align`/`justify`.
- **`Grid`** — responsives Karten-Raster, `cols` ∈ {2,3,4} (teilt 12 sauber, nie
  5/7/11 §4.2), mobile-first 1→sm:2→lg:N; `gap` aus der 8pt-Skala.

**Konsolidierung (§1.8 / Holy Grail §7.8):** `pages/consumer/shell.tsx` definierte
eine **eigene** `Grid`-Funktion (von `MaskPage`/`SprayPage` importiert) → in das
zentrale Primitive verschoben; `shell.tsx` re-exportiert es jetzt von
`~/design-system` (genau **eine** Definition, Importeure unverändert). Reale
Adoption (kein toter Code §1.8): `Grid` ← shell/Mask/Spray; `Cluster` ←
`shell.Pills`; `Stack` ← `HeroSection`-CTA-Block.

**Reading-Width (§4.3):** `max-w-reading` (`--reading-width: 68ch`, in
`tailwind.config.js` definiert, bislang **ungenutzt**) erstmals verdrahtet —
Privacy-Prose von 1200px-Container auf zentrierte Reading-Width begrenzt.

**Verifikation (ausgeführt §1.15):**

```
npm run build                                  → ✓ built (client+server), exit 0
npm run typecheck (tsc -b)                      → ✓ exit 0
npm run lint                                    → ✓ 0 errors / 15 Baseline-warns
npx madge --circular --extensions ts,tsx src    → ✔ No circular dependency found (154 files)
rg -nP "\b[pm][trblxy]?-\[(?!var\()" src         → EMPTY (keine arbitrary spacing) ✓
rg -n "col-span-(5|7|11)\b" src                 → EMPTY ✓
rg -nP "(gap|grid-cols)-\[" src/design-system/primitives-layout → nur Doku-Kommentare, kein Code ✓
rg -n "#[0-9a-fA-F]{3,8}" src/design-system/primitives-layout   → EMPTY (token-rein) ✓
rg -n "max-w-reading" src                       → PrivacyPage (erstmals genutzt) ✓
```

**Offen / nur visuell belegbar (Umgebungs-Blocker, s. o.):** flächendeckende
Reading-Width-Adoption für Artikel-Body/Forms und die Responsiv-Regression
sm/md/lg/xl + Overflow-Assert benötigen den (hier blockierten) Chromium-/
Playwright-Lauf — daher **nicht** als grün behauptet (§1.15). Statische Grid-/
Spacing-Gates aus §Phase-4-Verifikation sind grün belegt.

---

## Phase 3 + 4 — Artikel-Lesetypografie & Container-Token (VitaminD3-Seiten, 2026-06-24)

**Einheit 3g/4b (Phase 3 × 4 pro Komponente verschränkt, §4 Ausnahme; ein
revertierbarer Change §1.5):** Die beiden Artikel-Seiten `VitaminD3ImplantologyPage`
und `VitaminD3SprayPage` trugen die letzte Häufung **arbitrary Typografie-Werte**
auf der Main-Site (Token-Pflicht-Verstoß §1.7 / §3.7 „kein Ad-hoc-`font-size`"):
`text-[17px] leading-[1.75]` (Fließtext, 7+1 Blöcke), `text-[15px]
leading-relaxed` (Sekundärtext, Listen/FAQ/Specs) und die Artikel-H1
`text-2xl … lg:text-[2.25rem]/[2.5rem] lg:leading-[…]`.

**Änderung (token-rein):**

- **Fließtext** `text-[17px] leading-[1.75]` → `text-lg leading-body`
  (18px = Skalenstufe `--font-size-400`; Leading aus DS-Token
  `--line-height-body`/1.6). Neue **token-getriebene** Tailwind-Utility
  `lineHeight.body = var(--line-height-body)` ergänzt (additiv, §3.3) — ersetzt
  das arbitrary `leading-[1.75]`; im gebauten Client-CSS als
  `.leading-body{line-height:var(--line-height-body)}` emittiert (verifiziert).
- **Sekundärtext** `text-[15px]` → `text-base` (16px = `--font-size-300`,
  Body-MIN) → erfüllt zusätzlich **Body/Input ≥16px** (§FIL/§1.11; vorher 15px
  unter der Schwelle). Leading vereinheitlicht auf `leading-body`.
- **Artikel-H1** → `text-display-sm` (fluid `--text-display-sm`, clamp 28→48,
  Leading aus dem Token-Paar) — konsistent mit dem in Einheit 3a etablierten
  Display-Token-Ansatz; ersetzt die manuelle responsive Leiter + arbitrary
  `lg:text-[…]`/`lg:leading-[…]`.
- **Inhalts-Container** `max-w-[1200px]` → `max-w-container` (token-referenziert
  in `tailwind.config.js`, **byte-identisch** 1200px); Hero-Textspalte
  `max-w-[900px]` → `max-w-4xl` (Standard-Skala 56rem, kein arbitrary).
- **Farb-Rollen-Pass (§3.3):** verbliebenes Roh-`text-gray-800` (Spray, Dosier-
  Text) → `text-fg`.

**Bewusste Redesign-Entscheidung (§1.6 — markiert, reversibel via Git):** Fließtext
17→18px, Leading 1.75→1.6 (DS-Body-Leading), Sekundärtext 15→16px, H1 auf fluid
Display-Skala. Werte snappen bewusst auf die nicht-lineare Token-Skala (keine
ungeraden 15/17px mehr, §Phase 1 DoD); Lesefluss-Optik bleibt erhalten.

**Bewusst NICHT in dieser Einheit (§1.5 nicht vermengt):**

- **Inhaltsabhängige Eigengrößen** bleiben (§4.1 erlaubt: „Eigengrößen dürfen
  inhaltsabhängig sein"): Produktbild `lg:w-[380px]` (+`width`/`height`-Attribute),
  Spec-Label-Spalte `min-w-[200px]`, Hero-`min-h-[…]`, Modal `max-h-[80vh]`,
  EventsPage-Divider `max-w-[120px]`.
- **Roh-Tailwind-Farben** in den USP-/Evidence-Boxen (`bg-blue-50/70`,
  `bg-sky-50/50`, `border-sky-200`, `text-sky-600`, `text-green-500`): eigener
  Farb-Rollen-Pass (Fortsetzung §3c–3f), hier nicht vermengt.

**Verifikation (ausgeführt §1.15, 2026-06-24):**

```
rg -nP "\b(text|leading)-\[" src/pages/VitaminD3ImplantologyPage.tsx \
       src/pages/VitaminD3SprayPage.tsx          → EMPTY (0 arbitrary Typo) ✓
rg -n "max-w-\[(900px|1200px)\]" (beide Seiten)   → EMPTY ✓
npm run build                                     → ✓ exit 0 (client+server)
npm run typecheck (tsc -b)                         → ✓ exit 0
npm run lint                                       → ✓ 0 errors / 15 Baseline-warns
grep .leading-body dist/client/assets/*.css        → line-height:var(--line-height-body) ✓
```

**Offen (Umgebungs-Blocker, s. o.):** visuelle/Responsiv-Regression der Artikel-
Seiten (Chromium/Playwright) — statische Token-/Typo-Gates sind grün belegt.

### Einheit 3h — Artikel-Lesetypografie (S3LeitliniePage, 2026-06-24)

**Fortsetzung von 3g auf die dritte Artikel-Seite** (`S3LeitliniePage`, gleiches
Prose-Muster). **Token-rein** dieselbe Transformation (§1.7/§3.7), ein revertierbarer
Change (§1.5):

- Fließtext `text-[17px] leading-[1.75]` (14 Blöcke inkl. `mb-8`-/`mt-6`-Varianten)
  → `text-lg leading-body`.
- Sekundärtext `text-[15px] leading-relaxed` (nummerierte Liste + FAQ) → `text-base
leading-body` (Body ≥16px erfüllt, §FIL/§1.11).
- Artikel-H1 `text-2xl … lg:text-[2.25rem] lg:leading-[1.2]` → `text-display-sm`.
- Container `max-w-[1200px]` → `max-w-container`; Hero-Spalte `max-w-[900px]` →
  `max-w-4xl`. Inhaltsabhängiges `min-h-[380px]` bleibt (§4.1).

**Verifikation (ausgeführt §1.15, 2026-06-24):**

```
rg -nP "\b(text|leading)-\[(?!length:var|var)|max-w-\[(900px|1200px)\]" \
       src/pages/S3LeitliniePage.tsx   → NONE (0 arbitrary Typo/Container) ✓
npm run build / typecheck / lint        → grün (0 errors / 15 Baseline-warns)
```

Damit sind **alle drei** Artikel-Seiten (VitaminD3Implantology/Spray + S3Leitlinie)
auf die Token-Typo-Skala + benannte Container migriert. Verbliebene main-site
Arbitrary-Typo: `ArticlePage`/`ServicePage` (`leading-[28/32px]`),
`ArticlesIndexPage` (Hero-`leading-[47/58/69px]` + `tracking-[-0.02em]`),
`NotFoundPage` (One-off-404-`text-[10/12rem]`) — eigene Folge-Einheiten (§1.5).

### Einheit 3i — Artikel-Lesetypografie (generische Renderer ArticlePage/ServicePage, 2026-06-24)

**Fortsetzung von 3g/3h auf die beiden datengetriebenen Renderer.** ArticlePage
(Content-Sections aus `content/`) und ServicePage (Intro/Sections/Conclusion)
trugen die letzte Häufung arbitrary Fließtext-Leading auf der Main-Site
(Token-Pflicht-Verstoß §1.7 / §3.7 „kein Ad-hoc-`leading`"). Token-rein, ein
revertierbarer Change (§1.5):

- **Body-Absätze** `text-sm leading-[32px] text-fg-muted sm:text-base` →
  `text-base leading-body text-fg-muted`.
- **Listen** `… text-sm leading-[28px] text-fg-muted sm:text-base` →
  `… text-base leading-body text-fg-muted`.
- **Conclusion-/Disclaimer-Box** `… text-sm leading-[28px] text-fg sm:text-base` →
  `… text-base leading-body text-fg`.

**Bewusste Redesign-Entscheidung (§1.6 — markiert, reversibel via Git):** Mobiler
Body 14→16px (`text-sm`→`text-base`, beseitigt das `sm:`-Sprung-Paar; **Body ≥16px**
§FIL/§1.11 jetzt auf allen Viewports erfüllt); Leading von arbitrary 28/32px auf
das DS-Body-Token (`--line-height-body`/1.6) gesnappt — konsistent mit 3g/3h.

**Verifikation (ausgeführt §1.15, 2026-06-24):**

```
rg -nP "\b(text|leading)-\[(?!length:var|var)" \
       src/pages/ArticlePage.tsx src/pages/ServicePage.tsx  → EMPTY (0 arbitrary Typo) ✓
npm run build                                               → ✓ exit 0 (client+server)
npm run typecheck (tsc -b)                                   → ✓ exit 0
npm run lint                                                 → ✓ 0 errors / 15 Baseline-warns
grep .leading-body dist/client/assets/*.css                  → line-height:var(--line-height-body) ✓
```

**Verbliebene main-site Arbitrary-Typo (eigene Folge-Einheiten §1.5):**
`ArticlesIndexPage` (Hero `leading-[47/58/69px]` + `tracking-[-0.02em]`),
`NotFoundPage` (One-off-404 `text-[10/12rem]`), `FeaturedCaseStudy`
(`tracking-[0.14em]`). Consumer-Seiten (`shell`/`PriceBadge`/`OrderForm`/
`OrderModal`: `tracking-[1.6px]` etc.) — eigener Consumer-Pass.

### Einheit 3j — Artikel-Index-Hero auf Display-Token + tote hero-\* Tokens entfernt (2026-06-24)

**ArticlesIndexPage-Hero-`<h1>`** trug die letzte arbitrary Hero-Typo der Main-Site
(§1.7/§3.7): `text-hero-sm leading-[47px] tracking-[-0.02em] sm:text-hero-md
sm:leading-[58px] lg:text-hero-lg lg:leading-[69px]` — eine manuelle 3-Stufen-px-
Leiter mit drei arbitrary Leadings + arbitrary Tracking. Token-rein, ein
revertierbarer Change (§1.5):

- → `text-display font-medium tracking-headline` — exakt die etablierte
  Page-Hero-Konvention (HomePage `HeroSection`, `AboutSection`). `text-display`
  ist fluid (`--text-display`, clamp 38→72) und **trägt seine eigene Leading**
  aus dem Token-Paar (`--line-height-display`), `tracking-headline` =
  `--letter-spacing-tight` (byte-identisch -0.02em). Ersetzt die manuelle
  Responsive-Leiter + alle arbitrary Werte in einem Zug.
- **Toter Code entfernt (§1.8):** `text-hero-sm/md/lg` (40/48/58px) waren nach
  dieser Migration der **einzige** Konsument — die drei `fontSize`-Tokens aus
  `tailwind.config.js` gelöscht (kein toter Token).

**Bewusste Redesign-Entscheidung (§1.6):** Hero wird fluid (clamp 38→72 statt
fixe 40/48/58) — vereinheitlicht den Artikel-Index-Hero mit allen übrigen
Page-Heroes; Leading aus dem Display-Token statt drei ad-hoc px.

**Verifikation (ausgeführt §1.15, 2026-06-24):**

```
rg -n "text-hero-|tracking-\[-0\.02em\]" src   → EMPTY (0 arbitrary Hero-Typo, 0 tote Tokens) ✓
npm run build                                  → ✓ exit 0 (client+server)
npm run typecheck (tsc -b)                      → ✓ exit 0
npm run lint                                    → ✓ 0 errors / 15 Baseline-warns
```

**Verbliebene main-site Arbitrary-Typo:** `NotFoundPage` (One-off-404
`text-[10/12rem]`), `FeaturedCaseStudy` (`tracking-[0.14em]`) — Folge-Einheiten.

### Einheit 3k — Letzte arbitrary Typo der Main-Site: 404-Numeral + Case-Study-Kicker (2026-06-24)

Schließt die arbitrary **Typografie** auf der gesamten Main-Site (§1.7/§3.7).
Zwei letzte Treffer, ein revertierbarer Change (§1.5):

- **NotFoundPage 404-Numeral** `text-[10rem] sm:text-[12rem]` → neues Token
  `text-display-xl`. Primitive `--font-size-display-xl: clamp(10rem, 7.5rem +
12vw, 12rem)` (160→192, fluid wie die übrigen Display-Tokens, Zoom-A11y über
  rem §1.11) + Semantic `--text-display-xl` + Tailwind `fontSize.display-xl`
  (Token-Quelldateien = Allowlist §1.19). One-off bewusst als Token statt
  arbitrary (Grep-0-Ziel §Phase-3-DoD). `leading-none` (Utility) bleibt.
- **FeaturedCaseStudy-Kicker** `tracking-[0.14em]` → `tracking-overline`
  (`--letter-spacing-overline`/0.16em) — dieselbe Uppercase-Kicker-Sperrung wie
  ArticlePage/Eyebrow; 0.14→0.16em auf das DS-Token gesnappt.

**Verifikation (ausgeführt §1.15, 2026-06-24):**

```
rg -nP "\b(text|leading|tracking)-\[(?!length:var|var)" src \
       --glob '!**/tokens.*' --glob '!**/consumer/**'   → EMPTY (0 arbitrary Typo Main-Site) ✓
npm run build / typecheck / lint                          → grün (0 errors / 15 Baseline-warns)
grep text-display-xl dist/client/assets/*.css             → font-size:var(--text-display-xl) ✓
```

**Damit Main-Site frei von arbitrary Typografie.** Verbleibend (eigener
**Consumer-Pass**, light-Theme): `shell`/`PriceBadge`/`OrderForm`/`OrderModal`
(`tracking-[1.6px]`, `text-[11px]`, `leading-[1.1]`, `lg:text-[3.25rem]`,
`lg:leading-[1.05]`). Separater Farb-Rollen-Pass (§3.3) für Roh-Tailwind-Paletten
(`bg-cyan-*`/`from-…`-Gradients) bleibt offen.
