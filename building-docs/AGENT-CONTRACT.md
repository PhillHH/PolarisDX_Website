# AGENT-CONTRACT — PolarisDX Website Relaunch

Operativer Vertrag für jeden Coding-Agenten, der in diesem Repository arbeitet.
Er gilt zusätzlich zur jeweiligen AP-/Task-Spezifikation und wird von ihr **nicht** außer Kraft gesetzt.

Autoritätsreihenfolge: siehe `building-docs/PROJECT-CONSTRAINTS.md`.

---

## 1. Scope- und Entscheidungshoheit

1. **Niemals Projektentscheidungen aus alter Repository-Dokumentation ableiten, wenn `MASTER-SCOPE.md` etwas anderes sagt.** `DOCS.md`, `_project-knowledge/`, `AUDIT_I18N_ROUTING.md`, `SEO_STRATEGY.md`, `CHAT_INTEGRATION.md` und vergleichbare Altdokumente sind die schwächste Quelle.
2. **Die Baseline-Entscheidung wird nie geändert.** Baseline ist `feat/home-leadmagnet@961f65d`. Andere Branches sind selektive Quellen, keine Gegenentwürfe. Auch eine technisch neuere Alternative ist kein Anlass, die Baseline zu wechseln.
3. **Decision Locks (`DEC-RL-001`–`DEC-RL-015`, `REST-01`–`REST-03`) werden von einem Implementierungsagenten niemals wieder geöffnet.** Wer einen Konflikt zwischen Lock und Realität findet, dokumentiert ihn und arbeitet innerhalb des Locks weiter.
4. **`_project-knowledge/` ist keine aktuelle Quelle der Wahrheit.** Es ist ein archivierter Quellcode-Schnappschuss und enthält u. a. zweite Kopien von `package.json`, `vite.config.ts`, `tailwind.config.js`, `Dockerfile`, `docker-compose.yml`, `nginx.conf`. Niemals als Live-Konfiguration behandeln.
5. **Alte Root-Dokumentation ist nicht autoritativ, wo neuere Repository-Evidenz ihr widerspricht.**
6. **Eine Aufgabe erweitert ihren Scope nicht stillschweigend.** Was außerhalb des aktuellen AP/PT liegt, wird notiert, nicht gebaut. Wird der Scope zu eng oder zu weit gefasst, ist das zu melden — nicht eigenmächtig zu korrigieren.
7. **Tests und Dokumentation, die der aktuelle AP verlangt, sind Teil der Implementierung** — keine optionale Nacharbeit und nichts, was „später" erledigt wird. Ein AP ohne seine geforderten Gates ist nicht fertig.

## 2. Branch- und Import-Regeln

8. **Quell-Branches sind ausschließlich selektive Implementierungsquellen.** `main@d0fdf29`, `redesign/preview@5673b61` und optional `feat/contact-joyful@ab373a3` liefern einzelne Dateien, Module oder Hunks — nie eine Richtung, nie eine Architektur.
9. **Niemals einen Quell-Branch als Ganzes mergen.** Kein `git merge`, kein branchweiter `cherry-pick`, kein `git checkout <ref> -- <pfad>` für eine Datei, die auf der Baseline ebenfalls existiert.
10. **Vor jedem branch-abgeleiteten Schritt** ist `building-docs/BRANCH-RECONCILIATION-MAP.md` zu konsultieren: Positivliste (IMPORT/REIMPLEMENT), Negativliste (DO_NOT_IMPORT) und die Commit-Sicherheitsmatrix.

## 3. Git-Sicherheit in einer Shared-Worktree-Umgebung

