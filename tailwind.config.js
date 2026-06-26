/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // -------------------------------------------------------------------
        // Alle Custom-Farben referenzieren jetzt die Kanal-Tripel aus
        // design-system/tokens/tokens.css (Single Source, §3.0 A / §3.4 / §1.8).
        // Format rgb(var(--*-rgb) / <alpha-value>) erhaelt Tailwind-Opacity-
        // Modifier (z. B. bg-brand-navy/85) byte-identisch — kein visueller
        // Change (§1.6), aber keine doppelte Rohwert-Pflege mehr im Config.
        // -------------------------------------------------------------------
        // accentBlue: Alias fuer brand.blue (war #0d527f).
        accentBlue: 'rgb(var(--brand-blue-rgb) / <alpha-value>)',
        brand: {
          // LEGACY-Aliase (Call-Site-Migration = spaeter); Werte unveraendert.
          primary: 'rgb(var(--brand-blue-rgb) / <alpha-value>)',
          deep: 'rgb(var(--brand-navy-rgb) / <alpha-value>)',
          secondary: 'rgb(var(--brand-blue-bright-rgb) / <alpha-value>)',
          // Wave-2-Namen (kanonisch): navy == deep, blue == primary, blue-bright == secondary.
          navy: 'rgb(var(--brand-navy-rgb) / <alpha-value>)',
          'navy-hover': 'rgb(var(--brand-navy-hover-rgb) / <alpha-value>)',
          'navy-mid': 'rgb(var(--brand-navy-mid-rgb) / <alpha-value>)',
          blue: 'rgb(var(--brand-blue-rgb) / <alpha-value>)',
          'blue-bright': 'rgb(var(--brand-blue-bright-rgb) / <alpha-value>)',
          // Headline-Navy (#203864) — zugleich dunkelstes Glied der Hero-/Section-
          // Gradients (war `to-gray-900`-Legacy-Alias). Rollen-Utility statt Roh-Palette.
          heading: 'rgb(var(--brand-heading-rgb) / <alpha-value>)',
        },
        social: {
          linkedin: 'rgb(var(--social-linkedin-rgb) / <alpha-value>)',
        },
        ui: {
          border: 'rgb(var(--neutral-200-rgb) / <alpha-value>)', // slate-200
          'border-hover': 'rgb(var(--neutral-300-rgb) / <alpha-value>)', // slate-300
          'text-muted': 'rgb(var(--neutral-400-rgb) / <alpha-value>)', // slate-400
        },
        // Headline-Text-Gruppe (Navy #083358). `text-text-heading` (neu) und
        // `text-gray-900` (legacy) loesen weiterhin auf identische Toene auf.
        text: {
          heading: 'rgb(var(--brand-navy-rgb) / <alpha-value>)',
        },
        // Accent-Skala (Wave-2: accent = teal-600). DEFAULT via `bg-accent`/`text-accent`.
        accent: {
          DEFAULT: 'rgb(var(--teal-600-rgb) / <alpha-value>)', // teal-600
          strong: 'rgb(var(--teal-700-rgb) / <alpha-value>)', // teal-700
          deep: 'rgb(var(--teal-800-rgb) / <alpha-value>)', // teal-800
          fg: 'rgb(var(--teal-900-rgb) / <alpha-value>)', // teal-900 — dunkelster Akzent-Text
          line: 'rgb(var(--teal-500-rgb) / <alpha-value>)', // teal-500
          bright: 'rgb(var(--teal-400-rgb) / <alpha-value>)', // teal-400 — Deko auf Navy
          soft: 'rgb(var(--teal-50-rgb) / <alpha-value>)', // teal-50
          tint: 'rgb(var(--teal-100-rgb) / <alpha-value>)', // teal-100 — gefuellte Badges
          border: 'rgb(var(--teal-200-rgb) / <alpha-value>)', // teal-200
          'on-dark': 'rgb(var(--teal-300-rgb) / <alpha-value>)', // teal-300
        },
        // Success / health (getrennt von accent — emerald = Gesundheits-Bedeutung).
        success: {
          DEFAULT: 'rgb(var(--green-500-rgb) / <alpha-value>)', // emerald-500
          soft: 'rgb(var(--green-50-rgb) / <alpha-value>)', // emerald-50
          strong: 'rgb(var(--green-600-rgb) / <alpha-value>)', // emerald-600
        },
        // LEGACY flache Farben (Call-Site-Migration ausstehend).
        'gray-100': 'rgb(var(--gray-100-rgb) / <alpha-value>)',
        'gray-500': 'rgb(var(--gray-500-rgb) / <alpha-value>)',
        'gray-900': 'rgb(var(--brand-heading-rgb) / <alpha-value>)', // #203864

        // -------------------------------------------------------------------
        // SEMANTIC TOKENS (Phase 1, additiv) — referenzieren die Semantic-Kanaele
        // aus tokens.css. Jetzt opacity-faehig (z. B. bg-surface/80), theming-aware.
        // Neue, kollisionsfreie Keys; ab Phase 2 konsumieren migrierte Komponenten diese.
        // -------------------------------------------------------------------
        bg: 'rgb(var(--color-bg-rgb) / <alpha-value>)',
        'bg-subtle': 'rgb(var(--color-bg-subtle-rgb) / <alpha-value>)',
        surface: 'rgb(var(--color-surface-rgb) / <alpha-value>)',
        // Semantic-Border als Farb-Keys (additiv): erlaubt border-border / bg-border /
        // text-border / ring-border in den NEWLOOK-Sektionen. Bindet die bereits
        // existierenden --color-border-* Kanaele (Single Source, §3.0 A).
        border: 'rgb(var(--color-border-rgb) / <alpha-value>)',
        'border-strong': 'rgb(var(--color-border-strong-rgb) / <alpha-value>)',
        fg: 'rgb(var(--color-fg-rgb) / <alpha-value>)',
        'fg-heading': 'rgb(var(--color-fg-heading-rgb) / <alpha-value>)',
        'fg-muted': 'rgb(var(--color-fg-muted-rgb) / <alpha-value>)',
        'fg-on-dark': 'rgb(var(--color-fg-on-dark-rgb) / <alpha-value>)',
        primary: 'rgb(var(--color-action-primary-rgb) / <alpha-value>)',
        'primary-hover': 'rgb(var(--color-action-primary-hover-rgb) / <alpha-value>)',
        danger: 'rgb(var(--color-danger-rgb) / <alpha-value>)',
        warning: 'rgb(var(--color-warning-rgb) / <alpha-value>)',
        // Rating/Award-Gold (Bewertungs-Sterne + Quality-Badges) — eigene Rolle.
        rating: {
          DEFAULT: 'rgb(var(--color-rating-rgb) / <alpha-value>)',
          soft: 'rgb(var(--color-rating-soft-rgb) / <alpha-value>)',
          fg: 'rgb(var(--color-rating-fg-rgb) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
        page: '1440px',
        // Token-referenziert (additiv, §3.3) — neue Keys, keine Kollision.
        reading: 'var(--reading-width)',
        layout: 'var(--grid-max)',
      },
      minHeight: {
        hero: '300px',
        'hero-lg': '420px',
      },
      height: {
        'hero-lg': '420px',
      },
      fontSize: {
        xxs: '10px',
        // Fluid Display-Titel (Hero/Section-Headline) — Token-referenziert (§3.3).
        // lineHeight aus dem Token-Paar, damit text-display kein separates leading braucht.
        display: ['var(--text-display)', { lineHeight: 'var(--line-height-display)' }],
        'display-sm': ['var(--text-display-sm)', { lineHeight: 'var(--line-height-display-sm)' }],
        // 404-Numeral One-off (fluid 160→192) — Leading via leading-none am Element.
        'display-xl': 'var(--text-display-xl)',
      },
      lineHeight: {
        // Fliesstext-Leading aus dem DS-Token (§3.7) — ersetzt arbitrary leading-[1.75]
        // in den Artikel-Prose-Bloecken. Override fuer das fontSize-Default-Leading.
        body: 'var(--line-height-body)',
      },
      letterSpacing: {
        headline: 'var(--letter-spacing-tight)', // Display-Titel-Tracking (war tracking-[-0.02em])
        overline: 'var(--letter-spacing-overline)', // Uppercase-Kicker-Tracking (war tracking-[0.16em])
      },
      boxShadow: {
        card: '0 24px 60px rgb(var(--brand-navy-rgb) / 0.12)', // Navy-Tint via Single-Source-Kanal
        'glow-secondary': '0 0 15px rgba(33, 153, 234, 0.5)', // Softer glow (kein Token — one-off, §1.20)
        glass: '0 8px 32px 0 rgb(var(--brand-navy-rgb) / 0.15)', // Glassmorphism, Navy-Tint via Kanal
        // Token-referenziert (additiv, §3.3) — neue numerische Elevation-Keys.
        1: 'var(--shadow-1)',
        2: 'var(--shadow-2)',
        3: 'var(--shadow-3)',
        inset: 'var(--shadow-inset)', // recessed Figure-Ground-Well, Navy-Tint
        // Brand-getoente Glows fuer interaktive/erhobene Marken-Akzente (CTA/Eyebrow),
        // Channel-referenziert (Single-Source) statt Roh-Tailwind-shadow-{color}.
        'glow-primary': '0 8px 24px rgb(var(--brand-blue-rgb) / 0.22)',
        'glow-primary-strong': '0 12px 32px rgb(var(--brand-blue-rgb) / 0.40)',
        'glow-deep': '0 12px 32px rgb(var(--brand-navy-rgb) / 0.30)',
      },
      // -------------------------------------------------------------------
      // SPACING-BRUECKE (additiv, §3.3): bindet die `padding-*` und `gap-*`
      // Utilities an die --space-* Tokens, damit die Preview-Varianten den
      // Weissraum (Section-Paddings/Gaps/Hero-Luft) site-weit ueber Tokens
      // verschieben koennen. Nur padding/gap (keine Negative → keine
      // calc()-Negation noetig); margin/inset bleiben auf Tailwind-Default.
      // Werte = Tailwind-Defaults → BYTE-IDENTISCH (kein visueller Change, §1.6).
      // width/height bleiben auf der Tailwind-Spacing-Skala (Soft Grid: nur
      // Abstaende skalieren, nicht die Eigengroessen der Komponenten).
      // -------------------------------------------------------------------
      padding: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        10: 'var(--space-10)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        20: 'var(--space-20)',
        24: 'var(--space-24)',
      },
      gap: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        10: 'var(--space-10)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        20: 'var(--space-20)',
        24: 'var(--space-24)',
      },
      borderRadius: {
        // Token-gebrueckt (§3.3): Default-Werte = Tailwind-Defaults (byte-identisch),
        // Themes verschieben nur die Var-Werte. `section`/`full` referenzieren die
        // bestehenden Radius-Tokens.
        DEFAULT: 'var(--radius-tw-default)',
        md: 'var(--radius-tw-md)',
        lg: 'var(--radius-tw-lg)',
        xl: 'var(--radius-tw-xl)',
        '2xl': 'var(--radius-tw-2xl)',
        '3xl': 'var(--radius-tw-3xl)',
        section: 'var(--radius-section)',
        full: 'var(--radius-full)',
      },
      keyframes: {
        'fade-in-scale': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // Hero slide animations
        'slide-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)', filter: 'blur(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        'slide-out-up': {
          '0%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)', filter: 'blur(8px)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-out-left': {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(-50px)' },
        },
        'icon-in': {
          '0%': { opacity: '0', transform: 'scale(0.8) rotate(-10deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0)' },
        },
        'icon-out': {
          '0%': { opacity: '1', transform: 'scale(1) rotate(0)' },
          '100%': { opacity: '0', transform: 'scale(0.8) rotate(10deg)' },
        },
        // Order-modal entrance — soft "materialise" with a brief teal halo.
        // Backdrop fades in + blur builds up; the card translates + scales
        // into place with a gentle decelerate curve, and a teal glow ring
        // peaks at ~40% before settling into the resting shadow.
        'modal-backdrop-in': {
          '0%': { opacity: '0', 'backdrop-filter': 'blur(0px)' },
          '100%': { opacity: '1', 'backdrop-filter': 'blur(6px)' },
        },
        'popover-in': {
          '0%': { opacity: '0', transform: 'translateY(-6px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'modal-card-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(24px) scale(0.94)',
            'box-shadow':
              '0 0 0 0 rgba(94,234,212,0), 0 0 0 0 rgba(13,148,136,0), 0 0 0 rgba(8,51,88,0)',
          },
          '45%': {
            opacity: '1',
            'box-shadow':
              '0 0 0 6px rgba(94,234,212,0.18), 0 0 60px 4px rgba(13,148,136,0.35), 0 20px 50px rgba(8,51,88,0.30)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
            'box-shadow':
              '0 0 0 0 rgba(94,234,212,0), 0 0 0 0 rgba(13,148,136,0), 0 20px 60px rgba(8,51,88,0.35)',
          },
        },
      },
      animation: {
        'fade-in-scale': 'fade-in-scale 0.8s ease-out forwards',
        'slide-in-up': 'slide-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-out-up': 'slide-out-up 0.4s ease-in forwards',
        'slide-in-right': 'slide-in-right 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-out-left': 'slide-out-left 0.4s ease-in forwards',
        'icon-in': 'icon-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'icon-out': 'icon-out 0.4s ease-in forwards',
        // Modal entrance — see keyframes above.
        'modal-backdrop-in': 'modal-backdrop-in 280ms ease-out forwards',
        'modal-card-in': 'modal-card-in 520ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'popover-in': 'popover-in 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
}
