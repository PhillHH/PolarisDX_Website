# Prompt-Satz „Polaris-Look" (KI-Bilder, Gemini / Nano Banana)

Gilt fuer jedes Motiv. Erzeugt werden nur Szenen — **kein Geraet, kein Display, kein Messwert,
keine Marke, kein Text, kein Labor** (PolarisDX ist Point-of-Care in der Praxis, Owner 2026-10-16);
Ausnahme seit Owner-Go 2026-10-16: der IglooPro darf „hin und wieder“ als Bild-zu-Bild-Platzierung
erscheinen — Referenzbild `src/assets/Igloo-pro-frontal.png` mitgeben, echte Groesse nennen, Display
aus, danach Form gegen den Render pruefen (Slot aktuell: Artikel 5-Minuten-Diagnose = Geraet auf dem
Tresen; die Saeule Diagnostik traegt seit SC-005 eine Parameter-Tafel, die Saeule IglooPro das
Explosions-Render). Danach laeuft jedes Bild durch `scripts/build-photo-look.mjs` (gleiche
Farbbehandlung wie die Fotos).

**Kompositionsregel (SC-005, Owner 2026-10-16):** Fotografie ist Akzent, nicht Tapete. Die Startseite
zeigt hoechstens zwei generierte Fotos (Buehne + Detail); Saeulen und Module wechseln zwischen Foto,
Produkt-Render, echtem Dokument (Musterbefund), Parameter-Tafel und Typografie; drei gleich grosse
Fotos in einer Reihe sind nicht mehr zulaessig (`building-docs/DESIGN-SYSTEM-CONTRACT.md` Fotoregel,
`building-docs/HOMEPAGE-CONTRACT.md` §4.2).

**Stil (an jeden Prompt anhaengen) — Fassung 3 (Stilsatz 3), Owner 2026-10-16 (SC-005): „hochwertige,
echte, natuerliche Fotos" — AKTUELL fuer die Startseiten-Motive (Buehne, Detail) und jedes neue
Motiv:**

> Candid reportage photograph taken on location in a contemporary high-end German dental practice:
> recently built, minimalist architecture, white and light grey surfaces with a little pale oak,
> hidden lighting, large windows, everything clean and new but in real use. Available light only,
> soft overcast daylight with gentle directional shadows, true-to-life restrained colours, realistic
> skin texture, nobody looks into the camera, nothing is posed. 35 mm full-frame look, moderate depth
> of field, a trace of film grain. No text, no logos, no screens with content, no watermark, no
> laboratory. Not glossy, not HDR, not a stock photo.

**Stil — Fassung 2 (Stilsatz 2), Owner 2026-10-16 (Runde 2): „lebendig, nicht Stock, nicht
klinisch" — gilt noch fuer die fuenf Artikelmotive aus Runde 2; fuer neue Motive durch Fassung 3
ersetzt:**

> Candid, lively editorial photograph for a modern dental and aesthetic-medicine brand. Warm natural
> daylight, genuine relaxed smiles and real interaction between people, modern practice interior in
> the style of award-winning German dental practices: light oak wood, white and warm beige surfaces,
> soft lounge furniture, green plants, large windows, a few water-blue and deep-navy accents in
> textiles or walls. Welcoming and human, not sterile, not posed stock photography. 35 mm lens,
> shallow depth of field, realistic skin and fabrics, no text, no logos, no screens with content,
> no laboratory, no watermark.

Referenz fuer „moderne Praxis": ZWP Designpreis 2025 (Lounge-Charakter, Eiche, Beige, wenige
wasserblaue Akzente); seit Stilsatz 3 zurueckhaltender (Weiss/Hellgrau, wenig Eiche, keine Lounge).
Der IglooPro ist ein Wuerfel von ca. 87,5 × 87,5 × 91 mm und 270–400 g (Datenblaetter
Biovendor/Audamed, IFU igloo.today) — in Platzierungsbildern immer „about 9 cm, fits into one hand"
angeben, sonst malt das Modell ihn kaffeemaschinengross.

