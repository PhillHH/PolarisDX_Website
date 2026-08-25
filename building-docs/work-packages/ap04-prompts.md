# AP04 — Vollständige Prompt-Kette

**Projekt:** PolarisDX Website Relaunch  
**Work Package:** AP04 — Content-Strategie, Content-Modell und Launch-Content-Readiness  
**Ausführung:** streng seriell  
**Reihenfolge:** `PT04.1 → PT04.2 → PT04.3 → PT04.4 → AP04-CLOSURE`  
**Startvoraussetzung:** AP03 Closure `PASS`  
**Nachfolger:** AP05 erst nach AP04 Closure `PASS`

---

# Prompt 1 — PT04.1 Content-Audit

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP04 — Content-Strategie, Content-Modell und Launch-Content-Readiness
Primärtask: PT04.1 — Content-Audit
Modus: Audit / Inventarisierung / begrenzte Dokumentmutation

WICHTIG:
Bearbeite ausschließlich PT04.1.

Dies ist der ERSTE Primärtask von AP04.

AP04 darf ausschließlich gestartet werden, wenn AP03-CLOSURE vollständig PASS war.

Ziehe PT04.2, PT04.3 oder PT04.4 NICHT vor.
Starte AP05 NICHT.

PT04.1 ist primär ein Audit- und Inventarisierungstask.
Inhaltliche Launch-Korrekturen gehören PT04.2–PT04.4.

==================================================
1. KANONISCHEN KONTEXT LADEN
==================================================

Lies ZUERST:

building-docs/CONTEXT-INDEX.md

Befolge danach exakt dessen Required-Context-Regeln.

Mindestens berücksichtigen:

1. building-docs/AGENT-CONTRACT.md
2. building-docs/PROJECT-CONSTRAINTS.md
3. relevante Abschnitte aus building-docs/scope/MASTER-SCOPE.md
   - Decision Lock
   - Projektleitplanken
   - globale Definition of Done
   - AP04 vollständig
   - relevante Hard Barriers
   - relevante Launch Gates
4. building-docs/work-packages/AP04.md
5. building-docs/state/AP-STATE.md
6. AP03 Closure / IA Handoff
7. kanonisches IA-Artefakt aus AP03
8. kanonischer Content-/Asset-Contract aus AP02
9. Routing-/SEO-/Lead-Contracts nur soweit für Contentstatus und Zielrollen erforderlich

Kein pauschales Read-all aller building-docs/.

==================================================
2. START-GATE
==================================================

Verifiziere:

- aktueller Branch
- aktueller HEAD
- git status --porcelain
- keine Merge-/Rebase-/Cherry-Pick-/Revert-Situation
- AP00 COMPLETE / PASS
- AP01 COMPLETE / PASS
- AP02 COMPLETE / Closure PASS
- AP03 COMPLETE / Closure PASS
- AP04 NOT STARTED
- Next work package = AP04
- 18/18 Decision Locks erhalten
- kanonisches IA-Artefakt vorhanden
- keine AP03-blockierenden offenen Fehler

Wenn AP03 Closure nicht eindeutig PASS ist:

TASK RESULT PT04.1
BLOCKED_PREDECESSOR

und AP04 NICHT starten.

==================================================
3. AUFTRAG
==================================================

Erstelle einen vollständigen Audit aller launchrelevanten Inhalte und Assets.

Ziel ist eine kanonische Launch-Content-Matrix, die sichtbar macht:

- was READY ist
- was PARTIAL ist
- was fehlt
- was Placeholder/Mock ist
- was veraltet oder redundant ist
- was regulatorisch/sensibel ist
- welche Sprachlücken bestehen
- welche Asset-Abhängigkeiten bestehen
- welche Inhalte nicht zum Launch gehören

Noch NICHT:
großflächig Content korrigieren oder übersetzen.

==================================================
4. CONTENT-MATRIX
==================================================

Prüfe zuerst, ob CONTEXT-INDEX.md bereits einen kanonischen Pfad festlegt.

Falls nicht, bevorzuge:

building-docs/CONTENT-MATRIX.md

Keine konkurrierende zweite Matrix erzeugen.

Mindestfelder:

- Content-ID
- Route / Seitenfamilie
- Seitentyp
- Content-Typ
- Current Status
- Target Status
- Quelle / Datei
- Current Locale Coverage
- Target Locale Coverage
- CTA Status
- Asset Dependency
- Sensitive/Regulatory Flag
- Placeholder/Mock Flag
- Outdated/Redundant Flag
- Launch Blocker
- Owner AP
- Notes

Statuswerte mindestens semantisch:

- READY
- PARTIAL
- MISSING
- PLACEHOLDER
- MOCK
- OUTDATED
- REDUNDANT
- SENSITIVE_REVIEW
- LEGACY_REMOVE
- BACKLOG_NOT_LAUNCH
- ASSET_BLOCKED

==================================================
5. REPOSITORY-AUDIT
==================================================

Prüfe gezielt:

- src/data/**
- src/content/**
- src/content/befunde/**
- src/content/downloads.json bzw. aktuellen Nachfolger
- public/locales/**
- src/i18n.ts
- src/i18n.client.ts
- src/i18n.server.ts
- public/downloads/**
- public/downloads/epigenetics/**
- relevante public-Bilder/OG-/Produktassets
- src/assets/**, soweit aktiv
- relevante Seitenkomponenten nur soweit sichtbare Copy hartcodiert ist
- Systemmail-/Autoresponder-/Template-Copy
- Consumer
- Epigenetics
- Diagnostics
- IglooPro
- Articles
- Events
- Testimonials
- About
- Contact
- Support
- Legal
- Spezialseiten

==================================================
6. HEADLINES UND KERNBOTSCHAFTEN
==================================================

Erfasse je launchrelevanter Seitenfamilie:

- H1
- Hero Message
- zentrale H2/H3-Aussagen
- Value Proposition
- Proof-/Trust-Aussagen
- Product-/Service-Kernbotschaften
- Epigenetics Kernbotschaften
- Consumer Kernbotschaften

Markiere:

- Widersprüche
- Duplikate
- veraltete Aussagen
- Placeholder
- harte unlokalisierte Texte

Nicht umschreiben, außer minimale Dokumentkorrektur ist nötig.

==================================================
7. CTA-AUDIT
==================================================

Erfasse alle sichtbaren CTA-Bezeichnungen.

Kategorien mindestens:

- GENERAL_SALES
- ORDER
- EPIGENETICS_INQUIRY
- DOWNLOAD
- SUPPORT
- CONTACT
- ROI
- CONTENT_NEXT_STEP

Gelockt:

GENERAL_SALES = „Angebot anfragen“

Abweichende Legacy-Texte markieren.

Nicht spezialisierte Journey-CTAs pauschal auf GENERAL_SALES normalisieren.

==================================================
8. FORM-/HELP-/SUCCESS-/ERROR-COPY
==================================================

Erfasse:

- Labels
- Placeholder
- Help Text
- Consent-/Hinweistexte
- Validation Copy
- Submit Copy
- Loading Copy
- Success Copy
- Error Copy
- Empty States
- Systemhinweise

Markiere insbesondere:

- Mocktexte
- unübersetzte Strings
- Chat-Verweise
- veraltete Mail-only-Aussagen
- falsche Journey-Zuordnung
- technische Fehlermeldungen im User-Text

==================================================
9. DOWNLOADS / RESOURCES
==================================================

Inventarisiere:

- Resource-ID
- Titel
- Datei
- Sprache
- Format
- Public/Gated Target Role
- Version/Datum
- referenzierende Seiten
- reale Existenz
- fehlende Varianten
- verwaiste Dateien

Prüfe speziell:

- Epigenetics Resources
- Consumer Assets
- Downloads-Katalog
- leere Kategorien
- Files ohne Katalogeintrag
- Katalogeinträge ohne Datei

Noch nichts neu übersetzen oder gated implementieren.

==================================================
10. ARTICLES / EVENTS / TESTIMONIALS
==================================================

Prüfe:

Articles:
- Bestand
- Metadaten
- Sprachumfang
- veraltete Inhalte
- CTA-/Crosslink-Rolle

Events:
- Daten
- aktuelle/vergangene Inhalte
- Sprachumfang
- zeitkritische Copy

Testimonials:
- Bestand
- Namen/Rollen
- Mock-/Dummy-Status
- Sprachumfang
- aktuelle Sichtbarkeit

Keine neue Editorial Strategy entwickeln.

==================================================
11. SENSITIVE / REGULATORY CLAIMS
==================================================

Markiere explizit:

- medizinische Claims
- diagnostische Leistungsversprechen
- klinische Aussagen
- regulatorische Hinweise
- Health Claims
- Epigenetics/Biological-Age-Aussagen
- IglooPro-Leistungsclaims

Je Claim:

- Quelle
- Route
- Sprache
- aktueller Text
- Sensitivity Flag
- Review Needed
- Owner/Review-Punkt, falls bereits kanonisch

Keine fachliche Aussage erfinden oder kreativ umformulieren.

==================================================
12. EXPLIZIT NICHT ZU ÜBERNEHMEN
==================================================

Als TARGET entfernen / LEGACY markieren:

- Garantie-/„garantierte Performance“-Band
- Chat-/HiHuman-Copy
- zeitlich alte Chat-Mock-Texte
- Deal/Voucher-Copy
- Case-Study-Copy
- Shop-Copy

soweit diese ausschließlich Legacy-/Backlog-Bestand sind.

Nicht notwendigerweise physisch löschen.

==================================================
13. CONSUMER X10 GAP-AUDIT
==================================================

Für alle drei Consumer-Familien prüfen:

de
en
pl
fr
it
es
pt
da
nl
cs

Erfasse pro Familie:

- Hero
- Value Proposition
- Product Copy
- Order CTA
- Order Form Copy
- Validation
- Success/Error
- FAQ
- Legal/Hints
- SEO-relevante sichtbare Copy
- Asset-/OG-Abhängigkeiten

Target bleibt x10, auch wenn Current State EN-only ist.

==================================================
14. EPIGENETICS GAP-AUDIT
==================================================

Prüfe:

- Hub
- drei Vertiefungsseiten
- sechs Musterbefunde
- Inquiry Copy
- Befund-Metadaten
- Resources
- Downloads
- visible PDFs
- Alt-/Asset-Metadaten

Target:
vollständig lokalisierbar und launchfähig.

==================================================
15. OWNER-AP-MAPPING
==================================================

Offene Implementierungsarbeit mindestens korrekt zuordnen:

- AP04 selbst: Content-/Locale-/Asset-Readiness
- AP05: Design System
- AP06: Navigation
- AP07: Search
- AP08: i18n-Plattform / Vollständigkeits-Hardening
- AP09: SEO
- AP10: Routing
- AP11–AP21: konkrete Seiten-/Bereichsowner
- AP22: Lead Platform
- AP23: Consent/Tracking
- AP27: automatisierte Quality Guards

Keine spätere Arbeit vorziehen.

==================================================
16. DECISION-INTEGRITY
==================================================

Erhalte 18/18 Decision Locks.

Besonders:

- 10 Sprachen
- Consumer indexierbar
- Consumer x10
- Epigenetics eigene Säule
- kein Chat
- IglooPro `CV < 2 %`
- Lead-Ziel Persistenz + CRM
- eigene Epigenetics Inquiry
- kein Garantie-Band
- GENERAL_SALES = „Angebot anfragen“
- gated Secondary Conversion
- Deal/Voucher/Case Studies/Shop Backlog
- Content Governance Backlog

==================================================
17. SCOPE-GRENZEN
==================================================

PT04.1 darf NICHT:

- massenhaft Übersetzungen schreiben
- Consumer komplett umbauen
- Epigenetics komplett umbauen
- Assets neu produzieren
- PDFs übersetzen
- Design-System ändern
- Header/Footer ändern
- Search ändern
- Routes ändern
- SEO implementieren
- Lead Platform implementieren
- Tracking ändern
- CMS einführen
- dauerhafte Content Governance einführen
- AP05 starten

==================================================
18. STATE-HANDOFF
==================================================

Bei PASS:

building-docs/state/AP-STATE.md

kompakt setzen auf:

- Work package: AP04
- Status: IN_PROGRESS
- Last completed PT: PT04.1
- Next PT: PT04.2
- Content audit: recorded
- Content matrix: initialized

AP04 bleibt IN_PROGRESS.
AP05 bleibt NOT STARTED.

==================================================
19. PASS-KRITERIEN
==================================================

PASS nur wenn:

- AP03 Closure PASS
- Content Matrix kanonisch vorhanden
- alle IA-Seitenfamilien abgedeckt
- Headlines/Kernbotschaften auditiert
- CTA-Bestand auditiert
- Forms/Help/Success/Error auditiert
- Downloads/Resources auditiert
- Articles auditiert
- Events auditiert
- Testimonials auditiert
- Placeholder/Mocks markiert
- outdated/redundant markiert
- Sensitive Claims markiert
- Guarantee Copy markiert
- Chat Copy markiert
- Backlog Content nicht reaktiviert
- Consumer x10-Lücken sichtbar
- Epigenetics Lücken sichtbar
- Owner APs vorhanden
- keine spätere Implementierung vorgezogen
- State auf PT04.2 vorbereitet

==================================================
20. ABSCHLUSSREPORT
==================================================

Antworte exakt:

TASK RESULT PT04.1
PASS | BLOCKED

Repository:
Branch:
HEAD:
Working tree:

AP03 closure:
Content matrix:
Routes/page families audited:
Headline/core-message coverage:
CTA audit:
Form/help copy audit:
Downloads/resources audit:
Articles audit:
Events audit:
Testimonials audit:
Placeholder/mock findings:
Outdated/redundant findings:
Sensitive/regulatory findings:
Guarantee-band copy:
Chat copy:
Backlog content:
Consumer x10 gaps:
Epigenetics content/asset gaps:
Launch blockers:
Owner-AP mapping:

Application source modified:
Content/locales modified:
Assets modified:
Later AP implementation performed: NONE

Decision locks:
State:
Open blockers:
Next task: PT04.2

Wenn PASS:
Beende den Lauf.

NICHT PT04.2 starten.
NICHT AP05 starten.
```

---

# Prompt 2 — PT04.2 Content-Typen standardisieren

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP04 — Content-Strategie, Content-Modell und Launch-Content-Readiness
Primärtask: PT04.2 — Content-Typen standardisieren
Modus: Content-Modell / begrenzte Content-/Data-Mutation / KEIN Design-Redesign

WICHTIG:
Bearbeite ausschließlich PT04.2.

PT04.1 muss vollständig PASS sein.

Ziehe PT04.3/PT04.4 NICHT vor.
Starte AP05 NICHT.

==================================================
1. KONTEXT
==================================================

Lies zuerst building-docs/CONTEXT-INDEX.md.

Danach mindestens:

- AGENT-CONTRACT
- PROJECT-CONSTRAINTS
- MASTER-SCOPE AP04 + Decision Locks + Hard Barriers
- AP04.md
- AP-STATE
- Content Matrix aus PT04.1
- AP03 IA-Artefakt
- AP02 Content-/Asset-Contract
- AP02 Lead-Contract nur soweit Form-/Gate-Copy betroffen ist

Kein Read-all.

==================================================
2. START-GATE
==================================================

Verifiziere:

- PT04.1 PASS
- AP04 IN_PROGRESS
- Last completed PT = PT04.1
- Next PT = PT04.2
- 18/18 Decision Locks
- keine fremden Änderungen überschreiben

Falls nicht:

TASK RESULT PT04.2
BLOCKED_PREDECESSOR

==================================================
3. AUFTRAG
==================================================

Standardisiere die fachlichen Content-Typen des Relaunchs.

Ziel:
spätere Seiten-APs können Content konsistent einsetzen,
ohne dass AP04 ein Design-System oder starre UI-Templates baut.

Verbindliche Typen:

1. Hero
2. Nutzen / Proof
3. Feature / Leistung
4. Prozess / Steps
5. FAQ
6. CTA
7. Download / Resource
8. Disclaimer / Regulatory Notice
9. Lead-Magnet-Gate
10. Form / Success / Error Copy

==================================================
4. HERO
==================================================

Mindestsemantik:

- optional Eyebrow/Kategorie
- H1
- kurze Value Proposition
- Supporting Copy
- Primary CTA
- optional Secondary CTA
- optional Proof

Regeln:

- klare Zielgruppe
- keine Garantieversprechen
- keine Chat-Copy
- lokalisierbar
- kein visueller AP05-Vorgriff

==================================================
5. BENEFIT / PROOF
==================================================

Trenne:

BENEFIT:
Was gewinnt der Nutzer?

PROOF:
Warum ist die Aussage glaubwürdig?

Proof darf nur auf belegtem Content basieren.

Mögliche Proof-Arten:

- Evidenz
- Kennzahl
- Testimonial
- Partner/Zertifikat
- fachliche Erklärung

Keine neue wissenschaftliche Behauptung erfinden.

==================================================
6. FEATURE / LEISTUNG
==================================================

Standardisiere:

- fachliche Leistung
- Eigenschaften
- Scope
- ggf. strukturierte Specs
- klare Trennung zu Benefit und CTA

Geeignet für:

- Diagnostics
- IglooPro
- Epigenetics

Keine Layout-Komponente bauen.

==================================================
7. PROCESS / STEPS
==================================================

Mindeststruktur:

- Reihenfolge
- Step Title
- Description
- optional Erwartungs-/Zeithinweis

Keine erfundenen Prozessschritte.

Consumer-, B2B- und Epigenetics-Prozesse dürfen unterschiedlich sein.

==================================================
8. FAQ
==================================================

Standard:

- echte Nutzerfrage
- klare Antwort
- keine versteckte Marketing-H1
- keine unbelegte regulatorische Aussage
- lokalisierbar
- spätere FAQ Structured Data möglich

Keine SEO-Implementierung.

==================================================
9. CTA-TAXONOMIE
==================================================

Mindestens:

- GENERAL_SALES
- ORDER
- EPIGENETICS_INQUIRY
- DOWNLOAD
- SUPPORT
- CONTACT
- ROI
- CONTENT_NEXT_STEP

GENERAL_SALES:
„Angebot anfragen“

Spezialjourneys nicht auf GENERAL_SALES reduzieren.

==================================================
10. DOWNLOAD / RESOURCE
==================================================

Content-Modell muss mindestens tragen:

- Resource ID
- Title
- Description
- Language
- Format
- Asset Reference
- Public/Gated
- Version/Date
- CTA
- optional File Size

Keine Gating-Technik implementieren.

==================================================
11. DISCLAIMER / REGULATORY NOTICE
==================================================

Standardisieren:

- klar getrennt vom Marketingtext
- sichtbar
- sprachlich vollständig
- keine hidden-only Strategie
- nur belegte fachliche Inhalte

Keine medizinische Governance einführen.

==================================================
12. LEAD-MAGNET-GATE
==================================================

Content-seitig definieren:

- Resource Value
- erwarteter Inhalt
- minimale Felder verständlich
- Privacy/Consent Note
- Submit CTA
- Success Copy
- Error Copy
- Delivery Expectation

Wichtig:

- kein Chat
- kein Mail-only-Versprechen
- Lead-Contract respektieren

Keine Backend-/Gate-Implementierung.

==================================================
13. FORM / SUCCESS / ERROR COPY
==================================================

Standardisiere:

- Label
- Help
- Placeholder nur wenn sinnvoll
- Validation
- Submit
- Loading
- Success
- Recoverable Error
- Non-Recoverable Error
- Privacy Note

Success muss fachlichen Systemzustand korrekt beschreiben.

Nicht einfach:
„E-Mail wurde gesendet“

wenn Erfolg laut Lead-Contract = persistente Annahme.

==================================================
14. REPOSITORY-MUTATION
==================================================

Erlaubt, wenn unmittelbar erforderlich:

- Content-/Data-Schema ergänzen
- i18n-Key-Strukturen bereinigen
- Content-Metadaten vereinheitlichen
- redundante Content-Konstanten konsolidieren

Nicht erlaubt:

- Design-System aus AP05
- neue Seitenlayouts
- neue Routes
- SEOHead-Neubau
- Lead Backend
- Header/Footer
- Search

==================================================
15. CONTENT-MATRIX
==================================================

Aktualisiere die Matrix:

- Content Type
- Standardization Status
- CTA Type
- Public/Gated
- Sensitive Flag
- Remaining Gap
- Owner AP

==================================================
16. DECISION-INTEGRITY
==================================================

18/18 erhalten.

Besonders:

- GENERAL_SALES = „Angebot anfragen“
- Consumer Order separat
- Epigenetics Inquiry separat
- gated Secondary Conversion
- kein Chat
- kein Guarantee Band
- IglooPro `CV < 2 %`
- Backlog-Bereiche bleiben Backlog
- kein CMS/Governance

==================================================
17. VERIFIKATION
==================================================

Wenn TS-/Data-Schemas geändert:

- Typecheck
- relevante Unit Tests

Immer:

- JSON parse
- keine Duplicate/invalid keys
- Git diff
- keine Route-/Design-/SEO-/Lead-Veränderung
- Content Matrix konsistent

==================================================
18. STATE
==================================================

Bei PASS:

- AP04 IN_PROGRESS
- Last completed PT = PT04.2
- Next PT = PT04.3
- Content audit: recorded
- Content types: standardized
- Content matrix: updated
- AP05 NOT STARTED

==================================================
19. PASS-KRITERIEN
==================================================

PASS nur wenn:

- PT04.1 PASS
- alle zehn Content-Typen definiert
- CTA-Taxonomie vorhanden
- GENERAL_SALES korrekt
- Consumer Order separat
- Epigenetics Inquiry separat
- Public/Gated getrennt
- Regulatory Type getrennt
- Form/Success/Error standardisiert
- keine Guarantee Copy
- kein Chat
- keine AP05-Designarbeit
- keine Routing-/SEO-/Lead-Plattform-Arbeit
- Content Matrix aktualisiert
- State auf PT04.3

==================================================
20. ABSCHLUSSREPORT
==================================================

Antworte exakt:

TASK RESULT PT04.2
PASS | BLOCKED

Repository:
Branch:
HEAD:
Working tree:

Predecessor PT04.1:
Content matrix:
Hero type:
Benefit/proof type:
Feature/service type:
Process/steps type:
FAQ type:
CTA type:
Download/resource type:
Disclaimer/regulatory type:
Lead-magnet-gate type:
Form/success/error copy type:
General sales CTA:
Consumer order CTA:
Epigenetics inquiry CTA:
Public/gated distinction:
Content/data schema changes:

Application/UI implementation performed: NONE
Routing/SEO implementation performed: NONE
Lead/backend implementation performed: NONE

Decision locks:
State:
Open blockers:
Next task: PT04.3

Wenn PASS:
Beende den Lauf.

NICHT PT04.3 starten.
NICHT AP05 starten.
```

---

# Prompt 3 — PT04.3 Launch-Content-Readiness

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP04 — Content-Strategie, Content-Modell und Launch-Content-Readiness
Primärtask: PT04.3 — Launch-Content-Readiness
Modus: Content-/i18n-Umsetzung

WICHTIG:
Bearbeite ausschließlich PT04.3.

PT04.1 und PT04.2 müssen vollständig PASS sein.

Ziehe PT04.4 NICHT vor.
Starte AP05 NICHT.

Dieser PT darf echte Content- und i18n-Mutationen durchführen,
soweit sie unmittelbar zur Launch-Readiness gehören.

==================================================
1. KONTEXT
==================================================

Lies zuerst:

building-docs/CONTEXT-INDEX.md

Danach mindestens:

- AGENT-CONTRACT
- PROJECT-CONSTRAINTS
- MASTER-SCOPE AP04 + Decision Locks
- AP04.md
- AP-STATE
- CONTENT-MATRIX
- AP03 IA
- AP02 Content-/Asset-Contract
- AP02 Lead-/Backend-Contract
- aktuelle i18n-Struktur
- Systemmail-/Autoresponder-Copy
- Consumer- und Epigenetics-Content

==================================================
2. START-GATE
==================================================

Verifiziere:

- PT04.1 PASS
- PT04.2 PASS
- AP04 IN_PROGRESS
- Last completed = PT04.2
- Next = PT04.3
- 18/18 Decision Locks
- keine fremden Änderungen überschreiben

Bei Fehler:

TASK RESULT PT04.3
BLOCKED_PREDECESSOR

==================================================
3. AUFTRAG
==================================================

Mache alle launchrelevanten Texte vollständig und launchfähig,
SOWEIT DAS INNERHALB DES AP04-SCOPES MÖGLICH IST.

Verbindliche Zielsprachen:

de
en
pl
fr
it
es
pt
da
nl
cs

EN-Fallback ist kein akzeptierter finaler Launchzustand.

==================================================
3.1 DREI ARBEITSKLASSEN — VERBINDLICHE TRENNUNG
==================================================

(korrigiert durch AP04-RECOVERY 2026-08-25;
Gate-Modell: AP04.md §11.0, Register: AP04.md §11.1)

Ordne JEDE gefundene Lücke genau einer dieser drei Klassen zu.

--------------------------------------------------
A. DIRECTLY ACTIONABLE IN PT04.3
--------------------------------------------------

Alles, was PT04.3 innerhalb von AP04.md §13.1 ohne einen späteren
Owner-AP vollständig abschließen kann.

Diese Dinge MUSS PT04.3 vollständig erledigen. Beispiele:

- fehlende Keys in bestehenden registrierten Namespaces
- leere Pflichtwerte
- Key-Parität gegen `de`
- Placeholder-/Mock-/TODO-Copy
- Chat-Copy in Locale-Dateien
- Garantie-/„garantierte Performance"-Copy
- CTA-Normalisierung inkl. Lokalisierung
- Success-/Error-Semantik
- Übersetzung nicht-sensibler UI-, Form- und Hilfetexte
- Reparatur korrupter sichtbarer Strings
- Vereinheitlichung der Schreibweise gelockter Claims
- hartkodierte sichtbare Copy, soweit AP04.md §13.3 sie minimal zulässt

Eine offene Lücke dieser Klasse ist ein FAIL, kein Deferred Gate.

--------------------------------------------------
B. DEFERRED BECAUSE LATER TECHNICAL OWNER
--------------------------------------------------

Technisch notwendige Arbeit, deren Owner laut MASTER-SCOPE.md
ein SPÄTERER AP ist.

PT04.3 darf das NICHT implementieren.
PT04.3 MUSS es mit Owner dokumentieren.

Kanonisch belegte Fälle:

- Consumer `t()`-Fähigkeit          -> AP08 PT08.2.3–.7 mit AP21
- `epigenetics` × 10 Rollout        -> AP08 PT08.3.1
- Befund-Inhalte × 10               -> AP08 PT08.3.2 mit AP16 PT16.1.6
- Systemtexte/Mails × 10 Runtime    -> AP08 PT08.5 mit AP22 (Sprachkontext)
- sprachabhängige Assets            -> AP08 PT08.6 mit AP19
- `NAMESPACES` / neuer Namespace    -> AP08 (I18N-CONTRACT.md M-01)

Verboten:
einen dieser Punkte als AP04-Blocker zu behandeln.

Verboten:
einen dieser Punkte selbst zu implementieren.

--------------------------------------------------
C. BLOCKED_CONTENT_APPROVAL
--------------------------------------------------

NUR wenn AP04-EIGENE Arbeit ohne eine benötigte externe/fachliche
Freigabe nicht sinnvoll abgeschlossen werden kann.

Beispiel:
ein regulatorischer Pflichthinweis, den AP04 selbst platzieren müsste,
existiert in KEINER Sprache und dürfte nur erfunden werden.

NICHT als BLOCKED_CONTENT_APPROVAL behandeln:

- eine fehlende Fachübersetzung, deren Owner-AP später liegt
  -> das ist ein DEFERRED_CONTENT_APPROVAL_GATE, kein PT04.3-Blocker

Fachlich freizugebende Übersetzungen (Epigenetik-Fachtexte,
Musterbefunde, Artikel-Volltexte) sind DEFERRED, nicht BLOCKED,
solange sie einen benannten Owner-AP und ein Required-before-Gate haben.

--------------------------------------------------
KLASSIFIKATIONSREGEL
--------------------------------------------------

Frage bei jeder Lücke in dieser Reihenfolge:

1. Kann AP04 das innerhalb §13.1 selbst abschließen?
   ja -> Klasse A, jetzt erledigen

2. Gehört die technische Voraussetzung laut MASTER-SCOPE einem späteren AP?
   ja -> Klasse B, DEFERRED_IMPLEMENTATION_GATE

3. Fehlt eine fachliche/regulatorische Freigabe?
   ja und Owner-AP später -> DEFERRED_CONTENT_APPROVAL_GATE
   ja und AP04 selbst wäre zuständig -> BLOCKED_CONTENT_APPROVAL

Unklassifiziert ist niemals zulässig.

==================================================
4. PLACEHOLDER / MOCK CLEANUP
==================================================

Suche repositoryweit auf launchrelevanten Flächen nach:

- lorem ipsum
- TODO Copy
- Coming soon
- Mock
- Demo
- Placeholder
- temporären Zeitangaben
- „in den nächsten Tagen“
- Chat-Mock-Copy
- Dummy-Testimonials
- Test-/Preview-Texte

Jeden aktiven sichtbaren Treffer:

- durch belegten Launch-Content ersetzen
- oder aus Target-Content entfernen
- oder als Blocker markieren, wenn fachlicher Input fehlt

Keine Product Facts erfinden.

==================================================
5. CHAT-COPY
==================================================

Target muss chatfrei sein.

Entferne/nicht lade launchrelevante:

- HiHuman Copy
- ChatWidget Copy
- Chat CTAs
- Chat Support-Texte
- Chat-Mock-Zeitangaben

Technische Entfernung des Backends nur wenn explizit AP04-Contentdatei,
sonst späterer Owner.

Keine neue Chat-Alternative erfinden.

==================================================
6. GUARANTEE-BAND-COPY
==================================================

Entferne/nicht übernehme:

- „garantierte Performance“
- Garantie-CTA-Band-Copy
- äquivalente Legacy-Sales-Versprechen

Nicht ersetzen durch neues Garantieversprechen.

==================================================
7. IGLOOPRO CV < 2 %
==================================================

Gelockt:

`CV < 2 %`

Regeln:

- semantisch konsistent erhalten
- nicht zu „garantiert“ verschärfen
- nicht eigenmächtig entfernen
- nicht wissenschaftlich neu bewerten
- Übersetzungen dürfen Aussage nicht verändern

==================================================
8. SENSITIVE / REGULATORY COPY
==================================================

Für markierte sensitive Claims:

- nur belegte Textbasis verwenden
- Pflichttexte erhalten
- Bedeutung über Sprachen konsistent
- keine kreative medizinische Neuaussage

Wenn externe/fachliche Freigabe zwingend fehlt:

TASK RESULT PT04.3
BLOCKED_CONTENT_APPROVAL

Nicht erfinden.

==================================================
9. X10 LOCALE-PARITÄT
==================================================

Für jede launchrelevante Content-Einheit:

- alle 10 Zielsprachen
- fehlende Keys ergänzen
- leere Werte schließen
- sichtbare Hardcoded Strings in kanonische i18n-Schicht überführen, wenn nötig
- keine unregistrierten Namespaces
- keine falschen Namespace-Abhängigkeiten
- keine dauerhafte EN-only Abhängigkeit

Bestehende gute Übersetzungen nicht unnötig ersetzen.

==================================================
10. CONSUMER X10
==================================================

Alle drei Consumer-Familien vollständig in:

de,en,pl,fr,it,es,pt,da,nl,cs

Mindestens:

- Hero
- Value Proposition
- Product Copy
- Order CTA
- Form/Order Copy
- Validation
- Success/Error
- FAQ, falls vorhanden
- sichtbare SEO-relevante Copy
- Legal/Hints
- Alt-/Asset-Copy soweit textlich

Wichtig:

Routing kann aktuell noch EN-only sein.
Routing Debt = AP10/AP21.

Keine Route ändern.

GRENZE (AP04-RECOVERY):

Sind die Consumer-Seiten hartkodiert (0 × `useTranslation`),
ist x10-Content technisch nicht bereitstellbar,
ohne zuerst die `t()`-Fähigkeit herzustellen.

Diese ist wörtlich AP08 PT08.2.3–.7.
I18N-CONTRACT.md M-03: erst lokalisierbar machen, dann übersetzen.
I18N-CONTRACT.md M-01: `NAMESPACES` ist AP08-Einzeleigentum.

PT04.3 daher:

- KEINEN Consumer-Namespace anlegen
- KEINE Consumer-Copy in einen fremden Namespace legen
- Consumer-Content vollständig auditieren
- Zielbild je Content-Element dokumentieren
- DG-03 mit Owner AP08 PT08.2 / AP21 registrieren
- Consumer NICHT als x10 oder READY ausweisen

Das ist Klasse B, kein Blocker.

==================================================
11. EPIGENETICS X10
==================================================

Launchrelevanter Webcontent x10:

- Hub
- drei Vertiefungen
- Inquiry Copy
- Musterbefund-UI-Texte
- Befund-Metadaten
- Resource-Beschreibungen
- CTA
- Success/Error

Spezialisierte große Befunddaten gemäß Content-Contract behandeln.

Nicht unnötig in globale Bundles verschieben.

GRENZE (AP04-RECOVERY):

- UI-, Struktur- und CTA-Keys der Epigenetik: Klasse A, jetzt schließen
- Pflichthinweise als `RN-xx` registrieren, keinen entfernen
- medizinische/regulatorische Fachtexte: Klasse C -> DG-01, Owner
  Fachfreigabe / AP15 / AP08 PT08.3.1
- Befund-Inhalte × 10: Klasse B + C -> DG-02, Owner AP16 PT16.1.6 /
  AP08 PT08.3.2 / Fachfreigabe
- `BefundSprachen` NICHT umtypisieren — das ist AP16

Epigenetik NICHT als x10 oder READY ausweisen.

==================================================
12. DIAGNOSTICS / IGLOOPRO / CORPORATE / CONTENT X10
==================================================

Prüfe und schließe Lücken für:

- Homepage
- Diagnostics Hub
- neun Services
- IglooPro
- About
- Contact
- Support
- Legal
- Articles
- Events
- Downloads/Resources
- scope-verbindliche Spezialseiten

Ausnahmen nur wenn kanonisch ausdrücklich erlaubt.

==================================================
13. CTA-LOKALISIERUNG
==================================================

GENERAL_SALES:
lokalisierte Entsprechung von „Angebot anfragen“

Spezial-CTAs:

- ORDER
- EPIGENETICS_INQUIRY
- DOWNLOAD
- SUPPORT
- CONTACT
- ROI

Regeln:

- semantisch konsistent
- keine Garantiebegriffe
- keine Sales-CTA-Drift
- Consumer nicht zum B2B-CTA machen

==================================================
14. FORM / SUCCESS / ERROR COPY
==================================================

Vervollständige x10:

- Labels
- Help
- Validation
- Submit
- Loading
- Success
- Recoverable Error
- Non-Recoverable Error
- Privacy Note

Success State muss fachlich stimmen.

Lead angenommen ≠ zwingend Mail bereits erfolgreich.

==================================================
15. AUTORESPONDER / SYSTEMMAIL
==================================================

Prüfe reale launchrelevante Flows:

- General Inquiry
- Contact
- Support
- Epigenetics Inquiry
- Consumer Order
- gated Resource Delivery
- ROI/Report, falls Launch-Scope

Für benötigte Sprachen:

- Subject
- Greeting
- Body
- Next-step expectation
- Failure/Support information
- Footer/legal hints

Regeln:

- keine Secrets
- keine technischen Stacktraces
- kein Chat
- keine EN-only Systemmail bei x10 Journey
- Lead-Contract respektieren

Keine Provider-/Queue-Implementierung ändern.

GRENZE (AP04-RECOVERY):

Empfängt kein Endpunkt eine Sprache, ist eine sprachrichtige Systemmail
technisch nicht herstellbar.

`language` ist nach LEAD-DATA-CONTRACT.md §5.2 Pflichtfeld der
Journey-Kategorie; über seine Einführung entscheidet AP22 (§5.1).

PT04.3 daher:

- Lead-API-Vertrag NICHT ändern
- KEINE unverdrahtete 10-sprachige Copy-Struktur erfinden
- Textrollen, Erwartungssemantik und Pflichthinweise definieren
- DG-04 mit Owner AP22 (Sprachkontext) und AP08 PT08.5 registrieren

Das ist Klasse B, kein Blocker.

==================================================
16. SICHTBARE PDF-/DOWNLOAD-LÜCKEN
==================================================

Für jede sichtbar angebotene sprachabhängige Resource:

- passende Sprachvariante vorhanden?
- Copy behauptet keine falsche Verfügbarkeit?
- fehlt Datei → Launch Item / Blocker

Physische Assetarbeit folgt PT04.4.

Keine falsche Sprachdatei als stillen Fallback nutzen.

Fehlende Sprachvariante -> DEFERRED_ASSET_GATE (DG-07),
Owner AP08 PT08.6 / AP19 / ggf. Fachfreigabe.
Mit Asset, fehlender Variante, Owner, Required-before und
sicherem Ist-Verhalten registrieren.

==================================================
17. CONTENT-MATRIX
==================================================

Aktualisiere:

- Locale Coverage
- Placeholder Status
- CTA Status
- Sensitive Status
- System Copy Status
- Consumer Status
- Epigenetics Status
- Launch Blocker
- Asset Dependency

Zusätzlich das Deferred-Gate-Register (CONTENT-MATRIX.md §24)
mit je Gate:

- ID
- Description
- Current state
- Why AP04 cannot own completion
- Gate type
- Owner AP
- Required before
- Safe current behavior
- Launch blocker yes/no
- AP04 closure blocker yes/no
- Evidence

Kein Deferred Gate als READY oder erledigt markieren.

==================================================
18. VALIDIERUNG
==================================================

Mindestens:

- JSON parse
- i18n key parity
- namespace registration
- missing/empty translation scan
- hardcoded visible strings scan
- placeholder/mock scan
- Chat/Guarantee scan
- CTA consistency
- Consumer: Audit- und Owner-Handoff-Vollständigkeit (nicht Runtime-x10)
- Epigenetics: AP04-fähige Keys geschlossen, Pflichthinweise registriert
- Systemmail language coverage (Ist-Erhebung, nicht Herstellung)
- Deferred-Gate-Vollständigkeit: ID, Typ, Owner, Required-before,
  sicheres Ist-Verhalten

Wenn Source/i18n verändert:

- Typecheck
- relevante Tests
- Production Build
- SSR/Hydration Smoke

Keine produktiven Side Effects.

==================================================
19. SCOPE-GRENZEN
==================================================

Nicht:

- Design-System
- Header/Footer
- Search
- Routes
- Redirects
- SEO-Plattform
- Lead Persistence/CRM/Queue
- Tracking
- Deployment
- CMS
- dauerhafte Governance
- AP05

==================================================
20. STATE
==================================================

Bei PASS:

- AP04 IN_PROGRESS
- Last completed PT = PT04.3
- Next PT = PT04.4
- Launch content: x10 ready or explicitly blocked
- CTA/system-copy readiness: recorded
- Content matrix: updated
- AP05 NOT STARTED

==================================================
21. PASS-KRITERIEN
==================================================

(korrigiert durch AP04-RECOVERY 2026-08-25)

PASS nur wenn:

- PT04.1 PASS
- PT04.2 PASS
- ALLE Klasse-A-Aufgaben (§3.1) abgeschlossen
- Key-Parität gegen `de` ohne Lücke
- keine leeren Pflichtwerte
- keine sichtbaren AP04-eigenen Placeholder/Mocks
- keine Target Chat Copy
- keine Target Guarantee Band Copy
- IglooPro `CV < 2 %` konsistent
- Pflichttexte erhalten und als `RN-xx` registriert
- GENERAL_SALES lokalisiert
- Specialized CTAs korrekt und rollenrein über alle Sprachen
- Form/Success/Error konsistent, soweit AP04-fähig
- Success-Semantik entspricht dem Lead-Contract
- keine neue unregistrierte i18n-Struktur, `NAMESPACES` unverändert
- ALLE später technisch oder fachlich abhängigen Lücken als DEFERRED
  mit eindeutigem Owner dokumentiert
- jedes Deferred Gate mit ID, Typ, Lücke, Owner, Required-before und
  sicherem Ist-Verhalten
- keine spätere AP-Arbeit vorgezogen
- Build/Tests je Änderung grün
- State auf PT04.4

PT04.3 darf NICHT PASS sein, wenn:

- eine innerhalb AP04 selbst lösbare Lücke offen ist
- ein Gap unklassifiziert ist
- ein Deferred Gate keinen Owner hat
- eine Lücke fälschlich als READY markiert ist
- ein EN-Fallback als erledigt gewertet wird
- tatsächliche regulatorische Unsicherheit in AP04-eigener Copy
  ignoriert wurde
- spätere Owner-AP-Arbeit vorgezogen wurde

AUSDRÜCKLICH KEIN GRUND FÜR FAIL ODER BLOCKED:

- Consumer noch nicht x10, weil AP08 PT08.2 aussteht
- Epigenetik-Fachtexte noch nicht übersetzt und freigegeben
- Musterbefunde noch nicht x10, weil AP16 das Sprachmodell besitzt
- Systemmails einsprachig, weil AP22 den Sprachkontext einführt
- Artikel-Volltexte in einzelnen Sprachen noch englisch
- sprachabhängiges Asset fehlt und ist als DEFERRED_ASSET_GATE geführt

sofern jeweils nach §3.1 klassifiziert und mit Owner registriert.

==================================================
22. ABSCHLUSSREPORT
==================================================

Antworte exakt:

TASK RESULT PT04.3
PASS | BLOCKED

Repository:
Branch:
HEAD:
Working tree:

Predecessor PT04.1:
Predecessor PT04.2:
Content matrix:
Placeholder/mock content remaining:
Chat copy remaining:
Guarantee-band copy remaining:
IglooPro CV < 2 % consistency:
Regulatory/mandatory copy:
Locale coverage:
Consumer x10:
Epigenetics x10:
Diagnostics/IglooPro/corporate coverage:
CTA localization:
Form/success/error localization:
Systemmail/autoresponder localization:
Visible PDF/download language gaps:
i18n validation:
Hardcoded visible string findings:

Class A (directly actionable) — completed:
Class A — remaining: NONE
Deferred implementation gates:
Deferred content approval gates:
Deferred asset gates:
Launch blockers carried forward:
Owner mapping:
False-ready gaps: NONE
Unclassified gaps: NONE

Application source modified:
Content/locales modified:
Assets modified:
Routing/SEO implementation performed: NONE
Lead/backend implementation performed: NONE
Later AP implementation performed: NONE

Decision locks:
State:
Open blockers:
Next task: PT04.4

Wenn PASS:
Beende den Lauf.

NICHT PT04.4 starten.
NICHT AP05 starten.
```

---

# Prompt 4 — PT04.4 Asset-Readiness

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP04 — Content-Strategie, Content-Modell und Launch-Content-Readiness
Primärtask: PT04.4 — Asset-Readiness
Modus: Asset-Audit + gezielte Asset-Mutation

WICHTIG:
Bearbeite ausschließlich PT04.4.

PT04.1, PT04.2 und PT04.3 müssen vollständig PASS sein.

Dies ist der LETZTE Primärtask von AP04.

Danach folgt ausschließlich:
AP04-CLOSURE

Starte Closure NICHT selbstständig.
Starte AP05 NICHT.

==================================================
1. KONTEXT
==================================================

Lies zuerst CONTEXT-INDEX.md.

Danach mindestens:

- AGENT-CONTRACT
- PROJECT-CONSTRAINTS
- MASTER-SCOPE AP04
- AP04.md
- AP-STATE
- CONTENT-MATRIX
- AP03 IA
- AP02 Content-/Asset-Contract
- SEO-Contract für OG-/Social-Asset-Rollen
- aktuelle public/assets/downloads-Struktur

==================================================
2. START-GATE
==================================================

Verifiziere:

- PT04.1 PASS
- PT04.2 PASS
- PT04.3 PASS
- AP04 IN_PROGRESS
- Last completed = PT04.3
- Next = PT04.4
- 18/18 Decision Locks
- keine fremden Änderungen überschreiben

Bei Fehler:

TASK RESULT PT04.4
BLOCKED_PREDECESSOR

==================================================
3. AUFTRAG
==================================================

Mache launchrelevante Assets technisch und sprachlich launchfähig.

Ziele:

- vollständiges Bildinventar
- Alt-Text-Readiness
- technische Bild-Readiness
- Consumer OG-/Produktbilder
- versionierte Downloads
- sprachabhängige Asset-Parität
- keine broken references
- keine falsch geschützten gated Assets
- sichere Behandlung verwaister Assets

==================================================
4. BILDINVENTAR
==================================================

Inventarisiere mindestens:

- Hero Images
- Product Images
- Service Images
- Article Images
- Event Images
- Epigenetics Images
- Musterbefund Visuals
- Consumer Product Images
- OG/Social Images
- Logos/Icons soweit contentrelevant

Je Asset:

- Pfad / Asset ID
- referenzierende Seite
- Zweck
- Sprache, falls texttragend
- Alt Text Source
- dekorativ ja/nein
- Width
- Height
- Format
- Dateigröße
- Launchstatus

==================================================
5. ALT-TEXTE
==================================================

Regeln:

Informativ:
sinnvolle Beschreibung des Informationszwecks.

Dekorativ:
leerer Alt-Text / semantisch korrekte Behandlung.

Nicht:

- Keyword-Stuffing
- Dateinamen als Alt
- irrelevante Marketingtexte

Lokalisieren, wenn sprachlich relevant.

==================================================
6. TECHNISCHE BILD-READINESS
==================================================

Prüfe:

- überdimensionierte Rasterbilder
- intrinsic dimensions
- Format
- unnötige Dateigröße
- potenzielle Layout-Shifts
- falsche Nutzung von OG-Bildern als Contentbilder

Zulässig:

- verlustarme/visuell gleichwertige Optimierung
- bestehend unterstützte Varianten
- Metadatenkorrektur

Keine neue Bildpipeline erfinden.
AP25 bleibt Performance Owner.

==================================================
7. CONSUMER PRODUKT-/OG-ASSETS
==================================================

Für jede der drei Consumer-Familien:

- geeignetes Product Image
- geeignetes OG/Social Image
- keine falschen generischen Bilder
- technische Existenz
- brauchbare Dimensionen
- Alt/Description-Metadatenquelle
- x10 sinnvoll nutzbar

Texttragende Bilder:
keine falsche Sprachvariante.

SEO-Ausgabe selbst bleibt AP09/AP21.

==================================================
8. DOWNLOAD-VERSIONIERUNG
==================================================

Für launchrelevante PDFs/ZIPs:

- stabile Resource ID
- reale Datei
- Version / Aktualitätsinfo
- nachvollziehbarer Dateiname
- keine widersprüchlichen Duplikate
- aktive Linkreferenzen
- kein temporärer lokaler Dateiname
- keine unnötig riskante Umbenennung

Wenn Rename nötig:
alle kanonischen Referenzen sicher aktualisieren.

==================================================
9. DOWNLOAD-KATALOG
==================================================

Prüfe Katalog vs reale Dateien:

- Eintrag ohne Datei
- Datei ohne Eintrag
- falsche Sprache
- falsches Format
- falsche Dateigröße/Metadaten
- leere Kategorien
- veraltete Einträge
- Public/Gated Status

Leere `tech`-Kategorie nur klassifizieren.

Keine neue Download-Produktstrategie erfinden.

==================================================
10. SPRACHABHÄNGIGE ASSET-PARITÄT
==================================================

Für sprachabhängige launchrelevante Assets prüfen:

de
en
pl
fr
it
es
pt
da
nl
cs

Besonders:

- PDFs
- ZIPs
- texttragende Bilder
- Product Graphics mit Text
- rechtlich/fachlich sprachspezifische Downloads

Nicht jedes neutrale Bild braucht zehn Kopien.

Fehlende Varianten nicht still durch falsche Sprache ersetzen.

==================================================
11. EPIGENETICS ASSET-PARITÄT
==================================================

Aktuellen Zustand neu verifizieren.

Für jede sichtbar angebotene Epigenetics Resource:

A. erforderliche Sprachvarianten vorhanden

oder

B. Ressource wird nicht fälschlich als lokalisierte Variante angeboten,
sofern Scope dies erlaubt

oder

C. BLOCKED_CONTENT_ASSET_APPROVAL,
wenn externe fachliche Erstellung/Freigabe fehlt

Keine fachlichen PDFs eigenmächtig übersetzen.

==================================================
12. PUBLIC VS GATED
==================================================

Prüfe:

PUBLIC:
direkte öffentliche Asset-URL zulässig.

GATED:
Ziel-Journey muss Gate/Delivery verwenden.

Nicht zulässig:
gated Resource wird einfach über erratbare öffentliche URL „geschützt“.

Asset-Metadaten und Links mit Content-/Lead-Contract konsistent halten.

Keine Backend-Gating-Implementierung.

==================================================
13. BROKEN ASSET REFERENCES
==================================================

Deterministisch prüfen:

- Datei existiert
- Groß-/Kleinschreibung korrekt
- keine toten relativen Pfade
- keine absoluten lokalen Pfade
- korrekte Locale
- keine Consumer EN-only Assetrefs im Target
- keine Epigenetics Resource auf fehlende Sprachdatei
- keine broken imports

==================================================
14. ORPHAN / LEGACY ASSETS
==================================================

Nur entfernen, wenn sicher:

- nicht referenziert
- kein kanonisches Evidence-/Source-Artefakt
- kein Backlog-Bestand, der bewusst behalten werden soll
- keine spätere Owner-Abhängigkeit
- keine aktive Download-URL
- keine Dokumentationsreferenz

Nicht pauschal Deal/Voucher/Case Studies/Shop Dateien löschen.

Backlog bleibt Backlog.

==================================================
15. OG / SOCIAL CONSISTENCY
==================================================

Prüfe:

- Default OG
- Epigenetics OG
- Consumer OG
- IglooPro/Product OG, falls vorgesehen
- Article Images

AP04:
Assets + Metadaten bereitstellen.

AP09:
finale SEO-Ausgabe.

==================================================
16. CONTENT-MATRIX
==================================================

Final aktualisieren:

- Asset Status
- Alt Status
- OG/Product Status
- Download Version
- Locale Asset Coverage
- Broken Ref
- Public/Gated
- Launch Blocker
- Owner AP

==================================================
17. VALIDIERUNG
==================================================

Mindestens:

- Asset existence scan
- Download reference scan
- image dimension inspection
- broken import/path scan
- build
- relevante page smokes
- keine 404 assets
- no missing required locale asset
- git diff

Keine produktiven Side Effects.

==================================================
18. SCOPE-GRENZEN
==================================================

Nicht:

- SEOHead implementieren
- Design-System redesignen
- Routes ändern
- Header/Footer ändern
- Search ändern
- Lead Backend
- Tracking
- Deployment
- CMS
- AP05

==================================================
19. STATE
==================================================

Bei PASS:

- AP04 IN_PROGRESS
- Last completed PT = PT04.4
- Next task = AP04-CLOSURE
- Launch content: recorded
- Asset readiness: recorded
- Content matrix: final for closure
- AP05 NOT STARTED

AP04 noch NICHT COMPLETE setzen.

==================================================
19.1 DEFERRED_ASSET_GATE
==================================================

(neu durch AP04-RECOVERY 2026-08-25;
Gate-Modell AP04.md §11.0, Register AP04.md §11.1)

Eine fehlende Asset-Sprach-/Formatvariante blockiert AP04 NICHT,
wenn alle vier Bedingungen erfüllt sind:

1. AP04 hat das Asset korrekt auditiert;
2. die fehlende Variante hat nachweislich einen späteren
   Content-/Owner-AP oder eine externe Freigabe;
3. es wird KEINE falsche Sprachvariante still ausgeliefert;
4. es entsteht KEINE READY-Aussage für die fehlende Variante.

Registriere dann ein DEFERRED_ASSET_GATE mit:

- ID
- Asset
- fehlende Sprache/Variante
- Owner AP
- required before (Launch-Gate)
- current safe behavior

Kanonische Owner sprachabhängiger Assets:
AP08 PT08.6 (sichtbare Asset-Lücken für 10 Sprachen),
AP19 (Resource Center / Ressourcenmodell),
ggf. externe fachliche Freigabe.

ECHTER AP04-BLOCKER BLEIBT:

- eine gebrochene AKTIVE Asset-Referenz, die AP04 selbst reparieren kann
- ein Asset-Duplikat über zwei Bäume, das AP04 selbst auflösen kann
- ein verwaistes launch-störendes Asset, das AP04 sicher entfernen kann
- eine falsche READY-/Verfügbarkeitsaussage

Diese sind Klasse A und müssen in PT04.4 erledigt werden.

==================================================
20. PASS-KRITERIEN
==================================================

(korrigiert durch AP04-RECOVERY 2026-08-25)

PASS nur wenn:

- PT04.1–PT04.3 PASS
- Bildinventar vollständig
- Alt-Texte vollständig klassifiziert
- technische Bild-Readiness geprüft
- Consumer Product/OG Images vorhanden ODER als Deferred Asset Gate
  mit Owner registriert
- Downloads versioniert, soweit AP04-fähig
- Katalog konsistent
- sprachabhängige Assets vollständig ODER als DEFERRED_ASSET_GATE
  nach §19.1 registriert
- Epigenetics Asset-Lücken behandelt oder deferred mit Owner
- KEINE broken aktiven Assetrefs
- orphan/legacy Assets sicher behandelt
- Public/Gated korrekt
- kein stiller Fremdsprach-Fallback als erledigt ausgewiesen
- kein Deferred Asset Gate ohne Owner oder Required-before
- keine Backlog-Reaktivierung
- keine spätere Implementierung vorgezogen
- Build/Smokes grün
- State auf Closure vorbereitet

PT04.4 darf NICHT PASS sein, wenn:

- eine tote aktive Asset-Referenz offen bleibt
- eine fehlende Variante als vorhanden ausgewiesen wird
- ein Asset-Gap unklassifiziert ist
- ein Deferred Asset Gate keinen Owner hat

==================================================
21. ABSCHLUSSREPORT
==================================================

Antworte exakt:

TASK RESULT PT04.4
PASS | BLOCKED

Repository:
Branch:
HEAD:
Working tree:

Predecessor PT04.1:
Predecessor PT04.2:
Predecessor PT04.3:
Content matrix:

Image inventory:
Alt-text coverage:
Responsive image readiness:
Consumer product images:
Consumer OG assets:
Epigenetics assets:
Download catalog:
Download versioning:
Language-dependent asset parity:
Missing asset variants:
Deferred asset gates:
Launch blockers carried forward:
Owner mapping:
False-ready gaps: NONE
Unclassified asset gaps: NONE
Broken asset references:
Orphan/launch-disruptive assets:
Public/gated asset references:

Application source modified:
Content/locales modified:
Assets modified:
SEO/design/routing implementation performed: NONE
Later AP implementation performed: NONE

Decision locks:
State:
Open blockers:
Next task: AP04-CLOSURE

Wenn PASS:
Beende den Lauf.

NICHT AP04-CLOSURE starten.
NICHT AP05 starten.
```

---

# Prompt 5 — AP04-CLOSURE

```text
Du arbeitest im Repository:

/home/phillip/01polaris-preview

Projekt: PolarisDX Website Relaunch
Work Package: AP04 — Content-Strategie, Content-Modell und Launch-Content-Readiness
Task: AP04-CLOSURE
Modus: Closure / Verifikation / keine neue größere Fachimplementierung

WICHTIG:
Dies ist der separate Closure-Lauf für AP04.

AP04 besitzt vier Primärtasks:

- PT04.1 — Content-Audit
- PT04.2 — Content-Typen standardisieren
- PT04.3 — Launch-Content-Readiness
- PT04.4 — Asset-Readiness

Alle vier müssen vollständig PASS sein.

Der Closure-Lauf darf keine fehlende umfangreiche PT-Arbeit nachholen.

Wenn Fachsubstanz fehlt:
FAIL oder BLOCKED.

AP05 NICHT starten.

==================================================
1. KONTEXT
==================================================

Lies zuerst:

building-docs/CONTEXT-INDEX.md

Danach mindestens:

- AGENT-CONTRACT
- PROJECT-CONSTRAINTS
- MASTER-SCOPE AP04 + DoD + Hard Barriers + Launch Gates
- AP04.md
- AP-STATE
- AP03 Closure / IA
- CONTENT-MATRIX
- AP02 Content-/Asset-Contract
- AP02 Lead-Contract
- SEO-Contract soweit Asset-/Content-Metadaten betroffen sind
- Quality Gates

==================================================
2. CLOSURE START-GATE
==================================================

Verifiziere:

- AP00 COMPLETE / PASS
- AP01 COMPLETE / PASS
- AP02 COMPLETE / Closure PASS
- AP03 COMPLETE / Closure PASS
- AP04 IN_PROGRESS
- PT04.1 PASS
- PT04.2 PASS
- PT04.3 PASS
- PT04.4 PASS
- Last completed = PT04.4
- Next task = AP04-CLOSURE
- AP05 NOT STARTED
- 18/18 Decision Locks
- Git State sicher

Wenn nicht:

AP04 CLOSURE RESULT
FAIL | BLOCKED

==================================================
3. C04-01 PREDECESSOR
==================================================

AP03 COMPLETE / Closure PASS.

==================================================
4. C04-02 DECISION INTEGRITY
==================================================

18/18 preserved.

Besonders:

- 10 Sprachen
- Consumer x10/indexierbar
- Epigenetics eigene Säule
- kein Chat
- IglooPro `CV < 2 %`
- Lead Persistenz + CRM
- eigene Epigenetics Inquiry
- kein Guarantee Band
- „Angebot anfragen“
- gated Secondary Conversion
- Deal/Voucher/Case Studies/Shop Backlog
- keine dauerhafte Content Governance

==================================================
5. C04-03 CONTENT MATRIX
==================================================

Prüfe:

- genau eine kanonische Matrix
- alle IA-Seitenfamilien
- Status vollständig
- Locale Coverage
- CTA
- Assets
- Sensitive Flags
- Launch Blockers
- Owner APs

Keine konkurrierende Content-Matrix.

==================================================
6. C04-04 CONTENT AUDIT
==================================================

Headlines, CTAs, Forms, Downloads, Articles, Events, Testimonials vollständig auditiert.

==================================================
7. C04-05 PLACEHOLDER / MOCK
==================================================

Keine sichtbaren launchrelevanten:

- Lorem
- TODO Copy
- Coming Soon
- Mock
- Demo
- Dummy
- Preview-only Text

==================================================
8. C04-06 GENERAL CTA
==================================================

GENERAL_SALES:

„Angebot anfragen“
bzw. korrekte Übersetzung.

==================================================
9. C04-07 SPECIALIZED CTAs
==================================================

Getrennt:

- Consumer Order
- Epigenetics Inquiry
- Support
- Download
- ROI
- Contact

==================================================
10. C04-08 NO GUARANTEE BAND
==================================================

Kein Guarantee-/„garantierte Performance“-Band im Target Content.

==================================================
11. C04-09 NO CHAT COPY
==================================================

Kein Chat-/HiHuman-Target Content.

==================================================
12. C04-10 SENSITIVE CLAIMS
==================================================

Sensitive/regulatory Claims:

- identifiziert
- nicht unbelegt verändert
- Pflichttexte erhalten
- fehlende fachliche Freigaben nicht erfunden

==================================================
13. C04-11 IGLOOPRO CLAIM
==================================================

`CV < 2 %` semantisch konsistent.

Nicht zu Guarantee verschärft.

==================================================
14. C04-12 CONTENT TYPES
==================================================

Alle zehn Typen vorhanden:

1 Hero
2 Benefit/Proof
3 Feature/Service
4 Process/Steps
5 FAQ
6 CTA
7 Download/Resource
8 Disclaimer/Regulatory
9 Lead-Magnet-Gate
10 Form/Success/Error

==================================================
15. C04-13 LOCALE COVERAGE / DEFERRED GATE INTEGRITY
==================================================

(korrigiert durch AP04-RECOVERY 2026-08-25)

PASS wenn ALLE Punkte erfüllt sind:

- alle AP04-eigenen Übersetzungs-, Key- und Copy-Arbeiten abgeschlossen
- Key-Parität gegen `de` ohne Lücke
- keine leeren Pflichtwerte
- JEDE verbleibende x10-Lücke vollständig dokumentiert
- jede verbleibende Lücke mit eindeutigem Owner-AP und Required-before
- kein Gap fälschlich READY
- kein späterer AP vorgezogen

FAIL wenn eine innerhalb AP04 lösbare Locale-Lücke offen
oder ein Gap unklassifiziert ist.

NICHT MEHR CLOSURE-BLOCKIEREND:
die Runtime-Vollständigkeit der zehn Sprachen.
Das ist Launch-Gate 1 und gehört AP08.

==================================================
16. C04-14 CONSUMER X10 — AUDIT UND OWNER-HANDOFF
==================================================

(korrigiert durch AP04-RECOVERY 2026-08-25)

PASS wenn:

- alle drei Consumer-Familien vollständig auditiert und in der
  Content-Matrix geführt sind, mindestens: Hero, Product Copy,
  Order CTA, Form Copy, Validation, Success/Error, Legal/Hints,
  relevante sichtbare Copy
- das Zielbild bleibt x10 und ist dokumentiert
- jede Lücke ist als DG-03 mit Owner AP08 PT08.2.3–.7 und AP21
  registriert
- AP04 hat keinen unregistrierten Namespace angelegt und
  `NAMESPACES` nicht geändert
- Consumer wird NICHT als READY oder x10-erfüllt ausgewiesen

NICHT MEHR CLOSURE-BLOCKIEREND:
die `t()`-Fähigkeit der hartkodierten Consumer-Seiten.
Das ist wörtlich AP08 PT08.2 und liegt in Welle 1.

==================================================
17. C04-15 EPIGENETICS X10 — AUDIT UND OWNER-HANDOFF
==================================================

(korrigiert durch AP04-RECOVERY 2026-08-25)

PASS wenn:

- der Epigenetik-Content vollständig auditiert ist
- alle AP04-fähigen Keys (UI, Struktur, CTA) x10 geschlossen sind
- alle Pflichthinweise als `RN-xx` registriert und keiner entfernt ist
- die fachlich freizugebende Übersetzung als DG-01/DG-02 mit Owner
  Fachfreigabe / AP15 / AP16 / AP08 PT08.3.1/.2 registriert ist
- AP04 keine medizinische oder regulatorische Aussage erzeugt hat
- Epigenetik NICHT als x10-erfüllt ausgewiesen wird

NICHT MEHR CLOSURE-BLOCKIEREND:
die freigegebene Fachübersetzung.
Das ist Launch-Gate 1 und Gate 6.

==================================================
18. C04-16 SYSTEM COPY — AP04-ANTEIL
==================================================

(korrigiert durch AP04-RECOVERY 2026-08-25)

PASS wenn:

- Forms, Validation, Success und Error konsistent sind, soweit eine
  kanonische Content-Schicht existiert
- die Success-Semantik dem Lead-Contract entspricht und keinen reinen
  Mailversand behauptet
- Systemmail-Textrollen und Erwartungssemantik definiert sind
- der fehlende Sprachkontext im Leadflow als DG-04 mit Owner AP22
  registriert ist, die sprachliche Ausführung als AP08 PT08.5
- AP04 weder Lead-API-Vertrag noch Mailprovider oder Queue geändert hat

NICHT MEHR CLOSURE-BLOCKIEREND:
die zehnsprachige Auslieferung der Systemmails.
Ohne `language` im Leadflow ist sie technisch nicht herstellbar;
das Feld führt AP22 ein.

Success Copy mit Lead-Contract konsistent.

==================================================
19. C04-17 IMAGE INVENTORY
==================================================

Vollständiges launchrelevantes Bildinventar.

==================================================
20. C04-18 ALT TEXT
==================================================

Informative Assets:
sinnvoll.

Dekorative Assets:
korrekt als dekorativ behandelt.

==================================================
21. C04-19 CONSUMER ASSETS
==================================================

Jede Consumer-Familie besitzt launchfähige Product-/OG-Assets.

==================================================
22. C04-20 DOWNLOAD VERSIONING
==================================================

Launchrelevante Downloads:

- vorhanden
- nachvollziehbar versioniert
- Referenzen korrekt
- keine widersprüchlichen Duplikate

==================================================
23. C04-21 LANGUAGE ASSET PARITY — AUDIT UND DEFERRED ASSET GATES
==================================================

(korrigiert durch AP04-RECOVERY 2026-08-25)

PASS wenn:

- jede sprachabhängige Asset-Referenz inventarisiert und ihre
  Sprachzuordnung erhoben ist
- jede fehlende Sprachvariante als DEFERRED_ASSET_GATE mit Asset,
  fehlender Variante, Owner-AP, Required-before und sicherem
  Ist-Verhalten registriert ist
- kein stiller Fremdsprach-Fallback als erledigt ausgewiesen wird
- keine falsche Verfügbarkeitszusage entsteht
- jede gebrochene aktive Asset-Referenz, die AP04 selbst reparieren
  kann, repariert ist

FAIL wenn eine tote aktive Referenz offen bleibt oder eine fehlende
Variante als vorhanden ausgewiesen wird.

NICHT MEHR CLOSURE-BLOCKIEREND:
die Bereitstellung fehlender Sprachdateien.
Das ist AP08 PT08.6.2 bzw. AP19, teils mit externer Freigabe.

Keine falsche Sprachvariante als Ersatz akzeptieren.

==================================================
24. C04-22 ASSET REFERENCES
==================================================

Keine aktiven broken Assetrefs.

Prüfe:

- existence
- case
- path
- locale
- import
- gated/public correctness

==================================================
25. C04-23 BACKLOG ISOLATION
==================================================

Deal/Voucher/Case Studies/Shop nicht reaktiviert.

==================================================
26. C04-24 GOVERNANCE BOUNDARY
==================================================

Kein:

- CMS
- dauerhafter Editorial Workflow
- neuer Translation-Vendor-Prozess
- medizinischer Governance-Prozess als Launch-System

CONTENT-MATRIX = Launch Status, nicht Governance.

==================================================
27. C04-25 SCOPE INTEGRITY
==================================================

AP04 darf nicht vorgezogen haben:

- AP05 Design System
- AP06 Navigation
- AP07 Search
- AP09 SEO Platform
- AP10 Routing
- AP11–21 Page Redesign
- AP22 Lead Backend
- AP23 Tracking
- Deployment

Contentbezogene minimale Sourceänderungen sind zulässig,
wenn sie AP04 direkt dienten.

==================================================
28. C04-26 QUALITY
==================================================

Entsprechend tatsächlichem Diff:

- clean install, wenn Closure Contract verlangt
- Typecheck
- Unit/Integration Tests
- Production Build
- SSR Smoke
- i18n validation
- Placeholder scan
- CTA scan
- Asset reference scan

Keine produktiven Side Effects.

==================================================
29. C04-27 CANONICALITY
==================================================

Prüfe:

- genau eine Content Matrix
- kein konkurrierender Content SSOT
- IA bleibt AP03-Wahrheit
- Routing bleibt AP02-Routing-Wahrheit
- Content-/Asset-Contract bleibt Architekturwahrheit
- MASTER-SCOPE bleibt Scope-Wahrheit
- PROJECT-CONSTRAINTS bleibt Decision-Wahrheit

==================================================
30. C04-28 AP05 NOT STARTED
==================================================

AP05 darf vor Closure PASS nicht begonnen sein.

==================================================
31. CONTENT-INVARIANTEN
==================================================

Prüfe mindestens semantisch:

CNT-01 IA Coverage
CNT-02 Locale Coverage (TARGET + AP04-OWN, AP04.md §11.2)
CNT-03 Consumer x10 (TARGET + AP04-OWN)
CNT-04 Epigenetics x10 (TARGET + AP04-OWN)
CNT-05 No Placeholder
CNT-06 General CTA
CNT-07 Specialized CTA
CNT-08 No Chat Copy
CNT-09 No Guarantee Band
CNT-10 IglooPro Claim
CNT-11 Sensitive Claims
CNT-12 Mandatory Copy
CNT-13 Public vs Gated
CNT-14 Systemmail Localization
CNT-15 Success Semantics
CNT-16 Asset Existence
CNT-17 Language Asset Parity
CNT-18 Consumer OG
CNT-19 Alt Text
CNT-20 Versioned Downloads
CNT-21 Backlog Isolation
CNT-22 Governance Boundary
CNT-23 No Route Redesign
CNT-24 No Design Redesign
CNT-25 Launch Matrix
CNT-26 Deferred Gate Integrity
CNT-27 No False Ready
CNT-28 No Cycle

IDs an kanonische Repository-Systematik anpassen.

==================================================
32. CURRENT VS TARGET
==================================================

Nicht akzeptieren, dass Current Debt zum Target wird.

Besonders:

- EN-only Consumer
- fehlende Epigenetics Sprachassets
- Chat Copy
- Guarantee Copy
- Placeholder
- alte Downloads
- Backlog Content
- Mail-only Success Semantics

==================================================
33. CLOSURE-KORREKTUREN
==================================================

Erlaubt:

- AP-STATE
- Closure Report
- kleiner Cross-Reference
- Status-Tippfehler

Nicht erlaubt:

- große Übersetzungslücken schließen
- fehlende Assets neu erstellen
- Content-Typen erstmals definieren
- Consumer x10 erstmals implementieren
- Sensitive Claims fachlich neu schreiben
- Arbeit eines späteren Owner-AP vorziehen

Wenn AP04-EIGENE Facharbeit fehlt:
FAIL/BLOCKED.

Wenn die fehlende Arbeit einem späteren Owner-AP gehört und als
Deferred Gate registriert ist:
KEIN FAIL, KEIN BLOCKED (siehe §35).

==================================================
34. STATE BEI PASS
==================================================

Nur bei vollständigem PASS:

- AP00 COMPLETE / PASS
- AP01 COMPLETE / PASS
- AP02 COMPLETE / Closure PASS
- AP03 COMPLETE / Closure PASS
- AP04 COMPLETE / Closure PASS
- Last completed PT = PT04.4
- AP04 Closure = PASS
- Content audit = recorded
- Content types = standardized
- Launch content = AP04 scope complete · deferred gates registered
- Asset readiness = AP04 scope complete · deferred asset gates registered
- Deferred gates = recorded mit Owner-AP und Required-before-Gate
- Content matrix = complete
- Next work package = AP05
- AP05 = NOT STARTED

KEIN State-Feld darf x10-Launch-Readiness behaupten,
solange Deferred Gates offen sind.

AP05 NICHT starten.

==================================================
34.1 C04-29 BIS C04-32 — DEFERRED GATE INTEGRITY
==================================================

(neu durch AP04-RECOVERY 2026-08-25)

C04-29 DEFERRED GATE COMPLETENESS

Jede bekannte, nicht durch AP04 gelöste Lücke ist registriert mit:

- ID
- Gate-Typ (DEFERRED_IMPLEMENTATION / DEFERRED_CONTENT_APPROVAL /
  DEFERRED_ASSET)
- konkreter Lücke
- Owner-AP
- Required-before-Gate
- sicherem Ist-Verhalten
- Evidenz

Eine unklassifizierte Lücke ist FAIL.

C04-30 NO FALSE READY

Kein Deferred Gate ist als READY, vollständig oder x10-erreicht
ausgewiesen. AP04 behauptet keine unbelegbare Launch-Readiness.

C04-31 NO CYCLE / NO PULL-FORWARD

Kein späteres Owner-AP ist zwingende Vorbedingung dieser Closure,
und keine spätere Owner-Arbeit wurde vorgezogen.

C04-32 AP05 STARTABILITY

AP05 kann technisch unabhängig starten.
Das Design-System hängt an keinem offenen Deferred Gate.

==================================================
35. CLOSURE FAIL-BEDINGUNGEN
==================================================

(korrigiert durch AP04-RECOVERY 2026-08-25)

FAIL/BLOCKED bei mindestens:

- PT04.1–04.4 nicht vollständig PASS
- Content Matrix unvollständig
- sichtbarer AP04-eigener Placeholder/Mock
- eine innerhalb AP04 lösbare Locale-/Copy-Lücke offen
- GENERAL_SALES inkonsistent
- Chat/Guarantee Target Copy
- IglooPro Claim verändert
- sensible Claim-Lücke
- Success-Semantik widerspricht dem Lead-Contract
- broken aktive Assetrefs
- stiller Fremdsprach-Fallback als erledigt ausgewiesen
- Gap unklassifiziert (C04-29)
- Deferred Gate ohne Owner (C04-29)
- Gap fälschlich READY (C04-30)
- zyklische Vorbedingung oder vorgezogene Owner-Arbeit (C04-31)
- Backlog-Reaktivierung
- Governance/CMS eingeführt
- Quality Gates rot
- AP05 bereits gestartet
- Decision Locks nicht 18/18

AUSDRÜCKLICH KEIN FAIL UND KEIN BLOCKED:

- Consumer noch nicht x10, weil AP08 PT08.2 aussteht
- Epigenetics Webcontent noch nicht übersetzt/freigegeben
- Musterbefunde noch nicht x10, weil AP16 das Sprachmodell besitzt
- Systemmails einsprachig, weil AP22 den Sprachkontext einführt
- Artikel-Volltexte in einzelnen Sprachen noch englisch
- sprachabhängiges Asset fehlt und ist als DEFERRED_ASSET_GATE geführt

sofern jeweils registriert, ownergebunden und nicht READY.

Closure darf NICHT verlangen, dass AP08, AP15, AP16, AP17, AP19,
AP21 oder AP22 bereits erledigt sind. Diese APs starten nach AP04.

==================================================
36. PASS-KRITERIEN
==================================================

(korrigiert durch AP04-RECOVERY 2026-08-25)

PASS nur wenn alle 32 C04-Gates (C04-01 bis C04-32) PASS sind.

Das heißt konkret:

1. PT04.1–PT04.4 PASS
2. AP04-eigene Arbeit vollständig
3. alle Deferred Gates explizit dokumentiert
4. jedes Deferred Gate mit ID, Typ, Lücke, Owner-AP,
   Required-before und sicherem Ist-Verhalten
5. keine spätere AP-Arbeit vorgezogen
6. keine Lücke fälschlich als READY deklariert
7. AP05 kann technisch unabhängig starten

Master-Scope-DoD-Einordnung:

Launch-Content und Assets sind vollständig, 10-sprachig und technisch nutzbar;
formale Content-Governance bleibt außerhalb des Launch-Scope.

Diese Aussage ist die LAUNCH-Zielanforderung.
Sie wird gemeinsam von AP04, AP08, den Domänen-APs und AP22 erfüllt
und in den Launch-Gates 1, 3, 4 und 6 abgenommen — nicht von AP04 allein.

AP04 Closure PASS bedeutet NICHT,
dass die Website bereits x10 launchfertig ist.

==================================================
37. ABSCHLUSSREPORT
==================================================

Antworte exakt:

AP04 CLOSURE RESULT
PASS | FAIL | BLOCKED

Repository:
Branch:
HEAD:
Working tree:

AP00:
AP01:
AP02:
AP03:

PT04.1:
PT04.2:
PT04.3:
PT04.4:

Content matrix:
Content audit:
Content type standardization:
Launch content readiness:
Asset readiness:

Locale coverage:
Consumer x10:
Epigenetics x10:
General CTA:
Specialized CTAs:
Placeholder/mock content:
Chat copy:
Guarantee-band copy:
IglooPro CV < 2 %:
Sensitive/regulatory claims:
Mandatory copy:
Form/success/error copy:
Systemmail/autoresponder copy:

Image inventory:
Alt-text coverage:
Consumer product/OG assets:
Download versioning:
Language-dependent asset parity:
Broken asset references:
Orphan/launch-disruptive assets:

Deferred implementation gates:
Deferred content approval gates:
Deferred asset gates:
Launch blockers carried forward:
Owner-AP integrity:
False-ready claims: NONE
Later AP work pulled forward: NONE
AP05 startability:

Backlog integrity:
Governance boundary:
Routing/design/SEO/lead/tracking scope integrity:
Decision locks:
Canonicality:

Typecheck:
Tests:
Build:
SSR smoke:
i18n validation:
Asset validation:

AP04 Definition of Done:
State:

AP04 status:
Next work package:
AP05 status:

Open blockers:
Open later-owner items:

Final verdict:

Wenn PASS:

AP04 is COMPLETE.
AP04 Closure is PASS.
AP05 is NOT STARTED.
The repository is ready for AP05.

Danach Lauf beenden.

NICHT AP05 starten.
NICHT PT05.1 erzeugen.
```
