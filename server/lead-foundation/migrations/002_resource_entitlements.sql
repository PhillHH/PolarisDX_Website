-- AP19 PT19.3 — Entitlements fuer die geschuetzte Auslieferung gegateter Ressourcen.
--
-- Das Token selbst wird NIE gespeichert: nur sein SHA-256. Wer die Datenbank
-- liest, kann daraus keinen gueltigen Link bauen.
--
-- Ein Entitlement haengt an genau einem Lead und genau einer Asset-ID. Der
-- UNIQUE-Index macht die Ausstellung pro (Lead, Asset) eindeutig; ein zweiter
-- Submit rotiert das Token, statt einen zweiten Anspruch zu erzeugen.
CREATE TABLE resource_entitlements (
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  journey TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  asset_language TEXT NOT NULL,
  issued_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  download_count INTEGER NOT NULL DEFAULT 0 CHECK (download_count >= 0),
  max_downloads INTEGER NOT NULL CHECK (max_downloads > 0),
  last_downloaded_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX resource_entitlements_lead_asset_idx
  ON resource_entitlements(lead_id, asset_id);

CREATE INDEX resource_entitlements_expiry_idx
  ON resource_entitlements(expires_at);
