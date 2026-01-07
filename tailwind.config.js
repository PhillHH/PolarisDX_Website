/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0f5f95',
          deep: '#083358', // Deeper, more elegant blue for accents
          secondary: '#2199ea',
        },
        social: {
          linkedin: '#0077b5',
        },
        ui: {
          border: '#e2e8f0', // slate-200
          'border-hover': '#cbd5e1', // slate-300
          'text-muted': '#94a3b8', // slate-400
        },
        'gray-100': '#F5F5F5',
        'gray-500': '#868C98',
        'gray-900': '#203864',
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
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
        'glass': '0 8px 32px 0 rgba(8, 51, 88, 0.15)', // Glassmorphism shadow
      },
      borderRadius: {
        section: '24px',
      },
    },
  },
  plugins: [],
}
