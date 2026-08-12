# Epigenetik-Inhalte: Einordnung in die Website

Arbeitsgrundlage für die Neustrukturierung. Ziel: tragfähiger Nutzerfluss,
weniger Absprung, ein Anfrageweg, der tatsächlich benutzt wird.

Stand 12.08.2026 · Grundlage sind die nginx-Logs von polarisdx.net,
14 Tage (30.07.–12.08.2026), Scan- und Bot-Verkehr herausgerechnet.

---

## 1 · Was die Zahlen sagen

**6.586 menschliche Seitenaufrufe von 2.441 Besuchern in 14 Tagen.**

| | |
|---|---|
| Besucher, die die Epigenetik-Strecke erreichen | **138** von 2.441 (5,7 %) |
| davon: nur diese eine Seite gesehen | **74** (54 %) |
| davon: einen Musterbefund geöffnet | **47** (34 %) |
| davon: jemals `/contact` erreicht | **9** (6,5 %) |
| Musterbefund-Leser, die `/contact` erreichen | **4** von 52 |
| Seiten pro Epigenetik-Besucher | Median **1**, Mittelwert 4,8 |

### Die Zahl, die alles andere erklärt

Median 1, Mittelwert 4,8. Das ist keine Streuung, das sind **zwei getrennte
Publika**: die eine Hälfte kommt an und geht sofort, die andere gräbt sich tief
ein. Dazwischen ist fast niemand. Eine Seite, die für ein mittleres
Interesse gebaut ist, bedient hier niemanden.

### Wer kommt woher

| Einstiegsseite der Epigenetik-Besucher | |
|---|---|
| direkt auf `/epigenetics` | 56 |
| **direkt auf eine Musterbefund-Detailseite** | **33** |
| über die Startseite | 14 |
| über eine Diagnostik-Unterseite | 4 |

Ein Drittel der Interessenten **betritt die Website über eine Musterbefund-Seite**.
Nicht über die Landingpage. Diese Seiten sind faktisch Eingangstüren — gebaut
sind sie als Endpunkte.

### Wohin sie gehen

Nach `/epigenetics` ist das häufigste nächste Ziel die **Startseite** (7), dann
`/articles` (4), `/events` (3), `/terms` (2). Niemand geht von hier aus
zielgerichtet weiter — sie verlaufen sich in unverwandte Bereiche.

### Woher sie kommen

40 Aufrufe mit Referer `polarisdx.net`, 3 von Google. **Es gibt praktisch keinen
organischen Einstieg.** Die Strecke wird fast ausschließlich intern gefunden.

### Nebenbefund

Von 178 Seitenaufrufen entfallen **61 auf Sprachfassungen mit englischem
Fallback-Text** (it, es, cs, pt, pl, nl, fr, da). Ein Drittel des Publikums liest
nicht in seiner Sprache.

> **Belastbarkeit:** Sitzungen sind über IP genähert, 14 Tage, n = 138 Besucher
> und 9 Kontaktaufrufe. Das sind Richtungen, keine Signifikanzen. Für Aussagen
> über einzelne Prozentpunkte reicht es nicht.

---

## 2 · Die drei Befunde, die die Struktur bestimmen

**A · Die Detailseiten sind der Eingang, nicht das Ziel.**
33 von 138 landen zuerst dort. Wer auf einem Musterbefund ankommt, sieht 24.000
Pixel Fachinhalt zu *einer* Analyse — und erfährt nirgends prominent, dass es
fünf weitere gibt, was PolarisDX ist und warum ihn das als Praxis interessieren
sollte. Der Umschalter am Kopf setzt voraus, dass man den Kontext schon kennt.

**B · Tiefe Beschäftigung führt nicht zur Anfrage.**
47 Besucher öffnen einen Musterbefund — das ist starkes Interesse. Nur 4 von 52
Musterbefund-Lesern erreichen je den Kontakt. Die am tiefsten Eingestiegenen
konvertieren am schlechtesten. Der Inhalt beantwortet die fachliche Frage so
vollständig, dass danach kein Grund mehr besteht zu fragen.

