/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: "2.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'light-sky-blue': '#86CEFA',
        'aero': '#73B9EE',
        'united-nations-blue': '#5494DA',
        'celtic-blue': '#3373C4',
        'sapphire': '#1750AC',
        'dark-powder-blue': '#003396',
      },
      backgroundSize: {
        'size-200': '200% 200%',
    },
    backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-100': '100% 100%',
    },
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
};


