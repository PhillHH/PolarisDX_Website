# AP07 — Vollständige Prompt-Kette

**Projekt:** PolarisDX Website Relaunch
**Work Package:** AP07 — Suche und interne Findability
**Ausführung:** streng seriell
**Reihenfolge:** `PT07.1 → PT07.2 → PT07.3 → AP07-CLOSURE`
**Startvoraussetzung:** AP06 Closure `PASS`
**Nachfolger:** AP08 erst nach AP07 Closure `PASS`
**Kanonisches Arbeitspaket:** `building-docs/work-packages/AP07.md`
**Kanonische operative Matrix:** `building-docs/AP07-FINDABILITY-MATRIX.md`

Jeder Block unten ist ein **eigenständiger** Prompt für genau einen Agent-Lauf. Ein Lauf bearbeitet
genau einen Primärtask und stoppt danach.

---

# Prompt 1 — PT07.1 Suchindex

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP07 — Suche und interne Findability
Primärtask: PT07.1 — Suchindex
Modus: produktive Such-Implementierung

WICHTIG:
Bearbeite ausschließlich PT07.1.
NICHT PT07.2 starten. NICHT PT07.3 starten. NICHT AP07-CLOSURE starten.

==================================================
1. KONTEXT
==================================================

Lies zuerst building-docs/CONTEXT-INDEX.md.

Danach:

- AGENT-CONTRACT
- PROJECT-CONSTRAINTS
- MASTER-SCOPE, Abschnitt AP07
- work-packages/AP07.md, insbesondere §3, §4, §7, §8, §13
- AP07-FINDABILITY-MATRIX.md
- state/AP-STATE.md
- ROUTING-CONTRACT · I18N-CONTRACT · SEO-CONTRACT · QUALITY-GATES
- AP06 Closure-Handoff (Shell, Navigationsziele)

Read-only Repository-Evidenz:

src/hooks/useSearch.ts
src/hooks/useArticles.ts
src/data/services.tsx
src/data/articles.ts
src/content/befunde/meta.ts
src/App.tsx
public/locales/*/common.json
scripts/check-nav-targets.mjs

Kein pauschales Read-all.

==================================================
2. START-GATE
==================================================

Verifiziere:

- AP00–AP05 COMPLETE / Closure PASS
- AP06 COMPLETE / Closure PASS
- Next work package = AP07
- AP07 = NOT STARTED
- Decision Locks 18/18
- AP07-FINDABILITY-MATRIX.md existiert
- Git state safe, keine laufende Git-Operation

Wenn AP06 Closure nicht PASS:

TASK RESULT PT07.1
BLOCKED_PREDECESSOR

und stoppen.

==================================================
3. PRIMÄRTASK
==================================================

Der Suchindex deckt alle strategischen aktuellen Routen ab, führt keinen toten
Treffer mehr und liefert zehnsprachige Titel und Beschreibungen.

Alle Matrix-Ausgaben gehen ausschließlich nach:

building-docs/AP07-FINDABILITY-MATRIX.md

PT07.1 aktualisiert:

SECTION A — Search Coverage Matrix

und bei Bedarf:

SECTION C — Deferred Search / Link Integration Register

PT07.1 darf KEINE zusätzliche Search-Matrix-Datei erzeugen.
Verboten: SEARCH-MATRIX.md, FINDABILITY.md, SEARCH-COVERAGE.md,
INTERNAL-LINKS.md, DEFERRED-SEARCH.md.

==================================================
4. SECTION A BEFÜLLEN
==================================================

Trage jede für die Suche relevante Route als Zeile ein, mit allen zwölf
Pflichtspalten aus AP07-FINDABILITY-MATRIX.md §1.1.

Auch bewusste Ausschlüsse werden eingetragen:
SEARCH_EXCLUDED_INTENTIONAL mit Begründung.
Ein Fehlen ist keine Aussage.

Jede SEARCH_DEFERRED_*-Zeile referenziert zwingend eine DSI-xx aus Section C.

==================================================
5. STATISCHE SEITEN
==================================================

Mindestens prüfen und klassifizieren:

/ · /about · /contact · /support · /igloo-pro · /downloads · /events
/imprint · /privacy · /terms · /s3_leitlinie
/vitamin-d3-implantologie · /vitamin-d3-spray

Legal-Seiten dürfen SEARCH_OPTIONAL sein — begründet, nicht stillschweigend.

==================================================
6. SERVICES
==================================================

Lies die kanonische Service-Datenquelle EMPIRISCH.
Übernimm keine Anzahl aus einem Dokument.

Enthält sie neun Services, besitzen 9/9 Search Coverage.
Weicht die reale Zahl ab, gilt die Datenquelle — und berichte die Abweichung.

Ziel jeweils /diagnostics/<id>.
KEINE /services*-Ziele.

Service-Titel sind heute hartkodierte Literale ('Dental', 'Beauty', …).
Stelle sie auf t() um, damit sie x10 sind.

==================================================
7. ARTIKEL
==================================================

Alle veröffentlichten Artikel sind suchbar.

Ziel ist /articles/<slug>.
NIEMALS /articles/<id> — das Routing ist slug-basiert, und articles.ts führt
beide Felder.

Gibt es kein Draft-/Publish-Flag: halte das fest. Dann gelten alle Einträge als
veröffentlicht, und die Unterscheidung ist ein Punkt für AP17 — erfinde kein Feld.

==================================================
8. EPIGENETIK
==================================================

Aufnehmen und prüfen:

- /epigenetics
- /epigenetics/grundlagen
- /epigenetics/studienlage
- /epigenetics/unterlagen
- die sechs /epigenetics/musterbefund/<slug>

WICHTIG — Routenrealität:
Die drei Vertiefungsrouten EXISTIEREN. Sie sind in src/App.tsx definiert,
antworten mit HTTP 200 und sind seit PT06.3 aus dem Footer verlinkt.

Sie sind SEARCH_REQUIRED.
Sie sind NICHT SEARCH_DEFERRED_ROUTE_OWNER.
Behandle sie nicht als Beispiel für eine fehlende Route.

Der Body-Rückstand ist ein CONTENT-Thema, kein Routen-Thema:
epigenetics.json existiert in allen zehn Locales, ist aber in den acht
Nicht-DE/EN-Sprachen wörtlich englisch; die Musterbefunde liegen nur DE+EN vor.
Registriere das als SEARCH_DEFERRED_CONTENT mit DSI-xx und Owner AP15/AP08.

Miss den Zustand selbst nach, statt ihn zu übernehmen.

==================================================
9. CONSUMER — SUCHINTENTION
==================================================

Die drei Consumer-Seiten sind:

/consumer/vitamin-d3-spray
/consumer/hydrating-masks
/consumer/inside-out-duo

Der Master-Scope sagt: aufnehmen, "soweit als interne Suchziele sinnvoll".
Das ist eine Entscheidung, die DU treffen und begruenden musst — nicht eine,
die du offenlassen darfst.

Miss vorher selbst nach:

- Zielgruppenbruch. Die Suche ist ein B2B-Werkzeug im Praxis-Kontext.
  Consumer-Produkttreffer zwischen Diagnostik-Services koennen die Trefferliste
  fachlich verwaessern.
- Locale-Verhalten. In PT06.3 gemessen: /de/consumer/* antwortet mit 301 auf
  /en/consumer/…. Ein Treffer, der aus einer deutschen Sitzung nach Englisch
  springt, ist ein schlechter Treffer.
- Indexierbarkeit. Gemessen: die drei URLs stehen in der Sitemap, tragen KEIN
  noindex und sind ohne Passwort erreichbar. Ein Kommentar in src/App.tsx
  behauptet das Gegenteil — er ist sachlich falsch und gehoert AP09/AP21.
  Verlass dich auf die Messung, nicht auf den Kommentar.

Zulaessig ist JEDE der drei Klassifikationen:
SEARCH_REQUIRED · SEARCH_OPTIONAL · SEARCH_EXCLUDED_INTENTIONAL
— mit Begruendung und Entscheidungsbezug in Section A.

UNZULAESSIG ist, die Zeile wegzulassen. Ein Fehlen ist keine Aussage.

Wuerde ein Treffer heute auf eine Redirect-Quelle zeigen, ist die Aufnahme
SEARCH_DEFERRED_ROUTE_OWNER mit DSI-xx und Owner AP10 — kein Treffer auf eine
Weiterleitung.

==================================================
10. DOWNLOADS, EVENTS UND RESSOURCEN
==================================================

/downloads und /events sind je EINE Seite, keine Detailstrecken:
public/locales/*/downloads.json und src/data/events.ts speisen jeweils eine
Uebersicht, und src/App.tsx definiert keine Einzelrouten dafuer.

