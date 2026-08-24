# SCOPE-CHANGELOG — Change Control für Scope und bestätigte Entscheidungen

**Dokumenttyp:** Change-Control-Mechanismus + Änderungshistorie
**Erzeugt durch:** `PT00.1` (AP00 — Programmsteuerung, Scope Lock und Delivery Governance)
**Stand:** 2026-08-24
**Gilt für:** `building-docs/scope/MASTER-SCOPE.md`, `building-docs/PROJECT-CONSTRAINTS.md`,
`building-docs/DECISIONS.md` sowie jede Änderung an Launch-Scope, Backlog-Abgrenzung oder Baseline.

Solange ein Change hier nicht als `ACCEPTED` eingetragen ist, gilt die bisherige Festlegung
unverändert weiter.

---

## 1. Grundregel

> **Repository-Evidenz allein darf keine bestätigte Product Decision verändern.**

Repository-Evidenz beschreibt den **Ist-Zustand**. Weicht der Ist-Zustand von einem Lock ab, ist das
ein **Ist-/Soll-Delta** und damit ein Arbeitsauftrag — kein Änderungsgrund für die Entscheidung.

Ebenso wenig sind Änderungsgrund:

- ältere oder historische Repository-Dokumentation;
- der Inhalt eines Quell-Branches;
- eine technisch attraktivere Alternative;
- Session-/Gesprächsgedächtnis eines Agenten;
- die Bequemlichkeit der Umsetzung.

**Ein Implementierungsagent ändert nichts an Scope oder Decisions.** Er darf ausschließlich einen
Change **beantragen** (Status `PROPOSED`) und arbeitet bis zur Entscheidung innerhalb der geltenden
Festlegung weiter.

---

## 2. Was Change Control auslöst

Ein Change-Eintrag ist **verpflichtend**, wenn eines der folgenden Dinge geändert werden soll:

| Kategorie          | Beispiele                                                            |
| ------------------ | -------------------------------------------------------------------- |
| Baseline           | Wechsel oder Neuinterpretation von `feat/home-leadmagnet@961f65d`    |
| Decision Lock      | jede Änderung an `DEC-RL-001`–`DEC-RL-015`, `REST-01`–`REST-03`      |
| Geschlossene Frage | Wiederöffnen eines Punkts aus `DECISIONS.md` §4                      |
| Launch-Scope       | Aufnahme oder Streichung eines AP/PT im Launch-Umfang                |
| Backlog-Grenze     | Hochstufung eines Backlog-Themas zum Launch-Blocker (oder umgekehrt) |
| Launch-Gate        | Änderung, Streichung oder Ergänzung eines der 12 Gates               |
| Branch-Rolle       | Änderung des Status einer selektiven Quelle                          |
| Abhängigkeit       | Änderung einer kritischen Abhängigkeit / Hard Barrier                |

**Kein** Change-Eintrag nötig für: Tippfehler, Formatierung, Querverweise, Präzisierungen ohne
Bedeutungsänderung, sowie das reine Fortschreiben von `state/AP-STATE.md`.

---

## 3. Pflichtfelder je Change

Jeder Eintrag enthält **alle** folgenden Felder. Ein Eintrag mit fehlenden Feldern ist ungültig und
wird nicht wirksam.

| Feld                                    | Inhalt                                                                                                       |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `Change-ID`                             | fortlaufend `SC-001`, `SC-002`, …                                                                            |
| `Datum`                                 | ISO-Datum `YYYY-MM-DD` der Entscheidung                                                                      |
| `Status`                                | `PROPOSED` · `ACCEPTED` · `REJECTED` · `WITHDRAWN`                                                           |
| `Betroffene IDs`                        | betroffene Decision-IDs und/oder AP-/PT-IDs und/oder Gate-IDs                                                |
| `Vorheriger Zustand`                    | wörtlich, was bisher galt                                                                                    |
| `Neuer Zustand`                         | wörtlich, was künftig gilt                                                                                   |
| `Begründung`                            | warum die Änderung nötig ist — inklusive der Evidenz, die sie auslöste                                       |
| `Bestätigende menschliche Entscheidung` | wer die Änderung bestätigt hat (Rolle/Person) und wann; **ein Agent kann dieses Feld nicht selbst erfüllen** |
| `Auswirkung auf Scope`                  | welche AP/PT hinzukommen, entfallen oder sich ändern                                                         |
| `Auswirkung auf Abhängigkeiten`         | betroffene kritische Abhängigkeiten / Hard Barriers                                                          |
| `Auswirkung auf Gates`                  | betroffene Launch-Gates und deren Abnahmekriterien                                                           |
| `Aktualisierte kanonische Dokumente`    | Liste der Dateien, die im selben Schritt nachgezogen wurden                                                  |

---

## 4. Ablauf

