# Umbaukonzept Epigenetik-Strecke

Stand: 11.08.2026 · Ziel: `main` / polarisdx.net · Betrifft `/epigenetics` und `/epigenetics/musterbefund/:slug`

Grundlage: Screenshot-Teardown beider Umgebungen (Live und Preview, Desktop 1440 px und
Mobil 390 px, abschnittsweise), Messungen mit Playwright gegen die Live-Seite, Quelltext-Abgleich
zwischen `~/01polaris` (main) und `~/01polaris-preview` (feat/home-leadmagnet).
24 Befunde erhoben, jeder einzeln adversarial gegengeprüft — 16 davon verworfen. Was hier steht,
hat die Gegenprobe überlebt oder ist von Hand nachgemessen.

---

## Das eigentliche Problem

Die Strecke ist als **Fachaufsatz** gebaut, nicht als **Auswahlwerkzeug**. Sie stellt Detail vor
Übersicht, Jargon vor Erklärung und zeigt dieselben sechs Panels an vier Stellen mit jeweils
anderen Angaben. Der Fachanwender kommt mit genau einer Frage — „welches Panel passt zu meiner
Einrichtung?" — und bekommt sie erst nach rund 5.400 Pixeln beantwortet; mobil praktisch gar nicht.

Und die gesamte Argumentation mündet in einen Trichter, der einem anderen Produkt gehört.

---

## Ausgangslage, gemessen

Landingpage `/de/epigenetics` (Live, 1440×900): **17.682 px**, 2.751 Wörter, 10 Abschnitte,
**6 Bilder** — alle im selben Block.

| Abschnitt | Höhe | Wörter | Bilder |
|---|---|---|---|
| prinzip | 1.210 px | 197 | 0 |
| analysen | 3.065 px | 575 | 0 |
| vergleich | 1.664 px | 284 | 0 |
| musterbefunde | 2.438 px | 365 | 6 |
| ablauf | 799 px | 71 | 0 |
| werte-verstehen | 1.735 px | 401 | 0 |
| studienlage | 1.380 px | 260 | 0 |
| fragen | 943 px | 49 | 0 |
| downloads | 1.506 px | 246 | 0 |
| konditionen | 657 px | 69 | 0 |

Musterbefund-Detailseite: **24.570 px**, 3.381 Wörter, 49 Überschriften.

### Die Vierfach-Nennung

Vier Blöcke in `public/locales/de/epigenetics.json` listen dieselben sechs Analysen:
`analyses`, `compare`, `samples`, `sheets`. Jeder Analysename steht 4–7× auf der Seite.
Zwölf Links zeigen auf sechs Musterbefund-Ziele, je zweimal.

Nebenbefund: „Biologische **Alters-Uhr**" (4×) gegen „Biologische **Altersuhr**" (5×) —
dieselbe Analyse, zwei Schreibweisen in derselben Datei.

---

## Der schwerwiegendste Befund: der Trichter gehört einem anderen Produkt

Beide „Angebot anfragen"-Knöpfe auf `/de/epigenetics` verlinken auf `/de/contact`.

- Seitentitel dort: **„Kontakt & Angebot zum IglooPro anfordern | PolarisDX"**
- Freitextfeld: **„Ihre spezifischen Anforderungen an IglooPro"**
- Auswahl „Einsatzbereich": Apotheke · Arztpraxis/Klinik · Veterinärmedizin · Forschung/Labor ·
  Sonstiges — keine der Epigenetik-Zielgruppen (Longevity-Zentrum, Ernährungsberatung, BGM)

17.682 px Epigenetik-Argumentation enden in einem Formular über den Reader.

---

## Weitere bestätigte Befunde

**Klebende Leisten verdecken Inhalt (Desktop).** Header und Kapitelleiste stapeln sich. Auf
`live-03-vergleich.png` liegt die Leiste exakt auf der Kopfzeile der Vergleichstabelle — man liest
„ja", „nein", „Ampel 1–9" ohne Spaltennamen. Beim Hochscrollen verdeckt sie die Kopfzeile erneut.
Dieselbe Überlagerung schneidet Analysekarte 01 mitten im Satz ab.