| Slot                         | Datei (`assets-src/photos/`) | Seitenverhaeltnis                        | Stilsatz | Motiv                                                                                                                                                                          |
| ---------------------------- | ---------------------------- | ---------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Buehne Startseite            | `practice-dental-2600.jpg`   | 16:9, Motiv rechts, links ruhige Flaeche | 3        | Zahnarzt in Navy-Kasack sitzt neben einer zurueckgelehnten Patientin und erklaert ihr etwas, Assistenz unscharf im Hintergrund; Personen im rechten Drittel, ruhige Wand links |
| Detail Fachbereich-Modul     | `detail-capillary.jpg`       | 4:5                                      | 3        | Nahaufnahme: behandschuhte Hand haelt die Fingerkuppe einer Patientin mit einem Tropfen Kapillarblut, Wattepad auf einem Tablett; vorhandenes Licht, Praxis unscharf           |
| Artikel Gruene Praxis        | `reception.jpg`              | 16:9                                     | 2        | Einladender Praxisempfang wie eine Hotellounge: geschwungener Eichentresen, Pflanzen, warme Pendelleuchten, laechelnde Empfangsmitarbeiterin begruesst Patientin               |
| Artikel Unsichtbarer Patient | `doctor-tablet.jpg`          | 16:9                                     | 2        | Zahnarzt entspannt am Holzschreibtisch zu Hause mit Laptop und Kaffee im Morgenlicht, laechelnd, Bildschirm abgewandt                                                          |
| Artikel 5-Minuten-Diagnose   | `lab-tubes.jpg`              | 16:9                                     | 2        | IglooPro (echte Groesse, Referenz-Render) auf dem Eichentresen einer einladenden Praxis, laechelnde Assistenz dahinter unscharf                                                |
| Artikel Performance-Formel   | `clinic-modern.jpg`          | 16:9                                     | 2        | Moderne Wartelounge mit weichen Sesseln, Eiche, grossen Pflanzen und Tageslicht, eine Patientin liest entspannt                                                                |
| Artikel Praezision           | `lab-micro.jpg`              | 16:9                                     | 2        | Nahaufnahme: Haende einer Assistenz bereiten sorgfaeltig ein kleines Probenroehrchen und einen Tupfer auf dem Eichentresen vor, warmes Licht                                   |

Bildnachweis: KI-generierte Motive werden im Impressum §8 als „KI-generiert (PolarisDX)" gefuehrt.

**Stand 2026-10-16 (Runde 4, „Bildwelt 3", SC-005):** Buehne und Detail neu erzeugt mit
`gemini-3-pro-image-preview` nach Stilsatz 3 (drei Varianten je Slot, Auswahl Owner/Claude), Buehne
per Bild-zu-Bild auf 4K gehoben (`imageSize: 4K`); die fuenf Artikelmotive bleiben aus Runde 2. Die
Runde-2-Motive `practice-dental.jpg`, `practice-beauty.jpg`, `practice-longevity.jpg`,
`practice-consult.jpg` und `lab-analyst.jpg` sind geloescht (zuletzt in `e5dbb3b`); ihre Slots
(Fachbereich-Karten, Saeulen Diagnostik/Epigenetik) zeigen jetzt Leseliste, Parameter-Tafel und
Musterbefund. Der Pool hat damit sieben Quellen. Skripte lagen im Session-Scratchpad; Reproduktion:
Prompt = Motiv + Stilsatz, `imageConfig.aspectRatio` wie in der Tabelle. Schluessel nur aus
`~/.config/polaris/gemini.env` (nie im Repo).

**Stand 2026-10-16 (Runde 2):** damals alle elf Slots erzeugt mit `gemini-3-pro-image-preview` (je
zwei Varianten, Auswahl Owner/Claude), Buehne per Bild-zu-Bild auf 4K gehoben.
