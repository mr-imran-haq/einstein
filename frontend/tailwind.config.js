/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F7F6F3",
        surface: "#FFFFFF",
        ink: "#1B1F23",
        muted: "#6B7280",
        border: "#E5E3DD",
        accent: "#2F5D50",
        highlight: "#C98A2C",
      },
      fontFamily: {
        display: ["Lora", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}