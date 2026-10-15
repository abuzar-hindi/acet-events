/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          300: '#ffb870',
          400: '#ff9232',
          500: '#ff6f00',
          600: '#e55a00',
        },
        marigold: {
          300: '#ffd54f',
          400: '#ffca28',
          500: '#ffb300',
        },
        rani: {
          300: '#f06292',
          400: '#ec407a',
          500: '#e91e63',
          600: '#c2185b',
        },
        royalpurple: {
          100: '#ede7f6',
          200: '#d1c4e9',
          300: '#b39ddb',
          400: '#9575cd',
          500: '#7e57c2',
          600: '#5e35b1',
          700: '#4527a0',
          800: '#311b92',
          900: '#1a0050',
        },
        gold: {
          300: '#f5d87e',
          400: '#f0c040',
          500: '#d4a017',
          600: '#b8860b',
        },
        ivory: {
          100: '#fefef0',
          200: '#fdf8e1',
          300: '#f9f0c8',
        },
      },
      fontFamily: {
        devanagari: ['"Yatra One"', '"Tiro Devanagari Hindi"', '"Noto Sans Devanagari"', 'serif'],
        display:    ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        mukta:      ['"Mukta"', '"Noto Sans Devanagari"', 'sans-serif'],
        body:       ['"Mukta"', '"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