Nimm beide auf und klassifiziere sie. /igloo-pro gehoert fachlich in dieselbe
Ressourcen-Gruppe.

Erfinde KEINE Einzel-Event- oder Einzel-Download-Ziele. Existiert eine solche
Route nicht, gilt die Future-Route-Regel: nicht indexieren, nicht verlinken,
DSI/DLI mit Owner.

==================================================
11. DER SPORTS-DEFEKT — HART
==================================================

src/hooks/useSearch.ts führt:

  id: 'sports'  →  /diagnostics/sports

Diese Route liefert HTTP 404. Es gibt keinen Service "Sports" in der Datenquelle.

Das ist KEIN Deferred Gate. Owner ist AP07.

Du musst:

1. den Eintrag entfernen;
2. einen Regressionstest ergänzen, der einen Treffer auf /diagnostics/sports
   dauerhaft ausschließt;
3. die Zielvalidierung so bauen, dass ein künftiger toter Treffer maschinell
   auffällt.

PT07.1 darf NICHT PASS sein, solange /diagnostics/sports als aktiver
Suchtreffer existiert.

==================================================
12. ZIELVALIDIERUNG
==================================================

Liefere eine maschinelle Prüfung, die jedes Suchziel gegen die real definierten
Routen validiert und mit Exit-Code 1 abbricht bei:

- totem Ziel
- /services*-Ziel
- Backlog-Ziel (shop, casestudys, case-studies, deal, voucher)
- Chat-Ziel

Vorbild: scripts/check-nav-targets.mjs.
Die Prüfung liest ab, was die Anwendung ohnehin definiert.

Sie ist KEINE zweite Route Registry. AP10 bleibt Owner.

Verankere sie pre-commit UND in CI, wie die bestehenden Guards.
Teste sie negativ (erfundenes Ziel, /services-Ziel → Exit 1).

==================================================
13. SUCH-METADATEN X10
==================================================

Alle aktiven Sucheinträge haben Titel und Beschreibung in:

de en pl fr it es pt da nl cs

Ergänze bei Bedarf einen Paritätsguard analog scripts/check-shell-i18n.mjs.

Heuristik-Warnung:
Ein Lehnwort, das in allen zehn Sprachen gleich lautet, ist KEINE fehlende
Übersetzung. Die Signatur eines durchgereichten Fallbacks ist eine andere —
Deutsch übersetzt, die übrigen wörtlich Englisch. Ein zu grober Guard wird
abgeschaltet und schützt danach gar nichts.

Eigennamen und Markennamen (IglooPro, PolarisDX, Produktnamen) dürfen in allen
zehn Sprachen gleich lauten.

==================================================
14. ERGEBNISTYPEN
==================================================

