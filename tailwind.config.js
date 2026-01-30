/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#DE2589",
          800: "#115e59",
          900: "#134e4a",
        },
        pink: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#DE2589",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        blue: {
          50: "#e8edf5",
          100: "#c5d0e5",
          200: "#9fb2d3",
          300: "#7994c1",
          400: "#5a7db3",
          500: "#3b66a5",
          600: "#20407D",
          700: "#1a3566",
          800: "#142a50",
          900: "#0e1f3a",
        },
      },
      fontFamily: {
        sans: ["Museo Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
