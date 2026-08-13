/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Driven by CSS variables set in ThemeProvider so the six
        // Color Mode swatches (Amber/Blue/Pink/Rose/Emerald/Black)
        // can restyle the app without a full re-theme.
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          fg: 'rgb(var(--accent-fg) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          muted: 'rgb(var(--surface-muted) / <alpha-value>)',
        },
      },
      borderRadius: {
        card: '0.75rem',
      },
    },
  },
  plugins: [],
};
