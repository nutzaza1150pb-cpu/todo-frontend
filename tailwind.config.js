/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans Thai"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fdf2f5',
          100: '#fbe4ea',
          200: '#f6c7d4',
          500: '#c43a63',
          600: '#9b2147',
          700: '#7f1a3a',
        },
      },
    },
  },
  plugins: [],
}
