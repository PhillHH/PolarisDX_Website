# AP06 — Vollständige Prompt-Kette

**Projekt:** PolarisDX Website Relaunch  
**Work Package:** AP06 — App Shell, Header, Footer und globale Navigation  
**Ausführung:** streng seriell  
**Reihenfolge:** `PT06.1 → PT06.2 → PT06.3 → PT06.4 → PT06.5 → AP06-CLOSURE`  
**Startvoraussetzung:** AP05 Closure `PASS`  
**Nachfolger:** AP07 erst nach AP06 Closure `PASS`

---

# Prompt 1 — PT06.1 Header

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP06 — App Shell, Header, Footer und globale Navigation
Primärtask: PT06.1 — Header
Modus: produktive Shell-/Header-Implementierung

WICHTIG:
Bearbeite ausschließlich PT06.1.

AP05-CLOSURE muss vollständig PASS sein.

Ziehe PT06.2–PT06.5 NICHT vor.
Starte AP07 NICHT.

==================================================
1. KANONISCHEN KONTEXT LADEN
==================================================

Lies zuerst:

building-docs/CONTEXT-INDEX.md

Danach mindestens:

- building-docs/AGENT-CONTRACT.md
- building-docs/PROJECT-CONSTRAINTS.md
- relevante Abschnitte aus building-docs/scope/MASTER-SCOPE.md
- building-docs/work-packages/AP06.md
- building-docs/state/AP-STATE.md
- AP05 Closure / Design-System-Contract
- AP03 kanonisches IA-Artefakt
- AP04 Content Matrix / x10 Handoff
- Routing Contract / aktuelle Route-Evidenz
- Quality Gates

Gezielt read-first:

