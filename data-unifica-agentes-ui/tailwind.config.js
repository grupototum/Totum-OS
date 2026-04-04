/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tot: {
          bg: '#EAEAE5',
          card: '#F5F5F0',
          border: '#D4D4CF',
          text: '#2C2C2A',
          muted: '#6B6B66',
          primary: '#4A4A45',
          success: '#5A8F5A',
          warning: '#C4A35A',
          danger: '#B85C5C',
          info: '#5A7A9C',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