**Mobil bleiben 81 % Bildschirm.** Kopfzeile und Kapitelleiste belegen beim Scrollen 163 der
844 px (19 %), auf dem Desktop 143 von 900 px (16 %). Am Seitenanfang ist es mehr, weil dort
zusaetzlich ein CTA-Band steht — die zunaechst genannten 39 % stammten aus dieser Position und
gelten nicht fuer den Lesefluss. Die Ankersprünge landen korrekt unter den Leisten (gemessen:
Abschnitt bei y=156 auf dem Desktop, y=168 mobil); dort ist nichts zu reparieren. Der echte
Defekt war die Tabellenkopfzeile, die beim normalen Scrollen hinter den Leisten verschwand. Die Kapitelleiste zeigt 2,5 von 10 Kapiteln; der Chip „Auf einen Blick" liegt bei
x 278–401 px in einem Container, der bei 374 px endet — die Abkürzung zur Tabelle ist faktisch
abgeschnitten. Die Vergleichstabelle scrollt horizontal, die Panel-Spalte ist ab 143 px Scroll weg,
keine Zelle ist sticky.

**Fußnavigation site-weit unlesbar.** Gemessen auf Live: Kontrast **1,40 : 1** für „Home",
„Über uns", „IglooPro" (gefordert: 4,5 : 1). Auf der Preview stehen dieselben Links bei 7,10 : 1 —
der Fix existiert dort bereits und hat main nie erreicht. Betrifft **jede Seite**, nicht nur diese.
(Der Header-Knopf „Kontakt" misst 11,08 : 1 und ist nur im transparenten Zustand über dem Hero
schlecht lesbar — anderes Thema, kleinere Reichweite.)

**Erklärung steht hinter dem Jargon.** „microRNA-Muster und DNA-Methylierung" fällt erstmals in
der ersten Karte von „Das Prinzip". Erklärt wird beides erst im Abschnitt „Werte verstehen" an
Position 6 von 10 — rund 8.000 px später. microRNA erscheint 25×, Telomer 17×, Methylierung 6×.

**Keine Grafik auf der ganzen Seite.** Kein Diagramm, kein Schema, keine Illustration. Die
6 Bilder sind Deckblatt-Ausschnitte im Musterbefund-Block.

**Sechs Karten, sechs verschiedene Faktenschablonen.** Umfang/Ergebnis, Umfang/Verlauf,
Marker/Aussagekraft, Methode/Ergebnis, Umfang/Befund, Umfang/Befund. Deshalb ist aus den Karten
kein Vergleich möglich.

**Der Abschluss ist kein Abschluss.** Nach 17.682 px endet die Seite in einer Mailadresse und
einer Telefonnummer statt im Formular. Daneben drei Links, die wieder wegführen. Der rechtlich
wichtigste Text der Seite — kein CE, Gendiagnostikgesetz — steht im hellsten Grau.

### Was die Gegenprobe verworfen hat

Nicht haltbar war unter anderem: „Es gibt keine Kurzfassung auf der Seite." Der Vergleichsabschnitt
**ist** die Kurzfassung und heißt sogar so — er steht nur an der falschen Stelle. Ebenso verworfen:
ein behaupteter Chat-Widget-Regress beim Merge (Richtung war umgedreht) und mehrere zu weit
gefasste Reichweiten-Aussagen zur CTA-Zählung.

---

## 1 · Neue Struktur

**Leitprinzip: Auswahl zuerst, Vertiefung danach, Beleg zuletzt.** Aus zehn Kapiteln werden acht.

