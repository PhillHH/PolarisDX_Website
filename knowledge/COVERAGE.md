# Buch-Abdeckungs-Manifest

Zweck: nachweisbar machen, dass die Workflows **alle fünf Bücher** abdecken. Jede Direktive in
`REFACTORING-ANWEISUNG.md` trägt ein Quellen-Kürzel; diese Tabelle bündelt sie nach Buch und Phase.

| Kürzel  | Buch                                    | Primär abgedeckt in Phase(n)                                                                              | Kern-Beitrag zum Refactoring                                                                                              |
| ------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `[NOR]` | Design for a Better World — Norman      | **0** (Problem/Baseline), **5** (A11y/Humanity/Sustainability), **6** (UX-Validierung)                    | Zweck: meaningful · sustainable · humanity-centered; echte Bedürfnisse; ehrliche Metriken; keine Dark Patterns; Resilienz |
| `[BEC]` | Effective UX Design Strategies — Becker | **0** (Research/Problemdefinition), **6** (States/Content/Fail-Fast); foundational-first über alle Phasen | Prozess: HCD, Research, Personas, Dual-Track-Agile, Fidelity-Treppe, Product Graveyard, alle UI-States                    |
| `[FIL]` | UI Design Principles — Filipiuk         | **3** (Visueller Craft), **4** (Grid/Layout)                                                              | Wahrnehmung: Hierarchie, Gestalt, 8pt-Grid, Type-Scale, rollenbasierte Farbe, Kontrast, Schatten                          |
| `[FRO]` | Atomic Design — Frost                   | **2** (Atomic-Restrukturierung), **7** (Doku/Governance)                                                  | Architektur: Atoms→Pages, Interface Inventory, Pattern Lineage, Style-Guide, shared vocabulary, Holy Grail                |
| `[BUD]` | UI Design Systems Mastery — Budarina    | **1** (Tokens/Foundations), **7** (Komponenten-Doku/Governance)                                           | System: 3-Ebenen-Tokens, Token-Pipeline, Naming, Foundations, Variants/States, Theming, Changelog                         |
| `[§]`   | —                                       | quer                                                                                                      | Synthese-/Prozessregeln dieses Dokuments (keine Buch-Behauptung)                                                          |

## Abdeckungs-Check für Archon

Pro Phase prüfen, ob die erwarteten Kürzel vorkommen (grobe Soll-Verteilung):

```bash
# In REFACTORING-ANWEISUNG.md zählen, wie oft jedes Buch referenziert wird (Sanity-Check Abdeckung)
for tag in NOR BEC FIL FRO BUD; do
  printf "%s: %s Referenzen\n" "$tag" "$(rg -oc "\[$tag\]" REFACTORING-ANWEISUNG.md | paste -sd+ | bc 2>/dev/null || rg -o "\[$tag\]" REFACTORING-ANWEISUNG.md | wc -l)"
done
# Soll: jedes Buch > 0; keine Phase ohne mindestens eine [..]-Quelle.
```

Ein Workflow gilt erst als „buch-abdeckend", wenn jede Phase ihre laut Tabelle zuständigen Kürzel
real adressiert (nicht nur erwähnt) — d. h. die jeweiligen `Anweisungen` umgesetzt **und** die
`Verifikation` grün ist.
