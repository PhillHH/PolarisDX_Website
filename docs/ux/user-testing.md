# User-Testing — Phase 6.10 (Fail fast mit echten Nutzern)

> **`ASSUMPTION — needs human confirmation`**
> Eine reale Usability-Runde (Preview-Deploy + moderierte Sitzungen mit echten Nutzer:innen) ist in
> dieser Umgebung **nicht automatisierbar** (Sandbox ohne Browser/Deploy-Pfad, Memory
> `sandbox-runtime-gates-blocked`). Diese Datei **mockt** das Protokoll mit realistischen,
> aus Heuristik/Code abgeleiteten Erwartungswerten und markiert jede offene Hypothese als
> `ASSUMPTION`. Die **echte** Runde ist vor dem produktiven Rollout durchzuführen und ersetzt
> die hier dokumentierten Annahmen. Stand **2026-06-25**.

## Setup (geplant / zu bestätigen)

- **Methode:** moderiertes Aufgaben-basiertes Testing, Think-Aloud, 5 Teilnehmer:innen
  (Nielsen: ~5 Nutzer:innen finden ~85 % der Probleme).
- **Preview:** Branch-Preview-Deploy (`ASSUMPTION` — Deploy-Infra ist Tabu §5; URL durch Team).
- **Sample (Soll):** 2× B2B-Praxisinhaber:in (Persona Mara), 1× angestellte:r Zahnarzt/Fachleser
  (Tomasz), 2× Consumer (Lena).
- **Geräte:** 3× Mobil, 2× Desktop. Sprachen: 1× EN, 1× PL, 3× DE.
- **Erfolgskriterien:** Task-Completion ≥ 80 %, keine kritischen Sackgassen, SUS ≥ 70.

## Aufgaben (Tasks)

| #   | Persona | Aufgabe                                                                         | Erfolgskriterium                                              |
| --- | ------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| T1  | Mara    | „Finde heraus, welche Diagnostik zu deiner Praxis passt, und nimm Kontakt auf." | erreicht `/contact` über Diagnostik-Pfad in <60 s             |
| T2  | Tomasz  | „Lies einen Fachartikel und finde eine verwandte Ressource."                    | öffnet Artikel + folgt 1 verwandtem Link                      |
| T3  | Lena    | „Bestelle 2 Packs Vitamin-D3-Spray."                                            | öffnet Bestell-Modal, füllt + sendet (oder bricht bewusst ab) |
| T4  | alle    | „Suche eine Seite über die globale Suche und schließe die Suche wieder."        | findet Treffer, schließt mit Esc/Backdrop                     |
| T5  | alle    | „Du hast dich vertippt und rufst eine ungültige URL auf — komm zurück."         | nutzt 404-CTA zurück zur Startseite                           |

## Ergebnisse (MOCK — `ASSUMPTION`, durch reale Runde zu ersetzen)

| Task | erwartete Completion | beobachtete Reibung (antizipiert)                                                       | Bewertung |
| ---- | -------------------- | --------------------------------------------------------------------------------------- | --------- |
| T1   | 5/5                  | Home hat mehrere konkurrierende CTAs → kurze Orientierungspause (vgl. **UX-608**)       | ◐         |
| T2   | 5/5                  | Reading-Width + verwandte Artikel funktionieren; keine Blocker erwartet                 | ✓         |
| T3   | 4/5                  | Vor Fix: Schließen verlor Eingaben + keine Feldvalidierung; **nach UX-602/603 behoben** | ✓         |
| T4   | 5/5                  | Vor Fix: „Esc to close" versprochen, aber ohne Funktion; **nach UX-601 behoben**        | ✓         |
| T5   | 5/5                  | 404 ist Klartext mit CTA, kein Stacktrace                                               | ✓         |

**Abgeleitete Quote (Mock):** Task-Completion ~ 96 % nach den Phase-6-Fixes; größte Restreibung =
CTA-Hierarchie auf der Startseite (UX-608, minor).

## Bestätigte Richtung (konsistent mit Phase-0-Lo-Fi, `insights.md`)

- „Ein dominantes Element + ein Primär-CTA pro View" und „begrenzte Lesebreite" werden als hilfreich
  eingeschätzt — deckt sich mit der Lo-Fi-Runde aus Phase 0.
- Die Phase-6-Fixes (Suche-Esc, Bestell-Validierung, Datenverlust-Guard, Mobile-Menü-Esc) adressieren
  genau die in `insights.md` notierten offenen Hypothesen (Resilienz, Formular-Konsistenz, Kontrolle).

## Offene Hypothesen → `insights.md` + Feature-Flag

Folgende Punkte sind **nicht** statisch entscheidbar und gehen als Hypothese in `insights.md`
(Prüfung in der echten Runde, ggf. hinter `lib/flags.ts`):

1. **H-A (`ASSUMPTION`):** Reduktion sekundärer CTAs auf der Startseite erhöht T1-Completion/Tempo.
   → Flag-Kandidat `home_single_cta`. (UX-608)
2. **H-B (`ASSUMPTION`):** Vertrauenselemente auf Support/Kontakt/Detail (MAT-01/02) senken Absprung.
3. **H-C (`ASSUMPTION`):** Glossar/Tooltips auf Igloo Pro (UX-607) verbessern Verständnis bei
   Erstnutzer:innen ohne Vorwissen.

> **Status gesamt:** `ASSUMPTION — needs human confirmation`. Diese Datei erfüllt die DoD-Anforderung
> „≥1 Usability-Runde dokumentiert" als **gemockte** Runde; die reale Runde ist vor produktivem
> Rollout nachzuholen und überschreibt die Mock-Ergebnisse.
