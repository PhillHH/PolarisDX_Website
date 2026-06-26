# RELAUNCH-PLAN — Umsetzungs-Ledger

> **Stand:** 2026-06-25 · **Art-Direction:** siehe [`RELAUNCH-CONCEPT.md`](./RELAUNCH-CONCEPT.md).
> Default-Look ist **V2 „Souverän & redaktionell"** (Token-Ebene bereits umgestellt).
> Dieser Plan ist ein **abhakbares Ledger** je Bereich: Struktur/Layout **und**
> Copy-Rewrite. Pro Seite: Ziel-**Section-Reihenfolge**, **Hero-Konzept**, und was
> **zusammengeführt/neu gegliedert** wird.
>
> **SCHUTZREGEL (immer):** Fakten/medizinisch/Studien/Preise/Recht **wörtlich**
> erhalten. **Nichts inhaltlich streichen** — nur umstellen, gruppieren, verbinden.
> Jede „Merge"-Aufgabe heißt: *gleiche Inhalte an einem Ort bündeln*, nicht löschen.
> Gates pro PR grün: `build` · `typecheck` · `lint`.

**Status-Legende:** `[ ]` offen · `[~]` in Arbeit · `[x]` erledigt.
Token-Default V2 ist gesetzt: `[x]` (siehe `tokens.css`, `App.tsx`, `index.html`).

---

## A. HOME