SearchResult.type ist heute 'page' | 'article' | 'service' und wird im Modal
ROH gerendert — in allen zehn Sprachen steht dort ein englisches Wort.

Bereite die Gruppen aus AP07.md §7.1 vor: Seiten, Diagnostik, Epigenetik,
Artikel, Ressourcen. Gruppennamen sind i18n-Keys.

Die Darstellung selbst ist PT07.2 — ziehe sie nicht vor.

==================================================
15. GRENZEN
==================================================

AP10: keine Route Registry, keine Routendefinition, keine Redirect-Weiche.
      src/App.tsx und server.ts NICHT ändern.
      /de/services bleibt serverseitig 200 — das ist AP10.
AP08: keine i18n-Kernänderung, keine Namespace-Migration, keine
      Body-Lokalisierung.
AP09: keine Sitemap-, hreflang- oder Structured-Data-Arbeit.
AP15: keine Epigenetik-Inhalte schreiben.
AP06: die globale Shell NICHT ändern.

Keine False-Ready-Aussage. Schreibe NICHT "Epigenetics x10 READY", nur weil die
Such-Metadaten x10 sind.

==================================================
16. TESTS
==================================================

- Komponententests auf den Index: Service-Coverage vollständig, Artikelziele
  slug-basiert, sports nicht auffindbar, Epigenetik-Ziele vorhanden.
- Guard negativ getestet.
- E2E: je ein Suchbegriff pro Ergebnisgruppe liefert einen Treffer, dessen Ziel
  HTTP 200 antwortet.

==================================================
17. QUALITÄT
==================================================

Belege: Typecheck · Lint (0 neue Findings) · Prettier auf berührten Dateien ·
Unit/Component · Build · SSR-Smoke der betroffenen Routen in zehn Sprachen ·
E2E · check:colors · check:nav-targets · check:shell-i18n · neuer
Search-Target-Guard.

==================================================
18. PASS-KRITERIEN
==================================================

1. Section A vollständig, jede Zeile mit Evidenz.
2. Services vollständig abgedeckt, Zahl aus der Datenquelle belegt.
3. /diagnostics/sports existiert nicht mehr als Treffer, per Test abgesichert.
4. Alle Artikelziele slug-basiert, HTTP 200.
5. Epigenetik-Hub, 3 Vertiefungen, 6 Musterbefunde sind aktive Suchziele.
6. Such-Metadaten x10, maschinell geprüft.
7. 0 tote Ziele, 0 /services*, 0 Backlog-, 0 Chat-Ziele.
8. Jede SEARCH_DEFERRED_*-Zeile hat eine DSI-xx mit allen 15 Feldern.
9. Keine Ready-Aussage über Seiteninhalte.
10. Keine Route Registry gebaut.
11. /downloads, /events und /igloo-pro klassifiziert; keine Einzel-Event- oder
    Einzel-Download-Ziele erfunden.
12. Für alle drei Consumer-Seiten ist eine Klassifikation GETROFFEN und
    BEGRÜNDET — keine fehlende Zeile.
13. Jede Zeile in Section A trägt ihren Search Result Type als i18n-Key, nicht
    als Literal.

==================================================
19. STATE
==================================================

AP-STATE.md:
Last completed PT = PT07.1
Next task = PT07.2
AP07 = IN_PROGRESS (NICHT COMPLETE)

==================================================
20. REPORT
==================================================

TASK RESULT PT07.1
PASS | FAIL | BLOCKED

Repository:
Branch:
HEAD:
Working tree:

Section A rows:
Static coverage:
Service coverage:
Article coverage:
Article slug integrity:
Epigenetics hub:
Epigenetics deepening routes:
Musterbefunde:
Downloads:
Events:
Consumer search intent:

/diagnostics/sports:
Sports regression test:
Search target validation:
Dead targets:
/services targets:
Backlog targets:
Chat targets:

Search metadata x10:
Result type groups prepared:

Section C new entries:
Deferred IDs:
False-ready statements:

Route registry built: NONE
src/App.tsx modified: NONE
server.ts modified: NONE
Later AP implementation performed: NONE

Typecheck:
Lint:
Tests:
Build:
SSR smoke:
E2E:
Guards:

Decision locks:
State:
Next task: PT07.2

Open blockers:
Open later-owner items:

Final verdict:

Danach STOPPEN.
NICHT PT07.2 starten.
```

---

# Prompt 2 — PT07.2 SearchModal Accessibility/UX

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP07 — Suche und interne Findability
Primärtask: PT07.2 — SearchModal Accessibility/UX
Modus: produktive Dialog-/A11y-Implementierung

WICHTIG:
Bearbeite ausschließlich PT07.2.
NICHT PT07.3 starten. NICHT AP07-CLOSURE starten.

==================================================
1. KONTEXT
==================================================

Lies zuerst building-docs/CONTEXT-INDEX.md.

Danach:

- AGENT-CONTRACT
- PROJECT-CONSTRAINTS
- MASTER-SCOPE, Abschnitt AP07
- work-packages/AP07.md, insbesondere §4.2, §9, §13
- AP07-FINDABILITY-MATRIX.md
- state/AP-STATE.md
- DESIGN-SYSTEM-CONTRACT (Dialog-, Motion- und Error-State-Muster)
- I18N-CONTRACT · QUALITY-GATES

Read-only Repository-Evidenz:

src/components/ui/SearchModal.tsx
src/components/ui/Dialog.tsx
src/components/ui/Dialog.test.tsx
src/hooks/useScrollLock.ts
src/components/layout/Header.tsx   (nur die Such-Trigger, nicht ändern)
public/locales/*/common.json

==================================================
2. START-GATE
==================================================

Verifiziere:

- AP06 COMPLETE / Closure PASS
- PT07.1 PASS
- Last completed PT = PT07.1
- Next = PT07.2
- AP07 = IN_PROGRESS
- Decision Locks 18/18
- Git state safe

==================================================
3. PRIMÄRTASK
==================================================

Der Suchdialog wird ein echter Dialog: benannt, mit gefangenem Fokus, per
Escape schließbar, mit Fokusrückgabe, angesagten Ergebnissen und
zehnsprachiger Oberfläche.

PT07.2 erzeugt KEINE Matrix-SSOT und schreibt keine Section A/B/C.

==================================================
4. AP05-DIALOG WIEDERVERWENDEN
==================================================

src/components/ui/Dialog.tsx liefert bereits:

role="dialog" · aria-modal · aria-labelledby · initialer Fokus · Fokusfalle ·
Fokusrückgabe · Escape · Backdrop-Klick · Scroll Lock · Reduced Motion.

Baue diese Mechanik NICHT nach.
Stelle SearchModal auf den AP05-Dialog um.

Ein zweites Dialog-Pattern wäre genau die Duplikation, die AP05 beseitigt hat.

Passt eine Zusage für den Suchfall nicht, begründe die Abweichung im Code —
umgehe sie nicht stillschweigend.

==================================================
5. GEMESSENE AUSGANGSLAGE
==================================================

Der heutige SearchModal hat unter anderem:

- keine Dialogrolle, kein aria-modal, keinen zugänglichen Namen
- keine Fokusfalle, keine Fokusrückgabe
- KEINEN Escape-Handler — obwohl die Fußzeile "Esc to close" verspricht
- keinen Backdrop-Klick
- initialen Fokus über setTimeout(…, 100) auf getElementById
- kein Label am Suchfeld, keinen Namen am Schließen-Knopf
- keine Statusansage der Trefferzahl
- keine Ergebnisgruppen, dafür den rohen result.type als sichtbaren Text
- hartkodiertes englisches "Esc to close"

Miss das selbst nach. Der Stand kann sich durch PT07.1 verschoben haben.

==================================================
6. ANFORDERUNGEN
==================================================

6.1 Dialogsemantik: role="dialog", aria-modal="true", aria-labelledby auf einen
    echten Titel.

6.2 Suchfeld: echte Beschriftung (<label> oder aria-label). Ein placeholder ist
    keine Beschriftung.

6.3 Initialer Fokus: deterministisch im Suchfeld, ohne Timeout-Abhängigkeit.

6.4 Fokusfalle: Tab und Shift+Tab wandern im Dialog im Kreis.

6.5 Fokusrückgabe: beim Schließen zurück auf den auslösenden Such-Trigger —
    Desktop UND Mobil, denn AP06 rendert zwei.

6.6 Escape schließt. Backdrop-Klick schließt. Schließen-Knopf trägt einen
    zugänglichen Namen. Der Hinweistext stimmt danach — und ist x10.

6.7 Ergebnisgruppen: Treffer gruppiert nach Seiten / Diagnostik / Epigenetik /
    Artikel / Ressourcen, Gruppentitel lokalisiert.
    Der rohe result.type verschwindet aus der Oberfläche.

6.8 Ergebniselemente: je ein fokussierbares Ziel mit sichtbarem Fokusring
    nach AP05.

6.9 Vier Zustände, alle lokalisiert: Initial · Laden · Leer (mit dem gesuchten
    Begriff im Text) · Fehler nach dem AP05-Error-State-Muster.

6.10 Statusansage: Trefferzahl über role="status" / aria-live="polite",
     lokalisiert und korrekt pluralisiert.

6.11 Tastatur: öffnen, tippen, Ergebnisse durchlaufen, öffnen, schließen —
     vollständig ohne Maus. Pfeiltasten-Navigation erwünscht, sofern sie die
     Tab-Reihenfolge nicht bricht.

6.12 Mobil bei 390 px: 0 px horizontaler Überlauf, Trefferflächen >= 44 px,
     Ergebnisliste scrollbar ohne dass der Hintergrund mitscrollt.

6.13 Reduced Motion: prefers-reduced-motion: reduce wird respektiert, über die
     AP05-Motion-Token.

6.14 UI-Copy x10: Platzhalter, Gruppentitel, Leerzustand, Initialzustand,
     Fehlerzustand, Statusansage, Schließen-Beschriftung, Tastaturhinweis.

==================================================
7. GRENZEN
==================================================

AP06: die Shell und ihre Such-Trigger bleiben unverändert. Du änderst nur,
      was der Trigger öffnet.
AP24: die vollständige A11y-Abnahme bleibt AP24. Mache den Suchdialog
      tauglich, nicht die ganze Anwendung.
AP05: keine neuen Design-Token, keine alternative Art Direction.
AP07: den Suchindex NICHT weiter umbauen — das war PT07.1.

==================================================
8. TESTS
==================================================

- Komponententests: Dialogrolle, zugänglicher Name, initialer Fokus,
  Fokusfalle, Escape, Fokusrückgabe, vier Zustände, Statusansage.
- E2E Desktop und Mobil: Öffnen per Tastatur, Tippen, Treffer per Tastatur
  öffnen, Escape schließt und gibt den Fokus zurück, 0 px Überlauf bei 390 px.
- Regression: kein englisches Literal in der Oberfläche
  ('page', 'article', 'service', 'Esc to close').

Miss Fokusringe mit einem korrekten Prädikat: eine Outline mit Breite > 0 UND
nicht transparenter Farbe, oder ein nicht vollständig transparenter Box-Shadow.
'outline: 2px solid transparent' ist KEIN sichtbarer Fokus.

==================================================
9. QUALITÄT
==================================================

Typecheck · Lint (0 neue) · Prettier · Unit/Component · Build · SSR-Smoke ·
E2E · check:colors · check:nav-targets · check:shell-i18n ·
Search-Target-Guard aus PT07.1.

==================================================
10. PASS-KRITERIEN
==================================================

1. SearchModal nutzt den AP05-Dialog; kein zweites Dialog-Pattern.
2. Dialogrolle und zugänglicher Name vorhanden.
3. Initialer Fokus deterministisch im Suchfeld.
4. Fokusfalle wirksam, Fokusrückgabe auf den auslösenden Trigger.
5. Escape schließt — und der Hinweistext stimmt jetzt.
6. Ergebnisgruppen lokalisiert; kein roher Typ sichtbar.
7. Vier Zustände vorhanden und lokalisiert.
8. Statusansage über Live-Region.
9. Vollständig tastaturbedienbar, mobil ohne Überlauf, Reduced Motion
   respektiert.
10. Sichtbare Dialog-Copy x10, maschinell geprüft.

==================================================
11. STATE
==================================================

AP-STATE.md:
Last completed PT = PT07.2
Next task = PT07.3
AP07 = IN_PROGRESS (NICHT COMPLETE)

==================================================
12. REPORT
==================================================

TASK RESULT PT07.2
PASS | FAIL | BLOCKED

Repository:
Branch:
HEAD:
Working tree:

AP05 Dialog reuse:
Dialog semantics:
Accessible name:
Search input labelling:
Initial focus:
Focus trap:
Focus return:
Escape:
Backdrop close:
Scroll lock:

Result groups:
Result items:
Initial state:
Loading state:
Empty state:
Error state:
Status announcements:

Keyboard:
Mobile:
Reduced motion:
UI copy x10:
Raw English literals:

Search index modified: NONE
Shell/Header modified: NONE
Later AP implementation performed: NONE

Typecheck:
Lint:
Tests:
Build:
SSR smoke:
E2E:
Guards:

Decision locks:
State:
Next task: PT07.3

Open blockers:
Open later-owner items:

Final verdict:

Danach STOPPEN.
NICHT PT07.3 starten.
```

