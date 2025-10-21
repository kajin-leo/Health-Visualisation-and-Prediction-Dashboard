// tailwind.config.js
const {heroui} = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'outfit':['Outfit']
      }
    },
  },
  plugins: [heroui(
    {
      themes:{
        light:{
          colors: {
            chartText: '#737373ff',
            chartLine: '#c4c4c413'
          }
        }, 
        dark:{
          colors:{
            primary: {
              DEFAULT: '#8331d5'
            },
            
            chartText: '#e9e9e9ff',
            chartLine: '#8a8a8a27'
          }
        }
      }
    }
  )],
};