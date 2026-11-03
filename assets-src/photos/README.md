# Fotoquellen (unbearbeitet)

Ausgangsmaterial fuer `scripts/build-photo-look.mjs`. Die Dateien werden **nicht** gebundelt;
Vite sieht nur die erzeugten AVIF/WebP-Stufen unter `src/assets/`.

**Pool (Stand 2026-10-16, SC-005 / „Bildwelt 3"): sieben Quellen** — die Buehne der Startseite
(`practice-dental-2600.jpg`, 16:9, 4K-Fassung per Bild-zu-Bild, 5504 px), das Detailfoto des
Fachbereich-Moduls (`detail-capillary.jpg`, 4:5) und die fuenf Artikelfotos (`reception.jpg`,
`doctor-tablet.jpg`, `lab-tubes.jpg`, `clinic-modern.jpg`, `lab-micro.jpg`, 16:9). Die Startseite
zeigt genau zwei generierte Fotos (Buehne + Detail); alles andere dort sind Produkt-Render, der
echte Musterbefund, eine Parameter-Tafel, das echte Portraet der Praxisreferenz und ein Artikelfoto.
**Nachtrag SC-020 (2026-10-29, Owner „Das Herobild darf nicht das gleiche wie der Startseite sein"):**
die Folien 2/3 des Hero-Sliders zeigen ab `lg` zwei weitere Pool-Motive — `lab-tubes.jpg` (MEDICA) und
`lab-micro.jpg` gespiegelt (Panels) — als `public/home/event.avif` / `panels.avif` (2:1, 1440w, Look und
Navy-Verlauf der Buehne, Funktion `slides()`); sie laden nur im Browser mit dem Slider-Chunk, nie als
LCP. Kein neues Motiv, kein neuer Prompt.
Die fuenf Runde-2-Motive `practice-dental/-beauty/-longevity/-consult.jpg` und `lab-analyst.jpg`
sind entfernt (zuletzt in `e5dbb3b`).

**Herkunft (seit 2026-10-16, Owner-Entscheidung):** alle Motive sind KI-generiert mit Google Gemini
(Modell `gemini-3-pro-image-preview`, „Nano Banana Pro") nach den Prompts in `PROMPTS.md` (Buehne
und Detail Stilsatz 3 „Reportage in zeitgemaesser Praxis", Artikel Stilsatz 2). Keine realen
Personen, keine Marken, kein Text, keine Messwerte; der IglooPro erscheint nur in `lab-tubes.jpg`,
als Bild-zu-Bild-Platzierung mit dem Original-Render als Referenz (Owner-Go 2026-10-16). Rechte:
Erzeugnisse der Gemini API duerfen kommerziell genutzt werden (Google Gemini API Terms, Stand
2026-10). Nachweis im Impressum §8 als „KI-generiert (PolarisDX, Google Gemini)". Die vorherigen
Unsplash-Fotos (14 Dateien, IDs undokumentiert) sind entfernt (Git-Historie b8f8644).

Regeln fuer neue Motive stehen in `PROMPTS.md` (Stilsatz 3; kein frei gemaltes Geraet, kein Display
mit Inhalt, kein Text; hoechstens zwei generierte Fotos auf der Startseite). Der IglooPro bleibt
sonst der echte Render (`src/assets/Igloo-pro-frontal.*`, `hero_device.webp`,
`src/assets/home/igloo-explode-240w.webp`); der Musterbefund der Epigenetik-Saeule entsteht aus
`src/assets/epigenetics/befund-biologische-altersuhr@2x.webp`, nicht aus diesem Ordner.

**Nachtrag SC-021 (2026-11-02, Kopfzeile 13A-4):** Die Startseiten-Buehne ist statisch; sie zeigt
`practice-dental-2600.jpg` als saubere 16:10-Fotokarte (`src/assets/home/hero-card-{480,800,1280}w`,
Funktion `heroCard()`, Look ohne eingebackenen Navy-Verlauf und ohne Punktring — der Schleier des
alten Startbilds war vom Owner ausdruecklich unerwuenscht). Die Buehnenbilder `hero-desktop-*` /
`hero-mobile-*` und die Folienbilder `public/home/event.avif` / `panels.avif` (Slider SC-020) sind
entfernt; `stage()` und `slides()` gibt es nicht mehr. Kein neues Motiv, kein neuer Prompt.

Jede Aenderung an einer Quelle: `npm run build:photo-look` und `npm run check:article-images`;
nur die Fotokarten der Buehne (Praxis, Kapillarblut `detail-capillary.jpg` mittig, Geraet
`lab-tubes.jpg` rechts — Diashow der Folie 1, SC-021 Nachtrag 2): `node scripts/build-photo-look.mjs hero-card`; nur das Messe-Band
(`lab-tubes.jpg` als 12:5-Karte `event-band-480/960w`, Funktion `eventBand()`, SC-021 Nachtrag):
`node scripts/build-photo-look.mjs event-band`. Nur die Messehalle der MEDICA-Folie (`medica-2026-hall.jpg`, Owner-Motiv per Gemini
auf Duesseldorf korrigiert und mit PolarisDX-Stand, PROMPTS.md; 16:10 `event-hall-480/800/1280w`,
Funktion `eventHall()`, SC-021 Nachtrag 3): `node scripts/build-photo-look.mjs event-hall`.
Nur das Teamfoto der Startseite (`team-hamburg.jpg`, echtes Owner-Foto des Hamburger Teams im
Konferenzraum, 2000x1500, kein KI-Bild, keine Bearbeitung ausser Zuschnitt/Kompression; 4:3
`team-hamburg-800/1280w`, Funktion `teamPhoto()`, SC-021 Nachtrag 5): `node scripts/build-photo-look.mjs team`.