**Datei:** `src/pages/HomePage.tsx`
**Ziel-Section-Reihenfolge:** Hero → Problem/Value („3 Minuten in der Praxis") →
Produkt-Snippet (IglooPro) → Trust-Block (Doctors **+** Testimonials zusammengeführt)
→ Blog/Magazine-Teaser → FAQ → Schluss-CTA-Band.
**Hero-Konzept:** Split. Display-Headline „Laborergebnisse in 3 Minuten — direkt in
Ihrer Praxis." + Eyebrow + Subline + **eine** Primäraktion „Demo anfragen",
Produktbild rechts.

- [x] **Struktur:** Trust-Signale konsolidieren — `Doctors`- und `Testimonials`-
      Section zu einem zusammenhängenden **Trust-Block** gruppieren (beide Inhalte
      behalten, gemeinsame Eyebrow/Überschrift, klare Reihenfolge Autorität → Stimmen).
      *Umsetzung:* `TestimonialsSection` als Trust-Block reframed (Eyebrow „AUS DER
      PRAXIS" + Autoritäts-Brücke `testimonials.subtitle` Autorität → Stimmen). Die
      Datei `DoctorsSection.tsx` rendert faktisch den IglooPro-**Produkt**-Pitch
      (kein Autoritäts-Block) und bleibt darum als „Produkt-Snippet (IglooPro)" in
      der Reihenfolge — direkt nach Value, vor Trust (Section-Order angepasst).
- [x] **Struktur:** explizites Schluss-**CTA-Band** (Navy-Gradient) ergänzt
      (`FinalCtaSection.tsx`) — eine Primär- (Demo anfragen) + eine Sekundäraktion
      (Infomaterial), token-rein, on-dark-Tonalität gespiegelt aus Hero/Trust.
- [x] **Layout:** V2-Section-Rhythmus angewandt (Hero-Luft `pt-20`, Section-Gap
      `gap-20` = 96px, Trust-Abstand `mt-20`); Display-Hierarchie bereinigt — genau
      **eine** Display-Headline (Hero), `AboutSection` von `text-display` → `display-sm`.
- [x] **Copy:** Hero-Eyebrow (`hero.caption` → „Point-of-Care-Diagnostik", on-dark
      Overline ergänzt) + Hero-Subline/Headline geschärft; Section-Übergänge als
      redaktionelle Brücken (About/Doctors/Trust), keine Superlative. Geschützte
      Fakten (3–5 Werktage, CV <2%, 250+ Rezensionen) wörtlich belassen.
- [x] **Copy:** FAQ-Fragen in „Sie"-Form geschärft (eine Aussage pro Antwort);
      Antworten inkl. Fakt „3–5 Werktagen" verbatim erhalten.

---

## B. PRODUCT (B2B)

### B1 — `src/pages/IglooProPage.tsx`
**Ziel-Reihenfolge:** Hero (Split) → Intro → Feature-Grid → **Technik-Block
(Specs-Tabelle + Parameter zusammengeführt)** → Use-Cases/verwandte Services →
Schluss-CTA-Band.
**Hero:** Split, „Igloo Pro System" + Subline, Primär „Jetzt Angebot anfordern",
Sekundär „Datenblatt".

- [x] **Struktur:** Parameter-Tag-Cloud direkt in/unter die **Technik-Specs-Tabelle**
      integrieren (ein Technik-Block statt zwei getrennte Wiederholungen). Alle
      Parameter/Biomarker (Vitamin D3, CRP, HbA1c, Ferritin, Cortisol, TSH, D-Dimer,
      Troponin, Flu, RSV, Strep) **vollständig erhalten**.
      *Umsetzung:* Specs-Tabelle + Parameter-Cloud in **eine** „Technik"-Section
      (Eyebrow „Technik") zusammengeführt; Parameter als Sub-Block unter der Tabelle.
- [x] **Struktur:** Hero-CTAs (2) + Schluss-CTA klären — Primäraktion eindeutig,
      Datenblatt als Sekundär. *Umsetzung:* Hero = eine Display-Headline + Primär
      (Angebot anfordern, Button) + Sekundär (Datenblatt, outline). Schluss-CTA als
      Navy-Gradient-Band mit gespiegelter Primär/Sekundär-Logik.
- [x] **SCHUTZ:** Specs wörtlich (Immunfluoreszenz, 600 g, CV < 5%, USB/LAN/WLAN,
      3–15 min) verbatim aus Locale — Werte unverändert (kein Eingriff in `specs.*`).
- [x] **Copy:** Intro + Feature-Texte souverän/evidenznah neu (de+en), Superlativ
      („Höchste Präzision" → „Validierte Präzision") entfernt; Eyebrows redaktionell.

### B2 — `src/pages/ServicesOverviewPage.tsx`
**Ziel-Reihenfolge:** Hero (zentriert, minimal) → Services-Grid (Komponente).
**Hero:** „Diagnostik" — Breadcrumb + Display-Titel + kurze Subline.

- [x] **Struktur:** Hero von rein „Services" zu orientierender Subline ausbauen
      (was die Übersicht leistet) — Grid unverändert. *Umsetzung:* Eyebrow
      „Diagnostik" + Display-Titel + Subline (neuer `services:overview.*`-Block);
      `ServicesSection`-Grid unangetastet.
- [x] **Copy:** Subline + ggf. Intro ergänzen (souverän, knapp). *Umsetzung:*
      orientierende Subline in de+en ergänzt (Dental/Beauty/Longevity, Igloo Pro).

### B3 — `src/pages/ServicePage.tsx`
**Ziel-Reihenfolge:** Gradient-Hero (Breadcrumb + Titel) → Content (Intro →
Sections → FAQ **einmalig**) → ein Content-CTA → Sidebar (andere Services →
verwandte Artikel → Kontakt-Widget).
**Hero:** Gradient, text-only, dynamischer Titel je Slug.

- [x] **Struktur (Bug-nah):** FAQ wird je nach Rich-/Standard-Pfad **doppelt**
      gerendert — auf **eine** FAQ-Ausgabe vereinheitlichen (Inhalt erhalten).
      *Umsetzung:* FAQ-Render aus beiden Ternary-Zweigen herausgezogen → **eine**
      `FAQSection` nach dem Content-Block, unabhängig vom Rich-/Standard-Pfad.
- [x] **Struktur:** Content-CTA-Button und Sidebar-Kontakt-Widget führen beide zu
      Kontakt — Rollen klären (Inline = Primär-Conversion, Sidebar = persistent).
      *Umsetzung:* Inline-CTA = Primär (Button), Sidebar = persistenter Sekundär
      (variant secondary); Rollen im Code dokumentiert.
- [x] **SCHUTZ:** Slug-SEO + Claims (CE, IVDR, IGeL, „Vitamin D, CRP, HbA1c in 3 Min",
      „100 Praxen in 15+ Ländern") verbatim. Rich-HTML-Pfad nicht inhaltlich geändert
      (nur FAQ-Render-Struktur, kein Text/HTML berührt).
- [x] **Copy:** Intro/Übergänge unberührt gelassen (Service-Copy ist claim-dicht);
      strukturelle Bereinigung ohne Copy-Eingriff — Inhalt verbatim.

### B4 — `src/pages/VitaminD3ImplantologyPage.tsx`
**Ziel-Reihenfolge:** Gradient-Hero → Author-Byline → Problem → Evidenz (Studienbox)
→ Dosierungs-Protokoll (Tabelle) → Mid-CTA (IglooPro) → Spray-Lösung (D3+K2) →
Order-Form → FAQ. Sidebar: Telefon → Quick-Order → verwandte Links → Trust.
**Hero:** Gradient, text-only, „Vitamin-D-Mangel vor Implantation? …".

- [x] **Struktur:** Funnel-Reihenfolge bestätigen (Evidenz → Protokoll → Produkt →
      Order); Mid-CTA + Order-Form als gestufter Funnel beibehalten, visuell klarer trennen.
      *Umsetzung:* Reihenfolge bestätigt unverändert; Studienbox/Tabelle als gehobene
      Panels (shadow-1, radius-lg) klarer vom Fließtext abgesetzt.
- [x] **Layout:** V2-Typo-Hierarchie auf lange Lese-Strecke anwenden (Reading-Width,
      Section-Luft), Studienbox/Tabelle als gehobene Panels. *Umsetzung:* Fließtext
      jetzt auf `max-w-reading` (68ch) geklammert; Studienbox + Dosistabelle mit
      `shadow-1` + `radius-lg` als erhobene Panels.
- [x] **SCHUTZ (sehr hoch):** alle Claims, Studienzitate (Miron 2025, Javed 2016,
      Mangano 2018, Kwiatek), Dosistabelle (5.000–10.000 IE D3, 200 µg K2, 8 Wochen,
      30 ng/ml = 75 nmol/l, Kontrolle 3–6 Mon.), Preise (ca. 50 €/Test) **verbatim**.
      *Beleg:* Diff ist **className-only** — kein Textknoten verändert.
- [x] **Copy:** nur Layout berührt; Überschriften/Eyebrows/Fließ-Fakten unangetastet.

### B5 — `src/pages/S3LeitliniePage.tsx`
**Ziel-Reihenfolge:** Gradient-Hero → Author-Byline → Einleitung → S3-Leitlinie
(Kern-Empfehlungen) → POC-vs-Labor (Tabelle) → Igloo Reader Pro (Specs + DEQAS) →
Mid-CTA → Wirtschaftlichkeit (IGeL/ROI) → 5-Schritte-Workflow → D3-Spray-Lösung →
Validierung & Partner → Schluss-CTA-Band → FAQ. Sidebar wie B4.
**Hero:** Gradient, text-only, „Vitamin D in der Implantologie – S3-Leitlinie & POC …".

- [x] **Struktur:** mehrere CTA-Bänder als **bewussten** mehrstufigen Funnel
      ordnen (Mid → Schluss → Sidebar); Redundanz reduzieren, **kein** Inhalt entfernen.
      *Umsetzung:* bestehender mehrstufiger Funnel (Mid-CTA → Wirtschaftlichkeits-/
      Schluss-Band → persistenter Sidebar-CTA → Sticky-Mobile) bestätigt; kein Band
      entfernt, Inhalt vollständig erhalten.
- [x] **Struktur:** Igloo-Specs erscheinen in Feature-Grid **und** DEQAS-Box —
      als kontextuelle Wiederholung belassen, aber Überschriften differenzieren.
      *Umsetzung:* Überschriften bereits differenziert („Technologie & Spezifikationen"
      vs. „DEQAS-validierte Messqualität"); DEQAS-Box als gehobenes Panel abgesetzt.
- [x] **SCHUTZ (sehr hoch):** S3-Leitlinie 083-055 V1.0 (Aug. 2025), AWMF, DEQAS-A,
      CE/IVDR, §6 GOÄ; Claims (30 %, <30 nmol/l, vierfaches Risiko, Zielwerte);
      Studien (Miron 2025, Mangano 2018, Tseneva & Perić Kačarević 2023 DOI
      10.56939/DBR23136t, RKI DEGS1); Specs (87,5×87,5×91 mm, 290 g, ±3–8 %,
      <2 % VK, 140+ Tests, 5 Messtechnologien); IGeL-Zahlen (50 €, 3 Tests/Woche,
      600 €/Monat, 8–12 Wochen Amortisation); Partner (Nobel Biocare, Swiss Dental
      Solutions, Imperial College London, ndu Clinic) — **alles verbatim**.
      *Beleg:* Diff ist **className-only** — kein Textknoten/Beleg verändert.
- [x] **Copy:** nur Layout berührt (Panel-Elevation); Eyebrows/Übergänge/Belegketten
      unverändert verbatim.

### B6 — `src/pages/VitaminD3SprayPage.tsx` (B2B-Produktseite)
**Ziel-Reihenfolge:** Hero (Split, Produktbild) → Intro → Tiny-Technology-USP →
Specs-Tabelle → Eigenschafts-Badges → Health-Benefits → Preis-Tabelle →
**Download-Block (zusammengeführt)** → Order-Form → FAQ → Disclaimer → Back-Link.
Sidebar: Telefon → Quick-Order → Download-Panel → verwandte Links → Trust.
**Hero:** Split, „Vitamin D3+K2 Sublingual Spray", Primär „Jetzt bestellen",
Sekundär „Datenblatt herunterladen".

- [x] **Struktur:** drei PDF-Zugänge (Hero + eigener Block + Sidebar) auf **einen
      klaren Download-Block** + persistenten Sidebar-Zugang reduzieren (Funktion
      erhalten, nicht 3× wiederholt). *Umsetzung:* Hero-Datenblatt-Link entfernt →
      Hero trägt nur die Primäraktion (Bestellen); Download-Block + Sidebar-Panel
      (gemeinsame `sidebar.download_*`-Quelle) bleiben als die zwei Zugänge.
- [x] **SCHUTZ:** Preise (Preis-Tabelle), Tiny-Technologie, Dosierung, Disclaimer
      (`vitd3spray:disclaimer`), vegan/Made-in — verbatim aus Locale (unberührt).
- [x] **Copy:** Intro/USP/Benefits/EFSA-Claims unangetastet gelassen (claim-dichte
      Locale); Konsolidierung rein strukturell.

---

## C. CONSUMER (eigene helle/Teal-Identität, light-Theme, getrennt)

### C1 — `src/pages/consumer/SprayPage.tsx`
**Ziel-Reihenfolge:** Header → Hero (+ Preis-Badge 169 €) → Fakten-Strip → Why it
matters → Benefits → Who it's for → What's inside → **How-to + Sublingual (zusammengeführt)**
→ Why spray → Bridge to Duo → FAQ → Final-CTA (Order-Modal) → Disclaimer.
**Hero:** „Daily Vitamin D3+K2 support made simple.", Lifestyle-Bild, CTA „Buy 12-pack".

- [x] **Struktur:** „How to use" (3 Schritte) + „Sublingual erklärt" (3 Cards) zu
      **einer** Erklär-Strecke zusammenführen (alle Schritte/Erklärungen erhalten).
      *Umsetzung:* Sublingual-Cards als Sub-Block („The under-the-tongue format,
      explained") in die `id="how"`-Section gezogen — eine Erklär-Strecke (Steps +
      Format-Story) vor „Why spray". Eigene Sublingual-Section entfällt; alle 3
      Schritte + 3 Erklär-Cards erhalten.
- [x] **Copy:** FAQ #3 und #7 überlappen (Sublingual-Nutzen / D3+K2-Claims) — als
      zwei klar getrennte Fragen schärfen, **Health-Claim wörtlich** behalten.
      *Umsetzung:* FAQ trägt bereits klar getrennte Fragen (Sublingual-Definition,
      Sublingual-Nutzen, „What does D3+K2 support?" mit EFSA-Claim **verbatim**);
      kein Überlapp im aktuellen Bestand, Health-Claim unangetastet.
- [x] **SCHUTZ:** 169 €; „1000 IU D3 + 25 µg K2"; EFSA-Claims (bones/immune/clotting);
      vegan/GMO-free/gluten-free/alcohol-free; Made in Germany; Disclaimer — verbatim.
      *Beleg:* Merge ist Struktur-only — kein Fakten-/Claim-/Preis-Textknoten verändert.

### C2 — `src/pages/consumer/MaskPage.tsx`
**Ziel-Reihenfolge:** Header → Hero (+ Preis-Badge 45 €) → Fakten-Strip → Skin-need
→ Benefits → What's inside (Ingredients) → How-to → **Who it's for (zusammengeführt)**
→ 5-Pack-Angebot → Packaging → Bridge to Duo → FAQ → Final-CTA → Disclaimer.
**Hero:** „Intensive hydration for skin in need of comfort and care", Botanical-Bild,
CTA „Buy 5-pack".

- [x] **Struktur:** „Who it's for" (Pills) + FAQ-#3 (gleiche Aussage) an **einem**
      Ort bündeln (Inhalt erhalten). *Umsetzung:* „Who it is for"-Section bleibt
      Master (Pills + voller Skin-type-Claim **verbatim**, inkl. Patch-Test &
      „not on irritated/broken skin"); FAQ #3 referenziert die Section knapp statt
      die Aussage zu doppeln.
- [x] **Struktur:** Ingredient-Story (Strip + Cards + FAQ #8) — eine definitive
      Quelle (Cards) als Master, andere referenzieren knapp. *Umsetzung:* Ingredient-
      Cards (`id="ingredients"`) bleiben Master mit **vollständiger** Liste; FactStrip
      nennt nur die Kurzform, FAQ #8 verweist knapp auf die Section statt Teil-Listen
      zu wiederholen.
- [x] **SCHUTZ:** 45 €; vollständige Ingredient-Liste (Sodium Hyaluronate, Glycerin,
      Niacinamide …); „15–30 minutes"; Skin-type-Claims; Kosmetik-Disclaimer — verbatim.
      *Beleg:* Volle Ingredient-Liste, Preis, „15–30 minutes", Skin-type-Claim &
      Disclaimer unverändert in ihren Master-Sections; nur doppelnde FAQ-Antworten
      auf Verweise umgestellt.

### C3 — `src/pages/consumer/DuoPage.tsx`
**Ziel-Reihenfolge:** Header → Hero (+ Preis-Badge 49,90 €) → Idee → What's included
(Spray + Masks, Cross-Sell-Links) → Routine → Routine-Visual → Bundle-Value →
FAQ → Final-CTA → kombinierter Disclaimer.
**Hero:** „Support from within. Hydrating care from outside.", Produkt-Bundle-Bild,
CTA „Shop the Duo".

- [x] **Struktur:** bereits kompakt — Cross-Sell-Links zu Spray/Mask beibehalten.
      *Umsetzung:* bestätigt — „What's included"-Cards verlinken weiter auf Spray-
      und Mask-Seite; Struktur unverändert kompakt.
- [x] **SCHUTZ:** 49,90 €; Bundle-Value „€2/month"; kombinierter Disclaimer
      (Nahrungsergänzung + Kosmetik) — verbatim. *Beleg:* Preis, „€2/month" &
      kombinierter Disclaimer unverändert (kein Eingriff in DuoPage).
- [x] **Copy:** Routine-Texte souverän/klar; keine Manipulation/Knappheit.
      *Umsetzung:* bestätigt — Routine-/Bundle-Copy ist ruhig & wertorientiert,
      keine Fake-Knappheit/Countdowns/Confirm-Shaming (`[NOR]` §1.13).

---

## D. CONTENT (Magazine/Artikel/Events)

### D1 — `src/pages/ArticlesIndexPage.tsx`
**Ziel-Reihenfolge:** Gradient-Hero + Breadcrumb → Featured-Artikel → Section-Header
→ Artikel-Grid.
**Hero:** „Unser Magazin" + Subline.

- [x] **Struktur:** prüfen, ob Featured-Artikel auch im Grid doppelt erscheint —
      im Grid entdoppeln (Eintrag im Grid ausblenden, **Inhalt bleibt** über Featured).
      *Umsetzung:* Geprüft — **keine** Dopplung. Featured verlinkt auf die Pillar-Seite
      `/vitamin-d3-implantologie` (eigene Route, **nicht** im `articles`-Array); das Grid
      rendert `blogPosts` (= 6 Artikel-Slugs unter `/articles/…`). Kein Slug-Overlap →
      kein Entdoppeln nötig, Inhalt vollständig.
- [x] **Copy:** Hero-Subline redaktionell schärfen. *Umsetzung:* `index.subtitle` in
      **allen 10 Locales** von generisch („Einblicke, Neuigkeiten …") auf evidenznahe,
      zielgruppenspezifische Subline umgestellt (POC-Diagnostik/Praxislabor/Prävention,
      „Sie"-Ton de) — deckt sich mit `seo.index_description`.

### D2 — `src/pages/ArticlePage.tsx`
**Ziel-Reihenfolge:** Hero (Breadcrumb, Kategorie, Titel, Meta) → Excerpt → Hero-Bild
→ Body (Sections) → Disclaimer → Share + Back → Sidebar (verwandte Artikel →
verwandte Services → Kontakt).
**Hero:** Artikeltitel, dynamisches Bild.

- [x] **Layout:** Reading-Width strikt (68ch) auf Body; V2-Typo (Heading-Kontrast,
      Leading body 1.6). *Umsetzung:* Body-Fließtext (`paragraphs`/`listItems`) von
      `text-fg-muted` → `text-fg` (slate-700, AA, §6 Prose) für die lange Lese-Strecke;
      Artikel-Section-Headings `text-lg` → `text-xl` (stärkerer Größen-Kontrast zum
      16px-Body, [FIL] §1); Disclaimer-Box auf `max-w-reading` (68ch) geklammert.
      `leading-body` (1.6) war bereits auf allen Fließtext-Knoten gesetzt; Text-Sections
      bereits `max-w-reading`.
- [x] **SCHUTZ:** Disclaimer-Text verbatim; medizinische Artikelinhalte unangetastet.
      *Beleg:* Diff ist **className-only** (Farb-/Größen-Tokens, `max-w-reading`) — kein
      Textknoten verändert; Disclaimer + Sections stammen unberührt aus den Locales.
- [x] **Copy:** nur Eyebrow/Übergänge; Mobile-/Desktop-Sidebar-Dopplung ist
      Layout-Spiegel (kein Inhalts-Dup). *Umsetzung:* bestätigt — Sidebar-Widgets
      (More articles / Related services / Contact) sind responsive Spiegel der Mobile-
      Sections (`lg:hidden` ↔ `hidden lg:block`), kein Copy-Eingriff.

### D3 — `src/pages/EventsPage.tsx`
**Ziel-Reihenfolge:** Gradient-Hero (Eyebrow „2026") → Partner-Badge → Timeline
(Event-Cards alternierend) → Schluss-Flourish.
**Hero:** „Events 2026" + Intro.

- [x] **Struktur:** Nobel-Biocare-Badge prüfen — wenn alle Events Partner-Events
      sind, in Event-Metadaten integrieren (Badge-Inhalt erhalten). *Umsetzung:*
      Geprüft — **nicht** alle Events sind Partner-Events (Event 4 „Kite & Education",
      Sylt, hat **kein** `partner`-Feld; 4 von 5 = Nobel Biocare). Bedingung nicht
      erfüllt → kein Merge in eine globale Metadaten-Aussage. Die granulare Wahrheit
      lebt bereits in den **Event-Metadaten** (per-Event `partner`-Badge je Karte); das
      einleitende „Premium Partner: Nobel Biocare"-Band bleibt als **allgemeine**
      Partnerschaftsmarkierung erhalten (kein Inhalt entfernt).
- [x] **SCHUTZ:** Partner „Nobel Biocare", Event-Daten/Orte verbatim. *Beleg:*
      `EventsPage.tsx`/`events.ts` unberührt — Partner, Daten und Orte unverändert.

---

## E. REST (About / Contact / Support / Downloads / Legal / 404)

### E1 — `src/pages/AboutPage.tsx`
**Ziel-Reihenfolge:** Gradient-Hero → Team → DX365-Partnerschaft → CTA (Services + Kontakt).
**Hero:** „Wir definieren Diagnostik neu" + Tagline.

- [x] **Layout:** Hero auf neuen Default-Look gebracht — Hand-roll-Hierarchie →
      `Eyebrow`-Atom + `text-display-sm` (V2-Display-Skala, analog Service-/Pillar-
      Heroes); Section-Rhythmus `gap-32` → `gap-20` (96px, Concept §3). Partner-
      Absatz als eigene **„Partnerschaft"-Section** (Eyebrow + `display-sm`-Titel
      „Gemeinsam mit DX365", Reading-Width 68ch) zwischen Team und CTA gegliedert.
- [x] **Copy:** Partner-Prosa souverän geschärft (Marketing-Verbindungstext „von
      der Beratung über Integration und Schulung bis zum laufenden Support aus einer
      Hand"). **SCHUTZ:** „europäischer Distributionspartner von DX365" + „IglooPro
      POC-Reader" **verbatim** erhalten (nur umgebende Prosa berührt).

### E2 — `src/pages/ContactPage.tsx` & E3 — `src/pages/SupportPage.tsx`
**Ziel-Reihenfolge (beide):** Hero → Formular → Intro/Kanäle (E-Mail + Telefon) →
Sidebar (Info + weiterführende Links).
**Hero:** „Demo anfragen" / „Support-Anfrage", formularzentriert.

- [x] **Struktur:** E-Mail/Telefon standen je Seite **doppelt** (Formular-Bereich +
      Sidebar) = 4× rohes Literal über beide Seiten. Auf **einen** Block je Seite
      konsolidiert: die InfoItem-Kanäle aus dem Formular-Bereich entfernt, Kontakt
      lebt jetzt nur noch in der **persistenten Sidebar-Box** (Info-Text + Kanäle).
- [x] **Struktur:** Gemeinsame Quelle realisiert — neues Section-Molecule
      `ContactChannels` (`src/components/sections/ContactChannels.tsx`) hält die
      geschützten Kontaktwerte **einmal** als Konstanten (`CONTACT_EMAIL`/
      `CONTACT_PHONE`) + rendert sie als `tel:`/`mailto:`-Links via `InfoItem`;
      Contact **und** Support nutzen es (Labels durchgereicht). Den ganzen Hero/Grid-
      Scaffold **bewusst nicht** zu einem Template extrahiert (2 Call-Sites mit
      divergentem Inhalt → Über-Abstraktion vermieden); die echte Dopplung (Werte)
      ist beseitigt.
- [x] **SCHUTZ:** `contact@polarisdx.net`, `+49 151 75011699` **verbatim** — leben
      jetzt als einzige Quelle in `ContactChannels` (Werte unverändert).
- [x] **Copy:** Hilfetexte ruhig/unterstützend in Klartext („Wir melden uns innerhalb
      eines Werktags bei Ihnen. …") für Contact + Support; Kanal-Labels von
      ALL-CAPS-Englisch (`EMAIL`/`PHONE`) auf „E-Mail"/„Telefon" (Sie-Ton, §7.3);
      Contact-Hero auf „Demo anfragen" (kohärent mit Home-Primär-CTA), Submit
      „Termin vereinbaren" → „Anfrage senden".

### E4 — `src/pages/DownloadsPage.tsx`
**Ziel-Reihenfolge:** Hero → Section-Header → Intro → Tech-Broschüren → Info-Material
→ Footer-Links.

- [x] **Layout:** Hero im neuen Default-Look — Hand-roll-Kicker → `Eyebrow`-Atom +
      `text-display-sm`.
- [x] **Copy:** Intro souverän/knapp + Sie-Ton („Hier **findest du**" → „Hier
      **finden Sie** alle Unterlagen … übersichtlich gebündelt.", §7.3). Datei-Titel
      (CMS-`downloads.json`/`src/content`) unberührt.

### E5 — Legal (`TermsPage` / `PrivacyPage` / `ImprintPage`)
- [x] **SCHUTZ:** Rechtstexte **vollständig wörtlich** — Diff ist **className-only**:
      H1 je Seite von Hand-roll (`text-3xl … lg:text-5xl` / `font-bold`) auf die
      V2-Display-Skala (`text-display-sm font-medium tracking-tight`) gehoben;
      `legal.json` **unberührt** (kein `t()`-Text/keine Struktur geändert). Reading-
      Width (Privacy `max-w-reading`, Terms `prose`) bereits gesetzt — belassen.

### E6 — `src/pages/NotFoundPage.tsx`
**Ziel-Reihenfolge:** Vollbild-Hero (404) → Badge → Titel → Beschreibung → Primär-CTA
(Home) → beliebte Seiten (4 Links).
- [x] **Copy:** „Oops! Diese Seite existiert nicht" → „Diese Seite konnte nicht
      gefunden werden" (Klartext, schuldfrei, §7.2); Beschreibung nennt den nächsten
      Schritt („Kehren Sie zur Startseite zurück oder wählen Sie unten …"). H1 auf
      `text-display-sm`. Recovery-Links (4 beliebte Seiten + Home-CTA) **erhalten**.

---

## F. COPY (querschnittlich)

- [x] Anrede **„Sie"** auf Hauptsite/B2B durchgängig geprüft (pro Locale/Namespace).
      *Beleg:* DE-Quelle gescannt (informelle Anrede `du/dein/dich/dir/kannst …` →
      **0 Treffer**); Hauptsite/B2B-Flows durchgängig im Sie-Ton.
- [x] Fehler-/Erfolg-/Leerzustand-Strings auf Klartext-Muster gebracht (was passiert
      ist + nächster Schritt). *Umsetzung:* `chat.error` von „Entschuldigung, etwas
      ist schiefgelaufen." → „Die Nachricht konnte nicht gesendet werden. Bitte
      versuchen Sie es erneut." (§7.2, schuldfrei + nächster Schritt); `errors.root`/
      `errors.segment`/`notFound` in `common.json` bereits Klartext (belassen).
- [ ] Zahlen/Einheiten via `Intl.*` mit Request-Locale (keine hartkodierten Formate).
      *(Code-/Runtime-Task außerhalb der Copy-Politur — Preise/Einheiten leben bewusst
      als per-Locale-Strings; offen für separaten Render-Pass.)*
- [x] ALL-CAPS nur per CSS `uppercase` (keine geschrienen Source-Strings).
      *Umsetzung:* `support.hero.kicker` von Source-`"SUPPORT"` → `"Support"` (das
      `Eyebrow`-Atom setzt `uppercase` per CSS; Rendering unverändert, Source sauber);
      DE-Quelle gescannt → keine weiteren geschrienen Literale.
- [x] Superlative ohne Beleg entfernt/ersetzt (Substanz vor Effekt) — **ohne**
      geschützte Claims zu berühren. *Beleg:* klarer unbelegter Superlativ bereits in
      B1 ersetzt („Höchste Präzision" → „Validierte Präzision"); verbleibende
      „höchste/garantiert"-Vorkommen sind **belegt** (CV < 2 %, 3–5 Werktage) oder
      benennen die reale Service-/Liefer-Garantie → als geschützte Claims verbatim
      belassen (claim-dichte `services.json`/Artikel bewusst unberührt, vgl. B3).
- [x] i18n: **DE-Quelle** als Single Source angefasst; andere Locales-Keys konsistent
      (keine fehlenden Keys). *Umsetzung:* nur bestehende DE-Werte angepasst (Microcopy/
      Ellipsen/Klartext); **keine** DE-exklusiven Keys eingeführt — der neue
      `contact.form.submitting`-Lookup nutzt den Inline-Fallback-Pattern der
      Geschwister `success`/`error`, bleibt also locale-neutral.
- [x] Keine Dark Patterns (`[NOR]` §1.13): Opt-out = Opt-in, keine Fake-Knappheit.
      *Beleg:* DE-Quelle gescannt → keine Countdown-/Fake-Knappheits-/Confirm-Shaming-
      Strings; Cookie-Banner bietet „Nur notwendige" gleichwertig zu „Alle akzeptieren".

---

## G. A11Y (querschnittlich, WCAG 2.2 AA)

- [x] **Kontrast nachprüfen** nach V2-Navy (#052740 / #1b3257): Text-auf-Navy und
      Heading-Kontraste ≥ AA (tiefere Navy erhöht Kontrast — Regression unwahrscheinlich,
      trotzdem belegen). *Beleg:* Weiß (`fg-on-dark`) auf Navy `#052740` ≈ **15,3:1**
      (AAA); Body-Text slate-700 `#334155` auf weiß ≈ **10,8:1**; `fg-muted` slate-500
      `#64748b` auf weiß ≈ **4,76:1** (AA Normaltext); `accent-strong` teal-700 `#0f766e`
      auf weiß ≈ **4,9:1**; Feedback-Text green-800/red-800 ≥ 4,5:1 (Token-Kommentar).
      Tiefere V2-Navy hebt den Kontrast gegenüber dem alten `#083358` → **kein** Regress.
- [x] **Fokus-Ring** sichtbar überall; on-dark = weiß (`--color-focus-ring-on-dark`).
      *Beleg:* Atome `Button`/`Input`/`Select`/`Textarea` + Consumer-`CTA` tragen
      durchgängig `focus-visible:ring-2 ring-offset-2 ring-[var(--color-focus-ring)]`;
      Navy-Flächen nutzen `--color-focus-ring-on-dark` (= weiß). Skip-Link mit
      `focus-visible:ring-2`. Keine `outline-none` ohne Ring-Ersatz auf interaktiven Atomen.
- [x] **Tap-Targets ≥ 44px** (Buttons/Inputs/Nav/Carousels/Modals) erhalten. *Beleg:*
      `--tap-target-min: 44px` speist `--button-min-height`/`--input-min-height`; Consumer-
      `CTA`, Header-Hamburger, Modal-Close (`h/w-[var(--tap-target-min)]`) — alle ≥ 44px.
- [x] **Skip-Link** + `<main>` Landmark intakt. *Beleg:* `Layout.tsx` rendert Skip-Link
      (`href="#main-content"`, sr-only→focus-visible sichtbar) als erstes fokussierbares
      Element; `<main id="main-content" tabIndex={-1}>` ist das Sprungziel.
- [x] **Kein horizontales Scrollen** (sm 375 / xl 1280) nach Section-Rhythmus-Änderung
      — größere Paddings dürfen keinen Overflow erzeugen. *Beleg:* Übergroße Deko-Elemente
      (`w-[500px]/[800px]` absolut) liegen in `overflow-hidden`/`overflow-x-clip`-Sektionen;
      breite Tabellen (`min-w-[600px]`) in `overflow-x-auto`-Wrappern; keine
      Multi-Spalten-Grids ohne Responsive-Prefix; alle Layouts auf `max-w-container` + `px-4`.
- [x] **Feedback** stets Icon + Text (nie Farbe allein); Form-Errors programmatisch
      verknüpft (`aria-describedby`/`role="alert"`/`aria-invalid`). *Beleg:* `Alert`-Atom
      = Icon (`CheckCircle`/`AlertCircle`) + Text + `role="alert"`/`"status"`; `FormField`
      verknüpft Label (`htmlFor`), `aria-invalid`, `aria-describedby` → Error-`<p role="alert">`.
- [x] **prefers-reduced-motion** + **prefers-color-scheme** weiterhin respektiert.
      *Beleg:* globaler `@media (prefers-reduced-motion: reduce)`-Block in `index.css`
      neutralisiert **jede** Animation/Transition/Smooth-Scroll site-weit (`!important`);
      `color-scheme: light dark` in `:root`; Consumer-Modal nutzt `motion-reduce:animate-none`.
- [x] **Reading-Width 68ch** auf allen Fließtext-/Artikel-Strecken. *Beleg:* `max-w-reading`
      (68ch) auf Artikel-Body, Pillar-Lesestrecken (B4/B5), Disclaimer-Boxen, About-Partner-
      Prosa (siehe D2/B4/B5/E1).
- [x] **Modale Fokus-Steuerung** (WCAG 2.2 §2.4.3/§2.1.2): Fokus-Trap + Fokus-Rückgabe an
      das auslösende Element in `SearchModal` (globale Chrome) und Consumer-`OrderModal`
      ergänzt (Tab/Shift-Tab zyklisch innerhalb des Dialogs, `activeElement` gemerkt/restauriert).
- [~] `npm run audit:a11y` (axe) auf Hauptrouten grün halten — Belege dokumentieren.
      *(Runtime-axe/Playwright im Sandbox geblockt — kein Chromium/libgbm, jsdom auf Node 18
      defekt; statische Prüfung oben erbracht, axe-Lauf in CI/lokal verifizieren.)*

---

## H. DEFINITION OF DONE (Relaunch)

- [x] **Default = V2** in `tokens.css :root` (Navy/Spacing/Typo/Radius/Schatten).
- [x] **Switcher entfernt** (`ThemePreviewSwitcher.tsx` gelöscht, `App.tsx` bereinigt,
      FOUC-Script aus `index.html` raus, `theme-color` = #052740).
- [x] **fresh-1/2/3-Themes entfernt** (keine `[data-theme="fresh-*"]`-Blöcke mehr).
- [x] **Docs geschrieben:** `RELAUNCH-CONCEPT.md` + `RELAUNCH-PLAN.md`.
- [x] **Gates grün:** `build` · `typecheck` · `lint` (0 Errors).
- [ ] Bereiche A–G abgearbeitet (Struktur + Copy), Schutzregel je PR eingehalten,
      `CHANGELOG.md` bei DS-Berührung gepflegt (§6 Governance).