11. **Dieses Repository ist eine geteilte Worktree-Umgebung.** Objektspeicher, Refs und Stash-Stack werden mit mehreren anderen Worktrees geteilt; `main` ist anderswo ausgecheckt und kann hier nicht ausgecheckt werden.
12. **Vor jeder Mutation** aktuellen Zustand lesen: `git status`, aktueller Branch, `HEAD`.
13. **Keine globalen oder destruktiven Git-Operationen.** Kein `stash`, `reset`, `clean`, `rebase`, `merge`, `cherry-pick`, `checkout` eines anderen Branches, kein Löschen von Worktrees — es sei denn, die konkrete Aufgabe autorisiert genau diese Operation ausdrücklich.
14. **Kein Commit, kein Push, kein Staging ohne ausdrücklichen Auftrag.**
15. **Fremde Änderungen bleiben unangetastet.** Vorhandene uncommittete Änderungen und untracked Dateien anderer Arbeit werden weder entfernt noch „aufgeräumt". Insbesondere: `projektverzeichnis/` ist untracked und darf nicht gelöscht, verschoben oder gestaged werden.

## 4. Sicherheit und Daten

16. **Niemals Secret-Werte ausgeben** — weder in Ausgaben, Logs, Commit-Messages noch in Dokumentation. Variablennamen dürfen genannt werden, Werte nie.
17. **Kundendaten gehören nie ins Repository.**
18. **Preview/Staging erzeugen keine produktiven Side Effects.** Das gilt auch für CRM, Queue und Mailversand.

## 5. Hotspot-Regel

19. **Vor der Änderung eines G2-/G3-Hotspots werden dessen relevante Contract-/Kontextdokumente gelesen.** Blindes Editieren dieser Dateien ist untersagt. Zu den nachgewiesen kritischen Dateien gehören mindestens: `server.ts`, `src/App.tsx`, `src/components/seo/SEOHead.tsx`, `src/lib/tracking.ts`, `server/server.js`, `public/locales/**`, `index.html`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/seo/structuredData.ts`, `tailwind.config.js`, `src/i18n.ts`.
20. **Manuelle Spiegelungen respektieren.** Mehrere Verträge sind über zwei Dateien von Hand gespiegelt (Route-Registry ↔ `KNOWN_PATHS`; German-only-Pfade in `SEOHead.tsx` und `server.ts`; Sprachliste in `src/i18n.ts` und `server.ts`). Wer eine Seite ändert, ändert die andere im selben Schritt.

---

## 6. Canonical Context Bootstrap

**Vor jedem Primärtask, in dieser Reihenfolge:**

1. `building-docs/CONTEXT-INDEX.md` konsultieren.
2. `ALWAYS_READ` laden (Agent Contract · Project Constraints · relevante Master-Scope-Abschnitte ·
   aktuelles `work-packages/APxx.md` · `state/AP-STATE.md`).
3. Für das aktuelle AP **nur** den dort gelisteten `Required context` laden.
4. `Optional context` ausschließlich bei konkretem Bedarf laden — nicht vorsorglich.
5. Erst danach den aktuellen PT ausführen.
6. Nach Abschluss `building-docs/state/AP-STATE.md` aktualisieren.
7. Keine Session-Memory als alleinige Wissensquelle verwenden — was ein späterer Lauf braucht, steht
   in einem kanonischen Dokument oder im globalen State.

**Ein Primärtask liest nicht pauschal alle `building-docs`.** Wird ein nicht gelistetes Dokument
nachweislich gebraucht, wird es geladen und die Abweichung im State vermerkt.

**Genau eine State-Datei:** `building-docs/state/AP-STATE.md`. Keine parallelen AP-eigenen State-Dateien anlegen.

---

## 7. Kontextregel

**ZU BEGINN EINES NEUEN AP:**
Den vollständigen relevanten kanonischen Kontext **frisch** lesen — nach dem Canonical Context Bootstrap (§6) und `building-docs/CONTEXT-INDEX.md`. Nichts aus einem früheren AP als noch gültig voraussetzen.

**INNERHALB DESSELBEN AP:**
Die aktuelle AP-Spezifikation + `building-docs/state/AP-STATE.md` + die direkt betroffenen Repository-Dateien verwenden, statt wiederholt das gesamte Repository neu zu lesen.

**Abweichungsregel:** Weicht `HEAD` unerwartet von dem in `AP-STATE.md` vermerkten Stand ab, wird der vollständige AP-Bootstrap-Kontext neu geladen, bevor weitergearbeitet wird.