| # | Abschnitt | Herkunft | Was passiert |
|---|---|---|---|
| — | Hero | hero | Eine Aufgabe statt drei CTAs: „Sechs Analysen — welche passt zu Ihrer Einrichtung?" |
| 1 | **Auswahl** | `vergleich` | Vergleichstabelle von Position 3 auf 1. Skalenlegende direkt darunter statt 4.900 px später |
| 2 | **Grundlagen** | `prinzip` + Vokabeln | Vier Begriffe auf einer Zeitachse „ändert sich nie – in Monaten – in Wochen". Erklärung vor Erstnennung |
| 3 | **Die sechs Panels** | `analysen` + `musterbefunde` | Verschmelzung. Eine Karte je Panel: Befundbild, einheitliche Faktenzeile, zwei Sätze, „Musterbefund ansehen →" |
| 4 | **Ablauf** | `ablauf` | bleibt, wird bebildert |
| 5 | **Belege & Grenzen** | `studienlage` + Rechtshinweis | HWG-Rahmen gehört zur Belegführung, nicht ans Seitenende zwischen zwei Verkaufsknöpfe |
| 6 | **Häufige Fragen** | `fragen` | GenDG-Frage standardmäßig aufgeklappt |
| 7 | **Unterlagen** | `downloads` | rückt direkt vor die Anfrage |
| 8 | **Konditionen anfragen** | `konditionen` | echter Primärknopf; Mail und Telefon sekundär |

**Raus:** „Werte verstehen" als eigenes Kapitel (Inhalt verteilt sich auf Position 1 und 2), der
dritte Fußlink auf dasselbe Ziel, und auf dieser Strecke das globale CTA-Band mit dem
Garantie-Claim, das 541 px hinter „keine CE-gekennzeichneten In-vitro-Diagnostika" steht.

**Neu:** mobile Panel-Karten statt querscrollender Tabelle, Zeitachsen-Grafik (ersetzt ca.
400 Wörter Fließtext), Einstiegsfilter über der Tabelle (Longevity/Prävention · Ernährungsberatung ·
Sportmedizin · BGM) — kein Konfigurator, ein Filter.

*Schätzung, nicht Messung:* 17.682 → 11.000–13.000 px, 2.751 → rund 1.700 Wörter.

## 2 · Navigation

**Desktop.** Nie zwei klebende Leisten gleichzeitig — beim Scrollen nach unten fährt der globale
Header ein, die Kapitelleiste bleibt. `scroll-margin-top` in Leistenhöhe an jedem Sprungziel.
Ein CTA im Sichtfeld statt zwei. Kapitelnamen wie ihre Überschriften („Kontakt" → „Konditionen",
„Auf einen Blick" → „Panel-Vergleich").

**Mobil.** Kapitelleiste als Auswahl-Sheet statt Scroller: eine Zeile „Kapitel 3 von 8: Die sechs
Panels ▾" öffnet alle acht. Kopfbereich unter 120 px statt 330. Keine horizontal scrollende
Tabelle; falls die Tabellenform doch bleibt: erste Spalte `position:sticky; left:0` mit deckendem
Hintergrund, Scroll-Hinweis über statt unter der Tabelle.

**Musterbefund-Umschalter.** Gleiches Inventar oben und unten, Titel „Musterbefund wechseln",
aktueller Eintrag als „(aktuell)", `aria-label` am Auslöser.

## 3 · Textstrategie

Gekürzt wird an **einer** Stelle: 940 Wörter für sechs Panels werden 360 (60 je Panel). Die Tiefe
existiert bereits in den Musterbefund-Seiten und der Portfolio-PDF.

Einheitliche Faktenschablone: dieselben fünf Achsen wie in der Tabelle (Parameter, Ebene, Für den
Verlauf, Genetische Analyse, Ergebnisform). Ein Kernsatz vor jedem Abschnitt. Bebildern statt
beschreiben. Vokabel-Regel: microRNA, Telomer, Methylierung erst nach ihrer Erklärung.

## 4 · Der Geschäftsweg

