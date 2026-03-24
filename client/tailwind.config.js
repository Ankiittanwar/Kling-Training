/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#0F1923',
          light: '#1A2D3F',
          dark: '#080F17',
        },
        gold: {
          DEFAULT: '#2CC4BD',
          light: '#4ED0CA',
          dark: '#1EA39D',
        },
      },
    },
  },
  plugins: [],
}
