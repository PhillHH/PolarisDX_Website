# Wave 0 — Verbleibende Branches Audit

> Audit der 13 nach DSGVO-Cleanup verbleibenden Remote-Branches.
> Pro Branch wird klassifiziert: GEMERGT / EVTL UNIQUE / ZU PRUEFEN.
> Audit erfolgt in 3 Batches a 4-5 Branches.

## Methodik
Pro Branch wird ermittelt:
- Letzte Aktivitaet (relative + absolut)
- Anzahl Nicht-Merge-Commits gegen origin/main
- Klassifizierung in einen der drei Buckets

Klassifizierungs-Regeln:
- **GEMERGT** = 0 Nicht-Merge-Commits gegen main
- **EVTL UNIQUE** = 1+ Nicht-Merge-Commits mit feat/fix/refactor-Praefix
- **ZU PRUEFEN** = unklar oder grenzwertig

