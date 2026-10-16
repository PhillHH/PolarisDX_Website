# Prompt-Satz „Polaris-Look" (KI-Bilder, Gemini / Nano Banana)

Gilt fuer jedes Motiv. Erzeugt werden nur Szenen — **kein Geraet, kein Display, kein Messwert,
keine Marke, kein Text, kein Labor** (PolarisDX ist Point-of-Care in der Praxis, Owner 2026-10-16);
Ausnahme seit Owner-Go 2026-10-16: der IglooPro darf „hin und wieder“ als Bild-zu-Bild-Platzierung
erscheinen — Referenzbild `src/assets/Igloo-pro-frontal.png` mitgeben, echte Groesse nennen, Display
aus, danach Form gegen den Render pruefen (Slots aktuell: Saeule Diagnostik = Geraet in der Hand,
Artikel 5-Minuten-Diagnose = Geraet auf dem Tresen). Danach laeuft jedes Bild durch
`scripts/build-photo-look.mjs` (gleiche Farbbehandlung wie die Fotos).

**Stil (an jeden Prompt anhaengen) — Fassung 2, Owner 2026-10-16: „lebendig, nicht Stock, nicht klinisch":**

> Candid, lively editorial photograph for a modern dental and aesthetic-medicine brand. Warm natural
> daylight, genuine relaxed smiles and real interaction between people, modern practice interior in
> the style of award-winning German dental practices: light oak wood, white and warm beige surfaces,
> soft lounge furniture, green plants, large windows, a few water-blue and deep-navy accents in
> textiles or walls. Welcoming and human, not sterile, not posed stock photography. 35 mm lens,
> shallow depth of field, realistic skin and fabrics, no text, no logos, no screens with content,
> no laboratory, no watermark.

Referenz fuer „moderne Praxis": ZWP Designpreis 2025 (Lounge-Charakter, Eiche, Beige, wenige
wasserblaue Akzente). Der IglooPro ist ein Wuerfel von ca. 87,5 × 87,5 × 91 mm und 270–400 g
(Datenblaetter Biovendor/Audamed, IFU igloo.today) — in Platzierungsbildern immer „about 9 cm,
fits into one hand" angeben, sonst malt das Modell ihn kaffeemaschinengross.

| Slot                         | Datei (`assets-src/photos/`) | Seitenverhaeltnis                        | Motiv                                                                                                                                                                           |
| ---------------------------- | ---------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Buehne Startseite            | `practice-dental-2600.jpg`   | 16:9, Motiv rechts, links ruhige Flaeche | Laechelnde Zahnaerztin in legerem Kasack im hellen Behandlungsraum mit Eiche und Pflanze, wendet sich zur Kamera, entspannter Patient im Stuhl; Motiv rechts, ruhige Wand links |
| Karte Dental                 | `practice-dental.jpg`        | 4:3                                      | Zahnaerztin und Assistenz lachen mit einer Patientin, die sich im Stuhl aufsetzt; warmes Licht, Eiche und Weiss                                                                 |
| Karte Beauty                 | `practice-beauty.jpg`        | 4:3                                      | Aesthetik-Beratung: Behandlerin und Kundin schauen gemeinsam laechelnd in einen Handspiegel, loungiger Raum mit Pflanzen                                                        |
| Karte Longevity              | `practice-longevity.jpg`     | 4:3                                      | Vitales Paar Ende 50 lacht im goldenen Morgenlicht beim Spaziergang mit Fahrraedern                                                                                             |
| Saeule Diagnostik            | `practice-consult.jpg`       | 3:2                                      | IglooPro (echte Groesse, Referenz-Render) auf der offenen Handflaeche einer laechelnden Assistenz, helle moderne Praxis                                                         |
| Saeule Epigenetik            | `lab-analyst.jpg`            | 3:2                                      | Aerztin und Patientin schauen gemeinsam lachend auf einen gedruckten Befund, helle Beratungsecke mit Holz, Textilien und Pflanze, Befundinhalt unscharf                         |
| Artikel Gruene Praxis        | `reception.jpg`              | 16:9                                     | Einladender Praxisempfang wie eine Hotellounge: geschwungener Eichentresen, Pflanzen, warme Pendelleuchten, laechelnde Empfangsmitarbeiterin begruesst Patientin                |
| Artikel Unsichtbarer Patient | `doctor-tablet.jpg`          | 16:9                                     | Zahnarzt entspannt am Holzschreibtisch zu Hause mit Laptop und Kaffee im Morgenlicht, laechelnd, Bildschirm abgewandt                                                           |
| Artikel 5-Minuten-Diagnose   | `lab-tubes.jpg`              | 16:9                                     | IglooPro (echte Groesse, Referenz-Render) auf dem Eichentresen einer einladenden Praxis, laechelnde Assistenz dahinter unscharf                                                 |
| Artikel Performance-Formel   | `clinic-modern.jpg`          | 16:9                                     | Moderne Wartelounge mit weichen Sesseln, Eiche, grossen Pflanzen und Tageslicht, eine Patientin liest entspannt                                                                 |
| Artikel Praezision           | `lab-micro.jpg`              | 16:9                                     | Nahaufnahme: Haende einer Assistenz bereiten sorgfaeltig ein kleines Probenroehrchen und einen Tupfer auf dem Eichentresen vor, warmes Licht                                    |

Bildnachweis: KI-generierte Motive werden im Impressum §8 als „KI-generiert (PolarisDX)" gefuehrt.

**Stand 2026-10-16 (Runde 2):** alle elf Slots erzeugt mit `gemini-3-pro-image-preview` (je zwei Varianten,
Auswahl Owner/Claude), Buehne per Bild-zu-Bild auf 4K gehoben (`imageSize: 4K`). Skripte lagen im
Session-Scratchpad; Reproduktion: Prompt = Motiv + Stilsatz, `imageConfig.aspectRatio` wie in der
Tabelle. Schluessel nur aus `~/.config/polaris/gemini.env` (nie im Repo).
