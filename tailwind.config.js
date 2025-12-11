/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:    '#0f5f95',
        'primary-deep': '#083358', // Deeper, more elegant blue for accents
        secondary:  '#2199ea',
        accentBlue: '#2199ea',
        'gray-100': '#F5F5F5',
        'gray-500': '#868C98',
        'gray-900': '#203864',
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
      boxShadow: {
        card: '0 24px 60px rgba(8, 51, 88, 0.12)', // Tinted with primary-deep
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


