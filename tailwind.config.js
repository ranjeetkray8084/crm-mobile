/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4785FF',
        secondary: '#666666',
        textDark: '#333333',
        textLight: '#666666',
        border: '#e0e0e0',
        background: '#ffffff'
      }
    },
  },
  plugins: [],
}
