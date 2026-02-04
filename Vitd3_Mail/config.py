"""
Konfiguration für den Email-Versand
"""
import os
from dotenv import load_dotenv

load_dotenv()

# SendGrid Konfiguration
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL", "hello@polarisdx.net")
FROM_NAME = os.getenv("FROM_NAME", "PolarisDX")

# Email Konfiguration
EMAIL_SUBJECT = "NEU: Vitamin D3+K2 Spray - Optimale Patientenvorbereitung"
HTML_TEMPLATE = "vitamin-d3-k2-spray.html"
EXCEL_FILE = "kontakte.xlsx"

# Spalten-Mapping (Excel-Spaltenname -> Template-Platzhalter)
# Passe diese an deine Excel-Struktur an
COLUMN_MAPPING = {
    "email": "EMAIL",           # Pflichtfeld
    "anrede": "ANREDE",         # z.B. "Frau" oder "Herr"
    "nachname": "NACHNAME",     # Nachname
    "vorname": "VORNAME",       # Vorname (optional)
    "firma": "FIRMA",           # Praxisname (optional)
}
