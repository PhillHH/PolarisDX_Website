/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:    '#0f5f95',
        secondary:  '#2199ea',
        accentBlue: '#2199ea',
        'gray-100': '#F5F5F5',
        'gray-500': '#868C98',
        'gray-900': '#203864',
      },
      fontFamily: {
        sans: ['Rubik', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
      boxShadow: {
        card: '0 24px 60px rgba(17, 24, 39, 0.12)',
        'glow-secondary': '0 0 6px #2199ea',
      },
      borderRadius: {
        section: '24px',
      },
    },
  },
  plugins: [],
}


