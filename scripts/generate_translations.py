import json
import os
import copy

# Liste der Zielsprachen, für die Übersetzungsdateien generiert/aktualisiert werden sollen
langs = ['pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs']

# Quell-Datei (Englisch), die als Referenz für die Struktur dient
# Hinweis: Pfad muss ggf. an die neue Struktur (public/locales) angepasst werden
src_file = 'public/locales/en/common.json'

def deep_update(target, updates):
    """
    Rekursive Funktion, um das 'target'-Dictionary mit Werten aus 'updates' zu überschreiben.
    Behält bestehende Werte bei, überschreibt sie aber, wenn im Update neue Werte vorhanden sind.
    """
    for key, value in updates.items():
        if isinstance(value, dict):
            target_node = target.setdefault(key, {})
            deep_update(target_node, value)
        else:
            target[key] = value

def process_translations():
    # Prüfen, ob die Quelldatei existiert
    if not os.path.exists(src_file):
        print(f"Fehler: Quelldatei {src_file} nicht gefunden.")
        return

    # Laden der englischen Referenzdaten
    with open(src_file, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    for lang in langs:
        # Ziel-Pfad für die jeweilige Sprache
        target_file = f'public/locales/{lang}/common.json'

        # Laden existierender Übersetzungen, falls vorhanden
        existing_data = {}
        if os.path.exists(target_file):
            try:
                with open(target_file, 'r', encoding='utf-8') as f:
                    existing_data = json.load(f)
            except Exception as e:
                print(f"Fehler beim Lesen von {target_file}: {e}. Beginne neu.")
                existing_data = {}

        # Strategie:
        # 1. Wir starten mit einer Kopie der englischen Daten (Struktur + Fallback-Werte).
        # 2. Wir überschreiben diese mit den bereits existierenden Übersetzungen der Zielsprache.
        # Ergebnis: Alle Keys aus EN sind vorhanden, bereits übersetzte Werte bleiben erhalten.

        final_data = copy.deepcopy(en_data)
        deep_update(final_data, existing_data)

        # Sicherstellen, dass das Verzeichnis existiert
        os.makedirs(os.path.dirname(target_file), exist_ok=True)

        # Schreiben der zusammengeführten Datei
        with open(target_file, 'w', encoding='utf-8') as f:
            json.dump(final_data, f, indent=2, ensure_ascii=False)

        print(f"Verarbeitet: {lang}")

if __name__ == "__main__":
    process_translations()
