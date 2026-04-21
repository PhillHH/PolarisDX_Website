## Empfehlung

PrimaryButton wird gelöscht; alle 17 Usages migrieren zu `Button`. Button hat die bessere Architektur (CVA, forwardRef, `to`/`href`-Props) und braucht nur das polymorphe `as`-Prop nachgerüstet.

## Variants nach Konsolidierung

1. `primary` — Gradient-Border (bleibt)
2. `secondary` — bg-brand-deep dunkel (bleibt, ersetzt auch `brand-secondary`)
3. `outline` — transparenter Rand auf dunklem Hintergrund (bleibt, ersetzt auch `outline-light`)

## Zu löschende Variants

- `brand-secondary` (identisch mit `secondary`)
- `outline-light` (identisch mit `outline`)
- `ghost` (0 Verwendungen)
- `link` (0 Verwendungen)

## Migration-Aufwand

- Anzahl Dateien: 13 (9 PrimaryButton-Imports + 4 bestehende Button-Imports anpassen)
- Geschätzter Aufwand: 2–3h (mechanische Import-Umstellung + `as`-Prop zu Button hinzufügen + Smoke-Test)

## Form-Doppelung in einem Satz

ContactForm und SupportForm teilen nur das Submit/Consent-Pattern; die Felder sind komplett verschieden (Kontakt vs. Geräte-Support), und das VitaminD3-Inline-Form nutzt raw-HTML ohne UI-Atome — eine Konsolidierung lohnt sich nicht, aber das Inline-Form sollte auf Input/Textarea/Button-Atome umgestellt werden.
