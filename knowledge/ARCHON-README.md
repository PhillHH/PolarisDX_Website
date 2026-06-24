# Knowledge-Paket — Lesart für Archon (Agent-Swarm)

Dieses Verzeichnis ist die **Wissensbasis** für das paradigmen-getriebene Refactoring dieser Website.
Es ist self-contained und für die Orchestrierung durch **Archon** gedacht.

## Was ist was

| Pfad                          | Rolle                                                         | Wie konsumieren                                                                                                                  |
| ----------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `REFACTORING-ANWEISUNG.md`    | **Master-Spezifikation** (Workflows + Akzeptanz-Gates)        | **Operativer Steuertext.** Daraus die Workflows ableiten.                                                                        |
| `design-references/*.md`      | Die **5 vollständigen Bücher** (Volltext)                     | **Referenz-Korpus (RAG).** Nur ziehen, wenn ein §9-Pointer der Spec darauf verweist — **nicht** als Dauer-Kontext jedes Agenten. |
| `design-references/*_images/` | Buch-Figuren (Diagramme, Beispiele)                           | Nur für vision-fähige Agenten / Nachschlagen. Kein Pflicht-Kontext.                                                              |
| `COVERAGE.md`                 | Manifest Buch → Phasen                                        | Prüfen, dass jeder der 5 Paradigmen-Stränge durch Workflows abgedeckt ist.                                                       |
| `PROJECT-DECISIONS.md`        | Vorab-Entscheidungen (Marke/Schrift/Tonalität/Markt/Features) | **Vor dem ersten Lauf ausfüllen.** Der Swarm liest sie als gegebene Fakten statt zu raten.                                       |

## Wie Archon daraus Workflows bildet

1. **`REFACTORING-ANWEISUNG.md` ist die Quelle der Wahrheit.** Die **8 Phasen (0–7)** sind die Workflows; ihre Reihenfolge/Abhängigkeit steht in §4.
2. Pro Phase: die nummerierten **`Anweisungen`** = Tasks; der **`Definition of Done`**-Block = Akzeptanzkriterien; der **`Verifikation`**-Block = die auszuführenden Checks (genau diese Befehle laufen lassen, Ergebnis ist der Nachweis).
3. **Buch-Abdeckung:** Jede Direktive trägt ein Quellen-Kürzel `[NOR] [BEC] [FIL] [FRO] [BUD]` (Synthese = `[§]`). `COVERAGE.md` mappt Buch → Phasen; daraus lässt sich verifizieren, dass alle fünf Bücher abgedeckt sind.

## Abbruchbedingung („bis es passt") — wann der Swarm STOPPT

Der Lauf ist **fertig**, wenn:

- **alle** Per-Phase-`Definition of Done` **und** die **globale DoD (§5)** grün sind, **belegt durch ausgeführte Verifikations-Checks** (§1.15), **und**
- dieser Zustand über **≥2 aufeinanderfolgende Runden stabil** bleibt (keine neuen Verstöße, keine Regression).

Ohne diese harten Gates gibt es kein „perfekt" — sie sind die einzige objektive Stopp-Definition. Niemals auf „gefühlt fertig" stoppen.

## Betriebs-Hinweise (sonst thrasht der Swarm)

- **Laufende App nötig:** `axe`/`lighthouse`-Gates brauchen eine **gebaute, laufende** Instanz. Workflow: build → Server im Hintergrund starten → auf Ready warten → `URL` setzen → auditieren. Reines Code-Lesen erfüllt diese Gates nicht.
- **Baseline sichern:** Vor Phase 1 einen Tag/Branch `pre-refactor-baseline` setzen (Screenshots + Lighthouse/axe/Bundle-Metriken, Phase 0). Jede spätere Behauptung wird gegen diese Baseline gemessen.
- **Build nie rot lassen** (§1.4): nach jeder Einheit `build`+`typecheck`+`lint` grün, sonst sofort fixen.
- **Nur top-down committen, keine Duplikate, Token-Pflicht** ab Phase 1 (§1.7) — die Anti-Pattern-Tabelle (§6) ist die Sperrliste.
- **Menschliche Entscheidungen:** Wo die Spec „Nachfrage-Schwelle" sagt (Marke, Tonalität, Feature-Streichung), gilt `PROJECT-DECISIONS.md`. Ist dort etwas **nicht** festgelegt → **nicht raten**, sondern als offene Frage queuen und an dieser Stelle nicht weiterbauen.

## Reihenfolge

`0 Audit/Baseline → 1 Tokens → 2 Atomic → {3 Visual-Craft, 4 Grid/Layout} → 5 A11y/Humanity → 6 UX-Validierung → 7 Doku/Governance`
Phasen 3 & 4 dürfen pro Komponente verschränkt laufen. Alles andere strikt sequenziell.
