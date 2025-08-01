/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bleu-nuit': '#0F1E4C',
        'saumon': '#FF9D8A',
        'orange': '#FF6B35',
      },
    },
  },
  plugins: [],
} 