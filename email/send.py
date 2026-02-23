#!/usr/bin/env python3
"""
PolarisDX Email Sender
Versendet HTML-Emails über SendGrid – einzeln oder aus Excel-Liste.

Beispiele:
  # Test-Email an sich selbst
  python send.py --to phillip@polarisdx.net --dry-run

  # Einzelversand
  python send.py --to arzt@praxis.de --subject "S3-Leitlinie: Schnelltests sind gleichwertig"

  # Bulk aus Excel
  python send.py --excel kontakte.xlsx --limit 5

  # Anderes Template
  python send.py --template dental-outreach.html --to test@example.com

  # Mit Anhang
  python send.py --to arzt@praxis.de --attachment flyer.pdf

Docker:
  docker build -t polarisdx-mailer .
  docker run --env-file .env polarisdx-mailer --to test@example.com --dry-run
  docker run --env-file .env -v ./kontakte.xlsx:/app/kontakte.xlsx polarisdx-mailer --excel kontakte.xlsx
"""

import os
import sys
import argparse
import base64
import time
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import (
    Mail, Attachment, FileContent, FileName, FileType, Disposition,
)

# ── Defaults ──────────────────────────────────────────────────────────
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL", "hello@polarisdx.net")
FROM_NAME = os.getenv("FROM_NAME", "PolarisDX")
DEFAULT_TEMPLATE = "s3-leitlinie.html"
DEFAULT_SUBJECT = "S3-Leitlinie bestätigt: In-office-Schnelltests sind gleichwertig zum Labor"

# Spalten-Mapping (Excel-Spaltenname → Template-Platzhalter)
COLUMN_MAPPING = {
    "email": "EMAIL",
    "anrede": "ANREDE",
    "nachname": "NACHNAME",
    "vorname": "VORNAME",
    "firma": "FIRMA",
}

SCRIPT_DIR = Path(__file__).parent


# ── Helpers ───────────────────────────────────────────────────────────

def load_template(template_path: Path) -> str:
    with open(template_path, "r", encoding="utf-8") as f:
        return f.read()


def load_recipients(excel_path: Path):
    import pandas as pd
    df = pd.read_excel(excel_path)
    df.columns = df.columns.str.lower().str.strip()
    return df


def personalize(template: str, recipient: dict) -> str:
    import pandas as pd
    html = template

    anrede = recipient.get("anrede", "")
    if pd.isna(anrede):
        anrede = ""
    anrede = str(anrede).strip().lower()

    if anrede in ("frau", "fr.", "fr"):
        html = html.replace("{{ANREDE}}", " Frau")
    elif anrede in ("herr", "hr.", "hr"):
        html = html.replace("{{ANREDE}}", "r Herr")
    else:
        html = html.replace("{{ANREDE}}", " Damen und Herren")

    for col, placeholder in COLUMN_MAPPING.items():
        if placeholder == "ANREDE":
            continue
        value = recipient.get(col, "")
        if pd.isna(value):
            value = ""
        html = html.replace(f"{{{{{placeholder}}}}}", str(value))

    return html


def make_attachment(file_path: Path) -> Attachment:
    data = file_path.read_bytes()
    encoded = base64.b64encode(data).decode()

    mime_map = {
        ".pdf": "application/pdf",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
    }

    att = Attachment()
    att.file_content = FileContent(encoded)
    att.file_name = FileName(file_path.name)
    att.file_type = FileType(mime_map.get(file_path.suffix.lower(), "application/octet-stream"))
    att.disposition = Disposition("attachment")
    return att


def send_one(to_email: str, subject: str, html: str,
             attachment_path: Path = None, dry_run: bool = False) -> bool:
    if dry_run:
        print(f"  [DRY-RUN] → {to_email}")
        return True

    msg = Mail(
        from_email=(FROM_EMAIL, FROM_NAME),
        to_emails=to_email,
        subject=subject,
        html_content=html,
    )

    if attachment_path and attachment_path.exists():
        msg.attachment = make_attachment(attachment_path)

    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        resp = sg.send(msg)
        if resp.status_code in (200, 201, 202):
            return True
        print(f"  Unerwarteter Status {resp.status_code} für {to_email}")
        return False
    except Exception as e:
        print(f"  Fehler: {to_email} → {e}")
        return False


