/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "serif"],
      },
      colors: {
        // Paleta verd més fosc i daurat
        primary: {
          50: "#f0fdf4", // Verd molt clar (mantenim per fons)
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#16a34a", // Verd principal MÉS FOSC
          600: "#15803d", // Verd fort MÉS FOSC
          700: "#166534",
          800: "#14532d",
          900: "#052e16",
        },
        accent: {
          50: "#fffbeb", // Daurat molt clar
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#d97706", // Daurat principal MÉS FOSC
          600: "#b45309", // Daurat fort MÉS FOSC
          700: "#92400e",
          800: "#78350f",
          900: "#451a03",
        },
      },
    },
  },
  plugins: [],
};