- src/components/layout/Header.tsx
- src/components/layout/Layout.tsx
- src/App.tsx, nur MainLayout/Shell-Komposition
- src/components/ui/LanguageSwitcher.tsx
- src/components/ui/SearchModal.tsx nur Integration
- public/locales/*/common.json
- aktuelle Header-/Navigationstests

NICHT lesen/ändern, außer zur reinen Abgrenzung:
- src/hooks/useSearch.ts

==================================================
2. START-GATE
==================================================

Verifiziere:

- AP00 COMPLETE / PASS
- AP01 COMPLETE / PASS
- AP02 COMPLETE / Closure PASS
- AP03 COMPLETE / Closure PASS
- AP04 COMPLETE / Closure PASS
- AP05 COMPLETE / Closure PASS
- AP06 NOT STARTED
- Next work package = AP06
- 18/18 Decision Locks
- Sales-Machine/Light aus AP05
- Branch/HEAD/working tree sicher
- keine Merge/Rebase/Cherry-Pick/Revert-Situation

Wenn AP05 Closure nicht PASS:

TASK RESULT PT06.1
BLOCKED_PREDECESSOR

==================================================
3. HEADER-ZIELBILD
==================================================

Implementiere einen stabilen, 10-sprachigen Sales-Machine-Light-Header.

Verbindlich:

- Logo/Home
- Main Navigation
- Diagnostics
- Epigenetics als eigener Main-Nav-Punkt
- IglooPro entsprechend AP03 IA
- Articles/Events/About/Support entsprechend IA
- Search Trigger
- Language Switcher
- General Sales CTA
- Mobile Navigation
- Active States
- Scroll/Shrink-Kompatibilität

Keine neue Art Direction.

==================================================
4. LOGO / HOME
==================================================

Logo muss:

- auf die locale-sichere Homepage führen
- aktuelle Locale respektieren
- korrekt gelabelt sein
- keine Default-EN-Falle erzeugen

Consumer-Shell nicht zwanghaft in die B2B-Shell ziehen.

==================================================
5. EPIGENETICS EIGENSTÄNDIG
==================================================

Closure-kritisch.

Target:

Header
→ Epigenetics

als eigener Hauptnavigationspunkt.

Nicht ausreichend:

Diagnostics
→ Epigenetics

als primärer/alleiniger Zugang.

Aktivzustand muss `/epigenetics*` korrekt abbilden.

Mobile ebenfalls eigenständig.

==================================================
6. DIAGNOSTICS
==================================================

Diagnostics bleibt eigener Parent.

PT06.1 bereitet nur den Header-Parent vor.

Die vollständige Mega-Menu-Fachstruktur gehört PT06.2.

Epigenetics nicht als primäre Diagnostics-Untergruppe belassen.

==================================================
7. GENERAL SALES CTA
==================================================

Verbindlich:

Rolle:
GENERAL_SALES

Deutsch:
„Angebot anfragen“

Für alle zehn Sprachen fachlich korrekt lokalisiert.

Ziel:
kanonischer allgemeiner Inquiry-/Contact-Pfad gemäß IA/Routing.

Nicht:

- Chat
- Garantie-Band
- Consumer Order
- Epigenetics Inquiry
- Support

mit GENERAL_SALES vermischen.

==================================================
8. SEARCH TRIGGER
==================================================

AP06 implementiert/pflegt ausschließlich:

- Search Trigger
- icon/label
- accessible name
- touch target
- Shell-Integration der vorhandenen SearchModal

AP06 darf NICHT:

- src/hooks/useSearch.ts ändern
- Search Index erweitern
- `/diagnostics/sports` reparieren
- Search Result Groups bauen
- SearchModal AP07-seitig umfassend umbauen

Das gehört AP07.

==================================================
9. LANGUAGE SWITCHER
==================================================

Verbindlich:

de,en,pl,fr,it,es,pt,da,nl,cs

Prüfen:

- current locale
- same logical page where supported
- keyboard
- accessible label
- mobile
- locale-safe paths
- kein Consumer EN-only fallback als Normalzustand

AP08 i18n-Core nicht vorziehen.

==================================================
10. MOBILE NAVIGATION
==================================================

Implementiere:

- Burger/Menu Trigger
- open/close
- accessible label
- focus-visible
- keyboard-baseline
- erreichbare Submenus
- Diagnostics
- Epigenetics
- Search
- Language Switcher
- General CTA
- AP05 Touch Target Baseline

Keine Hover-only-Funktion.

==================================================
11. ACTIVE STATES
==================================================

Prüfe/implementiere:

- exact active route
- aria-current="page"
- parent active
- locale prefix
- hash-neutral page identity
- `/epigenetics#musterbefunde` = gleiche Page wie `/epigenetics`
- Redirect Sources nicht als Target-Active-State

==================================================
12. SCROLL / SHRINK
==================================================

Bestehendes Sales-Machine-Verhalten verifizieren.

Prüfen:

- sticky header
- shrink behavior
- height
- layout shift
- chapter bar offset
- ScrollToHash compatibility
- reduced motion

Keine neue Scroll-Art-Direction.

==================================================
13. X10 LABELS
==================================================

Alle sichtbaren Headerlabels x10.

Keine hardcoded sichtbaren EN-/DE-Strings.

Wenn neue `common.json` Keys nötig:
in allen zehn Locales ergänzen.

Keine unregistrierte Namespace-Architektur.

==================================================
14. CHAT / GUARANTEE
==================================================

Schon in PT06.1 darf NICHT neu entstehen:

- Chat Trigger
- Chat CTA
- HiHuman Header Integration
- Guarantee/Performance Band
- Guarantee CTA

Vollständige produktive Chat-Entfernung folgt PT06.4.

==================================================
15. ROUTING-GRENZE
==================================================

Alle Headerlinks gegen aktuelle kanonische Routen prüfen.

Wenn technische Route Registry noch nicht implementiert:

- Routing Contract + reale Routes verwenden
- keine eigene Registry bauen
- AP10 Owner beibehalten

Keine `/services*` Target Links.

==================================================
16. TESTS
==================================================

Mindestens:

- Header render
- Logo href
- Main Nav
- Epigenetics main item
- Diagnostics parent
- General CTA
- Search trigger
- Language Switcher
- Mobile open/close
- Active state
- keyboard basics
- no Chat trigger
- no Guarantee Band
- build/SSR smoke

Wenn Styles verändert:
`npm run check:colors`.

==================================================
17. STATE
==================================================

Bei PASS:

- AP06 IN_PROGRESS
- Last completed PT = PT06.1
- Next PT = PT06.2
- Header = implemented
- Epigenetics main nav = implemented
- General CTA = normalized
- AP07 NOT STARTED

==================================================
18. PASS-KRITERIEN
==================================================

PASS nur wenn:

- AP05 Closure PASS
- Header IA-konform
- Logo locale-safe
- Epigenetics own main nav
- Diagnostics independent
- General CTA correct x10
- Search trigger integrated
- Language Switcher x10
- Mobile nav functional
- active states correct
- scroll/shrink compatible
- ChapterNav/hash not broken
- no Chat trigger
- no Guarantee Band
- `useSearch.ts` unchanged
- no route registry implementation
- tests/build green
- State PT06.2

==================================================
19. REPORT
==================================================

TASK RESULT PT06.1
PASS | BLOCKED

Repository:
Branch:
HEAD:
Working tree:

AP05 closure:
Header:
Logo:
Main navigation:
Epigenetics main nav:
Diagnostics parent:
General sales CTA:
Search trigger:
Search index ownership:
Language switcher:
Mobile navigation:
Active states:
Scroll/shrink:
ChapterNav/hash compatibility:
x10 labels:
Chat trigger:
Guarantee band:
Route target validation:

Application files modified:
Locale files modified:
useSearch.ts modified: NONE
Route registry implementation performed: NONE
Later AP implementation performed: NONE

Typecheck:
Lint:
Tests:
Build:
SSR smoke:
Color guard:

Decision locks:
State:
Open blockers:
Next task: PT06.2

NICHT PT06.2 starten.
NICHT AP07 starten.
```

---

# Prompt 2 — PT06.2 Diagnostik-Mega-Menü

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP06 — App Shell, Header, Footer und globale Navigation
Primärtask: PT06.2 — Diagnostik-Mega-Menü
Modus: Navigation-/Mega-Menu-Implementierung

Bearbeite ausschließlich PT06.2.

PT06.1 muss PASS sein.
PT06.3+ und AP07 nicht vorziehen.

==================================================
1. KONTEXT
==================================================

Lies CONTEXT-INDEX.md und danach mindestens:

- AGENT-CONTRACT
- PROJECT-CONSTRAINTS
- MASTER-SCOPE AP06
- AP06.md
- AP-STATE
- AP03 IA/Findability
- AP05 Design-System
- Routing Contract
- aktuelle Diagnostics Services
- Header.tsx
- relevante Menu Tests

==================================================
2. START-GATE
==================================================

Verifiziere:

- PT06.1 PASS
- AP06 IN_PROGRESS
- Last completed = PT06.1
- Next = PT06.2
- Epigenetics already own main nav
- 18/18 Decisions

Bei Fehler:
BLOCKED_PREDECESSOR

==================================================
3. AUFTRAG
==================================================

Implementiere das Diagnostics Mega Menu.

Ziele:

- alle vorgesehenen Diagnostics-Ziele klar erreichbar
- fachlich sinnvolle Gruppen
- klare visuelle Hierarchie
- keyboard/focus
- mobile adaptation
- route-valid
- Epigenetics nicht primäre Untergruppe

==================================================
4. SERVICE-GRUPPEN
==================================================

Nutze:

- AP03 IA
- aktuelle neun kanonischen Diagnostics Services
- aktuelle fachliche Daten

Keine neuen Services erfinden.

Prüfe, welche Gruppierung tatsächlich kanonisch ist.

Historische POC/Lab-Struktur nicht blind übernehmen,
wenn sie Epigenetics falsch gruppiert.

==================================================
5. NEUN SERVICES
==================================================

Alle neun kanonischen Diagnostics Services müssen über:

- Mega Menu direkt
oder
- IA-seitig bewusst über Hub/Gruppe

erreichbar sein.

PT06.2 muss die AP03-Findability-Entscheidung respektieren.

Keine erfundenen Slugs.

==================================================
6. EPIGENETICS-GRENZE
==================================================

Epigenetics darf nicht als primäre Diagnostics-Untergruppe stehen.

Wenn fachlich sinnvoll:
Crosslink erlaubt.

Aber:

- eigener Headerpunkt bleibt primärer Einstieg
- Musterbefunde nicht als Diagnostics-Untergruppe missklassifizieren

==================================================
7. VISUELLE HIERARCHIE
==================================================

AP05 Patterns verwenden.

Mindestens:

- group labels
- link titles
- optional descriptions
- optional badges nur bei echtem aktuellen Grund
- spacing
- focus/hover
- mobile readability

Keine neue Art Direction.

==================================================
8. KEYBOARD
==================================================

Mindestens:

- Trigger per keyboard
- Enter/Space entsprechend Pattern
- Tab reaches all targets
- Escape closes
- no hover-only access
- no focus loss

==================================================
9. FOCUS
==================================================

Prüfen:

- visible focus
- correct return focus
- hidden menu items not focusable
- desktop/mobile consistency

==================================================
10. MOBILE
==================================================

Mega Menu auf Mobile sinnvoll adaptieren:

- accordion/submenu
- alle Ziele erreichbar
- kein horizontal overflow
- touch targets
- clear hierarchy

==================================================
11. ROUTE VALIDATION
==================================================

Jeder Link:

- existierende kanonische Route
- locale-safe
- kein `/services*`
- kein dead slug
- kein `/diagnostics/sports`
- kein erfundener Epigenetics-as-service path

Wenn zentrale Route Registry noch fehlt:
keine eigene bauen.

==================================================
12. TESTS
==================================================

Mindestens:

- menu open/close
- all intended links
- nine service coverage
- hub
- Epigenetics not primary subgroup
- keyboard
- Escape
- focus
- mobile
- route validity
- no `/services*`
- x10 labels
- build

==================================================
13. STATE
==================================================

Bei PASS:

- Last completed = PT06.2
- Next = PT06.3
- Diagnostics mega menu = implemented
- Route targets = validated
- AP06 IN_PROGRESS
- AP07 NOT STARTED

==================================================
14. PASS-KRITERIEN
==================================================

PASS nur wenn:

- PT06.1 PASS
- groups IA-conform
- nine services reachable
- hub reachable
- Epigenetics not primary subgroup
- visual hierarchy
- keyboard
- focus
- mobile
- no dead links
- no `/services*`
- no route registry duplication
- tests/build green
- State PT06.3

==================================================
15. REPORT
==================================================

TASK RESULT PT06.2
PASS | BLOCKED

Repository:
Branch:
HEAD:
Working tree:

Predecessor PT06.1:
Diagnostics groups:
Diagnostics hub:
Nine-service coverage:
Epigenetics subgroup status:
Crosslinks:
Visual hierarchy:
Keyboard:
Focus:
Mobile:
Route validity:
Legacy /services targets:
Dead targets:
x10 labels:

Application files modified:
Route registry implementation performed: NONE
Search index modified: NONE
Later AP implementation performed: NONE

Typecheck:
Lint:
Tests:
Build:

Decision locks:
State:
Open blockers:
Next task: PT06.3

NICHT PT06.3 starten.
NICHT AP07 starten.
```

---

# Prompt 3 — PT06.3 Footer

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP06 — App Shell, Header, Footer und globale Navigation
Primärtask: PT06.3 — Footer
Modus: produktive Footer-Implementierung

Bearbeite ausschließlich PT06.3.

PT06.1 und PT06.2 müssen PASS sein.
PT06.4/PT06.5/AP07 nicht vorziehen.

==================================================
1. KONTEXT
==================================================

Lies CONTEXT-INDEX.md.

Dann:

- AGENT-CONTRACT
- PROJECT-CONSTRAINTS
- MASTER-SCOPE AP06
- AP06.md
- AP-STATE
- AP03 IA/Findability
- AP05 Design-System
- AP04 x10 labels/content
- Routing Contract
- aktuelle Footer.tsx
- relevante locale keys
- aktuelle Footer tests

==================================================
2. START-GATE
==================================================

Verifiziere:

- PT06.1 PASS
- PT06.2 PASS
- AP06 IN_PROGRESS
- Last completed = PT06.2
- Next = PT06.3
- 18/18 Decisions

==================================================
3. FOOTER-ZIELBILD
==================================================

Implementiere einen IA-konformen zehnsprachigen Footer.

Mindestens sinnvolle Rollen:

- Company/Main Links
- Diagnostics
- Epigenetics
- IglooPro/Product soweit IA
- Content/Resources soweit IA
- Support
- Contact
- Legal
- Locations
- Social

Nicht jede Route muss direkt gelistet sein.

==================================================
4. DIAGNOSTICS
==================================================

Footer soll:

- Diagnostics Hub
- sinnvoll priorisierte Serviceziele

bieten.

Keine Legacy `/services*` Ziele.

Nicht automatisch alle neun Services, wenn AP03 bewusst indirekte Findability vorsieht.

==================================================
5. EPIGENETICS
==================================================

Closure-kritisch.

Eigener sichtbarer Footer-Einstieg:

Footer
→ Epigenetics

Nicht nur:

Footer
→ Diagnostics
→ Epigenetics

Locale-safe.

==================================================
6. LOCATIONS / SOCIAL
==================================================

Aktuell verifizieren:

- London
- Hamburg
- LinkedIn
- Instagram

Prüfen:

- URLs
- accessible labels
- external link semantics
- keine Third-Party Scripts für Social Icons
- no tracking injection

==================================================
7. LEGAL
==================================================

Mindestens:

- Imprint
- Privacy
- Terms

plus weitere kanonische Legal Links gemäß IA.

Locale-/route-safe.

==================================================
8. X10 LABELS
==================================================

Alle Footer Labels:

de,en,pl,fr,it,es,pt,da,nl,cs

Keine hardcoded visible strings.

==================================================
9. MOBILE ORDER
==================================================

Prüfe:

- Informationspriorität
- responsive columns/stack
- touch targets
- Social/Legal
- Epigenetics visible
- no horizontal overflow

==================================================
10. NO GUARANTEE BAND
==================================================

Harte Regression.

Footer darf NICHT rendern/importieren:

- altes CtaSection
- CtaBand
- globales „garantierte Performance“-Band
- CTA-Locale-Rolle, die dieses Band zurückbringt

Stringscan präzise:
legitime fachliche Fließtextverwendung nicht blind entfernen.

==================================================
11. NO CHAT
==================================================

Footer darf keinen:

- Chat link
- Chat CTA
- HiHuman link

enthalten.

Vollständige Shell-Entfernung PT06.4.

==================================================
12. ROUTE VALIDATION
==================================================

Alle Footer Links:

- existierende Targets
- canonical
- locale-safe
- no `/services*`
- no backlog activation

Deal/Voucher/Case Studies/Shop nicht reaktivieren.

==================================================
13. TESTS
==================================================

Mindestens:

- footer render
- main links
- Diagnostics
- Epigenetics entry
- Legal
- Social external
- x10 labels/parity
- mobile structure
- no Guarantee Band
- no Chat
- route validity
- build

==================================================
14. STATE
==================================================

Bei PASS:

- Last completed = PT06.3
- Next = PT06.4
- Footer = implemented
- Epigenetics footer entry = implemented
- Guarantee band = absent
- AP06 IN_PROGRESS
- AP07 NOT STARTED

==================================================
15. PASS-KRITERIEN
==================================================

PASS nur wenn:

- PT06.1/2 PASS
- Footer IA-conform
- Diagnostics entry
- Epigenetics own entry
- Company/Support/Contact
- Locations/Social
- Legal
- labels x10
- mobile order
- no `/services*`
- no Guarantee Band
- no Chat
- no backlog reactivation
- tests/build green
- State PT06.4

==================================================
16. REPORT
==================================================

TASK RESULT PT06.3
PASS | BLOCKED

Repository:
Branch:
HEAD:
Working tree:

Predecessor PT06.1:
Predecessor PT06.2:
Footer:
Main links:
Diagnostics:
Epigenetics footer entry:
IglooPro/product:
Resources/content:
Support/contact:
Locations:
Social:
Legal:
x10 labels:
Mobile order:
Legacy /services targets:
Guarantee band:
Chat links:
Backlog links:
Route validity:

Typecheck:
Lint:
Tests:
Build:

Decision locks:
State:
Open blockers:
Next task: PT06.4

NICHT PT06.4 starten.
NICHT AP07 starten.
```

---

# Prompt 4 — PT06.4 Globale Hilfselemente

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP06 — App Shell, Header, Footer und globale Navigation
Primärtask: PT06.4 — Globale Hilfselemente
Modus: produktive Shell-/Helper-Implementierung

Bearbeite ausschließlich PT06.4.

PT06.1–PT06.3 müssen PASS sein.
PT06.5/AP07 nicht vorziehen.

==================================================
1. KONTEXT
==================================================

Lies CONTEXT-INDEX.md.

Dann:

- AGENT-CONTRACT
- PROJECT-CONSTRAINTS
- MASTER-SCOPE AP06
- AP06.md
- AP-STATE
- AP05 Design-System
- AP03 IA
- AP04 content/x10
- Consent Contract
- Runtime Contract
- aktuelle App/Layout Helper

Gezielt:

- src/App.tsx
- src/components/layout/Layout.tsx
- MobileCallButton
- CookieBanner
- LanguageFallbackNotice
- ChapterNav
- ChatWidget
- HiHuman loader/imports
- ScrollToTop/ScrollToHash
- existing Skip Link

Backend `/api/chat` nur zur Ownership-Abgrenzung prüfen,
NICHT entfernen.

==================================================
2. START-GATE
==================================================

Verifiziere:

- PT06.1 PASS
- PT06.2 PASS
- PT06.3 PASS
- AP06 IN_PROGRESS
- Last completed = PT06.3
- Next = PT06.4
- 18/18 Decisions

==================================================
3. MOBILE CALL BUTTON
==================================================

Prüfen/implementieren:

- site-wide where intended
- Consumer-Ausnahme gemäß IA/Current Product Contract
- correct tel/href
- accessible name
- touch target
- no overlap with cookie/footer
- no chat dependency

Keine neue Contact Journey.

==================================================
4. COOKIE BANNER
==================================================

AP06 besitzt nur Shell-Integration.

Prüfe:

- exactly once
- correct global location
- z-index
- mobile
- keyboard baseline
- no overlap
- no duplicate render

NICHT ändern/neu bauen:

- GTM/GA4 loading
- Consent Mode
- consent persistence
- analytics providers
- tracking events

AP23 Owner.

==================================================
5. LANGUAGE FALLBACK NOTICE
==================================================

Nur defensiv.

Target:

- kein permanenter Normalzustand
- nur echte unerwartete Fallbacks
- keine Consumer EN-only Kaschierung
- keine x10-Lücke als akzeptierter Zustand

AP08 Owner des i18n-Core.

==================================================
6. SCROLL TO TOP
==================================================

Prüfen:

- normal page navigation
- no conflict with hashes
- SSR-safe
- reduced motion where animated

==================================================
7. SCROLL TO HASH
==================================================

Verbindlich:

- ChapterNav offset
- `--chapterbar-offset` oder kanonisches Äquivalent
- initial hash load
- client navigation hash
- no header overlap
- legacy anchors preserved where canonical
- no hydration mismatch

==================================================
8. SKIP LINK
==================================================

Implementiere/prüfe:

- first meaningful focusable control
- target = main content
- visible on focus
- sticky header compatible
- keyboard
- x10 label oder sprachneutral korrekt
- valid target ID

==================================================
9. CHATWIDGET / HIHUMAN PRODUKTIV ENTFERNEN
==================================================

Closure-kritisch.

AP06 muss vollständig aus der produktiven Frontend-Shell entfernen:

- ChatWidget rendering
- ChatWidget import
- HiHuman frontend loader
- chat trigger
- chat CTA
- chat shell copy
- productive widget network loading

Frontend-Datei darf gelöscht werden,
wenn sicher unreferenziert und kein anderer Owner sie benötigt.

Ansonsten unreferenziert belassen.

Aber:
produktiver Tree darf sie nicht laden.

==================================================
10. CHAT OWNERSHIP-GRENZE
==================================================

AP06 darf NICHT vorziehen:

- `/api/chat` Backend removal → AP22 PT22.7
- CSP HiHuman domain removal/finalization → AP26 PT26.2

Im PT06.4 Report explizit ausweisen:

Chat frontend: REMOVED
/api/chat backend: UNCHANGED / LATER OWNER AP22
CSP chat domains: UNCHANGED / LATER OWNER AP26

==================================================
11. HELPER COMPOSITION
==================================================

Prüfe:

- correct shell(s)
- Consumer exceptions
- no duplicate helper
- z-index
- hydration
- no interaction blockade
- focus

==================================================
12. NO GUARANTEE BAND
==================================================

Kein globaler Helper darf das alte Garantie-Band wieder einführen.

==================================================
13. TESTS
==================================================

Mindestens:

- MobileCallButton
- CookieBanner once
- fallback notice defensive
- ScrollToTop
- ScrollToHash
- ChapterNav offset
- Skip Link
- ChatWidget not rendered
- ChatWidget not imported in productive tree
- no HiHuman frontend loader/request
- `/api/chat` unchanged
- CSP not AP06-finalized
- no Guarantee Band
- build/SSR

==================================================
14. STATE
==================================================

Bei PASS:

- Last completed = PT06.4
- Next = PT06.5
- Global helpers = implemented
- Productive ChatWidget/HiHuman = removed
- Skip/hash behavior = verified
- AP06 IN_PROGRESS
- AP07 NOT STARTED

==================================================
15. PASS-KRITERIEN
==================================================

PASS nur wenn:

- PT06.1–3 PASS
- MobileCallButton correct
- CookieBanner shell integration correct
- LanguageFallbackNotice defensive
- ScrollToTop
- ScrollToHash
- ChapterNav offset preserved
- Skip Link
- no productive ChatWidget
- no HiHuman frontend load
- no Chat CTA
- `/api/chat` unchanged
- CSP finalization not pulled forward
- no hydration/interaction regression
- no Guarantee Band
- tests/build green
- State PT06.5

==================================================
16. REPORT
==================================================

TASK RESULT PT06.4
PASS | BLOCKED

Repository:
Branch:
HEAD:
Working tree:

Predecessor PT06.1:
Predecessor PT06.2:
Predecessor PT06.3:

MobileCallButton:
Consumer exception:
CookieBanner integration:
Consent logic modified: NONE
LanguageFallbackNotice:
ScrollToTop:
ScrollToHash:
ChapterNav offset:
Skip link:
Global helper composition:

Productive ChatWidget:
HiHuman frontend loader:
Chat CTA:
Chat frontend network load:
/api/chat backend:
CSP chat domains:
Guarantee band:

Typecheck:
Lint:
Tests:
Build:
SSR smoke:

Decision locks:
State:
Open blockers:
Next task: PT06.5

NICHT PT06.5 starten.
NICHT AP07 starten.
```

---

# Prompt 5 — PT06.5 Navigationstests

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP06 — App Shell, Header, Footer und globale Navigation
Primärtask: PT06.5 — Navigationstests
Modus: Test-/Regression-Hardening für AP06

Bearbeite ausschließlich PT06.5.

PT06.1–PT06.4 müssen PASS sein.

Dies ist der letzte Primärtask von AP06.

Danach:
AP06-CLOSURE

Closure und AP07 NICHT selbstständig starten.

==================================================
1. KONTEXT
==================================================

Lies CONTEXT-INDEX.md.

Dann:

- AGENT-CONTRACT
- PROJECT-CONSTRAINTS
- MASTER-SCOPE AP06
- AP06.md
- AP-STATE
- AP05 Design-System
- AP03 IA
- Routing Contract
- Quality Gates
- current Header/Footer/Layout/helpers
- current e2e/unit test setup

`useSearch.ts` nicht ändern.

==================================================
2. START-GATE
==================================================

Verifiziere:

- PT06.1 PASS
- PT06.2 PASS
- PT06.3 PASS
- PT06.4 PASS
- AP06 IN_PROGRESS
- Last completed = PT06.4
- Next = PT06.5
- 18/18 Decisions

==================================================
3. DESKTOP KEYBOARD
==================================================

Testen:

- logo
- main navigation
- Diagnostics trigger/menu
- Epigenetics
- Search trigger
- Language Switcher
- General CTA
- Skip Link
- Footer
- External social links

Kein Hover-only-Zugang.

==================================================
4. MOBILE KEYBOARD / INTERACTION
==================================================

Testen:

- Burger
- open/close
- Diagnostics submenu
- Epigenetics entry
- Search
- Language Switcher
- CTA
- focus order
- Escape/close where supported
- no hidden focus targets

==================================================
5. SCREENREADER LABELS
==================================================

Prüfen:

- nav landmarks
- logo
- menu triggers
- Search
- Language Switcher
- social
- mobile menu
- skip link
- aria-current

AP24 Full Audit nicht vorziehen.

==================================================
6. FOCUS ORDER
==================================================

Testen:

- desktop
- mobile
- mega menu
- dialog trigger integration
- after menu close
- after navigation
- no invisible focus

==================================================
7. ACTIVE PATHS
==================================================

Mindestens testen:

- /
- /diagnostics
- representative service
- /epigenetics
- /epigenetics#...
- /articles
- /support
- localized equivalents

Hash darf Page Active State nicht verfälschen.

==================================================
8. HASH NAVIGATION
==================================================

Mindestens:

- Epigenetics #musterbefunde
- weitere repräsentative anchor
- initial load
- client transition
- ChapterNav offset
- sticky header
- no 404
- legacy anchor if currently canonical

==================================================
9. LANGUAGE SWITCH
==================================================

Prüfe alle zehn Locales:

de,en,pl,fr,it,es,pt,da,nl,cs

Mindestens:

- current selection
- same logical route
- labels change
- no EN forced fallback
- Consumer route behavior not regressed
- Epigenetics route

==================================================
10. EPIGENETICS NAVIGATION
==================================================

Harter Test:

- own main nav
- mobile own entry
- footer own entry
- active state
- locale-safe
- not primary diagnostics subgroup

==================================================
11. NO GUARANTEE BAND REGRESSION
==================================================

Implementiere präzisen Guard/Test:

Verhindert produktiv:

- old CtaSection/CtaBand
- guarantee CTA band
- relevant cta_section locale keys if obsolete

Achtung:
legitime fachliche Fließtextformulierungen nicht global verbieten.

==================================================
12. NO PRODUCTIVE CHAT REGRESSION
==================================================

Test/Guard verhindert:

- ChatWidget in productive React tree
- HiHuman frontend loader
- Chat CTA
- productive widget request

Nicht als AP06-Gate verlangen:

- `/api/chat` = 404
- CSP chat domains absent

Diese gehören später AP22/AP26.

==================================================
13. ROUTE LINK VALIDATION
==================================================

Prüfe alle Header/Footer/MegaMenu targets.

Erwartung:

- target exists
- canonical
- locale-safe
- no `/services*`
- no dead target
- no backlog target

Wenn AP10 Route Registry noch nicht existiert:
keine eigene Registry bauen.

Ein kleiner statischer Test/Guard gegen vorhandene kanonische Route-Matrix/Contract ist zulässig.

==================================================
14. X10 LABEL PARITY
==================================================

Maschinell prüfen:

- required nav.*
- footer.*
- relevant a11y.*
- language switch labels
- mobile nav labels

für alle zehn Locales.

Keine permanente FallbackNotice akzeptieren.

==================================================
15. TESTARTEN
==================================================

Nutze bestehende Repo-Testarchitektur.

Mindestens soweit verfügbar/sinnvoll:

- unit
- component
- integration
- Playwright/E2E
- targeted visual smoke
- i18n parity
- production build
- SSR smoke

Keine neue Testplattform erfinden.

==================================================
16. QUALITY
==================================================

Mindestens:

- typecheck
- lint
- tests
- build
- SSR smoke
- E2E
- x10 parity
- route link guard
- no chat guard
- no guarantee guard
- check:colors if style files touched

==================================================
17. STATE
==================================================

Bei PASS:

- Last completed = PT06.5
- Next = AP06-CLOSURE
- Navigation tests = green
- Shell x10 = verified
- AP06 IN_PROGRESS
- AP07 NOT STARTED

AP06 NICHT COMPLETE setzen.

==================================================
18. PASS-KRITERIEN
==================================================

PASS nur wenn:

- PT06.1–4 PASS
- desktop keyboard green
- mobile keyboard green
- screenreader labels green
- focus order green
- active paths green
- hash navigation green
- language switch x10 green
- Epigenetics navigation green
- no Guarantee Band regression
- no productive Chat regression
- route targets valid
- nav/footer/a11y x10
- all relevant tests green
- `useSearch.ts` unchanged
- AP07 not started
- State Closure

==================================================
19. REPORT
==================================================

TASK RESULT PT06.5
PASS | BLOCKED

Repository:
Branch:
HEAD:
Working tree:

Predecessor PT06.1:
Predecessor PT06.2:
Predecessor PT06.3:
Predecessor PT06.4:

Desktop keyboard:
Mobile keyboard:
Screenreader labels:
Focus order:
Active paths:
Hash navigation:
Language switch x10:
Epigenetics navigation:
No guarantee-band regression:
No productive-chat regression:
Route link validation:
x10 nav/footer/a11y parity:

useSearch.ts modified: NONE
Route registry implementation performed: NONE
/api/chat backend modified: NONE
CSP finalization performed: NONE
Later AP implementation performed: NONE

Typecheck:
Lint:
Tests:
Build:
SSR smoke:
E2E:
Color guard:

Decision locks:
State:
Open blockers:
Next task: AP06-CLOSURE

NICHT AP06-CLOSURE starten.
NICHT AP07 starten.
```

---

# Prompt 6 — AP06-CLOSURE

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP06 — App Shell, Header, Footer und globale Navigation
Task: AP06-CLOSURE
Modus: Closure / Verifikation / keine neue größere Fachimplementierung

AP06 umfasst:

- PT06.1 — Header
- PT06.2 — Diagnostik-Mega-Menü
- PT06.3 — Footer
- PT06.4 — Globale Hilfselemente
- PT06.5 — Navigationstests

Alle fünf müssen PASS sein.

Fehlende größere Facharbeit NICHT im Closure nachholen.

AP07 NICHT starten.

==================================================
1. KONTEXT
==================================================

Lies zuerst CONTEXT-INDEX.md.

Danach:

- AGENT-CONTRACT
- PROJECT-CONSTRAINTS
- MASTER-SCOPE AP06 + DoD
- AP06.md
- AP-STATE
- AP05 Closure
- AP03 IA
- AP04 x10/content handoff
- Design-System Contract
- Routing Contract
- Consent Contract
- Quality Gates
- aktuelle Shell/Test-Evidenz

==================================================
2. START-GATE
==================================================

Verifiziere:

- AP00 COMPLETE / PASS
- AP01 COMPLETE / PASS
- AP02 COMPLETE / Closure PASS
- AP03 COMPLETE / Closure PASS
- AP04 COMPLETE / Closure PASS
- AP05 COMPLETE / Closure PASS
- AP06 IN_PROGRESS
- PT06.1 PASS
- PT06.2 PASS
- PT06.3 PASS
- PT06.4 PASS
- PT06.5 PASS
- Last completed = PT06.5
- Next = AP06-CLOSURE
- AP07 NOT STARTED
- 18/18 Decisions
- Git state safe

==================================================
3. C06-01 PREDECESSOR
==================================================

AP05 COMPLETE / Closure PASS.

==================================================
4. C06-02 DECISION INTEGRITY
==================================================

18/18 preserved.

Besonders:

- x10
- Sales-Machine
- Light only
- Epigenetics own pillar
- Consumer indexable
- no Chat target
- General CTA
- no Guarantee Band
- backlog isolation

==================================================
5. C06-03 SALES-MACHINE SHELL
==================================================

Header/Footer/Helpers nutzen AP05 Design-System.

Keine alternative Art Direction.

==================================================
6. C06-04 LIGHT ONLY
==================================================

Keine zweite Theme-Shell.

==================================================
7. C06-05 HEADER IA
==================================================

Header entspricht AP03 IA.

Keine zufälligen Legacy Main-Nav items.

==================================================
8. C06-06 EPIGENETICS MAIN NAV
==================================================

Epigenetics eigener Hauptnavigationspunkt.

Desktop + Mobile.

==================================================
9. C06-07 DIAGNOSTICS INDEPENDENCE
==================================================

Epigenetics nicht primäre Diagnostics-Untergruppe.

==================================================
10. C06-08 DIAGNOSTICS COVERAGE
==================================================

Diagnostics Hub + neun Services entsprechend IA erreichbar.

==================================================
11. C06-09 ROUTE TARGET VALIDITY
==================================================

Header/Footer/MegaMenu:
keine toten Ziele.

==================================================
12. C06-10 NO /SERVICES TARGETS
==================================================

Keine produktiven Legacy `/services*` Linkziele.

==================================================
13. C06-11 GENERAL CTA
==================================================

„Angebot anfragen“ bzw. korrekte x10 Übersetzung.

Spezialjourneys nicht vermischt.

==================================================
14. C06-12 SEARCH TRIGGER
==================================================

Header Search Trigger vorhanden/gelabelt.

==================================================
15. C06-13 SEARCH OWNERSHIP
==================================================

`src/hooks/useSearch.ts` nicht durch AP06 verändert.

AP07 Search-Aufgaben nicht vorgezogen.

==================================================
16. C06-14 LANGUAGE SWITCHER
==================================================

x10, locale-safe, keyboard baseline.

==================================================
17. C06-15 MOBILE NAV
==================================================

Alle strategischen Ziele erreichbar.

==================================================
18. C06-16 ACTIVE STATES
==================================================

Route/hash/parent/locale korrekt.

==================================================
19. C06-17 SCROLL/SHRINK
==================================================

Sticky Header + ChapterNav + Hash kompatibel.

==================================================
20. C06-18 FOOTER IA
==================================================

Company/Diagnostics/Epigenetics/Support/Legal/Social entsprechend IA.

==================================================
21. C06-19 EPIGENETICS FOOTER
==================================================

Eigener Footer-Einstieg.

==================================================
22. C06-20 NO GUARANTEE BAND
==================================================

Kein globales altes Guarantee/Performance CTA Band.

==================================================
23. C06-21 MOBILE CALL BUTTON
==================================================

Korrekt und Consumer-Ausnahme konsistent.

==================================================
24. C06-22 COOKIE BANNER
==================================================

Genau einmal global integriert.

Consent-Semantik nicht AP06-seitig neu gebaut.

==================================================
25. C06-23 FALLBACK NOTICE
==================================================

Nur defensiv.

Nicht normaler x10-Zustand.

==================================================
26. C06-24 SCROLL HELPERS
==================================================

ScrollToTop + ScrollToHash funktionieren.

==================================================
27. C06-25 SKIP LINK
==================================================

Funktioniert keyboard/sticky header.

==================================================
28. C06-26 NO PRODUCTIVE CHAT
==================================================

Kein:

- ChatWidget render
- ChatWidget productive import
- HiHuman frontend loader
- Chat CTA
- Widget request

==================================================
29. C06-27 CHAT BACKEND BOUNDARY
==================================================

AP06 hat `/api/chat` nicht vorgezogen entfernt.

AP22 Owner bleibt dokumentiert.

==================================================
30. C06-28 CSP BOUNDARY
==================================================

AP06 hat AP26 CSP Finalization nicht vorgezogen.

==================================================
31. C06-29 DESKTOP KEYBOARD
==================================================

Grün.

==================================================
32. C06-30 MOBILE KEYBOARD
==================================================

Grün.

==================================================
33. C06-31 SCREENREADER LABELS
==================================================

Globale Shell Labels grün.

==================================================
34. C06-32 FOCUS ORDER
==================================================

Grün.

==================================================
35. C06-33 HASH NAVIGATION
==================================================

Grün inkl. ChapterNav offset.

==================================================
36. C06-34 LANGUAGE SWITCH X10
==================================================

Grün.

==================================================
37. C06-35 EPIGENETICS E2E
==================================================

Own main nav + footer + mobile + active + locale-safe.

==================================================
38. C06-36 REGRESSION GUARDS
==================================================

No Guarantee Band + no productive Chat.

==================================================
39. C06-37 QUALITY
==================================================

Mindestens:

- typecheck
- lint
- tests
- build
- SSR smoke
- E2E
- x10 parity
- route link validation
- relevant visual smoke
- check:colors if relevant

==================================================
40. C06-38 CANONICALITY
==================================================

Keine neue konkurrierende:

- Route Registry
- Search Index
- Consent Truth
- IA Truth
- Design System Truth

==================================================
41. C06-39 SCOPE INTEGRITY
==================================================

Nicht vorgezogen:

- AP07 Search
- AP08 i18n Core
- AP09 SEO
- AP10 Route Registry
- AP11–21 page work
- AP22 `/api/chat` removal
- AP23 Consent
- AP24 full A11y
- AP26 CSP

==================================================
42. C06-40 AP07 NOT STARTED
==================================================

AP07 bleibt NOT STARTED.

==================================================
43. NAVIGATION-INVARIANTEN
==================================================

Prüfe mindestens semantisch:

NAV-01 Epigenetics Main Navigation
NAV-02 Diagnostics Independence
NAV-03 Diagnostics Route Validity
NAV-04 No /services Targets
NAV-05 General Sales CTA
NAV-06 Ten Languages
NAV-07 Mobile Navigation
NAV-08 Keyboard
NAV-09 Focus
NAV-10 Active State
NAV-11 Hash Compatibility
NAV-12 Footer Epigenetics
NAV-13 Footer Legal
NAV-14 No Guarantee Band
NAV-15 No Productive Chat
NAV-16 Chat Backend Ownership
NAV-17 CSP Ownership
NAV-18 Search Ownership
NAV-19 Search Trigger
NAV-20 Consent Ownership
NAV-21 Fallback Defensive
NAV-22 Skip Link
NAV-23 Consumer Shell
NAV-24 Social Semantics
NAV-25 Route Registry Boundary
NAV-26 Sales-Machine
NAV-27 Touch Targets
NAV-28 No AP07 Pull-forward

==================================================
44. CLOSURE-KORREKTUREN
==================================================

Erlaubt nur:

- AP-STATE
- Closure Report
- kleiner Cross-Reference
- Status-Tippfehler

Nicht:

- Header/Mega/Footer neu bauen
- Chat erst jetzt entfernen
- fehlende x10 Labels erstmals ergänzen
- Tests groß nachholen

Wenn Fachsubstanz fehlt:
FAIL/BLOCKED.

==================================================
45. STATE BEI PASS
==================================================

Nur bei vollständigem PASS:

- AP00 COMPLETE / PASS
- AP01 COMPLETE / PASS
- AP02 COMPLETE / Closure PASS
- AP03 COMPLETE / Closure PASS
- AP04 COMPLETE / Closure PASS
- AP05 COMPLETE / Closure PASS
- AP06 COMPLETE / Closure PASS
- Last completed PT = PT06.5
- AP06 Closure = PASS
- Header = ready
- Diagnostics mega menu = ready
- Footer = ready
- Global helpers = ready
- Productive ChatWidget/HiHuman = absent
- Navigation tests = green
- Next work package = AP07
- AP07 = NOT STARTED

==================================================
46. PASS-KRITERIEN
==================================================

PASS nur wenn alle 40 C06-Gates PASS sind.

Master-Scope-DoD muss belegbar sein:

Shell funktioniert in 10 Sprachen,
Epigenetik ist eigenständig sichtbar,
CTA-Naming ist konsistent
und kein Chat-/Garantie-Band-Rest lädt produktiv.

==================================================
47. REPORT
==================================================

AP06 CLOSURE RESULT
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
AP05:

PT06.1:
PT06.2:
PT06.3:
PT06.4:
PT06.5:

Sales-Machine shell:
Light theme:
Header:
Logo:
Main navigation:
Epigenetics main nav:
Diagnostics main nav:
Diagnostics mega menu:
Diagnostics service coverage:
Route target validity:
Legacy /services targets:
General CTA:
Search trigger:
Search index ownership:
Language switcher:
Mobile navigation:
Active states:
Scroll/shrink:

Footer:
Epigenetics footer entry:
Locations/social:
Legal:
Mobile footer order:
Guarantee band:

MobileCallButton:
CookieBanner integration:
LanguageFallbackNotice:
ScrollToTop:
ScrollToHash:
Skip link:
ChapterNav offset:

Productive ChatWidget:
HiHuman frontend load:
Chat backend boundary:
CSP boundary:

Desktop keyboard:
Mobile keyboard:
Screenreader labels:
Focus order:
Hash navigation:
Language switch x10:
Epigenetics navigation:
Regression no guarantee band:
Regression no productive chat:

Decision locks:
Canonicality:
Scope integrity:
Typecheck:
Lint:
Tests:
Build:
SSR smoke:
E2E:

AP06 Definition of Done:
State:

AP06 status:
Next work package:
AP07 status:

Open blockers:
Open later-owner items:

Final verdict:

Wenn PASS:

AP06 is COMPLETE.
AP06 Closure is PASS.
AP07 is NOT STARTED.
The repository is ready for AP07.

Danach beenden.

NICHT AP07 starten.
NICHT PT07.1 erzeugen.
```
