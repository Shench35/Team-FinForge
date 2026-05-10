/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00183F',
        'primary-container': '#0f2d5e',
        secondary: '#006C4E',
        'secondary-container': '#83f5c6',
        error: '#ba1a1a',
        surface: '#f7f9fb',
        'surface-dim': '#d8dadc',
        'surface-container-low': '#f2f4f6',
        'surface-container': '#eceef0',
        'surface-container-high': '#e6e8ea',
        'surface-container-lowest': '#ffffff',
        'on-surface': '#191c1e',
        'on-surface-variant': '#44474f',
        'outline-variant': '#c4c6d0',
        outline: '#747780',
        'inverse-surface': '#2d3133',
      },
      fontFamily: {
        display: ['Hanken Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        'container-max': '1280px',
      },
      spacing: {
        'gutter': '24px',
        'margin-desktop': '64px',
        'margin-mobile': '20px',
      },
    },
  },
  plugins: [],
};


