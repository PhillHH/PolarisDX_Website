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

Jede Aenderung an einer Quelle: `npm run build:photo-look` und `npm run check:article-images`.
