# work-packages — ein Vertrag pro Arbeitspaket

- Eine Datei pro Arbeitspaket.
- Name exakt `AP00.md` … `AP33.md`. Keine Varianten, keine Suffixe, keine Unterordner.
- `../scope/MASTER-SCOPE.md` bleibt die Scope-Autorität.
- AP-Dateien detaillieren **nur** ihr jeweiliges Arbeitspaket und erweitern oder reduzieren den
  Master-Scope nicht.
- AP-Dateien dürfen bestätigte Decisions (`DEC-RL-001`–`015`, `REST-01`–`03`) nicht neu öffnen.
- Primärtasks werden **seriell** abgearbeitet: ein Primärtask pro Agent-Lauf.
- Aktueller Fortschritt steht ausschließlich in `../state/AP-STATE.md` — keine AP-eigene State-Datei.
- Context-Abhängigkeiten stehen ausschließlich in `../CONTEXT-INDEX.md`.

Dies ist keine zweite Scope-Dokumentation. Noch nicht angelegte `APxx.md` werden erst dann erzeugt,
wenn das jeweilige Arbeitspaket vorbereitet wird.
