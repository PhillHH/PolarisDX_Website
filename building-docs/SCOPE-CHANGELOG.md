# SCOPE-CHANGELOG — Change Control für Scope und bestätigte Entscheidungen

**Dokumenttyp:** Change-Control-Mechanismus + Änderungshistorie
**Erzeugt durch:** `PT00.1` (AP00 — Programmsteuerung, Scope Lock und Delivery Governance)
**Stand:** 2026-08-24
**Gilt für:** `building-docs/scope/MASTER-SCOPE.md`, `building-docs/PROJECT-CONSTRAINTS.md`,
`building-docs/DECISIONS.md` sowie jede Änderung an Launch-Scope, Backlog-Abgrenzung oder Baseline.

Solange ein Change hier nicht als `ACCEPTED` eingetragen ist, gilt die bisherige Festlegung
unverändert weiter.

---

## 1. Grundregel

> **Repository-Evidenz allein darf keine bestätigte Product Decision verändern.**

Repository-Evidenz beschreibt den **Ist-Zustand**. Weicht der Ist-Zustand von einem Lock ab, ist das
ein **Ist-/Soll-Delta** und damit ein Arbeitsauftrag — kein Änderungsgrund für die Entscheidung.

Ebenso wenig sind Änderungsgrund:

- ältere oder historische Repository-Dokumentation;
- der Inhalt eines Quell-Branches;
- eine technisch attraktivere Alternative;
- Session-/Gesprächsgedächtnis eines Agenten;
- die Bequemlichkeit der Umsetzung.

**Ein Implementierungsagent ändert nichts an Scope oder Decisions.** Er darf ausschließlich einen
Change **beantragen** (Status `PROPOSED`) und arbeitet bis zur Entscheidung innerhalb der geltenden
Festlegung weiter.

---

## 2. Was Change Control auslöst

Ein Change-Eintrag ist **verpflichtend**, wenn eines der folgenden Dinge geändert werden soll:

| Kategorie          | Beispiele                                                            |
| ------------------ | -------------------------------------------------------------------- |
| Baseline           | Wechsel oder Neuinterpretation von `feat/home-leadmagnet@961f65d`    |
| Decision Lock      | jede Änderung an `DEC-RL-001`–`DEC-RL-015`, `REST-01`–`REST-03`      |
| Geschlossene Frage | Wiederöffnen eines Punkts aus `DECISIONS.md` §4                      |
| Launch-Scope       | Aufnahme oder Streichung eines AP/PT im Launch-Umfang                |
| Backlog-Grenze     | Hochstufung eines Backlog-Themas zum Launch-Blocker (oder umgekehrt) |
| Launch-Gate        | Änderung, Streichung oder Ergänzung eines der 12 Gates               |
| Branch-Rolle       | Änderung des Status einer selektiven Quelle                          |
| Abhängigkeit       | Änderung einer kritischen Abhängigkeit / Hard Barrier                |

**Kein** Change-Eintrag nötig für: Tippfehler, Formatierung, Querverweise, Präzisierungen ohne
Bedeutungsänderung, sowie das reine Fortschreiben von `state/AP-STATE.md`.

---

## 3. Pflichtfelder je Change

Jeder Eintrag enthält **alle** folgenden Felder. Ein Eintrag mit fehlenden Feldern ist ungültig und
wird nicht wirksam.

| Feld                                    | Inhalt                                                                                                       |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `Change-ID`                             | fortlaufend `SC-001`, `SC-002`, …                                                                            |
| `Datum`                                 | ISO-Datum `YYYY-MM-DD` der Entscheidung                                                                      |
| `Status`                                | `PROPOSED` · `ACCEPTED` · `REJECTED` · `WITHDRAWN`                                                           |
| `Betroffene IDs`                        | betroffene Decision-IDs und/oder AP-/PT-IDs und/oder Gate-IDs                                                |
| `Vorheriger Zustand`                    | wörtlich, was bisher galt                                                                                    |
| `Neuer Zustand`                         | wörtlich, was künftig gilt                                                                                   |
| `Begründung`                            | warum die Änderung nötig ist — inklusive der Evidenz, die sie auslöste                                       |
| `Bestätigende menschliche Entscheidung` | wer die Änderung bestätigt hat (Rolle/Person) und wann; **ein Agent kann dieses Feld nicht selbst erfüllen** |
| `Auswirkung auf Scope`                  | welche AP/PT hinzukommen, entfallen oder sich ändern                                                         |
| `Auswirkung auf Abhängigkeiten`         | betroffene kritische Abhängigkeiten / Hard Barriers                                                          |
| `Auswirkung auf Gates`                  | betroffene Launch-Gates und deren Abnahmekriterien                                                           |
| `Aktualisierte kanonische Dokumente`    | Liste der Dateien, die im selben Schritt nachgezogen wurden                                                  |

---

## 4. Ablauf

1. **Beobachtung.** Ein Agent oder Beteiligter stellt einen Konflikt oder Änderungsbedarf fest.
2. **Eintrag `PROPOSED`.** Der Change wird mit allen Pflichtfeldern außer der Bestätigung erfasst.
   `Bestätigende menschliche Entscheidung` bleibt leer.