**C · Der Absprung passiert vor dem ersten Klick.**
54 % sehen genau eine Seite. Die Entscheidung fällt im ersten Bildschirm, bevor
Vergleichstabelle, Panels oder Musterbefunde überhaupt sichtbar sind.

---

## 3 · Was der Inhalt heute ist

Die Strecke besteht aus drei Inhaltsebenen, die technisch getrennt sind, aber
redaktionell nie als Ebenen gedacht wurden:

| Ebene | Umfang | Zweck heute | tatsächliche Rolle |
|---|---|---|---|
| **Landingpage** `/epigenetics` | ~14.400 px, ~2.500 Wörter, 9 Kapitel | Überblick über das Portfolio | Einstieg für 56 von 138 |
| **Sechs Musterbefunde** | je 11.000–25.000 px, 3.300 Wörter | Beleg, wie ein Befund aussieht | **Eingangstür für 33 von 138** |
| **26 PDFs** | 9 Infoblätter, 6 Musterbefunde, Glossar, Studienlage | Mitnahme | kaum messbar genutzt |

Dazu die Einstiege in die Strecke: Hauptnavigation, Startseiten-Teaser,
Diagnostik-Übersicht, Sidebar der neun Diagnostik-Unterseiten, Downloads-Seite.

**Der Inhalt selbst ist gut.** Er ist fachlich präzise, aus den Quell-PDFs
abgeleitet, mit echten Diagrammen und einem sauberen rechtlichen Rahmen. Das ist
nicht das Problem.

**Das Problem ist die Rolle, die er spielt.** Er ist als Fachaufsatz geschrieben —
vollständig, belegend, abschließend. Die Nutzer kommen aber als Suchende mit
einer Frage: *Passt das zu meiner Einrichtung, und was kostet es mich, das
herauszufinden?* Ein Aufsatz beantwortet diese Frage nicht, er erschlägt sie.

---

## 4 · Neustrukturierung

### 4.1 Drei Inhaltsebenen mit klaren Aufgaben

**Ebene 1 — Die Entscheidungsseite** (`/epigenetics`)
Beantwortet in einem Bildschirm: *Was ist das, für wen, wie komme ich dran.*
Alles Weitere ist Vertiefung. Maximal so lang, dass ein Erstbesucher sie
überfliegen kann, ohne zu scrollen.

**Ebene 2 — Sechs Analyseseiten** (heute: die Musterbefunde)
Je Panel eine Seite, die **zuerst** die Einordnung liefert (für wen, was misst
es, was folgt daraus) und **danach** den vollständigen Musterbefund als Beleg.
Heute ist die Reihenfolge umgekehrt: erst 24.000 Pixel Befund, dann nichts.

**Ebene 3 — Belege** (PDFs, Studienlage, Glossar)
Bleiben wo sie sind, aber nur noch von Ebene 2 aus erreichbar. Sie gehören nicht
in den Hauptfluss.

### 4.2 Jede Seite bekommt einen Kopf, der für Ersteinsteiger funktioniert

Weil ein Drittel direkt auf Ebene 2 landet, braucht **jede Musterbefund-Seite**
oben:

- eine Zeile, was PolarisDX ist und worum es geht (heute nur der Panelname)
- die Einordnung „für wen ist diese Analyse" — die Angabe, wegen der jemand
  überhaupt liest
- den Verweis auf die anderen fünf, sichtbar, nicht im Aufklappmenü
- den Anfrageweg **im ersten Bildschirm**, nicht erst nach 24.000 Pixeln

### 4.3 Der Anfrageweg wird zum Begleiter statt zum Endpunkt

Heute steht die Anfrage am Ende jeder Seite. Bei 24.000 Pixeln erreicht sie
kaum jemand — 4 von 52.

Stattdessen: eine schlanke, mitlaufende Leiste mit **einem** Angebot, das sich
nach Lesetiefe ändert:

| Position | Angebot |
|---|---|
| oberes Drittel | „Die sechs Analysen im Vergleich" — orientieren |
| Mitte | „Diesen Befund als PDF" — mitnehmen, niedrigschwellig |
| unteres Drittel | „Konditionen anfragen" — das eigentliche Ziel |

