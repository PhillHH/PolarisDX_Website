CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  idempotency_key TEXT NOT NULL UNIQUE,
  request_hash TEXT NOT NULL,
  journey TEXT NOT NULL,
  status TEXT NOT NULL CHECK (
    status IN (
      'RECEIVED',
      'PERSISTED',
      'PENDING_HANDOFF',
      'PROCESSING',
      'DELIVERED',
      'RETRY_PENDING',
      'FAILED_TERMINAL'
    )
  ),
  subject_json TEXT NOT NULL,
  context_json TEXT NOT NULL,
  consent_json TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  last_attempt_at TEXT,
  last_error_class TEXT,
  handoff_state TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE lead_outbox (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('CRM', 'MAIL')),
  status TEXT NOT NULL CHECK (
    status IN (
      'PENDING',
      'PROCESSING',
      'RETRY_PENDING',
      'DELIVERED',
      'FAILED_TERMINAL'
    )
  ),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  available_at TEXT NOT NULL,
  claimed_at TEXT,
  claimed_by TEXT,
  last_attempt_at TEXT,
  last_error_class TEXT,
  delivered_at TEXT,
  terminal_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (lead_id, channel)
);

CREATE TABLE lead_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  outbox_id TEXT REFERENCES lead_outbox(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  status TEXT NOT NULL,
  attempt INTEGER,
  error_class TEXT,
  occurred_at TEXT NOT NULL
);

CREATE INDEX lead_outbox_claim_idx
  ON lead_outbox(status, available_at, claimed_at, created_at);

CREATE INDEX lead_events_lead_idx
  ON lead_events(lead_id, occurred_at, id);
