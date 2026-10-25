# DESIGN-SYSTEM-CHANGELOG

**Änderungsprotokoll der öffentlichen Design-System-Oberfläche.**
Angelegt in **AP05 / PT05.5** (`AP05.md` §10.8), weil kein Changelog-System kanonisch existierte.

**Verwandt:** `DESIGN-SYSTEM-CONTRACT.md` (der Vertrag) · `tailwind.config.js` (Token-Werte) ·
`scripts/check-design-system-changelog.mjs` (das Gate).

---

## 0. Wozu dieses Dokument

Eine Änderung an Farbtokens, Typografie-Rollen oder Komponenten-Exporten ist ein
**Vertragsereignis**: an ihr hängen Aufrufstellen, die niemand einzeln im Blick hat. Wird eine
Rolle stillschweigend umbenannt oder entfernt, fällt das erst irgendwann auf einer Seite auf.

Deshalb gilt: **kein stiller Bruch.** Jede Änderung an der unten dokumentierten Oberfläche
bekommt eine Change Note **und** eine Aktualisierung des passenden `SURFACE`-Blocks.

Das Gate `npm run check:ds-changelog` vergleicht die **tatsächliche** Oberfläche im Code mit
der hier dokumentierten und schlägt bei jeder Abweichung fehl — pre-commit und in CI.

**Bewusst nicht hier:** Release-Notes-Prozess, Testabdeckung und Visual-Regression-Verdrahtung.
Das ist **AP27** und wird nicht vorweggenommen.

---

## 1. Change Notes

### 2026-10-25 — SC-017/SC-014 · Kopfzeile großzügiger, Shop-Kapsel, Praxisstimmen-Slider

- **Ursache:** Owner-Aufträge (`SCOPE-CHANGELOG.md` SC-014, SC-017).
- **Shell:** Kopfzeilen-Rahmen `max-w-[1600px]`, ab 1 536 px größere Variablenstufe; `.shop-group` /
  `.shop-link` / `.shop-badge` (32-px-Abzeichen, Praxis weiß, Panels `accent.on-dark`) ersetzen `.shop-tile`.
- **Startseite:** Proof als Slider (einheitliche Folie, Pfeil-Knöpfe 44 px mit dem Pfeil-Symbol der Bühne,
  Zähler statt Punkten — HTML-Budget).
- **Baselines:** PT27.6 17 von 21 neu (alle Desktop-Aufnahmen), zweiter Lauf 21/21.
- **Reviewer:** Claude (Messung 10 Sprachen × 1 280/1 536/1 920/2 560 px, axe, Sichtprüfung); Owner sah PNG-Vorschau.

### 2026-10-19 — SC-015 · Kopfzeile Entwurf B

- **Ursache:** Owner-Wahl 2026-10-19 (`SCOPE-CHANGELOG.md` SC-015), Vorlage als PNG.
- **Shell:** Rangfolge in der Leiste (laut: Bereiche; leise: Service/Unternehmen mit Trenner),
  `.shop-tile` (Praxis neutral `#ffffff14`/Ring `#ffffff26`, Panels `accent.on-dark` 10 %/Ring 40 %),
  Suche als Symbol, `LanguageSwitcher compact`, Button mit Pfeil-Kreis wie `HeroSection`, Lichtrand
  `0 0 0 4px #ffffff1a`. Sprachvariablen `--nav-fs`, `--nav-gap`, `--tools-gap`, `--tile-fs`, `--cta-fs`.
- **CSS-Architektur:** `.table-scroll` in `src/styles/table-scroll.css` (nur Artikel/S3), `.rv-rail-y` entfernt.
- **Baselines:** PT27.6 17 von 21 neu (alle Desktop-Aufnahmen; Kopfzeile), mobil unverändert, zweiter Lauf 21/21.
- **Reviewer:** Claude (Messung 10 Sprachen oben/gescrollt, axe, Sichtprüfung); Owner-Abnahme über die PNG-Vorlage.

### 2026-10-19 — SC-013 · Kopfzeile ab `xl`, sprachfester Bühnentitel

- **Ursache:** Owner-Auftrag 2026-10-19 (`SCOPE-CHANGELOG.md` SC-013).
- **Shell:** Desktop-Leiste ab `xl` statt `md`, ohne Umbruch; `.site-nav` 15 px / 16 px Abstand,
  in fr/es/nl/it/pl 14 px / 10 px; `.site-tools` 16 bzw. 12 px. Button einzeilig.
- **Bühne:** `.hero-title` mit `cqi`-Formel (Spalte als Container), Obergrenze 5 rem, Untergrenze
  1,75 rem; Bühne mindestens 820 px ab `lg`.
- **Baselines:** PT27.6 5 von 21 neu (`home-desktop`, `home-mobile`, `navigation-open-mobile`,
  `diagnostics-megamenu-open-desktop`, `cookie-banner-desktop` — Titelgröße), zweiter Lauf 21/21.
- **Reviewer:** Claude (Messung 10 Sprachen × 5 Breiten, Sichtprüfung fr/es); Owner-Sichtprüfung offen.

### 2026-10-19 — SC-010 · Bühnenfoto korrigiert (Hand vor dem Mund)

- **Ursache:** Owner-Befund 2026-10-19 (`SCOPE-CHANGELOG.md` SC-010).
- **Bild:** `practice-dental-2600.jpg` per Bild-zu-Bild korrigiert (Hände des Zahnarztes tief, Gesicht
  der Patientin frei), `npm run build:photo-look` erzeugt nur die sechs `hero-*`-Stufen neu.
- **Baselines:** PT27.6 5 von 21 neu (`home-desktop`, `home-mobile`, `navigation-open-mobile`,
  `diagnostics-megamenu-open-desktop`, `cookie-banner-desktop`; Diff nur im Fotobereich), Image
  `mcr.microsoft.com/playwright:v1.57.0-noble`, zweiter Lauf 21/21.
- **Reviewer:** Claude (Variantenauswahl, Ausschnittprüfung Desktop/Mobil); Owner-Sichtprüfung offen.

### 2026-10-19 — SC-009 · Panel-Promo, Praxisstimmen-Karten, `.rich-content` aus dem Inline-CSS

- **Ursache:** Owner-Aufträge 2026-10-19 (`SCOPE-CHANGELOG.md` SC-009).
- **Startseite:** `PanelsPromoSection` — Navy-Fläche (`rounded-band`, `brand-ring`), `t-eyebrow-dark`,
  H2 `clamp(26px,3.6vw,40px)`, weiße Primärpille mit `ArrowUpRight` plus Ghost-Pille (`ring-white/25`);
  ab `lg` Text links, Aktionen rechts gestapelt; mobil volle Breite. Proof: drei Karten
  (`rounded-card`, `border-paper-line`, `shadow-card`) mit Zitat, Trennlinie, rundem 56-px-Porträt; ab
  `md` dreispaltig. Keine neuen Tokens, Rollen oder Bausteine.
- **CSS-Architektur:** `.rich-content` liegt in `src/styles/rich-content.css` (eigene Datei, nur im
  Altinhalt-Zweig der Dienstseite geladen); `.article-col` bleibt in `index.css`. Initial-CSS 16,6 KB
  gzip statt 17,3. Porträts nicht mehr inline (`assetsInlineLimit`).
- **Gates:** Budget 852/852, Axe 25/25, Vitest 641/641, E2E Startseite 72/72.
- **Baselines:** PT27.6 21/21 unverändert (die neuen Flächen liegen unter dem Falz der 1280×800-Aufnahme).
- **Reviewer:** Claude (Implementierung, Messung, Sichtprüfung per Playwright-Aufnahme de/en, 1280 und
  390 px); Owner-Sichtprüfung auf der Preview offen.

### 2026-10-18 — SC-008 · Panel-Shop als dritte Aktion in der Epigenetik-Bühne (reines Design-Delta)

- **Ursache:** Owner-Auftrag 2026-10-18 (`SCOPE-CHANGELOG.md` SC-008): Button auf der Epigenetik-Seite zum
  Panel-Shop `panels.polarisdx.net` für Endkunden.
- **Seite `/epigenetics` (Bühne):** dritte Pille „Zum Panel-Shop" neben „Angebot anfragen", gleiche
  Ghost-Rolle (weiße Schrift, `ring-white/25`, Hover `bg-white/10`) plus `ArrowUpRight` 16 px als
  Hinweis auf das externe Ziel; unter 640 px gestapelt, volle Breite. Keine neuen Tokens, Rollen oder
  Bausteine.
- **Gates:** Typecheck, ESLint, Prettier, Guards grün; Vitest unit+component 637/637; Perf-Budget
  `epigenetics-hub` 70/70. Kein Budget gelockert.
- **Baselines:** PT27.6 1 von 21 Bildern neu (`epigenetics-hub-desktop`, Ursache die neue Pille), im Image
  `mcr.microsoft.com/playwright:v1.57.0-noble`; die übrigen 20 ohne Update grün.
- **Reviewer:** Claude (Implementierung, Baseline-Prüfung im Docker-Image); Owner-Sichtprüfung auf der
  Preview offen.

### 2026-10-17 — SC-007 · Panel-Shop in Kopfzeile und Startseiten-Band (reines Design-Delta, kein Vertragsbruch)

- **Ursache:** Owner-Auftrag 2026-10-17 (`SCOPE-CHANGELOG.md` SC-007): „Der Panelshop, muss unbedingt von
  der Hauptseite und auch von der Startseite aus erreichbar sein." Der zweite Shopify-Store
  `panels.polarisdx.net` war bis dahin von keiner Seite verlinkt.
- **Shell (Kopfzeile):** neunter Desktop-Eintrag „Panels" rechts neben „Shop" (gleiche `NAV_LINK`-Rolle,
  Unterstreichung auf Hover, kein Untermenü); im mobilen Menü derselbe Eintrag mit „Neu"-Label
  (`SHOP_BADGE`). Damit neun Einträge ungescrollt (Logo `h-12`) in eine Zeile passen, ist der
  Desktop-Abstand ab `xl` 16 px statt 20 px (`xl:gap-4`, derselbe Wert wie die Bedienleiste rechts);
  gemessen bei 1366 px: de/en/it/pt/pl/cs/da einzeilig, nl/fr/es brechen oben um und sind im kompakten
  Scrollzustand einzeilig (fr/es schon vor SC-007). Italienisches Label „Negozio" → „Shop".