1. Überall **ein** Name: „Konditionen anfragen". Heute vier Beschriftungen, die Preview führt eine
   fünfte ein („Beratung buchen").
2. Eigene Anfragestrecke mit Einrichtungstyp, Panel-Interesse (vorbelegt aus dem geklickten
   Kontext), Fällen pro Monat, Fachanwender-Bestätigung.
3. Herkunft mitsenden: `source=epigenetics`, `panel=…`. `ContactFormData` hat heute kein solches
   Feld — jeder Lead muss nacherfragt werden.
4. Konditionen-Abschnitt: Primärknopf zum Formular, Mail/Telefon/PDF darunter.
5. Vier Messereignisse definieren. Ob GA4 Mail- und Telefonklicks heute erfasst, ist **nicht
   geprüft**.

---

## 5 · Umsetzung in drei Wellen

Alle Wellen zielen auf `main` / Live. Die Preview (`feat/home-leadmagnet`) enthält nur einen Teil
der Fixes und dazu Fremdes (Leadmagnet-Startseite, neu geschriebenes Formular, Footer-Farbwechsel).
**Ein Komplett-Merge ist der falsche Weg — es wird gecherry-pickt.**

### Welle 1 — viel Wirkung, wenig Aufwand (S–M)

| Maßnahme | Aufwand | Wirkung | Risiko |
|---|---|---|---|
| Kontrastfix Fußnavigation | S | site-weit von 1,40 auf ≥7:1 | visueller Regressionsdurchlauf nötig |
| CTA-Band auf dieser Strecke abschalten | S | −656 px, Garantie-Claim weg vom CE-Disclaimer | Entscheidung: nur hier oder site-weit |
| CTA-Benennung vereinheitlichen | S | ein Weg statt vier Namen | keins |
| Tabelle mobil als Karten | M | einziger Auswahlvergleich wird am Telefon nutzbar | zwei Darstellungen, eine Quelle |
| Skalenlegende an die Tabelle | S | Ergebnisformen dort erklärt, wo sie stehen | keins |
| Klebende Tabellenkopfzeile | S | Spaltennamen bleiben beim Scrollen lesbar | keins |
| Umschalter-Fix | S | Sackgassen-Klick weg | keins |
| Messpunkte prüfen | S | Grundlage für alles Weitere | keins |

### Welle 2 — der eigentliche Umbau (L)

Neue Reihenfolge, Verschmelzung `analysen` + `musterbefunde`, Vokabelzeile auf Position 2,
Textkürzung, einheitliche Faktenschablone, Bebilderung, mobiles Kapitel-Sheet.

Risiko mittel bis hoch: alte Anker (`#analysen`, `#vergleich`, `#werte-verstehen`) sind extern
verlinkt und stehen in PDFs → als Alias erhalten. Alle Texte existieren in DE und EN → doppelter
Freigabeaufwand. Jede gekürzte Formulierung braucht den HWG-Gegencheck.

### Welle 3 — Trichter und Tiefe (L)

Eigene Anfragestrecke mit Panel-Kontext und `source`-Feld, Einstiegsfilter über der Tabelle,
Musterbefund-Detailseiten nach demselben Bauplan.

Risiko mittel: das Kontaktformular wird in der Preview parallel umgebaut. Laufen beide Stränge
unabgestimmt, wird zweimal gebaut.

---

## 6 · Offene Entscheidungen

1. **Ein Name für die Anfrage** — Vorschlag „Konditionen anfragen", genau einer, DE und EN, für
   Hero, Leiste, Abschnitt und Formularknopf.
2. **Eigene Anfragestrecke oder erweitertes Zentralformular?** Das Kontaktformular wird ohnehin
   gerade umgebaut. Wird das nicht jetzt mitentschieden, wird zweimal gebaut.
3. **CTA-Band: nur hier abschalten oder site-weit ersetzen?** Der Claim „garantierter Performance"
   steht auf fast jeder Seite. Regulatory-Entscheidung, keine Layout-Frage.
4. **Kontrastfix sofort nach main?** Empfehlung: ja, unabhängig von allem anderen.
5. **Welche Zielgruppe sortiert die Tabelle standardmäßig?**

---

## Randnotiz zum Prod-Baum

`~/01polaris` trägt 12 uneingecheckte Änderungen an getrackten Dateien, darunter die korrigierte
Firmierung („Polaris Diagnostics Europe GmbH") und die vollständige USt-IdNr. `DE461318497`.
In git steht die achtstellige, ungültige `DE46131849`. Die Korrektur existiert **nur** im
Arbeitsverzeichnis und geht bei einem Rebuild aus git verloren. Sie gehört gesichert, bevor auf
Prod gebaut wird. Auf `feat/home-leadmagnet` ist sie mit `e96b486` bereits nachgezogen.
