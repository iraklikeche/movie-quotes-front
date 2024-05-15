/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-gray': '#CED4DA',
        'custom-light-gray': '#6c757d',
        'custom-red': '#E31221',
        'border-gray': '#EFEFEF'
      }
    }
  },
  plugins: []
}