---

# Prompt 3 — PT07.3 Interne Verlinkung

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP07 — Suche und interne Findability
Primärtask: PT07.3 — Interne Verlinkung
Modus: produktive Verlinkungs-Implementierung

WICHTIG:
Bearbeite ausschließlich PT07.3.
NICHT AP07-CLOSURE starten. NICHT AP08 starten.

==================================================
1. KONTEXT
==================================================

Lies zuerst building-docs/CONTEXT-INDEX.md.

Danach:

- AGENT-CONTRACT
- PROJECT-CONSTRAINTS
- MASTER-SCOPE, Abschnitt AP07
- work-packages/AP07.md, insbesondere §4, §10, §11, §12, §13
- AP07-FINDABILITY-MATRIX.md
- state/AP-STATE.md
- AP03 IA-/Findability-Handoff (IA-INVENTORY §10)
- AP04 Deferred-Gate-Modell (AP04.md §11.0)
- AP06 Closure-Handoff
- ROUTING-CONTRACT · I18N-CONTRACT · QUALITY-GATES

Read-only Repository-Evidenz:

src/App.tsx
src/pages/ServicesOverviewPage.tsx
src/pages/ServicePage.tsx
src/pages/EpigeneticsPage.tsx
src/pages/MusterbefundPage.tsx
src/pages/ArticlesIndexPage.tsx
src/pages/EventsPage.tsx
src/pages/consumer/**
src/components/layout/Footer.tsx

==================================================
2. START-GATE
==================================================

Verifiziere:

- AP06 COMPLETE / Closure PASS
- PT07.1 PASS · PT07.2 PASS
- Last completed PT = PT07.2
- Next = PT07.3
- AP07 = IN_PROGRESS
- Decision Locks 18/18
- Git state safe

==================================================
3. PRIMÄRTASK
==================================================

Strategische Inhalte verweisen im Lesefluss aufeinander. Keine strategische,
aktuell existente Seite bleibt ungewollt nur per Direkt-URL erreichbar.

PT07.3 aktualisiert ausschließlich:

SECTION B — Internal Findability Matrix
SECTION C — Deferred Search / Link Integration Register

in building-docs/AP07-FINDABILITY-MATRIX.md.

Keine zusätzliche Dokumentdatei erzeugen.

==================================================
4. SECTION B BEFÜLLEN
==================================================

Jede strategische Route wird eine Zeile mit allen elf Pflichtspalten und einem
der vier zulässigen States.

INTENTIONAL_LIMITED_FINDABILITY verlangt eine Begründung mit
Entscheidungsbezug. Ohne Begründung ist es UNINTENDED_DIRECT_URL_ONLY.

==================================================
5. VERLINKUNGEN
==================================================

5.1 Artikel <-> Services
    Artikel verweisen auf zugehörige Services; Services auf einschlägige
    Artikel. ServicePage.tsx importiert data/articles.ts bereits — schließe die
    Verbindung an, erfinde sie nicht neu.

5.2 Diagnostik-Hub -> Services
    Der Hub führt auf ALLE neun Services. Eine unvollständige Liste, die
    vollständig aussieht, ist schlechter als beides (siehe IAD-17).

5.3 Services -> Diagnostik
    Jede Serviceseite führt zurück auf den Hub und seitwärts auf fachlich
    benachbarte Services.

5.4 Epigenetik
    Hub -> die drei Vertiefungsseiten (EXISTIEREN, HTTP 200)
    Hub -> die sechs Musterbefunde
    Hub -> Panels/Analysen
    Musterbefunde -> zurück zum Hub
    Vertiefungen -> Hub und untereinander, wo fachlich sinnvoll

    Epigenetik-Inquiry: die eigenständige Anfragestrecke gehört AP15.
    Platziere vorhandene CTAs kontextuell, baue KEINE neue Strecke.
    Fehlt sie, ist das ein DLI mit Owner AP15.

5.5 Downloads -> Produkt-/Servicekontext und zurück.

5.6 Events -> allgemeiner Anfrageweg (GENERAL_SALES -> /contact).
    Spezialjourneys nicht vermischen.

5.7 Lead-Magnet-CTAs kontextuell platzieren.
    KEINE Magnet-Mechanik, kein Gating, kein Formular, keine Zustellung —
    das ist AP19/AP22. Fehlt der Baustein: DLI mit Owner AP19/AP22.

==================================================
6. CONSUMER
==================================================

Consumer-Seiten sind /consumer/vitamin-d3-spray, /consumer/hydrating-masks,
/consumer/inside-out-duo.

Miss VOR jeder Verlinkung selbst nach:

6.1 Locale-Verhalten.
    In PT06.3 gemessen: /de/consumer/* antwortet mit 301 auf /en/consumer/….
    Ein Link von einer deutschen Seite zwänge den Nutzer nach Englisch. Genau
    deshalb hat AP06 den Footer-Eintrag bewusst nicht gesetzt.
    Owner der Locale-Weiche ist AP10, der Strecke AP21.
    Ändert sich das Verhalten nicht, ist ein Link auf eine Redirect-Quelle
    unzulässig.

6.2 Indexierbarkeit.
    Gemessen: die drei Consumer-URLs stehen in der Sitemap, tragen KEIN
    noindex und sind ohne Passwort erreichbar. Ein Kommentar in src/App.tsx
    behauptet das Gegenteil — er ist sachlich falsch und gehört AP09/AP21.
    Verlasse dich auf die Messung, nicht auf den Kommentar.

==================================================
7. X10-REGEL UND DIE AP08/AP21-AUSNAHME
==================================================

Verbindlich:

  Alle innerhalb AP07 technisch direkt implementierbaren sichtbaren
  AP07-owned Linklabels sind x10 lokalisiert.

  Linkintegration an Call-Sites, die erst durch eine dokumentierte spätere
  AP08/AP21-owned i18n-Migration technisch möglich wird, darf ausschließlich
  als ownergebundenes DEFERRED_INTERNAL_LINK_INTEGRATION Gate offen bleiben.

  Deferred darf nicht zu UNINTENDED_DIRECT_URL_ONLY führen.

Ist die Quell-Call-Site heute nicht t()-/i18n-fähig und gehört genau diese
Migration AP08 und/oder AP21:

- den Link NICHT in zehn hartkodierten Varianten hineinpatchen;
- die Consumer-Komponente NICHT eigenmächtig i18n-fähig umbauen;
- KEINE AP08-owned Namespace-/t()-Migration ausführen;
- stattdessen ein DLI-xx in Section C anlegen, mit allen 15 Feldern.

==================================================
8. WANN DAS TROTZDEM PASS IST
==================================================

Alle sieben müssen gelten:

1. die technische Voraussetzung gehört nachweislich einem späteren Owner;
2. AP07 zieht diese Arbeit nicht vor;
3. das DLI ist vollständig in Section C registriert;
4. der Owner ist eindeutig;
5. Required before ist eindeutig;
6. Current safe state ist dokumentiert;
7. die Zielseite ist AKTUELL NICHT ungewollt DIRECT_URL_ONLY.

Zu (7): Die Seite muss heute über mindestens einen anderen bewussten,
funktionierenden Pfad erreichbar sein — Suche, ein bestehender interner Link,
die globale Navigation oder ein anderer kanonischer aktueller Pfad.
Suche ALLEIN ist nur zulässig, wenn Section B ausdrücklich dokumentiert, dass
die kontextuelle Linkintegration wegen der späteren technischen
Call-Site-Ownership deferred ist.

==================================================
9. WANN ES EIN ECHTER BLOCKER BLEIBT
==================================================

- die Seite bleibt ungewollt DIRECT_URL_ONLY;
- eine AP07-owned, bereits i18n-fähige Call-Site wäre vorhanden, du ergänzt den
  Link aber nicht;
- kein Owner existiert;
- Required before fehlt;
- Current safe state fehlt;
- es entstünde ein toter Link;
- die Deferred-Regel wird als Ausrede für fehlende AP07-eigene Arbeit benutzt.

==================================================
10. LINKTEXT UND VALIDIERUNG
==================================================

Sichtbare Linkbeschriftung sagt, wohin sie führt. "Mehr erfahren" allein ist als
einziger Text unzulässig; mit Kontext (aria-label oder umgebender Satz)
zulässig.

Validiere jedes neue Linkziel gegen die real definierten Routen und jeden Anker
gegen eine real vorhandene id.

0 tote Links · 0 tote Anker · 0 /services* · 0 Backlog-Ziele · 0 Chat-Ziele.

==================================================
11. GRENZEN
==================================================

AP15/AP16: kein Epigenetik-/Musterbefund-Inhalt, keine Panel-Fachlichkeit,
           keine Inquiry-Strecke.
AP17:      keine Artikelinhalte oder -struktur ändern.
AP19/AP22: keine Lead-Magnet-Mechanik.
AP09/AP10: keine Sitemap, kein noindex, keine Redirect-Weiche, keine Registry.
           src/App.tsx und server.ts NICHT ändern.
AP06:      die globale Navigation NICHT erweitern.
AP08:      keine i18n-Kernarchitektur, keine t()-Migration.

==================================================
12. TESTS
==================================================

- Komponententests je Verlinkungsrichtung.
- Guard: alle internen Linkziele der geänderten Seiten gegen die real
  definierten Routen; Anker gegen reale id.
- E2E: Diagnostik-Hub führt auf 9/9 Services; Epigenetik-Hub auf 3
  Vertiefungen und 6 Befunde; Stichprobe je Richtung liefert HTTP 200.

==================================================
13. QUALITÄT
==================================================

Typecheck · Lint (0 neue) · Prettier · Unit/Component · Build · SSR-Smoke ·
E2E · check:colors · check:nav-targets · check:shell-i18n ·
Search-Target-Guard.

==================================================
14. PASS-KRITERIEN
==================================================

1. Section B vollständig, jede Zeile mit Evidenz.
2. UNINTENDED_DIRECT_URL_ONLY = 0 für strategische, aktuell existente Seiten.
3. Diagnostik-Hub -> 9/9 Services.
4. Epigenetik-Hub -> 3 Vertiefungen + 6 Musterbefunde; Befunde -> Hub.
5. Artikel <-> Services in beide Richtungen.
6. Downloads <-> Kontext in beide Richtungen.
7. Events -> allgemeiner Anfrageweg.
8. Lead-Magnet-CTAs platziert, Mechanik nicht gebaut.
9. 0 tote Links, 0 tote Anker, 0 /services*, 0 Backlog-, 0 Chat-Ziele.
10. Direkt implementierbare sichtbare Linklabels x10; alles übrige als DLI mit
    allen 15 Feldern.

==================================================
15. STATE
==================================================

AP-STATE.md:
Last completed PT = PT07.3
Next task = AP07-CLOSURE
AP07 = IN_PROGRESS (NICHT COMPLETE)

==================================================
16. REPORT
==================================================

TASK RESULT PT07.3
PASS | FAIL | BLOCKED

Repository:
Branch:
HEAD:
Working tree:

Section B rows:
UNINTENDED_DIRECT_URL_ONLY:
INTENTIONAL_LIMITED_FINDABILITY:

Articles -> Services:
Services -> Articles:
Diagnostics hub -> Services:
Services -> Diagnostics:
Epigenetics hub -> deepening routes:
Epigenetics hub -> Befunde:
Befunde -> hub:
Epigenetics inquiry ownership:
Downloads -> context:
Context -> Downloads:
Consumer internal links:
Consumer forward-dependency:
Events -> inquiry:
Lead magnet CTA placement:
Lead magnet mechanics built: NONE

Link text quality:
Route validation:
Hash validation:
Dead links:
/services targets:

x10 link labels:
Section C new entries:
Deferred IDs:
False-ready statements:

src/App.tsx modified: NONE
server.ts modified: NONE
Shell/Header modified: NONE
Later AP implementation performed: NONE

Typecheck:
Lint:
Tests:
Build:
SSR smoke:
E2E:
Guards:

Decision locks:
State:
Next task: AP07-CLOSURE

Open blockers:
Open later-owner items:

Final verdict:

Danach STOPPEN.
NICHT AP07-CLOSURE starten.
```

---

# Prompt 4 — AP07-CLOSURE

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP07 — Suche und interne Findability
Task: AP07-CLOSURE
Modus: Closure / Verifikation / keine neue größere Fachimplementierung

AP07 umfasst:

- PT07.1 — Suchindex
- PT07.2 — SearchModal Accessibility/UX
- PT07.3 — Interne Verlinkung

Alle drei müssen PASS sein.

Fehlende größere Facharbeit NICHT im Closure nachholen.

AP08 NICHT starten.

==================================================
1. KONTEXT
==================================================

Lies zuerst building-docs/CONTEXT-INDEX.md.

Danach:

- AGENT-CONTRACT
- PROJECT-CONSTRAINTS
- MASTER-SCOPE, Abschnitt AP07
- work-packages/AP07.md, vollständig
- AP07-FINDABILITY-MATRIX.md, Sections A–D
- state/AP-STATE.md
- AP06 Closure
- ROUTING-CONTRACT · I18N-CONTRACT · SEO-CONTRACT · QUALITY-GATES
- aktuelle Such-/Link-/Test-Evidenz

==================================================
2. START-GATE
==================================================

Verifiziere:

- AP00–AP06 COMPLETE / Closure PASS
- AP07 IN_PROGRESS
- PT07.1 PASS · PT07.2 PASS · PT07.3 PASS
- Last completed = PT07.3
- Next = AP07-CLOSURE
- AP08 NOT STARTED
- Decision Locks 18/18
- Git state safe

==================================================
3. CLOSURE-MATRIX
==================================================

Prüfe C07-01 bis C07-43 nach work-packages/AP07.md §17.
Miss auf dem Closure-HEAD NEU, statt Werte aus den PT-Reports zu übernehmen.

C07-01 Predecessor
C07-02 Decision Integrity
C07-03 Search Coverage Matrix
C07-04 Static Coverage
C07-05 Service Coverage
C07-06 Sports Absent
C07-07 Article Coverage
C07-08 Article Slug Integrity
C07-09 Epigenetics Hub
C07-10 Epigenetics Deepening
C07-11 Six Befunde
C07-12 Downloads
C07-13 Events
C07-14 Consumer Search Intent
C07-15 Search Metadata x10
C07-16 Route Target Validity
C07-17 No /services Targets
C07-18 Route Registry Boundary
C07-19 Content Readiness Honesty
C07-20 Dialog Semantics
C07-21 Initial Focus
C07-22 Focus Trap
C07-23 Escape
C07-24 Focus Return
C07-25 Result Groups
C07-26 Empty State
C07-27 Status Announcements
C07-28 Keyboard
C07-29 Mobile
C07-30 Reduced Motion
C07-31 Search UI Copy x10
C07-32 Diagnostics Links
C07-33 Articles <-> Services
C07-34 Epigenetics Internal Links
C07-35 Downloads Context
C07-36 Events Conversion
C07-37 Lead Magnet Boundary
C07-38 Direct-URL-Only Gate
C07-39 Deferred Integration Integrity
C07-40 Consumer Internal Findability
C07-41 Quality
C07-42 Canonicality
C07-43 Scope Integrity & AP08 NOT STARTED

==================================================
4. C07-38 — DIRECT-URL-ONLY
==================================================

PASS nur wenn UNINTENDED_DIRECT_URL_ONLY = 0 für strategische, aktuell
existente Seiten.

Ein Deferred Internal Link Gate ALLEIN reicht NICHT.
Prüfe anhand Section B, dass für jede betroffene Seite ein realer, aktueller,
bewusster Findability-Pfad existiert und funktioniert.

==================================================
5. C07-39 — DEFERRED INTEGRATION
==================================================

Prüft ausschließlich SECTION C der AP07-FINDABILITY-MATRIX.

PASS nur wenn jeder Eintrag besitzt:

ID · Type · Description · Source route · Target route ·
Current route existence · Reason · Owner AP · Required before ·
Current safe state · Current findability · Launch/owner gate ·
AP07 closure blocker · Evidence · Status

und zusätzlich gilt:

- IDs eindeutig
- Status korrekt, niemals READY
- keine nicht existierende Route fälschlich als aktiv geführt
- kein Deferred Gate fälschlich RESOLVED, obwohl die Integration real fehlt
- keine ownerlose Deferred-Prosa außerhalb des Registers

==================================================
6. FINDABILITY-INVARIANTEN
==================================================

Prüfe mindestens semantisch FIND-01 bis FIND-30 nach AP07.md §13.

==================================================
7. ROUTENREALITÄT
==================================================

Behandle /epigenetics/grundlagen, /epigenetics/studienlage und
/epigenetics/unterlagen als AKTIVE aktuelle Routen — sie existieren.
Sie dürfen nicht als Future-Route-Deferral geführt sein.

Der Epigenetik-Body-Rückstand ist ein CONTENT-Thema mit Owner AP15/AP08 und
muss als SEARCH_DEFERRED_CONTENT registriert sein.

Prüfe, dass nirgends "Epigenetics x10 READY" o. ä. steht.

==================================================
8. KEIN VORWÄRTS-ZYKLUS
==================================================

Suche gezielt nach Aussagen, die bedeuten:

- "AP07 Closure wartet auf AP08"
- "AP07 Closure wartet auf AP15-Routen"
- "Consumer-Link muss x10 sein, auch wenn die Call-Site erst AP08 t()-fähig wird"
- "jede geplante Route muss schon in AP07 aktiv suchbar sein"

Erwartung: Cross-document forward-dependency contradictions = NONE.

==================================================
9. QUALITÄT
==================================================

Mindestens: typecheck · lint · prettier · tests · build · SSR smoke · E2E ·
check:colors · check:nav-targets · check:shell-i18n · Search-Target-Guard ·
x10-Parität · Route link validation.

==================================================
10. CLOSURE-KORREKTUREN
==================================================

Erlaubt nur:

- AP-STATE
- Closure Report
- Section D der Matrix
- kleiner Cross-Reference
- Status-Tippfehler

Nicht:

- Suchindex neu bauen
- SearchModal jetzt erst barrierefrei machen
- fehlende x10 Labels erstmals ergänzen
- Tests groß nachholen
- Verlinkung jetzt erst ergänzen

Wenn Fachsubstanz fehlt: FAIL oder BLOCKED.

==================================================
11. STATE BEI PASS
==================================================

- AP07 COMPLETE / Closure PASS
- Last completed PT = PT07.3
- Search index = ready
- SearchModal = accessible
- Internal linking = ready
- Deferred register = complete and owner-bound
- Next work package = AP08
- AP08 = NOT STARTED

==================================================
12. PASS-KRITERIEN
==================================================

PASS nur wenn alle 43 C07-Gates PASS sind und die DoD aus AP07.md §16
belegbar ist:

Keine strategisch wichtige, aktuell existente Relaunch-Seite ist ungewollt nur
per Direkt-URL erreichbar; die Suche ist a11y-tauglich und zehnsprachig.

==================================================
13. REPORT
==================================================

AP07 CLOSURE RESULT
PASS | FAIL | BLOCKED

Repository:
Branch:
HEAD:
Working tree:

AP00: AP01: AP02: AP03: AP04: AP05: AP06:

PT07.1:
PT07.2:
PT07.3:

Search coverage matrix:
Static coverage:
Service coverage:
Sports absent:
Article coverage:
Article slug integrity:
Epigenetics hub:
Epigenetics deepening routes:
Six Befunde:
Downloads:
Events:
Consumer search intent:
Search metadata x10:
Route target validity:
Dead targets:
/services targets:
Route registry boundary:
Search temporary mirror:
Content readiness honesty:

Dialog semantics:
Initial focus:
Focus trap:
Escape:
Focus return:
Result groups:
Empty state:
Status announcements:
Keyboard:
Mobile:
Reduced motion:
Search UI copy x10:

Diagnostics links:
Articles <-> Services:
Epigenetics internal links:
Downloads context:
Consumer internal findability:
Events conversion:
Lead magnet boundary:
Direct-url-only gate:
Deferred integration integrity:

Findability invariants:
Decision locks:
Canonicality:
Scope integrity:

Typecheck:
Lint:
Tests:
Build:
SSR smoke:
E2E:
Guards:

AP07 Definition of Done:
State:

AP07 status:
Next work package:
AP08 status:

Open blockers:
Open later-owner items:

Final verdict:

Wenn PASS:

AP07 is COMPLETE.
AP07 Closure is PASS.
AP08 is NOT STARTED.
The repository is ready for AP08.

Danach STOPPEN.
NICHT AP08 starten.
NICHT PT08.1 erzeugen.
```
