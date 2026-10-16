# Fotoquellen (unbearbeitet)

Ausgangsmaterial fuer `scripts/build-photo-look.mjs`. Die Dateien werden **nicht** gebundelt;
Vite sieht nur die erzeugten AVIF/WebP-Stufen unter `src/assets/`.

**Herkunft (seit 2026-10-16, Owner-Entscheidung):** alle elf Motive sind KI-generiert mit Google
Gemini (Modell `gemini-3-pro-image-preview`, „Nano Banana Pro") nach den Prompts in `PROMPTS.md`;
die Buehne `practice-dental-2600.jpg` ist die 4K-Fassung (5504 px) desselben Motivs (Bild-zu-Bild,
identische Komposition). Keine realen Personen, keine Marken, keine Geraete, keine Messwerte.
Rechte: Erzeugnisse der Gemini API duerfen kommerziell genutzt werden (Google Gemini API Terms,
Stand 2026-10). Nachweis im Impressum §8 als „KI-generiert (PolarisDX, Google Gemini)".
Die vorherigen Unsplash-Fotos (14 Dateien, IDs undokumentiert) sind entfernt (Git-Historie b8f8644).

Regeln fuer neue Motive stehen in `PROMPTS.md` (kein Geraet, kein Display, kein Text). Der
IglooPro bleibt der echte Render (`src/assets/Igloo-pro-frontal.*`, `hero_device.webp`).

Jede Aenderung an einer Quelle: `npm run build:photo-look` und `npm run check:article-images`.
