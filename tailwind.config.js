/** @type {import('tailwindcss').Config} */
export default {
  // Definiert, welche Dateien nach Tailwind-Klassen gescannt werden sollen.
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Benutzerdefinierte Farbpalette für das Corporate Design
      colors: {
        primary:    '#0f5f95', // Hauptfarbe (Dunkelblau)
        secondary:  '#2199ea', // Sekundärfarbe (Hellblau)
        accentBlue: '#2199ea', // Akzentfarbe (identisch mit Sekundär)
        'gray-100': '#F5F5F5', // Heller Hintergrundgrau
        'gray-500': '#868C98', // Mittleres Grau für Texte
        'gray-900': '#203864', // Dunkles Grau/Blau für Überschriften
      },
      // Standard-Schriftart
      fontFamily: {
        sans: ['Rubik', 'system-ui', 'sans-serif'],
      },
      // Maximale Container-Breite für das Layout
      maxWidth: {
        container: '1200px',
      },
      // Benutzerdefinierte Schatten
      boxShadow: {
        card: '0 24px 60px rgba(17, 24, 39, 0.12)', // Schatten für Karten
        'glow-secondary': '0 0 6px #2199ea',       // Leuchteffekt in Sekundärfarbe
      },
      // Globale Border-Radius-Werte
      borderRadius: {
        section: '24px',
      },
    },
  },
  plugins: [],
}
