-- AP22 PT22.8 — Datenschutz- und Betriebsfunktionen.
--
-- Rein ADDITIV: drei Spalten und ein Index. Keine Tabelle wird umgebaut,
-- keine Zeile geloescht, keine CHECK-Bedingung geaendert. Eine bestehende
-- Datenbank laeuft nach dieser Migration unveraendert weiter.
--
--  1. SUBJECT_EMAIL_HASH. Eine Auskunfts- oder Loeschanfrage kommt mit einer
--     E-Mail-Adresse, nicht mit einer Lead-ID. Ohne Suchschluessel muesste
--     jede DSAR-Anfrage alle `subject_json` parsen. Gespeichert wird NUR der
--     SHA-256 der normalisierten Adresse — dieselbe Entscheidung wie bei
--     `dedup_key`: die Adresse selbst hat in einer indizierten Spalte nichts
--     verloren. Der Hash ist ein SUCHSCHLUESSEL, kein Schutz: die Adresse
--     steht weiterhin im Klartext in `subject_json`, und genau deshalb ist
--     die Anonymisierung unten noetig.
--
--  2. ANONYMIZED_AT. Macht eine erfolgte Loeschung/Anonymisierung sichtbar
--     und wiederholungssicher. Ohne diese Spalte waere eine zweite
--     Loeschanfrage nicht von einer ersten zu unterscheiden, und der Nachweis
--     "wir haben geloescht" haenge allein am Ereignisprotokoll.
--
--  3. LEGAL_HOLD_UNTIL. Die EINZIGE Ausnahme, die eine Loeschung verhindert.
--     Sie wird ausschliesslich BEWUSST von einer Person gesetzt (lead-ops)
--     und niemals abgeleitet. Hier wird KEINE gesetzliche Frist erfunden:
--     ohne Eintrag gibt es keine Ausnahme. Wer eine Aufbewahrungspflicht
--     geltend macht, muss sie eintragen und damit begruenden.

ALTER TABLE leads ADD COLUMN subject_email_hash TEXT;
ALTER TABLE leads ADD COLUMN anonymized_at TEXT;
ALTER TABLE leads ADD COLUMN legal_hold_until TEXT;

-- Auskunft/Loeschung sucht ueber (Hash, Zeit). Der Hash allein genuegt.
CREATE INDEX leads_subject_email_hash_idx ON leads(subject_email_hash);
