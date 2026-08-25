# AP05 — Vollständige Prompt-Kette

**Projekt:** PolarisDX Website Relaunch  
**Work Package:** AP05 — Sales-Machine Design-System und Light-Theme-Grundlage  
**Ausführung:** streng seriell  
**Reihenfolge:** `PT05.1 → PT05.2 → PT05.3 → PT05.4 → PT05.5 → AP05-CLOSURE`  
**Startvoraussetzung:** AP04 Closure `PASS`  
**Nachfolger:** AP06 erst nach AP05 Closure `PASS`

---

# Prompt 1 — PT05.1 Visuelle Baseline und Tokens

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP05 — Sales-Machine Design-System und Light-Theme-Grundlage
Primärtask: PT05.1 — Visuelle Baseline und Tokens
Modus: Design-Token-/Theme-Implementierung

WICHTIG:
Bearbeite ausschließlich PT05.1.

AP04-CLOSURE muss vollständig PASS sein.

Ziehe PT05.2–PT05.5 NICHT vor.
Starte AP06 NICHT.

==================================================
1. KONTEXT
==================================================

Lies zuerst:

building-docs/CONTEXT-INDEX.md

Dann mindestens:

- building-docs/AGENT-CONTRACT.md
- building-docs/PROJECT-CONSTRAINTS.md
- relevante Abschnitte aus building-docs/scope/MASTER-SCOPE.md
- building-docs/work-packages/AP05.md
- building-docs/state/AP-STATE.md
- AP04 Closure / Content Matrix
- kanonische Design-/Quality-Contracts
- aktuelle Repository-Evidenz

Gezielt prüfen:

- tailwind.config.js
- scripts/check-color-tokens.mjs
- src/index.css
- lefthook.yml
- .github/workflows/ci.yml
- docs/design-system.md bzw. kanonisches Design-Dokument
- src/components/ui/**
- src/components/sections/**
- aktive Raw-Hex/arbitrary-color-Nutzung

Kein Read-all.

==================================================
2. START-GATE
==================================================

Verifiziere:

- AP00 COMPLETE / PASS
- AP01 COMPLETE / PASS
- AP02 COMPLETE / Closure PASS
- AP03 COMPLETE / Closure PASS
- AP04 COMPLETE / Closure PASS
- AP05 NOT STARTED
- Next work package = AP05
- 18/18 Decision Locks
- Branch/HEAD/working tree sicher
- keine Merge/Rebase/Cherry-Pick/Revert-Situation

Wenn AP04 Closure nicht PASS:

TASK RESULT PT05.1
BLOCKED_PREDECESSOR

==================================================
3. ART-DIRECTION-GRENZE
==================================================

Verbindlich:

- Sales-Machine ist die einzige Relaunch-Art-Direction.
- Light Theme ist der einzige Relaunch-Theme-Modus.
- `redesign/preview` darf nur art-direction-neutrale QA/System-Patterns liefern.
- keine Archon-/Dark-/alternative Palette übernehmen.
- kein Theme Switcher.
- keine zweite Dark-Tokenfamilie.

Dunkle Navy-Flächen innerhalb des Light Themes sind zulässig.
Das ist kein Dark Theme.

==================================================
4. TOKENINVENTAR
==================================================

Erfasse aktuelle:

- brand colors
- accent colors
- semantic colors
- Befund colors
- neutral colors
- raw hex
- arbitrary color classes
- CSS custom properties
- aliases
- duplicate tokens
- deprecated values
- SVG fill/stroke colors

Klassifiziere:

- CANONICAL
- SEMANTIC
- LEGACY_ALIAS
- DUPLICATE
- DEPRECATED
- FORBIDDEN_RAW

Aktuelle Repository-Evidenz gewinnt.

==================================================
5. SALES-MACHINE TOKENBASIS
==================================================

Konsolidiere die bestehende Navy/Blue/Teal-Sprache.

Bekannte Startsignale neu verifizieren:

brand.navy / heading ≈ #083358
brand.navy-hover ≈ #0a3f63
brand.blue ≈ #0d527f
brand.blue-bright ≈ #2f6fa0

accent.DEFAULT ≈ #0d9488
accent.strong ≈ #0f766e
accent.line ≈ #14b8a6
accent.soft ≈ #f0fdfa
accent.border ≈ #99f6e4
accent.on-dark ≈ #2dd4bf

Nicht blind kopieren, falls aktueller Repo-State abweicht.

Keine neue Farbwelt.

==================================================
6. LIGHT THEME
==================================================

Technisch sicherstellen:

- Light ist Default.
- keine alternative Theme-Steuerung.
- keine neue `dark:`-Produktoberfläche.
- keine parallelen Dark Tokens.
- keine Dark-Mode-CSS-Variablen als Relaunch-Feature.

Falls historische Dark-/Archon-Reste existieren:

- klassifizieren
- nur entfernen/konsolidieren, wenn sicher scope-konform
- keine unrelated cleanup

==================================================
7. LEGACY-ALIASE
==================================================

Prüfe bekannte mögliche Aliase:

- brand.primary
- brand.deep
- brand.secondary
- accentBlue
- Legacy Gray Tokens

Entscheide datenbasiert:

- behalten als Übergangsalias
- deprecaten
- sichere Call-Sites konsolidieren

Keine riesige kosmetische Rename-Aktion.

==================================================
8. STATUS-/BEFUNDFARBEN
==================================================

Prüfe:

- success
- warning
- error
- info
- Befund red
- Befund amber
- Befund green

Regeln:

- semantisch getrennt vom Brand Accent
- Text/Icons ausreichend kontrastiert
- Bedeutung nicht nur Farbe
- Web-/Befund-Semantik nicht verfälschen

==================================================
9. NEUTRALFARBEN / INTERACTION CONTRAST
==================================================

Prüfe besonders:

- ui.field
- borders
- focus rings
- helper text
- placeholder
- disabled states
- muted text

Keine offensichtliche Kontrastregression konservieren.

AP24 bleibt umfassender Accessibility-Owner.

==================================================
10. SPACING / RADIUS / SHADOW
==================================================

Konsolidiere vorhandene Skalen.

Mindestens:

- spacing rhythm
- section spacing
- card spacing
- radius scale
- rounded-section
- card shadow
- dialog/overlay shadow
- glass/glow nur Sales-Machine-konform

Keine alternative Art Direction.

==================================================
11. MOTION TOKENS
==================================================

Definiere/konsolidiere:

- durations
- easing
- reveal duration
- menu transition
- modal/drawer transition
- hover/focus transition

Noch keine vollständige Motion-Implementierung aus PT05.5 vorziehen.

PT05.1 schafft nur die Token-Grundlage.

==================================================
12. COLOR/TOKEN GUARD
==================================================

Der bestehende Guard ist die Grundlage:

scripts/check-color-tokens.mjs

Prüfe:

- funktioniert weiterhin pre-commit
- PALETTE_HEX / bestehende Guard-Quelle konsistent
- neue kanonische Tokenwerte sind im Guard bekannt
- Raw-Hex-Regel bleibt wirksam
- keine zweite Color-Lint-Implementation

==================================================
13. CI-GATE
==================================================

Füge den bestehenden Color/Token Guard explizit in CI ein,
wenn dies noch nicht der Fall ist.

Nicht:

neuen parallelen Guard schreiben.

CI muss den vorhandenen Guard ausführen.

Workflow-Syntax und Command verifizieren.

==================================================
14. DESIGN-SYSTEM-CONTRACT
==================================================

Prüfe kanonische Design-Dokumentation.

Wenn bestehend:
aktualisieren.

Nur wenn kein kanonisches Artefakt existiert:
minimalen Design-System-Contract gemäß AP05.md anlegen.

Dokumentiere mindestens:

- Sales-Machine only
- Light only
- Token semantics
- Legacy alias policy
- Motion token names
- Preview neutrality

Keine zweite Tokenwahrheit neben Code.

==================================================
15. VERIFIKATION
==================================================

Mindestens:

- npm run check:colors
- typecheck
- lint
- relevante unit tests
- production build
- scan raw hex / arbitrary colors
- CI workflow validation
- gezielte contrast checks
- git diff

==================================================
16. STATE
==================================================

Bei PASS:

- AP05 IN_PROGRESS
- Last completed PT = PT05.1
- Next PT = PT05.2
- Visual baseline/tokens = recorded
- Light theme = locked
- Token guard = active
- AP06 NOT STARTED

==================================================
17. PASS-KRITERIEN
==================================================

PASS nur wenn:

- AP04 Closure PASS
- Sales-Machine eindeutig
- Light Theme eindeutig
- keine Dark-/Archon-Art-Direction
- Tokenbasis konsolidiert
- Legacy aliases klassifiziert
- Status/Befundfarben geprüft
- Neutralfarben geprüft
- Spacing/Radius/Shadow konsolidiert
- Motion Tokens vorhanden
- bestehender Color Guard erhalten
- Guard pre-commit weiterhin wirksam
- Guard explizit in CI
- keine parallele Token-Wahrheit
- tests/build grün
- State auf PT05.2

==================================================
18. REPORT
==================================================

Antworte exakt:

TASK RESULT PT05.1
PASS | BLOCKED

Repository:
Branch:
HEAD:
Working tree:

AP04 closure:
Sales-Machine art direction:
Light theme:
Dark/alternative theme:
Token inventory:
Canonical color source:
Legacy aliases:
Status/befund colors:
Neutral colors:
Spacing scale:
Radius scale:
Shadow scale:
Motion tokens:
Color guard pre-commit:
Color guard CI:
Raw color violations:
Design-system contract:

Typecheck:
Lint:
Tests:
Build:

Decision locks:
State:
Open blockers:
Next task: PT05.2

Wenn PASS:
NICHT PT05.2 starten.
NICHT AP06 starten.
```

---

# Prompt 2 — PT05.2 Typografie

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP05 — Sales-Machine Design-System und Light-Theme-Grundlage
Primärtask: PT05.2 — Typografie
Modus: Design-System-/Typography-Implementierung

Bearbeite ausschließlich PT05.2.

PT05.1 muss PASS sein.
PT05.3+ und AP06 nicht vorziehen.

==================================================
1. KONTEXT
==================================================

Lies CONTEXT-INDEX.md und danach:

- AGENT-CONTRACT
- PROJECT-CONSTRAINTS
- MASTER-SCOPE AP05
- AP05.md
- AP-STATE
- Design-System-Contract
- PT05.1 Tokenstatus

Gezielt:

- src/index.css
- tailwind.config.js
- Font assets
- entry-client / SSR font preload soweit relevant
- server.ts nur read-first; nur ändern wenn PT05.2 wirklich font-pipelinebedingt und scope-konform
- typography utility usage
- longform styles

==================================================
2. START-GATE
==================================================

Verifiziere:

- PT05.1 PASS
- AP05 IN_PROGRESS
- Last completed = PT05.1
- Next = PT05.2
- Light theme locked
- 18/18 Decisions preserved

Bei Fehler:
BLOCKED_PREDECESSOR

==================================================
3. SELF-HOSTED INTER
==================================================

Behalte die selbstgehostete Inter-Pipeline.

Zielkette:

Inter Variable
→ Inter
→ Inter Fallback
→ system-ui
→ sans-serif

Aktuellen Repo-State verifizieren.

Verboten:

- Google Fonts
- fonts.googleapis.com
- fonts.gstatic.com
- externe Font-CDNs
- Remote Font Runtime Dependency

==================================================
4. H1–H6
==================================================

Definiere/konsolidiere:

- font size
- line height
- weight
- tracking
- responsive behavior

Hierarchie semantisch, nicht nur optisch.

H1:
Sales-Machine-stark, aber Mobile robust.

==================================================
5. BODY / LEAD / CAPTION / LABEL
==================================================

Mindestens klare Rollen:

- body
- lead
- small
- caption
- label
- eyebrow, wenn bestehend
- helper
- error text

Keine unnötige Typografie-Explosion.

==================================================
6. LINKS
==================================================

Standardisiere:

- inline link
- nav link
- CTA-style link
- external link semantics
- hover
- focus-visible

Link-Erkennbarkeit nicht ausschließlich Farbe.

==================================================
7. LONGFORM
==================================================

Definiere:

- readable max width
- paragraph rhythm
- heading spacing
- lists
- tables
- captions
- evidence/disclaimer text

Sales-Machine-konform.

==================================================
8. RESPONSIVE TYPOGRAPHY
==================================================

Prüfe:

- mobile
- tablet
- desktop
- lange deutsche Strings
- Niederländisch
- Tschechisch
- CTA labels
- H1 wrapping
- no horizontal overflow

Keine font-size-hacks pro Sprache, außer wirklich begründet.

==================================================
9. FALLBACK METRICS
==================================================

Prüfe:

- font-display
- Fallback stack
- Layout shift
- preload
- SSR/client consistency

Keine unnötige SSR-Architekturänderung.

==================================================
10. VERIFIKATION
==================================================

Mindestens:

- Typecheck
- Lint
- Tests
- Build
- SSR smoke
- Network/source scan for external font URLs
- Desktop/mobile visual smoke
- long-string x10 sanity
- git diff

==================================================
11. STATE
==================================================

Bei PASS:

- Last completed PT = PT05.2
- Next PT = PT05.3
- Typography = standardized
- Font pipeline = self-hosted
- AP05 IN_PROGRESS
- AP06 NOT STARTED

==================================================
12. PASS-KRITERIEN
==================================================

PASS nur wenn:

- PT05.1 PASS
- Inter self-hosted
- no external font CDN
- H1–H6 defined
- Body/Lead/Caption/Label defined
- links defined
- longform width/rhythm
- responsive type
- fallback metrics
- SSR/client font consistency
- no x10 string overflow blocker
- Build/tests green
- State PT05.3

==================================================
13. REPORT
==================================================

TASK RESULT PT05.2
PASS | BLOCKED

Repository:
Branch:
HEAD:
Working tree:

Predecessor PT05.1:
Font pipeline:
External font dependencies:
H1-H6:
Body/lead/caption/label:
Links:
Longform:
Responsive typography:
Fallback metrics:
SSR/client font consistency:
10-language long-string check:

Typecheck:
Lint:
Tests:
Build:
SSR smoke:

Decision locks:
State:
Open blockers:
Next task: PT05.3

NICHT PT05.3 starten.
NICHT AP06 starten.
```

---

# Prompt 3 — PT05.3 Core UI-Komponenten

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP05 — Sales-Machine Design-System und Light-Theme-Grundlage
Primärtask: PT05.3 — Core UI-Komponenten
Modus: Core-Component-Implementierung + Tests

Bearbeite ausschließlich PT05.3.

PT05.1 und PT05.2 müssen PASS sein.
PT05.4/PT05.5/AP06 nicht vorziehen.

==================================================
1. KONTEXT
==================================================

Lies CONTEXT-INDEX.md.

Dann:

- AGENT-CONTRACT
- PROJECT-CONSTRAINTS
- MASTER-SCOPE AP05
- AP05.md
- AP-STATE
- Design-System-Contract
- aktuelle src/components/ui/**
- vorhandene Component Tests
- neutrale Pattern-Evidenz aus redesign/preview nur soweit technisch relevant

==================================================
2. START-GATE
==================================================

Verifiziere:

- PT05.1 PASS
- PT05.2 PASS
- AP05 IN_PROGRESS
- Last completed = PT05.2
- Next = PT05.3
- 18/18 Decisions

==================================================
3. BUTTON / LINK
==================================================

Konsolidiere vorhandenes Pattern.

Bestehendes CVA-Pattern bevorzugen, wenn aktuell vorhanden.

Mindestens:

- primary
- secondary
- outline
- ghost/text soweit erforderlich
- sizes
- disabled
- loading
- icon-only
- external link behavior
- focus-visible
- accessible name
- touch target ≥44 px, wo anwendbar

Keine Seitenbusinesslogik.

==================================================
4. INPUT / TEXTAREA / CHOICE
==================================================

Konsolidiere:

- input
- textarea
- checkbox
- radio
- select, falls bestehender Core Scope

States:

- default
- hover
- focus
- error
- disabled
- readonly falls relevant
- required

Tokenfarben aus PT05.1 verwenden.

==================================================
5. FORMFIELD
==================================================

Standardisiere:

- label
- control
- description/help
- required indicator
- error
- id linking
- aria-describedby
- aria-invalid

Keine konkreten Contact-/Support-/Order-Formulare umbauen, außer minimale API-Anpassung an Core Pattern zwingend nötig.

==================================================
6. ALERT / STATUS
==================================================

Mindestens:

- info
- success
- warning
- error

Semantik nicht nur über Farbe.

Befund-/Statusfarben nicht vermischen.

==================================================
7. CARD
==================================================

Konsolidiere:

- generic card
- interactive card
- non-interactive card
- padding
- radius
- border/shadow
- hover only for interactive
- focus for clickable card
- semantic link behavior

Keine fachlichen Card-Typen zwanghaft vereinheitlichen.

==================================================
8. MODAL / DRAWER / DIALOG
==================================================

Standardisieren:

- dialog semantics
- role/aria
- focus entry
- focus containment, soweit bestehende Architektur
- Escape
- close button
- backdrop
- scroll lock
- focus restoration
- mobile drawer
- reduced-motion readiness
- cleanup nach close

Neutrale preview-Patterns dürfen adaptiert werden.

Keine Preview-Art-Direction übernehmen.

==================================================
9. LOADING / EMPTY / ERROR
==================================================

Core Patterns:

- loading
- optional skeleton
- empty
- recoverable error
- non-recoverable error
- retry affordance

Keine Route-/Businessfehlerlogik aus späteren APs.

==================================================
10. TOUCH / FOCUS
==================================================

Mindestens:

- sichtbarer focus-visible state
- ≥44×44 CSS px bei anwendbaren controls
- icon button names
- disabled nicht focusable, wo semantisch richtig
- no focus loss after modal close

==================================================
11. COMPONENT TESTS
==================================================

Mindestens Tests für:

- Button
- Link behavior soweit Core Component
- FormField
- Input/Choice
- Alert
- Card
- Dialog/Drawer
- Loading/Empty/Error

Tests sollen Verhalten prüfen, nicht Tailwind-Klassen als Hauptvertrag.

==================================================
12. CALL-SITE-ÄNDERUNGEN
==================================================

Nur zulässig, wenn zwingend für kompatible Component-API-Migration.

Keine breite Seitenmigration.

Keine AP06 Header-/Footer-Arbeit.
Keine AP20 Formular-Neugestaltung.

==================================================
13. VERIFIKATION
==================================================

- Typecheck
- Lint
- Unit/component tests
- Build
- targeted interaction tests
- focus/Escape/scroll-lock tests
- check:colors
- git diff

==================================================
14. STATE
==================================================

Bei PASS:

- Last completed = PT05.3
- Next = PT05.4
- Core UI components = standardized
- Component tests = recorded
- AP05 IN_PROGRESS
- AP06 NOT STARTED

==================================================
15. PASS-KRITERIEN
==================================================

PASS nur wenn:

- PT05.1/2 PASS
- Button/Link complete
- Input/Textarea/Choice complete
- FormField complete
- Alert/Status complete
- Card complete
- Modal/Drawer/Dialog complete
- Loading/Empty/Error complete
- Focus baseline
- Touch target baseline
- component tests green
- no broad page migration
- no AP06+
- build green

==================================================
16. REPORT
==================================================

TASK RESULT PT05.3
PASS | BLOCKED

Repository:
Branch:
HEAD:
Working tree:

Predecessor PT05.1:
Predecessor PT05.2:
Button/link:
Input/textarea/choice:
FormField:
Alert/status:
Card:
Modal/drawer/dialog:
Loading/empty/error:
Focus states:
Touch targets:
Component tests:
Call-site migrations:

Typecheck:
Lint:
Tests:
Build:
Color guard:

Decision locks:
State:
Open blockers:
Next task: PT05.4

NICHT PT05.4 starten.
NICHT AP06 starten.
```

---

# Prompt 4 — PT05.4 Layout-/Sales-Machine-Patterns

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP05 — Sales-Machine Design-System und Light-Theme-Grundlage
Primärtask: PT05.4 — Layout-/Sales-Machine-Patterns
Modus: Layout-/Section-Pattern-Konsolidierung

Bearbeite ausschließlich PT05.4.

PT05.1–PT05.3 müssen PASS sein.
PT05.5/AP06 nicht vorziehen.

==================================================
1. KONTEXT
==================================================

Lies CONTEXT-INDEX.md.

Dann:

- AGENT-CONTRACT
- PROJECT-CONSTRAINTS
- MASTER-SCOPE AP05
- AP05.md
- AP-STATE
- Design-System-Contract
- AP03 IA patterns
- AP04 content types
- aktuelle src/components/sections/**
- aktuelle layout/container patterns
- ChapterNav current implementation read-first

==================================================
2. START-GATE
==================================================

Verifiziere:

- PT05.1 PASS
- PT05.2 PASS
- PT05.3 PASS
- AP05 IN_PROGRESS
- Last completed = PT05.3
- Next = PT05.4
- 18/18 Decisions

==================================================
3. CONTAINER / SECTION / GRID
==================================================

Konsolidiere:

- page max width
- content max width
- gutters
- vertical section spacing
- responsive grid conventions
- contained vs full-bleed

Bestehende Sales-Machine-Sprache erhalten.

==================================================
4. HERO / SPLIT
==================================================

Katalogisiere/konsolidiere:

- primary Sales-Machine Hero
- text + image
- split layout
- CTA/proof placement
- mobile stacking
- spacing behavior

Keine neue Homepage bauen.

Keine alternative Hero-Art-Direction.

==================================================
5. CARD GRID
==================================================

Definiere/konsolidiere:

- columns by breakpoint
- gap
- Card primitive usage
- clickable semantics
- equal-height nur wenn sinnvoll
- mobile behavior

==================================================
6. CONTENT + SIDEBAR
==================================================

Pattern für:

- longform
- evidence
- resources
- chapter nav
- supporting CTA

Keine konkrete Epigenetics-/Musterbefund-Seite migrieren, außer minimale Pattern-Demo/Testfixture nötig.

==================================================
7. STICKY / CHAPTER
==================================================

Konsolidiere Layout-Vertrag mit aktuellem ChapterNav.

Beachten:

- bestehende offset/custom-property contracts
- hash/scroll compatibility
- mobile
- sticky header interactions
- reduced motion readiness

AP24 bleibt A11y-Owner.

==================================================
8. LONGFORM
==================================================

Konsolidiere:

- readable width
- section rhythm
- headings
- lists
- tables
- media
- callouts
- disclaimers
- evidence

Typografie aus PT05.2 verwenden.

==================================================
9. FINAL CTA
==================================================

Katalogisiere ein Sales-Machine-konformes Final-CTA-Pattern.

Verbindlich:

- GENERAL_SALES = „Angebot anfragen“, wenn allgemeine Anfrage
- keine „garantierte Performance“
- kein Garantie-Band
- kein Chat
- optional fachlich passende Secondary CTA

==================================================
10. SALES-MACHINE SECTION CATALOG
==================================================

Identifiziere bestehende bevorzugte Sektionen.

Dokumentiere:

- Pattern name
- purpose
- content type
- component/source
- suitable page types
- responsive behavior
- accessibility notes
- do/don't

Ziel:
AP11–AP21 verwenden bevorzugt diese Patterns.

==================================================
11. DUPLICATE CARD RECIPES
==================================================

Finde visuell/semantisch doppelte Card Recipes.

Konsolidiere nur wenn:

- gleiche Rolle
- gleiche Interaktion
- keine Fachsemantik verloren
- Art Direction unverändert

Keine zwanghafte Universal Card.

==================================================
12. VERIFIKATION
==================================================

Mindestens:

- Typecheck
- Lint
- Tests
- Build
- desktop/mobile visual smoke
- check:colors
- no guarantee-band pattern
- no alternative art direction
- git diff

==================================================
13. STATE
==================================================

Bei PASS:

- Last completed = PT05.4
- Next = PT05.5
- Sales-Machine layout patterns = standardized
- AP05 IN_PROGRESS
- AP06 NOT STARTED

==================================================
14. PASS-KRITERIEN
==================================================

PASS nur wenn:

- Container/Section/Grid
- Hero/Split
- Card Grid
- Content+Sidebar
- Sticky/Chapter
- Longform
- Final CTA
- no Guarantee Band
- Sales-Machine Section Catalog
- duplicate cards reasonably consolidated
- responsive smoke
- no page migration wave
- no alternative art direction
- build/tests green
- State PT05.5

==================================================
15. REPORT
==================================================

TASK RESULT PT05.4
PASS | BLOCKED

Repository:
Branch:
HEAD:
Working tree:

Predecessor PT05.1:
Predecessor PT05.2:
Predecessor PT05.3:

Container/section/grid:
Hero/split:
Card grid:
Content/sidebar:
Sticky/chapter:
Longform:
Final CTA:
Guarantee band:
Sales-Machine section catalog:
Duplicate card consolidation:
Responsive smoke:

Application/page migrations:
Alternative art direction:
Typecheck:
Lint:
Tests:
Build:
Color guard:

Decision locks:
State:
Open blockers:
Next task: PT05.5

NICHT PT05.5 starten.
NICHT AP06 starten.
```

---

# Prompt 5 — PT05.5 Motion, Visual Regression und Error States

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP05 — Sales-Machine Design-System und Light-Theme-Grundlage
Primärtask: PT05.5 — Motion, Visual Regression und Error States
Modus: Interaction-/Regression-/Error-Pattern-Implementierung

Bearbeite ausschließlich PT05.5.

PT05.1–PT05.4 müssen PASS sein.

Dies ist der letzte Primärtask von AP05.

Danach:
AP05-CLOSURE

Closure und AP06 NICHT selbstständig starten.

==================================================
1. KONTEXT
==================================================

Lies CONTEXT-INDEX.md.

Dann:

- AGENT-CONTRACT
- PROJECT-CONSTRAINTS
- MASTER-SCOPE AP05
- AP05.md
- AP-STATE
- Design-System-Contract
- PT05.1 Motion Tokens
- aktuelle Reveal/PageTransition/Menu/Dialog patterns
- e2e/playwright setup
- redesign/preview nur für neutrale Visual-/Error-Testpatterns
- Runtime Contract für 404 vs render error

==================================================
2. START-GATE
==================================================

Verifiziere:

- PT05.1–PT05.4 PASS
- AP05 IN_PROGRESS
- Last completed = PT05.4
- Next = PT05.5
- 18/18 Decisions

==================================================
3. REDUCED MOTION
==================================================

Prüfe/implementiere für:

- Reveal
- PageTransition
- Menu
- Modal
- Drawer
- Dialog
- Chapter/sticky animation soweit relevant

`prefers-reduced-motion` muss respektiert werden.

Reduced Motion darf Funktion nicht entfernen.

==================================================
4. TRANSITIONS
==================================================

Konsolidiere Motion Tokens aus PT05.1 für:

- reveal
- menu
- modal/drawer
- hover/focus

Regeln:

- kurz
- vorhersehbar
- nicht blockierend
- keine künstliche Delay-Orchestrierung
- keine notwendige Information nur durch Animation

==================================================
5. NO INTERACTION BLOCKADE
==================================================

Testen:

- overlay cleanup
- pointer-events cleanup
- scroll lock cleanup
- focus restore
- Escape behavior
- close button
- navigation after animation
- no hidden layer intercepts clicks

==================================================
6. VISUAL REGRESSION
==================================================

Adaptiere neutrale Patterns aus redesign/preview.

Keine Art Direction übernehmen.

Erzeuge deterministische Visual-Regression-Surfaces.

Mindestens repräsentativ:

- Sales-Machine hero/layout
- token/color surface
- typography
- buttons/form controls
- cards/status
- dialog/drawer
- loading/empty/error
- longform/chapter
- representative final CTA

Keine öffentliche Test-only Produktionsroute erfinden, wenn vermeidbar.

==================================================
7. BASELINE SCREENSHOTS
==================================================

Definiere feste:

- viewports
- device scales soweit nötig
- font readiness
- reduced motion
- deterministic data
- animation state
- screenshot names

Keine zeitabhängigen/live externen Daten.

Keine PII/Secrets.

==================================================
8. ERROR BOUNDARY PATTERN
==================================================

Übernehme nur technisches/neutrales Pattern.

Ziel:

- render error ≠ 404
- standard Design-System error surface
- recoverable retry/reload, wo sinnvoll
- keine Stacktraces
- kein falscher NotFound
- SSR/client konsistent soweit im Scope

Routingstatus selbst nicht neu entwerfen.

==================================================
9. CHANGELOG GATE
==================================================

Für relevante Design-System-Contract-Änderungen:

- nachvollziehbare Change Note
- Token/API breaking changes nicht still
- CI-/Script-Gate entsprechend bestehender Repository-Konvention

Nicht AP27 vollständig vorziehen.

Falls bereits ein Changelog-/Guard-Pattern existiert:
dieses nutzen.

==================================================
10. PREVIEW NEUTRALITY
==================================================

Explizit prüfen:

Aus redesign/preview übernommen wurden ausschließlich:

- test patterns
- visual regression mechanics
- error boundary mechanics
- neutral interaction patterns

Nicht übernommen:

- Farben
- Branding
- Dark Theme
- alternative typography
- alternative hero/card art direction

==================================================
11. VERIFIKATION
==================================================

Mindestens:

- Typecheck
- Lint
- Unit/component tests
- Playwright/visual tests
- Build
- SSR smoke
- reduced-motion test
- dialog interaction test
- no interaction blockade test
- error boundary test
- check:colors
- git diff

==================================================
12. STATE
==================================================

Bei PASS:

- Last completed PT = PT05.5
- Next task = AP05-CLOSURE
- Motion/reduced motion = standardized
- Visual regression = recorded
- Error-state pattern = recorded
- AP05 IN_PROGRESS
- AP06 NOT STARTED

AP05 NICHT COMPLETE setzen.

==================================================
13. PASS-KRITERIEN
==================================================

PASS nur wenn:

- PT05.1–4 PASS
- Reduced Motion
- transitions standardized
- no interaction blockade
- deterministic visual regression
- baseline screenshots
- error boundary pattern
- render error not 404
- changelog gate
- preview neutrality
- tests/build green
- State Closure
- AP06 not started

==================================================
14. REPORT
==================================================

TASK RESULT PT05.5
PASS | BLOCKED

Repository:
Branch:
HEAD:
Working tree:

Predecessor PT05.1:
Predecessor PT05.2:
Predecessor PT05.3:
Predecessor PT05.4:

Reduced motion:
Reveal transitions:
Menu transitions:
Modal/drawer transitions:
Interaction blockade:
Visual regression:
Baseline screenshots:
Error boundary pattern:
404 separation:
Changelog gate:
Preview neutrality:

Typecheck:
Lint:
Unit/component tests:
Visual tests:
Build:
SSR smoke:
Color guard:

Decision locks:
State:
Open blockers:
Next task: AP05-CLOSURE

NICHT AP05-CLOSURE starten.
NICHT AP06 starten.
```

---

# Prompt 6 — AP05-CLOSURE

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP05 — Sales-Machine Design-System und Light-Theme-Grundlage
Task: AP05-CLOSURE
Modus: Closure / Verifikation / keine neue größere Fachimplementierung

AP05 umfasst:

- PT05.1 Visuelle Baseline und Tokens
- PT05.2 Typografie
- PT05.3 Core UI-Komponenten
- PT05.4 Layout-/Sales-Machine-Patterns
- PT05.5 Motion, Visual Regression und Error States

Alle fünf müssen PASS sein.

Fehlende größere Facharbeit NICHT im Closure nachholen.

AP06 NICHT starten.

==================================================
1. KONTEXT
==================================================

Lies CONTEXT-INDEX.md.

Danach:

- AGENT-CONTRACT
- PROJECT-CONSTRAINTS
- MASTER-SCOPE AP05 + DoD
- AP05.md
- AP-STATE
- AP04 Closure
- Design-System-Contract
- aktuelle Token-/UI-/Test-/CI-Evidenz
- Quality Gates
- Runtime Contract für Error vs 404

==================================================
2. START-GATE
==================================================

Verifiziere:

- AP00 COMPLETE / PASS
- AP01 COMPLETE / PASS
- AP02 COMPLETE / Closure PASS
- AP03 COMPLETE / Closure PASS
- AP04 COMPLETE / Closure PASS
- AP05 IN_PROGRESS
- PT05.1 PASS
- PT05.2 PASS
- PT05.3 PASS
- PT05.4 PASS
- PT05.5 PASS
- Last completed = PT05.5
- Next = AP05-CLOSURE
- AP06 NOT STARTED
- 18/18 Decisions
- Git state safe

==================================================
3. C05-01 PREDECESSOR
==================================================

AP04 COMPLETE / Closure PASS.

==================================================
4. C05-02 DECISION INTEGRITY
==================================================

18/18 preserved.

Besonders:

- Sales-Machine art direction
- Light Theme
- no Dark Theme
- no Chat
- no Guarantee Band
- CTA lock
- x10 untouched
- Backlog areas untouched

==================================================
5. C05-03 SALES-MACHINE ART DIRECTION
==================================================

Prüfe:

- Code/Docs eindeutig Sales-Machine
- keine zweite visuelle Richtung
- keine Preview-/Archon-Art-Direction als Relaunch-Standard

==================================================
6. C05-04 LIGHT ONLY
==================================================

Prüfe:

- kein Theme Switcher
- keine zweite Dark-Produktoberfläche
- keine parallele Dark Token Palette
- dunkle Einzelkomponenten korrekt als Light-Theme-Bestandteil

==================================================
7. C05-05 NO ARCHON/DARK TOKENS
==================================================

Keine alternative Branding-/Dark-Palette in aktiver Relaunch-Tokenschicht.

==================================================
8. C05-06 TOKEN CANONICALITY
==================================================

Genau eine kanonische Tokenquelle.

Keine konkurrierenden Hex-/CSS-/Tailwind-Wahrheiten.

==================================================
9. C05-07 COLOR GUARD
==================================================

Verifiziere:

- scripts/check-color-tokens.mjs aktiv
- pre-commit aktiv
- CI aktiv
- Commands tatsächlich grün

==================================================
10. C05-08 CONTRAST BASELINE
==================================================

Status/Befund/Neutral/interactive colors plausibel geprüft.

Keine offensichtliche Regression.

==================================================
11. C05-09 SPACING/RADIUS/SHADOW
==================================================

Konsolidierte Skalen vorhanden.

==================================================
12. C05-10 MOTION TOKENS
==================================================

Kanonische Duration/Easing/Transition Tokens vorhanden.

==================================================
13. C05-11 SELF-HOSTED INTER
==================================================

Kein:

- Google Fonts
- remote font CDN
- fonts.googleapis.com
- fonts.gstatic.com

Inter lokal.

==================================================
14. C05-12 TYPOGRAPHY HIERARCHY
==================================================

H1–H6 + Textrollen eindeutig.

==================================================
15. C05-13 RESPONSIVE TYPE
==================================================

Mobile + lange 10-language Strings robust.

==================================================
16. C05-14 BUTTON/LINK
==================================================

Pattern + Tests.

==================================================
17. C05-15 FORM CONTROLS
==================================================

Inputs/Textarea/Choice/FormField + Tests.

==================================================
18. C05-16 ALERT/STATUS/CARD
==================================================

Semantische Core Patterns + Tests.

==================================================
19. C05-17 DIALOG/DRAWER
==================================================

Prüfe:

- semantics
- focus
- Escape
- close
- scroll lock
- restore
- reduced motion
- tests

==================================================
20. C05-18 LOADING/EMPTY/ERROR
==================================================

Konsistente State Patterns.

==================================================
21. C05-19 TOUCH/FOCUS
==================================================

Anwendbare Controls ≥44px und sichtbarer Focus.

==================================================
22. C05-20 LAYOUT PATTERNS
==================================================

Vorhanden:

- Container/Section/Grid
- Hero/Split
- Card Grid
- Content+Sidebar
- Sticky/Chapter
- Longform

==================================================
23. C05-21 FINAL CTA
==================================================

Kein Guarantee Band.

General sales:
„Angebot anfragen“.

==================================================
24. C05-22 SALES-MACHINE SECTION CATALOG
==================================================

Wiederverwendbare bevorzugte Sektionen dokumentiert.

==================================================
25. C05-23 REDUCED MOTION
==================================================

`prefers-reduced-motion` funktioniert auf relevanten Patterns.

==================================================
26. C05-24 NON-BLOCKING MOTION
==================================================

Keine Overlays/Transitions blockieren Interaktion.

==================================================
27. C05-25 VISUAL REGRESSION
==================================================

Deterministische Baseline vorhanden.

Prüfe:

- stable viewports
- stable font loading
- reduced animation
- stable screenshot naming
- representative surfaces

==================================================
28. C05-26 ERROR BOUNDARY
==================================================

Standard Pattern vorhanden.

Render error ≠ 404.

Keine Stacktrace UI.

==================================================
29. C05-27 CHANGELOG GATE
==================================================

Relevante Design-System-Vertragsänderungen nachvollziehbar.

==================================================
30. C05-28 PREVIEW NEUTRALITY
==================================================

`redesign/preview` nur für neutrale QA/System Patterns verwendet.

Keine alternative Art Direction übernommen.

==================================================
31. C05-29 QUALITY
==================================================

Mindestens:

- check:colors
- typecheck
- lint
- tests
- component tests
- build
- SSR smoke
- visual tests
- reduced-motion/interaction tests

gemäß aktuellem Diff.

==================================================
32. C05-30 SCOPE INTEGRITY
==================================================

Nicht vorgezogen:

- AP06 Navigation
- AP07 Search
- AP08 i18n system work
- AP09 SEO
- AP10 Routing
- AP11–21 page migration
- AP22 Lead
- AP23 Tracking
- AP24 full accessibility audit
- AP25 full performance hardening

==================================================
33. C05-31 CANONICALITY
==================================================

Keine konkurrierenden:

- Token SSOTs
- Design-System Contracts
- Theme Systems
- Component Contract Sets

==================================================
34. C05-32 AP06 NOT STARTED
==================================================

AP06 muss NOT STARTED bleiben.

==================================================
35. DESIGN-SYSTEM-INVARIANTEN
==================================================

Prüfe mindestens semantisch:

DS-01 Sales-Machine SSOT
DS-02 Light Only
DS-03 No Dark Art Direction
DS-04 Tokenized Colors
DS-05 Token Guard
DS-06 Semantic Colors
DS-07 Contrast
DS-08 Self-hosted Fonts
DS-09 Typographic Hierarchy
DS-10 Responsive Type
DS-11 Core Components
DS-12 Focus
DS-13 Touch Target
DS-14 Dialog Semantics
DS-15 State Patterns
DS-16 Sales-Machine Layout
DS-17 No Guarantee Band
DS-18 Reduced Motion
DS-19 Non-blocking Motion
DS-20 Visual Regression
DS-21 Error Boundary Pattern
DS-22 Changelog
DS-23 Preview Neutrality
DS-24 No AP06+ Pull-forward

==================================================
36. CLOSURE-KORREKTUREN
==================================================

Erlaubt nur:

- AP-STATE
- Closure Report
- kleiner Cross-Reference
- Status-Tippfehler

Nicht:

- fehlende Component implementieren
- Theme neu konsolidieren
- Visual Baseline erstmals bauen
- Tokenprobleme großflächig nachholen

Wenn Fachsubstanz fehlt:
FAIL/BLOCKED.

==================================================
37. STATE BEI PASS
==================================================

Nur bei vollständigem PASS:

- AP00 COMPLETE / PASS
- AP01 COMPLETE / PASS
- AP02 COMPLETE / Closure PASS
- AP03 COMPLETE / Closure PASS
- AP04 COMPLETE / Closure PASS
- AP05 COMPLETE / Closure PASS
- Last completed PT = PT05.5
- AP05 Closure = PASS
- Sales-Machine design system = ready
- Light theme = locked
- Core UI patterns = tested
- Visual regression baseline = recorded
- Next work package = AP06
- AP06 = NOT STARTED

==================================================
38. PASS-KRITERIEN
==================================================

PASS nur wenn alle 32 C05 Gates PASS sind.

Master-Scope-DoD muss belegbar sein:

Sales-Machine + Light sind technisch und visuell eindeutig;
Core Patterns sind getestet;
Dark-Theme-/alternative Art-Direction-Arbeit ist ausgeschlossen.

==================================================
39. REPORT
==================================================

AP05 CLOSURE RESULT
PASS | FAIL | BLOCKED

Repository:
Branch:
HEAD:
Working tree:

AP00:
AP01:
AP02:
AP03:
AP04:

PT05.1:
PT05.2:
PT05.3:
PT05.4:
PT05.5:

Sales-Machine art direction:
Light-theme status:
Dark/alternative art direction:
Token canonicality:
Color guard pre-commit:
Color guard CI:
Contrast baseline:
Spacing/radius/shadow:
Motion tokens:

Font pipeline:
External font requests:
Typography hierarchy:
Responsive typography:
Longform typography:

Button/link:
Form controls:
FormField:
Alert/status:
Card:
Dialog/drawer:
Loading/empty/error:
Focus states:
Touch targets:
Component tests:

Container/section/grid:
Hero/split:
Card grid:
Content/sidebar:
Sticky/chapter:
Longform:
Final CTA:
Guarantee band:
Sales-Machine section catalog:
Duplicate card consolidation:

Reduced motion:
Non-blocking motion:
Visual regression:
Baseline screenshots:
Error boundary:
Changelog gate:
Preview neutrality:

Decision locks:
Canonicality:
Scope integrity:
Typecheck:
Lint:
Tests:
Build:
SSR smoke:
Visual tests:

AP05 Definition of Done:
State:

AP05 status:
Next work package:
AP06 status:

Open blockers:
Open later-owner items:

Final verdict:

Wenn PASS:

AP05 is COMPLETE.
AP05 Closure is PASS.
AP06 is NOT STARTED.
The repository is ready for AP06.

Danach beenden.

NICHT AP06 starten.
NICHT PT06.1 erzeugen.
```