- **Startseite (Shop-Band):** zweite Pille „Zum Panel-Shop" als Navy-Kontur (`border-paper-line`,
  `text-brand-deep`, Hover `border-brand-deep`) neben der gefüllten Navy-Pille „Zum Praxis-Shop"; beide
  mit SC-006-Lift (`hover:-translate-y-0.5`, bei Bewegungsreduktion keiner) und rutschendem Pfeil; unter
  640 px gestapelt, volle Breite. Eyebrow „Neu · Online-Shops", Titel und Hinweiszeile nennen beide
  Shops. Keine neuen Tokens, Rollen oder Bausteine — alle Utilities existierten (Initial-CSS 17 667 B
  gzip unverändert).
- **Gates:** Typecheck, ESLint, Prettier, Guards grün; Vitest 1 124/1 124; E2E 131/131; Axe-Gate PT24.6
  25/25; Perf-Budget `check-budgets --profile ci` 852/852 (Kopfzeilen-Anker 24–35 B gzip HTML je Route,
  Service-Seite 67 B Luft; Band +109 B de / +129 B pl). Kein Budget gelockert.
- **Baselines:** PT27.6 (17 von 21 Bildern neu, im Image `mcr.microsoft.com/playwright:v1.57.0-noble`,
  zweiter Lauf ohne Update 21/21 grün): `article-desktop`, `contact-desktop`, `cookie-banner-desktop`,
  `diagnostics-hub-desktop`, `diagnostics-megamenu-open-desktop`, `epigenetics-hub-desktop`,
  `epigenetics-panel-desktop`, `home-desktop`, `igloo-pro-desktop`, `legal-privacy-desktop`,
  `musterbefund-desktop`, `navigation-open-mobile`, `not-found-desktop`, `resource-center-desktop`,
  `resource-gate-open-desktop`, `service-detail-desktop`, `support-desktop` — Ursache überall der neue
  Kopfzeilen-Eintrag (Desktop) bzw. die beiden Shop-Einträge im mobilen Menü; `home-desktop` zusätzlich
  das Band unter dem Falz nicht im Bild, nur die Kopfzeile. Unverändert und byteidentisch:
  `consumer-spray-desktop`, `consumer-spray-mobile`, `home-mobile`, `search-dialog-open-desktop`.
  Design-System-Spec: 35/35 grün, keine neuen Bilder (byteidentisch).
- **Reviewer:** Claude (Implementierung, Messung, Baseline-Prüfung im Docker-Image); Owner-Sichtprüfung
  auf der Preview offen.

### 2026-10-16 — SC-006 · „Editorial Motion“: lebendige Flächen, Zeiger-Spot, Scroll-Eintritte, mobile Schnapp-Reihen; Altlasten entfernt (Design-Delta + Typo-Rollen, kein Vertragsbruch)

- **Ursache:** Owner-Auftrag 2026-10-16 nach dem Go-live (`SCOPE-CHANGELOG.md` SC-006): „Verbessere das
  Design maximal mobil und Desktop … cooler, etwas interaktiver und noch moderner, eyecatchy ohne die CI zu
  brechen … und konsistent“, Ausrollen nur auf die Preview. Sichtprüfung des Live-Stands: kaum Bewegung,
  Flächen ohne Tiefe, Startseite mobil ≈ 15 000 px, FAQ zentriert als einzige Sektion, Reste älterer Stände
  (Glas-Karte, neutrale Schatten, Teal-Halo im Dialog).
- **Neue Typo-Rollen (SURFACE:typography):** `t-display` (Sektionstitel: `text-balance
text-[clamp(2rem,4vw,2.9rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-heading`, ersetzt
  dieselbe Kette an sechs Stellen), `t-eyebrow` und `t-eyebrow-dark` (ersetzen die Eyebrow-Kette an 43 + 9
  Inline-Stellen; `EYEBROW_LIGHT`/`EYEBROW_DARK` liefern jetzt diese Rollen). Rein additiv, visuell identisch;
  Grund ist das `htmlBytes`-Budget (CSS liegt inline im HTML, jede Wiederholung zählt). Dazu `t-stage-h1`
  (H1 der vier Navy-Bühnen `DiagnosticsHero`, `IglooProHero`, `AreaStage`, `SubpageHero`) — die Service-Seite
  lag nach der Integration 18 B über ihrem `htmlBytes`-Limit. Eine Pillen-Rolle wurde gemessen und verworfen:
  Ring-Utilities per `@apply` kosteten mehr CSS (auf jeder Seite inline) als die Kette im HTML spart.
- **`Reveal` ist reines CSS:** die JS-Einblendung (IntersectionObserver, Inline-Transition) wich der Klasse
  `rv`; API (`width`, `delay`, `duration`, `yOffset`, `REVEAL_STAGGER`) bleibt, die Zeitwerte sind
  wirkungslos. Grund: ohne die Startseiten-Hüllen wanderte `Reveal` aus dem Entry in die Routen-Chunks
  (+0,3–0,8 KB gzip je Route, sieben `routeJsGzip`-Budgets rot); als CSS kostet er nichts und bewegt sich
  wie der Rest der Seite. `enter` bewegt nur die Position (kein Deckkraft-Start bei 0): sonst zählt Chrome
  H1/Lead nicht als LCP-Kandidaten (gemessen +600 ms auf Text-LCP-Routen).
- **Gemeinsame Bewegungs- und Flächenbausteine** (`src/index.css`, Abschnitt „Editorial Motion“;
  DESIGN-SYSTEM-CONTRACT §9.8): `.aurora` (Akzent-Lichtschein auf Navy aus `theme(colors.accent … / 45 %)` und
  `accent.line / 28 %`, driftet 16 s), `.spot` + `data-spot` (Lichtpunkt unter dem Zeiger, Position per
  `useSpotlight()` aus `src/lib/spotlight.ts` als `--mx/--my` über das CSSOM — kein Inline-Style-Attribut),
  `.rv`/`.rv-rail`/`.rv-rail-y` (Eintritt — 24 px Versatz ohne Deckkraft — bzw. Linienzug mit
  `animation-timeline: view()`, hinter `@supports`; Deckkraft bleibt 1, weil axe Zwischen-Deckkraft als
  Kontrastfehler wertet und große Textblöcke sonst lange blass blieben), `.enter` (gestaffelter Sofort-Eintritt, 0,7 s, Geschwister +0,1 s), `.rail-x` (unter 768 px
  Schnapp-Reihe mit `scroll-snap`, Karten 84 %, aktive Karte per `view(inline)` groß), `.faq-panel`,
  `.float-slow` (ersetzt `hero-float`/`hero-float-2`; nie auf Elementen, die Tests oder Nutzer anfassen —
  Playwright wartet auf einen stabilen Rahmen, der Hero-Produktkarte wurde das Schweben wieder genommen).
  Gemessen und wieder gestrichen: ein zweiter Lichtfleck je `aurora`, die Skalierung der aktiven Karte in der
  Schnapp-Reihe (verschob die Schnapp-Position) und ein Lesefortschritt unter der Kopfzeile — zusammen ~120 B
  gzip CSS auf jeder Seite, die die Service-Seite nicht hatte. Alles in `@media (prefers-reduced-motion: no-preference)`; das Sicherheitsnetz (§9.1) bleibt.
- **Shell:** Kopfzeile gescrollt kompakter (Innenabstand, Logo 32/36 px), leicht durchscheinend
  (`bg-brand-deep/90 backdrop-blur-sm`), Schatten `shadow-dialog` statt `shadow-[0_4px_30px_rgba(0,0,0,0.25)]`.
  `Button` primary/secondary/light heben sich beim Zeigen 2 px (`motion-reduce:hover:translate-y-0`).
