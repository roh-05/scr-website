/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          charcoal: '#36454F',   // Charcoal Gray – Text
          blue:     '#00205B',   // Primary Blue  – Pantone 281
          gold:     '#B9975B',   // Secondary Gold – Pantone 457
          red:      '#E4002B',   // Accent Red    – Pantone 185
          gray:     '#F5F5F5',   // Light Gray    – Background
          white:    '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Merriweather', 'ui-serif', 'Georgia'],
      },
    },
  },
  plugins: [],
}
