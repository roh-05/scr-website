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
          blue:  '#002D72',   // Primary Blue  – Trust / Academic
          gold:  '#FFD100',   // Primary Gold  – Accents / Buttons
          teal:  '#00A3AD',   // Accent Teal   – Data / Modernity
          gray:  '#F2F2F2',   // Soft Gray     – Background
          white: '#FFFFFF',
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