- **Startseite (Sektionen):** Startseite: Hero mit Lichtschein auf der Bühne, gestaffeltem Eintritt von Pille/H1/Lead/CTA (`enter`), schwebender Produktkarte (`float-slow`) und Pfeilkreis, der beim Zeigen nach rechts rückt; mobil kompakte Produktkarte (80-px-Render) und einzeilige Caption-Pille, Bühne 54 px kürzer. Trust-Leiste unverändert als Scharnier. Säulen: Lichtpunkt unter dem Zeiger (`spot`), Lift, Akzentrand, Bildzoom, schwebendes Explosions-Render, Musterbefund wächst beim Hover; unter 768 px eine Schnapp-Reihe (`rail-x`, Sektion mobil 3 007 → 2 074 px); Fachbereich-Zeilen mit gefüllter Pfeilkachel. Shop-Band mit Live-Punkt und rutschendem Pfeil. Warum POC: drei Signale auf eigenen Haarlinien, mobil Icon-Kachel neben dem Titel; Praxis-Karte mit Akzentrand, Patienten-Karte mit Lichtschein. Ablauf: unter `lg` senkrechte Zeitleiste (Kachel links, Text rechts, Cyan-Linie), ab `lg` drei Spalten mit Haarlinie, die sich beim Scrollen zeichnet (`rv-rail`). Referenz: größeres Anführungszeichen, Portrait auf Papierfläche, Aufteilung 1:2. ROI: Eingaben auch mobil zweispaltig (Sektion −300 px), Ergebniskarte mit Lichtschein, Kennzahl tritt bei jeder Eingabe neu ein. Wissen: Bildzoom, Handlungslink schließt die Leseliste ab. FAQ: Kopf linksbündig im Seitenraster, dekorative Nummern 01–04 außerhalb des Buttons (`aria-hidden`), Chevron in `icon-tile` (offen Navy), Antwort klappt weich auf (`faq-panel`), Fußzeile „Noch Fragen?“ nach dem Akkordeon. Startseite mobil 15 025 → 13 532 px.
- **Unterseiten (Konsistenz):** Diagnostik-, IglooPro-, Bereichs- (`AreaStage`, ohne Bild) und Unterseiten-Bühne (`SubpageHero`) tragen `aurora` und den gestaffelten Texteintritt, Pfeilkreis-CTAs rücken beim Zeigen; `SubpageHero` folgt der Rhythmik der Bereichsbühnen (Pfad, H1, Lead, Aktionen), Pillen mit Lift; Final-CTA tritt als ein Block ein; Diagnostik-Karten, `BlogCard` (ohne Aufrufer) und „Nächster Schritt“-Karten mit Lift, Akzentrand, Bildzoom und rutschendem Pfeil; `ServiceCard` im Kartenrezept statt Glas. Kopfzeile seitenweit kompakt beim Scrollen mit Lesefortschritt.
- **Entfernt / vereinheitlicht (Gegenfinanzierung, −2,3 KB CSS roh):** `.glass-panel`/`.glass-panel-dark`
  (letzte Nutzung `ServiceCard` → Kartenrezept `rounded-card border-paper-line bg-white shadow-card`),
  `.bg-noise` (eine dekorative Schicht auf der S3-Leitlinien-Bühne; das Papierkorn liegt weiter auf `body`),
  Teal-Halo des `modal-card-in` (drei Box-Shadow-Stufen aus der Teal-Zeit; Ruheschatten ist `shadow-dialog`
  an der Karte), neutrale Schatten `shadow`/`shadow-sm`/`shadow-lg` → `shadow-card`, `shadow-xl`/`shadow-2xl`
  → `shadow-dialog`, `shadow-inner` entfällt; `backdrop-blur`/`-md`/`-xl` → `backdrop-blur-sm`. Die
  `<Reveal>`-Hüllen der Startseite (drei Doppel-Divs mit Inline-Style) entfallen; `Reveal` bleibt für die
  übrigen Seiten. FAQ-Schema der Startseite steht im Body hinter der FAQ (HOMEPAGE-CONTRACT §7, −508 B gzip).
- **Gates:** Typecheck, ESLint, Prettier, Guards (`test:guards`) grün; Vitest 1 121/1 121; E2E Startseite/Navigation/SEO/Bühnen 131/131 (Produktionsbuild); Axe-Gate PT24.6 25/25 grün (alle öffentlichen Routen serious/critical 0, 17 dynamische Zustände, Kernrouten de/en/pl/fr, 390 px); Perf-Budget `check-budgets --profile ci` 852/852 gehalten — Initial-CSS 17 667 B gzip (Limit 17 858, Ausgang 17 672), Initial-JS 163 121 B gzip (Limit 164 778), `htmlBytes` Startseite de 34 228 / 34 712 B (vorher 34 658 — 484 B Luft statt 54), pl 34 542 / 35 013 B (vorher 23 B Luft), Service-Seite 30 926 / 31 025 B (99 B Luft wie vorher), LCP mobil Startseite 720 ms (vorher 816), Service-Seite 616 ms; alle Routen-JS-Budgets gehalten (Reveal als CSS). Gemessen und korrigiert auf dem Weg: Routen-Chunks wuchsen, als `Reveal` und `SectionHeader` aus dem Entry fielen (→ Reveal reines CSS, Artikelindex ohne SectionHeader); `enter` mit Deckkraft 0 kostete Text-LCP-Routen ~600 ms (→ nur Position); eine Pillen-Rolle kostete mehr CSS als sie HTML sparte (→ verworfen); `/de/articles` Aufmacherbild unter dem Falz (→ Unterseiten-Bühne mobil wieder kompakt); Axe meldete Zwischen-Deckkraft des Scroll-Eintritts als Kontrastfehler (→ `rv` ohne Deckkraft) und einen Altlast-Kontrast auf der Vitamin-D3-Seite, den der JS-Reveal vorher verdeckt hatte (→ `t-caption`). Visuelle Baselines PT27.6 15/21 neu, Design-System-Spec 4/35 neu, je zweiter Lauf grün.
- **Baselines:** PT27.6 (15 von 21 Bildern neu, im Image `mcr.microsoft.com/playwright:v1.57.0-noble`, zweiter Lauf ohne Update 21/21 grün): `contact-desktop`, `cookie-banner-desktop`, `diagnostics-hub-desktop`, `diagnostics-megamenu-open-desktop`, `epigenetics-hub-desktop`, `epigenetics-panel-desktop`, `home-desktop`, `home-mobile`, `igloo-pro-desktop`, `legal-privacy-desktop`, `navigation-open-mobile`, `resource-center-desktop`, `resource-gate-open-desktop`, `service-detail-desktop`, `support-desktop`. Design-System-Spec (4 von 35 neu, zweiter Lauf 35/35 grün): `final-cta-articles-desktop`, `final-cta-articles-mobile`, `longform-service-desktop`, `longform-service-mobile`. Ursache überall: SC-006-Flächen (Lichtschein auf Navy, kompakte Kopfzeile bei Scroll, FAQ-Nummern, Unterseiten-Bühne, Kartenrezept statt Glas); unveränderte Bilder blieben byteidentisch.
- **Reviewer:** Owner-Sichtprüfung auf der Preview offen; technischer Reviewer: Claude (Agenten-Review je Sektion).

### 2026-10-16 — SC-005 · Startseite als Agentur-Komposition: lockerer Mix statt Fotoreihen (Design-Delta, kein Vertragsbruch)

- **Ursache:** Owner-Auftrag 2026-10-16 (`SCOPE-CHANGELOG.md` SC-005): „Geh mal als Agentur, der
  man 30.000 Euro dafür bezahlt und die perfekte Seite bringt. Nicht zu viele Fotos, aber auch nicht
  zu wenig. Viele Elemente, die Informationen müssen immer klar ersichtlich sein. Lockerer Mix und
  hochwertige, echte, natürliche Fotos." Bildwelt 2 stellte unterhalb der Bühne acht gleichartige
  Foto-Kacheln in drei Dreierreihen (zwei Säulen, drei Fachbereiche, drei Artikel); Information
  stand hinter Stimmung zurück, und die Startseite lag genau am `htmlBytes`-Limit.
- **Komposition** (nur Darstellung; Sektionsfolge, Claims, CTAs, Routen, `data-*`-Attribute und
  Copy-Schlüssel unverändert, `src/pages/HomePage.tsx` unverändert):
  - **Geschäftssäulen** (`BusinessPillarsSection.tsx`): drei verschiedene Bildarten statt drei
    gleichartiger Fotos — Diagnostik eine Parameter-Tafel (`<ul>` aus Chips
    `rounded-full border-paper-line bg-white`, Punkt `accent.line`; Inhalt zur Laufzeit aus den
    vorhandenen `segments.{dental,beauty,longevity}.bio`, am „·" getrennt, dedupliziert; einziger neuer
    Schlüssel `business_pillars.pillars.diagnostics.board_label`, 10 Sprachen), IglooPro das
    Explosions-Render (`igloo-explode-240w.webp`, unverändert), Epigenetik der echte Musterbefund
    (`report-preview-{400,800}w.webp` aus `befund-biologische-altersuhr@2x.webp`, als Dokumentkante
    `rounded-t-lg border-paper-line shadow-card`). Das Säulen-Icon steht in der H3; das weiße Badge
    auf der Bildfläche entfällt (spart HTML-Bytes).
  - **Fachbereich-Einstiege:** nummerierte Leseliste (`<ol>`, `divide-y divide-paper-line`,
    Nummern 01–03 in `accent.strong`, Titel + Biomarker-Zeile + `icon-tile`-Pfeil, jede Zeile ein
    Link mit unverändertem `data-core-service`/`data-route-id`) neben EINEM Detailfoto 4:5
    (`detail-capillary-{480,960}w`, `rounded-card` auf `paper.deep`, `alt=""`). Mobil Text → Liste
    → Foto; ab `lg` steht das Foto links über Kopf und Liste (`lg:order-first lg:row-span-2`).
  - **Ablauf** (`StepsSection.tsx`): Zeitleiste statt drei weißer Karten — Navy-Nummernkacheln
    (`icon-tile h-12 w-12 bg-brand-deep`) 01–03, ab `md` durch eine Haarlinie `paper.line`
    verbunden; dieselbe `<ol>`, derselbe Text; Sicherheitshinweis als Absatz mit linker Linie
    (`border-l-[3px] border-accent`).
  - **Wissen** (`BlogSection.tsx`): ein hervorgehobener Artikel mit 16:9-Foto (`rounded-card`,
    `shadow-card`, Label `blog.featured`) plus Leseliste (02, 03) in derselben Zeilenform; drei
    `<article>`; `aria-labelledby="homepage-knowledge-title"`, `blog.eeat_text` als Vorspann; „Alle
    Fachartikel" behält `data-home-secondary-conversion="knowledge"`.
- **Bildwelt 3 (Stilsatz 3, `assets-src/photos/PROMPTS.md`):** die Startseite zeigt genau zwei
  generierte Fotos (Bühne + Detail) sowie das echte Porträt der Praxisreferenz und ein Artikelfoto.
  Neuer Stil: Reportage in einer zeitgemäßen, neu gebauten deutschen Zahnarztpraxis
  (minimalistisch, Weiß/Hellgrau mit wenig heller Eiche, vorhandenes Licht, niemand blickt in die
  Kamera, nichts gestellt, Spur Filmkörnung, nicht glossy, nicht Stock); Gemini
  `gemini-3-pro-image-preview`, drei Varianten je Slot, Bühne per Bild-zu-Bild auf 4K. Pool jetzt
  sieben Quellen (Bühne `practice-dental-2600.jpg`, Detail `detail-capillary.jpg`, fünf Artikelfotos
  aus Runde 2 unverändert); `practice-dental/-beauty/-longevity/-consult.jpg` und `lab-analyst.jpg`
  samt Stufen gelöscht, `SERVICE_IMAGES`/`PILLAR_IMAGES` entfallen, neu `DETAIL_IMAGE`
  (`homeImages.ts`). Pipeline `build-photo-look.mjs`: die fünf `card()`-Aufrufe ersetzt durch
  `card('detail-capillary.jpg', 'detail-capillary', 4/5, [480, 960], [40, 44])` plus den
  Musterbefund-Schritt (400/800w WebP, 400w hält `oversizedImages` bei 384 px Kartenbreite); Bühne
  und Artikel mechanisch unverändert. Fotoregel im DS-Vertrag ergänzt: Fotografie ist Akzent, nicht
  Tapete; drei gleich große Fotos in einer Reihe sind nicht mehr zulässig.
