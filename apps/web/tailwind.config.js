/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e1ff',
          300: '#b3c7ff',
          400: '#8aa3ff',
          500: '#667eea',
          600: '#5568d3',
          700: '#4553bc',
          800: '#3644a5',
          900: '#2a3788',
        },
        secondary: {
          500: '#764ba2',
          600: '#663d8f',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
