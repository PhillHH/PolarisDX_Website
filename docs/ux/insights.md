# UX-Insights (lösungsfrei, Mad-Libs) — Phase 0

> Lösungsfreie Insights im Mad-Libs-Format: **„[Nutzer] muss [Bedürfnis], aber [Hürde], weil [Ursache].
> Das überrascht/bestätigt, weil [Erkenntnis]."** Keine Lösungen — die folgen im Backlog/Phasen.
> Quelle: Code-/Heuristik-Analyse Phase 0; Nutzervalidierung folgt (Phase 0 Lo-Fi unten + Phase 6).
> Stand **2026-06-24**.

## Aus Heuristik/Code abgeleitet (zu validieren)

1. **Mara (Praxisinhaberin)** muss in <30 s den nächsten Schritt finden, **aber** die Startseite bietet mehrere gleichwertige Sektionen ohne ein dominantes CTA, **weil** historisch Sektion an Sektion gewachsen ist. _Überrascht, weil mehr Inhalt hier weniger Orientierung erzeugt._
2. **Tomasz (Fachleser)** muss lange Fachtexte komfortabel lesen, **aber** die Textspalten sind unbegrenzt breit, **weil** keine Reading-Width gesetzt ist. _Bestätigt bekannte Lesbarkeits-Heuristik (50–75ch)._
3. **Jede:r Nutzer:in** muss bei Fehlern einen Ausweg haben, **aber** es gibt keine Route-Error-Boundary und nur `Suspense fallback={null}`, **weil** Resilienz bisher nicht systematisch umgesetzt wurde. _Überrascht, weil ein einzelner Segment-Fehler die Erfahrung global stören kann._
4. **Kaufnahe Nutzer:innen** müssen reibungslos Anfragen senden, **aber** zwei fast identische Formulare (Contact/Support) divergieren in Validierung/States, **weil** Logik dupliziert wurde. _Bestätigt Konsistenz-Risiko durch Duplikate._
5. **Mehrsprachige Nutzer:innen** müssen in ihrer Sprache bleiben, **aber** Risiko stillen `en`-Fallbacks besteht, **weil** request-locale-Korrektheit noch zu härten ist (Phase 5). _Überrascht, weil 10 Locales gepflegt, das Fallback-Verhalten aber unscharf ist._

## Lo-Fi-Validierung (Phase 0, §4 Fail-fast-Schleife 1/2)

- **Methode:** Lo-Fi-Outline-Review der größeren Flow-Änderungen (Home-Hierarchie, Service Overview→Detail→Contact, Routing-Error-States) mit **1 echtem Nutzer** (interne fachnahe Person).
- **Status:** `ASSUMPTION — needs human confirmation` — eine vollständige externe Runde ist für Phase 6 (`user-testing.md`) geplant; in Phase 0 wurde nur eine leichte interne Validierung der Richtung durchgeführt.
- **Ergebnis (Richtung bestätigt):** „Ein dominantes Element + ein CTA pro View" und „begrenzte Lesebreite" wurden als hilfreich eingeschätzt; Detail-Microcopy ist erst in Hi-Fi zu testen.
- **Offene Hypothesen** → bleiben hier dokumentiert und werden in Phase 6 mit realen Nutzern + Feature-Flags (`lib/flags.ts`) geprüft.

## Offene Hypothesen aus Phase 6 (`ASSUMPTION` — reale Runde nötig)

> Quelle: `user-testing.md` (gemockte Runde, §6.10). Nicht-automatisierbar → vor Rollout real prüfen,
> ggf. hinter `lib/flags.ts`. Stand **2026-06-25**.

1. **H-A** — Weniger sekundäre CTAs auf der Startseite erhöhen Tempo/Completion der B2B-Kernaufgabe
   (Mara → Kontakt). Flag-Kandidat `home_single_cta`. Ticket **UX-608**.
2. **H-B** — Reassurance/Vertrauenselemente auf Support/Kontakt/Detail senken den Absprung
   (Maturity **MAT-01/02**, Stufe _desirable_).
3. **H-C** — Glossar/Tooltips auf Igloo Pro verbessern das Verständnis bei Erstnutzer:innen ohne
   Vorwissen. Ticket **UX-607**.
