## `src/components/layout/` – Layout-Komponenten

Dieses Verzeichnis enthält die **Rahmenkomponenten**, die die Struktur jeder Seite definieren:

---

### `Layout.tsx`

- Oberste Shell für alle Seiten.
- Aufbau:
  - Hintergrundfarbe und Grundtypografie (`min-h-screen`, `bg-slate-50`, `text-gray-900`).
  - Rendert:
    - `Header` (oben, fest positioniert),
    - die jeweiligen Kindkomponenten (Routeninhalt),
    - `Footer` (unten).
- Wird in `App.tsx` um alle `Routes` gelegt, sodass jede Route immer innerhalb dieses Layouts gerendert wird.

---

### `Header.tsx`

- Fixierter Kopfbereich (`fixed top-0`, `z-30`), der auf allen Seiten sichtbar ist.
- Elemente:
  - **Logo** (PolarisDX / IglooPro) links.
  - **Navigation**:
    - Desktop: Links zu Sektionen der Startseite (`#hero`, `#about`, `#services`, `#blog`) und Route `/shop`.
    - Mobile: Burger‑Menü, das beim Öffnen die gleichen Links als Liste anzeigt.
  - **CTA‑Button** „Contact Us“ → Route `/contact`.
- Verhalten:
  - `useEffect` überwacht `window.scrollY`.
  - Bei Scrollen wird ein transparenter Hintergrund + Schatten aktiviert, um Lesbarkeit zu erhöhen (`backdrop-blur`, `shadow` etc.).

---

### `Footer.tsx`

- Footer, der unterhalb des Seiteninhalts angezeigt wird.
- Struktur:
  - Linke Spalte:
    - Logo (PolarisDX),
    - Kurzbeschreibung (Claim / Value Prop),
    - Copyright.
  - Rechte Spalten:
    - „Links“ – interne Ankerlinks der Startseite (Home, About, Service, Blog).
    - „Explore“ – zusätzliche Navigationspunkte (Our Doctors, Testimonials, FAQ, Make Appointment).
    - „Contact“ – E‑Mail, Telefon und Social‑Icons.
- Social‑Icons:
  - Daten aus `src/data/social.tsx` (`socialLinks`).
  - Darstellung als runde Buttons mit Text‑Icon (z. B. `in`, `tw`).

---

### Rolle im Gesamtsystem

- Die Layout‑Komponenten sorgen dafür, dass:
  - Navigation und Branding auf **allen Seiten konsistent** sind.
  - Routen nur für den **Seiteninhalt** verantwortlich sind, nicht für Kopf- oder Fußbereich.
- Änderungen am globalen Erscheinungsbild (z. B. Navigationspunkte, Branding, Footer‑Verweise) werden **zentral hier** durchgeführt und wirken sofort auf die gesamte App.


