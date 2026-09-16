-- AP22 PT22.2 — Konsolidierung des Lead-Datenmodells auf 7/7 Journeys.
--
-- Was fehlte und warum es hier steht:
--
--  1. STATUS. Das Modell kannte sieben Zustaende. Es fehlten `VALIDATED`
--     (validiert, aber noch nicht geschrieben), `QUEUED` als kanonischer Name
--     des Wartezustands und vor allem `RECONCILIATION_REQUIRED`. Der letzte
--     ist kein Schoenheitsfehler: ein Provider-Timeout wurde bisher als
--     `FAILED_TERMINAL` abgelegt. Das behauptet Wissen, das es nicht gibt —
--     bei einem Timeout ist unbekannt, ob die Mail rausging. Der Vorgang
--     braucht menschliche Klaerung, keine Fehlermeldung.
--
--  2. STABILE VORGANGSNUMMER. `reference` lag bisher nur im JSON-Kontext der
--     Consumer-Bestellung. Als Spalte ist sie fuer alle sieben Journeys
--     eindeutig und abfragbar.
--
--  3. DEDUP. Es gab nur die Idempotenz ueber den Schluessel. Fachliche
--     Dubletten (dieselbe Anfrage zweimal in kurzer Folge) brauchen einen
--     journey-eigenen Schluessel — ausdruecklich KEIN globales E-Mail-Dedup,
--     das legitime Anfragen desselben Menschen zu verschiedenen Journeys
--     verschluckt haette.
--
--  4. AUFBEWAHRUNG. Nur der Support-Slice trug eine Loeschfrist, und zwar im
--     JSON. Als Spalte ist sie indizierbar; ein Loeschjob (AP22, spaeter)
--     kann sie abfragen, statt jedes JSON zu parsen.
--
--  5. LEBENSZYKLUS-ZEITSTEMPEL. `lead_events` bleibt das Auditprotokoll.
--     Die vier Wendepunkte stehen zusaetzlich als Spalte, damit eine Frage
--     wie "was haengt seit gestern in QUEUED" ohne Protokoll-Scan geht.
--
-- SQLite kann eine CHECK-Bedingung nicht aendern, deshalb der Tabellenumbau.
-- `applyMigrations` schaltet dafuer die Fremdschluessel ab und prueft danach
-- mit `foreign_key_check`, dass keine Kindzeile haengen blieb. Bestehende
-- Zeilen werden vollstaendig uebernommen; `PENDING_HANDOFF` wird auf den
-- kanonischen Namen `QUEUED` gehoben und bleibt als Altwert erlaubt.

CREATE TABLE leads_pt222 (
  id TEXT PRIMARY KEY,
  -- Fachliche, dem Absender nennbare Vorgangsnummer. NULL, solange eine
  -- Journey keine vergibt; eindeutig, sobald sie es tut.
  reference TEXT UNIQUE,
  idempotency_key TEXT NOT NULL UNIQUE,
  request_hash TEXT NOT NULL,
  journey TEXT NOT NULL,
  -- Journey-eigener fachlicher Dedup-Schluessel. Bewusst OHNE UNIQUE:
  -- eine Wiederholung nach Ablauf des Fensters ist eine legitime neue
  -- Anfrage, keine Dublette.
  dedup_key TEXT,
  status TEXT NOT NULL CHECK (
    status IN (
      'RECEIVED',
      'VALIDATED',
      'PERSISTED',
      'QUEUED',
      'PROCESSING',
      'DELIVERED',
      'RETRY_PENDING',
      'RECONCILIATION_REQUIRED',
      'FAILED_TERMINAL',
      -- Altwert aus 001. Wird nicht mehr geschrieben, bleibt aber gueltig,
      -- damit eine aeltere Zeile keine Constraint-Verletzung ausloest.
      'PENDING_HANDOFF'
    )
  ),
  subject_json TEXT NOT NULL,
  context_json TEXT NOT NULL,
  consent_json TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  last_attempt_at TEXT,
  last_error_class TEXT,
  handoff_state TEXT NOT NULL,
  -- Warum ein Vorgang Klaerung braucht. Nur gesetzt bei
  -- RECONCILIATION_REQUIRED; sonst NULL.
  reconciliation_reason TEXT,
  -- Loeschfrist als Datum (YYYY-MM-DD). NULL heisst: fuer diese Journey ist
  -- noch keine Frist festgelegt — ehrlich offen statt stillschweigend "nie".
  retention_delete_after TEXT,
  validated_at TEXT,
  queued_at TEXT,
  delivered_at TEXT,
  terminal_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT INTO leads_pt222 (
  id, reference, idempotency_key, request_hash, journey, dedup_key, status,
  subject_json, context_json, consent_json, attempt_count, last_attempt_at,
  last_error_class, handoff_state, reconciliation_reason, retention_delete_after,
  validated_at, queued_at, delivered_at, terminal_at, created_at, updated_at
)
SELECT
  id,
  -- Bestehende Vorgangsnummern aus dem Kontext heben, ohne sie zu erfinden.
  json_extract(context_json, '$.reference'),
  idempotency_key,
  request_hash,
  journey,
  NULL,
  CASE status WHEN 'PENDING_HANDOFF' THEN 'QUEUED' ELSE status END,
  subject_json,
  context_json,
  consent_json,
  attempt_count,
  last_attempt_at,
  last_error_class,
  handoff_state,
  NULL,
  -- Support trug die Frist bisher im JSON; sie wird uebernommen, nicht neu erfunden.
  json_extract(context_json, '$.retention.deleteAfter'),
  NULL,
  NULL,
  NULL,
  NULL,
  created_at,
  updated_at
FROM leads;

DROP TABLE leads;

ALTER TABLE leads_pt222 RENAME TO leads;

-- Fachliches Dedup-Fenster wird ueber (journey, dedup_key, created_at) gesucht.
CREATE INDEX leads_dedup_idx ON leads(journey, dedup_key, created_at);

-- Ein Loeschjob fragt nach faelligen Fristen, ohne JSON zu parsen.
CREATE INDEX leads_retention_idx ON leads(retention_delete_after);

-- "Was haengt in einem Zustand fest" ohne Protokoll-Scan.
CREATE INDEX leads_status_idx ON leads(status, updated_at);