# ── Main ──────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="PolarisDX Email Sender (SendGrid)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Beispiele:\n"
               "  python send.py --to test@example.com --dry-run\n"
               "  python send.py --excel kontakte.xlsx --limit 10\n"
               "  python send.py --template dental-outreach.html --to test@example.com\n",
    )
    parser.add_argument("--template", default=DEFAULT_TEMPLATE,
                        help=f"HTML-Template (Default: {DEFAULT_TEMPLATE})")
    parser.add_argument("--subject", default=DEFAULT_SUBJECT,
                        help="Email-Betreff")
    parser.add_argument("--to", type=str,
                        help="Einzelne Email-Adresse (statt Excel)")
    parser.add_argument("--name", type=str,
                        help="Name bei --to, z.B. 'Herr Müller'")
    parser.add_argument("--excel", type=str,
                        help="Pfad zur Excel-Datei mit Empfängern")
    parser.add_argument("--attachment", type=str,
                        help="Datei als Anhang (PDF, PNG, …)")
    parser.add_argument("--limit", type=int,
                        help="Max. Anzahl Emails")
    parser.add_argument("--delay", type=float, default=0.3,
                        help="Pause zwischen Emails in Sekunden (Default: 0.3)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Testlauf ohne echten Versand")
    args = parser.parse_args()

    # API Key prüfen
    if not SENDGRID_API_KEY and not args.dry_run:
        print("FEHLER: SENDGRID_API_KEY nicht gesetzt!")
        print("Erstelle eine .env Datei (siehe .env.example) oder setze die Umgebungsvariable.")
        sys.exit(1)

    # Template laden
    template_path = SCRIPT_DIR / args.template
    if not template_path.exists():
        print(f"FEHLER: Template nicht gefunden: {template_path}")
        sys.exit(1)

    template = load_template(template_path)
    print(f"Template: {template_path.name}")
    print(f"Betreff:  {args.subject}")

    # Attachment
    attachment_path = Path(args.attachment) if args.attachment else None
    if attachment_path and not attachment_path.is_absolute():
        attachment_path = SCRIPT_DIR / attachment_path
    if attachment_path and not attachment_path.exists():
        print(f"FEHLER: Anhang nicht gefunden: {attachment_path}")
        sys.exit(1)

    # Empfänger
    if args.to:
        import pandas as pd
        parts = (args.name or "").split(" ", 1)
        recipients = pd.DataFrame([{
            "email": args.to,
            "anrede": parts[0] if parts[0] else "",
            "nachname": parts[1] if len(parts) > 1 else "",
            "vorname": "",
            "firma": "",
        }])
        print(f"Empfänger: {args.to}")
    elif args.excel:
        excel_path = Path(args.excel)
        if not excel_path.is_absolute():
            excel_path = SCRIPT_DIR / excel_path
        if not excel_path.exists():
            print(f"FEHLER: Excel-Datei nicht gefunden: {excel_path}")
            sys.exit(1)
        recipients = load_recipients(excel_path)
        print(f"Empfänger: {len(recipients)} aus {excel_path.name}")
    else:
        print("FEHLER: --to oder --excel muss angegeben werden.")
        parser.print_help()
        sys.exit(1)

    if args.limit:
        recipients = recipients.head(args.limit)
        print(f"Limit:    {args.limit}")

    if args.dry_run:
        print("\n══ DRY-RUN (keine Emails werden gesendet) ══\n")

    # Versand
    ok, fail = 0, 0

    for idx, row in recipients.iterrows():
        import pandas as pd
        email = row.get("email", "")
        if pd.isna(email) or not str(email).strip():
            print(f"  [{idx+1}] Überspringe – keine Email")
            continue

        email = str(email).strip()
        print(f"  [{idx+1}/{len(recipients)}] {email}")

        html = personalize(template, row.to_dict())
        success = send_one(email, args.subject, html, attachment_path, args.dry_run)

        if success:
            ok += 1
        else:
            fail += 1

        if not args.dry_run and idx < len(recipients) - 1:
            time.sleep(args.delay)

    # Summary
    print(f"\n{'═' * 48}")
    print(f"Fertig: {ok} gesendet, {fail} Fehler")
    if args.dry_run:
        print("→ Ohne --dry-run ausführen für echten Versand.")


if __name__ == "__main__":
    main()
