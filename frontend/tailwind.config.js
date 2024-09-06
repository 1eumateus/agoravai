/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  theme: {
    extend: {},
  },
  theme: {
    extend: {
      colors: {
        'primary-opaque': '#1e8449',
        'primary': "#ffffff",
        'secundary': "#66b032",
        'primary-transparent': "rgba(34, 197, 94, 0.1)",
      },
    },
  },
  plugins: [],
}

