/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // -------------------------------------------------------------------
          // LEGACY (kept as aliases — migration of call-sites is Wave 2 / 2-v).
          // brand.deep / brand.primary / brand.secondary remain on identical
          // hex values, no visual change.
          // -------------------------------------------------------------------
          primary: '#0f5f95',
          deep: '#083358', // Deeper, more elegant blue for accents
          secondary: '#2199ea',
          // -------------------------------------------------------------------
          // NEW (Wave 2 / Fix 2-ii, additive layer — see
          // _project-knowledge/wave-2-analyse/farb-tokens.md).
          // navy        = canonical dark-blue (== brand.deep);
          // navy-hover  = CTA hover state (today hard-coded #0a4170 in
          //               shell.tsx + OrderForm.tsx, now token-backed);
          // navy-mid    = mid-tone navy used for theme-color + OG image;
          // blue        = current brand.primary, semantically clearer name;
          // blue-bright = current brand.secondary, semantically clearer name.
          // -------------------------------------------------------------------
          navy: '#083358',
          'navy-hover': '#0a4170',
          'navy-mid': '#1e3a5f',
          blue: '#0f5f95',
          'blue-bright': '#2199ea',
        },
        social: {
          linkedin: '#0077b5',
        },
        ui: {
          border: '#e2e8f0', // slate-200
          'border-hover': '#cbd5e1', // slate-300
          'text-muted': '#94a3b8', // slate-400
        },
        // Semantic group for headline text colour. Replaces the misleadingly
        // named "gray-900" (which is actually navy #203864, not gray). Both
        // remain valid — `text-text-heading` (new) and `text-gray-900` (legacy)
        // resolve to the same hex.
        text: {
          heading: '#203864',
        },
        // Accent scale — same tones as the marketing brief presentation.
        // Canonical: accent = teal-600 (#0d9488). Use `bg-accent`, `text-accent`
        // for the DEFAULT; `bg-accent-strong`, `bg-accent-line`, `bg-accent-soft`,
        // `bg-accent-border`, `bg-accent-on-dark` for the specific shades.
        accent: {
          DEFAULT: '#0d9488', // teal-600
          strong: '#0f766e', // teal-700 — eyebrow text, hover emphasis
          line: '#14b8a6', // teal-500 — underline accents, decorative lines
          soft: '#f0fdfa', // teal-50  — pill backgrounds, soft tints
          border: '#99f6e4', // teal-200 — pill borders
          'on-dark': '#5eead4', // teal-300 — hover on the dark navy header
        },
        // Success / health semantic group — kept SEPARATE from accent because
        // emerald tones in S3-Leitlinie and Vitamin D3-Implantologie carry a
        // success / health meaning, not the brand-accent meaning.
        success: {
          DEFAULT: '#10b981', // emerald-500
          soft: '#ecfdf5', // emerald-50
          strong: '#059669', // emerald-600
        },
        // -------------------------------------------------------------------
        // LEGACY flat colours (kept as aliases — see Wave 2 / 2-v migration).
        // gray-900 has the same hex as text.heading above.
        // -------------------------------------------------------------------
        'gray-100': '#F5F5F5',
        'gray-500': '#868C98',
        'gray-900': '#203864',
      },
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
        page: '1440px',
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
        'hero-sm': '40px',
        'hero-md': '48px',
        'hero-lg': '58px',
      },
      boxShadow: {
        card: '0 24px 60px rgba(8, 51, 88, 0.12)', // Tinted with brand-deep (hardcoded here because tokens in string might not work directly without interpolation, but this is JS)
        'glow-secondary': '0 0 15px rgba(33, 153, 234, 0.5)', // Softer glow
        glass: '0 8px 32px 0 rgba(8, 51, 88, 0.15)', // Glassmorphism shadow
      },
      borderRadius: {
        section: '24px',
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
      },
      animation: {
        'fade-in-scale': 'fade-in-scale 0.8s ease-out forwards',
        'slide-in-up': 'slide-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-out-up': 'slide-out-up 0.4s ease-in forwards',
        'slide-in-right': 'slide-in-right 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-out-left': 'slide-out-left 0.4s ease-in forwards',
        'icon-in': 'icon-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'icon-out': 'icon-out 0.4s ease-in forwards',
      },
    },
  },
  plugins: [],
}