- **Budgets (PT25.5, nicht gelockert):** home `htmlBytes` 33,8 KB (Grenze 33,9; vorher genau am
  Limit), Desktop-`imageBytes` 65,1 KB (vorher 81,3; Grenze 87,2), mobil 33,7 KB, Initial-JS
  159,4 KB gzip (Grenze 160,9), LCP-Bild 10,5 KB Desktop / 9,4 KB mobil. Gemessen 2026-10-16 mit
  `node scripts/perf/check-budgets.mjs --profile ci --routes home,home-en,home-pl --runs 1`;
  vollständiger Lauf folgt. `src/components/sections/*.test.tsx` 35/35 unverändert grün (Säulen 6
  Links; Ablauf 3 geordnete Schritte, erstes `span` = Nummer; Wissen 3 `article`).
- **Oberfläche:** keine neuen Tokens, Typo-Rollen oder Komponenten-Exporte; `SURFACE`-Blöcke
  unverändert.
- **Betroffene Screenshots (aktualisiert im Playwright-Docker-Image v1.57.0, gegengeprüft 21/21 und
  35/35):** PT27.6 `home-desktop`, `home-mobile`, `cookie-banner-desktop`,
  `diagnostics-megamenu-open-desktop`, `navigation-open-mobile`, `search-dialog-open-desktop` (neue
  Bühne und neue Komposition); Design-System-Spec unverändert (die Artikelkarten des Final-CTA-Specs
  liegen außerhalb der Startseite).
- **Reviewer:** Owner (Auftrag 2026-10-16); Sichtprüfung auf der Preview steht aus.

### 2026-10-16 — Bildwelt 2: KI-generierte Praxisszenen (Gemini), warmer Polaris-Look, IglooPro „hin und wieder" (Design-Delta, kein Vertragsbruch)

- **Ursache:** Owner-Feedback in drei Schritten am selben Tag: „geilere, konsistente Bilder in
  unserer CI" → „Igloo statt Labor, wir haben nicht viel mit dem Labor zu tun" → „nicht Stock,
  lebendig und fröhlich, Praxen nicht so klinisch" → „vielleicht auch das Igloo hin und wieder
  präsentieren". Die 14 Unsplash-Quellen sind entfernt; alle elf Pool-Motive (`assets-src/photos/`)
  sind jetzt KI-generiert (Google Gemini `gemini-3-pro-image-preview`, zwei Varianten je Slot,
  Auswahl per Kontaktbogen), Prompt-Satz und Regeln in `assets-src/photos/PROMPTS.md` (Stilsatz 2:
  helle Eiche, Pflanzen, echte Lächeln, Navy-Akzente, kein Text, kein Labor, keine realen Personen).
- **IglooPro:** zwei Motive zeigen das Gerät als Bild-zu-Bild-Platzierung mit dem Original-Render
  als Referenz, in echter Größe (~9 cm Würfel, 270–400 g laut Datenblättern) und mit dunklem
  Display: Säule Diagnostik (`practice-consult`, Gerät auf der Handfläche) und Artikel
  5-Minuten-Diagnose (`lab-tubes`, Gerät auf dem Tresen). Fotoregel im DS-Vertrag entsprechend
  ergänzt; frei gemalte Geräte bleiben verboten.
- **Pipeline:** `scripts/build-photo-look.mjs` — Sättigung 0,78 → 0,92, Navy-Soft-Light α 0,26 →
  0,12 (die warmen Motive sollen warm bleiben); Bühnen-Zuschnitte relativ zur Quellgröße (die
  4K-Quelle hat 5504 px, die festen Pixelwerte der ersten Fassung galten nur für 2600 px); AVIF mit
  Chroma 4:2:0 und niedrigeren Qualitäten (Karten 34/38 bzw. 40/44, Artikel 42/36/34, Bühne
  46/44), weil die detailreichen Szenen sonst `imageBytes` (Startseite 105 statt 87 KB) und
  `lcpImageBytes` (Artikel 25,8 statt 21,4 KB) rissen. Budgets unverändert, 852/852 grün.
- **Impressum §8** (10 Sprachen), Zeile 2 jetzt: Praxis- und Alltagsszenen, teils mit dem
  IglooPro auf Basis der Original-Produktabbildung, KI-generiert (PolarisDX, Google Gemini), keine
  realen Personen. Die Unsplash-Bestätigung durch den Owner entfällt damit.
- **Oberfläche:** keine neuen Tokens, Typo-Rollen oder Komponenten-Exporte.
- **Betroffene Screenshots (aktualisiert im Playwright-Docker-Image v1.57.0):** PT27.6
  `home-desktop`, `home-mobile`, `article-desktop`, `cookie-banner-desktop`,
  `diagnostics-megamenu-open-desktop`, `navigation-open-mobile`, `search-dialog-open-desktop`
  (alle zeigen die neue Startseiten-Bühne bzw. das neue Artikelbild); Design-System-Spec
  `final-cta-articles-desktop`, `final-cta-articles-mobile` (Artikelkarten). Gegengeprüft 21/21 und
  35/35, URL-Smoke 56/56, Vitest, `check:*` grün.
