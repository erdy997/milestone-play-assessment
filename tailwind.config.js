/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#172B5A', 700: '#213A72', 600: '#2E4C8E', 50: '#EBF0F9' },
        aqua: { DEFAULT: '#9FDDE6', soft: '#DDF3F6' },
        mist: '#F4F6FA',
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'system-ui', 'sans-serif'],
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem' },
      boxShadow: { card: '0 1px 2px rgba(18,61,53,.06), 0 8px 24px rgba(18,61,53,.06)' },
    },
  },
  plugins: [],
};
