/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        meadow: {
          light: '#86efac',
          DEFAULT: '#4ade80',
          dark: '#16a34a',
        },
      },
    },
  },
  plugins: [],
}
