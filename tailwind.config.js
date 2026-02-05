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
