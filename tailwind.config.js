/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],

  theme: {
    extend: {

      fontFamily: {
        sans: ['Jost', 'sans-serif'],
        display: ['Jost', 'sans-serif']
      },
    },
  }
}

