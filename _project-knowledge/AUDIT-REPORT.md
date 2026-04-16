# Audit-Report

Der vollständige Website-Audit liegt außerhalb dieses Repos
(in der Claude-Projektknowledge des Relaunch-Projekts).

Kernergebnis: Gesamtnote 5,4/10. Top-5-kritische Themen:

1. DSGVO-Risiko durch `Vitd3_Mail/kontakte.xlsx` im Repo
2. i18n unvollständig (792 fehlende Keys, kein hreflang)
3. Zwei parallele App-Trees (App.tsx + App.lazy.tsx)
4. sitemap.xml fehlt (in robots.txt aber referenziert)
5. ChatWidget ist Mock-Echo, hardcoded Mail-Empfänger

Maßnahmenplan und Detail-Findings werden in Folge-PRs umgesetzt.
