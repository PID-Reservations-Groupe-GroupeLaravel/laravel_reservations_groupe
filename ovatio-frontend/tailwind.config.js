/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ovatio: {
          blue:  '#1e3a5f',
          light: '#1d4ed8',
          dark:  '#0f1f35',
        }
      }
    }
  },
  plugins: [],
}
