/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Legacy aliases
        ovatio: {
          blue:  '#000666',
          light: '#1a237e',
          dark:  '#000444',
        },
        // Design system — "The Curated Stage"
        primary:                   '#000666',
        'primary-container':       '#1a237e',
        'on-primary':              '#ffffff',
        'on-primary-container':    '#8690ee',
        'secondary-container':     '#fdd400',
        'on-secondary-container':  '#6f5c00',
        background:                '#f7f9fc',
        surface:                   '#f7f9fc',
        'surface-container-lowest':'#ffffff',
        'surface-container-low':   '#f2f4f7',
        'surface-container':       '#eceef1',
        'surface-container-high':  '#e6e8eb',
        'surface-container-highest':'#e0e3e6',
        'on-surface':              '#191c1e',
        'on-surface-variant':      '#454652',
        'on-background':           '#191c1e',
        outline:                   '#767683',
        'outline-variant':         '#c6c5d4',
        'surface-tint':            '#4c56af',
        error:                     '#ba1a1a',
        'error-container':         '#ffdad6',
        'on-error-container':      '#93000a',
        'inverse-surface':         '#2d3133',
      },
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:     ['Manrope', 'sans-serif'],
        label:    ['Manrope', 'sans-serif'],
        sans:     ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