1. **Beobachtung.** Ein Agent oder Beteiligter stellt einen Konflikt oder Änderungsbedarf fest.
2. **Eintrag `PROPOSED`.** Der Change wird mit allen Pflichtfeldern außer der Bestätigung erfasst.
   `Bestätigende menschliche Entscheidung` bleibt leer.
3. **Weiterarbeit im Lock.** Bis zur Entscheidung gilt die bisherige Festlegung. Es wird nichts
   „vorsorglich" nach dem beantragten Zustand gebaut.
4. **Menschliche Entscheidung.** Product Owner bzw. verantwortliche Rolle entscheidet
   `ACCEPTED` oder `REJECTED`.
5. **Nachziehen im selben Schritt.** Bei `ACCEPTED` werden alle betroffenen kanonischen Dokumente
   in **derselben** Änderung aktualisiert:
   `scope/MASTER-SCOPE.md` → `PROJECT-CONSTRAINTS.md` → `DECISIONS.md` → betroffene
   `work-packages/APxx.md` → betroffene `*-CONTRACT.md` → `state/AP-STATE.md`.
6. **Keine Parallelkopie.** Es wird die bestehende kanonische Datei aktualisiert; es entsteht **kein**
   zweites Decision-, Scope- oder State-Dokument.
7. **Vermerk im State.** Der Change wird in `state/AP-STATE.md` als Ereignis referenziert (ID + Wirkung),
   nicht als Volltext dupliziert.

### 4.1 Konfliktfall ohne Entscheidungsbefugnis

Widersprechen sich zwei kanonische Quellen und ist kein `ACCEPTED`-Change vorhanden, wird der Fall als
`BLOCKED_DECISION_CONFLICT` dokumentiert (Eintrag `PROPOSED` + Vermerk unter `Open Blockers` in
`state/AP-STATE.md`). Der Agent entscheidet nicht selbst und rät nicht.

---

## 5. Eintragsvorlage

```md
### SC-00X — <Kurztitel>

- **Datum:** YYYY-MM-DD
- **Status:** PROPOSED | ACCEPTED | REJECTED | WITHDRAWN
- **Betroffene IDs:** <DEC-RL-… | REST-… | APxx | PTxx.y | Gate n>
- **Vorheriger Zustand:** <wörtlich>
- **Neuer Zustand:** <wörtlich>
- **Begründung:** <warum, inkl. auslösender Evidenz>
- **Bestätigende menschliche Entscheidung:** <Rolle/Person, Datum>
- **Auswirkung auf Scope:** <…>
- **Auswirkung auf Abhängigkeiten:** <…>
- **Auswirkung auf Gates:** <…>
- **Aktualisierte kanonische Dokumente:** <Dateiliste>
```

---

## 6. Änderungshistorie

### SC-000 — Baseline der Change Control (Initialisierung)

- **Datum:** 2026-08-24
- **Status:** `ACCEPTED`
- **Betroffene IDs:** `DEC-RL-001`–`DEC-RL-015`, `REST-01`–`REST-03`, `DEC-BASE-001`, AP00 / PT00.1
- **Vorheriger Zustand:** Kein formaler Change-Control-Mechanismus; Decision Locks lagen ausschließlich
  in `scope/MASTER-SCOPE.md` §0.2 und `PROJECT-CONSTRAINTS.md` vor, ohne eigenes Decision Record und
  ohne definierten Änderungsweg.
- **Neuer Zustand:** `building-docs/DECISIONS.md` spiegelt 18/18 Locks mit Status `LOCKED`;
  dieses Dokument definiert den verbindlichen Änderungsweg für Scope und bestätigte Entscheidungen.
- **Begründung:** Erfüllung von `PT00.1` / `ST00.1.5`. Ohne dokumentierten Änderungsweg konnten spätere
  Agent-Läufe bestätigte Entscheidungen faktisch durch Repository-Evidenz umschreiben.
- **Bestätigende menschliche Entscheidung:** Product Owner, bestätigt im Master-Scope
  (`Stand 2026-08-21`, Status FINAL / Decision-Locked); durch `PT00.1` nur gespiegelt, nicht geändert.
- **Auswirkung auf Scope:** keine. Es wurde **keine** Entscheidung geändert, ergänzt oder entfernt —
  ausschließlich gespiegelt und referenzierbar gemacht.
- **Auswirkung auf Abhängigkeiten:** keine.
- **Auswirkung auf Gates:** keine; die 12 Launch-Gates aus Master-Scope §8 bleiben unverändert.
- **Aktualisierte kanonische Dokumente:** `building-docs/DECISIONS.md` (neu),
  `building-docs/SCOPE-CHANGELOG.md` (neu), `building-docs/state/AP-STATE.md` (fortgeschrieben).

<!-- Neue Einträge werden unterhalb dieser Zeile chronologisch ergänzt. -->