Der Grund: wer nach 20.000 Pixeln noch liest, ist nicht mehr am Orientieren.
Ein CTA, der die ganze Zeit dasselbe sagt, passt nur an einer Stelle.

### 4.4 Der zweitbeste Ausgang wird gebaut

Nur 6,5 % erreichen den Kontakt — für ein erklärungsbedürftiges B2B-Angebot ist
das normal. Was fehlt, ist die **Stufe darunter**: ein Weg, der weniger kostet
als eine Anfrage, aber die Verbindung hält.

Kandidaten, in dieser Reihenfolge:
1. **PDF-Download mit Adresse** statt anonym — der Interessent nimmt etwas mit,
   wir erfahren wer.
2. **„Zum Vergleich vormerken"** über die sechs Panels, am Ende als
   vorbefüllte Anfrage.
3. **Fachlicher Verteiler** zur Studienlage — passt zum Publikum, ist kein Verkauf.

Ohne diese Stufe endet jede Sitzung, die nicht zur Anfrage führt, im Nichts.
Das sind heute 129 von 138.

### 4.5 Der Einstieg von außen muss überhaupt erst entstehen

3 von 178 Aufrufen kommen aus einer Suchmaschine. Die Strecke existiert für die
Außenwelt praktisch nicht. Das ist keine UX-Frage, sondern eine
Reichweitenfrage — aber sie entscheidet, ob die Neustrukturierung überhaupt
etwas zu verteilen bekommt.

Die sechs Analyseseiten sind das natürliche Einstiegsmaterial: sie beantworten
konkrete Suchfragen („biologisches Alter messen Praxis", „Telomerlänge Labor").
Dafür brauchen sie eigenständige Titel und Beschreibungen, die nicht mit
„Musterbefund" beginnen — heute heißt jede „Musterbefund <Panel>", was niemand
sucht.

---

## 5 · Was gemessen werden muss, bevor wieder gebaut wird

Die obigen Zahlen stammen aus Server-Logs. Sie zeigen Pfade, nicht Verhalten.
Vor dem nächsten Umbau brauchen wir:

- **Scrolltiefe** je Seite — die Absprungvermutung „im ersten Bildschirm" ist
  bisher nur aus „eine Seite gesehen" abgeleitet
- **Klicks auf die vier Anfragewege** (Formular, Mail, Telefon, PDF). Die
  Ereignisse sind seit dem letzten Umbau verdrahtet, aber im GTM-Container noch
  nicht als Conversions gesetzt
- **Verweildauer auf den Musterbefund-Seiten** — 24.000 Pixel können gelesen
  oder überflogen werden, das unterscheidet die Logs nicht

Ohne diese drei Größen ist jede weitere Änderung eine Wette.

---

## 6 · Offene Entscheidungen

1. **Ist Epigenetik eine zweite Säule oder ein Teil der Diagnostik?**
   Heute steht sie in der Navigation unter „Diagnostik", hat aber ein eigenes
   Geschäftsmodell, eine eigene Zielgruppe und einen eigenen Anfrageweg. Diese
   Entscheidung bestimmt Navigation, Einstiege und ob die Strecke eine eigene
   Startseiten-Position verdient.

2. **Werden die acht Fallback-Sprachen übersetzt oder abgeschaltet?**
   34 % der Aufrufe landen auf englischem Text unter fremder Sprachflagge.
   Entweder Fachübersetzung oder die Strecke auf DE/EN beschränken.

3. **Bekommt der PDF-Download eine Adressabfrage?**
   Das ist die wirksamste der drei Zwischenstufen — und zugleich die, die den
   niedrigschwelligen Charakter kostet.

4. **Wie viel Redaktion darf in die Musterbefunde?**
   Ihre Texte sind aus den Quell-PDFs abgeleitet und fachlich abgestimmt. Für
   Ebene 2 bräuchten sie einen redaktionellen Kopf, der es nicht ist.