- **Reviewer:** Owner (Kontaktbögen beider Runden gesichtet, Auswahl bestätigt durch „Igloo hin
  und wieder"; Sichtprüfung auf der Preview steht aus).

### 2026-10-16 — Bildwelt: „Polaris-Look", KI-Collagen der Artikel ersetzt, Bildnachweis (Design-Delta, kein Vertragsbruch)

- **Ursache:** Owner-Wunsch 2026-10-16 („Bilder wirken uneinheitlich, teils KI-generiert; bitte in
  unserer CI; Bildverzeichnis"). DEC-RL-002 bleibt: keine zweite Bildsprache, sondern EINE
  Behandlung für alle Fotos.
- **Pipeline:** `scripts/build-photo-look.mjs` (`npm run build:photo-look`) erzeugt aus
  `assets-src/photos/` (14 Quellen, Unsplash) alle Foto-Stufen der Website: Sättigung 0,78, Navy
  `#083358` als Soft-Light-Lage (α 0,26), Kontrast 1,04/−5; Karten 4:3 und 3:2, Artikel 16:9,
  Startseiten-Bühne wie AP34 (Verlauf + Punktring eingebacken). Dateinamen unverändert, Code der
  Startseite unverändert.
- **Artikel:** `homeclinic.png` und `makemoney.png` (KI-Collagen) gelöscht. Alle sechs Artikel tragen
  jetzt ein Foto (fünf neue `article-*.webp`, 1200w Original + AVIF 400/800/1200; der
  Ecosystem-Artikel behält den echten IglooPro-Render). `BlogCard` nutzt `lean` (nur AVIF-srcset),
  sonst lag die Startseite ~100 B über `htmlBytes`.
- **Impressum §8 „Bildnachweis"** (10 Sprachen): Produktrender PolarisDX/DX365, Praxis- und
  Laborfotos Unsplash (Unsplash-Lizenz, bearbeitet), Porträts von den Personen bereitgestellt,
  Grafiken PolarisDX. **Legal-Freigabe und Owner-Bestätigung der Unsplash-Herkunft offen** (die
  Unsplash-IDs sind nicht dokumentiert). Es gibt nach dieser Änderung keine KI-generierten Bilder
  mehr; kommen welche hinzu, bekommt §8 eine Zeile „KI-generiert (PolarisDX)".
- **Budgets (PT25.5, nicht gelockert):** home `htmlBytes` 33,9 KB (Grenze 33,9), Bild 62/80 KB,
  LCP-Bild 14,0 KB; articles-index Bild 60/63 KB; article-detail LCP-Bild 17,6 KB (Grenze 21,9).
- **Oberfläche:** keine neuen Tokens, Typo-Rollen oder Komponenten-Exporte.
- **Betroffene Screenshots (aktualisiert im Playwright-Docker-Image v1.57.0, gegengeprüft 21/21 und
  35/35):** `final-cta-articles-desktop`, `final-cta-articles-mobile`, `hero-diagnostics-mobile`, `article-desktop` — Artikelseite, Artikel-Index und Diagnostik-Hub
  (verwandte Artikel) zeigen die neuen Fotos; die Fotos der Startseite änderten die Pixel unterhalb
  der Toleranz nicht.
- **Reviewer:** Owner (Sichtprüfung auf der Preview steht aus).

### 2026-10-16 — SC-004 · Owner-Entscheidungen: Shop-Eintrag, Shop-Band, ndu-Clinic-Karte, Bereichsleiste Diagnostik (Design-Delta, kein Vertragsbruch)

- **Ursache:** Owner-Entscheidungen vom 2026-10-16 (`SCOPE-CHANGELOG.md` SC-004;
  `migration/MAIN-DELTA-2026-10.md` §5 O1/O3, `release/AP30-RC1.md` §5). Code-Commit `f7b5db3`.
- **Geändert:**
  - **Kopfzeile:** achter Eintrag „Shop" als externer Link (`shop.polarisdx.net`, `src/lib/shop.ts`)
    im bestehenden `NAV_LINK`-Stil. Label „Neu" (`accent.on-dark`) nur im mobilen Menü. xl-Abstände
    enger (Navigation `xl:gap-8` → `xl:gap-5`, Werkzeuge `xl:gap-4`), damit acht Einträge ab 1280 px
    in de/en/it/nl/pt/pl/cs/da einzeilig bleiben. fr/es brechen um wie vorher (P2).
  - **Startseite:** neues schmales Band `ShopTeaserSection` nach den Geschäftssäulen. Weiße Karte
    `rounded-card` mit `accent-border` und `shadow-card` auf `paper`, Eyebrow, H2, Hinweiszeile,
    eine Navy-Pille „Zum Shop". Kein Bild, kein zweiter Knopf: Startseiten-HTML-Puffer ~200 B gzip,
    die volle `main`-Fassung ~440 B.
  - **Epigenetik-Hub, Kontaktkapitel:** Karte „ndu Clinic · London" (`accent-soft`-Fläche,
    `rounded-card`) mit Umrissknopf (`border-brand-primary`, weiß), `ArrowUpRight` und
    `sr-only`-Hinweis auf den neuen Tab. Die Telefon-Pille zeigt `+49 151 75011699`.
  - **Bereichsleiste und „Nächster Schritt"** auf Diagnostik-Hub, neun Service-Seiten und IglooPro
    (Bausteine aus PT34.2a, unverändert gestaltet). `AreaNav`/`NextSteps` sind jetzt
    Shell-Bausteine im Entry-Chunk (`AreaShellProvider`, `useAreaShell()`); Vertrag §6.5.
- **Oberfläche:** keine neuen Tokens, Typo-Rollen oder Komponenten-Exporte; `SURFACE`-Blöcke
  unverändert (`check:ds-changelog` grün).
- **Budgets (PT25.5, nicht gelockert):** ci 852/852; Initial-JS 162 794 B von 164 778 B; Route-JS-
  Puffer Diagnostik-Hub 193 B, Service-Detail 186 B, IglooPro 127 B.
- **Mega-Menü Diagnostik (Fehlerbehebung, gefunden beim Baseline-Abgleich):** das 720 px breite
  Spalten-Menü war unter dem ersten Menüpunkt zentriert und ragte bei 1280 px links ~80 px aus dem
  Bild — die alte Baseline `diagnostics-megamenu-open-desktop` hatte den abgeschnittenen Zustand
  eingefroren. Spalten-Menüs verankern sich jetzt an der Kopfzeile (zentriert,
  `max-w-[calc(100vw-2rem)]`); gemessen vollständig im Bild bei 768/1024/1280/1536 px.
- **Betroffene Screenshots (aktualisiert im Playwright-Docker-Image v1.57.0, danach gegengeprüft):**
  - `pt27.6-visual` 17 von 21: alle Desktop-Seiten und -Zustände (Kopfzeile mit „Shop", y 30–50),
    `service-detail-desktop` (Bereichsleiste im Bild), `diagnostics-megamenu-open-desktop`
    (Menü-Fix oben), `navigation-open-mobile` („Shop · Neu" im mobilen Menü). Check 21/21.
  - `design-system` 4 von 35: `hero-diagnostics-{desktop,mobile}`, `longform-service-{desktop,mobile}`
    (Bereichsleiste + „Weiter im Bereich", Seite länger). In `longform-service-mobile` liegt der
    Hero-Inhalt im Full-Page-Bild ~5–15 px höher; im Browser ist die Geometrie unverändert (h1-Oberkante
    208 px bei 844 und 8000 px Viewport-Höhe, Gegenprobe ohne `AreaNav` = alte Baseline pixelgleich).
    Das ist ein Artefakt des Full-Page-Screenshots mit dem neuen Sticky-Element, kein Layout-Delta.
    Check 35/35.
- **Reviewer:** Owner (Entscheidung 2026-10-16); Sichtprüfung der neuen Baselines durch den Agenten
  (Diff-Bereiche einzeln geprüft).

### 2026-10-16 — AP34 PT34.4 · Konsistenz-Durchgang, echte Share-Karte, Artikelbilder (Design-Delta, kein Vertragsbruch)

- **Ursache:** AP34 PT34.4 (Raster über alle Seitentypen, Vorher/Nachher-Bogen
  `wireframes/ap34-abnahme/`) und AP29 PT29.4 (Inhaltsstand von `main` seit dem Abzweig,
  `building-docs/migration/MAIN-DELTA-2026-10.md`).
- **Geändert:**
  - Startseite „Warum POC", Patientenkarte: `text-accent-light` existierte nicht als Token, Icon und
    Label erbten Weiß. Jetzt `accent.on-dark` (8,24:1 auf Navy), Fließtext `white/85` statt `slate-100`.
  - 404: Primär-CTA ist die weiße Pille `light` wie auf allen Navy-Bühnen (vorher blaue Akzent-Pille),
    Überschrift `font-semibold` wie die übrigen Bühnen.
  - Slate-Reste außerhalb der Befunde: Suspense-Fallback `bg-paper`, Diagnostik-Badge `gray-700`.
    Die Outline-Pille (`border-slate-300`) ist als Dekor-Rahmen im Vertrag §3.4 festgehalten.
  - **Share-Karte `public/og-image.jpg` neu** aus echtem Logo (`polaris_white.webp`) und echtem
    Produktrender (`Igloo-pro-frontal.png`), Texte aus `home.json` (Claim-Register HCL-001..005).
    Die alte Karte (auch in PT34.1 noch neu eingefärbt) war eine nachgebaute Wortmarke mit
    gezeichnetem Gerät und erfundenem Messwert „45.2 ng/mL". `og-image.svg` und
    `convert-og-image.mjs` gelöscht, Generator jetzt `scripts/make-og-card.mjs`.
  - Artikel: `ecosystem_of_rapid_tests` mit echtem Render statt `Testbild1`; `green_practice`
    bildlos; `above_the_fold`/`hero_doctor` gelöscht. Vite inlinet die sehr kleinen Render-Stufen
    nicht (`assetsInlineLimit`), sonst +11 KB gzip Initial-JS (gemessen).
  - `og-vitd3-spray.jpg` und `og-consumer-*.jpg` aus `main` (echtes Logo statt getippter Wortmarke).
  - DESIGN-SYSTEM-CONTRACT konsolidiert: Stand, §3.4 Outline-Pille, §6.1 `soft` = `paper`, §6.3
    Bühnen nach SC-002/SC-003, §6.5 Führungssystem, §6.9 Katalog ohne Teal/Slider, §10 ohne
    `og-image.svg`.
- **Budgets (PT25.5, nicht gelockert):** ci 852/852.
- **Betroffene Screenshots (5):** `pt27.6-visual` `not-found` (Pille `light`), `article`
  (`die-gruene-praxis` jetzt bildlos); `design-system` `final-cta-articles` mobil/desktop (erste
  Artikelkarte zeigt die Kategorie-Kachel statt des Fake-Bildes) und `hero-diagnostics` mobil
  (verwandte Artikel, dieselbe Karte, Seite 192 px kürzer).
- **Reviewer:** Owner-Abnahme PT34.4 (Bogen `wireframes/ap34-abnahme/`).

### 2026-10-16 — AP34 PT34.3 (SC-003) · Inhalts- und Unternehmensseiten angeglichen (Design-Delta, kein Vertragsbruch)

- **Ursache:** AP34 PT34.3. Die Inhalts- und Unternehmensseiten folgen demselben Editorial-Raster.
- **Geändert:**
  - Abschnittsköpfe linksbündig mit Einleitung rechts statt zentriert: Termine (Kommend, Rückblick), Kontakt (Standorte), Über uns (drei Wege, Werte, Team).
  - Karten mit `rounded-card` (Kontakt-Standorte, Über-uns-Werte).
  - `SubpageHero` mobil feinjustiert: unterer Abstand wie im Vorstand, damit überlappende Kennzahlen-Leisten die Bühnenzahlen nicht verdecken. Die übrigen Abstände sind enger, die Blog-Bühne bleibt bei 501 px (412 × 823, `eagerBelowFold` 0).
  - Artikel-Detail, Downloads, 404 und Consumer-Seiten hatten durch Kopfzeile, Akzent und gemeinsame Bühne schon den Stand. Die Consumer-Seiten behalten ihre eigene Produktbildwelt.
- **Budgets (PT25.5, nicht gelockert):** statisch 24/24, ci 852/852, Lab 408/408.
- **A11y:** PT24.1–PT24.6 grün (PT24.6 mit dem 180-s-Limit der offiziellen Konfiguration).
- **Betroffene Screenshots (5):** `pt27.6-visual` `service-detail`, `resource-center`, `contact`, `support`, `legal-privacy` (Bühnen-Feinjustierung mobil/desktop). `design-system` 35/35 unverändert.
- **Reviewer:** Owner-Abnahme in PT34.4.

### 2026-10-16 — AP34 PT34.2d–e (SC-003) · Editorial-Bühnen für Diagnostik, Service-Seiten, IglooPro und die gemeinsame Unterseiten-Bühne (Design-Delta, kein Vertragsbruch)

- **Ursache:** SC-003 / AP34 PT34.2. Die Bereichs- und Produktseiten folgen dem Editorial-Stil der
  Startseite und der Epigenetik-Strecke.
- **Geändert:**
  - `DiagnosticsHero`: Navy-Bühne, Kicker als Pille, weiße Pille `light` mit Pfeilkreis, Produktkarte rechts. Das IglooPro-Bild bleibt das einzige Vorrang-Bild (Desktop-LCP). DOM-Reihenfolge Text → Aktionen → Visual ist unverändert.
  - `IglooProHero`: Produkt-Bühne auf Navy, Gerät mit Halo, weiße Pille.
  - `SubpageHero` (Service-Seiten, Kontakt, Support, Über uns, Blog, Downloads, Rechtstexte, Vitamin D3): Kicker als Pille, größere Überschrift, weiße Pille statt eckigem Akzentknopf. Mobil kompakt, die Höhe entspricht dem Vorstand (Blog 412 px: 501 statt 506 px, `eagerBelowFold` 0).
  - Diagnostik-Abschnitte: Überschriften linksbündig mit Einleitung rechts, Karten mit `rounded-card`, CTA-Band Navy mit Punktring und weißer Pille.
  - IglooPro: Merkmale-Überschrift linksbündig; Abschluss mit Punktring und Pille `light`.
- **Bewusst nicht in diesem Schritt:** Bereichsleiste und „Nächster Schritt" auf Diagnostik, Service und IglooPro. Diese Routen haben 250–450 Byte Route-JS-Puffer; die Bausteine kosten etwa 2 KB. Das wird nicht gegen gelockerte Budgets gebaut, sondern als Owner-Entscheidung geführt (AP-STATE).
- **Budgets (PT25.5, nicht gelockert):** statisch 24/24, Laufzeit ci 852/852, Lab 456/456 (Diagnostik, Service, IglooPro, Kontakt, Downloads, Blog, Startseite × 3). Initial-CSS 17,2 KB gzip.
- **A11y:** PT24.1–PT24.6 grün. PT24.6 lief mit dem 180-s-Limit der offiziellen Konfiguration.
- **Betroffene Screenshots (13):**
  - `pt27.6-visual` (7): `diagnostics-hub`, `service-detail`, `igloo-pro`, `contact`, `support`, `resource-center`, `legal-privacy` (alle Desktop; neue Bühnen).
  - `design-system` (6): `hero-diagnostics`, `longform-service`, `final-cta-articles` (je Desktop und Mobil).
- **Reviewer:** Owner-Abnahme in PT34.4.

### 2026-10-15 — AP34 PT34.2a–c (SC-003) · Führungssystem und Epigenetik-Strecke (Design-Delta, kein Vertragsbruch)

- **Ursache:** SC-003 (`building-docs/SCOPE-CHANGELOG.md`). Der Owner hat Entwurf 4
  (`wireframes/relaunch-entwurf-4-unterseiten/`) freigegeben: klarere Informationsstrecken, Hin- und
  Hernavigation, sinnvolle Calls-to-Action, Schwerpunkt Epigenetik.
- **Neue Bausteine (`src/components/area/`):**
  - `AreaStage`: Navy-Bühne ohne Bild.
  - `StageFacts`: Kennzahlen-Leiste, überlappt die Bühne, im Stil der Trust-Leiste der Startseite.
  - `AreaNav`: Bereichsleiste, sticky, mit Unterstrich-Tabs, Merkliste und Anfrage. Sie schreibt `--chapterbar-offset`.
  - `JourneySteps`: Wegweiser in vier Schritten.
  - `PageToc` / `PageTocMobile`: „Auf dieser Seite". Der Scroll-Spy `tocSpy.ts` lädt nach.
  - `NextSteps`: zurück, weiter, Abschluss.
  - `MobileActionBar`: unter lg, nach der Bühne, nicht über Footer oder Cookie-Banner. Sie hebt `MobileCallButton` über `--action-bar-height`.
- **Geändert:**
  - Epigenetik-Hub: neue Reihenfolge Analysen mit Filter → Vergleich (aufklappbar) → Prinzip → „Werte verstehen" (Kurzfassung) → Ablauf (nach Ort gruppiert) → Beratung → Studienlage (Kurzfassung) → Fragen → Unterlagen (Kurzfassung) → Anfrage → „Nächster Schritt".
  - Grundlagen, Studienlage und Unterlagen: Lese-Layout mit linker Inhaltsspalte.
  - `ChapterNav` (nur noch Musterbefund): Unterstrich statt Chip.
  - Musterbefund-Ende: Karten statt Pillen. Daten-Attribute und Texte bleiben unverändert.
- **Bewusst nicht umgesetzt:**
  - Kein Bühnenfoto und kein Punktring in der Bühne. Das LCP-Bild-Budget ist auf diesen Routen 0 Byte. Der `.brand-ring`-SVG-Hintergrund wurde gemessen als LCP-Bild gewertet (2,1 KB).
  - Die Handy-Leiste wird nicht per `React.lazy` geladen. Ein nachgeladener Chunk zieht das Haupt-Stylesheet als `<link>` nach (stylesheetLinks-Budget 0).
- **Budgets (PT25.5, nicht gelockert):**
  - Statische Prüfungen 24/24.
  - Laufzeit ci 852/852.
  - Lab für die Epigenetik-Routen 216/216.
  - Gemessene Route-JS-Werte: Hub 27,9 KB (Budget 29,5), Vertiefung 9,4 KB (Budget 11,0). Möglich wurde das, weil `ScaleRamp` aus `BefundCharts.tsx` in eine eigene Datei (`ScaleRamp.tsx`, `scaleDomain.ts`) gezogen wurde. Hub und Grundlagen laden das ganze Diagramm-Modul nicht mehr.
  - Initial-CSS 17,4 KB gzip. Bausteinklassen kommen aus dem Bestand; Sonderverläufe und freie Rasterbreiten sind entfernt.
- **Galerie-Vorlage:** `scripts/build-visual-gallery.tsx` nutzte `h-[320px]`. Die Klasse wurde nur durch den alten Hub erzeugt, weil die Vorlage außerhalb der Tailwind-Quellen liegt. Jetzt nutzt sie `h-80`: gleiche 320 px, Klasse aus dem Bestand.
- **Betroffene Screenshots (2):** `pt27.6-visual` `epigenetics-hub-desktop`, `epigenetics-panel-desktop` (neuer Hub-Aufbau). `design-system` 35/35 unverändert.
- **Reviewer:** Owner-Abnahme in PT34.4.

### 2026-10-15 — AP34 PT34.1 (SC-002) · Editorial: Navy-Kopfzeile, Logo-Blau, Bühnenfoto (Design-Delta, kein Vertragsbruch)

- **Ursache:** Owner-Entscheidung SC-002 (`building-docs/SCOPE-CHANGELOG.md`): Variante C „Editorial"
  aus `wireframes/relaunch-entwurf-3-varianten/`, blaue statt weiße Kopfzeile, eigene Markenfarben;
  umgesetzt als PT34.1 des neuen Arbeitspakets AP34.
- **Geändert (Token-Werte, keine Namen):** `accent` `#0d9488` → `#1b67b1` · `accent.strong` `#0f766e` →
  `#15589a` · `accent.line` `#14b8a6` → `#02a6e3` · `accent.soft` `#f0fdfa` → `#e6f5fc` ·
  `accent.border` `#99f6e4` → `#b9e4f7` · `accent.on-dark` `#2dd4bf` → `#8fd8fb` — das Blauspektrum des
  Signets. `PALETTE_HEX` mitgepflegt (DS-CL-5); Teal-Rohwerte in `public/og-image.svg`,
  `scripts/og-image-template.html` (OG-Bild neu gerendert) und im ROI-PDF-Untertitel ersetzt.
  Kontraste siehe DESIGN-SYSTEM-CONTRACT §3.2 — jede Akzent-Textrolle ist kontraststärker als vorher.
- **Geändert (Komponenten, gleiche Exporte):** `Button` — neue Variante `light` (weiße Pille für Navy-
  und Fotoflächen, Fokusring weiß mit Navy-Versatz). `Header` — deckende Navy-Kopfzeile, weißes Logo
  als 272-px-Datei (`polaris_white-272w.webp`, 4,8 KB), weiße Fokusringe, aktive Unterstreichung
  `accent.line`, CTA `light`, mobiles Menü Navy; Aufklapp-Menüs bleiben hell. `TrustBar` — überlappt
  die Bühne, mobil 2 × 2. `FinalCtaSection` — CTA `light`, Punktring `.brand-ring` statt Glow.
- **Startseite:** Hero „Editorial" mit art-directed Bühnenfoto (`src/assets/home/hero-*`, Verlauf und
  Punktring eingebacken, Desktop 2:1 / Mobil 4:9, AVIF, mobil zusätzlich WebP) als LCP-Bild; Produkt als 320-px-Bild in
  einer Karte nach den CTAs; Fachbereich-Einstiege als Foto-Karten (Fotos aus dem SC-001-Mosaik); das
  vierte Mosaikfoto (`lab-tubes-*`) und die Klassen `.home-tile*` entfallen.
- **Tests mitgeändert, nicht geschwächt:** `HeroSection.test.tsx`, `e2e/home-hero.spec.ts` und
  `e2e/home-faq-seo-integration.spec.ts` (PT11.6) prüfen Bühnenfoto (einziges eager-/Vorrang-Bild,
  `alt=""`, Maße, Quellen-Typen) und Produktbild (lazy, 320×320, lokalisierter Alt-Text, geladen)
  getrennt; `main img[loading="eager"]` bleibt genau 1, `img[fetchpriority="high"]` seitenweit genau 1.
- **Perf-Budget (PT25.5, nicht gelockert):** Startseite Bild 53,8 KB mobil / 77,2 KB desktop (Budget
  87,2 KB), LCP-Element jetzt das Bühnenfoto (14,8 KB mobil / 12,1 KB desktop, Budget 19,0 KB). Damit
  die mobile LCP im Lab-Profil hält (vorher Text, jetzt Bild unter 1,6-Mbit/s-Drosselung: 1 010 ms >
  920 ms), setzt der Hero per React-`preload()` einen frühen, nur mobilen Bild-Preload vor die
  Modul-Preloads (danach 752–764 ms); das Kopfzeilen-Logo ist `fetchpriority="low"`, damit React keinen
  konkurrierenden Bild-Preload schreibt. Fachbereich-Fotos als 4:3-Zuschnitte 400w/800w statt
  quadratisch 480w (Desktop −4 KB). HTML 33,9 KB de / 33,4 KB en / 34,2 KB pl — knapp unter Budget
  (Puffer ~60 Byte): Desktop-Bühne nur AVIF, Standard-`sizes` entfallen.
- **A11y-Nachmessung:** Fokusringe `ring-accent` mit Navy-Versatz (Subpage-Hero, Kontakt-Hero) auf
  `ring-accent-on-dark` (Royal auf Navy 2,23:1 → 8,24:1, PT24.3); 404-Ziffer auf `accent-on-dark`
  (2,22:1 → 8,24:1, PT24.6 axe).
- **Betroffene Screenshots (26):** `pt27.6-visual` 19 von 21 — alle außer `consumer-spray-desktop/-mobile`:
  `article`, `contact`, `cookie-banner`, `diagnostics-hub`, `diagnostics-megamenu-open`, `epigenetics-hub`,
  `epigenetics-panel`, `home-desktop`, `home-mobile`, `igloo-pro`, `legal-privacy`, `musterbefund`,
  `navigation-open-mobile`, `not-found`, `resource-center`, `resource-gate-open`, `search-dialog-open`,
  `service-detail`, `support` (Navy-Kopfzeile, Logo-Blau). `design-system` 7 von 28 — `tokens-color`
  (desktop/mobil, neue Akzentwerte), `final-cta-articles` (desktop/mobil, Pille `light`, Punktring),
  `longform-service` (desktop/mobil) und `hero-diagnostics` (desktop) wegen Kopfzeile und Akzent.
- **Plattform:** aufgenommen im gepinnten Image `mcr.microsoft.com/playwright:v1.57.0-noble` mit
  `--update-snapshots`, danach ohne Update bestätigt: PT27.6 21/21, Design-System 35/35. Gates: Vitest
  1110/1110, Kern-E2E 163/163, A11y PT24.1–24.6 118/41/31/20/45/25, Perf PT25.5 Profil ci 852/852 und
  Profil lab (Startseite) 168/168, alle Guards grün.
- **Reviewer:** Owner-Abnahme der Umsetzung gegen Variante C steht aus (PT34.4).

### 2026-10-15 — Relaunch SC-001 · Papierfläche, Fotografie, Pillen (Design-Delta, kein Vertragsbruch)

- **Ursache:** Owner-Entscheidung SC-001 (`building-docs/SCOPE-CHANGELOG.md`): der Stand wirkte für
  einen Relaunch „noch nicht schön". Entwurf in `wireframes/relaunch-entwurf/`, Orientierung an
  `panels.polarisdx.net` (warme Fläche, große Headline, Bild-Mosaik, Pillen).
- **Neu (Token):** `paper` `#f5f3ee` · `paper.deep` `#ecebe4` · `paper.line` `#e3e0d7` — Seitenfläche,
  Füllung, Dekor-Linie (`PALETTE_HEX` mitgepflegt, DS-CL-5). `borderRadius.card` 22 px, `borderRadius.band`
  34 px. Keine Farbe entfernt, kein Alias umbenannt.
- **Geändert (Komponenten, gleiche Exporte):** `Button` — alle Varianten `rounded-full`, Semibold;
  `Card` — `rounded-card`, Rand `paper-line`. `Header` — helle Papier-Kopfzeile, dunkles Logo,
  Fokusringe navy mit Papier-Versatz, kein Navy-Schleier mehr (PT24.6-Begründung entfällt, Kontrast
  jetzt 12,2:1). `:root`-Hintergrund `paper` statt `#f8fafc`; `slate-50/100/200` repo-weit auf
  `paper`/`paper.deep`/`paper.line` (außer Musterbefund/Befund-Komponenten und Hydrations-Fallback).
- **Startseite:** Hero mit Foto-Mosaik (vier Motive, `src/assets/home/`, AVIF/WebP 240/480 px, lazy,
  `alt=""`) um das unveränderte 650×650-Produktbild; `hero.title` neu in 10 Sprachen; TrustBar als
  weiße Signalleiste (Strings byte-gleich); Säulen-Karten mit Foto; Ablauf als Karten; Referenz als
  großes Zitat-Band; Final-CTA als Navy-Band im Container. DOM-Hooks und Claim-Register unverändert
  (Komponententests 201/201).
- **Perf-Budget (PT25.5, nicht gelockert):** Startseite gemessen Bild 67,3 KB mobil / 78,1 KB desktop
  (Budget 87,2/89,2 KB), HTML 33,8 KB (Budget 33,9 KB), Initial-JS 157,2 KB gzip. Dafür: `favicon.ico`
  von 57 KB (7 PNG-Stufen bis 256 px) auf 8,7 KB (16/24/32/48 px; 192 px und Apple-Icon bleiben eigene
  PNGs) — das ICO zählte auf **jeder** Route zum `imageBytes`; Kopfzeilen-Logo als 272-px-Datei
  (`polarisdx_logo-272w.webp`, 6,7 KB, vorher 400 px „oversized"); Footer-Logo `loading="lazy"` (liegt
  immer unter dem Falz); `vite.config.ts` `assetsInlineLimit` schließt `src/assets/home/` vom
  Base64-Inlining aus (+4,3 KB gzip im Initial-JS vermieden); `ResponsivePicture` bekommt `lean`
  (nur AVIF-`<source>` + WebP-`<img>`, spart gehashte `srcset`-URLs im SSR-HTML).
- **A11y-Nachmessung (PT24.6 axe):** `ui.field` von `#6b7280` auf `#5e6a78` (auf `paper` 4,35:1 → 4,97:1;
  Weiß 5,51:1), `PALETTE_HEX` mitgepflegt; `bg-accent/10` + `text-accent-strong` (auf `paper` gemischt
  4,42:1) überall auf die solide Tönung `bg-accent-soft` (≥ 5:1). Signal-Icons der Why-POC-`<dl>` sitzen
  im `<dt>` (axe `definition-list`); IglooPro-Badge im Hero auf `accent.strong` (weiße Schrift 5,47:1).
- **Test mitgeändert, nicht geschwächt:** `e2e/home-faq-seo-integration.spec.ts` (PT11.6) adressiert
  das Produktbild jetzt über `img[fetchpriority="high"]` (vorher: einziges `img` im Hero) und prüft
  zusätzlich, dass alle vier Mosaik-Fotos `alt=""` **und** `loading="lazy"` tragen; `main
img[loading="eager"]` bleibt genau 1.
- **Bewusst nicht:** Figtree (Entwurf) — Inter bleibt wegen PT25.4-Font-Pipeline und Perf-Budget.
- **Betroffene Screenshots (27):** `pt27.6-visual` 19 von 21 — alle Seiten- und Zustandsbilder außer
  `consumer-spray-desktop/-mobile` (eigene Consumer-Shell, unverändert): `home-desktop`, `home-mobile`,
  `diagnostics-hub`, `service-detail`, `igloo-pro`, `epigenetics-hub`, `epigenetics-panel`,
  `musterbefund`, `article`, `resource-center`, `contact`, `support`, `legal-privacy`, `not-found`,
  `cookie-banner`, `diagnostics-megamenu-open`, `search-dialog-open`, `resource-gate-open`,
  `navigation-open-mobile`. `design-system` 8 von 28 — `buttons` (Pillen), `hero-diagnostics`,
  `longform-service`, `final-cta-articles` (je desktop/mobil, helle Kopfzeile + Papierfläche); die
  übrigen 20 Galerie-Oberflächen blieben innerhalb der 1-%-Toleranz.
- **Plattform:** aufgenommen im gepinnten Image `mcr.microsoft.com/playwright:v1.57.0-noble` mit
  `--update-snapshots`, danach ohne Update bestätigt: PT27.6 21/21, Design-System 35/35. Gates nach der
  Umsetzung: A11y-Suite PT24.1–24.6 komplett grün (118/41/31/20/45/25), Perf-Budget PT25.5 852/852,
  Core-E2E (Home, Navigation, Suche, Smoke, Findability) grün.
- **Reviewer:** Owner-Abnahme der Umsetzung gegen den Entwurf **offen**; Agent-Umsetzung (Claude Code,
  2026-10-15).

### 2026-10-15 — AP27-CLOSURE · PT276-F9: PT05.5-Baselines auf den Relaunch-Stand (kein Vertragsbruch)

- **Ursache:** Die 22+6 Baselines aus `e2e/design-system.spec.ts` (PT05.5, Oberflaechen zuletzt neu in
  AP06 PT06.2) stammen aus `6596a90` (2026-08-28). Danach haben spaetere APs die Oberflaechen gewollt
  veraendert: AP24 PT24.4 Kontrast (`gray-500` #868C98 → #6b7280, dunklere Status-`ink`-Toene), AP25
  PT25.4 metrisch angepasster `Inter Fallback` (andere Laufweite, dadurch anderer Umbruch bei 390 px),
  AP13 Diagnostik-Hub, AP14 Service-Detail und AP17 Artikeluebersicht (Seiten neu gebaut). 19 von 28
  Vergleichen scheiterten deshalb (PT276-F9), in CI (Laeufe 35078488402, 38723003426) und lokal identisch.
- **Betroffene Screenshots (19):** Oberflaechen desktop `buttons`, `typography`, `typography-on-navy`,
  `section-navy`; mobil `buttons`, `typography`, `typography-on-navy`, `form-controls`, `status-alerts`,
  `cards`, `states`, `dialog`, `section-navy`; Seiten `hero-diagnostics`, `longform-service`,
  `final-cta-articles` (je desktop und mobil). Unveraendert und weiter bestaetigt: die uebrigen 9.
- **Produkt-/Design-Delta:** in diesem Schritt **keins**. Die Bilder halten fest, was AP13/14/17/24/25
  bereits umgesetzt und dort dokumentiert haben. Oberflaechen: gleiche Struktur, 2–8 % abweichende Pixel
  durch Schriftlaufweite und Kontrasttoene. Seiten: strukturell neu (z. B. Service-Detail desktop
  1440×19222 → 1440×4129, Diagnostik-Hub desktop 1440×4670 → 1440×7546).
- **Mitgeaendert:** Der Test „nimmt bei Bewegungsreduktion keine Funktion weg" suchte die Pause-Taste des
  Startseiten-Karussells, das AP12 entfernt hat (HOMEPAGE-CONTRACT, Hero). Er prueft jetzt den primaeren
  Anfrageweg (DEC-RL-013): „Angebot anfragen" ist sichtbar und fuehrt zu `/de/contact`. Keine Schwelle
  veraendert (`maxDiffPixelRatio` bleibt 0,01), kein Test entfernt.
- **Plattform:** aufgenommen im gepinnten Image `mcr.microsoft.com/playwright:v1.57.0-noble` mit
  `--update-snapshots=changed` (nur die abweichenden Bilder), danach ohne Update 35/35 bestaetigt.
- **Beim Review sichtbar (kein neuer Befund):** In den ganzseitigen Seitenbildern steht das fixierte
  Cookie-Banner mitten im Bild; das war in den alten Baselines genauso.
- **Reviewer:** Agent-Review aller 19 Alt/Neu-Paare (Claude Code, 2026-10-15); fachliche Abnahme durch
  den Design-Owner **offen**.

### 2026-09-15 — AP27 PT27.6 · Seiten-/Zustands-Baselines (kein Vertragsbruch, kein Design-Delta)

- **Ursache:** PT27.6 fuehrt `e2e/pt27.6-visual.spec.ts` ein — 21 **erstmalige** Baselines repraesentativer
  Seiten und Zustaende. Keine bestehende Baseline wurde neu aufgenommen; die 22+6 Baselines aus PT05.5
  bleiben unberuehrt.
- **Produkt-/Design-Delta:** **keins.** Die Bilder halten den aktuellen Light-/Sales-Machine-Stand fest; es
  wurde keine Art Direction eingefuehrt und keine Token-, Rollen- oder Komponentenaenderung vorgenommen.
- **Screenshots (Desktop 1280×800):** `home`, `diagnostics-hub`, `service-detail`, `igloo-pro`,
  `epigenetics-hub`, `musterbefund`, `article`, `resource-center`, `contact`, `support`, `legal-privacy`,
  `consumer-spray`, `not-found` (404), `epigenetics-panel`, `resource-gate-open`, `diagnostics-megamenu-open`,
  `search-dialog-open`, `cookie-banner`. **Mobil (390×844):** `home-mobile`, `navigation-open-mobile`,
  `consumer-spray-mobile`.
- **Plattform:** aufgenommen und zweimal ohne Update bestaetigt im gepinnten Image
  `mcr.microsoft.com/playwright:v1.57.0-noble` (`npm run test:visual:docker`), Pixel-Toleranz 0.
- **Beim Review sichtbare Ist-Befunde (festgehalten, nicht korrigiert — keine Aenderung ohne eigenen Auftrag):**
  PT276-F1 das geoeffnete Diagnostik-Mega-Menue ragt bei 1280 px links aus dem Viewport (erste Spalte
  abgeschnitten); PT276-F2 der fixierte Header ueberdeckt auf der Startseite die Eyebrow-Zeile des Hero;
  PT276-F3 der geoeffnete Download-Gate-Zustand laesst die rechte Rasterspalte leer. Wird einer davon
  behoben, ist die zugehoerige Baseline mit eigenem Eintrag hier neu aufzunehmen.
- **Reviewer:** Agent-Review der 21 Bilder im PT27.6-Lauf; fachliche Abnahme durch Design-Owner **offen**.

### 2026-08-25 — AP06 PT06.2 · Diagnostik-Mega-Menü (kein Vertragsbruch)

- **Keine** Änderung an Tokens, `.t-*`-Rollen oder Komponenten-Exporten — das Gate bleibt grün.
- **Nebenwirkung, dokumentiert:** die Rollen `t-h6`, `t-caption` und `t-link-cta` waren bis hierher
  _definiert, aber nicht im Build_ (Tailwind gibt `@layer components` nur bei Verwendung aus, siehe
  Eintrag PT05.5). Das Mega-Menü ist ihre erste Aufrufstelle; sie werden jetzt emittiert. Dadurch
  änderte sich die Darstellung der Galerie-Flächen (deren Überschriften `t-h6` nutzen), und **alle 22
  Oberflächen-Baselines wurden neu aufgenommen**. Das ist der erwartete Effekt einer Adoption, kein
  Regressionsfund.

### 2026-08-25 — AP05 PT05.5 · Motion, Visual Regression, Error States

- **Neu:** Visual-Regression-Galerie (`scripts/build-visual-gallery.tsx`, Ausgabe
  `dist/visual-gallery.html` — bewusst **ausserhalb** des ausgelieferten `dist/client/`) und
  `e2e/design-system.spec.ts` mit 22 Oberflächen-Baselines und 6 Seiten-Baselines.
- **Neu:** dieses Changelog samt Gate.
- **Geändert:** `RootErrorBoundary`/`SegmentErrorBoundary` rendern ihre Fehleroberfläche jetzt
  über `ErrorState` statt über eigenes Markup — **eine** Fehleroberfläche, nicht drei.
  Kein API-Bruch: beide Komponenten behalten Signatur und Verhalten.
- **Kein Token-Bruch, kein Komponenten-Bruch.**

### 2026-08-25 — AP05 PT05.4 · Layout-/Sales-Machine-Patterns

- **Neu:** `Section`, `Container`, `CardGrid` (`src/components/layout/Section.tsx`).
- **Geändert (nicht brechend):** `Card` verliert im interaktiven Zustand `hover:shadow-card`
  und folgt damit dem im Bestand dominanten reinen Hover-Lift.
- Karussell-Steuerungen: Pause/Play 16 → 44 px, Slider-Punkte 10 → 24 px Trefferhöhe.

### 2026-08-25 — AP05 PT05.3 · Core UI-Komponenten

- **Neu:** `Card`, `FormField`, `Checkbox`, `Radio`, `Select`, `Dialog`, `LoadingState`,
  `EmptyState`, `ErrorState`, `Skeleton`.
- **Neu:** Farbfamilie **`warning`** (`warning`, `warning.soft`, `warning.strong`).
- **Erweitert (additiv):** `Button` um `ghost`, `loading`, externe-Link-Semantik;
  `Alert` um `info`, `warning`, `error`.
- **Deprecated, nicht entfernt:** `Alert variant="destructive"` → gleichbedeutend mit `error`.
- **Geändert:** `Button size="icon"` 40 → 44 px (0 Aufrufstellen betroffen).
- **A11y-Korrektur:** `Textarea`-Fehlertext `red-500` → `red-600`.

### 2026-08-25 — AP05 PT05.2 · Typografie

- **Neu:** Typografie-Rollen `.t-*` in `src/index.css` (19 Rollen).
- **A11y-Korrektur:** Longform-Ink `.rich-content` `gray-500` → `gray-700`;
  Prosa-Links im Ruhezustand unterstrichen.
- **Entfernt (Bauzeit):** Google-Fonts-Bezug in `scripts/og-image-template.html`.

### 2026-08-25 — AP05 PT05.1 · Visuelle Baseline und Tokens

- **Neu:** Motion-Tokens (`transitionDuration`, `transitionTimingFunction`),
  `spacing.section`/`section-lg`, `boxShadow.dialog`.
- **Klassifiziert, nicht migriert:** Legacy-Aliase (`accentBlue`, `brand.navy-mid`,
  `brand.blue-bright`, `ui.border-hover` — je 0 Aufrufstellen).
- **A11y-Korrektur:** Bedienelement-Begrenzungen auf `ui.field`.
- Farb-Guard zusätzlich in CI verankert.

---

## 2. Dokumentierte Oberfläche

Diese Blöcke werden vom Gate gelesen. **Nicht von Hand kürzen** — sie sind der Soll-Zustand.

### 2.1 Farbtokens

<!-- SURFACE:colors -->

`accent` · `accent.border` · `accent.line` · `accent.on-dark` · `accent.soft` · `accent.strong` ·
`accentBlue` · `befund.amber` · `befund.amber.ink` · `befund.amber.soft` · `befund.green` ·
`befund.green.ink` · `befund.green.soft` · `befund.red` · `befund.red.ink` · `befund.red.soft` ·
`brand.blue` · `brand.blue-bright` · `brand.deep` · `brand.navy` · `brand.navy-hover` ·
`brand.navy-mid` · `brand.primary` · `brand.secondary` · `gray-100` · `gray-500` · `heading` ·
`paper` · `paper.deep` · `paper.line` · `social.linkedin` · `success` · `success.soft` · `success.strong` · `ui.border` ·
`ui.border-hover` · `ui.field` · `ui.text-muted` · `warning` · `warning.soft` · `warning.strong`

<!-- /SURFACE:colors -->

### 2.2 Typografie-Rollen

<!-- SURFACE:typography -->

`t-body` · `t-body-on-dark` · `t-caption` · `t-display` · `t-error` · `t-eyebrow` ·
`t-eyebrow-dark` · `t-h1` · `t-h2` · `t-h2-section` · `t-h2-sub` · `t-h3` · `t-h4` · `t-h5` ·
`t-h6` · `t-helper` · `t-label` · `t-lead` · `t-lead-on-dark` · `t-link` · `t-link-cta` ·
`t-small` · `t-stage-h1`

<!-- /SURFACE:typography -->

### 2.3 Komponenten und öffentliche Konstanten

<!-- SURFACE:components -->

`Alert` · `Button` · `Card` · `CardGrid` · `Checkbox` · `Container` · `Dialog` · `EYEBROW_DARK` ·
`EYEBROW_LIGHT` · `EmptyState` · `ErrorState` · `Eyebrow` · `FormField` · `Input` ·
`LoadingSpinner` · `LoadingState` · `Radio` · `Section` · `SectionHeader` · `Select` ·
`Skeleton` · `Textarea` · `buttonVariants` · `textareaVariants`

<!-- /SURFACE:components -->

---

## 3. Regeln

| Regel       | Bedeutung                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------- |
| **DS-CL-1** | Jede Änderung an Tokens, `.t-*`-Rollen oder Komponenten-Exporten braucht eine Change Note.        |
| **DS-CL-2** | Der passende `SURFACE`-Block wird **im selben Commit** aktualisiert.                              |
| **DS-CL-3** | Entfernen oder Umbenennen ist ein **Bruch** und wird als solcher benannt — nicht als „Aufräumen“. |
| **DS-CL-4** | Ein Alias wird zuerst als `deprecated` geführt und erst danach entfernt.                          |
| **DS-CL-5** | Neue Farbe? Token **und** `PALETTE_HEX` in `scripts/check-color-tokens.mjs` im selben Commit.     |