3. **Weiterarbeit im Lock.** Bis zur Entscheidung gilt die bisherige Festlegung. Es wird nichts
   „vorsorglich" nach dem beantragten Zustand gebaut.
4. **Menschliche Entscheidung.** Product Owner bzw. verantwortliche Rolle entscheidet
   `ACCEPTED` oder `REJECTED`.
5. **Nachziehen im selben Schritt.** Bei `ACCEPTED` werden alle betroffenen kanonischen Dokumente
   in **derselben** Änderung aktualisiert:
   `scope/MASTER-SCOPE.md` → `PROJECT-CONSTRAINTS.md` → `DECISIONS.md` → betroffene
   `work-packages/APxx.md` → betroffene `*-CONTRACT.md` → `state/AP-STATE.md`.
6. **Keine Parallelkopie.** Es wird die bestehende kanonische Datei aktualisiert; es entsteht **kein**
   zweites Decision-, Scope- oder State-Dokument.
7. **Vermerk im State.** Der Change wird in `state/AP-STATE.md` als Ereignis referenziert (ID + Wirkung),
   nicht als Volltext dupliziert.

### 4.1 Konfliktfall ohne Entscheidungsbefugnis

Widersprechen sich zwei kanonische Quellen und ist kein `ACCEPTED`-Change vorhanden, wird der Fall als
`BLOCKED_DECISION_CONFLICT` dokumentiert (Eintrag `PROPOSED` + Vermerk unter `Open Blockers` in
`state/AP-STATE.md`). Der Agent entscheidet nicht selbst und rät nicht.

---

## 5. Eintragsvorlage

```md
### SC-00X — <Kurztitel>

- **Datum:** YYYY-MM-DD
- **Status:** PROPOSED | ACCEPTED | REJECTED | WITHDRAWN
- **Betroffene IDs:** <DEC-RL-… | REST-… | APxx | PTxx.y | Gate n>
- **Vorheriger Zustand:** <wörtlich>
- **Neuer Zustand:** <wörtlich>
- **Begründung:** <warum, inkl. auslösender Evidenz>
- **Bestätigende menschliche Entscheidung:** <Rolle/Person, Datum>
- **Auswirkung auf Scope:** <…>
- **Auswirkung auf Abhängigkeiten:** <…>
- **Auswirkung auf Gates:** <…>
- **Aktualisierte kanonische Dokumente:** <Dateiliste>
```

---

## 6. Änderungshistorie

### SC-005 — Startseite als Agentur-Komposition: lockerer Mix statt Fotoreihen, Bildwelt 3

