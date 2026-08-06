/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        darkBg: '#0b0f17',
        cardBg: '#131b2e',
        accentBlue: '#3b82f6',
      },
    },
  },
  plugins: [],
};
