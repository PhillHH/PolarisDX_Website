# UI Komponenten

Dieses Verzeichnis enthält die kleinsten, wiederverwendbaren Bausteine (**Atoms** & **Molecules**) der Benutzeroberfläche.

## Prinzipien

-   **Generisch:** Diese Komponenten sollten keine spezifische Geschäftslogik enthalten.
-   **Props-gesteuert:** Aussehen und Verhalten werden ausschließlich über Props bestimmt.
-   **Styling:** Nutzt Tailwind CSS Utility-Klassen.

## Komponenten-Übersicht

-   **`PrimaryButton.tsx`**: Standard-Button in verschiedenen Varianten (Primary, Secondary, Outline).
-   **`SectionHeader.tsx`**: Einheitliche Überschrift für Sektionen (mit Caption/Kicker).
-   **`LanguageSwitcher.tsx`**: Dropdown zum Wechseln der Sprache (Flaggen + Text).
-   **`ProductCard.tsx`**: Karte zur Darstellung eines Produkts (Bild, Preis, Badge).
-   **`ServiceCard.tsx`**: Karte für Dienstleistungen.
-   **`BlogCard.tsx`**: Karte für Blog-Artikel.
-   **`StatItem.tsx`**: Darstellung einer Statistik (große Zahl + Label).

## Verwendung

```tsx
import PrimaryButton from '../ui/PrimaryButton'

<PrimaryButton variant="primary" onClick={() => console.log('Click')}>
  Klick mich
</PrimaryButton>
```