- **Datum:** 2026-10-16
- **Status:** ACCEPTED
- **Betroffene IDs:** DEC-RL-002 (Art Direction, Bildsprache — Präzisierung, kein Wechsel), SC-002 („Fachbereich-Einstiege als Foto-Karten"), AP11 PT11.3/PT11.4/PT11.5 (nur Darstellung), AP27 (Baselines PT27.6 und Design-System-Spec), AP30 (`release/AP30-RC1.md`, Nachtrag), HOMEPAGE-CONTRACT §2.2/§4/§4.2/§5/§6, DESIGN-SYSTEM-CONTRACT §3.1 (Fotoregel), DESIGN-SYSTEM-CHANGELOG, DECISIONS OD-11; ARTICLES-CONTRACT unverändert (die fünf Artikelfotos bleiben aus Runde 2)
- **Vorheriger Zustand:** SC-002/Bildwelt 2: Geschäftssäulen Diagnostik und Epigenetik als Foto-Karten (`practice-consult`, `lab-analyst`), IglooPro als Explosions-Render; „Fachbereich-Einstiege als Foto-Karten" (drei gleich große Fotos `service-dental/-beauty/-longevity` in einer Reihe); Ablauf als drei weiße Karten; Wissen als drei gleiche Artikelkarten mit Foto — unterhalb der Bühne acht Foto-Kacheln in drei Dreierreihen. HOMEPAGE-CONTRACT §4: „The section adds no images, script, timers, tracking or third-party dependency." Pool elf KI-Motive (Stilsatz 2, Runde 2). Startseite genau am `htmlBytes`-Limit (33,9 KB), Desktop-`imageBytes` 81,3 KB.
- **Neuer Zustand:** Sektionsfolge (Hero → TrustBar → Säulen + Fachbereich-Einstiege → Shop-Band → Warum POC → Ablauf → Proof → ROI → Wissen → FAQ → Final CTA), Claims, CTAs, Routen, `data-*`-Attribute und Copy-Schlüssel unverändert; nur die visuelle Komposition:
  - **Säulen:** drei verschiedene Bildarten statt drei gleichartiger Fotos — Diagnostik = Parameter-Tafel (`<ul>` aus Chips, zur Laufzeit aus den vorhandenen `segments.{dental,beauty,longevity}.bio`-Zeilen, am „·" getrennt, dedupliziert; einziger neuer Schlüssel `business_pillars.pillars.diagnostics.board_label`, de „Parameter aus den Fachbereichen", 10 Sprachen — kein neuer Claim, kein neuer Text), IglooPro = Explosions-Render (`igloo-explode-240w.webp`, unverändert), Epigenetik = echter Musterbefund (`report-preview-{400,800}w.webp`, erzeugt aus `src/assets/epigenetics/befund-biologische-altersuhr@2x.webp`). Säulen-Icon in der H3, weißes Badge auf der Bildfläche entfällt.
  - **Fachbereich-Einstiege:** nummerierte Leseliste (`<ol>`, Zeilen 01–03 mit Titel + Biomarker-Zeile + Pfeil, jede Zeile ein `<Link>` mit unverändertem `data-core-service`/`data-route-id`) neben EINEM Detailfoto (4:5, `detail-capillary-{480,960}w.{avif,webp}`, schlankes AVIF-srcset, `alt=""`). Mobil Text → Liste → Foto; ab `lg` steht das Foto links über Kopf und Liste.
  - **Ablauf:** dieselbe `<ol>`, derselbe Text, als Zeitleiste (Navy-Nummernkacheln 01–03, Haarlinie ab `md`) statt drei weißer Karten; Sicherheitshinweis bleibt als Absatz mit linker Linie.
  - **Wissen:** ein hervorgehobener Artikel mit 16:9-Foto (erster der drei echten Artikel-Teaser) plus nummerierte Leseliste (02, 03); alle drei in `<article>`; `aria-labelledby="homepage-knowledge-title"`, vorhandener `blog.eeat_text` als Vorspann; „Alle Fachartikel" behält `data-home-secondary-conversion="knowledge"`.
  - **Bildwelt 3 (Stilsatz 3, `assets-src/photos/PROMPTS.md`):** die Startseite zeigt genau zwei generierte Fotos (Bühne + Detail) sowie das echte Porträt der Praxisreferenz und ein Artikelfoto. Stil: Reportage in einer zeitgemäßen, neu gebauten deutschen Zahnarztpraxis (minimalistisch, Weiß/Hellgrau mit wenig heller Eiche, vorhandenes Licht, niemand blickt in die Kamera, nichts gestellt, Spur Filmkörnung, nicht glossy, nicht Stock); Google Gemini `gemini-3-pro-image-preview`, drei Varianten je Slot, Bühne per Bild-zu-Bild auf 4K. Pool jetzt sieben Quellen (Bühne `practice-dental-2600.jpg`, Detail `detail-capillary.jpg`, fünf Artikelfotos aus Runde 2 unverändert). Gelöscht: `practice-dental/-beauty/-longevity/-consult.jpg`, `lab-analyst.jpg` und ihre Stufen `service-*`, `practice-consult-*`, `lab-analyst-*`; `SERVICE_IMAGES`/`PILLAR_IMAGES` entfallen, neu `DETAIL_IMAGE` (`src/assets/home/homeImages.ts`, `HERO_STAGE` unverändert).
  - **Regel (DESIGN-SYSTEM-CONTRACT, Fotoregel):** Fotografie ist Akzent, nicht Tapete — höchstens zwei generierte Fotos auf der Startseite; Säulen und Module wechseln zwischen Foto, Produkt-Render, echtem Dokument, Parameter-Tafel und Typografie; drei gleich große Fotos in einer Reihe sind nicht mehr zulässig. Stilsatz 3 ersetzt Stilsatz 2 für neue Motive.
- **Begründung:** Owner-Auftrag 2026-10-16 im Wortlaut: „Geh mal als Agentur, der man 30.000 Euro dafür bezahlt und die perfekte Seite bringt. Nicht zu viele Fotos, aber auch nicht zu wenig. Viele Elemente, die Informationen müssen immer klar ersichtlich sein. Lockerer Mix und hochwertige, echte, natürliche Fotos. Berücksichtige die APs; die Seite soll gleich gelauncht werden." Bildwelt 2 stellte unterhalb der Bühne acht gleichartige Foto-Kacheln; die Information (Parameter, Befund, Gerät) stand hinter Stimmungsbildern zurück, und die Startseite lag genau am HTML-Budget.
- **Bestätigende menschliche Entscheidung:** Projekt-Owner (Phillip), 2026-10-16, im Arbeitsauftrag; Sichtprüfung des Ergebnisses auf der Preview steht aus.
- **Auswirkung auf Scope:** Keine neue Route, kein neuer Claim, keine neue Journey-Konversion, keine neue Sektion. Neu ist nur der Beschriftungsschlüssel der Parameter-Tafel in 10 Sprachen; die Tafel zeigt ausschließlich, was `segments.*.bio` bereits sagt. Claim-Register `HCL-001`–`HCL-015` unverändert; Deep-Link-Matrix (HOMEPAGE-CONTRACT §8) unverändert gültig.
- **Auswirkung auf Abhängigkeiten:** Inter bleibt; keine neue Komponente, kein neues Token, kein Script, kein Tracking, kein Anbieter, keine neue CSP-Origin. Impressum §8 (Bildnachweis, Zeile „KI-generiert (PolarisDX, Google Gemini)") bleibt gültig: weiterhin KI-generierte Szenen ohne reale Personen; der Musterbefund ist das bestehende eigene Dokument. Gemini-Schlüssel nur lokal (`~/.config/polaris/gemini.env`).
- **Auswirkung auf Gates:** Kein Budget gelockert: home `htmlBytes` 33,8 KB (Grenze 33,9; vorher genau am Limit), Desktop-`imageBytes` 65,1 KB (vorher 81,3; Grenze 87,2), mobil 33,7 KB, Initial-JS 159,4 KB gzip (Grenze 160,9), LCP-Bild 10,5 KB Desktop / 9,4 KB mobil — gemessen 2026-10-16 mit `node scripts/perf/check-budgets.mjs --profile ci --routes home,home-en,home-pl --runs 1`; der vollständige `ci`-Lauf danach hielt alle 852 Prüfungen. `src/components/sections/*.test.tsx` 35/35 unverändert grün (Säulen 6 Links; Ablauf 3 geordnete Schritte, erstes `span` = Nummer; Wissen 3 `article`). Visuelle Baselines PT27.6 und Design-System-Spec sind im gepinnten Playwright-Image v1.57.0 neu aufgenommen (sechs PT27.6-Screenshots, Liste im DESIGN-SYSTEM-CHANGELOG); Browser-Matrix, A11y PT24.x und SEO-Regression sind für den neuen Stand neu zu fahren (`release/AP30-RC1.md`, Nachtrag SC-005). Preview-Release folgt.
- **Aktualisierte kanonische Dokumente:** `building-docs/HOMEPAGE-CONTRACT.md` (§2.2, §4, §4.2 neu, §5, §6), `building-docs/DESIGN-SYSTEM-CONTRACT.md` (§3.1 Fotoregel), `building-docs/DESIGN-SYSTEM-CHANGELOG.md` (Change Note SC-005), `building-docs/DECISIONS.md` (OD-11), `building-docs/release/AP30-RC1.md` (Nachtrag), `assets-src/photos/PROMPTS.md`, `assets-src/photos/README.md`.

### SC-004 — Owner-Entscheidungen vor dem Go-live: Shop-Verweis, Early-Access stillgelegt, ndu Clinic, eine Telefonnummer, Bereichsleiste Diagnostik

- **Datum:** 2026-10-16
- **Status:** ACCEPTED
- **Betroffene IDs:** DEC-RL-015 (Shop), SC-003 (Telefonnummer, Bereichsleiste nur Epigenetik), AP29 PT29.4 (`migration/MAIN-DELTA-2026-10.md` §5 O1–O5), AP30 (`release/AP30-RC1.md` §5), AP34 PT34.2d/e und PT34.4, HOMEPAGE-CONTRACT (Sektionsfolge, Claim Register), EPIGENETICS-CONTRACT, ROUTING-CONTRACT (`INTENTIONAL_404`), CONSENT-TRACKING-CONTRACT (`OUTBOUND_DOMAINS`, CTC-14), SECURITY-CONTRACT (SEC-17/OA-9), DEPLOYMENT-CONTRACT (DEP-19, DD-15), CORPORATE-CONTACT-LEGAL-CONTRACT
- **Vorheriger Zustand:** `DEC-RL-015`: „Deal/Voucher/Case Studies/Shop sind bewusst vertagt und gehören in den Backlog" — kein Shop-Verweis im Relaunch, `RELAUNCH-BACKLOG.md` „Weder bauen noch reaktivieren". Early-Access (`/early`, `POST /api/early-access`) läuft nur in der Produktion (`main@ad5073e`), Relaunch ohne Entscheidung. Keine ndu-Clinic-Karte. Zwei Telefonnummern (`+49 151 75011699` Kontakt, `+49 152 2858 0999` Epigenetik-Hub und 60 Musterbefunde), Musterbefund-„Vertrieb" mit Hamburger Altadresse. Impressum-Überschrift „§ 5 TMG". Bereichsleiste und „Nächster Schritt" nur auf Epigenetik-Seiten (SC-003); Diagnostik, Service und IglooPro offen. RPO/RTO nur als Vorschlag (DEP-19). AP34-Abnahme offen.
- **Neuer Zustand:**
  - **O1 Shop-Verweis:** Kopfzeilen-Eintrag „Shop" als externer Link auf `https://shop.polarisdx.net` (`de` → Wurzel, alle anderen Sprachen → `/en`; `src/lib/shop.ts`), Label „Neu" nur im mobilen Menü. Startseite: schmales Band `ShopTeaserSection` direkt nach den Geschäftssäulen (Eyebrow „Neu · Online-Shop für Fachkreise", Titel, Hinweis „Fachkreis-Bestellportal · Alle Preise netto zzgl. gesetzl. MwSt.", ein Knopf „Zum Shop"), Claim `HCL-015`. `DEC-RL-015` gilt für Deal/Voucher/Case Studies unverändert; für den Shop gilt: kein Shop **auf** der Website (`/shop` bleibt `INTENTIONAL_404`), nur der Verweis auf den externen Shopify-Shop. `shop.polarisdx.net` steht in `OUTBOUND_DOMAINS` (schließt CTC-14).
  - **O2 Early-Access stillgelegt (Option A):** `/early` ist im Relaunch `INTENTIONAL_404` (keine Weiterleitung auf die Startseite). Die nginx-Locations `/early*`, `/early-assets/` und `/api/early-access*` werden beim Cutover entfernt (Operator-Schritt, noch nicht ausgeführt). Die Anmeldedaten unter `/var/lib/polaris-early/signups.jsonl` und die Event-Daten unter `/var/lib/polaris-events` bleiben auf dem Host; Aufbewahrung/Löschung ist eine eigene Datenschutz-Entscheidung (**offen**).
  - **O3 ndu Clinic:** Karte „Test machen lassen / ndu Clinic · London" im Kontaktkapitel des Epigenetik-Hubs als Bezugsweg für Einzelpersonen, 10 Sprachen; `nduclinic.com` in `OUTBOUND_DOMAINS`.
  - **O4 + Telefon:** site-weit eine Nummer `+49 151 75011699` (wie `main@475fefd`); Musterbefund-„Vertrieb" Willy-Brandt-Straße 49, 20457 Hamburg. Die PDF-Downloads tragen noch den alten Stand (**offen**, neue PDF-Fassungen vom Owner).
  - **O5 Share-Karte:** Text aus dem Claim Register (bereits mit `a7ff705` umgesetzt).
  - **Impressum:** Überschrift „Angaben gemäß § 5 DDG" in 10 Sprachen.
  - **Bereichsleiste Diagnostik:** `AreaNav` und `NextSteps` auch auf dem Diagnostik-Hub, allen neun Service-Seiten und IglooPro; die Bausteine liegen als Shell-Bausteine im Entry-Chunk (`AreaShellProvider`).
  - **RPO/RTO:** RPO 24 h, RTO 30 min (DEP-19).
  - **AP34:** Owner-Abnahme erteilt (Bogen `wireframes/ap34-abnahme/`).
- **Begründung:** Vorlage der Empfehlungen in `migration/MAIN-DELTA-2026-10.md` §5 (O1–O5) und `release/AP30-RC1.md` §5 (P1). Der Shop ist auf `main` seit 2026-09-07 live und owner-freigegeben (`e66a562`); ohne ihn verschwände der Shop-Zugang am Go-live-Tag. `early.log` seit 2026-09-15 ohne Zugriff. Die zweite Telefonnummer und die Bereichsleiste waren seit SC-003 bzw. PT34.2d/e als Owner-Fragen geführt.
- **Bestätigende menschliche Entscheidung:** Projekt-Owner (Phillip), 2026-10-16 („Alle ja" auf alle Empfehlungen aus MAIN-DELTA §5 und AP30-RC1 §5).
- **Auswirkung auf Scope:** Keine neue Route. Neu sind ein externer Kopfzeilen-Eintrag, ein Startseiten-Band mit einem Claim (`HCL-015`), eine Epigenetik-Karte und Mikrotexte in 10 Sprachen (`home.shop_teaser`, `epigenetics.contact.partner*`). Early-Access wird nicht portiert. Titel/Description-Deltas gegen Search Console (Crawl F3) sind angenommen, aber erst mit GSC-Zugang nach dem Go-live prüfbar (Operator/Owner).
- **Auswirkung auf Abhängigkeiten:** Cutover (AP31) braucht den nginx-Umbau für Early-Access; danach entfällt der Grund für die Port-5000-Publikation (DD-15/M-09). SEC-17/OA-9 werden „stillgelegt" mit Cutover-Schritt. Kein neuer Anbieter, keine neue CSP-Origin (beide Ziele sind reine Navigation).
- **Auswirkung auf Gates:** Kein Budget gelockert: Initial-JS 162 794 B von 164 778 B, Route-JS-Puffer Diagnostik-Hub 193 B, Service-Detail 186 B, IglooPro 127 B; `check-budgets` ci 852/852. Code-Commit `f7b5db3`: Vitest 1118, alle `check:*`-Guards, tsc, Lint (1 alte Warnung). Visuelle Baselines der betroffenen Seiten wurden in diesem Commit nicht neu aufgenommen (**offen**).
- **Aktualisierte kanonische Dokumente:** `building-docs/scope/MASTER-SCOPE.md` (§0.2, §0.2.2), `building-docs/PROJECT-CONSTRAINTS.md`, `building-docs/DECISIONS.md`, `building-docs/RELAUNCH-BACKLOG.md`, `building-docs/work-packages/AP34.md`, `building-docs/HOMEPAGE-CONTRACT.md`, `building-docs/EPIGENETICS-CONTRACT.md`, `building-docs/ROUTING-CONTRACT.md`, `building-docs/CONSENT-TRACKING-CONTRACT.md`, `building-docs/NETWORK-ALLOWLIST.md`, `building-docs/TESTING-CONTRACT.md`, `building-docs/SECURITY-CONTRACT.md`, `building-docs/DEPLOYMENT-CONTRACT.md`, `building-docs/CORPORATE-CONTACT-LEGAL-CONTRACT.md`, `building-docs/DESIGN-SYSTEM-CONTRACT.md`, `building-docs/DESIGN-SYSTEM-CHANGELOG.md`, `building-docs/migration/MAIN-DELTA-2026-10.md`, `building-docs/release/AP30-RC1.md`, `building-docs/state/AP-STATE.md`, `docs/deploy.md`.

### SC-003 — AP34 Informationsführung: Bereichsleiste, Strecken, „Nächster Schritt"

- **Datum:** 2026-10-15
- **Status:** ACCEPTED
- **Betroffene IDs:** SC-002 („keine neuen Sektionen"), AP34 PT34.2/PT34.3, EPIGENETICS-CONTRACT (Hub-Reihenfolge, Hub-Abschnitte), DIAGNOSTICS-HUB-CONTRACT, IGLOOPRO-CONTRACT, BEFUNDE-CONTRACT (nur Seitenrahmen), CONSENT-TRACKING-CONTRACT (`CTA_LOCATIONS`), I18N-CONTRACT (neue Mikrotexte in 10 Sprachen)
- **Vorheriger Zustand:** SC-002: AP34 ist ein reines Gestaltungs-AP ohne neue Sektionen. Der Epigenetik-Hub führt zwölf Abschnitte in der Reihenfolge Vergleich → Prinzip → Werte verstehen → Analysen → Ablauf → Beratung → Studienlage → Fragen → Unterlagen → Weiterlesen → Anfrage mit einer Kapitel-Chipleiste (`ChapterNav`); „Werte verstehen", Studienlage und Unterlagen stehen vollständig im Hub und noch einmal als eigene Vertiefungsseite.
- **Neuer Zustand:** Die Unterseiten erhalten ein einheitliches Führungssystem (`wireframes/relaunch-entwurf-4-unterseiten/`):
  - Bereichsleiste je Bereich (sticky, echte Seitenziele, Merkliste und Anfrage). Sie ersetzt auf Epigenetik-Seiten die Kapitel-Chipleiste.
  - „Auf dieser Seite" als Inhaltsverzeichnis mit Lesefortschritt auf Lese- und Befundseiten.
  - „Nächster Schritt" (zurück · weiter · Anfrage) am Ende jeder Bereichsseite.
  - Mobile Aktionsleiste auf Epigenetik-, IglooPro- und Service-Seiten.
  - Im Epigenetik-Hub ein Wegweiser in vier Schritten (Verstehen → Analyse wählen → Musterbefund ansehen → Anfragen). Die neue Reihenfolge ist Analysen (mit Filter) → Vergleich (aufklappbar) → Prinzip → Ablauf → Beratung → Studienlage-Kurzfassung → Fragen → Unterlagen-Kurzfassung → Anfrage.
  - „Werte verstehen" steht vollständig auf `/epigenetics/grundlagen`. Im Hub bleibt ein kurzer Verweis mit der bestehenden ID.
  - Im Diagnostik-Hub ersetzt eine Parameter-Abkürzung aus den vorhandenen Tags die doppelte Liste der sechs Bereiche.
- **Begründung:** Owner-Auftrag vom 2026-10-15: Informationsstrecken klarer machen, schneller zurechtfinden, hin- und hernavigieren, sinnvolle Calls-to-Action „für einen Menschen, nicht für eine Maschine"; Schwerpunkt Epigenetik. Messung am Ist-Stand: Hub 16.035 px Desktop, 11 Kapitel-Chips, drei vollständig doppelte Abschnitte, Vergleichstabelle vor der Erklärung der Panels; Musterbefund 10.471 px.
- **Bestätigende menschliche Entscheidung:** Projekt-Owner (Phillip), 2026-10-15, nach Vorlage von Entwurf 4 („ja, starte mal").
- **Auswirkung auf Scope:** Keine neue Route, kein neuer Claim, keine neue Journey-Konversion. Neu sind nur Navigations- und Orientierungs-Mikrotexte, die in allen 10 Sprachen gepflegt werden. Alle bestehenden Hub-Anker bleiben auflösbar (`#analysen #musterbefunde #vergleich #prinzip #werte-verstehen #ablauf #studienlage #fragen #downloads #inquiry`). Pflichthinweise (`contact.note`, `compare.gendg`, `samples.note`) bleiben sichtbar im Hub.
- **Auswirkung auf Abhängigkeiten:** Die Merkliste bleibt reiner Browserzustand ohne Tracking. Neue CTA-Orte werden in `CTA_LOCATIONS` aufgenommen. Es gibt keinen neuen Anbieter, und der Basic Consent Mode v2 bleibt. Die zweite Telefonnummer (`+49 152 2858 0999`, Epigenetik-Hub und alle 60 Musterbefunde) bleibt bis zur Owner-Entscheidung unverändert. _Erledigt durch SC-004 (2026-10-16): eine Nummer `+49 151 75011699` site-weit; nur die extern erzeugten PDFs tragen noch die alte Nummer._
- **Auswirkung auf Gates:** Die Hub-Reihenfolge in `e2e/epigenetics-hub-ia.spec.ts` wird auf die neue Reihenfolge umgestellt (gleiche Anker, geänderte Abfolge). Budgets bleiben unverändert und werden gemessen, nicht gelockert. Die visuellen Baselines der betroffenen Seiten werden im gepinnten Image neu aufgenommen.
- **Aktualisierte kanonische Dokumente:** `building-docs/work-packages/AP34.md`, `building-docs/EPIGENETICS-CONTRACT.md`, `building-docs/state/AP-STATE.md`, weitere Verträge im jeweiligen Teilschritt.

### SC-002 — AP34 „Editorial": Navy-Kopfzeile, Logo-Blau als Akzent, Bühnenfoto

- **Datum:** 2026-10-15
- **Status:** ACCEPTED
- **Betroffene IDs:** DEC-RL-002 (Art Direction, Bildsprache), SC-001, neues Arbeitspaket AP34 (vor AP28), HOMEPAGE-CONTRACT §2.2/§2.3, DESIGN-SYSTEM-CONTRACT §3.1/§3.2, AP06 (Kopfzeile), AP27 (Baselines)
- **Vorheriger Zustand:** SC-001: helle Kopfzeile mit dunklem Logo, Teal-Akzent (`accent` #0d9488 ff.), Hero als Foto-Mosaik um das 650×650-Produktbild (Produktbild = LCP, eager, `fetchpriority=high`); Arbeitspakete AP00–AP33, als nächstes AP28.
- **Neuer Zustand:** Navy-Kopfzeile (deckend) mit weißem Logo; `accent`-Skala auf das Blauspektrum des Signets (Royal #1b67b1, #15589a, Cyan #02a6e3, #e6f5fc, #b9e4f7, auf Navy #8fd8fb), Token-Namen unverändert; Startseiten-Hero als „Editorial"-Bühne: ein art-directed Praxisfoto mit eingebackenem Navy-Verlauf und Punktring ist LCP-Bild (eager, `fetchpriority=high`, `alt=""`), das Produkt steht als 320-px-Bild mit unverändertem Alt-Text in einer Karte nach den CTAs; Fachbereich-Einstiege als Foto-Karten; Trust-Leiste überlappt die Bühne; weiße Pille `Button variant="light"` auf Navy. Neues Arbeitspaket **AP34 — Relaunch-Design „Editorial" seitenweit** (PT34.1–PT34.4 + Closure) wird vor AP28 abgearbeitet.
- **Begründung:** Der Owner wählte am 2026-10-15 aus vier Startseiten-Varianten (`wireframes/relaunch-entwurf-3-varianten/`) die Variante C „Editorial", verlangte eine blaue statt weiße Kopfzeile („weil wir mit Blau in Verbindung gebracht werden"), die eigenen Markenfarben und das Durchziehen des Stils über die ganze Seite in Arbeitspaketen; Design vor den übrigen APs.
- **Bestätigende menschliche Entscheidung:** Projekt-Owner (Phillip), 2026-10-15, im Arbeitsauftrag.
- **Auswirkung auf Scope:** Keine neuen Inhalte, Claims, Routen oder Journeys. Die Hero-Produktkarte nutzt die bestehenden Strings von `HCL-008`. AP34 ist ein reines Gestaltungs-AP; AP28–AP33 bleiben unverändert und folgen nach der AP34-Closure.
- **Auswirkung auf Abhängigkeiten:** Inter bleibt. Befund-Ampel, Erfolgs-/Warnfarben und Consumer-Produktbilder sind nicht Teil des Akzentwechsels; Consumer-Seiten übernehmen den Akzent über dieselben Tokens. OG-Bild und ROI-PDF-Untertitel wechseln von Teal auf Logo-Blau.
- **Auswirkung auf Gates:** Budgets unverändert (gemessen, nicht gelockert); die Tests zum Hero-Bild (`HeroSection.test.tsx`, `e2e/home-hero.spec.ts`, `e2e/home-faq-seo-integration.spec.ts` PT11.6) prüfen jetzt Bühnenfoto (eager, Vorrang, `alt=""`, Maße, AVIF/WebP-Quellen) und Produktbild (lazy, 320×320, lokalisierter Alt-Text) getrennt; visuelle Baselines werden im gepinnten Image neu aufgenommen und im DESIGN-SYSTEM-CHANGELOG begründet.
- **Aktualisierte kanonische Dokumente:** `building-docs/work-packages/AP34.md` (neu), `building-docs/work-packages/README.md`, `building-docs/CONTEXT-INDEX.md`, `building-docs/state/AP-STATE.md`, `building-docs/HOMEPAGE-CONTRACT.md` (§2.2/§2.3), `building-docs/DESIGN-SYSTEM-CONTRACT.md` (§3.1/§3.2), `building-docs/DESIGN-SYSTEM-CHANGELOG.md`.

### SC-001 — Relaunch-Design-Iteration: Papierfläche, Fotografie, Pillen

- **Datum:** 2026-10-15
- **Status:** ACCEPTED
- **Betroffene IDs:** DEC-RL-002 (Art Direction), HOMEPAGE-CONTRACT §2.2, DESIGN-SYSTEM-CONTRACT §1/§3, AP05, AP11, AP27 (Baselines)
- **Vorheriger Zustand:** Sales-Machine auf kühlen Slate-Neutralen (`slate-50` Seitenfläche, `#f8fafc`), Navy-Kopfzeile mit Schleier, Icon-Karten ohne Fotografie, Hero mit freigestelltem Produkt auf weißer Scheibe, `rounded-md`-Schaltflächen; HOMEPAGE-CONTRACT §2.2: „no decorative stock image or generated asset is used".
- **Neuer Zustand:** Dieselbe Marke (Navy `#083358`, Teal-Akzent, Inter 400/500/600) auf einer warmen Papierfläche (`paper` #f5f3ee / `paper.deep` / `paper.line`), helle Kopfzeile mit dunklem Logo, Pillen-Schaltflächen, 22-px-Karten, 34-px-Bänder; Hero als Foto-Mosaik (vier Praxis-/Labor-Motive, Unsplash-Lizenz, lokal als AVIF/WebP) um das unveränderte 650×650-Produktbild; Fotos auf zwei Säulen-Karten. Headline `hero.title` neu in zehn Sprachen („Laborwerte. In Minuten. In Ihrer Praxis.").
- **Begründung:** Der Owner bewertete den Stand vom 2026-10-15 als „noch nicht schön" für eine Relaunch-Seite, ließ einen Entwurf (`wireframes/relaunch-entwurf/`) mit Orientierung an `panels.polarisdx.net` erstellen und beauftragte die vollständige Umsetzung „ohne die Technik zu brechen".
- **Bestätigende menschliche Entscheidung:** Projekt-Owner (Phillip), 2026-10-15, im Arbeitsauftrag.
- **Auswirkung auf Scope:** Kein neuer Bereich, keine neue Journey, keine neuen Claims. DEC-RL-002 bleibt im Kern (eine Art Direction, Light-Theme nach DEC-RL-003); die Bildsprache ist eine Erweiterung derselben Art Direction um Fotografie und warme Neutrale, keine zweite.
- **Auswirkung auf Abhängigkeiten:** Inter bleibt (PT25.4-Font-Pipeline, Perf-Budget); Figtree aus dem Entwurf wurde bewusst NICHT übernommen. Claim-Register HCL-001..014 unverändert; TrustBar-Strings byte-gleich.
- **Auswirkung auf Gates:** Neue Farbtoken in `tailwind.config.js` + `PALETTE_HEX` (DS-CL-5); alle visuellen Baselines (`pt27.6-visual`, `design-system`) werden im gepinnten Playwright-Image neu aufgenommen und im DESIGN-SYSTEM-CHANGELOG begründet; Perf-Budget der Startseite (`imageBytes` ≤ 89 249 B, `oversizedImages` 0) wird gegen den neuen Stand gemessen, nicht gelockert.
- **Aktualisierte kanonische Dokumente:** `building-docs/HOMEPAGE-CONTRACT.md` (§2.2), `building-docs/DESIGN-SYSTEM-CHANGELOG.md` (Change Note + SURFACE:colors), `building-docs/DESIGN-SYSTEM-CONTRACT.md` (§3.1 Hinweis auf `paper`).

### SC-000 — Baseline der Change Control (Initialisierung)

- **Datum:** 2026-08-24
- **Status:** `ACCEPTED`
- **Betroffene IDs:** `DEC-RL-001`–`DEC-RL-015`, `REST-01`–`REST-03`, `DEC-BASE-001`, AP00 / PT00.1
- **Vorheriger Zustand:** Kein formaler Change-Control-Mechanismus; Decision Locks lagen ausschließlich
  in `scope/MASTER-SCOPE.md` §0.2 und `PROJECT-CONSTRAINTS.md` vor, ohne eigenes Decision Record und
  ohne definierten Änderungsweg.
- **Neuer Zustand:** `building-docs/DECISIONS.md` spiegelt 18/18 Locks mit Status `LOCKED`;
  dieses Dokument definiert den verbindlichen Änderungsweg für Scope und bestätigte Entscheidungen.
- **Begründung:** Erfüllung von `PT00.1` / `ST00.1.5`. Ohne dokumentierten Änderungsweg konnten spätere
  Agent-Läufe bestätigte Entscheidungen faktisch durch Repository-Evidenz umschreiben.
- **Bestätigende menschliche Entscheidung:** Product Owner, bestätigt im Master-Scope
  (`Stand 2026-08-21`, Status FINAL / Decision-Locked); durch `PT00.1` nur gespiegelt, nicht geändert.
- **Auswirkung auf Scope:** keine. Es wurde **keine** Entscheidung geändert, ergänzt oder entfernt —
  ausschließlich gespiegelt und referenzierbar gemacht.
- **Auswirkung auf Abhängigkeiten:** keine.
- **Auswirkung auf Gates:** keine; die 12 Launch-Gates aus Master-Scope §8 bleiben unverändert.
- **Aktualisierte kanonische Dokumente:** `building-docs/DECISIONS.md` (neu),
  `building-docs/SCOPE-CHANGELOG.md` (neu), `building-docs/state/AP-STATE.md` (fortgeschrieben).

<!-- Neue Einträge werden unterhalb dieser Zeile chronologisch ergänzt. -->
