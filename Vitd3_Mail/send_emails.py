#!/usr/bin/env python3
"""
PolarisDX Email Sender
Versendet HTML-Emails über SendGrid an Empfänger aus einer Excel-Liste
"""

import sys
import pandas as pd
from pathlib import Path
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Attachment, FileContent, FileName, FileType, Disposition
import base64

from config import (
    SENDGRID_API_KEY,
    FROM_EMAIL,
    FROM_NAME,
    EMAIL_SUBJECT,
    HTML_TEMPLATE,
    EXCEL_FILE,
    COLUMN_MAPPING,
)


def load_template(template_path: str) -> str:
    """Lädt das HTML-Template"""
    with open(template_path, "r", encoding="utf-8") as f:
        return f.read()


def load_recipients(excel_path: str) -> pd.DataFrame:
    """Lädt die Empfängerliste aus Excel"""
    df = pd.read_excel(excel_path)
    # Spaltennamen normalisieren (lowercase)
    df.columns = df.columns.str.lower().str.strip()
    return df


def personalize_template(template: str, recipient: dict) -> str:
    """Ersetzt Platzhalter im Template mit Empfängerdaten"""
    html = template

    # Anrede formatieren für "Sehr geehrte{{ANREDE}}"
    # Ergebnis: "Sehr geehrte Frau" oder "Sehr geehrter Herr"
    anrede = recipient.get("anrede", "")
    if pd.isna(anrede):
        anrede = ""
    anrede = str(anrede).strip()
    if anrede.lower() in ["frau", "fr.", "fr"]:
        formatted_anrede = " Frau"
    elif anrede.lower() in ["herr", "hr.", "hr"]:
        formatted_anrede = "r Herr"
    else:
        formatted_anrede = " Damen und Herren"  # Fallback

    html = html.replace("{{ANREDE}}", formatted_anrede)

    # Restliche Platzhalter ersetzen
    for excel_col, placeholder in COLUMN_MAPPING.items():
        if placeholder == "ANREDE":
            continue  # Schon behandelt
        value = recipient.get(excel_col, "")
        if pd.isna(value):
            value = ""
        html = html.replace(f"{{{{{placeholder}}}}}", str(value))
    return html


def create_attachment(file_path: str) -> Attachment:
    """Erstellt einen Email-Anhang"""
    with open(file_path, "rb") as f:
        data = f.read()

    encoded = base64.b64encode(data).decode()
    attachment = Attachment()
    attachment.file_content = FileContent(encoded)
    attachment.file_name = FileName(Path(file_path).name)

    # MIME-Type bestimmen
    suffix = Path(file_path).suffix.lower()
    mime_types = {
        ".pdf": "application/pdf",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
    }
    attachment.file_type = FileType(mime_types.get(suffix, "application/octet-stream"))
    attachment.disposition = Disposition("attachment")

    return attachment


def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    attachment_path: str = None,
    dry_run: bool = False,
) -> bool:
    """Sendet eine Email über SendGrid"""

    if dry_run:
        print(f"  [DRY-RUN] Würde senden an: {to_email}")
        return True

    message = Mail(
        from_email=(FROM_EMAIL, FROM_NAME),
        to_emails=to_email,
        subject=subject,
        html_content=html_content,
    )

    # Anhang hinzufügen falls vorhanden
    if attachment_path and Path(attachment_path).exists():
        message.attachment = create_attachment(attachment_path)

    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        return response.status_code in [200, 201, 202]
    except Exception as e:
        print(f"  Fehler beim Senden an {to_email}: {e}")
        return False


def main():
    """Hauptfunktion"""
    import argparse

    parser = argparse.ArgumentParser(description="PolarisDX Email Sender")
    parser.add_argument("--dry-run", action="store_true", help="Testlauf ohne echten Versand")
    parser.add_argument("--excel", type=str, default=EXCEL_FILE, help="Pfad zur Excel-Datei")
    parser.add_argument("--template", type=str, default=HTML_TEMPLATE, help="Pfad zum HTML-Template")
    parser.add_argument("--attachment", type=str, help="Pfad zum Anhang (z.B. PDF-Flyer)")
    parser.add_argument("--subject", type=str, default=EMAIL_SUBJECT, help="Email-Betreff")
    parser.add_argument("--limit", type=int, help="Maximale Anzahl Emails (für Tests)")
    parser.add_argument("--to", type=str, help="Einzelne Email-Adresse (überschreibt Excel)")
    parser.add_argument("--name", type=str, help="Name für --to (z.B. 'Herr Müller')")
    args = parser.parse_args()

    # Prüfen ob API Key vorhanden
    if not SENDGRID_API_KEY and not args.dry_run:
        print("FEHLER: SENDGRID_API_KEY nicht gesetzt!")
        print("Erstelle eine .env Datei mit deinem API Key (siehe .env.example)")
        sys.exit(1)

    # Pfade ermitteln
    script_dir = Path(__file__).parent
    excel_path = script_dir / args.excel
    template_path = script_dir / args.template
    attachment_path = script_dir / args.attachment if args.attachment else None

    # Dateien prüfen
    if not excel_path.exists():
        print(f"FEHLER: Excel-Datei nicht gefunden: {excel_path}")
        sys.exit(1)

    if not template_path.exists():
        print(f"FEHLER: Template nicht gefunden: {template_path}")
        sys.exit(1)

    # Template laden
    print(f"Lade Template: {template_path}")
    template = load_template(template_path)

    # Empfänger laden
    if args.to:
        # Einzelne Email-Adresse verwenden
        name_parts = (args.name or "").split(" ", 1)
        anrede = name_parts[0] if len(name_parts) > 0 else ""
        nachname = name_parts[1] if len(name_parts) > 1 else ""
        recipients = pd.DataFrame([{
            "email": args.to,
            "anrede": anrede,
            "nachname": nachname,
        }])
        print(f"Einzelversand an: {args.to}")
    else:
        print(f"Lade Empfänger: {excel_path}")
        recipients = load_recipients(excel_path)
        print(f"Gefunden: {len(recipients)} Empfänger")

    # Limit anwenden
    if args.limit:
        recipients = recipients.head(args.limit)
        print(f"Limitiert auf: {args.limit} Empfänger")

    if args.dry_run:
        print("\n=== DRY-RUN MODUS (keine Emails werden gesendet) ===\n")

    # Emails versenden
    success_count = 0
    error_count = 0

    for idx, row in recipients.iterrows():
        recipient = row.to_dict()
        email = recipient.get("email", "").strip()

        if not email or pd.isna(email):
            print(f"[{idx+1}] Überspringe: Keine Email-Adresse")
            continue

        print(f"[{idx+1}/{len(recipients)}] Sende an: {email}")

        # Template personalisieren
        html_content = personalize_template(template, recipient)

        # Email senden
        success = send_email(
            to_email=email,
            subject=args.subject,
            html_content=html_content,
            attachment_path=attachment_path,
            dry_run=args.dry_run,
        )

        if success:
            success_count += 1
        else:
            error_count += 1

    # Zusammenfassung
    print("\n" + "=" * 50)
    print(f"Versand abgeschlossen!")
    print(f"Erfolgreich: {success_count}")
    print(f"Fehler: {error_count}")

    if args.dry_run:
        print("\nFühre ohne --dry-run aus, um die Emails wirklich zu senden.")


if __name__ == "__main__":
    main()
