/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a", // Deep Black / Charcoal
        primary: {
          DEFAULT: "#ff6900", // Xiaomi Orange
          cyan: "#06b6d4",    // Neon Cyan
        },
        accent: {
          green: "#10b981",   // Vitality Green
          red: "#ef4444",     // Alert Red
        },
        surface: {
          DEFAULT: "#1e293b",
          light: "#334155",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
