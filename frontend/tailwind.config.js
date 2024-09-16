/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  theme: {
    extend: {},
  },
  theme: {
    extend: {
      colors: {
        'principal': "#3d4a7b",
        'principal-opaco': '#2f3a60',
        'secundaria': "#e9e9e9",
        'secundaria-opaco': '#c8d5ec',
        'terciaria': "#d99c44",
      },
    },
  },
  plugins: [],
}

